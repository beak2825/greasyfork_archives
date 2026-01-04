// ==UserScript==
// @name         AI Fuel Points Helper
// @description  Add helper text to fuel points deals
// @version      1.0
// @license      MIT
// @author       jnjustice
// @namespace    http://tampermonkey.net
// @match        https://portal.alignedincentiv.es/Seller/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509112/AI%20Fuel%20Points%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/509112/AI%20Fuel%20Points%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addHelperText() {
        const table = document.getElementById('SellerDashboardDeals');
        if (!table) return;

        const rows = table.querySelectorAll('tbody tr');

        rows.forEach(row => {
            const brandsCell = row.querySelector('td:nth-child(6)');
            if (!brandsCell || !brandsCell.textContent.includes('Kroger Fuel Points ($1 = 100 points)')) return;

            // Pre-Approved Capacity
            const capacityCell = row.querySelector('td:nth-child(5)');
            if (capacityCell) {
                const amount = parseFloat(capacityCell.textContent.replace(/[^0-9.]/g, ''));
                const fuelPoints = amount * 100;
                const spend = fuelPoints / 4;
                if (!capacityCell.innerHTML.includes('Fuel Points')) {
                    capacityCell.innerHTML += `<br><span style="color: red;">${fuelPoints.toLocaleString()} FP<br>$${spend.toLocaleString()} @ 4x</span>`;
                }
            }

            // Nested table for Brands and Buy Rate
            const nestedTable = brandsCell.querySelector('table.deal-line-items');
            if (nestedTable) {
                const nestedRows = nestedTable.querySelectorAll('tbody tr');
                nestedRows.forEach(nestedRow => {
                    // Brands
                    const brandCell = nestedRow.querySelector('td.brands-column');
                    if (brandCell && !brandCell.querySelector('span[style="color: red;"]')) {
                        const dollarMatch = brandCell.textContent.match(/\$(\d+)/);
                        if (dollarMatch) {
                            const dollarAmount = parseFloat(dollarMatch[1]);
                            const fuelPoints = dollarAmount * 100;
                            const spend = fuelPoints / 4;
                            brandCell.innerHTML += `<br><span style="color: red;">${fuelPoints.toLocaleString()} Fuel Points<br>$${spend.toLocaleString()} @ 4x/acct</span>`;
                        }
                    }

                    // Buy Rate
                    const buyRateCell = nestedRow.querySelector('td.buy-rate-column');
                    if (buyRateCell && !buyRateCell.querySelector('span[style="color: red;"]')) {
                        const percent = parseFloat(buyRateCell.textContent);
                        if (!isNaN(percent)) {
                            const payout = percent / 10;
                            const earningPercent = (payout / 1000) * 4 * 100;
                            buyRateCell.innerHTML += `<br><span style="color: red;">$${payout.toFixed(2)}/k<br>${earningPercent.toFixed(1)}% @ 4x</span>`;
                        }
                    }
                });
            }
        });
    }

    // Run the function when the page loads
    window.addEventListener('load', addHelperText);

    // If the table is loaded dynamically, you might need to use a MutationObserver
    // or periodically check for the table's existence
    const checkInterval = setInterval(() => {
        if (document.getElementById('SellerDashboardDeals')) {
            addHelperText();
            clearInterval(checkInterval);
        }
    }, 1000);
})();