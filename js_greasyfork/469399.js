// ==UserScript==
// @name         MZ - Player Age Group Breakdown
// @namespace    douglaskampl
// @version      2.1
// @description  Displays players grouped by age in other teams' player pages
// @author       Douglas
// @match        https://www.managerzone.com/?p=players&tid=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=managerzone.com
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469399/MZ%20-%20Player%20Age%20Group%20Breakdown.user.js
// @updateURL https://update.greasyfork.org/scripts/469399/MZ%20-%20Player%20Age%20Group%20Breakdown.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const ageCountMap = new Map();

    document.querySelectorAll('#players_container .playerContainer').forEach(player => {
        let ageElement = player.querySelector('td');
        if (ageElement) {
            let age = parseInt(ageElement.textContent.replace(/\D/g, '').trim());
            if (ageCountMap.has(age)) {
                ageCountMap.set(age, ageCountMap.get(age) + 1);
            } else {
                ageCountMap.set(age, 1);
            }
        }
    });

    const playerFiltersElement = document.querySelector('#player_filters');
    if (!playerFiltersElement) return;

    const createTable = (title, entries) => {
        const table = document.createElement('table');
        table.id = 'ageTable';

        Object.assign(table.style, {
            borderCollapse: 'separate',
            borderSpacing: '0',
            color: 'white',
            width: '80px',
            fontSize: '11px',
            display: 'inline-block',
            verticalAlign: 'top',
            margin: '2px'
        });

        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');
        const headerRow = document.createElement('tr');

        headerRow.style.backgroundColor = '#000080';
        headerRow.style.color = '#FFFF00';

        const titleRow = document.createElement('tr');
        const titleCell = document.createElement('th');
        titleCell.colSpan = 2;
        titleCell.textContent = title;

        Object.assign(titleCell.style, {
            padding: '1px 4px',
            color: '#FFFF00',
            fontWeight: 'bold',
            border: '1px solid #1E90FF',
            textAlign: 'center',
            borderTop: '2px solid #00BFFF',
            borderBottom: '2px solid #0000FF',
            backgroundColor: '#000080'
        });

        titleRow.appendChild(titleCell);
        thead.appendChild(titleRow);

        ['Age', 'Count'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;

            Object.assign(th.style, {
                padding: '1px 4px',
                color: '#FFFF00',
                fontWeight: 'normal',
                border: '1px solid #1E90FF',
                textAlign: 'center',
                borderTop: '2px solid #00BFFF',
                borderBottom: '2px solid #0000FF'
            });

            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        entries.forEach(([age, count], index) => {
            const row = document.createElement('tr');
            row.style.backgroundColor = index % 2 ? '#000080' : '#FF1493';

            row.addEventListener('mouseover', e => {
                e.currentTarget.style.backgroundColor = '#00BFFF';
                e.currentTarget.style.color = 'black';
            });

            row.addEventListener('mouseout', e => {
                e.currentTarget.style.backgroundColor = index % 2 ? '#000080' : '#FF1493';
                e.currentTarget.style.color = 'white';
            });

            [age, count].forEach(text => {
                const td = document.createElement('td');
                td.textContent = text;

                Object.assign(td.style, {
                    padding: '1px 4px',
                    color: 'white',
                    fontWeight: 'normal',
                    border: '1px solid #1E90FF',
                    textAlign: 'center'
                });

                row.appendChild(td);
            });

            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        return table;
    };

    const sortedEntries = Array.from(ageCountMap.entries()).sort((a, b) => a[0] - b[0]);

    const u18 = sortedEntries.filter(([age]) => age >= 16 && age <= 18);
    const u21u23 = sortedEntries.filter(([age]) => age >= 19 && age <= 23);
    const senior = sortedEntries.filter(([age]) => age >= 24);

    playerFiltersElement.appendChild(createTable('U18', u18));
    playerFiltersElement.appendChild(createTable('U21/U23', u21u23));
    playerFiltersElement.appendChild(createTable('Senior', senior));
})();
