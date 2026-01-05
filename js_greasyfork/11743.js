// ==UserScript==
// @run-at document-start
// @name        Bing to Lucky Google
// @namespace   leorijn223@gmail.com
// @description This will redirect you to Lucky Google from Bing after you search.
// @include     http://*.bing.com/search?*
// @include     https://*.bing.com/search?*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11743/Bing%20to%20Lucky%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/11743/Bing%20to%20Lucky%20Google.meta.js
// ==/UserScript==

var newurl = "https://www.google.com/search?ie=UTF-8&oe=UTF-8&sourceid=navclient&gfns=1&"+document.URL.match(/q\=[^&]*/);
if (newurl != document.URL) location.replace(newurl);