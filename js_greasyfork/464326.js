// ==UserScript==
// @name         Dane_do_grantu
// @namespace    PrzystanMedyczna
// @version      1.1
// @description  Pobierz dane do grantu
// @homepageURL  https://greasyfork.org/en/scripts/464326-dane-do-grantu
// @author       Jedrzej Kubala
// @match        https://serum.com.pl/dpls/rm/ex.act
// @icon         https://serum.com.pl/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464326/Dane_do_grantu.user.js
// @updateURL https://update.greasyfork.org/scripts/464326/Dane_do_grantu.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const widgetHtml = '<style>#grant_puller{position:fixed;z-index:99999;top:150px;right:1.6%;background-color:#61ce70;padding:10px 15px;border-radius:4px;border:none;box-shadow:0 2px 25px rgba(97,206,112,.5);font-size:14px}.grant_puller_prompt{text-align:center;color:#224827;margin-bottom:7px}.grant_puller_input{background-color:#a7d8ae;border-radius:6px;border-width:0;border-style:solid;padding:5px 10px;margin:0 3px;box-shadow:inset 0 0 5px #61ce70;color:#224827}.grant_puller_input:focus{outline:#55765a solid 2px}.grant_puller_short{width:35px}.grant_puller_long{width:50px}.grant_puller_btn_box{margin-top:10px;display:flex;justify-content:center}#grant_puller_button{display:inline-block;text-decoration:none;position:center;font-size:1em;padding:1em 2em;margin-left:15px;-webkit-appearance:none;appearance:none;background-color:#4ca756;color:#fff;border-radius:4px;border:none;cursor:pointer;position:relative;transition:transform .1s ease-in,box-shadow .25s ease-in;box-shadow:0 2px 15px rgba(68,160,74,.5)}#grant_puller_button:active{transform:scale(.9);background-color:#50af5b;box-shadow:0 2px 15px rgba(68,160,74,.2)}</style><div id="grant_puller"><div class="grant_puller_prompt"><span>Pobierz dane do grantu</span></div><div class="grant_puller_prompt"><span>Od</span><input class="grant_puller_input grant_puller_short" id="grant_puller-from-day"> <input class="grant_puller_input grant_puller_short" id="grant_puller-from-month"> <input class="grant_puller_input grant_puller_long" id="grant_puller-from-year"></div><div class="grant_puller_prompt"><span>Do</span><input class="grant_puller_input grant_puller_short" id="grant_puller-to-day"> <input class="grant_puller_input grant_puller_short" id="grant_puller-to-month"> <input class="grant_puller_input grant_puller_long" id="grant_puller-to-year"></div><div class="grant_puller_btn_box"><a id="grant_puller_button" href="#">Pobierz!</a></div></div>';

    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    function waitForTextChange(selector, originalValue) {
        return new Promise(resolve => {
            if (
                document.querySelector(selector)
                && document.querySelector(selector).textContent !== originalValue
            ) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (
                    document.querySelector(selector)
                    && document.querySelector(selector).textContent !== originalValue
                ) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });

    }

    function convertToCSV(objArray) {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = '';

        for (var i = 0; i < array.length; i++) {
            var line = '';
            for (var index in array[i]) {
                if (line != '') line += ','

                line += array[i][index];
            }

            str += line + '\r\n';
        }

        return str;
    }

    function exportCSVFile(headers, items, fileTitle) {
        if (headers) {
            items.unshift(headers);
        }

        // Convert Object to JSON
        var jsonObject = JSON.stringify(items);

        var csv = convertToCSV(jsonObject);

        var exportedFilenmae = fileTitle + '.csv' || 'export.csv';

        var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, exportedFilenmae);
        } else {
            var link = document.createElement("a");
            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", exportedFilenmae);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }

    function formatItems(itemsNotFormatted) {
        var itemsFormatted = [];
        itemsNotFormatted.forEach((item) => {
            const formattedItem = {};
            for (const [key, value] of Object.entries(item)) {
                formattedItem[key] = '"' + value.replace(/"/g, '\'') + '"'
            }
            itemsFormatted.push(formattedItem);
        })
        return itemsFormatted
    }

    const HEADERS = {
        duty: '"nr dyżuru"',
        date: '"Data"',
        place: '"Miejsce świadczenia dyżuru"',
        patient: '"Kod - inicjały osoby korzystającej"',
        customField1: '"Udzielono pomocy lekarskiej"',
        customField2: '"Udzielono pomocy przedmedycznej"',
        team: '"Zespół"'
    };

    function generateCsvName() {
        return 'Grant_tabela_'
            + `${$('grant_puller-from-year').value}-${$('grant_puller-from-month').value}-${$('grant_puller-from-day').value}_`
            + `${$('grant_puller-to-year').value}-${$('grant_puller-to-month').value}-${$('grant_puller-to-day').value}`
    }

    function exportVisitsToCsv(data) {
        exportCSVFile(HEADERS, formatItems(data), generateCsvName());
    };

    async function filterVisits() {
        $("wiz_personel_wyczysc").click();
        $("wiz_data_od_d").value = $('grant_puller-from-day').value;
        $("wiz_data_od_m").value = $('grant_puller-from-month').value;
        $("wiz_data_od_r").value = $('grant_puller-from-year').value;
        $("wiz_data_do_d").value = $('grant_puller-to-day').value;
        $("wiz_data_do_m").value = $('grant_puller-to-month').value;
        $("wiz_data_do_r").value = $('grant_puller-to-year').value;
        wiz_f_zastosuj_filtr(1);
        await waitForElm('#lista .tr_nieparzysty td');
    }

    function changeDateOrder(dateString) {
        const matches = dateString.match(/\d+/g);
        return `${matches[2]}-${matches[1]}=${matches[0]}`

    }

    function normaliseData(date, patient, birthdate) {
        return {
            duty: '',
            date: new Date(changeDateOrder(date)).toLocaleDateString('pl-PL',
                { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
            ),
            place: '',
            patient: patient.split('\xa0')[0].split(' ').map(word => word.charAt(0)).join('')
                + ' '
                + (birthdate ? changeDateOrder(birthdate).replace('-', '.') : ''),
            customField1: "1",
            customField2: "1",
            team: ""
        }
    }

    function scrapeVisitsFromPage() {
        const data = [];
        const rows = $("lista").querySelectorAll('.tr_parzysty,.tr_nieparzysty,.tr_over');
        const header = $("lista").querySelector('.tr_naglowek')
        const dateCellIndex = header.childElements().findIndex(e => e.textContent === 'Data od');
        const patientCellIndex = header.childElements().findIndex(e => e.textContent === 'Pacjent');
        const birthdateCellIndex = header.childElements().findIndex(e => e.textContent === 'Data urodzenia');
        for (let i = 0; i < rows.length; i++) {
            data.push(normaliseData(
                rows[i].childElements()[dateCellIndex].textContent,
                rows[i].childElements()[patientCellIndex].textContent,
                birthdateCellIndex >= 0 ? rows[i].childElements()[birthdateCellIndex].textContent : undefined,
            ))
        }
        return data;
    }

    function getNumberOfPages() {
        const paginationBlock = document.querySelector('#table_div_stronicowanie_wizyty tbody tr');
        return paginationBlock.childElementCount
    }

    async function nextPage(currentPageNumber) {
        const currentLP = document.querySelector('#lista .tr_nieparzysty td').textContent;
        wiz_f_zastosuj_filtr(currentPageNumber + 1);
        await waitForTextChange('#lista .tr_nieparzysty td', currentLP);
    }

    async function pullData() {
        await filterVisits();
        const data = [];
        const pages = getNumberOfPages()
        for (let i = 0; i < pages; i++) {
            data.push(...scrapeVisitsFromPage());
            if (i + 1 < pages) await nextPage(i + 1);
        }
        exportVisitsToCsv(data);
    }

    function injectWidget() {
        const body = document.getElementsByTagName('body')[0];
        const header = document.getElementsByClassName('bigTab')[0]
        if (header.textContent === 'Wizyty (EDM)') {
            body.insertAdjacentHTML('beforeend', widgetHtml);
        }

        $('grant_puller-from-day').value = '01';
        $('grant_puller-to-day').value = ('0' + new Date().getDate()).slice(-2);
        $("grant_puller-from-month").value = $("grant_puller-to-month").value = ('0' + (new Date().getMonth() + 1)).slice(-2);
        $("grant_puller-from-year").value = $("grant_puller-to-year").value = new Date().getFullYear();
        $("grant_puller_button").addEventListener(
            'click', () => pullData().then(() => console.log('data scraped'))
            , false
        );
    }

    injectWidget();
})();
