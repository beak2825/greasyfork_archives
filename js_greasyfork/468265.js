// ==UserScript==
// @name        Google image tools always opened
// @namespace   ToolsAlwaysOpened
// @version     1
// @description Auto click on the tools button on Google Images.
// @author      hacker09
// @include	    *://www.google.*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://www.google.com&size=64
// @grant       none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/468265/Google%20image%20tools%20always%20opened.user.js
// @updateURL https://update.greasyfork.org/scripts/468265/Google%20image%20tools%20always%20opened.meta.js
// ==/UserScript==

if (document.querySelector('div[aria-haspopup="menu"]')) document.querySelector('div[aria-haspopup="menu"]').click();