// ==UserScript==
// @name         Steam Inventory Price
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  lol
// @author       z3pyr
// @match        *://steamcommunity.com/id/*/inventory*
// @match        *://steamcommunity.com/profiles/*/inventory*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501225/Steam%20Inventory%20Price.user.js
// @updateURL https://update.greasyfork.org/scripts/501225/Steam%20Inventory%20Price.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("script is running");


    function parsePrice(priceString) {
        return parseFloat(priceString.replace(/[^\d.-]/g, ''));
    }


    function updateTotalPriceDisplay(text) {
        let totalDiv = document.getElementById('totalPriceDiv');
        if (!totalDiv) {
            totalDiv = document.createElement('div');
            totalDiv.id = 'totalPriceDiv';
            totalDiv.className = 'row platform_container steam';
            totalDiv.style.marginTop = '5px';

            const iconDiv = document.createElement('div');
            iconDiv.className = 'icon';

            const priceDiv = document.createElement('div');
            priceDiv.className = 'price';

            totalDiv.appendChild(iconDiv);
            totalDiv.appendChild(priceDiv);

            const targetParent = document.querySelector('.row .vertical_divider + .column.platforms_container');
            if (targetParent) {
                targetParent.appendChild(totalDiv);
            } else {
                console.warn('target parent element not found.');
                return;
            }
        }

        totalDiv.querySelector('.price').textContent = text;
    }


    function calculateTotalPrice() {
        const priceElements = document.querySelectorAll('[data-price]');
        let totalSum = 0;

        priceElements.forEach(el => {
            const priceString = el.getAttribute('data-price');
            const price = parsePrice(priceString);
            totalSum += price;
        });

        updateTotalPriceDisplay(`${totalSum.toFixed(2)}₸`);
    }


    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                calculateTotalPrice();
            }
        });
    });


    const config = { childList: true, subtree: true };


    observer.observe(document.body, config);
    calculateTotalPrice();
})();
