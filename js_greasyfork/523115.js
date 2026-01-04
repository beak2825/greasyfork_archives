// ==UserScript==
// @name         Rank Sainsbury's Items By £/weight
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Get best value for money when shopping with Sainsbury's
// @author       You
// @match        https://www.sainsburys.co.uk/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523115/Rank%20Sainsbury%27s%20Items%20By%20%C2%A3weight.user.js
// @updateURL https://update.greasyfork.org/scripts/523115/Rank%20Sainsbury%27s%20Items%20By%20%C2%A3weight.meta.js
// ==/UserScript==

(function() {
    function convertToPoundsPerKg(priceStr) {
        const regex = /£(\d+\.\d+) \/ (g|kg)/;
        const match = priceStr.match(regex);

        if (!match) {
            return null; // Invalid input format
        }

        const price = parseFloat(match[1]);
        const unit = match[2];

        if (unit === 'g') {
            return price * 1000; // Convert g to kg
        } else if (unit === 'kg') {
            return price;
        } else {
            return null; // Invalid unit
        }
    }

    'use strict';

    const triggerButton = document.createElement('button');
    triggerButton.textContent = 'Get Ranking';
    triggerButton.classList.add('trigger-button'); // Add a CSS class for styling

    // Style the button (you can customize this)
    triggerButton.style.position = 'fixed';
    triggerButton.style.bottom = '20px';
    triggerButton.style.left = '20px';
    triggerButton.style.padding = '10px 20px';
    triggerButton.style.background = '#007bff';
    triggerButton.style.color = 'white';
    triggerButton.style.border = 'none';
    triggerButton.style.borderRadius = '5px';
    triggerButton.style.cursor = 'pointer';


    function createBadge(count) {
        const badge = document.createElement('div');
        badge.classList.add('badge');
        badge.textContent = count;
        return badge;
    }

    const style = document.createElement('style');
    style.textContent = `
  .badge {
    border-radius: 5px; /* Adjust for desired roundness */
    padding: 5px 10px; /* Adjust for square-like shape */
    font-size: 15px;
    display: inline-block;
    margin-left: 5px;
  }
`;
    document.head.appendChild(style);

    // Add an event listener to the button
    triggerButton.addEventListener('click', () => {
        // Replace 'your-data-testid-base' with the base part of the data-testid
        const targetDataTestIdBase = 'product-tile-';

        // Use a regular expression to match the data-testid pattern
        const regex = new RegExp(`^${targetDataTestIdBase}-\\d+$`);

        // Find all elements and filter based on the regex
        const fields = Array.from(document.querySelectorAll('article')).filter(element => element.hasAttribute('data-testid'));

        // Create a dictionary to store data-testids
        const dataTestIdDictionary = {};

        // Populate the dictionary
        fields.forEach(article => {
            const span = article.querySelector(`span[data-testid="pt-unit-price"]`);

            if (span) {
                // Extract and log the text content
                const spanText = span.textContent.trim();
                dataTestIdDictionary[article.getAttribute('data-testid')] = spanText;
            }
        });

        const pricePerKgDictionary = {};

        for (const key in dataTestIdDictionary) {
            const priceStr = dataTestIdDictionary[key];
            const pricePerKg = convertToPoundsPerKg(priceStr);

            if (pricePerKg !== null) {
                pricePerKgDictionary[key] = pricePerKg;
            }
        }

        // Sort the dictionary by values (ascending order)
        const sortedEntries = Object.entries(pricePerKgDictionary).sort((a, b) => a[1] - b[1]);

        for (let i = 0; i < sortedEntries.length; i++) {
            const item = Array.from(document.querySelectorAll('article')).find(element => element.hasAttribute('data-testid') && element.getAttribute('data-testid') == sortedEntries[i][0]);
            const price = item.querySelector(`span[data-testid="pt-unit-price"]`);
            const parent = price.parentElement;
            const badgeExists = parent.querySelector('div[class="badge"]');
            if (!badgeExists){
                const badgeElement = createBadge(`(${i + 1})`);
                // Calculate the green-to-red gradient
                const red = Math.floor(255 * i / (sortedEntries.length - 1));
                const green = 255 - red;
                badgeElement.style.backgroundColor = `rgb(${red}, ${green}, 0)`;
                parent.appendChild(badgeElement);
            }
        }
    });

    // Append the button to the document body (or any other desired parent element)
    document.body.appendChild(triggerButton);
})();