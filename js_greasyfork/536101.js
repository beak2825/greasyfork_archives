// ==UserScript==
// @name         FarmRPG Auto Fishing (10s Interval Delay)
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Auto Fishing for FarmRPG with an additional 10-second delay for all intervals.
// @author       methamphetaminelab (modified)
// @match        https://farmrpg.com/*
// @grant        none
// @license MIT
// @require      https://greasyfork.org/scripts/469666-farmrpg-helper/code/FarmRPG%20Helper.user.js
// @downloadURL https://update.greasyfork.org/scripts/536101/FarmRPG%20Auto%20Fishing%20%2810s%20Interval%20Delay%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536101/FarmRPG%20Auto%20Fishing%20%2810s%20Interval%20Delay%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let intervalIdCheckWorms;
    let intervalIdClickFish;
    let intervalIdRepeatActions;

    const wormsCheckInterval = 10;
    let wormsRemaining;

    function isElementPresent(selector) {
        return document.querySelector(selector) !== null;
    }

    function checkWorms() {
        if (!isElementPresent('.center.sliding')) {
            console.log('Element "Farm Pond" is not present. Stopping script.');
            clearIntervalAll();
            setTimeout(startRepeatActions, 10000); // Delayed by 10 seconds
            return;
        }

        var wormsElement = document.querySelector('.col-45');

        if (wormsElement) {
            const strongElement = wormsElement.querySelector('strong');
            const wormsText = strongElement ? strongElement.textContent.trim().replace(/[^\d]/g, '') : '';

            wormsRemaining = parseInt(wormsText);

            if (!isNaN(wormsRemaining) && wormsRemaining > 0) {
                console.log('Worms remaining:', wormsRemaining);
                setTimeout(clickFishElements, 40000); // 30s delay + 10s interval delay
            } else {
                console.log('No more worms. Buying 200 worms.');
                setTimeout(buyWorms, 10000); // Delayed by 10 seconds
            }
        } else {
            console.log('Could not find worms element. Stopping script.');
            clearIntervalAll();
            setTimeout(startRepeatActions, 10000); // Delayed by 10 seconds
        }
    }

    function clickFishElements() {
        const fishElements = document.querySelectorAll('[class*="fish f"]');

        if (fishElements.length > 0) {
            fishElements.forEach(element => {
                element.click();
            });

            const specificDiv = document.querySelector('[class^="fishcaught"][data-speed][data-id]');

            if (specificDiv) {
                specificDiv.click();
            }

            setTimeout(checkWorms, 40000); // 30s delay + 10s interval delay
        } else {
            console.log('No fish found. Stopping script.');
            clearIntervalAll();
            setTimeout(startRepeatActions, 10000); // Delayed by 10 seconds
        }
    }

    function buyWorms() {
        const allButtons = document.querySelectorAll('button');

        allButtons.forEach(button => {
            if (button.textContent.includes('BUY 200 WORMS')) {
                console.log('Buying 200 worms...');
                button.click();
            }
        });
    }

    function clearIntervalAll() {
        clearInterval(intervalIdCheckWorms);
        clearInterval(intervalIdClickFish);
        clearInterval(intervalIdRepeatActions);
    }

    function startRepeatActions() {
        intervalIdRepeatActions = setInterval(repeatActions, 11000); // Originally 1000ms, now 11000ms
    }

    function repeatActions() {
        const sellAllButton = document.querySelector('.button.btnorange.sellallbtn');
        if (sellAllButton) {
            console.log('Clicking "Sell Unlocked" button...');
            sellAllButton.click();

            setTimeout(() => {
                const actionsModalButton = document.querySelector('.actions-modal-button');
                if (actionsModalButton) {
                    console.log('Clicking "Yes" button...');
                    actionsModalButton.click();

                    setTimeout(() => {
                        const modalButton = document.querySelector('.modal-button.modal-button-bold');
                        if (modalButton) {
                            console.log('Clicking "OK" button...');
                            modalButton.click();
                        }
                    }, 10500); // Originally 500ms, now 10500ms
                }
            }, 10500); // Originally 500ms, now 10500ms
        } else {
            console.log('Sell Unlocked not found.');
            setTimeout(checkWorms, 10000); // Delayed by 10 seconds
        }
    }
})();