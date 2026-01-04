// ==UserScript==
// @name         Roblox Bundle Purchase Bot with RoSeal Integration
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Checks if a Roblox bundle is on sale and buys it automatically using RoSeal's item refresher without reloading the page.
// @author       randomrobloxscripter
// @match        https://www.roblox.com/bundles/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502424/Roblox%20Bundle%20Purchase%20Bot%20with%20RoSeal%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/502424/Roblox%20Bundle%20Purchase%20Bot%20with%20RoSeal%20Integration.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CHECK_INTERVAL = 1000; // Checks every second

    function refreshItem() {
        return new Promise((resolve, reject) => {
            try {
                // Assuming RoSeal adds a button or a function to refresh item info
                // You might need to adjust this to match RoSeal's actual implementation
                const refreshButton = document.querySelector('.roseal-refresh-button');
                if (refreshButton) {
                    refreshButton.click();
                    console.log('Refreshed item info using RoSeal.');
                    resolve();
                } else {
                    console.error('RoSeal refresh button not found.');
                    reject(new Error('RoSeal refresh button not found.'));
                }
            } catch (error) {
                console.error('Error triggering RoSeal refresh:', error);
                reject(error);
            }
        });
    }

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
                        // Add any additional steps needed to complete the purchase here
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
        refreshItem().then(() => {
            return checkAndBuyBundle();
        }).then(() => {
            setTimeout(startChecking, CHECK_INTERVAL);
        }).catch(error => {
            console.error('Error during check:', error);
            setTimeout(startChecking, CHECK_INTERVAL);
        });
    }

    startChecking(); // Initial check immediately
})();
