// ==UserScript==
// @name         Roblox Bundle Sniper
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Checks if a Roblox bundle is on sale and buys it automatically.
// @author       randomrobloxscripter
// @match        https://www.roblox.com/bundles/*
// @match        https://web.roblox.com/bundles/*
// @grant        none
// @icon https://tr.rbxcdn.com/82e1958aba5ccfdec5b17ddbe74acb60/420/420/Image/Png
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502421/Roblox%20Bundle%20Sniper.user.js
// @updateURL https://update.greasyfork.org/scripts/502421/Roblox%20Bundle%20Sniper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CHECK_INTERVAL = 1000; // Checks every second (1 second is 1000)

    function checkAndBuyBundle() {
        return new Promise((resolve, reject) => {
            try {
                const saleElement = document.querySelector('.bundle-sale-price');
                if (saleElement) {
                    console.log('The bundle is on sale! Attempting to buy...');
                    // Simulate the purchase process
                    const buyButton = document.querySelector('.btn-buy-now');
                    if (buyButton) {
                        buyButton.click();
                        // g
                        console.log('Purchase initiated.');
                        resolve();
                    } else {
                        console.log('Buy button not found.');
                        resolve();
                    }
                } else {
                    console.log('The bundle is not on sale.');
                    resolve();
                }
            } catch (error) {
                console.error('Error checking bundle status:', error);
                reject(error);
            }
        });
    }

    function startChecking() {
        checkAndBuyBundle().then(() => {
            setTimeout(startChecking, CHECK_INTERVAL);
        }).catch(error => {
            console.error('Error during check:', error);
            setTimeout(startChecking, CHECK_INTERVAL);
        });
    }

    startChecking(); // Initial check immediately
})();