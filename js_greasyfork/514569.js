// ==UserScript==
// @name         Claude 3.6 renamer
// @namespace    http://tampermonkey.net/
// @version      1.6
// @license      MIT
// @description  Fix the name for Claude "3.5 Sonnet (New)". Make it "3.6 Sonnet" as it should have been released
// @author       Gerry - https://x.com/gerry
// @match        *://claude.ai/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514569/Claude%2036%20renamer.user.js
// @updateURL https://update.greasyfork.org/scripts/514569/Claude%2036%20renamer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to replace the desired text on the page
    function replaceText() {
        // Define the target text and replacement HTML using a regular expression
        const targetRegex = /3\.5 Sonnet \(New\)/g;
        const replacementHtml = "3.6 Sonnet";

        // Get all elements that contain text nodes
        const elements = document.querySelectorAll("*:not(script):not(style)");

        elements.forEach(element => {
            element.childNodes.forEach(child => {
                if (child.nodeType === Node.TEXT_NODE && targetRegex.test(child.textContent)) {
                    const span = document.createElement('span');
                    span.innerHTML = child.textContent.replace(targetRegex, replacementHtml);
                    element.replaceChild(span, child);
                }
            });
        });
    }

    // Run the replacement function after the page has loaded
    window.addEventListener('load', replaceText);

    // Observe changes in the DOM to re-run the replacement if necessary
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
                replaceText();
            }
        });
    });

    // Start observing the body for changes
    observer.observe(document.body, {
        childList: true,
        characterData: true,
        subtree: true
    });
})();