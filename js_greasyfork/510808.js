// ==UserScript==
// @name         Reddit Upvote/Downvote Calculator with Formula Display
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  A tool to calculate upvotes and downvotes based on net score and upvote rate on Reddit, displaying the formulas used for calculations.
// @author       FunkyJustin
// @license      MIT
// @match        *://*.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510808/Reddit%20UpvoteDownvote%20Calculator%20with%20Formula%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/510808/Reddit%20UpvoteDownvote%20Calculator%20with%20Formula%20Display.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Create GUI elements
    const calculatorContainer = document.createElement('div');
    calculatorContainer.style.position = 'fixed';
    calculatorContainer.style.top = '10px';
    calculatorContainer.style.right = '10px';
    calculatorContainer.style.zIndex = '9999';
    calculatorContainer.style.backgroundColor = '#282a36'; // Dark background
    calculatorContainer.style.border = '1px solid #44475a'; // Slightly lighter border
    calculatorContainer.style.padding = '10px';
    calculatorContainer.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    calculatorContainer.style.borderRadius = '5px';
    calculatorContainer.style.color = '#f8f8f2'; // Light text color

    const title = document.createElement('h3');
    title.innerText = 'Upvote/Downvote Calculator';
    title.style.color = '#50fa7b'; // Green color for title
    calculatorContainer.appendChild(title);

    const netVotesLabel = document.createElement('label');
    netVotesLabel.innerText = 'Net Votes: ';
    calculatorContainer.appendChild(netVotesLabel);

    const netVotesInput = document.createElement('input');
    netVotesInput.type = 'number';
    netVotesInput.placeholder = 'Enter net votes';
    calculatorContainer.appendChild(netVotesInput);
    calculatorContainer.appendChild(document.createElement('br'));

    const upvoteRateLabel = document.createElement('label');
    upvoteRateLabel.innerText = 'Upvote Rate (%): ';
    calculatorContainer.appendChild(upvoteRateLabel);

    const upvoteRateInput = document.createElement('input');
    upvoteRateInput.type = 'number';
    upvoteRateInput.placeholder = 'Enter upvote rate';
    calculatorContainer.appendChild(upvoteRateInput);
    calculatorContainer.appendChild(document.createElement('br'));

    const calculateButton = document.createElement('button');
    calculateButton.innerText = 'Calculate';
    calculateButton.style.backgroundColor = '#6272a4'; // Button background color
    calculateButton.style.color = '#f8f8f2'; // Button text color
    calculateButton.style.border = 'none';
    calculateButton.style.padding = '5px 10px';
    calculateButton.style.cursor = 'pointer';
    calculatorContainer.appendChild(calculateButton);

    const resultContainer = document.createElement('div');
    calculatorContainer.appendChild(resultContainer);

    // Formula display for the formulas
    const formulaContainer = document.createElement('div');
    formulaContainer.style.marginTop = '10px';
    formulaContainer.innerHTML = '<strong>Formulas:</strong><br>';
    calculatorContainer.appendChild(formulaContainer);

    document.body.appendChild(calculatorContainer);

    // Calculate function
    calculateButton.addEventListener('click', () => {
        const netVotes = parseFloat(netVotesInput.value);
        const upvoteRate = parseFloat(upvoteRateInput.value) / 100;

        if (isNaN(netVotes) || isNaN(upvoteRate)) {
            resultContainer.innerText = 'Please enter valid numbers.';
            resultContainer.style.color = '#ff5555'; // Red color for error message
            return;
        }

        // Solve for total votes (T)
        let totalVotes = netVotes / upvoteRate;
        totalVotes = Math.round(totalVotes);

        // Calculate Upvotes (U) and Downvotes (D)
        const upvotes = Math.round(upvoteRate * totalVotes);
        const downvotes = totalVotes - upvotes;

        // Display results
        resultContainer.innerHTML = `
            <strong>Results:</strong><br>
            Total Votes: ${totalVotes}<br>
            Upvotes: ${upvotes}<br>
            Downvotes: ${downvotes}
        `;
        resultContainer.style.color = '#f8f8f2'; // Ensure results text is light

        // Update the formula display
        formulaContainer.innerHTML = `
            <strong>Formulas:</strong><br>
            1. Total Votes (T) = Net Votes (N) / Upvote Rate (U)<br>
            2. Upvotes (U) = Total Votes (T) × Upvote Rate (U)<br>
            3. Downvotes (D) = Total Votes (T) - Upvotes (U)
        `;

        // Add some styling for the formulas
        formulaContainer.style.color = '#f8f8f2'; // Ensure formulas text is light
        formulaContainer.style.fontFamily = 'monospace'; // Use monospace font for clarity
        formulaContainer.style.lineHeight = '1.5'; // Add line height for readability
    });
})();
