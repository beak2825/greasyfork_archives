// ==UserScript==
// @name         Twitter To Nitter
// @namespace    chillsmeit
// @version      1.0.1
// @description  Redirects Twitter URLs to Nitter URLs
// @author       chillsmeit
// @include      *://twitter.com/*
// @run-at       document-start
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/477841/Twitter%20To%20Nitter.user.js
// @updateURL https://update.greasyfork.org/scripts/477841/Twitter%20To%20Nitter.meta.js
// ==/UserScript==

const NITTER_URL = 'https://nitter.net';

function redirectToNitter() {
    var currentPath = window.location.pathname; // Extract the current path from the twitter url
    var currentSearch = window.location.search; // Extract any parameters, like search etc.
    var currentHash = window.location.hash; // Extract any hash, like #section

    // Redirect the browser to the equivalent Nitter URL
    window.location.href = NITTER_URL + currentPath + currentSearch + currentHash;
}

redirectToNitter();