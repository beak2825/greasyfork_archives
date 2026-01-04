// ==UserScript==
// @name         e-Nabız Hastalıklarım Tüm Sayfalar Tek Liste (Otomatik Tetikleme)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Tablodaki değişiklikleri algılayıp tek tabloya çevirir
// @author       Sen
// @match        https://enabiz.gov.tr/Home/Hastaliklarim*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/541199/e-Nab%C4%B1z%20Hastal%C4%B1klar%C4%B1m%20T%C3%BCm%20Sayfalar%20Tek%20Liste%20%28Otomatik%20Tetikleme%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541199/e-Nab%C4%B1z%20Hastal%C4%B1klar%C4%B1m%20T%C3%BCm%20Sayfalar%20Tek%20Liste%20%28Otomatik%20Tetikleme%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const $ = window.jQuery;
    let alreadyRun = false;

    async function runScript() {
        alreadyRun = true;
        const table = $('#tblHastaliklarim').DataTable();
        const pageCount = table.page.info().pages;
        let allData = [];

        for (let i = 0; i < pageCount; i++) {
            table.page(i).draw(false);
            await new Promise(r => setTimeout(r, 600));
            const data = table.rows({ page: 'current' }).data().toArray();
            allData = allData.concat(data);
        }

        const container = $('#tblHastaliklarim').parent();

        $('.dataTables_paginate').hide();
        $('.dataTables_info').hide();
        $('.dataTables_length').hide();
        $('.dataTables_filter').hide();

        if ($.fn.DataTable.isDataTable('#tblHastaliklarim')) {
            table.destroy();
        }

        let html = '<table id="tblHastaliklarim" class="table table-striped table-bordered" style="width:100%">';
        html += '<thead><tr><th>Tarih</th><th>Tanı</th><th>Klinik</th><th>Hekim</th></tr></thead><tbody>';
        allData.forEach(row => {
            html += `<tr><td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td><td>${row[3]}</td></tr>`;
        });
        html += '</tbody></table>';

        container.html(html);
    }

    function observeTable() {
        const targetNode = document.querySelector('#tblHastaliklarim');
        if (!targetNode || alreadyRun) return;

        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    if (!alreadyRun) {
                        runScript();
                    }
                }
            }
        });

        observer.observe(targetNode, {
            childList: true,
            subtree: true
        });

        console.log('Tablo gözlemleniyor...');
    }

    function waitForTableAndObserve() {
        const checkExist = setInterval(() => {
            if (
                $('#tblHastaliklarim').length &&
                $.fn.DataTable &&
                $.fn.DataTable.isDataTable('#tblHastaliklarim')
            ) {
                clearInterval(checkExist);
                observeTable();
            }
        }, 500);
    }

    waitForTableAndObserve();
})();
