// ==UserScript==
// @name         gamedev.ru - filter messages by user
// @namespace    gamedev.ru
// @description  filter messages by user
// @version      0.2
// @author       entryway
// @include      /^https?:\/\/(www.)?gamedev\.ru\/.*$/
// @grant        none
// @run-at       document-start

// @downloadURL https://update.greasyfork.org/scripts/435096/gamedevru%20-%20filter%20messages%20by%20user.user.js
// @updateURL https://update.greasyfork.org/scripts/435096/gamedevru%20-%20filter%20messages%20by%20user.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
	'use strict';

	if (['interactive', 'complete'].includes(document.readyState)) {
		jsStuff();
	} else {
		addEventListener('DOMContentLoaded', jsStuff);
	}

	function jsStuff() {
		filterMessagesByUser();
	}

	function filterMessagesByUser() {
		const re = /[&?]id=(\d+)/;
		const matches = re.exec(location.href);
		if (matches) {
			const style = document.createElement('style');
			style.innerHTML = `
				.lnk {cursor:help; font-size:80%;} .lnk:after {content:'＠ '; white-space:pre;color:#808080}
				a.lnk:link, a.lnk:visited {color:#808080 !important; text-decoration:none !important;}
			`;
			document.body.appendChild(style);

			for (const a of document.querySelectorAll('div.bound.head ul li a')) {
				const m = re.exec(a.href);
				if (m) {
					const elem = document.createElement('a');
					elem.className = 'lnk';
					elem.href = `?id=${matches[1]}&user=${m[1]}`;
					a.parentNode.insertBefore(elem, a);
				}
			}
		}
	}
})();
