// ==UserScript==
// @name         Google Flights Colored Prices
// @namespace    http://tampermonkey.net/
// @version      2.1
// @license      MIT
// @description  Colors prices in a webpage based on their numerical value.
// @match        https://www.google.com/travel/*
// @grant        none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/530724/Google%20Flights%20Colored%20Prices.user.js
// @updateURL https://update.greasyfork.org/scripts/530724/Google%20Flights%20Colored%20Prices.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract the numerical price from the text.
    function extractPrice(priceText) {
        try {
            // Trim the text to remove leading/trailing spaces
            const trimmedText = priceText.trim();
            // Remove the currency symbol (€) and any spaces
            let cleanedPriceText = trimmedText.replace(/€|\s/g, '');
            // Use parseFloat to convert the cleaned text to a floating-point number
            let price = parseFloat(cleanedPriceText.replace(',', '.'));
            return isNaN(price) ? null : price; // Return null if not a valid number
        } catch (error) {
            console.error(`Error extracting price from text "${priceText}":`, error);
            return null; // Return null on error
        }
    }

    // Function to determine the color based on the price.
    function getColor(price, minPrice, maxPrice) {
        if (price === null) return 'black'; // Default color for invalid prices

        try {
            // Calculate the normalized price (0 to 1 range).
            const normalizedPrice = (price - minPrice) / (maxPrice - minPrice);
            // Clamp the normalized value to ensure it's within the 0-1 range.
            const clampedPrice = Math.max(0, Math.min(1, normalizedPrice));

            let red, green;
            if (clampedPrice < 0.1) { // 0-10%: Darkest Green
                red = 0;
                green = 150;
            } else if (clampedPrice < 0.2) { // 10-20%: Dark Orange
                red = 255;
                green = 120;
            } else if (clampedPrice < 0.5) { // 20-50%: Darker Orange
                red = 255;
                green = 60;
            }else { // 50-100%: Darkest Red
                red = 200;
                green = 0;
            }
            return `rgb(${red}, ${green}, 0)`;
        } catch (error) {
            console.error(`Error calculating color for price ${price}:`, error);
            return 'black'; // Return default color on error
        }
    }

    // Function to find the minimum and maximum prices.
    function findMinMaxPrices(priceElements) {
        let minPrice = Infinity;
        let maxPrice = -Infinity;
        let validPricesFound = false; // Track if any valid price is found

        try {
            priceElements.forEach(element => {
                const priceText = element.textContent.trim();
                const price = extractPrice(priceText);
                if (price !== null) { // Only process valid prices
                    minPrice = Math.min(minPrice, price);
                    maxPrice = Math.max(maxPrice, price);
                    validPricesFound = true;
                }
            });
        } catch (error) {
            console.error("Error finding min/max prices:", error);
            return { min: 0, max: 100, found: false }; // Return default on error
        }

        // If no valid prices were found, return default values to avoid errors.
        if (!validPricesFound) {
            return { min: 0, max: 100, found: false }; // Return a flag indicating no prices found
        }
        return { min: minPrice, max: maxPrice, found: true };
    }

    // Main function to process the price elements.
    function processPrices() {
        try {
            // Select all elements that contain the price.
            const priceElements = document.querySelectorAll('.CylAxb.n3qw7.UNMzKf.julK3b');

            if (!priceElements || priceElements.length === 0) {
                console.log("No price elements found with the specified selector.");
                return; // Exit if no matching elements are found
            }

            const { min, max, found } = findMinMaxPrices(priceElements);
            if (!found) {
                console.log("No valid prices found.");
                return; // Exit if no valid prices are found
            }

            priceElements.forEach(element => {
                try {
                    const priceText = element.textContent.trim();
                    const price = extractPrice(priceText);
                    if (price !== null) {
                        const color = getColor(price, min, max);
                        element.style.color = color;
                        if (price <= (min + (max-min) * 0.05))
                        {
                           element.style.color = 'black';
                           element.style.backgroundColor = '#00ff26';
                           element.style.outline = '3px solid #00ff26';
                           element.style.borderRadius = '25px';
                        }
                        else
                        {
                           element.style.backgroundColor = '';
                           element.style.outline = '';
                        }

                    } else {
                        element.style.color = 'black';
                        element.style.backgroundColor = '';
                        element.style.outline = '';
                    }
                } catch (elementError) {
                    console.error("Error processing a price element:", elementError);
                }
            });

        } catch (error) {
            console.error("Error in processPrices:", error);
        }
    }

    // Run the script.
    processPrices();

    // Optional: MutationObserver to handle dynamically loaded content (AJAX, etc.)
    const observer = new MutationObserver(mutations => {
        try {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    processPrices(); // Re-run price processing when new nodes are added
                }
            });
        } catch (error) {
            console.error("Error in MutationObserver callback:", error);
        }
    });

    // Start observing the document body (or a more specific container if possible)
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
