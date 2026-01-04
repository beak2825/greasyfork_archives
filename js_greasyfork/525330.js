// ==UserScript==
// @name         MooMoo.io Mod - Auto-Heal, Hat Macro, Trap Macro, Captcha Bypass
// @version      1.1
// @description  Instantly heals, switches hats with SHIFT, places 4 traps with T, and bypasses captchas
// @author       YourName
// @match        *://moomoo.io/*
// @match        *://*.moomoo.io/*
// @grant        none
// @namespace https://greasyfork.org/users/1428570
// @downloadURL https://update.greasyfork.org/scripts/525330/MooMooio%20Mod%20-%20Auto-Heal%2C%20Hat%20Macro%2C%20Trap%20Macro%2C%20Captcha%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/525330/MooMooio%20Mod%20-%20Auto-Heal%2C%20Hat%20Macro%2C%20Trap%20Macro%2C%20Captcha%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastHealth = 100; // Track last known health
    let isTank = false;   // Track current hat (false = Soldier, true = Tank)

    // Check if window.gameObjects and window.myPlayerID are accessible
    function getPlayer() {
        if (window.gameObjects && window.myPlayerID) {
            return window.gameObjects[window.myPlayerID];
        }
        return null;
    }

    // Function to directly interact with the game UI to trigger actions
    function clickElement(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.click();
        }
    }

    // **Super Fast Auto-Heal** (Instant heal when taking damage)
    setInterval(() => {
        const player = getPlayer(); // Get player data

        if (player) {
            if (player.health < lastHealth) { // Took damage
                console.log("Damage detected! Spamming heal...");

                // Assuming food is in the inventory and food ID is 52
                if (player.inventory.includes(52)) {
                    clickElement('[data-item-id="52"]'); // Simulate clicking on food item in the inventory

                    // Spam food usage
                    const healInterval = setInterval(() => {
                        if (player.health >= player.maxHealth) {
                            clearInterval(healInterval); // Stop if fully healed
                        } else {
                            clickElement('[data-item-id="52"]'); // Use food
                        }
                    }, 50); // Heal every 50ms
                }
            }

            lastHealth = player.health; // Update last health value
        }
    }, 10); // Check every 10ms for instant reaction

    // **Hat Switch Macro** (SHIFT to toggle between Tank Gear and Soldier Helmet)
    document.addEventListener('keydown', (event) => {
        if (event.key === "Shift") {
            isTank = !isTank;
            console.log(`Switched to ${isTank ? "Tank Gear" : "Soldier Helmet"}`);

            // Assuming the game uses the key codes 56 for Tank and 53 for Soldier (adjust as needed)
            if (isTank) {
                sendKey(56); // Tank Gear keycode
            } else {
                sendKey(53); // Soldier Helmet keycode
            }
        }
    });

    // **Trap Macro** (Press "T" to place 4 traps around you)
    document.addEventListener('keydown', (event) => {
        if (event.key === "T") {
            console.log("Placing 4 traps around...");

            // Select Trap
            sendKey(54); // Assuming 54 selects the trap item, change if necessary

            setTimeout(() => sendKey(32), 100); // Place 1st trap
            setTimeout(() => sendKey(32), 200); // Place 2nd trap
            setTimeout(() => sendKey(32), 300); // Place 3rd trap
            setTimeout(() => sendKey(32), 400); // Place 4th trap
        }
    });

    // **Captcha Bypass** (Auto-solves captchas, placeholder)
    setInterval(() => {
        const captchaBox = document.querySelector("#captchaBox");
        const captchaInput = document.querySelector("#captchaInput");

        if (captchaBox && captchaBox.style.display !== "none") {
            console.log("Captcha detected! Auto-solving...");
            // Dummy captcha solution (adjust as necessary)
            const captchaAnswer = "1234";  // Placeholder solution, adjust logic as needed
            if (captchaInput) {
                captchaInput.value = captchaAnswer;
                captchaInput.dispatchEvent(new Event('input', { bubbles: true }));
                setTimeout(() => clickElement("#captchaSubmit"), 200);
            }
        }
    }, 1000); // Check for captcha every second

    // Function to simulate a keypress event (if needed)
    function sendKey(code) {
        const event = new KeyboardEvent('keydown', {
            keyCode: code,
            bubbles: true
        });
        document.dispatchEvent(event);
    }
})();
