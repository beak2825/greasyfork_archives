// ==UserScript==
// @run-at document-start
// @name        Bing to DDG
// @namespace   pureandapplied.com.au
// @description Redirects Bing searches to DuckDuckGo. Use it with EdgeDeflector to banish Bing
// @include     http://*.bing.com/search?*
// @include     https://*.bing.com/search?*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/34353/Bing%20to%20DDG.user.js
// @updateURL https://update.greasyfork.org/scripts/34353/Bing%20to%20DDG.meta.js
// ==/UserScript==

var newurl = "https://duckduckgo.com/?"+document.URL.match(/q\=[^&]*/);
if (newurl != document.URL) location.replace(newurl);