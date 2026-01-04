// ==UserScript==
// @name         Auto Currency
// @namespace    http://tampermonkey.net/
// @version      2024-09-25
// @description  Automatically convert all currencies on any website to your local currency
// @author       Obelous
// @match        *://*/*
// @icon         
// @grant        none
// @license      apache2
// @downloadURL https://update.greasyfork.org/scripts/510147/Auto%20Currency.user.js
// @updateURL https://update.greasyfork.org/scripts/510147/Auto%20Currency.meta.js
// ==/UserScript==

/////////////////////////////////////////////
// YOU MUST EDIT THIS SCRIPT FOR IT TO WORK//
/////////////////////////////////////////////

(function() {
    'use strict';

    // API settings: Get a free API key from https://www.exchangerate-api.com/
    const apiKey = 'API_KEY';
    const apiURL = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

    // Function to fetch conversion rate
    async function getGBPConversionRate() {
        try {
            const response = await fetch(apiURL);
            const data = await response.json();
            return data.conversion_rates.GBP;
        } catch (error) {
            console.error('Error fetching conversion rate:', error);
            return null;
        }
    }

    // Function to convert USD to GBP and format the price
    function convertAndReplacePrices(usdToGbpRate, targetNode) {
        const priceRegex = /\$([0-9]+(?:\.[0-9]{2})?)/g;

        // Iterate over all text nodes, including nested text nodes inside spans and labels
        const walker = document.createTreeWalker(targetNode, NodeFilter.SHOW_TEXT, {
            acceptNode: function(node) {
                if (priceRegex.test(node.nodeValue)) return NodeFilter.FILTER_ACCEPT;
            }
        });

        while (walker.nextNode()) {
            const node = walker.currentNode;
            node.nodeValue = node.nodeValue.replace(priceRegex, function(match, usdPrice) {
                const usdValue = parseFloat(usdPrice);
                const gbpValue = (usdValue * usdToGbpRate).toFixed(2);
                return `£${gbpValue} (${match})`;
            });
        }
    }

    // Function to handle nested price elements in the DOM
    function handlePriceElements(usdToGbpRate) {
        const priceSelectors = ['.woocommerce-Price-amount', '.wc-pao-addon-price'];

        priceSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                const priceText = element.innerText.match(/\$([0-9]+(?:\.[0-9]{2})?)/);

                if (priceText) {
                    const usdValue = parseFloat(priceText[1]);
                    const gbpValue = (usdValue * usdToGbpRate).toFixed(2);
                    element.innerText = `£${gbpValue} ($${usdValue})`;
                }
            });
        });
    }

    // Function to observe DOM changes
    async function observeDOMChanges() {
        const usdToGbpRate = await getGBPConversionRate();
        if (!usdToGbpRate) return;

        // Initial price conversion on the whole page
        convertAndReplacePrices(usdToGbpRate, document.body);
        handlePriceElements(usdToGbpRate); // Handle nested price elements

        // Callback to execute when mutations are observed
        const mutationCallback = function(mutationsList) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList' || mutation.type === 'subtree') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            convertAndReplacePrices(usdToGbpRate, node);
                            handlePriceElements(usdToGbpRate); // Handle nested price elements in new nodes
                        }
                    });
                }
            }
        };

        // Set up a MutationObserver to watch for changes to the body
        const observer = new MutationObserver(mutationCallback);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Start observing DOM changes
    observeDOMChanges();

})();