// ==UserScript==
// @name         Redirect to Old Reddit
// @namespace    ViolentMonkey
// @version      1.0
// @description  Redirect all reddit.com pages to old.reddit.com
// @match        *://*.reddit.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525845/Redirect%20to%20Old%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/525845/Redirect%20to%20Old%20Reddit.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // If we're not already on old.reddit.com, perform the redirect.
    if (location.hostname !== "old.reddit.com") {
        // Replace the current hostname with old.reddit.com
        location.href = location.href.replace(location.hostname, "old.reddit.com");
    }
})();
