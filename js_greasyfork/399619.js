// ==UserScript==
// @run-at document-start
// @name        Bing to DuckDuckGo
// @namespace   
// @description This will redirect you to DuckDuckGo from Bing after you search.
// @include     http://*.bing.com/search?*
// @include     https://*.bing.com/search?*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/399619/Bing%20to%20DuckDuckGo.user.js
// @updateURL https://update.greasyfork.org/scripts/399619/Bing%20to%20DuckDuckGo.meta.js
// ==/UserScript==

var newurl = "https://duckduckgo.com/?"+document.URL.match(/q\=[^&]*/);
if (newurl != document.URL) location.replace(newurl);