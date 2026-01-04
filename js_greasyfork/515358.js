// ==UserScript==
// @name         Diep.io Auto-leveler Bot Enhanced
// @namespace    http://tampermonkey.net/
// @version      2024-11-02
// @description  Press Q to toggle auto-leveling; must be in the base once for team detection.
// @match        https://diep.io/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/515358/Diepio%20Auto-leveler%20Bot%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/515358/Diepio%20Auto-leveler%20Bot%20Enhanced.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isBotActive = false;
    let teamDetected = false;
    let team = null;
    let maxLevel = 45;  // Diep.io max level (you can adjust this if needed)
    let upgradeOrder = ["health", "bulletSpeed", "reload", "movementSpeed"]; // Example upgrade order

    // Toggle the bot with the "Q" key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Q' || event.key === 'q') {
            isBotActive = !isBotActive;
            console.log(`Auto-leveler is now ${isBotActive ? 'ON' : 'OFF'}`);
            if (isBotActive && !teamDetected) {
                detectTeam();
            }
        }
    });

    // Detect the player's team by identifying game-related variables or attributes
    function detectTeam() {
        try {
            // This is a generalized approach. You may need to update it with specific variables used in Diep.io.
            if (window.game && window.game.team) {  // Replace this with Diep.io's actual team variable
                team = window.game.team;
                teamDetected = true;
                console.log(`Team detected: ${team}`);
            } else {
                console.log("Unable to detect team. Make sure you are in the base at least once.");
            }
        } catch (error) {
            console.error("Team detection error:", error);
        }
    }

    // Main function that performs leveling up
    function autoLevel() {
        if (!isBotActive || !teamDetected) return;

        try {
            // Check player level and experience points (assumes Diep.io has a player object with level tracking)
            if (window.player && window.player.level < maxLevel) { 
                // Replace `window.player` with Diep.io's actual player object or variable path
                for (let stat of upgradeOrder) {
                    upgradeStat(stat);  // Attempt to upgrade each stat in the order specified
                }
                console.log(`Auto-leveling... Current level: ${window.player.level}`);
            }
        } catch (error) {
            console.error("Auto-leveling error:", error);
        }
    }

    // Upgrade a specified stat, simulating a user clicking the upgrade button or triggering a level-up function
    function upgradeStat(statName) {
        try {
            // Example action to upgrade stat, replace with Diep.io's actual upgrade mechanism
            if (window.upgrade && typeof window.upgrade[statName] === "function") {
                window.upgrade[statName]();  // Attempt to upgrade the specified stat
                console.log(`Upgraded ${statName}`);
            } else {
                console.log(`Upgrade function for ${statName} not found`);
            }
        } catch (error) {
            console.error(`Error upgrading ${statName}:`, error);
        }
    }

    // Interval to check for leveling
    setInterval(() => {
        autoLevel();
    }, 1000); // Adjust interval as needed for optimal performance

})();
