// ==UserScript==
// @name         Prolific Daily Earnings Counter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add up money values from Prolific earnings 
// @author       You
// @match        https://app.prolific.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493480/Prolific%20Daily%20Earnings%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/493480/Prolific%20Daily%20Earnings%20Counter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a div to contain the total money and clear button
    let containerDiv = document.createElement('div');
    containerDiv.style.position = 'fixed';
    containerDiv.style.top = '60px';
    containerDiv.style.right = '20px';
    containerDiv.style.backgroundColor = '#ffffff';
    containerDiv.style.padding = '1px';
    containerDiv.style.border = '1px solid #000000';
    containerDiv.style.zIndex = '9999';
    document.body.appendChild(containerDiv);

    // Create a div to display the total money
    let totalDiv = document.createElement('div');
    totalDiv.textContent = 'Total: $0.00';
    containerDiv.appendChild(totalDiv);

    // Create a button to clear the total
    let clearButton = document.createElement('button');
    clearButton.textContent = 'Clear Values';
    clearButton.style.marginTop = '10px';
    containerDiv.appendChild(clearButton);

    // Initialize total value
    let totalValue = parseFloat(localStorage.getItem('totalValue')) || 0;
    totalDiv.textContent = 'Total: $' + totalValue.toFixed(2);

    // Flag to track whether money values have been added after page refresh
    let valuesAdded = false;

    // Function to update total value
    function updateTotal(value) {
        totalValue += value;
        localStorage.setItem('totalValue', totalValue);
        totalDiv.textContent = 'Total: $' + totalValue.toFixed(2);
    }

    // Function to clear total value
    function clearTotal() {
        totalValue = 0;
        localStorage.setItem('totalValue', totalValue);
        totalDiv.textContent = 'Total: $' + totalValue.toFixed(2);
        valuesAdded = false;
    }

    // Function to play cash register sound
    function playCashRegisterSound() {
        let audio = new Audio('https://dl.sndup.net/w7zs/Coins.mp3'); // Replace 'cash_register_sound.mp3' with the path to your sound file
        audio.play();
    }

    // Function to scan the page for money values and "Awaiting review"
    function scanPage() {
        let awaitingReview = document.querySelector('h2[data-v-5c4a696f].title');
        if (awaitingReview !== null && awaitingReview.textContent.trim() === 'Awaiting review' && !valuesAdded) {
            playCashRegisterSound();

            // Find all money values and add them to the total, ignoring elements with class 'study-tag-reward-per-hour'
            let moneyValues = document.querySelectorAll('span[data-v-31bbd4ad].amount:not([data-testid="study-tag-reward-per-hour"])');
            moneyValues.forEach(function(element) {
                let value = parseFloat(element.textContent.replace(/[^\d.]/g, ''));
                updateTotal(value);
            });

            valuesAdded = true;
        } else if (!valuesAdded) {
            setTimeout(scanPage, 1000); // Continue scanning every second until 'Awaiting review' is found
        }
    }

    // Scan the page once initially
    scanPage();

    // Event listener for clear button
    clearButton.addEventListener('click', clearTotal);

    // Event listener for page refresh
    window.addEventListener('beforeunload', function() {
        // Reset flag when the page is refreshed
        valuesAdded = false;
    });

    // Event listener for page load
    window.addEventListener('load', function() {
        // Start scanning the page again when it's fully loaded
        scanPage();
    });
})();
