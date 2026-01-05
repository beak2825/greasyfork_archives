// ==UserScript==
// @run-at document-start
// @id             Youtube URL Cleaner
// @name           Youtube URL Cleaner
// @namespace      
// @description    Removes some extra parameters from YouTube video links
// @include        http://www.youtube.com/watch?*
// @include        https://www.youtube.com/watch?*
// @version        1.2
// @downloadURL https://update.greasyfork.org/scripts/4298/Youtube%20URL%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/4298/Youtube%20URL%20Cleaner.meta.js
// ==/UserScript==
var newurl = "https://www.youtube.com/watch?"+document.URL.match(/v\=[^&]*/g);
if (newurl != document.URL) location.replace(newurl);