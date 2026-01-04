// ==UserScript==
// @name         JD & Taobao Currency Converter (CNY to USD)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Converts prices from CNY to USD on JD.com, Taobao.com, and Tmall.com with caching and in-place updates.
// @author       Your Name (with modifications)
// @match        *://*.jd.com/*
// @match        *://*.taobao.com/*
// @match        *://*.tmall.com/*
// @connect      v6.exchangerate-api.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546710/JD%20%20Taobao%20Currency%20Converter%20%28CNY%20to%20USD%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546710/JD%20%20Taobao%20Currency%20Converter%20%28CNY%20to%20USD%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION ---
    const apiKey = 'YOUR_API_KEY'; // Replace with your key if needed
    const fromCurrency = 'CNY';
    const toCurrency = 'USD';
    const CACHE_DURATION_HOURS = 24;

    // --- STYLE ---
    GM_addStyle(`
        .usd-price {
            color: #008000;
            font-weight: bold;
            margin-left: 8px;
            font-size: 0.9em;
            border: 1px solid #d0e0d0;
            background-color: #f0fff0;
            padding: 2px 5px;
            border-radius: 4px;
            /* Use inline-block to prevent line breaks inside the price element */
            display: inline-block;
        }
    `);

    // --- MAIN LOGIC ---

    /**
     * Gets the conversion rate, using a cache to avoid frequent API calls.
     * @returns {Promise<number|null>}
     */
    async function getConversionRate() {
        const cacheKey = 'cnyToUsdRate';
        const lastFetchKey = 'cnyToUsdLastFetch';
        const cacheDurationMs = CACHE_DURATION_HOURS * 60 * 60 * 1000;

        const cachedRate = await GM_getValue(cacheKey, null);
        const lastFetchTime = await GM_getValue(lastFetchKey, 0);
        const now = Date.now();

        if (cachedRate && (now - lastFetchTime < cacheDurationMs)) {
            console.log('Using cached exchange rate:', cachedRate);
            return cachedRate;
        }

        console.log('Fetching new exchange rate...');
        const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency}`;

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: apiUrl,
                onload: async function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.result === 'success' && data.conversion_rates[toCurrency]) {
                                const rate = data.conversion_rates[toCurrency];
                                await GM_setValue(cacheKey, rate);
                                await GM_setValue(lastFetchKey, Date.now());
                                console.log(`Successfully fetched and cached rate: 1 ${fromCurrency} = ${rate} ${toCurrency}`);
                                resolve(rate);
                            } else { reject('API returned an error.'); }
                        } catch (e) { reject('Failed to parse API response.'); }
                    } else { reject(`HTTP Error: ${response.status}`); }
                },
                onerror: function() { reject('Network request failed.'); }
            });
        });
    }

    /**
     * **FIXED: Now updates prices robustly to prevent duplicates.**
     * Finds price elements, converts the CNY value to USD, and displays or updates it
     * by appending the price as a child of the price element itself.
     * @param {number} rate - The CNY to USD conversion rate.
     */
    function convertPrices(rate) {
        const priceSelectors = [
            '.price', '.tm-price', '.price-real', 'span.price',
            '[class*="price-J"]', '.J_price_force', '.tb-rmb-num',
            '[class*="Price--"]', // Common dynamic class on Taobao/Tmall
            '[class*="text--"]'
        ];

        const query = priceSelectors.join(', ');
        const priceElements = document.querySelectorAll(query);

        priceElements.forEach(el => {
            // Check if the element is actually visible on the page
            if (el.offsetParent === null) {
                return;
            }

            // The regex will find the first number in the text content, which is the CNY price.
            // This works even if our own USD price is already appended.
            const priceText = el.textContent;
            const match = priceText.match(/[\d,]+(\.\d+)?/);

            if (match) {
                const cnyPrice = parseFloat(match[0].replace(/,/g, ''));

                if (!isNaN(cnyPrice)) {
                    const usdPrice = cnyPrice * rate;
                    const usdPriceText = `(≈ $${usdPrice.toFixed(2)} USD)`;

                    // **REVISED UPDATE LOGIC**
                    // Look for an existing USD price span *inside* the current element.
                    // This is much more robust than checking for a sibling.
                    let usdElement = el.querySelector('.usd-price');

                    if (usdElement) {
                        // If it exists, just update its content.
                        usdElement.textContent = usdPriceText;
                    } else {
                        // If it doesn't exist, create a new one and append it as a child.
                        usdElement = document.createElement('span');
                        usdElement.className = 'usd-price';
                        usdElement.textContent = usdPriceText;
                        el.appendChild(usdElement);
                    }
                }
            }
        });
    }

    /**
     * The main function to run the script.
     */
    async function runConverter() {
        try {
            const rate = await getConversionRate();
            if (rate) {
                convertPrices(rate);

                const observer = new MutationObserver(() => {
                    let timeout;
                    clearTimeout(timeout);
                    timeout = setTimeout(() => convertPrices(rate), 500);
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
        } catch (error) {
            console.error('Could not run currency converter:', error);
        }
    }

    window.addEventListener('load', runConverter);

})();

