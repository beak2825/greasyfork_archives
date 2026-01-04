// ==UserScript==
// @name         [GMT] Visualise torrent stats on thumbnails
// @match        https://*/torrents.php*
// @match        https://*/artist.php?*
// @match        https://*/collages.php?*
// @run-at       document-end
// @author       Anakunda
// @version      1.00.0
// @namespace    https://greasyfork.org/users/321857-anakunda
// @description  Highlights torrent stats on cover thumbnails (left-red leeching / right-green seeding / bottom-blue snatched / top-gold uploaded)
// @copyright    2022, Anakunda (https://greasyfork.org/users/321857-anakunda)
// @license      GPL-3.0-or-later
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://openuserjs.org/src/libs/Anakunda/libLocks.min.js
// @require      https://openuserjs.org/src/libs/Anakunda/gazelleApiLib.min.js
// @downloadURL https://update.greasyfork.org/scripts/442229/%5BGMT%5D%20Visualise%20torrent%20stats%20on%20thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/442229/%5BGMT%5D%20Visualise%20torrent%20stats%20on%20thumbnails.meta.js
// ==/UserScript==

'use strict';

let userId = document.body.querySelector('#nav_userinfo a.username');
if (userId != null) {
	userId = new URL(userId);
	userId = parseInt(userId.searchParams.get('id'));
}
if (!(userId > 0)) throw 'User ID not determined';

function safeGetValue(key, defValue) {
	if (!key) throw 'Invalid argument'; else if (typeof GM_getValue == 'function') var value = GM_getValue(key);
	if (value == undefined && defValue != undefined) {
		value = defValue;
		if (typeof GM_setValue == 'function') GM_setValue(key, defValue);
	}
	return value;
}

const batchSize = 10000, ttl = safeGetValue('cache_lifetime', 300 /* s */),
			cacheScope = safeGetValue('cache_scope', 'session').toLowerCase(); // session(=tab) / browser
const typeStyles = safeGetValue('type_styles', {
	seeding: { 'border-right': '5pt solid #8F8' },
	leeching: { 'border-left': '5pt solid #F88' },
	uploaded: { 'border-top': '5pt solid gold' },
	snatched: { 'border-bottom': '5pt solid #79BAFF' },
});
let myStats, groupId, img;

function getMyStats() {
	const cacheKey = `myStats[${document.domain}]`,
				storage = cacheScope == 'session' ? sessionStorage : localStorage;
	if (cacheKey in storage) try {
		var myStats = JSON.parse(storage.getItem(cacheKey));
		if (myStats.timeStamp + ttl * 1000 > Date.now()) return Promise.resolve(myStats);
	} catch(e) {
		console.warn(e, storage.getItem(cacheKey));
		storage.removeItem(cacheKey)
	}
	const getType = (type, offset = 0) => type ? queryAjaxAPI('user_torrents', {
		id: userId,
		type: type = type.toLowerCase(),
		limit: batchSize,
		offset: offset,
	}).then(function(response) {
		if (!Array.isArray(response[type])) return Promise.reject(`Invalid response (${typeof response[type]})`);
		response = response[type].map(item => item.groupId);
		if (response.length < batchSize) return response;
		return getType(type, offset + response.length).then(groupIds => response.concat(groupIds));
	}) : Promise.reject('Invalid argument');
	return Promise.all(Object.keys(typeStyles).map(type => getType(type))).then(function(groupIds) {
		myStats = { timeStamp: Date.now() };
		Object.keys(typeStyles).forEach((type, ndx) =>
			myStats[type] = groupIds[ndx].filter((id, ndx, a) => a.indexOf(id) == ndx));
		storage.setItem(cacheKey, JSON.stringify(myStats));
		return myStats;
	});
}

function highlightStatusAttributes(img, groupId) {
	(myStats || (myStats = getMyStats())).then(function(myStats) {
		for (let type in typeStyles)  if (type in myStats && myStats[type].includes(groupId))
			for (let prop in typeStyles[type]) img.style[prop] = typeStyles[type][prop];
		if (img.style.length > 0) img.style.boxSizing = 'border-box';
	});
}

switch (document.location.pathname) {
	case '/torrents.php':
		groupId = new URLSearchParams(document.location.search);
		if ((groupId = parseInt(groupId.get('id'))) > 0) {
			//if ((img = document.body.querySelector('div#covers img')) != null) highlightStatusAttributes(img, groupId);
			break;
		}
	case '/artist.php':
		for (let div of document.body.querySelectorAll('div#content table > tbody > tr > td.big_info')) {
			if ((img = div.querySelector('div.group_image > img')) == null) continue;
			groupId = div.querySelector('div.group_info a[dir="ltr"]:last-of-type');
			if (groupId != null) groupId = new URL(groupId); else continue;
			groupId = parseInt(groupId.searchParams.get('id'));
			if (groupId > 0) highlightStatusAttributes(img, groupId);
		}
		break;
	case '/collages.php': {
		function processPages(parent) {
			for (let elem of parent) if (elem.nodeName == 'UL') for (img of elem.querySelectorAll('li > a > img')) {
				groupId = new URL(img.parentNode);
				groupId = parseInt(groupId.searchParams.get('id'));
				if (groupId > 0) highlightStatusAttributes(img, groupId);
			}
		}

		const gallery = document.getElementById('coverart');
		if (gallery == null) throw 'Gallery not found';
		processPages(gallery.children);
		new MutationObserver((ml) => { for (let mutation of ml) processPages(mutation.addedNodes) })
			.observe(gallery, { childList: true });
		break;
	}
}
