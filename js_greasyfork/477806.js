// ==UserScript==
// @name         DeleteLogoutButton
// @namespace    https://jirehlov.com
// @version      0.1
// @description  Delete Logout Button on bangumi
// @author       Jirehlov
// @include        /^https?://(bangumi\.tv|bgm\.tv|chii\.in)/.*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477806/DeleteLogoutButton.user.js
// @updateURL https://update.greasyfork.org/scripts/477806/DeleteLogoutButton.meta.js
// ==/UserScript==
(function () {
	'use strict';
	const currentDomain = window.location.origin;
	const links = document.getElementsByTagName('a');
	for (let i = 0; i < links.length; i++) {
		const link = links[i];
		if (link.textContent === '登出' && link.href.startsWith(currentDomain + '/logout/')) {
			const previousSibling = link.previousSibling;
			if (previousSibling && previousSibling.nodeType === 3 && previousSibling.textContent.trim() === '|') {
				previousSibling.remove();
			}
			link.remove();
		}
	}
}());