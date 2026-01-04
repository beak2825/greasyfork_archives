// ==UserScript==
// @name        Remedy/Smart IT Auto-Reload
// @namespace   1
// @version     0.1
// @include     https://*.onbmc.com/*
// @grant       none
// @require     http://code.jquery.com/jquery-latest.js
// @description Reloads Remedy/Smart IT every 30 minutes.
// @downloadURL https://update.greasyfork.org/scripts/369587/RemedySmart%20IT%20Auto-Reload.user.js
// @updateURL https://update.greasyfork.org/scripts/369587/RemedySmart%20IT%20Auto-Reload.meta.js
// ==/UserScript==

var x = 30; // add time in minutes

setTimeout(function(){ location.reload(); }, x*60*1000);