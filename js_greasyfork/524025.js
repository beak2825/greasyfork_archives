// ==UserScript==
// @name         ori-Browser Performance Optimizer for All Websites
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Improve browser performance by blocking unnecessary background processes on all websites (telemetry, tracking, prefetching, ads, etc.)
// @author       Jimbootie
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524025/ori-Browser%20Performance%20Optimizer%20for%20All%20Websites.user.js
// @updateURL https://update.greasyfork.org/scripts/524025/ori-Browser%20Performance%20Optimizer%20for%20All%20Websites.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Disable DNS Prefetching, Prerendering, and Prefetch Links for All Websites
    const disableLinkPrefetch = () => {
        const links = document.querySelectorAll('link[rel="prefetch"], link[rel="prerender"], link[rel="dns-prefetch"]');
        links.forEach(link => link.remove()); // Remove prefetch links to save resources
    };
    disableLinkPrefetch();

    // Disable Telemetry and Analytics Data Collection for All Websites
    const disableTelemetry = () => {
        // Override the sendBeacon API (Prevent unnecessary analytics beacons from running in the background)
        if (navigator.sendBeacon) {
            const originalBeacon = navigator.sendBeacon;
            navigator.sendBeacon = function (url, data) {
                if (url.includes("analytics") || url.includes("telemetry")) {
                    return false; // Block telemetry beacons
                }
                return originalBeacon.apply(this, arguments);
            };
        }

        // Block fetch requests to analytics or telemetry endpoints (Prevent background requests)
        const originalFetch = window.fetch;
        window.fetch = (...args) => {
            const url = args[0];
            if (url.includes("analytics") || url.includes("telemetry")) {
                return Promise.reject("Blocked analytics request"); // Block telemetry and analytics requests
            }
            return originalFetch.apply(this, args);
        };
    };
    disableTelemetry();

    // Block Tracking Scripts Dynamically for All Websites
    const blockTrackingScripts = () => {
        const observer = new MutationObserver(() => {
            const scripts = document.querySelectorAll('script[src*="tracking"], script[src*="analytics"]');
            scripts.forEach(script => {
                script.remove(); // Remove tracking/analytics scripts to save resources
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    };
    blockTrackingScripts();

    // Prevent Auto-Playing Ads (General solution for all websites with ads)
    const blockAds = () => {
        const observer = new MutationObserver(() => {
            const adContainers = document.querySelectorAll('.ad-container, .advertisement, .ad-banner, iframe[src*="ads"]');
            adContainers.forEach(ad => ad.remove()); // Remove any common ad containers and iframes
        });
        observer.observe(document.body, { childList: true, subtree: true });
    };
    blockAds();

    // Disable Unnecessary Media Requests for All Websites
    const blockUnnecessaryRequests = () => {
        const observer = new MutationObserver(() => {
            const mediaElements = document.querySelectorAll('audio, video');
            mediaElements.forEach(media => {
                if (media.paused) {
                    media.pause(); // Pause any unnecessary media that might be preloaded
                }
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    };
    blockUnnecessaryRequests();

    // Disable Cache for Non-Essential Resources for All Websites
    const disableCacheForTrackingResources = () => {
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method, url) {
            if (url.includes("analytics") || url.includes("telemetry")) {
                this.setRequestHeader('Cache-Control', 'no-store'); // Disable cache for telemetry/analytics
            }
            return originalOpen.apply(this, arguments);
        };
    };
    disableCacheForTrackingResources();

})();
