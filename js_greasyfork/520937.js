// ==UserScript==
// @name         Remove Watermark on DocumentaryArea
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove the watermark on documentaryarea.com
// @author       bitgineer
// @match        https://www.documentaryarea.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520937/Remove%20Watermark%20on%20DocumentaryArea.user.js
// @updateURL https://update.greasyfork.org/scripts/520937/Remove%20Watermark%20on%20DocumentaryArea.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create an observer to wait for the watermark element to load, if not present initially
    const observer = new MutationObserver(() => {
        const watermark = document.querySelector('.watermark');
        if (watermark) {
            watermark.style.display = 'none';
            observer.disconnect(); // Stop observing once the watermark is removed
        }
    });

    // Start observing the body for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Optional: Immediately attempt to hide watermark if already loaded
    const existingWatermark = document.querySelector('.watermark');
    if (existingWatermark) {
        existingWatermark.style.display = 'none';
    }
})();
