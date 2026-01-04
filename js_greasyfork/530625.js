// ==UserScript==
// @name         Zillow Price Per Sqft
// @namespace    https://github.com/appel/userscripts
// @version      0.1
// @description  Calculates and shows price per sqft for Zillow listings. Updates every 5 seconds.
// @author       Ap
// @match        https://www.zillow.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zillow.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530625/Zillow%20Price%20Per%20Sqft.user.js
// @updateURL https://update.greasyfork.org/scripts/530625/Zillow%20Price%20Per%20Sqft.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to handle price conversion from formats like $1.25M or $200K
    function convertPrice(priceText) {
        let price = parseFloat(priceText.replace(/[^\d.-]/g, '')); // Remove non-numeric characters
        if (priceText.includes('M')) {
            price *= 1e6; // Convert million (M) to numeric value
        } else if (priceText.includes('K')) {
            price *= 1e3; // Convert thousand (K) to numeric value
        }
        return price;
    }

    // Function to calculate price per sqft for listings
    function calculatePricePerSqft() {
        // Select all list items that are part of the photo-cards
        const listItems = document.querySelectorAll('ul.photo-cards li');
        // console.log(`Found ${listItems.length} listings`);

        // Loop through each item
        listItems.forEach(item => {
            // Check if the price per sqft is already added to avoid duplication
            if (item.querySelector('.price-per-sqft')) {
                return; // Skip if already processed
            }

            // console.log('Processing a new item');

            // Use more flexible selectors with wildcards for price elements
            const priceElement = item.querySelector('[class*="PropertyCardWrapper__StyledPriceLine"]');

            // Select the list item containing sqft (using nth-child)
            const sqftElement = item.querySelector('li:nth-child(3) b');

            // Log the price and sqft elements to verify
            /* if (priceElement) {
                console.log('Price element found:', priceElement.textContent.trim());
            } else {
                console.log('Price element not found');
            }
            if (sqftElement) {
                console.log('Sqft element found:', sqftElement.textContent.trim());
            } else {
                console.log('Sqft element not found');
            } */

            // Proceed only if both price and sqft exist
            if (priceElement && sqftElement) {
                // Extract price and sqft values
                const priceText = priceElement.textContent.trim();
                const sqftText = sqftElement.textContent.trim().replace(/[^\d.-]/g, ''); // Remove non-numeric characters

                // console.log(`Price: ${priceText}, Sqft: ${sqftText}`);

                // Convert price and sqft values
                const price = convertPrice(priceText);
                const sqft = parseFloat(sqftText.replace(',', ''));

                // Calculate price per sqft
                if (!isNaN(price) && !isNaN(sqft) && sqft > 0) {
                    const pricePerSqft = Math.round(price / sqft);
                    // console.log(`Calculated price per sqft: $${pricePerSqft}`);

                    // Create the new text node for price per sqft
                    const pricePerSqftText = ` - $${pricePerSqft}/sqft`;

                    // Create the span element
                    const pricePerSqftNode = document.createElement('span');
                    pricePerSqftNode.textContent = pricePerSqftText;
                    pricePerSqftNode.classList.add('price-per-sqft'); // Add a class to prevent duplicates

                    // Apply styles directly to the span element
                    pricePerSqftNode.style.color = '#5467f5';
                    pricePerSqftNode.style.fontSize = '11px';

                    // Add it after the sqft information
                    sqftElement.parentElement.appendChild(pricePerSqftNode);
                    // console.log('Price per sqft added to the listing');
                // } else {
                    // console.log('Invalid price or sqft data');
                }
            }
        });
    }

    // Set an interval to run the script every 5 seconds
    setInterval(calculatePricePerSqft, 5000);

})();