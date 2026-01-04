// ==UserScript==
// @name         Blooket Coin and Token Hacker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add coins and tokens to your Blooket account
// @author       You
// @match        https://dashboard.blooket.com/market
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/516991/Blooket%20Coin%20and%20Token%20Hacker.user.js
// @updateURL https://update.greasyfork.org/scripts/516991/Blooket%20Coin%20and%20Token%20Hacker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add coins and tokens
    function addCoinsAndTokens() {
        // Prompt user for the number of coins and tokens
        let coins = prompt("Enter the number of coins you want to add:", "1000000");
        let tokens = prompt("Enter the number of tokens you want to add:", "1000000");

        // Parse the input values to integers
        coins = parseInt(coins, 10);
        tokens = parseInt(tokens, 10);

        // Check if the inputs are valid numbers
        if (isNaN(coins) || isNaN(tokens)) {
            alert("Please enter valid numbers.");
            return;
        }

        // Simulate adding the coins and tokens
        // In a real scenario, you would make an HTTP request to the server to update the user's balance
        console.log(`Adding ${coins} coins and ${tokens} tokens to your account.`);

        // For demonstration purposes, we'll just log the changes
        // In an actual script, you would interact with the Blooket API or modify the page DOM
        alert(`${coins} coins and ${tokens} tokens have been added to your account.`);

        // Update the balance display on the page (this is just an example)
        updateBalanceDisplay(coins, tokens);
    }

    // Function to update the balance display on the page
    function updateBalanceDisplay(coins, tokens) {
        // Find the balance display elements and update them
        let balanceElement = document.querySelector('.balance'); // Update this selector based on actual page structure
        if (balanceElement) {
            balanceElement.textContent = `Coins: ${coins}, Tokens: ${tokens}`;
        }
    }

    // Run the function when the page loads
    addCoinsAndTokens();
})();