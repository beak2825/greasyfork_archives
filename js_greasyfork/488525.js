// ==UserScript==
// @name New Reddit Redirect
// @version      0.1.0
// @description  redirects you to new.reddit.com
// @author       github.com/lasersPew
// @match *://*.reddit.com/*
// @exclude /^https?://[a-z]{2}\.reddit\.com/*
// @exclude *out.reddit.com/*
// @exclude *://*.reddit.com/gallery/*
// @exclude *://*.reddit.com/media*
// @run-at document-start
// @license     GPLv3
// @grant        none
// @namespace https://greasyfork.org/users/1267998
// @downloadURL https://update.greasyfork.org/scripts/488525/New%20Reddit%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/488525/New%20Reddit%20Redirect.meta.js
// ==/UserScript==

// Enforce strict mode for better code quality
(function () {
   'use strict';

    // Declare constant for current URL
    const currentUrl = window.location.href;
    
    // Declare constant for old reddit URL
    const newRedditUrl = 'https://new.reddit.com/';
    
    // Check if the current URLis not new.reddit.com
    if ((!currentUrl.includes("www.reddit.com")) && (!GM_info.isIncognito )) {
    
      // Use regex literal and constant for new URL
      const newUrl = currentUrl.replace(/^https?:\/\/(www\.)?reddit.com\//, newRedditUrl);
    
      // Redirect to new URL without history entry
      window.location.replace(newUrl);
    }
}());