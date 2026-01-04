// ==UserScript==
// @name        YouTube Link Fixer
// @namespace   Violentmonkey Scripts
// @match        *://www.youtube.com/*
// @match        *://*.youtu.be/*
// @grant       none
// @version     1.0
// @author      TimeTravel_0
// @license GPLv3
// @description Remove YouTube redirections and show full links in descriptions.
// @downloadURL https://update.greasyfork.org/scripts/527583/YouTube%20Link%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/527583/YouTube%20Link%20Fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to clean YouTube redirect links
    function cleanRedirectLinks() {
        document.querySelectorAll('a[href*="youtube.com/redirect"]').forEach(anchor => {
            const urlParams = new URLSearchParams(new URL(anchor.href).search);
            const directUrl = urlParams.get('q'); // Get actual URL from ?q=
            if (directUrl) {
                anchor.href = decodeURIComponent(directUrl);
            }
        });
    }

    // Function to replace truncated text in video descriptions with full URLs
    function replaceTruncatedLinks() {
        document.querySelectorAll('#description-inline-expander a').forEach(anchor => {
            if (anchor.href && !anchor.href.includes('youtube.com') && !anchor.href.includes('youtu.be')) {
                anchor.textContent = anchor.href;
            }
        });
    }


    // Run on initial page load
    cleanRedirectLinks();
    replaceTruncatedLinks();

    // Use MutationObserver to watch for dynamic content changes
    const observer = new MutationObserver(() => {
        cleanRedirectLinks();
        replaceTruncatedLinks();
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();