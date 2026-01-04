// ==UserScript==
// @name            Reddit: Hide Sidebar When 50% Screen2
// @namespace       https://github.com/Zren/
// @description     Hide Reddit sidebar when window is less than 960px wide.
// @author          Zren
// @version         1.2
// @match           https://www.reddit.com/*
// @run-at document-end
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/371233/Reddit%3A%20Hide%20Sidebar%20When%2050%25%20Screen2.user.js
// @updateURL https://update.greasyfork.org/scripts/371233/Reddit%3A%20Hide%20Sidebar%20When%2050%25%20Screen2.meta.js
// ==/UserScript==

var css = [
	"@media (min-width: 1px) and (max-width: 960px) {",
	"    html .side {",
	"        display: none;",
	"    }",
	"    html .sitetable,",
	"    html .thing,",
	"    html .linklisting .link,",
	"    html div.content,",
	"    html .commentarea,",
	"    html .commentarea>.sitetable>.comment {",
	"		margin-left: 0 !important;",
	"        margin-right: 0 !important;",
	"    	max-width: 100vw;",
	"    	padding-left: 0 !important;",
	"    	padding-right: 0 !important;",
	"    }",
	"    body > .content { border-right: 1px; }",
	"}",
];

GM_addStyle(css.join('\n'));