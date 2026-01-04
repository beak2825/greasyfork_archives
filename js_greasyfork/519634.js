// ==UserScript==
// @name         Items Page Flower and Plushie Filter and Sort (PDA Optimized)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Grey out irrelevant flowers, move them to the bottom of the list, reorder flowers by quantity, and sort plushies by quantity on Torn's items page.
// @match        https://www.torn.com/item.php*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519634/Items%20Page%20Flower%20and%20Plushie%20Filter%20and%20Sort%20%28PDA%20Optimized%29.user.js
// @updateURL https://update.greasyfork.org/scripts/519634/Items%20Page%20Flower%20and%20Plushie%20Filter%20and%20Sort%20%28PDA%20Optimized%29.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    // List of irrelevant flowers
    const irrelevantFlowers = [
        "Bunch of Carnations",
        "Bunch of Flowers",
        "Daffodil",
        "Bunch of Black Roses",
        "Dozen Roses",
        "Funeral Wreath",
        "Single Red Rose",
    ];
 
    function processItems() {
        // Handle Flowers
        const flowerItems = Array.from(document.querySelectorAll('#flowers-items > li'));
        if (flowerItems.length) {
            const relevantFlowers = [];
            const irrelevantFlowersList = [];
 
            flowerItems.forEach((item) => {
                const itemName = item.querySelector('.name-wrap .name')?.textContent.trim();
                const qtyElement = item.querySelector('.item-amount.qty');
                const qty = parseInt(qtyElement?.textContent.replace(/[^0-9]/g, '') || 0, 10);
 
                if (!itemName) return;
 
                if (irrelevantFlowers.includes(itemName)) {
                    // Grey out irrelevant flowers
                    item.style.opacity = "0.5";
                    item.style.backgroundColor = "#f9f9f9";
                    irrelevantFlowersList.push(item);
                } else {
                    relevantFlowers.push({ element: item, quantity: qty });
                }
            });
 
            // Sort relevant flowers by quantity (ascending)
            relevantFlowers.sort((a, b) => a.quantity - b.quantity);
 
            // Append items back to the DOM
            const flowerList = document.querySelector('#flowers-items');
            if (flowerList) {
                relevantFlowers.forEach(({ element }) => flowerList.appendChild(element));
                irrelevantFlowersList.forEach((item) => flowerList.appendChild(item));
            }
        }
 
        // Handle Plushies
        const plushieItems = Array.from(document.querySelectorAll('#plushies-items > li'));
        if (plushieItems.length) {
            const plushies = plushieItems.map((item) => {
                const qtyElement = item.querySelector('.item-amount.qty');
                const qty = parseInt(qtyElement?.textContent.replace(/[^0-9]/g, '') || 0, 10);
                return { element: item, quantity: qty };
            });
 
            // Sort plushies by quantity (ascending)
            plushies.sort((a, b) => a.quantity - b.quantity);
 
            // Append sorted plushies back to the DOM
            const plushieList = document.querySelector('#plushies-items');
            if (plushieList) {
                plushies.forEach(({ element }) => plushieList.appendChild(element));
            }
        }
    }
 
    // Throttled observer callback for DOM changes
    const throttle = (callback, delay) => {
        let lastCall = 0;
        return (...args) => {
            const now = Date.now();
            if (now - lastCall >= delay) {
                lastCall = now;
                callback(...args);
            }
        };
    };
 
    // Set up a MutationObserver for dynamic content updates
    const observer = new MutationObserver(
        throttle(() => {
            processItems();
        }, 500)
    );
 
    // Observe the list containers for changes
    const flowerTargetNode = document.querySelector('#flowers-items');
    const plushieTargetNode = document.querySelector('#plushies-items');
 
    if (flowerTargetNode) {
        observer.observe(flowerTargetNode, { childList: true, subtree: true });
    }
    if (plushieTargetNode) {
        observer.observe(plushieTargetNode, { childList: true, subtree: true });
    }
 
    // Initial run
    processItems();
})();