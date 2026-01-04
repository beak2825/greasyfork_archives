// ==UserScript==
// @name         MooMoo.io Super Fast Auto-Heal & Captcha Bypass
// @version      1.1
// @description  Instantly heals when damaged & auto-solves captchas
// @author       YourName
// @match        *://moomoo.io/*
// @match        *://*.moomoo.io/*
// @grant        none
// @namespace https://greasyfork.org/users/1428570
// @downloadURL https://update.greasyfork.org/scripts/525328/MooMooio%20Super%20Fast%20Auto-Heal%20%20Captcha%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/525328/MooMooio%20Super%20Fast%20Auto-Heal%20%20Captcha%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastHealth = 100; // Track last known health

    // Function to send key events
    function sendKey(code) {
        document.dispatchEvent(new KeyboardEvent('keydown', { keyCode: code }));
        document.dispatchEvent(new KeyboardEvent('keyup', { keyCode: code }));
    }

    // Instant Auto-Heal System
    setInterval(() => {
        let player = window.gameObjects[window.myPlayerID]; // Get player data

        if (player) {
            if (player.health < lastHealth) { // If health dropped (took damage)
                console.log("Damage detected! Spamming heal...");

                sendKey(52); // Select food (Assumed ID 52)
                
                // Spam food usage rapidly
                let healInterval = setInterval(() => {
                    if (player.health >= player.maxHealth) {
                        clearInterval(healInterval); // Stop if fully healed
                    } else {
                        sendKey(32); // Use food
                    }
                }, 50); // Heal every 50ms
            }

            lastHealth = player.health; // Update last health value
        }
    }, 10); // Check every 10ms for instant reaction

    // Captcha Bypass
    setInterval(() => {
        let captchaBox = document.querySelector("#captchaBox");
        let captchaInput = document.querySelector("#captchaInput");

        if (captchaBox && captchaBox.style.display !== "none") {
            console.log("Captcha detected! Auto-solving...");
            let captchaAnswer = document.querySelector("#captchaImage").alt; // Get solution from alt text
            if (captchaInput) {
                captchaInput.value = captchaAnswer;
                captchaInput.dispatchEvent(new Event('input', { bubbles: true }));
                setTimeout(() => document.querySelector("#captchaSubmit").click(), 200);
            }
        }
    }, 1000); // Check for captcha every second

})();
