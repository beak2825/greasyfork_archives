// ==UserScript==
// @name         Custom Browser Settings
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Implement custom browser
// @author       Jimbootie
// @license      MIT
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/524020/Custom%20Browser%20Settings.user.js
// @updateURL https://update.greasyfork.org/scripts/524020/Custom%20Browser%20Settings.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // GENERAL SETTINGS
    console.log("Custom Browser Settings script loaded.");

    // DISABLE SPECULATIVE LOADING
    // Disable DNS Prefetch
    document.head.insertAdjacentHTML(
        "beforeend",
        `<meta http-equiv="x-dns-prefetch-control" content="off">`
    );

    // Disable Link Prefetch
    const disableLinkPrefetch = () => {
        const links = document.querySelectorAll('link[rel="prefetch"], link[rel="prerender"]');
        links.forEach(link => {
            console.log("Removing prefetch link:", link.href);
            link.remove();
        });
    };
    disableLinkPrefetch();

    // DISABLE TELEMETRY
    const disableTelemetry = () => {
        // Override navigator.sendBeacon to prevent telemetry
        navigator.sendBeacon = () => {
            console.log("Blocked telemetry attempt via sendBeacon.");
            return false;
        };

        // Block certain analytics requests (example: Google Analytics)
        const originalFetch = window.fetch;
        window.fetch = (...args) => {
            const url = args[0];
            if (url.includes("analytics") || url.includes("telemetry")) {
                console.log("Blocked analytics request:", url);
                return Promise.reject("Blocked analytics request");
            }
            return originalFetch.apply(this, args);
        };
    };
    disableTelemetry();

    // BLOCK TRACKING SCRIPTS
    const blockTrackingScripts = () => {
        const observer = new MutationObserver(() => {
            // Remove tracking scripts
            const scripts = document.querySelectorAll('script[src*="tracking"], script[src*="analytics"]');
            scripts.forEach(script => {
                console.log("Blocked tracking script:", script.src);
                script.remove();
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    };
    blockTrackingScripts();

    // WARN ON INSECURE CONNECTIONS
    const warnInsecureConnections = () => {
        if (location.protocol === "http:") {
            console.warn("Warning: Insecure HTTP connection detected!");
        }
    };
    warnInsecureConnections();

    console.log("Custom settings applied.");
})();
