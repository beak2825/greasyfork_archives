// ==UserScript==
// @name           ChatGPT Black Background
// @namespace      https://github.com/AbdurazaaqMohammed
// @version        1.1.1
// @author         Abdurazaaq Mohammed
// @description    Change background color to AMOLED black on ChatGPT
// @match          https://chatgpt.com/*
// @homepage       https://github.com/AbdurazaaqMohammed/userscripts
// @supportURL     https://github.com/AbdurazaaqMohammed/userscripts/issues
// @license        The Unlicense
// @run-at         document-start
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/499067/ChatGPT%20Black%20Background.user.js
// @updateURL https://update.greasyfork.org/scripts/499067/ChatGPT%20Black%20Background.meta.js
// ==/UserScript==
(function() {
	'use strict';
	(document.head || document.documentElement).appendChild(document.createElement('style')).textContent = '[class*="gradient"] { display: none; } div:not(button div):not(.flex-col.flex-1.transition-opacity.duration-500.relative.-mr-2.pr-2.overflow-y-auto div), div.sticky.bg-token-sidebar-surface-primary.top-0.z-20 { background-color: black !important; color: white !important; }';
})();
