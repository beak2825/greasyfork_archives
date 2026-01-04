// ==UserScript==
// @name         libreddit_redirect
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  redirects from reddit.com/* to libreddit's r.nf/*
// @author       Ghostfreak803
// @match        https://*.reddit.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/429832/libreddit_redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/429832/libreddit_redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var url = window.location.toString();
    url = url.replace(/www.reddit.com/, 'libreddit.mha.fi');
    window.location.replace(url);
})();
