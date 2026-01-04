// ==UserScript==
// @name         Confluence: space avatar as tab icon
// @namespace    https://github.com/rybak
// @description  Sets browser tab icon of Confluence to the avatar of the space.
// @author       Andrei Rybak
// @homepageURL  https://github.com/rybak/atlassian-tweaks
// @include      https://*confluence*/*
// @match        https://confluence.example.com/*
// @icon         https://wac-cdn-2.atlassian.com/image/upload/f_auto,q_auto/dam/jcr:5d1374c2-276f-4bca-9ce4-813aba614b7a/confluence-icon-gradient-blue.svg?cdnVersion=691
// @version      4
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462032/Confluence%3A%20space%20avatar%20as%20tab%20icon.user.js
// @updateURL https://update.greasyfork.org/scripts/462032/Confluence%3A%20space%20avatar%20as%20tab%20icon.meta.js
// ==/UserScript==

(function() {
	'use strict';

	const LOG_PREFIX = "[Confluence: avatar favicons]";

	function log(...toLog) {
		console.log(LOG_PREFIX, ...toLog);
	}

	function warn(...toLog) {
		console.warn(LOG_PREFIX, ...toLog);
	}

	function changeFavicon() {
		log("Trying...");
		const avatar = document.querySelector(".avatar-img") || document.querySelector('img[data-testid="space-icon"]');
		const shortcutIcon = document.querySelector('link[rel="shortcut icon"]');
		const icon = document.querySelector('link[rel="icon"]');
		if (avatar && (shortcutIcon || icon)) {
			const url = avatar.src;
			log("URL = " + url);
			if (shortcutIcon) {
				shortcutIcon.href = url;
				log("Done shortcut.");
			}
			if (icon) {
				icon.href = url;
				log("Done icon.");
			}
		} else {
			log("Something went wrong.", avatar, shortcutIcon, icon);
		}
	}

	// https://youmightnotneedjquery.com/#ready
	if (document.readyState !== 'loading') {
		changeFavicon();
	} else {
		warn('Cannot load yet. Setting up a listener...');
		document.addEventListener('DOMContentLoaded', changeFavicon);
	}
})();
