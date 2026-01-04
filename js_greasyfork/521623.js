// ==UserScript==
// @name         PoE Wiki Redirect
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Redirect Fextralife wiki to poewiki.net and poewiki2.net
// @author       Navist
// @match        *://pathofexile.fandom.com/*
// @match        *://pathofexile2.wiki.fextralife.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521623/PoE%20Wiki%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/521623/PoE%20Wiki%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the current URL
    let currentUrl = window.location.href;

    // Handle redirection for fandom
    if (currentUrl.includes('pathofexile.fandom.com')) {
        let newUrl = currentUrl.replace('pathofexile.fandom.com', 'www.poewiki.net');
        window.location.replace(newUrl);
    }

    // Handle redirection for fextralife
    if (currentUrl.includes('pathofexile2.wiki.fextralife.com')) {
        // Replace the domain and adjust the path
        let newUrl = currentUrl
            .replace('pathofexile2.wiki.fextralife.com', 'www.poe2wiki.net/wiki')
            .replace('+', '_'); // Replace '+' in the URL path with '_' if needed
        window.location.replace(newUrl);
    }
})();
