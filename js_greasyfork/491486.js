// ==UserScript==
// @name         gleague
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Generate tables from the specified selector and insert them at the beginning of the document body.
// @author       Michal
// @match        https://gleague.nba.com/game/*
// @grant        none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/491486/gleague.user.js
// @updateURL https://update.greasyfork.org/scripts/491486/gleague.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let tablesInserted = false;

    function generateTablesFromSelector(selector) {
        const tables = document.querySelectorAll(selector);
        if (!tables || tables.length === 0) {
            console.error('Tables not found with the provided selector');
            return [];
        }

        const generatedTables = [];

        tables.forEach((table, tableIndex) => {
            const generatedTable = document.createElement('table');
            generatedTable.style.borderCollapse = 'collapse';
            generatedTable.style.width = '100%';
            generatedTable.style.marginBottom = '20px';

            const thead = document.createElement('thead');
            const tbody = document.createElement('tbody');

            const rows = table.querySelectorAll('tr');
            rows.forEach((row, rowIndex) => {
                const newRow = document.createElement('tr');

                const cells = row.querySelectorAll('td');
                cells.forEach((cell, cellIndex) => {
                    const newCell = document.createElement('td');
                    const cellID = `table_${tableIndex}_row_${rowIndex}_cell_${cellIndex}`;
                    newCell.setAttribute('id', cellID);
                    newCell.textContent = cell.textContent;
                    newCell.style.border = '1px solid #dddddd';
                    newCell.style.padding = '8px';
                    newRow.appendChild(newCell);
                });

                if (rowIndex === rows.length - 2) {
                    newRow.style.fontWeight = 'bold';
                }

                if (rowIndex === 0) {
                    newRow.style.backgroundColor = '#f2f2f2';
                }

                tbody.appendChild(newRow);
            });

            generatedTable.appendChild(thead);
            generatedTable.appendChild(tbody);
            generatedTables.push(generatedTable);
        });

        return generatedTables;
    }

    function observeForTables() {
        const observer = new MutationObserver(mutationsList => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList' && !tablesInserted) {
                    const tables = generateTablesFromSelector('.BoxScoreTable_table__yDPsz');
                    if (tables.length > 0) {
                        const firstWrapperDiv = document.createElement('div');
                        const secondWrapperDiv = document.createElement('div');

                        tables.forEach((table, index) => {
                            const wrapperDiv = index === 0 ? secondWrapperDiv : firstWrapperDiv;
                            wrapperDiv.style.overflowX = 'auto';
                            wrapperDiv.style.marginBottom = '20px';
                            wrapperDiv.appendChild(table);
                        });

                        const separator = document.createElement('hr');
                        separator.style.border = 'none';
                        separator.style.height = '2px';
                        separator.style.backgroundColor = '#333';

                        document.body.insertBefore(firstWrapperDiv, document.body.firstChild);
                        document.body.insertBefore(separator, document.body.firstChild);
                        document.body.insertBefore(secondWrapperDiv, document.body.firstChild);

                        tablesInserted = true;
                        observer.disconnect();
                    } else {
                        console.error('Failed to generate tables.');
                    }
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    observeForTables();
})();
