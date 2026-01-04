// ==UserScript==
// @name         Torn Market Price Injector NOAPI
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Inject max price data from API into Torn market listing page
// @author       You
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @grant        GM_xmlhttpRequest
// @connect      lachesislabs.me
// @downloadURL https://update.greasyfork.org/scripts/538645/Torn%20Market%20Price%20Injector%20NOAPI.user.js
// @updateURL https://update.greasyfork.org/scripts/538645/Torn%20Market%20Price%20Injector%20NOAPI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CONFIGURATION - Change this to your API key
    const API_KEY = 'SECRET-SECRET';

    let apiData = null;
    let observer = null;

    // Fetch data from API
    async function fetchApiData() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://lachesislabs.me/api/spreads',
                headers: {
                    'X-API-Key': API_KEY
                },
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        // Convert array to object keyed by ID for faster lookup
                        const dataMap = {};
                        data.forEach(item => {
                            dataMap[item.id] = item;
                        });
                        resolve(dataMap);
                    } catch (error) {
                        console.error('Failed to parse API response:', error);
                        reject(error);
                    }
                },
                onerror: function(error) {
                    console.error('API request failed:', error);
                    reject(error);
                }
            });
        });
    }

    // Extract item ID from image src
    function extractItemId(imgSrc) {
        const match = imgSrc.match(/\/images\/items\/(\d+)\//);
        return match ? parseInt(match[1]) : null;
    }

    // Format price with commas
    function formatPrice(price) {
        return price.toLocaleString();
    }

    // Inject price data for a single item
    function injectPriceData(itemRow) {
        // Skip if already processed
        if (itemRow.dataset.priceInjected) return;

        // Find the image element
        const img = itemRow.querySelector('img.torn-item');
        if (!img) return;

        // Extract item ID
        const itemId = extractItemId(img.src);
        if (!itemId || !apiData[itemId]) return;

        // Find the title span
        const titleSpan = itemRow.querySelector('.title___Xo6Pm');
        if (!titleSpan) return;

        const itemData = apiData[itemId];

        // Create price info element
        const priceInfo = document.createElement('span');
        priceInfo.className = 'torn-price-injector';
        priceInfo.style.cssText = 'color: #4a9eff; font-size: 0.85em; margin-left: 8px;';
        priceInfo.innerHTML = `[7d: ${formatPrice(itemData.max_price_actual_7d)} | 30d: ${formatPrice(itemData.max_price_actual_30d)}]`;

        // Remove any existing price info first
        const existing = titleSpan.querySelector('.torn-price-injector');
        if (existing) existing.remove();

        // Insert after the title span
        titleSpan.appendChild(priceInfo);

        // Mark as processed
        itemRow.dataset.priceInjected = 'true';
    }

    // Process all visible items in the active tab
    function processActiveTab() {
        // Find the active tab panel - try multiple methods
        let activePanel = document.querySelector('[role="tabpanel"][data-headlessui-state="selected"]');

        // Fallback: find panel that's not hidden
        if (!activePanel) {
            const allPanels = document.querySelectorAll('[role="tabpanel"]');
            activePanel = Array.from(allPanels).find(panel => {
                return !panel.hasAttribute('aria-hidden') ||
                       panel.getAttribute('aria-hidden') === 'false' ||
                       (panel.style.position !== 'fixed' && panel.style.width !== '1px');
            });
        }

        if (!activePanel) {
            console.log('Torn Market Price Injector: No active panel found');
            return;
        }

        // Find all item rows in the active panel
        const itemRows = activePanel.querySelectorAll('.itemRow___Mf7bO');
        console.log(`Torn Market Price Injector: Processing ${itemRows.length} items`);

        // Reset processed flag for all items to handle re-processing
        itemRows.forEach(row => {
            delete row.dataset.priceInjected;
            // Remove existing price info if any
            const existingPriceInfo = row.querySelector('.torn-price-injector');
            if (existingPriceInfo) {
                existingPriceInfo.remove();
            }
        });

        // Process items
        itemRows.forEach(injectPriceData);
    }

    // Set up mutation observer to watch for tab changes
    function setupObserver() {
        if (observer) observer.disconnect();

        observer = new MutationObserver((mutations) => {
            // Check if any tab panels changed state
            let shouldProcess = false;

            mutations.forEach(mutation => {
                // Check for attribute changes on tab panels
                if (mutation.target.getAttribute('role') === 'tabpanel') {
                    if (mutation.type === 'attributes' &&
                        (mutation.attributeName === 'data-headlessui-state' ||
                         mutation.attributeName === 'aria-hidden' ||
                         mutation.attributeName === 'style')) {
                        shouldProcess = true;
                    }
                }

                // Also check for new item rows being added
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1 && (
                            node.classList?.contains('itemRow___Mf7bO') ||
                            node.querySelector?.('.itemRow___Mf7bO'))) {
                            shouldProcess = true;
                        }
                    });
                }
            });

            if (shouldProcess) {
                // Debounce to avoid multiple rapid calls
                clearTimeout(window.priceInjectorTimeout);
                window.priceInjectorTimeout = setTimeout(() => {
                    console.log('Torn Market Price Injector: Tab change detected, processing...');
                    processActiveTab();
                }, 200);
            }
        });

        // Observe the entire page content for better detection
        const targetNode = document.querySelector('#mainContainer') || document.body;
        observer.observe(targetNode, {
            attributes: true,
            attributeFilter: ['data-headlessui-state', 'aria-hidden', 'style', 'class'],
            subtree: true,
            childList: true
        });
    }

    // Initialize the script
    async function init() {
        console.log('Torn Market Price Injector: Initializing...');

        try {
            // Fetch API data
            apiData = await fetchApiData();
            console.log('Torn Market Price Injector: API data loaded');

            // Wait for page to be ready
            const waitForPage = setInterval(() => {
                const panelsContainer = document.querySelector('.panels___BR5er');
                if (panelsContainer) {
                    clearInterval(waitForPage);

                    // Set up observer
                    setupObserver();

                    // Also add click listeners to tab buttons as backup
                    document.addEventListener('click', (e) => {
                        // Check if clicked element is a tab button
                        const tabButton = e.target.closest('[role="tab"]');
                        if (tabButton) {
                            console.log('Torn Market Price Injector: Tab click detected');
                            setTimeout(processActiveTab, 300);
                        }
                    }, true);

                    // Process initial active tab
                    processActiveTab();

                    // Set up periodic check as final fallback (every 2 seconds)
                    setInterval(() => {
                        const unprocessedItems = document.querySelectorAll('[role="tabpanel"]:not([aria-hidden="true"]) .itemRow___Mf7bO:not([data-price-injected])');
                        if (unprocessedItems.length > 0) {
                            console.log(`Torn Market Price Injector: Found ${unprocessedItems.length} unprocessed items`);
                            processActiveTab();
                        }
                    }, 2000);

                    console.log('Torn Market Price Injector: Ready');
                }
            }, 1000);

        } catch (error) {
            console.error('Torn Market Price Injector: Failed to initialize', error);
        }
    }

    // Start when page is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Also reinitialize on URL changes (for SPA navigation)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            if (url.includes('ItemMarket')) {
                setTimeout(init, 1000);
            }
        }
    }).observe(document, {subtree: true, childList: true});

})();