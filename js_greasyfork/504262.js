// ==UserScript==
// @name         WNBA Pokus s tabulkou
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Tabulka WNBA
// @author       Michal
// @match        https://www.wnba.com/game/*/boxscore
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504262/WNBA%20Pokus%20s%20tabulkou.user.js
// @updateURL https://update.greasyfork.org/scripts/504262/WNBA%20Pokus%20s%20tabulkou.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function generateCellID(tableIndex, rowIndex, colIndex) {
        return `table-${tableIndex}_row-${rowIndex}_col-${colIndex}`;
    }

    function extractTeamData(selector, index) {
        const tables = document.querySelectorAll(selector);
        console.log('Tables found:', tables.length);
        if (tables.length <= index) {
            console.error('Table not found for index:', index);
            return [];
        }

        const rows = tables[index].querySelectorAll('tr');
        const tableData = [];

        rows.forEach((row, rowIndex) => {
            const rowData = [];
            const cells = row.querySelectorAll('th, td');

            const rowText = row.innerText.toLowerCase();
            if (rowText.includes('summary')) {
                return;
            }

            cells.forEach((cell, colIndex) => {
                const cellID = generateCellID(index, rowIndex, colIndex);
                cell.setAttribute('data-id', cellID);
                rowData.push(cell.innerText.trim());
            });
            tableData.push(rowData);
        });

        return tableData;
    }

    function calculateTotals(tableData) {
        if (tableData.length === 0) return [];

        const headers = tableData[0];
        if (!headers || headers.length === 0) {
            console.error('No headers found in table data.');
            return [];
        }

        const totals = headers.map(() => "0-0");

        for (let i = 1; i < tableData.length; i++) {
            for (let j = 1; j < tableData[i].length; j++) {
                if (headers[j].includes('%')) {
                    continue;
                }

                const value = tableData[i][j];
                if (headers[j].includes('+/-')) {
                    totals[j] = (parseInt(totals[j]) || 0) + (parseInt(value) || 0);
                } else {
                    const [currentTotalPart1, currentTotalPart2] = totals[j].split('-').map(num => parseInt(num) || 0);

                    if (value.includes('-')) {
                        const [part1, part2] = value.split('-').map(num => parseInt(num) || 0);
                        totals[j] = `${currentTotalPart1 + part1}-${currentTotalPart2 + part2}`;
                    } else {
                        const part1 = parseInt(value) || 0;
                        totals[j] = `${currentTotalPart1 + part1}-${currentTotalPart2}`;
                    }
                }
            }
        }

        return ["Celkem", ...totals.map((total, index) => {
            if (typeof total === 'number') {
                return total.toString();
            } else if (total.includes('-')) {
                const [part1, part2] = total.split('-').map(num => parseInt(num) || 0);
                return part2 === 0 ? `${part1}` : total;
            }
            return total;
        }).slice(1)];
    }

    function calculate2PM2PA(tableData) {
        const headers = tableData[0];
        let fgmIndex = -1;
        let tpmIndex = -1;

        headers.forEach((header, index) => {
            if (header === 'FGM-A') fgmIndex = index;
            if (header === '3PM-A') tpmIndex = index;
        });

        if (fgmIndex === -1 || tpmIndex === -1) return;

        headers.push('2PM', '2PA');
        tableData.forEach((row, rowIndex) => {
            if (rowIndex === 0) return;

            const [fgm, fga] = row[fgmIndex].split('-').map(num => parseInt(num) || 0);
            const [tpm, tpa] = row[tpmIndex].split('-').map(num => parseInt(num) || 0);

            const twoPM = fgm - tpm;
            const twoPA = fga - tpa;

            row.push(twoPM.toString(), twoPA.toString());
        });
    }

    function createTable(tableData, title, tableIndex) {
        const tableContainer = document.createElement('div');
        tableContainer.style.marginTop = '20px';
        tableContainer.style.border = '1px solid #ddd';
        tableContainer.style.borderRadius = '5px';
        tableContainer.style.overflow = 'hidden';
        tableContainer.className = 'custom-stats-table';

        const tableTitle = document.createElement('h2');
        tableTitle.innerText = title;
        tableTitle.style.textAlign = 'center';
        tableTitle.style.backgroundColor = '#f4f4f4';
        tableTitle.style.padding = '10px';
        tableTitle.style.margin = '0';
        tableContainer.appendChild(tableTitle);

        const newTable = document.createElement('table');
        newTable.style.borderCollapse = 'collapse';
        newTable.style.width = '100%';
        newTable.style.tableLayout = 'fixed';
        newTable.style.backgroundColor = '#fff';

        tableData.forEach((rowData, rowIndex) => {
            const row = document.createElement('tr');
            row.style.backgroundColor = rowIndex % 2 === 0 ? '#f9f9f9' : '#fff';

            rowData.forEach((cellData, cellIndex) => {
                const cell = rowIndex === 0 ? document.createElement('th') : document.createElement('td');
                cell.innerText = cellData;
                cell.id = generateCellID(tableIndex, rowIndex, cellIndex);
                cell.style.border = '1px solid #ddd';
                cell.style.padding = '10px';
                cell.style.textAlign = 'left';
                cell.style.fontWeight = rowIndex === 0 ? 'bold' : 'normal';
                cell.style.verticalAlign = 'middle';
                row.appendChild(cell);
            });

            newTable.appendChild(row);
        });

        tableContainer.appendChild(newTable);
        document.body.appendChild(tableContainer);
    }

    function createTableWithTotals(selector, index, title) {
        const tableData = extractTeamData(selector, index);

        if (tableData.length === 0) {
            console.error('No data found for table index:', index);
            return;
        }

        const headers = tableData[0];
        const columnsToRemove = headers.map((header, index) => header.includes('%') ? index : -1).filter(index => index !== -1);

        tableData.forEach(row => {
            columnsToRemove.slice().reverse().forEach(colIndex => row.splice(colIndex, 1));
        });

        calculate2PM2PA(tableData);

        const totalsRow = calculateTotals(tableData);
        tableData.push(totalsRow);

        createTable(tableData, title, index);
    }

    function startAutoUpdate(interval = 3000, minuteInterval = 60000) {
        setInterval(() => {
            const existingTables = document.querySelectorAll('.custom-stats-table');
            existingTables.forEach(table => table.remove());

            createTableWithTotals('.BoxScore_BoxScore__table__62P7f', 0, 'Domácí tým');
            createTableWithTotals('.BoxScore_BoxScore__table__62P7f', 1, 'Hostující tým');
        }, interval);

        setInterval(() => {
            const tables = document.querySelectorAll('.custom-stats-table');
            tables.forEach(table => {
                const index = Array.from(tables).indexOf(table);
                createTableWithTotals('.BoxScore_BoxScore__table__62P7f', index, table.querySelector('h2').innerText);
            });
        }, minuteInterval);
    }

    startAutoUpdate();

})();