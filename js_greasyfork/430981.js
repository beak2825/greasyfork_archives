// ==UserScript==
// @name         YouTube Dark Search Box
// @namespace    https://greasyfork.org/pt-BR/users/805718-spectro
// @version      1.9.2
// @description  Simply fix white styles in the dark theme
// @author       @Spectro
// @match        *://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/430981/YouTube%20Dark%20Search%20Box.user.js
// @updateURL https://update.greasyfork.org/scripts/430981/YouTube%20Dark%20Search%20Box.meta.js
// ==/UserScript==

	// Searchbox
GM_addStyle(`
.sbsb_a { background-color: rgb(15, 15, 15) !important;}
.sbdd_b { background-color: rgb(15, 15, 15) !important; border-color: rgb(53, 58, 59) rgb(56, 61, 63) rgb(56, 61, 63) !important;}
.sbsb_c.gsfs.sbsb_d:hover { background-color: rgba(228, 228, 228,.7) !important;}
.gsfs { filter: invert(89%) !important; !important; font-size: 1.8rem !important;}
.sbfl_b { background: rgba(255,255,255,.8) !important; color: rgb(85, 85, 85) !important;}
.sbsb_i { color: #bc8f44 !important;}
.sbsb_i:hover { color: #7e6234 !important;}
`);
	// More...