// ==UserScript==
// @name         Effective Stats Enhancer
// @namespace    Apo
// @version      1.0
// @description  Calculate and display percentage of relevant stats and align total stats value directly under the label.
// @author       Apollyon [445323]
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514770/Effective%20Stats%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/514770/Effective%20Stats%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to calculate and display percentages
    function displayPercentages() {
        const statsElement = document.querySelector('#effectiveBattleStats main');

        if (!statsElement) {
            console.error("Effective Battle Stats section not found.");
            return;
        }

        const statsRows = statsElement.querySelectorAll('.stats-row');
        let totalStats = 0;
        const relevantStats = ['Strength', 'Defense', 'Speed', 'Dexterity'];
        const statsValues = {};

        // Calculate total stats for relevant stats and store individual values
        statsRows.forEach(row => {
            const statName = row.querySelector('.divider span').textContent.trim();
            const statValue = parseInt(row.querySelector('.desc span').textContent.replace(/,/g, ''), 10);
            if (relevantStats.includes(statName)) {
                statsValues[statName] = statValue;
                totalStats += statValue;
            }
        });

        // Update the DOM with percentages
        statsRows.forEach(row => {
            const statName = row.querySelector('.divider span').textContent.trim();
            if (relevantStats.includes(statName)) {
                const statValue = statsValues[statName];
                const percentage = ((statValue / totalStats) * 100).toFixed(2) + '%';

                // Create a new span element to display the percentage with a pipe divider
                const percentageSpan = document.createElement('span');
                percentageSpan.textContent = ' | ' + percentage; // Add pipe before the percentage
                percentageSpan.style.color = '#1183cd'; // Set color

                // Append the percentage span next to the stat value
                row.querySelector('.desc').appendChild(percentageSpan);
            }
        });
    }

    // Function to align the total stats value
    function alignTotalStats() {
        // Select all stats row elements
        const statsRows = document.querySelectorAll('.stats-row');

        statsRows.forEach(row => {
            // Get the label and value elements
            const labelElement = row.querySelector('.divider span');
            const valueElement = row.querySelector('.desc span');

            // Check if the current row is the Total row
            if (labelElement.innerText === 'Total') {
                // Create a new span for the total value
                const totalSpan = document.createElement('span');
                totalSpan.innerText = valueElement.innerText; // Copy the original total value

                // Clear the existing value elements and replace with the new total span
                const descDiv = row.querySelector('.desc');
                descDiv.innerHTML = ''; // Clear existing content
                descDiv.appendChild(totalSpan); // Append the total span

                // Style the total span to align it like other stats
                totalSpan.style.display = 'block'; // Ensures it behaves like other stat values
                totalSpan.style.textAlign = 'center'; // Center the total span
                totalSpan.style.marginLeft = '0x'; // Add left margin to shift it right
                totalSpan.style.marginRight = '5px'; // Add left margin to shift it righ
            }
        });
    }

    // Wait for the page to fully load before executing the scripts
    window.addEventListener('load', function() {
        displayPercentages();
        alignTotalStats();
    });
})();
