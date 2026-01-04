// ==UserScript==
// @name         Item Market Percentage Display (PDA Optimized)
// @namespace    http://tampermonkey.net/
// @version      5.13.2
// @description  Display percentage above/below market value for items in Torn's item market, optimized for TornPDA.
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519704/Item%20Market%20Percentage%20Display%20%28PDA%20Optimized%29.user.js
// @updateURL https://update.greasyfork.org/scripts/519704/Item%20Market%20Percentage%20Display%20%28PDA%20Optimized%29.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    const API_KEY = "yRKh6qQXDZsnHvcy"; // Replace with your actual API key
    const itemMapping = {}; // Name-to-ID mapping
    const cachedMarketValues = {}; // Cache to store market values for items
 
    // Function to fetch all market values at once
    async function fetchAllMarketValues() {
    try {
        // Fetch all item data from the API
        const response = await fetch(`https://api.torn.com/torn/?selections=items&key=${API_KEY}`);
        const data = await response.json();
 
        if (data && data.items) {
            for (const [id, item] of Object.entries(data.items)) {
                // Populate name-to-ID mapping
                itemMapping[item.name] = parseInt(id, 10);
 
                // Populate market value cache
                if (item.market_value) {
                    cachedMarketValues[parseInt(id, 10)] = item.market_value;
                }
            }
            console.log("Item mapping and market values populated:", {
                itemMapping,
                cachedMarketValues,
            });
        } else {
            console.error("Failed to fetch items data:", data);
        }
    } catch (error) {
        console.error("Error fetching items data:", error);
    }
    }
 
    // Function to update percentage box with only the percentage difference
    function updatePercentageBox(title, marketValue, currentPrice) {
        const percentageDifference = (((currentPrice - marketValue) / marketValue) * 100).toFixed(2);
 
        let percentageBox = title.querySelector('.percentage-box');
        if (!percentageBox) {
            // Create the percentage box if it doesn't exist
            percentageBox = document.createElement('div');
            percentageBox.className = 'percentage-box';
            percentageBox.style.marginTop = '5px';
            percentageBox.style.fontSize = '12px';
            title.appendChild(percentageBox);
        }
 
        // Reset font size and style
        percentageBox.style.fontSize = '12px';
        percentageBox.style.fontWeight = 'normal';
 
        // Determine text color
        let boxColor = '';
        if (percentageDifference > 4) {
            boxColor = 'red';
        } else if (percentageDifference > 3) {
            boxColor = 'orange';
        } else if (percentageDifference > 2) {
            boxColor = 'yellow';
        } else if (percentageDifference > 0) {
            boxColor = 'green';
        } else {
            boxColor = 'green';
            percentageBox.style.fontWeight = 'bold';
            // percentageBox.style.fontSize = '16px';
        }
 
        // Update the content of the percentage box
        percentageBox.textContent = `${percentageDifference}%`;
        percentageBox.style.color = boxColor;
        
         // Highlight items meeting specific conditions
        if (currentPrice > 500000 && percentageDifference < -2) {
            const itemTile = title.closest('.itemTile___cbw7w');
            if (itemTile) {
                highlightItemTile(itemTile);
            }
        }
        else if (percentageDifference < -2) {
            percentageBox.style.fontWeight = 'bold';
            percentageBox.style.fontSize = '18px';
            percentageBox.style.color = "#ffffa4"
            percentageBox.style.backgroundColor = "green";
        }
    }
    
    function highlightItemTile(tile) {
        tile.style.backgroundColor = "#d4f7d4"; // Pale green background
        tile.style.color = "black";

        tile.querySelectorAll('*').forEach((child) => {
        child.style.color = "black"; // Ensure all child elements have black font
        });

    }

    
 
    // Function to process items and update their details
    function processItems() {
        const itemListWrapper = document.querySelector('.itemListWrapper___ugBOt');
        if (!itemListWrapper) {
            console.log('Item list wrapper not found.');
            return;
        }
 
        itemListWrapper.querySelectorAll('.title___bQI0h').forEach((title) => {
            const itemNameContainer = title.querySelector('.name___ukdHN');
            const priceContainer = title.querySelector('.priceAndTotal___eEVS7 span');
 
            if (!itemNameContainer || !priceContainer) return;
 
            const itemName = itemNameContainer.textContent.trim();
            const currentPrice = parseFloat(priceContainer.textContent.replace(/[^0-9.-]/g, ''));
            const itemId = itemMapping[itemName];
 
            if (itemId && cachedMarketValues[itemId] !== undefined) {
                const marketValue = cachedMarketValues[itemId];
                updatePercentageBox(title, marketValue, currentPrice);
            }
        });
    }
 
    // Throttled observer callback to reduce DOM manipulation frequency
    const throttle = (callback, delay) => {
        let lastCall = 0;
        return (...args) => {
            const now = Date.now();
            if (now - lastCall >= delay) {
                lastCall = now;
                callback(...args);
            }
        };
    };
 
    // Observe for changes in the DOM
    const observer = new MutationObserver(throttle(() => {
        processItems();
    }, 500));
 
    observer.observe(document.querySelector('.itemListWrapper___ugBOt') || document.body, {
        childList: true,
        subtree: true,
    });
 
    // Initialize script
    (async () => {
        console.log('Fetching all market values...');
        await fetchAllMarketValues();
        console.log('Market values fetched:', cachedMarketValues);
        processItems();
    })();
})();