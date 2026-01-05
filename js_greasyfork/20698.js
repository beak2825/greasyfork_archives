// ==UserScript==
// @name            Google Search Only Normal TLDs
// @author
// @description     Show only .com, .net, .org domains in Google Search results.
// @downloadURL
// @grant
// @homepageURL     https://bitbucket.org/INSMODSCUM/userscripts-scripts/src
// @icon
// @include         /https?://(www|encrypted).google(.\w+)(.\w+)?/((\?|#|search|webhp).*)?/
// @namespace       insmodscum 
// @require
// @run-at          document-start
// @updateURL
// @version         1.0
// @downloadURL https://update.greasyfork.org/scripts/20698/Google%20Search%20Only%20Normal%20TLDs.user.js
// @updateURL https://update.greasyfork.org/scripts/20698/Google%20Search%20Only%20Normal%20TLDs.meta.js
// ==/UserScript==

// rtfm: http://www.w3schools.com/jsref/obj_location.asp

if (! /site%3A.com%20OR%20site%3A.net%20OR%20site%3A.org/.test(window.location.search.substring(1))) {

var newURL  = window.location.protocol + "//" + window.location.host + window.location.pathname + window.location.search+"%20(site%3A.com%20OR%20site%3A.net%20OR%20site%3A.org)";

window.location.replace (newURL);

}