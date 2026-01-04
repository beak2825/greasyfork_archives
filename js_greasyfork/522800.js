// ==UserScript==
// @name         FarmRPG Arrow Buttons
// @namespace    duck.wowow
// @version      0.2
// @description  Allows certain buttons to be clicked with the keyboard arrows instead of using a mouse.
// @author       Odung
// @match        https://*.farmrpg.com/index.php
// @match        https://*.farmrpg.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=farmrpg.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522800/FarmRPG%20Arrow%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/522800/FarmRPG%20Arrow%20Buttons.meta.js
// ==/UserScript==

/*
FARMING/CROPS
Left Arrow: Harvest All
Up Arrow: Plant All
Right Arrow: Grape Juice

KITCHEN
Left Arrow: Stir All
Up Arrow: Taste All
Right Arrow: Season All
Down Arrow: Collect All

EXPLORING
Left Arrow: Manual Exploring
Up Arrow: Cider
Right Arrow: Arnold Palmer

FISHING
Left Arrow: Sell All
Up Arrow: Single Nets
Right Arrow: Multiple Nets
Down Arrow: Manual (for mealworms)
*/

(function () {
    'use strict';

    const activeKeys = new Set();
    const eventHandlers = new Map();

    function observePage() {
        const targetNode = document.querySelector('#fireworks');
        if (!targetNode) {
            setTimeout(observePage, 500);
            return;
        }

        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-page') {
                    removeEventListeners();
                    const dataPage = mutation.target.getAttribute('data-page');
                    if (dataPage === 'xfarm') setupXFarmListeners();
                    else if (dataPage === 'fishing') setupFishingListeners();
                    else if (dataPage === 'area') setupAreaListeners();
                    else if (dataPage === 'kitchen') setupKitchenListeners();
                }
            }
        });

        observer.observe(targetNode, { attributes: true });
    }

    function clickButton(selector) {
        const button = document.querySelector(selector);
        if (button) button.click();
    }

    function createKeydownHandler(keyMappings) {
        return (event) => {
            if (keyMappings[event.code] && !activeKeys.has(event.code)) {
                activeKeys.add(event.code);
                clickButton(keyMappings[event.code]);
            }
        };
    }

    function setupXFarmListeners() {
        const keyMappings = {
            ArrowLeft: '.button.btnorange.harvestallbtn',
            ArrowUp: '.button.btnblue.plantallbtn',
            ArrowRight: '.button.btnpurple.drinkgjbtnnc'
        };

        const keydownHandler = createKeydownHandler(keyMappings);
        document.addEventListener('keydown', keydownHandler);
        eventHandlers.set('xfarm', keydownHandler);
    }

    function setupKitchenListeners() {
        const keyMappings = {
            ArrowLeft: '.button.btngreenalt.stirmealall',
            ArrowUp: '.button.btnblue.tastemealall',
            ArrowRight: '.button.btnpurple.seasonmealall',
            ArrowDown: '.button.btnorange.cookreadyallbtn'
        };

        const keydownHandler = createKeydownHandler(keyMappings);
        document.addEventListener('keydown', keydownHandler);
        eventHandlers.set('kitchen', keydownHandler);
    }

    function setupFishingListeners() {
        const keyMappings = {
            ArrowLeft: '.button.btngreenalt.sellallfishbtnnc',
            ArrowUp: '.button.btnblue.castnetbtnnc.disable-select',
            ArrowRight: '.button.btnpurple.cnlnl.castnetbtnnc.disable-select',
            ArrowDown: '#water'
        };

        const keydownHandler = createKeydownHandler(keyMappings);
        document.addEventListener('keydown', keydownHandler);
        eventHandlers.set('fishing', keydownHandler);
    }

    function setupAreaListeners() {
        const keyMappings = {
            ArrowLeft: '.item-content.explorebtn',
            ArrowUp: '.item-content.drinkcidernc',
            ArrowRight: '.item-content.drinklmnc'
        };

        const keydownHandler = createKeydownHandler(keyMappings);
        document.addEventListener('keydown', keydownHandler);
        eventHandlers.set('area', keydownHandler);
    }

    function removeEventListeners() {
        for (const [page, handler] of eventHandlers) {
            document.removeEventListener('keydown', handler);
        }
        eventHandlers.clear();
    }

    document.addEventListener('keyup', (event) => {
        activeKeys.delete(event.code);
    });

    observePage();
})();
