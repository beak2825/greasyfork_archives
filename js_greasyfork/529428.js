// ==UserScript==
// @name         Redirect YouTube (Excluding Mini-players)
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Redirects standard YouTube pages
// @author       Ohmu
// @match        *://www.youtube.com/*
// @match        https://m.youtube.com/*
// @match        *://*.wikipedia.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529428/Redirect%20YouTube%20%28Excluding%20Mini-players%29.user.js
// @updateURL https://update.greasyfork.org/scripts/529428/Redirect%20YouTube%20%28Excluding%20Mini-players%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var redirectSiteUrl = 'https://fi.wikipedia.org/wiki/Toiminnot:Satunnainen_sivu';
    var mobileRedirectSiteUrl = 'shortcuts://run-shortcut?name=brilliant';

    if (window.location.hostname === 'www.youtube.com' && (
          window.location.pathname === '/' || // Main page
          window.location.pathname.startsWith('/watch') || // Video pages
          window.location.pathname.startsWith('/shorts/') || // shorts
          window.location.pathname.startsWith('/channel') || // Channel pages
          window.location.pathname.startsWith('/user/') || // User pages
          window.location.pathname.startsWith('/playlist') // Playlist pages
        )) {
        window.location.href = redirectSiteUrl;
    }

    if (window.location.hostname === 'm.youtube.com' && (
          window.location.pathname === '/' || // Main page
          window.location.pathname.startsWith('/watch') || // Video pages
          window.location.pathname.startsWith('/shorts/') || // shorts
          window.location.pathname.startsWith('/channel') || // Channel pages
          window.location.pathname.startsWith('/user/') || // User pages
          window.location.pathname.startsWith('/playlist') // Playlist pages
        )) {
        window.location.href = redirectSiteUrl;
    }

    if (window.location.hostname.endsWith('.wikipedia.org')) {
        window.location.href = mobileRedirectSiteUrl;
    }
})();