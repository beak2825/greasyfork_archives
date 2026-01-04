// ==UserScript==
// @name         Fanfiction.net: Redirect to Desktop Site
// @namespace    https://greasyfork.org/en/users/163551-vannius
// @version      1.2
// @license      MIT
// @description  Redirect from moblie site to desktop site.
// @author       Vannius
// @match        https://m.fanfiction.net/*
// @match        https://www.fanfiction.net/*
// @downloadURL https://update.greasyfork.org/scripts/429122/Fanfictionnet%3A%20Redirect%20to%20Desktop%20Site.user.js
// @updateURL https://update.greasyfork.org/scripts/429122/Fanfictionnet%3A%20Redirect%20to%20Desktop%20Site.meta.js
// ==/UserScript==

(function() {
    // config
    const REVERSE = false;

    if (window.location.origin === 'https://www.fanfiction.net' && REVERSE) {
        console.log('https://m.fanfiction.net' + window.location.pathname)
        window.location.href = 'https://m.fanfiction.net' + window.location.pathname;
    } else if (window.location.origin === 'https://m.fanfiction.net' && !REVERSE) {
        console.log('https://www.fanfiction.net' + window.location.pathname)
        window.location.href = 'https://www.fanfiction.net' + window.location.pathname;
    }
})();
