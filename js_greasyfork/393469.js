// ==UserScript==
// @name         [RED/OPS] FL link in notifications/better.php
// @namespace    https://greasyfork.org/users/321857-anakunda
// @version      1.05
// @description  yes
// @author       Anakunda
// @match        https://redacted.sh/torrents.php?action=notify*
// @match        https://redacted.sh/torrents.php?page=*&action=notify*
// @match        https://redacted.sh/better.php?method=*
// @match        https://redacted.sh/better.php?page=*&method=*
// @match        https://orpheus.network/torrents.php?action=notify*
// @match        https://orpheus.network/torrents.php?page=*&action=notify*
// @match        https://orpheus.network/better.php?method=*
// @match        https://orpheus.network/better.php?page=*&method=*
// @downloadURL https://update.greasyfork.org/scripts/393469/%5BREDOPS%5D%20FL%20link%20in%20notificationsbetterphp.user.js
// @updateURL https://update.greasyfork.org/scripts/393469/%5BREDOPS%5D%20FL%20link%20in%20notificationsbetterphp.meta.js
// ==/UserScript==

'use strict';

function createFlButton(container) {
	if (!(container instanceof HTMLElement)) throw 'Invalid argument';
	let buttonFl = Array.prototype.find.call(container.getElementsByTagName('A'), a => a.textContent.trim() == 'DL');
	if (buttonFl) buttonFl = buttonFl.cloneNode(true); else return null;
	buttonFl.className = 'tooltip button_fl';
	buttonFl.textContent = 'FL';
	buttonFl.title = 'Use a FL Token';
	buttonFl.style.fontWeight = 'bold';
	const searchParams = new URLSearchParams(buttonFl.search);
	searchParams.set('usetoken', 1);
	buttonFl.search = searchParams;
	buttonFl.onclick = evt => confirm('Are you sure you want to use a freeleech token here?');
	return buttonFl;
}

if (document.getElementById('fl_tokens') == null) return;
switch (document.location.pathname) {
	case '/torrents.php':
		for (let span of document.body.querySelectorAll('table.torrent_table > tbody > tr span.torrent_action_buttons')) {
			if (span.querySelector('a.button_fl') != null) continue;
			let size = span.parentNode.parentNode.parentNode.querySelector(':scope > td:nth-of-type(6)');
			if (size != null && (size = /^(\d+(?:\.\d+)?)\s*(\w?B)\b/.exec(size.textContent.trim())) != null) {
				size = Math.round(parseFloat(size[1]) * 2 ** (['B', 'KB', 'MB', 'GB', 'TB', 'PB'].indexOf(size[2].toUpperCase()) * 10));
				if (size > 2 * 2**30) continue; // tokens apply only on torrents up to 2GB
			}
			const buttonFl = createFlButton(span);
			if (buttonFl != null) span.prepend(buttonFl, ' | ');
		}
		break;
	case '/better.php':
		for (let span of document.body.querySelectorAll('table.torrent_table > tbody > tr span.torrent_links_block')) {
			if (span.querySelector('a.button_fl') != null) continue;
			const buttonFl = createFlButton(span);
			if (buttonFl == null) continue;
			buttonFl.classList.add('brackets');
			span.prepend(buttonFl, ' ');
		}
		break;
}
