// ==UserScript==
// @run-at document-start
// @name        Redirect to DuckDuckGo
// @namespace   iamsirsammy@protonmail.com
// @description This will redirect you to DuckDuckGo when searching with another engine. Only Google & Bing are supported yet.
// @include     http://*.bing.com/search?*
// @include     https://*.bing.com/search?*
// @include     http://*.google.com/search?*
// @include     https://*.google.com/search?*
// @version     0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/424264/Redirect%20to%20DuckDuckGo.user.js
// @updateURL https://update.greasyfork.org/scripts/424264/Redirect%20to%20DuckDuckGo.meta.js
// ==/UserScript==
     
var newurl = "https://duckduckgo.com/?"+document.URL.match(/q\=[^&]*/);
if (newurl != document.URL) location.replace(newurl);

