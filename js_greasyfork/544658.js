// ==UserScript==
// @name         BCH Satoshis to USD Converter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Converts BCH satoshis to USD using CoinGecko API and displays it in US format (e.g., $2,000.00) next to Spendable amount on memo.cash
// @author       Grok
// @match        https://memo.cash/*
// @grant        GM_xmlhttpRequest
// @connect      api.coingecko.com
// @run-at       document-idle
// @licence MIT
// @downloadURL https://update.greasyfork.org/scripts/544658/BCH%20Satoshis%20to%20USD%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/544658/BCH%20Satoshis%20to%20USD%20Converter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to format numbers in US style (e.g., 1234567 -> $1,234,567.00)
    function formatUSDNumber(number) {
        return '$' + number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // Function to fetch BCH to USD price from CoinGecko
    function fetchBCHtoUSD(callback) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-cash&vs_currencies=usd',
            onload: function(response) {
                if (response.status === 200) {
                    try {
                        const data = JSON.parse(response.responseText);
                        const bchPrice = data['bitcoin-cash']['usd'];
                        callback(bchPrice);
                    } catch (e) {
                        console.error('Error parsing CoinGecko API response:', e);
                    }
                } else {
                    console.error('Error fetching BCH price:', response.status);
                }
            },
            onerror: function(error) {
                console.error('Error in GM_xmlhttpRequest:', error);
            }
        });
    }

    // Function to convert satoshis to USD and update the DOM
    function convertAndDisplaySatoshis() {
        // Find all span elements with class starting with 'js-spendable-'
        const spendableSpans = document.querySelectorAll('ul.dropdown-menu.dropdown-menu-right span[class^="js-spendable-"]');
        if (spendableSpans.length === 0) {
            console.log('No spendable satoshis span found.');
            return;
        }

        fetchBCHtoUSD(function(bchPrice) {
            spendableSpans.forEach(span => {
                // Get satoshis value, removing commas
                const satoshisText = span.textContent.replace(/,/g, '');
                const satoshis = parseInt(satoshisText, 10);
                if (isNaN(satoshis)) {
                    console.error('Invalid satoshis value:', span.textContent);
                    return;
                }

                // Convert satoshis to BCH (1 BCH = 100,000,000 satoshis)
                const bch = satoshis / 100000000;
                // Convert BCH to USD
                const usd = bch * bchPrice;
                // Format USD with US number format
                const formattedUSD = formatUSDNumber(usd);

                // Check if USD is already displayed to avoid duplicates
                if (!span.nextSibling || !span.nextSibling.textContent.includes('USD')) {
                    // Insert USD value in parentheses after the satoshis
                    const usdNode = document.createTextNode(` (${formattedUSD})`);
                    span.parentNode.insertBefore(usdNode, span.nextSibling);
                }
            });
        });
    }

    // Initial conversion
    convertAndDisplaySatoshis();

    // Observe DOM changes to handle dynamic updates
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length || mutation.removedNodes.length) {
                convertAndDisplaySatoshis();
            }
        });
    });

    // Observe changes in the dropdown menu
    const dropdown = document.querySelector('ul.dropdown-menu.dropdown-menu-right');
    if (dropdown) {
        observer.observe(dropdown, {
            childList: true,
            subtree: true
        });
    }
})();
