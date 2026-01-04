// ==UserScript==
// @name         Auto Heal for Mobile MooMoo.io
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto heal mod for MooMoo.io with a button to enable auto heal and a chat message for mobile users
// @author       wat
// @match        *://*.moomoo.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502023/Auto%20Heal%20for%20Mobile%20MooMooio.user.js
// @updateURL https://update.greasyfork.org/scripts/502023/Auto%20Heal%20for%20Mobile%20MooMooio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create and style the auto heal button
    function createHealButton() {
        const healButton = document.createElement('button');
        healButton.innerText = 'Enable Auto Heal';
        healButton.style.position = 'fixed';
        healButton.style.bottom = '20px';
        healButton.style.right = '20px';
        healButton.style.padding = '10px 20px';
        healButton.style.backgroundColor = '#4CAF50';
        healButton.style.color = 'white';
        healButton.style.border = 'none';
        healButton.style.borderRadius = '5px';
        healButton.style.cursor = 'pointer';
        healButton.style.zIndex = '10000';
        document.body.appendChild(healButton);

        let autoHealEnabled = false;

        // Event listener for the heal button
        healButton.addEventListener('click', () => {
            autoHealEnabled = !autoHealEnabled;
            healButton.innerText = autoHealEnabled ? 'Disable Auto Heal' : 'Enable Auto Heal';

            // Notify the player via in-game chat
            if (autoHealEnabled) {
                sendMessageToChat('Auto heal enabled');
            }
        });

        // Auto heal logic
        setInterval(() => {
            if (autoHealEnabled) {
                const player = window.player; // Assuming 'window.player' is the player object
                if (player && player.health < player.maxHealth) {
                    player.health = player.maxHealth; // Set health to max
                }
            }
        }, 1000); // Check every second
    }

    // Function to send a message to the in-game chat
    function sendMessageToChat(message) {
        const chatInput = document.querySelector('input[type="text"]'); // Assumes chat input is an <input> element
        if (chatInput) {
            chatInput.value = message;
            const event = new Event('input', { bubbles: true });
            chatInput.dispatchEvent(event);

            // Simulate sending the message
            const sendButton = document.querySelector('button[type="submit"]'); // Assumes there's a send button
            if (sendButton) {
                sendButton.click();
            }
        }
    }

    // Wait until the page loads completely
    window.addEventListener('load', createHealButton);
})();
