// ==UserScript==
// @name         https://shucks.top/
// @namespace    http://tampermonkey.net/
// @version      2024-10-22
// @description  adds GB/$ column and allows for column shorting on table
// @author       Leonardo Merza
// @match        https://shucks.top
// @license MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shucks.top
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513554/https%3Ashuckstop.user.js
// @updateURL https://update.greasyfork.org/scripts/513554/https%3Ashuckstop.meta.js
// ==/UserScript==

(function() {
    // Get all rows in the table
    // Loop through each row
     document.querySelectorAll('table tbody tr').forEach(row => {
        // Get columns 3 to 7 (index 2 to 6 in JavaScript, since it's 0-based indexing)
        const cols = Array.from(row.querySelectorAll('td')).slice(2, 7);

        // Parse prices from columns 3-7 and filter out NaN values
        const prices = cols.map(col => {
            const priceText = col.textContent;
            const price = parseFloat(priceText.replace(/[^0-9.]/g, '')); // Remove non-numeric characters except period
            return isNaN(price) ? null : price; // Return null for NaN
        }).filter(price => price !== null); // Filter out null (formerly NaN) prices

        // If there are no valid prices, skip this row
        if (prices.length === 0) return;

        // Get the lowest price from the parsed prices
        const minPrice = Math.min(...prices);

        // Get the first column (index 0) which contains "xx TB"
        const firstColText = row.querySelector('td').textContent;
        const tbValue = parseFloat(firstColText); // Extract number part (TB size)

        // Convert TB to GB and calculate GB per dollar (1024 GB = 1 TB)
        const gbValue = tbValue * 1024;
        const gbPerDollar = gbValue / minPrice;

        // Create a new cell in the current row to store GB per dollar
        const newCell = document.createElement('td');
        newCell.textContent = `${gbPerDollar.toFixed(2)}`; // Rounded to 2 decimal places

        // Append the new cell to the row
        row.appendChild(newCell);
    });

    // Optionally, add a header for the new column if necessary
    const headerRow = document.querySelector('table thead tr');
    const newHeaderCell = document.createElement('th');
    newHeaderCell.textContent = 'GB/$';
    headerRow.appendChild(newHeaderCell);

    // Get all table headers
    const headers = document.querySelectorAll('table th');

    // Add the pointer cursor style to each header
    headers.forEach(header => {
        header.style.cursor = 'pointer';
    });

    // Add sorting functionality to the table
    const table = document.querySelector('table');
    const rows = Array.from(table.querySelectorAll('tbody tr'));

    // Add event listener to each header for sorting
    headers.forEach((header, index) => {
        header.addEventListener('click', () => {
            const isAscending = header.classList.contains('asc');
            headers.forEach(h => h.classList.remove('asc', 'desc'));

            const direction = isAscending ? -1 : 1;
            header.classList.toggle('asc', !isAscending);
            header.classList.toggle('desc', isAscending);

            const sortedRows = rows.sort((rowA, rowB) => {
                const cellA = rowA.querySelectorAll('td')[index].textContent.trim();
                const cellB = rowB.querySelectorAll('td')[index].textContent.trim();

                const isNumeric = !isNaN(parseFloat(cellA)) && isFinite(cellA);
                return isNumeric
                    ? (parseFloat(cellA) - parseFloat(cellB)) * direction
                : cellA.localeCompare(cellB) * direction;
            });

            const tbody = table.querySelector('tbody');
            tbody.innerHTML = '';
            sortedRows.forEach(row => tbody.appendChild(row));
        });
    });


})();