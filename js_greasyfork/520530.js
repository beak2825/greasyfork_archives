// ==UserScript==
// @name         Torn Price RRP Auto Input
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Automatically sets the price in the item listing page with a button click on Torn.com
// @author       Gemini 2.0 https://gemini.google.com/ and OctaviusRW https://www.torn.com/profiles.php?XID=3421627
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @match        https://*.torn.com/page.php?sid=ItemMarket*
// @license      GNU GPLv3 
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520530/Torn%20Price%20RRP%20Auto%20Input.user.js
// @updateURL https://update.greasyfork.org/scripts/520530/Torn%20Price%20RRP%20Auto%20Input.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addButtonsToPriceElements() {
        const priceElements = document.querySelectorAll('div[class*="price___"]');

        priceElements.forEach(priceElement => {
            if (priceElement.querySelector('.tampermonkey-price-button')) return;

            const button = document.createElement('button');
            button.textContent = '$'; // Shorter button text
            button.classList.add('tampermonkey-price-button');

            button.addEventListener('click', () => {
                const priceText = priceElement.textContent.trim();
                const priceMatch = priceText.match(/[\$£€]?[\s]*([\d,.]+)/i);

                if (priceMatch) {
                    const price = priceMatch[1].trim();
                    const rowElement = priceElement.closest('div[class*="itemRow___"]');

                    if (rowElement) {
                        const inputMoney = rowElement.querySelector('div.input-money-group input[data-money="Infinity"]');

                        if (inputMoney) {
                            inputMoney.value = price;
                            inputMoney.dispatchEvent(new Event('input', { 'bubbles': true, 'cancelable': true }));
                            inputMoney.dispatchEvent(new Event('change', { 'bubbles': true }));
                            inputMoney.dispatchEvent(new Event('blur'));
                        } else {
                            alert("Could not find the price input in this row.");
                        }
                    } else {
                        alert("Could not find the product row. Check the HTML.");
                    }
                } else {
                    alert("Could not find price.");
                }
            });

            priceElement.appendChild(button);
        });
    }

    addButtonsToPriceElements();
    const observer = new MutationObserver(mutations => {
        let nodesAdded = false;
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                nodesAdded = true;
            }
        });
        if (nodesAdded) {
            addButtonsToPriceElements();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    const style = document.createElement('style');
    style.textContent = `
        .tampermonkey-price-button {
            background-color: #4CAF50;
            border: none;
            color: white;
            padding: 2px 5px; /* Smaller padding */
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 12px; /* Smaller font */
            cursor: pointer;
            border-radius: 3px; /* Smaller border radius */
            margin-left: 3px; /* Reduced margin */
            line-height: 1; /* Added line-height to control vertical spacing */
        }
        .tampermonkey-price-button:hover {
            background-color: #45a049;
        }
    `;
    document.head.appendChild(style);

    console.log("Set Price to Input script running.");
})();