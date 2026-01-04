// ==UserScript==
// @run-at document-start
// @name        Bing to Searx
// @namespace   idk_what_this_is_for
// @description This will redirect you to Searx from Bing after you search.
// @include     http://*.bing.com/search?*
// @include     https://*.bing.com/search?*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/423346/Bing%20to%20Searx.user.js
// @updateURL https://update.greasyfork.org/scripts/423346/Bing%20to%20Searx.meta.js
// ==/UserScript==

var newurl = "https://searx.neocities.org/?"+document.URL.match(/q\=[^&]*/);
if (newurl != document.URL) location.replace(newurl);