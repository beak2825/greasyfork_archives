// ==UserScript==
// @name         Highlight RSF team v1
// @namespace    http://tampermonkey.net/
// @version      2024-02-25
// @description  simple highlighter
// @author       Paskalip
// @match        https://rallysimfans.hu/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rallysimfans.hu
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/488344/Highlight%20RSF%20team%20v1.user.js
// @updateURL https://update.greasyfork.org/scripts/488344/Highlight%20RSF%20team%20v1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Specify the table selector
    const tableSelector = 'table'; // You can adjust this selector to match your specific table

    // Specify the substrings that should trigger highlighting with their respective colors
    const highlightGroups = {
        'yellow': ['substring1', 'substring2'],
        'cyan': ['substring3', 'substring4'],
        'magenta': ['substring5', 'substring6']
        // Add more groups as needed
    };

    // Get all table rows
    const rows = document.querySelectorAll(tableSelector + ' tr');

    // Loop through each group of substrings and its corresponding color
    Object.entries(highlightGroups).forEach(([color, substrings]) => {
        // Loop through each row
        rows.forEach(row => {
            let highlight = false;

            // Select all cells (td elements) in the row
            const cells = row.querySelectorAll('td');

            // Loop through each cell in the row
            cells.forEach(cell => {
                // Check if the cell content includes any of the highlight substrings (case insensitive)
                const cellContent = cell.textContent.trim().toLowerCase();
                if (substrings.some(substring => cellContent.includes(substring.toLowerCase()))) {
                    highlight = true;
                }
            });

            // If any cell in the row contains a substring to highlight, apply the highlight style to the row with the specified color
            if (highlight) {
                row.style.backgroundColor = color;
                console.log(`Highlighted row (${color}):`, row);
            }
        });
    });

    // Exclude highlighted rows containing tables
    const highlightedRows = document.querySelectorAll('tr[style*="background-color"]');
    highlightedRows.forEach(highlightedRow => {
        if (highlightedRow.querySelector('table')) {
            // Row contains a nested table, remove the highlight
            highlightedRow.style.backgroundColor = '';
            console.log('Excluded row with table:', highlightedRow);
        }
    });
})();