// ==UserScript==
// @name         Cali Overtime
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Click on an FA's name to copy the hours for Google Sheets.
// @author       Anton Grouchtchak
// @match        https://office.roofingsource.com/admin/TechCalendar.php*
// @icon         https://office.roofingsource.com/images/roofing-source-logo.png
// @license      GPLv3
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/480401/Cali%20Overtime.user.js
// @updateURL https://update.greasyfork.org/scripts/480401/Cali%20Overtime.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Extract times from a row and create a TSV string, ignoring the first and last cells.
    function extractTimesAndCreateTSV(row) {
        return Array.from(row.cells, (cell, index) => {
            if (index === 0 || index === row.cells.length - 1) return null;
            const timeMatch = cell.innerHTML.match(/\d{2}:\d{2}/); // Match only hours and minutes.
            return timeMatch ? timeMatch[0] : '0';
        }).filter(Boolean).join('\t').trim();
    }


    // Provide visual feedback on copy.
    function provideFeedback(cell) {
        cell.style.backgroundColor = '#4CAF50';
        cell.style.transition = 'background-color .5s';

        setTimeout(() => {
            cell.style.backgroundColor = '';
        }, 650);
    }


    // Copy the TSV string to clipboard using Clipboard API.
    function copyToClipboard(text, cell) {
        const plainTextBlob = new Blob([text], { type: 'text/plain' });
        navigator.clipboard.write([new ClipboardItem({ 'text/plain': plainTextBlob })]).then(
            () => {
                provideFeedback(cell);
            },
            (err) => {
                console.error('Unable to copy:', err);
            }
        );
    }


    // Initialize the copy functionality.
    function initCopy() {
        const table = document.querySelector('table');
        if (!table) return;

        Array.from(table.rows).forEach(row => {
            const firstCell = row.cells[0];
            if (firstCell) {
                firstCell.style.cursor = 'pointer';
                firstCell.addEventListener('click', () => {
                    const tsvString = extractTimesAndCreateTSV(row);
                    copyToClipboard(tsvString, firstCell);
                });
            }
        });
    }


    initCopy();
})();
