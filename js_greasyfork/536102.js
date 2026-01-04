// ==UserScript==
// @name         FarmRPG Auto Fishing (2s Interval Delay)
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Auto Fishing for FarmRPG with a 2-second delay between actions.
// @license MIT
// @author       methamphetaminelab (modified)
// @match        https://farmrpg.com/*
// @grant        none
// @require      https://greasyfork.org/scripts/469666-farmrpg-helper/code/FarmRPG%20Helper.user.js
// @downloadURL https://update.greasyfork.org/scripts/536102/FarmRPG%20Auto%20Fishing%20%282s%20Interval%20Delay%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536102/FarmRPG%20Auto%20Fishing%20%282s%20Interval%20Delay%29.meta.js
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
            setTimeout(startRepeatActions, 2000); // Delayed by 2 seconds
            return;
        }

        var wormsElement = document.querySelector('.col-45');

        if (wormsElement) {
            const strongElement = wormsElement.querySelector('strong');
            const wormsText = strongElement ? strongElement.textContent.trim().replace(/[^\d]/g, '') : '';

            wormsRemaining = parseInt(wormsText);

            if (!isNaN(wormsRemaining) && wormsRemaining > 0) {
                console.log('Worms remaining:', wormsRemaining);
                setTimeout(clickFishElements, 32000); // 30s delay + 2s interval delay
            } else {
                console.log('No more worms. Buying 200 worms.');
                setTimeout(buyWorms, 2000); // Delayed by 2 seconds
            }
        } else {
            console.log('Could not find worms element. Stopping script.');
            clearIntervalAll();
            setTimeout(startRepeatActions, 2000); // Delayed by 2 seconds
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

            setTimeout(checkWorms, 32000); // 30s delay + 2s interval delay
        } else {
            console.log('No fish found. Stopping script.');
            clearIntervalAll();
            setTimeout(startRepeatActions, 2000); // Delayed by 2 seconds
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
        intervalIdRepeatActions = setInterval(repeatActions, 3000); // Originally 1000ms, now 3000ms
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
                    }, 2500); // Originally 500ms, now 2500ms
                }
            }, 2500); // Originally 500ms, now 2500ms
        } else {
            console.log('Sell Unlocked not found.');
            setTimeout(checkWorms, 2000); // Delayed by 2 seconds
        }
    }
})();