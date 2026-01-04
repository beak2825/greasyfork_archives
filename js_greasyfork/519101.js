// ==UserScript==
// @name         Block YouTube Playables iPad
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Blocks YouTube Playables section
// @author       You
// @match        https://www.youtube.com/*
// @grant        none
//@ license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/519101/Block%20YouTube%20Playables%20iPad.user.js
// @updateURL https://update.greasyfork.org/scripts/519101/Block%20YouTube%20Playables%20iPad.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const hidePlayables = () => {
        // Target the Playables section or "View all" button
        const playablesSection = document.querySelector('a[href="/playables?bp=EgZicm93c2U%3D"]')?.closest('ytd-rich-section-renderer');
        
        if (playablesSection) {
            playablesSection.style.display = 'none';
        }
    };

    // Run initially and monitor DOM changes
    const observer = new MutationObserver(hidePlayables);
    observer.observe(document.body, { childList: true, subtree: true });

    hidePlayables();
})();