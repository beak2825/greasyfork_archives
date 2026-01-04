// ==UserScript==
// @name         Browser Optimizer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Improve browser
// @author       Jimbootie
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524026/Browser%20Optimizer.user.js
// @updateURL https://update.greasyfork.org/scripts/524026/Browser%20Optimizer.meta.js
// ==/UserScript==


(function () { 'use strict';

    const disableLinkPrefetch = () => {
        const links = document.querySelectorAll('link[rel="prefetch"], link[rel="prerender"], link[rel="dns-prefetch"]');
        links.forEach(link => link.remove());
    };
    disableLinkPrefetch();

    const disableTelemetry = () => {
        if (navigator.sendBeacon) {
            const originalBeacon = navigator.sendBeacon;
            navigator.sendBeacon = function (url, data) {
                if (url.includes("analytics") || url.includes("telemetry")) {
                    return false;
                }
                return originalBeacon.apply(this, arguments);
            };
        }

        const originalFetch = window.fetch;
        window.fetch = (...args) => {
            const url = args[0];
            if (url.includes("analytics") || url.includes("telemetry")) {
                return Promise.reject("Blocked analytics request");
            }
            return originalFetch.apply(this, args);
        };
    };
    disableTelemetry();

    const blockTrackingScripts = () => {
        const observer = new MutationObserver(() => {
            const scripts = document.querySelectorAll('script[src*="tracking"], script[src*="analytics"]');
            scripts.forEach(script => {
                script.remove();
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    };
    blockTrackingScripts();

    const blockAds = () => {
        const observer = new MutationObserver(() => {
            const adContainers = document.querySelectorAll('.ad-container, .advertisement, .ad-banner, iframe[src*="ads"]');
            adContainers.forEach(ad => ad.remove());
        });
        observer.observe(document.body, { childList: true, subtree: true });
    };
    blockAds();

    const blockUnnecessaryRequests = () => {
        const observer = new MutationObserver(() => {
            const mediaElements = document.querySelectorAll('audio, video');
            mediaElements.forEach(media => {
                if (media.paused) {
                    media.pause();
                }
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    };
    blockUnnecessaryRequests();

    const disableCacheForTrackingResources = () => {
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method, url) {
            if (url.includes("analytics") || url.includes("telemetry")) {
                this.setRequestHeader('Cache-Control', 'no-store');
            }
            return originalOpen.apply(this, arguments);
        };
    };
    disableCacheForTrackingResources();

})();
