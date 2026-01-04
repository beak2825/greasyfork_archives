// ==UserScript==
// @name         Blooket Token Adder
// @namespace    https://github.com/yourusername/blooket-token-adder
// @version      1.0
// @description  Adds tokens and XP to your Blooket account (up to 1,000,000 tokens daily)
// @author       Your Name
// @license      MIT
// @match        https://www.blooket.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516974/Blooket%20Token%20Adder.user.js
// @updateURL https://update.greasyfork.org/scripts/516974/Blooket%20Token%20Adder.meta.js
// ==/UserScript==

// Get the player's name by verifying their token
async function getName() {
    const response = await fetch('https://api.blooket.com/api/users/verify-token', {
        method: "GET",
        headers: {
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.9,ru;q=0.8",
        },
        credentials: "include"
    });

    if (response.ok) {
        const data = await response.json();
        return data.name;
    } else {
        alert("Error: Unable to retrieve user data.");
        return null;
    }
}

// Function to add tokens and XP
async function addCurrencies() {
    // Ask for the number of tokens the user wants to add
    const tokens = Number(prompt('How many tokens do you want to add to your Blooket account? (Max 1,000,000 tokens daily)'));

    // If the user input is not a valid number
    if (isNaN(tokens) || tokens <= 0) {
        alert("Please enter a valid number of tokens.");
        return;
    }

    // If the tokens are more than 1 million, show an error
    if (tokens > 1000000) {
        alert('You can only add up to 1,000,000 tokens daily.');
        return; // Stop further execution if the limit is exceeded
    }

    // Fetch the user's name
    const name = await getName();
    if (!name) return; // Exit if we couldn't retrieve the user's name

    // Make a request to add tokens and XP
    const response = await fetch('https://api.blooket.com/api/users/add-rewards', {
        method: "PUT",
        headers: {
            "referer": "https://www.blooket.com/",
            "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
            addedTokens: tokens,
            addedXp: 300,
            name: name
        })
    });

    // Handle the response from the server
    if (response.status === 200) {
        alert(`${tokens} tokens and 300 XP successfully added to your account!`);
    } else {
        alert('An error occurred while adding tokens. Please try again later.');
    }
}

// Run the function to add currencies
addCurrencies();
