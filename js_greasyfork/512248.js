// ==UserScript==
// @name         Auto Sort Purelymail Routing Table by Domain
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  Automatically sort and group the Purelymail routing table by domain on page load with toggleable headers and gap for each domain group. Removes borders and background from gaps and striped rows.
// @author       V3ctor Design
// @license      MIT
// @match        https://purelymail.com/manage/routing
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/512248/Auto%20Sort%20Purelymail%20Routing%20Table%20by%20Domain.user.js
// @updateURL https://update.greasyfork.org/scripts/512248/Auto%20Sort%20Purelymail%20Routing%20Table%20by%20Domain.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // User setting to toggle headers
    let showHeaders = true;

    // Register a menu command to toggle headers
    GM_registerMenuCommand("Toggle Domain Headers", () => {
        showHeaders = !showHeaders;
        sortAndGroupTableByDomain();
    });

    // Inject custom CSS to override existing styles for borders and striping
    const style = document.createElement('style');
    style.textContent = `
        /* Remove borders from the table, header, and cells */
        .borderedTable, .borderedTable th, .borderedTable td {
            border: none !important;
        }

        /* Remove background color for even rows (striping) */
        table.striped tr:nth-of-type(2n) {
            background-color: transparent !important;
        }
    `;
    document.head.appendChild(style);

    // Function to sort and group the table by domain
    function sortAndGroupTableByDomain() {
        const table = document.querySelector('table.striped'); // Get the table element

        if (!table) {
            console.log("Table not found yet.");
            return false; // Retry if table is not available
        }

        // Remove default table background and border styles
        table.style.backgroundColor = 'transparent';
        table.style.border = 'none';

        const domainColIndex = 0; // "Domain" is the first column
        const tbody = table.querySelector('tbody'); // Get tbody

        if (!tbody) {
            console.log("Tbody not found.");
            return false;
        }

        const rows = Array.from(tbody.querySelectorAll('tr')); // Get all rows

        if (rows.length === 0) {
            console.log("No rows found.");
            return false;
        }

        // Sort rows by domain
        const sortedRows = rows.sort((rowA, rowB) => {
            const domainA = rowA.querySelectorAll('td')[domainColIndex].querySelector('select').selectedOptions[0].textContent.trim().toLowerCase();
            const domainB = rowB.querySelectorAll('td')[domainColIndex].querySelector('select').selectedOptions[0].textContent.trim().toLowerCase();
            return domainA.localeCompare(domainB); // Sort domains alphabetically
        });

        tbody.innerHTML = ''; // Clear existing rows

        let lastDomain = null;

        // Append sorted rows with headers for each domain group
        sortedRows.forEach(row => {
            const currentDomain = row.querySelectorAll('td')[domainColIndex].querySelector('select').selectedOptions[0].textContent.trim().toLowerCase();

            if (lastDomain !== currentDomain) {
                // Add a gap (spacer) before the new group
                const spacerRow = document.createElement('tr');
                const spacerCell = document.createElement('td');
                spacerCell.colSpan = row.children.length;
                spacerCell.style.height = '20px';
                spacerRow.appendChild(spacerCell);
                tbody.appendChild(spacerRow);

                // Create and add the header row for the new domain group if headers are enabled
                if (showHeaders) {
                    const headerRow = document.createElement('tr');
                    const headerCell = document.createElement('td');
                    headerCell.colSpan = row.children.length;
                    headerCell.style.backgroundColor = '#ddd'; // Apply background color to header
                    headerCell.style.fontWeight = 'bold';
                    headerCell.style.padding = '5px';
                    headerCell.textContent = currentDomain;
                    headerRow.appendChild(headerCell);
                    tbody.appendChild(headerRow);
                }
            }

            // Add the row to the table
            row.style.backgroundColor = 'transparent'; // Ensure rows have no background color
            tbody.appendChild(row);
            lastDomain = currentDomain;
        });

        console.log("Table sorted and grouped by domain with headers and gaps.");
        return true;
    }

    // Function to poll for the table to be fully loaded
    function pollForTable() {
        const maxAttempts = 20; // Number of retries (adjust as needed)
        let attempts = 0;

        const interval = setInterval(() => {
            attempts++;
            const sorted = sortAndGroupTableByDomain();

            if (sorted) {
                clearInterval(interval); // Stop polling once sorting is successful
            }

            if (attempts >= maxAttempts) {
                clearInterval(interval); // Stop after max attempts
                console.log("Failed to sort and group the table after maximum attempts.");
            }
        }, 100); // Poll every 100ms
    }

    // Start polling for the table after the page has loaded
    window.addEventListener('load', pollForTable);
})();
