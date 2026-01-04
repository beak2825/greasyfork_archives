// ==UserScript==
// @name         Reddit Search Telemetry Cleaner
// @description  Finds <search-telemetry-tracker> elements on Reddit and replaces them with the clean link text.
// @namespace    Violentmonkey Scripts
// @version      1.0
// @author       radiant_pillar
// @license      MIT
// @match        *://*.reddit.com/*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/544530/Reddit%20Search%20Telemetry%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/544530/Reddit%20Search%20Telemetry%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function cleanTelemetryTrackers() {
        const trackerElements = document.querySelectorAll('search-telemetry-tracker');
        trackerElements.forEach(tracker => {
            const linkElement = tracker.querySelector('a');
            if (linkElement) {
                const linkText = linkElement.firstChild?.textContent?.trim();
                if (linkText) {
                    const textNode = document.createTextNode(linkText);
                    tracker.replaceWith(textNode);
                }
            }
        });
    }

    const observer = new MutationObserver((mutations) => {
        cleanTelemetryTrackers();
    });

    const config = {
        childList: true,
        subtree: true
    };

    observer.observe(document.body, config);

    cleanTelemetryTrackers();
})();