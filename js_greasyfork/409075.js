// ==UserScript==
// @name         Kingdom Leaks for Gazelle Music Trackers
// @namespace    https://greasyfork.org/users/321857-anakunda
// @version      1.01
// @description  try to take over the world!
// @author       Anakunda
// @copyright    2020, Anakunda (https://greasyfork.org/users/321857-anakunda)
// @license      GPL-3.0-or-later
// @iconURL      https://kingdom-leaks.com/favicon.ico
// @match        https://kingdom-leaks.com/*
// @match        https://filecrypt.cc/Container/*
// @match        https://www.filecrypt.cc/Container/*
// @match        https://www.filecrypt.to/Container/*
// @match        https://www.filecrypt.co/Container/*
// @match        https://filecrypt.cc/Link/*
// @match        https://www.filecrypt.cc/Link/*
// @match        https://www.filecrypt.to/Link/*
// @match        https://www.filecrypt.co/Link/*
// @connect      filecrypt.cc
// @connect      www.filecrypt.cc
// @connect      www.filecrypt.to
// @connect      www.filecrypt.co
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_setClipboard
// @require      https://greasyfork.org/scripts/408084-xhrlib/code/xhrLib.js
// @downloadURL https://update.greasyfork.org/scripts/409075/Kingdom%20Leaks%20for%20Gazelle%20Music%20Trackers.user.js
// @updateURL https://update.greasyfork.org/scripts/409075/Kingdom%20Leaks%20for%20Gazelle%20Music%20Trackers.meta.js
// ==/UserScript==

'use strict';

if (document.location.hostname.endsWith('kingdom-leaks.com')) {
	if (document.location.search.startsWith('?/forums/topic/')) {
		let node = document.querySelector('strong > a[href*="filecrypt"]');
		if (node == null) return;
		let url = new URLSearchParams(node.search).get('url');
		if (url) globalXHR(url).then(response => parseFcDoc(response.document, response.finalUrl)).catch(function(reason) {
			console.error(reason);
			document.location = url;
		});
	} else {
		const vaParser = /^(?:Various(?:\s+Artists)?|Varios(?:\s+Artistas)?|V\/?A|\<various\s+artists\>|Různí(?:\s+interpreti)?)$/i;
		document.querySelectorAll('ol.ipsDataList > h2.ipsType_sectionTitle > a').forEach(function(a) {
			function hide() {
				a.parentNode.style.display = 'none';
				a.parentNode.nextElementSibling.style.display = 'none';
			}
			function dim() {
				a.parentNode.style.opacity = 0.5;
				a.parentNode.nextElementSibling.style.opacity = 0.5;
			}

			let quality = a.parentNode.nextElementSibling.querySelector('span.kl-quality');
			if (quality != null && !/\b(?:FLAC)\b/i.test(quality.textContent)) hide();
			let title = a.textContent.trim();
			const rx = /\s+\((\d{4})\)$/;
			let year = rx.test(title) ? parseInt(RegExp.$1) : undefined;
			let isSingle = title.includes(' [Single]');
			if (quality != null && isSingle) dim();
			let isEP = title.includes(' [EP]');
			let redA = document.createElement('a');
			let redSearchUrl = new URL('https://redacted.ch/torrents.php'), redSearchQuery = new URLSearchParams({
				'order_by': 'time',
				'order_way': 'desc',
				'group_results': 1,
				'filter_cat[1]': 1,
				//'forwardtoupload': 1,
				'searchsubmit': 1,
			});
			title = title.replace(/(?:\s+(?:\([^\(\)]+\)|\[[^\[\]]+\]|\{[^\{\}]+\}))+\s*$/, '');
			if (title.match(/-/g).length == 1 && /^(.+?)\s+-\s+(.+)$/.test(title)) {
				let artist = RegExp.$1, album = RegExp.$2;
				redSearchQuery.set('action', 'advanced');
				if (!vaParser.test(artist)) {
					redA.text = 'Artist on RED';
					redA.href = 'https://redacted.ch/artist.php?artistname=' + encodeURIComponent(artist);
					redA.target = '_blank';
					redA.style = 'float: right; color: #8bc34a !important; margin-left: 10px;';
					a.parentNode.append(redA);

					redA = document.createElement('a');
					redSearchQuery.set('artistname', artist);
				}
				redSearchQuery.set('groupname', album);
				redSearchQuery.set('year', year);
				redSearchQuery.set('format', 'FLAC');
				if (isSingle) redSearchQuery.set('releasetype', 9);
				if (isEP) redSearchQuery.set('releasetype', 5);
			} else {
				redSearchQuery.set('action', 'basic');
				redSearchQuery.set('searchstr', title);
			}
			redSearchUrl.search = redSearchQuery;
			redA.text = 'Lookup on RED';
			redA.href = redSearchUrl;
			redA.target = '_blank';
			redA.style = 'float: right; color: orange !important; margin-left: 10px;';
			a.parentNode.append(redA);
		});
	}
} else if (document.location.hostname.includes('filecrypt.')) {
	if (document.location.pathname.toLowerCase().startsWith('/container/')) parseFcDoc(document, document.URL);
	else if (document.location.pathname.toLowerCase().startsWith('/link/')) {
		function findDlLink() {
			var a = document.querySelector('a#downloadLink');
			if (a != null) a.click(); else setTimeout(findDlLink, 100);
		}
		//findDlLink();
	}
}

function parseFcDoc(dom, location) {
	return new Promise(function(resolve, reject) {
		dom.querySelectorAll('div.container > table > tbody > tr > td.status > i.online').forEach(function(node) {
			node = node.parentNode.parentNode;
			let title = node.querySelector(':scope > td[title]');
			if (title == null || !/\b(?:FLAC)\b/i.test(title.textContent)) return;
			let button = node.querySelector('button.download[onclick]');
			if (button == null || !/\b(?:openLink)\(\s*'(\S+?)'\s*,\s*this\)/.test(button.outerHTML)) return;
			resolve(document.location = new URL(location).origin + '/Link/' + escape(RegExp.$1) + '.html');
		});
		reject('No FLAC here');
	});
}
