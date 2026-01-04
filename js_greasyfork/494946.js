// ==UserScript==
// @name         GW2PC T6 Stack Price with Discount
// @namespace    https://gw2pc.com/
// @version      1.0
// @description  Show the price of a whole stack (250) for each of the T6 materials with a 10% discount on https://gw2pc.com/t6/
// @author       Korunos
// @match        https://gw2pc.com/t6/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494946/GW2PC%20T6%20Stack%20Price%20with%20Discount.user.js
// @updateURL https://update.greasyfork.org/scripts/494946/GW2PC%20T6%20Stack%20Price%20with%20Discount.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to convert price strings to copper value
    function parsePrice(priceStr) {
        const match = priceStr.match(/(\d+)s (\d+)c/) || priceStr.match(/(\d+)g (\d+)s (\d+)c/);
        if (match) {
            if (match.length === 3) {
                const [_, s, c] = match.map(Number);
                return (s * 100) + c;
            } else if (match.length === 4) {
                const [_, g, s, c] = match.map(Number);
                return (g * 10000) + (s * 100) + c;
            }
        }
        return 0;
    }

    // Function to format numbers as in-game currency
    function formatCurrency(copper) {
        const gold = Math.floor(copper / 10000);
        const silver = Math.floor((copper % 10000) / 100);
        const copperRemainder = copper % 100;
        if (gold > 0) {
            return `${gold}g ${silver}s ${copperRemainder}c`;
        } else {
            return `${silver}s ${copperRemainder}c`;
        }
    }

    // Function to calculate and display the stack price with discount
    function displayStackPrice() {
        const table = document.querySelector('.price-table');
        if (!table) {
            console.error('Table not found');
            return;
        }

        const headerRow = table.querySelector('thead tr');
        const rows = table.querySelectorAll('tbody tr');
        if (!headerRow || rows.length === 0) {
            console.error('Table rows or header not found');
            return;
        }

        // Add a new header for the discounted stack price
        const newHeader = document.createElement('th');
        newHeader.innerText = 'Discounted Stack Price (90%)';
        newHeader.style.textAlign = 'center'; // Center the header text
        newHeader.style.width = '150px'; // Set a fixed width
        headerRow.appendChild(newHeader);

        // Iterate through each row to calculate the discounted stack price
        rows.forEach(row => {
            const depth250Cell = row.querySelector('td:nth-child(4)');
            if (!depth250Cell) {
                console.error('Depth 250 cell not found for row');
                return;
            }
            const priceText = depth250Cell.innerText.trim();
            const price = parsePrice(priceText);

            if (!isNaN(price) && price > 0) {
                const stackPrice = price * 250;
                const discountedPrice = stackPrice * 0.9;

                const newCell = document.createElement('td');
                newCell.innerText = formatCurrency(discountedPrice);
                newCell.style.color = 'red';
                newCell.style.textAlign = 'center'; // Center the cell text
                newCell.style.width = '150px'; // Set a fixed width
                row.appendChild(newCell);
            } else {
                console.error(`Failed to parse price: ${priceText}`);
            }
        });
    }

    // Function to periodically check for the table until it is available
    function waitForTable() {
        const checkInterval = setInterval(() => {
            const table = document.querySelector('.price-table');
            if (table) {
                clearInterval(checkInterval);
                displayStackPrice();
            }
        }, 100); // Check every 100ms
    }

    // Start checking for the table as soon as the script is loaded
    waitForTable();
})();
