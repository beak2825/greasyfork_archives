// ==UserScript==
// @name         Twitter to Nitter Redirect
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Redirect Twitter links to Nitter links
// @author       USForeign Policy
// @match        *://*.twitter.com/*
// @match        *://*.x.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481021/Twitter%20to%20Nitter%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/481021/Twitter%20to%20Nitter%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the current URL
    const currentURL = window.location.href;

    // Replace twitter.com with nitter.net or x.com with nitter.net
    const nitterURL = currentURL.replace(/(twitter\.com|x\.com)/, 'nitter.net');

    // Redirect to the modified URL
    window.location.replace(nitterURL); // Use replace() to avoid adding to the browser history
})();
