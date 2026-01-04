// ==UserScript==
// @name         FreeBuf URL Redirect
// @namespace    https://m.freebuf.com/
// @version      0.2
// @description  Redirects FreeBuf mobile URLs to desktop URLs
// @author       LANVNAL
// @match        https://m.freebuf.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=freebuf.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/472347/FreeBuf%20URL%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/472347/FreeBuf%20URL%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the current URL
    var currentURL = window.location.href;

    // Remove the 'm.' from the URL
    var newURL = currentURL.replace('m.', 'www.');

    // Redirect to the new URL
    window.location.href = newURL;
})();