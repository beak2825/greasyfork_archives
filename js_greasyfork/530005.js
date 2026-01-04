// ==UserScript==
// @name         Taming.io Auto Farm
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto farm resources and use gapples in Taming.io
// @author       You
// @match        https://taming.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530005/Tamingio%20Auto%20Farm.user.js
// @updateURL https://update.greasyfork.org/scripts/530005/Tamingio%20Auto%20Farm.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Taming.io Auto Farm Script Loaded!");

    let autoFarm = true; // Toggle auto-farming on/off
    let autoHeal = true; // Toggle auto-healing using gapples

    // Function to simulate key presses
    function pressKey(key) {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: key }));
        setTimeout(() => {
            document.dispatchEvent(new KeyboardEvent('keyup', { key: key }));
        }, 100); // Short delay
    }

    // Function to auto-farm
    function startFarming() {
        setInterval(() => {
            if (autoFarm) {
                pressKey("e"); // Press 'E' to hit trees, rocks, and collect items
            }
        }, 500); // Every 0.5 seconds
    }

    // Function to auto-heal when HP is low
    function checkHealth() {
        setInterval(() => {
            let hpElement = document.querySelector("#health-bar"); // Check the health bar element
            if (hpElement) {
                let hp = parseInt(hpElement.style.width.replace("%", "")); // Get HP as a percentage
                if (hp < 30 && autoHeal) { // If HP is below 30%, eat a gapple
                    console.log("Low HP! Using Gapple...");
                    pressKey("q"); // 'Q' is usually the key for consuming items
                }
            }
        }, 1000); // Check every second
    }

    // Toggle Auto-Farming with "F" key
    document.addEventListener("keydown", (event) => {
        if (event.key === "f") {
            autoFarm = !autoFarm;
            console.log("Auto-Farming: " + (autoFarm ? "ON" : "OFF"));
        }
        if (event.key === "h") {
            autoHeal = !autoHeal;
            console.log("Auto-Heal: " + (autoHeal ? "ON" : "OFF"));
        }
    });

    // Start the auto-farming and healing functions
    startFarming();
    checkHealth();
})();
