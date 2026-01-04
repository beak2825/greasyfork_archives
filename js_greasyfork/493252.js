// ==UserScript==
// @name         IIHF přenos na hlavní stránku
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Generuje tabulku ke vhazováním
// @author       Michal
// @match        https://stats.iihf.com/Hydra/*/gameaction_*.html
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493252/IIHF%20p%C5%99enos%20na%20hlavn%C3%AD%20str%C3%A1nku.user.js
// @updateURL https://update.greasyfork.org/scripts/493252/IIHF%20p%C5%99enos%20na%20hlavn%C3%AD%20str%C3%A1nku.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
        .custom-table {
            font-family: 'Roboto', sans-serif;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 12pt;
            border-collapse: collapse;
            background-color: #ffffff;
            border: 2px solid #000000;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .custom-table th,
        .custom-table td {
            padding: 12px 16px;
            border-bottom: 1px solid #000000;
            text-align: center;
            color: #000000;
        }
        .custom-table th:first-child,
        .custom-table td:first-child {
            border-right: 1px solid #000000;
        }
    `;
    document.head.appendChild(style);

    function generateTable(homeFaceOffs, awayFaceOffs) {
        const table = document.createElement('table');
        table.classList.add('custom-table');
        table.id = 'faceOffTable';
        const headerRow = table.insertRow();
        const homeCell = headerRow.insertCell();
        const awayCell = headerRow.insertCell();
        homeCell.textContent = 'Home Faceoffs';
        awayCell.textContent = 'Away Faceoffs';

        const dataRow = table.insertRow();
        const homeDataCell = dataRow.insertCell();
        const awayDataCell = dataRow.insertCell();
        homeDataCell.textContent = homeFaceOffs;
        awayDataCell.textContent = awayFaceOffs;

        const oldTable = document.querySelector('.custom-table');
        if (oldTable) {
            oldTable.remove();
        }

        document.body.appendChild(table);
    }

    function fetchAndGenerateTable(url) {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                try {
                    const matchData = JSON.parse(response.responseText);

                    let homeFaceOffs = 0;
                    let awayFaceOffs = 0;

                    if (matchData.Periods && matchData.Periods.length > 0 && matchData.Periods[3] && matchData.Periods[3].Statistics) {
                        homeFaceOffs = matchData.Periods[3].Statistics.FOF_H || 0;
                        awayFaceOffs = matchData.Periods[3].Statistics.FOF_A || 0;
                    }

                    generateTable(homeFaceOffs, awayFaceOffs);
                } catch (error) {
                    console.error('Error parsing or accessing data:', error);
                    generateTable(0, 0);
                }
            },
            onerror: function(error) {
                console.error('Error fetching data:', error);
                generateTable(0, 0);
            }
        });
    }

    function checkAndUpdate() {
        const matchId = window.location.pathname.match(/gameaction_(\d+)\.html/)[1];
        const dataUrl = `https://realtime.iihf.com/gamestate/GetLatestState/${matchId}`;
        fetchAndGenerateTable(dataUrl);
    }

    checkAndUpdate();

    const interval = setInterval(checkAndUpdate, 10000);

})();