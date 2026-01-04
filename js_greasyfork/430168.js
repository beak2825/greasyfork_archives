// ==UserScript==
// @name         [GMT] Artist Aliases Manager
// @namespace    https://greasyfork.org/users/321857-anakunda
// @version      1.12.02
// @match        https://*/artist.php?action=edit&artistid=*
// @match        https://*/artist.php?id=*
// @description  Easily manage artist profiles on Gazelle music tracker
// @run-at       document-end
// @author       Anakunda
// @copyright    2021-22, Anakunda (https://greasyfork.org/users/321857-anakunda)
// @license      GPL-3.0-or-later
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @connect      discogs.com
// @connect      musicbrainz.org
// @connect      music.apple.com
// @connect      beatport.com
// @connect      beatsource.com
// @connect      soundcloud.com
// @connect      sndcdn.com
// @connect      shazam.com
// @connect      music.163.com
// @connect      music.metason.net
// @connect      rateyourmusic.com
// @resource     warn-icon https://ptpimg.me/j6h3f9.png
// @resource     warn-icon2 https://ptpimg.me/n02s9v.png
// @resource     warn-icon3 https://ptpimg.me/3cgtm0.png
// @resource     error-icon https://ptpimg.me/6m14lf.png
// @resource     link-icon https://ptpimg.me/4o67uu.png
// @resource     link-icon2 https://ptpimg.me/37m1xv.png
// @resource     input-clear-button https://ptpimg.me/8u0nt2.png
// @resource     mb_logo https://upload.wikimedia.org/wikipedia/commons/9/9e/MusicBrainz_Logo_%282016%29.svg
// @resource     mb_icon https://upload.wikimedia.org/wikipedia/commons/9/9a/MusicBrainz_Logo_Icon_%282016%29.svg
// @resource     dc_icon https://upload.wikimedia.org/wikipedia/commons/6/69/Discogs_record_icon.svg
// @require      https://openuserjs.org/src/libs/Anakunda/Requests.min.js
// @require      https://openuserjs.org/src/libs/Anakunda/libLocks.min.js
// @require      https://openuserjs.org/src/libs/Anakunda/gazelleApiLib.min.js
// @require      https://openuserjs.org/src/libs/Anakunda/QobuzLib.min.js
// @require      https://openuserjs.org/src/libs/Anakunda/GazelleTagManager.min.js
// @require      https://openuserjs.org/src/libs/Anakunda/libStringDistance.min.js
// @require      https://openuserjs.org/src/libs/Anakunda/libCtxtMenu.min.js
// @downloadURL https://update.greasyfork.org/scripts/430168/%5BGMT%5D%20Artist%20Aliases%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/430168/%5BGMT%5D%20Artist%20Aliases%20Manager.meta.js
// ==/UserScript==

'use strict';

let userAuth = document.body.querySelector('input[name="auth"]');
if (userAuth != null) userAuth = userAuth.value; else throw 'User auth could not be located';
const urlParams = new URLSearchParams(document.location.search),
			action = urlParams.get('action'),
			artistEdit = Boolean(action) && action.toLowerCase() == 'edit',
			artistId = parseInt(urlParams.get('artistid') || urlParams.get('id')),
			isFirefox = /\b(?:Firefox)\b/.test(navigator.userAgent) || Boolean(window.InstallTrigger);
if (!(artistId > 0)) throw 'Assertion failed: could not extract artist id';
let userId = document.body.querySelector('li#nav_userinfo > a.username');
if (userId != null) {
	userId = new URLSearchParams(userId.search);
	userId = parseInt(userId.get('id')) || null;
}
const isRED = document.location.hostname == 'redacted.sh';
function hasStyleSheet(name) {
	if (name) name = name.toLowerCase(); else throw 'Invalid argument';
	const hrefRx = new RegExp('\\/' + name + '\\b', 'i');
	if (document.styleSheets) for (let styleSheet of document.styleSheets)
		if (styleSheet.title && styleSheet.title.toLowerCase() == name) return true;
			else if (styleSheet.href && hrefRx.test(styleSheet.href)) return true;
	return false;
}
const isLightTheme = ['postmod', 'shiro', 'layer_cake', 'proton', 'red_light', '2iUn3'].some(hasStyleSheet);
if (isLightTheme) console.log('Light Gazelle theme detected');
const isDarkTheme = ['kuro', 'minimal', 'red_dark', 'Vinyl'].some(hasStyleSheet);
if (isDarkTheme) console.log('Dark Gazelle theme detected');
const createElements = (...tagNames) => tagNames.map(Document.prototype.createElement.bind(document));
let siteBlacklist = GM_getValue('site_blacklist');
if (siteBlacklist == undefined) GM_setValue('site_blacklist', [
	'www.myspace.com', 'myspace.com',
	'www.facebook.com', 'm.facebook.com', 'facebook.com',
	'www.twitter.com', 'twitter.com',
	'www.instagram.com', 'instagram.com',
	'www.vk.com', 'vk.com',
]);

const siteArtistsNameCache = { }, siteArtistsIdCache = new Map, artistlessGroups = new Set;

const imageHostHelper = 'imageHostHelper' in unsafeWindow ? unsafeWindow.imageHostHelper ? Promise.resolve(unsafeWindow.imageHostHelper)
		: Promise.reject('Assertion failed: void unsafeWindow.imageHostHelper') : new Promise(function(resolve, reject) {
	function listener(evt) {
		clearTimeout(timeout);
		unsafeWindow.removeEventListener('imageHostHelper', listener);
		if (evt.data) resolve(evt.data); else if (unsafeWindow.imageHostHelper) resolve(unsafeWindow.imageHostHelper);
			else reject('Assertion failed: void unsafeWindow.imageHostHelper');
	}

	unsafeWindow.addEventListener('imageHostHelper', listener);
	const timeout = setTimeout(function() {
		unsafeWindow.removeEventListener('imageHostHelper', listener);
		reject('Timeout reached');
	}, 15000);
});

function decodeHTML(html) {
	const textArea = document.createElement("TEXTAREA");
	textArea.innerHTML = html;
	return textArea.value;
}
function decodeArtistTitles(artist) {
	if (!artist) throw 'Invalid argument';
	if (artist.titlesDecoded) return;
	//const label = `Decode release titles for ${artist.id}`;
	//console.time(label);
	if (/*!isRED && */Array.isArray(artist.torrentgroup)) for (let torrentGroup of artist.torrentgroup)
		if (torrentGroup.groupName) torrentGroup.groupName = decodeHTML(torrentGroup.groupName);
	if (/*!isRED && */Array.isArray(artist.requests)) for (let request of artist.requests)
		if (request.title) request.title = decodeHTML(request.title);
	//console.timeEnd(label);
	artist.titlesDecoded = true;
}

const findArtistId = artistName => artistName ?
		LocalXHR.head('/artist.php?artistname=' + encodeURIComponent(artistName)).then(function({responseURL}) {
	const url = new URL(responseURL);
	return url.pathname == '/artist.php' && parseInt(url.searchParams.get('id')) || Promise.reject('not found');
}) : Promise.reject('Invalid argument');

function getSiteArtist(artistNameOrId, decodeTitles = false) {
	if (artistNameOrId && typeof artistNameOrId == 'string') {
		if (artistNameOrId > 0) console.trace('[AAM] Warning: possible call of getSiteArtist(…) with stringified artist id', artistNameOrId);
		const artistNameCaseless = artistNameOrId.toLowerCase();
		const cacheKey = Object.keys(siteArtistsNameCache).find(key => key.toLowerCase() == artistNameCaseless);
		var promise = cacheKey ? Promise.resolve(siteArtistsNameCache[cacheKey])
				: queryAjaxAPICached('artist', { artistname: artistNameOrId }).then(function(artist) {
			if (artist.name == artistNameOrId/* || artist.name.toLowerCase() == artistNameCaseless*/) {
				siteArtistsIdCache.set(artist.id, siteArtistsNameCache[artistNameOrId] = artist);
				return artist;
			} else return findArtistId(artistNameOrId).then(function(artistId) {
				if (artistId == artist.id) {
					siteArtistsNameCache[artistNameOrId] = siteArtistsNameCache[artist.name] = artist;
					siteArtistsIdCache.set(artist.id, artist);
					return artist;
				} else if (siteArtistsIdCache.has(artistId)) return siteArtistsIdCache.get(artistId);
				return queryAjaxAPICached('artist', { id: artistId }).then(function(artist) {
					siteArtistsNameCache[artistNameOrId] = siteArtistsNameCache[artist.name] = artist;
					siteArtistsIdCache.set(artist.id, artist);
					return artist;
				});
			});
		}/*, reason => reason == 'not found' && artistNameOrId > 0 ?
				queryAjaxAPICached('artist', { id: parseInt(artistNameOrId) }).then(function(artist) {
			siteArtistsIdCache.set(artist.id, siteArtistsNameCache[artist.name] = artist);
			return artist;
		}) : Promise.reject(reason)*/);
	} else if (artistNameOrId > 0) promise = siteArtistsIdCache.has(artistNameOrId) ? Promise.resolve(siteArtistsIdCache.get(artistNameOrId))
			: queryAjaxAPICached('artist', { id: artistNameOrId }).then(function(artist) {
		siteArtistsIdCache.set(artist.id, siteArtistsNameCache[artist.name] = artist);
		return artist;
	}); else return Promise.reject('Invalid argument');
	return decodeTitles ? promise.then(function(artist) {
		decodeArtistTitles(artist);
		return artist;
	}) : promise;
}

function loadArtist() {
	const rlsCount = artist => artist && Array.isArray(artist.torrentgroup) ?
		artist.torrentgroup.map(tg => tg.groupId).filter((e, n, a) => a.indexOf(e) == n).length : 0;
	function getWhateverList(artist) {
		if (artist) decodeArtistTitles(artist); else return null // assertion failed!
		if (Array.isArray(artist.torrentgroup) && artist.torrentgroup.length > 0) return artist.torrentgroup;
		if (Array.isArray(artist.requests) && artist.requests.length > 0) return artist.requests.map(request => ({
			groupId: -request.requestId,
			groupName: request.title,
			groupYear: request.year,
			releaseType: request.releaseType,
		}));
		return null;
	}

	return getSiteArtist(artistId).then(function(artist) {
		const tagsExclusions = tag => !/^(?:freely\.available|staff\.picks|delete\.this\.tag|\d{4}s)$/i.test(tag);
		if (artist.tags) artist.tags = new TagManager(...artist.tags.map(tag => tag.name).filter(tagsExclusions));
		if (Array.isArray(artist.torrentgroup)) console.assert(rlsCount(artist) == artist.statistics.numGroups,
			'Unexpected group counts:', rlsCount(artist), artist.statistics.numGroups, artist.torrentgroup.length);
		const resolveUrl = url => GlobalXHR.head(url, { anonymous: true }).then(({finalUrl}) => finalUrl);
		const isPseudoArtist = name => /^(?:Various Artists|VA|Unknown(?: Artist(?:\(s\)|s)?)?|Traditional)$/i.test(name);
		const rxGenericName = /^(?:(?:(?:And|With|Mit|\&)\s+)?(?:(?:The|His|Her|Su[ae]?|La|Les?|Los|(:Sein|Ihr)(:e[mn]|er)?|Der|Die|Das)\s+)?(?:(?:(?:Philharmonic|Symphonic)\s+)?Orch(?:est(?:ra|er|re)|\.?)|Orq(?:uest(?:r?a)?|\.)(?:\s+(?:Sinfónica))?|Ork(?:est(?:er)?|\.)|Оркестр|Ensemble|(?:(?:Big|Brass)\s+)?Band|All[\s\-]Stars|Soloists|Chorus(?:es)?|Choi?r|Choeurs|Chœurs|Coros?|Kórus|Choeur|Chœur|Koor|Хор|Friends|Trio|Quartet(?:te)?|Quintet(?:te?)?|Sextet(?:te?)?|Septet(?:te?)?|Octet(?:te?)?|Nonet(?:te?)?|Tentet(?:te?)?|Symphony)(?:\s+(?:Members))?|(?:Feat(?:\.?|uring)|Ft\.))$/i;
		const rdExtractor = /\(\s*writes\s+redirect\s+to\s+(\d+)\s*\)/i;
		const uniqueValuesFilter = (elem, index, array) => elem && array.indexOf(elem) == index;
		const beeps = GM_getValue('silent', false) ? null : [
			'wav:UklGRocFAABXQVZFZm10IBAAAAABAAEAESsAABErAAABAAgAZGF0YWMFAACAgH+GkZWTjYd5Z2BjanN+i5acmJKMgXpzcnR2dHFxd36JkZqfmIh2bWlpbHF5foGFi5GXl5CEeXFsa29ydnyCiY6VmZeMgHVta2xuc3d+g4qQlpmViYBzbWttcHR5f4aLkZeZkoZ5cWxrbXF2en+IjZOYmI+Cdm9tbG5zd3uCiY+VmZiMgHRta2xvc3h+g4uRlpmUiX1zbWtscHR5f4WLkZiYjYBzZ2Frf5eNbWZvf5itsZhzX2JreYuVgGpqc3+WqKuMbWBkcH+SmIBqanODlaSkhmpiZ3OGlZiAampzf5Khn4BnY2x5iZiYgGlocn+OnpqAZ2dwfoudmIBnZ3J/jp6YgGdocn+OnpmAZ2lzf5CemXpnaXN/kp6Zdmdqc3+SnpJ2Z2pzf5KfknNnanN/kp+Sc2dqdoWVn5BzZ2t2hpWfjXJma3aGlZ+NcWVrdoaWn4xqY2ZwfIuYjoCDhoOAhIl0YWFzhZ6vrYthVFtngJaikYGBfXl9hYl0Ymd2i6Cwp4BbVV5ugJijkoJ9dnR5iIl0ZGt9kKKsnXRXVmJ0iJ+ikYF4cnJ7iYh0Z3CAk6Wnl25XWmZ2iqGikYB0bXF9ioR0a3SEl6Khi2lXXGl8k6ahi3tsanKAjoVyb3qJmZ6YgGFZXm+AlamhinVqaXKAj4Rycn2NmJmVgF9bZXOImqqggmxlaXWEkIJ1dYCQlJSMdV9dZ3eKn6qagGhjaneJkYN1eoSPkJCKcWBgan2So6mUdWRka3uMkoJ4fYaLi42EcF9kcYCUp6eKa2Bkb4COkoJ5gIeIiIqCbGFndYeYp6KAZl9mcYGTk4J9gYaDg4eAbGZseombppiAZGNqdYCPjoWEh4WAfoB4bW12gI2Zn412aGhsdoGLi4mKiYF5eXl2c3V9hpCXk4R0bmxzeYCIjI2OiYB2c3R1eX2DipGSiXxzcXJ2e4CFjJKQhXxzcnN2e4CIjJCOg3lzcXR5fYKIjpKMgHdycnR5foSKj5GJgHVyc3V7gIaLkJGIe3RydHd8gIeMkI+EeXNydHh9gYiNkIyBd3JzdXl9hImNkYqAd3Nzd3p+hYmPj4h9dXFycXOAl5SAfYCFioBoa3eJl5CAe36EjIBpbnyLmYt6eX6Gi4Bsb3yMloh5eX6GjoBtcX6MlIR1d36JjntudICPk4BzdoCKjntwdoCPkYBwdoCNj3hwdoCNjnhwd4COjXlweIKNjXlxeIKOjXhyeYKOjnVyeIWQinVyeYSQinVyeYSQiHVye4aRhnRze4aRhXR0e4aRhXN0fIWRhXN0fIaPgnN0fIiQgnN1fImQgnN1fIWMgGxygJOZhW1qc4CNgn6DhYeGc2xzgJKZjHNudoGJgHiAi5CJc2pygI+ViXt2eICDd3WAi5aLdGpxfYuPg4B+foKAdHF9i5eQeGtxfYiKgICFhIaAbm96iJWUgHBye4eFeX2FjIuBbG53hZORgHd2fIWAdXqFj5KAbG13g4+KgH59gYN7cneDj5SFcG52gIyFfoKEg4N5cHWAjpSKdXJ1gIeAe4CJioZ1bnR+iZKHe3Z6gIV6d3+JkIl2b3R9iYyFf319gYJ2dXyIko55b3N6hYmAgIODhIBzc3uFkZCAc3R7hYR8fYSIiYBzc3mDjoyAeHh8g4B4fIOMjYBxcneBi4iAfn1+gn51eoCLkIRzcniAiYN+goKDg3x0eICJkIh5dHiAhoB7gIaHhXlzdn+HjYd8eXmAg3t5f4eLh3hzdn6GioSAfX2AgXp3foSNinx0dnuFh4CAgYGDgHd2fISMi4B2eH2Cgn1/goSFgHZ2fIKJiYJ7enyAgHx+goiHgHd3e3+GhA==',
			'opus:T2dnUwACAAAAAAAAAAB/TwAAAAAAABwLA3kBE09wdXNIZWFkAQE4ARErAAAAAABPZ2dTAAAAAAAAAAAAAH9PAAABAAAA6w6WBAP///5PcHVzVGFnczYAAABsaWJvcHVzIDEuMy4xLTQtZ2FkOGZlOTBkLCBsaWJvcHVzZW5jIDAuMi4xLTItZzljYjE3YzYCAAAALgAAAEVOQ09ERVI9b3B1c2VuYyBmcm9tIG9wdXMtdG9vbHMgMC4yLTQtZzJlNjJhN2MrAAAARU5DT0RFUl9PUFRJT05TPS0tYml0cmF0ZSAzMiAtLWRvd25taXgtbW9ubwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE9nZ1MABLUxAAAAAAAAf08AAAIAAADXflecDkheV0g2Mi4uKy0uKygteILiMwIrAY/bv0R9jcojsvjhnkozUVkz3ScQZYRMCyb1vZQ8vCicHCzxIVBPWN9Xy+/6i5AbC3+w9nW3PmOZ1W4qk1QJrhoOeJ4eYAhuu2iyC64ItqZsxLud6cuQcECaMEb9IdIYaqgXkbiJVxkDWdTekNX6UujXxWZkGFCOLrKYQMiK3Y38Tx3G80SUnuGoNDpKVrdgapw0k5lTOIyfoZC7CO4fPHiHGyYDMM8MAEtoRoJVelDUZP00OoVNW8Ew6ZtdxSy1FlCgr+Jr/n/5CXDrF7HzXSvONCmJbx1YKtZvny/6/+TsPZJ/LrfhADMig4WHlMQl/Ggf4P5ESHiGntNcx3EsCLUtbw2Ew3Opi/HbumnjnFwqqub4bksy6iK6byfihWpJQaSDCUU/fYeXMqvQKFzX5sh5M35t3HCFgO6HXchfAniGIaCjunrjSVhjwBTvBUKowNxOqLFOeyEqTJbrhI4fkYbd5cCZj7zVCfid/mno5wCp2O9vTHgLcST2h0puEcxvXF/dcNv9GeCAWJQ213EUR7hvv+CBjCDv2q1HSCGThPN7mWz75ZRVaApzPJtJEo24USmWsmy8PSuf5S25FJH+3vo0QNCD6fU33babXMYQ2v7rwbIbCGgKcCEIamIkVwdMuAw7oOdHNcaBXxcF0QxMuBfJZhduaRXypWZ3e2zIk0cnpi5oCosl4ediUdxARMQPCPiBq0br5f023i9FH3b382VJwuhHlxoFqagHI2anaApwIRxLENIcKaN/op5L7JqW9/sZbYuu4E+g0HhJNPLmnI9mi3hVAxPwExMPaApmMyo+zugmo47SQNECI2kpmCwlVZsKE37MH3VZPVVhu2631PlPFQDSbLa29mgJimspfXXxwgDWTJLN5GQw9D7MAHGHPcA74le01sCZ+dWWShKFZDnte1BoCZRfvgFeMiMStT1BF/wLHEG4cWzH3aMVyGsKNiaP4wzP8Q377lh+aAlJk8kyMT8ps9RvbPt4LkyB25McGVz3BkkYK4xvTZ/mqS13QEiPJqWlT5ni',
			'opus:T2dnUwACAAAAAAAAAABEGwAAAAAAAHgup6wBE09wdXNIZWFkAQE4ARErAAAAAABPZ2dTAAAAAAAAAAAAAEQbAAABAAAAXcpB1AP///5PcHVzVGFnczYAAABsaWJvcHVzIDEuMy4xLTQtZ2FkOGZlOTBkLCBsaWJvcHVzZW5jIDAuMi4xLTItZzljYjE3YzYCAAAALgAAAEVOQ09ERVI9b3B1c2VuYyBmcm9tIG9wdXMtdG9vbHMgMC4yLTQtZzJlNjJhN2MrAAAARU5DT0RFUl9PUFRJT05TPS0tYml0cmF0ZSAzMiAtLWRvd25taXgtbW9ubwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE9nZ1MABAg8AAAAAAAARBsAAAIAAADB4LkaEaRfXldTUVBNR0g9Ojk4NkoD+H9l0q9ZhxtufbbVvbzYuurcHj33+R9ACPxTL0Gmrvx5DkickyYrR1R12v+auQgzHrBANe5Q0cFOboQZ8zKdOr7tzdmfHS+yVvewlOapM4K+wG1H2ZoOOL3IGe1/nyyLUHcMhOc7GU98O9+vfhqmMy9bpDuIfoPy4vgKlzQPnrbT71GAIKodGt4faEZHTLzuZLzOgkeGMwFYkbNWEd44c+o5y2/4YHwZwmEuLH3zltxbmO8qFb5med8AScSCB3AAbDhVlkZ9vTVSB2UBEHIQ/vihf2FRCpC8oFOjlUW1VF5nzMWmklyRA+n/pVIyq3UPNIf8k7txNFPxkzy61KHhmPq3aPhe3ScssYXAxMd4G6X23uehXtLw0UHLqlHgJ4l6PhXpOXjjVME9/C7YP6gzbFrgJHkYwGrpiUJfVUgFencr3Pr/Shlg5e2TSOfrRilaqOEO03YD+4q3OgLZdrhF1eb4XtyOYDnQvC5gSl2ieOqfm8FDTCWdmt/vyYpWNCKzvNNzpbxakyYaxqz0d1XYpabOjAa8yZwZiVdVuE1phWTX7rmB2SxvyBXDYQiePD3QJQSLUDzEyTX4XtyNEC1ot1icS5cIbc8UVZDOU0OPIdA5XY5o2vd6xAXGKnmp3WPfByYItXnzlHBTzPxMc33C25Kg+UFRAQ6foVGPBnuYLxowZyrILt9CAaW40PhgaVctBQa1ctq5bS0fjk2C0+2VLb8fxEBseRg6p6qlqYB9Y8fgvsJjTp8Q5pF3BYK//81gs9FFOtCwkkxsDN6v5IFazSO6/CHUC/LqRJumZ9hgeJP8zODDYo1VAuMD0+fyzSlfXmaGYPYw6WjQMIvzVg0JWJuNhTwAawAGSRhcMsTms7pKKDVMTLs+IolXy+/QjOKpJq6TixRnJ1438RRZ2GE1kvVTFX1zaOa8kR+SZHj1qOxnBbzgt0H+jCvkZqP5JG2JVH5RnNhpBFkhXm2zm7MsDOXZkSv+YVnsUA60ABZxp18tDNbNgWo3q5/YYReHRU1SK8zAZtsF/piti3kMXCjwBqlPX/E3eYI5WZGH5lPTiZjOCeYzo0/DGHhXw78z6AduprZaJ/MYKASzOzx7yToXgNhhNC6LkZ7jkoCEj13XdwSarqmd+NjsuS7vVqMGXh775lbTkMqQMKup4k868WH1SMa3hQ5fQ7FkGvIJzb1vOM1f+w9nAAOZ6NhhNC6KfgStJ1DvMrJKRMg1JO9DCLaX3cgXYh3GFsXHE6rQpZ5lbpLVNY435SMPNDK/vwwUQ0QEKcwzg+jYYYq7anzph0+u/gtDs1wznh03w8wOdWgH6W3LtMeI0Pr53TrHV9tqbHZ7UWtjhsqnJZ/xd+dO746b2GEfD3ED+3yVFznPV3iRjr33f52HmzYwW96vcZmo+pjzXqWMSmbsd4yGgQboFIngGEv6b2wev31o2G/FAPtdZHjwm745qUZzsKXu0J5uWvFMFxotTI7iD6iqHFQ/ZFiRTQtrvkbBA1yEnBgwm63X5ArYYYmluKcMzpJbMQQzmucwUCZ7mET1Sqsh43AoxJi306Loe1qvsbrH30GRV3q45scFKPvTThbYYTXiNj7m8bVx6QL1GgkSKBqnY7Cntc4XV7FQTDsdErzfW/cSn732mNnhxmS8qkBbj/k/s0ZWKJVd1vT53Jadtzc3b085oHvwKtj//g==',
			'opus:T2dnUwACAAAAAAAAAAAEfQAAAAAAAK6QrVkBE09wdXNIZWFkAQE4ARErAAAAAABPZ2dTAAAAAAAAAAAAAAR9AAABAAAAOgLRhQP///5PcHVzVGFnczYAAABsaWJvcHVzIDEuMy4xLTQtZ2FkOGZlOTBkLCBsaWJvcHVzZW5jIDAuMi4xLTItZzljYjE3YzYCAAAALgAAAEVOQ09ERVI9b3B1c2VuYyBmcm9tIG9wdXMtdG9vbHMgMC4yLTQtZzJlNjJhN2MrAAAARU5DT0RFUl9PUFRJT05TPS0tYml0cmF0ZSAzMiAtLWRvd25taXgtbW9ubwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE9nZ1MABFg0AAAAAAAABH0AAAIAAADaQo7YDkFPYkk5PDMwLS0sKioseIObGRKE14yXVT1SltkZCatYWr4yvQ2mC9V5BbypTFx9xHc4ZMarp9LMcXNPIqD9TNpURo4n/hshpNtox3Ppxyx4jEBBogFSyD1P4A+qJjslqP5O2n0LT3DOy1FU09kgL0XOLBSPOMTkprd1dCWvxl5T7NsMBqyeOjoEgE5pCx2pTovO2k4EWtS/O1MvTOH2eIc8rI76NwwizmULMbxtJNoo3wdf/B9AQndgV+pMA/uhyNGw9lGc+y1rQRYl6pEWv8Edt2VVo0/yxggUp+GsLmLW9Oo5BeBbZKD/ved4KKFO7uFnT93hqwV5ngl15jVg6cZ4hnhGdzdgWUmZ3yoHdNX5rJJGzyz2/1Q5Qi745a/GPZAKY955gsiZ2YytZKGxVrJ5YzDOANCMjVO4Av+ni+las6eLqD3irOWweIYg8hyUv8ULOLKmYpwYV+uZ0Hoips75T3vYFg/lFHD4S8e26hiJAGA8M+yHlmtRC/Se/f84r21VeAtNBVsCAj6sKf3OaEX1NdPSvMvfFJmvxs1XpFxElllGgNa2ONbApNwsm3O6kjwaOjnW2D19O68E494qaAqA2DmGZ0oQ2yaqw7Cw3gqUf+1L6RP/VQMMKxwq6zXmNh6mehMVhYFq9RQ2ZcYZjqJYaApw57uoWQoIxmXyT52+dDPhkBeuMdxkE1TlRb1G9oRT+XMlvELwk0IWCffNGtGcaAqA2AMpTmqbeSRiBPhPDcfcHCXmKOghXHKM6UDMcUnOUY2ydv7c4Nkb0yvnaApmayYEAgzpMuCoLgB6Zq8xetrPOIc1/LxAgfqhiZPR0W0J739KPvIGPRVFaAmPcbVPChGgjeEs1Fky5FcQd4Gzf1lX7WofEq7VXAYAT7RD3ig6Ko6cnvRoCZRkY9WC3qKmaL9g586L/8N5dxpPcccsPEucsT2YJe9LoeCr9/OchVloCZVlgvO7Y1g2/jIb8oNE2atoMzMQNSYuoNDt+PAfq4FpQ6BwMu8PWeVoCZRkMoaQLVX/p1KLjyP3Bcx9DquMQCcpR3PVRDlgG2I4e2jjsbFIXRPeSw==',
			'wav:UklGRggCAABXQVZFZm10IBAAAAABAAEA+CoAAPgqAAABAAgAZGF0YeQBAACAgIB/f3+Af35/f35+fn5+f3x0dHqDjZSeoaGZj4V1aF9XV11qeoaWoaWjmZB7bWNcXWR3iZOho6GSgnRjXl9reYaZoaGXin5sY2FpdoKTnJ+ZjYJvZmRocnyNl5qWjYNza2hrdH2Kk5WSioR2b21wd36JkJKQioR5cnBxd3yHjY+NiYB5dXN1eX+FiYyLiIF7eXZ3eoCFiIqJh4N+end4e3+DhomJh4R/fnp5enyAgoaIh4WDgH17enx+f4ODhYaEgn9+e3t7fX+Cg4SFg4KAfX17e31+f4KEhISCgX9+fX19fn+BgoOCg4KAgH9/fn+AgIGCgoKBgYGBf39+gH5/gIGBgYKBgYCBgH9+f3+AgIGBgYGBgYCAfn5+f4CAgYKCg4KBf39/fn+AgIGBgoKBgYB/fn5+gIGCgYKCgYCBf3+Af4CAgoGCgYCAf39+f3+BgYCBgYGBf4B/gICAf4GBgYGAgICAgH9/gYGCgYGBgYGBf39/f3+BgYGCgYGAgYGAgICAgYCBgYGAgYCBgICAgYGBgYKBgYCAgH9/f4CBgYKBgYGBgIB/gICAgIGBgoGBgYB/f4CAf4CBgYGBgYCAgIGAgYGAgYGAgYGAgICAf4CBgYGBgoGBgIGAgICAgYGBgX+A',
			'wav:UklGRroCAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YZYCAAABADoAtgESBecJdQ7mEAIO3QM48xbjM+BO3Wrahtf52ADyBQ00Jnooeih6KHooeijTFPP58t+G14bXhteG14bXieQE/6IZeih5KHooeih5KNEhBwgN7YXXh9eH14bXhdcp2ArxDQxhJXkoeih6KHooeijDFe760+CF14bXhteG14bXo+MJ/rYYeih6KHooeih7KK0i/ggB7oXXhteF14XXhteG1xTwGAuHJHkoeih5KHooeiiwFuf7tOGG14bXhteG14XXveIQ/csXeih6KHooeih7KIYj9wn17obXhteG14XXhteG1yDvHgqyI3koeih5KHooeiifF+L8mOKG14XXhteG14bX2eEU/NoWeih6KHooeih5KGAk7Qrn74bXh9eH14bXhteG1yzuKAnVInooeih6KHkoeiiJGN39feOF14bXhdeF14fX+OAc++8VeSh6KHooeih6KDcl5Qvd8AXYhteG14bXhteG1zvtLwj7IXooeih5KHsoeih1Gdn+YOSG14fXhteG14bXGOAh+vwUeih5KHkoeih6KAwm2gzR8dLYhteG14bXhdeH10jsOgcdIXooeih6KHooeiheGtP/SeWF14bXhteG14bXOt8o+Q8Ueih5KHooeSh6KOIm0A3K8qbZhteG14bXh9eF11jrPgY8IHkoeih6KHooeShJG88AMeaG14XXhteG14bXW94v+B0TeSh6KHooeih6KLInxA6+83vahdeG14bXh9eF12fqRgVcH6Yn0yYAJi0lWSS7GIkBLOv13sjfnOBw4UPiWOfn+TsMbhqbGcgY9BchF00WWAg++gnuAO3T7afueu9O8Lj3bAHfCGQMkQu9CuoJ6wY5Az8AVP6C/ZL9Kv7p/oj/4//+/w==',
		].map(sound => (sound = sound.split(':')).length >= 2 ? new Audio(`data:audio/${sound[0].toLowerCase()};base64,${sound[1]}`) : null).filter(Boolean);
		let activeElement = null;

		String.prototype.toASCII = function() {
			return this.normalize("NFKD").replace(/[\x00-\x1F\u0300-\u036F]/gu, '');
		};

		function getAlias(elem) {
			if (!(elem instanceof HTMLElement)) throw 'Invalid argument';
			while (elem.tagName != 'LI' && elem.parentNode != null) elem = elem.parentNode;
			if (elem.tagName != 'LI') return null; else if (elem.alias && typeof elem.alias == 'object') return elem.alias;
			const alias = {
				id: elem.querySelector(':scope > span:nth-of-type(1)'),
				name: elem.querySelector(':scope > span:nth-of-type(2)'),
				redirectId: rdExtractor.exec(elem.textContent),
			};
			if (alias.id == null || alias.name == null || !((alias.id = parseInt(alias.id.textContent)) > 0)
				|| !(alias.name = alias.name.textContent)) return null;
			if (alias.redirectId == null || !((alias.redirectId = parseInt(alias.redirectId[1])) > 0))
				delete alias.redirectId;
			return alias;
		}

		const resolveArtistId = (artistIdOrName = artist.id) => typeof artistIdOrName == 'string' ?
			findArtistId(artistIdOrName) : artistIdOrName > 0 ? Promise.resolve(parseInt(artistIdOrName))
				: Promise.resolve(artist.id);
		const resloveArtistName = artistIdOrName => artistIdOrName > 0 ? artistIdOrName == artist.id ? artist.name
			: getSiteArtist(artistIdOrName).then(artist => artist.name) : Promise.resolve(artistIdOrName);
		function findAlias(aliasIdOrName, resolveFinalAlias = false, document = window.document) {
			if (!aliasIdOrName) return null; else if (aliasIdOrName > 0 && typeof aliasIdOrName == 'string')
				console.warn('[AAM] Possible bad use of alias id as string:', aliasIdOrName);
			if (typeof aliasIdOrName == 'string') aliasIdOrName = aliasIdOrName.toLowerCase();
				else if (aliasIdOrName > 0) aliasIdOrName = parseInt(aliasIdOrName); else return null;
			let aliases = document.body.querySelector('div#content form.add_form');
			if (aliases != null) aliases = aliases.parentNode.parentNode.querySelectorAll('div.box > div > ul > li');
				else throw 'Invalid page structure (div#content form.add_form)';
			for (let li of aliases) {
				const alias = getAlias(li);
				if (alias && aliasIdOrName == (typeof aliasIdOrName == 'string' ? alias.name.toLowerCase() : alias.id))
					return alias.redirectId > 0 && resolveFinalAlias ? findAlias(alias.redirectId, true, document) : alias;
			}
			return null;
		}
		const findArtistAlias = (aliasIdOrName, artistIdOrName, resolveFinalAlias = false) => (function() {
			if ((!artistIdOrName || artistIdOrName < 0) && artistEdit) return Promise.resolve(window.document);
			return resolveArtistId(artistIdOrName).then(artistId => LocalXHR.get('/artist.php?' + new URLSearchParams({
				action: 'edit',
				artistid: artistId,
			}).toString()));
		})().then(({document}) => findAlias(aliasIdOrName, resolveFinalAlias, document)
			|| Promise.reject('Alias id/name not defined for this artist'));
		const resolveAliasId = (aliasIdOrName, artistIdOrName, resolveFinalAlias = false) =>
			typeof aliasIdOrName == 'string' ? findArtistAlias(aliasIdOrName, artistIdOrName, resolveFinalAlias).then(alias => alias.id)
				: aliasIdOrName >= 0 ? Promise.resolve(parseInt(aliasIdOrName)) : Promise.reject('Invalid argument');

		const addAlias = (name, redirectTo = 0, artistIdOrName) => resolveArtistId(artistIdOrName).then(artistId =>
					resolveAliasId(redirectTo, artistIdOrName && artistId, true).then(redirectTo => LocalXHR.post('/artist.php', new URLSearchParams({
				action: 'add_alias',
				artistid: artistId,
				name: name,
				redirect: redirectTo > 0 ? redirectTo : 0,
				auth: userAuth,
			}), { responseType: null })));
		const deleteAlias = (aliasIdOrName, artistIdOrName) => resolveAliasId(aliasIdOrName, artistIdOrName)
			.then(aliasId => LocalXHR.get('/artist.php?' + new URLSearchParams({
				action: 'delete_alias',
				aliasid: aliasId,
				auth: userAuth,
			}).toString())).then(function({document}) {
				if (!/^\s*(?:Error)\b/.test(document.head.textContent)) return true;
				const box = document.body.querySelector('div#content div.box');
				if (box != null) alert(`Alias "${aliasIdOrName}" deletion failed:\n\n${box.textContent.trim()}`);
				return false;
			});

		const renameArtist = (newName, artistIdOrName = artist.id) => resolveArtistId(artistIdOrName)
			.then(artistId => LocalXHR.post('/artist.php', new URLSearchParams({
				action: 'rename',
				artistid: artistId,
				name: newName,
				auth: userAuth,
			}), { responseType: null }));
		const addSimilarArtist = (relatedIdOrName, artistIdOrName = artist.id) => resolveArtistId(artistIdOrName)
				.then(artistId => resloveArtistName(relatedIdOrName).then(artistName =>
					LocalXHR.post('/artist.php', new URLSearchParams({
			action: 'add_similar',
			artistid: artistId,
			artistname: artistName,
			auth: userAuth,
		}), { responseType: null })));
		const addSimilarArtists = (similarArtists, artistIdOrName = artist.id) => resolveArtistId(artistIdOrName)
			.then(artistId => Promise.all(similarArtists
				.filter((name1, ndx, arr) => name1 && arr.findIndex(name2 => name2 && name2.toLowerCase() == name1.toLowerCase()) == ndx)
				.map(similarArtist => addSimilarArtist(similarArtist, artistIdOrName && artistId || undefined))));
		const changeArtistId = (newArtistIdOrName, artistIdOrName = artist.id) =>
			resolveArtistId(artistIdOrName).then(artistId => resolveArtistId(newArtistIdOrName)
				.then(newArtistId => LocalXHR.post('/artist.php', new URLSearchParams({
					action: 'change_artistid',
					artistid: artistId,
					newartistid: newArtistId,
					confirm: 1,
					auth: userAuth,
				}), { responseType: null })));
		const editArtist = (image = artist.image, body = artist.body, summary, artistIdOrName = artist.id, editNotes) =>
				imageHostHelper.then(ihh => ihh.rehostImageLinks([image], true, false, true).then(ihh.singleImageGetter))
					.catch(reason => image).then(imageUrl => resolveArtistId(artistIdOrName).then(artistId =>
						LocalXHR.post('/artist.php', new URLSearchParams({
			action: 'edit',
			artistid: artistId,
			image: imageUrl || '',
			body: body || '',
			summary: summary || '',
			artisteditnotes: editNotes || '',
			auth: userAuth,
		}), { responseType: null })));

		function addAliasToGroup(groupId, aliasName, importances) {
			if (!(groupId > 0) || !aliasName || !Array.isArray(importances))
				return Promise.resolve('One or more arguments invalid');
			const payLoad = new URLSearchParams({
				action: 'add_alias',
				groupid: groupId,
				auth: userAuth,
			});
			for (let importance of importances) {
				payLoad.append('aliasname[]', aliasName);
				payLoad.append('importance[]', importance);
			}
			return LocalXHR.post('/torrents.php', payLoad, { responseType: null });
		}
		const deleteArtistFromGroup = (groupId, artistIdOrName = artist.id, importances) =>
			groupId > 0 && Array.isArray(importances) ? resolveArtistId(artistIdOrName)
				.then(artistId => Promise.all(importances.map(importance => LocalXHR.get('/torrents.php?' + new URLSearchParams({
					action: 'delete_alias',
					groupid: groupId,
					artistid: artistId,
					importance: importance,
					auth: userAuth,
				}).toString(), { responseType: null })))) : Promise.reject('One or more arguments invalid');

		const bbCodeToHtml = bbCode => bbCode ? queryAjaxAPI('preview', undefined, { body: bbCode })
			: Promise.reject('Invalid argument');
		function gotoArtistPage(artistIdOrName = artist.id) {
			resolveArtistId(artistIdOrName)
				.then(artistId => { document.location.assign('/artist.php?id=' + artistId.toString()) });
		}
		function gotoArtistEditPage(artistIdOrName = artist.id) {
			resolveArtistId(artistIdOrName).then(function(artistId) {
				document.location.assign('/artist.php?' + new URLSearchParams({
					action: 'edit',
					artistid: artistId,
				}).toString() + '#aliases');
			});
		}
		const subscribeArtistComments = (artistIdOrName = artist.id) => resolveArtistId(artistIdOrName).then(artistId =>
				LocalXHR.get('/userhistory.php?' + new URLSearchParams({
			action: 'comments_subscribe',
			page: 'artist',
			pageid: artistId,
			auth: userAuth,
		}).toString(), { responseType: null }));
		const wait = param => new Promise(resolve => { setTimeout(param => { resolve(param) }, 200, param) });

		const maxBatchSize = GM_getValue('max_batch_size', 64); // avoid high server load
		const sameArtistConfidence = Math.max(Math.min(GM_getValue('artist_matching_threshold', 0.90), 1), 0);
		const fuzzyArtistsMatch = (name1, name2) => name1 && name2
			&& jaroWrinkerSimilarity(name1, name2) >= sameArtistConfidence;
		const sameTitleConfidence = Math.max(Math.min(GM_getValue('title_matching_threshold', 0.92), 1), 0);
		const fuzzyTitlesMatch = (title1, title2) => title1 && title2
			&& jaroWrinkerSimilarity(title1, title2) >= sameTitleConfidence;
		const cacheSizeReserve = GM_getValue('cache_size_reserve', 1280);
		const stripRlsSuffix = title => title && [
			/\s+(?:EP|E\.\s?P\.|-\s+(?:EP|E\.\s?P\.|Single|Live))$/i,
			/\s+\((?:EP|E\.\s?P\.|Single|Live)\)$/i, /\s+\[(?:EP|E\.\s?P\.|Single|Live)\]$/i,
			/\s+\((?:.+\s(?:Remix|Mix|RMX|Edit)|(?:feat\.|ft\.|featuring\s).+)\)$/i,
			/\s+\[(?:.+\s(?:Remix|Mix|RMX|Edit)|(?:feat\.|ft\.|featuring\s).+)\]$/i,
		].reduce((title, rx) => title.replace(rx, ''), title.trim());
		const strictRlsYearMatching = GM_getValue('strict_release_year_matching', false),
					strongEqualReleaseDate = GM_getValue('strong_equal_release_date', false);
		const minMatchDivisor = GM_getValue('min_match_divisor', 25);

		function titleCmpNorm(title) {
			if (!title || !(title = stripRlsSuffix(title))) return '';
			let result = (title).replace(/[^\w\u0080-\uFFFF]+/gu, '');
			if (result.length <= 0) result = title.replace(/\s+/g, '');
			return result.toLowerCase();
		}
		const bilingualNameParsers = [
			/^([^\u0300-\uFFFF\(\)]+?)\s*\(\s*([^A-Za-z\xC0-\xFF\(\)]+?)\s*\)$/u,
			/^([^A-Za-z\xC0-\xFF\(\)]+?)\s*\(\s*([^\u0300-\uFFFF\(\)]+?)\s*\)$/u,
		];
		const nonLatinCmpNorm = title => title && (title = stripRlsSuffix(title)) ?
			(title.replace(/[\u0000-\u02FF\s]+/gu, '') || title).toLowerCase() : '';
		function bilingualNamesMatch(...titles) {
			if (titles.length < 2 || !titles.every(Boolean)) return false;
			const normalizers = [titleCmpNorm, nonLatinCmpNorm];
			const parsed = titles.map(title => bilingualNameParsers.map(function(rx, index) {
				const components = rx.exec(title);
				return components && [normalizers[index](components[1]), normalizers[1 - index](components[2])];
			}));
			if (!parsed.some(methods => methods.some(Boolean))) return false;
			titles = titles.map(title => normalizers.map(normalizer => normalizer(title)));
			/*const match = */return parsed.some((methods1, ndx1) => parsed.some((methods2, ndx2) =>
				ndx1 != ndx2 && methods1.some((method1, ndx1) => method1 != null && (methods2.some(Boolean) ?
					methods2.some((method2, ndx2) => method2 != null
				&& /*method1[ndx1] == method2[ndx2] && */method1[1 - ndx1] == method2[1 - ndx2])
					: method1[ndx1] == titles[ndx2][0] || method1[1 - ndx1] == titles[ndx2][1]))));
			// if (match) console.log('[AAM] Bilingual names match:', arguments);
			// return match;
		}

		const aamCacheEntries = [
			'dcEntriesCache', 'dcArtistReleasesCache',
				'dcMasterYears', 'dcMasterTitles', 'dcPrefetchIndex', 'dcUnresolvedMasters',
			'mbArtistCache', 'mbArtistReleasesCache',
			'bpArtistCache', 'bpArtistReleasesCache',
			'amArtistCache', 'amArtistReleasesCache',
			'scUserCache', 'scUserReleasesCache',
			'neArtistCache', 'neArtistReleasesCache',
			'artistMatchScores',
		];
		const getCacheSizes = () => aamCacheEntries.map(key => key in sessionStorage ? sessionStorage[key].length : 0);
		const getCacheSize = () => getCacheSizes().reduce((sum, size) => sum + size, 0);
		const canLoadCache = () => 'aamCachedArtistId' in sessionStorage
			&& parseInt(sessionStorage.aamCachedArtistId) == artist.id || getCacheSize() <= cacheSizeReserve * 2**10;
		function cachesCleanup() {
			if ('aamCachedArtistId' in sessionStorage && parseInt(sessionStorage.aamCachedArtistId) != artist.id
					&& getCacheSize() > cacheSizeReserve * 2**10) {
				aamCacheEntries.forEach(Storage.prototype.removeItem.bind(sessionStorage));
				sessionStorage.removeItem('aamCachedArtistId');
			}
		}
		function saveSessionCache(keyName, serialisable) {
			if (domStorageLimitReached || !keyName || !serialisable) return false;
			const serialized = JSON.stringify(typeof serialisable == 'function' ? serialisable() : serialisable);
			return (function store(counter = 0) { try {
				cachesCleanup();
				sessionStorage.setItem(keyName, serialized);
				sessionStorage.setItem('aamCachedArtistId', artist.id);
				return true;
			} catch(e) {
				console.warn('[AAM] saveSessionCache:', e, `(${keyName}/${serialized.length}/${counter})`);
				if (e instanceof DOMException && e.name == 'QuotaExceededError' || /\b(?:NS_ERROR_DOM_QUOTA_REACHED)\b/.test(e)) {
					if (counter < 10) for (let ditchKey of [
						'dcArtistReleasesCache', 'mbArtistReleasesCache',
					]) if (ditchKey in sessionStorage) {
						sessionStorage.removeItem(ditchKey);
						return store(counter + 1);
					}
					domStorageLimitReached = true;
				}
				return false;
			} })();
		}

		function searchVariants(searchFunc, searchTerm, anvs, tryASCII = false) {
			function _tryASCII(reason, searchTerm) {
				if (tryASCII && reason == noMatches) {
					const searchTermAscii = searchTerm.toASCII();
					if (searchTermAscii && searchTermAscii != searchTerm) return searchFunc(searchTermAscii, anvs);
				}
				return Promise.reject(reason);
			}

			const noMatches = 'No matches';
			if (typeof searchFunc != 'function') throw 'searchFunc not a function';
			const languageNVs = bilingualNameParsers.reduce((acc, rx) => acc || rx.exec(searchTerm), null);
			if (languageNVs == null) return _tryASCII(noMatches, searchTerm);
			return searchFunc(languageNVs[1], anvs)
				.catch(reason => reason == noMatches ? searchFunc(languageNVs[2], anvs) : Promise.reject(reason));
		}

		// Discogs querying
		const dcOrigin = 'https://www.discogs.com';
		const dcAuth = (function() {
			const token = GM_getValue('discogs_api_token') || GM_getValue('discogs_token');
			if (token) return { token: token };
			const key = GM_getValue('discogs_api_consumerkey') || GM_getValue('discogs_key');
			const secret = GM_getValue('discogs_api_consumersecret') || GM_getValue('discogs_secret');
			if (key && secret) return { key: key, secret: secret };
			//return { key: '', secret: '' };
		})(), dcApiRateControl = { requestsMax: dcAuth ? 60 : 25 }, dcApiRequestsCache = new Map;
		const dcMasterRequestCache = new Map;
		const dcEntryIdXtractor = /\/(artist|release|master|label|user)s?\/(?:view\/)?(\d+)\b/i;
		const dcSearchSize = GM_getValue('discogs_artist_search_size', 100);
		const mastersChannel = GM_getValue('masters_channel', 'API'); // API/HTML
		const dcNameNormalizer = artist => artist && artist.replace(/[\x00-\x1f]+/g, '').trim()
			.replace(/\s+/g, ' ').replace(/\s+\(\d+\)$/, '');
		let dcEntriesCache, dcArtistReleasesCache, dcPrefetchIndex, dcMasterYears, dcMasterTitles, dcUnresolvedMasters;
		if (!dcAuth) console.warn('[AAM] Discogs API: no authentication credentials are configured, the functionality related to Discogs is limited');
		if ('dcMasterYears' in sessionStorage && canLoadCache()) try {
			dcMasterYears = new Map(JSON.parse(sessionStorage.getItem('dcMasterYears')));
		} catch(e) {
			sessionStorage.removeItem('dcMasterYears');
			console.warn(e);
		}
		if (!dcMasterYears) dcMasterYears = new Map;
		if ('dcMasterTitles' in sessionStorage && canLoadCache()) try {
			dcMasterTitles = new Map(JSON.parse(sessionStorage.getItem('dcMasterTitles')));
		} catch(e) {
			sessionStorage.removeItem('dcMasterTitles');
			console.warn(e);
		}
		if (!dcMasterTitles) dcMasterTitles = new Map;
		if ('dcUnresolvedMasters' in sessionStorage && canLoadCache()) try {
			dcUnresolvedMasters = new Set(JSON.parse(sessionStorage.getItem('dcUnresolvedMasters')));
		} catch(e) {
			sessionStorage.removeItem('dcUnresolvedMasters');
			console.warn(e);
		}
		if (!dcUnresolvedMasters) dcUnresolvedMasters = new Set;

		function queryDiscogsAPI(endPoint, params) {
			if (endPoint) endPoint = new URL(endPoint, 'https://api.discogs.com');
				else return Promise.reject('No endpoint provided');
			if (params instanceof URLSearchParams) endPoint.search = params;
			else if (params instanceof Object) for (let key in params) endPoint.searchParams.set(key, params[key]);
			else if (params) endPoint.search = new URLSearchParams(params);
			const cacheKey = endPoint.pathname.slice(1) + endPoint.search;
			if (dcApiRequestsCache.has(cacheKey)) return dcApiRequestsCache.get(cacheKey);
			// if (!dcApiResponses && 'discogsApiResponseCache' in sessionStorage) try {
			// 	dcApiResponses = JSON.parse(sessionStorage.getItem('discogsApiResponseCache'));
			// } catch(e) {
			// 	sessionStorage.removeItem('discogsApiResponseCache');
			// 	console.warn(e);
			// }
			// if (dcApiResponses && cacheKey in dcApiResponses) return Promise.resolve(dcApiResponses[cacheKey]);
			params = { method: 'GET', url: endPoint, responseType: 'json', headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' } };
			if (dcAuth instanceof Object) {
				params.headers.Authorization = 'Discogs ' + Object.keys(dcAuth).map(key => key + '=' + dcAuth[key]).join(', ');
				//for (let key in dcAuth) endPoint.searchParams.set(key, dcAuth[key]);
			}
			const request = new Promise(function(resolve, reject) {
				function request() {
					const now = Date.now();
					if (!dcApiRateControl.timeFrameExpiry || now > dcApiRateControl.timeFrameExpiry) {
						dcApiRateControl.timeFrameExpiry = now + 60 * 1000 + 500;
						if (dcApiRateControl.requestDebt > 0) {
							dcApiRateControl.requestCounter = Math.min(dcApiRateControl.requestsMax, dcApiRateControl.requestDebt);
							dcApiRateControl.requestDebt -= dcApiRateControl.requestCounter;
							console.assert(dcApiRateControl.requestDebt >= 0, 'dcApiRateControl.requestDebt >= 0');
						} else dcApiRateControl.requestCounter = 0;
					}
					if (dcApiRateControl.requestCounter++ < dcApiRateControl.requestsMax) GM_xmlhttpRequest(params);
					else postpone(now);
				}

				const postpone = timeStamp => setTimeout(request, dcApiRateControl.timeFrameExpiry - timeStamp);
				let retryCounter = 0;
				params.onload = function(response) {
					response = GlobalXHR.responseAdapter(response);
					const [rateLimit, rateLimitUsed, rateLimitRemaining] = ['ratelimit', 'ratelimit-used', 'ratelimit-remaining']
						.map(header => parseInt(response.headers['x-discogs-' + header]));
					console.assert(rateLimit > 0 && rateLimitUsed >= 0, response.responseHeaders);
					if (rateLimit > 0) dcApiRateControl.requestsMax = rateLimit;
					if (rateLimitUsed + 1 > dcApiRateControl.requestCounter) dcApiRateControl.requestCounter = rateLimitUsed + 1;
					dcApiRateControl.requestDebt = Math.max(dcApiRateControl.requestCounter - dcApiRateControl.requestsMax, 0);
					if (response.status >= 200 && response.status < 400) {
						// if (!quotaExceeded) try {
						// 	if (!dcApiResponses) dcApiResponses = { };
						// 	dcApiResponses[cacheKey] = response.response;
						// 	sessionStorage.setItem('discogsApiResponseCache', JSON.stringify(dcApiResponses));
						// } catch(e) {
						// 	quotaExceeded = true;
						// 	console.warn(e);
						// }
						resolve(response.response);
					} else {
						const error = XHR.defaultErrorHandler(response);
						if (response.status == 429) {
							console.warn(error, response.response.message, `Rate limit used: ${rateLimitUsed}/${dcApiRateControl.requestsMax}`);
							postpone(Date.now());
						} else if (XHR.recoverableErrors.has(response.status) && retryCounter++ < XHR.maxRetries)
							setTimeout(request, XHR.retryTimeout);
						else reject(error);
					}
				};
				params.onerror = function(response) {
					// console.trace('[AAM] queryDiscogsAPI(\"%s\", %o) receives HTTP error %d (%s)', endPoint, params,
					// 	response.status, response.statusText);
					const error = XHR.defaultErrorHandler(response);
					if (response.status == 0 && !response.finalUrl && retryCounter++ < XHR.maxRetries)
						setTimeout(request, XHR.retryTimeout);
					else reject(error);
				};
				params.ontimeout = response => { reject(XHR.defaultTimeoutHandler(response)) };
				request();
			});
			dcApiRequestsCache.set(cacheKey, request);
			return request;
		}
		function discogsRedirectHandler(reason, type, id, callback) {
			if (!/^(?:HTTP error 404)\b/i.test(reason)) return Promise.reject(reason);
			if (!type || !(id > 0) || typeof callback != 'function') throw 'Invalid argument(s)';
			const rx = new RegExp(`\\/${type = type.toLowerCase().replace(/s$/, '')}s?\\/(\\d+)\\b`, 'i');
			return resolveUrl(`${dcOrigin}/${type}/${id.toString()}`).then(function(resolvedURL) {
				let newId = rx.exec(resolvedURL);
				return newId != null && (newId = parseInt(newId[1])) > 0 && newId != id ?
					callback(type, newId) : Promise.reject(reason);
			}, reason2 => Promise.reject(reason));
		}
		function getDiscogsEntry(type, id) {
			if (!type) throw 'Invalid argument';
			if (!(id > 0)) return Promise.reject('Invalid argument');
			if (!dcEntriesCache && 'dcEntriesCache' in sessionStorage && canLoadCache()) try {
				dcEntriesCache = JSON.parse(sessionStorage.getItem('dcEntriesCache'));
			} catch(e) {
				sessionStorage.removeItem('dcEntriesCache');
				console.warn(e);
			}
			if (!dcEntriesCache) dcEntriesCache = { };
			type = type.toLowerCase() + 's';
			if (type in dcEntriesCache && id in dcEntriesCache[type]) return Promise.resolve(dcEntriesCache[type][id]);
			return queryDiscogsAPI(type + '/' + id.toString()).then(function(response) {
				const ditchKeys = {
					artists: ['resource_url', 'releases_url', 'data_quality'],
					masters: [
						'main_release', 'most_recent_release', 'resource_url', 'versions_url', 'main_release_url',
						'most_recent_release_url', 'num_for_sale', 'lowest_price', 'images', 'genres', 'styles',
						'tracklist', 'artists', 'notes', 'data_quality', 'videos',
					],
					releases: ['resource_url', 'data_quality'],
					labels: ['resource_url', 'releases_url', 'contact_info', 'profile', 'data_quality'],
				};
				if (type in ditchKeys) for (let key of ditchKeys[type]) if (key in response) delete response[key];
				if (!(type in dcEntriesCache)) dcEntriesCache[type] = { };
				dcEntriesCache[type][id] = response;
				dcApiRequestsCache.delete(type + '/' + id.toString());
				saveSessionCache('dcEntriesCache', dcEntriesCache);
				return response;
			}, reason => discogsRedirectHandler(reason, type, id, getDiscogsEntry));
		}
		const dcMasterLookupQuota = GM_getValue('discogs_master_lookups_quota', 500);
		const dcCanVaryYear = (release, listSize) => release && release.id > 0
			&& (!release.role || mastersChannel.toLowerCase() != 'api' || listSize <= dcMasterLookupQuota && ![
				//'TrackAppearance', 'Appearance',
				// 'Mixed by', 'UnofficialRelease', 'TrackProducer', 'Remix', 'Main', 'Conductor', 'Producer',
			].some(role => release.role.toLowerCase() == role.toLowerCase()) || listSize <= dcMasterLookupQuota * 2 && [
				'TrackAppearance', 'Appearance',
				// 'Mixed by', 'UnofficialRelease', 'TrackProducer', 'Remix', 'Main', 'Conductor', 'Producer',
			].some(role => release.role.toLowerCase() == role.toLowerCase()) || [
				'Mixed by', 'UnofficialRelease', 'TrackProducer',
				// 'Remix', 'Main', 'Conductor', 'Producer',
			].some(role => release.role.toLowerCase() == role.toLowerCase()));
		const dcCanVaryTitle = (release, listSize) => release && release.id > 0
			&& (!release.role || mastersChannel.toLowerCase() != 'api' || listSize <= dcMasterLookupQuota && ![
				//'TrackAppearance', 'Appearance',
				// 'Mixed by', 'UnofficialRelease', 'TrackProducer', 'Remix', 'Main', 'Conductor', 'Producer',
			].some(role => release.role.toLowerCase() == role.toLowerCase()) || listSize <= dcMasterLookupQuota * 2 && [
				'TrackAppearance', 'Appearance',
				// 'Mixed by', 'UnofficialRelease', 'TrackProducer', 'Remix', 'Main', 'Conductor', 'Producer',
			].some(role => release.role.toLowerCase() == role.toLowerCase()) || [
				'Mixed by', 'UnofficialRelease', 'TrackProducer',
				// 'Remix', 'Main', 'Conductor', 'Producer',
			].some(role => release.role.toLowerCase() == role.toLowerCase()));
		const dcNotDcProprietaryRelease = release => release && (!release.role || ![
			'Main', 'Conductor', 'Producer',
			//'Appearance', 'TrackAppearance','UnofficialRelease', 'Mixed by', 'Remix',
		].some(role => release.role.toLowerCase() == role.toLowerCase()));
		const resolveDiscogsEntry = (type, id) => type && id > 0 ? resolveUrl(`${dcOrigin}/${type}/${id}`).then(resolvedUrl =>
			(id = dcEntryIdXtractor.exec(resolvedUrl)) != null && id[1].toLowerCase() == type.toLowerCase()
				&& (id = parseInt(id[2])) > 0 ? id : Promise.reject('Invalid entry id'))
			: Promise.reject('Invalid argument');

		function cacheDiscogsArtistMasterReleases(artistId) {
			if (!(artistId > 0)) return Promise.reject('Invalid artist id');
			if (!dcPrefetchIndex && 'dcPrefetchIndex' in sessionStorage && canLoadCache()) try {
				dcPrefetchIndex = new Set(JSON.parse(sessionStorage.getItem('dcPrefetchIndex')));
			} catch(e) {
				sessionStorage.removeItem('dcPrefetchIndex');
				console.warn(e);
			}
			if (!dcPrefetchIndex) dcPrefetchIndex = new Set;
			if (dcPrefetchIndex.has(artistId)) return Promise.resolve(0);
			const rxPageXtractor = /\b(\d+(?:[\s\,\.]\d+)*)\s*–\s*(\d+(?:[\s\,\.]\d+)*)\s*of\s*(\d+(?:[\s\,\.]\d+)*)\b/i;
			let masterCounter = 0;
			const loadArtistPage = (type = 'All', page = 1) => GlobalXHR.get(`${dcOrigin}/artist/${artistId}?` +
					new URLSearchParams({ type: type, page: page, limit: 500 }).toString(), { anonymous: true }).then(function({document}) {
				for (let tr of document.body.querySelectorAll('table#artist > tbody > tr.master')) {
					let masterId = /^m(\d+)$/i.exec(tr.id), value;
					if (masterId == null || !(masterId = parseInt(masterId[1]))) {
						console.warní('[AAM] Assertion failed: master id', tr);
						continue;
					}
					if (!dcMasterYears.has(masterId) && (value = tr.querySelector('td.year')) != null)
						if (!value.textContent.trim()) dcMasterYears.set(masterId, undefined);
							else if ((value = parseInt(value.textContent)) > 0) dcMasterYears.set(masterId, value);
					if (!dcMasterTitles.has(masterId) && (value = tr.querySelector('td.title > a:last-of-type')) != null
							&& (value = value.textContent.trim())) dcMasterTitles.set(masterId, value);
					++masterCounter;
				}
				let pageStatus = document.body.querySelector('strong.pagination_total');
				const nextPageLink = document.body.querySelector('a.pagination_next') != null;
				if (pageStatus != null && (pageStatus = rxPageXtractor.exec(pageStatus.textContent)) != null) {
					pageStatus = pageStatus.slice(1).map(e => parseInt(e.replace(/\D/g, '')));
					if (pageStatus[2] > pageStatus[1]) {
						console.assert(nextPageLink, '!a.pagination_next', document.body.querySelector('strong.pagination_total'));
						return loadArtistPage(type, page + 1);
					} else if (nextPageLink) {
						console.warn('[AAM] Assertion failed: continuing release list',
							document.body.querySelector('strong.pagination_total'),
							document.body.querySelector('a.pagination_next'));
						if (page < 30) return loadArtistPage(type, page + 1);
					}
				} else if (nextPageLink && page < 30) {
					console.warn('[AAM] Assertion failed: continuing release list but not pagination totals',
						document.body.querySelector('strong.pagination_total'));
					return loadArtistPage(type, page + 1);
				}
				dcPrefetchIndex.add(artistId);
				if (!domStorageLimitReached) saveSessionCache('dcPrefetchIndex', Array.from(dcPrefetchIndex));
				return page;
			}, reason => reason);

			return loadArtistPage().then(function(totalPages) {
				if (masterCounter > 0) {
					if (!domStorageLimitReached) {
						if (dcMasterYears.size > 0) saveSessionCache('dcMasterYears', Array.from(dcMasterYears));
						if (dcMasterTitles.size > 0) saveSessionCache('dcMasterTitles', Array.from(dcMasterTitles));
					}
					console.log('[AAM] Prefetch of Discogs artist', artistId, 'finished, total',
						masterCounter, 'master releases found out of', totalPages, 'page(s)');
				}
				return masterCounter;
			});
			// return Promise.all(['Releases', 'Appearances', 'Credits', 'Unofficial'].map(type => loadArtistPage(type)))
			// 	.then(typeFetchers => masterCounter);
		}
		function getDiscogsArtistReleases(artistId) {
			if (!(artistId > 0)) return Promise.reject('Invalid artist id');
			if (!dcArtistReleasesCache && 'dcArtistReleasesCache' in sessionStorage && canLoadCache()) try {
				dcArtistReleasesCache = JSON.parse(sessionStorage.getItem('dcArtistReleasesCache'));
			} catch(e) {
				sessionStorage.removeItem('dcArtistReleasesCache');
				console.warn(e);
			}
			if (!dcArtistReleasesCache) dcArtistReleasesCache = { };
			else if (artistId in dcArtistReleasesCache) return Promise.resolve(dcArtistReleasesCache[artistId]);
			const dcMaxCachedReleases = GM_getValue('discogs_max_cached_releases', 5000);
			const preFetch = cacheDiscogsArtistMasterReleases(artistId);
			const getPage = (page = 1) => queryDiscogsAPI(`artists/${artistId}/releases`, { page: page, per_page: 500 });
			return getPage().then(function(response) {
				const releases = response.releases;
				if (!(response.pagination.page < response.pagination.pages)) return releases;
				const fetchers = [ ];
				for (let p = response.pagination.page; p < response.pagination.pages; ++p) fetchers.push(getPage(p + 1));
				return Promise.all(fetchers).then(responses =>
					Array.prototype.concat.apply(releases, responses.map(response => response.releases)));
			}).then(releases => preFetch.then(function(lastPage) {
				if (releases.length <= dcMaxCachedReleases) dcArtistReleasesCache[artistId] = releases.map(release => ({
					id: release.id,
					//artist: release.artist,
					title: release.title,
					trackinfo: release.trackinfo,
					year: release.year,
					type: release.type,
					role: release.role,
					//format: release.format,
				})); else return releases;
				if (!domStorageLimitReached) {
					const serialized = JSON.stringify(dcArtistReleasesCache);
					try {
						cachesCleanup();
						sessionStorage.setItem('dcArtistReleasesCache', serialized);
						sessionStorage.setItem('aamCachedArtistId', artist.id);
					} catch(e) {
						console.warn(e, `(${serialized.length})`);
						// if (/\b(?:NS_ERROR_DOM_QUOTA_REACHED)\b/.test(e)
						// 		|| e instanceof DOMException && e.name == 'QuotaExceededError') domStorageLimitReached = true;
					}
				}
				return releases;
			}), function(reason) {
				return discogsRedirectHandler(reason, 'artist', artistId, (_, artistId) => getDiscogsArtistReleases(artistId));
			}).catch(function(reason) {
				console.warn(`Failed to get Discogs releases of ${artistId}:`, reason);
				return [ ];
			});
		}
		function getDiscogsMatches(artistId, torrentGroups) {
			if (!(artistId > 0)) return Promise.reject('Invalid argument');
			if (!Array.isArray(torrentGroups) || torrentGroups.length <= 0) return Promise.resolve(null);
			let listSize = torrentGroups.length;
			const rolesProfiling = { };
			return getDiscogsArtistReleases(artistId).then(function(releases) {
				if (releases.length < listSize) listSize = releases.length;
				const dcMasterLookups = new DiscogsMasterLookups;
				const results = torrentGroups.filter(function(torrentGroup) {
					const titleNorm = [titleCmpNorm(torrentGroup.groupName), stripRlsSuffix(torrentGroup.groupName).toLowerCase()];
					return releases.some(function(release) {
						if (release.year < torrentGroup.groupYear) return false;
						const isMaster = release.type == 'master';
						const rlsYearMatch = release.year >= torrentGroup.groupYear || !strictRlsYearMatching && !release.year;
						const titles = [release.title, release.trackinfo].filter(uniqueValuesFilter);
						const strictTitleMatch = titles.some(title => titleCmpNorm(title) == titleNorm[0]
							|| bilingualNamesMatch(torrentGroup.groupName, title));
						if (isMaster && !dcUnresolvedMasters.has(release.id)
								&& (!dcMasterYears.has(release.id) || !dcMasterTitles.has(release.id))
								&& !dcCanVaryYear(release, releases.length) && !dcCanVaryTitle(release, releases.length))
							dcUnresolvedMasters.add(release.id);
						if (rlsYearMatch && (!isMaster || dcUnresolvedMasters.has(release.id)) && (strictTitleMatch
								|| strongEqualReleaseDate && release.year == torrentGroup.groupYear
								&& titles.some(title => fuzzyTitlesMatch(stripRlsSuffix(title).toLowerCase(), titleNorm[1]))))
							return true;
						if (isMaster) if (dcMasterYears.has(release.id) && dcMasterTitles.has(release.id)) {
							const masterYear = dcMasterYears.get(release.id);
							if (masterYear ? masterYear != torrentGroup.groupYear : !rlsYearMatch) return false;
							if (strictTitleMatch) return true;
							const masterTitle = dcMasterTitles.get(release.id);
							if (masterTitle && (titleCmpNorm(masterTitle) == titleNorm[0]
									|| bilingualNamesMatch(torrentGroup.groupName, masterTitle))) return true;
							return (masterYear > 0 || strongEqualReleaseDate && release.year == torrentGroup.groupYear)
								&& titles.concat(masterTitle).filter(uniqueValuesFilter)
									.some(title => fuzzyTitlesMatch(stripRlsSuffix(title).toLowerCase(), titleNorm[1]));
						} else if (dcCanVaryYear(release, releases.length) || dcCanVaryTitle(release, releases.length))
							dcMasterLookups.add(release.id);
						return false;
					});
				});
				if (dcUnresolvedMasters.size > 0) saveSessionCache('dcUnresolvedMasters', Array.from(dcUnresolvedMasters));
				if (dcMasterLookups.isEmpty/* || results.length * 2 >= listSize*/) return results;
				console.info('[AAM]', dcMasterLookups.size, 'master release(s) to lookup on Discogs (', artistId, releases.length, ')');
				return dcMasterLookups.execute(artistId).then(total => total > 0 ? results.concat(torrentGroups.filter(function(torrentGroup) {
					const titleNorm = [titleCmpNorm(torrentGroup.groupName), stripRlsSuffix(torrentGroup.groupName).toLowerCase()];
					return releases.some(function(release) {
						if (release.type != 'master' || !dcMasterLookups.has(release.id)) return false;
						const masterYear = dcMasterYears.get(release.id);
						if (masterYear ? masterYear != torrentGroup.groupYear : !(release.year >= torrentGroup.groupYear)
								&& (strictRlsYearMatching || release.year)) return false;
						const titles = [release.title, release.trackinfo, dcMasterTitles.get(release.id)].filter(uniqueValuesFilter);
						if (titles.some(title => titleCmpNorm(title) == titleNorm[0]
							|| bilingualNamesMatch(torrentGroup.groupName, title))) return true;
						if (!(masterYear > 0) && (!strongEqualReleaseDate || release.year != torrentGroup.groupYear)) return false;
						return titles.some(title => fuzzyTitlesMatch(stripRlsSuffix(title).toLowerCase(), titleNorm[1]));
					});
				})) : results);
			}, reason => null).then(function(torrentGroups) {
				if (!torrentGroups) return null;
				//if (Object.keys(rolesProfiling).length > 0) console.debug('[AAM] rolesProfiling:', rolesProfiling);
				if (minMatchDivisor > 1 && torrentGroups.length * minMatchDivisor < listSize) return [ ];
				return torrentGroups.map(torrentGroup => torrentGroup.groupId);
			});
		}

		const discogsSearchArtist = (searchTerm = artist.name, anvs) => searchTerm ?
				Promise.all(['title', 'anv'/*, 'query'*/].map(param => (function getPage(page = 1) {
			if (!(page > 0)) page = 1;
			return queryDiscogsAPI('database/search', {
				type: 'artist',
				[param]: searchTerm,
				strict: false,
				sort: 'score',
				sort_order: 'desc',
				page: page,
				per_page: dcSearchSize > 0 ? Math.min(dcSearchSize, 100) : 100,
			}).then(function(response) {
				if (response.pagination.pages > response.pagination.page
						&& (!(dcSearchSize > 0) || dcSearchSize > response.pagination.page * response.pagination.per_page))
					return getPage(page + 1).then(Array.prototype.concat.bind(response.results));
				const index = dcSearchSize > 0 ? dcSearchSize % response.pagination.per_page : 0;
				return index > 0 && response.results.length > index ? response.results.slice(0, index) : response.results;
			});
		})())).then(results => Array.prototype.concat.apply([ ], results).filter((result1, ndx, arr) =>
				arr.findIndex(result2 => result2.id == result1.id) == ndx)).then(results =>
					Promise.all(results.map(function(result) {
			if (result.type != 'artist') return Promise.reject('Assertion failed: result type mismatch');
			function anvMatch(remoteName) {
				if (remoteName) remoteName = remoteName.toLowerCase(); else return false;
				const anvMatch = localName => localName && remoteName == (localName = localName.toLowerCase())
					|| sameArtistConfidence > 0 && fuzzyArtistsMatch(remoteName, localName);
				return anvMatch(searchTerm) || Array.isArray(anvs) && anvs.map(dcNameNormalizer).some(anvMatch);
			}
			return anvMatch(dcNameNormalizer(result.title)) ? Promise.resolve(true) : getDiscogsEntry('artist', result.id)
				.then(artist => Array.isArray(artist.namevariations) && artist.namevariations.some(anvMatch));
		}).map(promise => promise.catch(reason => false))).then(results2 =>
				results.filter((result, ndx) => results2[ndx]))).then(function(results) {
			if (!results || results.length <= 0) return searchVariants(discogsSearchArtist, searchTerm, anvs, false);
			console.log('[AAM] Discogs search results for "' + searchTerm + '":', results);
			return results;
		}) : Promise.reject('Invalid argument');
		function basedOnArtist(artist, group) {
			if (!artist || !group) return false; // assertion failed
			const countLetters = str => str.replace(/[\s\x00-\x2F\x3A-\x40\x5B-\x60\x7B-\xBF\xD7\xF7\u2019]+/g, '').length;
			function cmpNorm(str) {
				const length = countLetters(str), asciiStr = str.toASCII();
				return (countLetters(asciiStr) >= length ? asciiStr : str).toLowerCase();
			}
			const groupNameNorm = cmpNorm(dcNameNormalizer(group.name));
			const testANV = n => n && (n = cmpNorm(n)).length > 0 && (groupNameNorm.startsWith(n + ' ')
				|| groupNameNorm.endsWith(' ' + n) || groupNameNorm.includes(' ' + n + ' ')
				|| n.length >= 5 && groupNameNorm.includes(n));
			return groupNameNorm.length > 0 && (testANV(dcNameNormalizer(artist.name))
				|| Array.isArray(artist.namevariations) && artist.namevariations.some(testANV));
		}

		class DiscogsMasterLookups extends Set {
			constructor() { super() }
			get isEmpty() { return this.size <= 0 }

			execute(batchId) {
				if (this.isEmpty) return Promise.resolve(0);
				// batchId = `DiscogsMasterLookups(${batchId || Date.now()})`;
				// console.time(batchId);
				const dcMasterLookups = Array.from(this);
				let workers;
				switch (mastersChannel.toLowerCase()) {
					case 'api':
						workers = Promise.all(dcMasterLookups.map(function cacheDiscogsMaster(masterId) {
							if (!(masterId > 0)) return Promise.resolve(-2); // assertion failed
							if (dcMasterYears.has(masterId) && dcMasterTitles.has(masterId)) return Promise.resolve(0);
							return getDiscogsEntry('master', masterId).then(function(master) {
								let keys = 0;
								if ('title' in master) {
									if (!dcMasterTitles.has(masterId)) {
										dcMasterTitles.set(master.id, master.title || undefined);
										if (master.id != masterId) dcMasterTitles.set(masterId, master.title || undefined);
									}
									keys |= 0x02;
								}
								if ('year' in master) {
									if (!dcMasterYears.has(masterId)) {
										dcMasterYears.set(master.id, master.year > 0 ? master.year : undefined);
										if (master.id != masterId) dcMasterYears.set(masterId, master.year > 0 ? master.year : undefined);
									}
									keys |= 0x01;
								}
								return keys;
							}.bind(this), reason => -1);
						}.bind(this)));
						break;
					case 'html': {
						function cacheDiscogsMaster(masterId) {
							if (!(masterId > 0)) return Promise.resolve(-2); // assertion failed
							if (dcMasterYears.has(masterId) && dcMasterTitles.has(masterId)) return Promise.resolve(0);
							if (dcMasterRequestCache.has(masterId)) return dcMasterRequestCache.get(masterId);
							const request = GlobalXHR.get(`${dcOrigin}/master/${masterId}`, { anonymous: true }).then(function({document}) {
								let keys = 0, elem;
								if ((elem = document.body.querySelector('div[class^="body"] > h1[class^="title"]')) != null) {
									if (!dcMasterTitles.has(masterId)) dcMasterTitles.set(masterId, elem.lastChild.textContent.trim() || undefined);
									keys |= 0x02;
								} else if ((elem = document.body.querySelector('h1#profile_title > span:last-of-type')) != null) {
									if (!dcMasterTitles.has(masterId)) dcMasterTitles.set(masterId, elem.textContent.trim() || undefined);
									keys |= 0x02;
								} else console.warn('[AAM] Master release scraper missed release title for id %d (%s)',
									masterId, `${dcOrigin}/master/${masterId}`);
								for (let selector of [
									'div[class^="body"] > div[class^="info"] > table > tbody > tr > th[scope="row"]', // beta
									'h1#profile_title ~ div.head', // old
								]) for (elem of document.body.querySelectorAll(selector)) try {
									if (!/^(?:Year|Jahr|Año|Année|Anno|年|연도|Ano|Год):$/.test(elem.textContent.trim())) continue;
									const year = elem.nextElementSibling != null && parseInt(elem.nextElementSibling.textContent);
									if (!dcMasterYears.has(masterId)) dcMasterYears.set(masterId, year || undefined);
									keys |= 0x01;
									break;
								} catch(e) { console.warn('[AAM] Invlaid page structure (%s)', e, masterId) }
								if (keys >= 0x03) dcMasterRequestCache.delete(masterId);
									else console.log('[AAM] Discogs master scraper result for id %i:',
										masterId, keys, dcMasterYears.get(masterId), dcMasterTitles.get(masterId));
								return keys;
							}.bind(this), reason => -1);
							dcMasterRequestCache.set(masterId, request);
							return request;
						}

						const maxBatchSize = GM_getValue('max_discogs_batch_size', 64);
						workers = dcMasterLookups.length > maxBatchSize ? (function processPage(index = 0) {
							return Promise.all(dcMasterLookups.slice(index * maxBatchSize, ++index * maxBatchSize)
								.map(cacheDiscogsMaster.bind(this))).then(results => dcMasterLookups.length > index * maxBatchSize ?
									processPage.call(this, index).then(Array.prototype.concat.bind(results)) : results);
						}).call(this) : Promise.all(dcMasterLookups.map(cacheDiscogsMaster.bind(this)));
						break;
					}
					default: throw 'Unrecognized Discogs masters channel';
				}
				return workers.then(results => results.filter(result => result > 0).length).then(function(total) {
					//console.timeEnd(batchId);
					if (total > 0 && !domStorageLimitReached) {
						if (dcMasterYears.size > 0) saveSessionCache('dcMasterYears', Array.from(dcMasterYears));
						if (dcMasterTitles.size > 0) saveSessionCache('dcMasterTitles', Array.from(dcMasterTitles));
					}
					return total;
				}.bind(this));
			}
		}

		// MusicBrainz querying
		const mbRequestsCache = new Map, mbRequestRate = 1000;
		let mbLastRequest = null, mbArtistCache, mbArtistReleasesCache;

		function mbApiRequest(endPoint, params) {
			if (!endPoint) throw 'Endpoint is missing';
			const url = new URL('/ws/2/' + endPoint.replace(/^\/+|\/+$/g, ''), 'https://musicbrainz.com/');
			if (params) for (let key in params) url.searchParams.set(key, params[key]);
			url.searchParams.set('fmt', 'json');
			const cacheKey = url.pathname.slice(6) + url.search;
			if (mbRequestsCache.has(cacheKey)) return mbRequestsCache.get(cacheKey);
			const request = new Promise(function(resolve, reject) {
				let retryCounter = 0;
				const xhr = {
					method: 'GET', url: url, responseType: 'json', timeout: 60e3,
					headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
					onload: function(response) {
						mbLastRequest = Date.now();
						if (response.status >= 200 && response.status < 400) resolve(response.response);
						else if (XHR.recoverableErrors.has(response.status) && retryCounter++ < 60) {
							console.log('MusicBrainz API request retry #%d on HTTP error %d', retryCounter, response.status);
							setTimeout(request, 1000);
						} else reject(XHR.defaultErrorHandler(response));
					},
					onerror: response => { mbLastRequest = Date.now(); reject(XHR.defaultErrorHandler(response)); },
					ontimeout: response => { mbLastRequest = Date.now(); reject(XHR.defaultTimeoutHandler(response)); },
				}, request = () => {
					if (mbLastRequest == Infinity) return setTimeout(request, 50);
					const availableAt = mbLastRequest + mbRequestRate, now = Date.now();
					if (now < availableAt) return setTimeout(request, availableAt - now); else mbLastRequest = Infinity;
					GM_xmlhttpRequest(xhr);
				};
				request();
			});
			mbRequestsCache.set(cacheKey, request);
			return request.catch(reason => (mbRequestsCache.delete(cacheKey), Promise.reject(reason)));
		}

		function mbGetArtist(artistId) {
			if (!artistId) return Promise.reject('Invalid artist id');
			if (!mbArtistCache && 'mbArtistCache' in sessionStorage && canLoadCache()) try {
				mbArtistCache = JSON.parse(sessionStorage.getItem('mbArtistCache'));
			} catch(e) {
				sessionStorage.removeItem('mbArtistCache');
				console.warn(e);
			}
			if (!mbArtistCache) mbArtistCache = { };
			else if (artistId in mbArtistCache) return Promise.resolve(mbArtistCache[artistId]);
			return mbApiRequest('artist/' + artistId.toString(), { inc: [
				'url-rels',
				'artist-rels',
				//'release-group-rels',
			].join('+') }).then(function(response) {
				mbArtistCache[artistId] = response;
				mbRequestsCache.delete('artist/' + artistId.toString());
				saveSessionCache('mbArtistCache', mbArtistCache);
				return response;
			});
		}

		function mbGetArtistDiscography(artistId) {
			if (!artistId) return Promise.reject('Invalid artist id');
			if (!mbArtistReleasesCache && 'mbArtistReleasesCache' in sessionStorage && canLoadCache()) try {
				mbArtistReleasesCache = JSON.parse(sessionStorage.getItem('mbArtistReleasesCache'));
			} catch(e) {
				sessionStorage.removeItem('mbArtistReleasesCache');
				console.warn(e);
			}
			if (!mbArtistReleasesCache) mbArtistReleasesCache = { };
				else if (artistId in mbArtistReleasesCache) return Promise.resolve(mbArtistReleasesCache[artistId]);
			const fetchEntityType = (type, includes, param = 'artist') => type ? (function loadPage(offset = 0) {
				includes = Array.isArray(includes) ? includes.join(' ') : '';
				return mbApiRequest(type, { [param]: artistId, inc: includes, offset: offset, limit: 5000 }).then(function(response) {
					let results = response[type + 's'];
					if (Array.isArray(results)) offset = response[type + '-offset'] + results.length; else return [ ];
					results = results.filter(result => !result.video).map(result => Object.assign({ type: type }, result));
					if (!(offset < response[type + '-count'])) return results;
					return loadPage(offset).then(results2 => results.concat(results2));
				});
			})() : Promise.reject('Invalid type');
			return Promise.all([
				fetchEntityType('release-group'),
				fetchEntityType('release', ['release-groups']),
				fetchEntityType('release', ['release-groups'], 'track_artist'),
			]).then(results => Array.prototype.concat.apply([ ], results).filter(function(result, index, array) {
				if (result.type != 'release' || !('release-group' in result)) return true;
				return !array.some(result2 => result2.type == 'release-group' && result2.id == result['release-group'].id);
			})).then(function(results) {
				if (results.length <= 5000) {
					mbArtistReleasesCache[artistId] = results;
					if (!domStorageLimitReached) {
						const serialized = JSON.stringify(mbArtistReleasesCache);
						try {
							cachesCleanup();
							sessionStorage.setItem('mbArtistReleasesCache', serialized);
							sessionStorage.setItem('aamCachedArtistId', artist.id);
						} catch(e) {
							console.warn(e, `(${serialized.length})`);
							// if (/\b(?:NS_ERROR_DOM_QUOTA_REACHED)\b/.test(e)
							// 		|| e instanceof DOMException && e.name == 'QuotaExceededError') domStorageLimitReached = true;
						}
					}
				}
				return results;
			});
		}
		function mbDateMatch(entry, groupYear) {
			if (!(groupYear > 0)) return 0; else if (entry) switch (entry.type) {
				case 'release-group': var dates = [entry['first-release-date']]; break;
				case 'release': dates = [
					entry['release-group'] && entry['release-group']['first-release-date'],
					entry.date,
				]; break;
				default: return -2; // assertion failed
			} else return -2; // invalid argument
			dates = dates.map(date => date ? new Date(date) : undefined);
			if (dates[0] && dates[0].getUTCFullYear() == groupYear) return 2;
			if (dates[0] != undefined) return -1;
			if (strongEqualReleaseDate && dates[1] && dates[1].getUTCFullYear() == groupYear) return 2;
			if (dates[1] && dates[1].getUTCFullYear() >= groupYear) return 1;
			if (!strictRlsYearMatching && dates[1] == undefined) return 0;
			return -1;
		}
		function mbRlsTypeMatch(entry, releaseType) {
			function getTypes(root) {
				if (!root) return undefined;
				let result = root['primary-type'];
				if (result) result = [result]; else return undefined;
				return Array.isArray(root['secondary-types']) ? result.concat(root['secondary-types']) : result;
			}
			if (entry) switch (entry.type) {
				case 'release-group': var types = getTypes(entry); break;
				case 'release': types = getTypes(entry['release-group']); break;
				default: return -3; // assertion failed
			} else return -3; // invalid argument
			if (!types || !types[0]) return 0;
			//if (['Audiobook', 'Spokenword', 'Audio drama'].some(releaseType => types.includes(releaseType))) return -2;
			if (!(releaseType > 0 && releaseType < 1000)) return 0;
			if (types[0] == 'Single') return releaseType == 9 ? 2 : releaseType == 5 ? 0 : -2;
			if (types[0] == 'EP') return releaseType == 5 ? 2 : [3, 9, 11, 13, 15, 16].includes(releaseType) ? 0 : -2;
			if (types.includes('Interview')) return releaseType == 15 ? 2 : -1;
			if (types.includes('Demo')) return releaseType == 17 ? 2 : -1;
			if (types.includes('Mixtape/Street')) return releaseType == 16 ? 2 : -1;
			if (types.includes('DJ-mix')) return releaseType == 19 ? 2 : -1;
			if (types.includes('Remix')) return releaseType == 13 ? 2 : releaseType == 5 ? 0 : -1;
			if (types.includes('Soundtrack')) return releaseType == 3 ? 2 : releaseType == 1 ? -2 : -1;
			if (types.includes('Live')) return releaseType == 11 ? 2 : -1;
			if (types.includes('Compilation')) return [6, 7].includes(releaseType) ? 1 : -1;
			if (types[0] == 'Album' && releaseType == 1) return 1;
			return 0;

			// const isPrimaryType = primaryType => releaseGroup['primary-type'] == primaryType;
			// const hasSecondaryType = secondaryType => 'secondary-types' in releaseGroup
			// 	&& releaseGroup['secondary-types'].includes(secondaryType);
			// //if (['Audiobook', 'Spokenword', 'Audio drama'].some(hasSecondaryType) return false;
			// releaseType = {
			// 	1: 'Album', 3: 'Soundtrack', 5: 'EP', 6: 'Anthology', 7: 'Compilation', 9: 'Single',
			// 	11: 'Live album', 13: 'Remix', 14: 'Bootleg', 15: 'Interview', 16: 'Mixtape', 17: 'Demo',
			// 	18: 'Concert Recording', 19: 'DJ Mix', 21: 'Unknown',
			// }[releaseType];
			// console.assert(releaseType != undefined);
			// switch (releaseType) {
			// 	case 'Album': return ['Album', 'EP'].some(isPrimaryType)/* && !hasSecondaryType('Compilation')*/;
			// 	case 'Single': return ['Single', 'EP'].some(isPrimaryType);
			// 	case 'EP': return ['EP', 'Single'].some(isPrimaryType);
			// 	case 'Live album': case 'Concert Recording': return !isPrimaryType('Single') && hasSecondaryType('Live');
			// 	case 'Soundtrack': return !isPrimaryType('Single') && hasSecondaryType('Soundtrack');
			// 	case 'Anthology': case 'Compilation': return !isPrimaryType('Single') && hasSecondaryType('Compilation');
			// 	case 'Remix': return /*!isPrimaryType('Single') && */hasSecondaryType('Remix');
			// 	case 'DJ Mix': return !isPrimaryType('Single') && hasSecondaryType('DJ-mix');
			// 	case 'Demo': return /*!isPrimaryType('Single') && */hasSecondaryType('Demo');
			// 	case 'Mixtape': return !isPrimaryType('Single') && hasSecondaryType('Mixtape/Street');
			// 	case 'Interview': return /*!isPrimaryType('Single') && */hasSecondaryType('Interview');
			// 	case 'Bootleg': return !isPrimaryType('Single')/* && hasSecondaryType('Bootleg')*/;
			// }
			// return Boolean(releaseType);
		}
		const mbGetArtistMatches = (artistId, torrentGroups) => artistId ? Array.isArray(torrentGroups)
				&& torrentGroups.length > 0 ? mbGetArtistDiscography(artistId).then(function(results) {
			const listSize = Math.min(torrentGroups.length, results.length);
			let groupIds = torrentGroups.filter(function(torrentGroup) {
				const titleNorm = [titleCmpNorm(torrentGroup.groupName), stripRlsSuffix(torrentGroup.groupName).toLowerCase()];
				return results.some(function(result) {
					const dateMatch = mbDateMatch(result, torrentGroup.groupYear);
					if (dateMatch < 0) return false;
					const rlsTypeMatch = mbRlsTypeMatch(result, torrentGroup.releaseType);
					if (rlsTypeMatch < 0) return false;
					if (titleCmpNorm(result.title) == titleNorm[0]
							|| bilingualNamesMatch(torrentGroup.groupName, result.title)) return true;
					if (dateMatch < 1 || dateMatch < 2 && rlsTypeMatch < 1) return false;
					return fuzzyTitlesMatch(stripRlsSuffix(result.title).toLowerCase(), titleNorm[1]);
				});
			}).map(torrentGroup => torrentGroup.groupId), matchScore = groupIds.length / listSize;
			if (groupIds.length > 0 && minMatchDivisor > 1 && matchScore < 1/minMatchDivisor) {
				console.log(`[AAM] Discarding MusicBrainz artist ${artistId} matches to ${groupIds.length} site releases due to low match score (${matchScore})`);
				groupIds = [ ];
			}
			return groupIds;
		}, reason => null) : Promise.resolve(null) : Promise.reject('Invalid argument');
		const mbSearchArtist = (searchTerm = artist.name, anvs) => searchTerm ? mbApiRequest('artist', {
			query: '"' + searchTerm + '"',
			limit: 100,
		}).then(response => Array.isArray(response.artists) && response.artists.length > 0 ? response.artists.filter(function(artist) {
			function anvMatch(anv) {
				anv = anv.toLowerCase();
				const propMatch = prop => prop && (prop = prop.toLowerCase())
					&& (prop == anv || sameArtistConfidence > 0 && fuzzyArtistsMatch(prop, anv));
				const aliasMatch = entity => ['name', 'sort-name'].some(propName => propMatch(entity[propName]));
				return aliasMatch(artist) || Array.isArray(artist.aliases) && artist.aliases.some(aliasMatch);
			}
			return anvMatch(searchTerm) || Array.isArray(anvs) && anvs.some(anvMatch);
		}) : [ ]).then(function(results) {
			if (!results || results.length <= 0) return searchVariants(mbSearchArtist, searchTerm, anvs, true);
			console.log('[AAM] MusicBrainz search results for "' + searchTerm + '":', results);
			return results;
		}) : Promise.reject('Invalid argument');

		// Apple Music querying
		const amRequestsCache = new Map;
		let amArtistCache, amArtistReleasesCache, amLastCachedSuccess, amDesktopEnvironment = null;

		const amQueryAPI = (endPoint, params) => endPoint ? (amDesktopEnvironment || (amDesktopEnvironment = (function() {
			const configValidator = config => config && config.MEDIA_API && config.MEDIA_API.token
				&& (!config.timeStamp || config.timeStamp + 7 * 24 * 60*60*1000 >= Date.now() + 30 * 1000);
			if ('appleMusicDesktopConfig' in localStorage) try {
				var config = JSON.parse(localStorage.getItem('appleMusicDesktopConfig'));
				if (!configValidator(config)) throw 'Expired or incomplete cached Apple Music desktop environment';
				console.info('[AAM] Re-using cached Apple Music desktop environment:', config, 'Token age (d.):',
					((Date.now() - config.timeStamp) / 1000 / 60 / 60 / 24).toFixed(3));
				return Promise.resolve(config);
			} catch(e) {
				console.info('[AAM]', e, localStorage.appleMusicDesktopConfig);
				localStorage.removeItem('appleMusicDesktopConfig');
			}
			const timeStamp = Date.now();
			return GlobalXHR.get('https://music.apple.com/').then(function({document}) {
				if ((config = document.head.querySelector('meta[name="desktop-music-app/config/environment"][content]')) != null) try {
					(config = JSON.parse(decodeURIComponent(config.content))).timeStamp = timeStamp;
					if (configValidator(config)) return config;
				} catch(e) { console.warn('Invalid Apple Music desktop environment format:', e, config.content) }
				if ((config = document.head.querySelector('script[type="module"][src]')) != null)
					return GlobalXHR.get(new URL(config.getAttribute('src'), 'https://music.apple.com'), { responseType: 'text' }).then(({responseText}) =>
						(config = /\b(?:const\s+kd\s*=\s*['"]([^\s'"]{64,}?)|\w+\s*=\s*['"]([^\s'"]{268}))['"]/.exec(responseText)) != null
							&& configValidator(config = {
								MEDIA_API : { token: config[1] || config[2] },
								timeStamp: timeStamp,
							}) ? config : Promise.reject('Missing Apple Music OAuth2 token'));
				return Promise.reject('Missing Apple Music OAuth2 token');
			}).then(function(config) {
				console.info('Apple Music OAuth2 token successfully extracted:', config.MEDIA_API.token);
				localStorage.setItem('appleMusicDesktopConfig', JSON.stringify(config));
				return config;
			});
		})())).then(function request(config) {
			if (!config.retryCounter) config.retryCounter = 0;
			let url = config.MUSIC && config.MUSIC.BASE_URL || 'https://amp-api.music.apple.com/v1';
			const catRoot = '/catalog/us/';
			url = new URL(url + catRoot + endPoint.replace(/^\/+|\/+$/g, ''));
			if (params) url.search = new URLSearchParams(params);
			const cacheKey = url.pathname.slice(url.pathname.indexOf(catRoot) + catRoot.length) + url.search;
			if (amRequestsCache.has(cacheKey)) return amRequestsCache.get(cacheKey);
			url.searchParams.set('omit[resource]', 'views,meta,autos');
			url.searchParams.set('l', config.i18n && config.i18n.defaultLocale || 'en-us');
			url.searchParams.set('platform', 'web');
			const request = GlobalXHR.get(url, {
				responseType: 'json',
				headers: {
					Referer: 'https://music.apple.com/',
					Origin: 'https://music.apple.com',
					Host: url.hostname,
					Authorization: 'Bearer ' + config.MEDIA_API.token,
				},
			}).then(({json}) => json, function(reason) {
				let status = /^HTTP error (\d+)\b/.exec(reason);
				if (status != null) status = parseInt(status[1]);
				if ([400, 401, 403].includes(status)) {
					localStorage.removeItem('appleMusicDesktopConfig');
					//if (config.retryCounter++ <= 0) return request(config);
					alert('Apple Music request problem:\n' + reason + '\n(retry with Shazam)');
					return shQueryAPI(endPoint, params); //return amQueryAPI(endPoint, params);
				}
				return Promise.reject(reason);
			});
			amRequestsCache.set(cacheKey, request);
			return request;
		}) : Promise.reject('Endpoint is missing');

		function amGetArtist(artistId) {
			if (!(artistId > 0)) return Promise.reject('Invalid artist id');
			if (!amArtistCache && 'amArtistCache' in sessionStorage && canLoadCache()) try {
				amArtistCache = JSON.parse(sessionStorage.getItem('amArtistCache'));
			} catch(e) {
				sessionStorage.removeItem('amArtistCache');
				console.warn(e);
			}
			if (!amArtistCache) amArtistCache = { };
			else if (artistId in amArtistCache) return Promise.resolve(amArtistCache[artistId]);
			return amQueryAPI('artists/' + artistId.toString(), { extend: 'artistBio,bornOrFormed,isGroup,origin' }).then(function(response) {
				amArtistCache[artistId] = response.data[0];
				//saveSessionCache('amArtistCache', amArtistCache);
				return response.data[0];
			});
		}
		function amGetArtistAlbums(artistId) {
			if (!(artistId > 0)) return Promise.reject('Invalid artist id');
			if (!amArtistReleasesCache && 'amArtistReleasesCache' in sessionStorage && canLoadCache()) try {
				amArtistReleasesCache = JSON.parse(sessionStorage.getItem('amArtistReleasesCache'));
			} catch(e) {
				sessionStorage.removeItem('amArtistReleasesCache');
				console.warn(e);
			}
			if (!amArtistReleasesCache) amArtistReleasesCache = { };
			else if (artistId in amArtistReleasesCache) return Promise.resolve(amArtistReleasesCache[artistId]);
			return (function getPage(offset = 0) {
				return amQueryAPI(`artists/${artistId}/albums`, { offset: offset, limit: 100 }).then(response =>
					!response.next ? response.data : getPage(offset + response.data.length).then(data => response.data.concat(data)));
			})().then(function(albums) {
				amArtistReleasesCache[artistId] = albums;
				//saveSessionCache('amArtistReleasesCache', amArtistReleasesCache);
				return albums;
			});
		}
		const amRlsTypeMatch = (album, releaseType) => releaseType && {
			5: /*album.attributes.isSingle || */album.attributes.name.endsWith(' - EP'), // EP
			6: album.attributes.isCompilation, // Anthology
			7: album.attributes.isCompilation, // Compilation
			9: album.attributes.isSingle || album.attributes.name.endsWith(' - Single'), // Single
		}[releaseType];
		const amGetArtistMatches = (artistId, torrentGroups) => artistId > 0 ? Array.isArray(torrentGroups)
				&& torrentGroups.length > 0 ? amGetArtistAlbums(artistId).then(function(albums) {
			const listSize = Math.min(torrentGroups.length, albums.length);
			let groupIds = torrentGroups.filter(function(torrentGroup) {
				const titleNorm = [titleCmpNorm(torrentGroup.groupName), stripRlsSuffix(torrentGroup.groupName).toLowerCase()];
				return albums.some(function(album) {
					const releaseDate = album.attributes.releaseDate ? new Date(album.attributes.releaseDate) : undefined;
					if (releaseDate ? !(releaseDate.getUTCFullYear() >= torrentGroup.groupYear)
							: strictRlsYearMatching || releaseDate != undefined) return false;
					if (titleCmpNorm(album.attributes.name) == titleNorm[0]
							|| bilingualNamesMatch(torrentGroup.groupName, album.attributes.name)) return true;
					if (!releaseDate || (!strongEqualReleaseDate || releaseDate.getUTCFullYear() != torrentGroup.groupYear)
							&& !amRlsTypeMatch(album, torrentGroup.releaseType)) return false;
					return fuzzyTitlesMatch(stripRlsSuffix(album.attributes.name).toLowerCase(), titleNorm[1]);
				});
			}).map(torrentGroup => torrentGroup.groupId), matchScore = groupIds.length / listSize;
			if (groupIds.length > 0 && minMatchDivisor > 1 && matchScore < 1/minMatchDivisor) {
				console.log(`[AAM] Discarding Apple Music artist ${artistId} matches to ${groupIds.length} site releases due to low match score (${matchScore})`);
				groupIds = [ ];
			}
			return groupIds;
		}, reason => null) : Promise.resolve(null) : Promise.reject('Invalid argument');
		const amSearchArtist = (searchTerm = artist.name, anvs) => searchTerm ? amQueryAPI('search', {
			term: '"' + searchTerm + '"',
			types: 'artists',
		}).then(response => response.results && response.results.artists && response.results.artists.data
				&& response.results.artists.data.length > 0 ? response.results.artists.data.filter(function(artist) {
			if (artist.type != 'artists' || !artist.attributes) return false;
			const artistName = artist.attributes.name.toLowerCase();
			function anvMatch(anv) {
				if (!anv) return false; else if ((anv = anv.toLowerCase()) == artistName) return true;
				if (sameArtistConfidence > 0) return false;
				const score = jaroWrinkerSimilarity(anv, artistName);
				if (score < sameArtistConfidence * 0.90) return false;
				//console.log('[AAM] Jaro-Wrinker fuzzy match:', artistName, anv, `(${score.toFixed(3)})`)
				return true;
			}
			return anvMatch(searchTerm) || Array.isArray(anvs) && anvs.some(anvMatch);
		}) : [ ]).then(function(results) {
			if (!results || results.length <= 0) return searchVariants(amSearchArtist, searchTerm, anvs, true);
			console.log('[AAM] Apple Music search results for "' + searchTerm + '":', results);
			return results;
		}) : Promise.reject('Invalid argument');
		const amGetArtistBio = amArtist => amArtist && amArtist.attributes && amArtist.attributes.artistBio && [
			[/\<([biu])\>(.*?)\<\/\1\>/ig, '[b]$2[/b]'],
		].reduce((str, subst) => str.replace(...subst), amArtist.attributes.artistBio);

		// Beatport querying
		const bpRequestsCache = new Map;
		let bpArtistCache, bpArtistReleasesCache, bpAccessToken = null;

		const bpQueryAPI = (endPoint, params) => endPoint ? (function setAccessToken() {
			const isTokenValid = accessToken => accessToken && accessToken.token_type
				&& accessToken.access_token && accessToken.expires_at >= Date.now() + 30 * 1000;
			return bpAccessToken instanceof Promise ? bpAccessToken.then(accessToken =>
					isTokenValid(accessToken) ? accessToken : Promise.reject('expired or otherwise invalid')).catch(function(reason) {
				bpAccessToken = null;
				console.info('[AAM] Discarding Beatsource access token:', reason);
				return setAccessToken();
			}) : (bpAccessToken = (function() {
				if ('beatportAccessToken' in localStorage) try {
					const accessToken = JSON.parse(localStorage.getItem('beatportAccessToken'));
					if (!isTokenValid(accessToken)) throw 'Expired or otherwise invalid';
					console.info('[AAM] Re-using cached Beatport access token:', accessToken,
						'expires at', new Date(accessToken.expires_at).toTimeString(),
						'(+' + ((accessToken.expires_at - Date.now()) / 1000 / 60).toFixed(2) + 'm)');
					return Promise.resolve(accessToken);
				} catch(e) { localStorage.removeItem('beatportAccessToken') }
				const timeStamp = Date.now(), urlBase = 'https://www.beatport.com/api/auth';
				return GlobalXHR.get(urlBase + '/session', { responseType: 'json' }).then(function(response) {
					let cookie = response.cookies['__Secure-next-auth\\.session-token'];
					if (cookie) return response.json;
					const postData = { };
					if (cookie = response.cookies['__Host-next-auth\\.csrf-token'])
						postData.csrfToken = cookie.split('|')[0];
					else return Promise.reject('Cookie not received');
					if (cookie = response.cookies['__Secure-next-auth\\.callback-url'])
						postData.callbackUrl = cookie;
					else return Promise.reject('Cookie not received');
					return GlobalXHR.get(urlBase + '/callback/anonymous', new URLSearchParams(Object.assign(postData, { json: true }))).then(({cookies}) => cookies['__Secure-next-auth\\.session-token'] || Promise.reject('Cookie not received')).then(token => GlobalXHR.get(urlBase + '/session', {
						responseType: 'json',
						cookie: '__Secure-next-auth.session-token=' + token,
					})).then(({json}) => json);
				}).then(function({token}) {
					if (!(token = {
						token_type: token.tokenType,
						access_token: token.accessToken,
						timestamp: timeStamp,
						expires_in: token.expiresIn,
						expires_at: token.accessTokenExpires,
					}).expires_at) token.expires_at = token.timestamp + (token.expires_in_ms || token.expires_in * 1000);
					if (!isTokenValid(token)) {
						console.warn('[AAM] Received invalid Beatport token:', token);
						return Promise.reject('invalid token received');
					}
					try { localStorage.setItem('beatportAccessToken', JSON.stringify(token)) } catch(e) { console.warn(e) }
					console.log('[AAM] Beatport access token successfully set:',
						token, `(+${(Date.now() - token.timestamp) / 1000}s)`);
					return token;
				});
			})().catch(function() {
				if ('beatsourceAccessToken' in localStorage) try {
					var accessToken = JSON.parse(localStorage.getItem('beatsourceAccessToken'));
					if (!isTokenValid(accessToken)) throw 'Expired or otherwise invalid';
					console.info('[AAM] Re-using cached Beatsource access token:', accessToken,
						'expires at', new Date(accessToken.expires_at).toTimeString(),
						'(+' + ((accessToken.expires_at - Date.now()) / 1000 / 60).toFixed(2) + 'm)');
					return Promise.resolve(accessToken);
				} catch(e) {
					//console.warn('[AAM] Invalid BeatSource cached access token:', e, localStorage.beatsourceAccessToken);
					localStorage.removeItem('beatsourceAccessToken');
				}
				const root = 'https://www.beatsource.com/', timeStamp = Date.now();
				return GlobalXHR.get(root).then(function(response) {
					let accessToken = response.document.getElementById('__NEXT_DATA__');
					if (accessToken != null) try {
						accessToken = JSON.parse(accessToken.text);
						return Object.assign(accessToken.props.rootStore.authStore.user, {
							apiHost: accessToken.runtimeConfig.API_HOST,
							clientId: accessToken.runtimeConfig.API_CLIENT_ID,
							recurlyPublicKey: accessToken.runtimeConfig.RECURLY_PUBLIC_KEY,
						});
					} catch(e) { console.warn(e) }
					if (accessToken = response.cookies['btsrcSession']) try {
						accessToken = JSON.parse(decodeURIComponent(accessToken));
						let sessionId = response.cookies['sessionId'];
						if (sessionId) try { accessToken.sessionId = decodeURIComponent(sessionId) }
							catch(e) { console.warn(e) }
						return accessToken;
					} catch(e) { console.warn(e) }
					return Promise.reject('Beatsource OAuth2 access token could not be extracted');
				}).then(function(accessToken) {
					if (!accessToken.timestamp) accessToken.timestamp = timeStamp;
					if (!accessToken.expires_at) accessToken.expires_at = accessToken.timestamp +
						(accessToken.expires_in_ms || accessToken.expires_in * 1000);
					if (!isTokenValid(accessToken)) {
						console.warn('[AAM] Received invalid Beatsource token:', accessToken);
						return Promise.reject('invalid token received');
					}
					try { localStorage.setItem('beatsourceAccessToken', JSON.stringify(accessToken)) } catch(e) { console.warn(e) }
					console.log('[AAM] Beatsource access token successfully set:',
						accessToken, `(+${(Date.now() - accessToken.timestamp) / 1000}s)`);
					return accessToken;
				});
			}));
		})().then(function(accessToken) {
			const catRoot = '/v4/catalog/';
			const url = new URL(`${catRoot}${endPoint.replace(/^\/+|\/+$/g, '')}/`, 'https://api.beatport.com');
			if (params) url.search = new URLSearchParams(params);
			const cacheKey = url.pathname.slice(url.pathname.indexOf(catRoot) + catRoot.length) + url.search;
			if (bpRequestsCache.has(cacheKey)) return bpRequestsCache.get(cacheKey);
			const request = GlobalXHR.get(url, {
				responseType: 'json',
				headers: { Authorization: accessToken.token_type + ' ' + accessToken.access_token },
			}).then(({json}) => json);
			bpRequestsCache.set(cacheKey, request);
			return request;
		}) : Promise.reject('Endpoint is missing');
		function bpGetArtist(artistId) {
			if (!(artistId > 0)) return Promise.reject('Invalid artist id');
			if (!bpArtistCache && 'bpArtistCache' in sessionStorage && canLoadCache()) try {
				bpArtistCache = JSON.parse(sessionStorage.getItem('bpArtistCache'));
			} catch(e) {
				sessionStorage.removeItem('bpArtistCache');
				console.warn(e);
			}
			if (!bpArtistCache) bpArtistCache = { };
			else if (artistId in bpArtistCache) return Promise.resolve(bpArtistCache[artistId]);
			return bpQueryAPI('artists/' + artistId.toString()).then(function(response) {
				bpArtistCache[artistId] = response;
				bpRequestsCache.delete(`artists/${artistId.toString()}/`);
				//saveSessionCache('bpArtistCache', bpArtistCache);
				return response;
			});
		}
		const bpReflowArtistBio = bpArtist => bpArtist && bpArtist.bio
			&& bpArtist.bio.trim().replace(/[ \t\xA0]+/g, ' ').split(/(?: *\r?\n){2,}/)
				.map(paragraph => paragraph.replace(/(?: *\r?\n)+/g, ' ').replace(/ +/g, ' ').replace(/^ +| +$/g, ''))
				.join('\n\n') || null;
		function bpGetArtistImage(bpArtist, resolution) {
			if (!bpArtist || !bpArtist.image || !bpArtist.image.dynamic_uri || [
				'0dc61986-bccf-49d4-8fad-6b147ea8f327.jpg',
				'd02c012b-67d4-4058-a75f-3fbabdb8d19d.jpg',
			].some(fn => bpArtist.image.dynamic_uri.endsWith('/' + fn))) return null;
			return resolution ? bpArtist.image.dynamic_uri.replace(/\{[wh]\}/g, resolution)
				: bpArtist.image.dynamic_uri.replace(/\/image_size\/[^\/]+\//, '/');
		}
		function bpGetArtistReleases(artistId) {
			if (!(artistId > 0)) return Promise.reject('Invalid artist id');
			if (!bpArtistReleasesCache && 'bpArtistReleasesCache' in sessionStorage && canLoadCache()) try {
				bpArtistReleasesCache = JSON.parse(sessionStorage.getItem('bpArtistReleasesCache'));
			} catch(e) {
				sessionStorage.removeItem('bpArtistReleasesCache');
				console.warn(e);
			}
			if (!bpArtistReleasesCache) bpArtistReleasesCache = { };
			else if (artistId in bpArtistReleasesCache) return Promise.resolve(bpArtistReleasesCache[artistId]);
			const getPage = (page = 1) => bpQueryAPI('releases', { artist_id: artistId, page: page, per_page: 1000 })
				.then(response => response.next ? getPage(page + 1).then(results => response.results.concat(results))
					: response.results).then(function(results) {
				bpArtistReleasesCache[artistId] = results;
				//saveSessionCache('bpArtistReleasesCache', bpArtistReleasesCache);
				return results;
			});
			return getPage();
		}
		const bpGetArtistMatches = (artistId, torrentGroups) => artistId > 0 ? Array.isArray(torrentGroups)
				&& torrentGroups.length > 0 ? bpGetArtistReleases(artistId).then(function(releases) {
			const listSize = Math.min(torrentGroups.length, releases.length);
			let groupIds = torrentGroups.filter(function(torrentGroup) {
				const titleNorm = [titleCmpNorm(torrentGroup.groupName), stripRlsSuffix(torrentGroup.groupName).toLowerCase()];
				return releases.some(function(release) {
					const newReleaseDate = release.new_release_date ? new Date(release.new_release_date) : undefined,
								publishDate = release.publish_date ? new Date(release.publish_date) : undefined;
					if (newReleaseDate ? !(newReleaseDate.getUTCFullYear() >= torrentGroup.groupYear)
							: strictRlsYearMatching || newReleaseDate != undefined) return false;
					if (titleCmpNorm(release.name) == titleNorm[0]
							|| bilingualNamesMatch(torrentGroup.groupName, release.name)) return true;
					if (!newReleaseDate || newReleaseDate.getUTCFullYear() != torrentGroup.groupYear) return false;
					if (strongEqualReleaseDate && fuzzyTitlesMatch(stripRlsSuffix(release.name).toLowerCase(), titleNorm[1])) return true;
					return false;
				});
			}).map(torrentGroup => torrentGroup.groupId), matchScore = groupIds.length / listSize;
			if (groupIds.length > 0 && minMatchDivisor > 1 && matchScore < 1/minMatchDivisor) {
				console.log(`[AAM] Discarding Beatport artist ${artistId} matches to ${groupIds.length} site releases due to low match score (${matchScore})`);
				groupIds = [ ];
			}
			return groupIds;
		}, reason => null) : Promise.resolve(null) : Promise.reject('Invalid argument');
		const bpSearchArtist = (searchTerm = artist.name, anvs) => searchTerm ? bpQueryAPI('search', {
			q: '"' + searchTerm + '"',
			type: 'artists',
			per_page: 100,
		}).then(function(response) {
			let results = response.count > 0 ? response.artists.filter(function(artist) {
				if (!artist.name) return false;
				const name = artist.name.toLowerCase();
				function anvMatch(anv) {
					if (!anv) return false; else if ((anv = anv.toLowerCase()) == name) return true;
					if (sameArtistConfidence > 0) return false;
					const score = jaroWrinkerSimilarity(anv, name);
					if (score < sameArtistConfidence * 0.90) return false;
					//console.log('[AAM] Jaro-Wrinker fuzzy match:', name, anv, `(${score.toFixed(3)})`)
					return true;
				}
				return anvMatch(searchTerm) || Array.isArray(anvs) && anvs.some(anvMatch);
			}) : [ ];
			if (!results || results.length <= 0) return searchVariants(bpSearchArtist, searchTerm, anvs, true);
			console.log('[AAM] Beatport search results for "' + searchTerm + '":', results);
			return results;
		}) : Promise.reject('Invalid argument');

		// SoundCloud querying
		const scRequestsCache = new Map;
		let scUserCache, scUserReleasesCache;

		const scQueryAPI = (endPoint, params) => endPoint ? ('scClientId' in sessionStorage ?
				Promise.resolve(sessionStorage.getItem('scClientId')) : GlobalXHR.get('https://soundcloud.com/').then(function({document}) {
			const script = document.body.querySelector(':scope > script[crossorigin]:last-of-type');
			if (script == null) return Promise.reject('SoundCloud: unexpected page structure');
			return GlobalXHR.get(script.src, { responseType: 'text', headers: { accept: 'text/javascript' } });
		}).then(function({responseText}) {
			let clientId = /\b(?:client_id)\s*:\s*"(\S{32})"/.exec(responseText);
			if (clientId == null) return Promise.reject('SoundCloud: client_id could not be captured');
			sessionStorage.setItem('scClientId', clientId = clientId[1]);
			return clientId;
		})).then(function(clientId) {
			const url = new URL(endPoint.replace(/^\/+|\/+$/g, ''), 'https://api-v2.soundcloud.com');
			if (params) url.search = new URLSearchParams(params);
			const cacheKey = url.pathname.slice(1) + url.search;
			if (scRequestsCache.has(cacheKey)) return scRequestsCache.get(cacheKey);
			url.searchParams.set('client_id', clientId);
			url.searchParams.set('app_locale', 'en');
			const request = GlobalXHR.get(url, { responseType: 'json' }).then(({json}) => json);
			scRequestsCache.set(cacheKey, request);
			return request;
		}) : Promise.reject('Endpoint is missing');

		function scGetUser(userId) {
			if (!(userId > 0)) return Promise.reject('Invalid artist id');
			if (!scUserCache && 'scUserCache' in sessionStorage && canLoadCache()) try {
				scUserCache = JSON.parse(sessionStorage.getItem('scUserCache'));
			} catch(e) {
				sessionStorage.removeItem('scUserCache');
				console.warn(e);
			}
			if (!scUserCache) scUserCache = { };
			else if (userId in scUserCache) return Promise.resolve(scUserCache[userId]);
			return scQueryAPI('users/' + userId.toString()).then(function(response) {
				scUserCache[userId] = response;
				scRequestsCache.delete('users/' + userId.toString());
				//saveSessionCache('scUserCache', scUserCache);
				return response;
			});
		}
		function scGetUserImage(scUser, resolution) {
			if (!scUser || !scUser.avatar_url || [
				'/default_avatar_large.png',
			].some(id => scUser.avatar_url.endsWith(id))) return null;
			return scUser.avatar_url.replace(/-\w+(?=\.\w+$)/, '-' +
				(resolution > 0 ? `t${resolution}x${resolution}` : 'original'));
		}
		function scGetUserAlbums(userId) {
			if (!(userId > 0)) return Promise.reject('Invalid artist id');
			if (!scUserReleasesCache && 'scUserReleasesCache' in sessionStorage && canLoadCache()) try {
				scUserReleasesCache = JSON.parse(sessionStorage.getItem('scUserReleasesCache'));
			} catch(e) {
				sessionStorage.removeItem('scUserReleasesCache');
				console.warn(e);
			}
			if (!scUserReleasesCache) scUserReleasesCache = { };
			if (userId in scUserReleasesCache) return Promise.resolve(scUserReleasesCache[userId]);
			return scQueryAPI('users/' + userId + '/albums', { /*offset: offset, */limit: 20000 }).then(function(response) {
				scUserReleasesCache[userId] = response.collection;
				//saveSessionCache('scUserReleasesCache', scUserReleasesCache);
				if (response.next_href != null) console.warn('[AAM] scGetUserAlbums returning incomplete list (next_href != null)', userId);
				return response.collection;
			});
		}
		const scGetUserMatches = (userId, torrentGroups) => userId > 0 ? Array.isArray(torrentGroups)
				&& torrentGroups.length > 0 ? scGetUserAlbums(userId).then(function(albums) {
			const listSize = Math.min(torrentGroups.length, albums.length);
			let groupIds = torrentGroups.filter(function(torrentGroup) {
				const titleNorm = [titleCmpNorm(torrentGroup.groupName), stripRlsSuffix(torrentGroup.groupName).toLowerCase()];
				return albums.some(function(album) {
					const releaseDate = album.release_date ? new Date(album.release_date) : undefined;
					if (releaseDate ? !(releaseDate.getUTCFullYear() >= torrentGroup.groupYear)
							: strictRlsYearMatching || releaseDate != undefined) return false
					if (titleCmpNorm(album.title) == titleNorm[0]
							|| bilingualNamesMatch(torrentGroup.groupName, album.title)) return true;
					if (!releaseDate || releaseDate.getUTCFullYear() != torrentGroup.groupYear) return false;
					if (strongEqualReleaseDate && fuzzyTitlesMatch(stripRlsSuffix(album.title).toLowerCase(), titleNorm[1])) return true;
					return false;
				});
			}).map(torrentGroup => torrentGroup.groupId), matchScore = groupIds.length / listSize;
			if (groupIds.length > 0 && minMatchDivisor > 1 && matchScore < 1/minMatchDivisor) {
				console.log(`[AAM] Discarding SoundCloud artist ${userId} matches to ${groupIds.length} site releases due to low match score (${matchScore})`);
				groupIds = [ ];
			}
			return groupIds;
		}, reason => null) : Promise.resolve(null) : Promise.reject('Invalid argument');
		const scSearchUser = (searchTerm = artist.name, anvs) => searchTerm ? scQueryAPI('search/users', {
			q: searchTerm,
			limit: 100,
		}).then(response => response.total_results > 0 ? response.collection.filter(function(result) {
			if (result.kind != 'user' || !result.username) return false;
			function propMatch(propName) {
				if (propName in result) propName = result[propName].toLowerCase(); else return false;
				if (!propName) return false;
				function anvMatch(anv) {
					if (!anv) return false; else if ((anv = anv.toLowerCase()) == propName) return true;
					if (sameArtistConfidence > 0) return false;
					const score = jaroWrinkerSimilarity(anv, propName);
					if (score < sameArtistConfidence * 0.90) return false;
					//console.log('[AAM] Jaro-Wrinker fuzzy match:', name, anv, `(${score.toFixed(3)})`)
					return true;
				}
				return anvMatch(searchTerm) || Array.isArray(anvs) && anvs.some(anvMatch);
			}
			return propMatch('username') || propMatch('full_name');
		}) : [ ]).then(function(results) {
			if (!results || results.length <= 0) return searchVariants(scSearchUser, searchTerm, anvs, true);
			console.log('[AAM] SoundCloud search results for "' + searchTerm + '":', results);
			return results;
		}) : Promise.reject('Invalid argument');

		// NetEase querying
		const neRequestsCache = new Map;
		let neArtistCache, neArtistReleasesCache, neLastCachedSuccess, neDesktopEnvironment = null;

		function neQueryAPI(endPoint, params) {
			if (!endPoint) return Promise.reject('Endpoint is missing');
			const url = new URL('api/' + endPoint.replace(/^\/+|\/+$/g, ''), 'https://music.163.com');
			if (params) url.search = new URLSearchParams(params);
			const cacheKey = url.pathname.slice(5) + url.search;
			if (neRequestsCache.has(cacheKey)) return neRequestsCache.get(cacheKey);
			const request = GlobalXHR.get(url, { responseType: 'json' }).then(({json}) => json ?
				json.code >= 200 && json.code < 400 ? json : Promise.reject('Error ' + json.code)
					: Promise.reject('Invalid response'));
			neRequestsCache.set(cacheKey, request);
			return request;
		}
		function neGetArtist(artistId) {
			if (!(artistId > 0)) return Promise.reject('Invalid artist id');
			if (!neArtistCache && 'neArtistCache' in sessionStorage && canLoadCache()) try {
				neArtistCache = JSON.parse(sessionStorage.getItem('neArtistCache'));
			} catch(e) {
				sessionStorage.removeItem('neArtistCache');
				console.warn(e);
			}
			if (!neArtistCache) neArtistCache = { };
			else if (artistId in neArtistCache) return Promise.resolve(neArtistCache[artistId]);
			return neQueryAPI('artist/' + artistId.toString()).then(function({artist}) {
				if (!artist) return Promise.reject('Invalid response');
				neArtistCache[artistId] = artist;
				neRequestsCache.delete('artist/' + artistId.toString());
				//saveSessionCache('neArtistCache', neArtistCache);
				return artist;
			});
		}
		function neGetArtistAlbums(artistId) {
			if (!(artistId > 0)) return Promise.reject('Invalid artist id');
			if (!neArtistReleasesCache && 'neArtistReleasesCache' in sessionStorage && canLoadCache()) try {
				neArtistReleasesCache = JSON.parse(sessionStorage.getItem('neArtistReleasesCache'));
			} catch(e) {
				sessionStorage.removeItem('neArtistReleasesCache');
				console.warn(e);
			}
			if (!neArtistReleasesCache) neArtistReleasesCache = { };
			else if (artistId in neArtistReleasesCache) return Promise.resolve(neArtistReleasesCache[artistId]);
			const getAlbums = (offset = 0) => neQueryAPI('artist/albums/' + artistId, { offset: offset, limit: 1000 })
				.then(response => !response.more ? response.hotAlbums
					: getAlbums(offset + response.hotAlbums.length).then(albums => response.hotAlbums.concat(albums)));
			return getAlbums().then(function(albums) {
				if (!Array.isArray(albums)) return Promise.reject('Invalid response');
				neArtistReleasesCache[artistId] = albums;
				//saveSessionCache('neArtistReleasesCache', neArtistReleasesCache);
				return albums;
			});
		}
		const neGetArtistMatches = (artistId, torrentGroups) => artistId > 0 ? Array.isArray(torrentGroups)
				&& torrentGroups.length > 0 ? neGetArtistAlbums(artistId).then(function(albums) {
			const listSize = Math.min(torrentGroups.length, albums.length);
			let groupIds = torrentGroups.filter(function(torrentGroup) {
				const titleNorm = [titleCmpNorm(torrentGroup.groupName), stripRlsSuffix(torrentGroup.groupName).toLowerCase()];
				return albums.some(function(album) {
					const publishTime = album.publishTime ? new Date(album.publishTime) : undefined;
					if (publishTime ? !(publishTime.getUTCFullYear() >= torrentGroup.groupYear)
							: strictRlsYearMatching || publishTime != undefined) return false;
					if (titleCmpNorm(album.name) == titleNorm[0]
							|| bilingualNamesMatch(torrentGroup.groupName, album.name)) return true;
					if (!publishTime || publishTime.getUTCFullYear() != torrentGroup.groupYear) return false;
					if (strongEqualReleaseDate && fuzzyTitlesMatch(stripRlsSuffix(album.name).toLowerCase(), titleNorm[1])) return true;
					return false;
				});
			}).map(torrentGroup => torrentGroup.groupId), matchScore = groupIds.length / listSize;
			if (groupIds.length > 0 && minMatchDivisor > 1 && matchScore < 1/minMatchDivisor) {
				console.log(`[AAM] Discarding NetEase artist ${artistId} matches to ${groupIds.length} site releases due to low match score (${matchScore})`);
				groupIds = [ ];
			}
			return groupIds;
		}, reason => null) : Promise.resolve(null) : Promise.reject('Invalid argument');
		const neSearchArtist = (searchTerm = artist.name, anvs) => searchTerm ? neQueryAPI('cloudsearch/get/web', {
			s: '"' + searchTerm + '"',
			type: 100,
			limit: 100,
			//csrf_token: '',
		}).then(function(response) {
			if (!response.result) return Promise.reject('API returns malformed result');
			return !response.abroad ? response.result : (function() {
				function injectScript(src, errorHandler) {
					console.assert(src);
					coreJS = document.createElement('SCRIPT');
					coreJS.id = 'netease.core.js';
					coreJS.type = 'text/javascript';
					coreJS.async = false;
					const promise = new Promise(function(resolve, reject) {
						function errorHandler(currentTarget, reason) {
							console.warn('[AAM] NetEase core.js (%s): %s', currentTarget.src, reason);
							if (typeof errorHandler == 'function') errorHandler(resolve, reject, currentTarget);
								else reject('NetEase core.js ' + reason);
						}

						coreJS.onload = function(evt) {
							if ([/*'asrsea', */'settmusic'].every(function(pubSym) {
								try { return typeof eval(pubSym) == 'function' } catch(e) { return false }
							})) resolve(evt.currentTarget); else errorHandler(evt.currentTarget, 'public functions not accessible');
						};
						coreJS.onerror = evt => { errorHandler(evt.currentTarget, 'loading error') };
						coreJS.src = src;
						document.head.append(coreJS);
					});
					return (coreJS.loader = promise);
				}

				var coreJS = document.getElementById('netease.core.js');
				if (coreJS != null && coreJS.loader instanceof Promise) return coreJS.loader;
				return injectScript('https://s1.music.126.net/web/s/core.js', function(resolve, reject, currentScript) {
					console.warn('[AAM] Trying to fetch core.js url from root doc');
					GlobalXHR.get('https://music.163.com/').then(function({document}) {
						const script = document.body.querySelector(':scope > script[src*="/core"]');
						if (script != null && script.src) {
							window.document.head.removeChild(currentScript);
							injectScript(script.src).then(resolve, reject);
						} else reject('Invalid root document structure');
					}, reject);
				});
			})().then(core => decodeURIComponent(settmusic(response.result, 'fuck~#$%^&*(458')));
		}).then(result => JSON.parse(result)).then(result => result.artistCount > 0 ? result.artists : null, function(reason) {
			console.warn('[AAM] NetEase search-list method failed:', reason);
			return neQueryAPI('search/suggest/web', {
				s: '"' + artist + '"',
				type: 100,
				limit: 50,
				//csrf_token: '',
			}).then(response => response.result ? Array.isArray(response.result.artists) ?
				response.result.artists : null : Promise.reject('API returns malformed result'));
		}).then(results => Array.isArray(results) && results.filter(function(artist) {
			const artistName = artist.name.toLowerCase();
			function anvMatch(anv) {
				if (!anv) return false; else if ((anv = anv.toLowerCase()) == artistName) return true;
				if (sameArtistConfidence > 0) return false;
				const score = jaroWrinkerSimilarity(anv, artistName);
				if (score < sameArtistConfidence * 0.90) return false;
				//console.log('[AAM] Jaro-Wrinker fuzzy match:', artistName, anv, `(${score.toFixed(3)})`)
				return true;
			}
			return anvMatch(searchTerm) || Array.isArray(anvs) && anvs.some(anvMatch);
		})).then(function(results) {
			if (!results || results.length <= 0) return searchVariants(neSearchArtist, searchTerm, anvs, true);
			console.log('[AAM] NetEase search results for "' + searchTerm + '":', results);
			return results;
		}) : Promise.reject('Invalid argument');

		// Shazam querying
		const shRequestsCache = new Map;
		function shQueryAPI(endPoint, params) {
			if (!endPoint) return Promise.reject('Endpoint is missing');
			const catRoot = '/catalog/US/';
			const url = new URL('/services/amapi/v1' + catRoot + endPoint.replace(/^\/+|\/+$/g, ''), 'https://www.shazam.com');
			if (params) url.search = new URLSearchParams(params);
			const cacheKey = url.pathname.slice(url.pathname.indexOf(catRoot) + catRoot.length) + url.search;
			if (shRequestsCache.has(cacheKey)) return shRequestsCache.get(cacheKey);
			url.searchParams.set('omit[resource]', 'relationships,views,meta,autos');
			url.searchParams.set('l', 'en-us');
			url.searchParams.set('platform', 'web');
			const request = GlobalXHR.get(url, { responseType: 'json' }).then(({json}) => json);
			shRequestsCache.set(cacheKey, request);
			return request;
		}

		if (artistEdit) {
			function setTooltip(elem, content) {
				if (!elem) throw 'Invalid argument';
				window.tooltipster.then(function() {
					if (content) content = content.replace(/\r?\n/g, '<br>');
					if ($(elem).data('plugin_tooltipster'))
						if (content) $(elem).tooltipster('update', content).tooltipster('enable');
							else $(elem).tooltipster('disable');
					else if (content) $(elem).tooltipster({ content: content });
				}).catch(function(reason) {
					if (content) elem.title = content; else elem.removeAttribute('title');
					console.warn(reason);
				});
			}

			// Combined search with cross identifications... time expensive!
			const useMusicBrainz = GM_getValue('use_musicbrainz', true);
			const useAppleMusic = GM_getValue('use_applemusic', true);
			const useBeatport = GM_getValue('use_beatport', true);
			const useSoundCloud = GM_getValue('use_soundcloud', true);
			const useNetease = GM_getValue('use_netease');
			const smallestCachedScorePool = GM_getValue('search_min_cached_pool', 50);
			const smallestLoggedScorePool = GM_getValue('search_min_logged_pool', 1e5);
			const isSiteKey = siteKey => siteKey && (/^(?:\w+Artist)$/.test(siteKey) || ['scUser'].includes(siteKey));
			const isMergableKey = siteKey => ['bpArtist', 'amArtist', 'scUser', 'neArtist'].includes(siteKey);
			const getProfileTagsRate = (tags, a = artist) => Array.isArray(a.torrentgroup) && Array.isArray(a.torrentgroup) ?
				a.torrentgroup.filter(torrentGroup => torrentGroup.tags.some(tag => tags.includes(tag))).length
					/ a.torrentgroup.length : undefined;

			if ('artistMatchScores' in sessionStorage && canLoadCache()) try {
				var artistMatchScores = JSON.parse(sessionStorage.getItem('artistMatchScores'));
			} catch(e) {
				sessionStorage.removeItem('artistMatchScores');
				console.warn('[AAM] Incomplete or corrupted cache for artist match scores:',e);
				artistMatchScores = { };
			} else artistMatchScores = { };
			function commitScoresCache() {
				if (!saveSessionCache('artistMatchScores', artistMatchScores)) return;
				console.log(`[AAM] Successfully saved artist match scores cache (${Object.keys(artistMatchScores).length})`);
			}

			function urlToId(url) {
				if (url) try {
					let _url = /^(?:https?):\/\//i.test(url = url.trim()) ? url : 'http://' + url;
					_url = new URL(_url);
					let domain = _url.hostname.toLowerCase().split('.').slice(-2).join('.');
					if (domain == 'bandcamp.com') return 'bc:' + decodeURIComponent(_url.hostname.split('.')[0]).toLowerCase();
					if (![
						'facebook.com', 'facebook.me', 'discogs.com', 'musicbrainz.org', 'apple.com',
						'qobuz.com', 'spotify.com', 'deezer.com',
						'beatport.com', 'soundcloud.com', 'youtube.com', 'twitter.com', 'facebook.com',
						'myspace.com', 'mixcloud.com', 'last.fm', 'shazam.com', 'spotify.com', '163.com', 'ra.com',
					].includes(domain)) domain = _url.hostname.replace(/^(?:(?:www|api|play|listen|music)\.)+/i, '').toLowerCase();
					switch (domain) {
						case 'discogs.com':
							var id = /\/artists?\/(\d+)\b/i.exec(_url.pathname);
							if (id != null) return 'dc:' + id[1]; else break;
						case 'musicbrainz.org':
							id = /\/artist\/([a-f\d\-])(?=\/|$)/i.exec(_url.pathname);
							if (id != null) return 'mb:' + id[1].toLowerCase(); else break;
						case 'apple.com': case 'itunes.com':
							id = /\/artist(?:\/.+?)?\/(?:id)?(\d+)(?=\/|$)/i.exec(_url.pathname);
							if (id != null) return 'am:' + id[1]; else break;
						case 'beatport.com':
							id = /\/artist(?:\/.+?)?\/(\d+)(?=\/|$)/i.exec(_url.pathname);
							if (id != null) return 'bp:' + id[1]; else break;
						case 'soundcloud.com':
							id = /^\/users\/(\d+)(?=\/|$)/i.exec(_url.pathname);
							if (id != null) return 'sc:' + id[1];
							id = /^\/([\w\-\.\%\+\(\)%]+)(?=\/|$)/i.exec(_url.pathname);
							if (id != null) return 'sc:' + decodeURIComponent(id[1]).toLowerCase(); else break;
						case 'youtube.com':
							id = /^\/(?:user|channel|c)\/([\w\-\%\+\.\(\)]+)(?=\/|$)/i.exec(_url.pathname);
							if (id != null) return 'yt:' + decodeURIComponent(id[1]).toLowerCase();
							id = /^\/([\w\-\%\+\.\(\)]+)\/?$/i.exec(_url.pathname);
							if (id != null) return 'yt:' + decodeURIComponent(id[1]).toLowerCase(); else break;
						case 'twitter.com':
							id = /^\/([\w\-\%\+\.\(\)]+)(?=\/|$)/i.exec(_url.pathname);
							if (id != null) return 'tw:' + decodeURIComponent(id[1]).toLowerCase(); else break;
						case 'facebook.com': case 'facebook.me':
							if (_url.pathname.endsWith('/profile.php') && (id = parseInt(_url.searchParams.get('id'))) > 0)
								return 'fb:' + id;
							id = /^\/(?:bounce_page\/)?(?:'w*\#\!\/)?pages(?:\/.+?)\/(\d+)(?=\/|$)/i.exec(_url.pathname);
							if (id != null) return 'fb:' + id[1];
							id = /^\/(?:bounce_page\/)?(?:\w*\#\!\/)?pages\/([\w\-\%\+\.\(\)]+)(?=\/|$)/i.exec(_url.pathname);
							if (id != null) return 'fb:' + decodeURIComponent(id[1]).toLowerCase();
							id = /^\/(?:bounce_page\/)?(?:\w*\#\!\/)?([\w\-\%\+\.\(\)]+)\/?$/i.exec(_url.pathname);
							if (id != null) return 'fb:' + decodeURIComponent(id[1]).toLowerCase(); else break;
						case 'myspace.com':
							id = /^\/([\w\-\%\+\.\(\)]+)(?=\/|$)/i.exec(_url.pathname);
							if (id != null) return 'msp:' + decodeURIComponent(id[1]).toLowerCase(); else break;
						case 'mixcloud.com':
							id = /^\/([\w\-\%\+\.\(\)]+)(?=\/|$)/i.exec(_url.pathname);
							if (id != null) return 'mxc:' + decodeURIComponent(id[1]).toLowerCase(); else break;
						case 'last.fm':
							id = /^\/music\/([\w\-\%\+\.\(\)]+)(?=\/|$)/i.exec(_url.pathname);
							if (id != null) return 'lfm:' + decodeURIComponent(id[1]).toLowerCase(); else break;
						case 'allmusic.com':
							id = /^\/artist\/mn(\d+)(?=\/|$)/i.exec(_url.pathname);
							if (id != null) return 'alm:' + id[1]; else break;
						case 'rateyourmusic.com':
							id = /^\/artist\/([\w\-\%\+\.\(\)]+)(?=\/|$)/i.exec(_url.pathname);
							if (id != null) return 'rym:' + decodeURIComponent(id[1]); else break;
						case 'wikipedia.org':
							id = /^\/wiki\/([\w\-\%\+\.\(\)]+)\/?$/i.exec(_url.pathname);
							if (id != null) return 'wi:' + id[1]; else break;
						case 'wikidata.org':
							id = /^\/wiki\/q(\d+)\/?$/i.exec(_url.pathname);
							if (id != null) return 'wd:' + id[1]; else break;
						case 'shazam.com':
							id = /\/artist(?:\/.+?)?\/(\d+)(?=\/|$)/i.exec(_url.pathname);
							if (id != null) return 'shz:' + id[1]; else break;
						case 'deezer.com':
							id = /\/artist\/(\d+)(?=\/|$)/i.exec(_url.pathname);
							if (id != null) return 'dzr:' + id[1]; else break;
						case 'spotify.com':
							id = /\/artist(?:\/.+?)?\/(\w+)(?=\/|$)/i.exec(_url.pathname);
							if (id != null) return 'spf:' + id[1].toLowerCase(); else break;
						case 'qobuz.com':
							id = /\/interpreter\/([\w\-\%\+\.\(\)]+)(?=\/|$)/i.exec(_url.pathname);
							if (id != null) return 'qb:' + decodeURIComponent(id[1]).toLowerCase(); else break;
						case '163.com':
							if (/\/artist\/?$/i.test(_url.pathname)) id = parseInt(_url.searchParams.get('id'));
							if (id > 0) return 'ne:' + id; else break;
						case 'ra.co':
							id = /\/(?:artist|dj|profile)\/([\w\-\%\+\.\(\)]+)(?=\/|$)/i.exec(_url.pathname);
							if (id != null) return 'ra:' + decodeURIComponent(id[1]); else break;
					}
					return domain + (_url.pathname + _url.search).toLowerCase();
				} catch(e) {
					console.warn('[AAM] Invalid URL:', url);
					return url.toLowerCase();
				}
			}
			function addSearchResultsTotals(results) {
				if (!Array.isArray(results)) throw 'Invalid argument';
				if (results.length <= 0) return results;
				const hasMG = result => result && 'matchedGroups' in result && Array.isArray(result.matchedGroups);
				const maxMatches = Math.max(...results.map(result => hasMG(result) ? result.matchedGroups.length : -1));
				const maxIndex = maxMatches > 0 ? results.findIndex(result =>
					hasMG(result) && result.matchedGroups.length == maxMatches) : 0;
				return Object.assign(results, { bestMatch: results[maxIndex] });
			}
			function stripDcRelativesFromResults(results, pivot) {
				if (!results) throw 'Invalid argument';
				return pivot && results.length > 1 ? addSearchResultsTotals(results.filter(function(result) {
					if (!result.discogsArtist) return true;
					return !['aliases', 'groups', 'members'].some(propName => Array.isArray(pivot[propName])
						&& pivot[propName].some(linkedArtist => linkedArtist.id == result.discogsArtist.id));
				})) : results;
			}
			function searchArtistWorldwide(siteArtist = artist, consolidateDcRelatives = false, anvs) {
				function mergeResults(fromResult, toResult) {
					if (!fromResult || !toResult) throw 'Invalid argument';
					const getArrays = result => Object.keys(result).filter(key => !isSiteKey(key)
						&& Array.isArray(result[key]) && result[key].length > 0);
					const sourceArrays = getArrays(fromResult), targetArrays = getArrays(toResult);
					let mergedArrays = sourceArrays.concat(targetArrays).filter(uniqueValuesFilter)
						.map(key => ({ [key]: (targetArrays.includes(key) ? toResult[key] : [ ])
							.concat(sourceArrays.includes(key) ? fromResult[key] : [ ]).filter(uniqueValuesFilter) }));
					mergedArrays = mergedArrays.length > 0 ? Object.assign.apply({ }, mergedArrays) : null;
					for (let key in fromResult) if (isSiteKey(key) && !(key in toResult)) toResult[key] = fromResult[key];
					if (mergedArrays) Object.assign(toResult, mergedArrays);
				}
				function consolidateResults(results, fromIndex, toIndex, honourPopulation = true) {
					if (!(toIndex >= 0 && toIndex < results.length)
							|| !(fromIndex >= 0 && fromIndex < results.length)) throw 'Index out of range';
					if (fromIndex == toIndex) return -1;
					if (honourPopulation && Array.isArray(results[fromIndex].matchedGroups)
							&& results[fromIndex].matchedGroups.length > (Array.isArray(results[toIndex].matchedGroups) ?
								results[toIndex].matchedGroups.length : 0)) [fromIndex, toIndex] = [toIndex, fromIndex];
					console.log('[AAM] Consolidating search results:', results[fromIndex], `[${fromIndex}]`, '=>',
						results[toIndex], `[${toIndex}]`);
					mergeResults(results[fromIndex], results[toIndex]);
					results.splice(fromIndex, 1);
					return fromIndex;
				}
				function consolidateResults3(results, scoreFunc) {
					if (typeof scoreFunc != 'function') throw 'The parameter must be a valid callback';
					while (true) {
						const scores = results.map((result1, ndx1) => results.map(function(result2, ndx2) {
							if (ndx2 == ndx1) return -Infinity;
							if (Object.keys(result2).filter(isSiteKey).some(siteKey => !isMergableKey(siteKey)
									&& Object.keys(result1).filter(isSiteKey).includes(siteKey))) return -1;
							return Number(scoreFunc(result1, result2)) || 0;
						}));
						const scores2 = scores.map(scores => Math.max(...scores)), hiScore = Math.max(...scores2);
						if (!(hiScore > 0)) break;
						const ndx1 = scores2.indexOf(hiScore), ndx2 = scores[ndx1].indexOf(hiScore);
						console.assert(ndx1 >= 0, 'ndx1 >= 0'); console.assert(ndx2 >= 0, 'ndx2 >= 0');
						console.assert(ndx2 != ndx1, 'ndx2 != ndx1');
						console.log(`[AAM] Pairing results by highest matched groups score (${hiScore}):`,
							results[ndx1], `[${ndx1}]`, results[ndx2], `[${ndx2}]`);
						consolidateResults(results, ndx2, ndx1);
					}
				}

				if (!siteArtist || !siteArtist.id || !siteArtist.name) throw 'Invalid argument';
				if (isPseudoArtist(siteArtist.name)) return Promise.reject('Pseudo artist');
				function xtrnLinksMapper(urls) {
					if (!Array.isArray(urls) || urls.length <= 0) return null;
					const rx = /^(\w+):(.+)/;
					return (urls = urls.map(urlToId).filter(Boolean).filter(function(id, ndx, array) {
						if ((id = rx.exec(id)) == null || id[1].toLowerCase().startsWith('http')) return true;
						const count = array.filter(id2 => (id2 = rx.exec(id2)) != null && id2[1] == id[1]).length;
						console.assert(count > 0);
						if (count > 1) console.info('[AAM] Discarding ambiguous external id', id[0]);
						return count < 2;
					})).length > 0 ? urls : null;
				}
				console.time(siteArtist.name);
				const releases = getWhateverList(siteArtist);
				const dcLookup = discogsSearchArtist(siteArtist.name, anvs).then(results => Promise.all(results.map(result =>
						resolveDiscogsEntry('artist', result.id).then(artistId => Promise.all([
					getDiscogsEntry('artist', artistId).catch(reason => ({ name: result.title })),
					getDiscogsMatches(artistId, releases),
				]).then(output => ({
					discogsArtist: Object.assign({ }, output[0], {
						id: artistId,
						uri: /*result.id == artistId ? result.uri : */`${dcOrigin}/artist/${artistId}`,
					}),
					matchedGroups: output[1] && output[1].length > 0 ? output[1] : null,
					xtrnIds: xtrnLinksMapper(output[0].urls),
				}), reason => null)))).then(results => results.filter(Boolean).filter((result1, index, array) =>
					array.findIndex(result2 => result2.discogsArtist.id == result1.discogsArtist.id) == index)));
				const mbLookup = useMusicBrainz ? mbSearchArtist(siteArtist.name, anvs).then(results => Promise.all(results.map(result => Promise.all([
					mbGetArtist(result.id).catch(reason => result),
					mbGetArtistMatches(result.id, releases),
				]).then(function(output) {
					const result = {
						mbArtist: Object.defineProperty(Object.assign({ }, output[0]), 'uri', {
							get: function() { return 'https://musicbrainz.org/artist/' + this.id },
						}),
						matchedGroups: output[1] && output[1].length > 0 ? output[1] : null,
						xtrnIds: xtrnLinksMapper(output[0].relations.filter(relation =>
							relation['target-type'] == 'url' && relation.url).map(relation => relation.url.resource)),
					};
					const discogsIds = output[0].relations && output[0].relations.map(function(relation) {
						if (relation['target-type'] != 'url' || !relation.url) return false;
						if (!relation.type || relation.type.toLowerCase() != 'discogs') return false;
						let discogsId = dcEntryIdXtractor.exec(relation.url.resource);
						if (discogsId == null || discogsId[1].toLowerCase() != 'artist') return false;
						return (discogsId = parseInt(discogsId[2])) > 0 && discogsId;
					}).filter(Boolean);
					return discogsIds && discogsIds.length > 0 ? Promise.all(discogsIds.map(discogsId =>
							resolveDiscogsEntry('artist', discogsId).catch(reason => discogsId).then(artistId =>
								getDiscogsEntry('artist', artistId).catch(reason => null)))).then(function(discogsArtists) {
						if ((discogsArtists = discogsArtists.filter(Boolean)).length > 0) result.discogsArtists = discogsArtists;
						return result;
					}) : result;
				})))) : Promise.reject('not used');
				const amLookup = useAppleMusic ? amSearchArtist(siteArtist.name, anvs).then(results => Promise.all(results.map(result => Promise.all([
					amGetArtist(parseInt(result.id)).catch(reason => result),
					amGetArtistMatches(result.id, releases),
				]).then(output => ({
					amArtist: Object.defineProperty(Object.assign({ }, output[0]), 'uri', {
						get: function() { return this.attributes.url.replace(/\?.*$/, '') },
					}),
					matchedGroups: output[1] && output[1].length > 0 ? output[1] : null,
				}))))) : Promise.reject('not used');
				const bpLookup = useBeatport || useBeatport == undefined && getProfileTagsRate([
					'acid', 'acid.house', 'bass', 'beats', 'breakbeat', 'breakcore', 'breaks', 'chillout', 'chillwave',
					'chiptune', 'dance', 'dark.psytrance', 'deep.house', 'deep.tech', 'downtempo', 'drum.and.bass', 'dub',
					'dub.techno', 'dubstep', 'ebm', 'electro', 'electro.house', 'electronic', 'garage.house', 'glitch',
					'goa.trance', 'grime', 'hard.techno', 'hard.trance', 'hardcore.dance', 'house', 'idm', 'jungle',
					'leftfield', 'minimal.house', 'minimal.techno', 'nu.disco', 'progressive.house', 'progressive.trance',
					'psybient', 'psytrance', 'synth', 'tech.house', 'techno', 'trance', 'trap', 'tribal', 'trip.hop',
					'uk.garage', 'uplifting.trance', 'vaporwave',
				], siteArtist) >= 1/10 ? bpSearchArtist(siteArtist.name, anvs).then(results => Promise.all(results.map(result => Promise.all([
					bpGetArtist(result.id).catch(reason => result),
					bpGetArtistMatches(result.id, releases),
				]).then(output => ({
					bpArtist: Object.defineProperty(Object.assign({ }, output[0]), 'uri', {
						get: function() { return 'https://www.beatport.com/artist/' + this.slug + '/' + this.id/* + '/releases'*/ },
					}),
					matchedGroups: output[1] && output[1].length > 0 ? output[1] : null,
				}))))) : Promise.reject('not used');
				const scLookup = useSoundCloud ? scSearchUser(siteArtist.name, anvs).then(results =>
						Promise.all(results.map(result => scGetUserMatches(result.id, releases).then(matchedGroups => ({
					scUser: Object.defineProperty(Object.assign({ }, result), 'uri', {
						get: function() { return this.permalink_url },
					}),
					matchedGroups: matchedGroups && matchedGroups.length > 0 ? matchedGroups : null,
				}))))) : Promise.reject('not used');
				const neLookup = useNetease || useNetease == undefined && getProfileTagsRate([
					'chinese', 'chinese.pop', 'chinese.rock', 'cantopop', 'cantonese', 'mandopop', 'mandarin', 'hong.kong',
					'japanese', 'jpop', 'j.pop', 'jrock', 'j.rock', 'anime', 'japanese.pop', 'japanese.rock',
						'doujin', 'touhou', 'anison', 'seiyuu', 'visual.kei',
					'korean', 'kpop', 'k.pop', 'korean.pop', 'korean.rock',
					'asia',
				], siteArtist) >= 2/5 ? neSearchArtist(siteArtist.name, anvs).then(results => Promise.all(results.map(result => Promise.all([
					neGetArtist(parseInt(result.id)).catch(reason => result),
					neGetArtistMatches(parseInt(result.id), releases),
				]).then(output => ({
					neArtist: Object.defineProperty(Object.assign({ }, output[0]), 'uri', {
						get: function() { return 'https://music.163.com/#/artist?id=' + this.id },
					}),
					matchedGroups: output[1] && output[1].length > 0 ? output[1] : null,
				}))))) : Promise.reject('not used');
				return Promise.all([dcLookup.catch(function(reason) {
					console.log('[AAM] Discogs:', reason);
					return Promise.resolve(null);
				}), mbLookup.catch(function(reason) {
					console.log('[AAM] MusicBrainz:', reason);
					return Promise.resolve(null);
				}), bpLookup.catch(function(reason) {
					console.log('[AAM] Beatport:', reason);
					return Promise.resolve(null);
				}), amLookup.catch(function(reason) {
					console.log('[AAM] Apple Music:', reason);
					return Promise.resolve(null);
				}), scLookup.catch(function(reason) {
					console.log('[AAM] SoundCloud:', reason);
					return Promise.resolve(null);
				}),neLookup.catch(function(reason) {
					console.log('[AAM] NetEase:', reason);
					return Promise.resolve(null);
				})]).then(function(results) {
					// const groupsMatchBys = { };
					// for (let r1 of results) if (r1) for (let r2 of r1) if (r2.matchedGroups)
					// 	for (let groupId of r2.matchedGroups) {
					// 		if (!(groupId in groupsMatchBys)) groupsMatchBys[groupId] = new Set;
					// 		for (let key in r2) if (isSiteKey(key)) groupsMatchBys[groupId].add(r2[key].uri || key + '#' + r2[key].id);
					// 	}
					// console.debug('[AAM] Initial group matches by external artists:', groupsMatchBys);
					results = Array.prototype.concat.apply([ ], results.filter(Boolean));
					return results.length > 0 ? results : Promise.reject('No matches');
				}).then(function(results) {
					// mrege results by referencing same external resources
					if (results.length >= 2) {
						consolidateResults3(results, function(result1, result2) {
							if (!('discogsArtist' in result1) || !Array.isArray(result2.discogsArtists)) return false;
							if (!result2.discogsArtists.some(discogsArtist => discogsArtist.id == result1.discogsArtist.id)) return false;
							return result2.discogsArtists.length == 1;
						});
						consolidateResults3(results, (result1, result2) => 'discogsArtist' in result1
							&& Array.isArray(result2.xtrnIds) && result2.xtrnIds.includes(urlToId(result1.discogsArtist.uri)));
						if (useMusicBrainz) consolidateResults3(results, (result1, result2) => 'mbArtist' in result1 && Array.isArray(result2.xtrnIds)
							&& result2.xtrnIds.includes(urlToId(result1.mbArtist.uri || result1.mbArtist.url)));
						if (useAppleMusic) consolidateResults3(results, (result1, result2) => 'amArtist' in result1 && Array.isArray(result2.xtrnIds)
							&& result2.xtrnIds.includes(urlToId(result1.amArtist.uri || result1.amArtist.attributes.url)));
						if (useBeatport) consolidateResults3(results, (result1, result2) => 'bpArtist' in result1 && Array.isArray(result2.xtrnIds)
							&& result2.xtrnIds.includes(urlToId(result1.bpArtist.uri || result1.bpArtist.url)));
						if (useSoundCloud) consolidateResults3(results, (result1, result2) => 'scUser' in result1 && Array.isArray(result2.xtrnIds)
							&& result2.xtrnIds.includes(urlToId(result1.scUser.permalink_uri || result1.scUser.permalink_url)));
						if (useNetease) consolidateResults3(results, (result1, result2) => 'neArtist' in result1 && Array.isArray(result2.xtrnIds)
							&& result2.xtrnIds.includes(urlToId(result1.neArtist.uri || result1.neArtist.url)));
						consolidateResults3(results, (result1, result2) => Array.isArray(result1.xtrnIds) && Array.isArray(result2.xtrnIds)
							&& result1.xtrnIds.filter(xtrnId1 => result2.xtrnIds.includes(xtrnId1)).length == 1);
					}

					const mgWorkers = [ ];
					results.forEach(function(result) {
						if (!('discogsArtists' in result) || result.discogsArtists.length <= 0) return;
						if (result.discogsArtists.length > 1) {
							const siteKey = Object.keys(result).find(isSiteKey);
							console.info('[AAM] Discarding ambiguous Discogs reference for', result[siteKey].name, ':', result.discogsArtists);
							return;
						}
						if ('discogsArtist' in result) return; else result.discogsArtist = result.discogsArtists[0];
						mgWorkers.push(getDiscogsMatches(result.discogsArtists[0].id).then(function(matchedGroups) {
							matchedGroups = (result.matchedGroups || [ ]).concat(matchedGroups || [ ]).filter(uniqueValuesFilter);
							result.matchedGroups = matchedGroups.length > 0 ? matchedGroups : null;
							return matchedGroups.length;
						}));
					});

					for (let result of results) for (let key in result)
						if (['xtrnIds', 'discogsArtists'].includes(key)) delete result[key];
					return mgWorkers.length > 0 ? Promise.all(mgWorkers).catch(function(reason) {
						console.warn('[AAM] Assertion failed for mathed groups lookups in orphaned discogs artists:', result);
						return results;
					}).then(() => results) : results;
				}).then(function(results) {
					if (results.length < 2) return results;

					// merge results by metching releases to site artist releases
					if (releases) {
						consolidateResults3(results, function(result1, result2) {
							if (!Array.isArray(result1.matchedGroups) || !Array.isArray(result2.matchedGroups)) return 0;
							const commonGroups = result2.matchedGroups.filter(groupId => result1.matchedGroups.includes(groupId));
							const listSize = Math.min(result1.matchedGroups.length, result2.matchedGroups.length);
							if (commonGroups.length > 0) console.log('[AAM] Matching results by matching same torrent groups:',
								result1, result2, commonGroups, `(${commonGroups.length}/${listSize})`);
							if (commonGroups.length > 0 && minMatchDivisor > 1 && commonGroups.length * minMatchDivisor < listSize) { // avoid mistakes
								console.log(`[AAM] Discarding this match due to low match ratio (${(commonGroups.length / listSize).toFixed(3)})`);
								return 0;
							}
							return commonGroups.length/* / listSize*/;
						});
						if (results.length < 2) return results;
					}

					// merge results by remote matching releases
					const releaseLists = { };
					for (let result of results) for (let siteKey in result) if (isSiteKey(siteKey)) {
						if (!(siteKey in releaseLists)) releaseLists[siteKey] = { };
						if (result[siteKey].id in releaseLists[siteKey]) continue;
						const matchesFunc = {
							'discogsArtist': getDiscogsArtistReleases,
							'mbArtist': mbGetArtistDiscography,
							'amArtist': amGetArtistAlbums,
							'bpArtist': bpGetArtistReleases,
							'scUser': scGetUserAlbums,
							'neArtist': neGetArtistAlbums,
						}[siteKey];
						if (typeof matchesFunc != 'function') throw `Assertion failed: invalid site key (${siteKey})`;
						releaseLists[siteKey][result[siteKey].id] = matchesFunc(result[siteKey].id).catch(reason => null);
					}
					const workers = Object.keys(releaseLists).map(siteKey => Promise.all(Object.values(releaseLists[siteKey])));
					return workers.length > 0 ? Promise.all(workers).then(function(results) {
						Object.keys(releaseLists).forEach(function(siteKey, siteNdx) {
							Object.keys(releaseLists[siteKey]).forEach(function(artistId, artistNdx) {
								releaseLists[siteKey][artistId] = results[siteNdx][artistNdx];
							});
						});
					}).then(function() {
						function getNormalizedResult(release, siteKey) {
							const titlesMapper = titles => titles.filter(uniqueValuesFilter)
								.map(title => [title, stripRlsSuffix(title).toLowerCase(), titleCmpNorm(title)]);
							switch (siteKey) {
								case 'discogsArtist': return [ // Discogs
									titlesMapper([release.title, release.trackinfo, release.type == 'master' && dcMasterTitles.get(release.id)]),
									release.type == 'master' && dcMasterYears.get(release.id) || release.year || undefined,
									release.type == 'master' ? dcMasterYears.get(release.id) ?
										0 : dcUnresolvedMasters.has(release.id) ? 1 : 2 : 1,
								];
								case 'mbArtist': {
									let dates;
									switch (release.type) {
										case 'release-group': dates = [release['first-release-date']]; break;
										case 'release': dates = [
											release['release-group'] && release['release-group']['first-release-date'],
											release.date,
										]; break;
										default: dates = [ ]; // assertion failed
									}
									dates = dates.map(date => date ? new Date(date) : undefined);
									return [ // MusicBrainz
										titlesMapper([release.title]),
										dates[0] || dates[1],
										dates[0] ? 0 : dates[1] ? 1 : 0,
									];
								}
								case 'bpArtist': { // Beatport
									const newReleaseDate = release.new_release_date ? new Date(release.new_release_date) : undefined,
												publishDate = release.publish_date ? new Date(release.publish_date) : undefined;
									return [
										titlesMapper([release.name]),
										newReleaseDate ? newReleaseDate.getUTCFullYear() : undefined,
										1,
										parseInt(release.upc) || null,
									];
								}
								case 'amArtist': return release.attributes ? [ // Apple Music/Shazam
									titlesMapper([release.attributes.name]),
									release.attributes.releaseDate ? new Date(release.attributes.releaseDate).getUTCFullYear() : undefined,
									1,
									parseInt(release.attributes.upc) || null,
								] : null;
								case 'scUser': { // SoundCloud
									const releaseDate = release.release_date ? new Date(release.release_date) : undefined;
									return [
										titlesMapper([release.title]),
										releaseDate ? releaseDate.getUTCFullYear() : undefined,
										1,
										//parseInt(release.upc) || null,
									];
								}
								case 'neArtist': { // NetEase
									const publishDate = release.publishTime ? new Date(release.publishTime) : undefined;
									return [
										titlesMapper([release.name]),
										publishDate ? publishDate.getUTCFullYear() : undefined,
										1,
										parseInt(release.upc) || null,
									];
								}
								default: throw 'Assertion failed: unknown site key';
							}
						}

						const dcMasterLookups = new DiscogsMasterLookups;
						const getMatchesByReleaseTotalPoolSize = () =>
								results.reduce((acc, result1, ndx1) => acc + results.reduce(function(acc, result2, ndx2) {
							if (ndx2 == ndx1) return acc;
							if (Object.keys(result2).filter(isSiteKey).some(siteKey => !isMergableKey(siteKey)
									&& Object.keys(result1).filter(isSiteKey).includes(siteKey))) return acc;
							return acc + Object.keys(result1).filter(isSiteKey).reduce(function(acc, siteKey1) {
								const releaseList1 = releaseLists[siteKey1][result1[siteKey1].id];
								if (!Array.isArray(releaseList1) || releaseList1.length <= 0) return acc;
								return acc + Object.keys(result2).filter(isSiteKey).reduce(function(acc, siteKey2) {
									if (siteKey2 == siteKey1) return acc;
									const releaseList2 = releaseLists[siteKey2][result2[siteKey2].id];
									return acc + (Array.isArray(releaseList2) && releaseList2.length > 0 ?
										releaseList1.length * releaseList2.length : 0);
								}, 0);
							}, 0);
						}, 0), 0);
						function cmpRlsLists(result1, siteKey1, result2, siteKey2) {
							if (siteKey1 == siteKey2) return 0;
							const releaseList1 = releaseLists[siteKey1][result1[siteKey1].id];
							if (!Array.isArray(releaseList1) || releaseList1.length <= 0) return 0;
							const releaseList2 = releaseLists[siteKey2][result2[siteKey2].id];
							if (!Array.isArray(releaseList2) || releaseList2.length <= 0) return 0;
							const listSize = Math.min(releaseList1.length, releaseList2.length);
							const poolSize = releaseList1.length * releaseList2.length;
							if (smallestCachedScorePool > 0 && poolSize >= smallestCachedScorePool) {
								const keyFinder = key => (key = key.split(','))[0] == siteKey1 && key[1] == result1[siteKey1].id
										&& key[2] == siteKey2 && key[3] == result2[siteKey2].id
									|| key[0] == siteKey2 && key[1] == result2[siteKey2].id
										&& key[2] == siteKey1 && key[3] == result1[siteKey1].id;
								var cacheKey = Object.keys(artistMatchScores).find(keyFinder);
								if (cacheKey) {
									//if (smallestLoggedScorePool > 0 && compareSize >= smallestLoggedScorePool)
									//	console.info(`[AAM] Using cached score for results ${siteKey1}#${result1[siteKey1].id} ↔ ${siteKey2}#${result2[siteKey2].id} (${compareSize} iterations saved)`);
									return artistMatchScores[cacheKey];
								} else if (cacheKey = Object.keys(incompleteCache).find(keyFinder)) {
									//if (smallestLoggedScorePool > 0 && compareSize >= smallestLoggedScorePool)
									//	console.info(`[AAM] Using cached score for results ${siteKey1}#${result1[siteKey1].id} ↔ ${siteKey2}#${result2[siteKey2].id} (${compareSize} iterations saved)`);
									return incompleteCache[cacheKey];
								} else cacheKey = [siteKey1, result1[siteKey1].id, siteKey2, result2[siteKey2].id].toString();
								if (smallestLoggedScorePool > 0 && poolSize >= smallestLoggedScorePool) {
									console.info(`[AAM] Computing match score for release lists ${siteKey1}#${result1[siteKey1].id} ↔ ${siteKey2}#${result2[siteKey2].id} (${poolSize} iterations to do)`);
									console.time(cacheKey);
								}
							}
							let incomplete = 0, matchedCount = releaseList1.filter(release1 => releaseList2.some(function(release2) {
								if (siteKey1 == 'discogsArtist' && release1.type == 'master' && !dcUnresolvedMasters.has(release1.id)
										&& (!dcMasterYears.has(release1.id) || !dcMasterTitles.has(release1.id))
										&& !dcCanVaryYear(release1, releaseList1.length) && !dcCanVaryTitle(release1, releaseList1.length))
									dcUnresolvedMasters.add(release1.id);
								if (siteKey2 == 'discogsArtist' && release2.type == 'master' && !dcUnresolvedMasters.has(release2.id)
										&& (!dcMasterYears.has(release2.id) || !dcMasterTitles.has(release2.id))
										&& !dcCanVaryYear(release2, releaseList2.length) && !dcCanVaryTitle(release2, releaseList2.length))
									dcUnresolvedMasters.add(release2.id);
								const normResults = [getNormalizedResult(release1, siteKey1), getNormalizedResult(release2, siteKey2)];
								function titlesMatch(cmpFunc) {
									if (typeof cmpFunc != 'function') throw 'Invalid callback reference';
									for (let titles1 of normResults[0][0]) for (let titles2 of normResults[1][0])
										if (cmpFunc(titles1, titles2)) return true;
									return false;
								}

								if (!normResults.every(Array.isArray.bind(Array))) return false; // assertion failed
								if (normResults[0][3] && normResults[1][3] && normResults[0][3] == normResults[1][3]) // match by UPC
									return true;
								if (normResults[0][2] == 0 && !(normResults[0][1] <= normResults[1][1])
										|| normResults[1][2] == 0 && !(normResults[1][1] <= normResults[0][1])) return false;
								const strictYearMatch = normResults[0][1] == normResults[1][1] && normResults.every(normResult =>
									normResult[1] > 0 && normResult[2] == 0 || strongEqualReleaseDate && normResult[2] == 1);
								const yearMatch = strictYearMatch || normResults.every(normResult => normResult[1] > 0)
									&& (normResults[0][2] == 0 && normResults[1][2] == 1 && normResults[0][1] <= normResults[1][1]
									|| normResults[0][2] == 1 && normResults[1][2] == 1 && normResults[0][1] == normResults[1][1]
									|| normResults[0][2] == 1 && normResults[1][2] == 0 && normResults[1][1] >= normResults[0][1])
									|| !strictRlsYearMatching && normResults.some(normResult => normResult[1] == undefined);
								const strictTitleMatch = titlesMatch((titles1, titles2) => titles1[2] == titles2[2]/*
									|| bilingualNamesMatch(titles1[0], titles2[1])*/);
								if (strictTitleMatch && yearMatch || strictYearMatch && titlesMatch((titles1, titles2) =>
										bilingualNamesMatch(titles1[0], titles2[0]) || fuzzyTitlesMatch(titles1[1], titles2[1])))
									return true;
								if (release1.type == 'master' && (!dcUnresolvedMasters.has(release1.id)
											&& !dcMasterTitles.has(release1.id) && dcCanVaryTitle(release1, releaseList1.length)
										|| normResults[0][3] == 2 && (normResults[1][2] == 2
											|| !(normResults[0][1] < normResults[1][1])) && dcCanVaryYear(release1, releaseList1.length))) {
									dcMasterLookups.add(release1.id);
									++incomplete;
								}
								if (release2.type == 'master' && (!dcUnresolvedMasters.has(release2.id)
											&& !dcMasterTitles.has(release2.id) && dcCanVaryTitle(release2, releaseList2.length)
										|| normResults[1][3] == 2 && (normResults[0][2] == 2
											|| !(normResults[1][1] < normResults[0][1])) && dcCanVaryYear(release2, releaseList2.length))) {
									dcMasterLookups.add(release2.id);
									++incomplete;
								}
								return false;
							})).length, matchScore = matchedCount / listSize;
							if (cacheKey && poolSize >= smallestLoggedScorePool) console.timeEnd(cacheKey);
							if (matchedCount > 0) console.log(`[AAM] Matching results by having ${matchedCount}/${listSize} common release(s):`,
								result1, `[${siteKey1}]`, result2, `[${siteKey2}]`);
							// Avoid possibly wrongly assigned releases
							if (matchedCount > 0 && minMatchDivisor > 1 && matchScore < 1/minMatchDivisor) {
								console.log(`[AAM] Discarding this match due to low match ratio (${matchScore.toFixed(3)})`);
								matchedCount = 0;
							}
							if (cacheKey) {
								(incomplete > 0 ? incompleteCache : artistMatchScores)[cacheKey] = matchedCount;
								if (incomplete <= 0 && poolSize >= 1e5) commitScoresCache();
							}
							return matchedCount;
						}

						const totalPoolSize = getMatchesByReleaseTotalPoolSize();
						if (totalPoolSize >= 1e6)
							console.info(`[AAM] Total computing pool size for '${siteArtist.name}':`, totalPoolSize);
						let incompleteCache = { };
						consolidateResults3(results, (result1, result2) =>
							Math.max(...Object.keys(result1).filter(isSiteKey).map(siteKey1 =>
								Math.max(...Object.keys(result2).filter(isSiteKey).map(siteKey2 =>
									cmpRlsLists(result1, siteKey1, result2, siteKey2))))));
						if (dcUnresolvedMasters.size > 0) saveSessionCache('dcUnresolvedMasters', Array.from(dcUnresolvedMasters));
						commitScoresCache();
						if (results.length < 2 || dcMasterLookups.isEmpty) return results;
						console.info('[AAM]', dcMasterLookups.size, 'master release(s) to lookup on Discogs (combined)');
						return dcMasterLookups.execute().then(function(total) {
							if (total > 0) {
								incompleteCache = { };
								consolidateResults3(results, (result1, result2) =>
										Math.max(...Object.keys(result1).filter(isSiteKey).map(siteKey1 =>
											Math.max(...Object.keys(result2).filter(isSiteKey).map(siteKey2 =>
									siteKey1 == 'discogsArtist' && result1[siteKey1].type == 'master'
											&& dcMasterLookups.has(result1[siteKey1].id)
										|| siteKey2 == 'discogsArtist' && result2[siteKey2].type == 'master'
											&& dcMasterLookups.has(result2[siteKey2].id) ?
										cmpRlsLists(result1, siteKey1, result2, siteKey2) : 0)))));
								commitScoresCache();
							}
							return results;
						});
					}) : results;
				}).then(function(results) {
					const siteKey = 'discogsArtist';
					if (results.length < 2 || !consolidateDcRelatives
							|| results.filter(result => result[siteKey]).length < 2) return results;
					const mergeWith = (relativeKey, honourPopulation, condition) => (function processResult(index = 0) {
						if (!(index >= 0 && index < results.length)) return Promise.resolve(results);
						if (!(siteKey in results[index]) || !(relativeKey in results[index][siteKey]))
							return processResult(index + 1);
						const onlyValidRelative = relativeId => relativeId > 0 && relativeId != results[index][siteKey].id;
						let relativeIds = results[index][siteKey][relativeKey];
						if (typeof condition == 'function')
							relativeIds = relativeIds.filter(relative => condition(results[index][siteKey], relative));
						relativeIds = relativeIds.map(relative => relative.id).filter(onlyValidRelative);
						return relativeIds.length > 0 ? Promise.all(relativeIds.map(artistId =>
								resolveDiscogsEntry('artist', artistId).catch(reason => artistId))).then(function(relativeIds) {
							relativeIds = relativeIds.filter(onlyValidRelative);
							const relativeIndex = results.findIndex(result =>
								siteKey in result && relativeIds.includes(result[siteKey].id));
							if (relativeIndex < 0) return processResult(index + 1);
							console.assert(relativeIndex != index);
							console.log('[AAM] Relative artists detected:', results[index][siteKey], '<=', results[relativeIndex][siteKey]);
							const removedIndex = consolidateResults(results, relativeIndex, index, honourPopulation);
							return processResult(relativeIndex > index || removedIndex > index ?
								index : removedIndex < index ? index - 1 : relativeIndex);
						}) : processResult(index + 1);
					})();
					return mergeWith('groups', false, (artist, group) => basedOnArtist(artist, group))
						.then(() => mergeWith('aliases', true)).then(() => results);
				}).then(function(results) {
					console.timeEnd(siteArtist.name);
					console.log(`[AAM] Combined search for '${siteArtist.name}' completed, final storage consumption:`,
						getCacheSizes().map(size => `${Math.round(size / 2**10)} KiB`).join(' / '),
						`(${Math.round(getCacheSize() / 2**10)} KiB); DOM quota exceeded? ${domStorageLimitReached}`);
					return results;
				}).then(addSearchResultsTotals);
			}
			function getMatchedArtists(results) {
				results = results.filter(result => Array.isArray(result.matchedGroups) && result.matchedGroups.length > 0);
				if (results.length > 1) {
					function matchName(result, name) {
						name = name.toLowerCase();
						if (result.discogsArtist && dcNameNormalizer(result.discogsArtist.name).toLowerCase() == name) return true;
						if (result.mbArtist && result.mbArtist.name.toLowerCase() == name) return true;
						if (result.amArtist && result.amArtist.attributes.name.toLowerCase() == name) return true;
						if (result.scUser && result.scUser.username.toLowerCase() == name) return true;
						return false;
					}

					const nameMatches = name => results.some(result => matchName(result, name));
					const stripNameFromResults = name => { results = results.filter(result => !matchName(result, name)) };
					for (let alias of aliases) {
						if (!(alias = getAlias(alias)) || alias.name == artist.name) continue;
						//stripNameFromResults(alias.name);
					}
				}
				results.uncertain = results.length > 1 && results.filter(result => result.matchedGroups.length >= 10).length < 2
					&& !results.some(result => Object.keys(result).filter(isSiteKey).some(siteKey =>
						results.filter(result => siteKey in result).length > 1));
				return addSearchResultsTotals(results);
			}
			function findSearchResultColisions(results) {
				if (!Array.isArray(results) || results.length <= 0) return null;
				const result = new Map;
				results.forEach(function(result1, index1) {
					if (!Array.isArray(result1.matchedGroups) || result1.matchedGroups.length <= 0) return;
					results.forEach(function(result2, index2) {
						if (index2 <= index1) return;
						if (!Array.isArray(result2.matchedGroups) || result2.matchedGroups.length <= 0) return;
						const overlaps = result2.matchedGroups.filter(groupId => result1.matchedGroups.includes(groupId));
						if (overlaps.length > 0) result.set([index1, index2], overlaps);
					});
				});
				return result.size > 0 ? result : null;
			}

			String.prototype.properTitleCase = function() {
				return [this.toUpperCase(), this.toLowerCase()].some(str => this == str) ? this
					: caseFixes.reduce((result, replacer) => result.replace(...replacer), this);
			};

			const caseFixes = [
				[
					new RegExp(`(\\w+|[\\,\\)\\]\\}\\"\\'\\‘\\’\\“\\‟\\”]) +(${[
						'And In', /*'And His', 'And Her', */'And', 'By A', 'By An', 'By The', 'By', 'Feat.', 'Ft.', 'For A',
						'For An', 'For', 'From', 'If', 'In To', 'In', 'Into', 'Nor', 'Not', 'Of An', 'Of The', 'Of',
						'Off', 'On', 'Onto', 'Or', 'Out Of', 'Out', 'Over', 'With', 'Without', 'Yet',
						'Y Su', 'Y Sua', 'Y Suo', 'De', 'Y', 'E La Sua', 'E Sua', 'E Il Suo', 'La Sua', 'E Le Sue', 'Le Sue', 'E Sue',
						'Et Son', 'Et Ses', 'Et Le', 'Et Sa', 'Et Sua', 'E Seu', 'Di', 'De', 'Des', 'Del',
						'Und Sein', 'Und Seine', 'Und', 'Mit Seinem', 'Mit Seiner', 'Mit',
						'En Zijn', 'Og',
					].join('|')})(?=\\s+)`, 'g'), (match, preWord, shortWord) => preWord + ' ' + shortWord.toLowerCase(),
				], [
					new RegExp(`(^|\\s)(${['by', 'in', 'of', 'on', 'or', 'to', 'for', 'out', 'into', 'from', 'with'].join('|')})$`, 'g'),
					(match, prefix, shortWord) => prefix + shortWord[0].toUpperCase() + shortWord.slice(1).toLowerCase(),
				],
				[/([\-\:\&\;]) +(the|an?)(?=\s+)/g, (match, sym, article) => sym + ' ' + article[0].toUpperCase() + article.slice(1).toLowerCase()],
			];

			let aliasesRoot = document.body.querySelector('form.add_form');
			if (aliasesRoot != null) (aliasesRoot = aliasesRoot.parentNode.parentNode).id = 'aliases';
				else throw 'Add alias form could not be located';
			console.assert(aliasesRoot.tagName == 'DIV' && aliasesRoot.className == 'box pad');
			const aliases = aliasesRoot.querySelectorAll('div.box > div > ul > li'),
						dropDown = aliasesRoot.querySelector('select[name="redirect"]');
			const epitaph = `

Don't navigate away, close or reload current page, till it reloads self.

The operation can take longer to complete and can be reverted only
by hand, sure to proceed?`;
			let mainIdentityId;

			decodeArtistTitles(artist);
			for (let torrentGroup of artist.torrentgroup) {
				if (torrentGroup.extendedArtists && Array.isArray(torrentGroup.extendedArtists[1])
						&& torrentGroup.extendedArtists[1].length > 0 || artistlessGroups.has(torrentGroup.groupId)) continue;
				let container = document.getElementById('artistless-groups');
				if (container == null) {
					const ref = aliasesRoot.querySelector(':scope > br:first-of-type'), hdr = document.createElement('H4');
					hdr.innerHTML = 'List of artistless groups<br><span style="font-size: 8pt; font-weight: normal;">(Bold printed groups are missing artist info entirely and are potential source for complex operations to fail; review and fix these groups first to avoid later problems)</span>';
					hdr.style = 'color: red; font-weight: bold;';
					aliasesRoot.insertBefore(hdr, ref);
					container = document.createElement('DIV');
					container.id = 'artistless-groups';
					container.style = 'padding: 1em;';
					aliasesRoot.insertBefore(container, ref);
				}
				if (container.childElementCount > 0) container.append(', ');
				const a = document.createElement('A');
				a.href = '/torrents.php?id=' + torrentGroup.groupId;
				a.target = '_blank';
				a.textContent = torrentGroup.groupName || torrentGroup.groupId.toString();
				a.style.fontWeight = !torrentGroup.extendedArtists ? 'bold' : 'normal';
				if (torrentGroup.extendedArtists) if (Array.isArray(torrentGroup.extendedArtists[6])
						&& torrentGroup.extendedArtists[6].length > 0) {
					a.style.opacity = 0.5;
					a.title = 'DJ/Compiler(s) only';
				} else a.title = Object.keys(torrentGroup.extendedArtists).join(', ');
				container.append(a);
				artistlessGroups.add(torrentGroup.groupId);
			}

			function destroyInfoBox(elem) {
				if (!(elem instanceof HTMLElement)) return;
				if (elem.hTimer) clearTimeout(elem.hTimer);
				if (elem.parentNode != null) elem.remove();
			}
			function setProgressInfo(content, destructive = false, asHTML = false) {
				const id = 'aam-progress-info';
				let div = document.getElementById(id);
				if (!content) return destroyInfoBox(div); else if (div == null) {
					div = document.createElement('DIV');
					div.id = id;
					div.style = 'position: fixed; top: 10pt; right: 10pt; z-index: 999999; border: 2pt solid lightgray; background-color: #044; color: white; width: 40%; padding: 5pt; font: normal 13pt "Segoe UI", sans-serif;';
					document.body.append(div);
				} else if (div.hTimer) clearTimeout(div.hTimer);
				div[asHTML ? 'innerHTML' : 'textContent'] = content;
				if (destructive) div.hTimer = setTimeout(destroyInfoBox, 10000, div);
					else if ('hTimer' in div) delete div.hTimer;
			}

			class TorrentGroupsManager {
				constructor(aliasId) {
					if (!(aliasId > 0)) throw 'Invalid argument';
					this.groups = { };
					for (let torrentGroup of artist.torrentgroup) {
						if (!torrentGroup.extendedArtists) continue;
						const importances = Object.keys(torrentGroup.extendedArtists)
							.filter(importance => Array.isArray(torrentGroup.extendedArtists[importance])
								&& torrentGroup.extendedArtists[importance].some(artist => artist.aliasid == aliasId))
							.map(key => parseInt(key)).filter((el, ndx, arr) => arr.indexOf(el) == ndx);
						if (importances.length <= 0) continue;
						if (!Array.isArray(this.groups)) this.groups[torrentGroup.groupId] = importances;
							else Array.prototype.push.apply(this.groups[torrentGroup.groupId],
								importances.filter(i => !this.groups[torrentGroup.groupId].includes(i)));
					}
				}

				get size() {
					return this.groups ? Object.keys(this.groups).filter(groupId =>
						Array.isArray(this.groups[groupId]) && this.groups[groupId].length > 0).length : 0;
				}
				get aliasUsed() { return this.size > 0 }

				removeAliasFromGroups() {
					if (!this.aliasUsed) return Promise.resolve('No groups block this alias');
					const groupIds = Object.keys(this.groups), removeAliasFromGroup = [
						groupId => deleteArtistFromGroup(groupId, artist.id, this.groups[groupId]),
						function(index = 0) {
							if (!(index >= 0 && index < groupIds.length))
								return Promise.resolve('Artist alias removed from all groups');
							const importances = this.groups[groupIds[index]];
							console.assert(Array.isArray(importances) && importances.length > 0,
								'Array.isArray(importances) && importances.length > 0');
							return Array.isArray(importances) && importances.length > 0 ?
								deleteArtistFromGroup(groupIds[index], artist.id, importances)
									.then(results => removeAliasFromGroup[1].call(this, index + 1))
								: removeAliasFromGroup[1].call(this, index + 1);
						},
					];
					return (groupIds.length > maxBatchSize ? removeAliasFromGroup[1].call(this) : groupIds.length > 1 ?
							Promise.all(groupIds.slice(0, -1).map(removeAliasFromGroup[0])).then(() =>
								wait(groupIds[groupIds.length - 1]).then(removeAliasFromGroup[0])).catch(function(reason) {
						console.warn('TorrentGroupsManager.removeAliasFromGroups parallely failed, trying serially:', reason);
						return removeAliasFromGroup[1].call(this);
					}) : removeAliasFromGroup[0](groupIds[groupIds.length - 1])).then(wait);
				}
				addAliasToGroups(aliasName = artist.name) {
					if (!this.aliasUsed) return Promise.resolve('No groups block this alias');
					if (!aliasName) return Promise.reject('Argument is invalid');
					const groupIds = Object.keys(this.groups), _addAliasToGroup = [
						groupId => addAliasToGroup(groupId, aliasName, this.groups[groupId]),
						function(index = 0) {
							if (!(index >= 0 && index < groupIds.length)) return Promise.resolve('Artist alias re-added to all groups');
							const importances = this.groups[groupIds[index]];
							console.assert(Array.isArray(importances) && importances.length > 0,
								'Array.isArray(importances) && importances.length > 0');
							return Array.isArray(importances) && importances.length > 0 ?
								addAliasToGroup(groupIds[index], aliasName, importances)
									.then(result => _addAliasToGroup[1].call(this, index + 1))
								: _addAliasToGroup[1].call(this, index + 1);
						}
					];
					return groupIds.length > maxBatchSize ? _addAliasToGroup[1].call(this).then(wait) : groupIds.length > 1 ?
							_addAliasToGroup[0](groupIds[0]).then(wait).then(() =>
								Promise.all(groupIds.slice(1).map(_addAliasToGroup[0]))).catch(function(reason) {
						console.warn('TorrentGroupsManager.addAliasToGroups parallely failed, trying serially:', reason);
						return _addAliasToGroup[1].call(this).then(wait);
					}) : _addAliasToGroup[0](groupIds[0]).then(wait);
				}
			}

			class AliasDependantsManager {
				constructor(aliasId) {
					console.assert(aliasId > 0, 'aliasId > 0');
					if (aliasId > 0) this.redirectTo = aliasId; else throw 'Invalid argument';
					if ((this.aliases = Array.prototype.map.call(aliases, function(li) {
						const alias = getAlias(li);
						if (alias && alias.redirectId == aliasId) return alias;
					}).filter(Boolean)).length <= 0) delete this.aliases;
				}

				get size() { return Array.isArray(this.aliases) ? this.aliases.length : 0 }
				get hasDependants() { return this.size > 0 }

				removeAll() {
					if (!this.hasDependants) return Promise.resolve('No dependants');
					function worker(alias) {
						const worker = alias.tgm.aliasUsed ? alias.tgm.removeAliasFromGroups() : Promise.resolve('Not used');
						return worker.then(() => deleteAlias(alias.id));
					}
					return this.aliases.length > maxBatchSize ? (function execIndex(index = 0) {
						return index >= 0 && index < this.aliases.length ? worker(this.aliases[index]).then(() => execIndex.call(this, index + 1))
							: Promise.resolve('Completed (serial)');
					}).call(this) : Promise.all(this.aliases.map(worker)).then(results => 'Completed (parallel)');
				}
				restoreAll(redirectTo = this.redirectTo, artistIdOrName) {
					return this.hasDependants ? resolveArtistId(artistIdOrName).then(artistId =>
							resolveAliasId(redirectTo, (artistIdOrName || !(redirectTo >= 0)) && artistId, true).then(function(redirectTo) {
						function worker(alias) {
							let worker = addAlias(alias.name, redirectTo, artistIdOrName ? artistId : undefined).then(wait);
							if (alias.tgm.aliasUsed) worker = worker.then(() => findArtistAlias(redirectTo, artistId))
								.then(newAlias => alias.tgm.addAliasToGroups(newAlias.name));
							return worker;
						}
						return this.aliases.length > maxBatchSize ? (function execIndex(index = 0) {
							return index >= 0 && index < this.aliases.length ? worker(this.aliases[index]).then(() => execIndex.call(this, index + 1))
								: Promise.resolve('Completed (serial)');
						}).call(this) : Promise.all(this.aliases.map(worker)).then(responses => 'Completed (parallel)');
					}.bind(this))) : Promise.resolve('No dependants');
				}
			}

			class ArtistGroupKeeper {
				constructor() {
					for (let torrentGroup of artist.torrentgroup) if (torrentGroup.extendedArtists) for (let importance in torrentGroup.extendedArtists) {
						const artists = torrentGroup.extendedArtists[importance];
						if (Array.isArray(artists) && artists.length > 0) continue;
						this.artistId = artist.id;
						this.aliasName = `__${artist.id.toString()}__${Date.now().toString(16)}`;
						this.groupId = torrentGroup.groupId;
						this.importance = parseInt(importance);
						this.locked = false;
						return this;
					}
					throw 'Unable to find a spare group';
				}

				hold() {
					if (this.locked) return Promise.reject('Not available');
					if (!this.groupId) throw 'Unable to find a spare group';
					this.locked = true;
					return addAlias(this.aliasName).then(wait)
						.then(() => addAliasToGroup(this.groupId, this.aliasName, [this.importance]));
				}
				release(artistIdOrName = this.artistId) {
					if (!this.locked) return Promise.reject('Not available');
					return resolveArtistId(artistIdOrName).then(artistId =>
						deleteArtistFromGroup(this.groupId, artistId, [this.importance]).then(wait)
							.then(() => deleteAlias(this.aliasName, artistIdOrName && artistId))).then(() => { this.locked = false });
				}
			}

			function getSelectedRedirect(defaultsToMain = false) {
				let redirect = aliasesRoot.querySelector('select[name="redirect"]');
				if (redirect == null) throw 'Assertion failed: can not locate redirect selector';
				redirect = {
					id: parseInt(redirect.options[redirect.selectedIndex].value),
					name: redirect.options[redirect.selectedIndex].label,
				};
				console.assert(redirect.id >= 0 && redirect.name, 'redirect.id >= 0 && redirect.name');
				if (defaultsToMain && redirect.id == 0) {
					redirect.id = mainIdentityId;
					redirect.name = artist.name;
				}
				return Object.freeze(redirect);
			}
			function setProgress(element, color = 'red') {
				if (!(element instanceof HTMLElement)) throw 'Invalid argument';
				if (element.parentNode != null) activeElement = element; else return;
				if ('disabled' in element) element.disabled = true;
				element.style.cursor = 'progress';
				element.textContent = 'processing ...';
				element.style.color = color;
			}
			function failHandler(reason) {
				if (activeElement instanceof HTMLElement && activeElement.parentNode != null) {
					activeElement.style.color = null;
					if (activeElement.dataset.caption) activeElement.value = activeElement.dataset.caption;
					activeElement.style.cursor = 'pointer';
					if (activeElement.disabled) activeElement.disabled = false;
					activeElement = null;
				}
				alert(reason);
			}

			function isBadRDA(alias) {
				if (!alias) throw 'Invalid argument';
				if (!alias.redirectId) return false; //throw 'Not a redirecting alias';
				if (alias.tgm.aliasUsed) return true;
				const target = findAlias(alias.redirectId, true);
				return !target || target.id != alias.redirectId;
			}
			function dupesCleanup(alias) {
				if (!alias || !alias.id) throw 'Invalid argument';
				const target = findAlias(alias.redirectId) || alias, workers = [ ], dupes = [ ];
				aliases.forEach(function(li) {
					const dupe = getAlias(li);
					if (!dupe || dupe.id == alias.id || dupe.name.toLowerCase() != alias.name.toLowerCase()) return;
					let index;
					const ancestor = findAlias(dupe.redirectId);
					if (ancestor && 'dependants' in ancestor && ancestor.dependants.hasDependants) {
						while ((index = ancestor.dependants.aliases.indexOf(alias => alias.id == dupe.id)) >= 0)
							ancestor.dependants.aliases.splice(index, 1);
					}
					if ('dependants' in dupe && dupe.dependants.hasDependants) {
						while ((index = dupe.dependants.aliases.indexOf(dependant => dependant.name.toLowerCase() == alias.name.toLowerCase())) >= 0)
							dupe.dependants.aliases.splice(index, 1);
						if (dupe.dependants.hasDependants) workers.push(dupe.dependants.removeAll());
					}
					workers.push(dupe.tgm.aliasUsed ? dupe.tgm.removeAliasFromGroups().then(() => deleteAlias(dupe.id))
						: deleteAlias(dupe.id));
					dupes.push(dupe);
				});
				return workers.length > 0 ? Promise.all(workers).then(() => Promise.all(dupes.map(function(dupe) {
					const workers = [ ];
					if (dupe.tgm.aliasUsed) workers.push(dupe.tgm.addAliasToGroups(target.name)
						.then(() => { Object.assign(target.tgm.groups, dupe.tgm.groups) }));
					if ('dependants' in dupe && dupe.dependants.hasDependants) workers.push(dupe.dependants.restoreAll(target.id)
							.then(wait).then(() => Promise.all(dupe.dependants.aliases.map(alias => resolveAliasId(alias.name, artist.id)
								.then(aliasId => (alias.id = aliasId, alias))))).then(function(aliases) {
						if (!('dependants' in target)) target.dependants = new AliasDependantsManager(target.id);
						if (!Array.isArray(target.dependants.aliases)) target.dependants.aliases = [ ];
						Array.prototype.push.apply(target.dependants.aliases, aliases);
					}));
					if (workers.length > 0) return Promise.all(workers);
				}))) : Promise.resolve('No duplicate aliases');
			}
			function prologue(alias, agk) {
				let worker = dupesCleanup(alias).then(function() {
					const workers = [ ];
					if (agk && alias.tgm.size >= rlsCount(artist)) workers.push(agk.hold());
					if ('dependants' in alias && alias.dependants.hasDependants) workers.push(alias.dependants.removeAll());
					if (workers.length > 0) return Promise.all(workers);
				});
				if (alias.tgm.aliasUsed) worker = worker.then(() => alias.tgm.removeAliasFromGroups());
				return worker;
			}
			function epilogue(alias, agk, id1, id2 = id1) {
				function finish() {
					const workers = [ ];
					if ('dependants' in alias && alias.dependants.hasDependants) workers.push(alias.dependants.restoreAll(id2));
					if (agk && alias.tgm.size >= rlsCount(artist)) workers.push(agk.release());
					return Promise.all(workers);
				}

				if (!alias || !id1) throw 'Invalid argument';
				return alias.tgm.aliasUsed ? alias.tgm.addAliasToGroups(id1).then(finish) : finish();
			}
			function redirectAliasTo(alias, tgtAlias) {
				if (!alias || !tgtAlias) throw 'Invalid argument';
				if (tgtAlias.redirectId > 0) return Promise.reject('Invalid target type');
				if (tgtAlias.id == alias.id) return Promise.reject('Alias can\'t redirect to itself');
				if (alias.redirectId == tgtAlias.id) return Promise.resolve('Redirect doesnot change');
				if (alias.id == mainIdentityId) return 'dependants' in alias && alias.dependants.hasDependants ?
					alias.dependants.removeAll().then(wait).then(() => alias.dependants.restoreAll(tgtAlias.id)).then(wait)
						.then(() => renameArtist(tgtAlias.name))
					: renameArtist(tgtAlias.name);
				const agk = new ArtistGroupKeeper, workers = [ ];
				if (alias.tgm.size >= rlsCount(artist)) workers.push(agk.hold());
				if ('dependants' in alias && alias.dependants.hasDependants) workers.push(alias.dependants.removeAll());
				let worker = Promise.all(workers);
				if (alias.tgm.aliasUsed) worker = worker.then(() => alias.tgm.removeAliasFromGroups());
				return worker.then(() => deleteAlias(alias.id)).then(wait)
					.then(() => addAlias(alias.name, tgtAlias.id)).then(wait)
					.then(() => epilogue(alias, agk, alias.name, tgtAlias.id));
			}
			function renameAlias(alias, newName) {
				if (!alias) throw 'Invalid argument';
				const agk = new ArtistGroupKeeper;
				return prologue(alias, agk).then(() => deleteAlias(alias.id)).then(() => wait())
					.then(() => addAlias(newName, alias.redirectId)).then(wait).then(() => epilogue(alias, agk, newName));
			}
			function resolveRDA(alias) {
				if (!alias || !alias.id || !alias.redirectId) return Promise.reject('Invalid argument');
				if (!isBadRDA(alias)) return Promise.resolve('Alias fully resolved');
				const target = findAlias(alias.redirectId, true);
				return alias.tgm.removeAliasFromGroups().then(() => alias.tgm.addAliasToGroups((target || artist).name)).then(function() {
					if (target && target.tgm) Object.assign(target.tgm.groups, alias.tgm.groups);
					alias.tgm.groups = { };
					//if (!target) return deleteAlias(alias.id);
					if (!target || alias.redirectId != target.id)
						return deleteAlias(alias.id).then(() => addAlias(alias.name, target ? target.id : mainIdentityId));
				});
			}

			// NRA actions

			function makeItMain(evt) {
				if (activeElement != null) return false;
				console.assert(evt.currentTarget instanceof HTMLElement);
				const alias = getAlias(evt.currentTarget);
				console.assert(alias && typeof alias == 'object');
				console.assert(alias.id != mainIdentityId, 'alias.id != mainIdentityId');
				let nagText = `CAUTION

This action makes alias "${alias.name}" the main identity for artist ${artist.name},
while "${artist.name}" becomes it's subordinate N-R alias.`;
				if (alias.tgm.aliasUsed) nagText += '\n\nBlocked by ' + alias.tgm.size + ' groups';
				if (confirm(nagText + epitaph)) setProgress(evt.currentTarget); else return false;
				const agk = new ArtistGroupKeeper;
				if (alias.tgm.aliasUsed) prologue(alias, agk).then(() => deleteAlias(alias.id)).then(wait)
					.then(() => alias.tgm.addAliasToGroups(alias.name)).then(() => findArtistId(alias.name))
					.then(function(newArtistId) {
						let worker = changeArtistId(newArtistId).then(wait);
						if (alias.tgm.size >= rlsCount(artist)) worker = worker.then(() => agk.release(newArtistId));
						if ('dependants' in alias && alias.dependants.hasDependants)
							worker = worker.then(() => alias.dependants.restoreAll(alias.name, newArtistId));
						return worker.then(function() {
							let body = document.getElementById('body');
							body = body != null && body.value.trim();
							let image = document.body.querySelector('input[type="text"][name="image"]');
							image = image != null && image.value.trim();
							const workers = [ ];
							if (body || image) workers.push(editArtist(image, body, 'Wiki transfer', newArtistId));
							if (Array.isArray(artist.similarArtists) && artist.similarArtists.length > 0)
								workers.push(addSimilarArtists(artist.similarArtists.map(similarArtist => similarArtist.name), newArtistId)
									.then(() => { console.log(`[AAM] ${artist.similarArtists.length} similar artists were transfered to id ${newArtistId}`) }));
							if (workers.length > 0) return Promise.all(workers);
						}).then(() => { gotoArtistEditPage(newArtistId) });
					}).catch(failHandler);
				else {
					const mainIdentity = findAlias(mainIdentityId);
					console.assert(mainIdentity != null, 'mainIdentity != null');
					let worker = dupesCleanup(mainIdentity).then(function() {
						const workers = [mainIdentity, alias].filter(alias => 'dependants' in alias && alias.dependants.hasDependants)
							.map(alias => alias.dependants.removeAll());
						if (mainIdentity.tgm.size >= rlsCount(artist)) workers.push(agk.hold());
						if (workers.length > 0) return Promise.all(workers);
					});
					if (mainIdentity.tgm.aliasUsed) worker = worker.then(() => mainIdentity.tgm.removeAliasFromGroups());
					worker = worker.then(() => renameArtist(alias.name)).then(wait)
						.then(() => deleteAlias(artist.name)).then(wait).then(() => addAlias(artist.name)).then(wait);
					if (mainIdentity.tgm.aliasUsed) worker = worker.then(() => mainIdentity.tgm.addAliasToGroups(artist.name));
					if (mainIdentity.tgm.size >= rlsCount(artist)) worker = worker.then(() => agk.release());
					worker = worker.then(function() {
						const workers = [ ];
						if ('dependants' in alias && alias.dependants.hasDependants)
							workers.push(alias.dependants.restoreAll(alias.name));
						if ('dependants' in mainIdentity && mainIdentity.dependants.hasDependants)
							workers.push(mainIdentity.dependants.restoreAll(artist.name));
						if (workers.length > 0) return Promise.all(workers);
					}).then(() => { document.location.reload() }, failHandler);
				}
				return true;
			}

			function _redirectNRA(currentTarget, redirect) {
				const alias = getAlias(currentTarget);
				console.assert(alias && typeof alias == 'object');
				if (redirect.id == alias.id) return;
				let nagText = `CAUTION

This action makes alias "${alias.name}" redirect to artist\'s variant "${redirect.name}",
and replaces the alias in all involved groups (if any) with this variant.`;
				if (alias.tgm.aliasUsed) nagText += '\n\nBlocked by ' + alias.tgm.size + ' groups';
				if (confirm(nagText + epitaph)) setProgress(currentTarget); else return;
				redirectAliasTo(alias, redirect).then(() => { document.location.reload() }, failHandler);
			}

			function changeToRedirect(evt) {
				if (activeElement != null) return false;
				console.assert(evt.currentTarget instanceof HTMLElement);
				_redirectNRA(evt.currentTarget, getSelectedRedirect(true));
				return true;
			}

			function renameNRA(evt) {
				if (activeElement != null) return false;
				console.assert(evt.currentTarget instanceof HTMLElement);
				const alias = getAlias(evt.currentTarget);
				console.assert(alias && typeof alias == 'object');
				let nagText = `CAUTION

This action renames alias
"${alias.name}",
and replaces the alias in all involved groups (if any) with the new name.
New name can't be artist name or alias already taken on the site.`;
				if (alias.tgm.aliasUsed) nagText += '\n\nBlocked by ' + alias.tgm.size + ' groups';
				let newName = prompt(nagText + '\n\nThe operation can be reverted only by hand, to proceed enter and confirm new name\n\n', alias.name);
				if (newName) newName = newName.trim(); else return false;
				if (!newName || newName == alias.name) return false;
				const currentTarget = evt.currentTarget;
				(newName.toLowerCase() == alias.name.toLowerCase() ? Promise.reject('Case change')
				 		: findArtistAlias(newName, 0, true).then(function(alias) {
					_redirectNRA(currentTarget, alias);
					//alert(`Name is already taken by alias id ${alias.id}, the operation is aborted`);
				}, reason => getSiteArtist(newName).then(function(resolvesTo) {
					if (resolvesTo.id == artist.id) return Promise.reject('Implicit redirect');
					alert(`Name is already taken by artist "${resolvesTo.name}" (${resolvesTo.id}), the operation is aborted`);
					GM_openInTab(document.location.origin + '/artist.php?id=' + resolvesTo.id.toString(), false);
				}))).catch(function(status) {
					setProgress(currentTarget);
					if (alias.id == mainIdentityId) alias.dependants.removeAll().then(() => renameArtist(newName))
						.then(() => resolveArtistId(newName)).then(artistId => alias.dependants.restoreAll(newName, artistId)
							.then(() => { if (artistId != artist.id) gotoArtistEditPage(artistId); else document.location.reload() }));
					else renameAlias(alias, newName).then(() => { document.location.reload() }, failHandler);
				});
				return true;
			}

			function cutOffNRA(evt) {
				if (activeElement != null) return false;
				console.assert(evt.currentTarget instanceof HTMLElement);
				const alias = getAlias(evt.currentTarget);
				console.assert(alias && typeof alias == 'object');
				console.assert('dependants' in alias, "'dependants' in alias");
				let nagText = 'CAUTION\n\nThis action ';
				nagText += alias.tgm.aliasUsed ? `cuts off identity "${alias.name}"
from artist ${artist.name} and leaves it in separate group.

Blocked by ${alias.tgm.size} groups`
					: `deletes identity "${alias.name}" and all it's dependants (${alias.dependants.size}).

(Not used in any release)`;
				if (rlsCount(artist) <= alias.tgm.size) nagText += `

This action also vanishes this artist group as no other name variants
are used in any release`;
				if (confirm(nagText + epitaph)) setProgress(evt.currentTarget); else return false;
				const agk = new ArtistGroupKeeper;
				let worker = prologue(alias, agk).then(() => deleteAlias(alias.id)).then(wait);
				if (alias.tgm.aliasUsed) worker = worker.then(() => alias.tgm.addAliasToGroups(alias.name));
				worker = worker.then(alias.tgm.aliasUsed ? () => findArtistId(alias.name).then(function(newArtistId) {
					let worker = Promise.resolve();
					if ('dependants' in alias && alias.dependants.hasDependants)
						worker = worker.then(() => alias.dependants.restoreAll(alias.name, newArtistId));
					return worker.then(function() {
						if (rlsCount(artist) > alias.tgm.size) {
							GM_openInTab(document.location.origin + '/artist.php?id=' + newArtistId.toString(), true);
							setTimeout(() => { document.location.reload() }, 100);
						} else gotoArtistPage(newArtistId);
					});
				}) : () => { document.location.reload() }).catch(failHandler);
				return true;
			}

			function moveNRA(evt) {
				if (activeElement != null) return false;
				console.assert(evt.currentTarget instanceof HTMLElement);
				const alias = getAlias(evt.currentTarget);
				console.assert(alias && typeof alias == 'object');
				console.assert('dependants' in alias, "'dependants' in alias");
				const tgtArtist = prompt(`This action moves identity "${alias.name}"
from profile page ${artist.name} to different artist.

Enter target artist site name, site id or site profile link:`);
				if (!tgtArtist) return false;
				let artistId = /^(\d+)$/.test(tgtArtist) && parseInt(tgtArtist);
				if (!(artistId > 0) && (artistId = tgtArtist.trim())) try {
					let url = new URL(artistId);
					if (url.origin == document.location.origin && url.pathname == '/artist.php'
							&& (url = parseInt(url.searchParams.get('id'))) > 0) artistId = url;
				} catch(e) { }
				const currentTarget = evt.currentTarget;
				if (artistId) getSiteArtist(artistId).then(function(tgtArtist) {
					if (tgtArtist.id == artist.id) return false;
					let nagText = `This action moves identity "${alias.name}"
from profile page ${artist.name}
to profile "${tgtArtist.name}" (${tgtArtist.id}).

Blocked by ${alias.tgm.size} groups`;
					if (rlsCount(artist) <= alias.tgm.size) nagText += `

This action also vanishes this artist group as no other name variants
are used in any release`;
					if (confirm('CAUTION\n\n' + nagText + epitaph)) setProgress(currentTarget); else return false;
					const agk = new ArtistGroupKeeper;
					prologue(alias, agk).then(() => deleteAlias(alias.id)).then(wait)
							.then(() => addAlias(alias.name, 0, tgtArtist.id)).then(wait)
							.then(() => resolveAliasId(alias.name, tgtArtist.id)).then(function(newAliasId) {
						let worker = alias.tgm.aliasUsed ? alias.tgm.addAliasToGroups(alias.name) : Promise.resolve('Unused');
						if ('dependants' in alias && alias.dependants.hasDependants)
							worker = worker.then(() => alias.dependants.restoreAll(newAliasId, tgtArtist.id));
						return worker.then(function() {
							if (rlsCount(artist) > alias.tgm.size) {
								GM_openInTab(document.location.origin + '/artist.php?id=' + tgtArtist.id.toString(), true);
								setTimeout(() => { document.location.reload() }, 100);
							} else gotoArtistPage(tgtArtist.id);
						});
					});
				}, alert);
				return true;
			}

			function split(evt) {
				if (activeElement != null) return false;
				console.assert(evt.currentTarget instanceof HTMLElement);
				let newName, newNames = [ ];
				const alias = getAlias(evt.currentTarget);
				console.assert(alias && typeof alias == 'object');
				if (!alias.tgm.aliasUsed) return false;
				const prologue = () => {
					let result = `CAUTION

This action splits artist's identity "${alias.name}" into two or more names
and replaces the identity in all involved groups with new names. No linking of new names
to current artist will be performed, profile pages of names that aren't existing aliases already
will open in separate tabs for review.`;
					if (alias.tgm.aliasUsed) result += '\n\nBlocked by ' + alias.tgm.size + ' groups';
					if (newNames.length > 0) result += '\n\n' + newNames.map(n => '\t' + n).join('\n');
					return result;
				};
				do {
					if ((newName = prompt(prologue().replace(/^CAUTION\s*/, '') +
						`\n\nEnter carefully new artist name #${newNames.length + 1}, to finish submit empty input\n\n`,
						newNames.length < 2 ? alias.name : undefined)) == undefined) return false;
					if ((newName = newName.trim()) && !newNames.includes(newName)) newNames.push(newName);
				} while (newName);
				if (newNames.length > 1 && confirm(prologue() + epitaph)) setProgress(evt.currentTarget); else return false;
				console.info(alias.name, 'present in these groups:', alias.tgm.groups);
				//alias.dependants.removeAll();
				alias.tgm.removeAliasFromGroups().then(() => deleteAlias(alias.id))
					.then(() => Promise.all(newNames.map(TorrentGroupsManager.prototype.addAliasToGroups.bind(alias.tgm))))
					.then(() => findArtistId(newNames.shift()).then(function(artistId) {
						if (artistId != artist.id && rlsCount(artist) > alias.tgm.size)
							GM_openInTab(document.location.origin + '/artist.php?id=' + artistId.toString(), true);
						newNames.forEach(newName =>
							{ GM_openInTab(document.location.origin + '/artist.php?artistname=' + newName, true) });
					setTimeout(() => { if (artistId == artist.id) document.location.reload(); else gotoArtistPage(artistId) }, 100);
					})).catch(failHandler);
				return true;
			}

			function selectAlias(evt) {
				console.assert(dropDown instanceof HTMLSelectElement, 'dropDown instanceof HTMLSelectElement');
				const alias = getAlias(evt.currentTarget);
				console.assert(alias && typeof alias == 'object');
				if (!alias.redirectId && dropDown != null) {
					dropDown.value = alias.id;
					if (typeof dropDown.onchange == 'function') dropDown.onchange();
				}
			}

			function fixNRA(evt) {
				console.assert(evt.currentTarget instanceof HTMLElement);
				if (activeElement != null) return false;
				const alias = getAlias(evt.currentTarget);
				console.assert(alias && typeof alias == 'object');
				const target = findAlias(alias.name, true);
				if (!target) throw 'Assertion failed: redirecting alias was not found';
				if (target.id != alias.id) setProgress(evt.currentTarget); else return false;
				const agk = new ArtistGroupKeeper, workers = [ ];
				if (alias.tgm.size >= rlsCount(artist)) workers.push(agk.hold());
				if ('dependants' in alias && alias.dependants.hasDependants) workers.push(alias.dependants.removeAll());
				let worker = Promise.all(workers);
				if (alias.tgm.aliasUsed) worker = worker.then(() => alias.tgm.removeAliasFromGroups());
				worker.then(() => deleteAlias(alias.id)).then(wait).then(() => epilogue(alias, agk, alias.name, target.id))
					.then(() => { document.location.reload() }, failHandler);
				return true;
			}

			// RDA actions

			function changeToNra(evt) {
				if (activeElement != null) return false;
				console.assert(evt.currentTarget instanceof HTMLElement);
				const alias = getAlias(evt.currentTarget);
				console.assert(alias && typeof alias == 'object');
				if (!confirm(`This action makes artist's identity "${alias.name}" distinct`)) return false;
				setProgress(evt.currentTarget);
				let worker = alias.tgm.aliasUsed ? alias.tgm.removeAliasFromGroups() : Promise.resolve();
				worker = worker.then(() => deleteAlias(alias.id)).then(() => wait(alias.name).then(addAlias));
				if (alias.tgm.aliasUsed) worker = worker.then(() => alias.tgm.addAliasToGroups(alias.name));
				worker = worker.then(() => { document.location.reload() }, failHandler);
				return true;
			}

			function changeRedirectRDA(currentTarget, alias, target) {
				console.assert(currentTarget instanceof HTMLAnchorElement);
				console.assert(alias && alias.id > 0, 'alias && alias.id > 0');
				console.assert(target && target.id > 0, 'target && target.id > 0');
				setProgress(currentTarget);
				(alias.tgm.aliasUsed ? resolveRDA(alias) : Promise.resolve('Resolved'))
					.then(() => redirectAliasTo(alias, target)).then(() => { document.location.reload() }, failHandler);
			}

			function changeRedirect(evt) {
				if (activeElement != null) return false;
				console.assert(evt.currentTarget instanceof HTMLElement);
				const alias = getAlias(evt.currentTarget), redirect = getSelectedRedirect();
				console.assert(alias && typeof alias == 'object');
				if (redirect.id == 0) return changeToNra(evt); else if (redirect.id == alias.redirectId) return false;
				if (confirm(`This action changes alias "${alias.name}" to resolve to "${redirect.name}"`))
					changeRedirectRDA(evt.currentTarget, alias, redirect);
				return true;
			}

			function renameRDA(evt) {
				if (activeElement != null) return false;
				console.assert(evt.currentTarget instanceof HTMLElement);
				const alias = getAlias(evt.currentTarget);
				console.assert(alias && typeof alias == 'object');
				console.assert(alias.redirectId, 'alias.redirectId');
				let newName = prompt(`This action renames alias "${alias.name}"`, alias.name);
				if (newName) newName = newName.trim(); else return false;
				if (!newName || newName == alias.name) return false;
				const currentTarget = evt.currentTarget;
				findArtistAlias(newName, 0, true).then(function(target) {
					if (target.id != alias.id && target.id != alias.redirectId) changeRedirectRDA(currentTarget, alias, target);
						else alert(`Name is already taken by alias id ${alias.id}, the operation is aborted`);
				}, reason => getSiteArtist(newName).then(function(dupeTo) {
					alert(`Name is already taken by artist "${dupeTo.name}" (${dupeTo.id}), the operation is aborted`);
					GM_openInTab(document.location.origin + '/artist.php?id=' + dupeTo.id.toString(), false);
				})).catch(function(reason) {
					setProgress(currentTarget);
					renameAlias(alias, newName).then(() => { document.location.reload() }, failHandler);
				});
				return true;
			}

			function fixRDA(evt) {
				if (activeElement != null) return false;
				console.assert(evt.currentTarget instanceof HTMLElement);
				const alias = getAlias(evt.currentTarget);
				console.assert(alias && typeof alias == 'object');
				if (!alias.redirectId) return false;
				const target = findAlias(alias.redirectId, true);
				if (!target) throw 'Assertion failed: redirecting alias was not found';
				setProgress(evt.currentTarget);
				resolveRDA(alias).then(() => { document.location.reload() }, failHandler);
				return true;
			}

			function X(evt) {
				if (activeElement != null) return false;
				console.assert(evt.currentTarget instanceof HTMLElement);
				const alias = getAlias(evt.currentTarget);
				console.assert(alias && typeof alias == 'object');
				if (!confirm('Delete this alias?')) return false;
				setProgress(evt.currentTarget);
				deleteAlias(alias.id).then(() => { document.location.reload() }, failHandler);
				return false;
			}

			// batch actions
			function batchAction(actions, condition, onlySelected = true) {
				function setProgressInfo(content, destructive = false, asHTML = false) {
					const id = 'aam-batch-progress-info';
					let div = document.getElementById(id);
					if (!content) return destroyInfoBox(div); else if (div == null) {
						const container = document.getElementById('batch-controls');
						if (container == null)  throw 'Assertion failed: contaainer not found';
						div = document.createElement('DIV');
						div.id = id;
						div.style = 'display: inline-block; margin-left: 2em;';
						container.append(div);
					} else if (div.hTimer) clearTimeout(div.hTimer);
					div[asHTML ? 'innerHTML' : 'textContent'] = content;
					if (destructive) div.hTimer = setTimeout(destroyInfoBox, 10000, div);
						else if ('hTimer' in div) delete div.hTimer;
				}

				console.assert(typeof actions == 'function');
				if (typeof actions != 'function') throw 'Invalid argument';
				if (onlySelected) {
					var selAliases = aliasesRoot.querySelectorAll('input.aam[type="checkbox"]:checked');
					if (selAliases.length <= 0) return Promise.reject('No aliases selected');
				} else selAliases = aliases;
				selAliases = Array.from(selAliases, getAlias).filter(alias => alias != null && alias.id != mainIdentityId);
				console.assert(selAliases.every(Boolean), selAliases);
				if (!selAliases.every(Boolean)) throw 'Assertion failed: element(s) without linked alias';
				if (typeof condition == 'function') selAliases = selAliases.filter(condition);
				if (selAliases.length <= 0) return Promise.reject('No alias fulfils for this action');
				const worker = alias => alias.redirectId ? actions(alias) : dupesCleanup(alias).then(() => actions(alias));
				function workers() {
					if (selAliases.length > maxBatchSize) return (function execIndex(index = 0) {
						if (index >= 0 && index < selAliases.length) {
							setProgressInfo(`Please wait (${index}/${selAliases.length})`);
							return worker(selAliases[index]).then(() => execIndex(index + 1))
						} else return Promise.resolve('Completed (serial)');
					})();
					setProgressInfo(`Please wait (${selAliases.length} aliases to process)`);
					return Promise.all(selAliases.map(worker)).then(response => 'Completed (parallel)');
				}
				return (artist.torrentgroup.every(torrentGroup => selAliases.some(alias =>
						alias.tgm && Object.keys(alias.tgm).includes(torrentGroup.groupId))) ? (function() {
					const agk = new ArtistGroupKeeper;
					return agk.hold().then(workers).then(() => agk.release());
				})() : workers()).then(function(status) {
					setProgressInfo(status, true);
					if (beeps) beeps[4].play();
					document.location.reload();
				}, failHandler);
			}

			function batchChangeToRDA(evt) {
				if (activeElement != null) return;
				const redirect = getSelectedRedirect();
				if (redirect.id == 0) return batchChangeToNRA(evt);
				let nagText = `CAUTION

This action makes all selected aliases redirect to artist\'s variant
"${redirect.name}",
and replaces all non-redirect aliases in their involved groups (if any) with this variant.`;
				if (confirm(nagText + epitaph)) setProgress(evt.currentTarget); else return false;
				batchAction(alias => redirectAliasTo(alias, redirect), alias => alias.id != redirect.id).catch(failHandler);
			}

			function batchChangeToNRA(evt) {
				if (activeElement != null) return;
				let nagText = `This action makes all selected RDAs distinct within artist`;
				if (confirm(nagText)) setProgress(evt.currentTarget); else return;
				batchAction(alias => deleteAlias(alias.id).then(() => wait(alias.name).then(addAlias)),
					alias => alias.redirectId > 0).catch(failHandler);
			}

			function batchRemove(evt) {
				if (activeElement != null) return;
				let nagText = `This action deletes all selected RDAs and unused NRAs`;
				if (confirm(nagText)) setProgress(evt.currentTarget); else return;
				batchAction(alias => deleteAlias(alias.id), alias => alias.redirectId > 0 || !alias.tgm.aliasUsed)
					.catch(failHandler);
			}

			function batchFixRDA(evt) {
				if (activeElement != null) return;
				// let nagText = `This action fixes all broken redirecting aliases`;
				// if (!confirm(nagText)) return;
				setProgress(evt.currentTarget, 'goldenrod');
				batchAction(alias => resolveRDA(alias), isBadRDA, false).catch(failHandler);
			}

			function deleteGhostArtist(evt) {
				if (Array.isArray(artist.torrentgroup) && artist.torrentgroup.length > 0
						|| Array.isArray(artist.requests) && artist.requests.length > 0) throw 'Not empty artist profile';
				const findArtist = (artistId = 1) => getSiteArtist(artistId).catch(reason => findArtist(artistId + 1));
				return findArtist(1000).then(artist2 => renameArtist(artist2.name)
					.then(() => wait()).then(() => deleteAlias(artist.name, artist2.id)))
					.then(() => { document.location.assign(document.location.origin + '/artist.php?artistname=' + encodeURIComponent(artist.name)) });
			}

			function applyDynaFilter(str) {
				const filterById = Number.isInteger(str), norm = str => str.toLowerCase();
				if (!filterById) str = str ? /^\d+$/.test(str) && parseInt(str) || (function() {
					const rx = /^\s*\/(.+)\/([dgimsuy]+)?\s*$/i.exec(str);
					if (rx != null) try { return new RegExp(rx[1], rx[2]) } catch(e) { /*console.info(e)*/ }
				})() || norm(str.trim()) : undefined;

				function isHidden(li) {
					if (!str) return false;
					const alias = getAlias(li);
					if (!alias) throw 'Void alias';
					if (!filterById && (str instanceof RegExp ? str.test(alias.name) : norm(alias.name).includes(str))) return false;
					if (!Number.isInteger(str)) return true; else if (str == alias.id) return false;
					const redirectsTo = rdExtractor.exec(li.textContent);
					return redirectsTo == null || str != parseInt(redirectsTo[1]);
				}
				for (let li of aliases) li.hidden = isHidden(li);
			}

			function setRowColor(li) {
				if (!(li instanceof HTMLLIElement)) throw 'Invalid argument';
				const alias = getAlias(li);
				li.style.backgroundColor = alias && !(alias.redirectId > 0) && alias.id == parseInt(dropDown.value) ?
					isLightTheme ? '#ffde004d' : isDarkTheme ? 'darkslategray' : 'orange' : li.dataset.bgColor || null;
			}

			// D&D support
			const dragStart = evt => { evt.dataTransfer.setData('text/aliasid', getAlias(evt.currentTarget).id) };
			function dragEnter(evt) {
				const tgtAlias = getAlias(evt.currentTarget);
				if (!tgtAlias) return true;
				const srcAlias = findAlias(parseInt(evt.dataTransfer.getData('text/aliasid')));
				if (!srcAlias || srcAlias.id == tgtAlias.id || srcAlias.redirectId == tgtAlias.id) return true;
				evt.currentTarget.style.backgroundColor = '#7fff0040';
				return false;
			}
			const dragOver = evt => false;
			function drop(evt) {
				if (evt.shiftKey) return true;
				setRowColor(evt.currentTarget);
				const tgtAlias = getAlias(evt.currentTarget),
							srcAlias = findAlias(parseInt(evt.dataTransfer.getData('text/aliasid')));
				if (!tgtAlias || !srcAlias || srcAlias.id == tgtAlias.id || srcAlias.redirectId == tgtAlias.id) return false;
				if (confirm(`Alias "${srcAlias.name}" (${srcAlias.id}) will be redirected to alias "${tgtAlias.name}" (${tgtAlias.id})`))
					redirectAliasTo(srcAlias, tgtAlias).then(() => { document.location.reload() }, failHandler);
				return false;
			}
			function dragExit(evt) {
				for (let tgt = evt.relatedTarget; tgt != null; tgt = tgt.parentNode)
					if (tgt == evt.currentTarget) return false;
				setRowColor(evt.currentTarget);
			}

			for (let li of aliases) {
				const alias = getAlias(li);
				if (alias && alias.name == artist.name) { mainIdentityId = alias.id; break; }
			}
			console.assert(mainIdentityId > 0);
			for (let li of aliases) {
				function addHoverHandler(elem) {
					if (!(elem instanceof HTMLElement)) throw 'Invalid argument';
					elem.onmouseenter = elem.onmouseleave = function(evt) {
						if (activeElement != null || evt.relatedTarget == evt.target) return false;
						evt.currentTarget.style.color = evt.type == 'mouseenter' ? isLightTheme ? 'tomato' : 'orange'
							: evt.currentTarget.dataset.color || null;
					};
					elem.style.transition = 'color 0.25s';
				}
				function addButton(caption, tooltip, cls, callback, highlight = false) {
					const span = document.createElement('SPAN');
					span.className = 'brackets';
					if (cls) span.classList.add(cls);
					if (buttonBay.firstChild != null && !buttonBay.style.gap) span.style.marginLeft = '4pt';
					span.style.cursor = 'pointer';
					if (caption) span.dataset.caption = span.textContent = caption.toUpperCase();
					if (highlight) span.dataset.color = span.style.color = 'red';
					if (tooltip) setTooltip(span, tooltip);
					if (typeof callback == 'function') span.onclick = callback;
					addHoverHandler(span);
					buttonBay.append(span);
				}
				function addIcon(source, tooltip) {
					if (!source) throw 'Invalid argument';
					const img = document.createElement('IMG');
					img.src = source.length <= 64 && GM_getResourceURL(source) || source;
					img.height = 10;
					if (!iconBay.style.gap && iconBay.childElementCount > 0) img.style.marginLeft = '2pt';
					if (tooltip) setTooltip(img, tooltip);
					iconBay.append(img);
					if (iconBay.parentNode == null) li.prepend(iconBay);
				}

				if ((li.alias = getAlias(li)) == null) {
					delete li.alias;
					continue;
				} else li.alias.tgm = new TorrentGroupsManager(li.alias.id);

				const [iconBay, buttonBay] = createElements('DIV', 'DIV');
				iconBay.style = 'display: inline-flex; flex-flow: row nowrap; gap: 2pt; margin-left: 2pt;';
				iconBay.className = 'icon-bay';
				buttonBay.style = 'display: inline-flex; flex-flow: row nowrap; gap: 4pt; margin-left: 10pt; padding: 0;';
				buttonBay.style.color = isDarkTheme ? '#0BC' : '#07B';
				buttonBay.className = 'button-bay';

				const [id, name] = li.getElementsByTagName('SPAN');
				id.style = 'display: inline-block; min-width: 3.1rem; text-align: right;';
				id.classList.add('alias-id'); setTooltip(id);
				name.classList.add('alias-name'); setTooltip(name);

				const findByText = (tagName, caption) => tagName && caption
					&& Array.prototype.find.call(li.getElementsByTagName(tagName),
						elem => elem.textContent.trim() == caption) || null;
				let a = findByText('A', 'User');
				if (a != null) {
					const _userId = parseInt(new URL(a.href).searchParams.get('id'));
					if (userId > 0 && _userId == userId) {
						const span = document.createElement('SPAN');
						span.className = 'brackets';
						span.style.color = isDarkTheme ? 'darkseagreen' : 'skyblue';
						span.textContent = 'Me';
						li.replaceChild(span, a);
					}
				}
				while ((a = findByText('A', 'X')) != null) a.remove();
				if (li.alias.id != mainIdentityId && !li.alias.tgm.aliasUsed) addButton('X', 'Delete this alias', 'delete', X);
				if (li.alias.redirectId > 0) { // RDA
					for (let span of li.getElementsByTagName('SPAN')) if (parseInt(span.textContent) == li.alias.redirectId) {
						const target = findAlias(li.alias.redirectId);
						if (target != null) window.tooltipster.then(function() {
							const tooltip = '<span style="font-size: 10pt; padding: 0.5rem;">' + target.name + '</span>';
							if ($(span).data('plugin_tooltipster'))
								$(span).tooltipster('update', tooltip).data('plugin_tooltipster').options.delay = 100;
							else $(span).tooltipster({ delay: 100, content: tooltip });
						}).catch(function(reason) {
							span.title = target.name;
							console.warn(reason);
						});
						span.style.cursor = 'pointer';
						span.onclick = function(evt) {
							applyDynaFilter(li.alias.redirectId);
							const dynaFilter = document.getElementById('aliases-dynafilter');
							if (dynaFilter != null) dynaFilter.value = li.alias.redirectId;
						};
						addHoverHandler(span);
					}

					addButton('NRA', 'Change to distinct alias', 'make-nra', changeToNra);
					addButton('CHG', 'Change redirect', 'redirect-to', changeRedirect);
					addButton('RN', 'Rename this alias', 'rename', renameRDA);
					if (isBadRDA(li.alias)) {
						li.dataset.bgColor = li.style.backgroundColor = '#FF000020';
						const tooltip = 'This alias is still linked to torrent groups, doesn\'t reolve to true alias or resolves to non-existing alias. Fix forces resolve the alias to it\'s true target, aliases redirecting to invalid id will resolve to main artist name.';
						addIcon('warn-icon2', tooltip);
						addButton('FIX', tooltip, 'fix-rda', fixRDA, true);
					}
					li.classList.add('redirecting-alias');
				} else { // NRA
					id.style.cursor = 'pointer';
					id.onclick = function(evt) {
						const aliasId = parseInt(evt.currentTarget.textContent);
						console.assert(aliasId > 0);
						applyDynaFilter(aliasId);
						const dynaFilter = document.getElementById('aliases-dynafilter');
						if (dynaFilter != null) dynaFilter.value = aliasId;
					};
					id.title = 'Only this alias family';
					addHoverHandler(id);

					if (li.alias.id == mainIdentityId) {
						name.style.fontWeight = 900;
						li.classList.add('main-identity');
					}
					name.style.cursor = 'pointer';
					name.onclick = selectAlias;
					name.title = 'Select as redirect target';
					addHoverHandler(name);

					li.dataset.color = li.style.color = isLightTheme ? 'peru' : isDarkTheme ? 'antiquewhite' : 'darkorange';
					if (li.alias.id != mainIdentityId)
						addButton('MAIN', 'Make this alias main artist\'s identity', 'make-main', makeItMain);
					addButton('RD', 'Change to redirecting alias to artist\'s identity selected in dropdown below',
						'redirect-to', changeToRedirect);
					addButton('RN', 'Rename this alias while keeping it distinguished',
						'rename', renameNRA);
					if (li.alias.id != mainIdentityId) {
						addButton('CUT', 'Just unlink this alias from the artist and leave it in separate group; unused aliases will be deleted',
							'cut-off', cutOffNRA);
						addButton('MV', 'Move alias to different profile page', 'move', moveNRA);
					}
					if (li.alias.id != mainIdentityId && li.alias.name == artist.name) {
						li.dataset.bgColor = li.style.backgroundColor = '#FF00FF20';
						const tooltip = 'This alias is a duplicate of main identity';
						addIcon('warn-icon2', tooltip);
						addButton('FIX', tooltip, 'fix-nra', fixNRA, true);
					}
					if (li.alias.tgm.aliasUsed) addButton('S', 'Split this ' + (li.alias.name == artist.name ? 'artist': 'alias') +
						' to two or more names', 'split', split);
					li.ondragenter = dragEnter;
					li.ondragover = dragOver;
					li.ondrop = drop;
					li[`ondrag${'ondragexit' in li ? 'exit' : 'leave'}`] = dragExit;
					li.classList.add('non-redirecting-alias');
				}
				if (buttonBay.childElementCount > 0) li.append(buttonBay);
				for (let redirectElem of li.getElementsByClassName('redirect-to')) {
					redirectElem.draggable = true;
					redirectElem.ondragstart = dragStart;
				}
				if (li.alias.tgm.aliasUsed) {
					const span = document.createElement('span');
					span.textContent = '(' + li.alias.tgm.size + ')';
					span.style.marginLeft = '10pt';
					span.className = 'lock-counter';
					if (li.alias.redirectId > 0) span.style.color = 'red';
					setTooltip(span, 'Release groups blocking this alias');
					li.append(span);
				}
			}
			for (let li of aliases) if ('alias' in li && !(li.alias.redirectId > 0))
				li.alias.dependants = new AliasDependantsManager(li.alias.id);

			const h3 = aliasesRoot.getElementsByTagName('H3');
			if (h3.length > 0 && aliases.length > 1) {
				const elems = createElements('LABEL', 'INPUT', 'INPUT', 'DIV', 'LABEL', 'INPUT', 'IMG', 'SPAN');
				elems[3].style = 'transition: height 0.5s; height: 0; overflow: hidden;';
				elems[3].id = 'batch-controls';
				elems[4].style = 'margin-left: 15pt; padding: 5pt; line-height: 0;';
				elems[5].type = 'checkbox';
				elems[5].onclick = function(evt) {
					for (let input of aliasesRoot.querySelectorAll('div > ul > li > input.aam[type="checkbox"]'))
						if (!input.parentNode.hidden) input.checked = evt.currentTarget.checked;
				};
				elems[4].append(elems[5]);
				elems[3].append(elems[4]);

				function addButton(caption, callback, tooltip, margin = '5pt', highlight = false) {
					const input = document.createElement('INPUT');
					input.type = 'button';
					if (caption) input.dataset.caption = input.value = caption;
					if (margin) input.style.marginLeft = margin;
					if (highlight) input.style.color = 'red';
					if (tooltip) setTooltip(input, tooltip);
					if (typeof callback == 'function') input.onclick = callback;
					elems[3].append(input);
				}
				addButton('Redirect', batchChangeToRDA, 'Make selected aliases redirect to selected identity', '1em');
				addButton('Distinct', batchChangeToNRA, 'Make selected aliases distinct (make them NRA)');
				addButton('Delete', batchRemove, 'Remove all selected aliases (except used NRAs)');
				if (aliasesRoot.getElementsByClassName('fix-rda').length > 0)
					addButton('Fix broken RDAs', batchFixRDA, 'Fixes all broken redirecting aliases; aliases resolving to non-existing id will resolve to main identity', undefined, true);

				h3[0].after(elems[3]);
				elems[2].type = 'button';
				elems[2].value = 'Show batch controls';
				elems[2].style.marginLeft = '2em';
				elems[2].onclick = function(evt) {
					if ((elems[3] = document.getElementById('batch-controls')) != null) elems[3].style.height = 'auto';
					evt.currentTarget.remove();
					let tabIndex = 0;
					for (let li of aliasesRoot.querySelectorAll('div > ul > li')) {
						let elem = li.querySelector(':scope > span:nth-of-type(2)');
						if (elem == null || elem.textContent == artist.name) continue;
						elem = document.createElement('INPUT');
						elem.type = 'checkbox';
						elem.className = 'aam';
						elem.tabIndex = ++tabIndex;
						elem.style = 'margin-right: 2pt; position: relative; left: -2pt;';
						li.prepend(elem);
						li.style.listStyleType = 'none';
					}
				};
				h3[0].after(elems[2]);
				elems[0].textContent = 'Quick filter';
				elems[1].type = 'text';
				elems[1].id = 'aliases-dynafilter';
				elems[1].style = 'margin-left: 1em; width: 20em; padding-right: 20pt;';
				elems[1].ondblclick = evt => { applyDynaFilter(evt.currentTarget.value = '') };
				elems[1].oninput = evt => { applyDynaFilter(evt.currentTarget.value) };
				elems[1].onkeyup = evt => { if (evt.key == 'Escape') evt.currentTarget.ondblclick(evt) };
				elems[1].ondragover = elems[1].onpaste = evt => { evt.currentTarget.value = '' };
				elems[1].placeholder = 'text pattern, /regexp/i, alias id';
				elems[6].height = 17;
				elems[6].style = 'position: relative; left: -17pt; top: 2pt;';
				elems[6].src = GM_getResourceURL('input-clear-button'); //'https://ptpimg.me/d005eu.png';
				elems[6].onclick = evt => {
					applyDynaFilter();
					const input = document.getElementById('aliases-dynafilter');
					if (input != null) input.value = '';
				};
				elems[0].append(elems[1]);
				elems[0].append(elems[6]);
				h3[0].after(elems[0]);
				elems[7].textContent = '(' + aliases.length + ')';
				elems[7].style = 'margin-left: 1em; font: normal 9pt Helvetica, Arial, sans-serif;';
				h3[0].append(elems[7]);
			}
			if (dropDown != null) dropDown.onchange = evt => { aliases.forEach(setRowColor) };
			if (typeof dropDown.onchange == 'function') dropDown.onchange();

			if ((!Array.isArray(artist.torrentgroup) || artist.torrentgroup.length <= 0)
					&& (!Array.isArray(artist.requests) || artist.requests.length <= 0)) {
				const ref = document.body.querySelector('div#content > div.thin > h2:nth-of-type(2)');
				if (ref == null) throw 'Assertion failed: anchor header was not found';
				const elems = createElements('H2', 'DIV', 'INPUT');
				elems[0].textContent = 'Wipe out ghost artist';
				ref.before(elems[0]);
				elems[1].className = 'box pad';
				elems[1].style.textAlign = 'center';
				elems[2].type = 'BUTTON';
				elems[2].value = 'Delete';
				elems[2].onclick = deleteGhostArtist;
				elems[1].append(elems[2]);
				ref.before(elems[1]);
			}

			function addDiscogsImport() {
				const dcEntryTypes = { a: 'artist', r: 'release', m: 'master', l: 'label', u: 'user' };
				const sitesFilter = url =>
					url && !siteBlacklist.some(pattern => url.toLowerCase().includes(pattern.toLowerCase()));
				const dcArtistLink = artist =>
					`[align=left][url=${artist.uri}][img]https://ptpimg.me/v27891.png[/img][/url][/align]`;
				const useLinkFriendlyNames = GM_getValue('discogs_friendly_urls', false);
				const listMatchWorkers = new Map, searchWorkers = new Map;
				const multiArtistProfileImages = ['w8f38o.png', '6qap57.png', '13e92p.png']
					.map(fn => 'https://ptpimg.me/' + fn);

				function setProgressInfo(content, destructive = false, asHTML = false) {
					const id = 'discogs-progress-info';
					let div = document.getElementById(id);
					if (!content) return destroyInfoBox(div); else if (div == null) {
						div = document.createElement('DIV');
						div.id = id;
						div.style = 'margin-top: 1em;';
						dcForm.append(div);
					} else if (div.hTimer) clearTimeout(div.hTimer);
					div[asHTML ? 'innerHTML' : 'textContent'] = content;
					if (destructive) div.hTimer = setTimeout(destroyInfoBox, 10000, div);
						else if ('hTimer' in div) delete div.hTimer;
				}

				function dcUrlToBB(url) {
					if (!url || !(url = url.trim())) return null;
					let friendlyName = /^(.+?):\s*(https?:\/\/.+)$/i.exec(url);
					if (friendlyName != null) {
						url = friendlyName[2];
						friendlyName = friendlyName[1];
					} else try {
						const _url = new URL(url);
						if (!['https:', 'http:'].includes(_url.protocol)) throw 'Unsupported protocol';
						for (let entry of Object.entries({
							'Discogs': 'discogs.com', 'Bandcamp': '.bandcamp.com', 'SoundCloud': 'soundcloud.com',
							'Last.fm': 'last.fm', 'YouTube': 'youtube.com', 'Wikipedia': 'wikipedia.org', 'IMDb': 'imdb.com',
							'MusicBrainz': 'musicbrainz.org', 'Spotify': 'spotify.com', 'Tidal': 'tidal.com',
							'Tumblr': 'tumblr.com', 'Twitter': 'twitter.com', 'Facebook': 'facebook.com',
						})) if (_url.hostname.endsWith(entry[1])) friendlyName = entry[0];
					} catch(e) {
						console.log(`Not a valid URL (${e}):`, url);
						return url;
					}
					return friendlyName && useLinkFriendlyNames ? `[url=${url}]${friendlyName}[/url]` : '[url]' + url + '[/url]';
				}

				function dcResolveLinks(body, replacer) {
					if (typeof body != 'string' || typeof replacer != 'function') throw 'Invalid argument';
					body = body.replace(/\[([armlu])=([^\[\]\r\n]+)\]/ig,
						(match, key, id) => !/^\d+$/.test(id) ? replacer(key, id, dcNameNormalizer(id)) : match);
					let lookupWorkers = [ ], match;
					const entryExtractor = /\[([armlu])=?(\d+)\]/ig;
					while ((match = entryExtractor.exec(body)) != null) {
						const en1 = { key: match[1].toLowerCase(), id: parseInt(match[2]) };
						if (!lookupWorkers.some(en2 => en2.key == en1.key && en2.id == en1.id)) lookupWorkers.push(en1);
					}
					return (lookupWorkers = lookupWorkers.map(entry => getDiscogsEntry(dcEntryTypes[entry.key], entry.id).then(result => ({
						key: entry.key,
						id: entry.id,
						resolvedId: result.id,
						name: (result.name ? dcNameNormalizer(result.name) : result.title.trim()),
					}), function(reason) {
						alert(`Discogs lookup for ${entry.key}${entry.id} failed: ` + reason);
						return null;
					}))).length > 0 ? Promise.all(lookupWorkers).then(function(entries) {
						if ((entries = entries.filter(Boolean)).length > 0) return entries;
						return Promise.reject('No entries were resolved');
					}).then(entries => Object.assign.apply({ }, Object.keys(dcEntryTypes).map(key => ({ [key]: (function() {
						const items = entries.filter(entry => entry.key == key).map(entry => ({ [entry.id]: entry.name }));
						return items.length > 0 ? Object.assign.apply({ }, items) : { };
					})() })))).then(lookupTable => body.replace(entryExtractor, function(match, key, id) {
						const name = lookupTable[key = key.toLowerCase()][id = parseInt(id)];
						if (!name) console.warn('Discogs item not resolved:', match);
						return replacer(key, id, name);
					})) : Promise.resolve(body);
				}

				function getDcArtistId() {
					if (!(dcInput instanceof HTMLInputElement)) throw 'Assertion failed: dcInput not an INPUT element';
					let artistId = dcEntryIdXtractor.exec(dcInput.value);
					if (artistId != null && artistId[1].toLowerCase() == 'artist' && (artistId = parseInt(artistId[2])) > 0)
						return artistId;
					if ((artistId = parseInt(dcInput.value)) > 0) return artistId;
					return NaN;
				}

				function reliabilityColorValue(matched, total, colors = [0xccbf00, 0x008000]) {
					if (!total) return; else if (matched <= 0) return '#' + colors[0].toString(16).padStart(6, '0');
					if (matched >= total) return '#' + colors[1].toString(16).padStart(6, '0');
					const colorIndexRate = Math.min(matched / total / 0.80, 1);
					const colorsAsRGB = colors.map(color => [2, 1, 0].map(index => (color >> (index << 3)) & 0xFF));
					const compositeValue = index => colorsAsRGB[0][index] +
						Math.round(colorIndexRate * (colorsAsRGB[1][index] - colorsAsRGB[0][index]));
					return `rgb(${compositeValue(0)}, ${compositeValue(1)}, ${compositeValue(2)})`;
				}

				function updateArtistWiki(bbCode, summary, editNotes, overwrite = 1) {
					if (!bbCode || !(bbCode = bbCode.trim())) return false;
					let elem = document.getElementById('body');
					console.assert(elem != null, 'body != null');
					if (elem == null || elem.value.includes(bbCode.replace(/\r?\n/g, '\n'))) return false;
					if (elem.value.length <= 0 || overwrite > 1) {
						if (isRED) bbCode = '[pad=6|0|0|0]' + bbCode + '[/pad]';
						elem.value = bbCode;
					} else if (overwrite <= 0) return false; else elem.value += '\n\n' + bbCode;
					if (summary && (elem = document.body.querySelector('input[type="text"][name="summary"]')) != null)
						elem.value = summary;
					if (editNotes && (elem = document.getElementById('artisteditnotes')) != null
							&& !elem.value.toLowerCase().includes(editNotes.toLowerCase()))
						if (!elem.value) elem.value = editNotes; else elem.value += '\n\n' + editNotes;
					return true
				}

				function genDcArtistDescriptionBB(dcArtist) {
					if (!dcArtist) throw 'The parameter is required';
					const haveMembers = Array.isArray(dcArtist.members) && dcArtist.members.length > 0,
								haveGroups = Array.isArray(dcArtist.groups) && dcArtist.groups.length > 0;

					function dcLink(key, id, caption) {
						if (!key || !id) throw 'Invalid argument';
						const link = (caption = key + id) =>
							`[url=${encodeURI(`${dcOrigin}/${dcEntryTypes[key]}/${id}`)}][plain]${caption}[/plain][/url]`;
						if (caption) switch (key = key.toLowerCase()) {
							case 'a': return `[artist]${dcNameNormalizer(caption)}[/artist]${link('')}`;
							// case 'l': return `[url=${document.location.origin}/torrents.php?${new URLSearchParams({
							// 		action: 'advanced',
							// 		remasterrecordlabel: dcNameNormalizer(caption),
							// 	}).toString()}]${dcNameNormalizer(caption)}[/url]${link('')}`;
							// case 'm': case 'r': return `[url=${document.location.origin}/torrents.php?${new URLSearchParams({
							// 		action: 'advanced',
							// 		groupname: dcNameNormalizer(caption),
							// 	}).toString()}]${dcNameNormalizer(caption)}[/url]${link('')}`;
						}
						return link(caption);
					}
					function addRelatives(bbCode) {
						function relativesFormatter(key, label) {
							if (!Array.isArray(dcArtist[key])) return '';
							const relatives = dcArtist[key].filter(relative => relative.active)
									.concat(dcArtist[key].filter(relative => isRED && !relative.active)).map(function(relative) {
								const a = dcLink('a', relative.id, relative.name);
								return relative.active ? a : `[s]${a}[/s]`;
							});
							return relatives.length > 0 ? relatives.length <= 30 ? `\n[b]${label}:[/b] ${relatives.join(', ')}`
								: `\n[hide=${label}]${relatives.join(', ')}[/hide]` : '';
						}

						if (haveMembers) bbCode += relativesFormatter('members', 'Members');
						if (haveGroups) bbCode += relativesFormatter('groups', 'Member of');
						return bbCode.trim() || Promise.reject('no profile data');
					}

					const head = !haveMembers && dcArtist.realname && dcArtist.realname.trim() != dcNameNormalizer(dcArtist.name) ?
						`[b]Real name:[/b] [plain]${dcArtist.realname.trim()}[/plain]` : '';
					if (!dcArtist.profile) return Promise.resolve(head).then(addRelatives);
					const profile = dcArtist.profile.trim(), substitutions = [
						[/\s*^(?:[Ff]or .+ (?:use|see|visit)|[Ss]ee also) \[a(?:=.+?|\d+)\].?$/gm, ''],
						[/\[url=([^\[\]\r\n]+)\]([^\[\]\r\n]*)\[\/url\]/ig, function(m, url, caption) {
							try {
								url = new URL(url.trim(), dcOrigin);
								return `[url=${url.href}]${caption || url.href}[/url]`;
							} catch(e) { console.warn('[AAM] Invalid Discogs link:', url) }
							return caption || url.trim();
						}], [/\[url\]([^\[\]\r\n]+)\[\/url\]/ig, function(m, url) {
							try {
								url = new URL(url.trim(), dcOrigin);
								return `[url]${url.href}[/url]`;
							} catch(e) { console.warn('[AAM] Invalid Discogs link:', url) }
							return url.trim();
						}], [/\[img=([^\[\]\r\n]+)\]/ig, (m, url) => `[img]${url.trim()}[/img]`],
						[/\[t=?(\d+)\]/ig, '[url=' + dcOrigin + '/help/forums/topic?topic_id=$1]topic $1[/url]'],
						[/\[g=?([^\[\]\r\n]+)\]/ig, '[url=' + dcOrigin + '/help/guidelines/$1]guideline $1[/url]'],
						[/[ \t]+$/gm, ''], [/(?:\r?\n){2,}/g, '\n\n'],
					];
					return dcResolveLinks(profile, dcLink).catch(function(reason) {
						console.warn('[AAM] dcResolveLinks:', reason);
						return profile;
					}).then(profile => head + '\n\n' + substitutions.reduce((str, substitution) =>
						str.replace(...substitution), profile) + '\n').then(addRelatives);
				}
				function getArtistRef(searchResult, bestMatch, dubious = false) {
					const container = document.createElement('SPAN');
					container.className = 'distinct-artist';
					if (dubious) container.style.opacity = 1/2;

					function addSiteRef(artistName, url, icon) {
						if (!url || !artistName) return null;
						if (container.childElementCount > 0) container.append(' / ');
						const a = document.createElement('A');
						a.href = url;
						a.textContent = artistName;
						a.target = '_blank';
						a.style = 'color: cadetblue;';
						if (icon) {
							const img = document.createElement('IMG');
							img.src = icon;
							img.height = 8;
							img.style = 'margin-right: 2pt;';
							container.append(img, a);
						} else container.append(a);
					}

					if (searchResult.discogsArtist) addSiteRef(searchResult.discogsArtist.name, searchResult.discogsArtist.uri,
						GM_getResourceURL('dc_icon'));
					if (searchResult.mbArtist) addSiteRef(searchResult.mbArtist.name, searchResult.mbArtist.uri,
						GM_getResourceURL('mb_icon'));
					if (searchResult.amArtist) addSiteRef(searchResult.amArtist.attributes.name, searchResult.amArtist.uri,
						'https://music.apple.com/assets/favicon/favicon-32-283b261ac09e23987aae02bdb3cbbbaa.png');
					if (searchResult.bpArtist) addSiteRef(searchResult.bpArtist.name, searchResult.bpArtist.uri,
						'https://www.beatport.com/favicon-16x16.png');
					if (searchResult.scUser) addSiteRef(searchResult.scUser.username, searchResult.scUser.permalink_url,
						'https://a-v2.sndcdn.com/assets/images/sc-icons/favicon-2cadd14bdb.ico');
					if (searchResult.neArtist) addSiteRef(searchResult.neArtist.name, searchResult.neArtist.uri,
						'https://s1.music.126.net/style/favicon.ico');
					if (container.childElementCount <= 0) {
						console.warn('Assertion failed: incomplete artist', bestMatch);
						return '</>';
					}
					if (bestMatch && searchResult == bestMatch) container.style.fontWeight = 'bold';
					if (searchResult.matchedGroups) {
						const total = document.createElement('SPAN');
						total.className = 'match-total';
						total.textContent = searchResult.matchedGroups.length;
						container.append(' [', total, ']');
					}
					return container.outerHTML;
				}
				function genDcArtistTooltipHTML(artist, resolveIds = false) {
					if (!artist) throw 'The parameter is required';
					const linkColor = isLightTheme ? '#0A84AF' : isDarkTheme ? 'aqua' : 'cadetblue',
								elems = createElements('BODY', 'DIV', 'B', 'IMG', 'P');

					function dcLink(key, id, caption = key + id) {
						const a = document.createElement('A');
						a.href = encodeURI(`${dcOrigin}/${dcEntryTypes[key.toLowerCase()]}/${id}`);
						a.target = '_blank';
						a.style.color = linkColor;
						a.textContent = caption;
						return a;
					}
					const dcLinkHTML = (key, id, caption) => dcLink(key, id, caption).outerHTML;
					function link(_, url, caption) {
						try {
							url = new URL(url.trim(), dcOrigin);
							const a = document.createElement('A');
							a.href = url.href;
							a.target = '_blank';
							a.style.color = linkColor;
							a.textContent = caption || url.href;
							return a.outerHTML;
						} catch(e) { console.warn('[AAM] Invalid Discogs link:', url) }
						return caption || url.trim();
					}
					function addRelatives(type, label, filterFunc) {
						if (!Array.isArray(artist[type]) || artist[type].length <= 0) return;
						let relatives = artist[type];
						if (typeof filterFunc == 'function') relatives = relatives.filter(filterFunc);
						if (relatives.length <= 0) return;
						const elems2 = createElements('DIV', 'B');
						elems2[0].style = 'margin-top: 5pt; max-height: 35pt; overflow: hidden; text-overflow: ellipsis;';
						//elems2[0].style.backgroundImage = 'linear-gradient(transparent 150px, white)';
						elems2[1].textContent = label + ':';
						elems2[0].append(elems2[1]);
						relatives.forEach(function(relative, ndx) {
							elems2[0].append(ndx > 0 ? ', ' : ' ');
							elems2[0].append(dcLink('a', relative.id, dcNameNormalizer(relative.name)));
						});
						elems[0].append(elems2[0]);
					}

					elems[0].style = 'padding: 3pt;'; // body
					elems[1].style = 'font-size: 10pt;'; // heading
					elems[2].style = 'color: tomato;'; // artist
					elems[2].textContent = artist.name;
					elems[1].append(elems[2]);
					if (artist.realname && artist.realname.trim() != dcNameNormalizer(artist.name))
						elems[1].append(' (' + artist.realname.trim() + ')');
					elems[0].append(elems[1]);
					if (Array.isArray(artist.images) && artist.images.length > 0) {
						elems[3].style = 'margin-left: 1em; float: right;';
						elems[3].src = artist.images[0].uri150;
						elems[0].append(elems[3]);
					}
					addRelatives('aliases', 'Aliases');
					addRelatives('groups', 'Active in groups', group => group.active);
					addRelatives('members', 'Active members', member => member.active);
					if (!artist.profile) return Promise.resolve(elems[0].outerHTML);
					let profile = artist.profile.trim();
					if (!resolveIds) profile = profile.replace(/\[([armlu])=?(\d+)\]/ig, (_, key, id) => dcLinkHTML(key, id));
					return dcResolveLinks(profile, dcLinkHTML).catch(function(reason) {
						console.warn('[AAM] dcResolveLinks:', reason);
						return profile;
					}).then(function(profile) {
						const tagConversions = {
							'b': 'font-weight: bold;',
							'i': 'font-style: italic;',
							'u': 'text-decoration: underline;',
							's': 'text-decoration: line-through;',
						};
						elems[4].innerHTML = Object.keys(tagConversions).reduce((str, key) =>
								str.replace(new RegExp(`\\[${key}\\](.*?)\\[\\/${key}\\]`, 'ig'),
									`<span style="${tagConversions[key]}">$1</span>`), profile)
							.replace(/\[url=([^\[\]]+)\]([^\[\]\r\n]*)\[\/url\]/ig, link)
							.replace(/\[url\]([^\[\]\r\n]+)\[\/url\]/ig, link)
							.replace(/\[img=([^\[\]\r\n]+)\]/ig, (_, url) => `<img src="${url.trim()}" />`)
							.replace(/\[quote\]([\S\s]+)\[\/quote\]/ig, '<blockquote>$1</blockquote>')
							.replace(/\[quote=([^\[\]\r\n]+)\]([\S\s]+)\[\/quote\]/ig, '<blockquote cite="$1">$2</blockquote>')
							.replace(/\[g=?([^\[\]\r\n]+)\]/ig, (m, gId) => link(m, `${dcOrigin}/help/guidelines/${gId}`, 'guideline ' + gId))
							.replace(/\[t=?(\d+)\]/ig, (m, tId) => link(m, `${dcOrigin}/help/forums/topic?topic_id=${tId}`, 'topic ' + tId))
							.replace(/[ \t]+$/gm, '').replace(/(?:\r?\n){2,}/g, '<br><br>').replace(/(?:\r?\n)/g, '<br>');
						elems[4].style = 'margin-top: 1em; max-height: 150pt; overflow: hidden; text-overflow: ellipsis;';
						//elems[4].style.backgroundImage = 'linear-gradient(transparent 150px, white)';
						elems[0].append(elems[4]);
						return elems[0].outerHTML;
					});
				}

				function addDisambiguationInfo(button, symmetric, includeMatchRatio) {
					console.assert(button instanceof HTMLInputElement);
					if (!(button instanceof HTMLInputElement)) throw 'Invalid argument';
					const matchedArtists = button.matchedArtists;
					console.assert(Array.isArray(matchedArtists) && matchedArtists.length > 1);
					if (!Array.isArray(matchedArtists) || matchedArtists.length < 2) return false;
					button.disabled = true;
					const minorArtistsTotal = matchedArtists.reduce((acc, artist) =>
						artist != matchedArtists.bestMatch ? acc + artist.matchedGroups.length : acc, 0);
					if (typeof symmetric != 'boolean') symmetric = matchedArtists.length > 15 || minorArtistsTotal > 30
							|| matchedArtists.filter(artist => artist.matchedGroups.length >= 10).length > 2
							|| matchedArtists.filter(artist => artist.matchedGroups.length >= 5).length > 5
							|| matchedArtists.filter(artist => artist.matchedGroups.length > 1).length > 20
							|| minorArtistsTotal * 3 > matchedArtists.bestMatch.matchedGroups.length;
					if (typeof symmetric != 'boolean') symmetric = matchedArtists.length > 10 || minorArtistsTotal > 15
							|| matchedArtists.filter(artist => artist.matchedGroups.length >= 8).length > 1
							|| matchedArtists.filter(artist => artist.matchedGroups.length > 1).length > 1
							|| matchedArtists.bestMatch.matchedGroups.length < Math.max(minorArtistsTotal * 10, 10);
					const useMA = symmetric && Array.prototype.concat.apply([ ],
							matchedArtists.map(artist => artist.matchedGroups).filter(Boolean))
						.filter((groupId, ndx, arr) => arr.indexOf(groupId) == ndx).length / artist.statistics.numGroups >= 0.5;
					Promise.all(matchedArtists.map(function(result) {
						if (result.discogsArtist) return genDcArtistDescriptionBB(result.discogsArtist).catch(reason =>
								result.amArtist && amGetArtistBio(result.amArtist)
								|| bpReflowArtistBio(result.bpArtist)
								|| result.mbArtist && result.mbArtist.disambiguation
								|| result.scUser && result.scUser.description
								|| result.neArtist && result.neArtist.briefDesc || undefined).then(bbCode => Object.assign({
							source: 'Discogs',
							bbCode: bbCode,
						}, result.discogsArtist));
						if (result.mbArtist) return Promise.resolve(Object.assign({
							uri: result.mbArtist.uri,
							source: 'MusicBrainz',
							bbCode: result.mbArtist.disambiguation || undefined,
						}, result.mbArtist));
						if (result.amArtist) return Promise.resolve(Object.assign({
							uri: result.amArtist.uri,
							source: 'Apple Music',
							bbCode: amGetArtistBio(result.amArtist) || undefined,
						}, result.amArtist));
						if (result.bpArtist) return Promise.resolve(Object.assign({
							uri: result.bpArtist.uri,
							source: 'Beatport',
							bbCode: result.bpArtist.bio || undefined,
						}, result.bpArtist));
						if (result.scUser) return Promise.resolve(Object.assign({
							uri: result.scUser.permalink_url,
							source: 'SoundCloud',
							bbCode: result.scUser.description || undefined,
						}, result.scUser));
						if (result.neArtist) return Promise.resolve(Object.assign({
							uri: result.neArtist.uri,
							source: 'NetEase',
							bbCode: result.neArtist.briefDesc || undefined,
						}, result.neArtist));
						throw 'Assertion failed: Incomplete result';
					})).then(function(artists) {
						console.assert(artists.length > 1, 'artists.length > 1');
						const artistCollisions = findSearchResultColisions(matchedArtists);
						const maxGroupsEnumerable = GM_getValue('max_groups_enumerable', 50);
						if (!artists[0].bbCode) symmetric = true;
						if (typeof includeMatchRatio != 'boolean') includeMatchRatio = symmetric;
						let hasWiki = !symmetric && document.getElementById('body');
						hasWiki = Boolean(hasWiki) && hasWiki.textLength > 0;
						let bbCode = artists.map(function(refArtist, index) {
							const matchedArtist = matchedArtists[index];
							const dubiousGroup = matchedGroup => matchedArtists.filter(matchedArtist =>
								matchedArtist.matchedGroups.includes(matchedGroup)).length > 1;
							const isDubiousArtist = matchedArtist.matchedGroups.every(dubiousGroup);
							let artistTags = { };
							matchedArtist.matchedGroups.forEach(function(matchedGroup, index) {
								if (matchedArtist.matchedGroups.indexOf(matchedGroup) != index
										|| !(matchedGroup = artist.torrentgroup.find(torrentGroup => torrentGroup.groupId == matchedGroup)))
									return;
								if (isDubiousArtist || !dubiousGroup(matchedGroup.groupId)) for (let tag of matchedGroup.tags) {
									if (['freely.available', 'staff.picks', 'delete.this.tag'].includes(tag)) continue;
									if (!(tag in artistTags)) artistTags[tag] = 0;
									++artistTags[tag];
								}
							});
							artistTags = Object.keys(artistTags).sort((tag1, tag2) => artistTags[tag2] - artistTags[tag1]);
							let bbCode = '';
							if (!symmetric && index < 1) {
								bbCode += refArtist.bbCode || '';
								if (artistTags.length > 0) bbCode = (bbCode + '\n\n[b]Tags:[/b] ' + artistTags.slice(0, 10).join(', ')).trim();
								const sites = Array.isArray(refArtist.urls) && refArtist.urls.filter(sitesFilter);
								if (sites && sites.length > 0) bbCode = (bbCode + '\n\n' + sites.map(dcUrlToBB).join('\n')).trim();
								if (bbCode) bbCode = '[size=3]' + bbCode + '\n\n[/size]';
								const addExternaltLink = siteName =>
									{ bbCode += bbCode += `[align=left][url=${refArtist.uri}][plain]${siteName}[/plain][/url][/align]` };
								if (refArtist.source) switch (refArtist.source) {
									case 'Discogs': bbCode += dcArtistLink(refArtist); break;
									case 'MusicBrainz': addExternaltLink('[img]https://ptpimg.me/50s6cw.png[/img]'); break;
									default: addExternaltLink(refArtist.source);
								} else throw 'Assertion failed: incomplete artist';
								return bbCode;
							}
							let header = [ ];
							header.push('[size=3]');
							if (!isDubiousArtist) header.push('[b]');
							if (symmetric || matchedArtists.length > 2) header.push(`${index + 1}. `);
							const addExternaltLink = name =>
								{ header.push(`[url=${refArtist.uri}][plain]${name}[/plain][/url]`) };
							switch (refArtist.source) {
								case 'Discogs': addExternaltLink(dcNameNormalizer(refArtist.name)); break;
								case 'MusicBrainz': addExternaltLink(refArtist.name); break;
								case 'Apple Music': addExternaltLink(refArtist.attributes.name); break;
								case 'Beatport': addExternaltLink(refArtist.name); break;
								case 'SoundCloud': addExternaltLink(refArtist.username); break;
								default: throw 'Assertion failed: incomplete artist';
							}
							if (!isDubiousArtist) header.push('[/b]');
							header.push('[/size]');
							if (isDubiousArtist) header.push(' (?)');
							if (includeMatchRatio)
								header.push(` [size=2][color=#888888](${matchedArtist.matchedGroups.length}/${artist.torrentgroup.length})[/color][/size]`);
							header = header.join('');
							switch (refArtist.source) {
								case 'Discogs':
									if (Array.isArray(refArtist.images) && refArtist.images.length > 0)
										bbCode = '[img]' + refArtist.images[0].uri150 + '[/img]';
									break;
								case 'Beatport':
									if (bpGetArtistImage(refArtist)) bbCode = '[img]' + bpGetArtistImage(refArtist, 150) + '[/img]';
									break;
								case 'SoundCloud':
									if (scGetUserImage(refArtist) != null) bbCode = '[img]' + scGetUserImage(refArtist, 120) + '[/img]';
									break;
								case 'Apple Music': case 'Shazam':
									// if (refArtist.attributes && refArtist.attributes.artwork)
									// 	bbCode = '[img]' + refArtist.attributes.artwork.url.replace(/\{[wh]\}/g, '150') + '[/img]';
									break;
							}
							if (refArtist.bbCode) bbCode += '\n' + refArtist.bbCode.replace(/\s*(?:\r?\n)+/g, '\n');
							if (artistTags.length > 0) bbCode += '\n[b]Tags:[/b] ' + artistTags.slice(0, 10).join(', ');
							if (!(maxGroupsEnumerable > 0) || matchedArtist.matchedGroups.length <= maxGroupsEnumerable) {
								const matchedGroups = matchedArtist.matchedGroups.map(function(groupId) {
									let result = '[torrent]' + groupId + '[/torrent]';
									if (artistCollisions != null && Array.from(artistCollisions.values())
											.some(groupIds => groupIds.includes(groupId))) result += ' (?)';
									return result;
								});
								bbCode += '\n[hide=Release groups]' + matchedGroups.join(', ') + '[/hide]';
							}
							if (bbCode && isRED) bbCode = (!symmetric && matchedArtists.length < 3 ?
								'[pad=6|0|0]' : '[pad=6|0|0|13]') + bbCode.trim() + '[/pad]';
							return bbCode ? header + '\n' + bbCode : header;
						});
						const joiner = str => str.join(/*isRED ? '[hr]' : */'\n\n'),
									editSummary = matchedArtists.uncertain ? 'Wiki update' : 'Wiki update (disambiguation info)',
									editNote = !matchedArtists.uncertain && 'Ambiguous name';
						let updateSuccess;
						if (!symmetric) {
							const s = '[size=3][b]' + (matchedArtists.length > 2 ?
								(matchedArtists.uncertain ? 'Possibly more distinct artists' : 'More distinct artists' ) +
									' share this name:[/b][/size]\n\n'
								: (matchedArtists.uncertain ? 'Possibly another distinct artist' : 'Another distinct artist') +
									' present for this name:[/b][/size] ') + joiner(bbCode.slice(1));
							if (hasWiki) bbCode = isRED ? '[hr]\n' + s : s;
								else bbCode = bbCode[0] + (isRED ? '\n[hr]\n' : '\n\n') + s;
							updateSuccess = updateArtistWiki(bbCode, editSummary, editNote);
						} else updateSuccess = updateArtistWiki('[size=3][b]' +
							(matchedArtists.uncertain ? 'Possibly multiple distinct artists' : 'Multiple distinct artists') +
							' share this profile page:[/b][/size]\n\n' + joiner(bbCode), editSummary, editNote);
						if (updateSuccess) button.style.backgroundColor = 'green';
					}, function(reason) {
						console.warn('Error on disambiguation info:', reason);
						button.style.backgroundColor = 'red';
					}).then(function() {
						button.disabled = false;
						if (button.style.backgroundColor) setTimeout(elem => { elem.style.backgroundColor = null }, 1000, button);
					});
					const image = document.body.querySelector('input[type="text"][name="image"]');
					if (image == null || !useMA && image.value.length > 0) return;
					if (useMA) image.value = multiArtistProfileImages[Math.floor(Math.random() * multiArtistProfileImages.length)];
					else if (matchedArtists[0].cover_image) {
						image.value = matchedArtists[0].cover_image;
						imageHostHelper.then(ihh => { ihh.rehostImageLinks([matchedArtists[0].cover_image])
							.then(ihh.singleImageGetter).then(imageUrl => { image.value = imageUrl }) });
					}
				}

				function updateForumPost(threadId, distinctArtists) {
					if (!(threadId > 0)) throw 'Invalid argument';
					const postId = GM_getValue('forum_post_id');
					if (!(postId > 0)) throw 'Post id not defined';
					const updateFormat = GM_getValue('forum_post_update');
					if (!updateFormat) throw 'Post update format not defined';
					if ('aamArtistsAdded' in localStorage) try {
						var artistsAdded = JSON.parse(localStorage.getItem('aamArtistsAdded'));
						if (artistsAdded.includes(artist.id)) {
							alert('Reference to this artist was already added!');
							return;
						}
					} catch(e) { console.warn(e) }
					const url = '/forums.php?' + new URLSearchParams({
						action: 'viewthread',
						threadid: threadId,
						postid: postId,
					}).toString();
					return LocalXHR.get(url).then(function({document}) {
						let editKey = document.body.querySelector(`div#content table#post${postId} a[onclick][href="#post${postId}"]`);
						if (editKey != null && (editKey = editKey.getAttribute('onclick'))
								&& (editKey = /\b(?:Edit_Form)\s*\(\s*'.+?'\s*,\s*'(\d+)'\s*\)/i.exec(editKey)) != null)
							return parseInt(editKey[1]); else throw 'Unexpected page format';
					}).then(editKey => LocalXHR.get('/forums.php?action=get_post&post=' + postId, { responseType: 'text' }).then(function({responsetext}) {
						const formData = new FormData;
						formData.set('post', postId);
						formData.set('body', responsetext + eval('`' + updateFormat + '`'));
						formData.set('key', editKey);
						formData.set('auth', userAuth);
						return LocalXHR.post('/forums.php?action=takeedit', formData, { responseType: null }).then(function(status) {
							if (confirm('Artist group reference was successfully added to defined forum post.\nReview the thread?'))
								GM_openInTab(document.location.origin + url + '#post' + postId, false);
							if (!artistsAdded) artistsAdded = [ ];
							artistsAdded.push(artist.id);
							localStorage.setItem('aamArtistsAdded', JSON.stringify(artistsAdded));
						});
					})).catch(alert);
				}

				function importNames(evt) {
					function cleanUp() {
						if (button.dataset.caption) button.value = button.dataset.caption;
						button.style.color = null;
						button.disabled = false;
						activeElement = null;
					}

					if (dropDown == null) throw 'Unexpected document structure';
					if (activeElement != null) return false;
					const button = evt.currentTarget;
					if (button.artist) activeElement = button; else throw 'No artist attached';
					button.disabled = true;
					//button.style.color = 'red';
					setProgressInfo('Please wait...');
					// setAjaxApiLogger(function(action, apiTimeFrame, timeStamp) {
					// 	setProgressInfo(`Please wait... (${apiTimeFrame.requestCounter - 5} name queries queued)`);
					// });

					const isImported = cls => ['everything', cls + '-only'].some(cls => button.id == 'fetch-' + cls);
					const artistsAdapter = dcArtists => Array.isArray(dcArtists)
							&& (dcArtists = dcArtists.filter(Boolean)).length > 0 ? dcArtists.map(function(dcArtist) {
						function addNameVariant(name) {
							if (!name || isPseudoArtist(name) || rxGenericName.test(name = name.trim())
									|| result.importEntries.has(name)) return;
							result.importEntries.set(name, findArtistAlias(name = dcNameNormalizer(name)).then(alias => alias.id,
									reason => evt.ctrlKey ? null : getSiteArtist(name).then(function(a) {
								if (a.id == artist.id) return 0; // implicit RDA
								if (rxGenericName.test(a.name) || isPseudoArtist(a.name)) {
									if ('torrentgroup' in a) delete a.torrentgroup;
									if ('requests' in a) delete a.requests;
									return a;
								}
								const releases = getWhateverList(a);
								if (!releases) return a;
								let cacheKey = [dcArtist.id, a.id].toString(), searchWorker, listmatchWorker;
								if (listMatchWorkers.has(cacheKey)) listmatchWorker = listMatchWorkers.get(cacheKey); else {
									listmatchWorker = !isPseudoArtist(a.name) ? getDiscogsMatches(dcArtist.id, releases)
										: Promise.reject('Pseudo artist name');
									listMatchWorkers.set(cacheKey, listmatchWorker);
								}
								cacheKey = [a.id, a.name.toLowerCase()].toString();
								if (searchWorkers.has(cacheKey)) searchWorker = searchWorkers.get(cacheKey); else {
									searchWorker = !isPseudoArtist(a.name) && !rxGenericName.test(a.name) ?
										searchArtistWorldwide(a, true).catch(function(reason) {
											if (reason != 'No matches' || !Array.isArray(dcArtist.namevariations)
													|| dcArtist.namevariations.length <= 0) return Promise.reject(reason);
											return searchArtistWorldwide(a, true, dcArtist.namevariations);
										}) : Promise.reject('Pseudo or generic artist name');
									searchWorkers.set(cacheKey, searchWorker);
								}
								return Object.assign({ dcMatches: listmatchWorker, lookup: searchWorker, numReleases: releases.length }, a);
							}, reason => null /* not found on site */)));
						}

						const result = Object.assign({
							importEntries: new Map,
							tooltip: genDcArtistTooltipHTML(dcArtist, false),
						}, dcArtist);
						addNameVariant(dcArtist.name);
						if (Array.isArray(dcArtist.namevariations)
								&& (dcArtist.id == button.artist.id ? isImported('anvs') : !evt.shiftKey))
							dcArtist.namevariations.forEach(addNameVariant);
						if (dcArtist.realname && dcArtist.id == button.artist.id
								&& dcArtist.realname.trim().toLowerCase() != dcNameNormalizer(dcArtist.name).toLowerCase()
							 	&& (!Array.isArray(dcArtist.members) || dcArtist.members.length <= 0))
							addNameVariant(dcArtist.realname);
						return result.importEntries.size > 0 ? result : null;
					}).filter(Boolean) : null;
					function relativesAdapter(keyName, filterCallback) {
						if (!keyName || !Array.isArray(button.artist[keyName])) return Promise.resolve(null);
						let relatives = button.artist[keyName].filter(relative => relative.id != button.artist.id);
						if (typeof filterCallback == 'function') relatives = relatives.filter(filterCallback);
						if (relatives.length <= 0) return Promise.resolve(null);
						return Promise.all(relatives.map(relative => getDiscogsEntry('artist', relative.id).catch(function(reason) {
							console.warn('[AAM] Could not get Discogs artist id', relative.id,
								', name variations exploration will be omitted', reason);
							return relative;
						}))).then(artistsAdapter);
					}

					return Promise.all([
						// root artist
						Promise.resolve([button.artist]).then(artistsAdapter),
						// proprietary + backing ensembles
						isImported('groups') ? relativesAdapter('groups', group => group.active && basedOnArtist(button.artist, group))
							: Promise.resolve(null),
						// aliases
						isImported('aliases') ? relativesAdapter('aliases') : Promise.resolve(null),
						// other groups/ensembles
						isImported('groups') ? relativesAdapter('groups', group => basedOnArtist(button.artist, group) ? !group.active : evt.altKey)
							: Promise.resolve(null),
						// group members
						button.id == 'fetch-members-only' ? relativesAdapter('mmebers', member => evt.altKey || member.active)
							: Promise.resolve(null),
					]).then(function(categories) {
						//console.debug('[AAM] Import categories:', categories);
						if (!categories.some((cat, ndx) => Array.isArray(cat) && cat.length > 0
								&& (ndx > 0 ? cat.some(Boolean) : cat.some(relative => relative.importEntries.size > 1)))) {
							setProgressInfo('Nothing to import!', true);
							cleanUp();
							return false;
						}
						const importSize = categories.filter(Boolean).reduce((sum, category) =>
							sum + category.reduce((sum, relative) => sum + relative.importEntries.size, 0), 0);
						const quickFilterSize = GM_getValue('quick_filter_size', 10),
									stateFilterSize = GM_getValue('state_filter_size', 30);
						let changesMade = 0, subscribed = false;
						setProgressInfo();

						function closeModal(evt) {
							document.body.removeChild(document.body.querySelector('div.modal.discogs-import'));
							document.body.style.overflow = 'auto';
							if (evt instanceof Event) if (changesMade > 0) document.location.reload(); else cleanUp();
						}
						function subscribeForComments() {
							if (!subscribed && 'artistSubscriptionStates' in sessionStorage) try {
								subscribed = true;
								const ass = JSON.parse(sessionStorage.getItem('artistSubscriptionStates'));
								if (ass[artistId] == false) subscribeArtistComments().then(function(status) {
									console.info('[AAM] New comments for id', artistId, 'successfully subscribed');
									ass[artistId] = true;
									sessionStorage.setItem('artistSubscriptionStates', JSON.stringify(ass));
								}, function(reason) {
									subscribed = false;
									console.warn('[AAM] Subscription failed:', reason);
								});
							} catch(e) {
								subscribed = false;
								console.warn(e);
							}
						}
						function addIconToBay(container, source, opacity, tooltip) {
							console.assert(container instanceof HTMLDivElement);
							if (!(container instanceof HTMLDivElement)) return false;
							console.assert(container.className == 'icon-bay');
							if (!source) return false;
							const img = document.createElement('IMG');
							img.src = source.length <= 64 && GM_getResourceURL(source) || source;
							img.height = 10;
							//img.style = 'position: relative; top: 1px;';
							if (tooltip) setTooltip(img, tooltip);
							//if (tooltip) img.title = tooltip;
							if (container.children.length > 0) img.style.marginLeft = '2pt';
							if (opacity < 1) img.style.opacity = opacity;
							container.append(img);
							container.style.display = 'inline';
						}
						const addLinkIcon = container =>
							{ addIconToBay(container, 'link-icon2', undefined, 'Linked as similar artist') };
						function visualizeProgress(target, propagateToArtist = true) {
							console.assert(target instanceof HTMLAnchorElement, 'target instanceof HTMLAnchorElement');
							function visualizeProgress(target) {
								console.assert(target instanceof HTMLAnchorElement, 'target instanceof HTMLAnchorElement');
								const span = document.createElement('SPAN');
								span.textContent = 'Processing ...';
								span.style.color = 'darkorchid';
								for (let child of Array.from(target.parentNode.childNodes))
									if (child == target) child.hidden = true; else target.parentNode.removeChild(child);
								target.parentNode.append(span);
							}
							window.tooltipster.then(() => { $(target).tooltipster('hide') });
							visualizeProgress(target);
							if (!propagateToArtist) return;
							const artistId = parseInt(target.dataset.artistId);
							if (!artistId) return; //throw 'Artist identification missing';
							for (let a of document.body.querySelectorAll('table#dicogs-aliases > tbody > tr > td > a.local-artist-group'))
								if (a != target && parseInt(a.dataset.artistId) == artistId) visualizeProgress(a);
						}
						function visualizeOperation(target, operation, method, color) {
							if (!operation) return;
							console.assert(target instanceof HTMLAnchorElement, 'target instanceof HTMLAnchorElement');
							const span = document.createElement('SPAN');
							span.textContent = operation;
							if (method) span.append(' ' + method);
							if (method == 'redirect' && target.dataset.redirectTo) span.append(' to ' + target.dataset.redirectTo);
							span.style.color = color;
							const parentNode = target.parentNode;
							while (parentNode.firstChild != null) parentNode.removeChild(parentNode.lastChild);
							parentNode.append(span);
						}
						function visualizeOperations(target, operation, method, color) {
							if (!operation) return;
							console.assert(target instanceof HTMLAnchorElement, 'target instanceof HTMLAnchorElement');
							visualizeOperation(target, operation, method, color);
							const artistId = parseInt(target.dataset.artistId);
							if (!artistId) return; //throw 'Artist identification missing';
							for (let a of document.body.querySelectorAll('table#dicogs-aliases > tbody > tr > td > a.local-artist-group'))
								if (parseInt(a.dataset.artistId) == artistId) visualizeOperation(a, operation, method, color);
						}
						function adoptSimilarArtists(target) {
							console.assert(target instanceof HTMLAnchorElement, 'target instanceof HTMLAnchorElement');
							const status = parseInt(target.parentNode.dataset.state);
							if (status >= 18) return false;
							if ('similarArtists' in target.dataset) try {
								let similarArtists = JSON.parse(target.dataset.similarArtists);
								if (artist.similarArtists) similarArtists = similarArtists.map(function(name) {
									name = name.toLowerCase();
									return !artist.similarArtists.some(similarArtist => similarArtist.name.toLowerCase() == name);
								});
								if (similarArtists.length > 0) addSimilarArtists(similarArtists)
									.then(() => { console.log(`[AAM] ${similarArtists.length} similar artists of ${target.dataset.artistId} were adopted`) });
							} catch(e) { console.warn(e) }
						}
						function mergeNRA(target) {
							console.assert(target instanceof HTMLAnchorElement, 'target instanceof HTMLAnchorElement');
							const status = parseInt(target.parentNode.dataset.state);
							if (status >= 18) return false;
							const artistId = parseInt(target.dataset.artistId), artistName = target.dataset.artistName;
							if (!artistId || !artistName) throw 'Artist identification missing';
							if (!confirm(`Artist "${artistName}" is going to be merged via non-redirecting alias`))
								return;
							visualizeProgress(target);
							changeArtistId(artist.id, artistId).then(function() {
								++changesMade;
								if ('similarArtists' in target.dataset) adoptSimilarArtists(target);
								visualizeOperations(target, 'Merged via', 'non-redirecting alias', 'lightseagreen');
								if (GM_getValue('auto_subscribe_on_merges', false)) subscribeForComments();
							}, alert);
						}
						function mergeRD(target) {
							console.assert(target instanceof HTMLAnchorElement, 'target instanceof HTMLAnchorElement');
							const status = parseInt(target.parentNode.dataset.state);
							if (status >= 18) return false;
							const artistId = parseInt(target.dataset.artistId), artistName = target.dataset.artistName;
							if (!artistId || !artistName) throw 'Artist identification missing';
							if (!confirm(`Artist "${artistName}" is going to be merged via redirect to "${target.dataset.redirectTo || artist.name}"`))
								return;
							visualizeProgress(target);
							renameArtist(target.dataset.redirectTo || artist.name, artistId).then(function() {
								++changesMade;
								if ('similarArtists' in target.dataset) adoptSimilarArtists(target);
								visualizeOperations(target, 'Merged via', 'redirect', 'mediumseagreen');
								if (GM_getValue('auto_subscribe_on_merges', false)) subscribeForComments();
							}, alert);
						}
						function convertToNRA(target) {
							console.assert(target instanceof HTMLAnchorElement, 'target instanceof HTMLAnchorElement');
							const status = parseInt(target.parentNode.dataset.state);
							if (status >= 18) return false;
							const artistId = parseInt(target.dataset.artistId), artistName = target.dataset.artistName,
										aliasName = target.dataset.aliasName;
							if (!artistId || !artistName || !aliasName) throw 'Artist/alias identification missing';
							if (aliasName.toLowerCase() == artistName.toLowerCase()) return mergeNRA(target);
							findArtistAlias(aliasName, artistId, false).then(function(alias) {
								if (alias.redirectId == 0) return Promise.reject('This is non-redirecting alias (not supported)');
								if (!confirm(`Redirecting alias "${aliasName}" (${alias.id}) is going to be made into current artist's non-redirecting alias`))
									return;
								visualizeProgress(target, false);
								return deleteAlias(alias.id, artistId).then(() => addAlias(alias.name, 0)).then(function() {
									++changesMade;
									visualizeOperation(target, 'Adopted as', 'non-redirecting alias', 'lightseagreen');
								});
							}).catch(alert);
						}
						function convertToRDA(target) {
							console.assert(target instanceof HTMLAnchorElement, 'target instanceof HTMLAnchorElement');
							const status = parseInt(target.parentNode.dataset.state);
							if (status >= 18) return false;
							const artistId = parseInt(target.dataset.artistId), artistName = target.dataset.artistName,
										aliasName = target.dataset.aliasName;
							if (!artistId || !artistName || !aliasName) throw 'Artist/alias identification missing';
							if (aliasName.toLowerCase() == artistName.toLowerCase()) return mergeRD(target);
							findArtistAlias(aliasName, artistId, false).then(function(alias) {
								if (alias.redirectId == 0) return Promise.reject('This is non-redirecting alias (not supported)');
								if (!confirm(`Redirecting alias "${aliasName}" (${alias.id}) is going to be made redirect to "${target.dataset.redirectTo || artist.name}"`))
									return;
								visualizeProgress(target, false);
								const redirectId = parseInt(target.dataset.redirectId) || mainIdentityId;
								return deleteAlias(alias.id, artistId).then(() => addAlias(alias.name, redirectId)).then(function() {
									++changesMade;
									visualizeOperation(target, 'Adopted as', 'redirect', 'mediumseagreen');
								});
							}).catch(alert);
						}
						function releaseAlias(target) {
							console.assert(target instanceof HTMLAnchorElement, 'target instanceof HTMLAnchorElement');
							const status = parseInt(target.parentNode.dataset.state);
							if (status >= 18) return false;
							const artistId = parseInt(target.dataset.artistId), artistName = target.dataset.artistName,
										aliasName = target.dataset.aliasName;
							if (!artistId || !artistName || !aliasName) throw 'Artist/alias identification missing';
							if (aliasName.toLowerCase() == artistName.toLowerCase()) return;
							findArtistAlias(aliasName, artistId, false).then(function(alias) {
								if (alias.redirectId == 0) return Promise.reject('This is non-redirecting alias (not supported)');
								if (!confirm(`Redirecting alias "${aliasName}" (${alias.id}) is going to be released from ${artistName} (${artistId})`))
									return;
								visualizeProgress(target, false);
								return deleteAlias(alias.id, artistId).then(function() {
									++changesMade;
									visualizeOperation(target, 'Released from artist', null, 'orange');
								});
							}).catch(alert);
						}
						function makeSimilar(target) {
							console.assert(target instanceof HTMLAnchorElement, 'target instanceof HTMLAnchorElement');
							const status = parseInt(target.parentNode.dataset.state);
							if (status >= 18) return false;
							const artistId = parseInt(target.dataset.artistId), artistName = target.dataset.artistName;
							if (!artistId || !artistName) throw 'Artist identification missing';
							if ('similar' in target.dataset) alert('This artist is already linked or merged');
							else if (confirm(`Artist "${artistName}" is going to be added as similar artist`))
								addSimilarArtist(artistName).then(function() {
									++changesMade;
									target.dataset.similar = true;
									addLinkIcon(target.parentNode.querySelector('div.icon-bay'));
									for (let a of document.body.querySelectorAll('table#dicogs-aliases > tbody > tr > td > a.local-artist-group'))
										if (parseInt(a.dataset.artistId) == artistId && !('similar' in a.dataset)) {
											a.dataset.similar = true;
											addLinkIcon(a.parentNode.querySelector('div.icon-bay'));
										}
								}, alert);
						}
						const mergeWith = (promise, artistId) => promise.then(function() {
							if (Array.isArray(artist.similarArtists) && artist.similarArtists.length > 0)
								return addSimilarArtists(artist.similarArtists.map(similarArtist => similarArtist.name), artistId)
									.then(() => { console.log(`[AAM] ${artist.similarArtists.length} similar artists were transferred to id ${artistId}`) });
						}).then(function() {
							let body = document.getElementById('body');
							body = body != null && body.value.trim();
							let image = document.body.querySelector('input[type="text"][name="image"]');
							image = image != null && image.value.trim();
							return (body || image) && getSiteArtist(artistId).then(target =>
								!target.bbBody && target.body || !body && (target.image || !image)
									&& editArtist(target.image || image, target.bbBody || body, 'Wiki transfer', artistId));
						}).then(() => { gotoArtistEditPage(artistId) }, alert);
						function changeToId(target) {
							console.assert(target instanceof HTMLAnchorElement, 'target instanceof HTMLAnchorElement');
							const status = parseInt(target.parentNode.dataset.state);
							if (status >= 18) return false;
							const artistId = parseInt(target.dataset.artistId), artistName = target.dataset.artistName;
							if (!artistId || !artistName) throw 'Artist identification missing';
							if (!confirm(`Current artist profile is going to be merged via non-redirecting alias with "${artistName}" (${artistId})`))
								return;
							visualizeProgress(target);
							mergeWith(changeArtistId(artistId), artistId);
						}
						function redirectTo(target) {
							console.assert(target instanceof HTMLAnchorElement, 'target instanceof HTMLAnchorElement');
							const status = parseInt(target.parentNode.dataset.state);
							if (status >= 18) return false;
							const artistId = parseInt(target.dataset.artistId), artistName = target.dataset.artistName;
							if (!artistId || !artistName) throw 'Artist identification missing';
							findArtistAlias(target.parentNode.dataset.anv, artistId, true)
									.then(alias => alias.name, reason => artistName).then(function(aliasName) {
								if (!confirm(`Current artist profile is going to be merged via redirect with "${aliasName}" (${artistId})`))
									return;
								visualizeProgress(target);
								mergeWith(renameArtist(aliasName), artistId);
							});
						}

						function clickHandler(evt) {
							const status = parseInt(evt.currentTarget.parentNode.dataset.state);
							if (status >= 18) return false;
							const artistId = parseInt(evt.currentTarget.dataset.artistId);
							console.assert(artistId != artist.id, 'artistId != artist.id');
							if (evt.ctrlKey && !evt.shiftKey && !evt.altKey) return (mergeNRA(evt.currentTarget), false);
							else if (evt.shiftKey && !evt.ctrlKey && !evt.altKey) return (mergeRD(evt.currentTarget), false);
							else if (evt.ctrlKey && !evt.shiftKey && evt.altKey) return (changeToId(evt.currentTarget), false);
							else if (evt.shiftKey && !evt.ctrlKey && evt.altKey) return (redirectTo(evt.currentTarget), false);
							else if (evt.altKey && !evt.ctrlKey && !evt.shiftKey) return (makeSimilar(evt.currentTarget), false);
						}
						function auxClickHandler(evt) {
							if (!evt.ctrlKey && !evt.shiftKey && !evt.altKey) return true;
							const artistId = parseInt(evt.currentTarget.dataset.artistId);
							console.assert(artistId != artist.id, 'artistId != artist.id');
							switch (evt.button) {
								case 1: { // Auxiliary
									if (!evt.altKey || evt.ctrlKey || evt.shiftKey) return true;
									const url = new URL('artist.php', document.location.origin);
									url.searchParams.set('artistid', artistId);
									url.searchParams.set('action', 'edit');
									url.hash = 'aliases';
									GM_openInTab(url, false);
									break;
								}
								case 2: { // Secondary
									const status = parseInt(evt.currentTarget.parentNode.dataset.state);
									if (status >= 18) return true;
									if (evt.ctrlKey && !evt.shiftKey && !evt.altKey) convertToNRA(evt.currentTarget);
									else if (evt.shiftKey && !evt.ctrlKey && !evt.altKey) convertToRDA(evt.currentTarget);
									else if (evt.altKey && !evt.ctrlKey && !evt.shiftKey) releaseAlias(evt.currentTarget);
									break;
								}
								default: return true;
							}
							evt.preventDefault();
							return false;
						}
						function googleIt(mainName) {
							if (!mainName || (mainName = mainName.trim()).toLowerCase() == this.parentNode.dataset.anv.toLowerCase())
								return true;
							const names = [mainName, this.parentNode.dataset.anv].map(n => '"' + n + '"');
							GM_openInTab('https://www.google.com/search?q=' + encodeURIComponent(names.join(' ')), false);
							return false;
						}
						function isFilteredState(state) { switch (parseInt(modal[16].value)) {
							case 1: return state >= 20;
							case 2: return state > 15;
							case 3: return state > 1;
							case 4: return state != 0;
							case 5: return state != 1;
							case 6: return state < 10 || state > 19;
							case 7: return state < 10 || state > 15;
							case 8: return state <= 15 || state > 17;
							default: return false;
						} }
						function applyDynaFilter(str) {
							const filterById = Number.isInteger(str), norm = str => str.toLowerCase();
							if (!filterById) str = str ? /^\d+$/.test(str) && parseInt(str) || (function() {
								const rx = /^\s*\/(.+)\/([dgimsuy]+)?\s*$/i.exec(str);
								if (rx != null) try { return new RegExp(rx[1], rx[2]) } catch(e) { /*console.info(e)*/ }
							})() || norm(str.trim()) : undefined;
							function isFilteredName(tr) {
								if (!str || !filterById && (str instanceof RegExp ? str.test(tr.cells[0].dataset.anv)
										: norm(tr.cells[0].dataset.anv).includes(str))) return false;
								const artistId = parseInt(tr.cells[0].dataset.artistId);
								if (Number.isInteger(str) && str == artistId || typeof str == 'string' && (/^(?:(?:artist_?)?id)s?:(.+)$/i.test(str)
										&& RegExp.$1.split(',').map(n => parseInt(n)).includes(artistId)
									|| tr.cells[0].dataset.hasOwnProperty('relation') && /^(?:type|relation)s?:(.+)$/i.test(str)
										&& RegExp.$1.split(',').map(n => n.trim().toLowerCase()).includes(tr.cells[0].dataset.relation.toLowerCase())))
									return false;
								return true;
							}
							for (let tr of modal[5].rows) tr.hidden = importSize < stateFilterSize ? isFilteredName(tr)
								: (tr.cells[0].filteredName = isFilteredName(tr)) || isFilteredState(parseInt(tr.cells[1].dataset.state));
						}
						function addOption(select, title, value, before) {
							if (!(select instanceof HTMLSelectElement)) throw 'Invalid argument';
							if (!title || value == undefined) return;
							const option = document.createElement('OPTION');
							option.text = title;
							option.value = value;
							select.add(option, before);
						}

						const leftMenu = new ContextMenu('dc87f841-327e-4618-a965-33cc70088355');
						leftMenu.addItem('GoogleIt: Artist + ANV', a => { googleIt.call(a, dcNameNormalizer(button.artist.name)) });
						leftMenu.addItem('GoogleIt: Real/artist name + ANV', a =>
							{ googleIt.call(a, button.artist.realname || dcNameNormalizer(button.artist.name)) });
						leftMenu.addItem('Copy ANV', a => { GM_setClipboard(a.parentNode.dataset.anv, 'text') });
						const rightMenu = new ContextMenu('16bbbc39-65a0-4c21-b6af-3d6c6ff79166');
						rightMenu.addItem('Merge with current artist via non-redirecting alias', mergeNRA);
						rightMenu.addItem('Merge with current artist via redirect (see tooltip)', mergeRD);
						rightMenu.addItem('Make the triggered name only into current artist\'s non-redirecting alias', convertToNRA);
						rightMenu.addItem('Make the triggered name only redirecting alias (see tooltip)', convertToRDA);
						rightMenu.addItem('Release the triggered name from this artist', releaseAlias);
						rightMenu.addItem('Merge with this artist via non-redirecting alias', changeToId);
						rightMenu.addItem('Merge with this artist via redirect', redirectTo);
						rightMenu.addItem('Link as similar artist', makeSimilar);

						window.tooltipster.then(() => { $(button).tooltipster('hide') });
						const redirect = getSelectedRedirect(true);
						const modal = createElements(
							'DIV', 'DIV', 'DIV', 'TABLE', 'THEAD', 'TBODY', 'DIV', 'INPUT', 'INPUT', 'INPUT',
							'IMG', 'A', 'A', 'DIV', 'DIV', 'SPAN', 'SELECT', 'DIV',
						);
						modal[0].className = 'modal discogs-import';
						modal[0].style = 'position: fixed; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); opacity: 0; visibility: hidden; transform: scale(1.1); transition: visibility 0s linear 0.25s, opacity 0.25s 0s, transform 0.25s; z-index: 999999;';
						modal[0].onclick = evt => { if (evt.target == evt.currentTarget) closeModal(evt) };
						modal[1].className = 'modal-content';
						modal[1].style = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); border-radius: 0.5rem; padding: 1rem 1rem 1rem 1rem;';
						modal[1].style.maxWidth = `${Math.round(window.innerWidth * 2/3)}px`;
						if (isLightTheme) modal[1].style.color = 'black';
						modal[1].style.backgroundColor = isDarkTheme ? '#1b3131'/*'DarkSlateGray'*/ : 'FloralWhite';
						modal[1].style.width = 'max-content';
						if (!modal[1].style.width) modal[1].style.width = '-moz-max-content';
						// Header
						modal[2].textContent = 'Review how to import names found';
						modal[2].style = 'margin-bottom: 1em; font-weight: bold; font-size: 12pt; cursor: default;'
						// External linkz
						modal[17].style = 'float: right; display: inline-flex; margin-left: 6pt;';
						modal[17].style.flexFlow = importSize >= quickFilterSize && importSize < stateFilterSize ? 'column' : 'row';
						modal[11].href = 'https://rateyourmusic.com/search?' + new URLSearchParams({
							searchterm: '"' + artist.name + '"',
							searchtype: 'a',
						}).toString();
						modal[11].target = '_blank';
						modal[11].textContent = 'RYM';
						modal[11].style = 'margin-left: 6pt; font-size: 8pt; color: cadetblue;';
						modal[11].title = 'Rate Your Music';
						modal[11].tabIndex = 10100;
						modal[11].hidden = true;
						GlobalXHR.get(modal[11]).then(function({document}) {
							let searchResults = document.body.querySelectorAll('h3 ~ table > tbody > tr.infobox a.searchpage');
							if (searchResults.length <= 0) return;
							modal[11].hidden = false;
							searchResults = Array.prototype.filter.call(searchResults, a =>
								(a = a.textContent.trim()).toLowerCase() == artist.name.toLowerCase() || fuzzyArtistsMatch(a, artist.name));
							const stats = window.document.createElement(searchResults.length == 1 ? 'A' : 'SPAN');
							stats.style = 'margin-left: 1pt; font-size: 6.5pt; color: cadetblue;';
							stats.textContent = '(' + searchResults.length + ')';
							if (stats.tagName == 'A') {
								stats.href = modal[11].origin + searchResults[0].pathname;
								stats.target = '_blank';
								stats.title = searchResults[0].textContent.trim();
								stats.tabIndex = 10101;
							}
							modal[11].append(stats);
						});
						modal[17].append(modal[11]);
						// modal[12].href = 'https://music.metason.net/artistinfo?name=' + encodeURIComponent(artist.name);
						// modal[12].target = '_blank';
						// modal[12].textContent = 'AI';
						// modal[12].style = 'margin-left: 6pt; font-size: 8pt; color: cadetblue;';
						// modal[12].title = 'Artist Info';
						// modal[12].tabIndex = 10102;
						// modal[12].hidden = true;
						// GlobalXHR.get(modal[12]).then(({document}) =>
						// 	{ if (document.body.querySelector('div.one-half > h4') != null) modal[12].hidden = false });
						// modal[17].append(modal[12]);
						modal[2].append(modal[17]);
						modal[1].append(modal[2]);
						// DynaFilter
						if (importSize >= quickFilterSize) {
							modal[14].style.margin = '0 0 2pt 0';
							modal[13].style = importSize >= stateFilterSize ? 'display: inline-block; position: relative; margin: 0 0 0 5pt;'
								: 'float: right; display: inline-block; position: relative; margin: 0 0 2pt 12pt;';
							modal[9].type = 'text';
							modal[9].id = 'import-dynafilter';
							modal[9].placeholder = 'Quick filter';
							modal[9].style = importSize >= stateFilterSize ? 'height: 1.4em; padding: 0 18pt 0 1pt; margin: 0;'
								: 'height: 1.4em; padding: 0 18pt 0 1pt; margin: 6pt 0 0 0;';
							modal[9].style.width = `${importSize >= stateFilterSize ? 12 : 7}em`;
							modal[9].ondblclick = evt => { applyDynaFilter(evt.currentTarget.value = '') };
							modal[9].oninput = evt => { applyDynaFilter(evt.currentTarget.value) };
							modal[9].onkeyup = evt => { if (evt.key == 'Escape') evt.currentTarget.ondblclick(evt) };
							modal[13].append(modal[9]);
							modal[10].height = 17;
							modal[10].style = `position: absolute; right: 3px; top: ${importSize >= stateFilterSize ? 13 : 38}%;`;
							modal[10].src = GM_getResourceURL('input-clear-button');
							modal[10].onclick = evt => {
								applyDynaFilter();
								const input = document.getElementById('import-dynafilter');
								if (input != null) input.value = '';
							};
							modal[13].append(modal[10]);
							modal[importSize < stateFilterSize ? 2 : 14].append(modal[13]);
							modal[16].id = 'state-dynafilter';
							modal[16].style = 'height: auto; max-width: 12em; margin: 0 5pt 0 0; float: right;';
							addOption(modal[16], 'Show all', 0);
							if (!evt.ctrlKey) addOption(modal[16], 'Show available and taken', 1);
							if (!evt.ctrlKey) addOption(modal[16], 'Show available and taken (excl. ambiguous)', 2);
							addOption(modal[16], 'Show available', 3);
							if (!evt.ctrlKey) addOption(modal[16], 'Show available (excl. implicit redirects)', 4);
							if (!evt.ctrlKey) addOption(modal[16], 'Show available (implicit redirects only)', 5);
							if (!evt.ctrlKey) addOption(modal[16], 'Show taken (all states)', 6);
							if (!evt.ctrlKey) addOption(modal[16], 'Show taken (excl. ambiguous)', 7);
							if (!evt.ctrlKey) addOption(modal[16], 'Show taken (ambiguous only)', 8);
							modal[16].value = 0;
							modal[16].onchange = evt => { applyDynaFilter(modal[9].value) };
							modal[14].append(modal[16]);
							if (importSize >= stateFilterSize) modal[1].append(modal[14]);
						}
						// Import table
						modal[3].id = 'dicogs-aliases';
						modal[3].style = 'display: block; padding: 3pt 0px 2pt; overflow-y: auto; overscroll-behavior-y: none; scrollbar-gutter: stable; scroll-behavior: auto;';
						modal[3].style.maxHeight = `${Math.round(window.innerHeight * 2/3)}px`;
						modal[3].append(modal[4]);

						// Filling the import table
						categories.forEach(function(category, categoryIndex) {
							if (category) switch (categoryIndex) {
								case 1: case 3: var prefix = 'G'; break;
								case 2: prefix = 'A'; break;
								case 4: prefix = 'M'; break;
							} else return;
							category.forEach(function(relative) {
								function sameNames(n1, n2) {
									if (!n1 || !n2) return false;
									if ((n1 = n1.trim().toLowerCase()) == (n2 = n2.trim().toLowerCase())) return true;
									const na = [n1, n2].map(n => n.toASCII().toLowerCase());
									return na[0] && na[0] == n2 || na[1] && n1 == na[1] || na.every(Boolean) && na[0] == na[1];
								}
								function findMatchingAliasId(name) {
									let alias = findAlias(name, true);
									if (alias && !alias.redirectId) return alias.id;
									const cmpNorm = name => name.toLowerCase().replace(/[\s]+/g, '');
									for (let li of aliases) {
										if (!(alias = getAlias(li)) || alias.redirectId > 0) continue;
										if (cmpNorm(alias.name) == cmpNorm(name)) return alias.id;
									}
								}

								const relMatchByRealName = sameNames(relative.realname, button.artist.realname)
									|| sameNames(relative.realname, dcNameNormalizer(button.artist.name))
									|| sameNames(dcNameNormalizer(relative.name), button.artist.realname);
								const relMatchByMembers = Array.isArray(relative.members)
										&& Array.isArray(button.artist.members) && (function() {
									const memberIds = [relative, button.artist].map(obj => obj.members
										.filter(member => member.active).map(member => member.id).sort());
									return memberIds[0].length == memberIds[1].length
										&& memberIds[0].every((id, ndx) => memberIds[1].indexOf(id) == ndx);
								})();
								const redirectId = findMatchingAliasId(dcNameNormalizer(relative.name))
									|| Array.isArray(relative.namevariations) && relative.namevariations.reduce((aliasId, anv) =>
										aliasId || ![button.artist.name, relative.name].map(dcNameNormalizer).includes(anv)
											&& findMatchingAliasId(anv), undefined) || undefined;

								relative.importEntries.forEach(function(status, name) {
									function clickToFilter(elem, clickHandler) {
										if (!modal[9].id || !(elem instanceof HTMLElement) || typeof clickHandler != 'function') return;
										elem.style.cursor = 'pointer';
										elem.onclick = clickHandler;
										elem.title = 'Click to filter';
									}
									function applyStatus(status) {
										if (!Number.isInteger(status)) throw 'Invalid argument';
										elems[6].dataset.state = status;
										if (importSize < stateFilterSize) return;
										const isFiltered = elems[1].filteredName || isFilteredState(status);
										if (elems[0].hidden != isFiltered) elems[0].hidden = isFiltered;
									}

									const nameNorm = dcNameNormalizer(name),
												elems = createElements('TR', 'TD', 'A', 'SPAN', 'SPAN', 'SPAN', 'TD');
									elems[1].style = 'padding: 0 7pt;';
									elems[1].style.width = isFirefox ? '100%' : '-webkit-fill-available';
									if (!elems[1].style.width) elems[1].style.width = 'max-content';
									elems[1].dataset.artistId = relative.id;
									elems[1].dataset.categoryIndex = categoryIndex;
									if (prefix) elems[1].dataset.relation = prefix;
									elems[2].className = 'alias-name';
									elems[1].dataset.anv = elems[2].textContent = nameNorm.properTitleCase();
									elems[2].style = name == relative.name ? 'font-weight: bold;' : 'font-weight: normal;';
									elems[2].href = relative.uri + '?' + new URLSearchParams({
										anv: name,
										filter_anv: 1,
										//type: 'All',
										//sort: 'year,desc',
										//limit: 500,
									}).toString();
									elems[2].target = '_blank';
									elems[2].onclick = function(evt) {
										if (evt.altKey && evt.ctrlKey) return googleIt.call(evt.currentTarget,
											button.artist.realname || dcNameNormalizer(button.artist.name));
										if (evt.altKey) return googleIt.call(evt.currentTarget, dcNameNormalizer(button.artist.name));
										if (evt.shiftKey && evt.ctrlKey)
											return googleIt.call(evt.currentTarget, relative.realname || dcNameNormalizer(relative.name));
										if (evt.shiftKey) return googleIt.call(evt.currentTarget, dcNameNormalizer(relative.name));
										//if (evt.ctrlKey && !evt.shiftKey && !evt.altKey) GM_setClipboard(nameNorm, 'text');
									};
									if (relative.tooltip instanceof Promise) window.tooltipster.then(() =>
											relative.tooltip.then(tooltip => { $(elems[2]).tooltipster({
										content: tooltip + '<div style="display: block; clear: both;"><br><b>Alt + click</b>: GoogleIt artist + ANV<br><b>Shift + click</b>: GoogleIt alias + ANV<br>(<b>+ Ctrl</b> uses real name where available)</div>',
										maxWidth: 500,
										interactive: true,
										delay: 500,
									}).tooltipster('reposition') }));
									leftMenu.attach(elems[2]);
									elems[1].append(elems[2]);
									elems[3].style = 'font-weight: 100; font-stretch: condensed; margin-left: 4pt;';
									elems[3].append('[');
									if (prefix) {
										elems[4].textContent = prefix;
										clickToFilter(elems[4], function(evt) {
											const input = document.getElementById('import-dynafilter');
											if (input != null) applyDynaFilter(input.value = 'type:' +
												evt.currentTarget.parentNode.parentNode.dataset.relation);
										});
										elems[3].append(elems[4], '/');
									}
									elems[5].textContent = relative.id;
									clickToFilter(elems[5], function(evt) {
										const input = document.getElementById('import-dynafilter');
										if (input != null)
											input.value = 'id:' + evt.currentTarget.parentNode.parentNode.dataset.artistId;
										applyDynaFilter(parseInt(evt.currentTarget.parentNode.parentNode.dataset.artistId));
									});
									elems[3].append(elems[5], ']');
									if (relative.id == button.artist.id) elems[3].hidden = true;
									elems[1].append(elems[3]);
									elems[0].append(elems[1]);
									elems[6].style = 'min-width: max-content; text-align: left; color: lightsalmon;';
									if (!elems[6].style.minWidth) elems[6].style.minWidth = '-moz-max-content';
									elems[6].append('Resolving onsite status...');
									elems[0].append(elems[6]);
									console.assert(status instanceof Promise, 'status instanceof Promise');
									if (status instanceof Promise) status.then(function(status) {
										while (elems[6].lastChild != null) elems[6].removeChild(elems[6].lastChild);
										elems[6].style = null;
										if (!status) {
											elems[0].style.height = null;
											elems[6].style = 'padding: 0;';
											applyStatus(status == null ? 0 : 1);
											elems[7] = dropDown.cloneNode(true);
											elems[7].className = 'redirect-to';
											elems[7].removeAttribute('name');
											elems[7].style = 'max-width: 25em; margin: 1pt 3pt 1pt 0;';
											elems[7].dataset.redirectId = redirectId || mainIdentityId;
											elems[7].dataset.aliasName = nameNorm.properTitleCase();
											for (let option of elems[7].options) option.text = parseInt(option.value) == 0 ?
												'Make it non-redirecting alias' : 'Redirect to ' + option.text;
											elems[8] = document.createElement('OPTION');
											elems[8].text = status == null ? 'Do not import' : 'Keep implicit redirect';
											elems[8].value = -1;
											elems[7].add(elems[8], 0);
											elems[7].value = status == 0 ? -1 : (function() {
												const nonLatin = nameNorm.replace(/[\s\.\-\,\&]+/g, '').toASCII().length <= 0;
												const short = /^(?:\w\W?\s?){0,2}$/.test(nameNorm);
												const weakAlias = (function() {
													const norm = str => str.toASCII().toLowerCase(),
																n = [button.artist.name, nameNorm].map(norm);
													return n[1] == n[0] || 'the ' + n[1] == n[0] || n[1] == 'the ' + n[0] ?
														1 : /^(?:[a-z](?:\.\s*|\s+))+(\w{2,})\w/.test(n[1]) ? n[0].includes(norm(RegExp.$1)) ?
														3 : 2 : 0;
												})();
												if (short) return -1;
												if (name != relative.name && Array.isArray(button.artist.aliases)
														&& button.artist.aliases.some(alias => alias.name
															&& dcNameNormalizer(alias.name).toLowerCase() == nameNorm.toLowerCase()))
													return -1;
												switch (categoryIndex) {
													case 0: return /*nonLatin ? -1 : */redirectId || mainIdentityId;
													case 1: return redirectId || /*weakAlias > 1 ? -1 : */0;
													case 2: return relMatchByRealName || relMatchByMembers ? redirectId || 0
														: /*weakAlias == 1 ? 0 : */-1;
													case 3: return redirectId || weakAlias == 1 ? 0 : -1;
													case 4: return -1;
													default: return -1; // assertion failed
												}
											})();
											elems[6].append(elems[7]);
											modal[5].querySelectorAll(':scope > tr > td > select.' + elems[7].className)
												.forEach((select, ndx) => { select.tabIndex = ndx + 1 });
											modal[7].disabled = false;
											for (let elem of modal[6].getElementsByClassName('quick-preset'))
												elem.style.display = 'inline-block';
										} else {
											elems[6].style = 'height: 18pt; min-width: max-content; padding: 0 7pt 0 3pt; text-align: left;';
											if (!elems[6].style.minWidth) elems[6].style.minWidth = '-moz-max-content';
											if (status > 0) {
												elems[6].textContent = 'Defined (' + status + ')';
												applyStatus(20);
											} else if (typeof status == 'object') { // AJAX artist object
												elems[6].textContent = 'Taken by artist ';
												applyStatus(15);
												elems[7] = document.createElement('A');
												elems[7].textContent = status.name;
												elems[7].className = 'local-artist-group';
												elems[7].href = '/artist.php?id=' + status.id;
												elems[7].target = '_blank';
												if (isPseudoArtist(status.name)) {
													applyStatus(19);
													elems[7].style.color = 'red';
													elems[6].append(elems[7]);
													elems[0].append(elems[6]);
													modal[5].append(elems[0]);
													setTooltip(elems[7], 'Profile of pseudo artist - do not merge');
													return;
												}
												elems[7].onclick = clickHandler;
												elems[7].onauxclick = auxClickHandler;
												rightMenu.attach(elems[7]);
												elems[7].dataset.artistName = status.name;
												elems[7].dataset.artistId = status.id;
												elems[7].dataset.aliasName = nameNorm;
												const redirectTo = findAlias(redirectId, true);
												if (relative.id != button.artist.id)
													elems[7].dataset.redirectTo = redirectTo ? redirectTo.name : artist.name;
												if (Array.isArray(status.similarArtists)) {
													const similarArtists =  status.similarArtists.filter(sa1 => sa1.artistId != artist.id
															&& (!Array.isArray(artist.similarArtists)
																|| !artist.similarArtists.some(sa2 => sa2.artistId == sa1.artistId)));
													if (similarArtists.length > 0) elems[7].dataset.similarArtists =
														JSON.stringify(similarArtists.map(similarArtist => similarArtist.name));
												}
												let tooltip = `<b>Ctrl + click</b> to merge with current artist via non-redirecting alias
<b>Shift + click</b> to merge with current artist via redirect to ${redirectTo && redirectTo.id != mainIdentityId ? `<b>${redirectTo.name}</b>` : 'main identity'}
<b>Ctrl + rightclick</b> to make the triggered name only current artist's non-redirecting alias
<b>Shift + rightclick</b> to make the triggered name only redirect to ${redirectTo && redirectTo.id != mainIdentityId ? `<b>${redirectTo.name}</b>` : 'main identity'}
<b>Alt + rightclick</b> to release the triggered name from this artist
<b>Ctrl + Alt + click</b> to merge with this artist via non-redirecting alias (change artist id)
<b>Shift + Alt + click</b> to merge with this artist via redirect (rename)`;
												if (artist.similarArtists
														&& artist.similarArtists.some(similarArtist => similarArtist.artistId == status.id))
													elems[7].dataset.similar = true;
												else tooltip += '\n<b>Alt + click</b> to link as similar artist';
												window.tooltipster.then(function() {
													if (status.image) tooltip += `<img style="margin-left: 5pt; float: right; max-width: 90px; max-height: 90px;" src="${status.image}" />`;
													tooltip += `<div style="margin-top: 0.5em;"><b>Groups:</b> ${status.statistics.numGroups}/${status.torrentgroup ? status.torrentgroup.length : null}</div>`;
													if (status.requests) tooltip += `<div><b>Requests:</b> ${status.requests.length}</div>`;
													if (status.tags && status.tags.length > 0) {
														const statusTags = new TagManager(...status.tags.map(tag => tag.name).filter(tagsExclusions));
														if (artist.tags && artist.tags.length > 0) {
															const commonTags = Array.from(statusTags).filter(tag => artist.tags.includes(tag)),
																		setSize = Math.min(artist.tags.length, statusTags.length),
																		matchRate = commonTags.length / setSize;
															const color = matchRate >= 0.75 ? 'green' : matchRate >= 0.50 ? '#9d9d00'
																: matchRate >= 0.25 ? '#ffb100' : 'red';
															const tagsFormatter = tagList => tagList.length > 0 ? tagList.length > 30 ?
																tagList.slice(0, 30).join(', ') + ', …' : tagList.join(', ') : '∅';
															tooltip += `<div style="margin-top: 0.5em;"><b>Common tags:</b> ${tagsFormatter(commonTags)} (<span style="color: ${color};">${commonTags.length}/${setSize}</span>)`;
															let unmatchedTags = [
																Array.from(statusTags).filter(tag => !artist.tags.includes(tag)),
																Array.from(artist.tags).filter(tag => !statusTags.includes(tag)),
															];
															if (unmatchedTags.some(list => list.length > 0)) {
																unmatchedTags = unmatchedTags.map(tagsFormatter);
																tooltip += `\n<b>Unmatched tags:</b> ${unmatchedTags[0]} <b>↔</b> ${unmatchedTags[1]}`;
															}
															tooltip += '</div>';
														} else tooltip += `<div style="margin-top: 0.5em;"><b>Tags:</b> ${statusTags.toString()}</div>`;
													}
													if (status.body) tooltip += '<p style="margin-top: 1em;">' + status.body.slice(0, 2**10) + '</p>';
													$(elems[7]).tooltipster({ content: tooltip.replace(/[ \t]*\r?\n/g, '<br>'), maxWidth: 500, interactive: true });
												}).catch(reason => { elems[7].title = tooltip });
												elems[6].append(elems[7]);
												elems[8] = document.createElement('DIV');
												elems[8].className = 'icon-bay';
												elems[8].style = 'display: none; margin-left: 5pt; position: relative;';
												let warnLevel;
												const setWarnLevel = n => { if (!(warnLevel >= n)) warnLevel = Math.min(n, 1) }, issues = [ ];
												if (multiArtistProfileImages.includes(status.image)) {
													issues.push('Ambiguous name by profile image');
													setWarnLevel(1);
												}
												if (status.body && [
													/\b(?:merged?\b|(?:avoid|not|don\'t)(\s+(?:mak|creat)(?:e|ing)\b)?(?:alias)\b)/i,
													/\<strong class="important_text"\>[\S\s]+\<\/strong\>/,
													/\[important\][\S\s]+\[\/important\]/,
												].some(rx => rx.test(status.body))) {
													issues.push('Specific pattern found in wiki body, review it full');
													setWarnLevel(1);
												}
												if (status.tags && status.tags.length > 0 && artist.tags && artist.tags.length > 0) {
													const statusTags = new TagManager(...status.tags.map(tag => tag.name).filter(tagsExclusions)),
																commonTags = Array.from(statusTags).filter(tag => artist.tags.includes(tag)),
																setSize = Math.min(artist.tags.length, statusTags.length),
																matchRate = commonTags.length / setSize,
																ratioSuffix = ` (${Math.round(matchRate * 100)}%)`;
													if (matchRate * 4 < 1) issues.push('Tags incompatible' + ratioSuffix);
														else if (matchRate * 4 < 3) issues.push('Tags not quite compatible' + ratioSuffix);
													if (matchRate * 4 < 3) setWarnLevel(1/4 + Math.min(3/4 - matchRate, 2/4) * 3/2);
												}
												if (issues.length > 0) addIconToBay(elems[8], 'warn-icon2',
													warnLevel, issues.length > 0 ? issues.join('\n') : undefined);
												if ('similar' in elems[7].dataset) addLinkIcon(elems[8]);
												elems[6].append(elems[8]);
												if (status.dcMatches instanceof Promise) status.dcMatches.then(function(matchedGroups) {
													const counterStyle = matchedGroups == null || matchedGroups.length <= 0 ? 'color: red;' : undefined;
													const scoreCounter = createElements('SPAN', 'SPAN', 'SPAN');
													scoreCounter[0].style.marginLeft = '4pt';
													scoreCounter[1].className = 'release-match-counter';
													if (counterStyle) scoreCounter[1].style = counterStyle;
													scoreCounter[1].textContent = matchedGroups ? matchedGroups.length : 0;
													scoreCounter[2].className = 'releases-size';
													scoreCounter[2].textContent = Object.keys(status.torrentgroup).length; // status.numReleases
													if (beeps) beeps[1].play();
													if (isPseudoArtist(status.name) || rxGenericName.test(status.name)) {
														applyStatus(18);
														elems[7].style.color = 'red';
														setTooltip(elems[7], 'Profile of pseudo or generic artist - do not merge');
													} else if (matchedGroups && matchedGroups.length >= status.numReleases) {
														scoreCounter[0].style.color = 'green';
														applyStatus(10);
														elems[6].dataset.matchRate = 1;
														setTooltip(scoreCounter[0], 'Id is exclusive to this physical artist');
														if (beeps) beeps[5].play();
													} else if (status.lookup instanceof Promise) {
														scoreCounter[0].title = '...in progress...';
														scoreCounter[0].style.opacity = 0.5;
														status.lookup.then(function(results) {
															results = stripDcRelativesFromResults(results, relative);
															const matchedArtists = getMatchedArtists(results);
															//console.debug('Lookup results for', status.name, results);
															scoreCounter[0].style.opacity = 1;
															if (beeps) beeps[matchedArtists.length == 1 ? 5 : 2].play();
															if (matchedArtists.length > 1) {
																const collisions = findSearchResultColisions(matchedArtists);
																applyStatus(16);
																scoreCounter[0].style.color = matchedGroups && matchedGroups.length > 0 ?
																	matchedArtists.uncertain ? '#cc0' : 'orange' : 'red';
																console.info(`[AAM] Multiple matching artists for alias '${status.name}":`, matchedArtists);
																if (collisions) console.warn('[AAM] Matched groups overlaps among shared profile artists (%s):', status.name, collisions);
																let artistRefs = matchedArtists.map(function(matchedArtist, ndx) {
																	const isDubiousArtist = matchedArtist.matchedGroups.every(matchedGroup =>
																		matchedArtists.filter(matchedArtist => matchedArtist.matchedGroups.includes(matchedGroup)).length > 1);
																	return getArtistRef(matchedArtist, matchedArtists.bestMatch, isDubiousArtist);
																}).filter(Boolean);
																artistRefs = artistRefs ? '<br><br><b>Colliding artists:</b><br>' + artistRefs.join('<br>') : '';
																if (artistRefs && collisions) artistRefs += `<br><br>[!] ${collisions.size} results with colliding releases (see console log for details)`;
																window.tooltipster.then(() => { $(scoreCounter[0]).tooltipster({
																	content: (matchedGroups && matchedGroups.length > 0 ?
																		`Related name belongs to at least ${matchedArtists.length} distinct artists sharing this id (do not merge)`
																			: `This id is shared by at least ${matchedArtists.length} distinct artists (do not merge)`) + artistRefs,
																	interactive: true,
																}) });
															} else if (matchedArtists.length == 1) {
																let tooltip;
																if (matchedArtists.bestMatch.discogsArtist) if (matchedArtists.bestMatch.discogsArtist.id == relative.id) {
																	scoreCounter[0].style.color =
																		reliabilityColorValue(matchedGroups ? matchedGroups.length : 0, status.numReleases);
																	applyStatus(10);
																	elems[6].dataset.matchRate = (matchedGroups ? matchedGroups.length : 0) / status.numReleases;
																	tooltip = 'Site profile is likely exclusive to this artist instance';
																} else {
																	const artistRef = getArtistRef(matchedArtists.bestMatch);
																	if (matchedGroups && matchedGroups.length > 0) {
																		scoreCounter[0].style.color = 'orange';
																		applyStatus(16);
																		tooltip = 'This site id is shared by at least one different artist (do not merge)<br><br>' + artistRef;
																	} else {
																		scoreCounter[0].style.color = 'red';
																		applyStatus(17);
																		tooltip = `This site id is entirely used by different artist ${artistRef}, do not merge`;
																	}
																	console.info(`[AAM] Discogs artist mismatch for alias '${status.name}":`, matchedArtists);
																} else {
																	applyStatus(14);
																	tooltip = 'The only matching artist couldnot be reliably linked to Discogs alias';
																}
																if (tooltip) window.tooltipster.then(function() { $(scoreCounter[0]).tooltipster({
																	content: tooltip,
																	interactive: !matchedArtists.bestMatch.discogsArtist
																		|| matchedArtists.bestMatch.discogsArtist.id != relative.id,
																}) });
															} else setTooltip(scoreCounter[0], `No matching releases for any of ${results.length} artists found`);
														}).catch(function(reason) {
															scoreCounter[0].style.opacity = 1;
															if (reason == 'No matches') return;
															addIconToBay(elems[8], 'error-icon', undefined, reason.toString());
														});
													}
													scoreCounter[0].append('[', scoreCounter[1], '/', scoreCounter[2], ']');
													elems[7].after(scoreCounter[0]);
												}, reason => { elems[7].title = reason });
											} // status: artist on site
										} // name is used
									}, function(reason) {
										elems[7].textContent = 'Resolving name status error';
										elems[7].style = 'opacity: 1; color: red;';
										setTooltip(elems[5], reason);
									}); // status handler
									modal[5].append(elems[0]);
								}); // fill import table
							});
						});

						modal[3].append(modal[5]);
						modal[1].append(modal[3]);
						// Buttonbar
						modal[6].style = 'margin-top: 1em;';
						modal[7].type = 'button';
						modal[7].value = 'Import now';
						modal[7].disabled = true;
						modal[7].onclick = function(evt) {
							let rows = 'table#dicogs-aliases > tbody > tr';
							const batchSize = Array.prototype.filter.call(document.body.querySelectorAll(rows + ' > td select.redirect-to'),
								select => parseInt(select.value) >= 0).length;
							rows = document.body.querySelectorAll(rows);
							closeModal();
							if (batchSize > 0) setProgressInfo('Adding aliases...');
							const largeBatchInterval = GM_getValue('large_batch_interval', 250); // ms
							let counter = 0;
							Promise.all(Array.prototype.map.call(rows, function(tr) {
								//if (tr.hidden) return;
								let redirectId = tr.cells[1].querySelector('select.redirect-to');
								if (redirectId != null) redirectId = parseInt(redirectId.value); else return;
								if (!(redirectId >= 0)) return;
								if (!(batchSize > maxBatchSize)) return addAlias(tr.cells[0].dataset.anv, redirectId);
								return new Promise((resolve, reject) => { setTimeout(function(aliasName, redirectId, n) {
									addAlias(aliasName, redirectId).then(resolve, reject);
									setProgressInfo(`Please wait... [${n}/${batchSize}]`);
								}, counter++ * largeBatchInterval, tr.cells[0].dataset.anv, redirectId, counter) });
							}).filter(n => n instanceof Promise)).then(function(results) {
								setProgressInfo(`Total ${results.length} artist aliases imported`, results.length + changesMade <= 0);
								if (results.length > 0 || changesMade > 0) document.location.reload(); else cleanUp();
							});
						};
						modal[7].tabIndex = 10000;
						modal[6].append(modal[7]);
						modal[8].type = 'button';
						modal[8].style.marginLeft = '5pt';
						modal[8].value = 'Close';
						modal[8].onclick = closeModal;
						modal[8].tabIndex = 10001;
						modal[6].append(modal[8]);

						function addQSBtn(caption, value, margin, tabIndex, tooltip) {
							const a = document.createElement('A');
							a.className = 'quick-preset';
							a.textContent = caption;
							a.href = '#';
							a.style.color = isDarkTheme ? 'lightgrey' : '#0A84AF';
							a.style.display = 'none';
							if (margin) a.style.marginLeft = margin;
							if (tooltip) {
								a.title = 'Resolve all to ' + tooltip;
								window.tooltipster.then(() => { $(a).tooltipster() }).catch(reason => { console.warn(reason) });
							}
							if (tabIndex > 0) a.tabIndex = tabIndex;
							a.onclick = function(evt) {
								for (let select of modal[3].querySelectorAll('tbody > tr > td:nth-of-type(2) > select')) {
									if (select.parentNode.parentNode.hidden) continue;
									switch (typeof value) {
										case 'number': select.value = value; break;
										case 'function': select.value = value(select); break;
									}
								}
								return false;
							};
							modal[6].append(a);
						}
						addQSBtn('Import none', -1, '15pt', 10010);
						addQSBtn('All NRA', 0, '10pt', 10011);
						addQSBtn('All RD', select => select instanceof HTMLElement && select.dataset.redirectId ?
							parseInt(select.dataset.redirectId) : mainIdentityId, '10pt', 10012);
						if (dropDown.options.length > 2) {
							modal[20] = dropDown.cloneNode(true);
							modal[20].options[0].text = 'Redirect to...';
							modal[20].selectedIndex = 0;
							modal[20].className = 'quick-preset';
							modal[20].removeAttribute('name');
							modal[20].style = 'height: auto; max-width: 7em; margin-left: 10pt;';
							modal[20].style.display = 'none';
							modal[20].onchange = function(evt) {
								const redirectId = parseInt(evt.currentTarget.value);
								if (redirectId > 0) for (let select of modal[3].querySelectorAll('tbody > tr > td:nth-of-type(2) > select'))
									if (!select.parentNode.parentNode.hidden) select.value = redirectId;
								evt.currentTarget.selectedIndex = 0;
							};
							modal[6].append(modal[20]);
						}
						modal[1].append(modal[6]);
						modal[0].append(modal[1]);
						document.body.style.overflow = 'hidden';
						document.body.append(modal[0]);
						modal[0].style.opacity = 1;
						modal[0].style.visibility = 'visible';
						modal[0].style.transform = 'scale(1.0)';
						modal[0].style.transition = 'visibility 0s linear 0s, opacity 0.25s 0s, transform 0.25s';
						if ((elem = modal[5].querySelector('select[tabindex="1"]')) != null) elem.focus();
					}).catch(function(reason) {
						setProgressInfo();
						cleanUp();
						alert(reason);
					});
				}

				function linkRelatives(evt) {
					function cleanUp() {
						if (button.dataset.caption) button.value = button.dataset.caption;
						//button.style.color = null;
						button.disabled = false;
						activeElement = null;
					}

					if (activeElement != null) return false;
					const button = evt.currentTarget;
					if (button.artist) activeElement = button; else throw 'No artist attached';

					function addNames(artistId, ...names) {
						if (Array.isArray(names)) Array.prototype.push.apply(relatedArtists[artistId], names.filter(function(name) {
							if (isPseudoArtist(name)) return false;
							name = [dcNameNormalizer(name)];
							name.push(name[0].toLowerCase());
							return (!artist.similarArtists || !artist.similarArtists.some(artist =>
								artist.name.toLowerCase() == name[1])) && !findAlias(name[0]);
						}).map(dcNameNormalizer));
					}

					const relatedArtists = { [button.artist.id]: [ ] }, anvWorkers = [ ];
					addNames(button.artist.id, dcNameNormalizer(button.artist.name));
					if (evt.ctrlKey && Array.isArray(button.artist.namevariations))
						addNames(button.artist.id, ...button.artist.namevariations);
					for (let key of ['aliases', 'members', 'groups'])
						if (Array.isArray(button.artist[key])) for (let a1 of button.artist[key]) {
							if (evt.altKey && a1.active == false) continue;
							relatedArtists[a1.id] = [ ];
							addNames(a1.id, a1.name);
							if (evt.ctrlKey) anvWorkers.push(getDiscogsEntry('artist', a1.id).then(function(dcArtist) {
								console.assert(dcArtist.id == a1.id, `Ids mismatch (${dcArtist.id} ≠ ${a1.id})`);
								if (Array.isArray(dcArtist.namevariations)) addNames(a1.id, ...dcArtist.namevariations);
							}, console.warn.bind(console)));
						}
					if (Object.keys(relatedArtists).length <= 0 && anvWorkers.length < 0) return;
					button.disabled = true;
					//button.style.color = 'red';
					setProgressInfo('Please wait...');
					setAjaxApiLogger(function(action, apiTimeFrame, timeStamp) {
						setProgressInfo(`Please wait... (${apiTimeFrame.requestCounter - 5} name queries queued)`);
					});
					let minMatchRate = GM_getValue('link_related_min_match_rate', 1/5);
					if (minMatchRate > 1) minMatchRate = 1;
					Promise.all(anvWorkers).then(function() {
						return Promise.all(Object.keys(relatedArtists).map(function(artistId) {
							return Promise.all(relatedArtists[artistId].map(name => getSiteArtist(name).then(function(siteArtist) {
								if (siteArtist.id == artist.id) return Promise.reject('Same artist');
								if (artist.similarArtists && artist.similarArtists.some(a2 => a2.artistId == siteArtist.id))
									return Promise.reject('Already similar');
								const releases = getWhateverList(siteArtist);
								if (!releases) return Promise.reject('Nothing to match');
								return getDiscogsMatches(parseInt(artistId), releases).then(matchedGroups => (function() {
									if (matchedGroups == null || matchedGroups.length <= 0) return false;
									const matchRatio = matchedGroups.length / releases.length;
									if (minMatchRate > 0 && matchRatio < minMatchRate) {
										console.log(`[AAM] Similar artist ${siteArtist.name} (${siteArtist.id}) with ${matchedGroups.length} matched releases low confirmation ratio (${Math.round(matchedGroups.length * 100 / items.length)}%)`);
										return false;
									} else return true;
								})() ? siteArtist.name : Promise.reject('Insufficient matching with this artist'));
							}).catch(reason => null))).then(results => results.filter(Boolean));
						})).then(function(results) {
							return Promise.all(Array.prototype.concat.apply([ ], results).filter(function(artist1, ndx, arr) {
								return arr.findIndex(artist2 => artist2.toLowerCase() == artist1.toLowerCase()) == ndx;
							}).map(artist => addSimilarArtist(artist)));
						});
					}).then(function(results) {
						setProgressInfo(`Total ${results.length} artists were linked as similar`, true);
						if (results.length > 0) {
							if (beeps) beeps[4].play();
							document.location.reload();
						} else cleanUp();
					}, function(reason) {
						setProgressInfo();
						cleanUp();
						alert(reason);
					});
				}

				function addFetchButton(caption, id = caption) {
					const button = document.createElement('INPUT');
					button.type = 'button';
					if (id) button.id = 'fetch-' + id;
					if (caption) button.value = button.dataset.caption = 'Fetch ' + caption;
					button.style = 'display: none;';
					button.onclick = importNames;
					const tooltip = `Available keyboard modifiers (can be combined):
+CTRL: don't perform site names lookup (faster and less API requests consuming, doesn't reveal local separated identities)
+SHIFT: don't include aliases', groups' and members' name variants
+ALT: include also groups not based on artist's name (only applies if fetching groups) / include also inactive members (only applies if fetching members)`;
					setTooltip(button, tooltip);
					dcForm.append(button);
				}

				function dcInputUpdate(evt) {
					function updateButton(id, artist = null) {
						if (!id) throw 'Invalid argument';
						const button = document.getElementById(id);
						if (button == null) return;
						button.style.display = artist ? 'inline' : 'none';
						if (artist) button.artist = artist; else if ('artist' in button) delete button.artist;
					}

					window.tooltipster.then(() => { $(dcInput).tooltipster('disable') });
					getDiscogsEntry('artist', getDcArtistId()).then(function(dcArtist) {
						console.log(`Discogs data for ${dcArtist.id}:`, dcArtist);
						if ((button = document.getElementById('dc-view')) != null) button.disabled = false;
						if ((button = document.getElementById('dc-update-wiki')) != null) button.updateStatus(dcArtist);
						const hasCat = key => Array.isArray(dcArtist[fetchers[key][0]]) && dcArtist[fetchers[key][0]].length > 0;
						updateButton('fetch-everything', Object.keys(fetchers).slice(0, 3).some(hasCat)
							|| dcArtist.realname && dcArtist.realname.trim().toLowerCase() != dcNameNormalizer(dcArtist.name).toLowerCase() ?
								dcArtist : null);
						for (let key in fetchers) updateButton(`fetch-${key}-only`, hasCat(key) ? dcArtist : null);
						updateButton('link-related', Object.keys(fetchers).slice(1).some(hasCat) ? dcArtist : null);
						window.tooltipster.then(() => genDcArtistTooltipHTML(dcArtist, false).then(function(tooltip) {
							$(dcInput).tooltipster('update', tooltip).tooltipster('enable').tooltipster('reposition');
						})).catch(reason => { console.warn(reason) });
					}, function(reason) {
						if ((button = document.getElementById('dc-view')) != null) button.disabled = true;
						if ((button = document.getElementById('dc-update-wiki')) != null) button.updateStatus(false);
						updateButton('fetch-everything');
						for (let key in fetchers) updateButton(`fetch-${key}-only`);
						updateButton('link-related');
					});
				}
				function autoLookup(overwrite = false) {
					const button = document.getElementById('dc-search');
					if (button != null && button.progress) return false;
					if (button != null) {
						button.progress = setInterval(function(elem) {
							const phases = '|/-\\';
							let index = /\[(.)\]$/.exec(elem.value);
							index = index != null ? phases.indexOf(index[1]) : -1;
							elem.value = 'Search artist [' + phases[(index + 1) % 4] + ']';
						}, 200, button);
						button.style.color = null;
					}
					searchArtistWorldwide(artist, true).catch(function(reason) {
						if (reason != 'No matches') return Promise.reject(reason);
						return searchArtistWorldwide(artist, true, Array.from(aliases, getAlias)
							.filter(alias => alias && !alias.redirectId && alias.id != mainIdentityId).map(alias => alias.name));
					})/*.then(results => results.length < 0 || consolidateDcRelatives || !results.bestMatch
						|| !results.bestMatch.discogsArtist ? results : getDiscogsEntry('artist', results.bestMatch.discogsArtist.id)
							.then(dcArtist => stripDcRelativesFromResults(results, dcArtist), function(reason) {
						console.warn('[AAM] Stripping relatives from search result failed:', reason);
						return results;
					}))*/.then(function(results) {
						const matchedArtists = getMatchedArtists(results);
						if (matchedArtists.length > 1)
							console.log(`[AAM] Multiple matching results for '${artist.name}':`, matchedArtists);
						else if (matchedArtists.length > 0)
							console.log(`[AAM] Unique matching result for '${artist.name}':`, matchedArtists.bestMatch);
						else console.log(`[AAM] Combined search results for "${artist.name}" (no matched groups):`, results);
						if (button != null) {
							if (button.progress) {
								clearInterval(button.progress);
								delete button.progress;
							}
							button.value = 'Search artist [' + results.length.toString() + ']';
							button.matchedArtists = matchedArtists.length > 0 ?
								matchedArtists.sort((a, b) => b.matchedGroups.length - a.matchedGroups.length) : null;
							let tooltip = '<b>Shift + click</b> for automatic artist lookup and identification';
							if (matchedArtists.length > 1) {
								button.style.color = matchedArtists.uncertain ? isLightTheme ? '#faa' : '#f008' : 'red';
								const menu = new ContextMenu('e5c435fd-edf9-4b25-9305-e90785b5a06b');
								menu.addItem('Add disambiguation info to wiki', elem => addDisambiguationInfo(elem));
								menu.addItem('Add disambiguation info to wiki (force symmetric)', elem => addDisambiguationInfo(elem, true));
								menu.addItem('Add disambiguation info to wiki (force asymmetric)', elem => addDisambiguationInfo(elem, false));
								let threadId;
								switch (document.location.hostname) {
									case 'redacted.sh': threadId = 773; break;
								}
								if (threadId > 0) {
									const forumURL = new URL('forums.php', document.location.origin);
									forumURL.searchParams.set('action', 'search');
									forumURL.searchParams.set('threadid', threadId);
									forumURL.searchParams.set('search', artist.name);
									LocalXHR.get(forumURL).then(function({document}) {
										let noMatch = document.body.querySelector('table.forum_list > tbody > tr > td[colspan="4"]');
										if (noMatch = noMatch != null && noMatch.textContent.trim() == 'Nothing found!') {
											forumURL.searchParams.set('action', 'viewthread');
											forumURL.searchParams.delete('search');
											const postId = GM_getValue('forum_post_id');
											if (postId > 0) {
												forumURL.searchParams.set('postid', postId);
												forumURL.hash = 'post' + postId;
											}
										} else button.threadPosts =
											document.body.querySelectorAll('table.forum_list > tbody > tr[id] > td[colspan="4"]');
										button.forumAction = function() {
											if ('aamArtistsAdded' in localStorage) try {
												var artistAdded = JSON.parse(localStorage.getItem('aamArtistsAdded')).includes(artist.id);
											} catch(e) { console.warn(e) }
											if (noMatch && GM_getValue('forum_post_update') && !artistAdded)
												updateForumPost(threadId, matchedArtists); else GM_openInTab(forumURL.href, false);
										};
										menu.addItem(noMatch ? 'Add artist reference to forum thread'
											: 'Review the forum thread search results', button.forumAction);
									});
								}
								menu.attach(button);
								const maxArtists = 15, collisions = findSearchResultColisions(matchedArtists);
								tooltip = matchedArtists.uncertain ? 'possibly shared ID' : 'Shared ID!';
								tooltip += `<br><br>This artist profile unites at least ${matchedArtists.length} distinct artists`;
								if (matchedArtists.length < 20)
									tooltip += ` (${matchedArtists.map(artist => artist.matchedGroups.length).join('-')})`;
								tooltip += matchedArtists.uncertain ? '<br>(uncertain - need to revised)'
									: '<br>Do not merge with other artists';
								tooltip += '<br><br>' + matchedArtists.slice(0, maxArtists).map(function(matchedArtist, ndx) {
									const hasCollisions = matchedArtist.matchedGroups.some(matchedGroup =>
										matchedArtists.filter(matchedArtist => matchedArtist.matchedGroups.includes(matchedGroup)).length > 1);
									const isDubiousArtist = hasCollisions && matchedArtist.matchedGroups.every(matchedGroup =>
										matchedArtists.filter(matchedArtist => matchedArtist.matchedGroups.includes(matchedGroup)).length > 1);
									let artistRef = getArtistRef(matchedArtist, matchedArtists.bestMatch, isDubiousArtist);
									if (artistRef && hasCollisions) artistRef = `[${ndx + 1}.] ` + artistRef;
									return artistRef;
								}).filter(Boolean).join('<br>');
								if (matchedArtists.length > maxArtists) tooltip += `<br>+${matchedArtists.length - maxArtists} more artist(s)`;
								if (collisions) {
									tooltip += '<br><br>Inconsistency among identified artists found with possibility of false positives.';
									const list = [ ];
									collisions.forEach((groups, indexes) => { list.push(`${indexes[0] + 1} ↔ ${indexes[1] + 1} (${groups.length})`) });
									tooltip += '<br>Results with overlapping release groups: ' + list.join(', ');
									tooltip += '<br>(Details about groups concerned in console log)';
									console.warn('[AAM] Matched groups overlaps among shared profile artists (%s):', artist.name, collisions);
								}
								tooltip += '<br><br><b>Alt + click</b> to update wiki by disambiguation info (<b>Ctrl + Alt</b> to force symmetric)<br><b>Ctrl + click</b> to open/update related forum thread (if exists)<br>' + defTooltip;
							} else if (matchedArtists.length == 1) {
								button.style.color = reliabilityColorValue(matchedArtists.bestMatch.matchedGroups.length,
									Object.keys(artist.torrentgroup).length, isLightTheme ? [0xFFD700, 0x32CD32] : undefined);
								//button.style.color = isLightTheme ? 'lightgreen' : 'green';
								tooltip = `Id is likely homogenoeus (<b>${matchedArtists.bestMatch.matchedGroups.length}</b>/<b>${Object.keys(artist.torrentgroup).length}</b> releases matched)`;
								if (!matchedArtists.bestMatch.discogsArtist)
									tooltip += '<br>The bast match artist has not it\'s counterpart on Discogs, or could not be reliably paired';
								tooltip += '<br><br>' + defTooltip;
							} else {
								if (results.length != 1) button.style.color = 'tan';
								tooltip = 'No matching releases for any of artists found<br><br>' + defTooltip;
							}
							window.tooltipster.then(function() {
								if ($(button).data('plugin_tooltipster'))
									if (tooltip) $(button).tooltipster('update', tooltip).tooltipster('enable')
											.data('plugin_tooltipster').options.interactive = matchedArtists.length > 1;
										else $(button).tooltipster('disable');
								else if (tooltip) $(button).tooltipster({ content: tooltip, delay: 100, interactive: matchedArtists.length > 1 });
							});
						}
						if (matchedArtists.length == 1) {
							if (!matchedArtists.bestMatch.discogsArtist || !matchedArtists.bestMatch.discogsArtist.profile) {
								if (matchedArtists.bestMatch.bpArtist && matchedArtists.bestMatch.bpArtist.bio)
									updateArtistWiki(`[size=3]${bpReflowArtistBio(matchedArtists.bestMatch.bpArtist)}\n\n[url=${matchedArtists.bestMatch.bpArtist.uri}]Beatport[/url][/size]`, 'Wiki update (Beatport)', undefined, 0);
								else if (matchedArtists.bestMatch.amArtist && matchedArtists.bestMatch.amArtist.attributes.artistBio)
									updateArtistWiki(`[size=3]${amGetArtistBio(matchedArtists.bestMatch.amArtist)}\n\n[url=${matchedArtists.bestMatch.amArtist.uri}]Apple Music[/url][/size]`, 'Wiki update (Apple)', undefined, 0);
								else if (matchedArtists.bestMatch.mbArtist && matchedArtists.bestMatch.mbArtist.disambiguation)
									updateArtistWiki(`[size=3]${matchedArtists.bestMatch.mbArtist.disambiguation}\n\n[url=${matchedArtists.bestMatch.mbArtist.uri}]MusicBrainz[/url][/size]`, 'Wiki update (MusicBrainz)', undefined, 0);
								else if (matchedArtists.bestMatch.scUser && matchedArtists.bestMatch.scUser.description)
									updateArtistWiki(`[size=3]${matchedArtists.bestMatch.scUser.description}\n\n[url=${matchedArtists.bestMatch.scUser.permalink_url}]SoundCloud[/url][/size]`, 'Wiki update (SoundCloud)', undefined, 0);
								else if (matchedArtists.bestMatch.neArtist && matchedArtists.bestMatch.neArtist.briefDesc)
									updateArtistWiki(`[size=3]${matchedArtists.bestMatch.neArtist.briefDesc}\n\n[url=${matchedArtists.bestMatch.neArtist.uri}]NetEase[/url][/size]`, 'Wiki update (NetEase)', undefined, 0);
							}
							const imageInput = document.body.querySelector('input[type="text"][name="image"]');
							if (imageInput != null && !imageInput.value) {
								const imageUrl = bpGetArtistImage(matchedArtists.bestMatch.bpArtist)
									|| scGetUserImage(matchedArtists.bestMatch.scUser)
								if (imageUrl) {
									imageInput.value = imageUrl;
									imageHostHelper.then(ihh => { ihh.rehostImageLinks([imageUrl])
										.then(ihh.singleImageGetter).then(imageUrl => { imageInput.value = imageUrl }) });
								}
							}
						}
						if (beeps) beeps[0].play();
						if (!overwrite && dcInput.value.length > 0) return;
						const bestMatch = (matchedArtists.length > 0 ? matchedArtists : results).bestMatch;
						if (!bestMatch.discogsArtist) return;
						dcInput.value = bestMatch.discogsArtist.uri;
						dcInputUpdate();
					}, function(reason) {
						if (button.progress) {
							clearInterval(button.progress);
							delete button.progress;
						}
						button.value = `Search artist [${reason}]`;
					});
				}

				const fetchers = {
					anvs: ['namevariations', 'ANVs'],
					aliases: ['aliases'],
					groups: ['groups'],
					members: ['members'],
				};
				aliasesRoot.append(document.createElement('BR'));
				let elem = document.createElement('H3');
				elem.textContent = 'Import from Discogs';
				aliasesRoot.append(elem);
				elem = document.createElement('DIV');
				elem.className = 'pad';
				const dcForm = document.createElement('FORM');
				dcForm.method = 'dialog';
				dcForm.name = dcForm.className = 'discogs-import';
				const dcInput = document.createElement('INPUT');
				dcInput.type = 'text';
				dcInput.className = 'discogs_link tooltip';
				dcInput.style.width = '25em';
				dcInput.placeholder = 'Artist ID or profile URL';
				dcInput.ondragover = dcInput.onpaste = evt => { evt.currentTarget.value = '' };
				dcInput.oninput = dcInputUpdate;
				window.tooltipster.then(function() {
					$(dcInput).tooltipster({ maxWidth: 640, content: '</>', interactive: true, delay: 1000 }).tooltipster('disable');
				}).catch(reason => { console.warn(reason) });
				dcForm.append(dcInput);
				let button = document.createElement('INPUT');
				button.type = 'button';
				button.id = 'dc-view';
				button.value = 'View';
				button.disabled = true;
				button.onclick = function(evt) {
					let url = getDcArtistId();
					if (url > 0) url = new URL('/artist/' + url.toString(), dcOrigin); else return false;
					// url.searchParams.set('type', 'All');
					// url.searchParams.set('sort', 'year,desc');
					// url.searchParams.set('limit', '500');
					GM_openInTab(url.href, false);
					return true;
				};
				dcForm.append(button);
				button = document.createElement('INPUT');
				button.type = 'button';
				button.id = 'dc-update-wiki';
				button.value = 'Update wiki';
				button.disabled = true;
				button.onclick = function(evt) {
					if (!evt.currentTarget.artist) return false;
					(button = evt.currentTarget).disabled = true;
					const dcLink = dcArtistLink(evt.currentTarget.artist);
					const sites = Array.isArray(evt.currentTarget.artist.urls) && evt.currentTarget.artist.urls.filter(sitesFilter);
					genDcArtistDescriptionBB(evt.currentTarget.artist).then(function(bbCode) {
						console.assert(Boolean(bbCode), 'Assertion failed: Got to make full description with empty bbCode');
						if (sites && sites.length > 0) bbCode += '\n\n' + sites.map(dcUrlToBB).join('\n');
						if (updateArtistWiki('[size=3]' + bbCode + '\n\n[/size]' + dcLink, 'Wiki update (adopted from Discogs)')) {
							button.style.backgroundColor = 'green';
							setTimeout(() => { button.style.backgroundColor = null }, 1000);
						}
						button.disabled = false;
					}, function(reason) {
						if (sites && sites.length > 0)
							updateArtistWiki('[size=3]' + sites + '\n\n[/size]' + dcLink, 'Wiki update (external links)');
						else updateArtistWiki(dcLink, 'Wiki update (Discogs link)');
						button.disabled = false;
					});
					if (Array.isArray(evt.currentTarget.artist.images)
							&& evt.currentTarget.artist.images.length > 0) {
						const image = document.body.querySelector('input[type="text"][name="image"]');
						if (image != null && !image.value) {
							image.value = evt.currentTarget.artist.images[0].uri;
							imageHostHelper.then(ihh => { ihh.rehostImageLinks([evt.currentTarget.artist.images[0].uri])
								.then(ihh.singleImageGetter).then(imageUrl => { image.value = imageUrl }) });
						}
					}
				};
				button.updateStatus = function(artist) {
					if (artist) {
						this.artist = artist;
						const hasPhoto = Array.isArray(artist.images) && artist.images.length > 0,
									hasMembers = Array.isArray(artist.members)
										&& artist.members.filter(artist => artist.active).length > 0,
									hasGroups = Array.isArray(artist.groups)
										&& artist.groups.filter(group => group.active).length > 0,
									hasRealName = artist.realname && artist.realname.trim().toLowerCase() != dcNameNormalizer(artist.name).toLowerCase(),
									hasXtrnLinks = Array.isArray(artist.urls) && artist.urls.filter(sitesFilter).length > 0,
									body = document.getElementById('body'),
									image = document.body.querySelector('input[type="text"][name="image"]');
						let tooltip = `Image: ${hasPhoto ? '<b>yes</b>' : 'no'}<br>Real name: ${hasRealName ? '<b>yes</b>' : 'no'}<br>Profile info: ${!artist.profile ? 'no' : '<b>' + (artist.profile.length > 800 ? 'long' : artist.profile.length > 400 ? 'moderate' : 'short') + '</b>'}<br>Active members: ${hasMembers ? '<b>yes</b>' : 'no'}<br>Active in groups: ${hasGroups ? '<b>yes</b>' : 'no'}<br>External links: ${hasXtrnLinks ? '<b>yes</b>' : 'no'}<br><br>Image set: ${image != null && /^https?:\/\//.test(image.value) ? 'yes' : '<b>no</b>'}<br>Wiki set: ${body != null && body.value.length > 0 ? 'yes' : '<b>no</b>'}`;
						setTooltip(this, tooltip);
						button.style.color = artist.profile && body != null && body.value.length <= 0 ?
							/*isDarkTheme ? '#4f4' : */'#cfc' : null;
						this.disabled = false;
					} else {
						window.tooltipster.then(() => { if ($(this).data('plugin_tooltipster')) $(this).tooltipster('disable') });
						button.style.color = null;
						this.disabled = true;
						if ('artist' in this) delete this.artist;
					}
				};
				dcForm.append(button);
				const defTooltip = '<b>Shift + click</b> for automatic artist lookup and identification (may cause longer hiccups for large discographies)';
				button = document.createElement('INPUT');
				button.type = 'button';
				button.id = 'dc-search';
				button.value = 'Search artist';
				button.onclick = function(evt) {
					if (evt.shiftKey && !evt.altKey && !evt.ctrlKey) autoLookup(true);
					if (evt.altKey && !evt.shiftKey && evt.currentTarget.matchedArtists
							&& evt.currentTarget.matchedArtists.length > 1)
						addDisambiguationInfo(evt.currentTarget, evt.ctrlKey ? true : undefined);
					if (evt.ctrlKey && !evt.altKey && !evt.shiftKey && typeof evt.currentTarget.forumAction == 'function')
						evt.currentTarget.forumAction();
					if (!evt.shiftKey && !evt.altKey && !evt.ctrlKey) GM_openInTab(dcOrigin + '/search/?' + new URLSearchParams({
						q: artist.name,
						type: 'artist',
						layout: 'med',
					}).toString(), false);
				};
				dcForm.append(button);
				dcForm.append(document.createElement('BR'));
				addFetchButton('everything');
				for (let key in fetchers) addFetchButton((fetchers[key][1] || fetchers[key][0]) + ' only', key + '-only');
				button = document.createElement('INPUT');
				button.type = 'button';
				button.id = 'link-related';
				button.value = button.dataset.caption = 'Link related';
				button.style = 'display: none; margin-left: 1em;';
				button.onclick = linkRelatives;
				const tooltip = `Make similar to all aliases/members/groups with matched releases\n\nCTRL + click: include name variants\nALT + click: only active (applies to groups and members)`;
				setTooltip(button, tooltip);
				dcForm.append(button);
				elem.append(dcForm);
				aliasesRoot.append(elem);

				if ((function() {
					let maxGroups = GM_getValue('auto_artist_lookup', 0);
					if (maxGroups && typeof maxGroups != 'number') maxGroups = parseInt(maxGroups) || 500;
					if (!(maxGroups > 0)) return false;
					if (!Array.isArray(artist.torrentgroup) || artist.torrentgroup.length <= 0) return true;
					return artist.torrentgroup.length <= maxGroups;
				})()) autoLookup(); else window.tooltipster.then(function() {
					$('#dc-search').tooltipster({ delay: 100, content: defTooltip });
				});
			}

			if (!isPseudoArtist(artist.name) && !rxGenericName.test(artist.name)) addDiscogsImport();
		} else {
			function isOutside(target, related) {
				while (related instanceof HTMLElement) if (related == target) return false; else related = related.parentNode;
				return true;
			}

			const selBase = 'div#discog_table > table > tbody > tr.group > td:first-of-type';
			const selCheckboxes = selBase + ' input[type="checkbox"][name="replace-artist"]';
			let elem;
			for (let tr of document.body.querySelectorAll(['edition', 'torrent_row']
				.map(cls => 'div#discog_table > table > tbody > tr.' + cls).join(', '))) tr.remove();
			for (let td of document.body.querySelectorAll(selBase)) {
				while (td.firstChild != null) td.removeChild(td.firstChild);
				const label = document.createElement('LABEL');
				label.style = 'padding: 7pt; cursor: pointer; opacity: 1; transition: 0.25s;';
				label.onclick = evt => { evt.stopImmediatePropagation() };
				elem = document.createElement('INPUT');
				elem.type = 'checkbox';
				elem.name = 'replace-artist';
				elem.style.cursor = 'pointer';
				elem.onchange = function(evt) {
					evt.currentTarget.parentNode.parentNode.parentNode.style.opacity = evt.currentTarget.checked ? 1 : 0.75;
					if (evt.currentTarget.checked) ++counter.textContent; else --counter.textContent;
				};
				label.onmouseenter = label.onmouseleave = function(evt) {
					if (evt.relatedTarget == evt.currentTarget) return false;
					evt.currentTarget.style.backgroundColor = evt.type == 'mouseenter' ? 'orange' : null;
				};
				label.append(elem);
				td.append(label);
				td.parentNode.style.opacity = 0.75;
				td.parentNode.style.cursor = 'pointer';
				td.parentNode.onclick = function(evt) {
					const checkBox = evt.currentTarget.querySelector('input[type="checkbox"][name="replace-artist"]');
					if (checkBox != null) checkBox.click(); else throw 'Assertion failed: checkbox not found';
				};
			}
			for (let td of document.body.querySelectorAll('div#discog_table > table > tbody > tr.colhead_dark > td.small')) {
				const label = document.createElement('LABEL');
				label.style = 'padding: 1pt 5pt; cursor: pointer; transition: 0.25s;';
				elem = document.createElement('INPUT');
				elem.type = 'checkbox';
				elem.name = 'select-category';
				elem.style.cursor = 'pointer';
				elem.onchange = function(evt) {
					for (let input of evt.currentTarget.parentNode.parentNode.parentNode.parentNode
							 .querySelectorAll('tr.group > td:first-of-type input[type="checkbox"][name="replace-artist"]')) {
						if (input.checked == evt.currentTarget.checked
								|| input.parentNode.parentNode.parentNode.offsetWidth <= 0) continue;
						input.checked = evt.currentTarget.checked;
						input.dispatchEvent(new Event('change'));
					}
				};
				label.onmouseenter = label.onmouseleave = function(evt) {
					if (evt.relatedTarget == evt.currentTarget) return false;
					evt.currentTarget.style.backgroundColor = evt.type == 'mouseenter' ? 'orange' : null;
				};
				label.append(elem);
				td.append(label);
			}

			function replacer(evt) {
				if (input.value.trim().length <= 0) return false;
				let selectedGroups = document.body.querySelectorAll(selCheckboxes + ':checked');
				if (selectedGroups.length > 0) selectedGroups = Array.prototype.map.call(selectedGroups, function(elem) {
					elem = elem.parentNode.parentNode.parentNode.querySelector('div.group_info > strong > a:last-of-type');
					if (elem instanceof HTMLAnchorElement && elem.pathname == '/torrents.php')
						return parseInt(new URLSearchParams(elem.search).get('id'));
					console.warn('[AAM] Row elements not torrent group link:', elem);
					return false;
				}).filter(uniqueValuesFilter); else return false;
				const torrentGroups = { };
				for (let torrentGroup of artist.torrentgroup) {
					if (!selectedGroups.includes(torrentGroup.groupId)) continue;
					console.assert(!(torrentGroup.groupId in torrentGroups));
					if (torrentGroup.extendedArtists) {
						const importances = Object.keys(torrentGroup.extendedArtists)
							.filter(importance => Array.isArray(torrentGroup.extendedArtists[importance])
								&& torrentGroup.extendedArtists[importance].some(_artist => _artist.id == artist.id))
							.map(key => parseInt(key)).filter(uniqueValuesFilter);
						console.assert(importances.length > 0);
						if (importances.length > 0) torrentGroups[torrentGroup.groupId] = torrentGroup.groupId in torrentGroups ?
							torrentGroups[torrentGroup.groupId].concat(importances).filter(uniqueValuesFilter) : importances;
					} else if (!artistlessGroups.has(torrentGroup.groupId)) {
						console.warn(`Warning: artistless group "${torrentGroup.groupName}" found; if any script's operation fails, add some artists first`,
							document.location.origin + '/torrents.php?id=' + torrentGroup.groupId.toString());
						// GM_openInTab('https://redacted.sh/torrents.php?id=' + torrentGroup.groupId.toString(), true);
						artistlessGroups.add(torrentGroup.groupId);
					}
				}
				const groupIds = Object.keys(torrentGroups).map(key => parseInt(key));
				if (groupIds.length <= 0) throw 'Assertion failed: none of selected releases include this artist';
				let newArtist = /^(\d+)$/.test(input.value) && parseInt(input.value);
				if (!(typeof newArtist == 'number' && newArtist > 0) && /^https?:\/\//i.test(newArtist = input.value.trim())) try {
					let url = new URL(newArtist);
					if (url.origin == document.location.origin && url.pathname == '/artist.php') {
						let id = parseInt(url.searchParams.get('id'));
						if (id > 0 || (id = url.searchParams.get('artistname'))) newArtist = id;
					}
				} catch(e) { }
				const button = evt.currentTarget;
				getSiteArtist(newArtist).catch(reason => null).then(function(targetArtist) {
					//if (targetArtist.id == artist.id) return Promise.reject('Replacing by same artist');
					if (typeof newArtist == 'number') if (targetArtist != null) newArtist = targetArtist.name;
						else return Promise.reject(`Artist ID ${newArtist} doesn\'t exist`);
					let nagText = `
You're going to replace all instances of ${artist.name}
in ${groupIds.length} releases by identity "${newArtist}" (${targetArtist != null ? targetArtist.id : 'not on site'})`;
					if (!confirm(nagText)) return Promise.resolve('Cancelled');
					button.disabled = true;
					button.style.color = 'red';
					button.value = '[ processing... ]';
					button.title = 'Don\'t break the operation, navigate away, reload or close current page';
					const changeArtistInGroupId = groupId => deleteArtistFromGroup(groupId, artist.id, torrentGroups[groupId])
						.then(() => addAliasToGroup(groupId, newArtist, torrentGroups[groupId]));
					const changeArtistInGroupIndex = (index = 0) => index >= 0 && index < groupIds.length ?
						changeArtistInGroupId(groupIds[index]).then(() => changeArtistInGroupIndex(index + 1))
							: Promise.resolve('Completed (serial)');

					return (groupIds.length < 2 ? changeArtistInGroupId(groupIds[0]) : groupIds.length > maxBatchSize ?
						changeArtistInGroupIndex() : changeArtistInGroupId(groupIds[0]).then(wait).then(() =>
							Promise.all(groupIds.slice(1).map(changeArtistInGroupId))).then(() => 'Completed (parallel)', function(reason) {
						alert(reason);
						return changeArtistInGroupIndex();
					})).then(result => resolveArtistId(targetArtist ? targetArtist.id : newArtist).then(function(newArtistId) {
						if (groupIds.length < rlsCount(artist)) {
							if (newArtistId != artist.id)
								GM_openInTab(document.location.origin + '/artist.php?id=' + newArtistId.toString(), false);
							document.location.reload();
						} else if (newArtistId != artist.id) gotoArtistPage(newArtistId); else document.location.reload();
					}));
				}).catch(function(reason) {
					button.removeAttribute('title');
					button.value = button.dataset.caption;
					button.style.color = null;
					button.disabled = false;
					alert(reason);
				});
			}

			function visualizeResult(statusOK) {
				if (!(this instanceof HTMLElement)) return 0; // assertion failed
				this.style.color = statusOK ? 'green' : 'red';
				this.style.fontWeight = 'bold';
				this.disabled = false;
				return setTimeout(function(elem) {
					elem.style.fontWeight = null;
					elem.style.color = null;
				}, 2000, this);
			}

			function select(state, testFunc) {
				for (let input of document.body.querySelectorAll(selCheckboxes)) {
					if (input.checked == state || input.parentNode.parentNode.parentNode.offsetWidth <= 0) continue;
					if (typeof testFunc == 'function') {
						let groupInfo = input.parentNode.parentNode.parentNode.querySelector('div.group_info');
						if (groupInfo != null) groupInfo = {
							id: groupInfo.querySelector(':scope > strong > a:last-of-type'),
							year: groupInfo.querySelector(':scope > strong'),
							tags: Array.prototype.map.call(groupInfo.querySelectorAll('div.tags > a'), a => a.textContent.trim()),
						}; else { // assertion failed
							console.warn('Assertion failed: group info not found (', input.parentNode.parentNode.parentNode, ')');
							continue;
						}
						if (groupInfo.id != null && groupInfo.year != null) {
							groupInfo.titleNorm = titleCmpNorm(groupInfo.title = groupInfo.id.textContent.trim());
							groupInfo.titleCaseless = stripRlsSuffix(groupInfo.title).toLowerCase();
							groupInfo.titleNonLatinNorm = nonLatinCmpNorm(groupInfo.title);
							groupInfo.id = new URLSearchParams(groupInfo.id.search);
							if (!((groupInfo.id = parseInt(groupInfo.id.get('id'))) > 0)) continue; // assertion failed
							if ((groupInfo.year = /\b(\d{4})\b/.exec(groupInfo.year.firstChild.textContent)) == null) continue; // assertyion failed
							if (!((groupInfo.year = parseInt(groupInfo.year[1])) > 0)) continue; // assertyion failed
						} else continue; // assertion failed
						if (Array.isArray(artist.torrentgroup)) {
							groupInfo = Object.assign(artist.torrentgroup.filter(torrentGroup => torrentGroup.groupId == groupInfo.id), groupInfo);
							console.assert(groupInfo.length > 0, `Torrent group id ${groupInfo.id} not found in API data`);
						}
						if (!testFunc(groupInfo)) continue;
					}
					input.checked = typeof state == 'boolean' ? state : !input.checked;
					input.dispatchEvent(new Event('change'));
				}
			}

			const selectAll = state => select(state);
			function selectByGroupIds(state, elem) {
				let groupIds = prompt('Enter torrent group link(s) or id(s) separated by comma or whitespace\n\n');
				if (!groupIds) return; else if ((groupIds = groupIds.split(/[\s\,\;]+/).map(function(expr) {
					let groupId = parseInt(expr);
					if (groupId > 0) return groupId; else try {
						if ((groupId = new URL(expr)).hostname == document.location.hostname && groupId.pathname == '/torrents.php'
								&& (groupId = parseInt(groupId.searchParams.get('id'))) > 0) return groupId;
					} catch(e) { }
				}).filter(Boolean)).length > 0) select(state, groupInfo => groupIds.includes(groupInfo.id));
				visualizeResult.call(elem, groupIds.length > 0);
			}
			function selectByArtists(state, elem) {
				let artists = prompt(`Enter site artist/alias name(s), artist id(s) or profile link(s) separated by comma
All releases with their appearance will be matched
(if provided multiple artists, only releases with everyone's appearance within same role will be matched; to select releases matching any of multiple artists, execute the selector multiple times for each of them)

Note: if literal name is used for an artist unifying more identities, only matching alias will be matched
To match any instance of multi-identity artist, use artist id instead

`);
				if (!artists) return; else if (elem instanceof HTMLElement) {
					elem.disabled = true;
					elem.style.color = 'orange';
				}
				Promise.all(artists.split(/(?:\r?\n|[\,\;])+/).map(function(expr) {
					if (!expr || !expr.trim()) return Promise.reject('void');
					let artistId = /^\d+$/.test(expr) && parseInt(expr);
					if (artistId > 0) return getSiteArtist(artistId).then(artist => artist.id);
					if (/^https?:\/\//i.test(expr = expr.trim())) try {
						const url = new URL(expr);
						if (url.hostname == document.location.hostname && url.pathname == '/artist.php'
								&& ((artistId = parseInt(url.searchParams.get('id'))) > 0
								|| (artistId = url.searchParams.get('artistname'))))
							return getSiteArtist(artistId).then(artist => artist.id);
					} catch(e) { }
					return getSiteArtist(expr).then(artist => resolveAliasId(expr, artist.id, true).then(aliasId => ({
						artistId: artist.id,
						aliasId: aliasId,
					}), function(reason) {
						alert(`Alias "${expr}" not found at artist ${artist.id}, matching any artist's name variant (${reason})`);
						return artist.id;
					}));
				}).map(promise => promise.catch(reason => null))).then(function(infos) {
					if ((infos = infos.filter(Boolean)).length > 0) select(state, groupInfo => groupInfo.length > 0
							&& groupInfo.some(torrentGroup => torrentGroup.extendedArtists
								&& Object.keys(torrentGroup.extendedArtists).some(importance =>
									Array.isArray(torrentGroup.extendedArtists[importance]) && infos.every(info =>
										torrentGroup.extendedArtists[importance].some(groupArtist => { switch (typeof info) {
						case 'number': return groupArtist.id == info;
						case 'object': return groupArtist.id == info.artistId && groupArtist.aliasid == info.aliasId;
						default: return false;
					} })))));
					visualizeResult.call(elem, infos.length > 0);
				});
			}
			function selectByTags(state) {
				let tags = prompt('Enter gazelle tags(s) or list of genres separated by comma; all tags will be matched (AND); to select groups with any of list of tags (OR), repeat the selector more times; use !<tag> as NOT operator\n\n');
				if (tags && (tags = tags.trim())) tags = tags.split(/(?:[\,\;\|]|\r?\n)+/).map(tag => tag.trim()); else return;
				let negativeTags = new TagManager(...tags.filter(tag => tag.startsWith('!')).map(tag => tag.slice(1)));
				tags = new TagManager(...tags.filter(tag => !tag.startsWith('!')));
				if (tags.length + negativeTags.length <= 0) visualizeResult.call(elem, false);
				select(state, groupInfo => tags.every(tag => groupInfo.tags.includes(tag))
					&& !negativeTags.some(tag => groupInfo.tags.includes(tag)));
				visualizeResult.call(elem, true);
			}

			function selectByDiscogs(state, elem) {
				let dcInput = prompt('Enter Discogs artist id or URL; site releases found in artist\'s Discogs releases will be matched\n\n');
				if (!dcInput) return;
				let artistId = dcEntryIdXtractor.exec(dcInput);
				if ((artistId == null || artistId[1].toLowerCase() != 'artist' || !((artistId = parseInt(artistId[2])) > 0))
						&& !(/^\d+$/.test(dcInput) && (artistId = parseInt(dcInput)) > 0)) return visualizeResult.call(elem, false);
				if (elem instanceof HTMLElement) {
					elem.disabled = true;
					elem.style.color = 'orange';
				}
				// getDiscogsMatches(artistId, artist.torrentgroup).then(function(groupIds) {
				// 	if (groupIds != null) select(state, groupInfo => groupIds.includes(groupInfo.id));
				// }).catch(alert).then(function(statusOK) {
				getDiscogsArtistReleases(artistId).then(function(releases) {
					if (releases.length <= 0) return false;
					const dcMasterLookups = new DiscogsMasterLookups;
					select(state, groupInfo => releases.some(function(release) {
						if (release.year < groupInfo.year) return false;
						const isMaster = release.type == 'master';
						const rlsYearMatch = release.year >= groupInfo.year || !strictRlsYearMatching && !release.year;
						const titles = [release.title, release.trackinfo].filter(uniqueValuesFilter);
						const strictTitleMatch = titles.some(title => titleCmpNorm(title) == groupInfo.titleNorm
							|| bilingualNamesMatch(groupInfo.title, title));
						if (isMaster && !dcUnresolvedMasters.has(release.id)
								&& (!dcMasterYears.has(release.id) || !dcMasterTitles.has(release.id))
								&& !dcCanVaryYear(release, releases.length) && !dcCanVaryTitle(release, releases.length))
							dcUnresolvedMasters.add(release.id);
						if (rlsYearMatch && (!isMaster || dcUnresolvedMasters.has(release.id)) && (strictTitleMatch
								|| strongEqualReleaseDate && release.year == groupInfo.year
								&& titles.some(title => fuzzyTitlesMatch(stripRlsSuffix(title).toLowerCase(), groupInfo.titleCaseless))))
							return true;
						if (isMaster) if (dcMasterYears.has(release.id) && dcMasterTitles.has(release.id)) {
							const masterYear = dcMasterYears.get(release.id);
							if (masterYear ? masterYear != groupInfo.year : !rlsYearMatch) return false;
							if (strictTitleMatch) return true;
							const masterTitle = dcMasterTitles.get(release.id);
							if (masterTitle && (titleCmpNorm(masterTitle) == groupInfo.titleNorm
									|| bilingualNamesMatch(groupInfo.title, masterTitle))) return true;
							return (masterYear > 0 || strongEqualReleaseDate && release.year == groupInfo.year)
								&& titles.concat(masterTitle).filter(uniqueValuesFilter)
									.some(title => fuzzyTitlesMatch(stripRlsSuffix(title).toLowerCase(), groupInfo.titleCaseless));
						} else if (dcCanVaryYear(release, releases.length) || dcCanVaryTitle(release, releases.length))
							dcMasterLookups.add(release.id);
						return false;
					}));
					if (dcUnresolvedMasters.size > 0) saveSessionCache('dcUnresolvedMasters', Array.from(dcUnresolvedMasters));
					if (dcMasterLookups.isEmpty) return true;
					console.info('[AAM]', dcMasterLookups.size, 'master release(s) to lookup on Discogs (', artistId, releases.length, ')');
					return dcMasterLookups.execute(artistId).then(function(total) {
						if (total > 0) select(state, groupInfo => releases.some(function(release) {
							if (release.type != 'master' || !dcMasterLookups.has(release.id)) return false;
							const masterYear = dcMasterYears.get(release.id);
							if (masterYear ? masterYear != groupInfo.year : !(release.year >= groupInfo.year)
									&& (strictRlsYearMatching || release.year)) return false;
							const titles = [release.title, release.trackinfo, dcMasterTitles.get(release.id)].filter(uniqueValuesFilter);
							if (titles.some(title => titleCmpNorm(title) == groupInfo.titleNorm
								|| bilingualNamesMatch(groupInfo.title, title))) return true;
							if (!(masterYear > 0) && (!strongEqualReleaseDate || release.year != groupInfo.year)) return false;
							return titles.some(title => fuzzyTitlesMatch(stripRlsSuffix(title).toLowerCase(), groupInfo.titleCaseless));
						}));
						return true;
					});
				}).catch(alert).then(visualizeResult.bind(elem));
			}
			function selectByMusicBrainz(state, elem) {
				let mbInput = prompt('Enter MusicBrainz artist id or URL; site releases found in artist\'s releases will be matched\n\n');
				if (!mbInput || !(mbInput = mbInput.trim())) return;
				let artistId = /\b([a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12})\b/i.exec(mbInput);
				if (artistId != null) artistId = artistId[1]; else return visualizeResult.call(elem, false);
				if (elem instanceof HTMLElement) {
					elem.disabled = true;
					elem.style.color = 'orange';
				}
				// mbGetArtistMatches(artistId, artist.torrentgroup).then(function(groupIds) {
				// 	if (groupIds != null && groupIds.length > 0) select(state, groupInfo => groupIds.includes(groupInfo.id));
				// 	return true;
				// }).catch(alert).then(function(statusOK) {
				mbGetArtistDiscography(artistId).then(function(results) {
					if (!Array.isArray(results) || results.length <= 0) return false;
					select(state, groupInfo => results.some(function(result) {
						const dateMatch = mbDateMatch(result, groupInfo.year);
						if (dateMatch < 0) return false;
						let rlsTypeMatch = groupInfo.length > 0 && groupInfo
							.find(torrentGroup => torrentGroup.releaseType > 0 && torrentGroup.releaseType < 1000);
						rlsTypeMatch = rlsTypeMatch ? mbRlsTypeMatch(result, rlsTypeMatch.releaseType) : 0;
						if (rlsTypeMatch < 0) return false;
						if (titleCmpNorm(result.title) == groupInfo.titleNorm
								|| bilingualNamesMatch(groupInfo.title, result.title)) return true;
						if (dateMatch < 1 || dateMatch < 2 && rlsTypeMatch < 1) return false;
						return fuzzyTitlesMatch(stripRlsSuffix(result.title).toLowerCase(), groupInfo.titleCaseless);
					}));
					return true;
				}).catch(alert).then(visualizeResult.bind(elem));
			}
			function selectByApple(state, elem) {
				let amInput = prompt('Enter Apple artist id or URL; site releases found in artist\'s releases will be matched\n\n');
				if (!amInput || !(amInput = amInput.trim())) return;
				let artistId = /^\d+$/.test(amInput) && parseInt(amInput);
				if (!artistId) {
					artistId = /\/artist(?:\/.+?)*\/(\d+)\b/i.exec(amInput.trim());
					if (artistId == null || !(artistId = parseInt(artistId[1]))) return visualizeResult.call(elem, false);
				}
				if (elem instanceof HTMLElement) {
					elem.disabled = true;
					elem.style.color = 'orange';
				}
				// amGetArtistMatches(artistId, artist.torrentgroup).then(function(groupIds) {
				// 	if (groupIds != null && groupIds.length > 0) select(state, groupInfo => groupIds.includes(groupInfo.id));
				// 	return true;
				// }).catch(alert).then(function(statusOK) {
				amGetArtistAlbums(artistId).then(function(albums) {
					if (albums.length > 0) select(state, groupInfo => albums.some(function(album) {
						const releaseDate = album.attributes.releaseDate ? new Date(album.attributes.releaseDate) : undefined;
						if (releaseDate ? !(releaseDate.getUTCFullYear() >= groupInfo.year)
								: strictRlsYearMatching || releaseDate != undefined) return false;
						if (titleCmpNorm(album.attributes.name) == groupInfo.titleNorm
								|| bilingualNamesMatch(groupInfo.title, album.attributes.name)) return true;
						if (!releaseDate) return false;
						if ((!strongEqualReleaseDate || releaseDate.getUTCFullYear() != groupInfo.year) && !amRlsTypeMatch(album, (function() {
							const releaseType = groupInfo.length > 0 && groupInfo.find(torrentGroup =>
								torrentGroup.releaseType > 0 && torrentGroup.releaseType < 1000);
							return releaseType && releaseType.releaseType;
						})())) return false;
						return fuzzyTitlesMatch(stripRlsSuffix(album.attributes.name).toLowerCase(), groupInfo.titleCaseless);
					})); else return false;
					return true;
				}).catch(alert).then(visualizeResult.bind(elem));
			}
			function selectByBeatport(state, elem) {
				let bpInput = prompt('Enter Beatport artist id or URL; site releases found in artist\'s releases will be matched\n\n');
				if (!bpInput || !(bpInput = bpInput.trim())) return;
				let artistId = /^\d+$/.test(bpInput) && parseInt(bpInput);
				if (!artistId) { // https://www.beatport.com/artist/razmik-makhsudyan/484262/releases
					artistId = /\/artist(?:\/.+?)*\/(\d+)\b/i.exec(bpInput.trim());
					if (artistId == null || !(artistId = parseInt(artistId[1]))) return visualizeResult.call(elem, false);
				}
				if (elem instanceof HTMLElement) {
					elem.disabled = true;
					elem.style.color = 'orange';
				}
				// bpGetArtistMatches(artistId, artist.torrentgroup).then(function(groupIds) {
				// 	if (groupIds != null && groupIds.length > 0) select(state, groupInfo => groupIds.includes(groupInfo.id));
				// 	return true;
				// }).catch(alert).then(function(statusOK) {
				bpGetArtistReleases(artistId).then(function(releases) {
					if (releases.length > 0) select(state, groupInfo => releases.some(function(release) {
						const newReleaseDate = release.new_release_date ? new Date(release.new_release_date) : undefined,
									publishDate = release.publish_date ? new Date(release.publish_date) : undefined;
						if (newReleaseDate ? !(newReleaseDate.getUTCFullYear() >= groupInfo.year)
								: strictRlsYearMatching || newReleaseDate != undefined) return false;
						if (titleCmpNorm(release.name) == groupInfo.titleNorm
								|| bilingualNamesMatch(groupInfo.title, release.name)) return true;
						if (!newReleaseDate || newReleaseDate.getUTCFullYear() != groupInfo.year) return false;
						if (strongEqualReleaseDate && fuzzyTitlesMatch(stripRlsSuffix(release.name).toLowerCase(), titleNorm[1])) return true;
						return false;
					})); else return false;
					return true;
				}).catch(alert).then(visualizeResult.bind(elem));
			}

			const form = document.getElementById('artist-replacer');
			if (form == null) throw 'Assertion failed: form cannot be found';
			let div = document.createElement('DIV');
			div.className = 'selecting';
			div.style.padding = '0 5pt 5pt 5pt';

			function addQS(caption, clickHandler, state, title) {
				if (!caption || typeof clickHandler != 'function') return;
				elem = document.createElement('A');
				elem.className = 'brackets'
				if (div.childElementCount > 0) elem.style.marginLeft = '6pt';
				elem.textContent = caption + (state == true ? '+' : state == false ? '-' : '*');
				elem.title = title || (state == true ? 'Selects matched releases'
					: state == false ? 'Unselects matched releases' : 'Inverts selection on matched releases');
				elem.href = '#';
				elem.onclick = function(evt) {
					try { clickHandler(state, evt.currentTarget) } catch(e) { alert(e) };
					return false;
				};
				div.append(elem);
			}

			addQS('All', selectAll, true, 'Select all');
			addQS('All', selectAll, false, 'Unselect all');
			addQS('All', selectAll, undefined, 'Invert selection');
			addQS('Tags', selectByTags, true, 'Select groups matching tag(s)');
			addQS('Tags', selectByTags, false, 'Unselect groups matching tag(s)');
			addQS('Artists', selectByArtists, true, 'Select groups with site artist(s) appearance');
			addQS('Artists', selectByArtists, false, 'Unselect groups with site artist(s) appearance');
			addQS('GroupIds', selectByGroupIds, true, 'Select by group id(s)');
			addQS('GroupIds', selectByGroupIds, false, 'Unselect by group id(s)');

			addQS('Discogs', selectByDiscogs, true, 'Select matching artist\'s releases at Discogs');
			addQS('Discogs', selectByDiscogs, false, 'Unselect matching artist\'s releases at Discogs');
			addQS('MB', selectByMusicBrainz, true, 'Select matching artist\'s releases at MusicBrainz');
			addQS('MB', selectByMusicBrainz, false, 'Unselect matching artist\'s releases at MusicBrainz');
			addQS('AM', selectByApple, true, 'Select matching artist\'s releases at Apple Music');
			addQS('AM', selectByApple, false, 'Unselect matching artist\'s releases at Apple Music');
			addQS('BP', selectByBeatport, true, 'Select matching artist\'s releases at Beatport');
			addQS('BP', selectByBeatport, false, 'Unselect matching artist\'s releases at Beatport');
			form.append(div);

			const input = document.createElement('INPUT');
			input.type = 'text';
			input.placeholder = 'New artist/alias name or artist id';
			input.style.width = '94%';
			input.dataset.gazelleAutocomplete = true;
			input.autocomplete = 'off';
			input.spellcheck = false;
			try { $(input).autocomplete({ serviceUrl: 'artist.php?action=autocomplete' }) } catch(e) { console.error(e) }
			form.append(input);
			form.append(document.createElement('BR'));
			elem = document.createElement('INPUT');
			elem.type = 'button';
			elem.style = 'min-width: 6em; text-align: center;';
			elem.value = elem.dataset.caption = 'GO';
			elem.onclick = replacer;
			form.append(elem);
			elem = document.createElement('SPAN');
			elem.class = 'totals';
			elem.style = 'float: right; margin: 2pt 6pt 0px 0px; font: 13pt "Segoe UI", sans-serif;';
			const counter = document.createElement('SPAN');
			counter.id = 'selection-counter';
			counter.textContent = 0;
			elem.append(counter, ' / ' + document.body.querySelectorAll(selBase).length.toString());
			form.append(elem);
		}
	});
}

if (artistEdit) {
	if (!window.tooltipster) window.tooltipster = typeof jQuery.fn.tooltipster == 'function' ?
			Promise.resolve(jQuery.fn.tooltipster) : new Promise(function(resolve, reject) {
		const script = document.createElement('SCRIPT');
		script.src = '/static/functions/tooltipster.js';
		script.type = 'text/javascript';
		script.onload = function(evt) {
			console.log('tooltipster.js was successfully loaded', evt);
			if (typeof jQuery.fn.tooltipster == 'function') resolve(jQuery.fn.tooltipster);
				else reject('tooltipster.js loaded but core function was not found');
		};
		script.onerror = evt => { reject('Error loading tooltipster.js') };
		document.head.append(script);
		['style.css'/*, 'custom.css', 'reset.css'*/].forEach(function(css) {
			const link = document.createElement('LINK');
			link.rel = 'stylesheet';
			link.type = 'text/css';
			link.href = '/static/styles/tooltipster/' + css;
			//link.onload = evt => { console.log('style.css was successfully loaded', evt) };
			link.onerror = evt => { (css == 'style.css' ? reject : console.warn)('Error loading ' + css) };
			document.head.append(link);
		});
	});
	loadArtist();
} else {
	function copyGroupIds(root = document.body) {
		if (!(root instanceof HTMLElement)) return; // assertion failed
		const groupIds = Array.prototype.map.call(root.querySelectorAll('tbody > tr.group div.group_info > strong > a:last-of-type'), function(a) {
			if (a.parentNode.parentNode.parentNode.parentNode.offsetWidth <= 0) return false;
			a = new URLSearchParams(a.search);
			return parseInt(a.get('id'));
		}).filter((e, n, a) => e > 0 && a.indexOf(e) == n);
		if (groupIds.length > 0) GM_setClipboard(groupIds.join('\n'), 'text');
	}

	const hdr = document.body.querySelector('div#content div.header > h2');
	if (hdr != null) {
		hdr.style.cursor = 'pointer';
		hdr.onclick = evt => (copyGroupIds(document.getElementById('discog_table')), false);
	}
	for (let strong of document.body.querySelectorAll('table > tbody > tr.colhead_dark > td > strong')) {
		strong.style.cursor = 'pointer';
		strong.onclick = evt => (copyGroupIds(evt.currentTarget.parentNode.parentNode.parentNode.parentNode), false);
	}

	const sidebar = document.body.querySelector('div#content div.sidebar');
	if (sidebar == null) throw 'Assertion failed: sidebar couldnot be located';
	const elems = createElements('DIV', 'FORM', 'P', 'B', 'INPUT');
	elems[0].className = 'box box_artist_replacer';
	elems[0].innerHTML = '<div class="head"><strong>Artist replacer</strong></div>';
	elems[1].id = 'artist-replacer';
	elems[1].method = 'dialog';
	elems[1].style.padding = '6pt';
	elems[2].append('This tool replaces all instances of ');
	const header = document.body.querySelector('div#content div.header > h2');
	if (header != null) {
		elems[3].textContent = header.textContent.trim();
		elems[2].append(elems[3]);
	} else elems[2].append('artist');
	elems[2].append(' in selected releases with different name/alias, whatever existing or new.');
	elems[2].style = 'margin-bottom: 1em; font-size: 9pt;';
	elems[1].append(elems[2]);
	elems[4].type = 'button';
	elems[4].value = 'Enter selection mode';
	elems[4].onclick = function(evt) {
		const form = evt.currentTarget.form;
		while (form.lastChild != null) form.removeChild(form.lastChild);
		loadArtist().catch(function(reason) {
			const p = document.createElement('P');
			p.textContent = 'Error loading artist profile: ' + reason;
			p.style = 'color: red; font-size: 9pt;';
			form.append(p);
		});
		return false;
	}
	elems[1].append(elems[4]);
	elems[0].append(elems[1]);
	sidebar.append(elems[0]);

	// D&D for similar artists
	for (let box of ['box_addartists_similar', 'box_artists'].map(className => document.body.querySelector('div.sidebar > div.' + className))) {
		if (box == null) continue;

		function getSiteArtistId(dataTransfer) {
			if (!(dataTransfer instanceof DataTransfer)) return null; // assertion failed
			let links = dataTransfer.getData('text/uri-list');
			if (links) links = links.split(/\r?\n/); else if (links = dataTransfer.getData('text/x-moz-url'))
				links = links.split(/\r?\n/).filter((item, ndx) => ndx % 2 == 0);
			if (links) for (let link of links) try {
				if ((link = new URL(link)).pathname != '/artist.php') continue;
				let artistId = parseInt(link.searchParams.get('id') || link.searchParams.get('artistid'));
				if (artistId > 0 && link.hostname == document.location.hostname) return artistId;
				if (artistId = link.searchParams.get('artistname')) return artistId;
			} catch(e) { }
			return null;
		}

		box.ondragover = evt => !getSiteArtistId(evt.dataTransfer);
		box.ondragenter = box[`ondrag${'ondragexit' in box ? 'exit' : 'leave'}`] = function(evt) {
			for (let tgt = evt.relatedTarget; tgt != null; tgt = tgt.parentNode)
				if (tgt == evt.currentTarget) return false;
			if (!getSiteArtistId(evt.dataTransfer)) return false;
			evt.currentTarget.style.backgroundColor = evt.type == 'dragenter' ? '#7fff0040' : null;
		};
		box.ondrop = function(evt) {
			if (evt.shiftKey) return true;
			const _artistId = getSiteArtistId(evt.dataTransfer);
			if (_artistId) evt.currentTarget.style.backgroundColor = null; else return true;
			getSiteArtist(_artistId).then(similarArtist => getSiteArtist(artistId).then(function(artist) {
				if (Array.isArray(artist.similarArtists) && artist.similarArtists.some(a => a.artistId == similarArtist.id))
					return Promise.reject(`This artist is already similar ${similarArtist.name}`);
				LocalXHR.post('/artist.php', new URLSearchParams({
					action: 'add_similar',
					artistid: artistId,
					artistname: similarArtist.name,
					auth: userAuth,
				}), { responseType: null }).then(status => { document.location.reload() });
			}));
			return false;
		};
	}

	const subscriptionSwitch = document.getElementById('subscribelink_artist' + artistId);
	if (subscriptionSwitch != null) {
		let ass;
		if ('artistSubscriptionStates' in sessionStorage) try {
			ass = JSON.parse(sessionStorage.getItem('artistSubscriptionStates'));
		} catch(e) { console.warn(e) }
		if (!ass) ass = { };
		function saveSubscribtionState(node = subscriptionSwitch) {
			if (node instanceof Node) switch (node.textContent.trim()) {
				case 'Subscribe': ass[artistId] = false; break;
				case 'Unsubscribe': ass[artistId] = true; break;
				default: return;
			}
			sessionStorage.setItem('artistSubscriptionStates', JSON.stringify(ass));
		}

		saveSubscribtionState();
		if (artistId in ass) new MutationObserver(function(ml, mo) {
			for (let mutation of ml) if (mutation.type == 'characterData') saveSubscribtionState(mutation.target);
		}).observe(subscriptionSwitch, { characterData: true, subtree: true });
	}
}
