// ==UserScript==
// @name         Wikipedia Mobile to Standard Redirect
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Redirect mobile Wikipedia pages to the standard version
// @author       You
// @match        *://*.m.wikipedia.org/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529756/Wikipedia%20Mobile%20to%20Standard%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/529756/Wikipedia%20Mobile%20to%20Standard%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Replace 'm.' with '' to redirect to the standard Wikipedia page
    let newUrl = location.href.replace(/(https?:\/\/)(.*?)\.m\.wikipedia\.org\//, '$1$2.wikipedia.org/');

    if (location.href !== newUrl) {
        location.replace(newUrl);
    }
})();
