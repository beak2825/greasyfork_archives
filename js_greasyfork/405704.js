// ==UserScript==
// @name         Ethichub - Descargar movimientos
// @namespace    http://tampermonkey.net/
// @version      0.3.2
// @description  Descargar transacciones de Ethichub como un fichero CSV
// @author       Alberizo
// @match        https://app.ethichub.com/profile/transaction-history*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405704/Ethichub%20-%20Descargar%20movimientos.user.js
// @updateURL https://update.greasyfork.org/scripts/405704/Ethichub%20-%20Descargar%20movimientos.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $downloadlabel;

    let csv_keys = ['id_proyecto', 'fecha_inversion', 'nombre_proyecto', 'inversion_dai', 'inversion_euros', 'dias_para_pago',
                    'proyecto_dai_cantidad', 'proyecto_fecha_pago', 'proyecto_estado', 'proyecto_objetivo', 'proyecto_dias_financiacion', 'smart_contract'];
    let csv_values = [];
    let csv_string = '';

    let access_token = JSON.parse(localStorage.getItem('eh-state')).auth.token;

    function add_download_button(){
        var $title = $('h1.main-title');
        $title.append('<div id="downloadcontainer" style="font-size:13px;float:right;margin-top:10px"><span class="info" style="font-weight:normal"></span> <button id="downloadbutton" style="cursor:pointer;margin-left:10px">💾 Descargar</button>')
        $title.find('#downloadbutton').click(function(){
            download_ethichub_movements(1);
        });
        $downloadlabel = $title.find('.info');
    }

    function label_descarga(text){
        $downloadlabel.text(text);
    }

    function download_csv(filename, url){
        var req = new XMLHttpRequest();
        req.open('GET', url, true);
        req.responseType = 'blob';
        req.onreadystatechange = function(){
            if (req.readyState === 4 && req.status === 200){
                if (typeof window.chrome !== 'undefined'){
                    // Chrome version
                    var link = document.createElement('a');
                    link.href = window.URL.createObjectURL(req.response);
                    link.download = filename;
                    link.click();
                } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
                    // IE version
                    var blob = new Blob([req.response], {type: 'application/csv'});
                    window.navigator.msSaveBlob(blob, filename);
                } else {
                    // Firefox version
                    var file = new File([req.response], filename, { type: 'application/force-download' });
                    window.open(URL.createObjectURL(file));
                }
            }
        };
        req.send();
    }

    function download_ethichub_info_projects(index){
        $.get('https://api.app.ethichub.com/api/v2/projects/' + csv_values[index][0], function(data){
            label_descarga('Descargando información proyectos: ' + parseInt(((index+1) * 100) / csv_values.length) + '%');

            let proyect_payment_date = new Date(data.funding_end);
            proyect_payment_date.setDate(proyect_payment_date.getDate() + data.lending_days);

            let days_to_pay = '-';
            if(data.status == 3){
                days_to_pay = Math.round((proyect_payment_date - new Date().getTime()) / (1000*60*60*24));
            }

            proyect_payment_date = proyect_payment_date.getFullYear() + '-' + parseInt(proyect_payment_date.getMonth() + 1) + '-' + proyect_payment_date.getDate();

            csv_values[index].push(days_to_pay);
            csv_values[index].push(parseFloat(data.creation_total_lending_amount).toFixed(2));
            csv_values[index].push(proyect_payment_date);
            csv_values[index].push(data.status_text);
            csv_values[index].push('"'+data.objective+'"');
            csv_values[index].push(data.lending_days);
            csv_values[index].push(data.smart_contract_address);


            if(index == csv_values.length-1){
                 predownload_csv();
            }else{
                index++;
                download_ethichub_info_projects(index);
            }
        });

    }

    function predownload_csv(){
        label_descarga('Descargando fichero CSV');
        csv_string = csv_keys.join(',') + '\r\n' + csv_values.join('\r\n');

        let date = new Date();
        date = date.getFullYear() + '-' + parseInt(date.getMonth() + 1) + '-' + date.getDate();

        download_csv('Ethichub transacciones ' + date + '.csv', 'data:application/csv;charset=UTF-8,' + encodeURI(csv_string));
        label_descarga('Descarga completa');
    }

    function download_ethichub_movements(page){
        if(access_token){
            label_descarga('Descargando página: ' + page);

            $.ajax({
                url:'https://api.app.ethichub.com/api/v2/transaction-history/investments/',
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                data:{
                    page: page

                },
                complete: function(data){
                    if(data.responseJSON.count){
                        data.responseJSON.results.forEach(function(investment){
                            if(investment.blockchain_investment.status == 'SUCCESS'){
                                let investment_date = new Date(investment.blockchain_investment.tx_timestamp);
                                investment_date = investment_date.getFullYear() + '-' + parseInt(investment_date.getMonth() + 1) + '-' + investment_date.getDate();

                                csv_values.push([
                                    investment.project_id,
                                    investment_date,
                                    investment.community_name,
                                    (investment.blockchain_investment.amount > 0) ? parseFloat(investment.blockchain_investment.amount).toFixed(6) : '',
                                    (investment.card_investment.amount > 0) ? parseFloat(investment.card_investment.amount).toFixed(6) : ''
                                ]);
                            }
                        });

                        page++
                        download_ethichub_movements(page);
                    }else{
                        download_ethichub_info_projects(0);
                    }
                }
            });
        }else{
            label_descarga('Error: No se han encontrado el token de usuario');
        }
    }


    setTimeout(add_download_button, 1500);

})();