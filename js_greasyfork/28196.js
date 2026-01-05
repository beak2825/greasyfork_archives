// ==UserScript==
// @name            Reddit: Hide Sidebar When 50% Screen
// @namespace       https://github.com/Zren/
// @description     Hide Reddit sidebar when window is less than 960px wide.
// @icon            https://reddit.com/favicon.ico
// @author          Zren
// @version         1
// @match           https://www.reddit.com/*
// @run-at          document-start
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/28196/Reddit%3A%20Hide%20Sidebar%20When%2050%25%20Screen.user.js
// @updateURL https://update.greasyfork.org/scripts/28196/Reddit%3A%20Hide%20Sidebar%20When%2050%25%20Screen.meta.js
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
