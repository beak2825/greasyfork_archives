// ==UserScript==
// @name         Brighter links on YT (return blue YT description links)
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Makes the links on YT a little brighter
// @author       SoaringGecko
// @match        *://*.youtube.com/*
// @grant    GM_addStyle
// @run-at   document-start
// @downloadURL https://update.greasyfork.org/scripts/405736/Brighter%20links%20on%20YT%20%28return%20blue%20YT%20description%20links%29.user.js
// @updateURL https://update.greasyfork.org/scripts/405736/Brighter%20links%20on%20YT%20%28return%20blue%20YT%20description%20links%29.meta.js
// ==/UserScript==

GM_addStyle ( "#description a:not(.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--outline) {color: #3ea6ff !important;}" );