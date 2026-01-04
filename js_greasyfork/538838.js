// ==UserScript==
// @name         Mirai price converter
// @namespace    http://tampermonkey.net/
// @version      2025-03-02
// @description  Converts the prices from Mirai from malaysian ringgit to euro!
// @author       Epicbanana
// @match        https://miraicollectibles.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=miraicollectibles.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538838/Mirai%20price%20converter.user.js
// @updateURL https://update.greasyfork.org/scripts/538838/Mirai%20price%20converter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let conversion_rate = 0.2068;
    let prices = document.getElementsByClassName("price-new");
    let rePrice = /\d+[\,\.]?\d+/g;
    for (let i = 0; i < prices.length; i++) {
        let priceItems = prices[i].textContent;
        let reCurrencyName = /\s\w+\.?/;
        if (priceItems.match(rePrice).length > 2){
            let price1 = priceItems.match(rePrice)[0].replace(reCurrencyName, '');
            price1 = price1.replace('.00', '');
            price1 = price1.replace(',', '');
            let price2 = priceItems.match(rePrice)[1].replace(reCurrencyName, '');
            price2 = price2.replace('.00', '');
            price2 = price2.replace(',', '');
            prices[i].textContent = ((price1) * conversion_rate.toFixed(2) + ` ${'€'}` + ` ${' - '}` + (price2) * conversion_rate.toFixed(2) + ` ${'€'}` );
        }
        else {
            let priceItems = prices[i].textContent;
            let reCurrencyName = /\s\w+\.?/;
            let price = priceItems.match(rePrice)[0].replace(reCurrencyName, '');
            price = price.replace('.00', '');
            price = price.replace(',', '');
            prices[i].textContent = ((price) * conversion_rate.toFixed(2) + ` ${'€'}`);
        }
    }
})();