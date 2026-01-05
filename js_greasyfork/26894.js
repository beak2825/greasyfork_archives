// ==UserScript==
// @name        visited_dynasty
// @namespace   vd
// @include     http://dynasty-scans.com/*
// @version     1
// @grant    GM_addStyle
// @description:en Short and dumb userscript for highlighting visited links on Dynasty-scans.com. Nothing else.
// @description Short and dumb userscript for highlighting visited links on Dynasty-scans.com. Nothing else.
// @downloadURL https://update.greasyfork.org/scripts/26894/visited_dynasty.user.js
// @updateURL https://update.greasyfork.org/scripts/26894/visited_dynasty.meta.js
// ==/UserScript==
GM_addStyle('a:visited {color:#7F00FF;}');
GM_addStyle('.mblink:visited, a:visited {color:#7F00FF;}');