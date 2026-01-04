// ==UserScript==
// @name         IdleMMO Auto-Miner
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically mines ore until a gold target is reached
// @author       You
// @match        *://www.idle-mmo.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534758/IdleMMO%20Auto-Miner.user.js
// @updateURL https://update.greasyfork.org/scripts/534758/IdleMMO%20Auto-Miner.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const TARGET_GOLD = 10000; // ← Change this to your goal
    const ORE_NAME = "Coal Ore"; // ← Change to "Tin Ore" if needed
    const ACTION_INTERVAL = 13000; // milliseconds (12s + buffer)

    function getGold() {
        const goldElement = document.querySelector('div:has(svg[data-icon="coins"]) + span');
        if (!goldElement) return 0;

        const goldText = goldElement.textContent.replace(/[^0-9]/g, '');
        return parseInt(goldText, 10) || 0;
    }

    function clickOreByName(name) {
        const oreCards = document.querySelectorAll("div:has(h2)");

        for (const card of oreCards) {
            const label = card.querySelector("h2");
            if (label && label.textContent.includes(name)) {
                label.click();
                console.log(`[AutoMiner] Clicked: ${name}`);
                return;
            }
        }
        console.warn("[AutoMiner] Ore not found.");
    }

    function mainLoop() {
        const gold = getGold();
        console.log(`[AutoMiner] Current gold: ${gold}`);

        if (gold >= TARGET_GOLD) {
            console.log(`[AutoMiner] Target gold (${TARGET_GOLD}) reached. Stopping.`);
            return;
        }

        clickOreByName(ORE_NAME);
        setTimeout(mainLoop, ACTION_INTERVAL);
    }

    setTimeout(mainLoop, 5000); // Give page time to load
})();
