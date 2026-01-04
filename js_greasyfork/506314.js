// ==UserScript==
// @name         Redirect to new Reddit
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Redirects all Reddit pages to the new.reddit.com version
// @author       Your Name
// @match        *://reddit.com/*
// @match        *://www.reddit.com/*
// @exclude      *://new.reddit.com/*
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/506314/Redirect%20to%20new%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/506314/Redirect%20to%20new%20Reddit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if the current URL is not new.reddit.com
    if (!window.location.hostname.startsWith('new.')) {
        // Replace the hostname with new.reddit.com
        window.location.hostname = 'new.reddit.com';
    }
})();