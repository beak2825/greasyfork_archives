// ==UserScript==
// @name         Fuckoff twitch powerups
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Removes Twitch Power-ups, "Power-ups" header, other unnecessary headers, and adjusts the "Power-ups & Rewards" label to just "Rewards".
// @author       Maidragora
// @match        https://www.twitch.tv/*
// @grant        GM_addStyle
// @run-at       document-idle
// @homepage     https://twitter.com/maidragora
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/511292/Fuckoff%20twitch%20powerups.user.js
// @updateURL https://update.greasyfork.org/scripts/511292/Fuckoff%20twitch%20powerups.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MAX_RETRIES = 10;
    const POWER_UP_SELECTOR = '[class*="bitsRewardListItem"], [class*="DgbIe"]';
    const ELEMENTS_TO_REMOVE = [
        '.Layout-sc-1xcs6mc-0.josRc',
        '.Layout-sc-1xcs6mc-0.DgbIe.bitsRewardListItem--yx4rk'
    ];
    const REWARDS_HEADER_SELECTOR = 'p.tw-title';
    const ELEMENT_TO_MODIFY = '.Layout-sc-1xcs6mc-0.jbwlnY';
    const REWARDS_LIST_SELECTOR = '.rewards-list';

    let retries = 0;

    function removePowerUpsAndHeaders() {
        try {
            const powerUpElements = document.querySelectorAll(POWER_UP_SELECTOR);
            let removedCount = 0;

            powerUpElements.forEach(element => {
                try {
                    const titleText = element.querySelector('p')?.innerText || '';
                    if (/Power-ups|Message Effects|Gigantify|Celebration/.test(titleText)) {
                        element.remove();
                        removedCount++;
                    }
                } catch (error) {
                    console.error('Error removing power-up element:', error);
                }
            });

            ELEMENTS_TO_REMOVE.forEach(selector => {
                try {
                    const element = document.querySelector(selector);
                    if (element) {
                        element.remove();
                        removedCount++;
                    }
                } catch (error) {
                    console.error('Error removing element with selector:', selector, error);
                }
            });

            const rewardsHeaders = document.querySelectorAll(REWARDS_HEADER_SELECTOR);
            rewardsHeaders.forEach(header => {
                try {
                    if (/'s Rewards/.test(header.innerText)) {
                        header.closest('.Layout-sc-1xcs6mc-0')?.remove();
                        removedCount++;
                    }
                } catch (error) {
                    console.error('Error removing rewards header:', error);
                }
            });

            const elementToModify = document.querySelector(ELEMENT_TO_MODIFY);
            if (elementToModify) {
                try {
                    elementToModify.style.setProperty('padding-top', '0', 'important');
                    elementToModify.style.setProperty('margin-top', '0', 'important');
                } catch (error) {
                    console.error('Error modifying element styles:', error);
                }
            }

            if (removedCount === 0 && retries < MAX_RETRIES) {
                retries++;
                setTimeout(removePowerUpsAndHeaders, 1000);
            }
        } catch (error) {
            console.error('Error in removePowerUpsAndHeaders function:', error);
        }
    }

    function observeRewardList() {
        try {
            const rewardsList = document.querySelector(REWARDS_LIST_SELECTOR);
            if (rewardsList) {
                const rewardsObserver = new MutationObserver(() => {
                    try {
                        removePowerUpsAndHeaders();
                    } catch (error) {
                        console.error('Error during MutationObserver callback:', error);
                    }
                });

                rewardsObserver.observe(rewardsList, { childList: true, subtree: true });
                removePowerUpsAndHeaders();
            }
        } catch (error) {
            console.error('Error in observeRewardList function:', error);
        }
    }

    try {
        const bodyObserver = new MutationObserver(() => {
            try {
                observeRewardList();
            } catch (error) {
                console.error('Error during bodyObserver callback:', error);
            }
        });

        bodyObserver.observe(document.body, { childList: true, subtree: true });
        observeRewardList();
    } catch (error) {
        console.error('Error in initial MutationObserver setup:', error);
    }
})();