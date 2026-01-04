// ==UserScript==
// @name         BitFaucet Auto Claim
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto login, auto captcha solver. / Auto shortlinks soon.
// @author       Rubystance
// @license      MIT
// @match        https://bitfaucet.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543916/BitFaucet%20Auto%20Claim.user.js
// @updateURL https://update.greasyfork.org/scripts/543916/BitFaucet%20Auto%20Claim.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const email = "YOUR_FAUCETPAY_EMAIL_HERE"; // ← Replace with your FaucetPay email
    const maxClaims = 50;
    const claimInterval = 15 * 1000;

    const emojiMap = {
        'Angry': 'angry.gif',
        'Love': 'love.gif',
        'Sad': 'sad.gif',
        'Flame': 'flame.gif',
        'Haha': 'haha.gif',
        'Like': 'like.gif',
    };

    function waitForElement(selector, callback, timeout = 15000) {
        const interval = 200;
        let elapsed = 0;
        const loop = setInterval(() => {
            const el = document.querySelector(selector);
            if (el) {
                clearInterval(loop);
                callback(el);
            } else if ((elapsed += interval) >= timeout) {
                clearInterval(loop);
                console.warn("⌛ Timeout waiting for:", selector);
            }
        }, interval);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function fillEmail() {
        const input = document.querySelector('#InputEmail');
        if (input && input.value.trim() === "") {
            input.value = email;
            console.log("📩 Email filled.");
        }
    }

    async function solveEmojiCaptchaUniversal() {
        const question = document.querySelector('[data-id="question-text"]');
        if (!question) return false;

        const questionText = question.textContent.trim();
        const match = questionText.match(/Please click on the : (\w+)/);
        if (!match || !match[1]) return false;

        const emojiName = match[1];
        const emojiIcon = emojiMap[emojiName];
        if (!emojiIcon) return false;

        const emojiElement = document.querySelector(`.captcha-item[data-icon="${emojiIcon}"]`);
        if (emojiElement) {
            emojiElement.click();
            const hiddenInput = document.querySelector('input[name="selected_icon"][data-id="selected-icon"]');
            if (hiddenInput) hiddenInput.value = emojiIcon;
            console.log(`✅ Clicked emoji: "${emojiName}"`);
            await sleep(1500);
            return true;
        }

        return false;
    }

    async function clickLoginButton() {
        const button = document.querySelector('button.btn-one[type="submit"]');
        if (button) {
            await sleep(1000);
            button.click();
            console.log("🔓 Login submitted.");
        }
    }

    function goToFaucetLTC() {
        const ltcLink = document.querySelector('a[href*="/faucet/currency/ltc"]');
        if (ltcLink) {
            console.log("➡️ Navigating to Faucet LTC...");
            window.location.href = ltcLink.href;
        }
    }

    async function tryClickClaimButton(count = 0) {
        if (count >= maxClaims) {
            console.log("🚫 50 claim limit reached.");
            return;
        }

        const captchaPresent = document.querySelector('[data-id="question-text"]');
        if (captchaPresent) {
            console.log("🔄 Solving emoji captcha...");
            const solved = await solveEmojiCaptchaUniversal();
            if (!solved) {
                console.log("❌ Failed to solve captcha. Retrying in 3s...");
                return setTimeout(() => tryClickClaimButton(count), 3000);
            }

            console.log("⏳ Waiting 3 seconds before clicking 'Get Reward'...");
            await sleep(3000);
        }

        waitForElement('button.btn.sl_btn', async (button) => {
            if (button && !button.disabled) {
                console.log(`✅ Claim #${count + 1} submitted...`);
                button.click();

                await sleep(claimInterval);
                location.reload();

                setTimeout(() => tryClickClaimButton(count + 1), 10000);
            } else {
                console.log("⏳ Claim button not available yet. Retrying in 5s...");
                setTimeout(() => tryClickClaimButton(count), 5000);
            }
        }, 20000);
    }

    async function startLogin() {
        fillEmail();
        await sleep(2000);
        const captchaOk = await solveEmojiCaptchaUniversal();
        if (captchaOk) {
            await sleep(2000);
            await clickLoginButton();
        } else {
            console.log("❌ Could not solve emoji captcha at login.");
        }
    }

    // === Page Routing ===

    if (window.location.pathname === "/" || window.location.pathname.includes("login")) {
        waitForElement('#InputEmail', startLogin);
    }

    if (window.location.href === "https://bitfaucet.net/dashboard") {
        setTimeout(goToFaucetLTC, 4000);
    }

    if (window.location.href.includes("/faucet/currency/ltc")) {
        console.log("🚿 LTC Faucet page detected.");
        waitForElement('[data-id="question-text"]', async () => {
            await solveEmojiCaptchaUniversal();
            await sleep(4000);
            tryClickClaimButton();
        }, 15000);
    }
})();
