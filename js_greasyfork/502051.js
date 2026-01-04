// ==UserScript==
// @name         Calculate List Total
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Adds up all the items on a list giving you a total.
// @author       lemonade.js
// @match        https://www.amazon.com/hz/wishlist/ls/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @license      0BSD
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502051/Calculate%20List%20Total.user.js
// @updateURL https://update.greasyfork.org/scripts/502051/Calculate%20List%20Total.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const allPrices = document.getElementsByClassName('a-offscreen');
    let total = 0;

    function calulateTotal() {
        total = 0;

        for (let i = 0; i < allPrices.length; i++) {
            if (allPrices[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.id == 'g-items') {
                const priceElement = allPrices[i].innerHTML;
                const priceString = priceElement.slice(1);
                const priceFix = priceString.replace(/[()]/g, '');
                const priceFloat = parseFloat(priceFix);

                total += priceFloat;
            }
        }
    }

    function displayTotal() {
        const totalPrice = document.getElementById('total-price');

        calulateTotal();

        totalPrice.innerHTML = `Total: $${total.toFixed(2)}`;
    }

    const bar = document.getElementsByClassName('a-row')[0];



    const totalDisplay = document.createElement('h1');

    totalDisplay.innerHTML = '';
    totalDisplay.id = 'total-price';

    bar.appendChild(totalDisplay);

    const pluginWarning = document.createElement('span');

    pluginWarning.innerHTML = '[Calulate List Total]<br>You may need to scroll down for all items to calculate.';
    pluginWarning.id = 'price-plugin-warning';
    pluginWarning.className = 'a-color-secondary';

    bar.appendChild(pluginWarning);



    setInterval(() => {
        displayTotal();
    }, 500);
})();