// ==UserScript==
// @name         LNB Stylish Team Stats Live & Postgame
// @namespace    https://lnb.fr/
// @version      3.2
// @description  Stylová tabulka týmových statistik (live i po zápase) s ID pro každou statistiku.
// @match        https://www.lnb.fr/pro-b/game-center-resume/*
// @match        https://www.lnb.fr/elite/game-center-resume/*
// @match        https://www.lnb.fr/espoirs-elite/game-center-resume/*
// @grant        none
// @license      MIT
// @author       Michal
// @downloadURL https://update.greasyfork.org/scripts/533026/LNB%20Stylish%20Team%20Stats%20Live%20%20Postgame.user.js
// @updateURL https://update.greasyfork.org/scripts/533026/LNB%20Stylish%20Team%20Stats%20Live%20%20Postgame.meta.js
// ==/UserScript==

(function () {
    'use strict';

    setTimeout(() => {
        const oldContainer = document.getElementById('lnb-total-table-container');
        if (oldContainer) oldContainer.remove();

        const totals = getTeamTotals();
        if (totals && totals.home && totals.away) {
            renderStyledTotalTables(totals);
        } else {
            showUnavailableMessage();
        }
    }, 3000);

    function getTeamTotals() {
        const liveTables = document.querySelectorAll('.box-score .sw-grid table');
        const postgameTables = document.querySelectorAll('#boxscore-game .boxscore-tab');

        let tables;
        if (liveTables.length >= 2) {
            tables = liveTables;
        } else if (postgameTables.length >= 2) {
            tables = postgameTables;
        } else {
            return null;
        }

        const result = {};

        ['home', 'away'].forEach((teamType, i) => {
            const table = tables[i];
            let headers = [];
            let totalRow = null;

            if (table.classList.contains('boxscore-tab')) {
                headers = Array.from(table.querySelectorAll('thead th')).slice(1).map(th => th.innerText.trim());
                totalRow = table.querySelector('tbody tr.total-row');
            } else {
                headers = Array.from(table.querySelectorAll('thead th')).slice(2).map(th => th.innerText.trim());
                totalRow = table.querySelector('tbody tr.grid-custom-row-total');
            }

            if (!totalRow) return;

            const cells = Array.from(totalRow.querySelectorAll('td, th'))
                .slice(1)
                .map(td => td.innerText.trim());

            const stats = {};
            headers.forEach((header, index) => {
                stats[header] = cells[index] || '';
            });

            result[teamType] = stats;
        });

        return result;
    }

    function renderStyledTotalTables(totals) {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexWrap = 'wrap';
        container.style.gap = '40px';
        container.style.margin = '30px auto';
        container.style.fontFamily = 'Segoe UI, sans-serif';
        container.style.justifyContent = 'center';
        container.id = 'lnb-total-table-container';
        document.body.appendChild(container);

        const style = document.createElement('style');
        style.textContent = `
            .custom-stats-table {
                width: 100%;
                max-width: 420px;
                border-collapse: separate;
                border-spacing: 0;
                overflow: hidden;
                border-radius: 14px;
                background-color: #1e1e2f;
                color: #f4f4f4;
                font-family: 'Segoe UI', sans-serif;
                box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
            }
            .custom-stats-table caption {
                text-align: left;
                font-size: 1.4em;
                font-weight: bold;
                padding: 16px 20px;
                background: linear-gradient(90deg, #007ACC, #00BFFF);
                color: white;
                letter-spacing: 0.5px;
            }
            .custom-stats-table tr:nth-child(even) {
                background-color: #2a2a3d;
            }
            .custom-stats-table tr:hover {
                background-color: #33334a;
            }
            .custom-stats-table td {
                padding: 12px 16px;
                font-size: 0.95em;
                border-bottom: 1px solid #3a3a5c;
            }
            .custom-stats-table td.label {
                font-weight: 600;
                color: #ddddff;
                text-align: left;
                width: 60%;
            }
            .custom-stats-table td.value {
                text-align: right;
                font-weight: bold;
                width: 40%;
            }
        `;
        document.head.appendChild(style);

        ['home', 'away'].forEach(teamType => {
            const stats = totals[teamType];
            const statsTable = document.createElement('table');
            statsTable.className = 'custom-stats-table';

            const caption = document.createElement('caption');
            caption.textContent = teamType === 'home' ? '🏠 Domácí tým' : '🚗 Hostující tým';
            statsTable.appendChild(caption);

            for (const [label, value] of Object.entries(stats)) {
                const row = document.createElement('tr');

                const labelCell = document.createElement('td');
                labelCell.className = 'label';
                labelCell.textContent = label;

                const valueCell = document.createElement('td');
                valueCell.className = 'value';
                valueCell.textContent = value;
                valueCell.id = `${teamType}-${label.replace(/\s+/g, '_').replace(/[^\w\-]/g, '')}`;

                row.appendChild(labelCell);
                row.appendChild(valueCell);
                statsTable.appendChild(row);
            }

            container.appendChild(statsTable);
        });
    }

    function showUnavailableMessage() {
        const messageBox = document.createElement('div');
        messageBox.style.maxWidth = '500px';
        messageBox.style.margin = '40px auto';
        messageBox.style.padding = '24px 32px';
        messageBox.style.backgroundColor = '#1e1e2f';
        messageBox.style.color = '#ffcccc';
        messageBox.style.fontSize = '1.1em';
        messageBox.style.fontFamily = 'Segoe UI, sans-serif';
        messageBox.style.textAlign = 'center';
        messageBox.style.borderRadius = '12px';
        messageBox.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        messageBox.textContent = '📭 Statistiky momentálně nejsou dostupné. Zkuste to prosím později.';
        document.body.appendChild(messageBox);
    }
})();


