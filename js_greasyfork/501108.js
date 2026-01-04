// ==UserScript==
// @name         Wowhead Ad Blocker
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Block ads on Wowhead.com using Adblock Plus rules(2024-07-18 Updated)
// @author       Bing Ma
// @match        https://www.wowhead.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501108/Wowhead%20Ad%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/501108/Wowhead%20Ad%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove elements by selector
    function removeElementsBySelector(selector) {
        let elements = document.querySelectorAll(selector);
        elements.forEach(element => element.remove());
    }
    // Function to hide elements by selector
    function hideElementsBySelector(selector) {
        let elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.style.setProperty('display', 'none', 'important');
        });
    }
    // List of ad selectors to block (from your Adblock Plus rules)
    const adSelectors = [
        'DIV[class="blocks"]',
        'DIV[class="sidebar-wrapper"]',
        'DIV[class="zaf-unit-wrapper"]',
        'DIV[class="pb-stream"]'
    ];

    // Run the ad blocker on page load
    window.addEventListener('load', () => {
        adSelectors.forEach(selector => {
            removeElementsBySelector(selector);
            hideElementsBySelector(selector);
        });
    });

    // Run the ad blocker periodically to catch dynamically loaded ads
    setInterval(() => {
        adSelectors.forEach(selector => {
            removeElementsBySelector(selector);
            hideElementsBySelector(selector);
        });
    }, 1000);

    // Mutation observer to catch ads added dynamically
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // Ensure it's an element
                    adSelectors.forEach(selector => {
                        if (node.matches(selector) || node.querySelector(selector)) {
                            node.remove();
                        }
                    });
                }
            });
        });
    });

    // Start observing the document for added nodes
    observer.observe(document.body, { childList: true, subtree: true });

})();