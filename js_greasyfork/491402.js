// ==UserScript==
// @name         Balance Randomizer
// @namespace    http://brainhub24.com/
// @version      1.16
// @description  Randomizes balance values to over 1 million euros for April 1st, 2024
// @author       Jan Gebser (Brainhub24.com)
// @match        https://www.haspa.de/de/home/onlinebanking/nbf/finanzuebersicht.html*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491402/Balance%20Randomizer.user.js
// @updateURL https://update.greasyfork.org/scripts/491402/Balance%20Randomizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if it's April 1st, 2024
    var today = new Date();
    if (today.getMonth() === 3 && today.getDate() === 1 && today.getFullYear() === 2024) {
        // Find all elements containing the balance value
        var balanceContainers = document.querySelectorAll('.mkp-currency-m');

        // Loop through each balance container and update the value
        balanceContainers.forEach(function(container) {
            // Get real balance value
            var realBalance = parseFloat(container.innerText.replace(',', '.'));

            // Generate a new balance value (over 1 million euros)
            var newBalance = Math.floor(Math.random() * 9000000) + 1000000; // Random value between 1 million and 10 million

            // Update the balance with the new value
            container.innerHTML = '<span aria-hidden="true" class="balance-predecimal">' + Math.floor(newBalance) + '</span><span aria-hidden="true" class="balance-decimal">,' + (newBalance % 100).toFixed(2).slice(-2) + '</span><span aria-hidden="false"> EUR</span>';
        });
    }
})();
