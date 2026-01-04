// ==UserScript==
// @name         Fake Robux 2
// @namespace    http://tampermonkey.net/
// @version      2024-08-12
// @description  Changes the navbar Robux amount and balance label to a desired amount
// @author       Devappl & Dolin
// @match        *://www.roblox.com/*
// @match        *://roblox.com/*
// @match        https://www.roblox.com/transactions#!/Summary
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Robux_2019_Logo_gold.svg/1883px-Robux_2019_Logo_gold.svg.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520157/Fake%20Robux%202.user.js
// @updateURL https://update.greasyfork.org/scripts/520157/Fake%20Robux%202.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const fakeRobux = "17M+"; // Desired fake Robux amount
    const preciseRobux = "17,986,342"; // Precise fake Robux amount

    let balanceUpdated = false; // Flag to ensure the balance is only updated once

    // Function to update the Robux amount in the navbar
    function updateRobuxDisplay() {
        const robuxAmount = document.querySelector('#nav-robux-amount');
        const robuxBalance = document.querySelector('#nav-robux-balance');
        if (robuxAmount) robuxAmount.textContent = fakeRobux; // Update navbar robux amount
        if (robuxBalance) robuxBalance.textContent = `${preciseRobux} Robux`; // Update precise robux balance
    }

    // Function to update the balance label on the page
    function updateBalanceLabel() {
        const balanceLabel = document.querySelector('.balance-label.icon-robux-container');
        if (balanceLabel) {
            const spanElement = balanceLabel.querySelector('span');
            if (spanElement && !balanceUpdated) {
                spanElement.innerHTML = `My Balance: <span class="icon-robux-16x16"></span>${preciseRobux}`;
                balanceUpdated = true; // Set the flag to true after updating the balance
            }
        }
    }

    // Function to update the Robux balance on the transactions page
    function updateTransactionPageBalance() {
        const balanceLabel = document.querySelector('.balance-label.icon-robux-container');
        if (balanceLabel) {
            const spanElement = balanceLabel.querySelector('span');
            if (spanElement && !balanceUpdated) {
                spanElement.innerHTML = `My Balance: <span class="icon-robux-16x16"></span>${preciseRobux}`;
                balanceUpdated = true; // Set the flag to true after updating the balance
            }
        }
    }

    // Function to keep both the navbar robux amount and balance label updated
    function keepRobuxUpdated() {
        const robuxAmount = document.querySelector('#nav-robux-amount');
        const balanceLabel = document.querySelector('.balance-label.icon-robux-container');

        // Update nav-robux-amount if it's not already the desired value
        if (robuxAmount && robuxAmount.textContent !== fakeRobux) {
            robuxAmount.textContent = fakeRobux;
        }

        // Update balance-label if it's not already the preciseRobux value
        if (balanceLabel) {
            const spanElement = balanceLabel.querySelector('span');
            if (spanElement && spanElement.innerHTML !== `My Balance: <span class="icon-robux-16x16"></span>${preciseRobux}`) {
                spanElement.innerHTML = `My Balance: <span class="icon-robux-16x16"></span>${preciseRobux}`;
            }
        }
    }

    // Update both fields once when the page loads
    updateRobuxDisplay();
    updateBalanceLabel();

    // If we are on the transactions page, update the balance
    if (window.location.href.includes("/transactions#!/Summary")) {
        updateTransactionPageBalance();
    }

    // Use MutationObserver to keep values fixed and updated
    const observer = new MutationObserver(() => {
        keepRobuxUpdated(); // Keep both the navbar and balance label updated

        // If we are on the transactions page, update the balance
        if (window.location.href.includes("/transactions#!/Summary")) {
            updateTransactionPageBalance();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();
