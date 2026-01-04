// ==UserScript==
// @name        Quora Unblocker
// @version     12jan2021-stable
// @description Append ?share=1 automatically so that Quora won't annoy with blockers
// @author      OrderedChaos
// @match       *://*.quora.com/*
// @run-at      document-start
// @grant       none
// @namespace https://greasyfork.org/users/726625
// @downloadURL https://update.greasyfork.org/scripts/420077/Quora%20Unblocker.user.js
// @updateURL https://update.greasyfork.org/scripts/420077/Quora%20Unblocker.meta.js
// ==/UserScript==

var oldUrlPath  = window.location.pathname;
var oldSearch   = window.location.search;

// Test that "?share=1" does not exist in URL
if ( ! /\?share=1/.test (oldSearch) ) {

    var newURL  = window.location.protocol + "//"
                + window.location.host
                + window.location.pathname
                + window.location.search + "?share=1"
                + window.location.hash;
    // replace() puts the good page in the history
    window.location.replace (newURL);
}
