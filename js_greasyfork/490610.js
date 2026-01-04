// ==UserScript==
// @name         Xenforo Invisitext69
// @version      2025-11-02
// @description  Make invisible text more visible.
// @namespace    https://greasyfork.org/users/1267336
// @author       ProtagNeptune
// @match        https://althistory.com/*
// @match        https://spacebattles.com/*
// @match        https://*.spacebattles.com/*
// @match        https://alternatehistory.com/*
// @match        https://*.alternatehistory.com/*
// @match        https://sufficientvelocity.com/*
// @match        https://*.sufficientvelocity.com/*
// @match        https://questionablequesting.com/*
// @match        https://*.questionablequesting.com/*
// @match        https://the-sietch.com/*
// @match        https://*.the-sietch.com/*
// @match        https://xenforo.com/community/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xenforo.com
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/490610/Xenforo%20Invisitext69.user.js
// @updateURL https://update.greasyfork.org/scripts/490610/Xenforo%20Invisitext69.meta.js
// ==/UserScript==

// Apply styles to make invisible text more visible
GM_addStyle('span[style*="Transparent"], span[style*="transparent"], span[style*="TRANSPARENT"] { border: 1px dotted #99CC00; background: #000000; }');
GM_addStyle('span[style*="Transparent"]:hover, span[style*="transparent"]:hover, span[style*="TRANSPARENT"]:hover { color: #99CC00 !important; }');