// ==UserScript==
// @name         Instagram Greyscale Filter
// @name:zh-TW   Instagram 灰階 專注使用
// @namespace    your-namespace
// @version      1.0
// @description        Applies a greyscale filter to Instagram (excluding pages with /direct/ in the URL)
// @description:zh-tw  Applies a greyscale filter to Instagram (excluding pages with /direct/ in the URL)
// @author       ICHx, ChatGPT
// @match        https://www.instagram.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479914/Instagram%20Greyscale%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/479914/Instagram%20Greyscale%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to apply the greyscale filter
    function applyGreyscaleFilter() {
        // Add CSS rules to apply greyscale filter
        GM_addStyle(`
            html, body {
                filter: grayscale(100%);
            }
        `);
    }

    // Function to remove the greyscale filter
    function removeGreyscaleFilter() {
        // Remove CSS rules for greyscale filter
        GM_addStyle(`
            html, body {
                filter: none;
            }
        `);
    }

    // Function to check if the current URL contains "/direct/"
    function isDirectURL() {
        return window.location.href.includes("/direct/");
    }

    // Function to handle mutations in the document
    function handleMutations(mutationsList) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // Check if the current URL contains "/direct/"
                if (isDirectURL()) {
                    removeGreyscaleFilter();
                } else {
                    applyGreyscaleFilter();
                }
            }
        }
    }

    // Create a new MutationObserver instance
    const observer = new MutationObserver(handleMutations);

    // Start observing changes in the body element
    observer.observe(document.body, { childList: true, subtree: true });

    // Check if the initial URL contains "/direct/"
    if (isDirectURL()) {
        removeGreyscaleFilter();
    } else {
        applyGreyscaleFilter();
    }
})();
