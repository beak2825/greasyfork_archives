// ==UserScript==
// @name         MelvorIdle - Autoloot
// @namespace    http://tampermonkey.net/
// @version      2024-07-05
// @description  Auto do actions
// @author       You
// @match        https://www.melvoridle.com/*
// @match        https://melvoridle.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=melvoridle.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499951/MelvorIdle%20-%20Autoloot.user.js
// @updateURL https://update.greasyfork.org/scripts/499951/MelvorIdle%20-%20Autoloot.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Function to auto loot all items
    function autoLootAll() {
        const lootParentSelector = '#combat-loot';
        const lootChildSelector = '.flex-wrap.justify-horizontal-left > div.pointer-enabled.btn-light.no-bg.bank-item:not(.d-none)';
        const lootAllButtonText = 'Loot All';
        const numberOfItemsUntilLoot = 2;

        var parentElement = document.querySelector(lootParentSelector);

        if (parentElement) {
            var childElements = parentElement.querySelectorAll(lootChildSelector);

            if(childElements.length >=numberOfItemsUntilLoot) {
                const buttons = document.querySelectorAll('button');
                for (const button of buttons) {
                    if (button.textContent.trim() === lootAllButtonText) {
                        button.click();
                        break;
                    }
                }
                console.log('Auto Loot All');
            }
        }
    }

    // Function to auto eat food during a fight
    function autoEatOnFight() {
        const currentHPId = 'combat-player-hitpoints-current';
        const maxHPId = 'combat-player-hitpoints-max';
        const foodSelectButtonId = 'combat-food-select';
        const hpBoostSelector = 'span:nth-of-type(2)';

        const currentHPElement = document.getElementById(currentHPId);
        const maxHPElement = document.getElementById(maxHPId);
        const foodSelectButton = document.getElementById(foodSelectButtonId);

        if (currentHPElement && maxHPElement && foodSelectButton) {
            const currentHP = parseInt(currentHPElement.textContent);
            const maxHP = parseInt(maxHPElement.textContent);

            const activeFoodOption = foodSelectButton.querySelector('food-select-option');
            if (activeFoodOption) {
                const hpBoostSpan = activeFoodOption.querySelector(hpBoostSelector);
                if (hpBoostSpan) {
                    const hpBoostMatch = hpBoostSpan.textContent.match(/\+(\d+) HP/);
                    if (hpBoostMatch) {
                        const hpBoost = parseInt(hpBoostMatch[1]);

                        if ((maxHP - currentHP) >= hpBoost) {
                            console.log('Using food to boost HP');
                            const foodSelectMenuButton = foodSelectButton.querySelector('button');
                            if (foodSelectMenuButton) {
                                foodSelectMenuButton.click();
                            }
                        }
                    }
                }
            }
        }
    }

    function checkFoodAndRun() {
        const foodSelectButtonId = 'combat-food-select';
        const runButtonId = 'combat-btn-run';
        const foodQuantitySelector = 'span:nth-of-type(1)';

        const foodSelectButton = document.getElementById(foodSelectButtonId);
        const runButton = document.getElementById(runButtonId);

        if (foodSelectButton) {
            const foodOption = foodSelectButton.querySelector('food-select-option');
            if (foodOption) {
                const foodQuantitySpan = foodOption.querySelector(foodQuantitySelector);
                if (foodQuantitySpan) {
                    const foodQuantityMatch = foodQuantitySpan.textContent.match(/\((\d+)\)/);
                    if (foodQuantityMatch) {
                        const foodQuantity = parseInt(foodQuantityMatch[1]);

                        if (foodQuantity < 5) {
                            console.log('Food quantity is less than 5, running away');
                            if (runButton) {
                                runButton.click();
                            }
                        }
                    }
                }
            }
        }
    }

    // Set intervals for auto loot and auto eat functions
    const checkInterval = 1000; // 1 second
    setInterval(autoLootAll, checkInterval);
    setInterval(autoEatOnFight, checkInterval);
    setInterval(checkFoodAndRun, checkInterval);
})();