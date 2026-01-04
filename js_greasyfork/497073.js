// ==UserScript==
// @name         5e对战平台 demo 下载
// @namespace    cyberbees
// @version      2024-06-05
// @description  5e对战平台 demo 批量下载
// @author       Starxy
// @match        https://arena.5eplay.com/data/player/**
// @icon         https://static-arena.5eplay.com/images/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497073/5e%E5%AF%B9%E6%88%98%E5%B9%B3%E5%8F%B0%20demo%20%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/497073/5e%E5%AF%B9%E6%88%98%E5%B9%B3%E5%8F%B0%20demo%20%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Wait for the DOM to be fully loaded
    window.addEventListener('load', function() {
        // Select the table with the class 'match-data odd-even'
        const table = document.querySelector('table.match-data.odd-even');
        if (table) {
            // Select the table header row
            const headerRow = table.querySelector('thead tr');
            if (headerRow) {
                // Create a new table header cell with a "Download" button
                const headerCell = document.createElement('th');
                const downloadButton = document.createElement('button');
                downloadButton.textContent = '下载';
                downloadButton.addEventListener('click', function() {
                    // Implement the download functionality here
                    const selectedUrls = [];
                    const rows = table.querySelectorAll('tbody tr');
                    rows.forEach(row => {
                        const checkbox = row.querySelector('input[type="checkbox"]');
                        if (checkbox && checkbox.checked) {
                            const downloadLink = row.querySelector('td:last-child a.down-demo-trigger');
                            if (downloadLink) {
                                selectedUrls.push(downloadLink.getAttribute('data-url'));
                            }
                        }
                    });
                    selectedUrls.forEach((url, index) => {
                        setTimeout(() => {
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = '';
                            a.style.display = 'none';
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                        }, index * 300); // 300ms delay between each download
                    });
                });
                headerCell.appendChild(downloadButton);

                // Insert the new header cell at the beginning of the header row
                headerRow.insertBefore(headerCell, headerRow.firstChild);
            }

            // Select all rows in the table body
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => {
                // Create a new table cell with a checkbox
                const checkboxCell = document.createElement('td');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkboxCell.appendChild(checkbox);

                // Insert the new cell at the beginning of the row
                row.insertBefore(checkboxCell, row.firstChild);

                // Add click event to the row to toggle the checkbox
                row.addEventListener('click', function(event) {
                    if (event.target !== checkbox) {
                        checkbox.checked = !checkbox.checked;
                    }
                });
            });
        }
    });
})();
