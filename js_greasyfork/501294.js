// ==UserScript==
// @name         TEST SCRIPT INSPIRED BY - BrightGrid Enterprises 
// @namespace   https://t.me/BrightGrid
// @version     1.0
// @description TEST.
// @locale      en
// @match       https://energymanager.trophyapi.com/*
// @match       https://energymanagergame.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/501294/TEST%20SCRIPT%20INSPIRED%20BY%20-%20BrightGrid%20Enterprises.user.js
// @updateURL https://update.greasyfork.org/scripts/501294/TEST%20SCRIPT%20INSPIRED%20BY%20-%20BrightGrid%20Enterprises.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Intercept XMLHttpRequest
    const open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        const url = arguments[1];
        const method = arguments[0];

        this.addEventListener('readystatechange', function() {
            if (this.readyState === 4 && url.includes('power-exchange-sell.php') && method === 'POST') {
                try {
                    let response = JSON.parse(this.responseText);
                    console.log('Response Data:', response); // Debug response structure

                    if (response && response.gridSales) {
                        response.gridSales.forEach(sale => {
                            sale.income = 99999; // Set desired income value
                        });

                        Object.defineProperty(this, 'responseText', { value: JSON.stringify(response) });

                        // Update UI with the new income value
                        updateUI(99999);
                    }
                } catch (e) {
                    console.error('Error parsing JSON response:', e);
                }
            }
        });
        open.apply(this, arguments);
    };

    // Function to update UI directly
    function updateUI(newIncome) {
        // Adjust selector based on actual HTML
        const incomeElement = document.querySelector('[id^="income-display-"]');
        if (incomeElement) {
            incomeElement.textContent = `$ ${newIncome}`;
        } else {
            console.log('Income element not found.');
        }
    }

})();
