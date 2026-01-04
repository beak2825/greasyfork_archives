// ==UserScript==
// @name         Poxel.io Grant Reward Instantly
// @namespace    http://tampermonkey.net/
// @author       ChatGPT
// @version      2.1
// @description  SBypass rewarded ads to grant reward instantly on poxel.io. 
// @match        https://poxel.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539843/Poxelio%20Grant%20Reward%20Instantly.user.js
// @updateURL https://update.greasyfork.org/scripts/539843/Poxelio%20Grant%20Reward%20Instantly.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const log = (...args) => console.log('[🛠️ Bypass]', ...args);

    // Utility: random delay
    const delay = ms => new Promise(res => setTimeout(res, ms));
    const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    async function stealthRewardBypass() {
        const wait = randomBetween(2000, 5000);
        log(`Simulating ad wait for ${wait}ms`);
        await delay(wait);

        if (typeof unityInstance !== 'undefined') {
            unityInstance.SendMessage("SDKManager", "OnVideoAdEnded", "true");
            log('✅ Reward granted silently');
        } else {
            log('❌ unityInstance not found');
        }
    }

    // Intercept and override SDK logic
    function overrideSDK() {
        if (window.SDK && typeof window.SDK.showRewarded === 'function') {
            window.SDK.showRewarded = function () {
                log('🎯 Intercepted SDK.showRewarded()');
                stealthRewardBypass();
            };
            log('✅ SDK.showRewarded overridden');
        }
    }

    // Clear adblocker detection flag if set
    function clearAdblockFlag() {
        if (typeof window.adblocked !== 'undefined') {
            window.adblocked = false;
            log('🧹 Cleared adblocked flag');
        }
    }

    // Bootstrap once ready
    const init = setInterval(() => {
        if (window.SDK && typeof window.SDK.showRewarded === 'function' && typeof unityInstance !== 'undefined') {
            clearInterval(init);
            overrideSDK();
            clearAdblockFlag();
        } else {
            log('⏳ Waiting for SDK and unityInstance...');
        }
    }, 500);
})();
