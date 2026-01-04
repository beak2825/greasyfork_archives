// ==UserScript==
// @name         Revenue Universe Hourly Rate Calculator
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Convert points to dollars and calculate hourly rates on Revenue Universe website
// @author       DevDad
// @match        https://wall.revenueuniverse.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505962/Revenue%20Universe%20Hourly%20Rate%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/505962/Revenue%20Universe%20Hourly%20Rate%20Calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Converts points to dollars
    function convertPointsToDollars(points) {
        return (points * 0.001).toFixed(2); // 100 points = 10 cents, so 1 point = 0.10 dollars
    }

    // Parses time in minutes from text
    function parseTime(text) {
        const minutesMatch = text.match(/(\d+)\s*min/);
        return minutesMatch ? parseInt(minutesMatch[1]) : 0;
    }

    // Calculate hourly rate and color scale from red to green
    function calculateHourlyRate() {
        const cards = document.querySelectorAll('a.information__card');
        cards.forEach(card => {
            const pointsText = card.querySelector('.information__card-price').textContent.trim();
            const timeText = card.querySelector('.information__card-time').textContent.trim();

            const points = parseInt(pointsText.replace(/,/g, ''));
            const timeInMinutes = parseTime(timeText);
            const dollars = parseFloat(convertPointsToDollars(points));

            if (timeInMinutes > 0 && dollars > 0) {
                const hourlyRate = (dollars / timeInMinutes) * 60;

                // Determine color based on hourly rate
                const rateScale = Math.min(Math.max(hourlyRate / 15, 0), 1); // scale 0 to 1, with $15/hr being 1
                const red = Math.round(255 * (1 - rateScale));
                const green = Math.round(255 * rateScale);
                const color = `rgb(${red}, ${green}, 0)`;

                // Create and style the hourly rate element
                const rateElement = document.createElement('div');
                rateElement.textContent = `$${hourlyRate.toFixed(2)}/hr`;
                rateElement.style.color = color;
                rateElement.style.fontWeight = 'bold';
                rateElement.style.marginTop = '5px';
                rateElement.classList.add('hourly-rate'); // Add class to prevent duplicates

                // Append the hourly rate element to the card
                if (!card.querySelector('.hourly-rate')) {
                    card.querySelector('.information__card-preview').appendChild(rateElement);
                }
            }

            // Convert points to dollars and update text
            card.querySelector('.information__card-price').textContent = `$${convertPointsToDollars(points)}`;
        });
    }

    // Create and style the button
    function createButton() {
        const button = document.createElement('button');
        button.textContent = 'Calculate Rates';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.padding = '10px 20px';
        button.style.backgroundColor = '#007bff';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '1000';

        button.addEventListener('click', calculateHourlyRate);

        document.body.appendChild(button);
    }

    // Initialize the script
    function init() {
        createButton();
    }

    window.addEventListener('load', init);
})();
