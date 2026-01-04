// ==UserScript==
// @name         NCBI Primer Data Extractor and Exporter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Extract primer data and export as Excel (NCBI primer blast 引物数据提取及导出工具)
// @author       XY ZHAO
// @match        *://www.ncbi.nlm.nih.gov/tools/primer-blast/*
// @grant        none
// @icon         data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IS0tIFVwbG9hZGVkIHRvOiBTVkcgUmVwbywgd3d3LnN2Z3JlcG8uY29tLCBHZW5lcmF0b3I6IFNWRyBSZXBvIE1peGVyIFRvb2xzIC0tPg0KPHN2ZyB3aWR0aD0iODAwcHgiIGhlaWdodD0iODAwcHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTUuMDMwMyAxLjQ2OTY3QzE1LjMyMzIgMS43NjI1NiAxNS4zMjMyIDIuMjM3NDQgMTUuMDMwMyAyLjUzMDMzQzE0LjYxNDUgMi45NDYxNCAxNC4yNDA4IDMuMzg4MyAxMy45MTA1IDMuODQ5OEwxNS4xMTcyIDUuMDU2NThDMTUuNDEwMSA1LjM0OTQ4IDE1LjQxMDEgNS44MjQzNSAxNS4xMTcyIDYuMTE3MjRDMTQuODI0NCA2LjQxMDE0IDE0LjM0OTUgNi40MTAxNCAxNC4wNTY2IDYuMTE3MjRMMTMuMTA4OCA1LjE2OTQyQzEyLjg5ODcgNS41ODM0MSAxMi43MjAzIDYuMDA2NTMgMTIuNTc0MyA2LjQzNDU4TDE3LjQ1MjYgMTEuMzEyOEMxNy40ODk0IDExLjM0OTYgMTcuNTIxNiAxMS4zODkzIDE3LjU0OTEgMTEuNDMxMkMxNy45NTcgMTEuMjkzIDE4LjM2MDQgMTEuMTI1MyAxOC43NTU4IDEwLjkyODhMMTUuNzQ4IDcuOTIwOTZDMTUuNDU1MSA3LjYyODA2IDE1LjQ1NTEgNy4xNTMxOSAxNS43NDggNi44NjAyOUMxNi4wNDA5IDYuNTY3NCAxNi41MTU4IDYuNTY3NCAxNi44MDg3IDYuODYwMjlMMjAuMDg0NSAxMC4xMzYyQzIwLjU2OTggOS43OTQ1IDIxLjAzNDIgOS40MDUxNyAyMS40Njk3IDguOTY5NjdDMjEuNzYyNiA4LjY3Njc4IDIyLjIzNzQgOC42NzY3OCAyMi41MzAzIDguOTY5NjdDMjIuODIzMiA5LjI2MjU2IDIyLjgyMzIgOS43Mzc0NCAyMi41MzAzIDEwLjAzMDNDMTkuOTA3NyAxMi42NTMgMTYuMjY2NSAxMy44ODM5IDEyLjk3MzYgMTMuMjQzNEMxMy43MjM1IDE2LjQxOCAxMi41NzM5IDE5Ljk4NjcgMTAuMDMwMyAyMi41MzAzQzkuNzM3NDQgMjIuODIzMiA5LjI2MjU2IDIyLjgyMzIgOC45Njk2NyAyMi41MzAzQzguNjc2NzggMjIuMjM3NCA4LjY3Njc4IDIxLjc2MjYgOC45Njk2NyAyMS40Njk3QzkuNDA2NDIgMjEuMDMyOSA5Ljc5MzA4IDIwLjU2NSAxMC4xMjc5IDIwLjA3NTNMOC43NzQzNiAxOC43MjE3QzguNDgxNDYgMTguNDI4OCA4LjQ4MTQ2IDE3Ljk1NCA4Ljc3NDM2IDE3LjY2MTFDOS4wNjcyNSAxNy4zNjgyIDkuNTQyMTIgMTcuMzY4MiA5LjgzNTAyIDE3LjY2MTFMMTAuODk3NSAxOC43MjM1QzExLjA4NCAxOC4zMjA5IDExLjIzODcgMTcuOTEwMyAxMS4zNjA4IDE3LjQ5NjFDMTEuMzQ0MyAxNy40ODIzIDExLjMyODMgMTcuNDY3NiAxMS4zMTI4IDE3LjQ1MjFMNi41MDA4MyAxMi42NDAxQzYuMDYxMTMgMTIuNzY5OSA1LjYyNTUyIDEyLjkzNjQgNS4xOTkyMSAxMy4xMzg4TDguMDMwMzMgMTUuOTY5OUM4LjMyMzIyIDE2LjI2MjggOC4zMjMyMiAxNi43Mzc3IDguMDMwMzMgMTcuMDMwNkM3LjczNzQ0IDE3LjMyMzUgNy4yNjI1NiAxNy4zMjM1IDYuOTY5NjcgMTcuMDMwNkwzLjg1NzUxIDEzLjkxODRDMy4zOTIyIDE0LjI0MjUgMi45NDcwNyAxNC42MTM2IDIuNTMwMzMgMTUuMDMwM0MyLjIzNzQ0IDE1LjMyMzIgMS43NjI1NiAxNS4zMjMyIDEuNDY5NjcgMTUuMDMwM0MxLjE3Njc4IDE0LjczNzQgMS4xNzY3OCAxNC4yNjI2IDEuNDY5NjcgMTMuOTY5N0M0LjAxMzI2IDExLjQyNjEgNy41ODE5NSAxMC4yNzY1IDEwLjc1NjYgMTEuMDI2NEMxMC4xMTYxIDcuNzMzNTIgMTEuMzQ3IDQuMDkyMzQgMTMuOTY5NyAxLjQ2OTY3QzE0LjI2MjYgMS4xNzY3OCAxNC43Mzc0IDEuMTc2NzggMTUuMDMwMyAxLjQ2OTY3Wk0xNS44NTA5IDExLjgzMjVMMTIuMTY3NSA4LjE0OTA5QzEyLjAwOTQgOS4zMTg0NSAxMi4wOTQ3IDEwLjQ4MzIgMTIuNDM5IDExLjU2MUMxMy41MTY4IDExLjkwNTMgMTQuNjgxNSAxMS45OTA2IDE1Ljg1MDkgMTEuODMyNVpNMTEuMzMwMyAxMi45NTRDMTEuNjI5IDEzLjgyMTUgMTEuNzQzMyAxNC43NTQyIDExLjY4MjYgMTUuNzAwNkw4LjI5OTQzIDEyLjMxNzRDOS4yNDU4MSAxMi4yNTY3IDEwLjE3ODUgMTIuMzcxIDExLjA0NiAxMi42Njk3TDExLjI1NzUgMTIuNzQyNUwxMS4zMzAzIDEyLjk1NFoiIGZpbGw9IiMxQzI3NEMiLz4NCjwvc3ZnPg==
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/494245/NCBI%20Primer%20Data%20Extractor%20and%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/494245/NCBI%20Primer%20Data%20Extractor%20and%20Exporter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Dynamically load SheetJS
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.9/xlsx.full.min.js';
    script.onload = function() {
        // SheetJS is now loaded and can be used
        init();
    };
    document.head.appendChild(script);

    function init() {
        window.addEventListener('load', function() {
            let pairId = 1; // Initialize pair ID

            // Extract primer data
            function extractPrimerData() {
                const primerData = [];
                document.querySelectorAll('.prPairInfo').forEach((div) => {
                    const rows = div.querySelectorAll('tr');
                    // Extract forward primer info
                    const forwardPrimerInfo = {
                        PairID: pairId,
                        Type: 'Forward',
                        Sequence: rows[1].children[1].textContent,
                        Strand: rows[1].children[2].textContent,
                        Length: rows[1].children[3].textContent,
                        Start: rows[1].children[4].textContent,
                        Stop: rows[1].children[5].textContent,
                        Tm: rows[1].children[6].textContent,
                        GC: rows[1].children[7].textContent,
                        SelfComplementarity: rows[1].children[8].textContent,
                        Self3Complementarity: rows[1].children[9].textContent,
                        ProductSize: rows[4].children[1].textContent
                    };
                    primerData.push(forwardPrimerInfo);

                    // Extract reverse primer info
                    const reversePrimerInfo = {
                        PairID: pairId,
                        Type: 'Reverse',
                        Sequence: rows[2].children[1].textContent,
                        Strand: rows[2].children[2].textContent,
                        Length: rows[2].children[3].textContent,
                        Start: rows[2].children[4].textContent,
                        Stop: rows[2].children[5].textContent,
                        Tm: rows[2].children[6].textContent,
                        GC: rows[2].children[7].textContent,
                        SelfComplementarity: rows[2].children[8].textContent,
                        Self3Complementarity: rows[2].children[9].textContent,
                        ProductSize: rows[4].children[1].textContent // Assuming product size is the same for both
                    };
                    primerData.push(reversePrimerInfo);

                    pairId++; // Increment pair ID for the next pair
                });
                return primerData;
            }

            // Export to Excel
            function exportToExcel(primerData) {
                // Create a new workbook
                const wb = XLSX.utils.book_new();
                // Convert primer data to worksheet
                const ws = XLSX.utils.json_to_sheet(primerData);
                // Add worksheet to workbook
                XLSX.utils.book_append_sheet(wb, ws, "Primer Data");
                // Generate Excel file and trigger download
                XLSX.writeFile(wb, "primer_data.xlsx");
            }

            // Create and add export button to the page
            const exportButton = document.createElement('button');
            exportButton.textContent = 'Export to Excel';
            exportButton.style.position = 'fixed';
            exportButton.style.top = '10px';
            exportButton.style.right = '10px';
            exportButton.addEventListener('click', function() {
                const primerData = extractPrimerData();
                exportToExcel(primerData);
            });

            document.body.appendChild(exportButton);
        });
    }
})();
