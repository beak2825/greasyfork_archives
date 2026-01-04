// ==UserScript==

// @name         The West Market Monitor

// @namespace    https://greasyfork.org/es/scripts/465880-the-west-market-monitor

// @version      1.2

// @description  Monitors the market items in The West and notifies you of new items for sale.

// @author       IA-todotuyo

// @match        https://es1.the-west.es*

// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/465880/The%20West%20Market%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/465880/The%20West%20Market%20Monitor.meta.js
// ==/UserScript==

 

(function() {

    'use strict';

 

    // Define the items you want to monitor

    const itemsToMonitor = [

        "Gold Nugget",

        "Whiskey Bottle",

        "Rope",

        "Leather Hat"

    ];

 

    // Keep track of items that have been seen before

    let seenItems = {};

 

    // Check the market for new items every 5 seconds

    setInterval(() => {

        const marketItems = document.querySelectorAll(".market_item");

        for (let item of marketItems) {

            const itemName = item.querySelector(".market_item_name").innerText;

            if (itemsToMonitor.includes(itemName) && !seenItems[itemName]) {

                console.log(`New ${itemName} item for sale!`);

                seenItems[itemName] = true;

            }

        }

    }, 5000);

 

    // Watch for new items being added to the market

    const marketObserver = new MutationObserver(mutations => {

        mutations.forEach(mutation => {

            mutation.addedNodes.forEach(node => {

                if (node.classList && node.classList.contains("market_item")) {

                    const itemName = node.querySelector(".market_item_name").innerText;

                    if (itemsToMonitor.includes(itemName)) {

                        console.log(`New ${itemName} item for sale!`);

                        seenItems[itemName] = true;

                    }

                }

            });

        });

    });

 

    marketObserver.observe(document.querySelector("#market_list"), { childList: true });

})();