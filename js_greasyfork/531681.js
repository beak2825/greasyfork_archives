// ==UserScript==
// @name         Hulu Remove Up Next and Dialog
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes the "Up Next" section and any related dialogs on Hulu for playback
// @author       F02x
// @match        https://www.hulu.com/*
// @grant        none
// @license      WTFPL
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/531681/Hulu%20Remove%20Up%20Next%20and%20Dialog.user.js
// @updateURL https://update.greasyfork.org/scripts/531681/Hulu%20Remove%20Up%20Next%20and%20Dialog.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove elements matching a selector
    function removeElements(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.style.display = 'none'; // Hide instead of remove to avoid breaking scripts
        });
    }

    // Function to check and remove "Up Next" and dialogs
    function cleanUpNextAndDialogs() {
        // Target "Up Next" section (common class names based on Hulu's typical structure)
        removeElements('.UpNext, .up-next, [class*="upnext"], [class*="UpNext"]');

        // Target dialog/pop-up elements (common overlay or modal classes)
        removeElements('.modal, .dialog, .overlay, [class*="Modal"], [class*="Dialog"]');

        // Target any autoplay-related elements
        removeElements('[class*="autoplay"], [class*="Autoplay"]');
    }

    // Run cleanup initially
    cleanUpNextAndDialogs();

    // Use a MutationObserver to handle dynamically loaded content
    const observer = new MutationObserver(() => {
        cleanUpNextAndDialogs();
    });

    // Observe changes in the body to catch dynamic updates
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Optional: Stop observer when leaving the page (cleanup)
    window.addEventListener('unload', () => {
        observer.disconnect();
    });
})();