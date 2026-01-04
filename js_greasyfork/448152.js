// ==UserScript==
// @name        EzcapeChat Auto SWF Mode
// @namespace   BaskinBros Scripts
// @version     1.2
// @author      thebranmaster
// @description Redirects to SWF
// @license MIT
// @match       *://*.ezcapechat.com/rooms/*
// @run-at      document-start
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/448152/EzcapeChat%20Auto%20SWF%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/448152/EzcapeChat%20Auto%20SWF%20Mode.meta.js
// ==/UserScript==

var oldUrlPath  = window.location.pathname;

// Test that "/swf" is at end of url
if ( ! /\/swf$/.test (oldUrlPath) ) {

    var newURL  = window.location.protocol + "//"
                + window.location.host
                + oldUrlPath + "/swf"
                + window.location.search
                + window.location.hash
                ;
    // Replace url
    window.location.replace (newURL);
}