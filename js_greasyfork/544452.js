// ==UserScript==
// @name         Keran Faucet Auto Claim + Reload + Click Claim Link
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Auto claim! button or link, reload if stuck on waiting or inactive, and retry if captcha is wrong.
// @author       Rubystance
// @license      MIT
// @match        https://keran.co/faucet.php*
// @match        https://keran.co/captha.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544452/Keran%20Faucet%20Auto%20Claim%20%2B%20Reload%20%2B%20Click%20Claim%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/544452/Keran%20Faucet%20Auto%20Claim%20%2B%20Reload%20%2B%20Click%20Claim%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const delay = ms => new Promise(res => setTimeout(res, ms));

    async function humanDelay(min = 500, max = 1500) {
        const ms = Math.floor(Math.random() * (max - min + 1)) + min;
        await delay(ms);
    }

    function forceReload() {
        console.log('🔄 Forcing page reload (ignoring confirmation)...');
        window.onbeforeunload = null;
        location.reload();
    }

    function monitorInactivity() {
        const checkInterval = 30 * 1000;
        const maxInactiveTime = 5 * 60 * 1000;
        let inactiveStart = null;

        setInterval(() => {
            const waitingBtn = document.querySelector('button.button.is-link[disabled]');
            const isWaiting = waitingBtn && waitingBtn.textContent.trim().toLowerCase() === 'waiting...';

            if (isWaiting) {
                if (!inactiveStart) {
                    inactiveStart = Date.now();
                    console.log('⏳ Detected inactive "Waiting..." state, starting timer...');
                } else {
                    const elapsed = Date.now() - inactiveStart;
                    if (elapsed >= maxInactiveTime) {
                        console.warn('⏰ Inactive for 5 minutes. Reloading...');
                        forceReload();
                    } else {
                        console.log(`⏳ Still inactive for ${Math.floor(elapsed / 1000)}s.`);
                    }
                }
            } else {
                if (inactiveStart) console.log('✅ Activity detected, resetting timer.');
                inactiveStart = null;
            }
        }, checkInterval);
    }

    async function retryIfCaptchaWrong() {
        const errorLink = document.querySelector('p > a[href="faucet.php"]');
        const errorText = document.body.innerText.toLowerCase();

        if (errorLink && errorText.includes('captcha is wrong')) {
            console.warn('❌ Captcha was wrong. Retrying...');
            await humanDelay();
            errorLink.click();
            return true;
        }
        return false;
    }

    async function waitAndClickClaim() {
        const maxWaitWaiting = 10000;
        let waitingStart = null;

        while (true) {
            const retrying = await retryIfCaptchaWrong();
            if (retrying) return;

            const claimBtn = document.querySelector('button.button.is-link[type="submit"]:not([disabled])');
            const claimLink = document.querySelector('a.button.is-small.is-info[href*="faucet.php"]:not([disabled])');
            const waitingBtn = document.querySelector('button.button.is-link[disabled]');

            if (claimBtn) {
                console.log('✅ "Claim Now!" BUTTON enabled. Clicking...');
                await humanDelay();
                claimBtn.click();
                return;
            }

            if (claimLink) {
                console.log('✅ "Claim Now" LINK found. Clicking...');
                await humanDelay();
                claimLink.click();
                return;
            }

            if (waitingBtn && waitingBtn.textContent.trim().toLowerCase() === 'waiting...') {
                if (!waitingStart) {
                    waitingStart = Date.now();
                    console.log('⏳ Button disabled with "Waiting...". Starting timer...');
                } else {
                    const elapsed = Date.now() - waitingStart;
                    if (elapsed > maxWaitWaiting) {
                        console.warn('⏱️ Button stuck on "Waiting..." for >10s. Reloading...');
                        forceReload();
                        return;
                    } else {
                        console.log(`⏳ Still waiting for ${Math.floor(elapsed / 1000)}s.`);
                    }
                }
            } else {
                waitingStart = null;
                console.log('⏳ "Claim Now!" not yet available...');
            }

            await delay(1000);
        }
    }

    async function handleCapthaPage() {
        console.log('📍 captha.php page detected. Monitoring button...');
        const maxWait = 10000; // 10s
        const start = Date.now();

        const interval = setInterval(async () => {
            const waitingBtn = document.querySelector('button#submitBtn[disabled]');
            const stillWaiting = waitingBtn && waitingBtn.textContent.trim().toLowerCase() === 'waiting...';

            if (stillWaiting && (Date.now() - start > maxWait)) {
                const faucetLink = document.querySelector('a[href="/faucet.php"]');
                if (faucetLink) {
                    console.warn('⌛ Waiting... for over 10s. Clicking Faucet link...');
                    clearInterval(interval);
                    await humanDelay();
                    faucetLink.click();
                } else {
                    console.error('❌ Faucet link not found!');
                    clearInterval(interval);
                }
            }

            if (!stillWaiting) {
                clearInterval(interval);
                console.log('✅ Waiting button disappeared. Stopping monitor.');
            }
        }, 1000);
    }

    async function main() {
        console.log('🚀 Script started');

        if (location.pathname === '/faucet.php') {
            monitorInactivity();
            await waitAndClickClaim();
        }

        if (location.pathname === '/captha.php') {
            await handleCapthaPage();
        }
    }

    window.addEventListener('load', () => setTimeout(main, 2000));
})();
