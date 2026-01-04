// ==UserScript==
// @name         Switch Music Service
// @description  Switch Music Service.
// @author       to
// @namespace    https://github.com/to
// @license      MIT
// @version      0.3
//
// @match        https://open.spotify.com/*
// @match        https://music.amazon.co.jp/*
// @match        https://music.apple.com/*/album/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=odesli.co
// @connect      song.link
//
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/450217/Switch%20Music%20Service.user.js
// @updateURL https://update.greasyfork.org/scripts/450217/Switch%20Music%20Service.meta.js
// ==/UserScript==


const MARKET = 'JP';
const OPEN_IN_TAB = true;
const LOADING = "[♪...] ";

var destinationPlatform, entitiesPrefix, searchUrl;
if (/apple/.test(location.href)) {
	destinationPlatform = 'spotify';
	entitiesPrefix = 'ITUNES';
	searchUrl = 'https://open.spotify.com/search/';
} else {
	destinationPlatform = 'appleMusic';
	entitiesPrefix = 'SPOTIFY';
	searchUrl = 'https://music.apple.com/jp/search?term=';
}

document.addEventListener('dblclick', () => {
	document.title = LOADING + document.title;

	GM_xmlhttpRequest({
		url: `https://api.song.link/v1-alpha.1/links?userCountry=${MARKET}&url=${encodeURIComponent(location.href)}`,
		onload: (r) => {
			document.title = document.title.slice(LOADING.length);

			r = JSON.parse(r.responseText);
			console.log(r);

			// 別サービスのページが見つかったか？
			let url;
			if (destinationPlatform in r.linksByPlatform) {
				url = r.linksByPlatform[destinationPlatform].url;
			} else {
				// 曲情報を探す
				for (let key in r.entitiesByUniqueId) {
					if (key.indexOf(entitiesPrefix) == 0) {
						let entities = r.entitiesByUniqueId[key];
						url = searchUrl + encodeURIComponent(
							(entities.artistName + ' ' + entities.title).replaceAll(/[&()\[\]{}-]/g, ' '));
						break;
					}
				}
			}
			OPEN_IN_TAB ?
				GM_openInTab(url) :
				(location.href = url);
		}
	});
}, true);