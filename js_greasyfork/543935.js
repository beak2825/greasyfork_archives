// ==UserScript==
// @name         SatoshiFaucet Auto Login + Claim LTC
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Auto login, solve emoji captcha, go to Faucet LTC, and claim reward. / Auto shortlink as soon as possible.
// @author       Rubystance
// @license      MIT
// @match        https://satoshifaucet.io/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/543935/SatoshiFaucet%20Auto%20Login%20%2B%20Claim%20LTC.user.js
// @updateURL https://update.greasyfork.org/scripts/543935/SatoshiFaucet%20Auto%20Login%20%2B%20Claim%20LTC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const FAUCETPAY_EMAIL = 'YOUR_FAUCETPAY_EMAIL_HERE'; // ← your FaucetPay email
    const FAUCET_LTC_LINK = 'https://satoshifaucet.io/faucet/currency/ltc';

    const emojiMap = {
        'Angry': 'angry.gif',
        'Love': 'love.gif',
        'Sad': 'sad.gif',
        'Flame': 'flame.gif',
        'Haha': 'haha.gif',
        'Like': 'like.gif',
    };

    function waitForElement(selector, callback, interval = 300, timeout = 10000) {
        const start = Date.now();
        const timer = setInterval(() => {
            const el = document.querySelector(selector);
            if (el) {
                clearInterval(timer);
                callback(el);
            } else if (Date.now() - start > timeout) {
                clearInterval(timer);
                console.warn(`[!] Timeout waiting for: ${selector}`);
            }
        }, interval);
    }

    // === LOGIN PAGE ===
    if (location.pathname === '/' || location.pathname === '/home') {
        waitForElement('input[name="wallet"]', (emailInput) => {
            emailInput.value = FAUCETPAY_EMAIL;
            console.log('[✓] Email filled.');

            setTimeout(() => {
                solveEmojiCaptcha(() => {
                    setTimeout(() => {
                        waitForElement('button.hero_form_btn[type="submit"]', (loginBtn) => {
                            loginBtn.click();
                            console.log('[✓] Clicked "Login Now".');
                        });
                    }, 3000);
                });
            }, 500);
        });
    }

    // === DASHBOARD PAGE ===
    if (location.pathname === '/dashboard') {
        console.log('[✓] On dashboard. Waiting 5 seconds before clicking "Faucet LTC"...');
        setTimeout(() => {
            waitForElement(`a[href="${FAUCET_LTC_LINK}"]`, (ltcLink) => {
                console.log('[✓] Clicking "Faucet LTC"...');
                ltcLink.click();
            }, 300, 10000);
        }, 5000);
    }

    // === FAUCET LTC PAGE ===
    if (location.pathname === '/faucet/currency/ltc') {
        waitForElement('div.captcha-prompt[data-id="question-text"]', () => {
            console.log('[✓] Emoji captcha found on Faucet LTC.');

            solveEmojiCaptcha(() => {
                setTimeout(() => {
                    waitForElement('button.btn.sl_btn[type="submit"]', (claimBtn) => {
                        claimBtn.click();
                        console.log('[✓] Reward claimed!');
                    });
                }, 3000);
            });
        });
    }

    // === CAPTCHA SOLVER ===
    function solveEmojiCaptcha(callbackAfterClick) {
        waitForElement('div.captcha-prompt[data-id="question-text"]', (questionEl) => {
            const questionText = questionEl.textContent.trim();
            console.log('[✓] Captcha question:', questionText);

            const match = questionText.match(/Please click on the : (\w+)/);
            if (!match || !match[1]) {
                console.warn('[!] Emoji not detected.');
                return;
            }

            const emojiName = match[1];
            const emojiIcon = emojiMap[emojiName];

            if (!emojiIcon) {
                console.warn(`[!] Unmapped emoji: ${emojiName}`);
                return;
            }

            const emojiSelector = `div.captcha-item[data-icon="${emojiIcon}"]`;
            waitForElement(emojiSelector, (emojiDiv) => {
                emojiDiv.click();
                console.log(`[✓] Emoji clicked: ${emojiName}`);
                if (typeof callbackAfterClick === 'function') {
                    callbackAfterClick();
                }
            });
        });
    }

})();
