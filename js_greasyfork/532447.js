// ==UserScript==
// @name         Fix Last.fm Apostrophe in User Profile Titles
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replace curly apostrophe with straight one in Last.fm user profile titles
// @author       HuxP
// @match        https://www.last.fm/user/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532447/Fix%20Lastfm%20Apostrophe%20in%20User%20Profile%20Titles.user.js
// @updateURL https://update.greasyfork.org/scripts/532447/Fix%20Lastfm%20Apostrophe%20in%20User%20Profile%20Titles.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check and replace curly apostrophe in document title
    const originalTitle = document.title;
    const fixedTitle = originalTitle.replace(/’/g, "'");
    if (originalTitle !== fixedTitle) {
        document.title = fixedTitle;
    }
})();
