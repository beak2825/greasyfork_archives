// ==UserScript==
// @name        EzcapeChat Auto SWF Wide
// @namespace   BaskinBros Scripts
// @version     1.2
// @author      thebranmaster
// @description Redirects to SWF | Sets chat width to 80%
// @license MIT
// @include       *://*.ezcapechat.com/rooms/*
// @include       *://*.ezcapechat.com/rooms/*/swf
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/448153/EzcapeChat%20Auto%20SWF%20Wide.user.js
// @updateURL https://update.greasyfork.org/scripts/448153/EzcapeChat%20Auto%20SWF%20Wide.meta.js
// ==/UserScript==
 
// Run at document start and end
// Start Script
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
 
document.addEventListener ("DOMContentLoaded", DOM_ContentReady);
window.addEventListener ("load", pageFullyLoaded);
 
function DOM_ContentReady () {
// End Script
// This is the equivalent of @run-at document-end
//Change Style
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
//Set chat to 80% width
addGlobalStyle('#swf_chat_normal{width:80% !important}');
}