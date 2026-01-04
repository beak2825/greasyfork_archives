// ==UserScript==
// @name         Starlavinia Auto Faucet
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automates faucet with realistic delays, captcha fail detection and 5s wait after solving captcha before claiming reward.
// @author       Rubystance
// @license      MIT
// @match        https://starlavinia.name.tr/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544462/Starlavinia%20Auto%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/544462/Starlavinia%20Auto%20Faucet.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    function waitForElement(selector, timeout = 20000) {
        return new Promise((resolve, reject) => {
            const el = document.querySelector(selector);
            if (el) return resolve(el);
            const observer = new MutationObserver(() => {
                const target = document.querySelector(selector);
                if (target) {
                    observer.disconnect();
                    resolve(target);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            setTimeout(() => {
                observer.disconnect();
                reject("⏰ Timeout waiting for " + selector);
            }, timeout);
        });
    }

    function hasCaptchaFailed() {
        const errorDiv = document.querySelector('.badge.bg-danger');
        return errorDiv && errorDiv.textContent.includes("Failed! Please reload the page.");
    }

    async function waitAndCheckCaptchaFail(maxWait = 10000) {
        const checkInterval = 1000;
        const attempts = maxWait / checkInterval;
        for (let i = 0; i < attempts; i++) {
            if (hasCaptchaFailed()) {
                console.warn("❌ Captcha failure detected. Reloading...");
                location.reload();
                return true;
            }
            await sleep(checkInterval);
        }
        return false;
    }

    const currentPath = window.location.pathname;

    if (currentPath === "/dashboard") {
        waitForElement('span.flex.items-center').then(async span => {
            if (span.textContent.toLowerCase().includes("faucet")) {
                console.log("🔁 Clicking Faucet...");
                await sleep(10000);
                span.click();
            }
        });
    }

    if (currentPath === "/faucet") {
        const tryClaimAndVerify = async () => {
            try {

                const failedEarly = await waitAndCheckCaptchaFail();
                if (failedEarly) return;

                const claimBtn = await waitForElement('#openClaimModal');
                await sleep(10000);
                if (hasCaptchaFailed()) return location.reload();

                console.log("⛲ Clicking Claim...");
                claimBtn.click();

                await waitForElement('#captcha-holder .icon-option.selected, #captcha-holder .icon-option.active');
                if (hasCaptchaFailed()) return location.reload();

                console.log("✅ Captcha resolved. Waiting 5 seconds before clicking Verify...");
                await sleep(5000);

                const verifyBtn = await waitForElement('button[type="submit"]');
                if (hasCaptchaFailed()) return location.reload();

                console.log("🚀 Clicking Verify...");
                verifyBtn.click();
            } catch (err) {
                console.error("⚠️ Error during faucet automation:", err);
            }
        };

        tryClaimAndVerify();
    }
})();
