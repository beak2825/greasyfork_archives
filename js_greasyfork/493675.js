// ==UserScript==
// @name         Reddit Mail Redirect Cleaner
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Automatically clean and redirect from tracking URLs in Reddit mail links.
// @author       sharmanhall
// @match        *://*/*
// @match        *://click.redditmail.com/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493675/Reddit%20Mail%20Redirect%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/493675/Reddit%20Mail%20Redirect%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Listen for click events on the entire document
    document.addEventListener('click', function(e) {
        // Check if the clicked element is a link that includes "click.redditmail.com"
        var target = e.target.closest('a[href*="click.redditmail.com"]');
        if (target) {
            // Prevent the default link behavior
            e.preventDefault();
            // Decode the URL and extract the direct Reddit link
            const url = new URL(decodeURIComponent(target.href));
            const redditURLMatch = url.href.match(/https:\/\/www\.reddit\.com\/message\/messages\/[a-zA-Z0-9]+/);
            if (redditURLMatch) {
                // Redirect to the extracted Reddit URL
                window.location.href = redditURLMatch[0];
            } else {
                // Alert the user if no clean URL is found
                alert("Could not find a clean URL to redirect to.");
            }
        }
    }, true);
})();
