// ==UserScript==
// @name         Turnip Exchange Filter
// @namespace    dkt.turnip.exchange.filter
// @version      0.0.1
// @description  Filter by price
// @author       You
// @match        https://turnip.exchange/islands
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/402245/Turnip%20Exchange%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/402245/Turnip%20Exchange%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const priceInput = document.createElement('input');
    priceInput.value = 500;
    priceInput.type = 'number';
    priceInput.style = 'position:fixed;top:10px;left:10px;width:100px;height:35px;line-height:35px;font-size:20px;background-color:white;border:1px solid pink;border-radius:5px;color:black;padding:5px;';
    document.body.append(priceInput);

    const savedPrice = localStorage.getItem('FILTER_PRICE');
    if (!savedPrice) {
        localStorage.setItem('FILTER_PRICE', priceInput.value);
    } else {
        priceInput.value = savedPrice;
    }

    priceInput.addEventListener('change', () => {
        localStorage.setItem('FILTER_PRICE', priceInput.value);
    });

    let ifReplaced = false;
    let checker = setInterval(() => {
        if (ifReplaced) {
            clearInterval(checker);
            return;
        }
        const cards = document.querySelectorAll('div[data-turnip-code]');
        if (cards.length > 5) {
            cards.forEach((cardElement) => {
                const priceElement = cardElement.querySelector('div > div > img + p');
                if (parseInt(priceElement.textContent.split(' ')[0]) < parseInt(priceInput.value)) {
                    cardElement.remove();
                }
            });
            ifReplaced = true;
        }
    }, 100);
})();