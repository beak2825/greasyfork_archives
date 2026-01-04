// ==UserScript==
// @name         Reddit De-tiktokified
// @version      0.0.4
// @description  Redirects you to new.reddit.com, avoiding the new beta UI.
// @license      MIT
// @namespace    https://github.com/tadghh
// @author       https://github.com/tadghh
// @source	     https://github.com/tadghh/reddit-redirect
// @match        *://www.reddit.com/*
// @exclude      *://www.reddit.com/media*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/479542/Reddit%20De-tiktokified.user.js
// @updateURL https://update.greasyfork.org/scripts/479542/Reddit%20De-tiktokified.meta.js
// ==/UserScript==
(() => {
    'use strict';

    const isRedditSessionCookieExists = document.cookie.includes('recent_srs');

    if (!window.location.href.includes('new.reddit.com') && location.pathname.indexOf('new.') === -1 && isRedditSessionCookieExists) {
        var newURL = location.protocol;

        newURL += "//new.reddit.com";
        newURL += location.pathname;
        newURL += location.search;
        newURL += location.hash;

        window.location.href = newURL;

        document.open();
        document.close();
    }
})();
