// ==UserScript==
// @run-at document-start
// @name        Bing to Google
// @namespace   leorijn223@gmail.com
// @description This will redirect you to Google from Bing after you search.
// @include     http://*.bing.com/search?*
// @include     https://*.bing.com/search?*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11308/Bing%20to%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/11308/Bing%20to%20Google.meta.js
// ==/UserScript==

var newurl = "https://google.com/search?"+document.URL.match(/q\=[^&]*/);
if (newurl != document.URL) location.replace(newurl);