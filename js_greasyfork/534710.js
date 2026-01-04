// ==UserScript==
// @name         IdleMMO Auto Money Bot
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automates clicking to earn money in IdleMMO until a target is reached
// @author       You
// @match        *://www.idle-mmo.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534710/IdleMMO%20Auto%20Money%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/534710/IdleMMO%20Auto%20Money%20Bot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === CONFIG ===
    const TARGET_MONEY = 100000; // change this to your goal
    const CLICK_INTERVAL = 3000; // milliseconds between actions

    // === UTILITIES ===
    function getMoney() {
        // Change this to the actual element that displays money
        const moneyEl = document.querySelector('#gold, .gold, [data-money]');
        if (!moneyEl) return 0;

        let moneyText = moneyEl.innerText.replace(/[^0-9]/g, '');
        return parseInt(moneyText, 10) || 0;
    }

    function clickActionButton() {
        // Replace with the actual button selector
        const button = document.querySelector('#mine-button, .train-button, .work-button');
        if (button) {
            console.log('[Bot] Clicking action button...');
            button.click();
        } else {
            console.log('[Bot] Action button not found.');
        }
    }

    function loop() {
        const currentMoney = getMoney();
        console.log(`[Bot] Current Money: ${currentMoney}`);

        if (currentMoney >= TARGET_MONEY) {
            console.log(`[Bot] Target reached: ${currentMoney}. Stopping.`);
            return;
        }

        clickActionButton();
        setTimeout(loop, CLICK_INTERVAL);
    }

    // Wait a few seconds to let the game fully load
    setTimeout(loop, 5000);
})();
