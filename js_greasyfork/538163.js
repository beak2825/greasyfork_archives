// ==UserScript==
// @name         Erase Recent Subs - Remove Recent Subreddits Section
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes the "Recent Subreddits" section by clearing its saved data from localStorage on Reddit page load.
// @author       saitamasahil
// @license      GPL-3.0 license
// @match        *://*.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538163/Erase%20Recent%20Subs%20-%20Remove%20Recent%20Subreddits%20Section.user.js
// @updateURL https://update.greasyfork.org/scripts/538163/Erase%20Recent%20Subs%20-%20Remove%20Recent%20Subreddits%20Section.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.location.hostname.endsWith('reddit.com')) {
        localStorage.removeItem('recent-subreddits-store');
    }
})();