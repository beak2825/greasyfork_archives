// ==UserScript==
// @name         Torn Dynamic Gym Auto-Trainer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically train when energy is full, using dynamic timing.
// @author       You
// @match        https://www.torn.com/gym.php
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/541959/Torn%20Dynamic%20Gym%20Auto-Trainer.user.js
// @updateURL https://update.greasyfork.org/scripts/541959/Torn%20Dynamic%20Gym%20Auto-Trainer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TARGET_STAT = "strength"; // Options: strength, speed, dexterity, defense
    const ENERGY_THRESHOLD = 50; // Only train when this much or more energy is available
    const CHECK_INTERVAL = 60 * 1000; // Check every 60 seconds

    const parseEnergyBar = () => {
        const text = document.querySelector("#energyBarText")?.textContent;
        if (!text) return null;

        const [current, max] = text.split('/').map(n => parseInt(n.trim()));
        return { current, max };
    };

    const train = () => {
        const statButton = document.querySelector(`li.train.${TARGET_STAT} .primary-button`);
        if (statButton) {
            statButton.click();
            console.log(`[Gym Trainer] Trained ${TARGET_STAT}`);
            return true;
        } else {
            console.log(`[Gym Trainer] Stat button not found for: ${TARGET_STAT}`);
            return false;
        }
    };

    const loopCheck = () => {
        const energy = parseEnergyBar();
        if (!energy) {
            console.log("[Gym Trainer] Could not parse energy bar");
            return;
        }

        console.log(`[Gym Trainer] Energy: ${energy.current}/${energy.max}`);

        if (energy.current >= Math.min(energy.max, ENERGY_THRESHOLD)) {
            if (train()) {
                // After training, wait a full regen cycle before checking again (4.5h)
                setTimeout(loopCheck, 270 * 60 * 1000);
                return;
            }
        }

        // Keep checking until energy fills up
        setTimeout(loopCheck, CHECK_INTERVAL);
    };

    // Wait for gym page to fully load
    const waitForEnergyBar = setInterval(() => {
        if (document.querySelector("#energyBarText")) {
            clearInterval(waitForEnergyBar);
            console.log("[Gym Trainer] Gym page detected. Starting monitoring...");
            loopCheck();
        }
    }, 1000);
})();
