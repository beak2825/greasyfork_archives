// ==UserScript==
// @name Total Price Row
// @namespace http://tampermonkey.net/
// @version 2024-07-10
// @description Quickly hacked together script to add a row to the inventory table
// @author Joshua Vandaele
// @match https://www.steamcardexchange.net/index.php?inventory
// @icon https://www.google.com/s2/favicons?sz=64&domain=steamcardexchange.net
// @license MIT
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/500235/Total%20Price%20Row.user.js
// @updateURL https://update.greasyfork.org/scripts/500235/Total%20Price%20Row.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let table = document.getElementById('inventorylist');
    let headerRow = table.querySelector('thead tr');
    let found = false;

    // Function to add the "Total Price" column
    function addTotalPriceColumn() {
        if (!table) {
            table = document.getElementById('inventorylist');
            return false; // Table not found
        }
        if (!headerRow) {
            headerRow = table.querySelector('thead tr');
            return false; // No header row found
        }
        if (!found) {
            const totalPriceHeader = document.createElement('th');
            totalPriceHeader.classList.add('w-32', 'sorting');
            totalPriceHeader.textContent = 'Total Price';
            headerRow.appendChild(totalPriceHeader);
            found = true;
        }

        // Loop through each row in the table body to calculate and add the "Total Price" column
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            // if column already exists, skip
            if (row.querySelector('td:last-child').classList.contains('total-price-cell')) {
                return;
            }
            const worthCell = row.cells[1]; // Assuming "Worth" is the second column
            const cardsInSetCell = row.cells[3]; // Assuming "Cards in Set" is the fourth column
            const worth = parseFloat(worthCell.textContent);
            const cardsInSet = parseFloat(cardsInSetCell.textContent);

            // Calculate "Total Price"
            const totalPrice = worth * cardsInSet;

            // Create a new cell for "Total Price" and append it to the row
            const totalPriceCell = document.createElement('td');
            totalPriceCell.classList.add('total-price-cell');
            totalPriceCell.textContent = totalPrice.toFixed(2); // Format to 2 decimal places
            row.appendChild(totalPriceCell);
        });
        return true; // Indicate success
    }

    const intervalId = setInterval(() => {
        addTotalPriceColumn()
    }, 100); // Check every 1000 milliseconds (1 second)
})();