// ==UserScript==
// @name         Torn Item Price Comparator (Retorn Edition)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Compares the MV of an item to the value a user defines.
// @author       ShadowBirb
// @match        https://www.torn.com/item.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534543/Torn%20Item%20Price%20Comparator%20%28Retorn%20Edition%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534543/Torn%20Item%20Price%20Comparator%20%28Retorn%20Edition%29.meta.js
// ==/UserScript==

(function () {
   'use strict';
    const priceList = {
        //Energy Cans
        'Can of Goose Juice'  : 380000,
        'Can of Damp Valley'  : 800000,
        'Can of Crocozade'    : 1100000,
        'Can of Munster'      : 1500000,
        'Can of Santa Shooters'   : 1500000,
        'Can of Rockstar Rudolph' : 2000000,
        'Can of Red Cow'       : 2000000,
        'Can of Taurine Elite' : 3200000,
        'Can of X-MASS'        : 3600000,

        //Bottles of Alcohol
        'Bottle of Kandy Kane'   : 65000,
        'Bottle of Pumpkin Brew' : 75000,
        'Bottle of Wicked Witch' : 160000,
        'Bottle of Minty Mayhem' : 160000,
        'Bottle of Christmas Cocktail' : 175000,
        'Bottle of Stinky Swamp Punch' : 300000,
        'Bottle of Mistletoe Madness'  : 300000,
        'Bottle of Moonshine'          : 830000,
        'Bottle of Green Stout'        : 1000000,
        'Bottle of Christmas Spirit'   : 1250000,

        //Candies
        'Pixie Sticks'      : 275000,
        'Bag of Sherbet'    : 275000,
        'Jawbreaker'        : 275000,
        'Bag of Humbugs'    : 400000,
        'Chocolate Egg'     : 500000,
        'Birthday Cupcake'  : 2800000,
        'Bag of Reindeer Droppings' : 100000,

        //Boosters
        'Gift Card'  : 2800000,
        'Erotic DVD' : 3600000,
        'Feathery Hotel Coupon' : 11500000,
        'Book of Carols'        : 14500000,

        //Special Items
        'Christmas Cracker' : 650000,
        'Stink Bombs'       : 1000000,
        'Toilet Paper'      : 1000000,
        'Dog Poop'          : 1000000,
        'Small Explosive Device' : 4750000,
        'Business Class Ticket'  : 6750000,
        'Strippogram Voucher'    : 20000000,
        'Poison Mistletoe'       : 42500000,
    };

    function parseValue(str) {
        return parseInt(str.replace(/[$,]/g, ''));
    }

    function getColor(diffPercent) {
        if (diffPercent >= 10) return 'limegreen';
        if (diffPercent >= 0) return 'lightgreen';
        if (diffPercent <= -10) return 'Crimson';
        return 'lightcoral';
    }

    function extractUnitPrice(titleText) {
        const match = titleText.match(/x \$([0-9,]+)/);
        return match && match[1] ? parseValue(match[1]) : 0;
    }

    function updateItemColors() {
        const nameWraps = document.querySelectorAll('.name-wrap');

        nameWraps.forEach((wrap) => {
            const nameElem = wrap.querySelector('.name');
            if (!nameElem) return;

            const name = nameElem.textContent.trim();
            const baseValue = priceList[name];
            if (!baseValue) return;

            const priceElem = wrap.querySelector('.re_value');
            if (!priceElem) return;

            const titleAttr = priceElem.getAttribute('title');
            if (!titleAttr) return;

            const actualValue = extractUnitPrice(titleAttr);
            if (!actualValue) return;

            const diffPercent = ((actualValue - baseValue) / baseValue) * 100;
            const percentSymbol = diffPercent >= 0 ? '▲' : '▼';
            const sign = diffPercent >= 0 ? '+' : '-';

            nameElem.style.color = getColor(diffPercent);
            nameElem.style.fontWeight = 'bold';

            let indicator = wrap.querySelector('.price-diff-indicator');
            if (!indicator) {
                indicator = document.createElement('span');
                indicator.className = 'price-diff-indicator';
                indicator.style.cssText = 'margin-left: 5px; margin-right:5px; font-size: 12px;';
                nameElem.appendChild(indicator);
            }

            indicator.innerHTML = '';

            const arrowSpan = document.createElement('span');
            arrowSpan.textContent = percentSymbol;
            arrowSpan.style.color = 'white';
            arrowSpan.style.fontWeight = 'bold';

            const textSpan = document.createElement('span');
            textSpan.textContent = ` ${sign}${Math.abs(diffPercent).toFixed(1)}%`;
            textSpan.style.color = diffPercent >= 0 ? 'Azure' : 'MistyRose';

            indicator.appendChild(arrowSpan);
            indicator.appendChild(textSpan);
        });
    }

    function injectButton() {
        const targetForm = document.querySelector('form[name="itemsSearchForm"]');
        if (!targetForm) return;

        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = 'Compare Prices';
        button.style.cssText = 'margin-left:10px; margin-right:10px; padding:2px 8px; font-weight:bold; cursor:pointer; background-color:dimgray; border-radius:6px; color:white;';
        button.addEventListener('click', updateItemColors);

        targetForm.appendChild(button);
    }

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', injectButton);
    } else {
        injectButton();
    }
})();
