// ==UserScript==
// @name         2024 Blooket Test 3
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Add coins and tokens to your Blooket account
// @author       You
// @match        https://dashboard.blooket.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/516996/2024%20Blooket%20Test%203.user.js
// @updateURL https://update.greasyfork.org/scripts/516996/2024%20Blooket%20Test%203.meta.js
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

        // Make an HTTP request to update the user's balance
        fetch('https://dashboard.blooket.com/api/updateBalance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_AUTH_TOKEN' // Replace with your actual auth token
            },
            body: JSON.stringify({
                coins: coins,
                tokens: tokens
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(`${coins} coins and ${tokens} tokens have been added to your account.`);
                updateBalanceDisplay(coins, tokens);
            } else {
                alert("Failed to add coins and tokens. Please try again.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("An error occurred. Please try again.");
        });
    }

    // Function to update the balance display on the page
    function updateBalanceDisplay(coins, tokens) {
        // Find the balance display elements and update them
        let balanceElement = document.querySelector('.balance'); // Update this selector based on actual page structure
        if (balanceElement) {
            balanceElement.textContent = `Coins: ${coins}, Tokens: ${tokens}`;
        } else {
            console.warn('Balance display element not found.');
        }
    }

    // Run the function when the page loads
    addCoinsAndTokens();
})();