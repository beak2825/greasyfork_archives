// ==UserScript==
// @name         Quick pack (for xmas)
// @namespace    http://tampermonkey.net/
// @version      2023-12-18
// @description  Simple script to set item count to 1 on relevant items when making a package in TORN
// @author       olesien
// @match        https://www.torn.com/itemuseparcel.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482610/Quick%20pack%20%28for%20xmas%29.user.js
// @updateURL https://update.greasyfork.org/scripts/482610/Quick%20pack%20%28for%20xmas%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const goodItems = ["Advent Calendar", "Family Photo", "Festive Socks", "Bag of Reindeer Droppings", "Feathery Hotel Coupon", "Blanket", "Bottle of Christmas Cocktail", "Snowball", "Christmas Cracker", "Can of Taurine Elite", "Feathery Hotel Coupon"];

    const run = (items) => {
        const itemsArr = Array.from(items);
        let added = 0;
        itemsArr.forEach(item => {
            const name = item.querySelector(".name-wrap .t-overflow");
            console.log(name.innerText);
            if (name) {
               if (goodItems.includes(name.innerText)) {
                   const inputs = item.querySelectorAll("input");
                   if (inputs) {

                     Array.from(inputs).forEach(input => {
                       input.value = 1;
                       added++;
                       input.dispatchEvent(new Event('input', { bubbles: true }));

                     });

                   }
               }
            }
        });

        if (added > 0) {

        }
    }

    // Your code here...
    const observer = new MutationObserver((_, observer) => {
        let items = document.querySelector(".all-items");
        if (items) {
            observer.disconnect();
            const observer2 = new MutationObserver((_, observer) => {
                let items = document.querySelector(".all-items");
                if (items) {

                    //Observe for changes
                    run(items.children);
                }
            });
            observer2.observe(items, { subtree: true, childList: true });
        }
    });
    observer.observe(document, { subtree: true, childList: true });

})();