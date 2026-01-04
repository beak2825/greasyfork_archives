// ==UserScript==
// @name        Reposition and Click Recently Uploaded Chip
// @namespace   http://tampermonkey.net/
// @version     1.5
// @description Automatically selects "Recently uploaded" on the YouTube homepage.
// @author      Simon Jones
// @match       https://www.youtube.com/*
// @icon        https://www.google.com/s2/favicons?domain=youtube.com
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/546039/Reposition%20and%20Click%20Recently%20Uploaded%20Chip.user.js
// @updateURL https://update.greasyfork.org/scripts/546039/Reposition%20and%20Click%20Recently%20Uploaded%20Chip.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function debounce(func) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => func.apply(this, args), 300);
        };
    }

    const updateAndClickRecentlyUploaded = debounce(() => {
        // Ensure we are on the main YouTube homepage
        if (window.location.pathname !== '/') {
            return;
        }

        const chips = [...document.querySelectorAll('iron-selector.ytd-feed-filter-chip-bar-renderer yt-chip-cloud-chip-renderer')];
        if (chips.length === 0) {
            return;
        }

        const recentlyUploadedChip = chips.find(chip => chip.innerText.includes('Recently uploaded'));
        const allChip = chips.find(chip => chip.innerText.includes('All'));

        // Check if the "All" chip is currently selected and the "Recently uploaded" chip is not
        const shouldClick = allChip && allChip.hasAttribute('selected') && recentlyUploadedChip && !recentlyUploadedChip.hasAttribute('selected');

        if (shouldClick) {
            // Move the chip to the front
            const parent = recentlyUploadedChip.parentNode;
            parent.prepend(recentlyUploadedChip);
            
            // Simulate a click on the "Recently uploaded" chip
            recentlyUploadedChip.click();
        }
    });

    // Set up the mutation observer
    const observer = new MutationObserver(updateAndClickRecentlyUploaded);
    
    // Start observing the entire document for changes
    observer.observe(document, {
        childList: true,
        subtree: true
    });

})();