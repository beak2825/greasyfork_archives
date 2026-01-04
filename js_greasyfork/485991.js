// ==UserScript==
// @name         Fake Robux Transactions
// @namespace    http://tampermonkey.net/
// @version      2024-01-29
// @description  Displays fake Robux transactions of a desired amount
// @author       Devappl
// @match        *://www.roblox.com/*
// @match        *://roblox.com/*
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Robux_2019_Logo_gold.svg/1883px-Robux_2019_Logo_gold.svg.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485991/Fake%20Robux%20Transactions.user.js
// @updateURL https://update.greasyfork.org/scripts/485991/Fake%20Robux%20Transactions.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set the desired number
    var desiredNumber = 1000; // Change this to your desired number

    // Function to replace the hardcoded values in the HTML with the desired number
    function replaceTransactionAmounts() {
        // Find all transaction rows
        var transactionRows = document.querySelectorAll('tr');

        // Flag to ensure only the first "Total" is replaced
        var replacedTotal = false;

        // Iterate through each transaction row
        transactionRows.forEach(function(row) {
            // Find the transaction label within the row
            var transactionLabel = row.querySelector('.summary-transaction-label');

            if (transactionLabel) {
                // Get the text content of the transaction label
                var label = transactionLabel.textContent.trim().toLowerCase();

                // Check if the label is "sales of goods" or "total"
                if (label === 'sales of goods' || (!replacedTotal && label === 'total')) {
                    // Find the element with the balance in the specific <td>
                    var tdBalanceElement = row.querySelector('.amount.icon-robux-container span:last-child');

                    if (tdBalanceElement) {
                        // Replace the hardcoded value in the HTML with the desired number
                        tdBalanceElement.textContent = desiredNumber;

                        // Set the flag to true if "Total" is replaced
                        if (label === 'total') {
                            replacedTotal = true;
                        }
                    }
                }
            }
        });

        // Find the element with the balance text
        var balanceElement = document.querySelector('.balance-label.icon-robux-container span');

        if (balanceElement) {
            // Replace the hardcoded value in the HTML with the desired number
            balanceElement.innerHTML = 'My Balance: <span class="icon-robux-16x16"></span>' + desiredNumber;
        }
    }

    // Call the function to replace the transaction amounts when the page is fully loaded
    window.onload = function() {
        replaceTransactionAmounts();

        // Use setInterval to periodically check and update the displayed balances
        setInterval(function() {
            replaceTransactionAmounts();
        }, 1); // Adjust the interval as needed (1000 milliseconds = 1 second)
    };
})();
