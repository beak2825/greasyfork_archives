// ==UserScript==
// @name         Remove Reddits Recent-Sidebar
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove Reddit recent pages and left nav recent section elements
// @author       Helugo
// @match        https://www.reddit.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493180/Remove%20Reddits%20Recent-Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/493180/Remove%20Reddits%20Recent-Sidebar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Remove Reddit recent pages element
    var recentPages = document.getElementById("reddit-recent-pages");
    if (recentPages) {
        recentPages.remove();
    }

    // Remove left nav recent section element
    var leftNavRecentSection = document.querySelector("faceplate-loader[name='left-nav-recent-section']");
    if (leftNavRecentSection) {
        leftNavRecentSection.remove();
    }
})();
