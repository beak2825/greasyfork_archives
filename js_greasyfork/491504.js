// ==UserScript==
// @name         MC kulcs/key generator at minecraft.net
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Rapidly and automatically generate and redeem 20-character gift codes on Minecraft website
// @author       dhex98
// @match        https://www.minecraft.net/*
// @grant        none
// @license      dhex98
// @downloadURL https://update.greasyfork.org/scripts/491504/MC%20kulcskey%20generator%20at%20minecraftnet.user.js
// @updateURL https://update.greasyfork.org/scripts/491504/MC%20kulcskey%20generator%20at%20minecraftnet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to generate a random alphanumeric string of length n
    function generateCode(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    // Function to check if the redemption message indicates successful redemption
    function isSuccessRedemptionMessage(message) {
        return message.includes("Successfully redeemed code");
    }

    // Function to redeem a code
    function redeemCode(code) {
        var inputField = document.querySelector('input.redeem__input-textbox[data-testid="code"]');
        if (inputField) {
            inputField.value = code;
            inputField.setAttribute('aria-invalid', 'false');
            // Click the Redeem button
            document.querySelector('button[data-testid="button-redeem"]').click();
        }
    }

    // Function to generate and redeem codes rapidly and automatically
    function automateRedemption() {
        // Start the interval for rapid redemption
        var interval = setInterval(function() {
            // Generate a new code
            var newCode = generateCode(5) + '-' + generateCode(5) + '-' + generateCode(5) + '-' + generateCode(5);
            // Redeem the code
            redeemCode(newCode);
        }, 100); // Adjust the interval as needed for rapid redemption
    }

    // Start the redemption process
    automateRedemption();
})();