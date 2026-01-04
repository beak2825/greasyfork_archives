// ==UserScript==
// @name         Kill Ads on Kids Choice Awards
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Disable ads and show FPS counter on kidschoiceawards.com
// @author       GhostyTongue
// @match        https://www.kidschoiceawards.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536154/Kill%20Ads%20on%20Kids%20Choice%20Awards.user.js
// @updateURL https://update.greasyfork.org/scripts/536154/Kill%20Ads%20on%20Kids%20Choice%20Awards.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsDisplay;

    function createFpsCounter() {
        fpsDisplay = document.createElement('div');
        Object.assign(fpsDisplay.style, {
            position: 'fixed',
            top: '5px',
            right: '5px',
            padding: '4px',
            background: 'rgba(0, 0, 0, 0.6)',
            color: '#0f0',
            fontSize: '12px',
            fontFamily: 'monospace',
            zIndex: 9999
        });
        document.body.appendChild(fpsDisplay);
    }

    function measureFPS(now) {
        frameCount++;
        const delta = now - lastTime;
        if (delta >= 1000) {
            const fps = Math.round((frameCount * 1000) / delta);
            fpsDisplay.textContent = `FPS: ${fps}`;
            frameCount = 0;
            lastTime = now;
        }
        requestAnimationFrame(measureFPS);
    }

    function disableAds() {
        console.log('Running disableAds...');
        let clearedConfigs = 0;
        Object.keys(window).forEach(name => {
            try {
                const obj = window[name];
                if (obj && obj.payload && obj.payload.units && typeof obj.payload.units === 'object') {
                    obj.payload.units = {};
                    clearedConfigs++;
                }
            } catch (err) {}
        });
        console.log(`Cleared ad config units on ${clearedConfigs} objects`);

        window.googletag = window.googletag || {};
        window.googletag.cmd = [];
        window.googletag.defineSlot = () => ({ addService: () => {} });
        window.googletag.pubads = () => ({ enableSingleRequest: () => {}, disableInitialLoad: () => {}, collapseEmptyDivs: () => {}, setTargeting: () => {} });
        console.log('Stubbed googletag');

        window.pbjs = window.pbjs || {};
        window.pbjs.que = [];
        window.pbjs.requestBids = () => {};
        window.pbjs.setTargetingForGPTAsync = () => {};
        window.pbjs.addAdUnits = () => {};
        console.log('Stubbed pbjs');

        window.apstag = window.apstag || {};
        window.apstag.init = () => {};
        window.apstag.fetchBids = (params, cb) => { cb({}); };
        console.log('Stubbed apstag');

        window.bidbarrel = window.bidbarrel || {};
        window.bidbarrel.render = () => {};
        window.bidbarrel._init = () => {};
        console.log('Stubbed bidbarrel');

        const ads = document.querySelectorAll('[id^="bb-unit"], .bb-unit, .ad-slot, .ad-container, iframe[src*="doubleclick"], iframe[src*="googlesyndication"]');
        const removedCount = ads.length;
        ads.forEach(el => el.remove());
        console.log(`Removed ${removedCount} ad containers`);

        if (window._bbRefreshTimer) {
            clearInterval(window._bbRefreshTimer);
            console.log('Cleared ad refresh timer');
        }

        console.log('disableAds completed');
    }

    window.addEventListener('load', () => {
        disableAds();
        createFpsCounter();
        requestAnimationFrame(measureFPS);
        setInterval(disableAds, 5000);
    });
})();