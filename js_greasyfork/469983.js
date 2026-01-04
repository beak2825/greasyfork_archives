// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/469983/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/469983/New%20Userscript.meta.js
// ==/UserScript==

GM_addStyle('.link .title {font-size: small !important} .tagline {font-size: smaller !important} .side {display:none} .entry .buttons li a {font-size: large !important; color: blue} .link .score {font-size: large !important}');