// ==UserScript==
// @name           File Garden Black Background
// @namespace      https://github.com/AbdurazaaqMohammed
// @version        1.1.3
// @author         Abdurazaaq Mohammed
// @description    Change background color to AMOLED black on File Garden
// @match          https://filegarden.com/*
// @homepage       https://github.com/AbdurazaaqMohammed/userscripts
// @license        The Unlicense
// @supportURL     https://github.com/AbdurazaaqMohammed/userscripts/issues
// @run-at         document-start
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/490391/File%20Garden%20Black%20Background.user.js
// @updateURL https://update.greasyfork.org/scripts/490391/File%20Garden%20Black%20Background.meta.js
// ==/UserScript==
(function() {
	'use strict';
	(document.head || document.documentElement).appendChild(document.createElement('style')).textContent = 'div:not(a div) { background-color: black !important; }';
})();
