import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {AuthHttp} from 'angular2-jwt';
import {CombustivelFiltro} from './combustivelFiltro';

@Injectable()
export class CombustivelService {

    apiUrl: string;

    constructor(private http: AuthHttp) {
        this.apiUrl = `${environment.apiUrl}/combustivel`;
    }

    /**
     * Lista todos registro de acordo com os filtros passados por parametro
     */
    findAll(grid: any, filtro: CombustivelFiltro): Promise<any> {
        /*
           in a real application, make a remote request to load data using state metadata from event
           event.first = First row offset
           event.rows = Number of rows per page
           event.sortField = Field name to sort with
           event.sortOrder = Sort order as number, 1 for asc and -1 for dec
           filters: FilterMetadata object having field as key and filter value, filter matchMode as value
        */
        const config = {
            params: {
                'size': grid.rows,
                'page': grid.first / grid.rows,
                'ordemClassificacao': grid.sortOrder > 0 ? 'ASC' : 'DESC',
                'campoOrdenacao': grid.sortField
            }
        };
        if (grid.globalFilter && grid.globalFilter.length > 0) {
            config.params['filtroGlobal'] = grid.globalFilter;
        }
        if (filtro) {
            if (filtro.nome && filtro.nome.length > 0) {
                config.params['nome'] = filtro.nome;
            }
        }

        return this.http.get(`${this.apiUrl}`, config)
            .toPromise()
            .then(response => {
                return response.json();
            });
    }

    findAllCmb(filtro: string): Promise<any> {
        const config = {
            params: {
                'size': environment.comboBox.linhas,
                'page': 0,
                'ordemClassificacao': 'ASC',
                'campoOrdenacao': 'nome'
            }
        };

        config.params['nome'] = filtro && filtro.trim().length > 0 ? filtro.trim() : '';
        return this.http.get(`${this.apiUrl}/cmb`, config).toPromise().then(response => {
            return response.json();
        });
    }


    /**
     * Busca por um registro especifico de acordo com a Key passada por paramentro
     */
    findOne(key): Promise<any> {
        return this.http.get(`${this.apiUrl}/${key}`)
            .toPromise()
            .then(response => {
                return response.json();
            });
    }

    /**
     * Exclui um registro de acordo com a Key passafa por parametro
     */
    delete(key: String): Promise<any> {
        return this.http.delete(`${this.apiUrl}/${key}`)
            .toPromise()
            .then(() => null);
    }

    /**
     * Salva um registro
     */
    save(obj: any): Promise<any> {
        const clone = JSON.parse(JSON.stringify(obj));
        delete clone['key'];
        delete clone['controle'];

        return this.http.post(this.apiUrl,
            JSON.stringify(clone))
            .toPromise()
            .then(response => {
                return response.json();
            });
    }

    /**
     * Atualiza o registro
     */
    update(obj: any): Promise<any> {
        const key = obj.key;

        const clone = JSON.parse(JSON.stringify(obj));
        delete clone['key'];
        delete clone['controle'];

        return this.http.put(`${this.apiUrl}/${key}`,
            JSON.stringify(clone))
            .toPromise()
            .then(response => {
                return response.json();
            });
    }

}
