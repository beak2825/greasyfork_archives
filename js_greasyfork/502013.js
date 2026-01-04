// ==UserScript==
// @name         Reddit.com - Remove recent subreddits section
// @namespace    http://tampermonkey.net/
// @description  Clears recent subreddits section
// @license      MIT
// @version      2024-07-28
// @match        *://*.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502013/Redditcom%20-%20Remove%20recent%20subreddits%20section.user.js
// @updateURL https://update.greasyfork.org/scripts/502013/Redditcom%20-%20Remove%20recent%20subreddits%20section.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(() => {
        if (window.location.hostname.endsWith('reddit.com')) {
            localStorage.removeItem('recent-subreddits-store');
        }
    }, 1000);
})();