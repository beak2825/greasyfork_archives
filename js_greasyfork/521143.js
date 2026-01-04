// ==UserScript==
// @name         Hide YouTube Shorts
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hides Shorts sections on YouTube
// @author       iairu
// @match        https://*.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521143/Hide%20YouTube%20Shorts.user.js
// @updateURL https://update.greasyfork.org/scripts/521143/Hide%20YouTube%20Shorts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const hideShorts = () => {
        [...document.querySelectorAll("h2")]
            .filter(h2 => h2.innerText.includes("Shorts"))
            .forEach(shortsHeading => {shortsHeading.parentElement.parentElement.style.display = "none"});
    };

    // Handle initial page load
    hideShorts();

    // Handle navigation via History API
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function() {
        originalPushState.apply(this, arguments);
        setTimeout(hideShorts, 75);
    };

    history.replaceState = function() {
        originalReplaceState.apply(this, arguments);
        setTimeout(hideShorts, 75);
    };

    // Handle navigation via popstate event
    window.addEventListener('popstate', () => {
        setTimeout(hideShorts, 75);
    });

    // Create mutation observer to detect DOM changes
    const observer = new MutationObserver((mutations) => {
        hideShorts();
    });

    // Start observing the document with configured parameters
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();