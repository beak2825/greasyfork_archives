// ==UserScript==
// @name         ami ami yen to euro
// @namespace    http://tampermonkey.net/
// @version      2025-07-31
// @description  Converts the prices from ami ami from yen to euro!
// @author       Epicbanana
// @match        https://www.amiami.com/eng/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amiami.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538835/ami%20ami%20yen%20to%20euro.user.js
// @updateURL https://update.greasyfork.org/scripts/538835/ami%20ami%20yen%20to%20euro.meta.js
// ==/UserScript==

(function() {
    let conversion_rate = 0.0058;
    'use strict';

    function convertPrices() {
        let prices = document.querySelectorAll(".newly-added-items__item__price");
        let rePrice = /\d+[\,\.]?\d*/g;

        prices.forEach(priceElement => {
            // Avoid re-processing already converted prices
            if (priceElement.dataset.converted) return;

            let priceText = priceElement.textContent;
            let priceMatch = priceText.match(rePrice);

            if (priceMatch) {
                let price = parseFloat(priceMatch[0].replace(',', '')); // Convert to number
                let euroPrice = (price * conversion_rate).toFixed(2); // Convert and round to 2 decimal places
                priceElement.textContent = `${euroPrice} €`;

                // Mark the element as converted
                priceElement.dataset.converted = "true";
            }
        });
    }

    window.addEventListener('load', convertPrices);

    let observer = new MutationObserver(convertPrices);
    observer.observe(document.body, { childList: true, subtree: true });

})();
