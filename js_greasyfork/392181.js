// ==UserScript==
// @name         Discogs API links
// @namespace    https://greasyfork.org/users/321857-anakunda
// @version      1.10.1
// @run-at       document-end
// @description  Adds links to view current page in JSON format (release, master release, artist, label)
// @author       Anakunda
// @copyright    2121-22, Anakunda (https://greasyfork.org/users/321857-anakunda)
// @license      GPL-3.0-or-later
// @include      /^(?:https?):\/\/(?:www\.)?discogs\.com\/(release|master|artist|label)\/(\d+)\b/
// @match        https://www.discogs.com/settings/developers
// @match        https://www.discogs.com/applications/edit/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/392181/Discogs%20API%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/392181/Discogs%20API%20links.meta.js
// ==/UserScript==

'use strict';

function actionOK(button) {
	console.debug(button);
	if (!(button instanceof HTMLButtonElement)) return;
	button.style.background = 'green';
	setTimeout(elem => { elem.style.background = null }, 1000, button);
}

if (document.location.pathname == '/settings/developers') {
	var ref = document.body.querySelector('form[method="post"][action="/applications/token"] > p'), button;
	if (ref != null) button = document.createElement('BUTTON'); else return;
	button.textContent = 'Use for API links';
	button.className = 'button button-blue';
	button.onclick = function(evt) {
		ref = evt.currentTarget.parentNode.parentNode.querySelector('span[aria-label="Select token"]');
		if (ref != null) {
			GM_setValue('access_token', ref.textContent.trim());
			actionOK(evt.currentTarget);
		}
		return false;
	};
	ref.append(button);
	return;
} else if (document.location.pathname.startsWith('/applications/edit/')) {
	ref = document.body.querySelector('fieldset.form-footer');
	if (ref != null) button = document.createElement('BUTTON'); else return;
	button.textContent = 'Use for API links';
	button.className = 'button button-blue';
	button.onclick = function(evt) {
		ref = document.body.querySelectorAll('div#page_content > h1 + table > tbody > tr > td > code');
		if (ref.length < 2) return false;
		GM_setValue('consumer_key', ref[0].textContent.trim());
		GM_setValue('consumer_secret', ref[1].textContent.trim());
		actionOK(evt.currentTarget);
		return false;
	};
	ref.append(button);
	return;
}

let type, id;
if ((ref = document.querySelector('span.copy_shortcut_code')) != null
		&& (type = /\[([rmal])(\d+)\]/.exec(ref.textContent)) != null) {
	id = parseInt(type[2]);
	switch (type[1].toLowerCase()) {
		case 'r': type = 'release'; break;
		case 'm': type = 'master'; break;
		case 'a': type = 'artist'; break;
		case 'l': type = 'label'; break;
	}
}
if ((!type || !(id > 0))
		&& (type = /\/(release|master|artist|label)s?\/(\d+)\b/i.exec(document.location.pathname)) != null) {
	id = parseInt(type[2]);
	type = type[1];
}
if (!type || !(id > 0)) throw 'Could not extract entry type and id';

function addLinks(container) {
	if (!(container instanceof HTMLElement)) throw 'Link section could not be located';
	const urlParams = new URLSearchParams,
				accessToken = GM_getValue('access_token'),
				consumerKey = GM_getValue('consumer_key'), consumerSecret = GM_getValue('consumer_secret');
	if (accessToken) urlParams.set('token', accessToken);
	else if (consumerKey && consumerSecret) {
		urlParams.set('key', consumerKey);
		urlParams.set('secret', consumerSecret);
	}
	container.append(document.createElement('BR'), document.createElement('BR'));
	let link = document.createElement('A');
	link.href = `https://api.discogs.com/${type}s/${id}`;
	link.search = urlParams;
	link.target = '_blank';
	link.className = 'api-link';
	link.textContent = 'View through API';
	container.append(link);
	if (type == 'artist') {
		link = document.createElement('A');
		link.href = `https://api.discogs.com/${type}s/${id}/releases`;
		link.search = urlParams;
		link.target = '_blank';
		link.className = 'releases-api-link';
		link.textContent = 'View releases through API';
		container.append(document.createElement('BR'), link);
	}
}

if ((ref = [
	'.copy_shortcut + h3 + div',
	'section#release-actions > header + div',
	'div.section > h3 + div',
	'div#page_aside > div > div.section_content',
	'div.right > div > div.section_content',
].reduce((elem, sel) => elem || document.body.querySelector(sel), null)) == null) addLinks(ref);
	else throw 'Link section could not be located';
new MutationObserver(function(ml, mo) {
	for (let mutation of ml) for (let node of mutation.removedNodes)
		if (node.nodeName == 'A' && node.nextElementChild == null) addLinks(mutation.target);
}).observe(ref, { childList: true });
