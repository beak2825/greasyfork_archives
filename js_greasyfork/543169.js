// ==UserScript==
// @name         Torn.com - Item Market Deal Finder
// @namespace    https://greasyfork.org/users/YOUR-GREASYFORK-USER-ID
// @version      0.2
// @description  Highlights items on Torn.com's Item Market that are significantly below their average market value (via Torn API).
// @author       Your Name
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/543169/Torncom%20-%20Item%20Market%20Deal%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/543169/Torncom%20-%20Item%20Market%20Deal%20Finder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_KEY_STORAGE_NAME = 'torn_api_key';
    const AVERAGE_PRICES_STORAGE_NAME = 'torn_item_average_prices';
    const API_KEY_LAST_FETCH_TIME = 'torn_api_last_fetch';
    const AVERAGE_FETCH_INTERVAL_MS = 1 * 60 * 60 * 1000; // Fetch averages every 1 hour
    const DEAL_THRESHOLD_PERCENT = 10; // Highlight if current price is X% or more below average

    let tornApiKey = GM_getValue(API_KEY_STORAGE_NAME, null);
    let allItemAverages = GM_getValue(AVERAGE_PRICES_STORAGE_NAME, null);

    // --- Helper to fetch data from Torn API ---
    function fetchTornAPI(selection, callback, errorCallback = (err) => console.error("Torn API Error:", err)) {
        if (!tornApiKey) {
            console.warn("Torn API Key not set. Cannot fetch API data.");
            return;
        }

        const url = `https://api.torn.com/torn/?selections=${selection}&key=${tornApiKey}`;
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.error) {
                        errorCallback(data.error.error || "Unknown API error");
                        return;
                    }
                    callback(data);
                } catch (e) {
                    errorCallback("Failed to parse API response: " + e.message);
                }
            },
            onerror: function(response) {
                errorCallback("Network or HTTP error: " + response.statusText);
            }
        });
    }

    // --- Function to get and store API Key ---
    function getApiKey() {
        if (!tornApiKey) {
            tornApiKey = prompt("Please enter your Torn API Key to enable the Market Deal Finder. You can find it in your Torn settings -> API Keys. This will be stored locally.");
            if (tornApiKey) {
                GM_setValue(API_KEY_STORAGE_NAME, tornApiKey);
                console.log("Torn API Key saved.");
                fetchAndStoreAllItemAverages(); // Fetch averages immediately after key is set
            } else {
                console.warn("Torn API Key not provided. Market Deal Finder will not function fully.");
            }
        }
    }

    // --- Function to fetch and store all item averages ---
    function fetchAndStoreAllItemAverages() {
        const lastFetchTime = GM_getValue(API_KEY_LAST_FETCH_TIME, 0);
        if (Date.now() - lastFetchTime < AVERAGE_FETCH_INTERVAL_MS && allItemAverages) {
            console.log("Torn Market Deal Finder: Using cached item average prices.");
            processMarketItems(); // Process market immediately if averages are cached
            return;
        }

        console.log("Torn Market Deal Finder: Fetching all item average prices from API...");
        fetchTornAPI('items', (data) => {
            if (data.items) {
                allItemAverages = {};
                for (const itemId in data.items) {
                    if (data.items.hasOwnProperty(itemId)) {
                        allItemAverages[data.items[itemId].name] = data.items[itemId].market_value;
                    }
                }
                GM_setValue(AVERAGE_PRICES_STORAGE_NAME, allItemAverages);
                GM_setValue(API_KEY_LAST_FETCH_TIME, Date.now());
                console.log("Torn Market Deal Finder: Item average prices updated.");
                processMarketItems(); // Process market after fetching new averages
            }
        }, (error) => {
            console.error("Torn Market Deal Finder: Error fetching item averages:", error);
            // Attempt to process market items even if fetch failed, using old data if available
            if (allItemAverages) {
                processMarketItems();
            }
        });
    }

    // --- Function to process market items on the page ---
    function processMarketItems() {
        if (!allItemAverages) {
            console.log("Torn Market Deal Finder: Item average prices not available yet. Waiting...");
            return;
        }

        console.log("Torn Market Deal Finder: Processing visible market items...");

        // Select the table rows in the item market.
        // The specific selector might need adjustment if Torn's HTML structure changes.
        // Look for rows that represent an item listing.
        const itemRows = document.querySelectorAll('.items-wrap .item.fleft'); // Adjust selector as needed

        if (itemRows.length === 0) {
            console.log("Torn Market Deal Finder: No item rows found on the page yet. Waiting for content...");
            return;
        }

        itemRows.forEach(row => {
            // Find item name
            // The structure is complex, might need to traverse parents/children or find specific classes.
            // Example: <a class="item-name" href="...">Item Name</a>
            const itemNameElement = row.querySelector('.item-name');
            const itemName = itemNameElement ? itemNameElement.textContent.trim() : null;

            // Find current price
            // Example: <span class="cost">$1,234</span>
            const itemPriceElement = row.querySelector('.price'); // Class might be 'cost' or similar
            let currentPrice = itemPriceElement ? parseInt(itemPriceElement.textContent.replace(/[$,]/g, '')) : 0;

            if (itemName && currentPrice > 0) {
                const averagePrice = allItemAverages[itemName];

                if (averagePrice && averagePrice > 0) {
                    const discountPercentage = ((averagePrice - currentPrice) / averagePrice) * 100;

                    if (discountPercentage >= DEAL_THRESHOLD_PERCENT) {
                        console.log(`DEAL FOUND: ${itemName} - Current: $${currentPrice}, Avg: $${averagePrice}, Discount: ${discountPercentage.toFixed(2)}%`);

                        // Highlight the row or add a deal indicator
                        // You can adjust the styling as desired
                        row.style.backgroundColor = 'rgba(0, 255, 0, 0.1)'; // Light green background
                        row.style.border = '1px solid green';

                        // Add a "DEAL!" label
                        let dealLabel = row.querySelector('.torn-deal-label');
                        if (!dealLabel) {
                            dealLabel = document.createElement('span');
                            dealLabel.className = 'torn-deal-label';
                            dealLabel.textContent = `DEAL! (-${discountPercentage.toFixed(0)}%)`;
                            dealLabel.style.cssText = `
                                background-color: #ffc107; /* Amber */
                                color: black;
                                padding: 2px 5px;
                                border-radius: 3px;
                                margin-left: 10px;
                                font-size: 0.8em;
                                font-weight: bold;
                            `;
                            // Find a good place to append the label, e.g., next to the item name
                            itemNameElement.parentElement.appendChild(dealLabel);
                        }
                    } else {
                        // Remove previous highlighting if it's no longer a deal (e.g., page re-renders)
                        row.style.backgroundColor = '';
                        row.style.border = '';
                        const dealLabel = row.querySelector('.torn-deal-label');
                        if (dealLabel) {
                            dealLabel.remove();
                        }
                    }
                }
            }
        });
    }

    // --- Observe for DOM changes on the market page ---
    // The market page is a SPA, so content loads dynamically.
    // We need to wait for the items to appear in the DOM.
    const observer = new MutationObserver((mutationsList, observer) => {
        // Look for changes within the main item list container
        const itemContainer = document.querySelector('.items-wrap'); // Main container for items
        if (itemContainer && itemContainer.children.length > 0) {
            // If items are present, process them
            processMarketItems();
        }
    });

    // Start observing the body for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // --- Initial setup ---
    getApiKey(); // Prompt for API key if not present
    fetchAndStoreAllItemAverages(); // Fetch/update average prices

    // Also run processing after a short delay in case initial load is quick
    setTimeout(processMarketItems, 1500);

})();
