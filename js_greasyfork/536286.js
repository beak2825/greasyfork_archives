// ==UserScript==
// @name         Tronscan Transfers Summary
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Summarizes total outgoing and incoming transfers on Tronscan's transfers page with a button trigger
// @author       DevZam
// @match        https://tronscan.org/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536286/Tronscan%20Transfers%20Summary.user.js
// @updateURL https://update.greasyfork.org/scripts/536286/Tronscan%20Transfers%20Summary.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Step 1: Check if the current page is the transfers tab
    if (!window.location.href.includes('/transfers')) {
        return; // Silently exit if not on transfers page
    }

    // Create a button to trigger the summary
    const triggerButton = document.createElement('button');
    triggerButton.textContent = 'Calculate Transfers Summary';
    triggerButton.style.position = 'fixed';
    triggerButton.style.top = '10px';
    triggerButton.style.right = '10px';
    triggerButton.style.padding = '10px';
    triggerButton.style.backgroundColor = '#4CAF50';
    triggerButton.style.color = '#fff';
    triggerButton.style.border = 'none';
    triggerButton.style.borderRadius = '5px';
    triggerButton.style.cursor = 'pointer';
    triggerButton.style.zIndex = '1000';

    // Create a div to display the results
    const resultDiv = document.createElement('div');
    resultDiv.style.position = 'fixed';
    resultDiv.style.top = '50px';
    resultDiv.style.right = '10px';
    resultDiv.style.backgroundColor = '#fff';
    resultDiv.style.padding = '10px';
    resultDiv.style.border = '1px solid #000';
    resultDiv.style.zIndex = '1000';
    resultDiv.style.maxWidth = '300px';
    resultDiv.style.display = 'none'; // Hidden until calculation

    // Append button and result div to the page
    document.body.appendChild(triggerButton);
    document.body.appendChild(resultDiv);

    // Button click event to calculate and display summary
    triggerButton.addEventListener('click', () => {
        // Step 2: Get all token-amount elements and extract amounts with signs
        const amountDomList = document.querySelectorAll('.token-amount .text-truncate');
        let incomingSum = 0;
        let outgoingSum = 0;

        amountDomList.forEach((element) => {
            // Get the text content (e.g., "+10" or "-10")
            const text = element.textContent.trim();
            // Extract the sign and amount
            const sign = text.startsWith('+') ? '+' : '-';
            const amount = parseFloat(text.replace(/[^0-9.]/g, '')) || 0; // Remove non-numeric chars except decimal

            // Step 3: Add to incoming or outgoing sum based on sign
            if (sign === '+') {
                incomingSum += amount;
            } else {
                outgoingSum += amount;
            }
        });

        // Display the results
        resultDiv.innerHTML = `
            <strong>Transfers Summary (Current Page):</strong><br>
            Total ↓: ${incomingSum.toFixed(3)}<br>
            Total ↑: ${outgoingSum.toFixed(3)}
        `;
        resultDiv.style.display = 'block'; // Show the result div
    });
})();