// ==UserScript==
// @name         Twitter Favicon No Red Notifcation Dot
// @namespace    https://greasyfork.org/en/users/8615-joeytwiddle
// @version      0.1
// @license      ISC
// @description  Don't let Twitter put a red dot on its Favicon just because you got a little notification
// @author       joeytwiddle
// @match        https://twitter.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404033/Twitter%20Favicon%20No%20Red%20Notifcation%20Dot.user.js
// @updateURL https://update.greasyfork.org/scripts/404033/Twitter%20Favicon%20No%20Red%20Notifcation%20Dot.meta.js
// ==/UserScript==

// TODO: Option to allow the red dot IFF the user has pending messages (but not if they have pending notifications)

(function () {
	'use strict';

	const debugLogging = false;

	const head = document.getElementsByTagName('head')[0];

	function checkTheFavicon() {
		debugLogging && console.log('Checking favicon...');

		const currentIcons = head.querySelectorAll('[rel="shortcut icon"]');
		debugLogging && Array.from(currentIcons).forEach(icon => console.log('icon:', icon.href));

		const currentIcon = currentIcons[currentIcons.length - 1];
		if (!currentIcon) {
			console.warn('Twitter_Favicon_No_Red_Notification_Dot: No currentIcon to check');
			return;
		}

		if (currentIcon.href.includes('twitter-pip')) {
			debugLogging && console.log('Unwanted pip icon detected.  Exterminate!');
			setFavicon(currentIcon, false);
		}
	}

	function setFavicon(currentIcon, withPip) {
		// Create an entirely new element
		/*
		const newIcon = document.createElement('link');
		newIcon.setAttribute('rel', 'shortcut icon');
		//newIcon.setAttribute('type', 'image/x-icon');
		//newIcon.setAttribute('href', 'data:image/x-icon;base64,______');
		newIcon.setAttribute('href', 'https://abs.twimg.com/favicons/twitter.ico');

		for (let i = currentIcons.length; i--;) {
			currentIcons[i].parentNode.removeChild(currentIcons[i]);
		}
		head.appendChild(newIcon);
		*/

		// Reuse the existing element
		currentIcon.setAttribute('href', 'https://abs.twimg.com/favicons/twitter.ico');
	}

	checkTheFavicon();
	new MutationObserver(mutations => checkTheFavicon()).observe(head, { childList: true, subtree: true });
})();
