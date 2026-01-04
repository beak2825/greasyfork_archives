// ==UserScript==
// @run-at document-start
// @name        Bing to Google
// @namespace   leorijn223@gmail.com
// @description This will redirect you from Google to Bing, instead of the other way around.
// @include     http://*.google.com/search?*
// @include     https://*.google.com/search?*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/465262/Bing%20to%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/465262/Bing%20to%20Google.meta.js
// ==/UserScript==

var newurl = "https://bing.com/search?"+document.URL.match(/q\=[^&]*/);
if (newurl != document.URL) location.replace(newurl);