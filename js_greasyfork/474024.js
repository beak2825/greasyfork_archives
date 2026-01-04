// ==UserScript==
// @name         Bitpin Gap Calculator
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Calculate Bitpin Gap
// @author       amiwrpremium
// @match        https://bitpin.ir/trade/*_IRT/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bitpin.ir
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474024/Bitpin%20Gap%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/474024/Bitpin%20Gap%20Calculator.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
    let arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];

    function fixNumbers(str) {
        if (typeof str === 'string') {
            for (let i = 0; i < 10; i++) {
                str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
            }
        }
        return str.replace(",", "");
    }

    function getBuySell() {
        let sell = document.querySelector("#trade-desktop > div.trade-desktop__body > div.trade-desktop__body__pro > div.trade-desktop__middle.pro > div > div.trade-desktop__middle__left > div > div.trade__orders.type-3 > div.trade__orders__wrapper.type-3 > div.trade__orders__list.sell.type-3.reverse > div:nth-child(1) > span.price.sell.type-3");
        let buy = document.querySelector("#trade-desktop > div.trade-desktop__body > div.trade-desktop__body__pro > div.trade-desktop__middle.pro > div > div.trade-desktop__middle__left > div > div.trade__orders.type-3 > div.trade__orders__wrapper.type-3 > div.trade__orders__list.buy.type-3 > div:nth-child(1) > span.price.buy.type-3");

        let sellPrice = fixNumbers(sell.innerText);
        let buyPrice = fixNumbers(buy.innerText);

        return {buy: buyPrice, sell: sellPrice};
    }

    function calculateGap(buy, sell) {
        return sell - buy;
    }

    function addGapElement(gap) {
        let place = document.getElementsByClassName(" trade__orders__match-price")[0]
        let gapElement = document.getElementById("gap");
        if (gapElement) {
            gapElement.innerText = `GAP: ${gap}`;
        } else {
            gapElement = document.createElement("span");
            gapElement.id = "gap";
            gapElement.innerText = `GAP: ${gap}`;
            place.appendChild(gapElement);
        }
    }

    function addGap() {
        let {buy, sell} = getBuySell();
        let gap = calculateGap(buy, sell);
        addGapElement(gap);
    }

    function main() {
        let buy_list = document.querySelector("#trade-desktop > div.trade-desktop__body > div.trade-desktop__body__pro > div.trade-desktop__middle.pro > div > div.trade-desktop__middle__left > div > div.trade__orders.type-3 > div.trade__orders__wrapper.type-3 > div.trade__orders__list.buy.type-3")
        let sell_list = document.querySelector("#trade-desktop > div.trade-desktop__body > div.trade-desktop__body__pro > div.trade-desktop__middle.pro > div > div.trade-desktop__middle__left > div > div.trade__orders.type-3 > div.trade__orders__wrapper.type-3 > div.trade__orders__list.sell.type-3.reverse")

        let buy_rows = buy_list.getElementsByClassName("row type-3 buy")
        let sell_rows = sell_list.getElementsByClassName("row type-3 sell")

        addGap()

        // create mutation observer so if changes happen in the list, we can recalculate the gap:
        const callback = function (mutationsList, observer) {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    addGap()
                    console.warn('A child node has been added or removed.');
                } else if (mutation.type === 'attributes') {
                    addGap()
                    console.warn('The ' + mutation.attributeName + ' attribute was modified.');
                }
            }
        }
        const observer = new MutationObserver(callback);
        observer.observe(buy_list, {attributes: true, childList: true, subtree: true});
        observer.observe(sell_list, {attributes: true, childList: true, subtree: true});

    }

    // wait for the page to load:
    window.addEventListener('load', function () {
        // add 3 seconds delay to make sure the page is fully loaded:
        setTimeout(function () {
            main();
        }, 3000);
    }, false);
})();
