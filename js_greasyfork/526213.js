// ==UserScript==
// @name         Aternos Auto-Sign Up Script
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automaticially puts in a username, agrees to the tos and privacy consent, click the buttons yourself, and wait 10 secs after pressing the next button and it will automaticially put a password. Normal password is just password, but you can change it in settings.
// @author       Huggy Wuggy
// @match        https://aternos.org/signup/
// @grant        none
// @license      CC BY-NC 4.0
// @downloadURL https://update.greasyfork.org/scripts/526213/Aternos%20Auto-Sign%20Up%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/526213/Aternos%20Auto-Sign%20Up%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';
    'use esversion: 8';
    
    function generateUsername() {
        const randomNumbers = Math.floor(1000 + Math.random() * 9000);
        return `huggy${randomNumbers}`;
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function typeWithDelay(element, text, delayMs) {
        for (let i = 0; i < text.length; i++) {
            element.value += text[i];
            const event = new Event('input', { bubbles: true });
            element.dispatchEvent(event);
            await delay(delayMs);
        }
    }

    async function sendToDiscord(username, password) {
        const webhookUrl = 'YOUR_WEBHOOK_URL_HERE';

        const data = {
            content: `Generated Aternos Account!:
            Username: ${username}
            Password: ${password}`
        };

        try {
            await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            console.log('Data sent to Discord!');
        } catch (error) {
            console.error('Error sending to Discord:', error);
        }
    }

    window.addEventListener('load', async () => {
        const username = generateUsername();
        console.log('Generated Username:', username);

        const usernameInput = document.querySelector('input.user');
        if (!usernameInput) {
            console.error('Username input not found!');
            return;
        }

        usernameInput.click();
        await delay(500);

        await typeWithDelay(usernameInput, username, 500);

        await delay(1000);

        const acceptTerms = document.querySelector('#accept-terms');
        const privacyConsent = document.querySelector('#prvcy-cnsnt');

        if (acceptTerms && privacyConsent) {
            acceptTerms.click();
            await delay(500);
            privacyConsent.click();
        }

        await delay(10000);

        const passwordInput = document.querySelector('#password');
        const retypePasswordInput = document.querySelector('#password-retype');
        const password = 'password';

        if (passwordInput && retypePasswordInput) {
            passwordInput.value = password;
            const passwordInputEvent = new Event('input', { bubbles: true });
            passwordInput.dispatchEvent(passwordInputEvent);

            retypePasswordInput.value = password;
            const retypePasswordInputEvent = new Event('input', { bubbles: true });
            retypePasswordInput.dispatchEvent(retypePasswordInputEvent);

            await sendToDiscord(username, password);
        } else {
            console.error('Password fields not found!');
        }
    });
})();