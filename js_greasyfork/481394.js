// ==UserScript==
// @name         Table Search Filter for PACS
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add search fields to each table column on PACS pages
// @author       Pavel Aliev
// @match        *://*/*pacs/applentity.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481394/Table%20Search%20Filter%20for%20PACS.user.js
// @updateURL https://update.greasyfork.org/scripts/481394/Table%20Search%20Filter%20for%20PACS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add search fields
    function addSearchFields(table) {
        const headerRow = table.insertRow(0);
        for (let i = 0; i < table.rows[1].cells.length; i++) {
            const headerCell = document.createElement("th");
            const searchInput = document.createElement("input");
            searchInput.setAttribute("type", "text");
            searchInput.setAttribute("placeholder", "Фильтр...");
            searchInput.onkeyup = function(event) {
                event.preventDefault(); // Prevent default behavior
                filterTable(table, i, this.value);
            };
            headerCell.appendChild(searchInput);
            headerRow.appendChild(headerCell);
        }
    }

    // Function to filter table rows
    function filterTable(table, columnIndex, searchText) {
        searchText = searchText.toLowerCase();
        for (let i = 1; i < table.rows.length; i++) { // Start loop from the second row
            const row = table.rows[i];
            const cell = row.cells[columnIndex];
            if (cell) {
                const cellText = cell.textContent || cell.innerText;
                row.style.display = cellText.toLowerCase().indexOf(searchText) > -1 ? "" : "none";
            }
        }
    }

    // Function to check and add search fields, skipping the first two tables
    function checkAndAddSearchFields() {
        const tables = document.getElementsByTagName("table");
        let tableCount = 0;
        for (let table of tables) {
            tableCount++;
            if (tableCount > 2 && table.rows.length > 1 && table.rows[0].cells[0].tagName !== "TH") { // Skip the first two tables
                addSearchFields(table);
            }
        }
    }

    // Monitor for changes in the DOM and reapply search fields if necessary
    const observer = new MutationObserver(checkAndAddSearchFields);
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial application of search fields
    checkAndAddSearchFields();
})();
