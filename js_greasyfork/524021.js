// ==UserScript==
// @name         Browser Settings
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  custom browser glb
// @author       Jimbootie
// @license      MIT
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/524021/Browser%20Settings.user.js
// @updateURL https://update.greasyfork.org/scripts/524021/Browser%20Settings.meta.js
// ==/UserScript==

(function () {
    'use strict';

    document.head.insertAdjacentHTML(
        "beforeend",
        `<meta http-equiv="x-dns-prefetch-control" content="off">`
    );

    const disableLinkPrefetch = () => {
        const links = document.querySelectorAll('link[rel="prefetch"], link[rel="prerender"]');
        links.forEach(link => {
            link.remove();
        });
    };
    disableLinkPrefetch();

    const disableTelemetry = () => {
        navigator.sendBeacon = () => false;
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

    const warnInsecureConnections = () => {
        if (location.protocol === "http:") {
            console.warn("Warning: Insecure HTTP connection detected!");
        }
    };
    warnInsecureConnections();
})();
