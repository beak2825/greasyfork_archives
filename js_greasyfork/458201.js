// ==UserScript==
// @name         HockeyBilling
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Convierte la página de vales en mas agradable e intuitiva
// @author       SStvAA
// @match        https://data.instatfootball.tv/views_custom/cabinet/web/calculation2
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instatfootball.tv
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458201/HockeyBilling.user.js
// @updateURL https://update.greasyfork.org/scripts/458201/HockeyBilling.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const billPrice = 15.385;

    const setTableStyle = function () {
        const table = document.querySelector('.table');
        table.style = 'margin: auto; width: 50% !important';

        // clear header
        for (const header of table.querySelectorAll('.header-row')) {
            for (const th of header.querySelectorAll('th')) {
                if (th.innerText.toLowerCase().includes('weekly') === false) {
                    th.remove();
                } else {
                    th.innerHTML = `Semana del ${(th.innerHTML.split('&nbsp;')[1].split('-')[0]).replace('.', ' / ')} al ${(th.innerHTML.split('&nbsp;')[1].split('-')[1]).replace('.', ' / ')}`;
                    break;
                }
            }
        }

        // clear and format plan / fact from header
        for (const tr of table.querySelectorAll('.grey-header-row')) {
            // the week is of 7 days, then will remove 7 elements
            let counter = 0;
            for (const th of tr.querySelectorAll('th')) {
                if (counter < 7) {
                    th.remove();
                    counter++;
                }
            }
        }

        // clear body plan
        for (const tr of table.querySelectorAll('.person-row')) {
            // the week is of 7 days, then will remove 7 elements
            let counter = 0;
            // check if have all the 15 elements then rest the diference to counter
            if(tr.querySelectorAll('td').length !== 15){
                counter = 15 - tr.querySelectorAll('td').length;
            }
            for (const td of tr.querySelectorAll('td')) {
                if (counter < 7) {
                    td.remove();
                    counter++;
                }
            }
        }

    }

    const formatData = function () {
        const table = document.querySelector('.table');

        // change 'plan / fact' to 'Periodos'
        for (const tr of table.querySelectorAll('.grey-header-row')) {
            for(const th of tr.querySelectorAll('th')){
                if(th.innerText.toLowerCase().includes('plan')){
                    th.innerText = 'Periodos';
                }
            }
        }

        // change extra points to multas
        for (const tr of table.querySelectorAll('.grey-header-row')) {
            for(const th of tr.querySelectorAll('th')){
                if(th.innerText.toLowerCase().includes('extra points') === true){
                    th.innerText = 'Multas';
                    th.title = 'Las multas se calculan en vales'
                    break;
                }
            }
        }

        // change total by category to vales
        for (const tr of table.querySelectorAll('.grey-header-row')) {
            for(const th of tr.querySelectorAll('th')){
                if(th.innerText.toLowerCase().includes('total by category') === true){
                    th.innerText = 'Vales';
                    th.title = '2 periodos (acciones cortas + cambios) conforman 1 vale \n1 vale se paga a 15,385$';
                    break;
                }
            }
        }

        // remove category from header
        for (const tr of table.querySelectorAll('.grey-header-row')) {
            for(const th of tr.querySelectorAll('th')){
                if(th.innerText.toLowerCase().includes('category') === true && th.innerText.toLowerCase().includes('total by category') === false){
                    th.remove();
                }
            }
        }

        // remove bonus 20% from header
        for (const tr of table.querySelectorAll('.grey-header-row')) {
            for(const th of tr.querySelectorAll('th')){
                if(th.innerText.toLowerCase().includes('bonus 20%') === true){
                    th.remove();
                }
            }
        }

        // change total with bonus to vales (neto)
        for (const tr of table.querySelectorAll('.grey-header-row')) {
            for(const th of tr.querySelectorAll('th')){
                if(th.innerText.toLowerCase().includes('total with bonus') === true){
                    th.innerHTML = 'Vales <small>(neto)</small>';
                    break;
                }
            }
        }

        // remove currency from header
        for (const tr of table.querySelectorAll('.grey-header-row')) {
            for(const th of tr.querySelectorAll('th')){
                if(th.innerText.toLowerCase().includes('currency') === true){
                    th.remove();
                }
            }
        }

        // only apply when is available any data in row
        for (const tr of table.querySelectorAll('.person-row.bl')) {
            if(tr.querySelector('div[class="bw points"]')){

                {
                    // change 0 / 0 to only periods made 0
                    const td = tr.querySelector('.bl');
                    if (td) {
                        try {
                            td.innerText = td.innerText.slice(td.innerText.search('/') + 1).trim()
                        } catch {}
                    }
                }

                {
                    // remove category from body
                    tr.querySelectorAll('td')[1].remove();
                }

                {
                    // remove bonus 20% from body
                    tr.querySelectorAll('td')[2].remove();
                }

                {
                    // remove currency from body
                    tr.querySelectorAll('td')[5].remove();
                }

                {
                    // pass bill amount to usd amount
                    const td = tr.querySelectorAll('td')[2];
                    // td.querySelector('div').style = 'text-align: center;';
                    if(td.innerText !== ''){
                        td.querySelector('div').innerHTML = `${(parseFloat(td.innerText) * billPrice).toFixed(2)} USD <br> (${td.innerText})`;
                        td.title = 'Click para mas detalles';
                        td.style = 'color: red; font-weight: bold;';
                    }else{
                        td.querySelector('div').innerHTML = `0 USD`;
                        td.style = 'color: green; font-weight: normal;';
                    }
                }

                {
                    // add USD to total
                    const td = tr.querySelectorAll('td')[4];
                    td.innerHTML = `${td.innerText} USD`;
                }


            }

        }



    }

    const setTotalStyle = function () {
        const table = document.querySelector('.table');
        const tbody = Array.from(table.querySelectorAll('tbody')).at(-1);
        const tr = tbody.querySelector('tr[style="font-size: 12px; font-weight: bold"]');
        if(tr){

            {
                // remove colspan 7
                tr.querySelector('td[colspan="7"]').remove();
            }

            {
                // set colspan 5 to 3 and translate text
                const td = tr.querySelector('td[colspan="5"]');
                td.colSpan = '3';
                td.innerHTML = `PERIODOS TOTALES (${td.innerText.split(':')[1].replace('-', ' al ').replaceAll('.', ' / ')}):`;
            }

            {
                // add usd to total
                const td = tr.querySelectorAll('td')[2];
                td.innerText = `${td.innerText} USD`;
            }

            {
                // remove usd
                tr.querySelectorAll('td')[3].remove();
            }




        }

    }

    if (document.querySelector('img[src="/views_custom/cabinet/web/images/flags/united_states.png"]')) {
        console.log('HockeyBilling: started!');

        // apply styles to table
        setTableStyle();
        // format table data
        formatData();
        // format total table data
        setTotalStyle();
    }





})()