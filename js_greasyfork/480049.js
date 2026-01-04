// ==UserScript==
// @name         Grundo's Cafe: Stock Market - Highlight Buyable Stocks (at 15nps)
// @namespace    https://www.grundos.cafe
// @version      1.1
// @description  Move rows with Current Price 15 to the top and change their background color to highlight yellow or display a message if there are no buyable stocks.
// @author       Shalane
// @match        https://www.grundos.cafe/games/stockmarket/stocks/?view_all=True
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480049/Grundo%27s%20Cafe%3A%20Stock%20Market%20-%20Highlight%20Buyable%20Stocks%20%28at%2015nps%29.user.js
// @updateURL https://update.greasyfork.org/scripts/480049/Grundo%27s%20Cafe%3A%20Stock%20Market%20-%20Highlight%20Buyable%20Stocks%20%28at%2015nps%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function highlightBuyableStocks() {
        const table = document.querySelector('table[border="1"], .stock-table');

        if (!table) {
            console.log("Table not found on this page.");
            return;
        }

        const rows = Array.from(table.querySelectorAll('tr'));
        const buyableRows = [];

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 6) {
                const currCell = cells[5];
                if (currCell.textContent.trim() === "15") {
                    buyableRows.push(row);
                }
            }
        });

        if (buyableRows.length === 0) {
            // Display a message if there are no buyable stocks
            const messageDiv = document.createElement('div');
            messageDiv.textContent = "😭 There are no buyable stocks at this time.";
            messageDiv.style.fontSize = '24px';
            messageDiv.style.textAlign = 'center';
            table.parentNode.insertBefore(messageDiv, table);
        } else {
            buyableRows.forEach(row => {
                // Move each buyable row to the top of the table
                row.parentNode.removeChild(row);
                table.querySelector('tbody').insertBefore(row, table.querySelector('tbody').firstChild);

                // Highlight each cell in the row for visual emphasis
                const cells = row.querySelectorAll('td');
                cells.forEach(cell => {
                    cell.style.backgroundColor = 'yellow';
                });
            });
        }
    }

    window.addEventListener('load', highlightBuyableStocks);
})();
