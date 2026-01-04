// ==UserScript==
// @name         XHS Remove Feed
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically removes the main page feed by removeing the mfContainer element
// @match        *://www.xiaohongshu.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523155/XHS%20Remove%20Feed.user.js
// @updateURL https://update.greasyfork.org/scripts/523155/XHS%20Remove%20Feed.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeElement() {
        const element = document.getElementById('mfContainer');
        if (element) {
            element.remove();
        }
    }

    // Try immediately after page load
    removeElement();

    // Also watch for dynamic content
    const observer = new MutationObserver(function(mutations) {
        removeElement();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();