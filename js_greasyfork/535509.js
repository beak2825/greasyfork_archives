// ==UserScript==
// @name         Exportar Tablas HTML a Excel (con ExcelJS + Observer)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Agrega un botón a cada tabla HTML para exportarla a Excel usando ExcelJS
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535509/Exportar%20Tablas%20HTML%20a%20Excel%20%28con%20ExcelJS%20%2B%20Observer%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535509/Exportar%20Tablas%20HTML%20a%20Excel%20%28con%20ExcelJS%20%2B%20Observer%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function injectScript(fn) {
        const script = document.createElement('script');
        script.textContent = `(${fn})();`;
        document.body.appendChild(script);
    }

    function mainScript() {
        const exceljsSrc = 'https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.3.0/exceljs.min.js';

        function loadExcelJS() {
            return new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = exceljsSrc;
                script.onload = resolve;
                document.head.appendChild(script);
            });
        }

        function observeDOMForTables() {
            const observer = new MutationObserver(() => {
                const tables = document.querySelectorAll('table:not([data-excel-ready])');

                if (tables.length > 0) {
                    console.clear();
                    console.log('tables encontradas:', tables);
                }

                tables.forEach((table, index) => {
                    table.setAttribute('data-excel-ready', 'true');
                    addExportButton(table, index + 1);
                });
            });

            observer.observe(document.body, { childList: true, subtree: true });
        }

        function addExportButton(table, index) {
            const btn = document.createElement('button');
            btn.textContent = '📥 Excel';
            btn.style.position = 'absolute';
            btn.style.fontSize = '12px';
            btn.style.padding = '4px';
            btn.style.background = '#4CAF50';
            btn.style.color = '#fff';
            btn.style.border = 'none';
            btn.style.cursor = 'pointer';
            btn.style.zIndex = 9999;

            const rect = table.getBoundingClientRect();
            btn.style.top = `${window.scrollY + rect.top + 5}px`;
            btn.style.left = `${window.scrollX + rect.right - 80}px`;

            document.body.appendChild(btn);

            btn.addEventListener('click', () => exportTableToExcel(table, index));
        }

        function exportTableToExcel(table, tableIndex) {
            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet(`Tabla ${tableIndex}`);
            const cellMap = {};

            const rows = Array.from(table.rows);
            for (let rowIndex = 0, excelRowIndex = 1; rowIndex < rows.length; rowIndex++, excelRowIndex++) {
                const row = rows[rowIndex];
                const cells = Array.from(row.cells);
                let colIndex = 1;

                cells.forEach(cell => {
                    while (cellMap[`${excelRowIndex}:${colIndex}`]) colIndex++;

                    const excelCell = sheet.getCell(excelRowIndex, colIndex);
                    excelCell.value = cell.innerText.trim();

                    const colspan = parseInt(cell.getAttribute('colspan') || '1', 10);
                    const rowspan = parseInt(cell.getAttribute('rowspan') || '1', 10);

                    if (colspan > 1 || rowspan > 1) {
                        const endCol = colIndex + colspan - 1;
                        const endRow = excelRowIndex + rowspan - 1;
                        sheet.mergeCells(excelRowIndex, colIndex, endRow, endCol);

                        for (let r = excelRowIndex; r <= endRow; r++) {
                            for (let c = colIndex; c <= endCol; c++) {
                                cellMap[`${r}:${c}`] = true;
                            }
                        }
                    } else {
                        cellMap[`${excelRowIndex}:${colIndex}`] = true;
                    }

                    colIndex += colspan;
                });
            }

            workbook.xlsx.writeBuffer().then((buffer) => {
                const blob = new Blob([buffer], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `tabla_${tableIndex}.xlsx`;
                link.click();
            });
        }

        window.addEventListener('load', async () => {
            await loadExcelJS();
            observeDOMForTables();
        });
    }

    injectScript(mainScript);
})();
