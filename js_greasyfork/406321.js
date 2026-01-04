// ==UserScript==
// @name         Qobuz - Copy album info
// @version      1.21.3
// @author       Anakunda
// @license      GPL-3.0-or-later
// @run-at       document-end
// @copyright    2019-2021, Anakunda (https://openuserjs.org/users/Anakunda)
// @namespace    https://greasyfork.org/users/321857-anakunda
// @description  Copy release metadata to foobar2000 parseable format (Context → Properties → Tools → Automatically fill values...)
// @match        https://www.qobuz.com/*/album/*
// @match        https://www.qobuz.com/album/*
// @iconURL      https://www.qobuz.com/assets-static/img/icons/favicon/favicon-32x32.png
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_info
// @connect      www.qobuz.com
// @connect      play.qobuz.com
// @require      https://openuserjs.org/src/libs/Anakunda/xhrLib.js
// @require      https://openuserjs.org/src/libs/Anakunda/QobuzLib.js
// @downloadURL https://update.greasyfork.org/scripts/406321/Qobuz%20-%20Copy%20album%20info.user.js
// @updateURL https://update.greasyfork.org/scripts/406321/Qobuz%20-%20Copy%20album%20info.meta.js
// ==/UserScript==

// expression for 'Automatically Fill Values' in foobaru200:
//   %album artist%%album%%releasedate%%genre%%label%%discnumber%%discsubtitle%%totaldiscs%%tracknumber%%totaltracks%%artist%%title%%composer%%performer%%conductor%%media%%url%%comment%%releasetype%%upc%%isrc%%explicit%

{

'use strict';

const QOBUZ_ID = (function() {
	for (let script of document.head.querySelectorAll('script[type="application/ld+json"]')) try {
		script = JSON.parse(script.text);
		if (script.sku) return script.sku;
	} catch(e) { }
	return document.location.pathname.replace(/^.*\//, '');
})();
if (!QOBUZ_ID) throw 'Assertion failed: release id unknown';

const caseFixes = {
	en: [
		/*[
			/\b(\w+)\b/g, match => match[0].toUpperCase() + match.slice(1).toLowerCase()
		], */[
			new RegExp(`(\\w+|[\\,\\)\\]\\}]) +(${[
				'A', 'After', /*'Along', */'An', 'And A', 'And In', 'And The', 'And', /*'Around', */'As A', 'As An', 'As',
				'At A', 'At The', 'At', /*'But', */'By A', 'By An', 'By The', 'By', 'For A', 'For An', 'For The', 'For',
				'From A', 'From The', 'From', 'If', 'In A', 'In A', 'In An', 'In An', 'In The', 'In To', 'In', 'Into',
				'Nor', 'Not', 'Of A', 'Of A', 'Of An', 'Of The', 'Of', 'Off', 'On A', 'On An', 'On The', 'On', 'Onto',
				'Or The', 'Or', 'Out Of A', 'Out Of The', 'Out Of', 'Out', 'Over', /*'So', */'The', 'To A', 'To An',
				'To The', 'To', 'Vs', 'With A', 'With The', 'With', 'Without', 'Yet',
			].join('|')})(?=\\s+)`, 'g'), (match, preWord, shortWord) => preWord + ' ' + shortWord.toLowerCase(),
		], [
			/, +(So|But)\b(?!$)/g, (match, shortWord) => ', ' + shortWord.toLowerCase()
		], [
			new RegExp(`\\b(${['by', 'in', 'of', 'on', 'or', 'to', 'for', 'out', 'into', 'from', 'with'].join('|')})$`, 'g'),
			(match, shortWord) => ' ' + shortWord[0].toUpperCase() + shortWord.slice(1).toLowerCase(),
		],
		[/([\-\:\&\;]) +(the|a|an)(?=\s+)/g, (match, sym, article) => sym + ' ' + article[0].toUpperCase() + article.slice(1).toLowerCase()],
		[/\b(?:Best +of)\b/g, 'Best Of'],
	],
};

Array.prototype.includesCaseless = function(str) {
	if (typeof str != 'string') return false;
	str = str.toLowerCase();
	return this.some(elem => typeof elem == 'string' && elem.toLowerCase() == str);
};
Array.prototype.pushUnique = function(...items) {
	items.forEach(it => { if (!this.includes(it)) this.push(it) });
	return this.length;
};
Array.prototype.pushUniqueCaseless = function(...items) {
	items.forEach(it => { if (!this.includesCaseless(it)) this.push(it) });
	return this.length;
};
Array.prototype.equalCaselessTo = function(arr) {
	function adjust(elem) { return typeof elem == 'string' ? elem.toLowerCase() : elem }
	return Array.isArray(arr) && arr.length == this.length
		&& arr.map(adjust).sort().toString() == this.map(adjust).sort().toString();
};
Array.prototype.distinctValues = function() {
	return this.filter((elem, index, arrRef) => arrRef.indexOf(elem) == index);
};
Array.prototype.flatten = function() {
	return this.reduce(function(flat, toFlatten) {
		return flat.concat(Array.isArray(toFlatten) ? toFlatten.flatten() : toFlatten);
	}, [ ]);
};

String.prototype.toASCII = function() {
	return this.normalize("NFKD").replace(/[\x00-\x1F\u0080-\uFFFF]/g, '');
};
String.prototype.flatten = function() {
	return this.replace(/\n/g, '\x1D').replace(/\r/g, '\x1C');
};
String.prototype.collapseGaps = function() {
	return this.replace(/(?:[ \t\xA0]*\r?\n){3,}/g, '\n\n').replace(/\[(\w+)\]\[\/\1\]/ig, '').trim();
};
String.prototype.consolidateWhitespace = function() {
	return this.replace(/\s+/ig, ' ');
};
String.prototype.properTitleCase = function(langCode = 'en') {
	if (![this.toUpperCase(), this.toLowerCase()].some(str => this == str)) {
		if (langCode) langCode = langCode.toLowerCase(); else return this;
		if (Array.isArray(caseFixes[langCode]))
			return caseFixes[langCode].reduce((result, replacer) => result.replace(...replacer), this);
		console.warn('String.prototype.properTitleCase() called with invalid language id:', langCode);
	}
	return this;
};
String.prototype.appendDword = function(value) {
	if (Number.isInteger(value)) {
		const a = Array(4);
		for (let n = 0; n < 4; ++n) a[n] = value >> (n << 3) & 0xFF;
		return this.concat(String.fromCharCode(...a));
	}
	return this;
};
String.prototype.appendLString = function(str) {
	return this.appendDword(str.length).concat(str);
};

const tagNames = [
	/* 00 */ 'ALBUM ARTIST', 'ALBUM', 'RELEASEDATE', 'GENRE', 'LABEL', 'DISCNUMBER', 'DISCSUBTITLE', 'TOTALDISCS',
	/* 08 */ 'TRACKNUMBER', 'TOTALTRACKS', 'ARTIST', 'TITLE', 'COMPOSER', 'PERFORMER', 'CONDUCTOR', 'MEDIA', 'URL',
	/* 17 */ 'COMMENT', 'RELEASETYPE', 'UPC', 'ISRC', 'EXPLICIT',
];
const foobar2000_guid = '{9E67E09D-115C-43d1-8359-6A4B0C1DAFE4}';

function queryQobuzAPI(endPoint, params) {
	const apiRequest = (function() {
		if ('qobuzAPIs' in sessionStorage) try {
			const qobuzAPIs = JSON.parse(sessionStorage.getItem('qobuzAPIs'));
			if (!['base_method', 'base_url', 'app_id'].every(key => key in qobuzAPIs)) throw 'Outdated cache';
			return Promise.resolve(qobuzAPIs);
		} catch(e) { sessionStorage.removeItem('qobuzAPIs') }
		return globalXHR('https://play.qobuz.com/login').then(function({document}) {
			let script = document.body.querySelector('script[src]:last-of-type');
			if (script == null) return Promise.reject('invalid document structure');
			let url = new URL(script.src);
			url.hostname = 'play.qobuz.com';
			return globalXHR(url, { responseType: 'text' });
		}).then(function({responseText}) {
			let match = /\bqobuzApi=(\{.+?\})/.exec(responseText);
			if (match != null) match = eval('(' + match[1] + ')'); else throw 'Unexpected response';
			const qobuzAPIs = { base_method: match.baseMethod, base_url: match.baseUrl };
			match = /\bproduction:\s*\{\s*api:\s*\{\s*appId:\s*"(\S+?)"/.exec(responseText);
			if (match != null) qobuzAPIs.app_id = match[1]; else throw 'Unexpected response';
			sessionStorage.setItem('qobuzAPIs', JSON.stringify(qobuzAPIs));
			localStorage.setItem('qobuzAPIs', JSON.stringify(qobuzAPIs));
			return qobuzAPIs;
		}).catch(function(reason) {
			console.warn('Qobuz APIs extraction failed, trying to reuse last cached object', reason);
			if ('qobuzAPIs' in localStorage) {
				const qobuzAPIs = JSON.parse(localStorage.getItem('qobuzAPIs'));
				if (['base_method', 'base_url', 'app_id'].every(key => key in qobuzAPIs)) return qobuzAPIs;
			}
			return Promise.reject(reason);
		});
	})();
	function getUser(useCache = true) {
		let uid = GM_getValue('userid'), password = GM_getValue('password');
		if ('qobuzUserInfo' in localStorage) try {
			const userInfo = JSON.parse(localStorage.getItem('qobuzUserInfo'));
			if (uid && userInfo.user.login.toLowerCase() != uid.toLowerCase()) throw 'User credentials changed';
			if (!userInfo.user_auth_token) throw 'User info incomplete';
			if (useCache) {
				console.log('Qobuz user info re-used:', userInfo);
				return Promise.resolve(userInfo);
			}
		} catch(e) { localStorage.removeItem('qobuzUserInfo') }
		if (uid === undefined) GM_setValue('userid', '');
		if (password === undefined) GM_setValue('password', '');
		if (!uid || !password) return Promise.reject('insufficient user credentials');
		return apiRequest.then(apiRequest => localXHR(apiRequest.base_url + apiRequest.base_method + 'user/login', {
			responseType: 'json',
			headers: { 'X-App-Id': apiRequest.app_id }
		}, new URLSearchParams({ email: uid, password: password }))).then(function(response) {
			console.log('Qobuz login successfull:', response);
			if (!response.user_auth_token) throw 'User info incomplete';
			localStorage.setItem('qobuzUserInfo', JSON.stringify(response));
			return response;
		});
	}

	return endPoint ? getUser(true).then(user => apiRequest.then(function(apiRequest) {
		let url = new URL(apiRequest.base_method + endPoint, apiRequest.base_url);
		if (params && typeof params == 'object') url.search = new URLSearchParams(params);
		return localXHR(url, {
			responseType: 'json',
			headers: { 'X-App-Id': apiRequest.app_id, 'X-User-Auth-Token': user.user_auth_token },
		});
	})) : Promise.reject('API endpoint missing');
}

function setApiTag(elem) {
	if (!(elem instanceof HTMLElement)) return;
	const span = document.createElement('SPAN');
	span.textContent = 'API';
	span.style = 'margin-left: 9pt; font-style: italic; font-size: xx-small; vertical-align: super;';
	elem.append(span);
}

const apiResponse = queryQobuzAPI('album/get', { album_id: QOBUZ_ID }).then(function(response) {
	console.log(`API metadata loaded for ${QOBUZ_ID}:`, response);
	setApiTag(document.getElementById('copy-album-metadata'));
	return response;
});

function getClipboardData() {
	const discParser = /^(?:CD|DIS[CK]\s+|VOLUME\s+|DISCO\s+|DISQUE\s+)(\d+)(?:\s+of\s+(\d+))?$/i;
	const vaParser = /^(?:Various(?:\s+Artists)?|Varios(?:\s+Artistas)?|V\/?A|\<various\s+artists\>|Různí(?:\s+interpreti)?)$/i;
	const VA = 'Various Artists';
	const multiArtistParsers = [
		/\s*[\,\;\u3001](?!\s*(?:[JjSs]r)\b)(?:\s*(?:[Aa]nd|\&)\s+)?\s*/,
		/\s+(?:[\/\|\×]|meets)\s+/i,
	];
	const ampersandParsers = [
		/\s+(?:meets|vs\.?|X)\s+(?!\s*(?:[\&\/\+\,\;]|and))/i,
		/\s*[;\/\|\×]\s*(?!\s*(?:\s*[\&\/\+\,\;]|and))/i,
		/(?:\s*,)?\s+(?:[\&\+]|and)\s+(?!his\b|her\b|Friends$|Strings$)/i, // /\s+(?:[\&\+]|and)\s+(?!(?:The|his|her|Friends)\b)/i,
		/\s*\+\s*(?!(?:his\b|her\b|Friends$|Strings$))/i,
	];
	const featArtistParsers = [
		///\s+(?:meets)\s+(.+?)\s*$/i,
		/* 0 */ /\s+(?:[Ww](?:ith|\.?\/)|(?:(?:[Ee]n\s+)?[Dd]uo\s+)?[Aa]vec)\s+(?!his\b|her\b|Friends$|Strings$)(.+?)\s*$/,
		/* 1 */ /(?:\s+[\-\−\—\–\_])?\s+(?:[Ff]eaturing\s+|(?:(?:[Ff]eat\.?|(?:[Ff]t|FT)\.))\s*|[Ff]\.?\/\s+)([^\(\)\[\]\{\}]+?)(?=\s*(?:[\(\[\{].*)?$)/,
		/* 2 */ /\s+\[\s*f(?:eat(?:\.?|uring)|t\.|\.?\/)\s+([^\[\]]+?)\s*\]/i,
		/* 3 */ /\s+\(\s*f(?:eat(?:\.?|uring)|t\.|\.?\/)\s+([^\(\)]+?)\s*\)/i,
		/* 4 */ /\s+\[\s*(?:(?:en\s+)?duo\s+)?avec\s+([^\[\]]+?)\s*\]/i,
		/* 5 */ /\s+\(\s*(?:(?:en\s+)?duo\s+)?avec\s+([^\(\)]+?)\s*\)/i,
		/* 6 */ /\s+\[\s*(?:with|[Ww]\.?\/)\s+(?![Hh]is\b|[Hh]er\b|Friends$|Strings$)([^\[\]]+?)\s*\]/,
		/* 7 */ /\s+\(\s*(?:with|[Ww]\.?\/)\s+(?![Hh]is\b|[Hh]er\b|Friends$|Strings$)([^\(\)]+?)\s*\)/,
	];
	const featTest = /\b(?:feat(?:uring|\.)|ft\.)/i;
	const pseudoArtistParsers = [
		/* 0 */ vaParser,
		/* 1 */ /^(?:#??N[\/\-]?A|[JS]r\.?)$/i,
		/* 2 */ /^(?:auditorium|[Oo]becenstvo|[Pp]ublikum)$/,
		/* 3 */ /^(?:(Special\s+)??Guests?|Friends|(?:Studio\s+)?Orchestra)$/i,
		/* 4 */ /^(?:Various\s+Composers)$/i,
		/* 5 */ /^(?:[Aa]nonym)/,
		/* 6 */ /^(?:traditional|trad\.|lidová)$/i,
		/* 7 */ /\b(?:traditional|trad\.|lidová)$/,
		/* 8 */ /^(?:tradiční|lidová)\s+/,
		/* 9 */ /^(?:[Ll]iturgical\b|[Ll]iturgick[áý])/,
	];
	const tailingBracketStripper = /(?:\s+(?:\([^\(\)]+\)|\[[^\[\]]+\]|\{[^\{\}]+\}))+\s*$/;
	const error = new Error('Failed to parse Qobus release page');

	function normalizeDate(str, countryCode = undefined) {
		if (typeof str != 'string') return null;
		let match;
		function formatOutput(yearIndex, montHindex, dayIndex) {
			let year = parseInt(match[yearIndex]), month = parseInt(match[montHindex]), day = parseInt(match[dayIndex]);
			if (year < 30) year += 2000; else if (year < 100) year += 1900;
			if (year < 1000 || year > 9999 || month < 1 || month > 12 || day < 0 || day > 31) return null;
			return year.toString() + '-' + month.toString().padStart(2, '0') + '-' + day.toString().padStart(2, '0');
		}
		if ((match = /\b(\d{4})-(\d{1,2})-(\d{1,2})\b/.exec(str)) != null) return formatOutput(1, 2, 3); // US, SE
		if ((match = /\b(\d{4})\/(\d{1,2})\/(\d{1,2})\b/.exec(str)) != null) return formatOutput(1, 2, 3);
		if ((match = /\b(\d{1,2})\/(\d{1,2})\/(\d{2})\b/.exec(str)) != null
				&& (parseInt(match[1]) > 12 || ['be', 'it', 'au', 'nz'].includes(countryCode))) return formatOutput(3, 2, 1); // BE, IT, AU, NZ
		if ((match = /\b(\d{1,2})\/(\d{1,2})\/(\d{2})\b/.exec(str)) != null) return formatOutput(3, 1, 2); // US, MO
		if ((match = /\b(\d{1,2})\/(\d{1,2})\/(\d{4})\b/.exec(str)) != null) return formatOutput(3, 2, 1); // UK, IE, FR, ES, FI, DK
		if ((match = /\b(\d{1,2})-(\d{1,2})-((?:\d{2}|\d{4}))\b/.exec(str)) != null) return formatOutput(3, 2, 1); // NL
		if ((match = /\b(\d{1,2})\. *(\d{1,2})\. *(\d{4})\b/.exec(str)) != null) return formatOutput(3, 2, 1); // CZ, DE
		if ((match = /\b(\d{1,2})\. *(\d{1,2})\. *(\d{2})\b/.exec(str)) != null) return formatOutput(3, 2, 1); // AT, CH, DE, LU
		if ((match = /\b(\d{4})\. *(\d{1,2})\. *(\d{1,2})\b/.exec(str)) != null) return formatOutput(1, 2, 3); // JP
		return extractYear(str);
	}

	function extractYear(expr) {
		if (typeof expr == 'number') return Math.round(expr);
		if (typeof expr != 'string') return null;
		if (/\b(\d{4})\b/.test(expr)) return parseInt(RegExp.$1);
		let d = new Date(expr);
		return parseInt(isNaN(d) ? expr : d.getUTCFullYear());
	}

	function twoOrMore(artist) { return artist.length >= 2 && !pseudoArtistParsers.some(rx => rx.test(artist)) };
	function looksLikeTrueName(artist, index = 0) {
		return twoOrMore(artist) && (index == 0 || !/^(?:his\b|her\b|Friends$|Strings$)/i.test(artist))
			&& artist.split(/\s+/).length >= 2 && !pseudoArtistParsers.some(rx => rx.test(artist));
	}

	const realArtistName = artist => artist && ![0, 1, 4].some(ndx => pseudoArtistParsers[ndx].test(artist));

	function splitArtists(str, parsers = multiArtistParsers) {
		var result = [str];
		parsers.forEach(function(parser) {
			for (let i = result.length; i > 0; --i) {
				let j = result[i - 1].split(parser).map(strip);
				if (j.length > 1 && j.every(twoOrMore) && !j.some(artist => pseudoArtistParsers.some(rx => rx.test(artist))))
					result.splice(i - 1, 1, ...j);
			}
		});
		return result;
	}

	function splitAmpersands(artists) {
		if (typeof artists == 'string') var result = splitArtists(artists);
		else if (Array.isArray(artists)) result = Array.from(artists); else return [];
		ampersandParsers.forEach(function(ampersandParser) {
			for (let i = result.length; i > 0; --i) {
				let j = result[i - 1].split(ampersandParser).map(strip);
				if (j.length <= 1 || !j.every(looksLikeTrueName)) continue;
				result.splice(i - 1, 1, ...j.filter(function(artist) {
					return !result.includesCaseless(artist) && !pseudoArtistParsers.some(rx => rx.test(artist));
				}));
			}
		});
		return result;
	}

	function strip(art) {
		return [
			///\s+(?:aka|AKA)\.?\s+(.*)$/g,
			tailingBracketStripper,
		].reduce((acc, rx, ndx) => ndx != 1 || rx.test(acc)/* && !notMonospaced(RegExp.$1)*/ ? acc.replace(rx, '') : acc, art);
	}

	function joinArtists(arr, decorator = artist => artist) {
		if (!Array.isArray(arr)) return null;
		if (arr.some(artist => artist.includes('&'))) return arr.map(decorator).join(', ');
		if (arr.length < 3) return arr.map(decorator).join(' & ');
		return arr.slice(0, -1).map(decorator).join(', ') + ' & ' + decorator(arr.slice(-1).pop());
	}

	function guessDiscNumber() {
		if (discParser.test(discSubtitle)) {
			discSubtitle = undefined;
			discNumber = parseInt(RegExp.$1);
		}
	}

	let ref, artist, album, releaseDate, totalDiscs, totalTracks, isVA, label, composer, discSubtitle, discNumber,
			title, url, tracks = [ ], genres = [ ], description, releaseType, trackArtist, personnel,
			domParser = new DOMParser;
	const mainArtistIndexes = [[2, 3, 4], [5, 6]];
	const qbGetArtistsOfRole = (artists, index, ...indexes) => artists[index]
		.filter(artist => !indexes.concat(10, 14).some(index2 => index2 != index && artists[index2].includesCaseless(artist)))
		.filter(realArtistName);
	const optoutAlbumartist = GM_getValue('opt_out_album_artist', false);

	function finalizeTracks() {
		if (!isVA && tracks.every(track => track[10] && track[10] == tracks[0][10]))
			for (let track of tracks) track[0] = optoutAlbumartist ? undefined : track[10];
		let native = ''.appendDword(22);
		tagNames.forEach(function(tagName, index) {
			native = native.appendDword(tracks.length).appendLString(tagName.toUpperCase());
			for (let track of tracks) native = native.appendDword(1).appendLString(track[index] || '');
		});
		return {
			'text/plain': tracks.map(track => track.map(field => field !== undefined ? field : '').join('\x1E')).join('\n') + '\n',
			[foobar2000_guid]: native,
		};
	}

	function getTrackArtists(performers, defaultPerformer) {
		const artists = Array(qobuzArtistLabels.length + 1);
		for (let ndx = 0; ndx <= qobuzArtistLabels.length; ++ndx) artists[ndx] = [ ];
		if (performers && !['©', '(C)', '(c)', '℗', '(P)', '(p)'].some(s => performers.startsWith(s)))
			for (let component of performers.split(/\s+-\s+/).filter(x => !/^(?:19|2\d)\d{2}\b/.test(x))) {
				let parts = component.split(', ').map(s => s.trim());
				// ========================================== EXPERIMENTAL ==========================================
				if (parts.length > 2) {
					const index = parts.findIndex((s, index) => index > 0 && qbGetCategoryIndex(s, true) >= 0);
					if (index > 1) parts.splice(0, index, parts.slice(0, index).join(', ')); else if (index < 0) {
						//parts = [parts.join(', ')];
						console.warn('Qobuz rolesless performer:', component);
					}
				}
				// ==================================================================================================
				if (parts.length > 0) parts[0] = parts[0].consolidateWhitespace(); else continue;
				if (parts.length > 1) for (let ndx of parts.slice(1).map(qbGetCategoryIndex))
					artists[ndx >= 0 ? ndx : 16].pushUniqueCaseless(parts[0]);
				else {
					artists[qobuzArtistLabels.length].pushUniqueCaseless(parts[0]);
					console.warn('Qobuz rolesless performer:', parts[0]);
				}
			}

		artists.mainArtists = qbGetArtistsOfRole(artists, 0);
		for (let ndxs of mainArtistIndexes) if (artists.mainArtists.length <= 0) for (let ndx of ndxs)
			Array.prototype.pushUniqueCaseless.apply(artists.mainArtists, artists[ndx].filter(realArtistName));
		if (defaultPerformer && realArtistName(defaultPerformer = defaultPerformer.consolidateWhitespace())
				&& !artists.mainArtists.includesCaseless(defaultPerformer))
			artists.mainArtists.unshift(defaultPerformer);

		artists.guests = qbGetArtistsOfRole(artists, 7, 'mainArtists');
		featArtistParsers.forEach(function(rx, index) {
			if (index <= 0) return;
			const matches = rx.exec(title);
			if (matches == null) return;
			const guestArtists = splitAmpersands(matches[2]).map(artist => artist.consolidateWhitespace()).filter(realArtistName);
			if (index > 5 && !guestArtists.every(artist => artists.some(result => result.includesCaseless(artist)))) return;
			Array.prototype.pushUniqueCaseless.apply(artists.guests, guestArtists);
			title = title.replace(rx, '');
		});

		//console.debug('Personnel:', artists);
		return artists;
	}

	return apiResponse.then(function(metadata) {
		if (metadata.tracks_count > metadata.tracks.limit) throw 'tracklist length exceeding batch size';
		isVA = vaParser.test(metadata.artist.name);
		switch (metadata.release_type || metadata.product_type) {
			//case 'album': releaseType = 'Album'; break;
			case 'single': releaseType = 'Single'; break;
			case 'ep': case 'epmini': releaseType = 'EP'; break;
		}
		album = metadata.title = metadata.title.trim().consolidateWhitespace();
		if (metadata.version) {
			metadata.version = metadata.version.trim().consolidateWhitespace();
			const version = ' (' + metadata.version + ')', alc = album.toLowerCase();
			if (!alc.includes(version.toLowerCase()) && !alc.endsWith(' ' + metadata.version.toLowerCase())) album += version;
		}

		const albumArtists = [ ];
		for (let ndx = 0; ndx < qobuzArtistLabels.length; ++ndx) albumArtists[ndx] = [ ];
		if (metadata.artists) for (let _artist of metadata.artists)
			for (let ndx of _artist.roles.map(qbGetCategoryIndex))
				albumArtists[ndx >= 0 ? ndx : 16].pushUniqueCaseless(_artist.name.consolidateWhitespace());

		albumArtists.mainArtists = qbGetArtistsOfRole(albumArtists, 0);
		for (let ndxs of mainArtistIndexes) if (albumArtists.mainArtists.length <= 0) for (let ndx of ndxs)
			Array.prototype.pushUniqueCaseless.apply(albumArtists.mainArtists, albumArtists[ndx].filter(realArtistName));
		if (metadata.artist && metadata.artist.name
				&& realArtistName(metadata.artist.name = metadata.artist.name.consolidateWhitespace())
				&& !albumArtists.mainArtists.includesCaseless(metadata.artist.name))
			albumArtists.mainArtists.unshift(metadata.artist.name);
		if (albumArtists.mainArtists.length <= 0)
			albumArtists.mainArtists = metadata.artists.map(albumArtist => albumArtist.name.consolidateWhitespace());
		artist = joinArtists(albumArtists.mainArtists);

		albumArtists.guests = qbGetArtistsOfRole(albumArtists, 7, 'mainArtists');
		if (albumArtists.guests.length > 0) albumArtists.guests = [ ]; // correction
		featArtistParsers.forEach(function(rx, index) {
			if (index <= 0) return;
			const matches = rx.exec(album);
			if (matches == null) return;
			const guestArtists = splitAmpersands(matches[2]).map(artist => artist.consolidateWhitespace()).filter(realArtistName);
			if (index > 5 && !guestArtists.every(artist => metadata.artists.map(_artist =>
					_artist.name.consolidateWhitespace()).includes(artist))) return;
			Array.prototype.pushUniqueCaseless.apply(albumArtists.guests, guestArtists);
			album = album.replace(rx, '');
		});
		if (artist && albumArtists.guests.length > 0) artist += ' feat. ' + joinArtists(albumArtists.guests);

		if (albumArtists[1].length == 1) artist = albumArtists[1][0]; // !!
		if (metadata.description) description = domParser.parseFromString(metadata.description, 'text/html')
			.body.textContent.trim().replace(/ {2,}/g, ' ').flatten();
		metadata.tracks.items.forEach(function(track, index) {
			title = track.title.trim().consolidateWhitespace();
			if (track.version) {
				track.version = track.version.trim().consolidateWhitespace();
				const version = ' (' + track.version + ')', tlc = title.toLowerCase();
				if (!tlc.includes(version.toLowerCase()) && !tlc.endsWith(' ' + track.version.toLowerCase())) title += version;
			}
			personnel = getTrackArtists(track.performers/*, track.performer && track.performer.name*/);
			if (personnel.mainArtists.length <= 0 && isVA && track.performer && track.performer.name)
				personnel.mainArtists = [track.performer.name];
			if ((!track.performer || !track.performer.name) && metadata.artist && metadata.artist.name
					&& realArtistName(metadata.artist.name = metadata.artist.name.consolidateWhitespace())
					&& !personnel.mainArtists.includesCaseless(metadata.artist.name))
				personnel.mainArtists.unshift(metadata.artist.name);
			trackArtist = joinArtists(personnel.mainArtists);
			if (!trackArtist) if (!isVA) trackArtist = artist;
				else console.warn('Qobuz: track main artist missing for track', index + 1, track);
			if (trackArtist) {
				if (personnel.guests.length > 0) trackArtist += ' feat. ' + joinArtists(personnel.guests);
				if (personnel[10].length > 0) trackArtist += ' under ' + joinArtists(personnel[10]);
			}
			if (personnel[1].length == 1 && personnel[1][0] != trackArtist) {
				console.warn('Track' + (index + 1).toString().padStart(2, '0') + ' AssociatedPerrormer mismatch:',
					personnel[1][0], trackArtist);
				//trackArtist = personnel[1][0]; // !!
			}
			tracks.push([
				/* 00 */ isVA ? VA : artist.properTitleCase(),
				/* 01 */ album.properTitleCase(),
				/* 02 */ metadata.release_date_original,
				/* 03 */ metadata.genre ? metadata.genre.name.consolidateWhitespace() : undefined,
				/* 04 */ metadata.label ? metadata.label.name.consolidateWhitespace() : undefined,
				/* 05 */ metadata.media_count > 1 ? track.media_number || 1 : undefined,
				/* 06 */ track.work ? track.work.consolidateWhitespace().properTitleCase() : undefined,
				/* 07 */ metadata.media_count > 1 ? metadata.media_count : undefined,
				/* 08 */ track.track_number || index + 1,
				/* 09 */ metadata.tracks_count || metadata.tracks.total,
				/* 10 */ trackArtist.properTitleCase(),
				/* 11 */ title.properTitleCase(),
				/* 12 */ personnel[9].length > 0 ? personnel[9].join(', ') : track.composer ? track.composer.name
					: albumArtists[9].length > 0 ? albumArtists[9].join(', ') : metadata.composer ? metadata.composer.name : undefined,
				/* 13 */ personnel[0].concat(personnel[qobuzArtistLabels.length], personnel.slice(2, 9))
					.flatten().filter(Boolean).distinctValues().join(', ') || trackArtist
					|| (/*track.performer ? track.performer.name : */!isVA && artist) || undefined,
				/* 14 */ personnel[10].length > 0 ? joinArtists(personnel[10]) : undefined, // conductors
				//joinArtists(personnel[11]),
				//joinArtists(personnel[12]),
				//joinArtists(personnel[13]),
				/* 15 */ 'Digital Media', // WEB
				/* 16 */ metadata.url,
				/* 17 */ description,
				/* 18 */ releaseType || undefined,
				/* 19 */ metadata.upc || undefined,
				/* 20 */ track.isrc || undefined,
				/* 21 */ track.parental_warning ? 1 : undefined,
			]);
		});
		return Promise.resolve(finalizeTracks());
	}).catch(function(reason) {
		console.info('Qobuz API method failed for the reason', reason);

		function addTracks(dom) {
			Array.prototype.push.apply(tracks, Array.from(dom.querySelectorAll('div.player__item > div.player__tracks > div.track > div.track__items')).map(function(div, index) {
				const TRACK_ID = div.parentNode.dataset.track;
				title = (ref = [
					'div.track__item--name > span', 'div.track__item--name--track > span', 'span.track__item--name',
				].reduce((acc, sel) => acc || div.querySelector(sel), null)) != null ? ref.title || ref.textContent : undefined;
				if (title) title = title.trim().consolidateWhitespace(); else throw 'Track title missing';
				let trackPerformer = div.querySelector('div.track__item--artist.track__item--performer > span')
					|| div.querySelector('div.track__item--name[itemprop="performer"] > span');
				trackPerformer = trackPerformer != null && trackPerformer.textContent.trim().consolidateWhitespace() || undefined;
				ref = div.parentNode.querySelector('p.track__info:first-of-type');
				personnel = getTrackArtists(ref != null && ref.textContent.trim()/*, trackPerformer*/);
				if (personnel.mainArtists.length <= 0 && isVA && trackPerformer) personnel.mainArtists = [trackPerformer];
				if (!trackPerformer && mainArtist && realArtistName(mainArtist)
						&& !personnel.mainArtists.includesCaseless(mainArtist)) personnel.mainArtists.unshift(mainArtist);
				trackArtist = personnel.mainArtists.length > 0 ? joinArtists(personnel.mainArtists) : undefined;
				if (!trackArtist) if (!isVA) trackArtist = artist;
					else console.warn('Qobuz: track main artist missing for track', index + 1, div);
				if (trackArtist) {
					if (personnel.guests.length > 0) trackArtist += ' feat. ' + joinArtists(personnel.guests);
					//if (personnel[10].length > 0) trackArtist += ' under ' + joinArtists(personnel[10]);
				}
				if (personnel[1].length == 1 && personnel[1][0] != trackArtist) {
					console.warn('Track' + (index + 1).toString().padStart(2, '0') + ' AssociatedPerrormer mismatch:',
						personnel[1][0], trackArtist);
					//trackArtist = personnel[1][0]; // !!
				}
				let trackGenres = [ ];
				if (div.parentNode.dataset.gtm) try {
					let gtm = JSON.parse(div.parentNode.dataset.gtm);
					//if (gtm.product.id) QOBUZ_ID = gtm.product.id;
					if (gtm.product.subCategory) trackGenres.pushUniqueCaseless(gtm.product.subCategory.replace(/-/g, ' '));
					if (gtm.product.type) releaseType = gtm.product.type;
				} catch(e) { console.warn(e) }
				trackGenres = trackGenres.map(function(genre) {
					genre = qbGenreToEnglish(genre.replace(/-/g, ' '))
					return genre.split(/\s+/).map(word => word[0].toUpperCase() + word.slice(1).toLowerCase()).join(' ');
				});
				if ((ref = div.parentNode.parentNode.parentNode.querySelector('p.player__work:first-child')) != null) {
					discSubtitle = ref.textContent.consolidateWhitespace().trim();
					guessDiscNumber();
				}
				return [
					/* 00 */ isVA ? VA : artist.properTitleCase(),
					/* 01 */ album.properTitleCase(),
					/* 02 */ releaseDate,
					/* 03 */ genres.map(qbGenreToEnglish).join(', ').consolidateWhitespace(),
					/* 04 */ label ? label.consolidateWhitespace() : undefined,
					/* 05 */ totalDiscs > 1 ? discNumber || 1 : undefined,
					/* 06 */ discSubtitle ? discSubtitle.properTitleCase().consolidateWhitespace() : undefined,
					/* 07 */ totalDiscs > 1 ? totalDiscs : undefined,
					/* 08 */ (ref = div.querySelector('div.track__item--number > span')
						|| div.querySelector('span[itemprop="position"]')) != null ? parseInt(ref.textContent) : undefined,
					/* 09 */ totalTracks,
					/* 10 */ trackArtist ? trackArtist.properTitleCase() : undefined,
					/* 11 */ title.properTitleCase(),
					/* 12 */ personnel[9].length > 0 ? personnel[9].join(', ') : composer,
					/* 13 */ personnel[0].concat(personnel[qobuzArtistLabels.length], personnel.slice(2, 9))
						.flatten().filter(Boolean).distinctValues().join(', ') || trackArtist || trackPerformer || !isVA && artist || undefined,
					/* 14 */ personnel[10].length > 0 ? joinArtists(personnel[10]) : undefined, // conductors
					//joinArtists(personnel[11]),
					//joinArtists(personnel[12]),
					//joinArtists(personnel[13]),
					/* 15 */ 'Digital Media', // WEB
					/* 16 */ url,
					/* 17 */ description,
					/* 18 */ releaseType && releaseType.toLowerCase() != 'album' ? releaseType : undefined,
				];
			}));
		}

		if ((ref = document.body.querySelector('section.album-item[data-gtm]')) != null) try {
			let gtm = JSON.parse(ref.dataset.gtm);
			//if (gtm.shop.category) genres.push(gtm.shop.category);
			if (gtm.shop.subCategory) var subCategory = gtm.shop.subCategory.replace(/-/g, ' ');
			//if (gtm.type) var releaseType = gtm.type;
		} catch(e) { console.warn(e) }

		if ((ref = document.body.querySelector('div.album-meta > h1.album-meta__title')) != null)
			album = ref.title || ref.textContent;
		if (album) album = album.trim().consolidateWhitespace(); else throw 'Album title could not be extracted';

		if ((ref = document.body.querySelector('div.album-meta > h2')) != null) artist = ref.title || ref.textContent.trim();
		if (artist) artist = artist.consolidateWhitespace();
		let mainArtist = (ref = document.body.querySelector('div.album-meta > ul > li:nth-of-type(2) > a')) != null ?
			ref.title || ref.textContent.trim() : undefined;
		if (mainArtist) mainArtist = mainArtist.consolidateWhitespace();
		if (!artist && !(artist = mainArtist)) throw 'Album artist could not be extracted';
		isVA = vaParser.test(artist);
		const mainArtists = splitAmpersands(artist);
		let featArtists = [ ];
		featArtistParsers.slice(1).forEach(function(rx, index) {
			const matches = rx.exec(album);
			if (matches == null) return;
			const guestArtists = splitAmpersands(matches[2]).map(artist => artist.consolidateWhitespace()).filter(realArtistName);
			if (index > 4 && !guestArtists.every(artist => mainArtists.includesCaseless(artist))) return;
			Array.prototype.pushUniqueCaseless.apply(featArtists, guestArtists);
			album = album.replace(rx, '');
		});
		if ((featArtists = featArtists.filter(featArtist => !mainArtists.includesCaseless(featArtist))).length > 0) {
			if (!featTest.test(artist)) artist += ' feat. ' + joinArtists(featArtists);
			//if (mainArtist && !featTest.test(mainArtist)) mainArtist += ' feat. ' + joinArtists(featArtists);
		}

		if ((ref = document.body.querySelector('div.album-meta > ul > li:first-of-type')) != null) {
			let marketParser = /\/(\w+)-(\w+)\//.exec(document.location.pathname);
			releaseDate = normalizeDate(ref.textContent, marketParser && marketParser[1].toLowerCase());
		}
		//ref = document.body.querySelector('p.album-about__copyright');
		//if (ref != null) albumYear = extractYear(ref.textContent);
		document.body.querySelectorAll('section#about > ul > li').forEach(function(it) {
			const matchLabel = lbl => it.textContent.trimLeft().startsWith(lbl);
			if (/\b(\d+)\s*(?:dis[ck]|disco|disque)/i.test(it.textContent)) totalDiscs = parseInt(RegExp.$1);
			if (/\b(\d+)\s*(?:track|pist[ae]|tracce|traccia)/i.test(it.textContent)) totalTracks = parseInt(RegExp.$1);
			if (['Label', 'Etichetta', 'Sello'].some(l => it.textContent.trimLeft().startsWith(l)))
				label = it.firstElementChild.textContent.consolidateWhitespace().trim();
			else if (['Composer', 'Compositeur', 'Komponist', 'Compositore', 'Compositor'].some(matchLabel)) {
				composer = it.firstElementChild.textContent.trim();
				//if (pseudoArtistParsers.some(rx => rx.test(composer))) composer = undefined;
			} else if (['Genre', 'Genere', 'Género'].some(g => it.textContent.startsWith(g)) && it.childElementCount > 0
					&& genres.length <= 0) {
				genres = Array.from(it.querySelectorAll('a')).map(elem => elem.textContent.trim());
				// if (genres.length >= 1 && ['Pop/Rock'].includes(genres[0])) genres.shift();
				// if (genres.length >= 2 && ['Alternative & Indie'].includes(genres[genres.length - 1])) genres.shift();
				// if (genres.length >= 1 && ['Metal', 'Heavy Metal'].some(genre => genres.includes(genre)))
				// while (genres.length > 1) genres.shift();
				while (genres.length > 1) genres.shift();
			}
		});
		description = Array.from(document.body.querySelectorAll('section#description > p'))
			.map(p => p.textContent.trim()).filter(Boolean).join('\n\n').replace(/ {2,}/g, ' ').flatten();
		url = (ref = document.body.querySelector('meta[property="og:url"]')) != null ? ref.content : document.URL;
		addTracks(document);
		if (totalTracks <= 50) return Promise.resolve(finalizeTracks());
		let params = new URLSearchParams({
			albumId: QOBUZ_ID,
			offset: 50,
			limit: 999,
			store: /\/(\w{2}-\w{2})\/album\//i.test(document.location.pathname) ? RegExp.$1 : 'fr-fr',
		});
		return localXHR('/v4/ajax/album/load-tracks?' + params.toString()).then(document => { addTracks(document) },
			reason => { console.error('localXHR() failed:', reason) }).then(finalizeTracks);
	});
} // getClipboardData

let buttons = document.body.querySelector('div.player__buttons');
if (buttons == null) throw 'Assertion failed: share button was not found (div.player-share > button.player-share__button)';

const div = document.createElement('DIV');
let button = document.createElement('BUTTON');
div.className = 'meta-copy';
div.style.marginLeft = '2em';
button.className = 'player-share__button pct';
button.id = 'copy-album-metadata';
button.style = `
padding: 4px 5px; width: 14em;
font: 700 small "Segoe UI", Tahoma, sans-serif;
border: 1px solid #888; border-radius: 4px;
cursor: pointer;
`;
button.dataset.text = button.textContent = 'Copy album metadata';
button.onclick = function(evt) {
	(button = evt.currentTarget).style.backgroundColor = 'red';
	getClipboardData().then(function(formats) {
		button.style.backgroundColor = null;
		//console.log('Formats:', formats);
		//for (let format in formats) if (formats[format]) GM_setClipboard(formats[format], { mimetype: format });
		/*if ('clipboard' in navigator) navigator.clipboard.write(formats.map(function(mimetype) {
			const blob = new Blob([formats[mimetype]], { type: mimetype });
			return new ClipboardItem({ [blob.type]: blob });
		})).then(() => { console.info('Clipboard set successfully') });
		else */if (typeof GM_setClipboard == 'function' && formats['text/plain'])
			GM_setClipboard(formats['text/plain'], { mimetype: 'text/plain' });
		const img = document.createElement('img');
		img.src = 'data:image/png;base64,' +
			'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';
		img.style.height = '16px';
		while (button.childNodes.length > 0) button.childNodes[0].remove();
		button.append(img);
		setTimeout(function(elem) {
			elem.textContent = elem.dataset.text;
			apiResponse.then(() => { setApiTag(elem) });
		}, 5000, button);
	}, function(reason) {
		button.style.backgroundColor = null;
		alert(reason);
	});
};
div.append(button);
buttons.append(div);
if ((button = buttons.querySelector('button.player__webplayer')) != null) {
	button.style.width = 'max-content';
	if (!button.style.width) button.style.width = '-moz-max-content';
	if (!button.style.width) button.style.width = '-webkit-max-content';
}

if (typeof GM_registerMenuCommand == 'function' && typeof GM_setClipboard == 'function')
	GM_registerMenuCommand('Store foobar2000\'s parsing string to clipboard', function() {
		GM_setClipboard(tagNames.map(tagName => '%' + tagName.toLowerCase() + '%').join('\x1E'), 'text');
	});

}
