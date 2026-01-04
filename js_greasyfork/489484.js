// ==UserScript==
// @name         Reddit to New Reddit Redirect
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Redirect all Reddit links to New Reddit
// @author       dani7115
// @match        *://reddit.com/*
// @match        *://www.reddit.com/*
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489484/Reddit%20to%20New%20Reddit%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/489484/Reddit%20to%20New%20Reddit%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var oldRedditDomainWithWWW = 'www.reddit.com';
    var oldRedditDomain = 'reddit.com';
    var newRedditDomain = 'new.reddit.com';
    var currentUrl = window.location.href;
    var newUrl;

    if (currentUrl.includes(oldRedditDomainWithWWW)) {
        newUrl = currentUrl.replace(oldRedditDomainWithWWW, newRedditDomain);
    } else if (currentUrl.includes(oldRedditDomain)) {
        newUrl = currentUrl.replace(oldRedditDomain, newRedditDomain);
    }

    if (newUrl) {
        window.location.replace(newUrl);
    }
})();