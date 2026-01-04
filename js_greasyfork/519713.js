// ==UserScript==
// @name         Combined Item Market Percentage Display (NO PDA)
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Display percentage above/below market value for items in Torn's item market, including seller listings and main market page.
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519713/Combined%20Item%20Market%20Percentage%20Display%20%28NO%20PDA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/519713/Combined%20Item%20Market%20Percentage%20Display%20%28NO%20PDA%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const API_KEY = "yRKh6qQXDZsnHvcy"; // Replace with your actual API key
    const itemMapping = {}; // Name-to-ID mapping
    const cachedMarketValues = {}; // Cache for market values

async function fetchAndPopulateItemMappingAndMarketValues() {
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

// Call this function during script initialization
fetchAndPopulateItemMappingAndMarketValues();



    // Update percentage box for seller listings
    function updatePercentageBoxSeller(row, marketValue, currentPrice) {
        const percentageDifference = (((currentPrice - marketValue) / marketValue) * 100).toFixed(2);

        let percentageBox = row.querySelector('.percentage-box');
        if (!percentageBox) {
            percentageBox = document.createElement('div');
            percentageBox.className = 'percentage-box';
            percentageBox.style.marginTop = '5px';
            percentageBox.style.fontSize = '12px';
            row.appendChild(percentageBox);
        }
/*
        let boxColor = 'green';
        if (percentageDifference > 0) {
            boxColor = percentageDifference > 4 ? 'red' : percentageDifference > 3 ? 'orange' : 'yellow';
        }
*/
        let boxColor = percentageDifference > 4 ? 'red' : percentageDifference > 3 ? 'orange' : percentageDifference > 2 ? 'yellow' : 'green';

        percentageBox.textContent = `${percentageDifference}%`;
        percentageBox.style.color = boxColor;
    }


    async function processSellerListings() {
        const sellerRows = document.querySelectorAll('.sellerRow___AI0m6');
        if (sellerRows.length === 0) return;

        const currentItem = document.querySelector('.thumbnail___M_h9v img');
        const itemName = currentItem ? currentItem.alt : null;
        const itemId = itemMapping[itemName];

        if (!itemId) return;

        let marketValue = cachedMarketValues[itemId];
        if (!marketValue) return; // Exit if market value is not available

        sellerRows.forEach((row) => {
            const priceElement = row.querySelector('.price___Uwiv2');
            if (!priceElement) return;

            const currentPrice = parseFloat(priceElement.textContent.replace(/[^0-9.]/g, ''));
            updatePercentageBoxSeller(row, marketValue, currentPrice);
    });
}



    function highlightItemTile(tile) {
        tile.style.backgroundColor = "#d4f7d4"; // Pale green background
        tile.style.color = "black";

        tile.querySelectorAll('*').forEach((child) => {
        child.style.color = "black"; // Ensure all child elements have black font
        });

    }

    // Update percentage box for main market page
    function updatePercentageBoxMain(title, marketValue, currentPrice) {
        const percentageDifference = (((currentPrice - marketValue) / marketValue) * 100).toFixed(2);

        let percentageBox = title.querySelector('.percentage-box');
        if (!percentageBox) {
            percentageBox = document.createElement('div');
            percentageBox.className = 'percentage-box';
            percentageBox.style.marginTop = '5px';
            percentageBox.style.fontSize = '12px';
            title.appendChild(percentageBox);
        }

        let boxColor = percentageDifference > 4 ? 'red' : percentageDifference > 3 ? 'orange' : percentageDifference > 2 ? 'yellow' : 'green';
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

    // Process main market items
    function processItemsMain() {
        const itemListWrapper = document.querySelector('.itemListWrapper___ugBOt');
        if (!itemListWrapper) return;

        itemListWrapper.querySelectorAll('.title___bQI0h').forEach((title) => {
            const itemNameContainer = title.querySelector('.name___ukdHN');
            const priceContainer = title.querySelector('.priceAndTotal___eEVS7 span');

            if (!itemNameContainer || !priceContainer) return;

            const itemName = itemNameContainer.textContent.trim();
            const currentPrice = parseFloat(priceContainer.textContent.replace(/[^0-9.-]/g, ''));
            const itemId = itemMapping[itemName];

            if (itemId && cachedMarketValues[itemId] !== undefined) {
                const marketValue = cachedMarketValues[itemId];
                updatePercentageBoxMain(title, marketValue, currentPrice);
            }
        });
    }

    // Observe DOM changes and trigger updates
    const observer = new MutationObserver(() => {
        processSellerListings();
        processItemsMain();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    // Initialize the script
    (async () => {
        await fetchAllMarketValues();
        processSellerListings();
        processItemsMain();
    })();
})();