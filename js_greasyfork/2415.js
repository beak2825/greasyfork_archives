// ==UserScript==
// @name       Twitter usernames > "real names"
// @namespace  http://www.arthaey.com/
// @version    1.0
// @description  Make usernames more prominent, "real names" less promiment.
// @match      http://twitter.com/*
// @match      https://twitter.com/*
// @copyright  Arthaey Angosii <arthaey@gmail.com>
//
// Backed up from http://userscripts.org/scripts/review/165346
// Last updated on 2013-04-19
// @downloadURL https://update.greasyfork.org/scripts/2415/Twitter%20usernames%20%3E%20%22real%20names%22.user.js
// @updateURL https://update.greasyfork.org/scripts/2415/Twitter%20usernames%20%3E%20%22real%20names%22.meta.js
// ==/UserScript==

GM_addStyle(".stream-item-header .fullname { font-weight: normal !important; font-size: 12px; color: #999; margin-left: 6px; }");
GM_addStyle(".stream-item-header .username * { font-weight: bold !important; font-size: 14px; color: #333; float: left; }");
