// ==UserScript==
// @name           Old Reddit Black Background
// @namespace      https://github.com/AbdurazaaqMohammed
// @version        1.2
// @author         Abdurazaaq Mohammed
// @description    Change background color to AMOLED black on Old Reddit
// @match          https://old.reddit.com/*
// @match          https://np.reddit.com/*
// @homepage       https://github.com/AbdurazaaqMohammed/userscripts
// @license        The Unlicense
// @supportURL     https://github.com/AbdurazaaqMohammed/userscripts/issues
// @run-at         document-start
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/499068/Old%20Reddit%20Black%20Background.user.js
// @updateURL https://update.greasyfork.org/scripts/499068/Old%20Reddit%20Black%20Background.meta.js
// ==/UserScript==
(function() {
	'use strict';

	(document.head || document.documentElement).appendChild(document.createElement('style')).textContent = 'body, div:not(button div):not(.reddit-video-player-root.portrait div), textarea { background-color: black !important; color: #CBC3E3 !important; }';
})();
