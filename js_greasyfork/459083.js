// ==UserScript==
// @name         [GMT] Edition lookup by CD TOC
// @version      1.29.2
// @author       Anakunda
// @description  Lookup edition by CD TOC on MusicBrainz, GnuDb and in CUETools DB, seed new/update existing MusicBrainz releases based on the TOC
// @license      GPL-3.0-or-later
// @match        https://*/torrents.php?id=*
// @match        https://*/torrents.php?page=*&id=*
// @run-at       document-end
// @iconURL      https://ptpimg.me/5t8kf8.png
// @namespace    https://greasyfork.org/users/321857-anakunda
// @copyright    © 2025 Anakunda (https://greasyfork.org/users/321857)
// @license      GPL-3.0-or-later
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @grant        GM_getTab
// @grant        GM_saveTab
// @grant        GM_getTabs
// @grant        GM_addStyle
// @connect      musicbrainz.org
// @connect      coverartarchive.org
// @connect      archive.org
// @connect      discogs.com
// @connect      db.cuetools.net
// @connect      db.cue.tools
// @connect      gnudb.org
// @connect      allmusic.com
// @connect      accuraterip.com
// @connect      api.translatedlabs.com
// @connect      allmusic.com
// @resource     mb_logo https://upload.wikimedia.org/wikipedia/commons/9/9e/MusicBrainz_Logo_%282016%29.svg
// @resource     mb_icon https://upload.wikimedia.org/wikipedia/commons/9/9a/MusicBrainz_Logo_Icon_%282016%29.svg
// @resource     mb_logo_text https://github.com/metabrainz/metabrainz-logos/raw/master/logos/MusicBrainz/SVG/MusicBrainz_logo.svg
// @resource     mb_text https://github.com/metabrainz/metabrainz-logos/raw/master/logos/MusicBrainz/SVG/MusicBrainz_logo_text_only.svg
// @resource     dc_icon https://upload.wikimedia.org/wikipedia/commons/6/69/Discogs_record_icon.svg
// @resource     am_logo https://upload.wikimedia.org/wikipedia/commons/a/a0/AllMusic_Logo.svg
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js
// @require      https://openuserjs.org/src/libs/Anakunda/Requests.min.js
// @require      https://openuserjs.org/src/libs/Anakunda/libLocks.min.js
// @require      https://openuserjs.org/src/libs/Anakunda/gazelleApiLib.min.js
// @require      https://openuserjs.org/src/libs/Anakunda/libStringDistance.min.js
// @downloadURL https://update.greasyfork.org/scripts/459083/%5BGMT%5D%20Edition%20lookup%20by%20CD%20TOC.user.js
// @updateURL https://update.greasyfork.org/scripts/459083/%5BGMT%5D%20Edition%20lookup%20by%20CD%20TOC.meta.js
// ==/UserScript==

'use strict';

const debugLogging = GM_getValue('debug_logging', 0);
const sessionsCache = new Map;
let sessionsSessionCache, ssQuotaExceeded = false;
let noEditPerms = document.getElementById('nav_userclass'), logScoresCache;
noEditPerms = noEditPerms != null && ['User', 'Member', 'Power User'].includes(noEditPerms.textContent.trim());
const [mbOrigin, dcOrigin] = ['https://musicbrainz.org', 'https://www.discogs.com'];
const toASCII = str => str && str.normalize('NFKD').replace(/[\x00-\x1F\u0300-\u036F]/gu, '');
const cmpNorm = str => str && toASCII(str).replace(/\s+(?:and|et|y|und|и)\s+/gi, ' & ').toLowerCase()
	.replace(/[\s\‐\−\—\–\x00-\x25\x27-\x2F\x3A-\x40\x5B-\x5E\x60\x7B-\x7F\u2019]+/g, '');
const sameStringValues = (...strVals) => strVals.length > 0 && strVals.every(strVal1 => strVal1
	&& strVals.every(strVal2 => strVal2 && cmpNorm(strVal2) == cmpNorm(strVal1)));
const similarStringValues = (strVal1, strVal2, threshold = 0.95) => strVal1 && strVal2
	&& (sameStringValues(strVal1, strVal2) || jaroWinklerSimilarity(toASCII(strVal1).toLowerCase(), toASCII(strVal2).toLowerCase()) >= threshold);
const sameArrays = (...arrays) => arrays.length > 0 && arrays.every((array1, index1, arrays) => arrays.every((array2, index2) =>
	index2 == index1 || ((array1 = array1 || [ ]).length == (array2 = array2 || [ ]).length
	&& array1.every(elem => array2.includes(elem)) && array2.every(elem => array1.includes(elem)))));
const uniqueIdFilter = (entry1, index, entries) => entries.findIndex(entry2 => entry2.id == entry1.id) == index;
const createElements = (...tagNames) => tagNames.map(Document.prototype.createElement.bind(document));
const mbID = /([\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12})/i.source;
const rxMBID = new RegExp(`^${mbID}$`, 'i');
const domParser = new DOMParser;
const safePromiseHandler = promise => promise instanceof Promise ? promise.catch(console.warn) : promise;
const cleanObject = obj => Object.fromEntries(Object.entries(obj).filter(function([_, value]) {
	if (value === null || value === undefined || value === '') return false;
	if (Array.isArray(value) && value.length === 0) return false;
	if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) return false;
	return true;
}));
if (!('toArray' in Iterator.prototype)) Object.defineProperty(Iterator.prototype,
	'toArray', { value: function() { return Array.from(this) } });
if (!('forEach' in Iterator.prototype)) Object.defineProperty(Iterator.prototype,
	'forEach', { value: function(callback) { this.toArray().forEach(callback) } });

const mbRequestsCache = new Map, mbRequestRate = 1000;
let mbLastRequest = null;
function mbApiRequest(endPoint, params, debugLogging = false) {
	if (!endPoint) throw 'Endpoint is missing';
	const url = new URL('/ws/2/' + endPoint.replace(/^\/+|\/+$/g, ''), mbOrigin);
	if (params) for (let key in params) url.searchParams.set(key, params[key]);
	url.searchParams.set('fmt', 'json');
	if (debugLogging) console.debug('MB API request:', url.href);
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
			onerror: function(response) {
				mbLastRequest = Date.now();
				if (response.status == 0 && response.readyState == XMLHttpRequest.DONE && retryCounter++ < 60) {
					console.log('MusicBrainz API request retry #%d on HTTP error %d/%d', retryCounter, response.status, response.readyState);
					setTimeout(request, 1000);
				} else reject(XHR.defaultErrorHandler(response));
			},
			ontimeout: function(response) {
				mbLastRequest = Date.now();
				reject(XHR.defaultTimeoutHandler(response));
			},
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

const dcAuth = (function() {
	const token = GM_getValue('discogs_api_token');
	if (token) return { token: token };
	const [key, secret] = ['discogs_api_consumerkey', 'discogs_api_consumersecret'].map(name => GM_getValue(name));
	if (key && secret) return { key: key, secret: secret };
})(), dcApiRateControl = { requestsMax: dcAuth ? 60 : 25 }, dcApiRequestsCache = new Map;
let dcApiResponses;

function dcApiRequest(endPoint, params) {
	if (endPoint) endPoint = new URL(endPoint, 'https://api.discogs.com'); else throw 'No endpoint provided';
	if (params instanceof URLSearchParams) endPoint.search = params;
	else if (params instanceof Object) for (let key in params) endPoint.searchParams.set(key, params[key]);
	else if (params) endPoint.search = new URLSearchParams(params);
	const cacheKey = endPoint.pathname.slice(1) + endPoint.search;
	if (dcApiRequestsCache.has(cacheKey)) return dcApiRequestsCache.get(cacheKey);
	if (!dcApiResponses && 'discogsApiResponseCache' in sessionStorage) try {
		dcApiResponses = JSON.parse(sessionStorage.getItem('discogsApiResponseCache'));
	} catch(e) {
		sessionStorage.removeItem('discogsApiResponseCache');
		console.warn(e);
	}
	if (dcApiResponses && cacheKey in dcApiResponses) return Promise.resolve(dcApiResponses[cacheKey]);
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
				response = response.response;
				if (!ssQuotaExceeded) try {
					if (!dcApiResponses) dcApiResponses = { };
					dcApiResponses[cacheKey] = response;
					sessionStorage.setItem('discogsApiResponseCache', JSON.stringify(dcApiResponses));
				} catch(e) {
					ssQuotaExceeded = true;
					console.warn(e);
				}
				resolve(response);
			} else if (response.status == 429) {
				console.warn('Rate limit used: %d/%d (%s)', rateLimitUsed, dcApiRateControl.requestsMax,
					response.response && response.response.message || response.statusText);
				postpone(Date.now());
			} else if (XHR.recoverableErrors.has(response.status) && retryCounter++ < XHR.maxRetries) {
				console.log('Discogs API request retry #%d on HTTP error %d', retryCounter, response.status);
				setTimeout(request, XHR.retryTimeout);
			} else reject(XHR.defaultErrorHandler(response));
		};
		params.onerror = function(response) {
			if (response.status == 0 && response.readyState == XMLHttpRequest.DONE && retryCounter++ < XHR.maxRetries) {
				console.log('Discogs API request retry #%d on HTTP error %d/%d', retryCounter, response.status, response.readyState);
				setTimeout(request, XHR.retryTimeout);
			} else reject(XHR.defaultErrorHandler(response));
		};
		params.ontimeout = response => { reject(XHR.defaultTimeoutHandler(response)) };
		request();
	});
	dcApiRequestsCache.set(cacheKey, request);
	return request;
}

function mbIdExtractor(expr, entity) {
	if (expr) expr = expr.toString().trim(); else return null;
	let mbId = rxMBID.exec(expr);
	if (mbId) return mbId[1].toLowerCase(); else if (!entity) return null;
	try { mbId = new URL(expr) } catch(e) { return null }
	return mbId.hostname.endsWith('musicbrainz.org')
		&& (mbId = new RegExp(`^\\/${entity}\\/${mbID}\\b`, 'i').exec(mbId.pathname)) != null ?
			mbId[1].toLowerCase() : null;
}

const msf = 75, preGap = 2 * msf, msfTime = /(?:(\d+):)?(\d+):(\d+)[\.\:](\d+)/.source;
const msfToSector = time => Array.isArray(time) || (time = new RegExp(`^\\s*${msfTime}\\s*$`).exec(time)) != null ?
	(((time[1] ? parseInt(time[1]) : 0) * 60 + parseInt(time[2])) * 60 + parseInt(time[3])) * msf + parseInt(time[4]) : NaN;
const rxRangeRip = /^(?:Selected range|Выбранный диапазон|Âûáðàííûé äèàïàçîí|已选择范围|選択された範囲|Gewählter Bereich|Intervallo selezionato|Geselecteerd bereik|Utvalt område|Seleccionar gama|Избран диапазон|Wybrany zakres|Izabrani opseg|Vybraný rozsah|Limites Seleccionados)(?:[^\S\r\n]+\((?:Sectors|Секторы|扇区|Sektoren|Settori|Sektorer|Sectores|Сектори|Sektora|Sektory)[^\S\r\n]+(\d+)[^\S\r\n]*-[^\S\r\n]*(\d+)\))?$/m;
const sessionHeader = '(?:' + [
	'(?:EAC|XLD) (?:extraction logfile from |Auslese-Logdatei vom |extraheringsloggfil från |uitlezen log bestand van |log súbor extrakcie z |抓取日志文件从)',
	'File di log (?:EAC|XLD) per l\'estrazione del ', 'Archivo Log de extracciones desde ',
	'Отчёт (?:EAC|XLD) об извлечении, выполненном ', 'Отчет на (?:EAC|XLD) за извличане, извършено на ',
	'Protokol extrakce (?:EAC|XLD) z ', 'Sprawozdanie ze zgrywania programem (?:EAC|XLD) z ',
	'(?:EAC|XLD)-ov fajl dnevnika ekstrakcije iz ',
	'(?:Log created by: whipper|EZ CD Audio Converter) .+(?:\\r?\\n)+Log creation date: ',
	'morituri extraction logfile from ', 'Rip .+ Audio Extraction Log',
].join('|') + ')';
const rxTrackExtractor = /^(?:(?:(?:Track|Трек|Òðåê|音轨|Traccia|Spår|Pista|Трак|Utwór|Stopa|Faixa)[^\S\r\n]+\d+\b.*|Track \d+ saved to\b.+)$(?:\r?\n^(?:[^\S\r\n]+.*)?$)*| +\d+:$\r?\n^ {4,}Filename:.+$(?:\r?\n^(?: {4,}.*)?$)*)/gm;
const exportTocEntry = tocEntry => Object.defineProperty(tocEntry, 'length',
	{ get: function() { return this.endSector + 1 - this.startSector } });

function getTocEntries(session) {
	if (!session) return null;
	const tocParsers = [
		'^\\s+' + ['\\d+', msfTime, msfTime, '-?\\d+', '-?\\d+'] // EAC / XLD
			.map(pattern => '(' + pattern + ')').join('\\s+\\|\\s+') + '\\s*$',
		'^\\s+\[X\]\\s+' + ['\\d+', msfTime, msfTime, '-?\\d+', '-?\\d+'] // EZ CD
			.map(pattern => '(' + pattern + ')').join('\\s+') + '\\b',
		// whipper
		'^ +(\\d+): *' + [['Start', msfTime], ['Length', msfTime], ['Start sector', '-?\\d+'], ['End sector', '-?\\d+']]
			.map(([label, capture]) => `\\r?\\n {4,}${label}: *(${capture})\\b *`).join(''),
		// Rip
		'^\\s+' + ['(\\d+)', '(' + msfTime + ')', '(?:(?:-?\\d+):)?-?\\d+:-?\\d+[\\.\\:]-?\\d+', '(' + msfTime + ')', '(-?\\d+)', '(-?\\d+)', '\\d+']
			.join('\\s+\\|\\s+') + '\\s*$',
	];
	let tocEntries = tocParsers.reduce((m, rx) => m || session.match(new RegExp(rx, 'gm')), null);
	if (tocEntries == null || (tocEntries = tocEntries.map(function(tocEntry, trackIndex) {
		if ((tocEntry = tocParsers.reduce((m, rx) => m || new RegExp(rx).exec(tocEntry), null)) == null)
			throw `assertion failed: track ${trackIndex + 1} ToC entry invalid format`;
		const [startSector, endSector] = [12, 13].map(index => parseInt(tocEntry[index]));
		console.assert(msfToSector(tocEntry[2]) == startSector && msfToSector(tocEntry[7]) == endSector + 1 - startSector
			&& endSector >= startSector, 'TOC table entry validation failed:', tocEntry);
		return exportTocEntry({ trackNumber: parseInt(tocEntry[1]), startSector: startSector, endSector: endSector });
	})).length <= 0) return null;
	if (!tocEntries.every((tocEntry, trackIndex) => tocEntry.trackNumber == trackIndex + 1)) {
		tocEntries = Object.assign.apply({ }, tocEntries.map(tocEntry => ({ [tocEntry.trackNumber]: tocEntry })));
		tocEntries = Object.keys(tocEntries).sort((a, b) => parseInt(a) - parseInt(b)).map(key => tocEntries[key]);
	}
	console.assert(tocEntries.every((tocEntry, trackIndex, tocEntries) => tocEntry.trackNumber == trackIndex + 1
		&& tocEntry.endSector >= tocEntry.startSector && (trackIndex <= 0 || tocEntry.startSector > tocEntries[trackIndex - 1].endSector)),
		'TOC table structure validation failed:', tocEntries);
	return tocEntries;
}
function getTocAudioEntries(tocEntries) {
	if (!Array.isArray(tocEntries)) tocEntries = getTocEntries(tocEntries);
	if (!Array.isArray(tocEntries)) return null;
	const dataTracks = getDataTracks(tocEntries);
	if (dataTracks < 0) console.warn('Disc unknown layout type (%d):', dataTracks, tocEntries);
	return dataTracks > 0 ? tocEntries.slice(0, -dataTracks) : tocEntries;
}

function getDataTracks(tocEntries) {
	if (tocEntries == null) return; else for (let index = 0; index < tocEntries.length - 1; ++index) {
		const gap = tocEntries[index + 1].startSector - tocEntries[index].endSector - 1;
		if (gap != 0) return (gap == 11400 ? tocEntries.length - index : 0) - 1;
	}
	return 0;
}

function getSessionFingerprint(session) {
	const sessionFingerprint = getTocEntries(session);
	if (!sessionFingerprint) return null;
	sessionFingerprint.timeStamp = new RegExp(`^${sessionHeader}(.+)$`, 'm').exec(session);
	sessionFingerprint.isRangeRip = rxRangeRip.test(session);
	if ((sessionFingerprint.dataTracks = getDataTracks(sessionFingerprint)) < 0)
		console.warn('Disc unknown layout type (%d):', sessionFingerprint.dataTracks, getTocEntries(session));
	const trackRecords = session.match(rxTrackExtractor);
	console.assert((trackRecords == null) == sessionFingerprint.isRangeRip, session);
	console.assert(trackRecords == null || trackRecords.length == sessionFingerprint.length - sessionFingerprint.dataTracks, session);
	sessionFingerprint.trackRecords = trackRecords == null ? 0 : trackRecords.length;
	if (trackRecords != null && trackRecords.length == sessionFingerprint.length - sessionFingerprint.dataTracks) sessionFingerprint.forEach(function(tocEntry, index) {
		function extractValue(parsers) {
			const matches = Object.keys(parsers).map(pattern =>
				new RegExp(`^[^\\S\\r\\n]+${pattern}\\s*$`, 'm').exec(trackRecords[index]));
			const ndx = matches.findIndex(Boolean);
			if (ndx < 0) return;
			if (typeof Object.values(parsers)[ndx] != 'function') throw 'Invalid parser function';
			return Object.values(parsers)[ndx](matches[ndx]);
		}

		tocEntry.preGap = extractValue({
			['(?:Pre-gap length|Длина предзазора|Äëèíà ïðåäçàçîðà|前间隙长度|Pausenlänge|Durata Pre-Gap|För-gap längd|Longitud Pre-gap|Дължина на предпразнина|Długość przerwy|Pre-gap dužina|[Dd]élka mezery|Dĺžka medzery pred stopou|Extensão do pre-gap)\\s+' + msfTime]: msfToSector, // 1270
			['(?:Pre-gap length)\\s*:\\s*' + msfTime]: msfToSector,
		});
		tocEntry.crc32 = extractValue({
			'(?:(?:Copy|复制|Kopie|Copia|Kopiera|Copiar|Копиран) CRC|CRC (?:копии|êîïèè|kopii|kopije|kopie|kópie|de Cópia)|コピーCRC)\\s+([\\da-fA-F]{8})': m => parseInt(m[1], 16), // 1272
			'(?:CRC32 hash|Copy CRC|CRC)\\s*:\\s*([\\da-fA-F]{8})': m => parseInt(m[1], 16),
		});
		tocEntry.peak = extractValue({
			'(?:Peak level|Пиковый уровень|Ïèêîâûé óðîâåíü|峰值电平|ピークレベル|Spitzenpegel|Pauze lengte|Livello di picco|Peak-nivå|Nivel Pico|Пиково ниво|Poziom wysterowania|Vršni nivo|[Šš]pičková úroveň|Nível de Pico)\\s+(\\d+(?:\\.\\d+)?)\\s*\\%': m => [parseFloat(m[1]) * 10, 3], // 1217
			'(?:Peak(?: level)?)\\s*:\\s*(\\d+(?:\\.\\d+)?)': m => [parseFloat(m[1]) * 1000, 6],
		});
		for (let v = 2; v > 0; --v) tocEntry['arv' + v] = extractValue({
			[`.+?\\[([\\da-fA-F]{8})\\].+\\(AR v${v}\\)`]: m => parseInt(m[1], 16),
			[`(?:AccurateRip v${v} signature)\\s*:\\s*([\\da-fA-F]{8})`]: m => parseInt(m[1], 16),
		});
	});
	return Object.freeze(sessionFingerprint);
}

let arOffsets;
function verifyOffsets(sessions) {
	if (!Array.isArray(sessions)) throw new Error('Invalid argument');
	return sessions.length > 0 ? (function getAccuripOffsets() {
		if (arOffsets instanceof Promise) return arOffsets;
		const cachedOffsets = GM_getValue('read_offsets');
		if (cachedOffsets && Object.keys(cachedOffsets).length <= 0) cachedOffsets = undefined;
		if (cachedOffsets) {
			const timeStamp = GM_getValue('read_offsets_time');
			if (timeStamp > 0 && Date.now() - timeStamp < 24 * 60 * 60 * 1000)
				return arOffsets = Promise.resolve(cachedOffsets);
		}
		return arOffsets = GlobalXHR.get('http://accuraterip.com/driveoffsets.htm').then(function({document}) {
			const offsets = Object.assign.apply(this, Array.from(document.body.querySelectorAll('table table > tbody > tr:not(:first-of-type)'), function(tr) {
				let offset = Array.from(tr.cells, cell => cell.textContent.trim());
				offset = {
					driveId: offset[0].replace(/\s+/g, ' ').replace(/^-\s*/, ''),
					offset: parseInt(offset[1]), submits: parseInt(offset[2]), agreeRate: parseInt(offset[3]),
				};
				return offset.driveId && !isNaN(offset.offset) ? offset : null;
			}).filter(Boolean).map(offset => ({ [offset.driveId]: [offset.offset, offset.submits, offset.agreeRate] })));
			if (offsets.length <= 0) return Promise.reject('No drive offsets found');
			GM_setValue('read_offsets_time', Date.now());
			GM_setValue('read_offsets', offsets);
			return offsets;
		}).catch(reason => cachedOffsets || Promise.reject(reason));
	})().then(arOffsets => sessions.map(function(session) {
		let usedDrive = [
			/^(?:Used drive|Benutztes Laufwerk|Unità predefinita|Usar unidad|Използвано устройство|使用驱动器|Použitá mechanika|Använd enhet|gebruikt loopwerk|Użyty napęd|Дисковод|Korišćen drajv|Äèñêîâîä|Unidade utilizada|Drive used)\s*:\s*(.+)$/im, // 1233
			/^(?:Device: *\(?:\[ ?[A-Z]: ?\] *)? \s*:\s*(.+)$/m, // EZCD
		].reduce((matches, rx) => matches || rx.exec(session), null);
		let readOffset = /^(?:Read offset(?: correction)?|Коррекция смещения при чтении|读取偏移校正|Leseoffset Korrektur|Correzione offset di lettura|Corrección de Desplazamiento de Lectura|Lees-offset correctie|Läs-offset-korrigering|Офсет корекция при четене|Korekta położenia dla odczytu|Korekce vychýlení čtení|Offsetová korekcia pre čítanie|Korekcija offset-a kod čitanja|Êîððåêöèÿ ñìåùåíèÿ ïðè ÷òåíèè|Correcção do offset de leitura|Sample offset)\s*:\s*(\d+)\b/im.exec(session); // 1256
		if (usedDrive == null || readOffset == null) return Promise.resolve(undefined);
		usedDrive = usedDrive[1].replace(/\s+(?:(?:Adapter|ID):\s+\d+.*|\((?:not found|revision)\b.+\))$/, '').replace(/\s+/g, ' ').trim();
		readOffset = parseInt(readOffset[1]);
		const drives = Object.keys(arOffsets).filter(key => sameStringValues(key, usedDrive) || sameStringValues(key, [
			[/^(?:JLMS)\b/, 'Lite-ON'],
			[/^(?:HL-DT-ST|HL[ -]?DT[ -]?ST\b)/, 'LG Electronics'],
			[/^(?:Matshita)\b/i, 'Panasonic'],
		].reduce((driveStr, subst) => driveStr.replace(...subst), usedDrive)));
		if (drives.length <= 0) return 0;
		console.info('Read offset(s) for %s found in AR database:', usedDrive, drives.map(drive =>
			`${arOffsets[drive][0] > 0 ? '+' + arOffsets[drive][0] : arOffsets[drive][0]} (submits: ${arOffsets[drive][1]}, agree rate: ${arOffsets[drive][2]})`));
		const matches = drives.map(function(drive) {
			if (arOffsets[drive][1] >= 5 || arOffsets[drive][2] >= 100) return readOffset == arOffsets[drive][0];
			console.info('Weak read offset for', drive, 'found in AR database - offset not verified');
		});
		if (matches.some(Boolean)) return 1; else if (matches.some(match => match != false)) return 0;
		const toc = getTocEntries(session), firstSector = toc != null ? toc[0].startSector : undefined;
		console.warn('Mismatching read offset for %s: %o (%s)', usedDrive, matches, firstSector == 0 ?
			'TOC zero-aligned' : `TOC offseted by ${firstSector} sectors`);
		return firstSector == 0 ? -1 : -2;
	})).then(results => !results.some(result => result < -1)
		|| confirm('At least one disc was ripped with incorrect drive offset and nonzero based TOC, the result may generate incorerct disc ID.\nContinue anyway? (Not recommended)')
			? sessions : Promise.reject('Incorrect read offset'), reason => sessions) : Promise.resolve(null);
}

function getSessionsFromLogs(logFiles, detectCombinedLogs = GM_getValue('detect_volumes', true)) {
	logFiles = Array.prototype.map.call(logFiles, function(logFile) {
		while (logFile.startsWith('\uFEFF')) logFile = logFile.slice(1);
		return logFile;
	});
	const rxRipperSignatures = '(?:(?:' + [
		'Exact Audio Copy V', 'X Lossless Decoder version ', 'CUERipper v',
		'EZ CD Audio Converter ', 'Log created by: whipper ', 'morituri version ', 'Rip ',
	].join('|') + ')\\d+)';
	if (!detectCombinedLogs) {
		const rxCombinedLog = new RegExp(`^[\\S\\s]*(?:\\r?\\n)+(?=${rxRipperSignatures})`);
		logFiles = logFiles.map(logFile => rxCombinedLog.test(logFile) ? logFile.replace(rxCombinedLog, '') : logFile)
			.filter(RegExp.prototype.test.bind(new RegExp(`^(?:${rxRipperSignatures}|${sessionHeader})`)));
		return verifyOffsets(logFiles);
	} else if ((logFiles = logFiles.map(function(logFile) {
		function* getIndexes(sessionsIndexer) {
			let match;
			sessionsIndexer = new RegExp(sessionsIndexer, 'gm');
			while ((match = sessionsIndexer.exec(logFile)) != null) yield match.index;
		}

		let indexes = getIndexes('^' + rxRipperSignatures).toArray();
		if (indexes.length <= 0) indexes = getIndexes('^' + sessionHeader).toArray();
		return (indexes = indexes.map((index, ndx, arr) => logFile.slice(index, arr[ndx + 1])).filter(function(session) {
			const rr = rxRangeRip.exec(session);
			if (rr == null) return true;
			// Ditch HTOA logs
			const tocEntries = getTocEntries(session);
			return tocEntries == null || parseInt(rr[1]) != 0 || parseInt(rr[2]) + 1 != tocEntries[0].startSector;
		})).length > 0 ? indexes : null;
	}).filter(Boolean)).length <= 0) return null;
	const useChecksums = logFiles.every(logFile => logFile.every(function(session) {
		const sessionFingerprint = getSessionFingerprint(session);
		return sessionFingerprint != null && (sessionFingerprint.dataTracks > 0 ?
			sessionFingerprint.slice(0, -sessionFingerprint.dataTracks) : sessionFingerprint)
				.every(tocEntry => tocEntry.crc32 != undefined);
	})), sessions = new Map;
	for (const logFile of logFiles) for (const session of logFile) {
		const uniqueKey = [ ], sesionFingerprint = getSessionFingerprint(session);
		if (sesionFingerprint != null) uniqueKey.push([sesionFingerprint[0].startSector]
			.concat(sesionFingerprint.map(tocEntry => tocEntry.endSector + 1))
			.map(offset => offset.toString(32).padStart(4, '0')).join(''));
		if (useChecksums) uniqueKey.push(sesionFingerprint.filter(tocEntry => tocEntry.crc32 != undefined)
			.map(tocEntry => tocEntry.crc32.toString(32)).join(''));
		if (!useChecksums) {
			let title = new RegExp(`^${sessionHeader}(.+)$(?:\\r?\\n)+^(.+ [\\/\\-] .+)$`, 'm').exec(session);
			if (title != null) uniqueKey.push(cmpNorm(title[2]));
			else if ((title = /^ +Release: *$\r?\n^ +Artist: *(.+)$\r?\n^ +Title: *(.+)$/m.exec(session)) != null)
				uniqueKey.push(cmpNorm(title[1] + ' / ' + title[2])); // Whipper?
			else if ((title = /^Compact Disc Information\r?\n=+\r?\nName: *(.+)$/m.exec(session)) != null)
				uniqueKey.push(cmpNorm(title[1])); // Rip
		}
		if (uniqueKey.length > 0) sessions.set(uniqueKey.join(':'), session);
	}
	//console.info('Unique keys:', Array.from(sessions.keys()));
	return sessions.size > 0 ? verifyOffsets(Array.from(sessions.values())) : null;
}

function getSessionsFromTorrent(torrentId, detectCombinedLogs, allowInvalid = false) {
	if (!((torrentId = parseInt(torrentId)) > 0)) throw new Error('Invalid argument');
	if (sessionsCache.has(torrentId)) return sessionsCache.get(torrentId);
	if (!sessionsSessionCache && 'ripSessionsCache' in sessionStorage) try {
		sessionsSessionCache = JSON.parse(sessionStorage.getItem('ripSessionsCache'));
	} catch(e) {
		console.warn(e);
		sessionStorage.removeItem('ripSessionsCache');
		sessionsSessionCache = undefined;
	}
	if (!logScoresCache && (logScoresCache = sessionStorage.getItem('logScoresCache'))) try {
		logScoresCache = JSON.parse(logScoresCache);
	} catch(e) {
		console.warn(e);
		sessionStorage.removeItem('logScoresCache');
		logScoresCache = undefined;
	}
	if (sessionsSessionCache && torrentId in sessionsSessionCache && logScoresCache && torrentId in logScoresCache)
		return sessionsSessionCache[torrentId] || allowInvalid ?
			Promise.resolve(sessionsSessionCache[torrentId]) : Promise.reject('No valid logfiles attached');
	let request, logScores;
	switch (document.domain) {
		case 'redacted.sh': // API method not quite reliable
			// var apiRequest = queryAjaxAPICached('torrent', { id: torrentId }).then(function({torrent}) {
			// 	if (!torrent.hasLog || torrent.ripLogIds.length <= 0) return Promise.reject('Torrent has no ripping logs');
			// 	return Promise.all(torrent.ripLogIds.map(logId => queryAjaxAPICached('riplog', { id: torrentId, logid: logId })));
			// });
			// request = apiRequest.then(ripLogs => ripLogs.map(function(logEntry) {
			// 	logEntry = Uint8Array.from(atob(logEntry.log), ch => ch.charCodeAt(0));
			// 	const utf8 = new TextDecoder('utf-8').decode(logEntry);
			// 	const utf16 = new TextDecoder('utf-16le').decode(logEntry);
			// 	const score = str => (str.match(/[\x20-\x7E]/g) || []).length;
			// 	return score(utf16) > score(utf8) ? utf16 : utf8;
			// }));
			// logScores = request.then(logFiles => Promise.all(logFiles.map(logFile =>
			// 	queryAjaxAPI('logchecker', null, { pastelog: logFile })))).catch(reason =>
			// 		apiRequest.then(ripLogs => ripLogs.map(logEntry => ({ score: logEntry.score, checksum: logEntry.checksum }))));
			break;
	}
	request = LocalXHR.get('/torrents.php?' + new URLSearchParams({ action: 'loglist', torrentid: torrentId }))
		.then(({document}) => document.body);
	logScores = request.then(function(body) {
		const scores = Array.from(body.querySelectorAll(':scope > blockquote > strong + span'), function(span) {
			const result = { score: parseInt(span.textContent) };
			console.assert(!isNaN(result.score), span.cloneNode());
			if ((span = span.parentNode.nextElementSibling) != null
					&& (span = span.querySelector(':scope > h3 + pre')) != null
					&& (span = span.textContent.split(/\r?\n/).map(deduction => deduction.trim()).filter(Boolean)).length > 0)
				result.issues = span;
			return result;
		});
		return scores.length > 0 ? scores : Promise.reject('No log scores for torrent');
	});
	request = request.then(body =>
		Array.from(body.querySelectorAll(':scope > blockquote > pre:first-child'), pre => pre.textContent));
	request = request.then(logFiles => getSessionsFromLogs(logFiles, detectCombinedLogs)).then(function(sessions) {
		if (!sessions && !allowInvalid) return Promise.reject('No valid logfiles attached');
		if (!ssQuotaExceeded) try {
			if (!sessionsSessionCache) sessionsSessionCache = { };
			sessionsSessionCache[torrentId] = sessions;
			sessionStorage.setItem('ripSessionsCache', JSON.stringify(sessionsSessionCache));
		} catch(e) {
			ssQuotaExceeded = true;
			console.warn(e);
		}
		return sessions;
	});
	sessionsCache.set(torrentId, request);
	if (logScores instanceof Promise) logScores.then(function(logScores) {
		console.assert(Array.isArray(logScores));
		if (!logScoresCache) logScoresCache = { };
		logScoresCache[torrentId] = logScores;
		sessionStorage.setItem('logScoresCache', JSON.stringify(logScoresCache));
		return logScores;
	}).catch(console.warn);
	return request;
}

const lookupByToc = (torrentId, callback) => getSessionsFromTorrent(torrentId).then(sessions => Promise.all(sessions.map(function(session, volumeNdx) {
	let isRangeRip = rxRangeRip.test(session), tocEntries = getTocAudioEntries(session);
	if (tocEntries == null) throw `disc ${volumeNdx + 1} ToC not found`;
	return typeof callback == 'function' ? callback(tocEntries, volumeNdx, sessions.length) : Promise.resolve(tocEntries);
}).map(results => results.catch(function(reason) {
	console.log('Edition lookup failed for the reason:', reason);
	return Promise.reject(reason);
}))));

class DiscID {
	#data = '';

	addData(values, width = 0, length = 0) {
		if (!values) return this; else if (!Array.isArray(values)) values = [values];
		values = values.map(value => value.toString(16).toUpperCase().padStart(width, '0')).join('');
		this.#data += width > 0 && length > 0 ? values.padEnd(length * width, '0') : values;
		return this;
	}

	get digest() {
		return CryptoJS.SHA1(this.#data).toString(CryptoJS.enc.Base64)
			.replace(/[\=\+\/]/g, ch => ['-', '.', '_'][['=', '+', '/'].indexOf(ch)]);
	}
}

function tocEntriesToMbTOC(tocEntries) {
	if (tocEntries == null) return null;
	if (!Array.isArray(tocEntries) || tocEntries.length <= 0) throw new Error('Invalid argument');
	const isHTOA = tocEntries[0].startSector > preGap, mbTOC = [tocEntries[0].trackNumber, tocEntries.length];
	mbTOC.push(preGap + tocEntries[tocEntries.length - 1].endSector + 1);
	return Array.prototype.concat.apply(mbTOC, tocEntries.map(tocEntry => preGap + tocEntry.startSector));
}

function mbComputeDiscID(mbTOC) {
	if (!Array.isArray(mbTOC) || mbTOC.length != mbTOC[1] - mbTOC[0] + 4 || mbTOC[1] - mbTOC[0] > 98)
		throw 'Invalid or too long ToC';
	return new DiscID().addData(mbTOC.slice(0, 2), 2).addData(mbTOC.slice(2), 8, 100).digest;
}

function tocEntriesToCtdbTOC(tocEntries) {
	if (tocEntries == null) return null;
	if (tocEntries.length > 100) throw 'TOC size exceeds limit';
	return tocEntries.map(tocEntry => tocEntry.endSector + 1 - tocEntries[0].startSector);
}

function ctdbComputeDiscID(ctdbTOC) {
	if (!Array.isArray(ctdbTOC) || ctdbTOC.length > 100) throw 'Invalid or too long ToC';
	return new DiscID().addData(ctdbTOC, 8, 100).digest;
}

function getCDDBiD(tocEntries) {
	if (!Array.isArray(tocEntries)) throw 'Invalid ToC';
	const tt = Math.floor((tocEntries[tocEntries.length - 1].endSector + 1 - tocEntries[0].startSector) / msf);
	let discId = tocEntries.reduce(function(sum, tocEntry) {
		let n = Math.floor((parseInt(tocEntry.startSector) + preGap) / msf), s = 0;
		while (n > 0) { s += n % 10; n = Math.floor(n / 10) }
		return sum + s;
	}, 0) % 0xFF << 24 | tt << 8 | tocEntries.length;
	if (discId < 0) discId = 2**32 + discId;
	return discId.toString(16).toLowerCase().padStart(8, '0');
}

function getARiD(tocEntries) {
	const discIds = [0, 0];
	for (let index = 0; index < tocEntries.length; ++index) {
		discIds[0] += tocEntries[index].startSector;
		discIds[1] += Math.max(tocEntries[index].startSector, 1) * (index + 1);
	}
	discIds[0] += tocEntries[tocEntries.length - 1].endSector + 1;
	discIds[1] += (tocEntries[tocEntries.length - 1].endSector + 1) * (tocEntries.length + 1);
	return discIds.map(discId => discId.toString(16).toLowerCase().padStart(8, '0'))
		.concat(getCDDBiD(tocEntries)).join('-');
}

if (typeof unsafeWindow == 'object') Object.defineProperties(unsafeWindow, {
	getSessionsFromLogs: { value: getSessionsFromLogs },
	getSessionsFromTorrent: { value: getSessionsFromTorrent },
	lookupByToc: { value: lookupByToc },
	tocEntriesToMbTOC: { value: tocEntriesToMbTOC },
	mbComputeDiscID: { value: mbComputeDiscID },
	tocEntriesToCtdbTOC: { value: tocEntriesToCtdbTOC },
	ctdbComputeDiscID: { value: ctdbComputeDiscID },
	getCDDBiD: { value: getCDDBiD },
	getARiD: { value: getARiD },
});

GM_addStyle('body div.tooltipster-base { background-color: transparent }');

function setTooltip(elem, tooltip, options) {
	if (!(elem instanceof HTMLElement)) throw new Error('Invalid argument');
	if (typeof jQuery.fn.tooltipster == 'function') {
		let hasTooltip = (function($elem) {
			if ($elem.data('plugin_tooltipster')) return true;
			try { if ($elem.tooltipster('instance')) return true } catch(e) { }
			return false;
		})(jQuery(elem));
		if (tooltip) {
			tooltip = tooltip.replace(/\r?\n/g, '<br />');
			if (hasTooltip && Object.keys(options || { }).length > 0) {
				$(elem).tooltipster('destroy');
				hasTooltip = false;
			}
		}
		if (hasTooltip) if (tooltip)
			$(elem).tooltipster('update', tooltip).tooltipster('content', tooltip).tooltipster('enable');
		else {
			$(elem).tooltipster('destroy');
			elem.removeAttribute('title');
		} else if (tooltip) $(elem).tooltipster(Object.assign({
			contentAsHTML: true,
			theme: 'tooltipster-default',
		}, options, { content: tooltip }));
	} else if (tooltip) {
		tooltip = domParser.parseFromString(tooltip.replace(/\<br\s*\/?\>/gi, '\n'), 'text/html');
		elem.title = tooltip.body.textContent;
	} else elem.removeAttribute('title');
}

function getTorrentId(tr) {
	if (!(tr instanceof HTMLElement)) throw new Error('Invalid argument');
	if ((tr = tr.querySelector('a.button_pl')) != null
			&& (tr = parseInt(new URLSearchParams(tr.search).get('torrentid'))) > 0) return tr;
}

function updateEdition(evt) {
	if (noEditPerms || /*!openTabHandler(evt) || */evt.currentTarget.disabled) return false; else if (!ajaxApiKey) {
		if (!(ajaxApiKey = prompt('Set your API key with torrent edit permission:\n\n'))) return false;
		GM_setValue('redacted_api_key', ajaxApiKey);
	}
	const target = evt.currentTarget, payload = { }, torrentDetails = target.closest('tr.torrentdetails');
	if (torrentDetails == null || !('editionGroup' in torrentDetails.dataset)) return false;
	if (target.dataset.remasterYear) payload.remaster_year = target.dataset.remasterYear.slice(0, 80); else return false;
	if (target.dataset.remasterRecordLabel) payload.remaster_record_label = target.dataset.remasterRecordLabel.slice(0, 80);
	if (target.dataset.remasterCatalogueNumber) payload.remaster_catalogue_number = target.dataset.remasterCatalogueNumber.slice(0, 80);
	if (target.dataset.remasterTitle) payload.remaster_title = target.dataset.remasterTitle.slice(0, 80);
	if (Object.keys(payload).length <= 0) return false; else if (Boolean(eval(target.dataset.confirm))) {
		const entries = [ ];
		if ('remaster_year' in payload) entries.push('Edition year: ' + payload.remaster_year);
		if ('remaster_record_label' in payload) entries.push('Record label: ' + payload.remaster_record_label);
		if ('remaster_catalogue_number' in payload) entries.push('Catalogue number: ' + payload.remaster_catalogue_number);
		if ('remaster_title' in payload) entries.push('Edition title: ' + payload.remaster_title);
		if (!confirm('Edition group is going to be updated\n\n' + entries.join('\n') +
				'\n\nAre you sure the information is correct?')) return false;
	}
	[target.disabled, target.style.color] = [true, 'orange'];
	Promise.all(Array.from(document.body.querySelectorAll('table#torrent_details > tbody > tr.torrent_row.edition_' + torrentDetails.dataset.editionGroup), function(tr) {
		const torrentId = getTorrentId(tr);
		if (!(torrentId > 0)) return null;
		const postData = new URLSearchParams(payload);
		if (target.dataset.releaseUrl && torrentId == parseInt(torrentDetails.dataset.torrentId)
				&& !(torrentDetails.dataset.torrentDescription || '').toLowerCase().includes(target.dataset.releaseUrl.toLowerCase()))
			postData.set('release_desc', ((torrentDetails.dataset.torrentDescription || '') + '\n\n').trimLeft() +
				'[url]' + target.dataset.releaseUrl + '[/url]');
		return queryAjaxAPI('torrentedit', { id: torrentId }, postData);
	})).then(function(responses) {
		target.style.color = '#0a0';
		console.log('Edition updated successfully:', responses);
		document.location.reload();
	}, function(reason) {
		target.style.color = 'red';
		alert(reason);
		target.disabled = false;
	});
	return false;
}

function applyOnClick(tr) {
	[tr.style.cursor, tr.dataset.confirm, tr.onclick] = ['pointer', true, updateEdition];
	setTooltip(tr, 'Use simple click to apply edition info from this release', { position: 'right' });
	tr.onmouseenter = tr.onmouseleave = evt => { evt.currentTarget.style.backgroundColor =
		evt.type == 'mouseenter' ? '#FFA50040' : evt.currentTarget.dataset.backgroundColor || null };
}

function applyOnCtrlClick(tr) {
	function updateStyle(state) {
		tr.style.cursor = state ? 'pointer' : 'auto';
		tr.style.backgroundColor = state ? '#FFA50040' : tr.dataset.backgroundColor || null;
	}

	tr.dataset.confirm = true;
	const eventHandler = evt => { updateStyle(evt.ctrlKey) }, events = ['keyup', 'keydown'];
	const listenerChanger = name => { for (let evt of events) document[name + 'EventListener'](evt, eventHandler) };
	tr.onclick = evt => evt.ctrlKey ? updateEdition(evt) : true;
	tr.onmouseenter = evt => { updateStyle(evt.ctrlKey); listenerChanger('add') };
	tr.onmouseleave = evt => { updateStyle(false); listenerChanger('remove') };
	setTooltip(tr, 'Use Ctrl to apply edition info from this release', { position: 'right' });
}

function addLookupResults(torrentId, ...elems) {
	if (!(torrentId > 0)) throw new Error('Invalid argument'); else if (elems.length <= 0) return;
	let elem = document.getElementById('torrent_' + torrentId);
	if (elem == null) throw '#torrent_' + torrentId + ' not found';
	let container = elem.querySelector('div.toc-lookup-tables');
	if (container == null) {
		if ((elem = elem.querySelector('div.linkbox')) == null) throw 'linkbox not found';
		elem.after(container = Object.assign(document.createElement('div'), {
			className: 'toc-lookup-tables',
			style: 'margin: 10pt 0; padding: 0; display: flex; flex-flow: column; row-gap: 10pt;',
		}));
	}
	(elem = document.createElement('div')).append(...elems);
	container.append(elem);
}

function decodeHTML(html) {
	const textArea = document.createElement('textarea');
	textArea.innerHTML = html;
	return textArea.value;
}

const promptEx = (title, prompt, required, input, ...options) => new Promise(function(resolve) {
	const dialog = Object.assign(document.createElement('dialog'), {
		style: 'margin: auto; padding: 15pt; color: white; background-color: #444; border: 2pt solid #222; box-shadow: 0 0 10pt black;',
		onclose: function(evt) {
			evt.currentTarget.remove();
			resolve(evt.currentTarget.returnValue == 'OK' ? Object.assign({ input: releaseId.value }, options) : null);
		},
		ondragover: evt => false, ondrop: evt => false,
	}), form = Object.assign(document.createElement('form'), {
		method: 'dialog',
		style: 'display: flex; flex-flow: column; row-gap: 7pt; width: 35em; font: 9pt "Noto Sans", sans-serif; user-select: none;',
		onsubmit: function(evt) {
			options = [ ];
			for (let input of evt.currentTarget.querySelectorAll('input[type="checkbox"]')) {
				const groupNdx = parseInt(input.closest('fieldset').dataset.index), index = parseInt(input.dataset.index);
				console.assert(groupNdx >= 0 && index >= 0);
				if (!(groupNdx in options)) options[groupNdx] = [ ];
				options[groupNdx][index] = input['state' in input ? 'state' : 'checked'];
			}
		},
	}), releaseId = Object.assign(document.createElement('input'), {
		type: 'text',
		style: 'display: block; width: 100%; box-sizing: border-box; font: 10pt "Noto Sans", sans-serif;',
		value: input || '', required: required, disabled: Boolean(input),
		autocomplete: 'off',
		oninput: evt => { if (optionsGroup != null) optionsGroup.disabled = !evt.currentTarget.value },
		selectionStart: 0, selectionDirection: 'backward',
	});
	form.append(Object.assign(document.createElement('div'), {
		textContent: title,
		style: 'margin-bottom: 5pt; font-weight: bold; font-size: medium; color: coral;',
	}));
	if (prompt) {
		const label = Object.assign(document.createElement('label'), {
			textContent: prompt,
			style: 'white-space: pre-line;',
		});
		releaseId.style.marginTop = '4pt';
		label.append(releaseId);
		form.append(label);
	} else form.append(releaseId);
	options.forEach(function(optionsGroup, groupIndex) {
		const fieldset = Object.assign(document.createElement('fieldset'), {
			style: 'box-sizing: border-box; padding: 5pt; display: flex; flex-flow: column; row-gap: 4pt; border: 4pt groove #555;',
			className: 'prompt-options-' + (groupIndex + 1),
			disabled: groupIndex == 0 && !Boolean(input),
		});
		fieldset.dataset.index = groupIndex;
		optionsGroup.forEach(function(option, index) {
			if (!option[0]) return;
			const label = Object.assign(document.createElement('label'), {
				style: 'display: block;',
			}), checkbox = Object.assign(document.createElement('input'), { type: 'checkbox', style: 'margin-right: 5pt;' });
			if (option[2]) label.title = option[2];
			checkbox.dataset.index = index;
			if (typeof option[1] == 'number') {
				(checkbox.update = function(state) {
					[this.state, this.checked, this.indeterminate] = [state || 0, state > 0, state == 1];
				}).call(checkbox, option[1]);
				checkbox.onchange = evt => { evt.currentTarget.update({ 0: 2, 1: 0, 2: 1 }[evt.currentTarget.state]) };
			} else {
				checkbox.checked = Boolean(option[1]);
				if (option[1] === null) [label, checkbox].forEach(elem => { elem.disabled = true });
			}
			label.append(checkbox, option[0]);
			fieldset.append(label);
		});
		if (fieldset.childElementCount > 0) form.append(fieldset);
	});
	const optionsGroup = form.querySelector('fieldset.prompt-options-1'), buttons = document.createElement('div');
	buttons.style = 'display: flex; flex-flow: row; justify-content: flex-end; column-gap: 5pt; margin-top: 5pt;';
	const buttonStyle = 'flex-basis: 5em; cursor: pointer; font: 9pt "Noto Sans", sans-serif;';
	buttons.append(Object.assign(document.createElement('input'), {
		type: 'submit',
		value: 'OK',
		style: buttonStyle,
	}), Object.assign(document.createElement('input'), {
		type: 'button',
		value: 'Cancel',
		style: buttonStyle,
		onclick: evt => { dialog.close() },
	}));
	form.append(buttons);
	dialog.append(form);
	document.body.append(dialog);
	dialog.showModal();
});

const anyBracketsStripper = title => (title || '').replace(new RegExp('\\s+(?:' + ['()', '[]', '{}'].map(brackets => {
	brackets = Array.from(brackets, b => '\\' + b);
	let anyChars = `[^${brackets.join('')}]*`;
	anyChars = `${anyChars}(?:${brackets[0]}${anyChars}${brackets[1]}${anyChars})*`;
	return [brackets[0], anyChars, brackets[1]].join('');
}).join('|') + ')', 'g'), '');
function bracketsMatcher(brackets, mode = 0b11, ...matchPhrases) {
	if (!Array.isArray(brackets)) brackets = [brackets];
	brackets = brackets.filter(brackets => brackets && brackets.length >= 2);
	if (brackets.length <= 0) throw new Error('Invalid brackets');
	return '(?:' + brackets.map(function(brackets) {
		brackets = Array.from(brackets, b => '\\' + b);
		let anyChars = `[^${brackets.join('')}]*`, pattern = [ ];
		anyChars = `${anyChars}(?:${brackets[0]}${anyChars}${brackets[1]}${anyChars})*`;
		if (mode & 0b10) pattern.push(anyChars);
		if (matchPhrases.length > 0) pattern.push(`(?:${matchPhrases.join('|')})`);
		if (mode & 0b01) pattern.push(anyChars);
		return `${brackets[0]}(${pattern.join('')})${brackets[1]}`;
	}).join('|') + ')';
}
const rxBracketsMatcher = (brackets, mode, ...matchPhrases) =>
	new RegExp('\\s+' + bracketsMatcher(brackets, mode, matchPhrases), 'i');
const bracketsStripper = (title, ...matchPhrases) => (title || '').trim().replace(new RegExp('\\s+(?:' +
	matchPhrases.map((matchPhrase, index) => matchPhrase
		&& bracketsMatcher(['()', '[]'], { 0: 0b01, 1: 0b11, 2: 0b10 }[index], matchPhrase))
			.filter(Boolean).join('|') + ')', 'gi'), '');
const trackTitleNorm = title => bracketsStripper(title,
	[phrases.live, /\b(?:(?:original|extended|album|single|LP|radio|club|explicit)\b|(?:7|10|12)["″])/.source, phrases.clean, phrases.feat].join('|'),
	['instrumental', 'acoustic', 'acappella', 'mono', 'stereo', 'multichannel', 'demo', 'rehearsal', 'karaoke', 'vocal']
		.map(cls => phrases[cls]).concat(/\b(?:take|session|unplugged)\b/.source).join('|'),
	[/\b(?:version|edit|mix|rework|dub)\b/.source, phrases.remix].join('|'),
);

const noLabel = GM_getValue('no_label_name', 'self-released');
const [rxNoLabel, rxBareLabel, rxNoCatno, rxCatNoRange] = [
	/^(?:(?:No(?:t\s+On)?\s+Label|None|iMD|Independ[ae]nt)\b|\[(?:no\s+label|none)\]$)|\b(?:Self[\-\s]?Released?)\b/i,
	[/^(?:The)\s+|(?:\s+\b(?:Record(?:ings|s)?|(?:Productions?|Publishing)s?|Corporation|Limited|Int(?:ernationa|\')?l|Discos)\b|,?\s+(?:Ltd|Inc|Co(?:rp)?|LLC|Intl)\.?)+$/ig, ''],
	/^(?:None|\[none\])$/i, /^(.*?)(\d+)~(\d+)$/,
];
const phrases = {
	feat: /\bF(?:eaturing\b|(?:(?:ea)?t)?\/|(?:ea)?t\b\.?)(?!\S)/.source,
	soundtrack: /\b(?:Soundtrack|Score|Cast)\b/.source,
	live: /\b(?:Live|Unplugged|(?:En|Ao) (?:Vivo|Directo?))\b/.source,
	instrumental: /\b(?:Inst(?:rumental\b|r?\b\.)|Enst(?:rümantal\b|r?\b\.)|Instrumentaal\b)/.source,
	acoustic: /\b(?:Acoust(?:ic\b|\.))/.source,
	acappella: /\b(?:A\s?cc?app?ell?a)\b/.source,
	mono: /\b(?:Mono)\b/.source,
	stereo: /\b(?:Stereo)\b/.source,
	multichannel: /\b(?:Multichannel|Quadr[ao]phonic|[57]\.1)|4\.[01]\b/.source,
	clean: /\b(?:Clean|Censored)\b/.source,
	remix: /\b(?:(?:Re-?)?Mix(?:e[ds])?|RMX)\b/.source,
	demo: /\b(?:Demo)\b/.source,
	rehearsal: /\b(?:Rehearsals?)\b/.source,
	karaoke: /\b(?:Karaoke)\b/.source,
	vocal: /\b(?:Vocal)\b/.source,
	unplugged: /\b(?:Unplugged)\b/.source,
};
const editableHosts = GM_getValue('editable_hosts', ['redacted.sh']);
const incompleteEdition = /^(?:\d+ -|(?:Unconfirmed Release(?: \/.+)?|Unknown Release\(s\)) \/) CD$/;
const minifyHTML = html => html.replace(/\s*(?:\r?\n)+\s*/g, '');
const svgFail = (color = 'red', height = '0.9em') => minifyHTML(`
<svg height="${height}" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
	<circle fill="${color}" cx="50" cy="50" r="50"/>
	<polygon fill="white" clip-path="circle(35)" points="19.95,90.66 9.34,80.05 39.39,50 9.34,19.95 19.95,9.34 50,39.39 80.05,9.34 90.66,19.95 60.61,50 90.66,80.05 80.05,90.66 50,60.61"/>
</svg>`);
const svgCheckmark = (color = '#0c0', height = '0.9em') => minifyHTML(`
<svg height="${height}" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
	<circle fill="${color}" cx="50" cy="50" r="50"/>
	<path fill="white" d="M70.78 21.13c-2.05,0.44 -2.95,2.61 -3.98,4.19 -1.06,1.6 -2.28,3.22 -3.38,4.82 -6.68,9.75 -13.24,19.58 -19.9,29.34 -1.47,2.16 -1.1,1.99 -1.8,1.24 -1.95,-2.07 -4.14,-3.99 -6.18,-6.1 -1.36,-1.4 -2.72,-2.66 -4.06,-4.11 -1.44,-1.54 -3.14,-2.77 -5.29,-1.72 -1.18,0.57 -3.2,2.92 -4.35,3.98 -4.54,4.2 0.46,6.96 2.89,9.64 1.29,1.43 2.71,2.78 4.08,4.14 2.75,2.73 5.42,5.46 8.24,8.12 1.4,1.33 2.66,3.09 4.46,3.84 2.15,0.9 4.38,0.42 5.87,-1.39 1.03,-1.24 2.32,-3.43 3.31,-4.86 8.93,-12.94 17.53,-26.19 26.5,-39.06 1.1,-1.59 2.82,-3.29 2.81,-5.35 -0.02,-2.35 -2.03,-3.22 -3.69,-4.36 -1.69,-1.16 -3.25,-2.84 -5.53,-2.36z"/>
</svg>`);
const svgQuestionMark = (color = '#eb0', height = '0.9em') => minifyHTML(`
<svg height="${height}" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
	<circle fill="${color}" cx="50" cy="50" r="50"/>
	<path fill="white" fill-rule="nonzero" d="M74.57 31.75c0,7.23 -3.5,13.58 -10.5,19.08 -2.38,1.9 -4.05,3.55 -5.03,4.99 -0.99,1.43 -1.47,3.21 -1.47,5.33l0 1.7 -16.4 0 0 -4.3c0,-5.97 1.97,-10.63 5.92,-14.02 2.56,-2.18 4.21,-3.68 4.94,-4.5 0.74,-0.81 1.27,-1.6 1.57,-2.35 0.32,-0.75 0.47,-1.63 0.47,-2.63 0,-1.23 -0.55,-2.28 -1.63,-3.13 -1.11,-0.85 -2.51,-1.27 -4.24,-1.27 -5.25,0 -10.76,2.1 -16.53,6.3l0 -19.17c2.12,-1.2 4.98,-2.23 8.58,-3.11 3.6,-0.89 6.82,-1.32 9.68,-1.32 7.99,0 14.09,1.57 18.3,4.72 4.22,3.13 6.34,7.7 6.34,13.68zm-13 45c0,2.9 -1.05,5.27 -3.15,7.12 -2.1,1.85 -4.92,2.78 -8.47,2.78 -3.43,0 -6.21,-0.95 -8.36,-2.85 -2.15,-1.9 -3.22,-4.25 -3.22,-7.05 0,-2.85 1.05,-5.17 3.15,-6.95 2.1,-1.77 4.92,-2.65 8.43,-2.65 3.48,0 6.28,0.88 8.42,2.65 2.13,1.78 3.2,4.1 3.2,6.95z"/>
</svg>
`);
const svgAniSpinner = (color = 'orange', phases = 12, height = '0.9em') => minifyHTML(`
<svg fill="${color}" style="scale: 2.5;" height="${height}" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
${Array.from(Array(phases)).map((_, ndx) => `
<rect x="47.5" y="27" rx="2.5" ry="4.16" width="5" height="16" transform="rotate(${Math.round((phases - ndx) * 360 / phases)} 50 50)">
	<animate attributeName="opacity" values="1; 0;" keyTimes="0; 1;" dur="1s" begin="${Math.round(-1000 * ndx / phases)}ms" repeatCount="indefinite"></animate>
</rect>`).join('')}</svg>`);
const staticIconColor = 'cadetblue';
const chord = new Audio('data:audio/aac;base64,//FMQAF//ADQQAf/8UxAFf/8AN6b3D68rFAn/p/KSqmyHWgUBD+rAokPVgUSHrWLwCIl9q/zWEP5WP8cQlwXxmT/jjf1ByO18ikP10/2AyGz+BxP45f2MCM0FZBwpLPKYRrI34pKYvMU84jGW8LBIwSklAgzS7WLmvM23cvDCimOSaZdsqQYcMaYBphoRmtqDg/1/z9PsAOrS+3s7ewA6Ov447ezt4coAA+WdzG9WrUBn/brq1agIuHA//FMQFD//ADamn79M39bQ26UGjaf9m/9jHM79//L/Xv+P+tqGd/+3/9nP7/9YTd+T1+kGo9fw96/WvDxT+vgBXnrYAuPXgABQP6+AFAetgChCGh+9JDxb/hO9tyZE8tJgbst3E2W5bSQn4OZIN0tIMgdtE68mTw0I7hQSkcg8XhaGH67OqrWPURuSXT8JVvScOcX1NV+Ub09aEnMhisLi06/OWnlwl038khPsv8/LHjSadJtOd4bbZy9XkEnEbVdQy/yPMe0tVEhJ7rz5QIGu1VRlaBUddEgDh8tfmxacp7uZ+8vuHjomi443RbSa2N7gLhPMA5YABP6TfMsl/myvpATv/1gSX9UP9DpH6Wf0niH+Ar/VmQ+pvx3I/6KnySSvf1oCP82j9o5L6r/zwSf+JB/R71ddEOM7rlapypL6NJmk2AQPG1UTVFEkFfUBBJ2UqVEITP5spnprsodjRrxxzISKc4Muo2rq+B8u4y/OSlcb8UP/1xP9reEdvvyp3K3K37NJ31D60A08cFGTj1I/NKwKHtWkDZeA59Vr6UMiLZ4ogGHKEGnPY8GhpJNUW6AXo/N7CbN6fSZUJuoKoT8eBPoyXTFMN0+T5ir3JNoKT3gvvF9wLF7unhHr8nZS9WaK5nsyvvDwRfLsoHGzL0c9MGhBk3ix2yVgUWTiEPulr4l9Ui70ZUAEGVW4lI2AMaMHPjcm5fnShGpox4bNywObgWo/BORTrjfLoo3Gn7B68PzvIciu+lPzdmsUgHPrC1niabRdul0rk0AyCa0UIk6dLtt9ZQ2An5RbGRZpF8kX7I6iWABhChRjhXgASILrVwLgAKTTYcxFAAZfU6penkADe67gT7LAA7/8UxAJd/8APbXLagqMoYCoYC41Y5QC/1zn5dFfj5u2mKLVjWSpFAm0LlPKhiIitJhKlZp6mmrGzblUfBCRUTMDJzbEp9dY6jJaWhi2GbdI+sxjiP0msQWDnpaTfKjoR7bHukbW5d5k/7rRceeAILHvC03EgeAURLyMKIZbictA2c1dcZXZ6EnGC077/ooEjaNso5JlmGOnqRIxyx43CnUx06gGUV1Onwes9VllQG8dG55vd7fhmiOvHRuRm65/S1140BdOOuzP8LkA339G9xx+7vlK468dFC963/KL114gC175374gAjdwm/nUBcbuAiY+c1cbAIZ3HPkALjdxl3awXpCanLLLLqv+X/bX0UAAY+N+dwsssgC7x1ep5vjddlllIIvHHHV+L+bhpTIB//xTEA4v/wBADctKCtDht8ksUhsThALnO9uR8efVarfW+fI3IKVFJkYeFyp66ssep3P0FiztjqIupw9LE2lI7jnpHRyydjLkrKqJMtopdbcbRTYRW8ha8VEJmMukfcqqMWY5u8u8aBP69k4f3e0a+Ppq2lOisMY7o+zW+CpQXj9Otc1ERMvLUj0uP1aH8+1gMgWTlc2mRBhhmKetU8q8XcxT+Gt4+PnwtpOiipW5m7dewVj6tz1QCpiPAAGuVgw5vzbkjwImET5GGGMGTRWNcWjLnuux5WDGKyKBpSKP6Pq1S4y78lROqizQAVhgFLY2MY996TIS/JhizBi4ilppNRtszoTCVkoABE8t2/NVPQTrXaQCgBorcczdaXik/49IKwwABrlHiwOWGfOTCdAAAZesthaanLw3fQooAaK9JpyqoI2xfiC0WAAaojOpC5Yp05Sq4Mp4PA6bjdr9j/JtXEN23vdm7zW7++dMF6ut3bk9D3T0b9nwykqdHQ6bLqfF/ZuLiFafPOImpo4g4gAAAVKlSit6uwVmMUAAAAAAGHTf/iaIAP/I+W8IAAAAAABuP+U3gsAAAAAAqOvvB0oAAByPh84HP/xTEA3v/wA9jcv6JMAXp7+9UufTaUvclXRNwUEZlHa5VbaSJJIhXYTXXsc+VEWIkmJvE/hHBTZAcLKtEncmkUYkhUJ+HTqCojj+bHxE2qOOkSWk4sTwC8eV3trHc8923aBIbqr6r8nawSC6eP5VXshEkYYhJorzqj5bRlCgk2ddh70KAdjjPf1kRPoHNcviJCoyeLOZ8DEDswnHckaPwj94RLEJKJxBYEAdz0nqhy3w7/R/xWAwsvrY5ZihTmFuLMql0p9IoKJbCwIUCPD54v2en73zW6Kkg221nxwMgCiru19x1PgP6bQkEEECFupYPRow+7ycRGnPjjjvUasaCQ2PSGdSPJwQQQQWP2BRgkAkPHw70PjjjjjwxGxOeJvEyi2mIIIIII7zEredi7sPaBRpZo6NuFHmlrbXdmw14AAiBunxFpYfM6gwhUAANRsSoO8J333dHKuWAGCHVtknSOjROtlQQAAc+sCqA8DbXLq2OAAYwLZ5ujSRSnbTQIUAGsaRcxHYTlvrBrHLAAUEJ/HbyvmH6XxMIAOX9o/5QANT89/tOYAZ/z3zrQACv2X3jhgBfvX4HgAAw+jSBz/8UxAIB/8AQIXLYgoKyEEaAEoxEAn8cp63XXE6dfUshYAozMmclysjYj4PHw8RGbmCOapfRVMDVvVPTXy1olu1FvFJOhEjC2lGM0p6a4jfqebcFVMSfeIvwqS20lOhZlRqM1D7V3rYGhkqFJi0mi+DM/yJFYnp0YYSffj5FZHNre3X4Y+f7eahxYnv8LcMNvw3VMDmxYLNTP5L6BBCc8Z5K5OuJHsa+xBX1nentZ00T/+WiTm+e0+N/gjlbqP6r9Kc3LDzryRpSj57oieH8V00VxfjeqGjh7LrQdr2QK4gAGJ7/ly/l8vprIMT3dn18vhrAC+3u7O+AfD3RDxfCDg');
const uncalibratedReadOffset = logStatus => 'issues' in logStatus
	&& logStatus.issues.some(RegExp.prototype.test.bind(/\b(?:read offset)\b/i));
const autoOpenTab = GM_getValue('auto_open_tab', true);
const editionSearch = GM_getValue('edition_search', true);
let discogsBindingsCache, amBindingsCache, mbInstrumentsCache;
const releaseTitleNorm = title => title && [
	/\s+(?:EP|E\.\s?P\.|-\s+(?:EP|E\.\s?P\.|Single|Live))$/i,
	/\s+\((?:EP|E\.\s?P\.|Single|Live)\)$/i, /\s+\[(?:EP|E\.\s?P\.|Single|Live)\]$/i,
].reduce((title, rx) => title.replace(rx, ''), title.trim());
const getMBEditObjects = (entity, mbid) => GlobalXHR.get([mbOrigin, entity, mbid, 'edit'].join('/'), { recoverableErrors: [429] }).then(function({document}) {
	const objects = { }, sourceEntity = (function(scripts) {
		for (let script of scripts) {
			let obj = /^Object\.defineProperty\(window,\s*"__MB__",\s*(.+)\);?$/.exec(script?.text?.trim());
			if (obj != null) try {
				if ((obj = eval(obj[1])) && (obj = obj['$c']) && (obj = obj.stash) && (obj = obj.source_entity))
					return Object.freeze(obj);
			} catch(e) { console.warn(e) }
		}
	})(document.getElementsByTagName('script'));
	if (sourceEntity) Object.defineProperty(objects, 'sourceEntity', { value: sourceEntity });
	document.body.querySelectorAll('div#release-editor select[id]').forEach(function(select) {
		function getter(property, allowLoose = false) {
			if (!property) return;
			let x = Object.keys(this).find(key => sameStringValues(key, property));
			if (x) return this[x]; else if (!allowLoose) return;
			const normStr = str => toASCII(str).toLowerCase();
			x = Object.keys(this).map(key => jaroWinklerSimilarity(normStr(key), normStr(property)));
			if ((x = x.indexOf(Math.max.apply(this, x))) >= 0) return Object.values(this)[x];
		}

		if (select.options.length <= 0) return;
		const target = Object.assign.apply(this, Array.from(select.options,
			option => ({ [option.text]: parseInt(option.value) }))
				.filter(elem => Object.values(elem).every(value => !isNaN(value))));
		Object.defineProperty(target, 'get', { value: getter });
		Object.defineProperty(objects, select.id.toLowerCase() + 'Ids', { value: target });
	});
	return Object.freeze(objects);
});
const mbCreateEdit = (edits, editNote, makeVotable = true) => GlobalXHR.post(mbOrigin + '/ws/js/edit/create', {
	edits: edits,
	editNote: editNote || null,
	makeVotable: makeVotable,
}, { responseType: 'json', recoverableErrors: [429], fatalErrors: [500] }).then(({json}) => json.edits);
let pendingWorks = sessionStorage.getItem('pendingMBWorks');
if (pendingWorks) try { pendingWorks = JSON.parse(pendingWorks) } catch(e) { console.warn(e) }
if (!Array.isArray(pendingWorks)) pendingWorks = [ ];

function deleteOrphanEntity(entity, id, editId, addComment = true) {
	const entities = ['release-group', 'release', 'recording', 'work'];
	const inc = entities.map(entity => entity + '-rels');
	if (['artist'].includes(entity)) inc.push('release-groups');
	if (['artist', 'label'].includes(entity)) inc.push('releases');
	if (['artist'].includes(entity)) inc.push('recordings');
	if (['artist'].includes(entity)) inc.push('works');
	return mbApiRequest(entity + '/' + id, { inc: inc.join('+') }).then(function(entry) {
		function cancelEdit(editId) {
			if (!(editId > 0)) return Promise.reject('Invalid argument');
			const url = new URL(`edit/${editId}/cancel`, mbOrigin);
			url.searchParams.set('returnto', '/edit/' + editId);
			return GlobalXHR.post(url, new URLSearchParams({ 'confirm.edit_note': 'orphan ' + entity }), { recoverableErrors: [429] }).then(function({document}) {
				const status = document.body.querySelector('div#sidebar dl.edit-status > dd');
				return status != null && status.textContent.trim() == 'Cancelled' || Promise.reject('Cancelling edit failed');
				console.info('Edit %d successfully cancelled', editId);
				notify(`Edit ${editId} successfully cancelled`, 'purgesuccess');
			});
		}

		if (addComment) /*mbCreateEdit({
			edit_type: { 'artist': 2, 'label': 11, 'release-group': 21, 'release': 32, 'work': 42, 'place': 62, 'recording': 72, 'series': 141 }[entity],
			to_edit: entry.id,
			comment: 'do not use (waiting for deletion)',
		}).catch(reason => */GlobalXHR.post([mbOrigin, entity, id, 'edit'].join('/'), new URLSearchParams({
			[`edit-${entity}.name`]: entry.name || entry.title,
			[`edit-${entity}.title`]: entry.title || entry.name,
			[`edit-${entity}.comment`]: 'do not use (waiting for deletion)',
			[`edit-${entity}.edit_note`]: '',
		}), { responseType: null })/*)*/;
		if ('relations' in entry && entry.relations.some(relation => entities.map(entity =>
				entity.replaceAll('-', '_')).includes(relation['target-type']))) return false;
		if (entities.some(function(entity) {
			const entities = entity + 's';
			return entities in entry && Array.isArray(entry[entities]) && entry[entities].length > 0;
		})) return false;
		const getOpenCreateEdit = (entity, mbid) => getMBEditObjects(entity, entry.id).then(function({sourceEntity}) {
			if (!sourceEntity.editsPending) return Promise.reject('Entity not cancellable');
			const url = new URL('search/edits', mbOrigin);
			url.searchParams.set('order', 'asc');
			url.searchParams.set('negation', 0);
			url.searchParams.set('combinator', 'and');
			url.searchParams.set('conditions.0.field', entity);
			url.searchParams.set('conditions.0.operator', '=');
			url.searchParams.set('conditions.0.args.0', sourceEntity.id);
			return GlobalXHR.get(url);
		}).then(function({document}) {
			const edits = document.body.querySelectorAll('div#edits form > div.edit-list');
			if (edits.length <= 0) return Promise.reject('Assertion failed: No edits for entity');
			let editId = edits[0].querySelector('div.edit-header.open.edit-add > h2 > a');
			if (editId == null) return Promise.reject('Entity not cancellable');
			if ((editId = /\/edit\/(\d+)\b/.exec(editId.href)) == null) throw 'Assertion failed: can not extract edit id';
			return parseInt(editId[1]);
		});
		const createEdits = () => getMBEditObjects(entity, entry.id).then(function({sourceEntity}) {
			const edits = sourceEntity.relationships.filter(relationship => !relationship.editsPending)
				.map(relationship => ({ edit_type: 92, id: relationship.id, linkTypeID: relationship.linkTypeID }));
			return edits.length > 0 ? mbCreateEdit(edits, `orphan ${entity}, preparing for auto-deletion`, false).then(function(edits) {
				if (!edits.every(edit => edit.response == 1))
					return Promise.reject(`${entity} id ${entry.id}: not all edits were accepted`);
				console.info('Orphan %s %s (%s) successfully prepared for auto-deletion', entity, entry.name, entry.id, edits);
				notify(`Orphan ${entity} ${entry.name} successfully prepared for auto-deletion`, 'purgesuccess');
				return true;
			}) : false;
		});
		return (editId > 0 ? Promise.resolve(editId) : editId === undefined ? getOpenCreateEdit(entity, id) : Promise.reject('edit not inspected'))
			.then(cancelEdit).catch(createEdits);
	});
}

function caselessProxy(target, writable = false) {
	const findProperty = (target, property) => (property = (property || '').toLowerCase(),
		Object.keys(target).find(key => key.toLowerCase() == property));
	return new Proxy(target instanceof Object ? target : { }, {
		get: (target, property) => Reflect.get(target, findProperty(target, property)),
		has: (target, property) => Boolean(findProperty(target, property)),
		set: writable ? (target, property, value) => Reflect.set(target, findProperty(target, property) || property, value) : () => false,
		deleteProperty: writable ? (target, property) => Reflect.deleteProperty(target, findProperty(target, property)) : () => false,
	});
}

const notifyPalette = caselessProxy({
	// MBID lookups
	FoundInCache: 'BurlyWood',
	FoundByBacklink: 'Coral',
	FoundByReleases: 'Magenta',
	FoundByTracks: '#ffcc99',
	foundByArtists: '#ff99cc',
	FoundByRecordings: '#cc6b5a',
	FoundByUrl: '#e29450',
	FoundBySimilarity: '#ff5c8a',
	FoundbyUniqueMatch: 'Chocolate',
	RGFound: '#b366ff',
	RecordingFound: 'Orange',
	// New entries to database
	EntityCreated: '#99ff33',
	AliasCreated: '#29d600',
	// Other matching
	LanguageIdentified: '#cccc00',
	LayoutMatched: '#c3eb00',
	// Edits
	TagsAdded: '#99ddff',
	AnnotationAdded: '#b3ccff',
	EditSuccess: 'Aqua',
	EditPartialSuccess: '#00b3b3',
	// Purging orpan entities
	LoadPage: '#66ffb3',
	PurgrProgress: '#ff00ff',
	PurgeSuccess: '#e6e600',
});

function orphansCleanupResults(results) {
	if (results.length <= 0) return alert('No entities to process found');
	const total = results.filter(Boolean).length;
	alert(`${results.length} entities successfully cleaned from orphan list (${total} prepared for deletion)`);
}
function processPendingWorks() {
	if (pendingWorks.length <= 0) return alert('There are currently no pending works');
	let worksToGo = pendingWorks.length;
	console.info('%d works to go', worksToGo);
	notify(`${worksToGo} works to go`, 'purgeprogress');
	Promise.all(pendingWorks.map(workId => deleteOrphanEntity('work', workId).then(function(result) {
		const index = pendingWorks.indexOf(workId);
		if (index < 0) console.warn('Assertion failed: work id %s not found in pending works', workId);
		pendingWorks.splice(index, 1);
		sessionStorage.setItem('pendingMBWorks', JSON.stringify(pendingWorks));
		return result;
	}).catch(console.warn).then(function(result) {
		if (--worksToGo % 100 == 0 && worksToGo > 0) {
			console.info('%d works to go', worksToGo);
			notify(`${worksToGo} works to go`, 'purgeprogress');
		}
		return Boolean(result);
	}))).then(orphansCleanupResults);
}

if (pendingWorks.length > 0
		&& confirm(`There are ${pendingWorks.length} orphan works left from previous run, delete them now?`))
	processPendingWorks();

if (GM_getValue('enable_orphans_scanner', false)) GM_registerMenuCommand('Purge orphan entities created by me', function() {
	function loadEdits(editTypes, page = 1) {
		console.assert(Array.isArray(editTypes) && editTypes.length > 0);
		console.info('Scanning entities created by me, page', page);
		notify('Scanning entities created by me, page ' + page, 'loadpage');
		const url = new URL('search/edits', mbOrigin);
		url.searchParams.set('order', 'desc');
		url.searchParams.set('negation', 0);
		url.searchParams.set('combinator', 'and');
		url.searchParams.set('conditions.0.field', 'editor');
		url.searchParams.set('conditions.0.operator', 'me');
		url.searchParams.set('conditions.1.field', 'type');
		url.searchParams.set('conditions.1.operator', '=');
		for (let editType of editTypes) url.searchParams.append('conditions.1.args', editType);
		url.searchParams.set('conditions.2.field', 'status');
		url.searchParams.set('conditions.2.operator', '=');
		url.searchParams.append('conditions.2.args', 1);
		url.searchParams.append('conditions.2.args', 2);
		url.searchParams.set('page', page);
		return GlobalXHR.get(url, { recoverableErrors: [429] }).then(({document}) => document);
	}

	const rxMBID = new RegExp(`(?:^|\\/)([\\w\\-]+)\\/${mbID}\\b`, 'i');
	const getEdits = (document, callback) => Array.from(document.body.querySelectorAll('div#edits > form div.edit-list table.details:first-of-type th + td a:is(td > :first-child, td > span:first-child > a)'), function(a) {
		const entity = rxMBID.exec(a.href);
		return callback(entity != null ? entity[1] : null, entity != null ? entity[2] : null, (function() {
			if (entity == null) return 'Invalid entity URL: ' + a.href;
			let editId = a.closest('div.edit-list').querySelector('div.edit-header.open.edit-add > h2 > a');
			if (editId != null) editId = /\bedit\/(\d+)\b/i.exec(editId.href);
			return editId != null && parseInt(editId[1]) || 0;
		})());
	});
	const haveNextPage = document => Array.prototype.some.call(document.body.querySelectorAll('ul.pagination > li:last-of-type > a'), a => a.textContent.trim() == 'Next');
	const methods = [
		function(startFromPage) {
			const scanPage = (page = 1) => loadEdits([41], page).then(function(document) {
				const workIds = getEdits(document, (entity, workId, param) =>
					{ if (workId) return workId; else console.warn(param) }).filter(Boolean);
				return haveNextPage(document) ? scanPage(page + 1).then(Array.prototype.concat.bind(workIds)) : workIds;
			});
			return scanPage(startFromPage).then(function(workIds) {
				if (workIds.length <= 0) return alert('No works to process found');
				Array.prototype.push.apply(pendingWorks, workIds.filter(workId => !pendingWorks.includes(workId)));
				sessionStorage.setItem('pendingMBWorks', JSON.stringify(pendingWorks));
				notify(`Total ${workIds.length} works added to processing list, starting deep scan now`, 'purgeprogress');
				processPendingWorks();
			});
		},
		function(startFromPage) {
			const scanPage = (page = 1) => loadEdits([10 /* label */, 41 /* work */, 61 /* place */ , 140 /* series */], page)
				.then(document => Promise.all(getEdits(document, (entity, id, param) =>
					entity && id ? deleteOrphanEntity(entity, id, param) : Promise.reject(param))
						.map(safePromiseHandler)).then(results => haveNextPage(document) ?
							scanPage(page + 1).then(Array.prototype.concat.bind(results)) : results));
			return scanPage(startFromPage).then(orphansCleanupResults);
		},
	];
	methods[1]();
});

function objectsEqual(a, b) {
	function cmp(a, b) {
		for (let prop in a) if (a.hasOwnProperty(prop) && (!b.hasOwnProperty(prop)
				|| (typeof a[prop] == 'object' ? !objectsEqual(a[prop], b[prop]) : a[prop] !== b[prop])))
			return false;
		return true;
	}

	return [a, b].every(o => o == null) || [a, b].every(Boolean) && cmp(a, b) && cmp(b, a);
}

class BindingsCacheEditor {
	static lastOpened;

	#storageEntry; #idExtractor; #svgLogo; #entryResolver;

	constructor(storageEntry, idExtractor, svgLogo, entryResolver) {
		if (!storageEntry || typeof idExtractor != 'function') throw 'Invalid constructor call';
		[this.#storageEntry, this.#idExtractor, this.#svgLogo] = [storageEntry, idExtractor, svgLogo];
		if (typeof entryResolver == 'function') this.#entryResolver = entryResolver;
	}

	edit(bindingsCache) {
		return document.getElementById(this.#storageEntry) == null ? new Promise((resolve, reject) => {
			this.constructor.lastOpened = Date.now();
			if (!bindingsCache) bindingsCache = GM_getValue(this.#storageEntry, { });
			const cacheChangeListener = GM_addValueChangeListener(this.#storageEntry,
				(name, oldVal, newVal, remote) => { bindingsCache = newVal });
			const font = 'font: 9pt &quot;Noto Sans&quot;, sans-serif;';
			const btnStyle = 'flex-basis: 6em; cursor: pointer; ' + font;
			const options = ['artist', 'label', 'place', 'series'];
			const textInput = (side, width = '22em') => `
<div class="${side}" style="position: relative;">
	<label>
		<span style="display: inline-block; width: 4em;">ID:</span>
		<input type="text" name="${side}-id" style="width: ${width}; box-sizing: content-box; margin: 0; font-family: monospace; transition: 100ms;" />
	</label>
	<div style="height: 3em; margin-top: 4pt; display: flex; flex-flow: row;">
		<span class="${side}-logo" style="display: inline-block; flex: 4em 0 0;"></span>
		<span class="${side}-info" style="line-height: 1; overflow: clip; text-overflow: ellipsis; visibility: collapse; user-select: text;">
			<a class="${side}-link" target="_blank"></a>
			<span class="${side}-comment" style="margin-left: 5pt; color: #aaa;"></span>
		</span>
	</div>
	<div class="${side}-drag-overlay" style="position: absolute; pointer-events: none; opacity: 0; transition: 100ms ease-in-out; background-color: #ff0; width: 100%; height: 100%; top: 0; left: 0; box-shadow: 0 0 5pt #ff0; scale: 1.05 1.25;"></div>
</div>`;
			const dialog = Object.assign(document.createElement('dialog'), {
				id: this.#storageEntry,
				style: 'margin: auto; padding: 15pt; color: white; background-color: #444; border: 2pt solid #222; box-shadow: 0 0 10pt black;',
				innerHTML: minifyHTML(`
<form method="dialog" class="bindings-cache-editor" style="width: 33em; display: flex; flex-flow: column; row-gap: 15pt; ${font} user-select: none;">
	<div style="margin-bottom: 5pt; font-weight: bold; font-size: medium; color: gold; text-shadow: 0 0 10px black;">Bindings cache editor</div>
	<div class="entity" style="position: relative;">
		<label>
			<span style="display: inline-block; min-width: 4em;">Entity:</span>
			<select name="entity" style="width: 22em; box-sizing: content-box; margin: 0; padding: 4px;">
				${options.map(value => `<option value="${value.toLowerCase()}">${value[0].toUpperCase() + value.slice(1).toLowerCase()}</option>`).join('')}
			</select>
		</label>
	</div>
	${textInput('source')}${textInput('target')}
	<div style="position: relative; display: flex; flex-flow: row; justify-content: flex-end; column-gap: 5pt; margin-top: 5pt;">
		<input type="button" name="add-update" value="Add/Update" style="${btnStyle}" disabled />
		<input type="button" name="delete" value="Delete" style="${btnStyle}" disabled />
		<input type="button" name="close" value="Close" style="${btnStyle}" />
	</div>
</form>`),
				onclose: evt => {
					resolve(bindingsCache);
					GM_removeValueChangeListener(cacheChangeListener);
					evt.currentTarget.remove();
				},
				ondragover: evt => false,
				ondrop: evt => false,
			});
			const form = dialog.querySelector('form.bindings-cache-editor');
			const byName = name => form.elements.namedItem(name);
			const [entity, srcId, tgtId] = ['entity', 'source-id', 'target-id'].map(byName);
			entity.selectedIndex = 0;
			const [logos, infos, links, comments, overlays] = ['logo', 'info', 'link', 'comment', 'drag-overlay']
				.map(type => ['source', 'target'].map(side => form.querySelector(`*.${side}-${type}`)));
			logos.forEach((logo, index) => {
				if (logo == null) return;
				const svgLogo = [this.#svgLogo, 'mb_logo'][index];
				if (svgLogo) logo.innerHTML = GM_getResourceText(svgLogo); else return;
				if ((logo = logo.querySelector('svg')) == null) return;
				for (let attr of ['width', 'height']) logo.removeAttribute(attr);
				logo.style = 'height: 3em;';
			});
			const getSrcId = () => this.#idExtractor(srcId.value.trim().toLowerCase()) || undefined, getTgtIds = () => {
				let mbids = tgtId.value.trim().toLowerCase();
				if (mbids == 'null') return null;
				mbids = mbids.split(',').map(id => mbIdExtractor(id)).filter(Boolean);
				if (mbids.length > 0) return mbids.length > 1 ? mbids : mbids[0];
			}, changeListener = evt => {
				const id = getSrcId(), status = entity.value && id ? entity.value in bindingsCache
					&& id in bindingsCache[entity.value] ? 2 : 1 : 0;
				const updateBackground = (elem, error) => { elem.style.backgroundColor = error ? '#f004' : null };
				if (evt.currentTarget == srcId) {
					updateBackground(srcId, !id && srcId.value.length > 0);
					infos[0].style.visibility = 'collapse';
					if (id && this.#entryResolver) this.#entryResolver(entity.value, id).then(function(entry) {
						links[0].href = entry.url;
						links[0].textContent = entry.name || '';
						if (entry.disambiguation) comments[0].textContent = '(' + entry.disambiguation + ')';
						comments[0].hidden = !entry.disambiguation;
						infos[0].style.visibility = 'visible';
					});
				}
				const mbids = evt.currentTarget == tgtId ? getTgtIds()
					: status < 2 ? undefined : bindingsCache[entity.value][id];
				if ([entity, srcId].includes(evt.currentTarget)) tgtId.value = mbids === undefined ? ''
					: mbids === null ? 'null' : Array.isArray(mbids) ? mbids.join(', ') : mbids;
				if (evt.currentTarget == tgtId) updateBackground(tgtId, mbids === undefined && tgtId.value.length > 0);
				if ([entity, srcId, tgtId].includes(evt.currentTarget)) {
					infos[1].style.visibility = 'collapse';
					if (mbids && !Array.isArray(mbids)) mbApiRequest(entity.value + '/' + mbids).then(function(entry) {
						links[1].href = [mbOrigin, entity.value, entry.id].join('/');
						links[1].textContent = entry.name || entry.title || '';
						if (entry.disambiguation) comments[1].textContent = '(' + entry.disambiguation + ')';
						comments[1].hidden = !entry.disambiguation;
						infos[1].style.visibility = 'visible';
					});
				}
				buttons[0].disabled = status < 1 || mbids === undefined;
				buttons[0].value = ['Add/Update', 'Add', 'Update'][status];
				buttons[1].disabled = status < 2;
			};
			for (let elem of [entity, srcId, tgtId]) elem.onchange = changeListener;
			tgtId.title = 'Use valid MusicBrainz ID or "null" to not resolve the source entry';
			const inputParser = (data, idExtractor) => {
				if (!(data instanceof DataTransfer)) throw new Error('Invalid argument');
				if (!(data = data.getData('text/plain')) || !(data = data.trim().toLowerCase())) return;
				const tryEntity = entity => (entity = idExtractor(data, entity)) ? entity : undefined;
				let X = options.find(tryEntity);
				if (X) {
					entity.value = X;
					return tryEntity(X);
				} else if (X = idExtractor(data)) return X;
			};
			srcId.onpaste = evt => {
				const id = inputParser(evt.clipboardData, this.#idExtractor);
				if (!id) return false;
				evt.currentTarget.value = id;
				changeListener(evt);
				[evt.currentTarget.selectionStart, evt.currentTarget.selectionEnd] = [0, -1];
				return false;
			};
			tgtId.onpaste = evt => {
				const id = inputParser(evt.clipboardData, mbIdExtractor);
				if (!id) return false;
				const selStart = evt.currentTarget.selectionStart;
				evt.currentTarget.value = evt.currentTarget.value.slice(0, selStart) +
					id + evt.currentTarget.value.slice(evt.currentTarget.selectionEnd);
				changeListener(evt);
				[evt.currentTarget.selectionStart, evt.currentTarget.selectionEnd] = [selStart, selStart + id.length];
				return false;
			};
			const containers = ['source', 'target'].map(side => form.querySelector(`div.${side}`));
			containers.forEach((elem, index) => {
				elem.ondragover = evt => false;
				elem.ondrop = evt => {
					overlays[index].style.opacity = 0;
					const id = inputParser(evt.dataTransfer, [this.#idExtractor, mbIdExtractor][index]);
					const input = evt.currentTarget.querySelector('input[type="text"]');
					if (!id || input == null) return false;
					input.value = id;
					changeListener({ currentTarget: input });
					return false;
				};
				elem.ondragenter = elem[`ondrag${'ondragexit' in elem ? 'exit' : 'leave'}`] = function(evt) {
					if (!evt.currentTarget.contains(evt.relatedTarget))
						overlays[index].style.opacity = evt.type == 'dragenter' ? 0.2 : 0;
				};
			});
			const okStyle = elem => elem.animate([
				{ backgroundColor: null, offset: 0 },
				{ backgroundColor: 'green', offset: 0.1 },
				{ backgroundColor: null, offset: 1 },
			], { duration: 500 });
			const buttons = ['add-update', 'delete', 'close'].map(byName);
			buttons.forEach((button, index) => { button.onclick = [evt => {
				const [id, mbid] = [getSrcId(), getTgtIds()];
				if (!entity.value || !id || mbid === undefined) return;
				if (!(entity.value in bindingsCache)) bindingsCache[entity.value] = { };
				bindingsCache[entity.value][id] = mbid;
				GM_setValue(this.#storageEntry, bindingsCache);
				okStyle(evt.currentTarget);
				evt.currentTarget.value = 'Update';
				buttons[1].disabled = false;
			}, evt => {
				if (!(entity.value in bindingsCache)) return;
				const id = getSrcId();
				if (!id) return; else delete bindingsCache[entity.value][id];
				GM_setValue(this.#storageEntry, bindingsCache);
				okStyle(evt.currentTarget);
				srcId.value = '';
				changeListener({ currentTarget: srcId });
			}, evt => { dialog.close(evt.currentTarget.name) }][index] });
			document.body.append(dialog);
			dialog.showModal();
		}) : Promise.reject('Another editor instance is already open');
	}
}

function notify(html, color = 'white', length = 6) {
	if (!html) return; else color = notifyPalette[color] || color;
	let div = document.body.querySelector('div.mb-notification'), animation;
	if (div == null) {
		div = document.createElement('div');
		div.className = 'mb-notification';
		div.style = `
position: sticky; margin: 0 auto; padding: 5pt; bottom: 0; left: 0; right: 0; text-align: center;
white-space: nowrap; overflow-x: clip; text-overflow: ellipsis;
font: normal 9pt "Noto Sans", sans-serif; color: white; background-color: #000b; box-shadow: 0 0 7pt 2pt #000b;
cursor: default; z-index: 10000001; opacity: 0;`;
		animation = [{ opacity: 0, color: 'white', transform: 'scaleX(0.5)' }];
		document.body.append(div);
	} else {
		animation = [{ color: 'white' }];
		if ('timer' in div.dataset) clearTimeout(parseInt(div.dataset.timer));
	}
	div.innerHTML = html;
	div.animate(animation.concat(
		{ offset: 0.03, opacity: 1, color: color, transform: 'scaleX(1)' },
		{ offset: 0.80, opacity: 1, color: color },
		{ offset: 1.00, opacity: 0 },
	), length * 1000);
	div.dataset.timer = setTimeout(elem => { elem.remove() }, length * 1000, div);
}

for (let tr of Array.prototype.filter.call(document.body.querySelectorAll('table#torrent_details > tbody > tr.torrent_row'),
		tr => (tr = tr.querySelector('td > a')) != null && /\b(?:FLAC)\b.+\b(?:Lossless)\b.+\b(?:Log) \(\-?\d+\s*\%\)/.test(tr.textContent))) {
	function addLookup(caption, callback, tooltip) {
		const [span, a] = createElements('span', 'a');
		span.className = 'brackets';
		span.style = 'display: inline-flex; flex-flow: row; align-items: center; column-gap: 5px; justify-content: space-around; color: initial;';
		if (caption instanceof Element) a.append(caption); else a.textContent = caption;
		[a.className, a.href, a.onclick] = ['toc-lookup', '#', evt => { callback(evt); return false }];
		if (tooltip) setTooltip(a, tooltip);
		span.append(a);
		container.append(span);
	}
	function svgCaption(resourceName, style, fallbackText) {
		console.assert(resourceName || fallbackText);
		if (!resourceName) return fallbackText;
		let svg = domParser.parseFromString(GM_getResourceText(resourceName), 'text/html');
		if ((svg = svg.body.getElementsByTagName('svg')).length > 0) svg = svg[0]; else return fallbackText;
		for (let attr of ['id', 'width', 'class', 'x', 'y', 'style']) svg.removeAttribute(attr);
		if (style) svg.style = style;
		svg.setAttribute('height', '0.9em');
		return svg;
	}
	function imgCaption(src, style) {
		const img = document.createElement('img');
		img.src = src;
		if (style) img.style = style;
		return img;
	}
	function addIcon(html, clickHandler, dropHandler, className, style, tooltip, tooltipster = false) {
		if (!html || ![clickHandler, dropHandler].some(cb => typeof cb == 'function')) throw new Error('Invalid argument');
		const span = document.createElement('span');
		span.innerHTML = html;
		if (className) span.className = className;
		span.style = 'transition: scale 100ms;' + (style ? ' ' + style : '');
		if (typeof clickHandler == 'function') {
			span.style.cursor = 'pointer';
			span.onclick = function(evt) {
				evt.stopPropagation();
				if (evt.currentTarget.disabled) {
					evt.currentTarget.hold = true;
					evt.currentTarget.style.filter = 'hue-rotate(180deg)';
				} else clickHandler(evt);
				return false;
			};
		}
		span.onmouseenter = span.onmouseleave = evt =>
			{ evt.currentTarget.style.scale = evt.type == 'mouseenter' ? 1.5 : 'none' };
		if (typeof dropHandler == 'function') {
			span.ondragover = evt => Boolean(evt.currentTarget.disabled) || !evt.dataTransfer.types.includes('text/plain');
			span.ondrop = function(evt) {
				evt.currentTarget.style.scale = 'none';
				if (evt.currentTarget.disabled || !evt.dataTransfer || !(evt.dataTransfer.items.length > 0)) return true;
				const url = evt.dataTransfer.getData('text/plain');
				if (url) evt.stopPropagation(); else return true;
				dropHandler(evt, url);
				return false;
			};
			span.ondragenter = span[`ondrag${'ondragexit' in span ? 'exit' : 'leave'}`] = function(evt) {
				if (evt.currentTarget.disabled) return true;
				if (!evt.currentTarget.contains(evt.relatedTarget))
					evt.currentTarget.style.scale = evt.type == 'dragenter' ? 3 : 'none';
				return false;
			};
		}
		if (tooltip) if (tooltipster) setTooltip(span, tooltip); else span.title = tooltip;
		return span;
	}
	function getReleaseYear(date) {
		if (!date) return undefined;
		let year = new Date(date).getUTCFullYear();
		return (!isNaN(year) || (year = /\b(\d{4})\b/.exec(date)) != null
			&& (year = parseInt(year[1]))) && year >= 1900 ? year : NaN;
	}
	function svgSetTitle(elem, title) {
		if (!(elem instanceof Element)) return;
		for (let title of elem.getElementsByTagName('title')) title.remove();
		if (title) elem.insertAdjacentHTML('afterbegin', `<title>${title}</title>`);
	}
	function mbFindEditionInfoInAnnotation(elem, mbId) {
		if (!mbId || !(elem instanceof HTMLElement)) throw new Error('Invalid argument');
		return mbApiRequest('annotation', { query: `entity:${mbId} AND type:release` }).then(function(response) {
			if (response.count <= 0 || (response = response.annotations.filter(function(annotation) {
				console.assert(annotation.type == 'release' && annotation.entity == mbId, 'Unexpected annotation for MBID %s:', mbId, annotation);
				return /\b(?:Label|Catalog|Cat(?:alog(?:ue)?)?\s*(?:[#№]|Num(?:ber|\.?)|(?:No|Nr)\.?))\s*:/i.test(annotation.text);
			})).length <= 0) return Promise.reject('No edition info in annotation');
			const a = document.createElement('a');
			[a.href, a.target, a.textContent, a.style] = [[mbOrigin, 'release', mbId].join('/'),
				'_blank', 'by annotation', 'font-style: italic; ' + noLinkDecoration];
			a.title = response.map(annotation => annotation.text).join('\n');
			elem.append(a);
		});
	}
	function editionInfoMatchingStyle(elem) {
		if (!(elem instanceof Element)) throw new Error('Invalid argument');
		//elem.style.fontWeight = 'bold';
		elem.style.textShadow = '0 0 1pt #aaa';
		//elem.style.textShadow = '0 0 5pt #9acd32C0';
		elem.style.textDecoration = 'underline yellowgreen dotted 2pt';
		//elem.style.backgroundColor = '#9acd3230';
		elem.classList.add('matching');
	}
	function releaseEventMapper(countryCode, date, editionYear) {
		if (!countryCode && !date) return null;
		const components = [ ];
		if (countryCode) {
			const [span, img] = createElements('span', 'img');
			span.className = 'country';
			if (/^[A-Z]{2}$/i.test(countryCode)) {
				[img.height, img.referrerPolicy, img.title] = [9, 'same-origin', countryCode.toUpperCase()];
				img.style.marginTop = '2px';
				img.setAttribute('onerror', 'this.replaceWith(this.title)');
				img.src = 'http://s3.cuetools.net/flags/' + countryCode.toLowerCase() + '.png';
				span.append(img);
			} else span.textContent = countryCode;
			components.push(span);
		}
		if (date) {
			const span = document.createElement('span');
			[span.className, span.textContent] = ['date', date];
			if (editionYear > 0 && editionYear == getReleaseYear(date.toString())) editionInfoMatchingStyle(span);
			components.push(span);
		}
		return components;
	}
	function checkBarcode(barcode, tryAddCheckDigit = false) {
		if (!barcode || !/^\d+$/.test(barcode = barcode.toString().replace(/\W+/g, '')) || barcode.length < 7)
			return console.info('Invalid barcode: %s (%s)', barcode, 'invalid format');
		const typeString = { 8: 'EAN-8', 12: 'UPC-A', 13: 'EAN-13', 14: 'GTIN-14' };
		const validated = (function checkBarcode(barcode) {
			const digits = Array.from(barcode, ch => parseInt(ch));
			const checkDigit = (effectiveLength = digits.length) => digits.length > 0 && effectiveLength > 0 ?
				(10 - digits.slice(0, effectiveLength).reverse().reduce((sum, digit, index) =>
					sum + digit * ((index & 1) == 0 ? 3 : 1), 0) % 10) % 10 : undefined;
			const checkDigitAt = (skipNumbers = 0) => checkDigit(digits.length - 1 - skipNumbers)
				== digits[digits.length - 1 - skipNumbers];
			if (typeString[barcode.length] && checkDigitAt(0)) {
				console.info('Valid %s:', typeString[barcode.length], barcode);
				return barcode;
			} else if (typeString[barcode.length - 2] && checkDigitAt(2)) {
				barcode = barcode.slice(0, -2);
				console.info('Valid %s with 2 char add-on code:', typeString[barcode.length], barcode);
				return barcode;
			} else if (typeString[barcode.length - 5] && checkDigitAt(5)) {
				barcode = barcode.slice(0, -5);
				console.info('Valid %s with 5 char add-on code:', typeString[barcode.length], barcode);
				return barcode;
			} else if (tryAddCheckDigit && typeString[barcode.length + 1]) {
				barcode += checkDigit(barcode.length);
				console.info('Valid %s after adding check digit:', typeString[barcode.length], barcode);
				return barcode;
			} else if (barcode.length < 18) return checkBarcode('0' + barcode);
		})(barcode);
		if (validated) return validated;
		console.info('Invalid barcode: %s (%s)', barcode,
			typeString[barcode.length] ? 'check digit mismatch' : 'invalid length');
	}
	function catNoMapper(catNo) {
		if (catNo) catNo = dashUnifier(catNo); else return [ ];
		const m = rxCatNoRange.exec(catNo);
		if (m == null) return [catNo]; else if (m[3].length > m[2].length) return [m[1] + m[2]];
		catNo = [ ];
		for (let n = m[2]; n <= m[2].slice(0, -m[3].length) + m[3]; ++n) catNo.push(m[1] + n);
		return catNo.length > 0 ? catNo : [m[1] + m[2]];
	}
	function editionInfoParser(torrent) {
		const [labels, catNos] = ['RecordLabel', 'CatalogueNumber'].map(prop => (value => value ? decodeHTML(value)
			.split(rxEditionSplitter).map(value => value.trim()).filter(Boolean) : [ ])(torrent['remaster' + prop]));
		return [
			labels.map(label => !rxNoLabel.test(label) ? labelMapper(label.replace(...rxBareLabel)) : noLabel),
			Array.prototype.concat.apply([ ], catNos.map(catNo => !rxNoCatno.test(catNo) ? catNoMapper(catNo) : [ ])),
		].map(values => values.filter((s1, n, a) => a.findIndex(s2 => s2.toLowerCase() == s1.toLowerCase()) == n));
	}
	function editionInfoMapper(labelName, catNo, recordLabels, catalogueNumbers, labelURL) {
		if (!labelName && !catNo) return null;
		const components = [ ];
		if (labelName) {
			const elem = document.createElement(labelURL ? 'a' : 'span');
			[elem.className, elem.textContent] = ['label', dashUnifier(labelName)];
			if (labelURL) [elem.href, elem.target, elem.style] = [labelURL, '_blank', noLinkDecoration];
			labelName = labelMapper(labelName.replace(...rxBareLabel));
			if (Array.isArray(recordLabels) && recordLabels.some(function(recordLabel) {
				const labels = [recordLabel, labelName].map(label => rxNoLabel.test(label) ? noLabel : label);
				const startsWith = (index1, index2) => labels[index1].toLowerCase().startsWith(labels[index2].toLowerCase())
					&& /^\W/.test(labels[index1].slice(labels[index2].length));
				return cmpNorm(labels[0]) == cmpNorm(labels[1]) || startsWith(0, 1) || startsWith(1, 0);
			})) editionInfoMatchingStyle(elem);
			components.push(elem);
		}
		if (catNo) {
			const span = document.createElement('span');
			[span.className, span.textContent, span.style] = ['catno', dashUnifier(catNo), 'white-space: nowrap;'];
			catNo = catNoMapper(catNo);
			if (Array.isArray(catalogueNumbers) && (catalogueNumbers.some(catalogueNumber =>
					catNoMapper(catalogueNumber).some(catalogueNumber =>
						catNo.some(catNo => sameStringValues(catalogueNumber, catNo)))
					|| catNo.some(catNo => sameStringValues(catNo, catalogueNumbers.join('/'))))))
				editionInfoMatchingStyle(span);
			components.push(span);
		}
		return components;
	}
	function barcodeStyle(barcode) {
		if (!(barcode instanceof HTMLElement)) throw new Error('Invalid argument');
		if (!checkBarcode(barcode.textContent, true)) {
			[barcode.style.color, barcode.title] = ['red', 'Invalid barcode'];
			barcode.classList.add('invalid');
		} else if (!checkBarcode(barcode.textContent, false)) {
			[barcode.style.color, barcode.title] = ['darkorange', 'Invalid barcode or check digit missing'];
			barcode.classList.add('invalid');
		} else barcode.classList.add('valid');
	}
	function fillListRows(container, listElements, maxRowsToShow, expandedIfMatch = false) {
		function addRows(root, range) {
			for (let row of range) {
				const div = document.createElement('div');
				row.forEach((elem, index) => { if (index > 0) div.append(' '); div.append(elem) });
				root.append(div);
			}
		}

		if (!(container instanceof HTMLElement)) throw new Error('Invalid argument');
		if (!Array.isArray(listElements) || (listElements = listElements.filter(listElement =>
				Array.isArray(listElement) && listElement.length > 0)).length <= 0) return;
		addRows(container, maxRowsToShow > 0 ? listElements.slice(0, maxRowsToShow) : listElements);
		if (!(maxRowsToShow > 0 && listElements.length > maxRowsToShow)) return;
		const hasMatching = commponents => commponents.some(component => component.classList.contains('matching'));
		if (expandedIfMatch && !listElements.slice(0, maxRowsToShow).some(hasMatching)
				&& listElements.slice(maxRowsToShow).some(hasMatching))
			return addRows(container, listElements.slice(maxRowsToShow));
		const divs = createElements('div', 'div');
		[divs[0].className, divs[0].style] = ['show-all', 'color: cadetblue; font-style: italic; cursor: pointer;'];
		[divs[0].onclick, divs[0].textContent, divs[0].title] = [function(evt) {
			evt.currentTarget.remove();
			divs[1].hidden = false;
		}, `+ ${listElements.length - maxRowsToShow} others…`, 'Show all'];
		divs[1].hidden = true;
		addRows(divs[1], listElements.slice(maxRowsToShow));
		container.append(...divs);
	}
	function discogsIdExtractor(expr, entity) {
		if (!expr) return null; //throw new Error('Invalid argument');
		let discogsId = parseInt(expr);
		if (discogsId > 0) return discogsId; else try { discogsId = new URL(expr) } catch(e) { return null }
		return discogsId.hostname.toLowerCase().split('.').slice(-2).join('.') == 'discogs.com'
			&& (discogsId = new RegExp(`\\/${discogsEntity(entity) || '(?:release|master|artist|label)'}s?\\/(\\d+)\\b`, 'i')
				.exec(discogsId.pathname)) != null && (discogsId = parseInt(discogsId[1])) > 0 ? discogsId : null;
	}
	function allMusicIdExtractor(expr, entity) {
		if (!expr) return null;
		let allMusicId = /^(m[a-z]\d{10})$/i.exec(expr);
		if (allMusicId != null) return allMusicId[1].toLowerCase();
		try { allMusicId = new URL(expr) } catch(e) { return null }
		entity = (entity = amEntity(entity)) ? entity.replace(/[\-\[\]\{\}\(\)\*\+\!\<\=\:\?\.\/\\\^\$\|\#]/g, '\\$&')
			: '(?:[\\w\\-]+(?:\\/[\\w\\-]+)*)';
		return allMusicId.hostname.toLowerCase().split('.').slice(-2).join('.') == 'allmusic.com'
			&& (allMusicId = new RegExp(`\\/${entity}\\/(?:\\S+-)?\\b(m[a-z]\\d{10})\\b`, 'i')
				.exec(allMusicId.pathname)) != null ? allMusicId[1].toLowerCase() : null;
	}
	function isDiscogsCD(format) {
		const descriptions = getFormatDescriptions(format);
		return ['CD', 'CDr'].includes(format.name) && !descriptions.some(description =>
			['SVCD', 'VCD', 'CDi'].includes(description)) || format.name == 'Hybrid' && descriptions.includes('DualDisc')
			|| format.name == 'SACD' && descriptions.includes('Hybrid');
	}
	function findDiscogsRelatives(entity, discogsId) {
		if (!entity || !((discogsId = parseInt(discogsId)) > 0)) throw new Error('Invalid argument');
		const targetType = entity.replace(/-/g, '_');
		return mbApiRequest('url', {
			resource: [dcOrigin, discogsEntity(entity), discogsId].join('/'),
			inc: entity + '-rels',
		}).then(function(url) {
			const entries = url.relations.filter(relation => relation.type == 'discogs' && relation['target-type'] == targetType)
				.map(relation => relation[relation['target-type']]).filter(uniqueIdFilter);
			if (entries.length <= 0) return Promise.reject('No relations by resource lookup');
			if (debugLogging) console.debug('Lookup by URL for %s %d:', entity, discogsId, entries);
			return entries;
		}).catch(reason => mbApiRequest('url', {
			query: [discogsId, discogsId + '-*'].map(slug =>
				`url_descendent:*discogs.com/${discogsEntity(entity)}/${slug}`).join(' OR '),
			targettype: targetType,
			limit: 100,
		}).then(function(results) {
			if (results.count <= 0) return Promise.reject('No relations by URL');
			if (debugLogging) console.debug('Search by URL for %s %d:', entity, discogsId, results.urls);
			results = results.urls.filter(url =>
				discogsIdExtractor(url.resource, entity) == discogsId);
			if (results.length <= 0) return Promise.reject('No relations by URL');
			results = Promise.all(results.map(url => mbApiRequest('url/' + url.id, { inc: entity + '-rels' })
				.then(url => url.relations.filter(relation => relation['target-type'] == targetType), console.warn)));
			return results.then(relations => (relations = Array.prototype.concat.apply([ ], relations.filter(Boolean))
				.map(relation => relation[relation['target-type']]).filter(uniqueIdFilter)).length > 0 ? relations
					: Promise.reject('No relations by URL'));
		}));
	}
	function findAllMusicRelatives(entity, allMusicId) {
		if (!entity || !allMusicId) throw new Error('Invalid argument');
		const targetType = entity.replace(/-/g, '_');
		return mbApiRequest('url', {
			resource: [amOrigin, amEntity(entity), allMusicId].join('/'),
			inc: entity + '-rels',
		}).then(function(url) {
			const entries = url.relations.filter(relation => relation.type == 'allmusic' && relation['target-type'] == targetType)
				.map(relation => relation[relation['target-type']]).filter(uniqueIdFilter);
			if (entries.length <= 0) return Promise.reject('No relations by resource lookup');
			if (debugLogging) console.debug('Lookup by URL for %s %d:', entity, allMusicId, entries);
			return entries;
		}).catch(reason => mbApiRequest('url', {
			query: `url_descendent:*allmusic.com/${amEntity(entity)}/*${allMusicId}`,
			targettype: targetType,
			limit: 100,
		}).then(results => results.count > 0 && (results = results.urls.filter(url =>
			allMusicIdExtractor(url.resource, entity) == allMusicId)).length > 0 ? Promise.all(results.map(url =>
				mbApiRequest('url/' + url.id, { inc: entity + '-rels' }).then(url => url.relations.filter(relation =>
					relation['target-type'] == targetType), console.warn))) : [ ])
			.then(relations => (relations = Array.prototype.concat.apply([ ], relations.filter(Boolean))).length > 0 ?
				relations.map(relation => relation[relation['target-type']]).filter(uniqueIdFilter) : Promise.reject('No relations by URL')));
	}
	function appendDisambiguation(elem, disambiguation) {
		if (!(elem instanceof HTMLElement) || !disambiguation) return;
		const span = document.createElement('span');
		[span.className, span.style.opacity, span.textContent] = ['disambiguation', 0.6, '(' + disambiguation + ')'];
		elem.append(' ', span);
	}
	function addThumbnail(element, src, url) {
		function setThumbNail(src) {
			if (src) [img.onload, img.onerror, img.src] = [function(evt) {
				if (evt.currentTarget.src != defaultSrc) (function addHoverHandlers(elem) {
					elem.style.transition = 'scale 200ms ease-in-out';
					elem.style.boxSizing = 'border-box';
					elem.onmouseenter = elem.onmouseleave = function(evt) {
						evt.currentTarget.style.scale = evt.type == 'mouseenter' ? 8 : 'none';
						evt.currentTarget.style.border = evt.type == 'mouseenter' ? '1pt solid #aaaa' : null;
					};
					if (url) elem.onclick = function(evt) {
						evt.stopPropagation();
						GM_openInTab(url, false);
					}; else return;
					elem.style.cursor = 'pointer';
				})(evt.currentTarget);
			}, evt => { evt.currentTarget.src = defaultSrc }, src];
		}

		if (!(element instanceof HTMLElement)) throw new Error('Invalid argument');
		if (typeof src == 'string' && src.endsWith('/images/spacer.gif')) return;
		const defaultSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsSAAALEgHS3X78AAAGjUlEQVR4nO1aXUgcVxS+6qghbvxBRROyIaLF1SSYEPGXNWmigVJMIJA2IIQ89KHQ0pc+BdK+5aVt+kNKoYRCoZiYtEINClkT1KioqIkW0gSrKBr/uiT1LzFZo27Pd8ldNpNdZ3Z3xtkxfjC4u565c853zj3n3DtXcrvd7G2GZLQCRmOTAKMVMBqbBBitgNHwENDb2/tRe3v753NzcxlUGUxPTERExGpcXNxUfn7+z3a7/WJUVJTLlxw3tKOj47P6+vofIiMjGQmur6Y6gZwYRc7cdfPmzQvz8/PWysrKT0CKXE4aHh5+t7W19TwMBwGrq6tsZWWFmb0/gD24YmJiWHd398e5ubl/ZmVlOeRyUltb27nFxcVUYXxKSgojQYSQEXprhkePHrHx8XHuVDj04cOHJ3wS8Pjx42xhLAg4fPgwy8vLW3eFtQaMv3z5Mo9kkPD06dMMX3LIAZ55ASKio6PXTUk9IUkSt0dMZcx/l8tlef78eXJiYuKoR05+o9nnvoDcDlSBkZGRomvXrv2RkZHRXl5efn7Hjh39AZW7Z8+escHBQeZ0OvkDUlNTeb6Ij4/XVHkdEUFRkED54P2JiYn8M2fOvKeagL6+Pnb79m02MzPjHVbceOSNoqIi3bTWCqR3JP6iMiwsLKRRibyoioCenh5WV1fHP8tzBKLixo0bjJhlhw4d0lpnzQDjt23b5ty6devM0tJSEuyYnJwsUiSAqgRzOBzc28imcuA3/K+pqYllZmaynTt36mJAqKBSGEO69RUUFFS3tLR8CgLwmyIB/f393MsIG38AAcQqu3v3btgSILBly5ZFr6/KPf/U1JRPz8uBrmt6eprnh1CbKGph2cDAACNvhTSOL5B+rymnSMDy8rLqwSEbKgGUnNjVq1cZlSxOREVFRdBjqYEiAZQ4VPUGkLFYLKqixR+E8WNjYyw2NpbRXOVkUs0OekwlKBKQnZ3N7t27pzgQ2mjIBgsYX11dzY0XlQbTqrm5mZOrVyQoEpCTk8ObHTRA/hLhy5cvmdVqZfv37w9KCRh/5cqV14wH4H2QgEgA9CBBkQD01CdPnmQ1NTVsdHSUiWUzIJbO27dvZ6dOnUKGDVgBX573hiABkQBoTYKqRogWD+zs2bOsq6uL3b9/nycnAPnBZrOx0tJSFhcXF/DD/XleDpAAR+gRCapbYXgXLa/dbsfSks9LGB3s6lHJ83LoNR0C3vuDEgkJCSE9VK3n5dCDhHXf/AzU83JonRPWlYD5+XlPnQ9l40XLnBAyAagE9fX1nmWxP8D4YMLeH7ynA/LRsWPHghonJAJgfENDA+vs7OSlEVdZWdkbct4dnpZbboKEO3fu8GcfPXo04DY8aAK8jUeDBC80NjZyBVApBLT2vBximY5VK56LFjoQBEWAt/HCKKEI9g5ABiJBL8/7QrAvdAImQMx5NEVyowQJt27d4jtE6BxxhfNOc0AECM/7Ml4AJOBCcgIZ4Ww8oJqAtTzvc2DJHO9XVWmpxvNmhSIBWO1tVOMBRQLwLkCUuo0IRQJQwkLZ5gp3KBKwUQ5M+IM5UrWO2CRASQB7/XjrE86vzVGmsTEbDBQJKCws5Nvd4ZwI4Rxs2QXTfCnesRGOy6yFNwgw++EoAbV2SCToiW2E0osXL3RTaj2BvIXcoAQpLS3t79nZ2V1iKYvNxuHhYdNHwuTkpOeEGIiIj4//B7/Lk7lUVlb25cTExN6FhQUrhIkM9uTJE0OU1hLiDRYMpuS4vGfPnlpfcpLVau2tqKg4V1tb+yuVPAk3boRFDwzHQg7XkSNHLuzevbvNlxxPggcOHKgmlpZaWlq+IO/n0E3of900DdyyQTEvTDE3yPurSUlJo8XFxd+VlJT86E/OUwX27dv3u81mayAC3nG5XHzph4h49W9ORGxs7KKPMcISFMUrycnJI+TY13QmYla8v0uymxbT09P/Et+vX7/+2/T0tI1uctO1TPni+5SUlAF9VdcGOPLvdDpzKAGiyiFq3fQ5emhoqEQ0dfwFy1qD4EDR+Ph4PraaMadqamqKKUesys/ZmAnQHXkOlcFisfy7JgE0d7558ODBcaoQ6V5tZqSZS6Q4P4w1TkFBwaU1CaBwHzx9+vSHdXV1lyg37PVumsyKV2VxrrS09Ce73f6t4lqAykdrVVXVBw6H4yuaP4W06oowcQREUGL8jwz/+uDBg7/gB1XLJyQ+IuGEvroZg80NEaMVMBqbBBitgNF46wn4H+FgCXJk4OBeAAAAAElFTkSuQmCC';
		const img = document.createElement('img');
		[img.height, img.style.marginRight, img.className] = [10, '3pt', 'cover-icon'];
		element.insertAdjacentElement('afterbegin', img);
		if (src instanceof Promise) {
			img.src = defaultSrc;
			src.then(setThumbNail);
		} else if (src) setThumbNail(src); else img.src = defaultSrc;
	}
	function setEditionInfo(elem, editionInfo) {
		if (!(elem instanceof HTMLElement)) throw new Error('Invalid argument');
		if (!Array.isArray(editionInfo) || editionInfo.length <= 0) return;
		const uniqueValues = (el1, ndx, arr, normFn = cmpNorm) =>
			el1 && arr.findIndex(el2 => el2 && normFn(el2) == normFn(el1)) == ndx;
		elem.dataset.remasterRecordLabel =
			editionInfo.map(labelInfo => labelMapper(labelInfo.label)).filter((label, index, labels) =>
				uniqueValues(label, index, labels, label => cmpNorm(label.replace(...rxBareLabel)))).join(' / ');
		elem.dataset.remasterCatalogueNumber =
			editionInfo.map(labelInfo => dashUnifier(labelInfo.catNo)).filter((catNo, index, catNos) =>
				uniqueValues(catNo, index, catNos, catNo => cmpNorm(catNo.replace(rxCatNoRange, '$1$2')))).join(' / ');
	}
	function setMusicBrainzArtist(release, artist, linkify = true) {
		if ('artist-credit' in release) release['artist-credit'].forEach(function(artistCredit, index, artists) {
			if (linkify && 'artist' in artistCredit && artistCredit.artist.id && ![mb.spa.VA].includes(artistCredit.artist.id)) {
				const a = document.createElement('a');
				if (artistCredit.artist) a.href = [mbOrigin, 'artist', artistCredit.artist.id].join('/');
				[a.target, a.style, a.textContent, a.className] =
					['_blank', noLinkDecoration, artistCredit.name, 'musicbrainz-artist'];
				if (artistCredit.artist) a.title = artistCredit.artist.disambiguation || artistCredit.artist.id;
				artist.append(a);
			} else artist.append(artistCredit.name);
			if (artistCredit.joinphrase) artist.append(artistCredit.joinphrase);
			else if (index < artists.length - 1) artist.append(index < artists.length - 2 ? ', ' : ' & ');
		});
	}
	function setMusicBrainzTitle(release, title) {
		title.innerHTML = linkHTML([mbOrigin, 'release', release.id].join('/'), release.title, 'musicbrainz-release');
		if (release['cover-art-archive'] && release['cover-art-archive'].artwork) addThumbnail(title,
			GlobalXHR.get('https://coverartarchive.org/release/' + release.id, { responseType: 'json' }).then(function({json}) {
				const isFront = image => image.front || image.types && image.types.includes('Front');
				let thumbnail = json.images.find(image => isFront(image) && image.types.length == 1)
					|| json.images.find(isFront) || json.images[0];
				if (thumbnail) thumbnail = thumbnail.thumbnails && thumbnail.thumbnails.small || thumbnail.image;
				return thumbnail;
			}), [mbOrigin, 'release', release.id, 'cover-art'].join('/'));
		switch (release.quality) {
			case 'low': title.insertAdjacentHTML('afterbegin', svgBulletHTML('#ff6723')); break;
			case 'high': title.insertAdjacentHTML('afterbegin', svgBulletHTML('#00d26a')); break;
		}
		appendDisambiguation(title, release.disambiguation);
	}
	function setMusicBrainzReleaseEvents(release, releaseEvents, releaseYear) {
		if ('release-events' in release) {
			fillListRows(releaseEvents, Array.prototype.concat.apply([ ], release['release-events'].map(function(releaseEvent) {
				const countryEvents = releaseEvent.area && Array.isArray(releaseEvent.area['iso-3166-1-codes']) ?
					iso3166ToFlagCodes(releaseEvent.area['iso-3166-1-codes']).map(countryCode =>
						releaseEventMapper(countryCode, releaseEvent.date, releaseYear)).filter(Boolean) : [ ];
				return countryEvents.length > 0 ? countryEvents : releaseEvent.country || releaseEvent.date ?
					iso3166ToFlagCodes([releaseEvent.country]).map(countryCode =>
						releaseEventMapper(countryCode, releaseEvent.date, releaseYear)) : null;
			}).filter(Boolean)), 3);
		}
		if (releaseEvents.childElementCount <= 0) fillListRows(releaseEvents, iso3166ToFlagCodes([release.country])
			.map(countryCode => releaseEventMapper(countryCode, release.date, releaseYear)));
	}
	function setMusicBrainzTooltip(release, elem) {
		function applyTooltip() {
			elem.title = lines.map(lines => lines.filter(Boolean).join('\n')).filter(Boolean).join('\n');
		}

		if (!release || !(elem instanceof HTMLElement)) throw new Error('Invalid argument');
		if (elem.title) elem = elem.querySelector('td.title > a.musicbrainz-release');
		const lines = [[ ], [ ], [ ]], relations = [ ];
		if (release['release-group']) lines[0].push([release['release-group']['primary-type']]
			.concat((release['release-group']['secondary-types'] || [ ])).filter(Boolean).join(' + '));
		if (release.media) lines[0].push(release.media.map(function(medium) {
			let _medium = medium.format || 'unknown medium', trackCount;
			if (medium['track-count']) trackCount = medium['track-count'];
				else if (medium.tracks) trackCount = medium.tracks.length;
			return trackCount > 0 ? `${_medium} (${trackCount})` : _medium;
		}).join(' + '));
		const getSeries = root => root && root.relations ? root.relations
				.filter(relation => relation['target-type'] == 'series').map(function(relation) {
			let line = relation.type + ': ' + relation.series.name;
			if (relation['attribute-values'] && relation['attribute-values'].number)
				line += ' (' + relation['attribute-values'].number + ')';
			return line;
		}) : [ ];
		const hasRelation = entity => Boolean(entity.relations) && entity.relations.some(relation =>
			['artist', 'label', 'place'].includes(relation['target-type']));
		if (release.relations) lines[1] = getSeries(release);
		if (hasRelation(release)) relations.push('release');
		if (hasRelation(release?.['release-group'])) relations.push('release');
		if (release.media && release.media.some(medium => medium.tracks
				&& medium.tracks.some(track => hasRelation(track.recording)))) relations.push('recording');
		if (release.media && release.media.some(medium => medium.tracks && medium.tracks.some(track =>
				track.relations && track.relations.some(relation =>
					relation['target-type'] == 'work' && hasRelation(relation.work))))) relations.push('work');
		if (relations.length > 0) lines[1].push('Relationships: ' + relations.join(', '));
		lines[2].push([release.status, release.packaging].filter(Boolean).join(' / '));
		if (release.quality && release.quality != 'normal') lines[2].push(release.quality + ' data quality');
		lines[2].push(release.id);
		applyTooltip();
		if (release['release-group']) mbApiRequest('release-group/' + release['release-group'].id, {
			inc: 'releases+media+discids+series-rels',
		}).then(function(releaseGroup) {
			const series = getSeries(releaseGroup);
			if (series.length <= 0) return;
			Array.prototype.unshift.apply(lines[1], series);
			applyTooltip();
		});
	}
	function setMusicBrainzGroupSize(release, groupSize, releasesWithId, totalDiscs = 0) {
		if (release['release-group']) mbApiRequest('release-group/' + release['release-group'].id, {
			inc: 'releases+media+discids+series-rels',
		}).then(function(releaseGroup) {
			const releases = releaseGroup.releases.filter(release => !release.media || !totalDiscs
				|| sameMedia(release).length == totalDiscs);
			const a = document.createElement('a');
			a.href = [mbOrigin, 'release-group', release['release-group'].id/*, 'releases'*/].join('/');
			[a.target, a.style, a.textContent] = ['_blank', noLinkDecoration, releases.length];
			if (releases.length == 1) a.style.color = '#0a0';
			groupSize.append(a);
			groupSize.title = 'Same media count in release group';
			const counts = ['some', 'every'].map(fn => releases.filter(release => release.media
				&& (release = sameMedia(release)).length > 0
				&& release[fn](medium => medium.discs && medium.discs.length > 0)).length);
			releasesWithId.textContent = counts[0] > counts[1] ? counts[0] + '/' + counts[1] : counts[1];
			releasesWithId.title = 'Same media count with known TOC in release group';
		}, function(reason) {
			if (releasesWithId.parentNode != null) releasesWithId.remove();
			[groupSize.colSpan, groupSize.innerHTML, groupSize.title] = [2, svgFail(), reason];
		});
	}
	function setDiscogsArtist(artist, artists) {
		if (!(artist instanceof HTMLElement)) throw new Error('Invalid argument');
		if (artists) artists.forEach(function(artistCredit, index, artists) {
			const name = creditedName(artistCredit);
			if (artistCredit.id > 0 && ![194].includes(artistCredit.id)) {
				const a = document.createElement('a');
				if (artistCredit.id) a.href = [dcOrigin, 'artist', artistCredit.id].join('/');
				[a.target, a.style, a.className, a.title] =
					['_blank', noLinkDecoration, 'discogs-artist', artistCredit.role || artistCredit.id];
				a.textContent = name;
				artist.append(a);
			} else artist.append(name);
			if (artistCredit.join) artist.append(fmtJoinPhrase(artistCredit.join));
			else if (index < artists.length - 1) artist.append(index < artists.length - 2 ? ', ' : ' & ');
		});
	}
	function discogsSeriesMapper(series) {
		if (!series || !series.name) return;
		let result = 'In series: ' + stripDiscogsNameVersion(series.name);
		if (series.catno) result += ' (' + series.catno + ')';
		return result;
	}
	function discogsIdentifierMapper(identifier) {
		console.assert(identifier.value);
		if (!identifier.value) return null;
		let label = identifier.type;
		if (identifier.description) label += ' (' + identifier.description + ')';
		return label + ': ' + identifier.value;
	}
	function discogsReleaseTracks(release) {
		console.assert(release instanceof Object);
		const countTracks = trackLength => release?.tracklist?.reduce((tracks, track) => tracks + trackLength(track), 0);
		return [
			countTracks(track => ['track', 'index'].includes(track.type_) ? 1 : 0),
			countTracks(track => track.type_ == 'track' ? 1 : track.type_ == 'index' ? track?.sub_tracks?.length || 1 : 0),
		].filter(uniqueValues);
	}
	function setDiscogsTooltip(release, elem) {
		if (!release || !(elem instanceof HTMLElement)) throw new Error('Invalid argument');
		if (elem.title) elem = elem.querySelector('td.title > a.discogs-release');
		const lines = [ ];
		const singleLineAdapter = (props, valueMapper = val => val) =>
			[props.map(prop => release[prop] && valueMapper(release[prop])).filter(Boolean).join(' / ')];
		let realTracks = discogsReleaseTracks(release);
		realTracks = [
			undefined,
			`${realTracks[0]} ${realTracks[0] == 1 ? 'track' : 'tracks'}`,
			`${realTracks[0]}(${realTracks[1]}) tracks`,
		][realTracks.length];
		lines.push((release.formats || [ ]).map(function(format) {
			const tags = getFormatDescriptions(format);
			if (format.name == 'All Media') return tags.join(', ');
			let description = format.qty + '×' + format.name;
			if (tags.length > 0) description += ' (' + tags.join(', ') + ')';
			return description;
		}).concat(realTracks));
		if (release.series) lines.push(release.series.map(discogsSeriesMapper));
		if (release.identifiers) lines.push(release.identifiers
			.filter(identifier => identifier.value).map(discogsIdentifierMapper));
		if (release.notes) lines.push(release.notes.split(/(?:\r?\n)+/).map(line => line.trim()));
		if (release.extraartists) lines.push(release.extraartists.map(function(artistCredit) {
			let line = artistCredit.name + ': ' + artistCredit.role;
			if (artistCredit.tracks) line += ' (' + artistCredit.tracks + ')';
			return line;
		}));
		if (release.companies) {
			const r = { };
			for (let company of release.companies) {
				if (!(company.entity_type_name in r)) r[company.entity_type_name] = [ ];
				let name = company.name;
				if (company.catno) name += ' (' + company.catno + ')';
				r[company.entity_type_name].push(name);
			}
			lines.push(Object.keys(r).map(key => key + ': ' + r[key].join(', ')));
		}
		lines.push(singleLineAdapter(['genres', 'styles'], val => val.join(', ')));
		//lines.push(singleLineAdapter(['data_quality', 'status']));
		//lines.push(['ID ' + release.id]);
		elem.title = lines.map(function(lines) {
			if ((lines = lines.filter(Boolean)).length > 15)
				lines = lines.slice(0, 15).concat(`…and ${lines.length - 1} more`);
			return lines.length > 0 ? lines.join('\n') : undefined;
		}).filter(Boolean).join('\n\n');
	}
	function setDiscogsGroupSize(release, groupSize) {
		if (!release || !(groupSize instanceof HTMLElement)) throw new Error('Invalid argument');
		if (release.master_id) {
			const masterUrl = new URL('master/' + release.master_id, dcOrigin);
			for (let format of ['CD', 'CDr']) masterUrl.searchParams.append('format', format);
			masterUrl.hash = 'versions';
			const getGroupSize1 = () => dcApiRequest(['masters', release.master_id, 'versions'].join('/'))
				.then(({filters}) => (filters = filters && filters.available && filters.available.format) ?
					['CD', 'CDr'].reduce((s, f) => s + (filters[f] || 0), 0) : Promise.reject('Filter totals missing'));
			const getGroupSize2 = (page = 1) => dcApiRequest(['masters', release.master_id, 'versions'].join('/'), {
				page: page,
				per_page: 1000,
			}).then(function(versions) {
				const releases = versions.versions.filter(version => !Array.isArray(version.major_formats)
					|| version.major_formats.some(format => ['CD', 'CDr'].includes(format))
					|| version.major_formats.includes('Hybrid') && version.format.includes('DualDisc')
					|| version.major_formats.includes('SACD') && version.format.includes('Hybrid')).length;
				if (!(versions.pagination.pages > versions.pagination.page)) return releases;
				return getGroupSize2(page + 1).then(releasesNxt => releases + releasesNxt);
			});
			getGroupSize1().catch(reason => getGroupSize2()).then(function(_groupSize) {
				const a = document.createElement('a');
				[a.href, a.target, a.style, a.textContent] = [masterUrl, '_blank', noLinkDecoration, _groupSize];
				if (_groupSize == 1) a.style.color = '#0a0';
				groupSize.append(a);
				groupSize.title = 'Total of same media versions for master release';
			}, function(reason) {
				[groupSize.style.paddingTop, groupSize.innerHTML, groupSize.title] = ['5pt', svgFail(), reason];
			});
		} else [groupSize.textContent, groupSize.style.color, groupSize.title] = ['–', '#0a0', 'Without master release'];
	}
	function getDiscogsReleaseDescriptors(release) {
		let descriptors = new Set;
		if (release.formats) for (let format of release.formats) {
			if (!['CD', 'CDr', 'SACD', 'Hybrid', 'All Media'].includes(format.name)) continue;
			const descriptions = getFormatDescriptions(format);
			if (!descriptions.some(description => ['SVCD', 'VCD', 'CDi'].includes(description))
					&& (format.name != 'Hybrid' || !descriptions.includes('DualDisc'))
					&& (format.name != 'SACD' || !descriptions.includes('Hybrid')))
				for (let description of descriptions) if (![
					'Album', 'Single', 'EP', 'LP', 'Compilation', 'Stereo',
				].includes(description)) descriptors.add(description);
		}
		return Array.from(descriptors);
	}
	function addResultsFilter(thead, tbody, minRows = 5) {
		function filterByClasses(...classes) {
			if (classes.length > 0) classes = classes.map(cls => ({
				catno: ['catno', 'barcode', 'identifier'],
			}[cls]) || [cls]); else return null;
			const rows = Array.prototype.filter.call(tbody.rows, (tr, index) => classes.every(cls =>
				cls.some(cls => tr.querySelector('.' + cls + '.matching') != null)
					|| classes.length > 1 && cls.includes('date') && tr.querySelector('.' + cls) == null));
			return rows.length > 0 ? rows : null;
		}

		if (!(thead instanceof HTMLElement) || !(tbody instanceof HTMLElement)) throw new Error('Invalid argument');
		if (minRows > 0 && tbody.rows.length < minRows) return;
		const filteredRows = filterByClasses('date', 'label', 'catno') || filterByClasses('label', 'catno')
			|| filterByClasses('catno') || filterByClasses('label') || filterByClasses('date');
		if (filteredRows == null || filteredRows.length >= tbody.rows.length) return;
		const [labels, cls] = [['Relevant Editions Only', 'Show All'], 'filtered'];
		const filter = Object.assign(document.createElement('span'), {
			style: 'float: right; color: cadetblue; cursor: pointer; text-transform: lowercase;',
			className: 'filter-switch',
			onclick: function(evt) {
				const filtered = tbody.classList.contains(cls);
				for (let tr of tbody.rows) {
					let hidden = !filtered && !filteredRows.includes(tr);
					if (hidden && tr.classList.contains('musicbrainz-release')) for (
						let row = tr.nextElementSibling;
						row != null && row.nodeName == 'TR' && row.classList.contains('discogs-release');
						row = row.nextElementSibling
					) if (filteredRows.includes(row)) hidden = false;
					tr.hidden = hidden;
				}
				filter.textContent = `[${labels[filtered ? 0 : 1]}]`;
				tbody.classList[filtered ? 'remove' : 'add'](cls);
			},
		});
		filter.onclick();
		thead.append(filter);
	}
	function scriptFromLanguage(language) {
		if (language) language = language.toLowerCase(); else return;
		const scripts = {
			Latn: [
				'eng', 'deu', 'spa', 'fra', 'ita', 'swe', 'nor', 'fin', 'por', 'nld', 'pol', 'ces', 'slk', 'slv', 'hrv',
				'srp', 'hun', 'tur', 'dan', 'ltz', 'ron', 'est', 'lav', 'isl', 'lat', 'cat', 'gsw', 'fil', 'eus', 'afr',
				'lit', 'cym', 'glg', 'bre', 'oci', 'haw', 'gla', 'nob', 'mri', 'zul', 'ast', 'swa', 'som', 'gle',
			],
			Hant: ['zho'], Jpan: ['jpn'], Kore: ['kor'], Thai: ['tha'],
			Cyrl: ['rus', 'bul', 'mkd', 'ukr', 'bos', 'bel', 'mon'],
			Deva: ['hin', 'mar', 'san'],
			Arab: ['ara', 'ind', 'fas', 'urd', 'msa', 'kaz', 'tuk', 'uzb'],
			Hebr: ['heb', 'yid'], Grek: ['grk', 'gre', 'ell'],
			Armn: ['hye'], Guru: ['pan'], Taml: ['tam'], Hani: ['vie'], Telu: ['tel'], Mymr: ['mya'],
			Mlym: ['mal'], Beng: ['asm'], Geor: ['kat'],
		};
		for (let script in scripts) if (scripts[script].includes(language)) return script;
	}
	function frequencyAnalysis(literals, string) {
		if (!literals || typeof literals != 'object') throw new Error('Invalid argument');
		if (typeof string == 'string') for (let index = 0; index < string.length; ++index) {
			const charCode = string.charCodeAt(index);
			if (charCode < 0x20 || charCode == 0x7F) continue;
			if (charCode in literals) ++literals[charCode]; else literals[charCode] = 1;
		}
	}
	function detectAlphabet(literals, charSets) {
		if (!literals || typeof literals != 'object' || !charSets || typeof charSets != 'object') throw new Error('Invalid argument');
		const charCodes = Object.keys(literals).map(key => parseInt(key))
		if (charSets) for (let key in charSets) {
			const charSet = Array.prototype.concat.apply(range(0x20, 0x40).concat(range(0x50, 0x60),
				range(0x7B, 0x7E), range(0xA0, 0xBF), 0xD7, 0xF7), charSets[key]);
			if (charCodes.every(charCode => charSet.includes(charCode))) return key;
		} else throw new Error('Invalid argument');
	}
	function parseLanguages(siteName, ignoreLanguages = false) {
		let matches = /^(.+?)\s+\(([^\(\)]+)\)$/.exec(siteName);
		if (matches != null) {
			matches = matches.slice(1);
			if (ignoreLanguages) return matches;
			const scripts = matches.map(function(namePart, index) {
				const literals = { };
				frequencyAnalysis(literals, namePart);
				return detectScript(literals) || scriptFromLanguage(detectLanguage(literals));
			});
			if (scripts.every((script, index, scripts) => script && scripts.indexOf(script) == index)
					|| scripts.includes('Latn') && scripts.some(script => script != 'Latn')) return matches;
		}
		return siteName ? [siteName] : [ ];
	}
	function flashElement(elem) {
		if (elem instanceof Element) return elem.animate([
			{ offset: 0.0, opacity: 1 },
			{ offset: 0.4, opacity: 1 },
			{ offset: 0.5, opacity: 0.1 },
			{ offset: 0.9, opacity: 0.1 },
		], { duration: 600, iterations: Infinity });
	}
	function discIdFormatter(discId) {
		let style = 'display: inline-block; padding: 2pt 4pt; background-color: #8883;';
		style += discId != null ? 'font-family: Consolas, &quot;Lucida Console&quot;, monospace; font-weight: 500;' : 'color: red;';
		return `<span style="${style}">${discId}</span>`;
	}

	const torrentId = getTorrentId(tr);
	if (!(torrentId > 0)) continue; // assertion failed
	let edition = /\b(?:edition_(\d+))\b/.exec(tr.className), editionInfo = tr, torrentDetails = tr;
	while (torrentDetails != null && !torrentDetails.classList.contains('torrentdetails'))
		torrentDetails = torrentDetails.nextElementSibling;
	if (torrentDetails == null) continue; // assertion failed
	const linkBox = torrentDetails.querySelector('div.linkbox');
	if (linkBox == null) continue;
	edition = edition != null ? parseInt(edition[1]) : undefined;
	while (editionInfo != null && !editionInfo.classList.contains('edition'))
		editionInfo = editionInfo.previousElementSibling;
	if (editionInfo != null) editionInfo = editionInfo.querySelector('td.edition_info > strong');
	const uniqueValues = ((val, ndx, arr) => val && arr.indexOf(val) == ndx);
	const flattenResults = results => (results = Array.prototype.concat.apply([ ], results.filter(Boolean))
		.filter(Boolean)).length > 0 ? results : null;
	const getFormatDescriptions = format => format ? (format.descriptions || [ ])
		.concat((format.text || '').split(',').map(descriptor => descriptor.trim()).filter(Boolean)) : [ ];
	const theadStyle = 'padding: 4pt; background-color: #AAA4;'
	const noLinkDecoration = 'background: none !important; padding: 0 !important;';
	const linkHTML = (url, caption, cls) => `<a href="${url}" target="_blank" ${cls ? 'class="' + cls + '" ' : ''}style="${noLinkDecoration}">${caption}</a>`;
	// SPAs and SPLs
	const mb = Object.freeze({
		spa: Object.freeze({
			VA: '89ad4ac3-39f7-470e-963a-56509c546377',
			noArtist: 'eec63d3c-3b81-4ad4-b1e4-7c147d4d2b61',
			unknown: '125ec42a-7229-4250-afc5-e057484327fe',
			anonymous: 'f731ccc4-e22a-43af-a747-64213329e088',
			traditional: '9be7f096-97ec-4615-8957-8d40b5dcbc41',
			dialogue: '314e1c25-dde7-4e4d-b2f4-0a7b9f7c56dc',
			data: '33cf029c-63b0-41a0-9855-be2a3665fb3b',
			disney: '66ea0139-149f-4a0c-8fbf-5ea9ec4a6e49',
			theatre: 'a0ef7e1d-44ff-4039-9435-7d5fefdeecc9',
			churchChimes: '90068d37-bae7-4292-be4a-704c145bd616',
			languageInstruction: '80a8851f-444c-4539-892b-ad2a49292aa9',
		}),
		spl: Object.freeze({
			noLabel: '157afde4-4bf5-4039-8ad2-5a15acc85176',
			unknown: '46caaa9e-3e26-49b5-827c-64ccc73c1b07',
		}),
	});
	const stripDiscogsNameVersion = name => name && name.replace(/\s+\(\d+\)$/, '');
	const capitalizeName = name => name && [
		[/\s+/g, ' '],
		[/(?<!(?:\b(?:[Aa]nd|[Ww]ith|[Mm]eets|[Pp]resents|[Ee]t|El|[Yy]|[Uu]nd|[Cc]on|[Vv]s\.?|[Ff]eat(?:uring|\.)?|[Ff]t\.?)|\&|\+))\s+(The|An|L[ae]|Los|Der|Die?|Das?)(?=\s)/g, (...m) => ' ' + m[1].toLowerCase()],
		[new RegExp(`\\s+(And|Of|In|On|At|By|To|For|Da|De[ln]?|Du|V[ao]n|Y|Et|Vs\\.?|${phrases.feat})(?=\\s)`, 'g'), (...m) => ' ' + m[1].toLowerCase()],
	].reduce((str, subst) => str.replace(...subst), name);
	const creditedName = entry => entry && capitalizeName(entry.anv || stripDiscogsNameVersion(entry.name));
	const discogsEntity = entity => entity && (({
		'release-group': 'master',
		'series': 'label',
		'place': 'label',
	}[entity.toLowerCase()]) || entity);
	const amEntity = entity => entity && ({
		'release': 'album/release',
		'release-group': 'album',
		'recording': 'song',
		'work': 'composition',
		'label': 'artist',
	}[entity.toLowerCase()] || entity);
	const fmtJoinPhrase = (joinPhrase = '&') => [
		[/^\s+(?=[\,\;\:])/, ''],
		[/\b(\w+)\b/g, (...m) => m[1] == m[1].toUpperCase() ? m[1] : m[1].toLowerCase()],
		[new RegExp(`\\s+${phrases.feat}\\s+`, 'gi'), ' feat. '],
		[/\s+(?:w(?:\/|\.\/?)|\/w\.?)\s+/ig, ' with '],
	].reduce((phrase, subst) => phrase.replace(...subst), ' ' + joinPhrase.trim() + ' ');
	const rxEditionSplitter = /[\/\|\•\;\,]+/;
	const dashUnifier = str => str && str.replace(/[\‐\−\—\–]/g, '-');
	const timeStrToTime = timeStr => timeStr ? timeStr.trim().split(':').filter(Boolean)
		.reverse().reduce((t, n, ndx) => t + parseInt(n) * Math.pow(60, ndx), 0) : NaN;
	const isCD = medium => medium && /^(?:(?:SHM-|HD|HQ|DTS |Enhanced |Blu-spec |Copy Control |Minimax |Mixed Mode )?CD|CD-R|(?:8cm )?CD(?:\+G)?|Hybrid SACD(?: \(CD layer\))?|DualDisc(?: \(CD side\))?)$/.test(medium.format);
	const sameMedia = release => release.media.every(medium => !medium.format) ?
		release.media : release.media.filter(isCD);
	const sameBarcodes = (...barcodes) => barcodes.length > 0 && barcodes.every(Boolean)
		&& barcodes.map(barcode => checkBarcode(barcode.toString().replace(/\D+/g /*/\W+/g*/, ''), true))
			.every((barcode1, index, barcodes) => barcode1 && barcodes.every(barcode2 =>
				barcode2 && parseInt(barcode2) == parseInt(barcode1)));
	const discogsCountries = Object.freeze({
		'US': ['US'], 'UK': ['GB'], 'Germany': ['DE'], 'France': ['FR'], 'Japan': ['JP'], 'Italy': ['IT'],
		'Europe': ['XE'], 'Canada': ['CA'], 'Netherlands': ['NL'], 'Spain': ['ES'], 'Australia': ['AU'],
		'Russia': ['RU'], 'Sweden': ['SE'], 'Brazil': ['BR'], 'Belgium': ['BE'], 'Greece': ['GR'], 'USSR': ['SU'],
		'Poland': ['PL'], 'Mexico': ['MX'], 'Finland': ['FI'], 'Jamaica': ['JM'], 'Switzerland': ['CH'],
		'Denmark': ['DK'], 'Argentina': ['AR'], 'Portugal': ['PT'], 'Norway': ['NO'], 'Austria': ['AT'],
		'UK & Europe': ['GB', 'XE'], 'New Zealand': ['NZ'], 'Romania': ['RO'], 'Cyprus': ['CY'],
		'South Africa': ['ZA'], 'Yugoslavia': ['YU'], 'Hungary': ['HU'], 'Colombia': ['CO'], 'Malaysia': ['MY'],
		'USA & Canada': ['US', 'CA'], 'Ukraine': ['UA'], 'Turkey': ['TR'], 'India': ['IN'], 'Indonesia': ['ID'],
		'Czech Republic': ['CZ'], 'Czechoslovakia': ['XC'], 'Venezuela': ['VE'], 'Ireland': ['IE'],
		'Taiwan': ['TW'], 'Chile': ['CL'], 'Peru': ['PE'], 'South Korea': ['KR'], 'Worldwide': ['XW'],
		'Israel': ['IL'], 'Bulgaria': ['BG'], 'Thailand': ['TH'], 'Scandinavia': ['SE', 'NO', 'FI'],
		'German Democratic Republic (GDR)': ['XG'], 'China': ['CN'], 'Croatia': ['HR'], 'Hong Kong': ['HK'],
		'Philippines': ['PH'], 'Serbia': ['RS'], 'Ecuador': ['EC'], 'Lithuania': ['LT'], 'East Timor': ['TL'],
		'UK, Europe & US': ['GB', 'XE', 'US'], 'USA & Europe': ['US', 'XE'], 'Dutch East Indies': ['ID'],
		'Germany, Austria, & Switzerland': ['DE', 'AT', 'CH'], 'Singapore': ['SG'], 'Slovenia': ['SI'],
		'Slovakia': ['SK'], 'Uruguay': ['UY'], 'Australasia': ['AU'],  'Iceland': ['IS'], 'Bolivia': ['BO'],
		'UK & Ireland': ['GB', 'IE'], 'Nigeria': ['NG'], 'Estonia': ['EE'], 'Egypt': ['EG'], 'Cuba': ['CU'],
		'USA, Canada & Europe': ['US', 'CA', 'XE'], 'Benelux': ['BE', 'NL', 'LU'], 'Panama': ['PA'],
		'UK & US': ['GB', 'US'], 'Pakistan': ['PK'], 'Lebanon': ['LB'], 'Costa Rica': ['CR'], 'Latvia': ['LV'],
		'Puerto Rico': ['PR'], 'Kenya': ['KE'], 'Iran': ['IR'], 'Belarus': ['BY'], 'Morocco': ['MA'],
		'Guatemala': ['GT'], 'Saudi Arabia': ['SA'], 'Trinidad & Tobago': ['TT'], 'Barbados': ['BB'],
		'USA, Canada & UK': ['US', 'CA', 'GB'], 'Luxembourg': ['LU'], 'Czech Republic & Slovakia': ['CZ', 'SK'],
		'Bosnia & Herzegovina': ['BA'], 'Macedonia': ['MK'], 'Madagascar': ['MG'], 'Ghana': ['GH'], 'Iraq': ['IQ'],
		'Zimbabwe': ['ZW'], 'El Salvador': ['SV'], 'North America (inc Mexico)': ['US', 'CA', 'MX'],
		'Algeria': ['DZ'], 'Singapore, Malaysia & Hong Kong': ['SG', 'MY', 'HK'], 'Dominican Republic': ['DO'],
		'France & Benelux': ['FR', 'BE', 'NL', 'LU'], 'Ivory Coast': ['CI'], 'Tunisia': ['TN'], 'Kuwait': ['KW'],
		'Reunion': ['RE'], 'Angola': ['AO'], 'Serbia and Montenegro': ['RS', 'ME'], 'Georgia': ['GE'],
		'United Arab Emirates': ['AE'], 'Congo, Democratic Republic of the': ['CD'], 'Mauritius': ['MU'],
		'Germany & Switzerland': ['DE', 'CH'], 'Malta': ['MT'], 'Mozambique': ['MZ'], 'Guadeloupe': ['GP'],
		'Australia & New Zealand': ['AU', 'NZ'], 'Azerbaijan': ['AZ'], 'Zambia': ['ZM'], 'Kazakhstan': ['KZ'],
		'Nicaragua': ['NI'], 'Syria': ['SY'], 'Senegal': ['SN'], 'Paraguay': ['PY'], 'Wake Island': ['MH'],
		'UK & France': ['GB', 'FR'], 'Vietnam': ['VN'], 'UK, Europe & Japan': ['GB', 'XE', 'JP'],
		'Bahamas, The': ['BS'], 'Ethiopia': ['ET'], 'Suriname': ['SR'], 'Haiti': ['HT'], 'South America': ['ZA'],
		'Singapore & Malaysia': ['SG', 'MY'], 'Moldova, Republic of': ['MD'], 'Faroe Islands': ['FO'],
		'Cameroon': ['CM'], 'South Vietnam': ['VN'], 'Uzbekistan': ['UZ'], 'Albania': ['AL'], 'Honduras': ['HN'],
		'Martinique': ['MQ'], 'Benin': ['BJ'], 'Sri Lanka': ['LK'], 'Andorra': ['AD'], 'Liechtenstein': ['LI'],
		'Curaçao': ['CW'], 'Mali': ['ML'], 'Guinea': ['GN'], 'Congo, Republic of the': ['CG'], 'Sudan': ['SD'],
		'Mongolia': ['MN'], 'Nepal': ['NP'], 'French Polynesia': ['PF'], 'Greenland': ['GL'], 'Uganda': ['UG'],
		'Bohemia': ['CZ'], 'Bangladesh': ['BD'], 'Armenia': ['AM'], 'North Korea': ['KP'], 'Bermuda': ['BM'],
		'Seychelles': ['SC'], 'Cambodia': ['KH'], 'Guyana': ['GY'], 'Tanzania': ['TZ'], 'Bahrain': ['BH'],
		'Jordan': ['JO'], 'Libya': ['LY'], 'Montenegro': ['ME'], 'Gabon': ['GA'], 'Togo': ['TG'], 'Yemen': ['YE'],
		'Afghanistan': ['AF'], 'Cayman Islands': ['KY'], 'Monaco': ['MC'], 'Papua New Guinea': ['PG'],
		'Belize': ['BZ'], 'Fiji': ['FJ'], 'UK & Germany': ['UK', 'DE'], 'New Caledonia': ['NC'], 'Qatar': ['QA'],
		'Protectorate of Bohemia and Moravia': ['CZ' /*'XP'*/], 'Saint Helena' : ['SH'], 'Laos': ['LA'], 'Dahomey': ['BJ'],
		'UK, Europe & Israel': ['GB', 'XE', 'IL'], 'French Guiana': ['GF'], 'Aruba': ['AW'], 'Dominica': ['DM'],
		'San Marino': ['SM'], 'Kyrgyzstan': ['KG'], 'Upper Volta': ['BF'], 'Burkina Faso': ['BF'], 'Oman': ['OM'],
		'Turkmenistan': ['TM'], 'Namibia': ['NA'], 'Sierra Leone': ['SL'], 'Marshall Islands': ['MH'],
		'Guernsey': ['GG'], 'Jersey': ['JE'], 'Guam': ['GU'], 'Central African Republic': ['CF'], 'Tonga': ['TO'],
		'Eritrea': ['ER'], 'Saint Kitts and Nevis': ['KN'], 'Grenada': ['GD'], 'Somalia': ['SO'], 'Malawi': ['MW'],
		'Liberia': ['LR'], 'Sint Maarten': ['SX'], 'Saint Lucia': ['LC'], 'Lesotho': ['LS'], 'Maldives': ['MV'],
		'Saint Vincent and the Grenadines': ['VC'], 'Guinea-Bissau': ['GW'], 'Botswana': ['BW'], 'Palau': ['PW'],
		'Comoros': ['KM'], 'Gibraltar': ['GI'], 'Cook Islands': ['CK'], 'Kosovo': ['XK'], 'Bhutan': ['BT'],
		'Gulf Cooperation Council': ['BH', 'KW', 'OM', 'QA', 'SA', 'AE'], 'Niger': ['NE'], 'Mauritania': ['MR'],
		'Anguilla': ['AI'], 'Sao Tome and Principe': ['ST'], 'Djibouti': ['DJ'], 'Mayotte': ['YT'],
		'Montserrat': ['MS'], 'Vanuatu': ['VU'], 'Norfolk Island': ['NF'], 'Gaza Strip': ['PS'], 'Macau': ['MO'],
		'Solomon Islands': ['SB'], 'Turks and Caicos Islands': ['TC'], 'Northern Mariana Islands': ['MP'],
		'Equatorial Guinea': ['GQ'], 'American Samoa': ['AS'], 'Chad': ['TD'], 'Falkland Islands': ['FK'],
		'Antarctica': ['AQ'], 'Nauru': ['NR'], 'Niue': ['NU'], 'Saint Pierre and Miquelon': ['PM'],
		'Tokelau': ['TK'], 'Tuvalu': ['TV'], 'Wallis and Futuna': ['WF'], 'Korea': ['KR'], 'Abkhazia': ['GE'],
		'Antigua & Barbuda': ['AG'], 'Austria-Hungary': ['AT', 'HU'], 'British Virgin Islands': ['VG'],
		'Brunei': ['BN'], 'Burma': ['MM'], 'Cape Verde': ['CV'], 'Virgin Islands': ['VI'], 'Tibet' : ['CN'],
		'Vatican City': ['VA'], 'Swaziland': ['SZ'], 'Southern Sudan': ['SS'], 'Palestine': ['PS'],
		'Singapore, Malaysia, Hong Kong & Thailand': ['SG', 'MY', 'HK', 'TH'], 'Pitcairn Islands': ['PN'],
		'Micronesia, Federated States of': ['FM'], 'Man, Isle of': ['IM'], 'Zanzibar': ['TZ'], 'Burundi' : ['BI'],
		'Korea (pre-1945)': ['KR'], 'Hong Kong & Thailand': ['HK', 'TH'], 'Gambia, The': ['GM'], 'Zaire': ['ZR'],
		'South Georgia and the South Sandwich Islands' : ['GS'], 'Cocos (Keeling) Islands' : ['CC'],
		'Kiribati' : ['KI'], 'Christmas Island' : ['CX'], 'French Southern & Antarctic Lands' : ['TF'],
		'British Indian Ocean Territory' : ['IO'], 'Western Sahara': ['EH'],  'Rhodesia': ['ZW'], 'Samoa': ['WS'],
		'Southern Rhodesia': ['ZW'], 'West Bank': ['PS'], 'Belgian Congo': ['CD'], 'Ottoman Empire': ['TR'],
		'Netherlands Antilles': ['AW', 'BQ', 'CW', 'BQ', 'SX'],  'Tajikistan': ['TJ'], 'Rwanda': ['RW'],
		'Indochina': ['KH', 'MY', 'MM', 'TH', 'VN', '	LA'], 'South West Africa': ['NA'],
		'Russia & CIS': ['RU', 'AM', 'AZ', 'BY', 'KZ', 'KG', 'MD', 'TJ', 'UZ']/*.concat('TM', 'UA')*/,
		'Central America': ['BZ', 'CR', 'SV', 'GT', 'HN', 'NI', 'PA'],
		'South East Asia': ['BN', 'KH', 'TL', 'ID', 'LA', 'MY', 'MM', 'PH', 'SG', 'TH', 'VN'],
		'Middle East': ['BH', 'CY', 'EG', 'IR', 'IQ', 'IL', 'JO', 'KW', 'LB', 'OM', 'PS', 'QA', 'SA', 'SY', 'TR', 'AE', 'YE'],
		'Asia': ['AF', 'AM', 'AZ', 'BH', 'BD', 'BT', 'BN', 'KH', 'CN', 'CY', 'TL', 'EG', 'GE', 'IN', 'ID', 'IR', 'IQ', 'IL', 'JP', 'JO', 'KZ', 'KW', 'KG', 'LA', 'LB', 'MY', 'MV', 'MN', 'MM', 'NP', 'KP', 'OM', 'PK', 'PS', 'PH', 'QA', 'RU', 'SA', 'SG', 'KR', 'LK', 'SY', 'TW', 'TJ', 'TH', 'TR', 'TM', 'AE', 'UZ', 'VN', 'YE'],
		'Africa': ['DZ', 'EG', 'LY', 'MA', 'TN', 'EH', 'BI', 'KM', 'DJ', 'ER', 'ET', 'TF', 'KE', 'MG', 'MW', 'MU', 'YT', 'MZ', 'RE', 'RW', 'SC', 'SO', 'SS', 'SD', 'TZ', 'UG', 'ZM', 'ZW', 'AO', 'CM', 'CF', 'TD', 'CG', 'CD', 'GQ', 'GA', 'ST', 'BW', 'SZ', 'LS', 'NA', 'ZA', 'BJ', 'BF', 'CV', 'GM', 'GH', 'GN', 'GW', 'CI', 'LR', 'ML', 'MR', 'NE', 'NG', 'SH', 'SN', 'SL', 'TG'],
		'North & South America': ['AI', 'AG', 'AW', 'BS', 'BB', 'BZ', 'BM', 'BQ', 'VG', 'CA', 'KY', 'CR', 'CU', 'CW', 'DM', 'DO', 'SV', 'GL', 'GD', 'GP', 'GT', 'HT', 'HN', 'JM', 'MQ', 'MX', 'MS', 'NI', 'VE', 'PA', 'PR', 'BL', 'KN', 'LC', 'MF', 'PM', 'VC', 'SX', 'TT', 'TC', 'US', 'VI', 'AR', 'BO', 'BV', 'BR', 'CL', 'CO', 'EC', 'FK', 'GF', 'GY', 'PY', 'PE', 'GS', 'SR', 'UY'],
		'South Pacific': ['AU', 'CK', 'FJ', 'KI', 'MH', 'FM', 'NR', 'NZ', 'NU', 'PW', 'PG', 'WS', 'SB', 'TO', 'TV', 'VU'],
		'Unknown': [undefined],
	});
	const discogsCountryToIso3166Mapper = discogsCountry => discogsCountries[discogsCountry] || [discogsCountry || undefined];
	const countryPrettyPrint = countryCode => countryCode && ({ XE: 'EU' }[countryCode = countryCode.toUpperCase()]
		|| Object.keys(discogsCountries).find(countryName => discogsCountries[countryName].every(cc => cc == countryCode)) || countryCode);
	const iso3166ToFlagCodes = langCodes => langCodes && Array.prototype.concat.apply([ ], langCodes.map(langCode =>
		langCode && (({ XC: ['cz', 'sk'], XP: 'cz' }[langCode.toUpperCase()]) || langCode.toLowerCase())));
	const range = (from, to) => Array.from(Array(to + 1 - from), (_, index) => from + index);
	const detectLanguage = literals => detectAlphabet(literals, {
		eng: [range(0x20, 0x5F), range(0x61, 0x7A), 0x7C, 0xA0, 0xA7, 0xA9, range(0x2010, 0x2011), range(0x2013, 0x2014), range(0x2018, 0x2019), range(0x201C, 0x201D), range(0x2020, 0x2021), 0x2026, 0x2030, range(0x2032, 0x2033), 0x20AC], fra: [range(0x20, 0x5F), range(0x61, 0x7A), 0x7C, 0xA0, 0xA7, 0xA9, 0xAB, range(0xB2, 0xB3), 0xBB, 0xC0, 0xC2, range(0xC6, 0xCB), range(0xCE, 0xCF), 0xD4, 0xD9, range(0xDB, 0xDC), 0xE0, 0xE2, range(0xE6, 0xEB), range(0xEE, 0xEF), 0xF4, 0xF9, range(0xFB, 0xFC), 0xFF, range(0x152, 0x153), 0x178, 0x2B3, 0x2E2, range(0x1D48, 0x1D49), range(0x2010, 0x2011), range(0x2013, 0x2014), 0x2019, range(0x201C, 0x201D), range(0x2020, 0x2021), 0x2026, range(0x202F, 0x2030), 0x20AC, 0x2212],
		jpn: [range(0x20, 0x40), range(0x5B, 0x5F), range(0x7B, 0x7D), 0xA0, 0xA7, 0xA9, 0xB6, range(0x2010, 0x2011), range(0x2014, 0x2016), range(0x2018, 0x2019), range(0x201C, 0x201D), range(0x2020, 0x2021), range(0x2025, 0x2026), 0x2030, range(0x2032, 0x2033), 0x203B, 0x203E, 0x20AC, range(0x3001, 0x3003), 0x3005, range(0x3008, 0x3011), range(0x3014, 0x3015), 0x301C, range(0x3041, 0x3093), range(0x309D, 0x309E), range(0x30A1, 0x30F6), range(0x30FB, 0x30FE), range(0x4E00, 0x4E01), 0x4E03, range(0x4E07, 0x4E0B), range(0x4E0D, 0x4E0E), 0x4E14, 0x4E16, range(0x4E18, 0x4E19), 0x4E21, 0x4E26, 0x4E2D, 0x4E32, range(0x4E38, 0x4E39), range(0x4E3B, 0x4E3C), 0x4E45, 0x4E4F, 0x4E57, 0x4E59, range(0x4E5D, 0x4E5E), 0x4E71, 0x4E73, 0x4E7E, 0x4E80, 0x4E86, range(0x4E88, 0x4E89), range(0x4E8B, 0x4E8C), 0x4E92, range(0x4E94, 0x4E95), 0x4E9C, 0x4EA1, 0x4EA4, range(0x4EAB, 0x4EAD), 0x4EBA, 0x4EC1, range(0x4ECA, 0x4ECB), 0x4ECF, range(0x4ED5, 0x4ED6), range(0x4ED8, 0x4ED9), range(0x4EE3, 0x4EE5), 0x4EEE, 0x4EF0, 0x4EF2, 0x4EF6, 0x4EFB, 0x4F01, range(0x4F0E, 0x4F11), 0x4F1A, 0x4F1D, 0x4F2F, 0x4F34, 0x4F38, 0x4F3A, 0x4F3C, 0x4F46, range(0x4F4D, 0x4F50), 0x4F53, 0x4F55, 0x4F59, 0x4F5C, 0x4F73, 0x4F75, 0x4F7F, 0x4F8B, 0x4F8D, 0x4F9B, 0x4F9D, 0x4FA1, range(0x4FAE, 0x4FAF), range(0x4FB5, 0x4FB6), 0x4FBF, range(0x4FC2, 0x4FC3), 0x4FCA, 0x4FD7, 0x4FDD, 0x4FE1, 0x4FEE, 0x4FF3, 0x4FF5, 0x4FF8, 0x4FFA, 0x5009, 0x500B, 0x500D, 0x5012, 0x5019, 0x501F, range(0x5023, 0x5024), 0x502B, 0x5039, 0x5049, 0x504F, 0x505C, 0x5065, range(0x5074, 0x5076), 0x507D, 0x508D, 0x5091, range(0x5098, 0x5099), 0x50AC, 0x50B2, 0x50B5, 0x50B7, 0x50BE, 0x50C5, 0x50CD, 0x50CF, 0x50D5, 0x50DA, 0x50E7, 0x5100, 0x5104, 0x5112, 0x511F, 0x512A, range(0x5143, 0x5146), range(0x5148, 0x5149), 0x514B, 0x514D, 0x5150, 0x515A, 0x5165, 0x5168, range(0x516B, 0x516D), 0x5171, 0x5175, range(0x5177, 0x5178), 0x517C, range(0x5185, 0x5186), 0x518A, 0x518D, 0x5192, 0x5197, 0x5199, 0x51A0, 0x51A5, 0x51AC, range(0x51B6, 0x51B7), 0x51C4, 0x51C6, 0x51CD, 0x51DD, 0x51E1, 0x51E6, 0x51F6, range(0x51F8, 0x51FA), 0x5200, 0x5203, range(0x5206, 0x5208), 0x520A, 0x5211, 0x5217, 0x521D, range(0x5224, 0x5225), 0x5229, 0x5230, range(0x5236, 0x523B), 0x5247, 0x524A, 0x524D, 0x5256, 0x525B, range(0x5263, 0x5265), range(0x526F, 0x5270), 0x5272, 0x5275, 0x5287, 0x529B, range(0x529F, 0x52A0), 0x52A3, range(0x52A9, 0x52AA), 0x52B1, 0x52B4, 0x52B9, 0x52BE, 0x52C3, 0x52C5, 0x52C7, 0x52C9, 0x52D5, range(0x52D8, 0x52D9), 0x52DD, 0x52DF, 0x52E2, 0x52E4, 0x52E7, 0x52F2, 0x52FE, 0x5302, 0x5305, range(0x5316, 0x5317), 0x5320, range(0x5339, 0x533B), 0x533F, 0x5341, 0x5343, range(0x5347, 0x5348), 0x534A, range(0x5351, 0x5354), range(0x5357, 0x5358), 0x535A, 0x5360, range(0x5370, 0x5371), range(0x5373, 0x5375), 0x5378, 0x5384, 0x5398, 0x539A, 0x539F, 0x53B3, 0x53BB, 0x53C2, 0x53C8, range(0x53CA, 0x53CE), 0x53D4, range(0x53D6, 0x53D7), 0x53D9, range(0x53E3, 0x53E5), range(0x53EB, 0x53EC), range(0x53EF, 0x53F3), range(0x53F7, 0x53F8), 0x5404, range(0x5408, 0x5409), range(0x540C, 0x5411), 0x541B, 0x541F, 0x5426, 0x542B, range(0x5438, 0x5439), 0x5442, range(0x5448, 0x544A), 0x5468, 0x546A, 0x5473, range(0x547C, 0x547D), 0x548C, 0x54B2, 0x54BD, range(0x54C0, 0x54C1), 0x54E1, 0x54F2, 0x54FA, 0x5504, range(0x5506, 0x5507), 0x5510, 0x552F, 0x5531, 0x553E, 0x5546, 0x554F, 0x5553, 0x5584, 0x5589, 0x559A, range(0x559C, 0x559D), range(0x55A9, 0x55AB), 0x55B6, 0x55C5, 0x55E3, 0x5606, range(0x5631, 0x5632), 0x5668, 0x5674, 0x5687, range(0x56DA, 0x56DB), 0x56DE, 0x56E0, 0x56E3, 0x56F0, range(0x56F2, 0x56F3), 0x56FA, 0x56FD, 0x570F, 0x5712, 0x571F, range(0x5727, 0x5728), 0x5730, 0x5742, 0x5747, 0x574A, 0x5751, 0x576A, 0x5782, 0x578B, 0x57A3, 0x57CB, 0x57CE, 0x57DF, 0x57F7, range(0x57F9, 0x57FA), 0x57FC, 0x5800, 0x5802, range(0x5805, 0x5806), 0x5815, 0x5824, 0x582A, 0x5831, 0x5834, range(0x5840, 0x5841), 0x584A, 0x5851, 0x5854, 0x5857, 0x585A, 0x585E, 0x5869, 0x586B, 0x587E, 0x5883, 0x5893, 0x5897, 0x589C, 0x58A8, 0x58B3, 0x58BE, 0x58C1, 0x58C7, 0x58CA, 0x58CC, 0x58EB, 0x58EE, range(0x58F0, 0x58F2), 0x5909, 0x590F, range(0x5915, 0x5916), 0x591A, 0x591C, 0x5922, 0x5927, range(0x5929, 0x592B), 0x592E, 0x5931, range(0x5947, 0x5949), 0x594F, 0x5951, 0x5954, 0x5965, 0x5968, 0x596A, 0x596E, range(0x5973, 0x5974), 0x597D, range(0x5982, 0x5984), 0x598A, 0x5996, 0x5999, 0x59A5, 0x59A8, 0x59AC, 0x59B9, 0x59BB, 0x59C9, 0x59CB, range(0x59D3, 0x59D4), 0x59EB, 0x59FB, 0x59FF, 0x5A01, 0x5A18, 0x5A20, 0x5A2F, 0x5A46, 0x5A5A, 0x5A66, 0x5A7F, 0x5A92, 0x5A9B, 0x5AC1, 0x5AC9, 0x5ACC, 0x5AE1, 0x5B22, 0x5B50, 0x5B54, range(0x5B57, 0x5B58), 0x5B5D, range(0x5B63, 0x5B64), 0x5B66, 0x5B6B, 0x5B85, range(0x5B87, 0x5B89), 0x5B8C, range(0x5B97, 0x5B9D), 0x5B9F, range(0x5BA2, 0x5BA4), 0x5BAE, 0x5BB0, range(0x5BB3, 0x5BB6), 0x5BB9, 0x5BBF, 0x5BC2, 0x5BC4, 0x5BC6, 0x5BCC, 0x5BD2, 0x5BDB, 0x5BDD, 0x5BDF, 0x5BE1, 0x5BE7, 0x5BE9, 0x5BEE, 0x5BF8, 0x5BFA, range(0x5BFE, 0x5BFF), range(0x5C01, 0x5C02), 0x5C04, 0x5C06, range(0x5C09, 0x5C0B), range(0x5C0E, 0x5C0F), 0x5C11, 0x5C1A, 0x5C31, range(0x5C3A, 0x5C40), 0x5C45, 0x5C48, range(0x5C4A, 0x5C4B), 0x5C55, 0x5C5E, range(0x5C64, 0x5C65), 0x5C6F, 0x5C71, 0x5C90, 0x5CA1, 0x5CA9, 0x5CAC, 0x5CB3, 0x5CB8, range(0x5CE0, 0x5CE1), 0x5CF0, 0x5CF6, 0x5D07, 0x5D0E, 0x5D16, 0x5D29, 0x5D50, range(0x5DDD, 0x5DDE), 0x5DE1, 0x5DE3, range(0x5DE5, 0x5DE8), 0x5DEE, 0x5DF1, 0x5DFB, 0x5DFE, range(0x5E02, 0x5E03), 0x5E06, 0x5E0C, 0x5E1D, 0x5E25, 0x5E2B, 0x5E2D, range(0x5E2F, 0x5E30), 0x5E33, 0x5E38, 0x5E3D, 0x5E45, 0x5E55, 0x5E63, range(0x5E72, 0x5E74), range(0x5E78, 0x5E79), range(0x5E7B, 0x5E7E), 0x5E81, 0x5E83, 0x5E8A, 0x5E8F, 0x5E95, 0x5E97, 0x5E9C, range(0x5EA6, 0x5EA7), 0x5EAB, 0x5EAD, range(0x5EB6, 0x5EB8), 0x5EC3, range(0x5EC9, 0x5ECA), range(0x5EF6, 0x5EF7), 0x5EFA, 0x5F01, 0x5F04, 0x5F0A, range(0x5F0F, 0x5F10), range(0x5F13, 0x5F15), 0x5F1F, range(0x5F25, 0x5F27), 0x5F31, 0x5F35, 0x5F37, 0x5F3E, 0x5F53, 0x5F59, 0x5F62, 0x5F69, 0x5F6B, range(0x5F70, 0x5F71), 0x5F79, 0x5F7C, range(0x5F80, 0x5F81), range(0x5F84, 0x5F85), range(0x5F8B, 0x5F8C), 0x5F90, range(0x5F92, 0x5F93), 0x5F97, 0x5FA1, range(0x5FA9, 0x5FAA), 0x5FAE, range(0x5FB3, 0x5FB4), 0x5FB9, 0x5FC3, 0x5FC5, range(0x5FCC, 0x5FCD), range(0x5FD7, 0x5FD9), 0x5FDC, 0x5FE0, 0x5FEB, 0x5FF5, 0x6012, 0x6016, 0x601D, 0x6020, 0x6025, range(0x6027, 0x6028), 0x602A, 0x604B, 0x6050, 0x6052, 0x6063, 0x6065, range(0x6068, 0x6069), 0x606D, 0x606F, 0x6075, 0x6094, range(0x609F, 0x60A0), 0x60A3, 0x60A6, range(0x60A9, 0x60AA), 0x60B2, 0x60BC, 0x60C5, 0x60D1, 0x60DC, range(0x60E7, 0x60E8), 0x60F0, 0x60F3, 0x6101, 0x6109, 0x610F, range(0x611A, 0x611B), 0x611F, 0x6144, 0x6148, range(0x614B, 0x614C), 0x614E, 0x6155, range(0x6162, 0x6163), 0x6168, 0x616E, 0x6170, 0x6176, 0x6182, 0x618E, 0x61A4, 0x61A7, 0x61A9, 0x61AC, 0x61B2, 0x61B6, 0x61BE, 0x61C7, 0x61D0, 0x61F2, 0x61F8, range(0x6210, 0x6212), 0x621A, 0x6226, 0x622F, 0x6234, 0x6238, 0x623B, range(0x623F, 0x6240), 0x6247, 0x6249, 0x624B, 0x624D, 0x6253, 0x6255, 0x6271, 0x6276, 0x6279, range(0x627F, 0x6280), 0x6284, 0x628A, 0x6291, 0x6295, range(0x6297, 0x6298), 0x629C, 0x629E, 0x62AB, 0x62B1, 0x62B5, 0x62B9, range(0x62BC, 0x62BD), 0x62C5, 0x62C9, 0x62CD, 0x62D0, range(0x62D2, 0x62D3), range(0x62D8, 0x62D9), 0x62DB, 0x62DD, range(0x62E0, 0x62E1), range(0x62EC, 0x62ED), 0x62F3, range(0x62F6, 0x62F7), 0x62FE, 0x6301, 0x6307, 0x6311, 0x6319, 0x631F, 0x6328, 0x632B, 0x632F, 0x633F, 0x6349, 0x6355, 0x6357, 0x635C, 0x6368, 0x636E, 0x637B, 0x6383, 0x6388, 0x638C, 0x6392, 0x6398, 0x639B, range(0x63A1, 0x63A2), 0x63A5, range(0x63A7, 0x63A8), 0x63AA, 0x63B2, range(0x63CF, 0x63D0), range(0x63DA, 0x63DB), 0x63E1, 0x63EE, 0x63F4, 0x63FA, 0x640D, range(0x642C, 0x642D), 0x643A, 0x643E, 0x6442, 0x6458, 0x6469, 0x646F, 0x6483, 0x64A4, 0x64AE, 0x64B2, 0x64C1, 0x64CD, 0x64E6, 0x64EC, 0x652F, 0x6539, 0x653B, range(0x653E, 0x653F), 0x6545, 0x654F, 0x6551, 0x6557, 0x6559, range(0x6562, 0x6563), 0x656C, 0x6570, range(0x6574, 0x6575), 0x6577, 0x6587, 0x6589, 0x658E, 0x6591, 0x6597, 0x6599, 0x659C, range(0x65A4, 0x65A5), range(0x65AC, 0x65AD), 0x65B0, 0x65B9, 0x65BD, 0x65C5, 0x65CB, 0x65CF, 0x65D7, 0x65E2, range(0x65E5, 0x65E9), 0x65EC, 0x65FA, range(0x6606, 0x6607), 0x660E, range(0x6613, 0x6614), range(0x661F, 0x6620), 0x6625, range(0x6627, 0x6628), 0x662D, 0x662F, 0x663C, 0x6642, 0x6669, range(0x666E, 0x666F), 0x6674, 0x6676, 0x6681, 0x6687, 0x6691, range(0x6696, 0x6697), 0x66A6, 0x66AB, 0x66AE, 0x66B4, 0x66C7, 0x66D6, 0x66DC, 0x66F2, 0x66F4, range(0x66F8, 0x66F9), 0x66FD, range(0x66FF, 0x6700), range(0x6708, 0x6709), 0x670D, 0x6715, 0x6717, 0x671B, 0x671D, 0x671F, 0x6728, range(0x672A, 0x672D), 0x6731, 0x6734, 0x673A, 0x673D, 0x6749, range(0x6750, 0x6751), 0x675F, 0x6761, 0x6765, 0x676F, 0x6771, range(0x677E, 0x677F), 0x6790, 0x6795, 0x6797, 0x679A, range(0x679C, 0x679D), 0x67A0, 0x67A2, 0x67AF, 0x67B6, 0x67C4, 0x67D0, range(0x67D3, 0x67D4), 0x67F1, 0x67F3, 0x67F5, 0x67FB, 0x67FF, range(0x6803, 0x6804), 0x6813, 0x6821, 0x682A, range(0x6838, 0x6839), range(0x683C, 0x683D), 0x6841, 0x6843, 0x6848, 0x6851, 0x685C, 0x685F, 0x6885, 0x6897, 0x68A8, 0x68B0, 0x68C4, 0x68CB, 0x68D2, 0x68DA, 0x68DF, 0x68EE, 0x68FA, 0x6905, range(0x690D, 0x690E), 0x691C, 0x696D, 0x6975, 0x6977, range(0x697C, 0x697D), 0x6982, 0x69CB, 0x69D8, 0x69FD, 0x6A19, 0x6A21, range(0x6A29, 0x6A2A), 0x6A39, 0x6A4B, 0x6A5F, 0x6B04, range(0x6B20, 0x6B21), 0x6B27, 0x6B32, 0x6B3A, 0x6B3E, 0x6B4C, 0x6B53, range(0x6B62, 0x6B63), 0x6B66, 0x6B69, 0x6B6F, range(0x6B73, 0x6B74), 0x6B7B, range(0x6B89, 0x6B8B), 0x6B96, range(0x6BB4, 0x6BB5), range(0x6BBA, 0x6BBB), range(0x6BBF, 0x6BC0), range(0x6BCD, 0x6BCE), 0x6BD2, 0x6BD4, 0x6BDB, 0x6C0F, 0x6C11, 0x6C17, 0x6C34, range(0x6C37, 0x6C38), 0x6C3E, range(0x6C41, 0x6C42), 0x6C4E, 0x6C57, 0x6C5A, range(0x6C5F, 0x6C60), 0x6C70, 0x6C7A, 0x6C7D, 0x6C83, 0x6C88, 0x6C96, 0x6C99, range(0x6CA1, 0x6CA2), 0x6CB3, range(0x6CB8, 0x6CB9), range(0x6CBB, 0x6CBC), 0x6CBF, 0x6CC1, range(0x6CC9, 0x6CCA), 0x6CCC, 0x6CD5, range(0x6CE1, 0x6CE3), 0x6CE5, 0x6CE8, 0x6CF0, 0x6CF3, 0x6D0B, 0x6D17, 0x6D1E, 0x6D25, 0x6D2A, 0x6D3B, 0x6D3E, 0x6D41, range(0x6D44, 0x6D45), 0x6D5C, 0x6D66, 0x6D6A, 0x6D6E, 0x6D74, range(0x6D77, 0x6D78), 0x6D88, 0x6D99, 0x6DAF, 0x6DB2, 0x6DBC, 0x6DD1, 0x6DE1, 0x6DEB, 0x6DF1, 0x6DF7, 0x6DFB, 0x6E05, range(0x6E07, 0x6E09), 0x6E0B, 0x6E13, 0x6E1B, 0x6E21, 0x6E26, 0x6E29, 0x6E2C, 0x6E2F, 0x6E56, 0x6E67, 0x6E6F, range(0x6E7E, 0x6E80), 0x6E90, 0x6E96, 0x6E9D, 0x6EB6, 0x6EBA, 0x6EC5, 0x6ECB, 0x6ED1, range(0x6EDD, 0x6EDE), 0x6EF4, range(0x6F01, 0x6F02), 0x6F06, 0x6F0F, 0x6F14, 0x6F20, 0x6F22, range(0x6F2B, 0x6F2C), 0x6F38, 0x6F54, 0x6F5C, 0x6F5F, 0x6F64, 0x6F6E, 0x6F70, 0x6F84, range(0x6FC0, 0x6FC1), 0x6FC3, 0x6FEB, 0x6FEF, 0x702C, 0x706B, range(0x706F, 0x7070), 0x707D, range(0x7089, 0x708A), 0x708E, 0x70AD, range(0x70B9, 0x70BA), 0x70C8, 0x7121, 0x7126, 0x7136, 0x713C, 0x714E, 0x7159, 0x7167, 0x7169, 0x716E, 0x718A, 0x719F, 0x71B1, 0x71C3, 0x71E5, 0x7206, 0x722A, range(0x7235, 0x7236), 0x723D, range(0x7247, 0x7248), 0x7259, 0x725B, 0x7267, 0x7269, 0x7272, 0x7279, 0x72A0, 0x72AC, 0x72AF, 0x72B6, 0x72C2, 0x72D9, 0x72E9, range(0x72EC, 0x72ED), 0x731B, 0x731F, 0x732B, 0x732E, 0x7336, 0x733F, 0x7344, 0x7363, 0x7372, 0x7384, 0x7387, 0x7389, 0x738B, 0x73A9, 0x73CD, 0x73E0, 0x73ED, 0x73FE, 0x7403, 0x7406, 0x7434, 0x7460, 0x7483, 0x74A7, 0x74B0, 0x74BD, 0x74E6, 0x74F6, 0x7518, 0x751A, 0x751F, 0x7523, 0x7528, range(0x7530, 0x7533), 0x7537, range(0x753A, 0x753B), 0x754C, 0x754F, 0x7551, 0x7554, 0x7559, range(0x755C, 0x755D), 0x7565, 0x756A, 0x7570, 0x7573, 0x757F, 0x758E, 0x7591, 0x75AB, 0x75B2, 0x75BE, 0x75C5, 0x75C7, 0x75D5, 0x75D8, 0x75DB, 0x75E2, 0x75E9, 0x75F4, 0x760D, 0x7642, 0x7652, 0x7656, range(0x767A, 0x767B), range(0x767D, 0x767E), 0x7684, range(0x7686, 0x7687), 0x76AE, 0x76BF, 0x76C6, 0x76CA, 0x76D7, 0x76DB, 0x76DF, range(0x76E3, 0x76E4), 0x76EE, 0x76F2, 0x76F4, 0x76F8, 0x76FE, 0x7701, 0x7709, range(0x770B, 0x770C), range(0x771F, 0x7720), 0x773A, 0x773C, 0x7740, 0x7761, 0x7763, 0x7766, range(0x77AC, 0x77AD), 0x77B3, 0x77DB, 0x77E2, 0x77E5, 0x77ED, 0x77EF, 0x77F3, 0x7802, range(0x7814, 0x7815), 0x7832, 0x7834, 0x785D, range(0x786B, 0x786C), 0x7881, 0x7891, 0x78BA, 0x78C1, 0x78E8, 0x7901, 0x790E, 0x793A, 0x793C, 0x793E, range(0x7948, 0x7949), 0x7956, range(0x795D, 0x795E), 0x7965, 0x7968, 0x796D, 0x7981, 0x7985, 0x798D, 0x798F, range(0x79C0, 0x79C1), 0x79CB, range(0x79D1, 0x79D2), 0x79D8, 0x79DF, 0x79E9, 0x79F0, 0x79FB, 0x7A0B, 0x7A0E, 0x7A1A, 0x7A2E, 0x7A32, range(0x7A3C, 0x7A3D), range(0x7A3F, 0x7A40), 0x7A42, 0x7A4D, 0x7A4F, 0x7A6B, 0x7A74, 0x7A76, 0x7A7A, 0x7A81, 0x7A83, range(0x7A92, 0x7A93), 0x7A9F, range(0x7AAE, 0x7AAF), 0x7ACB, 0x7ADC, 0x7AE0, 0x7AE5, 0x7AEF, 0x7AF6, 0x7AF9, 0x7B11, 0x7B1B, 0x7B26, 0x7B2C, 0x7B46, 0x7B49, 0x7B4B, 0x7B52, 0x7B54, 0x7B56, 0x7B87, 0x7B8B, 0x7B97, 0x7BA1, 0x7BB1, 0x7BB8, 0x7BC0, 0x7BC4, 0x7BC9, 0x7BE4, 0x7C21, 0x7C3F, 0x7C4D, 0x7C60, 0x7C73, 0x7C89, 0x7C8B, 0x7C92, range(0x7C97, 0x7C98), 0x7C9B, 0x7CA7, 0x7CBE, 0x7CD6, 0x7CE7, 0x7CF8, 0x7CFB, 0x7CFE, 0x7D00, range(0x7D04, 0x7D05), 0x7D0B, 0x7D0D, 0x7D14, range(0x7D19, 0x7D1B), range(0x7D20, 0x7D22), 0x7D2B, range(0x7D2F, 0x7D30), 0x7D33, range(0x7D39, 0x7D3A), 0x7D42, 0x7D44, 0x7D4C, 0x7D50, 0x7D5E, 0x7D61, 0x7D66, 0x7D71, range(0x7D75, 0x7D76), 0x7D79, range(0x7D99, 0x7D9A), 0x7DAD, range(0x7DB1, 0x7DB2), 0x7DBB, 0x7DBF, 0x7DCA, 0x7DCF, range(0x7DD1, 0x7DD2), 0x7DDA, 0x7DE0, range(0x7DE8, 0x7DE9), 0x7DEF, 0x7DF4, 0x7DFB, 0x7E01, 0x7E04, 0x7E1B, 0x7E26, 0x7E2B, 0x7E2E, 0x7E3E, 0x7E41, 0x7E4A, range(0x7E54, 0x7E55), 0x7E6D, 0x7E70, 0x7F36, 0x7F6A, 0x7F6E, 0x7F70, 0x7F72, 0x7F75, 0x7F77, 0x7F85, 0x7F8A, 0x7F8E, 0x7F9E, 0x7FA4, range(0x7FA8, 0x7FA9), 0x7FBD, 0x7FC1, 0x7FCC, 0x7FD2, range(0x7FFB, 0x7FFC), 0x8001, 0x8003, 0x8005, 0x8010, 0x8015, 0x8017, 0x8033, 0x8056, 0x805E, 0x8074, 0x8077, 0x8089, 0x808C, 0x8096, 0x8098, 0x809D, range(0x80A1, 0x80A2), 0x80A5, range(0x80A9, 0x80AA), 0x80AF, 0x80B2, 0x80BA, 0x80C3, 0x80C6, 0x80CC, 0x80CE, 0x80DE, 0x80F4, 0x80F8, 0x80FD, 0x8102, 0x8105, range(0x8107, 0x8108), 0x810A, 0x811A, 0x8131, 0x8133, 0x814E, 0x8150, 0x8155, 0x816B, 0x8170, range(0x8178, 0x817A), 0x819A, range(0x819C, 0x819D), 0x81A8, 0x81B3, 0x81C6, 0x81D3, 0x81E3, 0x81E8, 0x81EA, 0x81ED, range(0x81F3, 0x81F4), 0x81FC, 0x8208, 0x820C, 0x820E, 0x8217, range(0x821E, 0x821F), 0x822A, 0x822C, range(0x8236, 0x8237), 0x8239, 0x8247, 0x8266, 0x826F, 0x8272, 0x8276, 0x828B, 0x829D, 0x82AF, 0x82B1, 0x82B3, 0x82B8, 0x82BD, 0x82D7, 0x82DB, range(0x82E5, 0x82E6), 0x82F1, 0x8302, 0x830E, 0x8328, 0x8336, 0x8349, 0x8352, 0x8358, 0x8377, 0x83CA, 0x83CC, 0x83D3, 0x83DC, 0x83EF, 0x840E, 0x843D, 0x8449, 0x8457, 0x845B, 0x846C, 0x84B8, 0x84C4, 0x84CB, 0x8511, 0x8535, 0x853D, 0x8584, 0x85A6, range(0x85AA, 0x85AC), 0x85CD, 0x85E4, 0x85E9, 0x85FB, 0x864E, 0x8650, 0x865A, 0x865C, 0x865E, 0x866B, 0x8679, 0x868A, 0x8695, 0x86C7, 0x86CD, 0x86EE, 0x8702, 0x871C, 0x878D, 0x8840, 0x8846, 0x884C, 0x8853, 0x8857, 0x885B, 0x885D, 0x8861, 0x8863, 0x8868, 0x8870, 0x8877, 0x888B, 0x8896, 0x88AB, range(0x88C1, 0x88C2), 0x88C5, 0x88CF, 0x88D5, 0x88DC, 0x88F8, range(0x88FD, 0x88FE), 0x8907, 0x8910, 0x8912, 0x895F, 0x8972, 0x897F, 0x8981, range(0x8986, 0x8987), 0x898B, 0x898F, 0x8996, 0x899A, 0x89A7, 0x89AA, 0x89B3, 0x89D2, 0x89E3, 0x89E6, 0x8A00, range(0x8A02, 0x8A03), 0x8A08, 0x8A0E, 0x8A13, range(0x8A17, 0x8A18), 0x8A1F, 0x8A2A, 0x8A2D, 0x8A31, range(0x8A33, 0x8A34), 0x8A3A, 0x8A3C, 0x8A50, range(0x8A54, 0x8A55), 0x8A5E, 0x8A60, 0x8A63, 0x8A66, 0x8A69, 0x8A6E, range(0x8A70, 0x8A73), 0x8A87, 0x8A89, range(0x8A8C, 0x8A8D), 0x8A93, 0x8A95, 0x8A98, 0x8A9E, 0x8AA0, 0x8AA4, range(0x8AAC, 0x8AAD), 0x8AB0, 0x8AB2, 0x8ABF, 0x8AC7, 0x8ACB, 0x8AD6, range(0x8AE6, 0x8AE7), range(0x8AED, 0x8AEE), 0x8AF8, 0x8AFE, range(0x8B00, 0x8B01), 0x8B04, 0x8B0E, 0x8B19, 0x8B1B, 0x8B1D, 0x8B21, 0x8B39, 0x8B58, 0x8B5C, 0x8B66, 0x8B70, 0x8B72, 0x8B77, 0x8C37, 0x8C46, 0x8C4A, 0x8C5A, 0x8C61, 0x8C6A, 0x8C8C, range(0x8C9D, 0x8C9E), range(0x8CA0, 0x8CA2), range(0x8CA7, 0x8CAC), 0x8CAF, 0x8CB4, range(0x8CB7, 0x8CB8), range(0x8CBB, 0x8CBC), range(0x8CBF, 0x8CC0), range(0x8CC2, 0x8CC4), 0x8CC7, 0x8CCA, 0x8CD3, range(0x8CDB, 0x8CDC), 0x8CDE, 0x8CE0, 0x8CE2, 0x8CE6, 0x8CEA, 0x8CED, 0x8CFC, 0x8D08, 0x8D64, 0x8D66, 0x8D70, 0x8D74, 0x8D77, 0x8D85, 0x8D8A, 0x8DA3, 0x8DB3, 0x8DDD, 0x8DE1, 0x8DEF, 0x8DF3, 0x8DF5, 0x8E0A, 0x8E0F, 0x8E2A, 0x8E74, 0x8E8D, 0x8EAB, 0x8ECA, range(0x8ECC, 0x8ECD), 0x8ED2, 0x8EDF, 0x8EE2, 0x8EF8, 0x8EFD, 0x8F03, 0x8F09, 0x8F1D, range(0x8F29, 0x8F2A), 0x8F38, 0x8F44, 0x8F9B, 0x8F9E, 0x8FA3, range(0x8FB1, 0x8FB2), 0x8FBA, 0x8FBC, 0x8FC5, 0x8FCE, 0x8FD1, 0x8FD4, 0x8FEB, 0x8FED, 0x8FF0, 0x8FF7, 0x8FFD, range(0x9000, 0x9001), 0x9003, 0x9006, range(0x900F, 0x9010), range(0x9013, 0x9014), 0x901A, 0x901D, range(0x901F, 0x9020), 0x9023, 0x902E, range(0x9031, 0x9032), 0x9038, 0x9042, 0x9045, 0x9047, range(0x904A, 0x904B), range(0x904D, 0x904E), range(0x9053, 0x9055), 0x905C, range(0x9060, 0x9061), 0x9063, 0x9069, range(0x906D, 0x906E), 0x9075, range(0x9077, 0x9078), 0x907A, 0x907F, 0x9084, 0x90A3, 0x90A6, 0x90AA, 0x90B8, 0x90CA, 0x90CE, 0x90E1, 0x90E8, 0x90ED, 0x90F5, 0x90F7, 0x90FD, range(0x914C, 0x914E), 0x9152, 0x9154, 0x9162, 0x916A, 0x916C, 0x9175, range(0x9177, 0x9178), 0x9192, 0x919C, 0x91B8, range(0x91C7, 0x91C8), range(0x91CC, 0x91CF), 0x91D1, range(0x91DC, 0x91DD), 0x91E3, 0x920D, 0x9234, 0x9244, 0x925B, 0x9262, 0x9271, 0x9280, 0x9283, 0x9285, 0x9298, 0x92AD, 0x92ED, 0x92F3, 0x92FC, 0x9320, 0x9326, 0x932C, range(0x932E, 0x932F), 0x9332, 0x934B, 0x935B, 0x9375, 0x938C, 0x9396, 0x93AE, 0x93E1, 0x9418, 0x9451, 0x9577, 0x9580, 0x9589, 0x958B, 0x9591, 0x9593, range(0x95A2, 0x95A3), 0x95A5, 0x95B2, 0x95C7, 0x95D8, 0x961C, 0x962A, 0x9632, 0x963B, 0x9644, 0x964D, 0x9650, 0x965B, range(0x9662, 0x9665), 0x966A, 0x9670, 0x9673, range(0x9675, 0x9676), 0x9678, 0x967A, 0x967D, range(0x9685, 0x9686), 0x968A, range(0x968E, 0x968F), 0x9694, 0x9699, range(0x969B, 0x969C), 0x96A0, 0x96A3, 0x96B7, 0x96BB, range(0x96C4, 0x96C7), 0x96CC, 0x96D1, range(0x96E2, 0x96E3), 0x96E8, 0x96EA, 0x96F0, 0x96F2, range(0x96F6, 0x96F7), 0x96FB, 0x9700, 0x9707, 0x970A, 0x971C, 0x9727, 0x9732, 0x9752, 0x9759, 0x975E, 0x9762, 0x9769, 0x9774, 0x97D3, 0x97F3, 0x97FB, 0x97FF, range(0x9802, 0x9803), range(0x9805, 0x9806), 0x9808, range(0x9810, 0x9813), 0x9818, range(0x982C, 0x982D), range(0x983B, 0x983C), range(0x984C, 0x984E), range(0x9854, 0x9855), 0x9858, 0x985E, 0x9867, 0x98A8, 0x98DB, 0x98DF, 0x98E2, 0x98EF, 0x98F2, range(0x98FC, 0x98FE), 0x9905, 0x990A, 0x990C, 0x9913, 0x9928, 0x9996, 0x9999, 0x99AC, range(0x99C4, 0x99C6), 0x99D0, 0x99D2, 0x9A0E, range(0x9A12, 0x9A13), 0x9A30, 0x9A5A, 0x9AA8, 0x9AB8, 0x9AC4, 0x9AD8, 0x9AEA, 0x9B31, 0x9B3C, 0x9B42, 0x9B45, 0x9B54, 0x9B5A, 0x9BAE, 0x9BE8, 0x9CE5, 0x9CF4, 0x9D8F, 0x9DB4, 0x9E7F, 0x9E93, 0x9E97, 0x9EA6, range(0x9EBA, 0x9EBB), 0x9EC4, 0x9ED2, 0x9ED9, 0x9F13, 0x9F3B, 0x9F62, range(0xFF01, 0xFF03), range(0xFF05, 0xFF0A), range(0xFF0C, 0xFF0F), range(0xFF1A, 0xFF1B), range(0xFF1F, 0xFF20), range(0xFF3B, 0xFF3D), 0xFF3F, 0xFF5B, 0xFF5D, range(0xFF61, 0xFF65)],
		spa: [range(0x20, 0x5F), range(0x61, 0x7A), 0x7C, range(0xA0, 0xA1), 0xA7, 0xA9, 0xAB, 0xBB, 0xBF, 0xC1, 0xC9, 0xCD, 0xD1, 0xD3, 0xDA, 0xDC, 0xE1, 0xE9, 0xED, 0xF1, 0xF3, 0xFA, 0xFC, range(0x2010, 0x2011), range(0x2013, 0x2014), range(0x2018, 0x2019), range(0x201C, 0x201D), range(0x2020, 0x2021), 0x2026, 0x2030, range(0x2032, 0x2033), 0x20AC],
		deu: [range(0x20, 0x5F), range(0x61, 0x7D), 0xA0, 0xA7, 0xA9, 0xAB, 0xBB, 0xC4, 0xD6, 0xDC, 0xDF, 0xE4, 0xF6, 0xFC, range(0x2010, 0x2011), range(0x2013, 0x2014), 0x2018, 0x201A, 0x201C, 0x201E, 0x2026, 0x2030, 0x20AC],
		fra: [range(0x20, 0x5F), range(0x61, 0x7A), 0x7C, 0xA0, 0xA7, 0xA9, 0xAB, range(0xB2, 0xB3), 0xBB, 0xC0, 0xC2, range(0xC6, 0xCB), range(0xCE, 0xCF), 0xD4, 0xD9, range(0xDB, 0xDC), 0xE0, 0xE2, range(0xE6, 0xEB), range(0xEE, 0xEF), 0xF4, 0xF9, range(0xFB, 0xFC), 0xFF, range(0x152, 0x153), 0x178, 0x2B3, 0x2E2, range(0x1D48, 0x1D49), range(0x2010, 0x2011), range(0x2013, 0x2014), 0x2019, range(0x201C, 0x201D), range(0x2020, 0x2021), 0x2026, range(0x202F, 0x2030), 0x20AC, 0x2212],
		ita: [range(0x20, 0x22), range(0x24, 0x25), range(0x27, 0x29), range(0x2B, 0x5F), range(0x61, 0x7D), 0xA0, 0xA9, 0xAB, 0xBB, 0xC0, range(0xC8, 0xC9), 0xCC, range(0xD2, 0xD3), 0xD9, 0xE0, range(0xE8, 0xE9), 0xEC, range(0xF2, 0xF3), 0xF9, 0x2011, 0x2014, 0x2019, range(0x201C, 0x201D), 0x2026, 0x2030, 0x20AC],
		por: [range(0x20, 0x5F), range(0x61, 0x7A), 0x7C, 0xA0, 0xA7, 0xA9, range(0xC0, 0xC3), 0xC7, range(0xC9, 0xCA), 0xCD, range(0xD2, 0xD5), 0xDA, range(0xE0, 0xE3), 0xE7, range(0xE9, 0xEA), 0xED, range(0xF2, 0xF5), 0xFA, range(0x2010, 0x2011), range(0x2013, 0x2014), range(0x2018, 0x2019), range(0x201C, 0x201D), range(0x2020, 0x2021), 0x2026, 0x2030, range(0x2032, 0x2033), 0x20AC],
		rus: [range(0x20, 0x40), range(0x5B, 0x5F), range(0x7B, 0x7D), 0xA0, 0xA7, 0xA9, 0xAB, 0xBB, 0x401, range(0x410, 0x44F), 0x451, range(0x2010, 0x2011), range(0x2013, 0x2014), 0x2018, 0x201A, 0x201C, 0x201E, 0x2026, 0x2030, 0x20AC],
		fin: [range(0x20, 0x21), range(0x23, 0x5F), range(0x61, 0x7A), 0x7C, 0xA0, 0xA7, 0xA9, 0xBB, range(0xC4, 0xC5), 0xD6, range(0xE4, 0xE5), 0xF6, range(0x160, 0x161), range(0x17D, 0x17E), range(0x2010, 0x2011), 0x2013, 0x2019, 0x201D, 0x2026, range(0x202F, 0x2030), 0x20AC, 0x2212],
		nld: [range(0x20, 0x5F), range(0x61, 0x7A), 0x7C, 0xA0, 0xA7, 0xA9, 0xC1, 0xC4, 0xC9, 0xCB, 0xCD, 0xCF, 0xD3, 0xD6, 0xDA, 0xDC, 0xE1, 0xE4, 0xE9, 0xEB, 0xED, 0xEF, 0xF3, 0xF6, 0xFA, 0xFC, 0x133, 0x301, range(0x2010, 0x2011), range(0x2013, 0x2014), range(0x2018, 0x2019), range(0x201C, 0x201D), range(0x2020, 0x2021), 0x2026, 0x2030, range(0x2032, 0x2033), 0x20AC],
		zho: [range(0x20, 0x5F), range(0x7B, 0x7D), 0xA0, 0xA7, 0xA9, 0xB7, range(0x2010, 0x2011), range(0x2013, 0x2016), range(0x2018, 0x2019), range(0x201C, 0x201D), range(0x2025, 0x2026), 0x2030, range(0x2032, 0x2033), 0x2035, 0x203B, 0x20AC, range(0x3001, 0x3003), range(0x3007, 0x3011), range(0x3014, 0x3017), range(0x301D, 0x301E), range(0x4E00, 0x4E01), 0x4E03, range(0x4E07, 0x4E0E), 0x4E11, range(0x4E13, 0x4E14), 0x4E16, range(0x4E18, 0x4E1A), range(0x4E1C, 0x4E1D), 0x4E22, range(0x4E24, 0x4E25), 0x4E27, 0x4E2A, 0x4E2D, 0x4E30, 0x4E32, 0x4E34, range(0x4E38, 0x4E3B), range(0x4E3D, 0x4E3E), 0x4E43, 0x4E45, range(0x4E48, 0x4E49), range(0x4E4B, 0x4E50), 0x4E54, 0x4E56, range(0x4E58, 0x4E59), 0x4E5D, range(0x4E5F, 0x4E61), 0x4E66, range(0x4E70, 0x4E71), 0x4E7E, 0x4E86, range(0x4E88, 0x4E89), range(0x4E8B, 0x4E8C), range(0x4E8E, 0x4E8F), range(0x4E91, 0x4E92), range(0x4E94, 0x4E95), range(0x4E9A, 0x4E9B), 0x4EA1, range(0x4EA4, 0x4EA8), range(0x4EAB, 0x4EAC), 0x4EAE, 0x4EB2, 0x4EBA, range(0x4EBF, 0x4EC1), 0x4EC5, 0x4EC7, range(0x4ECA, 0x4ECB), range(0x4ECD, 0x4ECE), 0x4ED4, 0x4ED6, range(0x4ED8, 0x4ED9), range(0x4EE3, 0x4EE5), 0x4EEA, 0x4EEC, 0x4EF0, 0x4EF2, range(0x4EF6, 0x4EF7), 0x4EFB, 0x4EFD, 0x4EFF, 0x4F01, 0x4F0A, 0x4F0D, range(0x4F0F, 0x4F11), range(0x4F17, 0x4F1A), range(0x4F1F, 0x4F20), 0x4F24, 0x4F26, range(0x4F2F, 0x4F30), 0x4F34, 0x4F38, range(0x4F3C, 0x4F3D), 0x4F46, range(0x4F4D, 0x4F51), 0x4F53, 0x4F55, 0x4F59, range(0x4F5B, 0x4F5C), 0x4F60, 0x4F64, 0x4F69, 0x4F73, 0x4F7F, 0x4F8B, 0x4F9B, 0x4F9D, 0x4FA0, range(0x4FA6, 0x4FA8), 0x4FAC, 0x4FAF, 0x4FB5, 0x4FBF, range(0x4FC3, 0x4FC4), 0x4FCA, 0x4FD7, 0x4FDD, 0x4FE1, 0x4FE9, 0x4FEE, 0x4FF1, 0x4FFE, 0x500D, 0x5012, range(0x5019, 0x501A), 0x501F, 0x5026, 0x503C, 0x503E, 0x5047, 0x504C, 0x504F, 0x505A, 0x505C, 0x5065, range(0x5076, 0x5077), 0x50A8, 0x50AC, 0x50B2, 0x50BB, 0x50CF, 0x50E7, 0x5112, 0x513F, 0x5141, range(0x5143, 0x5146), range(0x5148, 0x5149), 0x514B, 0x514D, 0x5151, 0x5154, 0x515A, 0x5165, 0x5168, range(0x516B, 0x516E), range(0x5170, 0x5171), range(0x5173, 0x5179), range(0x517B, 0x517D), 0x5185, 0x5188, range(0x518C, 0x518D), 0x5192, 0x5199, range(0x519B, 0x519C), 0x51A0, 0x51AC, 0x51B0, range(0x51B2, 0x51B3), 0x51B5, 0x51B7, 0x51C6, 0x51CC, 0x51CF, 0x51DD, range(0x51E0, 0x51E1), 0x51E4, 0x51ED, range(0x51EF, 0x51F0), range(0x51FA, 0x51FB), 0x51FD, 0x5200, range(0x5206, 0x5207), 0x520A, range(0x5211, 0x5212), range(0x5217, 0x521B), 0x521D, 0x5224, 0x5229, 0x522B, 0x5230, range(0x5236, 0x5238), range(0x523A, 0x523B), 0x5242, 0x524D, 0x5251, 0x5267, range(0x5269, 0x526A), 0x526F, 0x5272, 0x529B, range(0x529D, 0x52A1), 0x52A3, range(0x52A8, 0x52AB), range(0x52B1, 0x52B3), 0x52BF, 0x52C7, 0x52C9, 0x52CB, 0x52D2, 0x52E4, range(0x52FE, 0x52FF), range(0x5305, 0x5306), 0x5308, range(0x5316, 0x5317), 0x5319, range(0x5339, 0x533B), 0x5341, 0x5343, range(0x5347, 0x5348), 0x534A, range(0x534E, 0x534F), range(0x5352, 0x5353), range(0x5355, 0x5357), 0x535A, range(0x5360, 0x5362), 0x536B, range(0x536F, 0x5371), range(0x5373, 0x5374), 0x5377, 0x5382, range(0x5384, 0x5386), 0x5389, range(0x538B, 0x538D), 0x539A, 0x539F, 0x53BB, 0x53BF, 0x53C2, range(0x53C8, 0x53CD), 0x53D1, 0x53D4, range(0x53D6, 0x53D9), range(0x53E3, 0x53E6), range(0x53EA, 0x53ED), range(0x53EF, 0x53F0), range(0x53F2, 0x53F3), range(0x53F6, 0x53F9), range(0x5403, 0x5404), range(0x5408, 0x540A), range(0x540C, 0x540E), range(0x5410, 0x5411), 0x5413, 0x5417, 0x541B, 0x541D, 0x541F, range(0x5426, 0x5427), range(0x542B, 0x542C), 0x542F, 0x5435, range(0x5438, 0x5439), 0x543B, 0x543E, 0x5440, 0x5446, 0x5448, 0x544A, 0x5450, 0x5458, 0x545C, 0x5462, 0x5466, 0x5468, 0x5473, 0x5475, range(0x547C, 0x547D), 0x548C, 0x5496, range(0x54A6, 0x54A8), 0x54AA, 0x54AC, 0x54AF, 0x54B1, range(0x54C0, 0x54C1), range(0x54C7, 0x54C9), range(0x54CD, 0x54CE), 0x54DF, range(0x54E5, 0x54E6), range(0x54E9, 0x54EA), 0x54ED, 0x54F2, 0x5509, 0x5510, 0x5524, 0x552C, range(0x552E, 0x552F), 0x5531, 0x5537, 0x5546, 0x554A, 0x5561, range(0x5565, 0x5566), 0x556A, 0x5580, 0x5582, 0x5584, 0x5587, 0x558A, 0x558F, 0x5594, range(0x559C, 0x559D), 0x55B5, 0x55B7, 0x55BB, 0x55D2, 0x55E8, 0x55EF, 0x5609, 0x561B, 0x5634, 0x563B, 0x563F, 0x5668, 0x56DB, 0x56DE, 0x56E0, 0x56E2, 0x56ED, 0x56F0, 0x56F4, 0x56FA, range(0x56FD, 0x56FE), 0x5706, 0x5708, 0x571F, 0x5723, 0x5728, 0x572D, 0x5730, 0x5733, 0x573A, 0x573E, 0x5740, 0x5747, 0x574E, range(0x5750, 0x5751), 0x5757, range(0x575A, 0x575C), 0x5761, 0x5764, 0x5766, 0x576A, range(0x5782, 0x5783), 0x578B, 0x5792, 0x57C3, 0x57CB, 0x57CE, 0x57D4, 0x57DF, range(0x57F9, 0x57FA), 0x5802, 0x5806, 0x5815, 0x5821, 0x582A, 0x5851, 0x5854, 0x585E, 0x586B, 0x5883, 0x589E, 0x58A8, 0x58C1, 0x58E4, range(0x58EB, 0x58EC), 0x58EE, 0x58F0, 0x5904, 0x5907, 0x590D, 0x590F, range(0x5915, 0x5916), 0x591A, 0x591C, 0x591F, 0x5925, 0x5927, range(0x5929, 0x592B), 0x592E, 0x5931, 0x5934, range(0x5937, 0x593A), range(0x5947, 0x5949), 0x594B, 0x594F, 0x5951, 0x5954, range(0x5956, 0x5957), 0x5965, range(0x5973, 0x5974), 0x5976, 0x5979, 0x597D, 0x5982, range(0x5987, 0x5988), 0x5996, 0x5999, 0x59A5, 0x59A8, 0x59AE, 0x59B9, 0x59BB, 0x59C6, range(0x59CA, 0x59CB), range(0x59D0, 0x59D1), range(0x59D3, 0x59D4), 0x59FF, 0x5A01, range(0x5A03, 0x5A04), 0x5A18, 0x5A1C, 0x5A1F, 0x5A31, 0x5A46, 0x5A5A, 0x5A92, 0x5AC1, 0x5ACC, 0x5AE9, 0x5B50, range(0x5B54, 0x5B55), range(0x5B57, 0x5B59), range(0x5B5C, 0x5B5D), 0x5B5F, range(0x5B63, 0x5B64), 0x5B66, 0x5B69, 0x5B81, 0x5B83, range(0x5B87, 0x5B89), range(0x5B8B, 0x5B8C), 0x5B8F, range(0x5B97, 0x5B9E), range(0x5BA1, 0x5BA4), 0x5BAA, range(0x5BB3, 0x5BB4), 0x5BB6, 0x5BB9, range(0x5BBD, 0x5BBF), 0x5BC2, range(0x5BC4, 0x5BC7), 0x5BCC, 0x5BD2, range(0x5BDD, 0x5BDF), 0x5BE1, 0x5BE8, range(0x5BF8, 0x5BF9), range(0x5BFB, 0x5BFC), 0x5BFF, 0x5C01, 0x5C04, 0x5C06, 0x5C0A, 0x5C0F, 0x5C11, 0x5C14, 0x5C16, 0x5C18, 0x5C1A, 0x5C1D, 0x5C24, 0x5C31, 0x5C3A, range(0x5C3C, 0x5C3E), range(0x5C40, 0x5C42), 0x5C45, 0x5C4B, 0x5C4F, 0x5C55, 0x5C5E, 0x5C60, 0x5C71, range(0x5C81, 0x5C82), range(0x5C97, 0x5C98), range(0x5C9A, 0x5C9B), 0x5CB3, 0x5CB8, 0x5CE1, 0x5CF0, 0x5D07, 0x5D29, 0x5D34, range(0x5DDD, 0x5DDE), 0x5DE1, range(0x5DE5, 0x5DE8), 0x5DEB, 0x5DEE, range(0x5DF1, 0x5DF4), 0x5DF7, range(0x5E01, 0x5E03), 0x5E05, 0x5E08, 0x5E0C, 0x5E10, range(0x5E15, 0x5E16), 0x5E1D, 0x5E26, range(0x5E2D, 0x5E2E), 0x5E38, 0x5E3D, 0x5E45, 0x5E55, range(0x5E72, 0x5E74), 0x5E76, 0x5E78, range(0x5E7B, 0x5E7D), 0x5E7F, 0x5E86, 0x5E8A, 0x5E8F, range(0x5E93, 0x5E95), 0x5E97, range(0x5E99, 0x5E9A), 0x5E9C, range(0x5E9E, 0x5E9F), range(0x5EA6, 0x5EA7), 0x5EAD, range(0x5EB7, 0x5EB8), 0x5EC9, 0x5ED6, range(0x5EF6, 0x5EF7), 0x5EFA, 0x5F00, range(0x5F02, 0x5F04), 0x5F0A, 0x5F0F, 0x5F15, range(0x5F17, 0x5F18), range(0x5F1F, 0x5F20), range(0x5F25, 0x5F26), 0x5F2F, 0x5F31, range(0x5F39, 0x5F3A), range(0x5F52, 0x5F53), 0x5F55, 0x5F5D, 0x5F62, 0x5F69, range(0x5F6C, 0x5F6D), range(0x5F70, 0x5F71), 0x5F77, 0x5F79, range(0x5F7B, 0x5F7C), range(0x5F80, 0x5F81), range(0x5F84, 0x5F85), 0x5F88, range(0x5F8B, 0x5F8C), 0x5F90, 0x5F92, 0x5F97, 0x5FAA, 0x5FAE, 0x5FB5, 0x5FB7, 0x5FC3, range(0x5FC5, 0x5FC6), range(0x5FCC, 0x5FCD), range(0x5FD7, 0x5FD9), 0x5FE0, 0x5FE7, 0x5FEB, 0x5FF5, 0x5FFD, range(0x6000, 0x6001), 0x600E, 0x6012, range(0x6015, 0x6016), 0x601D, 0x6021, 0x6025, range(0x6027, 0x6028), 0x602A, 0x603B, 0x604B, 0x6050, 0x6062, range(0x6068, 0x6069), 0x606D, range(0x606F, 0x6070), 0x6076, 0x607C, 0x6084, 0x6089, 0x6094, range(0x609F, 0x60A0), 0x60A3, 0x60A8, 0x60B2, 0x60C5, 0x60D1, 0x60DC, 0x60E0, range(0x60E7, 0x60E8), 0x60EF, 0x60F3, 0x60F9, 0x6101, range(0x6108, 0x6109), 0x610F, 0x611A, 0x611F, 0x6127, 0x6148, 0x614E, 0x6155, 0x6162, 0x6167, 0x6170, 0x61BE, 0x61C2, 0x61D2, 0x6208, 0x620A, 0x620C, range(0x620F, 0x6212), 0x6216, 0x6218, 0x622A, 0x6234, 0x6237, range(0x623F, 0x6241), 0x6247, 0x624B, range(0x624D, 0x624E), 0x6251, 0x6253, 0x6258, 0x6263, 0x6267, 0x6269, range(0x626B, 0x626F), 0x6279, range(0x627E, 0x6280), 0x6284, 0x628A, 0x6291, 0x6293, 0x6295, range(0x6297, 0x6298), 0x62A2, range(0x62A4, 0x62A5), range(0x62AB, 0x62AC), 0x62B1, 0x62B5, 0x62B9, 0x62BD, range(0x62C5, 0x62C6), 0x62C9, 0x62CD, 0x62D2, 0x62D4, 0x62D6, 0x62D8, range(0x62DB, 0x62DC), 0x62DF, range(0x62E5, 0x62E6), range(0x62E8, 0x62E9), 0x62EC, 0x62F3, 0x62F7, 0x62FC, range(0x62FE, 0x62FF), 0x6301, 0x6307, 0x6309, 0x6311, 0x6316, 0x631D, 0x6321, range(0x6324, 0x6325), 0x632A, 0x632F, 0x633A, 0x6349, 0x6350, 0x6355, 0x635F, range(0x6361, 0x6362), 0x636E, 0x6377, range(0x6388, 0x6389), 0x638C, 0x6392, 0x63A2, 0x63A5, range(0x63A7, 0x63AA), 0x63B8, range(0x63CF, 0x63D0), 0x63D2, 0x63E1, 0x63F4, 0x641C, 0x641E, range(0x642C, 0x642D), 0x6444, 0x6446, 0x644A, 0x6454, 0x6458, 0x6469, 0x6478, 0x6492, 0x649E, 0x64AD, range(0x64CD, 0x64CE), 0x64E6, 0x652F, 0x6536, 0x6539, 0x653B, range(0x653E, 0x653F), 0x6545, 0x6548, 0x654C, 0x654F, 0x6551, 0x6559, 0x655D, range(0x6562, 0x6563), 0x6566, 0x656C, 0x6570, 0x6572, 0x6574, 0x6587, 0x658B, 0x6590, 0x6597, 0x6599, 0x659C, 0x65A5, 0x65AD, range(0x65AF, 0x65B0), 0x65B9, range(0x65BC, 0x65BD), 0x65C1, 0x65C5, 0x65CB, 0x65CF, 0x65D7, 0x65E0, 0x65E2, range(0x65E5, 0x65E9), 0x65ED, 0x65F6, 0x65FA, 0x6602, 0x6606, 0x660C, range(0x660E, 0x660F), 0x6613, range(0x661F, 0x6620), 0x6625, 0x6628, 0x662D, 0x662F, 0x663E, 0x6643, 0x664B, range(0x6652, 0x6653), 0x665A, 0x6668, range(0x666E, 0x666F), 0x6674, 0x6676, 0x667A, 0x6682, 0x6691, range(0x6696, 0x6697), 0x66AE, 0x66B4, 0x66F0, 0x66F2, 0x66F4, 0x66F9, 0x66FC, range(0x66FE, 0x6700), range(0x6708, 0x6709), 0x670B, 0x670D, 0x6717, 0x671B, 0x671D, 0x671F, 0x6728, range(0x672A, 0x672D), 0x672F, 0x6731, 0x6735, 0x673A, 0x6740, range(0x6742, 0x6743), 0x6749, 0x674E, range(0x6750, 0x6751), 0x675C, 0x675F, 0x6761, 0x6765, 0x6768, range(0x676F, 0x6770), range(0x677E, 0x677F), 0x6781, 0x6784, 0x6790, 0x6797, range(0x679C, 0x679D), 0x67A2, range(0x67AA, 0x67AB), 0x67B6, range(0x67CF, 0x67D0), range(0x67D3, 0x67D4), 0x67E5, 0x67EC, 0x67EF, range(0x67F3, 0x67F4), 0x6807, 0x680B, 0x680F, 0x6811, 0x6821, range(0x6837, 0x6839), 0x683C, 0x6843, 0x6846, 0x6848, 0x684C, 0x6851, 0x6863, 0x6865, 0x6881, 0x6885, 0x68A6, range(0x68AF, 0x68B0), 0x68B5, 0x68C0, 0x68C9, 0x68CB, 0x68D2, 0x68DA, 0x68EE, 0x6905, 0x690D, 0x6930, 0x695A, 0x697C, 0x6982, 0x699C, 0x6A21, 0x6A31, 0x6A80, range(0x6B20, 0x6B23), 0x6B27, 0x6B32, 0x6B3A, 0x6B3E, 0x6B49, 0x6B4C, range(0x6B62, 0x6B66), 0x6B6A, 0x6B7B, range(0x6B8A, 0x6B8B), 0x6BB5, 0x6BC5, 0x6BCD, 0x6BCF, 0x6BD2, range(0x6BD4, 0x6BD5), 0x6BDB, 0x6BEB, 0x6C0F, 0x6C11, 0x6C14, 0x6C1B, 0x6C34, 0x6C38, 0x6C42, 0x6C47, 0x6C49, 0x6C57, 0x6C5D, range(0x6C5F, 0x6C61), 0x6C64, 0x6C6A, 0x6C76, 0x6C7D, 0x6C83, range(0x6C88, 0x6C89), 0x6C99, 0x6C9F, 0x6CA1, 0x6CA7, 0x6CB3, 0x6CB9, 0x6CBB, 0x6CBF, range(0x6CC9, 0x6CCA), 0x6CD5, 0x6CDB, range(0x6CE1, 0x6CE3), 0x6CE5, 0x6CE8, 0x6CF0, 0x6CF3, 0x6CFD, 0x6D0B, 0x6D17, 0x6D1B, 0x6D1E, 0x6D25, 0x6D2A, 0x6D32, 0x6D3B, range(0x6D3D, 0x6D3E), 0x6D41, 0x6D45, 0x6D4B, range(0x6D4E, 0x6D4F), 0x6D51, 0x6D53, 0x6D59, 0x6D66, range(0x6D69, 0x6D6A), 0x6D6E, 0x6D74, 0x6D77, 0x6D85, range(0x6D88, 0x6D89), 0x6D9B, 0x6DA8, 0x6DAF, 0x6DB2, 0x6DB5, 0x6DCB, 0x6DD1, 0x6DD8, 0x6DE1, 0x6DF1, 0x6DF7, 0x6DFB, 0x6E05, 0x6E10, 0x6E21, 0x6E23, 0x6E29, 0x6E2F, 0x6E34, 0x6E38, 0x6E56, 0x6E7E, 0x6E90, 0x6E9C, 0x6EAA, 0x6ECB, 0x6ED1, 0x6EE1, 0x6EE5, 0x6EE8, 0x6EF4, 0x6F02, 0x6F0F, 0x6F14, 0x6F20, 0x6F2B, 0x6F58, 0x6F5C, 0x6F6E, 0x6F8E, 0x6FB3, 0x6FC0, 0x704C, 0x706B, 0x706D, range(0x706F, 0x7070), 0x7075, 0x707F, 0x7089, 0x708E, 0x70AE, range(0x70B8, 0x70B9), 0x70C2, 0x70C8, 0x70E4, range(0x70E6, 0x70E7), 0x70ED, 0x7126, 0x7136, 0x714C, 0x715E, 0x7167, 0x716E, 0x718A, 0x719F, 0x71C3, 0x71D5, 0x7206, 0x722A, 0x722C, 0x7231, range(0x7235, 0x7238), 0x723D, range(0x7247, 0x7248), 0x724C, 0x7259, 0x725B, range(0x7261, 0x7262), 0x7267, 0x7269, 0x7272, 0x7275, range(0x7279, 0x727A), 0x72AF, 0x72B6, 0x72B9, 0x72C2, 0x72D0, 0x72D7, 0x72E0, 0x72EC, 0x72EE, 0x72F1, 0x72FC, range(0x731B, 0x731C), 0x732A, 0x732E, 0x7334, 0x7384, 0x7387, 0x7389, 0x738B, 0x739B, 0x73A9, 0x73AB, range(0x73AF, 0x73B0), 0x73B2, 0x73BB, 0x73C0, 0x73CA, 0x73CD, 0x73E0, 0x73ED, 0x7403, 0x7406, 0x740A, 0x742A, range(0x7433, 0x7434), 0x743C, 0x7459, 0x745C, range(0x745E, 0x745F), 0x7470, 0x7476, 0x7483, 0x74DC, 0x74E6, 0x74F6, 0x7518, 0x751A, 0x751C, 0x751F, 0x7528, range(0x7530, 0x7533), 0x7535, range(0x7537, 0x7538), 0x753B, 0x7545, 0x754C, 0x7559, 0x7565, 0x756A, 0x7586, 0x758F, 0x7591, 0x7597, 0x75AF, 0x75B2, 0x75BC, 0x75BE, 0x75C5, 0x75D5, 0x75DB, 0x75F4, 0x7678, 0x767B, range(0x767D, 0x767E), 0x7684, range(0x7686, 0x7687), 0x76AE, 0x76C8, 0x76CA, range(0x76D1, 0x76D2), 0x76D6, 0x76D8, 0x76DB, 0x76DF, 0x76EE, 0x76F4, 0x76F8, 0x76FC, 0x76FE, 0x7701, 0x7709, 0x770B, range(0x771F, 0x7720), 0x773C, 0x7740, 0x775B, 0x7761, 0x7763, 0x77A7, 0x77DB, 0x77E3, 0x77E5, 0x77ED, 0x77F3, 0x77F6, range(0x7801, 0x7802), 0x780D, 0x7814, 0x7834, 0x7840, 0x7855, 0x786C, 0x786E, range(0x788D, 0x788E), 0x7897, 0x789F, 0x78A7, 0x78B0, 0x78C1, 0x78C5, 0x78E8, 0x793A, 0x793C, 0x793E, 0x7956, 0x795A, range(0x795D, 0x795E), 0x7965, 0x7968, 0x796F, 0x7978, 0x7981, 0x7985, 0x798F, 0x79BB, range(0x79C0, 0x79C1), 0x79CB, 0x79CD, range(0x79D1, 0x79D2), 0x79D8, 0x79DF, 0x79E4, 0x79E6, 0x79E9, range(0x79EF, 0x79F0), 0x79FB, 0x7A00, 0x7A0B, range(0x7A0D, 0x7A0E), 0x7A23, 0x7A33, 0x7A3F, 0x7A46, range(0x7A76, 0x7A77), range(0x7A79, 0x7A7A), 0x7A7F, 0x7A81, 0x7A97, 0x7A9D, 0x7ACB, 0x7AD9, range(0x7ADE, 0x7AE0), 0x7AE5, 0x7AEF, 0x7AF9, 0x7B11, 0x7B14, 0x7B1B, 0x7B26, 0x7B28, 0x7B2C, 0x7B49, 0x7B4B, 0x7B51, 0x7B54, 0x7B56, 0x7B79, 0x7B7E, 0x7B80, 0x7B97, 0x7BA1, 0x7BAD, 0x7BB1, 0x7BC7, 0x7BEE, 0x7C3F, 0x7C4D, 0x7C73, 0x7C7B, 0x7C89, 0x7C92, 0x7C97, 0x7CA4, 0x7CB9, 0x7CBE, 0x7CCA, range(0x7CD5, 0x7CD6), 0x7CDF, 0x7CFB, 0x7D20, 0x7D22, 0x7D27, 0x7D2B, 0x7D2F, 0x7E41, 0x7EA2, range(0x7EA6, 0x7EA7), 0x7EAA, 0x7EAF, range(0x7EB2, 0x7EB3), 0x7EB5, range(0x7EB7, 0x7EB8), 0x7EBD, 0x7EBF, range(0x7EC3, 0x7EC4), range(0x7EC6, 0x7EC8), 0x7ECD, 0x7ECF, 0x7ED3, 0x7ED5, range(0x7ED8, 0x7ED9), range(0x7EDC, 0x7EDD), 0x7EDF, 0x7EE7, range(0x7EE9, 0x7EEA), 0x7EED, range(0x7EF4, 0x7EF5), 0x7EFC, 0x7EFF, 0x7F05, 0x7F13, 0x7F16, 0x7F18, 0x7F20, 0x7F29, 0x7F34, 0x7F36, 0x7F38, 0x7F3A, range(0x7F50, 0x7F51), 0x7F55, 0x7F57, 0x7F5A, 0x7F62, 0x7F6A, 0x7F6E, 0x7F72, 0x7F8A, 0x7F8E, 0x7F9E, 0x7FA4, 0x7FAF, 0x7FBD, 0x7FC1, 0x7FC5, 0x7FD4, 0x7FD8, 0x7FE0, 0x7FF0, range(0x7FFB, 0x7FFC), range(0x8000, 0x8001), 0x8003, 0x8005, range(0x800C, 0x800D), 0x8010, 0x8017, 0x8033, 0x8036, 0x804A, 0x804C, 0x8054, 0x8058, 0x805A, 0x806A, 0x8089, 0x8096, 0x809A, 0x80A1, range(0x80A4, 0x80A5), 0x80A9, 0x80AF, 0x80B2, 0x80C1, 0x80C6, 0x80CC, 0x80CE, 0x80D6, 0x80DC, 0x80DE, 0x80E1, 0x80F6, 0x80F8, 0x80FD, 0x8106, 0x8111, 0x8131, 0x8138, 0x814A, 0x8150, 0x8153, 0x8170, 0x8179, range(0x817E, 0x817F), 0x81C2, 0x81E3, 0x81EA, 0x81ED, range(0x81F3, 0x81F4), range(0x820C, 0x820D), 0x8212, range(0x821E, 0x821F), 0x822A, 0x822C, 0x8230, 0x8239, 0x826F, 0x8272, 0x827A, 0x827E, 0x8282, 0x8292, 0x829D, 0x82A6, range(0x82AC, 0x82AD), 0x82B1, 0x82B3, 0x82CD, 0x82CF, 0x82D7, range(0x82E5, 0x82E6), 0x82F1, range(0x8302, 0x8303), 0x8328, 0x832B, 0x8336, 0x8349, 0x8350, 0x8352, 0x8363, 0x836F, 0x8377, 0x8389, 0x838E, range(0x83AA, 0x83AB), range(0x83B1, 0x83B2), 0x83B7, 0x83DC, 0x83E9, 0x83F2, 0x8404, 0x840D, range(0x8424, 0x8425), range(0x8427, 0x8428), 0x843D, 0x8457, 0x845B, 0x8461, 0x8482, 0x848B, 0x8499, 0x84C9, 0x84DD, 0x84EC, 0x8511, 0x8521, 0x8584, 0x85AA, 0x85C9, 0x85CF, 0x85E4, 0x864E, 0x8651, 0x866B, 0x8679, range(0x867D, 0x867E), 0x8681, 0x86C7, 0x86CB, 0x86D9, 0x86EE, 0x8702, 0x871C, 0x8776, 0x878D, 0x87F9, 0x8822, 0x8840, 0x884C, 0x8857, 0x8861, 0x8863, 0x8865, 0x8868, 0x888B, 0x88AB, 0x88AD, range(0x88C1, 0x88C2), 0x88C5, 0x88D5, 0x88E4, 0x897F, 0x8981, 0x8986, range(0x89C1, 0x89C2), 0x89C4, 0x89C6, range(0x89C8, 0x89C9), 0x89D2, 0x89E3, 0x8A00, 0x8A89, 0x8A93, 0x8B66, range(0x8BA1, 0x8BA2), 0x8BA4, range(0x8BA8, 0x8BA9), range(0x8BAD, 0x8BB0), 0x8BB2, range(0x8BB7, 0x8BB8), 0x8BBA, range(0x8BBE, 0x8BBF), 0x8BC1, 0x8BC4, 0x8BC6, 0x8BC9, 0x8BCD, 0x8BD1, 0x8BD5, 0x8BD7, 0x8BDA, range(0x8BDD, 0x8BDE), 0x8BE2, range(0x8BE5, 0x8BE6), 0x8BED, 0x8BEF, 0x8BF4, range(0x8BF7, 0x8BF8), range(0x8BFA, 0x8BFB), 0x8BFE, 0x8C01, 0x8C03, 0x8C05, 0x8C08, range(0x8C0A, 0x8C0B), 0x8C13, 0x8C1C, 0x8C22, 0x8C28, 0x8C31, 0x8C37, 0x8C46, 0x8C61, 0x8C6A, 0x8C8C, range(0x8D1D, 0x8D1F), range(0x8D21, 0x8D25), range(0x8D27, 0x8D2A), 0x8D2D, 0x8D2F, 0x8D31, range(0x8D34, 0x8D35), range(0x8D38, 0x8D3A), 0x8D3C, 0x8D3E, 0x8D44, range(0x8D4B, 0x8D4C), range(0x8D4F, 0x8D50), 0x8D54, 0x8D56, range(0x8D5A, 0x8D5B), 0x8D5E, 0x8D60, 0x8D62, 0x8D64, 0x8D6B, 0x8D70, 0x8D75, 0x8D77, 0x8D81, 0x8D85, range(0x8D8A, 0x8D8B), 0x8DA3, 0x8DB3, 0x8DC3, 0x8DCC, 0x8DD1, 0x8DDD, 0x8DDF, 0x8DEF, 0x8DF3, 0x8E0F, 0x8E22, 0x8E29, 0x8EAB, 0x8EB2, 0x8F66, range(0x8F68, 0x8F69), 0x8F6C, range(0x8F6E, 0x8F70), 0x8F7B, 0x8F7D, 0x8F83, range(0x8F85, 0x8F86), range(0x8F88, 0x8F89), 0x8F91, 0x8F93, 0x8F9B, 0x8F9E, range(0x8FA8, 0x8FA9), range(0x8FB0, 0x8FB1), 0x8FB9, 0x8FBE, 0x8FC1, 0x8FC5, range(0x8FC7, 0x8FC8), 0x8FCE, range(0x8FD0, 0x8FD1), 0x8FD4, range(0x8FD8, 0x8FD9), range(0x8FDB, 0x8FDF), 0x8FE6, range(0x8FEA, 0x8FEB), 0x8FF0, 0x8FF7, 0x8FFD, range(0x9000, 0x9003), 0x9006, range(0x9009, 0x900A), range(0x900F, 0x9010), 0x9012, 0x9014, range(0x901A, 0x901B), 0x901D, range(0x901F, 0x9020), 0x9022, 0x9038, range(0x903B, 0x903C), 0x9047, 0x904D, 0x9053, 0x9057, range(0x906D, 0x906E), 0x9075, range(0x907F, 0x9080), 0x9093, 0x90A3, 0x90A6, 0x90AA, 0x90AE, 0x90B1, 0x90BB, 0x90CE, 0x90D1, 0x90E8, 0x90ED, 0x90FD, 0x9102, 0x9149, 0x914B, 0x914D, 0x9152, range(0x9177, 0x9178), 0x9189, 0x9192, 0x91C7, 0x91CA, range(0x91CC, 0x91CF), 0x91D1, 0x9488, 0x9493, 0x949F, 0x94A2, 0x94A6, 0x94B1, 0x94BB, 0x94C1, 0x94C3, 0x94DC, 0x94E2, 0x94ED, 0x94F6, 0x94FA, 0x94FE, range(0x9500, 0x9501), 0x9505, 0x950B, 0x9519, 0x9521, 0x9526, 0x952E, 0x953A, 0x9547, 0x955C, 0x956D, 0x957F, 0x95E8, 0x95EA, range(0x95ED, 0x95EE), 0x95F0, 0x95F2, 0x95F4, 0x95F7, 0x95F9, 0x95FB, 0x9601, 0x9605, 0x9610, 0x9614, 0x961F, 0x962E, range(0x9632, 0x9636), 0x963B, range(0x963F, 0x9640), range(0x9644, 0x9646), 0x9648, 0x964D, 0x9650, 0x9662, 0x9664, range(0x9669, 0x966A), range(0x9675, 0x9677), 0x9686, range(0x968F, 0x9690), 0x9694, 0x969C, 0x96BE, range(0x96C4, 0x96C6), 0x96C9, 0x96E8, 0x96EA, 0x96EF, 0x96F3, range(0x96F6, 0x96F7), 0x96FE, 0x9700, 0x9707, 0x970D, 0x9716, 0x9732, range(0x9738, 0x9739), 0x9752, 0x9756, 0x9759, 0x975E, 0x9760, 0x9762, 0x9769, 0x977C, 0x978B, 0x9791, 0x97E6, 0x97E9, 0x97F3, range(0x9875, 0x9876), range(0x9879, 0x987B), range(0x987D, 0x987F), 0x9884, range(0x9886, 0x9887), 0x9891, range(0x9897, 0x9898), 0x989D, 0x98CE, range(0x98D8, 0x98D9), range(0x98DE, 0x98DF), 0x9910, range(0x996D, 0x996E), range(0x9970, 0x9971), 0x997C, 0x9986, 0x9996, 0x9999, 0x99A8, 0x9A6C, 0x9A71, 0x9A76, 0x9A7B, 0x9A7E, 0x9A8C, 0x9A91, 0x9A97, 0x9A9A, 0x9AA4, 0x9AA8, 0x9AD8, 0x9B3C, 0x9B42, 0x9B45, 0x9B54, 0x9C7C, 0x9C81, 0x9C9C, 0x9E1F, 0x9E21, 0x9E23, 0x9E2D, 0x9E3F, 0x9E45, 0x9E64, 0x9E70, 0x9E7F, 0x9EA6, 0x9EBB, 0x9EC4, 0x9ECE, 0x9ED1, 0x9ED8, 0x9F13, 0x9F20, 0x9F3B, 0x9F50, 0x9F7F, 0x9F84, 0x9F99, 0x9F9F, range(0xFE30, 0xFE31), range(0xFE33, 0xFE44), range(0xFE49, 0xFE52), range(0xFE54, 0xFE57), range(0xFE59, 0xFE61), 0xFE63, 0xFE68, range(0xFE6A, 0xFE6B), range(0xFF01, 0xFF03), range(0xFF05, 0xFF0A), range(0xFF0C, 0xFF0F), range(0xFF1A, 0xFF1B), range(0xFF1F, 0xFF20), range(0xFF3B, 0xFF3D), 0xFF3F, 0xFF5B, 0xFF5D],
		swe: [range(0x20, 0x5F), range(0x61, 0x7A), 0x7C, 0xA0, 0xA7, 0xA9, 0xC0, range(0xC4, 0xC5), 0xC9, 0xD6, 0xE0, range(0xE4, 0xE5), 0xE9, 0xF6, range(0x2010, 0x2011), range(0x2013, 0x2014), range(0x2018, 0x2019), range(0x201C, 0x201D), range(0x2020, 0x2021), 0x2026, 0x2030, range(0x2032, 0x2033), 0x20AC, 0x2212],
		pol: [range(0x20, 0x5F), range(0x61, 0x70), range(0x72, 0x75), 0x77, range(0x79, 0x7E), 0xA0, 0xA7, 0xA9, 0xAB, 0xB0, 0xBB, 0xD3, 0xF3, range(0x104, 0x107), range(0x118, 0x119), range(0x141, 0x144), range(0x15A, 0x15B), range(0x179, 0x17C), range(0x2010, 0x2011), range(0x2013, 0x2014), range(0x201D, 0x201E), range(0x2020, 0x2021), 0x2026, 0x2030, range(0x2032, 0x2033), 0x20AC],
		kor: [range(0x20, 0x40), range(0x5B, 0x5F), range(0x7B, 0x7D), range(0xA0, 0xA1), 0xA7, 0xA9, range(0xB6, 0xB7), 0xBF, range(0x2010, 0x2011), range(0x2014, 0x2015), range(0x2018, 0x2019), range(0x201C, 0x201D), range(0x2020, 0x2021), range(0x2025, 0x2026), 0x2030, range(0x2032, 0x2033), 0x203B, 0x203E, 0x20AC, range(0x3001, 0x3003), range(0x3008, 0x3011), range(0x3014, 0x3015), 0x301C, 0x30FB, 0x3131, 0x3134, 0x3137, 0x3139, range(0x3141, 0x3142), 0x3145, range(0x3147, 0x3148), range(0x314A, 0x314E), range(0xAC00, 0xD7A3), range(0xFF01, 0xFF03), range(0xFF05, 0xFF0A), range(0xFF0C, 0xFF0F), range(0xFF1A, 0xFF1B), range(0xFF1F, 0xFF20), range(0xFF3B, 0xFF3D), 0xFF3F, 0xFF5B, 0xFF5D],
		tur: [range(0x20, 0x5F), range(0x61, 0x70), range(0x72, 0x76), range(0x79, 0x7A), 0x7C, 0xA0, 0xA7, 0xA9, 0xC7, 0xD6, 0xDC, 0xE7, 0xF6, 0xFC, range(0x11E, 0x11F), range(0x130, 0x131), range(0x15E, 0x15F), range(0x2010, 0x2011), range(0x2013, 0x2014), range(0x2018, 0x2019), range(0x201C, 0x201D), range(0x2020, 0x2021), 0x2026, 0x2030, range(0x2032, 0x2033), 0x20AC],
		hin: [range(0x20, 0x25), range(0x27, 0x40), range(0x5B, 0x5F), 0x7C, 0xA0, 0xA7, 0xA9, range(0x901, 0x903), range(0x905, 0x90D), range(0x90F, 0x911), range(0x913, 0x928), range(0x92A, 0x930), range(0x932, 0x933), range(0x935, 0x939), range(0x93C, 0x943), 0x945, range(0x947, 0x949), range(0x94B, 0x94D), 0x950, range(0x964, 0x970), range(0x2010, 0x2011), range(0x2013, 0x2014), range(0x2018, 0x2019), range(0x201C, 0x201D), range(0x2020, 0x2021), 0x2026, 0x2030, range(0x2032, 0x2033), 0x20AC],
		ell: [range(0x20, 0x22), range(0x24, 0x3E), 0x40, range(0x5B, 0x5F), 0x7C, 0xA0, 0xA7, 0xA9, 0xAB, 0xBB, 0x301, 0x308, 0x386, range(0x388, 0x38A), 0x38C, range(0x38E, 0x3A1), range(0x3A3, 0x3CE), range(0x2010, 0x2011), range(0x2013, 0x2014), 0x2026, 0x2030, 0x20AC],
		nor: [range(0x20, 0x21), range(0x23, 0x25), range(0x27, 0x5F), range(0x61, 0x7D), 0xA0, 0xA7, 0xA9, 0xAB, 0xBB, range(0xBF, 0xC0), range(0xC5, 0xC6), 0xC9, range(0xD2, 0xD4), 0xD8, 0xE0, range(0xE5, 0xE6), 0xE9, range(0xF2, 0xF4), 0xF8, 0x2011, 0x2013, range(0x2018, 0x2019), range(0x201C, 0x201D), range(0x2020, 0x2021), 0x2026, 0x2030, range(0x2032, 0x2033), 0x20AC, 0x2212],
		hun: [range(0x20, 0x5F), range(0x61, 0x70), range(0x72, 0x76), range(0x79, 0x7E), 0xA0, 0xA7, 0xA9, 0xAB, 0xBB, 0xC1, 0xC9, 0xCD, 0xD3, 0xD6, 0xDA, 0xDC, 0xE1, 0xE9, 0xED, 0xF3, 0xF6, 0xFA, 0xFC, range(0x150, 0x151), range(0x170, 0x171), 0x1F1, 0x1F3, 0x2011, 0x2013, 0x2019, range(0x201D, 0x201E), 0x2026, 0x2030, 0x2052, 0x20AC, range(0x27E8, 0x27E9)],
		ces: [range(0x20, 0x21), range(0x24, 0x5F), range(0x61, 0x7A), 0x7C, 0xA0, 0xA7, 0xA9, 0xC1, 0xC9, 0xCD, 0xD3, 0xDA, 0xDD, 0xE1, 0xE9, 0xED, 0xF3, 0xFA, 0xFD, range(0x10C, 0x10F), range(0x11A, 0x11B), range(0x147, 0x148), range(0x158, 0x159), range(0x160, 0x161), range(0x164, 0x165), range(0x16E, 0x16F), range(0x17D, 0x17E), range(0x2010, 0x2011), 0x2013, 0x2018, 0x201A, 0x201C, 0x201E, 0x2026, 0x2030, 0x20AC],
		dan: [range(0x20, 0x5F), range(0x61, 0x7A), 0x7C, 0xA0, 0xA7, 0xA9, range(0xC5, 0xC6), 0xD8, range(0xE5, 0xE6), 0xF8, range(0x2010, 0x2011), 0x2013, range(0x2018, 0x2019), range(0x201C, 0x201D), 0x2020, 0x2026, 0x2030, range(0x2032, 0x2033), 0x20AC],
		ind: [range(0x20, 0x5F), range(0x61, 0x7A), 0x7C, 0xA0, 0xA7, 0xA9, range(0x2010, 0x2011), range(0x2013, 0x2014), range(0x2018, 0x2019), range(0x201C, 0x201D), range(0x2020, 0x2021), 0x2026, 0x2030, range(0x2032, 0x2033), 0x20AC],
		est: [range(0x20, 0x21), range(0x24, 0x25), range(0x27, 0x29), range(0x2B, 0x5F), range(0x61, 0x7D), 0xA0, 0xA9, 0xC4, range(0xD5, 0xD6), 0xDC, 0xE4, range(0xF5, 0xF6), 0xFC, range(0x160, 0x161), range(0x17D, 0x17E), 0x2011, 0x2013, 0x201C, 0x201E, 0x2030, 0x20AC, 0x2212],
		ara: [range(0x20, 0x22), range(0x24, 0x25), range(0x27, 0x29), range(0x2B, 0x3A), range(0x3C, 0x3E), range(0x5B, 0x5F), 0x7C, 0xA0, 0xA9, 0xAB, 0xBB, 0x609, 0x60C, range(0x61B, 0x61C), 0x61F, range(0x621, 0x63A), range(0x641, 0x652), range(0x660, 0x66C), 0x670, 0x200E, range(0x2010, 0x2011), range(0x2013, 0x2014), 0x2026, 0x2030, 0x20AC],
		ron: [range(0x20, 0x22), range(0x24, 0x25), range(0x27, 0x5F), range(0x61, 0x7A), 0x7C, 0xA0, 0xA9, 0xAB, 0xBB, 0xC2, 0xCE, 0xE2, 0xEE, range(0x102, 0x103), range(0x218, 0x21B), range(0x2010, 0x2011), range(0x2013, 0x2014), 0x2018, range(0x201C, 0x201E), 0x2026, 0x2030, 0x20AC],
		lat: [range(0x20, 0x5F), range(0x61, 0x7A), 0x7C, 0xA0, 0xA7, 0xA9, range(0x2010, 0x2011), range(0x2013, 0x2014), range(0x2018, 0x2019), range(0x201C, 0x201D), range(0x2020, 0x2021), 0x2026, 0x2030, range(0x2032, 0x2033), 0x20AC],
		srp: [range(0x20, 0x21), range(0x23, 0x25), range(0x27, 0x3F), range(0x5B, 0x5F), range(0x7B, 0x7D), 0xA0, 0xA9, 0x402, range(0x408, 0x40B), range(0x40F, 0x418), range(0x41A, 0x428), range(0x430, 0x438), range(0x43A, 0x448), 0x452, range(0x458, 0x45B), 0x45F, range(0x2010, 0x2011), 0x2013, 0x2018, 0x201A, 0x201C, 0x201E, 0x2026, 0x2030, 0x20AC],
		pan: [range(0x20, 0x22), range(0x24, 0x29), range(0x2B, 0x3F), range(0x5B, 0x5F), 0x7C, 0xA0, 0xA9, range(0xA05, 0xA0A), range(0xA0F, 0xA10), range(0xA13, 0xA28), range(0xA2A, 0xA30), 0xA32, range(0xA35, 0xA36), range(0xA38, 0xA39), 0xA3C, range(0xA3E, 0xA42), range(0xA47, 0xA48), range(0xA4B, 0xA4D), range(0xA59, 0xA5C), 0xA5E, range(0xA66, 0xA74), range(0x2010, 0x2011), range(0x2013, 0x2014), range(0x2018, 0x2019), range(0x201C, 0x201D), 0x2030, range(0x2032, 0x2033), 0x20AC],
		heb: [range(0x20, 0x22), range(0x24, 0x25), range(0x27, 0x29), range(0x2B, 0x3F), range(0x5B, 0x5F), 0x7C, 0xA0, 0xA9, 0x5BE, range(0x5D0, 0x5EA), range(0x5F3, 0x5F4), 0x200E, range(0x2010, 0x2011), range(0x2013, 0x2014), 0x2030, 0x20AC],
		slv: [range(0x20, 0x22), range(0x24, 0x25), range(0x27, 0x5F), range(0x61, 0x70), range(0x72, 0x76), range(0x7A, 0x7D), 0xA0, 0xA9, 0xAB, 0xBB, 0x106, range(0x10C, 0x10D), 0x110, range(0x160, 0x161), range(0x17D, 0x17E), 0x2011, 0x2013, range(0x201E, 0x201F), 0x2026, 0x2030, 0x20AC, 0x2212],
		cat: [range(0x20, 0x5F), range(0x61, 0x7A), 0x7C, range(0xA0, 0xA1), 0xA7, 0xA9, 0xAB, 0xB7, 0xBB, range(0xBF, 0xC0), range(0xC7, 0xC9), 0xCD, 0xCF, range(0xD2, 0xD3), 0xDA, 0xDC, 0xE0, range(0xE7, 0xE9), 0xED, 0xEF, range(0xF2, 0xF3), 0xFA, 0xFC, range(0x2010, 0x2011), range(0x2013, 0x2014), range(0x2018, 0x2019), range(0x201C, 0x201D), range(0x2020, 0x2021), 0x2026, 0x2030, range(0x2032, 0x2033), 0x20AC],
		tam: [range(0x20, 0x40), range(0x5B, 0x5F), 0x7C, 0xA0, 0xA7, 0xA9, 0xB83, range(0xB85, 0xB8A), range(0xB8E, 0xB90), range(0xB92, 0xB95), range(0xB99, 0xB9A), 0xB9C, range(0xB9E, 0xB9F), range(0xBA3, 0xBA4), range(0xBA8, 0xBAA), range(0xBAE, 0xBB5), range(0xBB7, 0xBB9), range(0xBBE, 0xBC2), range(0xBC6, 0xBC8), range(0xBCA, 0xBCD), range(0xBE6, 0xBEF), range(0x2010, 0x2011), range(0x2013, 0x2014), range(0x2018, 0x2019), range(0x201C, 0x201D), range(0x2020, 0x2021), 0x2026, 0x2030, range(0x2032, 0x2033), 0x20AC],
		lav: [range(0x20, 0x5F), range(0x61, 0x70), range(0x72, 0x76), 0x7A, 0x7C, 0xA0, 0xA7, 0xA9, range(0x100, 0x101), range(0x10C, 0x10D), range(0x112, 0x113), range(0x122, 0x123), range(0x12A, 0x12B), range(0x136, 0x137), range(0x13B, 0x13C), range(0x145, 0x146), range(0x160, 0x161), range(0x16A, 0x16B), range(0x17D, 0x17E), range(0x2010, 0x2011), range(0x2013, 0x2014), range(0x2018, 0x201A), range(0x201C, 0x201E), range(0x2020, 0x2021), 0x2026, 0x2030, range(0x2032, 0x2033), 0x20AC],
		hrv: [range(0x20, 0x22), range(0x24, 0x25), range(0x27, 0x5F), range(0x61, 0x70), range(0x72, 0x76), 0x7A, 0x7C, 0xA0, 0xA9, range(0x106, 0x107), range(0x10C, 0x10D), range(0x110, 0x111), range(0x160, 0x161), range(0x17D, 0x17E), 0x1C4, range(0x1C6, 0x1C7), range(0x1C9, 0x1CA), 0x1CC, range(0x2010, 0x2011), range(0x2013, 0x2014), range(0x2018, 0x201A), range(0x201C, 0x201E), 0x2026, 0x2030, range(0x2032, 0x2033), 0x20AC],
		gsw: [range(0x20, 0x21), range(0x24, 0x25), range(0x27, 0x29), range(0x2B, 0x3F), range(0x41, 0x5F), range(0x61, 0x7D), 0xA0, 0xA9, 0xC4, 0xD6, 0xDC, 0xE4, 0xF6, 0xFC, 0x2011, 0x2019, 0x2030, 0x20AC, 0x2212],
		fil: [range(0x20, 0x3F), range(0x41, 0x5F), range(0x61, 0x7A), 0x7C, 0xA0, 0xA7, 0xA9, 0xD1, 0xF1, range(0x2010, 0x2011), range(0x2013, 0x2014), range(0x2018, 0x2019), range(0x201C, 0x201D), 0x2026, 0x2030, range(0x2032, 0x2033), 0x20AC],
		slk: [range(0x20, 0x21), range(0x24, 0x5F), range(0x61, 0x7A), 0x7C, 0xA0, 0xA7, 0xA9, 0xC1, 0xC4, 0xC9, 0xCD, range(0xD3, 0xD4), 0xDA, 0xDD, 0xE1, 0xE4, 0xE9, 0xED, range(0xF3, 0xF4), 0xFA, 0xFD, range(0x10C, 0x10F), range(0x139, 0x13A), range(0x13D, 0x13E), range(0x147, 0x148), range(0x154, 0x155), range(0x160, 0x161), range(0x164, 0x165), range(0x17D, 0x17E), 0x1C6, 0x1F3, range(0x2010, 0x2011), 0x2013, 0x2018, 0x201A, 0x201C, 0x201E, 0x2026, 0x2030, 0x20AC],
		ukr: [range(0x20, 0x22), range(0x24, 0x25), range(0x27, 0x40), range(0x5B, 0x5F), range(0x7B, 0x7D), 0xA0, 0xA7, 0xA9, 0xAB, 0xBB, 0x2BC, 0x404, range(0x406, 0x407), range(0x410, 0x429), 0x42C, range(0x42E, 0x449), 0x44C, range(0x44E, 0x44F), 0x454, range(0x456, 0x457), range(0x490, 0x491), 0x2011, 0x2013, 0x2019, 0x201C, 0x201E, 0x2030, 0x20AC, 0x2116],
		fas: [range(0x20, 0x21), range(0x24, 0x25), range(0x27, 0x3A), range(0x3C, 0x3E), range(0x5B, 0x5F), 0x7C, 0xA0, 0xA9, 0xAB, 0xBB, 0x609, 0x60C, 0x61B, 0x61F, range(0x621, 0x624), range(0x626, 0x63A), range(0x641, 0x642), range(0x644, 0x648), range(0x64B, 0x64D), 0x651, 0x654, range(0x66A, 0x66C), 0x67E, 0x686, 0x698, 0x6A9, 0x6AF, 0x6CC, range(0x6F0, 0x6F9), 0x200E, range(0x2010, 0x2011), 0x2026, 0x2030, range(0x2039, 0x203A), 0x20AC, 0x2212],
		eus: [range(0x20, 0x5F), range(0x61, 0x7A), 0x7C, 0xA0, 0xA7, 0xA9, 0xC7, 0xD1, 0xE7, 0xF1, range(0x2010, 0x2011), range(0x2013, 0x2014), range(0x2018, 0x2019), range(0x201C, 0x201D), range(0x2020, 0x2021), 0x2026, 0x2030, range(0x2032, 0x2033), 0x20AC, 0x2212],
		isl: [range(0x20, 0x5F), range(0x61, 0x62), range(0x64, 0x70), range(0x72, 0x76), range(0x78, 0x79), 0x7C, 0xA0, 0xA7, 0xA9, 0xC1, 0xC6, 0xC9, 0xCD, 0xD0, 0xD3, 0xD6, 0xDA, range(0xDD, 0xDE), 0xE1, 0xE6, 0xE9, 0xED, 0xF0, 0xF3, 0xF6, 0xFA, range(0xFD, 0xFE), range(0x2010, 0x2011), range(0x2013, 0x2014), 0x2018, 0x201A, 0x201C, 0x201E, range(0x2020, 0x2021), 0x2026, 0x2030, range(0x2032, 0x2033), 0x20AC],
		tha: [range(0x20, 0x25), range(0x27, 0x3A), range(0x3C, 0x3E), 0x40, range(0x5B, 0x5F), 0x7C, 0xA0, 0xA9, range(0xE01, 0xE3A), range(0xE40, 0xE4E), range(0x2010, 0x2011), range(0x2013, 0x2014), range(0x2018, 0x2019), range(0x201C, 0x201D), 0x2026, 0x2030, range(0x2032, 0x2033), 0x20AC],
		vie: [range(0x20, 0x5F), range(0x61, 0x65), range(0x67, 0x69), range(0x6B, 0x76), range(0x78, 0x79), 0x7C, 0xA0, 0xA7, 0xA9, range(0xC0, 0xC3), range(0xC8, 0xCA), range(0xCC, 0xCD), range(0xD2, 0xD5), range(0xD9, 0xDA), 0xDD, range(0xE0, 0xE3), range(0xE8, 0xEA), range(0xEC, 0xED), range(0xF2, 0xF5), range(0xF9, 0xFA), 0xFD, range(0x102, 0x103), range(0x110, 0x111), range(0x128, 0x129), range(0x168, 0x169), range(0x1A0, 0x1A1), range(0x1AF, 0x1B0), range(0x1EA0, 0x1EF9), range(0x2010, 0x2011), range(0x2013, 0x2014), range(0x2018, 0x2019), range(0x201C, 0x201D), range(0x2020, 0x2021), 0x2026, 0x2030, range(0x2032, 0x2033), 0x20AC],
		afr: [range(0x20, 0x5F), range(0x61, 0x7A), 0x7C, 0xA0, 0xA7, 0xA9, range(0xC1, 0xC2), range(0xC8, 0xCB), range(0xCE, 0xCF), 0xD4, 0xD6, 0xDB, range(0xE1, 0xE2), range(0xE8, 0xEB), range(0xEE, 0xEF), 0xF4, 0xF6, 0xFB, range(0x2010, 0x2011), range(0x2013, 0x2014), range(0x2018, 0x2019), range(0x201C, 0x201D), range(0x2020, 0x2021), 0x2026, 0x2030, range(0x2032, 0x2033), 0x20AC],
		lit: [range(0x20, 0x21), range(0x24, 0x25), range(0x27, 0x29), range(0x2B, 0x3F), range(0x41, 0x50), range(0x52, 0x56), range(0x59, 0x5F), range(0x61, 0x70), range(0x72, 0x76), range(0x79, 0x7D), 0xA0, 0xA9, range(0x104, 0x105), range(0x10C, 0x10D), range(0x116, 0x119), range(0x12E, 0x12F), range(0x160, 0x161), range(0x16A, 0x16B), range(0x172, 0x173), range(0x17D, 0x17E), range(0x2010, 0x2011), range(0x2013, 0x2014), 0x201C, 0x201E, 0x2026, 0x2030, 0x20AC, 0x2212],
		cym: [range(0x20, 0x5F), range(0x61, 0x6A), range(0x6C, 0x70), range(0x72, 0x75), 0x77, 0x79, 0x7C, 0xA0, 0xA7, 0xA9, range(0xC0, 0xC2), 0xC4, range(0xC8, 0xCF), range(0xD2, 0xD4), 0xD6, range(0xD9, 0xDD), range(0xE0, 0xE2), 0xE4, range(0xE8, 0xEF), range(0xF2, 0xF4), 0xF6, range(0xF9, 0xFD), 0xFF, range(0x174, 0x178), range(0x1E80, 0x1E85), range(0x1EF2, 0x1EF3), range(0x2010, 0x2011), range(0x2013, 0x2014), range(0x2018, 0x2019), range(0x201C, 0x201D), range(0x2020, 0x2021), 0x2026, 0x2030, range(0x2032, 0x2033), 0x20AC],
		bul: [range(0x20, 0x22), range(0x24, 0x25), range(0x27, 0x40), range(0x5B, 0x5F), 0x7C, 0xA0, 0xA7, 0xA9, range(0x410, 0x42A), 0x42C, range(0x42E, 0x44A), 0x44C, range(0x44E, 0x44F), range(0x2010, 0x2011), range(0x2013, 0x2014), 0x2018, 0x201A, 0x201C, 0x201E, 0x2026, 0x2030, 0x2033, 0x20AC, 0x2116],
		tel: [range(0x20, 0x22), range(0x24, 0x25), range(0x27, 0x29), range(0x2B, 0x3F), range(0x5B, 0x5F), range(0x7B, 0x7D), 0xA0, 0xA9, range(0xC01, 0xC03), range(0xC05, 0xC0C), range(0xC0E, 0xC10), range(0xC12, 0xC28), range(0xC2A, 0xC33), range(0xC35, 0xC39), range(0xC3E, 0xC44), range(0xC46, 0xC48), range(0xC4A, 0xC4D), range(0xC55, 0xC56), range(0xC60, 0xC61), range(0xC66, 0xC6F), 0x2011, range(0x2018, 0x2019), range(0x201C, 0x201D), 0x2030, 0x20AC],
		glg: [range(0x20, 0x5F), range(0x61, 0x7A), 0x7C, range(0xA0, 0xA1), 0xA7, 0xA9, 0xAB, 0xBB, 0xBF, 0xC1, 0xC9, 0xCD, 0xCF, 0xD1, 0xD3, 0xDA, 0xDC, 0xE1, 0xE9, 0xED, 0xEF, 0xF1, 0xF3, 0xFA, 0xFC, range(0x2010, 0x2011), range(0x2013, 0x2014), range(0x2018, 0x2019), range(0x201C, 0x201D), range(0x2020, 0x2021), 0x2026, 0x2030, range(0x2032, 0x2033), 0x20AC],
		bre: [range(0x20, 0x21), range(0x24, 0x25), range(0x27, 0x29), range(0x2B, 0x3F), range(0x41, 0x50), range(0x52, 0x5F), range(0x61, 0x70), range(0x72, 0x7D), 0xA0, 0xA9, 0xCA, 0xD1, 0xD9, 0xEA, 0xF1, 0xF9, 0x2BC, 0x2011, 0x2030, 0x20AC],
		mya: [0x20, range(0x23, 0x25), range(0x27, 0x39), range(0x3C, 0x3E), 0x40, range(0x5B, 0x5F), range(0x7B, 0x7D), 0xA0, 0xA9, range(0x1000, 0x1021), range(0x1023, 0x1027), range(0x1029, 0x1032), range(0x1036, 0x104B), 0x104F, range(0x2010, 0x2011), range(0x2013, 0x2014), range(0x2018, 0x2019), range(0x201C, 0x201D), 0x2026, 0x2030, 0x20AC],
		urd: [0x20, range(0x24, 0x25), range(0x27, 0x29), range(0x2B, 0x3A), range(0x3C, 0x3E), range(0x5B, 0x5F), 0x7C, 0xA0, 0xA9, range(0x60C, 0x60D), 0x61B, 0x61F, 0x621, range(0x627, 0x628), range(0x62A, 0x63A), range(0x641, 0x642), range(0x644, 0x646), 0x648, range(0x66B, 0x66C), 0x679, 0x67E, 0x686, 0x688, 0x691, 0x698, 0x6A9, 0x6AF, 0x6BE, 0x6C1, 0x6CC, 0x6D2, 0x6D4, range(0x6F0, 0x6F9), 0x200E, 0x2011, 0x2030, 0x20AC],
		bos: [range(0x20, 0x22), range(0x24, 0x25), range(0x27, 0x5F), range(0x61, 0x70), range(0x72, 0x76), 0x7A, 0x7C, 0xA0, 0xA9, range(0x106, 0x107), range(0x10C, 0x10D), range(0x110, 0x111), range(0x160, 0x161), range(0x17D, 0x17E), 0x1C4, range(0x1C6, 0x1C7), range(0x1C9, 0x1CA), 0x1CC, range(0x2010, 0x2011), range(0x2013, 0x2014), range(0x2018, 0x2019), range(0x201C, 0x201D), 0x2026, 0x2030, range(0x2032, 0x2033), 0x20AC],
		oci: [range(0x20, 0x5F), range(0x61, 0x7A), 0x7C, 0xA0, 0xA7, 0xA9, 0xAB, 0xBB, range(0xC0, 0xC1), range(0xC7, 0xC9), 0xCD, 0xCF, range(0xD2, 0xD3), 0xDA, 0xDC, range(0xE0, 0xE1), range(0xE7, 0xE9), 0xED, 0xEF, range(0xF2, 0xF3), 0xFA, 0xFC, range(0x2010, 0x2011), range(0x2013, 0x2014), 0x2019, range(0x201C, 0x201D), range(0x2020, 0x2021), 0x2026, 0x2030, 0x20AC, 0x22C5],
		msa: [range(0x20, 0x5F), range(0x61, 0x7A), 0x7C, 0xA0, 0xA7, 0xA9, range(0x2010, 0x2011), range(0x2013, 0x2014), range(0x2018, 0x2019), range(0x201C, 0x201D), range(0x2020, 0x2021), 0x2026, 0x2030, range(0x2032, 0x2033), 0x20AC],
		mal: [range(0x20, 0x40), range(0x5B, 0x5F), 0x7C, 0xA0, 0xA7, 0xA9, range(0xD02, 0xD03), range(0xD05, 0xD0C), range(0xD0E, 0xD10), range(0xD12, 0xD28), range(0xD2A, 0xD39), range(0xD3E, 0xD43), range(0xD46, 0xD48), range(0xD4A, 0xD4D), 0xD57, range(0xD60, 0xD61), range(0xD66, 0xD6F), range(0xD7A, 0xD7F), range(0x200C, 0x200D), range(0x2010, 0x2011), range(0x2013, 0x2014), range(0x2018, 0x2019), range(0x201C, 0x201D), range(0x2020, 0x2021), 0x2026, 0x2030, range(0x2032, 0x2033), 0x20AC],
		bel: [range(0x20, 0x21), range(0x24, 0x25), range(0x27, 0x29), range(0x2B, 0x3F), range(0x5B, 0x5F), range(0x7B, 0x7D), 0xA0, 0xA9, 0xAB, 0xBB, 0x401, 0x406, 0x40E, range(0x410, 0x417), range(0x419, 0x428), range(0x42B, 0x437), range(0x439, 0x448), range(0x44B, 0x44F), 0x451, 0x456, 0x45E, 0x2011, 0x2030, 0x20AC],
		haw: [range(0x20, 0x21), range(0x24, 0x25), range(0x27, 0x29), range(0x2B, 0x3F), range(0x41, 0x5F), 0x61, 0x65, range(0x68, 0x69), range(0x6B, 0x70), 0x75, 0x77, range(0x7B, 0x7D), 0xA0, 0xA9, range(0x100, 0x101), range(0x112, 0x113), range(0x12A, 0x12B), range(0x14C, 0x14D), range(0x16A, 0x16B), 0x2BB, 0x2011, 0x2030, 0x20AC],
		yid: [range(0x20, 0x22), range(0x24, 0x25), range(0x27, 0x29), range(0x2B, 0x3F), range(0x5B, 0x5F), 0x7C, 0xA0, 0xA9, 0x5BC, range(0x5BE, 0x5BF), 0x5C2, range(0x5D0, 0x5EA), range(0x5F3, 0x5F4), range(0x2010, 0x2011), range(0x2013, 0x2014), 0x2030, 0x20AC, 0xFB1D, 0xFB1F, 0xFB2B, range(0xFB2E, 0xFB2F), 0xFB35, 0xFB3B, 0xFB44, 0xFB4A, 0xFB4C, 0xFB4E],
		asm: [range(0x20, 0x40), range(0x5B, 0x5F), 0x7C, 0xA0, 0xA7, 0xA9, 0x964, range(0x981, 0x983), range(0x985, 0x98B), range(0x98F, 0x990), range(0x993, 0x9A8), range(0x9AA, 0x9AF), 0x9B2, range(0x9B6, 0x9B9), 0x9BC, range(0x9BE, 0x9C3), range(0x9C7, 0x9C8), range(0x9CB, 0x9CE), range(0x9DC, 0x9DD), 0x9DF, range(0x9E6, 0x9F1), range(0x2010, 0x2011), range(0x2013, 0x2014), range(0x2018, 0x2019), range(0x201C, 0x201D), range(0x2020, 0x2021), 0x2026, 0x2030, range(0x2032, 0x2033), 0x20AC],
		mar: [range(0x20, 0x40), range(0x5B, 0x5F), 0x7C, 0xA0, 0xA9, range(0x901, 0x903), range(0x905, 0x90D), range(0x90F, 0x911), range(0x913, 0x928), range(0x92A, 0x933), range(0x935, 0x939), range(0x93C, 0x943), 0x945, range(0x947, 0x949), range(0x94B, 0x94D), 0x950, range(0x966, 0x96F), 0x200D, range(0x2010, 0x2011), range(0x2013, 0x2014), range(0x2018, 0x2019), range(0x201C, 0x201D), 0x2026, 0x2030, range(0x2032, 0x2033), 0x20AC],
		gle: [range(0x20, 0x5F), range(0x61, 0x69), range(0x6C, 0x70), range(0x72, 0x75), 0x7C, 0xA0, 0xA7, 0xA9, 0xC1, 0xC9, 0xCD, 0xD3, 0xDA, 0xE1, 0xE9, 0xED, 0xF3, 0xFA, range(0x2010, 0x2011), range(0x2013, 0x2014), range(0x2018, 0x2019), range(0x201C, 0x201D), range(0x2020, 0x2021), 0x2026, 0x2030, range(0x2032, 0x2033), 0x20AC],
		gla: [range(0x20, 0x49), range(0x4C, 0x50), range(0x52, 0x55), range(0x5B, 0x5F), range(0x61, 0x69), range(0x6C, 0x70), range(0x72, 0x75), range(0x7B, 0x7D), range(0xA0, 0xA1), 0xA7, 0xA9, 0xAE, 0xB0, range(0xB6, 0xB7), 0xC0, 0xC8, 0xCC, 0xD2, 0xD9, 0xE0, 0xE8, 0xEC, 0xF2, 0xF9, range(0x2010, 0x2011), range(0x2013, 0x2014), range(0x2018, 0x2019), range(0x201C, 0x201D), range(0x2020, 0x2021), range(0x2026, 0x2027), 0x2030, 0x204A, 0x20AC, 0x2122],
		mkd: [range(0x20, 0x21), range(0x24, 0x25), range(0x27, 0x29), range(0x2B, 0x3F), range(0x5B, 0x5F), range(0x7B, 0x7D), 0xA0, 0xA9, 0x403, 0x405, range(0x408, 0x40A), 0x40C, range(0x40F, 0x418), range(0x41A, 0x428), range(0x430, 0x438), range(0x43A, 0x448), 0x453, 0x455, range(0x458, 0x45A), 0x45C, 0x45F, range(0x2010, 0x2011), range(0x2013, 0x2014), 0x2018, 0x201A, 0x201C, 0x201E, 0x2026, 0x2030, 0x20AC],
		nob: [range(0x20, 0x21), range(0x23, 0x25), range(0x27, 0x5F), range(0x61, 0x7D), 0xA0, 0xA7, 0xA9, 0xAB, 0xBB, range(0xBF, 0xC0), range(0xC5, 0xC6), 0xC9, range(0xD2, 0xD4), 0xD8, 0xE0, range(0xE5, 0xE6), 0xE9, range(0xF2, 0xF4), 0xF8, 0x2011, 0x2013, range(0x2018, 0x2019), range(0x201C, 0x201D), range(0x2020, 0x2021), 0x2026, 0x2030, range(0x2032, 0x2033), 0x20AC, 0x2212],
		mri: [range(0x20, 0x21), range(0x24, 0x25), range(0x27, 0x29), range(0x2B, 0x3F), 0x41, 0x45, range(0x48, 0x49), 0x4B, range(0x4D, 0x50), 0x52, range(0x54, 0x55), 0x57, range(0x5B, 0x5F), 0x61, 0x65, range(0x67, 0x69), 0x6B, range(0x6D, 0x70), 0x72, range(0x74, 0x75), 0x77, range(0x7B, 0x7D), 0xA0, 0xA9, range(0x100, 0x101), range(0x112, 0x113), range(0x12A, 0x12B), range(0x14C, 0x14D), range(0x16A, 0x16B), 0x2011, 0x2030, 0x20AC],
		san: [range(0x20, 0x40), range(0x5B, 0x60), range(0x7B, 0x7E), 0xA0, 0xA7, 0xA9, range(0x901, 0x903), range(0x905, 0x90C), range(0x90F, 0x910), range(0x913, 0x928), range(0x92A, 0x930), range(0x932, 0x933), range(0x935, 0x939), range(0x93C, 0x944), range(0x947, 0x948), range(0x94B, 0x94D), range(0x950, 0x952), range(0x960, 0x963), range(0x966, 0x96F), 0x2011, range(0x2013, 0x2014), range(0x2018, 0x2019), range(0x201C, 0x201D), 0x2026, 0x2030, range(0x2032, 0x2033), 0x20AC],
		zul: [range(0x20, 0x21), range(0x24, 0x25), range(0x27, 0x29), range(0x2B, 0x3F), range(0x41, 0x5F), range(0x61, 0x7D), 0xA0, 0xA9, 0x2011, 0x2030, 0x20AC],
		ast: [range(0x20, 0x49), range(0x4C, 0x56), range(0x58, 0x5F), range(0x61, 0x69), range(0x6C, 0x76), range(0x78, 0x7A), 0x7C, range(0xA0, 0xA1), 0xA7, 0xA9, 0xAB, 0xBB, 0xBF, 0xC1, 0xC9, 0xCD, 0xD1, 0xD3, 0xDA, 0xDC, 0xE1, 0xE9, 0xED, 0xF1, 0xF3, 0xFA, 0xFC, range(0x1E24, 0x1E25), range(0x1E36, 0x1E37), range(0x2010, 0x2011), range(0x2013, 0x2014), range(0x2018, 0x2019), range(0x201C, 0x201D), range(0x2020, 0x2021), 0x2026, 0x2030, range(0x2032, 0x2033), 0x20AC],
		swa: [range(0x20, 0x22), range(0x24, 0x25), range(0x27, 0x29), range(0x2B, 0x3F), range(0x41, 0x50), range(0x52, 0x57), range(0x59, 0x5F), range(0x61, 0x70), range(0x72, 0x77), range(0x79, 0x7D), 0xA0, 0xA9, 0x2011, 0x2030, 0x20AC],
		kat: [range(0x20, 0x21), range(0x23, 0x40), range(0x5B, 0x5F), range(0x7B, 0x7D), 0xA0, 0xA7, 0xA9, 0xAB, 0xBB, range(0x10D0, 0x10F0), 0x10FB, range(0x1C90, 0x1CB0), range(0x2010, 0x2011), range(0x2013, 0x2014), 0x2018, 0x201A, 0x201C, 0x201E, range(0x2020, 0x2021), 0x2026, 0x2030, range(0x2032, 0x2033), 0x20AC, 0x2116],
		hye: [0x20, range(0x24, 0x25), 0x27, range(0x2B, 0x3A), range(0x3C, 0x3E), 0x5C, range(0x5E, 0x5F), 0x7C, 0xA0, 0xA9, 0xAB, 0xBB, range(0x531, 0x556), range(0x55A, 0x55F), range(0x561, 0x586), 0x58A, 0x2011, 0x2030, 0x20AC],
		kaz: [range(0x20, 0x40), range(0x5B, 0x5F), range(0x7B, 0x7D), 0xA0, 0xA7, 0xA9, 0xAB, 0xBB, 0x401, 0x406, range(0x410, 0x44F), 0x451, 0x456, range(0x492, 0x493), range(0x49A, 0x49B), range(0x4A2, 0x4A3), range(0x4AE, 0x4B1), range(0x4BA, 0x4BB), range(0x4D8, 0x4D9), range(0x4E8, 0x4E9), range(0x2010, 0x2011), range(0x2013, 0x2014), range(0x2018, 0x2019), range(0x201C, 0x201D), 0x2026, 0x2030, 0x20AC],
		tuk: [range(0x20, 0x25), range(0x27, 0x42), range(0x44, 0x50), range(0x52, 0x55), 0x57, range(0x59, 0x5F), range(0x61, 0x62), range(0x64, 0x70), range(0x72, 0x75), 0x77, range(0x79, 0x7D), 0xA0, 0xA7, 0xA9, 0xC4, 0xC7, 0xD6, range(0xDC, 0xDD), 0xE4, 0xE7, 0xF6, range(0xFC, 0xFD), range(0x147, 0x148), range(0x15E, 0x15F), range(0x17D, 0x17E), 0x2011, range(0x2013, 0x2014), range(0x201C, 0x201D), 0x2026, 0x2030, 0x20AC],
		uzb: [range(0x20, 0x56), range(0x58, 0x5F), range(0x61, 0x76), range(0x78, 0x7A), 0x7C, 0xA0, 0xA7, 0xA9, range(0x2BB, 0x2BC), range(0x2010, 0x2011), range(0x2013, 0x2014), range(0x2018, 0x2019), range(0x201C, 0x201D), range(0x2020, 0x2021), 0x2026, 0x2030, range(0x2032, 0x2033), 0x20AC],
		ltz: [range(0x20, 0x5F), range(0x61, 0x7D), 0xA0, 0xA7, 0xA9, 0xAB, 0xBB, 0xC4, 0xC9, 0xCB, 0xE4, 0xE9, 0xEB, range(0x2010, 0x2011), range(0x2013, 0x2014), 0x2018, 0x201A, 0x201C, 0x201E, 0x2026, 0x2030, 0x20AC],
		mon: [range(0x20, 0x40), range(0x5B, 0x5F), 0x7C, 0xA0, 0xA7, 0xA9, 0x401, range(0x410, 0x44F), 0x451, range(0x4AE, 0x4AF), range(0x4E8, 0x4E9), range(0x2010, 0x2011), range(0x2013, 0x2014), range(0x2018, 0x2019), range(0x201C, 0x201D), range(0x2020, 0x2021), 0x2026, 0x2030, range(0x2032, 0x2033), 0x20AC],
		som: [range(0x20, 0x40), range(0x42, 0x44), range(0x46, 0x48), range(0x4A, 0x4E), range(0x51, 0x54), range(0x57, 0x59), range(0x5B, 0x5F), range(0x62, 0x64), range(0x66, 0x68), range(0x6A, 0x6E), range(0x71, 0x74), range(0x77, 0x79), 0x7C, 0xA0, 0xA7, 0xA9, range(0x2010, 0x2011), range(0x2013, 0x2014), range(0x2018, 0x2019), range(0x201C, 0x201D), range(0x2020, 0x2021), 0x2026, 0x2030, range(0x2032, 0x2033), 0x20AC],
	});
	const detectScript = literals => detectAlphabet(literals, {
		Latn: [range(0x20, 0x7E), range(0xA0, 0xFF), range(0x100, 0x17F), range(0x180, 0x24F), range(0x250, 0x2AF), range(0x2B0, 0x2FF), range(0x300, 0x36F), range(0x1E00, 0x1EFF), range(0x2C60, 0x2C7F), range(0xA720, 0xA7FF), range(0xAB30, 0xAB6F), range(0x10780, 0x107BF), range(0x1DF00, 0x1DFFF)],
		Cyrl: [range(0x400, 0x4FF), range(0x500, 0x52F), range(0x2DE0, 0x2DFF), range(0xA640, 0xA69F), range(0x1C80, 0x1C8F), range(0x1E030, 0x1E08F)],
	});
	const languageIdentifier = text => GlobalXHR.post('https://api.translatedlabs.com/language-identifier/identify', {
		text: text,
		etnologue: true,
		uiLanguage: 'en',
	}, { responseType: 'json' }).then(function({json}) {
		console.log('Online language identifier success:', json);
		let iso6393 = /^(\w{2})-(\w{2})$/.exec(json.code);
		return iso6393 != null && (iso6393 = {
			aa: 'aar', ab: 'abk', ae: 'ave', af: 'afr', ak: 'aka', am: 'amh', an: 'arg', ar: 'ara', as: 'asm',
			av: 'ava', ay: 'aym', az: 'aze', ba: 'bak', be: 'bel', bg: 'bul', bi: 'bis', bm: 'bam', bn: 'ben',
			bo: 'bod', br: 'bre', bs: 'bos', ca: 'cat', ce: 'che', ch: 'cha', co: 'cos', cr: 'cre', cs: 'ces',
			cu: 'chu', cv: 'chv', cy: 'cym', da: 'dan', de: 'deu', dv: 'div', dz: 'dzo', ee: 'ewe', el: 'ell',
			en: 'eng', eo: 'epo', es: 'spa', et: 'est', eu: 'eus', fa: 'fas', ff: 'ful', fi: 'fin', fj: 'fij',
			fo: 'fao', fr: 'fra', fy: 'fry', ga: 'gle', gd: 'gla', gl: 'glg', gn: 'grn', gu: 'guj', gv: 'glv',
			ha: 'hau', he: 'heb', hi: 'hin', ho: 'hmo', hr: 'hrv', ht: 'hat', hu: 'hun', hy: 'hye', hz: 'her',
			ia: 'ina', id: 'ind', ie: 'ile', ig: 'ibo', ii: 'iii', ik: 'ipk', io: 'ido', is: 'isl', it: 'ita',
			iu: 'iku', ja: 'jpn', jv: 'jav', ka: 'kat', kg: 'kon', ki: 'kik', kj: 'kua', kk: 'kaz', kl: 'kal',
			km: 'khm', kn: 'kan', ko: 'kor', kr: 'kau', ks: 'kas', ku: 'kur', kv: 'kom', kw: 'cor', ky: 'kir',
			la: 'lat', lb: 'ltz', lg: 'lug', li: 'lim', ln: 'lin', lo: 'lao', lt: 'lit', lu: 'lub', lv: 'lav',
			mg: 'mlg', mh: 'mah', mi: 'mri', mk: 'mkd', ml: 'mal', mn: 'mon', mr: 'mar', ms: 'msa', mt: 'mlt',
			my: 'mya', na: 'nau', nb: 'nob', nd: 'nde', ne: 'nep', ng: 'ndo', nl: 'nld', nn: 'nno', no: 'nor',
			nr: 'nbl', nv: 'nav', ny: 'nya', oc: 'oci', oj: 'oji', om: 'orm', or: 'ori', os: 'oss', pa: 'pan',
			pi: 'pli', pl: 'pol', ps: 'pus', pt: 'por', qu: 'que', rm: 'roh', rn: 'run', ro: 'ron', ru: 'rus',
			rw: 'kin', sa: 'san', sc: 'srd', sd: 'snd', se: 'sme', sg: 'sag', si: 'sin', sk: 'slk', sl: 'slv',
			sm: 'smo', sn: 'sna', so: 'som', sq: 'sqi', sr: 'srp', ss: 'ssw', st: 'sot', su: 'sun', sv: 'swe',
			sw: 'swa', ta: 'tam', te: 'tel', tg: 'tgk', th: 'tha', ti: 'tir', tk: 'tuk', tl: 'tgl', tn: 'tsn',
			to: 'ton', tr: 'tur', ts: 'tso', tt: 'tat', tw: 'twi', ty: 'tah', ug: 'uig', uk: 'ukr', ur: 'urd',
			uz: 'uzb', ve: 'ven', vi: 'vie', vo: 'vol', wa: 'wln', wo: 'wol', xh: 'xho', yi: 'yid', yo: 'yor',
			za: 'zha', zh: 'zho', zu: 'zul',
		}[iso6393[1].toLowerCase()]) ? Object.assign(json, { iso6393: iso6393 })
			: Promise.reject('Language not resolved');
	});
	const labelMapper = label => dashUnifier(label);
	const encodeLuceneTerm = term => term
		&& term.replace(/([\+\-\!\(\)\{\}\[\]\^\"\~\*\?\:\\\/\&\|])/g, '\\$1');
	const encodeQuotes = term => term && term.replace(/"\\/g, m => Array.from(m, ch => '\\' + ch).join(''));
	if (editionInfo != null) {
		if (incompleteEdition.test(editionInfo.lastChild.textContent.trim()))
			editionInfo.parentNode.style.backgroundColor = '#f001';
		if (editionSearch && editionInfo.parentNode.querySelector('span[class$="-edition-search"]') == null) {
			function addSearch(className, resourceName, callBack, title) {
				const span = document.createElement('span'), defaultOpacity = 0.5;
				[span.style, span.className, span.innerHTML] = ['float: right; margin-left: 3pt;', className, GM_getResourceText(resourceName)];
				const icon = span.querySelector('svg');
				if (icon == null) throw 'Assertion failed: no SVG in resource';
				icon.setAttribute('height', '1em');
				icon.removeAttribute('width');
				[icon.style.cursor, icon.style.opacity, icon.style.transition] = ['pointer', defaultOpacity, 'opacity 100ms, scale 100ms'];
				icon.dataset.torrentId = torrentId;
				icon.onclick = function(evt) {
					const target = evt.currentTarget, editionTR = target.closest('tr.edition');
					if (editionTR == null) throw 'Assertion failed: edition row not found';
					if (target.disabled) return; else target.disabled = true;
					const haveResults = Boolean(eval(target.dataset.haveResults));
					const animation = haveResults ? null : flashElement(target);
					queryAjaxAPICached('torrent', { id: target.dataset.torrentId }).then(function(torrent) {
						console.assert(torrent.torrent.remasterYear > 0);
						const [labels, catNos] = editionInfoParser(torrent.torrent);
						const roleMapper = importance => torrent.group.musicInfo && (importance = torrent.group.musicInfo[importance])
							&& importance.length > 0 ? importance.map(artist => artist.name) : undefined;
						const artists = torrent.group.releaseType == 7 ? 'Various Artists'
							: roleMapper('dj') || roleMapper('artists');
						const nonemptyArray = array => array.length > 0 ? array : undefined;
						const searchParams = {
							artists: artists,
							releaseTitle: torrent.group.name ? releaseTitleNorm(torrent.group.name) : undefined,
							year: torrent.torrent.remasterYear > 0 ? torrent.torrent.remasterYear : undefined,
							labels: nonemptyArray(labels),
							searchLabels: nonemptyArray(labels.filter(label => !rxNoLabel.test(label))),
							catNos: nonemptyArray(catNos),
							searchCatNos: nonemptyArray(decodeHTML(torrent.torrent.remasterCatalogueNumber).split(rxEditionSplitter)
								.map(value => value.trim()).map(catno => !rxNoCatno.test(catno) ? catno.replace(rxCatNoRange, '$1$2') : undefined)
								.filter((s1, n, a) => s1 && a.findIndex(s2 => s2.toLowerCase() == s1.toLowerCase()) == n)),
							barcodes: nonemptyArray(catNos.map(catNo => checkBarcode(catNo, true)).filter(Boolean)),
							editionTitle: torrent.torrent.remasterTitle || undefined,
							releaseType: torrent.group.releaseType,
						};
						return searchParams.searchCatNos && (searchParams.searchLabels || searchParams.year)
							|| searchParams.barcodes || searchParams.releaseTitle && (searchParams.artists || searchParams.year) ?
								callBack(searchParams, haveResults) : null;
					}, alert).catch(function(reason) {
						target.style.fill = 'red';
						for (let def of target.getElementsByTagName('defs')) def.remove();
						for (let path of target.getElementsByTagName('path')) {
							path.removeAttribute('fill');
							path.style.fill = null;
						}
						target.insertAdjacentHTML('afterbegin', '<title>' + reason + '</title>');
						return false;
					}).then(function(results) {
						if (results !== undefined) target.dataset.haveResults = true;
						if (results === null) return target.parentNode.remove();
						if (results instanceof HTMLElement) editionTR.after(results);
						if (animation != null) animation.cancel();
						[target.style.opacity, target.disabled] = [1, false];
					});
				};
				icon.onmouseenter = span.firstElementChild.onmouseleave = function(evt) {
					if (evt.type == 'mouseenter') {
						evt.currentTarget.style.opacity = 1;
						evt.currentTarget.style.scale = 1.25;
					} else {
						if (!evt.currentTarget.dataset.haveResults) evt.currentTarget.style.opacity = defaultOpacity;
						evt.currentTarget.style.scale = 'none';
					}
				};
				svgSetTitle(icon, title);
				editionInfo.after(span);
			}

			addSearch('discogs-edition-search', 'dc_icon', function(params, haveResults) {
				function openInNewWindow(background = false) {
					const url = new URL('search', dcOrigin);
					url.searchParams.set('type', 'release');
					if (params.searchLabels) url.searchParams.set('label', params.searchLabels.join(' '));
					if (params.searchCatNos) url.searchParams.set('catno', params.searchCatNos.join(' '));
					if (!params.searchCatNos || !params.searchLabels) {
						if (params.year) url.searchParams.set('year', params.year);
						if (params.releaseTitle) url.searchParams.set('title', params.releaseTitle);
						if (!params.releaseTitle || !params.year)
							if (Array.isArray(params.artists)) url.searchParams.set('artist', params.artists[0]);
							else if (params.artists == 'Various Artists') url.searchParams.set('format', 'Compilation');
					}
					//url.searchParams.set('format', 'CD');
					GM_openInTab(url.href, background);
					if (!params.barcodes) return;
					url.searchParams.delete('label'); url.searchParams.delete('catno');
					for (let barcode of params.barcodes) {
						url.searchParams.set('barcode', barcode);
						GM_openInTab(url.href, background);
					}
				}

				if (!dcAuth && !params.searchLabels && !params.searchCatNos) return Promise.resolve(null);
				if (autoOpenTab || haveResults || !dcAuth) openInNewWindow(!haveResults);
				if (haveResults || !dcAuth) return Promise.resolve(undefined);
				const searchMethods = { };
				if (params.searchCatNos || params.barcodes) {
					const searches = [ ], search = { };
					if (params.searchLabels) search.label = params.searchLabels.join(' ');
					if (params.searchCatNos) search.catno = params.searchCatNos.join(' ');
					if ((!params.searchLabels || !params.searchCatNos) && params.year) search.year = params.year;
					if (Object.keys(search).length > 0) searches.push(search);
					if (params.barcodes)
						Array.prototype.push.apply(searches, params.barcodes.map(barcode => ({ barcode: barcode })));
					if (searches.length > 0) searchMethods['label / cat# / barcode'] = searches;
				}
				if (params.searchLabels && params.searchCatNos
						&& Math.min(...['Labels', 'CatNos'].map(p => params['search' + p].length)) > 2
						&& params.searchLabels.length * params.searchCatNos.length <= 15)
					searchMethods['single label / cat#'] = Array.prototype.concat.apply([ ], params.searchLabels.map(label =>
						params.searchCatNos.map(catNo => ({ label: label, catno: catNo }))));
				if (params.releaseTitle) {
					const releaseTitles = parseLanguages(params.releaseTitle);
					if (Array.isArray(params.artists)) searchMethods['artist / album'] = Array.prototype.concat.apply([ ],
						params.artists.map(artist => Array.prototype.concat.apply([ ], parseLanguages(artist, true).map(artist =>
							releaseTitles.map(releaseTitle => ({ release_title: releaseTitle, artist: artist }))))));
					if (params.year) searchMethods['album / year'] = releaseTitles.map(releaseTitle => ({ release_title: releaseTitle, year: params.year }));
				}
				return Object.values(searchMethods).length > 0 ? (function searchMethod(index = 0) {
					return index < Object.values(searchMethods).length ? (searches =>
							Promise.all(searches.map(search => (function searchPage(page = 1) {
						return dcApiRequest('database/search', Object.assign({
							type: 'release', sort: 'score',
							page: page, per_page: 100,
						}, search)).then(function(response) {
							return parseInt(response.pagination.pages) > parseInt(response.pagination.page) ?
								searchPage(page + 1).then(Array.prototype.concat.bind(response.results)) : response.results;
						}, function(reason) {
							console.warn(reason);
							return [ ];
						});
					})())).then(results => Array.prototype.concat.apply([ ], results).filter(uniqueIdFilter)).then(function(results) {
						const resultsFilter = (matchYear = true) => (matchYear = results.filter(function(release) {
							if (matchYear && release.year && parseInt(release.year) != params.year) return false;
							return !release.formats || release.formats.some(isDiscogsCD);
						})).length > 0 ? matchYear : false;
						return resultsFilter(true) || resultsFilter(false) || Promise.reject('Not found by any method');
					}))(Object.values(searchMethods)[index]).then(results => Object.assign(results, { methodName: Object.keys(searchMethods)[index] }),
						reason => searchMethod(index + 1)) : Promise.reject('Nothing found by any method');
				})().then(function(results) {
					const [tr, td, table, thead, tbody] = createElements('tr', 'td', 'table', 'div', 'tbody');
					[tr.className, td.colSpan, thead.style] = ['edition-search-results', 6, theadStyle];
					thead.innerHTML = `[<b>Discogs</b>] <b>${results.methodName}</b> (${results.length})`;
					const rowWorkers = [ ];
					results.forEach(function(release, index) {
						const [tr, artist, title, mediaFormats, numTracks, releaseEvents, companies, catNos, barcode, groupSize] =
							createElements('tr', 'td', 'td', 'td', 'td', 'td', 'td', 'td', 'td', 'td');
						tr.className = 'discogs-release';
						[barcode.style, numTracks.style.textAlign, groupSize.style.textAlign] =
							['white-space: break-spaces; max-width: 30%;', 'right', 'right'];
						title.innerHTML = linkHTML(dcOrigin + release.uri, release.title, 'discogs-release');
						let descriptors = getDiscogsReleaseDescriptors(release);
						if (descriptors.length > 0) appendDisambiguation(title, descriptors.join(', '));
						if (release.thumb || release.cover_image) addThumbnail(title, release.thumb || release.cover_image,
							[dcOrigin, 'release', release.id, 'images'].join('/'));
						if (release.formats) mediaFormats.innerHTML = release.formats.filter(format => parseInt(format.qty) > 0).map(function(format) {
							const medium = format.qty + '×' + format.name, descriptors = getFormatDescriptions(format);
							return /*descriptors.length > 0 ? medium + ' (' + descriptors.join(', ') + ')' : */medium;
						}).join('<br>');
						if (release.country || release.year) fillListRows(releaseEvents,
							iso3166ToFlagCodes(discogsCountryToIso3166Mapper(release.country)).map(countryCode =>
								releaseEventMapper(countryCode, release.year, params.year)), 3);
						if (Array.isArray(release.label)) fillListRows(companies, release.label.map(stripDiscogsNameVersion)
							.filter(uniqueValues).map(label => editionInfoMapper(label, undefined, params.labels)), 3, true);
						if (release.catno) fillListRows(catNos, [editionInfoMapper(undefined, release.catno, null, params.catNos)]);
						const identifiers = (release.barcode || [ ]).map(function(identifier) {
							const div = document.createElement('div');
							[div.textContent, div.className] = [identifier, 'identifier'];
							if (params.catNos && params.catNos.some(catNo => sameBarcodes(catNo, identifier)))
								editionInfoMatchingStyle(div);
							return div;
						});
						if (identifiers.length > 0) barcode.append(...identifiers);
						rowWorkers.push(dcApiRequest('releases/' + release.id).catch(reason =>
								GlobalXHR.head([dcOrigin, 'release', release.id].join('/')).then(function({finalUrl}) {
							const releaseId = discogsIdExtractor(finalUrl, 'release');
							return releaseId > 0 && releaseId != release.id ? dcApiRequest('releases/' + releaseId) : Promise.reject(reason);
						}, () => Promise.reject(reason))).then(function(release) {
							const releaseLink = title.querySelector('a.discogs-release');
							if (releaseLink != null) [releaseLink.href/*, releaseLink.textContent*/] = [release.uri, release.title];
							// setDiscogsArtist(artist, release.artists);
							let realTracks = discogsReleaseTracks(release);
							if (realTracks = [undefined, realTracks[0], `${realTracks[0]}(${realTracks[1]})`][realTracks.length])
								numTracks.textContent = realTracks;
							if (release.labels.length <= 0) return;
							while (catNos.lastChild != null) catNos.removeChild(catNos.lastChild);
							fillListRows(catNos, release.labels.map(label => label.catno).filter(uniqueValues)
								.map(catNo => editionInfoMapper(undefined, catNo, null, params.catNos)));
							setDiscogsTooltip(release, tr);
						}, function(reason) {
							tr.style = 'background-color: #f001; opacity: 0.4;';
							setTooltip(tr, reason);
						}));
						setDiscogsGroupSize(release, groupSize);
						tr.append(title, mediaFormats, numTracks, releaseEvents, companies, catNos, barcode, groupSize);
						for (let cell of tr.cells) cell.style.backgroundColor = 'inherit';
						['title', 'media-formats', 'tracks', 'release-events', 'labels-and-companies', 'cat-nos', 'identifiers', 'editions-total']
							.forEach((className, index) => { tr.cells[index].className = className });
						tbody.append(tr);
					});
					table.append(thead, tbody); td.append(thead, table); tr.append(td);
					Promise.all(rowWorkers).then(() => { addResultsFilter(thead, tbody, 5) }, console.warn);
					return tr;
				}) : Promise.resolve(null);
			}, 'Search edition on Discogs\n(Discogs API authorization required for embedded results)');
			addSearch('musicbrainz-edition-search', 'mb_logo', function(params, haveResults) {
				const queries = { }, yearField = 'date:' + params.year, brackets = expr => '(' + expr + ')';
				if (params.barcodes) queries['barcode'] =
					[params.barcodes.map(barcode => 'barcode:' + barcode).join(' OR ')];
				if (params.searchCatNos) {
					if (params.searchLabels) queries['label / cat#'] = [
						params.searchLabels.map(label => `label:(${encodeLuceneTerm(label)})`).join(' OR '),
						params.searchCatNos.map(catNo => `catno:(${encodeLuceneTerm(catNo)})`).join(' OR '),
					];
					if (params.year > 0) queries['cat# / year'] = [
						params.searchCatNos.map(catNo => `catno:(${encodeLuceneTerm(catNo)})`).join(' OR '),
						yearField,
					];
				}
				if (params.releaseTitle) {
					const title = parseLanguages(params.releaseTitle).map(title => ['release', 'alias'].map(field =>
						`${field}:(${encodeLuceneTerm(title)})`).join(' OR ')).join(' OR ');
					let artists = { 7: 'secondarytype:compilation', 19: 'secondarytype:DJ-mix' }[params.releaseType];
					if (!artists && Array.isArray(params.artists) && params.artists.length > 0)
						artists = params.artists.map(artist => '(' + parseLanguages(artist, true).map(artist =>
							['artistname', 'creditname'].map(field => `${field}:(${encodeLuceneTerm(artist)})`)
							.join(' OR ')).join(' OR ') + ')').join(' AND ');
					if (artists) queries['artist / album'] = [title, artists];
					if (params.year > 0) queries['album / year'] = [title, yearField];
				}
				const formats = [
					'CD', 'CD-R', 'Enhanced CD', 'SHM-CD', 'Blu-spec CD', 'Copy Control CD',
					'HDCD', '8cm CD', 'Hybrid SACD (CD layer)', 'DualDisc (CD side)', 'DualDisc',
					'Hybrid SACD', 'DTS CD', 'HQCD', 'CD+G', '8cm CD+G', 'Mixed Mode CD', 'Minimax CD',
				].map(format => `format:"${format}"`).join(' OR ') + ' OR (NOT format:*)';
				if (queries.length <= 0) return Promise.resolve(null);
				if (autoOpenTab || haveResults) {
					const url = new URL('search', mbOrigin);
					url.searchParams.set('method', 'advanced');
					url.searchParams.set('type', 'release');
					url.searchParams.set('query', [
						Object.values(queries).map((query, index, queries) =>
							`(${query.map(brackets).join(' AND ')})^${queries.length - index}`).join(' OR '),
						formats,
					].map(brackets).join(' AND '));
					GM_openInTab(url.href, !haveResults);
				}
				return haveResults ? Promise.resolve(undefined) : (function doQuery(index = 0) {
					return index < Object.values(queries).length ? mbApiRequest('release', {
						query: Object.values(queries)[index].concat(formats).map(brackets).join(' AND '),
						limit: 100,
					}).then(({releases}) => releases.length > 0 ? Object.assign(releases, { queryName: Object.keys(queries)[index] })
						: doQuery(index + 1)) : Promise.reject('Nothing found by any method');
				})().then(function(releases) {
					const [tr, td, table, thead, tbody] = createElements('tr', 'td', 'table', 'div', 'tbody');
					[tr.className, td.colSpan, thead.innerHTML, thead.style, thead.style.minHeight] =
						['edition-search-results', 6, `[<b>MusicBrainz</b>] <b>${releases.queryName}</b> (${releases.length})`, theadStyle, '1em'];
					releases.forEach(function(release, index) {
						const [tr, artist, title, releaseEvents, labels, catNos, barcode, groupSize, releasesWithId] =
							createElements('tr', 'td', 'td', 'td', 'td', 'td', 'td', 'td', 'td');
						tr.className = 'musicbrainz-release';
						if (release.quality == 'low') tr.style.opacity = 0.75;
						[releaseEvents, barcode].forEach(elem => { elem.style.whiteSpace = 'nowrap' });
						[groupSize, releasesWithId].forEach(elem => { elem.style.textAlign = 'right' });
						setMusicBrainzArtist(release, artist, false);
						setMusicBrainzTitle(release, title);
						setMusicBrainzReleaseEvents(release, releaseEvents, params.year);
						if (Array.isArray(release['label-info'])) {
							fillListRows(labels, release['label-info'].map(labelInfo =>
								labelInfo.label && labelInfo.label.name).filter(uniqueValues).map(label =>
									editionInfoMapper(label, undefined, params.labels)));
							fillListRows(catNos, release['label-info'].map(labelInfo => labelInfo['catalog-number'])
								.filter(uniqueValues).map(catNo => editionInfoMapper(undefined, catNo, undefined, params.catNos)));
						}
						if (release.barcode) {
							barcode.textContent = release.barcode;
							if (params.barcodes && params.barcodes.some(barcode => sameBarcodes(barcode, release.barcode)))
								editionInfoMatchingStyle(barcode);
							barcodeStyle(barcode);
						}
						setMusicBrainzGroupSize(release, groupSize, releasesWithId);
						setMusicBrainzTooltip(release, tr);
						tr.append(artist, title, releaseEvents, labels, catNos, barcode, groupSize, releasesWithId);
						for (let cell of tr.cells) cell.style.fontSize = cell.style.backgroundColor = 'inherit';
						['artist', 'title', 'release-events', 'labels', 'cat-nos', 'barcode', 'editions-total', 'discids-total']
							.forEach((className, index) => { tr.cells[index].classList.add(className) });
						tbody.append(tr);
					});
					table.append(thead, tbody); td.append(thead, table); tr.append(td);
					addResultsFilter(thead, tbody, 5);
					return tr;
				});
			}, 'Search edition on MusicBrainz');
			addSearch('allmusic-edition-search', 'am_logo', function(params, haveResults) {
				if (!params.releaseTitle) return Promise.reject('Insufficient parameters');
				const searchTerms = [params.releaseTitle];
				if (params.releaseType == 7) searchTerms.unshift('Various');
				else if (Array.isArray(params.artists))
					Array.prototype.unshift.apply(searchTerms, params.artists.slice(0, 3));
				const origin = 'https://www.allmusic.com', searchLink = origin + '/search/albums/' +
					encodeURIComponent(searchTerms.map(searchTerm => '"' + searchTerm + '"').join(' '));
				if (autoOpenTab || haveResults) GM_openInTab(searchLink, !haveResults);
				if (haveResults) return Promise.resolve(undefined);
				return GlobalXHR.get(searchLink).then(({document}) => Promise.all(Array.from(document.body.querySelectorAll('div#resultsContainer div.album, div#resultsContainer div.song'), function(div) {
					function urlResolver(elem) {
						if (elem instanceof HTMLAnchorElement) try { return new URL(elem.getAttribute('href'), origin).href }
						catch(e) {
							console.warn(e);
							return elem.href;
						}
					}

					const textMapper = elem => elem instanceof HTMLElement && elem.textContent.trim() || undefined;
					const yearMapper = elem => (elem = textMapper(elem)) && parseInt(elem) || undefined;
					const linkMapper = a => a instanceof HTMLAnchorElement ? {
						text: a.textContent.trim(),
						url: urlResolver(a),
					} : undefined;
					const coverMapper = img => img instanceof HTMLImageElement ? (function(param) {
						if (param) try {
							if (!(param = new URL(param)).pathname.includes('/images/no_image/')) return param.href;
						} catch(e) { console.warn(e) }
					})(img.src || img.dataset.src) : undefined;
					const album = {
						type: 'album',
						artist: linkMapper(div.querySelector('div.artist > a')),
						title: textMapper(div.querySelector('div.title > a')),
						year: yearMapper(div.querySelector('div.year')),
						genres: textMapper(div.querySelector('div.genres')),
						url: urlResolver(div.querySelector('div.title > a')),
						cover: coverMapper(div.querySelector('div.cover img')),
					};
					if (album.genres) album.genres = album.genres.split(',').map(genre => genre.trim());
					return album.url ? GlobalXHR.get(album.url + '/releasesAjax', { headers: { Referer: album.url } }).then(function({document}) {
						let releases = Array.from(document.body.querySelectorAll('table.releaseTable > tbody > tr'), function(tr) {
							const release = {
								type: 'release',
								title: textMapper(tr.querySelector('span.title > a')) || album.title,
								url: urlResolver(tr.querySelector('span.title > a')),
								cover: coverMapper(tr.querySelector('td.cover img')),
							};
							let elem = tr.querySelector('td.yearFormat');
							if (elem != null) [release.year, release.format] =
								[yearMapper(elem.children[0]), textMapper(elem.children[1])];
							if ((elem = tr.querySelector('span.labelRelId')) != null) {
								const labels = elem.getElementsByTagName('a');
								console.assert(labels.length < 2, elem);
								if (labels.length > 0) release.label = textMapper(labels[0]);
								if (elem.lastChild.nodeType == Node.TEXT_NODE)
									release.catNo = elem.lastChild.textContent.trim().replace(/^-\s*/, '');
							}
							return release;
						});
						releases = releases.filter(release => !release.format || ['CD', 'CD-R'].includes(release.format));
						return releases.length > 0 ? Promise.all(releases.map(function(release) {
							release = Object.assign({ }, album, release);
							return release.url ? GlobalXHR.get(release.url + '/trackListingAjax', { headers: { Referer: release.url } }).then(function({document}) {
								if (!(document instanceof HTMLDocument)) return Object.assign(release, { discs: null });
								const discs = document.body.querySelectorAll('div#trackContainer > div.disc');
								return Object.assign(release, {
									discs: Array.from(discs, disc => disc.querySelectorAll(':scope > div.track').length),
								});
							}, function(reason) {
								console.warn(reason);
								return release;
							}) : release;
						})) : album;
					}, reason => album) : album;
				}))).then(function(results) {
					function addResult(result) {
						function setArtist(...artists) {
							if (artists.length > 0) artists.forEach(function(amArtist, index, artists) {
								if (index > 0) artist.append(index < artists.length - 1 ? ', ' : ' & ');
								artist.append(Object.assign(document.createElement('a'), {
									href: amArtist.url,
									target: '_blank',
									style: noLinkDecoration,
									textContent: amArtist.text,
									className: 'allmusic-artist',
								}));
							});
						}

						const [tr, artist, title, releaseEvent, format, editionInfo, discs] = createElements('tr', 'td', 'td', 'td', 'td', 'td', 'td');
						discs.style.textAlign = 'right';
						if (result.artist) setArtist(result.artist);
						if (result.title) title.innerHTML = linkHTML(result.type == 'album' ? result.url + '#releases'
							: result.url, result.title, 'allmusic-' + result.type);
						if (result.cover) addThumbnail(title, result.cover);
						if (result.year > 0) releaseEvent.append(...releaseEventMapper(undefined, result.year, params.year));
						if (result.type == 'release') {
							if (result.format) format.textContent = result.format;
							fillListRows(editionInfo, [editionInfoMapper(result.label, result.catNo, params.labels, params.catNos)]);
							discs.textContent = result.discs ? result.discs.join('+') : '−';
							discs.title = 'Track counts';
							if (!result.discs || !result.discs.some(disc => disc > 0)) tr.style.opacity = 0.75;
						}
						tr.className = 'allmusic-' + result.type;
						tr.append(artist, artist, title, releaseEvent, /*format, */editionInfo, discs);
						['artist', 'title', 'release-event', /*'format', */'edition-info', 'discs']
							.forEach((className, index) => { tr.cells[index].className = className });
						if (result.type == 'album') tr.style.fontStyle = 'italic';
						tbody.append(tr);
					}

					if (results.length <= 0) return Promise.reject('Nothing found');
					const [tr, td, table, thead, tbody] = createElements('tr', 'td', 'table', 'div', 'tbody');
					[tr.className, td.colSpan, thead.innerHTML, thead.style, thead.style.minHeight] =
						['edition-search-results', 6, '[<b>AllMusic</b>]', theadStyle, '1em'];
					for (let result of results) if (Array.isArray(result)) result.forEach(addResult); else addResult(result);
					table.append(thead, tbody); td.append(thead, table); tr.append(td);
					addResultsFilter(thead, tbody, 5);
					return tr;
				});
			}, 'Search release on AllMusic');
		}
	}
	torrentDetails.dataset.torrentId = torrentId;
	const useCountryInTitle = GM_getValue('use_country_in_title', true);
	if (edition > 0) torrentDetails.dataset.editionGroup = edition;
	const container = document.createElement('span');
	container.style = 'display: inline-flex; flex-flow: row nowrap; column-gap: 2pt; justify-content: space-around;';
	linkBox.append(' ', container);
	const svgBulletHTML = color => `<svg height="0.8em" style="margin-right: 3pt;" viewBox="0 0 10 10"><circle fill="${color || ''}" cx="5" cy="5" r="5"></circle></svg>`;
	const amOrigin = 'https://www.allmusic.com';

	addLookup(svgCaption('mb_text', 'filter: saturate(30%) brightness(130%);', 'MusicBrainz'), function(evt) {
		function logScoreTest(testFn) {
			if (typeof testFn != 'function') throw new Error('Invalid argument');
			return logScoresCache && Array.isArray(logScoresCache[torrentId]) && logScoresCache[torrentId].some(testFn);
		}

		const target = evt.currentTarget;
		console.assert(target instanceof HTMLElement);
		const torrentId = parseInt(torrentDetails.dataset.torrentId);
		console.assert(torrentId > 0);
		if (evt.altKey) { // alternate lookup by CDDB ID
			if (target.disabled) return; else target.disabled = true;
			getSessionsFromTorrent(torrentId).then(function(sessions) {
				const discIds = sessions.map(getTocAudioEntries).map(tocEntries => tocEntries && getCDDBiD(tocEntries));
				if (!discIds.some(Boolean)) return Promise.reject('No valid ToCs found');
				for (let discId of discIds.filter(Boolean).reverse())
					GM_openInTab([mbOrigin, 'otherlookup', 'freedbid?other-lookup.freedbid=' + discId].join('/'), false);
			}).catch(reason => { [target.textContent, target.style.color] = [reason, 'red'] }).then(() => { target.disabled = false });
		} else if (Boolean(target.dataset.haveResponse)) {
			if ('releaseIds' in target.dataset) for (let id of JSON.parse(target.dataset.releaseIds).reverse())
				GM_openInTab([mbOrigin, 'release', id].join('/'), false);
			else if ((evt.shiftKey || !('discIds' in target.dataset)) && 'tocs' in target.dataset)
				for (let toc of JSON.parse(target.dataset.tocs).reverse())
					GM_openInTab([mbOrigin, 'cdtoc', 'attach?toc=' + toc.join(' ')].join('/'), false);
			else if ('discIds' in target.dataset)
				for (let discId of JSON.parse(target.dataset.discIds).reverse())
					GM_openInTab([mbOrigin, 'cdtoc', discId].join('/'), false);
		} else {
			class AttributeParser {
				#creditType; #linkType; #modifiers = [ ];

				constructor(creditType, linkType) {
					if (!creditType) throw new Error('Invalid argument');
					[this.#creditType, this.#linkType] = [creditType.trim(), linkType];
					const testForModifier = (attribute, rx) => {
						if (!mbAttrIds[attribute] || this.#linkType && !(mbAttrLinkTypes[attribute]
								&& mbAttrLinkTypes[attribute].includes(this.#linkType))) return false;
						if (!(rx instanceof RegExp)) throw new Error('Invalid argument');
						if (!(rx = new RegExp(`\\b(?:${rx.source})(?:[\\s\\-]+|$)`, 'i')).test(this.#creditType)) return false;
						if (!this.#modifiers.includes(mbAttrIds[attribute])) this.#modifiers.push(mbAttrIds[attribute]);
						this.#creditType = this.#creditType.replace(rx, '');
						return true;
					};
					testForModifier('additional', /Additional/);
					testForModifier('assistant', /Assist(?:ant|(?:ed|ance)[\s\-]By)|Asst\./);
					testForModifier('associate', /Associate/);
					testForModifier('co', /Co[\s\-]/);
					testForModifier('executive', /Executive/);
					testForModifier('guest', /(?:Special\s)?Guest|Featuring/);
					testForModifier('pre', /Pre/);
					testForModifier('solo', /Solo(?:ist)?/);
					testForModifier('sub', /Sub/);
					testForModifier('translator', /Translat(?:or|ion|(?:ed|ion)[\s\-]By)/);
				}

				get creditType() { return this.#creditType }
				get modifiers() { return this.#modifiers.map(modifier => ({ id: modifier })) }
				get isModified() { return this.#modifiers.length > 0 }
			};

			function validateURL(url) {
				if (!url) return false;
				const validateURL = url => { try { return new URL(url) } catch(reason) { return false } };
				return validateURL(url) || !/^https?:\/\//i.test(url) && validateURL('https://' + url)
					|| /^\/\//.test(url) && validateURL('https:' + url) || (console.log('Invalid URL discarded:', url), false);
			}
			function isDomainpart(name, url) {
				if (name && url) try {
					const normName = cmpNorm(name.trim());
					return ['hostname'/*, 'pathname'*/].some(prop => cmpNorm(url[prop]).includes(normName));
				} catch(e) { console.warn(e) }
				return false;
			}
			function gidFromResponse({document}) {
				for (let gid of document.body.querySelectorAll('script[type="application/json"]')) try {
					if ((gid = JSON.parse(gid.text).entity) && (gid = mbIdExtractor(gid.gid))) return gid;
				} catch(e) { console.warn(e, gid) }
				return Promise.reject('Incorrect response structure');
			}
			function guessSPA(artist) {
				console.assert(artist instanceof Object);
				if (!(artist instanceof Object)) throw new Error('Invalid argument');
				const namePatterns = {
					[mb.spa.theatre]: /\b(?:Cast)\b/i, [mb.spa.disney]: /\b(?:Disney)\b/i,
					// [mb.spa.data]: /\b(?:)\b/i,
					// [mb.spa.churchChimes]: /\b(?:)\b/i,
					// [mb.spa.languageInstruction]: /\b(?:)\b/i,
				};
				if (artist.name) for (let mbid in namePatterns)
					if (namePatterns[mbid].test(artist.name)) return Promise.resolve(mbid);
				if (artist.anv == 'Company') return Promise.resolve(mb.spa.theatre);
				return Promise.reject('Name does not look like known SPA');
			}
			function getTrackLength(track) {
				if (!track) throw new Error('Invalid argument');
				let trackLength = track.length;
				if (typeof trackLength != 'number' && (trackLength || (trackLength = track.duration))
						&& !isNaN(trackLength = timeStrToTime(trackLength))) trackLength *= 1000;
				return Number.isInteger(trackLength) ? trackLength : NaN;
			}
			function romanToArabic(input) {
				const romans = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
				return Array.from(input.trim().toUpperCase()).reduce((previous, current, index, array) =>
					romans[array[index + 1]] > romans[current] ? previous - romans[current] : previous + romans[current], 0);
			}
			function getEntityFromCache(cacheName, entity, id, param) {
				if (!cacheName || !entity || !id) throw new Error('Invalid argument');
				const result = eval(`
					if (!${cacheName} && '${cacheName}' in sessionStorage) try {
						${cacheName} = JSON.parse(sessionStorage.getItem('${cacheName}'));
					} catch(e) {
						sessionStorage.removeItem('${cacheName}');
						console.warn(e);
					}
					if (!${cacheName}) ${cacheName} = { };
					if (!(entity in ${cacheName})) ${cacheName}[entity] = { };
					if (param) {
						if (!(param in ${cacheName}[entity])) ${cacheName}[entity][param] = { };
						${cacheName}[entity][param][id];
					} else ${cacheName}[entity][id];
				`);
				if (result) return Promise.resolve(result);
			}
			function mbLookupByDiscID(mbTOC, allowTOCLookup = true, anyMedia = false) {
				if (!Array.isArray(mbTOC) || mbTOC.length != mbTOC[1] - mbTOC[0] + 4)
					return Promise.reject('Missing or invalid ToC');
				const discId = mbComputeDiscID(mbTOC), params = { };
				if (allowTOCLookup || !discId) params.toc = mbTOC.join('+');
				if (anyMedia) params['media-format'] = 'all';
				const getReleases = (offset = 0) => mbApiRequest('discid/' + (discId || '-'), Object.assign({
					inc: [
						'release-groups', 'artist-credits', 'labels', 'recordings',
						'artist-rels', 'label-rels', 'series-rels', 'place-rels', 'work-rels', 'url-rels', 'release-rels',
					].join('+'),
					offset: offset,
					limit: 100,
				}, params)).then(function(result) {
					console.log('MusicBrainz lookup by discId/TOC successfull:', discId, '/', params, 'releases:', result.releases, 'offset:', offset);
					if (result.id) console.assert(result.id == discId, 'mbLookupByDiscID ids mismatch', result.id, discId);
					const releases = result.releases || [ ], result2 = {
						discId: discId,
						mbTOC: mbTOC,
						releases: releases,
						attached: Boolean(result.id),
					};
					return result['release-count'] > result['release-offset'] + releases.length ?
						getReleases(result['release-offset'] + releases.length).then(result3 =>
							Object.assign(result2, { releases: result2.releases.concat(result3.releases) })) : result2;
				}).then(result => result.releases.length > 0 ? result : null);
				return getReleases();
			}
			function mbLookupById(entityType, browsingEntityType, mbid, ...inc) {
				if (!entityType || !browsingEntityType || !mbid) throw new Error('Invalid argument');
				[entityType, browsingEntityType] = [entityType.toLowerCase(), browsingEntityType.toLowerCase()];
				if (inc.length <= 0) inc = ['aliases'];
				const loadPage = (offset = 0) => mbApiRequest(entityType, {
					[browsingEntityType]: mbid,
					inc: ['url-rels'].concat(inc).map(inc => inc.toLowerCase()).filter(uniqueValues).join('+'),
					offset: offset, limit: 5000,
				}).then(function(response) {
					if (debugLogging && response[entityType + '-offset'] >= 5000 && response[entityType + '-offset'] % 1000 == 0)
						console.info('mbLookupById offset for %s %s: %d/%d', browsingEntityType, mbid,
							response[entityType + '-offset'], response[entityType + '-count']);
					let results = response[mbEntities(entityType)];
					if (Array.isArray(results)) offset = response[entityType + '-offset'] + results.length; else return [ ];
					results = results.filter(result => !result.video);
					return offset < response[entityType + '-count'] ? loadPage(offset)
						.then(Array.prototype.concat.bind(results)) : results;
				});
				return loadPage();
			}
			function mbGetReleasesAdapter(entity) {
				function getReleases(entity, mbid, params) {
					if (!entity || !mbid) throw new Error('Invalid argument');
					const safeErrorHandler = reason => (console.warn(reason), null);
					const workers = [mbApiRequest(entity + '/' + mbid, { inc: [
						'aliases',
						'release-rels', 'release-group-rels', 'url-rels',
					].join('+') }).then(function({relations}) {
						if (!relations) throw `Assertion failed: relations missing for ${entity} ${mbid}`;
						return relations.filter(relation => ['release_group', 'release'].includes(relation['target-type']))
							.map(relationAdapter).filter(uniqueRelations);
					}).catch(safeErrorHandler)];
					if (params) Array.prototype.unshift.apply(workers, params.map(param =>
						mbLookupById('release', param, mbid, 'aliases', 'release-groups', 'url-rels', 'release-group-level-rels')
							.then(releases => releases.map(release => Object.assign({ targetType: 'release', relationType: param }, release)), safeErrorHandler)));
					return Promise.all(workers).then(results => (results = Array.prototype.concat.apply([ ],
						results.filter(Boolean))).length > 0 ? results : null);
				}

				if (entity) return {
					artist: mbid => getReleases(entity, mbid, ['artist', 'track_artist']),
					label: mbid => getReleases(entity, mbid, [entity]),
					series: mbid => getReleases(entity, mbid),
					place: mbid => getReleases(entity, mbid),
				}[entity]; else throw new Error('Invalid argument');
			}
			const mbGetDiscographyAdapter = entity => function(mbid) {
				const dataCollectors = [mbApiRequest(entity + '/' + mbid, { inc: [
					'recording-rels', 'release-rels', 'release-group-rels', 'work-rels',
					'artist-credits', 'aliases',
				].join('+') }).then(({relations}) => relations.map(relationAdapter).filter(uniqueRelations))];
				if (['artist', 'label'].includes(entity)) dataCollectors.unshift(mbLookupById('release', entity, mbid, 'aliases', 'artist-credits').then(releases => releases.map(release => Object.assign({
					targetType: 'release',
					relationType: entity,
				}, release))));
				if (['artist'].includes(entity)) dataCollectors.unshift(mbLookupById('recording', entity, mbid, 'aliases', 'artist-credits').then(recordings => recordings.map(recording => Object.assign({
					targetType: 'recording',
					relationType: 'track_' + entity,
				}, recording))));
				return Promise.all(dataCollectors.map(safePromiseHandler)).then(flattenResults);
			};
			function similarProfiles(...profiles) {
				if (profiles.length < 2 || !profiles.every(Boolean)) return false;
				profiles = profiles.map(str => toASCII(str).toLowerCase());
				const minLength = Math.min(...profiles.map(profile => profile.length));
				if (minLength > 2 && jaroWinklerSimilarity(...profiles) > 0.9) return true;
				const words = profiles.map(profile => profile.split(/[^\p{L}\w\d]+/u).filter(Boolean));
				if (Math.min.apply(this, words.map(words => words.length)) < 2) return false;
				const sameWords = Math.max.apply(this, words.map(words1 => Math.max.apply(this, words.map(words2 =>
					(words2 === words1 ? 0 : words2.filter(word => words1.includes(word)).length / Math.max(words1.length, words2.length))))));
				return sameWords >= 0.75;
			}
			function sameTitleMapper(entry, title, cmpFn = sameStringValues, normFn = str => str.trim()) {
				const compareTo = root => (root = root.title || root.name) && cmpFn(normFn(root), normFn(title));
				return entry && title && (compareTo(entry) || entry.aliases && entry.aliases.some(compareTo));
			}
			function seedTitleNorm(title, formData) {
				if (!title) return title;
				const rxBonus = /\b(?:bonus(?:\s+tracks?)?|extra tracks?)\b/.source;
				title = [
					[new RegExp('\\s+\\(' + rxBonus + '\\)$', 'i'), ''],
					[new RegExp('\\s+\\[' + rxBonus + '\\]$', 'i'), ''],
				].reduce((title, subst) => title.replace(...subst), title);
				// if (formData && formData.getAll('type').includes('Live') && ![
				// 	'\\s+\\(' + phrases.live + '[^\\(\\)]*\\)$',
				// 	'\\s+\\[' + phrases.live + '[^\\[\\]]*\\]$',
				// 	'\\s+-\\s+' + phrases.live + '$',
				// ].some(rx => new RegExp(rx, 'i').test(title))) title += ' (live)';
				return title;
			}
			function getLinkType(linkTypeId) {
				if (!(linkTypeId > 0)) throw new Error('Invalid argument');
				const level = findRelationLevel(linkTypeId);
				console.assert(level, linkTypeId);
				if (!level) return;
				const entity = Object.keys(mbRelationsIndex[level])
					.find(entity => linkTypeId in mbRelationsIndex[level][entity]);
				console.assert(entity, level, linkTypeId);
				return mbRelationsIndex[level][entity][linkTypeId];
			}
			function getLinkTypeId(level, entity, type) {
				if (!type || !(level in mbRelationsIndex) || !(entity in mbRelationsIndex[level])) return;
				const findTypeId = type => Object.keys(mbRelationsIndex[level][entity])
					.find(linkTypeId => mbRelationsIndex[level][entity][linkTypeId] == type);
				if (type = findTypeId(type) || type in mbRelationsAliases
						&& findTypeId(mbRelationsAliases[type])) return parseInt(type);
			}
			function mbAttributesValidator(relation) {
				if (!(relation instanceof Object) || !Array.isArray(relation.attributes)) return null;
				const attributes = relation.attributes.map(attribute => attribute.id).filter(uniqueValues).filter(function(attributeId) {
					const linkTypeIds = {
						additional: [18, 19, 20, 22, 24, 26, 27, 28, 29, 30, 31, 36, 37, 38, 40, 41, 42, 44, 45, 46, 47, 49, 51, 53, 54, 55, 56, 57, 60, 63, 69, 102, 103, 123, 125, 128, 130, 132, 133, 136, 137, 138, 140, 141, 143, 144, 146, 148, 149, 150, 151, 152, 153, 154, 156, 158, 164, 165, 167, 168, 169, 231, 282, 293, 294, 295, 296, 297, 298, 300, 693, 694, 695, 696, 697, 698, 699, 726, 727, 751, 756, 757, 758, 809, 810, 812, 813, 814, 815, 819, 820, 821, 822, 824, 825, 826, 827, 828, 829, 830, 831, 863, 864, 865, 866, 871, 872, 873, 874, 875, 876, 877, 878, 879, 880, 883, 884, 885, 886, 927, 928, 963, 964, 966, 993, 1084, 1170, 1171, 1172, 1173, 1174, 1175, 1179, 1181, 1182, 1231, 1232, 1233, 1234, 1241, 1242, 1243, 1244, 1246, 1247, 1249, 1250, 1251],
						assistant: [18, 26, 28, 29, 30, 31, 36, 37, 38, 42, 46, 47, 53, 128, 132, 133, 136, 138, 140, 141, 143, 144, 151, 152, 153, 305, 726, 727, 856, 928, 962, 1084, 1165, 1179, 1185, 1186, 1187, 1230, 1233, 1242],
						associate: [26, 28, 29, 30, 31, 36, 37, 38, 41, 42, 128, 132, 133, 136, 138, 140, 141, 143, 144, 158, 282, 293, 294, 295, 296, 297, 298, 726, 727, 1084, 1179],
						co: [26, 28, 29, 30, 31, 36, 38, 41, 42, 128, 133, 136, 138, 140, 141, 143, 144, 158, 282, 293, 294, 295, 296, 297, 298, 726, 727, 950, 951, 1084, 1179],
						guest: [44, 51, 60, 148, 149, 156, 305, 759, 760],
						instrument: [26, 28, 29, 30, 31, 36, 37, 38, 41, 44, 46, 49, 69, 103, 105, 128, 132, 133, 138, 140, 141, 143, 144, 148, 151, 154, 158, 231, 282, 693, 694, 695, 696, 698, 699, 726, 727, 757, 758, 798, 799, 800, 812, 813, 814, 815, 819, 820, 821, 822, 824, 825, 826, 827, 828, 829, 830, 831, 847, 863, 864, 865, 866, 885, 886, 923, 924, 986, 987, 1084],
						pre: [42, 697, 756],
						solo: [44, 51, 60, 148, 149, 156],
						sub: [32, 161, 208, 362],
						task: [20, 25, 26, 28, 30, 62, 125, 129, 138, 141, 143, 162, 701, 928, 993, 998, 999, 1084, 1231, 1241, 1242, 1243, 1244],
						translator: [24],
						vocal: [26, 28, 29, 30, 31, 36, 38, 46, 49, 60, 69, 103, 107, 128, 133, 138, 140, 141, 143, 144, 149, 151, 154, 231, 294, 296, 298, 693, 694, 695, 696, 698, 699, 726, 727, 757, 758, 798, 799, 800, 812, 813, 814, 815, 819, 820, 821, 822, 824, 825, 826, 827, 828, 829, 830, 831, 863, 864, 865, 866, 885, 886, 1084],
					}[Object.keys(mbAttrIds).find(attributeName => mbAttrIds[attributeName] == attributeId)];
					return !linkTypeIds || linkTypeIds.includes(relation.linkTypeId);
				});
				return attributes.length > 0 ? attributes.map(function(attributeId) {
					const attribute = { id: attributeId };
					const attributes = relation.attributes.filter(attribute => attribute.id == attributeId);
					for (let prop of ['value', 'creditedAs']) {
						const values = attributes.map(attribute => attribute[prop]).filter(uniqueValues);
						if (values.length > 0) attribute[prop] = values.join(' / ');
					}
					return attribute;
				}) : null;
			}
			function instrumentResolver(creditType) {
				if (!creditType) return Promise.reject('Credit type is missing');
				const ap = new AttributeParser(creditType = creditType.trim(), 'instrument');
				if (!ap.creditType) return Promise.reject('Not an instrument');
				if ([
					'Programming', 'Music', 'Soundtrack', 'Score', 'Visual', 'Original Design', 'DJ', 'Text',
					'Communication', 'Digital', 'Production', 'Tape', 'CD', 'Computer', 'Live', 'Vocal', 'Performed By',
					'Preparations', 'All Other Instruments', 'Video', 'Label', 'Preparations', 'Video', 'Originally Produced',
					'Uk', 'Musician', 'All Other', //'Sample',
				].some(ct => ct.toLowerCase() == ap.creditType.toLowerCase())) return Promise.reject('Explicitly not an instrument');
				const creditedAs = caselessProxy({
					'Guitars': 'guitar', 'Twelve-String Guitar': '12 string guitar',
					'Keyboards': 'keyboard', 'Synth': 'synthesizer', 'Electronics': 'electronic instruments',
					'Drums': 'drums (drum set)', 'Drum Programming': 'drum machine',
					'Handbells': 'handbell', 'Flutes': 'flute', 'Horns': 'horn',
					'Sax (Alto)': 'alto saxophone', 'Sax (Baritone)': 'baritone saxophone',
				})[ap.creditType] || ap.creditType, _creditType = caselessProxy({
					'Lead Guitar': 'guitar', 'Rhythm Guitar': 'guitar', 'Cigar Box Guitar': 'guitar', 'Fretless Guitar': 'guitar', 'Lute Guitar': 'guitar', 'Requinto Guitar': 'guitar', 'Selmer-Maccaferri Guitar': 'guitar', 'Semistrunnaya Gitara': 'guitar',
					'7-string Acoustic Guitar': 'acoustic guitar', '12-String Acoustic Guitar': '12 string guitar', 'Semi-Acoustic Guitar': 'guitar',
					'7-string Electric Guitar': 'electric guitar', '8-string Bass Guitar': 'bass guitar', 'Piccolo Bass Guitar': 'bass guitar',
					'6-String Bass': 'bass', '12-String Bass': 'bass', 'Acoustic Piccolo Bass': 'bass', 'Arco Bass': 'bass', 'Brass Bass': 'bass',
					'5-String Banjo': 'banjo', '6-String Banjo': 'banjo', 'Cello Banjo': 'banjo', 'Open-Back Banjo': 'banjo', 'Piccolo Banjo': 'banjo', 'Plectrum Banjo': 'banjo', 'Resonator Banjo': 'banjo',
					'Five-String Violin': 'violin', 'Five-String Viola': 'viola', 'Viola Braguesa': 'viola', 'Viola Kontra': 'viola', 'Viola Nordestina': 'Viola', 'Viola da Terra': 'Viola', 'Viola de Cocho': 'viola', 'Violão de sete cordas': 'viola',
					'Bolivian Flute': 'flute', 'Free-reed Flute': 'flute', 'Overtone Flute': 'flute', 'Piccolo Flute': 'flute',
					'C Melody Saxophone': 'saxophone', 'Subcontrabass Saxophone': 'contrabass saxophone',
					'Contrabass Trombone': 'trombone', 'Soprano Trombone': 'trombone',
					'Valve Trumpet': 'trumpet', 'Baritone Clarinet': 'clarinet', 'Bass Tuba': 'tuba', 'Contra-Alto Clarinet': 'alto clarinet', 'Hunting Horn': 'horn',
					'Baby Grand Piano': 'grand piano', 'Concert Grand Piano': 'grand piano', 'Parlour Grand Piano': 'grand piano', 'Player Piano': 'piano',
					'Positive Organ': 'organ', 'Steirische Harmonika': 'harmonica',
					'Electronic Drums': 'drums (drum set)', 'Sequenced Drums': 'drum machine',
				})[creditedAs] || creditedAs;
				if (!mbInstrumentsCache) {
					mbInstrumentsCache = GM_getValue('mb_instruments_cache', { });
					GM_addValueChangeListener('mb_instruments_cache', (name, oldVal, newVal, remote) =>
						{ if (remote) mbInstrumentsCache = newVal });
				}
				const resultAdapter = instrument => [{
					id: instrument.id,
					creditedAs: sameStringValues(creditedAs, instrument.name) ? undefined : creditedAs.replace(...untitleCase),
				}].concat(ap.modifiers);
				const cacheKey = Object.keys(mbInstrumentsCache).find(key => sameStringValues(key, _creditType));
				if (cacheKey) try {
					if (['id', 'name'].every(prop => prop in mbInstrumentsCache[cacheKey]))
						return Promise.resolve(resultAdapter(mbInstrumentsCache[cacheKey]));
				} catch(e) {
					delete mbInstrumentsCache[cacheKey];
					GM_setValue('mb_instruments_cache', mbInstrumentsCache);
				}
				const queryInstrument = creditType => mbApiRequest('instrument', { query: `"${encodeQuotes(creditType)}"` }).then(function(results) {
					if (debugLogging && results.count > 0) console.debug('Lookup results for "%s":', creditType, results.instruments);
					if ((results = results.instruments).length <= 1) return results;
					let filtered = results.filter(instrument => sameStringValues(instrument.name, creditType));
					if (filtered.length <= 0) filtered = results
						.filter(instrument => sameTitleMapper(instrument, creditType));
					if (filtered.length <= 0) filtered = results
						.filter(instrument => similarStringValues(instrument.name, creditType));
					// if (filtered.length <= 0) filtered = results
					// 	.filter(instrument => sameTitleMapper(instrument, creditType, similarStringValues));
					// if (filtered.length <= 0 && /\w+s$/.test(creditType)) filtered = results
					// 	.filter(instrument => sameTitleMapper(instrument, creditType.slice(0, -1)));
					return filtered;
				});
				return queryInstrument(_creditType).then(function(instruments) {
					if (instruments.length > 0) return instruments;
					const allInstruments = GM_getValue('instruments');
					return (allInstruments ? Promise.resolve(allInstruments) : fetchAllInstruments().then(function(allInstruments) {
						if (!allInstruments || allInstruments.length <= 0) return Promise.reject('Assertion failed: no instruments found');
						GM_setValue('instruments', allInstruments);
						return allInstruments;
					})).then(function(allInstruments) {
						if (!allInstruments.includes(ap.creditType))
							return Promise.reject(`Resolved as non instrument (${creditType})`);
						return (/\w+s$/.test(ap.creditType) ? queryInstrument(ap.creditType.slice(0, -1)).then(function(instruments) {
							return instruments.length > 0 ? instruments : Promise.reject('No singular matches');
						}) : Promise.reject('Not plural')).catch(reason => [{
							id: '0a06dd9a-92d6-4891-a699-2b116a3d3f37',
							name: 'other instruments',
						}]);
					});
				}).then(function(instruments) {
					if (instruments.length > 1) console.warn('Ambiguous instrument binding for %s:', creditType, instruments);
					const instrument = { id: instruments[0].id, name: instruments[0].name };
					mbInstrumentsCache[_creditType] = instrument;
					GM_setValue('mb_instruments_cache', mbInstrumentsCache);
					return resultAdapter(instrument);
				});
			}
			function instrumentMapper(attributes, creditType, creditedAs) {
				const relation = { type: 'instrument', attributes: attributes || [ ] };
				if (creditType) {
					if (relation.attributes.length <= 0) relation.attributes.push({
						id: '0a06dd9a-92d6-4891-a699-2b116a3d3f37',
						creditedAs: creditType.replace(...untitleCase),
					});
					relation.creditType = creditType;
				}
				if (/^(?:(?:Special\s)?Guest)\b/i.test(creditedAs)) relation.attributes.push({ id: mbAttrIds.guest });
				else if (/^(?:Solo(?:ist)?)$/i.test(creditedAs)) relation.attributes.push({ id: mbAttrIds.solo });
				else if (/^(?:Additional)\b/i.test(creditedAs)) relation.attributes.push({ id: mbAttrIds.additional });
				else if (creditedAs && relation.attributes.length > 0)
					relation.attributes[0].creditedAs = creditedAs.replace(...untitleCase);
				if (relation.attributes.length <= 0) relation.attributes = null;
				return relation;
			}
			function guessTextRepresentation(formData, literals) {
				if (!formData || typeof formData != 'object' || !literals || typeof literals != 'object') throw new Error('Invalid argument');
				const language = detectLanguage(literals);
				if (language) {
					formData.set('language', language);
					console.log('Guessed language from charset analysis:', language);
				}
				//if (!formData.has('language')) formData.set('language', 'mul');
				const script = detectScript(literals);
				if (script) {
					formData.set('script', script);
					console.log('Guessed script from charset analysis:', script);
				}
				//if (!formData.has('script')) formData.set('script', 'Qaaa');
			}
			function getMediumFingerprint(session) {
				const sessionFingerprint = getSessionFingerprint(session);
				console.assert(sessionFingerprint != null);
				return sessionFingerprint != null ? [
					['Track#', 'Start', 'End', 'Length', 'CRC32', 'ARv1', 'ARv2', 'Peak', 'Pre-gap']
						.map(label => ' ' + label.padStart(8) + ' ').join('│'),
					'─'.repeat(98),
				].concat(sessionFingerprint.map(function(tocEntry) {
					const getTrackDetail = (key, callback) => tocEntry[key] != undefined ? callback(tocEntry[key]) : '';
					const getTrackDigest = key => !logScoreTest(logStatus => 'issues' in logStatus
							&& logStatus.issues.some(RegExp.prototype.test.bind(/\b(?:CRC calculations)\b/i))) ?
						getTrackDetail(key, value => value.toString(16).toUpperCase().padStart(8, '0')) : '<invalid setup>';
					return [
						tocEntry.trackNumber, tocEntry.startSector, tocEntry.endSector, tocEntry.length,
						getTrackDigest('crc32'), getTrackDigest('arv1'), getTrackDigest('arv2'),
						getTrackDetail('peak', value => (value[0] / 1000).toFixed(value[1]).padStart(8)),
						getTrackDetail('preGap', value => [
							(~~(value / 75 / 60)).toString(),
							(~~(value / 75) % 60).toString().padStart(2, '0'),
							(value % 75).toString().padStart(2, '0'),
						].join(':')),
					].map(column => ' ' + column.toString().padStart(8) + ' ').join('│').trimRight();
				})).join('\n') : null;
			}
			function seedFromTorrent(formData, torrent, torrentReference = GM_getValue('insert_upload_reference', false)) {
				function addArtist(artist, index, artists) {
					formData.set(`artist_credit.names.${++artistIndex}.name`, artist.name);
					formData.set(`artist_credit.names.${artistIndex}.artist.name`, artist.name);
					if (index < artists.length - 1) formData.set(`artist_credit.names.${artistIndex}.join_phrase`,
						index < artists.length - 2 ? ', ' : ' & ');
				}

				if (!formData || typeof formData != 'object') throw new Error('Invalid argument');
				if (torrent.group.name) formData.set('name', decodeHTML(torrent.group.name));
				if (torrent.group.releaseType != 21) {
					formData.set('type', ({ 5: 'EP', 9: 'Single' }[torrent.group.releaseType]) || 'Album');
					switch (torrent.group.releaseType) {
						case 3: formData.append('type', 'Soundtrack'); break;
						case 6: case 7: formData.append('type', 'Compilation'); break;
						case 11: /*case 14: */case 18: formData.append('type', 'Live'); break;
						case 13: formData.append('type', 'Remix'); break;
						case 15: formData.append('type', 'Interview'); break;
						case 16: formData.append('type', 'Mixtape/Street'); break;
						case 17: formData.append('type', 'Demo'); break;
						case 19: formData.append('type', 'DJ-mix'); /*formData.append('type', 'Compilation');*/ break;
					}
				}
				let artistIndex = -1;
				if (torrent.group.releaseType == 19 && torrent.group.musicInfo
						&& torrent.group.musicInfo.dj && torrent.group.musicInfo.dj.length > 0)
					torrent.group.musicInfo.dj.forEach(addArtist);
				else if ([7, 19].includes(torrent.group.releaseType))
					formData.set('artist_credit.names.0.mbid', mb.spa.VA);
				else if (torrent.group.musicInfo)
					for (let role of ['dj', 'artists']) if (artistIndex < 0)
						torrent.group.musicInfo[role].forEach(addArtist);
				formData.set('status', [14, 18].includes(torrent.group.releaseType) ? 'bootleg' : 'official');
				if (torrent.torrent.remasterYear) formData.set('events.0.date.year', torrent.torrent.remasterYear);
				let [labels, catNos] = ['RecordLabel', 'CatalogueNumber'].map(prop => (value => value ? decodeHTML(value)
					.split(rxEditionSplitter).map(value => value.trim()).filter(Boolean) : [ ])(torrent.torrent['remaster' + prop]));
				[labels, catNos] = [
					labels.map(label => rxNoLabel.test(label) ? noLabel : label),
					Array.prototype.concat.apply([ ], catNos.map(catNo => rxNoCatno.test(catNo) ? [ ] : catNoMapper(catNo))),
				].map(values => values.filter((s1, n, a) => a.findIndex(s2 => s2.toLowerCase() == s1.toLowerCase()) == n));
				let labelIndex = 0;
				for (let label of labels.length > 0 ? labels : [undefined]) for (let catNo of catNos.length > 0 ? catNos : [undefined]) {
					if (!label && !catNo) continue;
					const prefix = `labels.${labelIndex++}`;
					if (label) if (!rxNoLabel.test(label)) formData.set(`${prefix}.name`, label);
					else formData.set(`${prefix}.mbid`, mb.spl.noLabel);
					if (catNo) formData.set(`${prefix}.catalog_number`, rxNoCatno.test(catNo) ? '[none]' : catNo);
				}
				let barcode = catNos.map(catNo => catNo.replace(/\W+/g, ''));
				barcode = barcode.find(barcode => checkBarcode(barcode, false))
					|| barcode.find(barcode => checkBarcode(barcode, true));
				if (barcode) formData.set('barcode', checkBarcode(barcode, true));
				if (torrent.torrent.remasterTitle) {
					const editionTitle = decodeHTML(torrent.torrent.remasterTitle).split(/\s*[\/\,\|]\s*/)
						.map(t => t.replace(/^(?:CD|Re-?issue|Re-?press)$/i, '').replace(...untitleCase)).filter(Boolean);
					if (editionTitle.length > 0) formData.set('comment', editionTitle.join(' / '));
				}
				if (torrentReference) formData.set('edit_note', ((formData.get('edit_note') || '') + '\nReference upload id: ' +
					document.location.origin + '/torrents.php?torrentid=' + torrent.torrent.id).trimLeft());
			}
			function seedFromTOCs(formData, mbTOCs, addMediaFingerprints = GM_getValue('mb_seed_with_fingerprints', false)) {
				if (!(formData instanceof Object)) throw new Error('Invalid argument');
				if (mbTOCs != null) {
					mbTOCs.forEach(function(mbTOC, discIndex) {
						formData.set(`mediums.${discIndex}.format`, 'CD');
						if (mbTOC != null) formData.set(`mediums.${discIndex}.toc`, mbTOC.join(' '));
					});
					formData.set('edit_note', ((formData.get('edit_note') || '') +
						'\nSeeded from EAC/XLD ripping ' + (mbTOCs.length > 1 ? 'logs' : 'log')).trimLeft());
				}
				return addMediaFingerprints ? getSessionsFromTorrent(torrentId).then(function(sessions) {
					const fingerprints = sessions.map(getMediumFingerprint).filter(Boolean);
					if (fingerprints.length > 0) formData.set('edit_note', ((formData.get('edit_note') || '') +
						`\n\n'''${fingerprints.length > 1 ? 'Media fingerprints' : 'Medium fingerprint'}:'''\n\n` +
						fingerprints.join('\n\n') + '\n').trimLeft());
				}, console.warn).then(() => formData) : Promise.resolve(formData);
			}
			function seedFromDiscogs(formData, discogsId, params, cdLengths) {
				if (formData instanceof Object && discogsId > 0) params = Object.assign({
					basicMetadata: true, tracklist: true, groupTracks: true, alignWithTOCs: false,
					recordingsLookup: 1, lookupArtistsByRecording: true, rgLookup: true,
					searchSize: GM_getValue('mbid_search_size', 30),
					maxFetchDiscogsReleases: GM_getValue('max_fetch_discogs_releases', 64),
					languageIdentifier: GM_getValue('external_language_id', true),
					composeAnnotation: GM_getValue('compose_annotation', true),
					openInconsistent: GM_getValue('open_inconsistent', true),
					assignUncertain: GM_getValue('assign_uncertain', true),
					createMissingEntities: GM_getValue('mb_create_entities', 2),
					openCreatedEntries: GM_getValue('mb_open_new_entries', 2),
					createAliases: GM_getValue('mb_create_aliases', 2),
					extendedMetadata: false, rgRelations: false, releaseRelations: false,
					recordingRelations: false, workRelations: false, preferTrackRelations: 1,
				}, params); else throw new Error('Invalid argument');
				return dcApiRequest('releases/' + discogsId).then(function(release) {
					function reactRequest(entity, discogsId, operationName, variables) {
						if (!entity || !(discogsId > 0) || !operationName) throw new Error('Invalid argument');
						const url = [dcOrigin, entity, discogsId].join('/');
						const reactRequest = (refreshCache = false) => (function() {
							if ('discogsGraphqlHashes' in localStorage) try {
								if (refreshCache) localStorage.removeItem('discogsGraphqlHashes');
								else return Promise.resolve(JSON.parse(localStorage.getItem('discogsGraphqlHashes')));
							} catch(e) { console.warn(e) }
							return GlobalXHR.get(url, { anonymous: true, recoverableErrors: [429] }).then(function({document}) {
								const script = Array.prototype.find.call(document.getElementsByTagName('script'), function(script) {
									if (script.src) try { script = new URL(script.src) } catch(e) { return false } else return false;
									return script.hostname == 'catalog-assets.discogs.com'
										&& /^\/main\.\w+\.js$/i.test(script.pathname);
								});
								return script ? GlobalXHR.get(script.src, { responseType: 'text', anonymous: true, recoverableErrors: [429] })
									: Promise.reject('Unexpected document structure');
							}).then(function({responseText}) {
								const rx = /\bJSON\.parse\('(\{.+?\})'\)/g;
								let sha256Hashes;
								while ((sha256Hashes = rx.exec(responseText)) != null) try {
									if (!(sha256Hashes = JSON.parse(sha256Hashes[1])) instanceof Object) throw 'JSON not parseable';
									if (!('ArtistDiscographyData' in sha256Hashes)) continue;
									localStorage.setItem('discogsGraphqlHashes', JSON.stringify(sha256Hashes));
									refreshCache = true;
									return sha256Hashes;
								} catch(e) { console.warn(e) }
								return Promise.reject('Script pattern was not located');
							});
						})().then(function(sha256Hashes) {
							const requestUrl = new URL('/service/catalog/api/graphql', dcOrigin);
							requestUrl.searchParams.set('operationName', operationName);
							if (variables) requestUrl.searchParams.set('variables', JSON.stringify(variables));
							if (!(sha256Hashes = sha256Hashes[operationName])) throw 'Assertion failed: SHA256 hash was not found';
							requestUrl.searchParams.set('extensions',
								JSON.stringify({ persistedQuery: { sha256Hash: sha256Hashes, version: 1 } }));
							return GlobalXHR.get(requestUrl, { responseType: 'json', anonymous: true, headers: { Referer: url }, recoverableErrors: [429] });
						}).then(({json}) => json.data || Promise.reject(json.errors || 'Invalid response format')).catch(function(reason) {
							if (!refreshCache) return reactRequest(true);
							console.warn('React request error:', reason);
							return Promise.reject(reason);
						});
						return reactRequest();
					}
					function uniqueRealName(name, realName) {
						if (!realName) return false; else if (!name) return true;
						[name, realName] = [name, realName].map(name => name.split(/[^\w\p{L}\w\d]+/u).filter(Boolean).map(cmpNorm));
						return name.some(word => !realName.includes(word)) || realName.some(word => !name.includes(word));
					}
					function addLookupEntry(entity, entry, context) {
						console.assert(entity && entry);
						if (!entity || !entry) throw new Error('Invalid argument');
						console.assert(entry.id > 0 && entry.name, entry);
						if (!(entry.id > 0) || !entry.name) return;
						if (!(entity in lookupIndexes)) lookupIndexes[entity] = { };
						if (!(entry.id in lookupIndexes[entity])) {
							lookupIndexes[entity][entry.id] = { name: entry.name, contexts: [ ] };
							if (entity == 'artist') lookupIndexes[entity][entry.id].anv = entry.anv;
						}
						if (context && !lookupIndexes[entity][entry.id].contexts.includes(context))
							lookupIndexes[entity][entry.id].contexts.push(context);
					}
					function addLookupHint(entity, discogsId, pathname) {
						if (!entity || !(discogsId > 0) || !pathname) return;
						if (!(entity in lookupHints)) lookupHints[entity] = { };
						if (!(discogsId in lookupHints)) lookupHints[entity][discogsId] = [ ];
						if (!lookupHints[entity][discogsId].includes(pathname = pathname.replace(/^\/+/, '')))
							lookupHints[entity][discogsId].push(pathname);
					}
					function getRoles(artist) {
						if (!artist) return [ ]; else if (artist.roles) return artist.roles;
						const placeholder = `{${crypto.randomUUID()}}`, replacer = (str, s, r) =>
							(str || '').replace(/\[([^\[\]]+)\]/g, (...matches) => `[${matches[1].replaceAll(s, r)}]`);
						return replacer(artist.role, ',', placeholder).split(',')
							.map(role => replacer(role.trim(), placeholder, ',')).filter(Boolean);
					}
					function addCredit(entity, context, entry, modifiers) {
						if (!entity || !context || !entry) throw new Error('Invalid argument');
						if (!(entity in credits)) credits[entity] = { };
						if (!(context in credits[entity])) credits[entity][context] = [ ];
						if (credits[entity][context].some(_entry => _entry.id == entry.id)) return;
						const _entry = { id: entry.id, name: stripDiscogsNameVersion(entry.name) };
						if (entity == 'artist') _entry.anv = entry.anv;
						if (modifiers && modifiers.length > 0) _entry.modifiers = modifiers;
						credits[entity][context].push(_entry);
					}
					function addCredits(root) {
						if (root.extraartists) for (let extraArtist of root.extraartists) {
							const roles = getRoles(extraArtist);
							const modifiers = ['Soloist', 'Guest'].filter(role => roles.includes(role));
							const realRoles = roles.filter(role => !modifiers.includes(role));
							if (modifiers.length > 0 && realRoles.length > 0) for (let role of realRoles)
								addCredit('artist', role, extraArtist, modifiers);
							else for (let role of roles) addCredit('artist', role, extraArtist);
						}
					}
					function resolvePerformers(...roots) {
						const root = roots.reverse().find(root => Array.isArray(root.artists) && root.artists.length > 0);
						if (!root) return; else roots = roots.reverse().slice(roots.indexOf(root));
						const isFeaturing = new RegExp('^' + phrases.feat, 'i');
						const hasFeaturing = root.artists.some(artist => isFeaturing.test(artist.join));
						roots = roots.filter(root => root.extraartists).map(root2 => root2.extraartists.filter(extraArtist =>
							!root.artists.some(artist => artist.id == extraArtist.id) && getRoles(extraArtist)
								.some(RegExp.prototype.test.bind(isFeaturing))));
						return (roots = Array.prototype.concat.apply([ ], roots)).length > 0 ? root.artists.map((artist, index, artists) => ({
							id: artist.id,
							name: artist.name, anv: artist.anv,
							join: [
								artist.join && !/^\s+$/.test(artist.join) ? artist.join : ',',
								artist.join && !/^[\,\s]+$/.test(artist.join) ? artist.join : '&',
								hasFeaturing ? '&' : 'feat.',
							][Math.sign(index + 2 - artists.length) + 1],
						})).concat(roots.map((featArtist, index, featArtists) => ({
							id: featArtist.id,
							name: featArtist.name, anv: featArtist.anv,
							join: [',', '&', ''][Math.sign(index + 2 - featArtists.length) + 1],
						}))) : root.artists.map((artist, index, artists) => ({
							id: artist.id,
							name: artist.name, anv: artist.anv,
							join: [
								artist.join && !/^\s+$/.test(artist.join) ? artist.join : ',',
								artist.join && !/^[\,\s]+$/.test(artist.join) ? artist.join : '&',
								artist.join,
							][Math.sign(index + 2 - artists.length) + 1],
						}));
					}
					function samePerformers(...performers /* resolved */) {
						if (performers.length <= 0) return false;
						const performersCount = performers.filter(Boolean).length;
						if (performersCount <= 0) return true; else if (performersCount < performers.length) return false;
						performers = performers.map(performers => performers.filter(Boolean));
						console.assert(performers.every(Array.isArray), performers);
						return performers.every(performers1 => performers.every(function(performers2) {
							const samePerformers = (performers1, performers2) =>
								performers1.every(performer1 => performers2.some(performer2 => performer2.id == performer1.id));
							return samePerformers(performers1, performers2) && samePerformers(performers2, performers1);
						}));
					}
					function mergeTracksPerformers(performers) { // only for grouping
						if (!Array.isArray(performers) || (performers = performers.filter(Boolean)).length <= 0) return;
						performers = performers.filter((artists1, artistsIndex, allArtists) =>
							allArtists.findIndex(artists2 => samePerformers(artists2, artists1)) == artistsIndex);
						console.assert(performers.length > 0);
						performers = performers.map((artists, artistsIndex, allArtists) => artists.filter(Boolean).map((artist, artistIndex, artists) => ({
							id: artist.id,
							name: artist.name, anv: artist.anv,
							join: artistIndex < artists.length - 1 ? artist.join || (artistIndex < artists.length - 2 ? ',' : '&')
								: artistsIndex < allArtists.length - 1 ? '/' : '' /*artist.join*/,
						})));
						if ((performers = Array.prototype.concat.apply([ ], performers)).length > 0) return performers;
					}
					function mergeExtraArtists(...extraArtists) {
						const mea = { };
						for (let eas of extraArtists) if (Array.isArray(eas)) for (let ea of eas.filter(Boolean)) {
							if (!(ea.id in mea)) mea[ea.id] = { id: ea.id, name: ea.name, anv: ea.anv, roles: [ ] };
							for (let role of getRoles(ea)) if (!mea[ea.id].roles.includes(role)) mea[ea.id].roles.push(role);
						}
						if (Object.keys(mea).length > 0) return Object.values(mea);
					}
					function resolveExtraArtists(roots, roleTrackEvaluator = function(role) {
						let linkType = relationsMapping.artist[role = role.replace(/\s+\[[^\[\]]+\]$/, '')];
						let ap = new AttributeParser(role, linkType);
						if (!linkType && ap.isModified) linkType = relationsMapping.artist[ap.creditType];
						return !linkType || !findRelationLevels('artist', linkType).some(isReleaseLevel);
					}) {
						console.assert(Array.isArray(roots) && roots.length > 0, roots);
						console.assert(typeof roleTrackEvaluator == 'function', roleTrackEvaluator);
						return mergeExtraArtists(...roots.map(root => root && root?.extraartists?.map(function(extraArtist) {
							let roles = getRoles(extraArtist);
							if (root == release) if (extraArtist.tracks) {
								const tracks = extraArtist.tracks.split(/[\,\;]+/).map(track => track.trim());
								if (!roots.some(root => root.positions && root.positions.filter(Boolean).some(position => tracks.some(function(track) {
									function isInRange(track) {
										let range = [
											/^([^\s\-]+)(?:\s*(?:to|[\‐\-\−\—\–])\s*)([^\s\-]+)$/i,
											/^(\S+)(?:\s+(?:to|[\‐\-\−\—\–])\s+)(\S+)$/i,
										].map(rx => rx.exec(track)).find(Boolean);
										if (range) range = [position].concat(range.slice(1)).map(trackPosMapper); else return false;
										return range[0].length == range[1].length && range[0].localeCompare(range[1]) >= 0
											&& range[0].length == range[2].length && range[0].localeCompare(range[2]) <= 0;
									}

									if (track.toLowerCase() == 'all') return true;
									if (trackPosMapper(position) == trackPosMapper(track)) return true;
									return isInRange(track)/* || isInRange(track.replace(/^[A-Z]+/, ''))*/;
								})))) return;
							} else if (!params.preferTrackRelations) roles = roles.filter(roleTrackEvaluator);
							if (roles.length > 0) return {
								id: extraArtist.id,
								name: extraArtist.name, anv: extraArtist.anv,
								roles: roles,
							};
						})?.filter(Boolean)).filter(Boolean));
					}
					function seedArtists(resolvedPerformers, prefix) {
						if (Array.isArray(resolvedPerformers)) resolvedPerformers.forEach(function(artist, index, artists) {
							let artistPrefix = 'artist_credit.names.' + index;
							if (prefix) artistPrefix = prefix + artistPrefix;
							formData.set(`${artistPrefix}.artist.name`, capitalizeName(stripDiscogsNameVersion(artist.name)));
							const creditedAs = creditedName(artist);
							if (!noCreditAsArtists.includes(artist.id)) formData.set(`${artistPrefix}.name`, creditedAs);
							const joinPhrase = [
								artist.join && !/^\s+$/.test(artist.join) ? artist.join : ',',
								artist.join && !/^[\,\s]+$/.test(artist.join) ? artist.join : '&',
								artist.join,
							][Math.sign(index + 2 - artists.length) + 1];
							if (joinPhrase) formData.set(`${artistPrefix}.join_phrase`, fmtJoinPhrase(joinPhrase));
							//else formData.delete(`${artistPrefix}.join_phrase`);
							if (params.basicMetadata) addLookupEntry('artist', artist, artistPrefix);
						});
					}
					function totalTime(tracks) {
						const totalTime = tracks.reduce((totalTime, track) => totalTime + timeStrToTime(track.duration), 0);
						return totalTime >= 0 ? [
							Math.floor(totalTime / 60).toString(),
							(totalTime % 60).toString().padStart(2, '0'),
						].join(':') : undefined;
					}
					function parseTracklist(trackParser = rxParsingMethods[0], collapseSubtracks = false) {
						if (!(trackParser instanceof RegExp)) throw new Error('Invalid argument');
						if (!release.tracklist) return null;
						const formatParsers = {
							'Blu-ray': /^(?:B(?:R?D|R))$/,
							'Vinyl': /^(?:LP)$/,
							'Digital Media': /^(FLAC|MP[234]|AAC|M4[AB]|OGG|Vorbis|Opus|WAV|AIFF)$/i,
						};
						const romanNumbers = release.tracklist.filter(track => ['track', 'index'].includes(track.type_)
							&& track.position).every(track => romanToArabic(track.position) > 0);
						let media, lastMediumId, heading;
						(function addTracks(tracklist, parentTrack) {
							if (Array.isArray(tracklist)) tracklist.forEach(function(track) {
								if (track.type_ == 'index' && !collapseSubtracks) return addTracks(track.sub_tracks, track);
								if (track.type_ == 'heading') return heading = track.title && track.title != '-' && [
									[/:+$/, ''],
								].reduce((heading, subst) => heading.replace(...subst), track.title) || undefined;
								const parsedTrack = track.position ? trackParser.exec(track.position.trim()) : null;
								let [mediumFormat, mediumId, number] = parsedTrack != null ? parsedTrack.slice(1)
									: [undefined, undefined, track.position ? track.position.trim() : undefined];
								if (!mediumFormat && !romanNumbers && /^[A-Z]\d*$/.test(number)) mediumFormat = 'LP';
								mediumId = (mediumFormat || '') + (mediumId || '');
								if (!media || lastMediumId == undefined || !parentTrack && mediumId !== lastMediumId) {
									lastMediumId = mediumId;
									let f = null;
									for (let format in formatParsers) {
										if ((f = formatParsers[format].exec(mediumFormat)) == null) continue;
										mediumFormat = format;
										break;
									}
									if (mediumFormat == 'CD') mediumFormat = defaultFormat;
									if (!media) media = [ ];
									media.push({
										format: mediumFormat || defaultFormat,
										title: f != null && f[1] || undefined,
										tracks: [ ],
									});
								}
								console.assert(track.type_ != 'index' || !parentTrack);
								const _track = { heading: heading, number: number, duration: track.duration || undefined };
								const positions = (...roots) => roots.filter(Boolean).map(root => root.position).filter(Boolean);
								if (track.type_ == 'index' && track.sub_tracks && track.sub_tracks.length > 0) {
									_track.title = track.sub_tracks.map(subtrack => subtrack.title).filter(Boolean)
										.map(title => title.trim()).filter(Boolean).join(' / ');
									_track.artists = mergeTracksPerformers(track.sub_tracks
										.map(subtrack => resolvePerformers(track, subtrack)));
									_track.extraArtists = mergeExtraArtists(track.extraartists,
										...track.sub_tracks.map(subtrack => subtrack.extraartists));
									if (track.sub_tracks) _track.positions = positions(track, ...track.sub_tracks);
									if (!_track.duration) _track.duration = totalTime(track.sub_tracks);
									_track.parentTitle = track?.title?.trim();
								} else {
									_track.title = track?.title?.trim();
									if (parentTrack) {
										_track.artists = resolvePerformers(parentTrack, track);
										_track.extraartists = mergeExtraArtists(parentTrack.extraartists, track.extraartists);
										_track.parentTitle = parentTrack?.title?.trim();
									} else {
										_track.artists = track.artists;
										_track.extraartists = track.extraartists;
									}
									_track.positions = positions(parentTrack, track);
								}
								media[media.length - 1].tracks.push(_track);
							});
						})(release.tracklist);
						return media;
					}
					function groupTracks(media, rxExtractor) {
						if (layoutMatch(media = media.map(function tracksConsolidation(medium, index) {
							const tracks = { };
							for (let track of medium.tracks) {
								if (rxExtractor instanceof RegExp) {
									var trackNum = rxExtractor.exec(track.number);
									console.assert(trackNum != null, track.number);
									trackNum = trackNum != null ? trackNum[0] : track.number;
								} else trackNum = isCD(medium) ? index + 1 : track.number;
								if (!(trackNum in tracks)) tracks[trackNum] = [ ];
								tracks[trackNum].push(track);
							}
							medium.tracks = Object.keys(tracks).sort(function(...positions) {
								positions = positions.map(trackPosMapper);
								return positions[0].localeCompare(positions[1]);
							}).map(function(trackNo) {
								const consolidateProperty = prop => tracks[trackNo].map(track => track[prop])
									.filter((value, index, values) => value && values.indexOf(value) == index).join(' / ') || undefined;
								return {
									number: trackNo,
									positions: Array.prototype.concat.apply([ ],
										tracks[trackNo].map(track => track.positions).filter(Boolean)),
									heading: consolidateProperty('heading'),
									parentTitle: consolidateProperty('parentTitle'),
									title: tracks[trackNo].map(track => track.title.trim()).filter(Boolean).join(' / '),
									artists: mergeTracksPerformers(tracks[trackNo].map(track => resolvePerformers(release, track))),
									extraartists: mergeExtraArtists(...tracks[trackNo].map(track => track.extraartists)),
									length: totalTime(tracks[trackNo]),
								};
							});
							return medium;
						})) > 0) return media;
					}
					function layoutMatch(media) {
						if (!media) return -Infinity; else if (!Array.isArray(cdLengths) || cdLengths.length <= 0) return 0;
						if ((media = media.filter(isCD)).length != cdLengths.length) return -2;
						if (media.every((medium, mediumIndex) => medium.tracks.length == cdLengths[mediumIndex])) return 3;
						if (media.every((medium, mediumIndex) => medium.tracks.length == cdLengths[mediumIndex]
								|| medium.format == 'Enhanced CD' && medium.tracks.length > cdLengths[mediumIndex])) return 2;
						if (cdLengths.length > 1) {
							const index = { };
							for (let key of cdLengths) if (!(key in index))
								index[key] = media.filter(medium => medium.tracks.length == key).length;
							if (Object.keys(index).every(key1 => index[key1] == cdLengths.filter(key2 => key2 == parseInt(key1)).length)) {
								notify('Tracks layout matched to reordered logs', 'layoutmatched');
								return 1;
							}
						}
						return -1;
					}
					function addUrlRef(url, level, type) {
						const linkTypeId = getLinkTypeId(level, 'url', type);
						if (linkTypeId > 0) urls.push({ url: url, link_type: linkTypeId });
							else console.warn('Undetermined link type id for', url, level, type);
					}
					function searchQueryBuilder(entity, entry, wideSearch = true) {
						if (!entry || !entry.name) return;
						const fields = wideSearch ? { [entity]: 2, alias: 1, comment: 0.5 } : undefined, query = { };
						if (fields && ['artist', 'label'].includes(entity)) fields.sortname = 1;
						const addName = (expr, priority = 1) => {
							if (expr) if (fields) for (let field in fields) {
								if (!(field in query)) query[field] = { };
								query[field][expr] = priority;
							} else query[expr] = priority;
						};
						const name = stripDiscogsNameVersion(entry.name);
						addName(name);
						if (wideSearch) {
							if (entity == 'artist' && entry.anv && entry.anv.toLowerCase() != name.toLowerCase())
								addName(entry.anv, 0.5);
							if (['label', 'place'].includes(entity)) {
								const bareName = labelMapper(name.replace(...rxBareLabel));
								if (bareName != name) addName(bareName, 0.75);
							}
						}
						const orPhrases = (term, phraseMapper) => {
							const phrases = { [wideSearch ? '(' + encodeLuceneTerm(term) + ')' : '"' + encodeQuotes(term) + '"']: 1 };
							const words = term.split(/\s+/);
							if (words.length > 1 && wideSearch)
								phrases['(' + words.map(encodeLuceneTerm).join(' AND ') + ')'] = 0.25;
							return Object.entries(phrases).map(entry => phraseMapper(...entry)).filter(Boolean).join(' OR ');
						};
						return Object.keys(query).map(fields ? field => Object.keys(query[field]).map(function(term) {
							const priority = fields[field] * query[field][term];
							if (priority > 0) return orPhrases(term, function(phrase, pp) {
								phrase = field + ':' + phrase;
								if ((pp *= priority) > 0) return pp != 1 ? `${phrase}^${pp}` : phrase;
							});
						}).filter(Boolean).join(' OR ') : function(term) {
							if (query[term] > 0) return orPhrases(term, (phrase, pp) =>
								{ if ((pp *= query[term]) > 0) return pp != 1 ? `${phrase}^${pp}` : phrase });
						}).filter(Boolean).join(' OR ');
					}
					function processFormats(mappers, applyFn) {
						if (!mappers || typeof mappers != 'object') throw new Error('Invalid argument');
						const regExp = key => new RegExp('^(?:' + key + ')$', 'i');
						if (typeof applyFn == 'function') for (let key in mappers) if (mappers[key] != undefined
								&& descriptors.some(RegExp.prototype.test.bind(regExp(key)))) applyFn(mappers[key]);
						descriptors = descriptors.filter(descriptor =>
							!Object.keys(mappers).some(key => regExp(key).test(descriptor)));
					}
					function openInconsistent(entity, discogsId, mbids, mbSubpage, _params) {
						if (!entity) throw new Error('Entity is required');
						if (!((discogsId = parseInt(discogsId)) > 0)) throw new Error('discogsId is required');
						if (!Array.isArray(mbids)) throw new Error('MBIDS are required');
						console.assert(mbids.length > 1, mbids);
						if (!params.openInconsistent || entity in openedIds && openedIds[entity].has(discogsId)) return;
						if (!(entity in openedIds)) openedIds[entity] = new Set;
						openedIds[entity].add(discogsId);
						Array.from(mbids).reverse().forEach(function(mbid) {
							let url = [mbOrigin, entity, mbid, mbSubpage].filter(Boolean).join('/');
							if (_params instanceof Object) url += '?' + new URLSearchParams(_params).toString();
							GM_openInTab(url, true);
						});
						GM_openInTab([dcOrigin, discogsEntity(entity), discogsId].join('/') + '#discography_wrapper', true);
					}
					function initBindingsCache() {
						if (discogsBindingsCache instanceof Object) return;
						if (!(discogsBindingsCache = GM_getValue('discogs_to_mb_bindings'))) discogsBindingsCache = { };
						else console.info('Discogs to MB bindings cache loaded:', Object.keys(discogsBindingsCache)
							.map(key => `${Object.keys(discogsBindingsCache[key]).length} ${mbEntities(key)}`).join(', '));
						GM_addValueChangeListener('discogs_to_mb_bindings',
							(name, oldVal, newVal, remote) => { discogsBindingsCache = newVal });
						// if (debugLogging) console.debug('Cache synced with remote window, key sizes:',
						// 	Object.keys(discogsBindingsCache).map(entity => entity + ': ' + Object.keys(discogsBindingsCache[entity]).length).join(', '));
						const defaults = {
							artist: {
								194: mb.spa.VA, 355: mb.spa.unknown, 118760: mb.spa.noArtist, 598667: mb.spa.traditional,
								967691: mb.spa.anonymous, 3538550: mb.spa.dialogue, 5942241: mb.spa.noArtist, // nature sounds => [no artist]
								45123: ['719db6b1-0d91-458c-8d18-875ec44105bf', '898b645e-eed2-490a-8ce2-0e7a4d2d5bc8'], // David Sylvian & Robert Fripp
								142502: ['2882ffa3-dec9-4055-a842-a950728bcb02', '41f5d2cd-672b-460e-8ab6-e29db2f1e088'], // Bacharach & David
								451329: ['4d5447d7-c61c-4120-ba1b-d7f471d385b9', 'b0b33754-a664-43b7-ba00-be0dc4ec2396'], // Lennon-Ono
								604171: ['346448f5-25a0-4f78-bbd6-acc0205f7513', '3fb75d97-5dfd-4e72-9aee-1904aa4268f4'], // Rodgers-Hart
								640665: ['65744963-191a-44ef-a3c7-b693a808a158', '509086c2-9cc8-4e77-89e9-322e34240ffc'], // George & Ira Gershwin
								746605: ['4c857e19-d9bb-460e-b3ec-2d1ea24c3247', '0e21491a-18a5-40d9-a68c-a651a0fda689', 'e7b587f7-e678-47c1-81dd-e7bb7855b0f9'], // Spector, Greenwich & Barry
								777675: ['bee69828-6833-449a-940c-05c3b633faa6', 'b4413e7c-3f49-4911-9844-d9d0379ccd49'], // Stock/Aitken
								779927: ['4d5447d7-c61c-4120-ba1b-d7f471d385b9', 'ba550d0e-adac-4864-b88b-407cab5e76af'], // Lennon-McCartney
								799078: ['136e0d3e-d4ad-4186-9169-1eb865740674', '2b1ec83e-b2b3-4107-a885-b642a3253cc9'], // Earl Lebieg
								845581: ['b5ffc3aa-b868-4b88-905f-d73d51dbe51c', 'f0ed72a3-ae8f-4cf7-b51d-2696a2330230'], // Jagger-Richards
								939545: ['a383f062-e527-4a57-98b0-9205b2f8f171', '8fb64b2e-db8b-4579-ad08-f324ef1bf494'], // Hammerstein-Kern
								941280: ['9a775c6e-9346-4b16-a611-cae1b1c6362f', 'c414371b-3377-43b5-9dc2-2a20254ed520'], // Jimmy McHugh & Dorothy Fields
								1052795: ['8263126b-9b1a-4509-b88c-fd87e4d22773', '6ef12fc1-40f4-41ea-ac52-f487840255bd'], // Clarke/Bell
								1077671: ['8d3f8b43-0d28-4500-900e-a6d92136636f', 'c9b9ec99-b592-4556-aa0b-8825529afd5d'], // Jimmy Van Heusen and Johnny Burke
								1279673: ['fc5aafdf-b715-41b0-8336-0d410d1d66ad', '09a458c9-915c-4ffe-aec1-4ee23b14fbe2'], // Murray-Callander
								1315745: ['364f3cef-442b-4182-ae78-4e7e79683c24', '9b581a9b-3bf0-4d93-b09e-96ccc9387795'], // Hammond-Hazlewood
								1439192: ['f2df411a-b683-43d4-afea-78cd1dd647f1', 'f717fab6-b501-4cc9-91cd-6740dea46511'], // Betty Comden And Adolph Green
								1595974: ['e787de5d-49e2-4b1f-9bde-1fd3a671b971', '9ad119e3-8a03-41a9-9ba8-fa754390b81d'], // Domino & Bartholomew
								1700849: ['6ba2d704-f1e9-456f-a5b3-91826ed83809', '0a4c73fb-13bc-4195-9ca1-e1c7ce9f5694'], // Madara-White
								1728524: ['20f4225f-f50e-4382-8b6e-b18448bc037d', 'abe931fd-bc88-40ee-ba42-f0ef2dc2eba5'], // DJ Marky & S.P.Y.
								1773798: ['a98cd83c-4f9d-4c16-a3f2-3759df41df82', '3ecdd624-0fa0-4dfe-9498-5a4801724d3b'], // Steinberg & Kelly
								1850058: ['318ea4ad-6319-41a0-8382-23cd34f4e33b', '3893ee2e-67db-473e-8757-ad9c0e7282ea'], // Schwartz & Dietz
								2487568: ['eb57fb50-c88b-4610-b974-d3d483ee3438', 'e1b64998-7415-4a8b-a9ff-27996a4d49f2'], // Spike Brothers
								7869237: ['cc9a2d17-35c3-4642-a658-6eab8f5b1aea', '4c567499-3a26-40e3-9471-20feb6c73767'], // Chad Allen and The Guess Who
							},
							label: {
								1818: mb.spl.noLabel, 1687281: mb.spl.unknown,
								750: '49b58bdb-3d74-40c6-956a-4c4b46115c9c', // Virgin
								895: '1ca5ed29-e00b-4ea5-b817-0bcca0e04946', // RCA
								1866: '011d1192-6f65-45bd-85c4-0400dd45693e', // Columbia
								2345: '3730c0ea-3dc2-45c3-ac5c-9d482921ea51', // Warner
								5320: 'f18f3b31-8263-4de3-966a-fda317492d3d', // Decca
								26126: 'c029628b-6633-439e-bcee-ed02e8a338f7', // EMI
								108701: '7c439400-a83c-48bc-9042-2041711c9599', // Virgin JP
							},
							series: {
								77074: '713c4a95-6616-442b-9cf6-14e1ddfd5946', // Blue Note Records => Blue Note
							},
							place: {
								654: '7cc76d09-fc09-4faf-8406-f9ba9d046b73', // Capitol Records
							},
						};
						for (let entity in defaults) {
							if (!(entity in discogsBindingsCache)) discogsBindingsCache[entity] = { };
							for (let discogsId in defaults[entity]) if (!(discogsId in discogsBindingsCache[entity]))
								discogsBindingsCache[entity][discogsId] = defaults[entity][discogsId] || null;
						}
						const bce = new BindingsCacheEditor('discogs_to_mb_bindings', discogsIdExtractor, 'dc_icon',
							(entity, discogsId) => dcApiRequest(`${discogsEntity(entity)}s/${discogsId}`).then(entry => ({
								url: [dcOrigin, discogsEntity(entity), discogsId].join('/'),
								name: entry.name || entry.title,
								disambiguation: [
									entry.realname,
									entry.profile && entry.profile.trim().replace(/\s+/g, ' '),
								].filter(Boolean).join('; ') || undefined,
							})));
						GM_registerMenuCommand('Discogs to MB bindings cache editor', () => { bce.edit(discogsBindingsCache) });
					}
					function saveToCache(entity, discogsId, mbid) {
						console.assert(entity && discogsId > 0);
						if (!entity || !(discogsId > 0) || !['artist', 'label', 'series', 'place'].includes(entity)) return;
						if (!(entity in discogsBindingsCache)) discogsBindingsCache[entity] = { };
						console.assert(mbid === null || rxMBID.test(mbid), mbid);
						discogsBindingsCache[entity][discogsId] = mbid;
						GM_setValue('discogs_to_mb_bindings', discogsBindingsCache);
						if (mbid) GM_getTab(function(tab) {
							if (!('resolved' in tab)) tab.resolvedDiscogsBindings = { };
							if (!(entity in tab.resolvedDiscogsBindings)) tab.resolvedDiscogsBindings[entity] = { };
							tab.resolvedDiscogsBindings[entity][mbid] = parseInt(discogsId);
							GM_saveTab(tab);
						});
						// if (debugLogging) console.debug('Saved to cache [%s][%d] <- %s, key sizes:', entity, discogsId, mbid,
						// 	Object.keys(discogsBindingsCache).map(entity => entity + ': ' + Object.keys(discogsBindingsCache[entity]).length).join(', '));
					}
					function getCachedMBID(entity, discogsId) {
						if (!entity || !(discogsId > 0)) throw new Error('Invalid argument');
						initBindingsCache();
						const verifyMBID = mbid => (rxMBID.test(mbid) ? GlobalXHR.head(`${mbOrigin}/${entity}/${mbid}`, {
							redirect: 'follow', anonymous: true,
							recoverableErrors: [429],
						}).then(function(response) {
							const verified = mbIdExtractor(response.finalUrl, entity);
							if (verified) {
								console.log('Entity binding for', entity, discogsId, 'found in cache');
								discogsName(entity, discogsId).then(name =>
									{ notify(`MBID for ${entity} <b>${name}</b> found in cache`, 'foundincache') });
								if (verified != mbid)
									console.info('MB entry for %s %d has moved: %s => %s', entity, discogsId, mbid, verified);
							} else console.warn('Cached MBID check failed (%s)', response.finalUrl);
							return verified;
						}) : mbid === null ? Promise.resolve(mbid) : Promise.reject('Invalid MBID')).catch(function(reason) {
							if (reason == 'Invalid MBID') {
								console.warn('%s ID %s is invalid', entity, mbid);
								return Promise.reject(reason);
							} else if (/^(?:HTTP error 404)\b/.test(reason)) {
								console.info('%s ID %s was deleted', entity, mbid);
								return Promise.resolve(null);
							}
							console.warn('Could not verify %s ID %s (%s)', entity, mbid, reason);
							return Promise.resolve(mbid);
						});
						if (entity in discogsBindingsCache && discogsId in discogsBindingsCache[entity]) {
							var resolved = discogsBindingsCache[entity][discogsId];
							if (resolved === null) return Promise.resolve(null);
							return (Array.isArray(resolved) ? Promise.all(resolved.map(verifyMBID)) : verifyMBID(resolved)).then(function(verified) {
								if (Array.isArray(verified) ? !verified.every(verified => resolved.includes(verified)) : verified != resolved) {
									discogsBindingsCache[entity][discogsId] = verified;
									GM_setValue('discogs_to_mb_bindings', discogsBindingsCache);
								}
								return verified;
							});
						}
						if (entity in dynamicIdResolvers && (resolved = dynamicIdResolvers[entity][discogsId]) !== undefined)
							return Promise.all((Array.isArray(resolved) ? resolved : [resolved]).map(verifyMBID));
						return Promise.reject('ID not cached');
					}
					function isCached(entity, discogsId) {
						initBindingsCache();
						if (entity in discogsBindingsCache && discogsId in discogsBindingsCache[entity]) return true;
						if (entity in dynamicIdResolvers && dynamicIdResolvers[entity][discogsId] !== undefined) return true;
						return false;
					}
					function findMBID(entity, discogsId, entry) {
						if (!entity || !((discogsId = parseInt(discogsId)) > 0)) throw new Error('Invalid argument');
						if (!(entry instanceof Object)) entry = lookupIndexes[entity]?.[discogsId];
						console.assert(entry instanceof Object, entity, discogsId);
						if (!(entity in lookupWorkers)) lookupWorkers[entity] = new Map;
						else if (lookupWorkers[entity].has(discogsId)) return lookupWorkers[entity].get(discogsId);
						const lookupWorker = getCachedMBID(entity, discogsId).catch(async function(reason) {
							function openUncertain(mbid, subPage, params) {
								if (entity in openedIds && openedIds[entity].has(discogsId)) return;
								if (!mbid) throw new Error('MBID is required');
								if (!(entity in openedIds)) openedIds[entity] = new Set;
								openedIds[entity].add(discogsId);
								const mbUrl = new URL([entity, mbid, subPage].filter(Boolean).join('/'), mbOrigin);
								if (params) mbUrl.search = new URLSearchParams(params);
								GM_openInTab(mbUrl.href, true);
								GM_openInTab([dcOrigin, discogsEntity(entity), discogsId].join('/'), true);
							}

							let name;
							if (entry) name = entry.name;
							console.assert(name);

							class LookupMethodBase {
								static sum = scores => scores.reduce((total, score) => total + (score > 0 ? score : 0), 0);

								get debugPrefix() { return `[Lookup by ${this.constructor.methodName} (${this.order})] ` };
								debugOut(...args) {
									if (!debugLogging || args.length <= 0) return;
									console.debug(this.debugPrefix + args.shift(), ...args);
								}

								constructor(order) {
									if (Array.isArray(this.constructor.supportedEntities)
											&& this.constructor.supportedEntities.length > 0
											&& !this.constructor.supportedEntities.includes(entity))
										throw `Entity ${entity} not supported by lookup method (${this.constructor.methodName})`;
									if (order >= 0) this.order = order + 1;
								}
							}

							class LookupByBackLink extends LookupMethodBase {
								static methodName = 'backlinking to Discogs entry';
								static notifyClass = 'foundbybacklink';

								async exec() {
									return findDiscogsRelatives(entity, discogsId).then(entries => {
										console.assert(entries.length == 1, 'Ambiguous %s linkage for Discogs id', entity, discogsId, entries);
										if (entries.length > 1) return Promise.reject('Ambiguity (multiple direct Discogs relatives)');
										console.log(this.debugPrefix + 'Entity binding found:\n%s\n%s',
											[dcOrigin, discogsEntity(entity), discogsId].join('/') + '#' + discogsEntity(entity),
											[mbOrigin, entity, entries[0].id, this.constructor.reviewSubpage].join('/'));
										notify(`MBID for ${entity} <b>${name}</b> found by ${this.constructor.methodName}`, 'foundbybacklink');
										return entries[0].id;
									});
								}
							}

							class ArtistRecordingLookup extends LookupMethodBase {
								static methodName = 'matching existing recordings';
								static notifyClass = 'foundbyrecordings';
								static reviewSubpage = 'releases';
								static supportedEntities = ['artist'];

								constructor(order) {
									super(order);
									const artistLookupWorker = artistLookupWorkers[discogsId];
									console.assert(!artistLookupWorker || artistLookupWorker instanceof Promise, artistLookupWorker);
									return artistLookupWorker instanceof Promise ? artistLookupWorker.then(scores => {
										this.scores = scores;
										return this;
									}) : Promise.reject(`Recording data for ${this.constructor.methodName} missing or invalid`);
								}

								async exec() {
									const hiValue = Math.max.apply(this, Object.values(this.scores));
									if (Object.keys(this.scores).length > 1) {
										const acceptable = this.constructor.sum(Object.values(this.scores)) < hiValue * 1.25;
										console.warn(this.debugPrefix + 'MBID for artist', [dcOrigin, 'artist', discogsId].join('/'),
											'resolved to multiple entities:', printArtistMBIDs(this.scores),
											`(${acceptable ? 'accepted' : 'rejected'})`,
											'Related tracks:', this.scores.tracks);
										const params = this.scores.tracks.length == 1 ? { 'filter.name': this.scores.tracks[0].title } : null;
										openInconsistent(entity, discogsId, Object.keys(this.scores), 'recordings', params);
										chord.play();
										if (!acceptable) return Promise.reject(`Ambiguity (${this.constructor.methodName})`);
									}
									const mbid = Object.keys(this.scores).find(key => this.scores[key] == hiValue);
									if (!mbid) return Promise.reject('Assertion failed: MBID indexed lookup failed');
									console.log(this.debugPrefix + 'Entity binding found:\n%s\n%s',
										[dcOrigin, discogsEntity(entity), discogsId].join('/') + '#' + discogsEntity(entity),
										[mbOrigin, entity, mbid, this.constructor.reviewSubpage].join('/'));
									notify(`MBID for ${entity} <b>${name}</b> found by match with <b>${hiValue}</b> existing recordings`, this.constructor.notifyClass);
									return mbid;
								}
							}

							class ScoreBasedLookup extends LookupMethodBase {
								static supportedEntities = ['artist', 'label', 'series', 'place'];
								static #mbids; // candidate counterparts to inspect
								static get mbids() {
									if (!(ScoreBasedLookup.#mbids instanceof Promise))
										ScoreBasedLookup.#mbids = params.searchSize > 0 ? mbApiRequest(entity, {
											query: searchQueryBuilder(entity, entry, true),
											limit: params.searchSize,
										}).then(results => results[mbEntities(entity)].filter(function(result) {
											if (result.score > 90) return true;
											const matchName = (name, normFn = str => str) => {
												const cmp = root => similarStringValues(normFn(root.name), normFn(name));
												return cmp(result) || result.aliases && result.aliases.some(cmp);
											};
											if (matchName(stripDiscogsNameVersion(entry.name))) return true;
											if (entry.anv && matchName(entry.anv)) return true;
											if (!['label', 'place'].includes(entity)) return false;
											return matchName(stripDiscogsNameVersion(entry.name), root => root?.replace(...rxBareLabel));
										}).map(result => result.id)) : Promise.reject('Exhaustive lookups not allowed');
									return ScoreBasedLookup.#mbids;
								}
								static #statuses; // false - ruled out / true - error but possible / object - for evaluation
								static get statuses() {
									if (!(ScoreBasedLookup.#statuses instanceof Promise))
										ScoreBasedLookup.#statuses = this.mbids.then(mbids => Object.assign.apply(this, mbids.map(mbid => ({ [mbid]: (async function() {
											if (entity in discogsBindingsCache) {
												const cacheIndex = Object.values(discogsBindingsCache[entity]).indexOf(mbid);
												if (cacheIndex >= 0) { // matched entry assigned to different Discogs ID => skip scanning
													const _discogsId = parseInt(Object.keys(discogsBindingsCache[entity])[cacheIndex]);
													console.assert(_discogsId != parseInt(discogsId), discogsId,
														Object.entries(discogsBindingsCache[entity])[cacheIndex]);
													// GM_openInTab([mbOrigin, entity, mbid].join('/'), true);
													// GM_openInTab([dcOrigin, discogsEntity(entity), _discogsId].join('/'), true);
													return Promise.resolve(false);
												}
											}
											return mbApiRequest(entity + '/' + mbid, { inc: (function() {
												const rels = ['url', entity];
												if (entity == 'artist') {
													rels.push('release', 'recording', 'release-group', 'work');
													var creditTypes = getArtistCreditTypes(discogsId);
												}
												return ['aliases', 'annotation'].concat(rels.map(entity => entity + '-rels'));
											})().join('+') }).then(function(entry) {
												const discogsIds = getDiscogsRels(entry, entity);
												return discogsIds.length > 0 && !discogsIds.includes(parseInt(discogsId)) ? false : entry;
											}, reason => (console.warn(reason), true));
										})() }))));
									return ScoreBasedLookup.#statuses;
								}
								static spaTest = /\b(?:^Various|^VA$|Artist$|^Unknown|^Anonym(?:ous)?|^NO Artist)\b/i;

								constructor(order) {
									super(order);
									if (!['dcDataResolver', 'mbDataResolver'].every(method => method in this.constructor))
										throw new Error('Incomplete class declaration');
									return this.constructor.mbids.then(mbids => {
										const workers = mbids.map(mbid => this.constructor.statuses.then(statuses =>
											statuses[mbid].then(status => Boolean(status) ? this.constructor.mbDataResolver(mbid)
												.catch(reason => (console.warn(reason), null)) : null)));
										return Promise.all(workers.concat(this.constructor.dcDataResolver())).then(resolved => {
											const dcData = resolved.pop();
											if (dcData) this.dcData = Object.freeze(dcData);
												else return Promise.reject('Discogs data not resolved');
											if (resolved.some(Boolean)) this.mbData = Object.freeze(resolved);
												else return Promise.reject('No queried MusicBrainz objects meet precondition');
											return this;
										});
									});
								}

								async exec() {
									console.assert(this.dcData && this.mbData);
									console.assert(['getMutualScore', 'dataSize'].every(method => this[method] instanceof Function));
									const mutualScores = await Promise.all(this.mbData.map((...args) => args[0] ? this.getMutualScore(...args) : 0));
									const hiScore = Math.max.apply(this, mutualScores);
									this.debugOut('Entity:', entity, 'Discogs ID:', discogsId, 'Scores:', mutualScores, 'HiScore:', hiScore);
									if (!(hiScore > 0)) return Promise.reject('No matches by ' + this.constructor.methodName);
									this.hiIndex = mutualScores.indexOf(hiScore);
									console.assert(this.hiIndex >= 0, hiScore, mutualScores);
									if (debugLogging && this.hiIndex < 0) alert('HiIndex not found! (see the log)');
									const mbids = await this.constructor.mbids;
									if (mutualScores.filter(score => score > 0).length > 1) {
										console.warn(this.debugPrefix + 'Matches by more entities:',
											mutualScores.map((score, index) => score > 0 && [mbOrigin, entity, mbids[index], this.constructor.reviewSubpage].join('/') + ' (' + score + ')').filter(Boolean));
										openInconsistent(entity, discogsId, mutualScores.map((score, index) =>
											score > 0 && mbids[index]).filter(Boolean), this.constructor.reviewSubpage);
										chord.play();
										if (this.constructor.sum(mutualScores) >= hiScore * 1.25)
											return Promise.reject(`Ambiguity (${this.constructor.methodName})`);
									}
									const dataSize = await this.dataSize();
									console.assert(dataSize > 0, this.dcData, this.mbData);
									if (hiScore < 1 || dataSize > 0 && (Math.pow(hiScore, 3) * 10 < Math.min(dataSize, 10) || hiScore * 50 < dataSize)) {
										openUncertain(mbids[this.hiIndex], this.constructor.reviewSubpage);
										if (!params.assignUncertain) return Promise.reject(`Uncertain match by ${this.constructor.methodName} not tolerated`);
									}
									console.log(this.debugPrefix + 'Entity binding found by having score %f (%d):\n%s\n%s', hiScore, dataSize,
										[dcOrigin, discogsEntity(entity), discogsId].join('/') + '#' + discogsEntity(entity),
										[mbOrigin, entity, mbids[this.hiIndex], this.constructor.reviewSubpage].join('/'));
									if (debugLogging && ![
										'BoldProfileSimilarityLookup',
										'LookupByCommonRecordings1', 'LookupByCommonRecordings2', 'LookupByCommonReleases', 'LookupByCommonArtists',
										'LookupByDiscogsRelative', 'LookupByMusicBrainzRelative',
										// 'WeakProfileSimilarityLookup', 'ProfileSimilarityLookup4',
									].includes(this.constructor.name)) alert(`Found matching entity [${this.constructor.name}]`);
									notify([
										`MBID for ${entity} <b>${name}</b> found`,
										`by similarity score <b>${hiScore.toFixed(1)}</b> out of ${dataSize} ${dataSize != 1 ? 'entries' : 'entry'}`,
										`(<b>${this.constructor.methodName}</b>)`,
									].join(' '), this.constructor.notifyClass);
									return mbids[this.hiIndex];
								}
							}

							class ProfileSimilarityLookup extends ScoreBasedLookup {
								static methodName = 'profiles similarity';
								static #dcDataWorker;
								static dcDataResolver() {
									if (!(ProfileSimilarityLookup.#dcDataWorker instanceof Promise))
										ProfileSimilarityLookup.#dcDataWorker = dcApiRequest(`${discogsEntity(entity)}s/${discogsId}`);
									return ProfileSimilarityLookup.#dcDataWorker;
								}
								static mbDataResolver = mbid => this.statuses
									.then(statuses => statuses[mbid] || Promise.reject('Assertion failed'))
									.then(status => status instanceof Object ? status : null, reason => null);
								static notifyClass = 'foundBySimilarity';

								dataSize() { return 1 }
							}
							class BoldProfileSimilarityLookup extends ProfileSimilarityLookup {
								static methodName = 'by common profile relationship (authoritative)';

								getMutualScore(mbEntry) {
									if (!mbEntry.relations) return 0;
									const discogsIds = getDiscogsRels(mbEntry, entity);
									if (discogsIds.includes(this.dcData.id)) {
										this.debugOut('Same %s found by having direct Discogs relative:', mbEntities(entity), this.dcData, mbEntry);
										return 3;
									}
									if (this.dcData.urls && this.dcData.urls.some(url => {
										if (!(url = validateURL(url))) return false;
										return mbEntry.relations.some(relation => {
											if (!(relation.url instanceof Object) || !(relation = validateURL(relation.url.resource))) return false;
											const relPath = url => (url.pathname + url.search).toLowerCase();
											return (relation.hostname.endsWith(url.hostname)
												|| url.hostname.endsWith(relation.hostname)) && relPath(relation) == relPath(url);
										});
									})) {
										this.debugOut('Same %s found by linking to same url:', mbEntities(entity), this.dcData, mbEntry);
										return 1;
									}
									const relations = mbEntry.relations.filter(relation => relation[entity] instanceof Object);
									const hasSameRelative = (discogsRelative, relationType, forward) => discogsRelative instanceof Object
										&& relationType && relations.filter(relation => relation.type == relationType
											&& (forward === undefined || relation.direction == (forward ? 'forward' : 'backward')))
										.map(relation => relation[entity]).some(mbRelative => entity in discogsBindingsCache
											&& discogsRelative.id in discogsBindingsCache[entity] ?
												mbRelative.id == discogsBindingsCache[entity][discogsRelative.id]
											: matchNameVariant(discogsRelative, mbRelative.name) || mbRelative.aliases
												&& mbRelative.aliases.some(alias => matchNameVariant(discogsRelative, alias.name)));
									const hasSameRelatives = (prop, relationType, forward) => (this.dcData[prop] || [ ])
										.some(discogsRelative => hasSameRelative(discogsRelative, relationType, forward));
									switch (entity) {
										case 'artist':
											if (hasSameRelatives('members', 'member of band', false)
													|| hasSameRelatives('members', 'founder', false) || hasSameRelatives('groups', 'member of band', true)
													|| hasSameRelatives('groups', 'founder', true) || hasSameRelatives('aliases', 'is person')) {
												this.debugOut('Same %ss found by having same relative(s):', entity, this.dcData, mbEntry);
												return 1;
											} else if (this.dcData.realname) {
												const matchByAlias = relations.filter(relation => relation.type == 'is person')
													.map(relation => relation[entity]).some(mbRelative => !uniqueRealName(this.dcData.realname, mbRelative.name));
												const matchByDisambiguation = mbEntry.disambiguation && !uniqueRealName(this.dcData.realname, mbEntry.disambiguation);
												if (matchByAlias || matchByDisambiguation) {
													this.debugOut('Same %ss found by matching real name:', entity, this.dcData, mbEntry);
													return 1;
												}
											}
											break;
										case 'label':
											if (hasSameRelatives('sublabels', 'label ownership', true)
													|| hasSameRelative(this.dcData.parent_label, 'label ownership', false)) {
												this.debugOut('Same %ss found by having same parent/subsidiary:', entity, this.dcData, mbEntry);
												return 1;
											}
											break;
									}
									return 0;
								}
							}
							class WeakProfileSimilarityLookup extends ProfileSimilarityLookup {
								static methodName = 'referring common entity in profile (weak match)';

								async getMutualScore(mbEntry) {
									return Promise.all(Array.from((function*(profile, rx) {
										if (!profile) return;
										let match;
										while ((match = rx.exec(profile)) != null) yield {
											entities: { a: ['artist'], l: ['label', 'series', 'place'] }[match[1].toLowerCase()],
											id: parseInt(match[2]),
										};
									})(this.dcData.profile, /\[([al])=?(\d+)\]/gi), async reference => {
										console.assert(reference.id > 0 && Array.isArray(reference.entities), reference);
										return Promise.all(reference.entities.map(_entity => {
											if (_entity == entity && reference.id == discogsId || !mbEntry.relations) return false;
											const mbids = mbEntry.relations.filter(relation => relation[_entity] instanceof Object)
												.map(relation => relation[_entity].id);
											return mbids.length > 0 && getCachedMBID(_entity, reference.id).catch(reason =>
													findDiscogsRelatives(_entity, reference.id).then(entries => {
												if (entries.length != 1) return Promise.reject('No relatives');
												saveToCache(_entity, reference.id, entries[0].id);
												return entries[0].id;
											})).then(Array.prototype.includes.bind(mbids), reason => false);
										})).then(matches => matches.filter(Boolean).length == 1);
									})).then(matches => matches.filter(Boolean).length).then(matches => {
										if (matches <= 0) return Promise.reject('No common references found');
										this.debugOut('Same %ss found by sharing %d common entity reference(s):', entity, matches, this.dcData.profile, mbEntry.relations);
										return 0.5;
									}).catch(reason => {
										if (entity == 'artist' && this.dcData.realname) {
											if (uniqueRealName(this.dcData.realname, stripDiscogsNameVersion(this.dcData.name))
													&& mbEntry.aliases && mbEntry.aliases.some(alias => /*alias.type == 'Legal name'
													&& */uniqueRealName(alias.name, mbEntry.name) && !uniqueRealName(this.dcData.realname, alias.name))) {
												this.debugOut('Same %ss found by having same legal name:', entity, this.dcData, mbEntry);
												return 0.5;
											}
											const cmpNorm = str => toASCII(str || '').toLowerCase();
											if (uniqueRealName(this.dcData.realname, stripDiscogsNameVersion(this.dcData.name))
													&& cmpNorm(mbEntry.disambiguation).includes(cmpNorm(this.dcData.realname))) {
												this.debugOut('Same %ss found by m matching real name in disambiguation:', entity, this.dcData, mbEntry);
												return 0.3;
											}
										}
										if (similarProfiles(mbEntry.disambiguation, this.dcData.profile) || similarProfiles(mbEntry.annotation, this.dcData.profile)) {
											this.debugOut('Same %ss found by having same profile info:', entity, this.dcData, mbEntry);
											return 0.3;
										}
										return 0;
									});
								}
							}

							class DiscographyBasedLookup extends ScoreBasedLookup {
								static #dcDataWorker;
								static dcDataResolver() {
									if (!(DiscographyBasedLookup.#dcDataWorker instanceof Promise))
										DiscographyBasedLookup.#dcDataWorker = getDiscogsReleases(entity, discogsId).then(dcReleases =>
											dcReleases.length > 0 ? dcReleases : Promise.reject('No Discogs releases to compare'));
									return DiscographyBasedLookup.#dcDataWorker;
								}
							}
							class LookupByCommonRecordings extends DiscographyBasedLookup {
								static methodName = 'common track titles';
								static mbDataResolver = getArtistTracks;
								static notifyClass = 'foundbytracks';
								static reviewSubpage = 'recordings';
								static supportedEntities = ['artist'];

								static uniqueIdCount(array) { return array.filter(uniqueIdFilter).length }

								async getMutualScore(tracks, index) {
									const dcReleases = await this.discogsFilter(tracks);
									const scores = await Promise.all(tracks.map(track => this.constructor.mbids
										.then(mbids => this.trackScoreResolver(track, dcReleases, mbids[index]))));
									return this.constructor.sum(scores);
								}
								async dataSize() {
									console.assert(this.hiIndex >= 0);
									const dcReleases = await this.discogsFilter(this.mbData[this.hiIndex]);
									return Math.min.apply(this, await Promise.all([
										this.dcDataSizeResolver(dcReleases),
										this.constructor.uniqueIdCount(this.mbData[this.hiIndex]),
									]));
								}
							}
							class LookupByCommonRecordings1 extends LookupByCommonRecordings {
								discogsFilter() { return this.dcData.filter(dcRelease => dcRelease.trackinfo) }
								trackScoreResolver(track, dcReleases) {
									return Math.max.apply(this, dcReleases.map(dcRelease => {
										const isRecordingArtist = !dcRelease.role || ['Main', 'TrackAppearance'].includes(dcRelease.role);
										if ((track.relationType == 'track_artist') != isRecordingArtist
												|| !sameTitleMapper(track, dcRelease.trackinfo, sameStringValues, trackTitleNorm)) return 0;
										const base = 0, q = track.title ? Math.pow(Math.min(trackTitleNorm(track.title).length, 5) / 5, 0.75) * 0.65 : 0;
										let score = base + q * (1 - base);
										if (dcRelease.year > 0 && track['first-release-date']
												&& dcRelease.year == getReleaseYear(track['first-release-date'])) score *= 1.25;
										this.debugOut('Found matching tracks (from trackinfo):', track, dcRelease, 'Score:', score);
										return score;
									}));
								}
								dcDataSizeResolver(dcReleases) { return this.constructor.uniqueIdCount(dcReleases) }
							}
							class LookupByCommonRecordings2 extends LookupByCommonRecordings {
								static async processTracklists(dcReleases, callBack) {
									console.assert(Array.isArray(dcReleases) && dcReleases.length > 0, dcReleases);
									console.assert(callBack instanceof Function, callBack);
									return Promise.all(dcReleases.map(dcRelease => dcApiRequest(`${dcRelease.type || 'release'}s/${dcRelease.id}`)
										.then(callBack).catch(reason => (console.warn(reason), 0))));
								}

								discogsFilter(tracks) {
									let dcReleases = this.dcData;
									if (dcReleases.length > (params.maxFetchDiscogsReleases || 0)) {
										let asRelatedArtist = tracks.filter(track => track.relationType != 'track_artist');
										asRelatedArtist = this.constructor.uniqueIdCount(asRelatedArtist) * 2
											> this.constructor.uniqueIdCount(tracks);
										dcReleases = dcReleases.filter(dcRelease => asRelatedArtist ?
												dcRelease.role && ['Appearance', 'TrackAppearance'].includes(dcRelease.role)
											: !dcRelease.role || ['Main', 'TrackAppearance'].includes(dcRelease.role));
									}
									return params.maxFetchDiscogsReleases > 0
										&& dcReleases.length > params.maxFetchDiscogsReleases ? [ ] : dcReleases;
								}
								async trackScoreResolver(track, dcReleases, mbid) {
									const scores = await this.constructor.processTracklists(dcReleases, async dcRelease => {
										console.assert(dcRelease.tracklist, dcRelease);
										const prop = track.relationType == 'track_artist' ? 'artists' : 'extraartists';
										const isRootArtist = (...roots) => roots.some(root => root && (root = root[prop])
											&& root.some(artist => artist.id == discogsId));
										let score = Math.max.apply(this, dcRelease.tracklist.map(dcTrack => {
											const trackScore = dcTrack => {
												const computeScore = (base, confidencyLen, exp, factor) => {
													let score = track.title ? Math.min(trackTitleNorm(track.title).length, confidencyLen) / confidencyLen : 0;
													score = base + Math.pow(score, exp) * factor * (1 - base);
													if (!sameTitleMapper(track, dcTrack.title, sameStringValues, trackTitleNorm)) score *= 0.8;
													if (dcRelease.year > 0 && track['first-release-date']
															&& dcRelease.year == getReleaseYear(track['first-release-date'])) score *= 1.25;
													return score;
												};
												const lengthDelta = Math.abs(getTrackLength(dcTrack) - getTrackLength(track));
												if (lengthDelta > 5000 || !sameTitleMapper(track, dcTrack.title,
														lengthDelta < 1000 ? similarStringValues : sameStringValues, trackTitleNorm)) return 0;
												if (isNaN(lengthDelta)) {
													var score = computeScore(0, 5, 0.75, 0.65);
													this.debugOut('Found matching tracks (times not compared):', track, dcTrack, 'Score:', score);
												} else {
													score = computeScore(0, 5, 0.75, 0.80) * (1 - Math.pow(lengthDelta / 5000, 1) / 2);
													this.debugOut('Found matching tracks (times compared):', track, dcTrack, lengthDelta, 'Score:', score);
												}
												return score;
											};
											switch (dcTrack.type_) {
												case 'track': return isRootArtist(dcTrack, dcRelease) ? trackScore.call(this, dcTrack) : 0;
												case 'index': return dcTrack.sub_tracks ? Math.max.apply(this, dcTrack.sub_tracks
													.map(subTrack => isRootArtist(subTrack, dcTrack, dcRelease) ? trackScore.call(this, subTrack) : 0)) : 0;
												default: return 0;
											}
										}));
										if (!(score > 0)) return 0;
										if (!mbIdExtractor(mbid) || track.targetType != 'recording' || !dcRelease.artists
												|| !dcRelease.artists.some(artist => artist.id == discogsId))
											return score;
										return mbLookupById('release', 'recording', track.id, 'artist-credits').then(releases => {
											console.assert(releases.length > 0);
											if (releases.length > 1) score *= 1 + (releases.length - 1) / 3;
											if (releases.some(release => release?.['artist-credit']?.some(({artist}) => artist.id == mbid)))
												score *= 2;
											return score;
										}).catch(reason => (console.warn(reason), score));
									});
									return Math.max.apply(this, scores) || 0;
								}
								async dcDataSizeResolver(dcReleases) {
									const trackCounter = track => track.type_ == 'track' ? 1
										: track.type_ == 'index' ? track?.sub_tracks?.length || 1 : 0;
									const releaseCounter = dcRelease => (dcRelease?.tracklist || [ ])
										.reduce((total, track) => total + trackCounter(track), 0);
									return this.constructor.processTracklists(dcReleases.filter(uniqueIdFilter), releaseCounter)
										.then(this.constructor.sum);
								}
							}
							class LookupByCommonReleases extends DiscographyBasedLookup {
								static methodName = 'common release titles';
								static mbDataResolver = mbGetReleasesAdapter(entity);
								static notifyClass = 'foundbyreleases';
								static reviewSubpage = 'releases';

								static isStrongName(name) {
									if (!name || name.length < 4) return false;
									return !/^(?:(?:\w[\s\.]+)*$|(?:His|Her|Son|Elle|Su[ae]?|Es|(?:Sein|Ihr)(?:e[mn]|er)?|(?:(?:The|La|Les?|Los|Der|Die|Das)\s+)?(?:(?:(?:Philharmonic|Symphonic)\s+)?Orch(?:est(?:ra|er|re)|\.?)|Orq(?:uest(?:r?a)?|\.)(?:\s+(?:Sinfónica))?|Ork(?:est(?:er)?|\.)|Оркестр|Ensemble|(?:(?:Big|Brass)\s+)?Band|Group|Companion|All[\s\-]Stars|Conjurito|Conjunto|Soloists|Chorus(?:es)?|Choi?r|Choeurs|Chœurs|Coros?|Kórus|Choeur|Chœur|Koor|Хор|Friends|Members|Guests|Family|Trio|Quartet(?:te)?|Quintet(?:te?)?|Sextet(?:te?)?|Septet(?:te?)?|Octet(?:te?)?|Nonet(?:te?)?|Tentet(?:te?)?|Symphony))\b)/i.test(name);
								}
								static validateDiscogsArtist(name) {
									if (!this.isStrongName(stripDiscogsNameVersion(name))) return false;
									if (entity == 'artist' && [entry.name, entry.anv].includes(name)) return false;
									if (this.spaTest.test(stripDiscogsNameVersion(name))) return false;
									return true;
								}
								static validateMusicBrainzEntity(mbEntity) {
									if (!this.isStrongName(mbEntity.name) && (!mbEntity[entity] || !this.isStrongName(mbEntity[entity].name))) return false;
									if (entity == 'artist' && ([entry.name, entry.anv].includes(mbEntity.name)
											|| mbEntity[entity] && [entry.name, entry.anv].includes(mbEntity[entity].name))) return false;
									const prop = { 'artist': 'spa', 'label': 'spl' }[entity];
									if (prop in mb && Object.values(mb[prop]).includes(mbEntity[entity]?.id || mbEntity.id)) return false;
								}
								static dcArtistParser(dcSearchResult) {
									const rxArtistSplitter = new RegExp(`\\s+${phrases.feat}\\s*|(?:,\\s*)?(?:&|and)|[\,\;]|\\b(?:with\\b|vs.?|meets\\b)`, 'i');
									return (dcSearchResult?.artist || [ ]).split(rxArtistSplitter)
										.map(s => s.trim()).filter(Boolean).map(stripDiscogsNameVersion);
								}
								static getRelatedArtists(mbEntry) {
									return (mbEntry?.relations || [ ]).filter(relation => relation['target-type'] == 'artist')
										.map(relation => relation[relation['target-type']]).filter(Boolean);
								}

								dataSize() {
									console.assert(this.hiIndex >= 0);
									return Math.min(this.dcData.length, this.mbData[this.hiIndex].length);
								}
								getMutualScore(results) {
									return results.reduce((score, result) => {
										const relatedReleases = [ ];
										switch (result.targetType) {
											case 'release':
												for (let discogsId of getDiscogsRels(result, 'release'))
													Array.prototype.push.apply(relatedReleases, this.dcData.filter(dcRelease =>
														(dcRelease.type == 'release' || !dcRelease.type) && dcRelease.id == discogsId));
												for (let discogsId of getDiscogsRels(result['release-group'], 'release-group'))
													Array.prototype.push.apply(relatedReleases, this.dcData.filter(dcRelease =>
														dcRelease.type == 'master' && dcRelease.id == discogsId));
												break;
											case 'release_group':
												for (let discogsId of getDiscogsRels(result, 'release-group'))
													Array.prototype.push.apply(relatedReleases, this.dcData.filter(dcRelease =>
														dcRelease.type == 'master' && dcRelease.id == discogsId));
												break;
											default: console.warn('Unexpected result level:', result);
										}
										if (relatedReleases.length > 0) {
											console.assert(relatedReleases.length < 2, relatedReleases);
											const q = (!result.relationType || result.relationType == entity)
												&& relatedReleases.some(dcRelease => !dcRelease.role || dcRelease.role == 'Main') ? 1 : 2/3;
											this.debugOut('Found matching releases by existing relation:', result, relatedReleases, 'Score:', q);
											return score + q;
										} else return score + Math.max.apply(this, this.dcData.map(dcRelease => {
											if (entity == 'artist' && result.relationType) switch (result.relationType) {
												case 'artist': if (dcRelease.trackinfo) return 0; else break;
												case 'track_artist': if (!dcRelease.trackinfo) return 0; else break;
												default: if (!dcRelease.role || dcRelease.role == 'Main') return 0;
											}
											const releaseGroup = result.targetType == 'release_group' ? result : result['release-group'];
											const q = [0, 0];
											const releaseYear = result.targetType == 'release' ? getReleaseYear(result.date) : NaN;
											const rgYear = releaseGroup && getReleaseYear(releaseGroup['first-release-date']) || NaN;
											if (!(dcRelease.year > 0)) return 0; else if (dcRelease.type == 'release' || !dcRelease.type) {
												if (dcRelease.year == releaseYear) q[0] = 1; else if (dcRelease.year >= rgYear) q[0] = 1/2;
											} else if (dcRelease.type == 'master') {
												if (dcRelease.year == rgYear) q[0] = 1; else if (dcRelease.year <= releaseYear) q[0] = 1/2;
											}
											if (!(q[0] > 0)) return 0;
											const titleSimilarity = root => {
												if (root) if (sameTitleMapper(root, dcRelease.title, sameStringValues))
													return root.title.length;
												else if (sameTitleMapper(root, dcRelease.title, sameStringValues, releaseTitleNorm))
													return releaseTitleNorm(root.title).length;
												return 0;
											};
											if ((dcRelease.type == 'release' || !dcRelease.type) && result.targetType == 'release')
												q[1] = titleSimilarity(result);
											else if (dcRelease.type == 'master') q[1] = titleSimilarity(releaseGroup);
											if (!(q[1] > 0)) return 0;
											let score = q[0] * ((base, confidencyLen, exp = 1, factor = 1) =>
												base + Math.pow(Math.min(q[1], confidencyLen) / confidencyLen, exp) * factor * (1 - base))
													(0, 5, 0.75, 0.80);
											if (entity == 'artist' && (result.relationType == 'track_artist' || dcRelease.trackinfo))
												score *= 2/3;
											this.debugOut('Found matching releases:', result, dcRelease, 'Score:', score);
											return score;
										}));
									}, 0);
								}
							}
							class LookupByCommonArtists extends LookupByCommonReleases {
								static methodName = 'common artists';
								static mbDataResolver = mbGetDiscographyAdapter(entity);
								static notifyClass = 'foundByArtists';
								static reviewSubpage = undefined;

								static async getRelatedArtistCredits(mbEntry) {
									console.assert(mbEntry.targetType, mbEntry);
									return mbApiRequest(mbEntry.targetType + '/' + mbEntry.id, { inc: 'artist-credits+aliases+recording-rels+release-rels' }).then(function(mbEntry) {
										if (!mbEntry.relations) return null;
										let artistCredits = mbEntry.relations
											.filter(relation => 'artist-credit' in relation[relation['target-type']])
											.map(relation => relation[relation['target-type']]['artist-credit']);
										artistCredits = Array.prototype.concat.apply([ ], artistCredits);
										return artistCredits.length > 0 ? artistCredits : null;
									});
								}

								async getMutualScore(discography) {
									const scores = await Promise.all(discography.map(async mbEntry => {
										const artistCredits = [ ];
										if (mbEntry['artist-credit']) Array.prototype.push.apply(artistCredits, mbEntry['artist-credit']);
										if (mbEntry.targetType == 'work') try {
											const relatedArtists = await this.constructor.getRelatedArtistCredits(mbEntry);
											Array.prototype.push.apply(artistCredits, relatedArtists);
										} catch(e) { console.warn(e) }
										if (artistCredits.length <= 0) return 0;
										return Math.max.apply(this, this.dcData.map(dcRelease => {
											if (!this.constructor.validateDiscogsArtist(dcRelease.artist)) return 0;
											let dcArtists = this.constructor.dcArtistParser(dcRelease);
											if (entity == 'artist') dcArtists = dcArtists.filter(dcArtist => {
												if (sameStringValues(dcArtist, stripDiscogsNameVersion(entry.name))) return false;
												if (entry.anv && sameStringValues(dcArtist, entry.anv)) return false;
												return true;
											});
											const releaseScore = mbEntry.relationType == 'track_' + entity || dcRelease.trackinfo ? 1/4 : 1/3;
											const score = artistCredits.reduce((score, artistCredit) => score + (function() {
												if (Object.values(mb.spa).includes(artistCredit.artist.id)) return 0;
												const matchName = name => {
													if (!name) return false;
													const matchName = mbName => this.constructor.isStrongName(mbName) && sameStringValues(mbName, name);
													if (artistCredit.artist && matchName(artistCredit.artist.name) || matchName(artistCredit.name)) return true;
													if (!artistCredit.artist.aliases) return false;
													return artistCredit.artist.aliases.some(alias => matchName(alias.name));
												};
												if (entity == 'artist' && (matchName(stripDiscogsNameVersion(entry.name))
														|| entry.anv && matchName(entry.anv))) return 0;
												const score = matchName(stripDiscogsNameVersion(dcRelease.artist)) ? releaseScore
													: dcArtists.reduce((score, dcArtist) => score + (matchName(dcArtist) ? releaseScore : 0), 0);
												if (score > 0) this.debugOut('Found matching common artist:', artistCredit, dcRelease);
												return score;
											}).call(this), 0);
											if (score > 0) this.debugOut('Found matching discography entries by common artists:', mbEntry, dcRelease, 'Score:', score);
											return score;
										}));
									}));
									return this.constructor.sum(scores);
								}
							}
							class LookupByDiscogsRelative extends LookupByCommonArtists {
								static methodName = 'Discogs relative in MusicBrainz discography';
								static supportedEntities = ['artist'];
								static dcDataResolver = ProfileSimilarityLookup.dcDataResolver;

								dataSize() {
									console.assert(this.hiIndex >= 0);
									return this.mbData[this.hiIndex].length;
								}
								async getMutualScore(discography) {
									const dcRelatives = Array.prototype.concat.apply([ ], ['members', 'groups', 'aliases']
										.map(relatives => (this.dcData[relatives] || [ ])
											.map(relative => Object.assign({ relationType: relatives }, relative))));
									//if (dcRelatives.length <= 0) throw('No Discogs artist relatives');
									return (Promise.all(dcRelatives.map(async dcRelative => {
										if (!this.constructor.validateDiscogsArtist(dcRelative.name)) return 0;
										const scores = await Promise.all(discography.map(async mbEntry => {
											const releaseScore = mbEntry.targetType == 'release' ? 2/5 : 1/4;
											const getScore = artists => (artists || [ ]).reduce((score, root) => score + (function() {
												if (!root || Object.values(mb.spa).includes(root.artist?.id || root.id)) return 0;
												const matchName = name => {
													if (!name || this.constructor.spaTest.test(name)) return false;
													const matchName = mbName => this.constructor.isStrongName(mbName) && sameStringValues(mbName, name);
													if (root.artist && matchName(root.artist.name) || matchName(root.name)) return true;
													if (!(root.artist || root).aliases) return false;
													return (root.artist || root).aliases.some(alias => matchName(alias.name));
												};
												if (matchName(stripDiscogsNameVersion(this.dcData.name))) return 0;
												if (this.dcData?.namevariations?.some(matchName)) return 0;
												if (!matchName(stripDiscogsNameVersion(dcRelative.name))) return 0;
												this.debugOut('Found matching common artist:', root, dcRelative);
												return releaseScore;
											}).call(this), 0);
											let score = 0;
											if (mbEntry['artist-credit']) score += getScore(mbEntry['artist-credit']);
											if (mbEntry['relations']) score += getScore(this.constructor.getRelatedArtists(mbEntry));
											if (mbEntry.targetType == 'work') try {
												const relatedArtists = await this.constructor.getRelatedArtistCredits(mbEntry);
												if (relatedArtists != null) score += getScore(relatedArtists);
											} catch(e) { console.warn(e) }
											if (score > 0) this.debugOut('Found matching discography entry by Discogs relative:', mbEntry, dcRelative, 'Score:', score);
											return score;
										}));
										return Math.max.apply(this, scores);
									}))).then(this.constructor.sum);
								}
							}
							class LookupByMusicBrainzRelative extends LookupByCommonArtists {
								static methodName = 'MusicBrainz relative in Discogs releases';
								static mbDataResolver = ProfileSimilarityLookup.mbDataResolver;
								static notifyClass = 'foundByArtists';
								static supportedEntities = ['artist'];

								dataSize() { return this.dcData.length }
								getMutualScore(mbEntry) {
									if (!(mbEntry instanceof Object)) return 0;
									const mbRelatives = [ ];
									if (mbEntry.relations) Array.prototype.push.apply(mbRelatives, this.constructor.getRelatedArtists(mbEntry));
									if (mbEntry.aliases) Array.prototype.push.apply(mbRelatives, mbEntry.aliases);
									return this.constructor.sum(mbRelatives.map(mbRelative => {
										if (!this.constructor.isStrongName(mbRelative.name)) return 0;
										const prop = { 'artist': 'spa', 'label': 'spl' }[entity];
										if (prop in mb && Object.values(mb[prop]).includes(mbRelative.id)) return 0;
										return Math.max.apply(this, this.dcData.map(dcRelease => {
											if (!this.constructor.validateDiscogsArtist(dcRelease.artist)) return 0;
											const releaseScore = 2/5, matchName = dcArtist => {
												if (!this.constructor.validateDiscogsArtist(dcArtist)) return false;
												const matchName = name => name && sameStringValues(dcArtist, name);
												if (matchName(stripDiscogsNameVersion(entry.name))) return false;
												if (entry.anv && matchName(entry.anv)) return false;
												if (!this.constructor.isStrongName(dcArtist) || this.constructor.spaTest.test(dcArtist)) return false;
												if (![mbRelative].concat(mbRelative.aliases || [ ]).some(root => matchName(root.name))) return false;
												this.debugOut('Found matching common artist:', dcArtist, mbRelative);
												return releaseScore;
											};
											const matchCount = matchName(stripDiscogsNameVersion(dcRelease.artist)) ? 1
												: this.constructor.dcArtistParser(dcRelease).filter(matchName).length;
											if (matchCount > 0) this.debugOut('Found matching release by MusicBrainz relative:', mbRelative, dcRelease, 'Match count:', matchCount);
											return matchCount * releaseScore;
										}));
									}));
								}
							}

							class LookupByCommonURL extends LookupMethodBase {
								static methodName = 'referring to common URL';
								static notifyClass = 'foundbyurl';
								static supportedEntities = ['artist', 'label', 'series', 'place'];
								static dcDataResolver = ProfileSimilarityLookup.dcDataResolver;

								constructor(order) {
									super(order);
									return this.constructor.dcDataResolver().then(dcEntry => {
										if (!dcEntry.urls || dcEntry.urls.length <= 0)
											return Promise.reject('No URLs in Discogs entry to match');
										this.urls = dcEntry.urls;
										return this;
									});
								}

								async exec() {
									console.assert(this.urls?.length > 0);
									const workers = this.urls.map(url => mbApiRequest('url', { resource: url, inc: entity + '-rels' }).then(url => {
										const entries = url.relations.filter(relation => relation['target-type'] == entity)
											.map(relation => relation[relation['target-type']]).filter(uniqueIdFilter);
										if (entries.length < 1) return null;
										if (entries.length > 1) return Promise.reject(`Ambiguity (${this.constructor.methodName})`);
										return entries[0].id;
									}, reason => null));
									return Promise.all(workers).then(results => {
										results = results.filter(uniqueValues);
										if (results.length < 1) return Promise.reject('No entity with any matching URL');
										if (results.length > 1) return Promise.reject(`Ambiguity (${this.constructor.methodName})`);
										if (!GM_getValue('trust_url_matches', true)) {
											// notify(`MBID for ${entity} <b>${name}</b> found by refering to same URL (unreliable)`, 'foundbyurl');
											addLookupHint(entity, discogsId, [entity, results[0], 'relationships'].join('/'));
											return Promise.reject('Found by refering to same URL (unreliable result not allowed)');
										}
										console.log(this.debugPrefix + 'Entity binding found:\n%s\n%s',
											[dcOrigin, discogsEntity(entity), discogsId].join('/') + '#' + discogsEntity(entity),
											[mbOrigin, entity, results[0], this.constructor.reviewSubpage].join('/'));
										notify(`MBID for ${entity} <b>${name}</b> found by ${this.constructor.methodName}`, this.constructor.notifyClass);
										openUncertain(results[0]);
										return results[0];
									});
								}
							}
							class GuessSPA extends LookupMethodBase {
								static methodName = 'recognizing as SPA';
								static notifyClass = 'foundbyspa';
								static supportedEntities = ['artist'];

								constructor(order) {
									super(order);
									if (!(entry instanceof Object)) throw 'Assertion failed: entry not object';
									this.artist = Object.assign({ id: discogsId }, entry);
								}

								async exec() {
									return guessSPA(this.artist).catch(reason => dcApiRequest('artists/' + this.artist.id).then(artist => {
										if (/^(?:An?\s+)?(?:Unidentified|Anonymous)\s+(?:Group|Choir|Chorus|Ensemble|Orchestra)\b/i.test(artist.profile))
											return Promise.resolve(mb.spa.anonymous);
										return Promise.reject(reason);
									})).then(mbid => {
										console.log(this.debugPrefix + 'Entity binding found:\n%s\n%s',
											[dcOrigin, discogsEntity(entity), discogsId].join('/') + '#' + discogsEntity(entity),
											[mbOrigin, entity, mbid, this.constructor.reviewSubpage].join('/'));
										notify(`MBID for ${entity} <b>${name}</b> found by ${this.constructor.methodName}`, this.constructor.notifyClass);
										return mbid;
									});
								}
							}

							class LookupByUniqueMatch extends LookupMethodBase {
								static methodName = 'unique match in both databases';
								static notifyClass = 'foundbyuniquematch';
								static supportedEntities = ['artist', 'label', 'series', 'place'];

								constructor(order) {
									super(order);
									if (!params.assignUncertain) return Promise.reject('Uncertain methods not allowed');
									return Promise.all([ // This is weak match
										dcApiRequest('database/search', {
											type: 'artist',
											q: stripDiscogsNameVersion(entry.name),
											per_page: 100,
										}),
										mbApiRequest(entity, { query: searchQueryBuilder(entity, entry, false), limit: 100 }),
									]).then(([dcData, mbData]) => {
										this.dcData = dcData.results;
										this.mbData = mbData[mbEntities(entity)];
										return this;
									});
								}

								exec() {
									function matchNames(resultsName) {
										const names = [resultsName, stripDiscogsNameVersion(entry.name)];
										if (sameStringValues(...names)) return true;
										if (!['label', 'place'].includes(entity)) return false;
										return sameStringValues(...names.map(name => name.replace(...rxBareLabel)));
									}

									const dcMatches = this.dcData.filter(result => matchNames(stripDiscogsNameVersion(result.title)));
									if (dcMatches.length != 1) return Promise.reject('Not unique occurence in Discogs database');
									console.assert(dcMatches[0].id == discogsId, entry, dcMatches[0], this.dcData);
									if (dcMatches[0].id != discogsId)
										return Promise.reject('Discogs ID does not match queried entity');
									const mbMatches = this.mbData.filter(result => matchNames(result.name));
									if (mbMatches.length != 1) return Promise.reject('Not unique occurence in MusicBrainz database');
									console.log(this.debugPrefix + 'Entity binding found:\n%s\n%s',
										[dcOrigin, discogsEntity(entity), discogsId].join('/') + '#' + discogsEntity(entity),
										[mbOrigin, entity, mbMatches[0].id, this.constructor.reviewSubpage].join('/'));
									openUncertain(mbMatches[0].id);
									notify(`MBID for ${entity} <b>${name}</b> found by ${this.constructor.methodName}`, this.constructor.notifyClass);
									return mbMatches[0].id;
								}
							}

							if (!name) name = await ProfileSimilarityLookup.dcDataResolver()
								.then(dcEntry => dcEntry.name || dcEntry.title, reason => entity + discogsId);
							const lookupMethods = [
								LookupByBackLink, LookupByCommonURL,
								BoldProfileSimilarityLookup,
								LookupByCommonRecordings1, LookupByCommonRecordings2,
								LookupByCommonReleases,
								LookupByCommonArtists,
								LookupByDiscogsRelative, LookupByMusicBrainzRelative,
								ArtistRecordingLookup,
								GuessSPA,
								WeakProfileSimilarityLookup,
								LookupByUniqueMatch,
							];
							const debugTrace = debugLogging > 1 ?
								Object.assign([ ], { entity: entity, discogsId: discogsId, name: name }) : undefined;
							const lookupWorker = (function lookupMethod(index = 0) {
								if (!(index < lookupMethods.length)) return Promise.reject('MBID not found by any lookup method');
								const lookupWorker = (async function(lookupMethod) {
									if (debugTrace) debugTrace[index] = { };
									lookupMethod = await new lookupMethod(index);
									console.assert(lookupMethod.exec instanceof Function, lookupMethod);
									if (!lookupMethod.exec) throw `Invalid lookup method (${index})`;
									if (debugLogging) console.debug('Executing %s %d (%s) lookup method by %s (%d)',
										entity, discogsId, name, lookupMethod.constructor.methodName, lookupMethod.order);
									if (debugTrace) debugTrace[index].lookupMethod = lookupMethod;
									return lookupMethod.exec();
								})(lookupMethods[index]);
								if (debugTrace) lookupWorker.then(
									mbid => { debugTrace[index].result = `Resolved (${mbid})` },
									reason => { debugTrace[index].result = `Rejected (${reason})` }
								);
								return lookupWorker.catch(function(reason) {
									if (Error.isError(reason)) {
										console.error(reason);
										alert(`Unexpected error (${Object.getPrototypeOf(reason).name})`);
									} else if (isFatalReason(reason)) return Promise.reject(reason);
									return lookupMethod(index + 1)
								});
							})();
							lookupWorker.then(mbid => { saveToCache(entity, discogsId, mbid) });
							if (debugTrace) lookupWorker.then(
								mbid => Object.assign(debugTrace, { result: `Resolved (${mbid})` }),
								reason => Object.assign(debugTrace, { result: `Rejected (${reason})` })
							).then(function(debugTrace) {
								console.debug('MBID lookup trace log: entity=%s, Discogs ID=%d, name=%s', entity, discogsId, name, debugTrace);
							});
							return lookupWorker;
						});
						lookupWorkers[entity].set(discogsId, lookupWorker);
						return lookupWorker;
					}
					function translateDiscogsMarkup(source, richFormat = true) {
						if (!source || !(source = source.trim())) return Promise.resolve(source);
						const entryTypes = { a: 'artist', r: 'release', m: 'master', l: 'label', u: 'user' };
						const mbEntity = key => ({ m: 'release-group' })[key] || entryTypes[key];
						const nameNormalizer = name => name
							&& stripDiscogsNameVersion(name.replace(/[\x00-\x1f]+/g, '').trim().replace(/\s+/g, ' '));
						const brackets = Array.from('[]', ch => `&#${ch.charCodeAt()};`);
						const link = (url, caption) => url && richFormat ? caption ?
							`[${encodeURI(url)}|${caption.replace(...mbWikiEncoder)}]` : `[${encodeURI(url)}]` : caption;
						return (function(body, replacer) {
							if (typeof body != 'string' || typeof replacer != 'function') throw new Error('Invalid argument');
							body = body && ['b', 'i', 'u'].reduce((str, tag, index) =>
								str.replace(new RegExp(`\\[(${tag})\\]([\\S\\s]*?)\\[\\/\\1\\]`, 'ig'), function(...m) {
									const markup = richFormat ? "'".repeat({ 0: 3, 1: 2, 2: 0 }[index]) : '';
									return markup + m[2] + markup;
								}), body);
							if (richFormat) body = body.replace(/\[(?![armlutg](?:=[^\[\]]+|\d+)\]|(?:url|img)=|\/?url\])([^\[\]]*)\]/ig,
								`${brackets[0]}$1${brackets[1]}`);
							const entryExtractors = [/\[([armlu])=?(\d+)\]/ig, /\[([armlu])=(?!\d+\])([^\[\]]+)\]/ig];
							let lookupWorkers = [ ], match;
							while ((match = entryExtractors[0].exec(body)) != null) {
								const en1 = { key: match[1].toLowerCase(), id: parseInt(match[2]) };
								console.assert(en1.id > 0, match);
								if (!lookupWorkers.some(en2 => en2.key == en1.key && en2.id == en1.id)) lookupWorkers.push(en1);
							}
							while ((match = entryExtractors[1].exec(body)) != null) {
								const en1 = { key: match[1].toLowerCase(), name: match[2] };
								if (!lookupWorkers.some(en2 => en2.key == en1.key && en2.name == en1.name)) lookupWorkers.push(en1);
							}
							return (lookupWorkers = lookupWorkers.map(function(entry) {
								console.assert(entry instanceof Object);
								let promise = entry.id > 0 ? Promise.resolve(entry.id) : entry.name ? GlobalXHR.head(encodeURI([dcOrigin, entryTypes[entry.key], encodeURIComponent(entry.name)].join('/'))).then(function({finalUrl}) {
									const discogsId = discogsIdExtractor(finalUrl, entryTypes[entry.key]);
									return discogsId > 0 ? discogsId : Promise.reject(`Discogs ID could not be resolved from name "${entry.name}"`);
								}) : Promise.reject('Unresolvable Discogs entry');
								const discogsEntry = promise.then(discogsId => dcApiRequest(`${entryTypes[entry.key]}s/${discogsId}`));
								const idOrName = entry[entry.id > 0 ? 'id' : 'name'];
								const dcEntryAdapter = result => ({
									key: entry.key, idOrName: idOrName, resolvedId: result.id,
									caption: result.name ? nameNormalizer(result.name) : result?.title?.trim(),
								});
								if (richFormat) {
									promise = discogsEntry.then(discogsEntry => findMBID(mbEntity(entry.key), discogsEntry.id, discogsEntry));
									// if ('a'.includes(entry.key)) promise = promise.catch(reason => isFatalReason(reason) ?
									// 	Promise.reject(reason) : discogsEntry.then(guessSPA_Discogs));
									promise = promise.then(mbid => mbApiRequest(mbEntity(entry.key) + '/' + mbid, { inc: 'url-rels' }).then(mbEntry => ({
										key: entry.key, idOrName: idOrName, resolvedId: mbEntry.id,
										caption: mbEntry.name || mbEntry.title,
									}))).catch(reason => discogsEntry.then(dcEntryAdapter));
								} else promise = discogsEntry.then(dcEntryAdapter);
								if (entry.name) promise = promise.catch(reason => ({
									key: entry.key, idOrName: entry.name,
									caption: capitalizeName(stripDiscogsNameVersion(entry.name)),
								}));
								return promise.catch(function(reason) {
									console.warn('Discogs entry %o resolution failed completely (%s)', entry, reason);
									return null;
								});
							})).length > 0 ? Promise.all(lookupWorkers).then(function(entries) {
								const lookupTable = { };
								for (let entry of entries) if (entry && entry.key && entry.idOrName) {
									if (!(entry.key in lookupTable)) lookupTable[entry.key] = { };
									lookupTable[entry.key][entry.idOrName] = { caption: entry.caption, id: entry.resolvedId };
								}
								return Object.keys(lookupTable).length > 0 ? lookupTable : Promise.reject('Nothing was resolved');
							}).then(lookupTable => body.replace(entryExtractors[0], function(match, key, id) {
								const entry = lookupTable?.[key = key.toLowerCase()]?.[id = parseInt(id)];
								if (entry) return replacer(key, entry.id || id, entry.caption);
								console.warn('Discogs item not resolved:', match);
								return replacer(key, id);
							}).replace(entryExtractors[1], function(match, key, name) {
								const entry = lookupTable?.[key = key.toLowerCase()]?.[name];
								if (entry) return replacer(key, entry.id || name,
									entry.caption || capitalizeName(stripDiscogsNameVersion(entry.name)));
								console.warn('Discogs item not resolved:', match);
								return replacer(key, name, capitalizeName(stripDiscogsNameVersion(entry.name)));
							}), reason => body) : Promise.resolve(body);
						})(source, richFormat ? function replacer(key, id, caption) {
							if (!key || !id) throw new Error('Invalid argument');
							return mbEntity(key) && rxMBID.test(id) ? caption ?
								`[${mbEntity(key)}:${id}|${caption.replace(...mbWikiEncoder)}]`
								: link([mbOrigin, mbEntity(key), id].join('/'))
								: link([dcOrigin, entryTypes[key], encodeURIComponent(id)].join('/'), caption);
						} : (key, id, caption) => caption || entryTypes[key] + id).catch(function(reason) {
							console.error(reason); // assertion failed
							return source;
						}).then(source => [ // static substitutions
							[/\[url=([^\[\]\r\n]+)\]([^\[\]\r\n]*)\[\/url\]/ig, function(m, url, caption) {
								if (richFormat) try {
									url = new URL(url.trim(), dcOrigin);
									return link(url.href, caption);
								} catch(e) { console.warn('Invalid Discogs link:', url) }
								return caption || url.trim();
							}], [/\[url\]([^\[\]\r\n]+)\[\/url\]/ig, function(m, url) {
								if (richFormat) try {
									url = new URL(url.trim(), dcOrigin);
									return link(url.href);
								} catch(e) { console.warn('Invalid Discogs link:', url) }
								return url.trim();
							}], [/\[img=([^\[\]\r\n]+)\]/ig, richFormat ? (m, url) => link(url.trim()) : '$1'],
							[/\[t=?(\d+)\]/ig, richFormat ? `[${dcOrigin}/help/forums/topic?topic_id=$1]` : `${dcOrigin}/help/forums/topic?topic_id=$1`],
							[/\[g=?([^\[\]\r\n]+)\]/ig, richFormat ? `[${dcOrigin}/help/guidelines/$1]` : `${dcOrigin}/help/guidelines/$1`],
							[/[ \t]+$/gm, ''], [/(?:\r?\n){2,}/g, '\n\n'],
						].reduce((str, substitution) => str.replace(...substitution), source));
					}
					function purgeArtists(fromIndex = 0) {
						const artistSuffixes = ['mbid', 'name', 'artist.name', 'join_phrase'];
						const key = (ndx, sfx) => `artist_credit.names.${ndx}.${sfx}`;
						for (let ndx = 0; artistSuffixes.some(sfx => formData.has(key(ndx, sfx))); ++ndx)
							artistSuffixes.forEach(sfx => { formData.delete(key(ndx, sfx)) });
					}
					function namedBy(entity, artist, ...components) {
						if (!(entity instanceof Object)) return false;
						if (!(artist instanceof Object) || artist.id == 194) return false;
						if (components.length <= 0) components.push('name', 'alias');
						const entityTester = (root, fn) => {
							if (!(root instanceof Object) || typeof fn != 'function') return false;
							const _fn = name => name && fn(name.split(/[^\p{L}\w\d]+/u).filter(Boolean)
								.map(name => toASCII(name).toLowerCase()));
							if (components.includes('name') && _fn(stripDiscogsNameVersion(root.name))) return true;
							if (components.includes('realname') && _fn(root.realname)) return true;
							if (components.includes('anv') && root.namevariations && root.namevariations.some(_fn)) return true;
							if (components.includes('anv') && _fn(root.anv)) return true;
							if (components.includes('alias') && root.aliases && root.aliases.some(alias =>
									_fn(stripDiscogsNameVersion(alias.name)))) return true;
							return false;
						};
						return entityTester(entity, entity => entityTester(artist, artist =>
							artist.length > 0 && artist.every(namePart => entity.includes(namePart))));
					}
					function getArtistDiscographyStats(discogsId, anv) {
						if (!((discogsId = parseInt(discogsId)) > 0)) throw 'invalid argument';
						let key = discogsId.toString();
						if (anv) key += '|' + anv;
						if (artistDiscographyStats.has(key)) return artistDiscographyStats.get(key);
						const promise = reactRequest('artist', discogsId, 'ArtistDiscographySidebarData', {
							discogsId: discogsId,
							anv: anv || '',
							excludeAnvs: false,
						}).then(data => Object.freeze(data.artist.discographyStatistics));
						artistDiscographyStats.set(key, promise);
						return promise;
					}
					function guessArtistProfile(categories, ...thresholds) {
						function creditMapper(creditType) {
							if (creditType) creditType = creditType.toLowerCase(); else return;
							const substitutions = {
								// main categories
								'Technical': 'audio technician', 'Visual': 'visual artist',
								/* vague */ 'Featuring & Presenting': undefined, 'Instruments & Performance': undefined,
								// performance
								'Instruments': 'musician', 'Performer [Instruments]': 'musician',
								/* vague */ 'Featuring': undefined, 'Guest': undefined, 'Performer': undefined,
								// instruments
								'Guitar': 'guitarist', 'Drums': 'drummer', 'Percussion': 'percussionist', 'Double Bass': 'bassist',
								'Drum': 'drummer', 'Keyboards': 'keyboardist', 'Organ': 'organist', 'Piano': 'pianist',
								'Synthesizer': 'keyboardist', 'Acoustic Bass': 'bassist', 'Acoustic Guitar': 'guitarist',
								'Bass Guitar': 'bassist', 'Cello': 'cellist', 'Contrabass': 'bassist', 'Electric Bass': 'bassist',
								'Electric Guitar': 'guitarist', 'Harp': 'harpist', 'Steel Guitar': 'guitarist',
								'Viola': 'violist', 'Violin': 'violinist', 'Accordion': 'accordionist', 'Brass': 'wind player',
								'Clarinet': 'clarinetist', 'Flute': 'flutist', 'Harmonica': 'harmonica player', 'Horn': 'hornist',
								'Horns': 'hornist', 'Oboe': 'oboist', 'Saxophone': 'saxophonist', 'Trumpet': 'trumpetist',
								'Tuba': 'tuba player', 'Bass': 'bassist', 'Fiddle': 'fiddler', 'Tenor Saxophone': 'saxophonist',
								'Trombone': 'trombonist',
								// vocals
								'Voice': 'vocalist', 'Vocals': 'vocalist', 'Alto Vocals': 'vocalist', 'Backing Vocals': 'backing vocalist',
								'Baritone Vocals': 'vocalist', 'Bass Vocals': 'vocalist', 'Bass-Baritone Vocals': 'vocalist',
								'Contralto Vocals': 'vocalist', 'Countertenor Vocals': 'tenorist', 'Harmony Vocals': 'vocalist',
								'Lead Vocals': 'vocalist', 'Mezzo-soprano Vocals': 'mezzo-sopranist', 'Solo Vocal': 'solo vocalist',
								'Soprano Vocals': 'sopranist', 'Tenor Vocals': 'tenorist', 'Treble Vocals': 'vocalist', 'Whistling': 'vocalist',
								'Choir': 'choir vocal', 'Chorus': 'choir vocal', 'Coro': 'choir vocal', 'Caller': 'vocalist', 'Eefing': 'vocalist',
								'Human Beatbox': 'vocalist (beatbox)', 'Humming': 'vocalist', 'Kakegoe': 'vocalist', 'Shouts': 'vocalist',
								'Overtone Voice': 'vocalist', 'Rap': 'rapper', 'Satsuma': 'vocalist', 'Scat': 'vocalist',
								'Toasting': 'vocalist', 'Vocal Percussion': 'vocalist', 'Vocalese': 'vocalist', 'Yodeling': 'vocalist',
								'Speech': 'speaker', 'Proofreader': 'speaker', 'Read By': 'speaker', 'Commentator': 'speaker',
								'Dialog': 'speaker', 'Text By': 'speaker', 'Overdubbed By': 'speaker',
								// writing
								'Written By': 'songwriter', 'Written-By': 'songwriter', 'Author': 'songwriter',
								'Composed By': 'composer', 'Music By': 'composer', 'Score': 'composer',
								'Lyrics By': 'lyricist', 'Lyrics-By': 'lyricist', 'Words By': 'lyricist', 'Words-By': 'lyricist',
								'Libretto By': 'librettist', 'Translated By': 'translator', 'Translated-By': 'translator',
								// technical
								'Field Recording': 'field recordist', 'Mastered By': 'mastering engineer', 'Mastered-By': 'mastering engineer',
								'Mixed By': 'mixing engineer', 'Mixed-By': 'mixing engineer', 'Remastered By': 'mastering engineer',
								'Remastered-By': 'mastering engineer', 'Engineer [Mastering]': 'mastering engineer', 'Engineer [Mix]': 'mixing engineer',
								'Engineer [Transfer]': 'audio engineer', 'Transfer Engineer': 'audio engineer', 'Transferred By': 'audio engineer',
								'Mix Engineer': 'mixing engineer', 'Recorded By': 'recording engineer', 'Recorded-By': 'recording engineer',
								'Engineer [Recording]': 'recording engineer', 'Engineer [Recording Engineer]': 'recording engineer',
								'Engineer [Programming]': 'audio engineer', 'Engineer [Audio]': 'audio engineer', 'Engineer [Editor]': 'editor',
								'Engineer [Balance]': 'audio engineer', 'Programmed By': 'programming engineer', 'Programmed-By': 'programming engineer',
								'Sequenced By': 'programming engineer', 'Sequenced-By': 'programming engineer', 'Engineer [Sound]': 'sound engineer',
								'Lacquer Cut By': 'audio engineer', 'Lathe Cut By': 'audio engineer', 'Lathe Designer': 'audio engineer',
								'Tracking By': 'audio technician', 'Technician': 'audio technician',
								// visual
								'Artwork': 'visual artist', 'Artwork By': 'visual artist', 'Cover': 'visual artist', 'Calligraphy': 'graphic designer',
								'Design Concept': 'graphic designer', 'Graphics': 'graphic designer', 'Layout': 'visual artist',
								'Image Editor': 'visual artist', 'Lettering': 'visual artist', 'Lithography': 'visual artist',
								'Logo': 'graphic designer', 'Model': 'visual artist',  'Drawing': 'visual artist', 'Painting': 'painter',
								'Sleeve': 'visual artist', 'Typography': 'visual artist', 'Photography': 'photographer', 'Photography By': 'photographer',
								'Design': 'graphic designer', 'Graphic Design': 'graphic designer', 'Illustration': 'illustrator', 'Artwork [Illustration By]': 'illustrator',
								'Artwork [Illustrations By]': 'illustrator', 'Artwork [Illustration]': 'illustrator', 'Artwork [Illustrations]': 'illustrator',
								'Artwork [Design By]': 'graphic designer', 'Artwork [Design]': 'graphic designer', 'Lighting': 'visual technician',
								// other
								'DJ Mix': 'DJ', 'DJ-Mix': 'DJ', 'Remix': 'remixer', 'Compiled By': 'compiler', 'Compiled-By': 'compiler',
								'Collected By': 'compiler', 'Collected-By': 'compiler', 'Orchestrated By': 'orchestrator', 'Adapted By': 'arranger',
								'Adapted-By': 'arranger', 'Adapted By (Text)': 'arranger', 'Arranged By': 'arranger', 'Arranged-By': 'arranger',
								'Arranged By [Vocal]': 'arranger', 'Edited By': 'editor', 'Edited-By': 'editor', 'Compilation Producer': 'producer',
								'Produced By': 'producer', 'Produced-By': 'producer', 'Co-producer': 'producer', 'Executive Producer': 'producer',
								'Executive-Producer': 'producer', 'Reissue Producer': 'producer', 'Post Production': 'producer',
								'Music-Director': 'music director', 'Tape Op': 'tape operator', 'Directed By [Music Director]': 'music director',
								'Concept By': 'creative director', 'Concept-By': 'creative director', 'Art Direction': 'artistic director',
								'A&R': 'A&R manager', 'Legal': 'legal representative', 'Booking': 'booking manager', 'Supervised-By': 'supervisor',
								'Animation': 'animator', 'Directed By': 'director', 'Directed-By': 'director', 'Transcription By': 'transcriptor',
								'Transcription-By': 'transcriptor', 'Musical Assistance': 'musical assistant', 'Curated By': 'curator',
								'Curated-By': 'curator', 'Research': 'researcher', 'Supervised By': 'supervisor', 'Choreography': 'choreographer',
								'Accompanied By': 'accompanist', 'Instrumentation By': 'instrumentator', 'Commissioned By': 'commisioner',
								'Commissioned-By': 'commisioner', 'Management': 'manager', 'Promotion': 'promoter',
								'Public Relations': 'PR manager', 'Filmed By': 'filmmaker', 'Footage By': 'camera operator',
								'Script By': 'script writer', 'Script-By': 'script writer', 'Make-Up': 'stylist', 'Hair': 'stylist',
								'Liner Notes': 'liner notes related',
							};
							const key = Object.keys(substitutions).find(key => key.toLowerCase() == creditType);
							return key ? substitutions[key] : creditType.replace(...untitleCase);
						}

						const categoryTotal = category => Object.values(categories[category])
							.reduce((sum, totalCount) => sum + (totalCount || 0), 0);
						const total = Object.keys(categories).reduce((sum, majorRole) => sum + categoryTotal(majorRole), 0);
						let majorRoles = { };
						for (let category in categories) {
							const credits = { }, subtotal = categoryTotal(category);
							for (let credit in categories[category]) {
								const _credit = creditMapper(credit);
								if (!_credit) continue; else if (!(_credit in credits)) credits[_credit] = 0;
								credits[_credit] += categories[category][credit];
							}
							const majorKeys = Object.keys(credits).filter(credit => credits[credit] * (thresholds[0] || 5) > total);
							if (majorKeys.length > 0) for (let key of majorKeys) {
								if (!(key in majorRoles)) majorRoles[key] = 0;
								majorRoles[key] = credits[key];
							} else if (subtotal * (thresholds[1] || 3) > total) {
								const key = creditMapper(category);
								if (!key) continue; else if (!(key in majorRoles)) majorRoles[key] = 0;
								majorRoles[key] += subtotal;
							}
						}
						if ((majorRoles = Object.keys(majorRoles).sort((a, b) => majorRoles[b] - majorRoles[a])).length > 0)
							return [majorRoles.pop(), majorRoles.join(', ')].filter(Boolean).reverse().join(' and ');
					}
					function getArtistDiscographyReleases(discogsId) {
						if (!((discogsId = parseInt(discogsId)) > 0)) throw new Error('Invalid argument');
						const headersForType = (type, names) => names.map(name =>
							({ headerName: name, headerType: type.toUpperCase() }));
						const perPage = 500;
						const getPage = (page = 1) => reactRequest('artist', discogsId, 'ArtistDiscographyData', {
							discogsId: discogsId,
							page: page, perPage: perPage, field: 'YEAR', direction: 'ASC',
							category: '', name: '', anv: '', search: '', excludeAnvs: false,
							countries: [ ], years: [ ], formats: [ ], labels: [ ],
						}).then(function(data) {
							const releaseGroups = data.artist.releases2.releaseGroups;
							return data.artist.releases2.totalCount > page * perPage ?
								getPage(page + 1).then(Array.prototype.concat.bind(releaseGroups)) : releaseGroups;
						});
						return getPage().then(function(releaseGroups) {
							const rgs = { };
							releaseGroups.forEach(function(rg) {
								if (!(rg.releaseType in rgs)) rgs[rg.releaseType] = [ ];
								rgs[rg.releaseType].push(Object.freeze(rg.displayRelease));
							});
							return Object.freeze(rgs);
						});
					}
					function getCollaborationsWith(artist, releaseGroups, minCount = 1, multiplier = 3) {
						if (!artist || !releaseGroups) throw new Error('Invalid argument');
						const rxDropPhrase = new RegExp(`^\\s*(?:${phrases.feat}|With|W\\/)\\s*$`, 'i');
						let primaryArtists = Object.values(releaseGroups).map(displayReleases => displayReleases.map(function(displayRelease) {
							if (!displayRelease.primaryArtists) return [ ];
							let dropFeatArtists = false;
							return displayRelease.primaryArtists.filter(function(primaryArtist) {
								if (!('artist' in primaryArtist) || dropFeatArtists) return false;
								if (rxDropPhrase.test(primaryArtist.joiningText)) dropFeatArtists = true;
								if ([artist.id, 194, 355, 118760, 598667, 967691, 3538550, 5942241]
										.includes(primaryArtist.artist.discogsId)) return false;
								if (['aliases', 'groups', 'members'].some(category => category in artist && artist[category]
										.some(relative => relative.id == primaryArtist.artist.discogsId))) return false;
								return true;
							}).map(primaryArtist => primaryArtist.artist);
						})).flat(2);
						const uniqueArtists = (primaryArtist, index, primaryArtists) =>
							primaryArtists.findIndex(pA => pA.discogsId == primaryArtist.discogsId) == index;
						const totalCount = primaryArtists.filter(uniqueArtists).length;
						primaryArtists = primaryArtists.filter(function(pa1, index, primaryArtists) {
							const count = primaryArtists.filter(pa2 => pa2.discogsId == pa1.discogsId).length;
							if (count < minCount || count * multiplier / primaryArtists.length < 1) return false;
							return true;
						});
						if (primaryArtists.length <= 0) return Promise.reject('No significant collaborating artist found');
						const artistCount = artist => primaryArtists.filter(pA => pA.discogsId == artist.discogsId).length;
						primaryArtists.sort((a, b) => artistCount(b) - artistCount(a));
						return Object.assign(primaryArtists.filter(uniqueArtists), { totalCount: totalCount });
					}
					function vocalResolver(creditType) {
						let attribute, ap = new AttributeParser(creditType, 'vocal');
						switch (ap.creditType) {
							case 'Vocals': case 'Vocal': attribute = { id: 'd92884b7-ee0c-46d5-96f3-918196ba8c5b' }; break;
							case 'Alto Vocals': attribute = { id: '9f63c4ba-b76f-40d5-9e99-2fb08bd4c286' }; break;
							case 'Backing Vocals': attribute = { id: '75052401-7340-4e5b-a71d-ea024a128849' }; break;
							case 'Baritone Vocals': attribute = { id: 'a40b43ed-2722-4b4a-98a5-478283cdf8df' }; break;
							case 'Bass Vocals': attribute = { id: '1bfdb77e-f339-4e8e-9627-331ca9d9e920' }; break;
							case 'Bass-Baritone Vocals': attribute = { id: '629763ee-3dc7-4225-b209-0ebb6d49bfab' }; break;
							case 'Contralto Vocals': attribute = { id: '80d94f2e-e38f-4561-add2-c866f083d276' }; break;
							case 'Countertenor Vocals': attribute = { id: '435a19f5-55dc-4a08-8c59-4257680b4217' }; break;
							case 'Lead Vocals': attribute = { id: '8e2a3255-87c2-4809-a174-98cb3704f1a5' }; break;
							case 'Mezzo-soprano Vocals': attribute = { id: 'f81325d7-593c-4197-b776-4f8a62c67a8e' }; break;
							case 'Soprano Vocals': attribute = { id: 'e88f0be8-a07e-4c0d-bd06-e938eea4d5f6' }; break;
							case 'Tenor Vocals': attribute = { id: '122c11da-651f-46cc-9118-c523a14afa1d' }; break;
							case 'Treble Vocals': attribute = { id: '433631a2-68b7-49e6-90b4-5af19e26fc75' }; break;
							case 'Whistling': attribute = { id: 'ed220196-6250-456d-ab7b-465bee605b16' }; break;
							case 'Choir': case 'Chorus': case 'Coro': attribute = { id: '43427f08-837b-46b8-bc77-483453af6a7b' }; break;
							// spoken vocals
							case 'Speech': case 'Narrator': case 'Commentator': case 'Dialog': case 'Text By': case 'Interviewer':
							case 'Interviewee': case 'Proofreader': case 'Read By': case 'Voice Actor': case 'Overdubbed By':
								attribute = {
									id: 'd3a36e62-a7c4-4eb9-839f-adfebe87ac12',
									creditedAs: ap.creditType.replace(...untitleCase),
								};
								break;
							// other vocals
							case 'Caller': case 'Eefing': case 'Harmony Vocals': case 'Human Beatbox': case 'Humming':
							case 'MC': case 'Overtone Voice': case 'Rap': case 'Satsuma': case 'Scat': case 'Toasting':
							case 'Kakegoe': case 'Vocal Percussion': case 'Vocalese': case 'Yodeling': case 'Shouts':
							case 'Voiceovers':
								attribute = {
									id: 'c359be96-620a-435c-bd25-2eb0ce81a22e',
									creditedAs: ap.creditType.replace(...untitleCase),
								};
								break;
						}
						if (attribute) attribute = [attribute]; else return null;
						if (ap.isModified) Array.prototype.push.apply(attribute, ap.modifiers);
						return attribute;
					}

					const relateAtLevel = entity => Boolean({
						'work': params.workRelations,
						'recording': params.recordingRelations,
						'release': params.releaseRelations,
						'release-group': params.rgRelations,
					}[entity]);
					const relateAtAnyLevel = ['work', 'recording', 'release', 'release-group'].some(relateAtLevel);
					if (['recording', 'work'].some(relateAtLevel)) params.tracklist = true;
					if (params.createMissingEntities) params.assignUncertain = true;
					const rxMLang = /^(.+?)\s*=\s*(.+)$/, literals = { }, openedForEdit = new Set, credits = { };
					const workers = [ ], lookupIndexes = { }, lookupHints = { };
					const lookupWorkers = { }, artistLookupWorkers = { }, rgLookupWorkers = [ ];
					const discogsName = (entity, discogsId) => (entity in lookupIndexes && discogsId in lookupIndexes[entity] ?
						Promise.resolve(lookupIndexes[entity][discogsId].name)
							: dcApiRequest(`${discogsEntity(entity)}s/${discogsId}`).then(discogsEntry =>
								discogsEntry.name || discogsEntry.title, reason => entity + '#' + discogsId)).then(name => '<b>' + name + '</b>');
					const matchNameVariant = (artist, nameVariant) => artist && nameVariant
						&& (artist.name && sameStringValues(stripDiscogsNameVersion(artist.name), nameVariant)
						|| artist.namevariations && artist.namevariations.some(anv => sameStringValues(anv, nameVariant))
						|| artist.anv && sameStringValues(artist.anv, nameVariant));
					const hasType = (...types) => types.some(type => formData.getAll('type').includes(type));
					const trackPosMapper = trackPos => (trackPos || '').toString()
						.replace(/(?<!\d)(\d+)(?!\d)/g, (...m) => m[1].padStart(3, '0')).replace(/\W+/g, '').toUpperCase();
					const noCreditAsArtists = [194 /* VA */, 118760 /* No Artist */, 151641 /* Traditional */];
					const weakArtistIds = [194, 355, 118760, 598667, 967691, 3538550, 5942241];
					const weakArtistTest = artist => weakArtistIds.includes(artist.id)
						|| /\b(?:Cast|Disney)\b/i.test(stripDiscogsNameVersion(artist.name));
					const guessSPA_Discogs = artist => guessSPA(artist).catch(reason => dcApiRequest('artists/' + artist.id).then(function(artist) {
						if (/^(?:An?\s+)?(?:Unidentified|Anonymous)\s+(?:Group|Choir|Chorus|Ensemble|Orchestra)\b/i.test(artist.profile))
							return Promise.resolve(mb.spa.anonymous);
						return Promise.reject(reason);
					}));
					const isFatalReason = reason => /^(?:Ambiguity)\b/.test(reason);
					const getDiscogsReleases = (entity, discogsId, page = 1) => dcApiRequest(`${discogsEntity(entity)}s/${discogsId}/releases`, {
						page: page,
						per_page: 500,
					}).then(function(response) {
						if (debugLogging && response.pagination.page > 1 && response.pagination.page % 50 == 0)
							console.info('getDiscogsReleases %s/%d page %d/%d', discogsEntity(entity), discogsId, response.pagination.page, response.pagination.pages);
						return !(response.pagination.pages > response.pagination.page) ? response.releases
							: getDiscogsReleases(entity, discogsId, response.pagination.page + 1)
								.then(Array.prototype.concat.bind(response.releases));
					});
					const artistDiscographyStats = new Map, openedIds = { };
					const printArtistMBIDs = mbids => Object.keys(mbids).map(mbid =>
						[mbOrigin, 'artist', mbid, 'recordings'].join('/') + ' => ' + mbids[mbid]);
					formData.set('name', normSeedTitle(release.title));
					//frequencyAnalysis(literals, release.title);
					const released = dateParser(release.released);
					discogsCountryToIso3166Mapper(release.country).forEach(function(countryCode, countryIndex) {
						if (countryCode) formData.set(`events.${countryIndex}.country`, countryCode);
						if (released != null) {
							function setDate(index, part) {
								const key = `events.${countryIndex}.date.${part}`;
								if ((index = released[index]) > 0) formData.set(key, index);
								else formData.delete(key);
							}
							setDate(0, 'year'); setDate(1, 'month'); setDate(2, 'day');
						}
					});
					const dynamicIdResolvers = Object.defineProperties({ }, {
						releaseDateCmp: { value: function(year, month, day) {
							const digits = (datePart, digits) => (datePart || 0).toString().padStart(digits, '0');
							return (digits(released[0], 4) + digits(released[1], 2) + digits(released[2], 2))
								.localeCompare(digits(year, 4) + digits(month, 2) + digits(day, 2));
						} },
						label: { writable: false, value: class {
							static get 1003() { // BMG
								if (released) if (released[0] <= 2004) return '29d7c88f-5200-4418-a683-5c94ea032e38';
								else if (released[0] >= 2008) return '82ef9b02-7b42-49fe-a6bc-0d8ba816d72f';
								else return null;
							}
							static get 5870() { return null } // Metronome
							static get 51167() { // Rough Trade
								if (released) if (released[0] < 2000) return '71247f6b-fd24-4a56-89a2-23512f006f0c';
								else if (released[0] >= 2000) return '2276f06e-f65a-4d61-9dee-9f95ff4b775c';
							}
							static get 275182() { // Chem19
								if (released) if (released[0] < 2005) return '32a3c0b8-e2b8-4b44-afe1-56389455aab4';
								else if (released[0] >= 2005) return 'ef1f87b8-c502-41b8-9549-b21125feeec1';
								else return null;
							}
							static get 91862() { // Bellwood Records JP
								if (released) if (released[0] >= 1971 && released[0] <= 1978) return 'ab2f1e88-f092-40d6-ab77-4a3f98765b98';
								else if (dynamicIdResolvers.releaseDateCmp(1998, 6) > 0) return '0eeefe83-dda2-4523-976c-a12f75ce5671';
								return null;
							}
							static get 264249() { // Hanseatic Musikverlag GmbH
								if (released) if (released[0] >= 1964 && released[0] < 2001) return '9aaea7df-24a4-4d21-bb9e-2145f1193e63';
								else if (released[0] >= 2001 && released[0] < 2017) return '9a51342c-eac5-4519-b566-5d91dbe307c4';
								else if (released[0] >= 2017) return 'cce2ea70-c7bc-435b-b707-f151b4d978d1';
								return null;
							}
						}, enumerable: true },
						place: { writable: false, value: class {
							static get 186075() { // The Mastering Lab
								return released ? dynamicIdResolvers.releaseDateCmp(2008, 4, 11) <= 0 ?
									'b6923040-0288-4b51-a5b5-b715fe72f732' : 'bf1ca6a6-8504-415d-80ec-4baf860e4ac4' : null;
							}
							static get 264170() { // West West Side Music
								if (released) if (released[0] <= 2005) return '80f07bd4-8b39-43ca-b25f-ed10722ac263';
								else if (released[0] > 2005 && released[0] <= 2017) return '6d29692e-dc61-4d90-8521-2bfb28025a58';
								else if (released[0] > 2017) return 'f34e14a5-4ebd-4d3d-8648-9ef94cfb3d16';
								else return null;
							}
							static get 264299() { // Universal Mastering Studios
								if (released) if (released[0] <= 2005) return '473be66d-81a0-48ed-ac91-95e5191fdcf4';
								else if (released[0] > 2005) return '07f34ce9-eed4-459b-bb34-d817be1a0d9e';
								else return null;
							}
							static get 265254() { // Albert Studios
								if (released) if (released[0] < 1985) return '9a23510d-7902-4e53-a962-99ca058f1f83';
								else if (released[0] >= 1985) return 'da44b506-e658-461f-8089-58f5a1b91b95';
								else return null;
							}
							static get 270481() { // Sweet Silence Studios
								if (released) if (released[0] < 1999) return '6c8242be-15e4-466f-a3ac-85d34ead102f';
								else if (released[0] < 2018) return '32c2b16a-3c70-4385-9205-8b0d3961a6a6';
								else return 'bf75b543-bc32-453d-85af-e8263cca7e34';
							}
							static get 273134() { // Windmill Lane Studios
								if (released) if (released[0] < 1990) return '475c24aa-2497-4bb0-8cca-44d8c86f9699';
								else if (released[0] >= 1990) return '89d094a8-243d-4139-92c7-8072b1e5314d';
								else return null;
							}
							static get 326811() { // American Recording Co.
								if (released) if (released[0] <= 1982) return '8b804c21-2db4-4da3-b850-4468e39f8e49';
								else if (released[0] >= 1984) return '0112d9a7-7e5c-4fae-b128-969f79fde070';
								else return null;
							}
							static get 517104() { // The Blue Note, Chicago
								if (released) if (released[0] <= 1953) return 'd3d3dc0e-1e5f-4b08-9bec-e4bee33bbdfd';
								else if (released[0] >= 1954) return '327c29c6-da63-4dc9-a117-1917ee691ce4';
								else return null;
							}
							static get 288544() { // MSL-studio
								if (released) if (released[0] < 1981) return '8f4cadd5-0c58-4472-886b-ac9ec693bcf8';
								else return 'dad34ef9-980e-4039-97a8-aec19a19e5c1';
							}
							static get 271798() { // Trutone Mastering Labs
								if (released) if (released[0] < 2008) return '9d4357ab-73a5-4714-8b3b-acaac9fa59d2';
								else return 'f3b735b2-5f73-45a5-9656-eb1bc2a0f6ca';
							}
							static get 339817() {
								if (released) if (released[0] < 2018) return '1aa0ea27-8097-4bc7-8717-61f416e783a3';
								else return '0a96582f-135b-4bb5-b058-ca46520b7e8c';
							}
						}, enumerable: true },
					});
					let defaultFormat, descriptors = new Set, media, annotation = [ ];
					const getArtistCreditTypes = (discogsId, quota = 1) => getArtistDiscographyStats(discogsId).then(function(discographyStats) {
						if (!discographyStats.credits || discographyStats.credits.count <= 0)
							return Promise.reject('No credits for artist');
						else if (discographyStats.credits.count < (discographyStats.releases.count + discographyStats.unofficial.count) * quota) {
							if (debugLogging) console.debug('Artist id %d crediting roles in minority:', discogsId, discographyStats);
							return Promise.reject('Crediting roles in minority');
						} else return Object.assign.apply(this, discographyStats.credits.creditHeaders.map(creditHeader =>
							({ [creditHeader.name]: Object.assign.apply(this, creditHeader.credits.map(credit =>
									({ [credit.name]: credit.count }))) })));;
					});
					const relationsMapping = Object.freeze({
						artist: caselessProxy({
							// performance
							'Performer': 'performer', 'Guest': 'performer', 'Soloist': 'performer',
							'Instruments': 'instrument', 'Performer [Instruments]': 'instrument', 'Musician': 'instrument',
							'Orchestra': 'performing orchestra', 'Ensemble': 'performing orchestra', 'Band': 'performing orchestra',
							'Backing Band': 'performing orchestra', 'Brass Band': 'performing orchestra', 'Concert Band': 'performing orchestra',
							'Conductor': 'conductor', 'Chorus Master': 'chorus master',
							// vocals
							'Voice': 'vocal', 'Vocals': 'vocal', 'Alto Vocals': 'vocal', 'Backing Vocals': 'vocal',
							'Baritone Vocals': 'vocal', 'Bass Vocals': 'vocal', 'Bass-Baritone Vocals': 'vocal',
							'Contralto Vocals': 'vocal', 'Countertenor Vocals': 'vocal', 'Harmony Vocals': 'vocal',
							'Lead Vocals': 'vocal', 'Mezzo-soprano Vocals': 'vocal', 'Solo Vocal': 'vocal',
							'Soprano Vocals': 'vocal', 'Tenor Vocals': 'vocal', 'Treble Vocals': 'vocal', 'Whistling': 'vocal',
							'Choir': 'vocal', 'Chorus': 'vocal', 'Coro': 'vocal', 'Caller': 'vocal', 'Eefing': 'vocal',
							'Human Beatbox': 'vocal', 'Humming': 'vocal', 'Kakegoe': 'vocal', 'MC': 'vocal',
							'Overtone Voice': 'vocal', 'Rap': 'vocal', 'Satsuma': 'vocal', 'Scat': 'vocal', 'Speech': 'vocal',
							'Narrator': 'vocal', 'Proofreader': 'vocal', 'Interviewee': 'vocal', 'Interviewer': 'vocal',
							'Toasting': 'vocal', 'Vocal Percussion': 'vocal', 'Vocalese': 'vocal', 'Yodeling': 'vocal',
							'Read By': 'vocal', 'Commentator': 'vocal', 'Dialog': 'vocal', 'Voice Actor': 'vocal',
							'Shouts': 'vocal', 'Text By': 'vocal', 'Overdubbed By': 'vocal',
							// writing & arrangement
							'Songwriter': 'writer', 'Written By': 'writer', 'Written-By': 'writer', 'Author': 'writer',
							'Composed By': 'composer', 'Music By': 'composer', 'Score': 'composer',
							'Lyrics By': 'lyricist', 'Lyrics-By': 'lyricist', 'Words By': 'lyricist', 'Words-By': 'lyricist',
							'Libretto By': 'librettist', 'Translated By': 'translator', 'Translated-By': 'translator',
							'Adapted By': 'arranger', 'Adapted-By': 'arranger', 'Adapted By (Text)': 'arranger',
							'Arranged By': 'arranger', 'Arranged-By': 'arranger', 'Arranged By [Vocal]': 'vocal arranger',
							'Beats': 'misc',
							// technical
							'Field Recording': 'field recordist', 'Mastered By': 'mastering', 'Mastered-By': 'mastering',
							'Remastered By': 'mastering', 'Remastered-By': 'mastering', 'Engineer [Mastering]': 'mastering',
							'Mastering Engineer': 'mastering', 'Engineer [Transfer]': 'transfer', 'Transfer Engineer': 'transfer',
							'Transferred By': 'transfer', 'Engineer [Mix]': 'mix', 'Mix Engineer': 'mix', 'Mixing Engineer': 'mix',
							'Recorded By': 'recording', 'Recorded-By': 'recording', 'Engineer [Recording]': 'recording', 'Engineer [Recording Engineer]': 'recording',
							'Recording Engineer': 'recording', 'Engineer [Programming]': 'programming', 'Engineer [Audio]': 'audio',
							'Programming Engineer': 'programming', 'Engineer [Editor]': 'editor', 'Engineer [Balance]': 'balance',
							'Balance Engineer': 'balance', 'Programmed By': 'programming', 'Programmed-By': 'programming',
							'Sequenced By': 'programming', 'Sequenced-By': 'programming', 'Engineer': 'engineer',
							'Engineer [Sound]': 'sound', 'Sound Engineer': 'sound', 'Lacquer Cut By': 'lacquer cut',
							// visual
							'Artwork': 'artwork', 'Artwork By': 'artwork', 'Cover': 'artwork', 'Calligraphy': 'artwork',
							'Design Concept': 'artwork', 'Graphics': 'artwork', 'Layout': 'artwork', 'Image Editor': 'artwork',
							'Lettering': 'artwork', 'Lithography': 'artwork', 'Logo': 'artwork', 'Model': 'artwork', 'Drawing': 'artwork',
							'Painting': 'artwork', 'Sleeve': 'artwork', 'Typography': 'artwork', 'Photography': 'photography',
							'Photography By': 'photography', 'Design': 'design', 'Graphic Design': 'graphic design',
							'Illustration': 'illustration', 'Artwork [Illustration By]': 'illustration', 'Artwork [Illustrations By]': 'illustration',
							'Artwork [Illustration]': 'illustration', 'Artwork [Illustrations]': 'illustration',
							'Artwork [Design By]': 'design', 'Artwork [Design]': 'design',
							'Liner Notes': 'liner notes', 'Sleeve Notes': 'liner notes',
							// other
							'DJ Mix': 'mix-DJ', 'DJ-Mix': 'mix-DJ', 'Remix': 'remixer', 'Mixed By': 'mix', 'Mixed-By': 'mix',
							'Compiled By': 'compiler', 'Compiled-By': 'compiler', 'Collected By': 'compiler', 'Collected-By': 'compiler',
							'Orchestrated By': 'orchestrator', 'Concertmaster': 'concertmaster', 'Concertmistress': 'concertmaster',
							'Editor': 'editor', 'Edited By': 'editor', 'Edited-By': 'editor',
							'Producer': 'producer', 'Compilation Producer': 'producer', 'Produced By': 'producer',
							'Produced-By': 'producer', 'Co-producer': 'producer', 'Executive Producer': 'producer',
							'Executive-Producer': 'producer', 'Reissue Producer': 'producer', 'Post Production': 'producer',
							'Film Producer': 'producer',
							'Creative Director': 'creative direction', 'Music Director': 'audio director',
							'Music-Director': 'audio director', 'Audio Director': 'audio director',
							'Directed By [Music Director]': 'audio director', 'Concept By': 'creative direction',
							'Concept-By': 'creative direction', 'Film Director': 'video director', 'Art Direction': 'art direction',
							'A&R': 'artists and repertoire', 'Legal': 'legal representation', 'Booking': 'booking',
							// without direct translation
							'Created By': 'misc', 'Created-By': 'misc', 'Transcription By': 'misc', 'Transcription-By': 'misc',
							'Other': 'misc', 'Cadenza': 'misc', 'Copyist': 'misc', 'Instrumentation By': 'misc',
							'Musical Assistance': 'misc', 'Sound Designer': 'misc', 'Recording Supervisor': 'misc',
							'Camera Operator': 'misc', 'Choreography': 'misc', 'Accompanied By': 'misc', 'Rhythm Section': 'misc',
							'Film Editor': 'misc', 'Booklet Editor': 'misc', 'Score Editor': 'misc', 'Hosted By': 'misc',
							'Music Consultant': 'misc', 'Contractor': 'misc', 'Directed By': 'misc', 'Directed-By': 'misc',
							'Leader': 'misc', 'Repetiteur': 'misc', 'Commissioned By': 'misc', 'Commissioned-By': 'misc',
							'Curated By': 'misc', 'Curated-By': 'misc', 'Research': 'misc', 'Supervised By': 'misc',
							'Supervised-By': 'misc', 'Animation': 'misc', 'Assemblage': 'misc', 'CGI Artist': 'misc',
							'Cinematographer': 'misc', 'Costume Designer': 'misc', 'Director Of Photography': 'misc',
							'Film Technician': 'misc', 'Filmed By': 'misc', 'Footage By': 'misc', 'Gaffer': 'misc', 'Grip': 'misc',
							'Hair': 'misc', 'Lighting': 'misc', 'Lighting Director': 'misc', 'Make-Up': 'misc',
							'Production Manager': 'misc', 'Realization': 'misc', 'Screen Printing': 'misc', 'Set Designer': 'misc',
							'Stage Manager': 'misc', 'Stylist': 'misc', 'Video Editor': 'misc', 'VJ': 'misc', 'Abridged By': 'misc',
							'Music Librarian': 'misc', 'Screenwriter': 'misc', 'Script By': 'misc', 'Script-By': 'misc',
							'Text-By': 'misc', 'Administrator': 'misc', 'Advisor': 'misc', 'Consultant': 'misc', 'Coordinator': 'misc',
							'Management': 'misc', 'Product Manager': 'misc', 'Project Manager': 'misc', 'Promotion': 'misc',
							'Public Relations': 'misc', 'Tour Manager': 'misc', 'Vocal Coach': 'misc', 'Authoring': 'misc',
							'Crew': 'misc', 'DAW': 'misc', 'Direct Metal Mastering By': 'misc', 'Instrument Builder': 'misc',
							'Lathe Cut By': 'misc', 'Lathe Designer': 'misc', 'Luthier': 'misc',
							'Plated By': 'misc', 'Restoration': 'misc', 'Tape Op': 'misc', 'Technician': 'misc', 'Tracking By': 'misc',
							'Tuner': 'misc',
						}),
						label: caselessProxy({
							'Published By': 'published', 'Published-By': 'published',
							'Phonographic Copyright (p)': 'phonographic copyright',
							'Arranged For': 'arranged for', 'Edited For': 'edited for', 'Mixed For': 'mixed for',
							'Produced For': 'produced for', 'Broadcast': 'broadcast', 'Broadcast By': 'broadcast',
							'Copyright (c)': 'copyright', 'Licensed To': 'licensee', 'Licensed By': 'licensee',
							'Licensed-By': 'licensee', 'Licensed From': 'licensor',
							'Distributed By': 'distributed', 'Distributed-By': 'distributed', 'Made By': 'manufactured',
							'Made-By': 'manufactured', 'Manufactured By': 'manufactured', 'Manufactured-By': 'manufactured',
							'Glass Mastered At': 'glass mastered', 'Pressed By': 'pressed', 'Pressed-By': 'pressed',
							'Printed By': 'printed', 'Printed-By': 'printed', 'Manufactured For': 'manufactured for',
							'Marketed By': 'marketed', 'Marketed-By': 'marketed', 'Mastered For': 'mastered for',
							'Duplicated By': 'misc', 'Duplicated-By': 'misc', 'Licensed Through': 'misc',
							'Record Company': 'misc', 'Recorded By': 'misc', 'Exclusive Retailer': 'misc', 'Exported By':
							'misc', 'Exported-By': 'misc',
						}),
						series: caselessProxy({ 'Part Of': 'part of' }),
						place: caselessProxy({
							'Recorded At': 'recorded at', 'Engineered At': 'engineered at', 'Mixed At': 'mixed at',
							'Produced At': 'produced at', 'Remixed At': 'remixed at', 'Filmed At': 'video shot at',
							'Mastered At': 'mastered at', 'Remastered At': 'mastered at', 'Arranged At': 'arranged at',
							'Edited At': 'edited at', 'Lacquer Cut At': 'lacquer cut at', 'Transferred At': 'transferred at',
							'Manufactured At': 'manufactured at', 'Glass Mastered At': 'glass mastered at',
							'Pressed At': 'pressed at',
						}),
					}), relationResolvers = { }, relsBlacklist = ['Lacquer Cut By', 'Record Company'], urls = [ ];
					const cdFormats = {
						'HD-?CD': 'HDCD',
						'Enhanced': 'Enhanced CD',
						'Copy Protected': 'Copy Control CD',
						'CD\\+G': 'CD+G',
						'DualDisc': 'DualDisc',
						'SHM[ \\-]?CD': 'SHM-CD',
						'(?:BS|Blu-?Spec)[ \\-]?CD2?': 'Blu-spec CD',
						'HQ-?CD': 'HQCD',
						'DTS[ \\-]?CD': 'DTS CD',
						'Minimax CD': 'Minimax CD', // ?
						'Mixed Mode CD': 'Mixed Mode CD', // ?
						//'Hybrid': undefined,
					};
					if (release.formats) {
						for (let format of release.formats) for (let description of getFormatDescriptions(format))
							descriptors.add(description);
						const hasFormat = (fmt, ...specifiers) => release.formats.some(format => format.name == fmt
							&& (specifiers.length <= 0 || specifiers.every(specifier => getFormatDescriptions(format)
								.some(RegExp.prototype.test.bind(new RegExp('^(?:' + specifier + ')$', 'i'))))));
						if (hasFormat('Hybrid', 'DualDisc')) defaultFormat = 'DualDisc';
						if (hasFormat('SACD', 'Hybrid')) defaultFormat = 'Hybrid SACD';
						if (hasFormat('CDr')) defaultFormat = 'CD-R';
						if (hasFormat('CD')) defaultFormat = 'CD';
						for (let cdFormat in cdFormats) if (hasFormat('CD', cdFormat)) defaultFormat = cdFormats[cdFormat];
					}
					if (!defaultFormat) defaultFormat = 'CD';
					descriptors = Array.from(descriptors);
					processFormats({ // remove bogus tags
						'Stereo': undefined,
						//'Multichannel': undefined,
						'NTSC': undefined, 'PAL': undefined,
					});
					processFormats({
						'Album': 'Album',
						'EP': 'EP', 'Mini-Album': 'EP',
						'Single': 'Single', 'Maxi-Single': 'Single',
						'Compilation': 'Compilation', 'Sampler': 'Compilation',
						'Mixtape': 'Mixtape/Street',
						'Live': 'Live',
					}, type => { formData.append('type', type) }); //if (type == 'Sampler') annotation.push('This is sampler');
					if (rxBracketsMatcher('()', 0b11, phrases.live).test(release.title)) formData.append('type', 'Live');
					if (rxBracketsMatcher('()', 0b11, phrases.soundtrack).test(release.title)) formData.append('type', 'Soundtrack');
					if (release.extraartists && release.extraartists.some(extraArtist => !extraArtist.tracks
							&& getRoles(extraArtist).includes('DJ Mix'))) formData.append('type', 'DJ-mix');
					else if (!hasType('DJ-mix') && !descriptors.includes('Mixed'))
						if ('artist' in credits && 'DJ Mix' in credits.artist) descriptors.push('Mixed');
					processFormats(cdFormats);
					processFormats(Object.assign.apply({ },
						['FLAC', 'MP[234]', 'OGG|Vorbis', 'AAC', 'M4[AB]', 'Opus', 'DSD\\d*']
							.map(key => ({ [key]: undefined }))));
					processFormats({
						'Mini': '8cm',
						'7"': undefined /*'Single'*/, '10"': undefined /*'Single'*/, '12"': undefined /*'EP'*/,
						'LP': undefined,
					}, size => { if (!defaultFormat.startsWith(size)) defaultFormat = size + ' ' + defaultFormat });
					if (/^8cm (?!CD(?:\+G)?$)/.test(defaultFormat)) defaultFormat = defaultFormat.slice(4);
					if (release.labels && params.basicMetadata) release.labels.forEach(function(label, index) {
						const prefix = 'labels.' + index;
						if (label.name) {
							formData.set(prefix + '.name', capitalizeName(stripDiscogsNameVersion(label.name)));
							if ((rxNoLabel.test(label.name) || release?.artists?.some(artist => namedBy(label, artist)))
									&& !isCached('label', label.id))
								formData.set(prefix + '.mbid', mb.spl.noLabel);
							else addLookupEntry('label', label, prefix);
						}
						if (label.catno) formData.set(prefix + '.catalog_number',
							rxNoCatno.test(label.catno) ? '[none]' : label.catno);
					});
					if (release.identifiers) {
						const barcodes = release.identifiers
							.filter(identifier => identifier.type == 'Barcode' && identifier.value)
							.map(identifier => identifier.value.replace(/\W+/g, ''));
						if (barcodes.length > 0) {
							const getBarcodes = addCheckDigit =>
								barcodes.map(barcode => checkBarcode(barcode, addCheckDigit)).filter(Boolean);
							let verified = getBarcodes(false);
							if (verified.length <= 0) verified = getBarcodes(true);
							formData.set('barcode', (verified.length > 0 ? verified : barcodes)[0]);
						}
					}
					if (!Array.isArray(cdLengths) || cdLengths.length <= 0) cdLengths = false;
					const rxParsingMethods = [/^()()(\S+)$/], rxRoleParser = /^(.+?)(?:\s+\[([^\[\]]+)\])?$/;
					const totalMedia = release.formats ? release.formats.reduce((total, format) =>
						total + (parseInt(format.qty) || 0), 0) : undefined;
					if (totalMedia != 1) {
						// most flexible parser
						rxParsingMethods.unshift(/^(?:([A-Z]{2,}|MP[234]|M4A)[\ \-\.]?)?(?:(\d+)[\ \-\.])?([A-Z]?\d+(?:\.(?:[a-z]|\d+))?)$/i);
						// old parsers, just for sure
						rxParsingMethods.push(/^([A-Z]{2,}|MP[234]|M4A)?(\d+)?[\ \-\.]?\b(\S+)$/i,
							/^([A-Z]{2,}|MP[234]|M4A)(?:[\-\ ](\d+))?[\ \-\.]?\b(\S+)$/i);
					}
					const mediaSplitters = [media => layoutMatch(media) >= 0 ? media : undefined];
					if (params.groupTracks) mediaSplitters.push(media => groupTracks(media, /^\S*?\d+/),
						media => groupTracks(media, /^\S*\d+/), media => groupTracks(media));
					if (params.alignWithTOCs) mediaSplitters.push(function alignWithTOCs(media) {
						const cdMedia = media.filter(isCD);
						if (cdMedia.length <= 0) return false;
						const cdTracks = Array.prototype.concat.apply([ ], cdMedia.map(medium => medium.tracks));
						if (cdTracks.length <= 0) return;
						if (cdTracks.length != cdLengths.reduce((sum, totalTracks) => sum + totalTracks, 0)) return;
						if (layoutMatch(media = cdLengths.map(function(discNumTracks, discIndex) {
							const trackOffset = cdLengths.slice(0, discIndex).reduce((sum, totalTracks) => sum + totalTracks, 0);
							const mediaIndex = Math.min(discIndex, cdMedia.length - 1);
							return {
								format: cdMedia[mediaIndex].format,
								title: cdMedia[mediaIndex].title,
								tracks: cdTracks.slice(trackOffset, trackOffset + discNumTracks)
									.map((track, index) => Object.assign(track, { number: index + 1 })),
							};
						}).concat(media.filter(medium => !isCD(medium)))) > 2) return media;
					}, function alignByTOCsIgnoreMedia(media) {
						const cdTracks = Array.prototype.concat.apply([ ], media.map(medium => medium.tracks));
						if (cdTracks.length <= 0) return;
						if (cdTracks.length != cdLengths.reduce((sum, totalTracks) => sum + totalTracks, 0)) return;
						if (layoutMatch(media = cdLengths.map(function(discNumTracks, discIndex) {
							const trackOffset = cdLengths.slice(0, discIndex).reduce((sum, totalTracks) => sum + totalTracks, 0);
							const mediaIndex = Math.min(discIndex, media.length - 1);
							return {
								format: defaultFormat,
								title: media[mediaIndex].title,
								tracks: cdTracks.slice(trackOffset, trackOffset + discNumTracks)
									.map((track, index) => Object.assign(track, { number: index + 1 })),
							};
						})) > 2) return media;
					});
					const releasePerformers = resolvePerformers(release), annotationRanges = [ ];
					if (params.tracklist && (function() {
						if (mediaSplitters.some(function(mediaSplitter, splitterIndex) {
							for (let collapseSubtracks of [false, true]) for (let rxParsingMethod of rxParsingMethods) {
								media = parseTracklist(rxParsingMethod, collapseSubtracks);
								if (!media || media.length <= 0) continue;
								if (media = mediaSplitter(media)) return true;
							}
							return false;
						})) return true; else if (Array.isArray(cdLengths)) {
							const layouts = [
								(media = parseTracklist() || [ ]).map(medium => medium.tracks.length),
								cdLengths,
							].map(mediumTracks => mediumTracks.join('+'));
							if (confirm(`Could not find appropriatte tracks mapping to media (${layouts[0]} ≠ ${layouts[1]}), attach tracks with this layout anyway?`))
								return true;
						}
						media = undefined;
						return false;
					})()) {
						(media = media.filter(isCD).concat(media.filter(medium => !isCD(medium)))).forEach(function(medium, mediumIndex) {
							if (!medium.tracks || medium.tracks.length <= 0) return;
							['heading', 'parentTitle'].forEach(function consolidateTitles(prop) {
								if (!medium.tracks.map(track => track[prop])
										.every((prop, index, props) => prop && props.indexOf(prop) == 0)) return;
								medium.title = [medium.title, medium.tracks[0][prop]].filter(Boolean).join(' / ') || undefined;
								for (let track of medium.tracks) delete track[prop];
							});
							const headings = new Set(medium.tracks.filter(track => track.heading).map(track => track.heading));
							for (let heading of headings) {
								const headingMap = medium.tracks.map(track => track.heading == heading), ranges = [ ];
								let offset = 0;
								while (!(offset < 0) && (offset = headingMap.indexOf(true, offset)) >= 0) {
									const startIndex = offset;
									offset = headingMap.indexOf(false, offset);
									const endIndex = (offset < 0 ? headingMap.length : offset) - 1;
									console.assert(startIndex >= 0 && endIndex >= 0);
									ranges.push((endIndex > startIndex ? [startIndex, endIndex] : [startIndex])
										.map(index => medium.tracks[index].number).join(' to '));
								}
								if (ranges.length > 0) Array.prototype.push.apply(annotationRanges, ranges.map(function(range) {
									let label = media.length > 1 ? `${medium.format || 'Disc '}${mediumIndex + 1} track` : 'Track';
									if (range.includes(' to ')) label += 's';
									return `${label} ${range}: ${heading}`;
								}));
							}
							if (medium.format) formData.set(`mediums.${mediumIndex}.format`, medium.format);
							if (medium.title) formData.set(`mediums.${mediumIndex}.name`, normSeedTitle(medium.title));
							if (!medium.tracks) return;
							const multilingual = medium.tracks.every(track => rxMLang.test(track.title)
								|| track.parentTitle && rxMLang.test(track.parentTitle));
							medium.tracks.forEach(function(track, trackIndex) {
								const prefix = `mediums.${mediumIndex}.track.${trackIndex}.`;
								const name = [track.parentTitle, track.title].filter(Boolean).map(part =>
									seedTitleNorm(multilingual ? part.replace(rxMLang, '$1') : part, formData)).join(': ');
								if (name) {
									formData.set(prefix + 'name', normSeedTitle(name));
									frequencyAnalysis(literals, name);
								}
								if (track.number) formData.set(prefix + 'number', track.number);
								const trackPerformers = resolvePerformers(release, track);
								if (!samePerformers(releasePerformers, trackPerformers)) seedArtists(trackPerformers, prefix);
								if (track.duration) formData.set(prefix + 'length', track.duration);
							});
						});
					}
					if (release.tracklist) release.tracklist.forEach(addCredits);
					addCredits(release);
					if (relateAtAnyLevel && 'artist' in credits) for (const role in credits.artist) {
						const roleParser = rxRoleParser.exec(({
							'Guitar [Electric]': 'Electric Guitar', 'Violin [Electric]': 'Electric Violin',
							'Bass [Upright]': 'Double Bass [Upright]', 'Bass [Upright Bass]': 'Double Bass [Upright Bass]',
							'Saxophone [Tenor]': 'Tenor Saxophone', 'Flute [Shakuhachi]': 'Shakuhachi',
							'Synthesizer [Synth]': 'Synthesizer', 'Engineer [Mixing Engineer]': 'Mixed By',
						}[role]) || role);
						if (roleParser == null || relsBlacklist.concat(['Featuring'])
								.some(role => role.toLowerCase() == roleParser[1].toLowerCase())) continue;
						let relation = { type: relationsMapping.artist[role] }, relationResolver, ap;
						if (relation.type) relationResolver = Promise.resolve(relation); else {
							if ((ap = new AttributeParser(role)).isModified && (relation.type = relationsMapping.artist[ap.creditType]))
								relationResolver = Promise.resolve(Object.assign(relation, { attributes: ap.modifiers }));
						}
						if (!relation.type) relationResolver = (function(role) {
							if (/\b(?:Band|Or(?:ch|k)est(?:ra)?|Or(?:qu|k)esta?|Ensemble)$/.test(role[1]))
								return Promise.reject(`Not to be related (${role})`);
							if (relation.type = relationsMapping.artist[role[1]]) relation.attributes = [ ];
							else if ((ap = new AttributeParser(role[1])).isModified
									&& (relation.type = relationsMapping.artist[ap.creditType]))
								relation.attributes = ap.modifiers;
							if (relation.type) relation.creditType = role[1]; else return instrumentResolver(role[1])
									.then(attributes => instrumentMapper(attributes, ...role.slice(1)), function(reason) {
								if (debugLogging) console.debug(`Credit type not resolved (${role})`);
								return { type: 'misc', creditType: role.slice(1).filter(Boolean).join(' / ') };
							});
							if (['Instruments', 'Musician'].includes(role[1])) return instrumentResolver(role[2])
								.catch(reason => null).then(attributes => instrumentMapper(attributes, role[2]));
							return Promise.all([
								role[2] && mbAttrLinkTypes.vocal.concat('performer').includes(relation.type) ?
									vocalResolver(role[2]) : null,
								role[2] && mbAttrLinkTypes.instrument.concat('performer').includes(relation.type) ?
									instrumentResolver(role[2]).catch(reason => null) : null,
							]).then(function([vocal, instrument]) {
								console.assert(instrument == null || vocal == null, instrument, vocal, role[2]);
								if (relation.type != 'misc') {
									if (['performer'/*, 'recording'*/].includes(relation.type)) {
										if (instrument) relation.type = 'instrument'; else if (vocal) relation.type = 'vocal';
										if (instrument || vocal) relation.creditType = role[2];
									}
									const perfAttrFilter = attribute => ['guest', 'solo', 'additional'].every(attrName =>
										mbAttrLinkTypes[attrName].includes(relation.type) || attribute != mbAttrIds[attrName]);
									if (instrument != null) relation.attributes.push(...instrument.map(perfAttrFilter));
									else if (vocal != null) relation.attributes.push(...vocal.map(perfAttrFilter));
									else if (role[2]) {
										function testForAttribute(attribute, rx) {
											if (!mbAttrLinkTypes[attribute] || !mbAttrLinkTypes[attribute].includes(relation.type)) return false;
											if (!(rx instanceof RegExp)) throw new Error('Invalid argument');
											if (!rx.test(role[2])) return false;
											if (mbAttrIds[attribute]) relation.attributes.push({ id: mbAttrIds[attribute] });
											return true;
										}

										ap = new AttributeParser(role[2], relation.type);
										// if (ap.isModified) Array.prototype.push.apply(relation.attributes, ap.modifiers);
										if (!testForAttribute('additional', /^(?:Additional)\b/)
												&& !testForAttribute('assistant', /^(?:Assist(?:ed|ant)\b|Asst\.)/)
												&& !testForAttribute('associate', /^(?:Associate)\b/)
												&& !testForAttribute('guest', /^(?:(?:Special )?Guest)\b/)
												&& !testForAttribute('solo', /^(?:Solo(?:ist)?)\b/)
												&& !testForAttribute('executive', /^(?:Executive)\b/)
												&& !testForAttribute('sub', /^(?:Sub)\b/)
												&& !testForAttribute('co', /^(?:Co)[\s\-]\b/)
												&& !testForAttribute('pre', /^(?:Pre)\b/)
												&& !testForAttribute('translator', /^(?:Translat(?:or$|ion\b|ed[ \-]By\b))/)
												&& mbAttrLinkTypes.task.includes(relation.type) && !/^\w+(?:\s+\w+)*(?:ed By)$/.test(role[2])) {
											testForAttribute('guest', /\b(?:(?:Special )?Guest|Featuring)\b/);
											testForAttribute('solo', /\b(?:Solo(?:ist)?)\b/);
											testForAttribute('additional', /\b(?:Additional)\b/);
											relation.attributes.push(taskAttribute(role[2]));
										}
									}
								} else relation.creditType = role[1] == 'Other' ? role[2] : role.slice(1).join(' / ');
								if (relation.attributes.length <= 0) relation.attributes = null;
								return relation;
							});
						})(roleParser);
						console.assert(relationResolver instanceof Promise);
						relationResolvers[role] = relationResolver.then(function(relation) {
							console.assert(relation instanceof Object && relation.type, relation);
							if (debugLogging) console.debug('Relation resolved:', role, '→', relation.type);
							if (!findRelationLevels('artist', relation.type).some(relateAtLevel))
								return Promise.reject(`Not to be related (${role})`);
							for (let extraArtist of credits.artist[role]) addLookupEntry('artist', extraArtist, role);
							return relation;
						});
					};
					if (release.series) for (let series of release.series) addCredit('series', 'Part Of', series);
					if (release.companies) for (let company of release.companies) {
						const entity = company.entity_type_name in relationsMapping.place ? 'place' : 'label';
						addCredit(entity, company.entity_type_name, company);
					}
					for (let entity of ['label', 'series', 'place']) if (entity in credits) for (let type in credits[entity]) {
						if (relsBlacklist.includes(type)) continue;
						if (findRelationLevels(entity, relationsMapping[entity][type]).some(relateAtLevel) || {
							label: relateAtLevel('release'),
							series: true,
						}[entity]) for (let entry of credits[entity][type]) {
							if (['label', 'place'].includes(entity) && ['artists', 'extraartists']
									.some(prop => release[prop] && release[prop].some(artist => namedBy(entry, artist)))) continue;
							addLookupEntry(entity, entry, type);
						}
					}
					if (debugLogging) console.debug('Credits table:', credits);
					if (!media && release.tracklist) for (let track of release.tracklist)
						if (track.title) frequencyAnalysis(literals, anyBracketsStripper(track.title));
					if (Object.keys(literals).length > 0) guessTextRepresentation(formData, literals);
					if (params.languageIdentifier && release.tracklist)
						workers.push(languageIdentifier(release.tracklist.filter(track => track.title).map(track =>
							anyBracketsStripper(track.title) + '.').join(' ')).then(function(result) {
								/*if (!formData.has('language')) */formData.set('language', result.iso6393);
								if (params.extendedMetadata) formData.set('language_en', result.language);
								notify(`<b>${result.language}</b> identified as release language`, 'languageidentified');
							}, reason => { console.warn('Remote language identification failed') }));
					const packagingMappers = {
						[/^Book$/.source]: 'book',
						[/^Box$|Box[ \-]?Set/.source]: 'box',
						[/Jewel(?:[ \-]?Case)?/.source]: 'jewel case',
						[/(?:Card(?:[ \-]?(?:board|Sleeve|Slipcase))+|Paper[ \-]?Sleeve|Slipcase)/.source]: 'cardboard/paper sleeve',
						[/Cassette(?: Case)?/.source]: undefined, //'cassette case',
						[/Digi[ \-]?book(?: (?:Case|Cover))?/.source]: 'digibook',
						[/Digi[ \-]?pac?k(?: (?:Case|Cover))?/.source]: 'digipak',
						[/Digi[ \-]?(?:file|sleeve)(?: (?:Case|Cover))?/.source]: 'digifile',
						[/Disc[ \-]?box(?: ?Slider)?/.source]: 'discbox slider',
						[/(?:Plastic|PVC)[ \-](?:Sleeve|Slipcase)/.source]: 'plastic sleeve',
						[/Clamshell(?: Case)?/.source]: 'clamshell case',
						[/Gatefold(?: Cover)?/.source]: 'gatefold cover',
						[/Fat[ \-]?box(?: Case)?|^Fat(?:Box)?\b/.source]: 'fatbox',
						[/^Keep$|Keep[ \-]?Case/.source]: 'keep case',
						[/Long[ \-]?box(?: Case)?|Lbx/.source]: 'longbox',
						[/Metal[ \-]?Tin(?: Case)?/.source]: 'metal tin',
						[/Slide[ \-]?pac?k/.source]: 'slidepack',
						[/Slim(?:[ \-]?line)? Jewel(?: Case)?/.source]: 'slim jewel case',
						[/^Snap$|Snap[ \-]?Case/.source]: 'snap case',
						[/Snap[ \-]?Pack/.source]: 'snappack',
						[/Super[ \-]?Jewel(?: ?(?:Box|Case))?/.source]: 'super jewel box',
					};
					for (let key in packagingMappers)
						if (new RegExp('\\b(?:' + key + ')\\b', 'i').test(release.notes) && packagingMappers[key])
							formData.set('packaging', packagingMappers[key]);
					processFormats(packagingMappers, packaging => { formData.set('packaging', packaging) });
					processFormats({
						[/Unofficial(?: Release)?/.source]: 'bootleg',
						[/Promo(?:tion(?:al)?)?/.source]: 'promotion',
						[/Pseudo[ \-]Release/.source]: 'pseudo-release',
						[/Withdrawn(?: Release)?/.source]: 'withdrawn',
						[/Cancelled(?: Release)?/.source]: 'cancelled',
					}, status => { formData.set('status', status) });
					if (!formData.has('status')) formData.set('status', 'official');
					if (formData.get('status') == 'official') {
						if (/\b(?:cancelled)\b/i.test(release.notes)) formData.set('status', 'cancelled');
						if (/\b(?:withdrawn)\b/i.test(release.notes)) formData.set('status', 'withdrawn');
					}
					descriptors = descriptors.map(function(descriptor) {
						switch (descriptor) {
							case 'Mixed': if (hasType('DJ-mix')) return; else break;
							case 'Remastered': if (hasType('Compilation')) return; else break;
							case 'Reissue': case 'Repress': case 'CD-TEXT': case 'Limited Edition': return;
						}
						return descriptor.replace(...untitleCase).trim();
					}).filter(Boolean);
					if (descriptors.length > 0) formData.set('comment', descriptors.join(', ')); //else formData.delete('comment');
					if (params.composeAnnotation) workers.push(annotation = Promise.all(annotation.concat(
						annotationRanges.length > 0 ? mbMarkupBold('List of subparts') + '\n' +
							annotationRanges.map(annotationRange => annotationRange.replace(...mbWikiEncoder)).join('\n') : undefined,
						release.notes ? translateDiscogsMarkup([
							[/(?:\r?\n)?^\s*(?:(?:(?:Total|Running|Playing)\s+)+(?:Time|Length|Duration)|TT):? +(?:(?:\d+:)+\d+|(?:\d+['"] ?){2})$/gim, ''],
							[/(?:\r?\n){2,}/g, '\n\n'],
						].reduce((str, subst) => str.replace(...subst), release.notes).trim()) : undefined,
						release.identifiers && (annotation = release.identifiers.filter(function(identifier) {
							if (!identifier.value) return false; else if (identifier.type == 'Barcode') {
								const barcode = identifier.value.replace(/\W+/g, ''), verified = checkBarcode(barcode, true);
								if (verified && verified.includes(barcode)) return false;
							} else if (identifier.type == 'ASIN') return false;
							return true;
						}).map(discogsIdentifierMapper)).length > 0 ? mbMarkupBold('Other Identifiers') + '\n' +
							annotation.join('\n').replace(...mbWikiEncoder) : undefined,
					)).then(function(sections) {
						if (released == null && formData.get('events.0.date.year') && !formData.get('events.0.date.month')) {
							console.assert(!formData.get('events.0.date.day'));
							sections.unshift('Estimated release year ' + formData.get('events.0.date.year'));
							for (let unit of ['year', 'month', 'day']) formData.delete('events.0.date.' + unit);
						}
						return sections.filter(Boolean).join('\n\n') || undefined;
					}).then(function(annotation) {
						if (annotation) formData.set('annotation', annotation);
						return annotation;
					})); else annotation = undefined;
					addUrlRef([dcOrigin, 'release', release.id].join('/'), 'release', 'discogs');
					if (release.master_id > 0 && params.extendedMetadata && relateAtLevel('release-group'))
						addUrlRef([dcOrigin, 'master', release.master_id].join('/'), 'release-group', 'discogs');
					if (release.identifiers) release.identifiers
						.filter(identifier => identifier.type == 'ASIN' && identifier.value)
						.map(identifier => identifier.value)
						.forEach(asin => { addUrlRef('https://www.amazon.com/gp/product/' + asin, 'release', 'amazon asin') });
					urls.filter(Boolean).forEach(function(url, index) {
						for (let key in url) formData.set(`urls.${index}.${key}`, url[key]);
					});
					purgeArtists();
					seedArtists(releasePerformers);
					formData.set('edit_note', ((formData.get('edit_note') || '') +
						`\nSeeded from Discogs release id ${release.id} (${[dcOrigin, 'release', release.id].join('/')})`).trimLeft());
					if (params.basicMetadata && params.rgLookup && !formData.has('release_group') && release.master_id > 0)
						rgLookupWorkers.push(findDiscogsRelatives('release-group', release.master_id).then(function(releaseGroups) {
							console.assert(releaseGroups.length > 0);
							console.assert(releaseGroups.length == 1, 'Ambiguous master %d release referencing:', release.master_id, releaseGroups);
							return releaseGroups.length == 1 ? releaseGroups[0] : Promise.reject('Ambiguity');
						}).catch(reason => null));
					if (params.extendedMetadata) { // all genres + styles
						const tagMappers = {
							'folk, world, & country': [/*'folk/world/country'*/], 'soundtrack': [ ], 'psy-trance': ['psytrance'],
							'children\'s': ['children\'s music'], 'rnb': ['r&b'], //'chanson': 'chanson française',
							'prog rock': ['progressive rock'], 'post rock': ['post-rock'], 'goth rock': ['gothic rock'],
							'jazz-rock': ['jazz rock'], 'rhythm & blues': ['r&b'], 'funk / soul': ['funk', 'soul'],
							'drum n bass': ['drum and bass'], 'alt-pop': ['alternative pop'], 'bop': ['bebop'],
							'post bop': ['post-bop'], 'cha-cha': ['chachachá'], 'freetekno': ['free tekno'], 'gogo': ['go-go'],
							'hardcore hip-hop': ['hardcore hip hop'], 'jazzy hip-hop': ['jazz rap'],
							'izvorna': ['izvorna bosanska muzika'], 'laïkó': ['laiko'], 'minimal': ['minimalism'],
							'ndw': ['neue deutsche welle'], 'nueva cancion': ['nueva canción'], 'néo kyma': ['neo kyma'],
							'ottoman classical': ['turkish classical'], 'piobaireachd': ['pìobaireachd'],
							'reggae gospel': ['gospel reggae'], 'serial': ['serialism'], 'shomyo': ['shōmyō'],
							'beatbox': ['beatboxing'], 'beguine': ['biguine'], 'boogie woogie': ['boogie-woogie'],
							'bossanova': ['bossa nova'], 'bubblegum': ['bubblegum pop'], 'cambodian classical': ['pinpeat'],
							'crust': ['crust punk'], 'danzon': ['danzón'], 'darkwave': ['dark wave'], 'doo wop': ['doo-wop'],
							'favela funk': ['funk brasileiro'], 'future jazz': ['nu jazz'], 'nu-disco': ['nu disco'],
							'hip-house': ['hip house'], 'italodance': ['italo dance'], 'korean court music': ['korean classical'],
							'power violence': ['powerviolence'], 'ragga hiphop': ['ragga hip-hop'],
							'rhythmic noise': ['power noise'], 'rock & roll': ['rock and roll'], 'sokyoku': ['sōkyoku'],
							'swingbeat': ['new jack swing'], 'thrash': ['thrash metal'], 'berlin-school': ['berlin school'],
							'soul-jazz': ['soul jazz'], 'modal': ['modal jazz'], 'conscious': ['conscious hip hop'],
							'avantgarde': ['avant-garde'], 'afro-cuban': ['afro-cuban jazz'], 'impressionist': ['impressionism'],
							'gangsta': ['gangsta rap'], 'rnb/swing': ['r&b', 'swing'], 'hi nrg': ['hi-nrg'],
						};
						const getTags = root => root ? (root.genres || [ ]).concat(root.styles || [ ]).map(tag => tag.toLowerCase()) : [ ];
						let tags = Promise.resolve(getTags(release));
						if (release.master_id > 0) tags = tags.then(tags => dcApiRequest('masters/' + release.master_id)
							.then(master => tags.concat(getTags(master)), reason => (console.warn(reason), tags)));
						workers.push(tags.then(function(tags) {
							Array.prototype.concat.apply([ ], tags.map(tag => tagMappers[tag] || [tag]))
								.filter(uniqueValues).forEach((tag, index) => { formData.set(`tags.${index}`, tag) });
						}));
					}
					if (params.preferTrackRelations == 1) params.preferTrackRelations = media ?
						media.reduce((sum, medium) => sum + (medium.tracks ? medium.tracks.length : 0), 0) == 1 : false;
					else params.preferTrackRelations = Boolean(params.preferTrackRelations);
					workers.push(getSessionsFromTorrent(torrentId).catch(reason => null).then(async function(sessions) {
						function recordingsLookup(track, params) {
							function queryBuilder(lockToDuration = true) {
								let query = [track.title, anyBracketsStripper(track.title)].filter(uniqueValues)
									.map(term => ['recording', 'alias'].map(field => field + ':' + (params.looseSearch ?
										`(${encodeLuceneTerm(term)})` : `"${encodeQuotes(term)}"`)).join(' OR ')).join(' OR ');
								query = [query].concat((function(artists) {
									if (artists.length < 2) return artists; else artists = artists.map(artist => '(' + artist + ')');
									const term = [`(${artists.join(' AND ')})`];
									if (artists.length > 1 && !someArtistWeak) term.push(`(${artists.join(' OR ')})^0.5`);
									return term.join(' OR ');
								})(artists.map(function(artist) {
									let arids = aridLookupFn('artist', artist.id);
									if (arids != null && (arids = arids.filter(Boolean)).length <= 0) arids = null;
									return arids != null ? arids.map(arid => 'arid:' + arid).join(' AND ') : (params.looseSearch ? [
										`artistname:(${encodeLuceneTerm(stripDiscogsNameVersion(artist.name))})`,
										`creditname:(${encodeLuceneTerm(creditedName(artist))})`,
									] : [
										`artistname:"${encodeQuotes(stripDiscogsNameVersion(artist.name))}"`,
										`creditname:"${encodeQuotes(creditedName(artist))}"`,
									]).join(' OR ');
								})));
								if (lockToDuration && trackLength > 0 && params.maxLengthDifference > 0)
									query.push(`dur:[${Math.max(Math.round(trackLength) - params.maxLengthDifference, 0)} TO ${Math.round(trackLength) + params.maxLengthDifference}]  OR (NOT dur:[* TO *])`);
								if (!canContainVideo) query.push('video:false');
								return query.map(expr => '(' + expr + ')').join(' AND ');
							}

							if (!track) throw new Error('Invalid argument'); else if (!media) return Promise.reject('Missing media');
							if (!track.title) return Promise.reject('Missing track name');
							const medium = media.find(medium => medium?.tracks?.includes(track));
							console.assert(medium, media, track);
							if (!medium) throw 'Assertion failed: medium not found';
							const mediumIndex = media.indexOf(medium), trackIndex = medium.tracks.indexOf(track);
							console.assert(mediumIndex >= 0 && trackIndex >= 0);
							if (mediumIndex < 0 || trackIndex < 0) throw 'Assertion failed: Index not found';
							let trackLength = (function() {
								if (!(layoutMatch(media) > 2) || sessions == null || !isCD(medium)) return;
								if (!(mediumIndex >= 0) || !(trackIndex >= 0)) return;
								const tocEntries = getTocAudioEntries(sessions[mediumIndex]);
								if (tocEntries != null && tocEntries[trackIndex]) return tocEntries[trackIndex].length * 1000 / 75;
							})();
							if (isNaN(trackLength)) trackLength = getTrackLength(track);
							params = Object.assign({
								maxLengthDifference: GM_getValue('max_recording_length_distance', 10000),
								lengthRequired: false,
								dateRequired: false,
								looseSearch: false,
							}, params);
							const aridLookupFn = typeof params.aridLookupFn == 'function' ? params.aridLookupFn
								: trackLength > 0 ? () => null : null;
							if (typeof aridLookupFn != 'function') return Promise.reject('Missing track length');
							const artists = resolvePerformers(release, track);
							console.assert(artists, track);
							if (!artists || artists.length <= 0) return Promise.reject('No artists associated with track');
							const everyArtistWeak = artists.every(weakArtistTest), someArtistWeak = artists.some(weakArtistTest);
							if (everyArtistWeak) [params.lengthRequired, params.dateRequired, params.maxLengthDifference] =
								[true, true, Math.min(params.maxLengthDifference, 1500)];
							const canContainVideo = medium.format && (/\b(?:Blu-Ray|DVD)\b/.test(medium.format)
								|| medium.format == 'Enhanced CD' && sessions != null && mediumIndex in sessions
								&& (tocEntries => tocEntries != null && !tocEntries[trackIndex])
									(getTocAudioEntries(sessions[mediumIndex])));
							let query = queryBuilder(true);
							//if (debugLogging) console.debug('Recording search query for "%s":', track.title, query);
							return mbApiRequest('recording', { query: query, limit: 100 })
									.then(results => results.count > 0 || !(trackLength > 0) ? results : Promise.reject('No results'))
									.catch(reason => mbApiRequest('recording', { query: query = queryBuilder(false), limit: 100 })).then(function(recordings) {
								function hasArtist(recording, artist) {
									console.assert(recording instanceof Object && artist instanceof Object);
									if (!(recording instanceof Object) || !(artist instanceof Object)) return false;
									let arids = aridLookupFn('artist', artist.id);
									if (arids != null && (arids = arids.filter(Boolean)).length <= 0) arids = null;
									return arids != null ? arids.every(arid => recording['artist-credit']
											.some(artistCredit => artistCredit.artist && artistCredit.artist.id == arid))
										: recording['artist-credit'].some(artistCredit => artistCredit.artist
											&& matchNameVariant(artist, artistCredit.artist.name) || artistCredit.name
											&& matchNameVariant(artist, artistCredit.name));
								}

								console.assert(recordings.count > 0 == recordings.recordings.length > 0);
								if (debugLogging) if (recordings.count > 0) console.debug('Track "%s" [%d/%d] lookup results (unfiltered):',
									track.title, mediumIndex + 1, trackIndex + 1, recordings.recordings);
								else console.debug('No recordings for track "%s":', track.title, track, 'Track length:', Math.round(trackLength), 'Query:', query);
								if (recordings.count <= 0) return Promise.reject('No results');
								const deltaMapper = recording => recording.length > 0 && trackLength > 0 ? Math.abs(recording.length - trackLength) : NaN;
								recordings = recordings.recordings.filter(function(recording) {
									function sameType(pattern, secondaryType) {
										if (pattern) try {
											pattern = [rxBracketsMatcher(['()', '[]'], 0b11, pattern), pattern]
												.map(expr => new RegExp(expr, 'i'));
										} catch(e) { console.warn(e); pattern = undefined; }
										let localFlag = secondaryType && hasType(secondaryType) || pattern
											&& ([track, medium, release].filter(Boolean).some(root => pattern[0].test(root.title))
												|| descriptors.some(RegExp.prototype.test.bind(pattern[1])));
										// if (debugLogging && localFlag) console.debug('Local flag triggered for (%o, %s):',
										// 	pattern, secondaryType, formData.getAll('type'), track.title, release.title, descriptors);
										const releases = recording.releases || [ ], rgTypeFlag = releaseGroups => {
											if (!secondaryType || releaseGroups.length <= 0) return false;
											const matched = releaseGroups.filter(releaseGroup =>
												(releaseGroups['secondary-types'] || [ ]).includes(secondaryType));
											return matched.length * 2 >= releaseGroups.length;
										}, releaseTitleFlag = releaseTitles => {
											if (!pattern || releaseTitles.length <= 0) return false;
											const matched = releaseTitles.filter(RegExp.prototype.test.bind(pattern[0]));
											return matched.length * 2 >= releaseTitles.length;
										};
										let remoteFlag = rgTypeFlag(releases.map(release => release['release-group']).filter(Boolean))
											|| pattern && (pattern[0].test(recording.title) || pattern[1].test(recording.disambiguation)
												|| releaseTitleFlag(releases.map(release => release.title)));
										// if (debugLogging && remoteFlag) console.debug('Remote flag triggered for (%o, %s):',
										// 	pattern, secondaryType, releases, recording.title, recording.disambiguation);
										return Boolean(remoteFlag) == Boolean(localFlag);
									}

									if (recording.score < 20 || !canContainVideo && recording.video) return false;
									if (params.dateRequired && !recordingDate(recording)) return false;
									if (!(recording.length > 0) && (params.lengthRequired/* || aridLookupFn.length <= 0*/)) return false;
									if ((recording['artist-credit'] || [ ]).length <= 0
											|| !artists.some(artist => hasArtist(recording, artist))) return false;
									const delta = deltaMapper(recording);
									if (params.maxLengthDifference > 0 && delta > params.maxLengthDifference) return false;
									const accuracyLevel = !isNaN(delta) && params.maxLengthDifference > 0 ?
										Math.floor(Math.min(delta * 3 / params.maxLengthDifference, 3)) : undefined;
									if (!(accuracyLevel < 2) && !artists.every(artist => hasArtist(recording, artist))) return false;
									const typeFlags = [
										sameType(phrases.live, 'Live'), sameType(phrases.instrumental), sameType(phrases.remix),
										sameType(phrases.acoustic), sameType(phrases.acappella), sameType(phrases.clean),
										sameType(phrases.demo, 'Demo'), sameType(phrases.mono), sameType(phrases.multichannel),
										sameType(undefined, 'Interview'), sameType(phrases.karaoke), sameType(phrases.unplugged),
									];
									if (!typeFlags.every(Boolean)) return false;
									if (!sameTitleMapper(recording, track.title,
											[weakMatchMapper, similarStringValues][accuracyLevel] || sameStringValues)) return false;
									return true;
								});
								if (debugLogging && recordings.length > 0) {
									console.debug('Track "%s" [%d/%d] lookup results (filtered):', track.title, mediumIndex + 1, trackIndex + 1, recordings);
									const loScore = Math.min(...recordings.map(recording => recording.score));
									console.debug('Lowest score passed:', loScore, track, recordings.filter(recording => recording.score == loScore));
								}
								return recordings.length > 0 ? recordings.sort(function(...recordings) {
									const cmpVal = testFn => {
										console.assert(typeof testFn == 'function');
										testFn = recordings.map(testFn);
										return testFn[0] && !testFn[1] ? -1 : testFn[1] && !testFn[0] ? +1 : 0;
									}, factor = (index, f = 1) => {
										f = Math.max(Math.min(f, 1), 0);
										return (1 - f) + Math.max(index, 0) * f;
									}, methods = [
										recording => artists.filter(artist => hasArtist(recording, artist)).length / artists.length,
										recording => Math.max(...[recording].concat(recording.aliases || [ ]).map(root => root.title ?
											jaroWinklerSimilarity(...[root, track].map(root => toASCII(root.title).toLowerCase())) : 0)),
									];
									if (params.maxLengthDifference > 0 && recordings.every(recording => recording.length > 0))
										methods.push(recording => factor((1 - deltaMapper(recording) / params.maxLengthDifference), 0.5));
									if (recordings.every(recording => recording.releases)) methods.push(recording =>
										1 + Math.min(Math.log10(recording.releases.length), 1) / 10);
									const indexes = recordings.map(recording =>
										methods.reduce((index, method) => index * method(recording), 1));
									if (recordings.every(recordingDate)) {
										const releaseYears = recordings.map(recordingDate).map(recordingDate =>
											(recordingDate = /\b(\d{4})\b/.exec(recordingDate)) != null ? parseInt(recordingDate[1]) : NaN);
										const result = Math.sign(releaseYears[0] - releaseYears[1]);
										if (result) indexes[result > 0 ? 0 : 1] *= 0.8;
									}
									return Math.sign(indexes[1] - indexes[0]) || cmpVal(recordingDate) || cmpVal(recording => recording.length > 0);
								}) : Promise.reject('No filtered matches');
							});
						}
						function seriesLevelResolver(discogsId, mbid) {
							const index = 'series.' + discogsId;
							if (!(index in relationResolvers) || !(relationResolvers[index] instanceof Promise))
								relationResolvers[index] = mbApiRequest('series/' + mbid).then(function(series) {
									let level = ({
										'52b90f1e-ff62-3bd0-b254-5d91ced5d757': 'release',
										'4c1c4949-7b6c-3a2d-9d54-a50a27e4fa77': 'release-group',
									}[series['type-id']]);
									if (!level && (level = /^(.+?)\s+(?:series)$/.exec(series.type)) != null)
										level = level[1].toLowerCase().replace(/[ _]+/g, '-');
									if (level) return level;
									console.log('Relation level not found for', series.type);
								});
							return relationResolvers[index];
						}
						function resolveFormData(entity, discogsId, mbids) {
							console.assert(entity && discogsId > 0 && mbids);
							if (!entity || !(discogsId > 0) || !mbids) return; else if (!Array.isArray(mbids)) mbids = [mbids];
							console.assert(lookupIndexes[entity] && lookupIndexes[entity][discogsId], entity, discogsId);
							if (!lookupIndexes[entity] || !lookupIndexes[entity][discogsId]) return;
							console.assert(Array.isArray(lookupIndexes[entity][discogsId].contexts), lookupIndexes[entity][discogsId]);
							if (!Array.isArray(lookupIndexes[entity][discogsId].contexts)) return;
							lookupIndexes[entity][discogsId].contexts.forEach(function(context) {
								if (!(entity in credits && context in credits[entity])) {
									if (mbids.length != 1)
										console.log('Multiple MBIDs can\'t be assigned to seeded name %s %d:', entity, discogsId, mbids);
									else if (mbids[0] != null) {
										formData.set(context + '.mbid', mbids[0]);
										//formData.delete(context + ({ artist: '.artist.name' }[entity] || '.name'));
										if (entity == 'artist') if ([mb.spa.anonymous].includes(mbids[0]))
											formData.set(context + '.name', capitalizeName(stripDiscogsNameVersion(lookupIndexes[entity][discogsId].name)));
										else if (formData.has(context + '.name')) {
											const _useANV = name => useANV(creditedName(lookupIndexes[entity][discogsId]), name) ?
												true : (formData.delete(context + '.name'), false);
											workers.push(mbApiRequest(entity + '/' + mbids[0]).then(entry => _useANV(entry.name), function(reason) {
												console.warn('Failed to resolve entity %s %d:', entity, mbids[0], reason);
												return _useANV(stripDiscogsNameVersion(lookupIndexes[entity][discogsId].name));
											}));
										}
									}
								} else if (!relsBlacklist.includes(context)) mbids.forEach(function(mbid, mbidIndex, mbids) {
									function getRelation(linkTypeId, attributes, params, extraData) {
										if (!((linkTypeId = parseInt(linkTypeId)) > 0) || mbExcludedTypeIds.includes(linkTypeId)) return null;
										params = Object.assign({ backward: false }, params);
										return {
											linkTypeId: linkTypeId, backward: Boolean(params.backward),
											targetType: entity, target: mbid,
											name: credit.name, credit: mbids.length == 1 ? params.creditedAs : undefined,
											attributes: (attributes || [ ]).length > 0 ? attributes : null,
											dataset: extraData instanceof Object && Object.keys(extraData).length > 0 ? extraData : null,
										};
									}

									const credit = credits[entity][context].find(entity => entity.id == parseInt(discogsId));
									console.assert(credit, credits[entity][context], discogsId);
									console.info('MBID for %s %s:', context, credit.name, mbid);
									if (!mbid) return;
									let linkType = relationsMapping[entity][context];
									switch (entity) {
										case 'artist': {
											console.assert(relationResolvers[context] instanceof Promise, entity, context);
											if (!(relationResolvers[context] instanceof Promise)) break;
											relationWorkers.push(relationResolvers[context].then(function(relation) {
												function isCredited(track) {
													if (!levels.some(isTrackLevel)) return false;
													const etraArtists = resolveExtraArtists([release, track], role => role == context && !levels.some(isReleaseLevel));
													return Boolean(etraArtists) && etraArtists.some(extraArtist =>
														extraArtist.id == parseInt(discogsId) && extraArtist.roles.includes(context));
												}

												console.assert(relation.type, entity, context);
												const levels = findRelationLevels(entity, relation.type).filter(level =>
													!mbExcludedTypeIds.includes(getLinkTypeId(level, entity, relation.type)));
												const relateAtTrackLevel = levels.some(isTrackLevel) && Boolean(media)
													&& media.some(medium => medium.tracks && medium.tracks.some(isCredited));
												const debugLabel = `DiscogsID: ${discogsId}, context: ${context}`;
												if (debugLogging) {
													console.groupCollapsed(debugLabel);
													console.debug('Lookup entry:', lookupIndexes[entity][discogsId], 'MBID:', mbid, 'Relation:', relation, 'Levels:', levels);
													console.debug('Relate at track level:', relateAtTrackLevel);
												}
												const relations = levels.filter(level => relateAtLevel(level) && isTrackLevel(level) == relateAtTrackLevel).map(function(level) {
													function testForAttribute(attribute, role) {
														if (!mbAttrLinkTypes?.[attribute]?.includes(relation.type)) return;
														if ((creditType == role || credit?.modifiers?.includes(role)) && mbAttrIds[attribute])
															attributes.push({ id: mbAttrIds[attribute] });
													}

													const linkTypeId = getLinkTypeId(level, entity, relation.type);
													console.assert(linkTypeId > 0, level, entity, relation.type);
													if (!(linkTypeId > 0)) return null;
													const exclusiveTo = (exclusiveTo, _level) => level == _level && _level != exclusiveTo && levels.includes(exclusiveTo);
													if (exclusiveTo('recording', 'work') || exclusiveTo('release', 'release-group')) return null;
													const creditType = relation.creditType || context, attributes = Array.from(relation.attributes || [ ]);
													if (['misc'].includes(relation.type) || ['photography', 'producer', 'artists and repertoire', 'engineer', 'mix', 'artwork'].includes(relation.type) && [
														// Producer
														'Post Production', 'Reissue Producer', 'Compilation Producer', 'Film Producer',
														// Artwork
														'Cover', 'Calligraphy', 'Design Concept', 'Graphics', 'Layout', 'Image Editor',
														'Lettering', 'Lithography', 'Logo', 'Model', 'Painting', 'Sleeve', 'Typography', 'Drawing',
													].includes(creditType)) attributes.push(taskAttribute(creditType));
													const vocal = mbAttrLinkTypes.vocal.includes(relation.type) ? vocalResolver(creditType) : null;
													if (vocal != null) Array.prototype.push.apply(attributes, vocal);
													if (relation.type == 'producer') {
														if (creditType.startsWith('Executive')) attributes.push({ id: mbAttrIds.executive });
														if (creditType.startsWith('Co-')) attributes.push({ id: mbAttrIds.co });
													}
													if (relation.type == 'mastering' && creditType.startsWith('Remaster'))
														attributes.push({ id: '9b72452f-550e-4ace-93ed-fb8789cdc245' });
													testForAttribute('guest', 'Guest'); testForAttribute('solo', 'Soloist');
													const creditedAs = mbid == mb.spa.anonymous ? capitalizeName(credit.name)
														: !noCreditAsArtists.includes(parseInt(discogsId)) ? creditedName(credit) : undefined;
													if (debugLogging) console.debug('LinkType:', relation.type, 'LinkTypeId:', linkTypeId, 'Attributes:', attributes, 'Credit type:', creditType);
													if (relateAtTrackLevel) return Array.prototype.concat.apply([ ], media.map(function(medium, mediumIndex) {
														if (debugLogging) console.debug('Medium %d', mediumIndex + 1);
														return medium.tracks ? medium.tracks.map(function(track, trackIndex) {
															const _isCredited = isCredited(track);
															if (debugLogging) console.debug('Track %d:', trackIndex + 1, track, 'is credited:', _isCredited);
															return _isCredited ? getRelation(linkTypeId, attributes, { creditedAs: creditedAs },
																{ medium: mediumIndex, track: trackIndex }) : null;
														}) : null;
													})); else {
														const roleArtists = resolveExtraArtists([release], role => role == context);
														const relateAtReleaseLevel = roleArtists && roleArtists
															.some(roleArtist => roleArtist.id == parseInt(discogsId));
														if (debugLogging) console.debug('Relate at release level:', relateAtReleaseLevel);
														return relateAtReleaseLevel ? getRelation(linkTypeId, attributes, { creditedAs: creditedAs }) : null;
													}
												});
												if (debugLogging) console.groupEnd(debugLabel);
												return Array.prototype.concat.apply([ ], relations).filter(Boolean);
											}).catch(console.log));
											break;
										}
										case 'label': case 'place': {
											if (!linkType) linkType = 'misc';
											let levels = findRelationLevels(entity, linkType);
											console.assert(levels.length > 0, entity, context, linkType);
											if (levels.some(isTrackLevel) && levels.some(isReleaseLevel))
												levels = levels.filter(params.preferTrackRelations ? isTrackLevel : isReleaseLevel);
											if (levels.length > 0) Array.prototype.push.apply(relationWorkers, levels.map(function(level) {
												const linkTypeId = getLinkTypeId(level, entity, linkType), attributes = [ ];
												console.assert(linkTypeId > 0, entity, context);
												if (linkType == 'mastered at' && context.startsWith('Remaster'))
													attributes.push({ id: '9b72452f-550e-4ace-93ed-fb8789cdc245' });
												if (linkType == 'misc') attributes.push(taskAttribute(context));
												return getRelation(linkTypeId, attributes, {
													creditedAs: [1818].includes(parseInt(discogsId)) ? undefined : creditedName(credit),
												});
											}).filter(Boolean));
											break;
										}
										case 'series': {
											console.assert(linkType == 'part of', linkType, context);
											if (linkType != 'part of') break;
											relationWorkers.push(seriesLevelResolver(discogsId, mbid).then(function(level) {
												if (relateAtLevel(level) && Object.values(((mbRelationsIndex[level] || { })[entity] || { })).includes('part of')) {
													const series = release.series.find(series => series.id == parseInt(discogsId));
													console.assert(series, discogsId, release.series);
													let number = series && series.catno
														&& /^(?:\w+\.?\s+|[a-z]+\.|#|№\s*)*\b(\d+|[IVXLCDM]+)$/i.exec(series.catno.trim());
													if (number) number = /^(?:\d+)$/.test(number[1]) ? parseInt(number[1]) : romanToArabic(number[1]);
													return getRelation(getLinkTypeId(level, entity, linkType), number ? [{
														id: 'a59c5830-5ec7-38fe-9a21-c7ea54f6650a',
														value: number.toString(),
													}] : null, { backward: true });
												} else if (!openedForEdit.has(mbid)) {
													openedForEdit.add(mbid);
													GM_openInTab([mbOrigin, entity, mbid, 'edit'].join('/'), true);
												}
											}).catch(console.warn));
											break;
										}
										default: console.warn('Unexpected entity type', entity, '(not processed)');
									}
								});
							});
						}

						const workers = [ ], relationWorkers = [ ], rawRecordingLookups = new Map;
						if (params.lookupArtistsByRecording && !hasType('Live') && media && params.searchSize > 0) {
							for (let medium of media) if ('tracks' in medium) for (let track of medium.tracks) (function(artists) {
								if (!artists) return; else if (!rawRecordingLookups.has(track))
									rawRecordingLookups.set(track, recordingsLookup(track, { maxLengthDifference: 5000 }));
								for (let artist of artists) {
									const artistLookupWorker = rawRecordingLookups.get(track).then(function(recordings) {
										const mbids = { };
										for (let recording of recordings) if ('artist-credit' in recording)
											for (let artistCredit of recording['artist-credit']) if (artistCredit.artist)
												if ([artistCredit.artist.name, artistCredit.name].some(name => matchNameVariant(artist, name)))
													mbids[artistCredit.artist.id] = (mbids[artistCredit.artist.id] || 0) + 1;
										if (Object.keys(mbids).length <= 0) return Promise.reject(`Artist ${artist.name} does not appear on recording`);
										return Object.defineProperties(mbids, {
											track: { value: track },
											recording: { value: recording },
										});
									}).catch(reason => null);
									if (!(artist.id in artistLookupWorkers)) artistLookupWorkers[artist.id] = [ ];
									artistLookupWorkers[artist.id].push(artistLookupWorker);
								}
							})(resolvePerformers(release, track));
							for (let discogsId in artistLookupWorkers)
								artistLookupWorkers[discogsId] = Promise.all(artistLookupWorkers[discogsId]).then(function(mbids) {
									const scores = { }, tracks = new Set, recordings = new Set;
									mbids.filter(Boolean).forEach(function(mbids) {
										for (let mbid in mbids) scores[mbid] = (scores[mbid] || 0) + mbids[mbid];
										tracks.add(mbids.track);
										recordings.add(mbids.recording);
									});
									if (Object.keys(scores).length <= 0) return Promise.reject('No matched recordings');
									return Object.defineProperties(scores, {
										tracks: { value: Array.from(tracks) },
										recordings: { value: Array.from(recordings) },
									});
								});
						}
						await Promise.allSettled(Object.values(relationResolvers));
						if (debugLogging) console.debug('Lookup indexes:', lookupIndexes);
						return Promise.all(Object.keys(lookupIndexes).map(entity => Promise.all(Object.keys(lookupIndexes[entity]).map(function(discogsId) {
							async function createEntity(entity, discogsId, recursive = false) {
								function typeIdFromUrl(url) {
									if (!(url instanceof URL)) throw new Error('Invalid argument');
									if (url.pathname.includes('search') && url.search) return -1; // search link
									if (urlLinkTypes[entity] instanceof Object && urlLinkTypes[entity].image > 0 && [
										'jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'jfif', 'tif', 'tiff',
									].some(ext => url.pathname.toLowerCase().endsWith('.' + ext))) return urlLinkTypes[entity].image;
									Object.defineProperties(url, {
										matches: { value: function(param) {
											switch (typeof param) {
												case 'string': return (param = param.toLowerCase().split('.')).join('.')
													== url.hostname.toLowerCase().split('.').slice(-param.length).join('.');
												case 'function': return param(this);
												default: return false;
											}
										}, enumerable: true },
										matchesAnyTLD: { value: function(domainPart) {
											return (domainPart = domainPart.toLowerCase().split('.').filter(Boolean)).length > 0
												&& this.hostname.toLowerCase().split('.').every((name, index, names) =>
													index < domainPart.length ? name == domainPart[index] : XHR.TLDs.includes(name));
										}, enumerable: true },
									});
									const linkCategories = {
										'ignored': ['musicbrainz.org', 'myspace.com', 'secondlife.com', 'plus.google.com'],
										'wikipedia': ['wikipedia.org'], 'wikidata': ['wikidata.org'], 'discogs': ['discogs.com'],
										'allmusic': ['allmusic.com'], 'bandsintown': ['bandsintown.com'], 'BookBrainz': ['bookbrainz.org'],
										'CPDL': ['cpdl.org'], 'IMDb': ['imdb.com'], 'IMSLP': ['imslp.org'], 'last.fm': ['last.fm'],
										'secondhandsongs': ['secondhandsongs.com'], 'setlistfm': ['setlist.fm'], 'songkick': ['songkick.com'],
										'vgmdb': ['vgmdb.net', 'vgmdb.com'], 'VIAF': ['viaf.org'], 'geonames': ['geonames.org'],
										'other databases': [
											'45cat.com', '45worlds.com', 'adp.library.ucsb.edu', 'anidb.net', 'animenewsnetwork.com',
											'anison.info', 'baike.baidu.com', 'bibliotekapiosenki.pl', 'brahms.ircam.fr', 'cancioneros.si',
											'castalbums.org', 'catalogue.bnf.fr', 'cbfiddle.com', 'ccmixter.org', 'dnb.de',
											'ci.nii.ac.jp', 'classicalarchives.com', 'd-nb.info', 'dhhu.dk', 'discografia.dds.it',
											'discosdobrasil.com.br', 'dr.loudness-war.info', 'dramonline.org', 'encyclopedisque.fr',
											'ester.ee', 'finna.fi', 'finnmusic.net', 'folkwiki.se', 'fono.fi', 'generasia.com',
											'goodreads.com', 'ibdb.com', 'id.loc.gov', 'idref.fr', 'imvdb.com', 'irishtune.info',
											'isrc.ncl.edu.tw', 'ndl.go.jp', 'japanesemetal.gooside.com', 'jaxsta.com',
											'jazzmusicarchives.com', 'opac.kbr.be', 'librarything.com', 'livefans.jp', 'lortel.org',
											'mainlynorfolk.info', 'maniadb.com', 'metal-archives.com', 'mobygames.com', 'musicmoz.org',
											'musik-sammler.de', 'muziekweb.eu', 'mvdbase.com', 'ocremix.org', 'offiziellecharts.de',
											'openlibrary.org', 'operabase.com', 'operadis-opera-discography.org.uk', 'overture.doremus.org',
											'pomus.net', 'progarchives.com', 'psydb.net', 'qim.com', 'rateyourmusic.com', 'ra.co',
											'residentadvisor.net', 'rock.com.ar', 'rockensdanmarkskort.dk', 'rockinchina.com',
											'rockipedia.no', 'rolldabeats.com', 'smdb.kb.se', 'snaccooperative.org',
											'soundtrackcollector.com', 'spirit-of-metal.com', 'spirit-of-rock.com', 'stage48.net',
											'tedcrane.com', 'theatricalia.com', 'thedancegypsy.com', 'themoviedb.org', 'thesession.org',
											'touhoudb.com', 'triplejunearthed.com', 'trove.nla.gov.au', 'tunearch.org', 'utaitedb.net',
											'vkdb.jp', 'vndb.org', 'vocadb.net', 'whosampled.com', 'worldcat.org', 'www22.big.or.jp',
											'www5.atwiki.jp', 'ra.co', 'albumoftheyear.org', 'iobdb.com', 'repertoire.bmi.com',
											'sacm.org.mx', 'doo-wop.blogg.org', 'mdmarchive.co.uk', 'data.bnf.fr', 'ark.bnf.fr', 'n2t.net',
											'saisaibatake.ame-zaiku.com', 'generasia.com', 'genius.com', 'jaxsta.com', 'metalmusicarchives.com',
											'musicapopular.cl', 'videogam.in', 'quebecinfomusique.com', 'qim.com', 'rism.online',
											'tobarandualchais.co.uk', 'vk.gy', 'oclc.org', 'ascap.com', 'company-information.service.gov.uk',
											url => url.matches('soundbetter.com') && url.pathname.startsWith('/profiles/'),
											'opencorporates.com', 'astreetnearyou.org',
										],
										'soundcloud': ['soundcloud.com'], 'purevolume': ['purevolume.com'],
										'youtube': [
											url => url.matches('youtube.com') && !url.matches('music.youtube.com'),
											'youtu.be',
										],
										'video channel': [
											'vimeo.com', 'rumble.tv', 'odysee.com', 'tiktok.com', 'twitch.com', 'twitch.tv',
											'dailymotion.com', 'nicovideo.jp',
										],
										'social network': [
											'facebook.com', 'fb.com', 'twitter.com', 'x.com', 'instagram.com', 'linkedin.com', ,'vk.com',
											'snapchat.com', 't.me', 'mixcloud.com', 'reddit.com', 'pinterest.com', 'minds.com',
											'flickr.com', 'discord.com', '4chan.org', 'truthsocial.com', 'icq.com', 'pinterest.co.uk',
											'foursquare.com', 'reverbnation.com', 'threads.net', 'vine.co', 'weibo.com',
										],
										'art gallery': [
											'deviantart.com', 'behance.net', 'artstation.com', 'dribbble.com', 'pixiv.net',
										],
										'blog': [
											'wordpress.com', 'blogger.com', 'tumblr.com',
											'ameblo.jp', 'blog.livedoor.jp', 'jugem.jp', 'exblog.jp',
										],
										'apple music': ['music.apple.com'], 'bandcamp': ['bandcamp.com'],
										'CD Baby': ['cdbaby.com', 'cdbaby.name'],
										'youtube music': ['music.youtube.com'],
										'purchase for download': [
											'7digital.com', 'acousticsounds.com', 'beatport.com', 'beatsource.com', 'bleep.com',
											'boomkat.com', 'e-onkyo.com', 'eclassical.com', 'extrememusic.com',
											'genie.co.kr', 'hdtracks.com', 'highresaudio.com', 'itunes.apple.com', 'joox.com', 'jpc.de',
											'junodownload.com', 'kompakt.fm', 'kugou.com', 'kuwo.cn', 'melon.com', 'mora.jp',
											'music-flo.com', 'music.163.com', 'music.apple.com', 'apple.co', 'books.apple.com',
											'music.youtube.com', 'muziekweb.nl', 'nativedsd.com', 'ototoy.jp', 'qobuz.com',
											'prestomusic.com', 'prostudiomasters.com', 'recochoku.jp', 'shop.spotify.com',
											'supraphonline.cz', 'traxsource.com', 'y.qq.com', 'zdigital.com',
											'audiojelly.com', 'hd-music.info', 'musa24.fi', 'loudr.fm', 'store.tidal.comk',
										],
										'purchase for mail-order': [
											'bigcartel.com', 'ozon.ru', 'target.com', 'tower.jp', 'shop.tsutaya.co.jp', 'yesasia.com',
										],
										'download for free': ['jamendo.com', 'librivox.org'],
										'streaming': [
											url => [
												'com', 'co.uk', 'ae', 'at', 'com.au', 'com.br', 'ca', 'cn', 'de', 'es',
												'fr', 'in', 'it', 'jp', 'com.mx', 'nl', 'pl', 'se', 'sg', 'com.tr',
											].map(tld => 'music.amazon.' + tld).includes(url.hostname),
											'music.bugs.co.kr', 'deezer.com', 'genie.co.kr', 'melon.com', 'napster.com',
											'qobuz.com', 'tidal.com',
										],
										'free streaming': [
											'audiomack.com', 'anghami.com', 'boomplay.com', 'dailymotion.com', 'dogmazic.net',
											'instagram.com', 'jamendo.com', 'music.migu.cn', 'nicovideo.jp', 'spotify.com',
											url => ['com', 'by', 'kz', 'ru', 'uz'].map(tld => 'music.yandex.' + tld).includes(url.hostname),
										],
										'patronage': [
											'buymeacoffee.com', 'changetip.com', 'tip.me', 'd.rip', 'drip.kickstarter.com', 'flattr.com',
											'ko-fi.com', 'patreon.com', 'paypal.me', 'tipeee.com',
										],
										'crowdfunding': ['indiegogo.com', 'kickstarter.com'],
										'discography page': [
											'naxos.com', 'bis.se', 'universal-music.co.jp', 'jvcmusic.co.jp', 'wmg.jp', 'avexnet.jp',
											'kingrecords.co.jp', 'lantis.jp',
										],
										'lyrics': [
											'hoick.jp', 'joysound.com', 'kashinavi.com', 'laboiteauxparoles.com', 'lyric.evesta.jp',
											'directlyrics.com', 'lieder.net', 'utamap.com', 'j-lyric.net', 'muzikum.eu', 'gutenberg.org',
											'mainlynorfolk.info', 'musixmatch.com', 'online-bijbel.nl', 'petitlyrics.com', 'runeberg.org',
											'uta-net.com', 'utaten.com', 'wikisource.org',
										],
										'ticketing': [
											url => /^(?:(?:concerts|www)\.)?livenation\.(?:[a-z]{2,3}?\.)?[a-z]{2,4}$/i.test(url.hostname),
											url => /^(?:www\.)?ticketmaster\.(?:[a-z]{2,3}?\.)?[a-z]{2,4}/i.test(url.hostname),
										],
										'image': ['pixogs.com', 'wikimedia.org'], 'history site': ['web.archive.org'], 'online community': [ ],
									};
									if (linkCategories.ignored.some(url.matches.bind(url))) return -1;
									if (urlLinkTypes[entity] instanceof Object) for (let linkType in urlLinkTypes[entity])
										if (urlLinkTypes[entity][linkType] && linkType in linkCategories && linkCategories[linkType].some(url.matches.bind(url)))
											return urlLinkTypes[entity][linkType];
									if (urlLinkTypes[entity] instanceof Object && urlLinkTypes[entity].blog && (url.pathname.includes('blog')
											|| url.hostname.toLowerCase().split('.').includes('blog'))) return urlLinkTypes[entity].blog;
								}
								function unknownUrlHandler(url) {
									if (!url) throw new Error('Invalid argument');
									urls.push((connectEverywhere ? GlobalXHR.get(url, { anonymous: true }).then(({document}) =>
											document, reason => null) : Promise.reject('Not connectable')).then(function(document) {
										if (!(document instanceof HTMLDocument)) return;
										const title = document.head.querySelector('title'), patterns = {
											'biography': [/\b(?:bio(?:graphy))\b/i],
											'discography': [/\b(?:discography)\b/i],
											'interview': [/\b(?:interview)\b/i],
										}, getTypes = content => Object.keys(patterns).filter(linkType => linkType in urlLinkTypes[entity]
											&& patterns[linkType].some(rx => rx.test(content)));
										let types = title != null ? getTypes(title.textContent) : [ ];
										if (types.length <= 0) types = getTypes(document.body.textContent);
										if (debugLogging) console.debug('Attempt to get URL type from page content:', url.toString(), types, urlLinkTypes[entity]);
										if (types.length <= 0) return Promise.reject('URL type could not be determined from page content');
										if (types.length > 1) return Promise.reject('Ambiguous page content');
										return urlLinkTypes[entity][types[0]] || Promise.reject('Undetermined link type');
									}).catch(function(reason) {
										const linkType = GM_getValue('unknown_url_class', 'unknown');
										if (!(linkType < 0)) return urlLinkTypes[entity][linkType]
											|| Promise.reject(`Undetermined URL link type for ${entity} (${url.toString()})`);
									}).then(linkType => { if (linkType) return { link_type_id: linkType, text: url.toString() } }));
								}
								function relationResolver(entity, relation) {
									if (!entity || !relation) throw new Error('Invalid argument');
									if (!relation.id) return Promise.reject('Invalid entry');
									let worker = findMBID(entity, relation.id, relation);
									if (recursive) worker = worker.catch(reason => getCachedMBID(entity, discogsId)
										.catch(reason => createEntity(entity, relation.id, false)));
									return worker;
								}
								function normProfile(profile) {
									if (!profile || !(profile = profile.trim().replace(/\s+/g, ' '))) return;
									if (/^[^\.]*\.$/.test(profile)) profile = profile.slice(0, -1);
									//if (!profile.includes('.')) profile = profile.replace(...untitleCase);
									return profile;
								}
								function extractIdentifiers(entry) {
									if (!entry || !entry.profile) return;
									function* idExtractor(rx, validator = identifier => identifier) {
										let match;
										while ((match = rx.exec(entry.profile)) != null)
											if (match = validator(match[1])) yield match;
									}

									const identifiers = {
										isni: idExtractor(/\bISNI\b.{1,30}?\b((?:\d{4}[-\s]?){3}\d{3}[\dX])\b/gis, function(isni) {
											// Normalize: strip spaces and hyphens, uppercase X
											if ((isni = isni.replace(/[-\s]+/g, '').toUpperCase()).length !== 16) return;
											// Weighted-sum check (weights 16..2 for the first 15 digits)
											const sum = Array.prototype.reduce.call(isni.slice(0, 15),
												(sum, ch, index, chars) => sum + parseInt(ch, 10) * (chars.length + 1 - index), 0);
											// compute check digit: (11 - (sum % 11)) % 11  -> 10 => 'X', 11 -> 0 handled by modulo
											const check = (11 - (sum % 11)) % 11, expected = check === 10 ? 'X' : String(check);
											if (isni[15] === expected) return isni;
										}),
										ipi: idExtractor(/\bIPI\b.{1,30}?\b([A-Z](?:[-.]?\d{3}){3}[-.]?\d|\d{11})\b/gis, function(ipi) {
											// Try letter-prefixed form first: A123-456-789-0 (letter + groups + check digit)
											let check = /^[A-Z]((?:[-.]?\d{3}){3})[-.]?(\d)$/i.exec(ipi);
											if (check != null)
												// numeric part: the 9 + 1 check digit (remove separators)
												check = (check[1] + check[2]).replace(/\D/g, '');
											else if ((check = /^(\d{10})(\d)$/.exec(ipi)) != null)
												// plain numeric form: 10 digits + check digit -> 11 digits total
												check = check[1] + check[2];
											else return;
											// Luhn algorithm validation on the numeric string
											let sum = 0;
											for (let i = check.length - 1, pos = 0; i >= 0; --i, ++pos) {
												let d = parseInt(check.charAt(i), 10);
												if (pos % 2 === 1) {
													d *= 2;
													if (d > 9) d -= 9;
												}
												sum += d;
											}
											if (sum % 10 !== 0) return; // invalid IPI -> return void
											// Normalize: remove separators and uppercase any letter
											return /^[A-Z]/i.test(ipi) ? ipi.replace(/[-.]/g, '').toUpperCase() : check;
										}),
									};
									for (let key in identifiers) identifiers[key].forEach((id, index) =>
										{ postData.set(`edit-${entity}.${key}_codes.${index}`, id) });
								}
								function sortLegalName(name) {
									if (!name || name.includes(',')) return name;
									let words = name.split(/\s+/), sortName = words.pop();
									if (words.length > 0) sortName += ', ' + words.join(' ');
									return sortName;
								}
								function createAlias(entity, mbid, name, typeId, sortName) {
									if (!entity || !mbid || !name) return Promise.reject('Invalid argument');
									const postData = new URLSearchParams({ 'edit-alias.name': capitalizeName(name) });
									if (typeId) postData.set('edit-alias.type_id', typeId);
									if (sortName) postData.set('edit-alias.sort_name', capitalizeName(sortName));
									const editNote = [`Auto-imported from Discogs ${discogsEntity(entity)} id ${discogsId} (${[dcOrigin, discogsEntity(entity), discogsId].join('/')})`];
									if (scriptSignature) editNote.push('by ' + scriptSignature);
									if (editNote.length > 0) postData.set('edit-alias.edit_note', editNote.join(' '));
									if (!(params.createMissingEntities >= 2)) postData.set('edit-alias.make_votable', 1);
									return GlobalXHR.post([mbOrigin, entity, mbid, 'add-alias'].join('/'), postData, {
										responseType: null,
										recoverableErrors: [429],
									}).then(({status}) => status);
								}
								function processLabelProfile(entry) {
									if (!entry.profile) return;
									if (disambiguation = normProfile(entry.profile.trim().replace(/\r?\n[\S\s]*$/, '').trimRight()))
										disambiguation = translateDiscogsMarkup(disambiguation, false);
									if ((m = extractYear(entry, /\b(?:(?:est(?:\.|ablished\b)|founded\b|started\b|opened\b|created\b|incorporated\b).{1,30}?|(?:active (?:since|from)|(?:created|launched|formed) in)\b.{1,15}?)/)) > 0)
										postData.set(`edit-${entity}.period.begin_date.year`, m);
									if ((m = extractYear(entry, /\b(?:defunct(?: (?:since|from))?|ended|closed)\b.{1,15}?/)) > 0) {
										postData.set(`edit-${entity}.period.end_date.year`, m);
										postData.set(`edit-${entity}.period.ended`, 1);
									}
								}
								function extractNameVariantsFromProfile(profile) {
									const CRLF = '(?:\\r?\\n)', LISTSTART = '^\\s*[\\-\\*\\•\\‣\\∙\\‒\\–\\—\\▪]+\\s*', PATTERNS = [
										/(?:credit|print|appear|list|mention)(?:s|ing|ed)?(?:\s+\w+)*\s+as/,
										/(?:name|spelling)\s+(?:appearance|varia(?:nt|tion)|alternative|version|difference)s/,
										/(?:alternat(?:iv)?e|different|varying)\s+(?:name|spelling)s?/,
										/also\s+known\s+as|AKA/,
									].map(pattern => pattern.source);
									let nvs = new RegExp(`${CRLF}*^.*\\b(?:${PATTERNS.join('|')})\\b(?:\\s+\\w+){0,2}:?$${CRLF}?((?:${CRLF}${LISTSTART}.+$)+)`, 'im').exec(profile);
									if (nvs != null && (nvs = nvs[1].split(/\r?\n/).filter(Boolean)).length > 0)
										return nvs.map(nv => nv.replace(new RegExp(LISTSTART), '').trimRight());
									nvs = new RegExp(`${CRLF}*^.*\\b(?:${PATTERNS.join('|')})\\b(?:\\s+\\w+){,2}:$${CRLF}?((?:${CRLF}^.+$)+)`, 'im').exec(profile);
									if (nvs != null && (nvs = nvs[1].split(/\r?\n/).filter(Boolean)).length > 0)
										return nvs.map(nv => nv.trim());
									nvs = new RegExp(`\\b(?:${PATTERNS.join('|')})\\b:?\\s+("[^"]+"(?:(?:,|,?\\s+(?:and|or))\\s+"[^"]+")*)`, 'im').exec(profile);
									if (nvs != null && (nvs = nvs[1].match(/"[^"]+"/g)).length > 0)
										return nvs.map(nv => nv.replaceAll('"', ''));
									return null;
								}
								function aliasesFromProfile(mbid, entry) {
									console.assert(rxMBID.test(mbid), entity, discogsId);
									if (!mbid || !entry || !entry.profile) return;
									let nvs = extractNameVariantsFromProfile(entry.profile);
									if (nvs == null) return;
									const name = stripDiscogsNameVersion(entry.name);
									if (name) nvs = nvs.filter(nv => nv.toLowerCase() != name.toLowerCase());
									if (nvs.length > 0) Promise.all(nvs.map(nv => createAlias(entity, mbid, nv, ({
										artist: 3,
										label: 2,
										series: 2,
										place: 2,
									})[entity]))).then(function(statusCodes) {
										if ((statusCodes = statusCodes.filter(statusCode => statusCode >= 200 && statusCode < 400)).length <= 0) return;
										notify(`${statusCodes.length} alias(es) for ${entity} <b>${name}</b> successfully created`, 'aliascreated');
										console.info('%d alias(es) for %s %s successfully created', statusCodes.length, entity, name);
									}, function(reason) {
										console.warn('Failed to create some alias(es) for %s %s (%s)', entity, name, reason);
									});
								}
								function create(entry) {
									if (!(entry instanceof Object)) throw new Error('Invalid argument');
									if (!annotation && entry.profile && (entry.profile.length >= 200
											|| /\[[armlu](?:=?\d+|=[^\[\]]+)\]/i.test(entry.profile)))
										annotation = translateDiscogsMarkup(entry.profile, true);
									return Promise.all([
										Promise.all(relations.map(relation => relation.catch(reason => null))),
										Promise.all(urls),
										disambiguation,
									]).then(function([relations, urls, disambiguation]) {
										if (entry.name) edit.name = capitalizeName(stripDiscogsNameVersion(entry.name));
										if (!(edit.type_id >= 0)) delete edit.type_id;
										if (edit.comment = disambiguation) while (edit.comment.length > 255)
											edit.comment = edit.comment.replace(/\s+\S+$/, '');
										else edit.comment = '';
										for (let field in edit) postData.set(`edit-${entity}.${field}`, edit[field]);
										relations.filter(Boolean).forEach(function(relation, index) {
											const requiredFields = ['link_type_id', 'target'].every(key => relation[key]);
											console.assert(requiredFields, relation);
											if (requiredFields) for (let key in relation) if (relation[key] != undefined)
												postData.set(`edit-${entity}.rel.${index}.${key}`, relation[key]);
										});
										urls.filter(Boolean).filter(url => url.link_type_id > 0 && url.text).forEach(function(url, index) {
											for (let key in url) postData.set(`edit-${entity}.url.${index}.${key}`, url[key]);
										});
										let editNote = [`Auto-created from metadata of Discogs ${discogsEntity(entity)} id ${discogsId} (${[dcOrigin, discogsEntity(entity), discogsId].join('/')})`];
										if (scriptSignature) editNote.push('by ' + scriptSignature);
										postData.set(`edit-${entity}.edit_note`, editNote.join(' '));
										if (!(params.createMissingEntities >= 2)) postData.set(`edit-${entity}.make_votable`, 1);
										// if (debugLogging) console.debug('createEntity %s %d', entity, discogsId, postData);
										return GlobalXHR.post([mbOrigin, entity, 'create'].join('/'), postData, { recoverableErrors: [429] }).then(gidFromResponse).then(function(gid) {
											saveToCache(entity, discogsId, gid);
											if (edit.name) {
												const Entity = entity[0].toUpperCase() + entity.slice(1).toLowerCase();
												notify(`${Entity} <b>${edit.name}</b> successfully created`, 'entitycreated');
												console.info(Entity, edit.name, 'successfully created (', gid, ')');
											}
											if (params.openCreatedEntries) {
												if (!openedForEdit.has(gid)) {
													openedForEdit.add(gid);
													GM_openInTab([mbOrigin, entity, gid, 'edit'].join('/'), true);
												}
												if (params.openCreatedEntries >= 2) {
													const url = new URL('search', mbOrigin);
													let query = edit.name;
													if (['label', 'place'].includes(entity)) query = query.replace(...rxBareLabel);
													url.searchParams.set('method', 'indexed'); // 'direct'
													url.searchParams.set('type', entity);
													url.searchParams.set('query', query);
													GM_openInTab(url.href, true);
												}
											}
											if (annotation && !(annotation instanceof Promise)) annotation = Promise.resolve(annotation);
											if (annotation) annotation.then(function(annotation) {
												if (!annotation || !(annotation = annotation.trim())) return 0;
												const postData = new URLSearchParams({ 'edit-annotation.text': annotation });
												if (scriptSignature) postData.set('edit-annotation.edit_note', 'Auto-imported from Discogs by ' + scriptSignature);
												//postData.set('edit-annotation.changelog', '');
												if (!(params.createMissingEntities >= 2)) postData.set(`edit-${entity}.make_votable`, 1);
												return GlobalXHR.post([mbOrigin, entity, gid, 'edit_annotation'].join('/'), postData, { responseType: null, recoverableErrors: [429] })
													.then(({status}) => { notify(`Annotation for ${entity} <b>${edit.name}</b> successfully added`, 'annotationadded') });
											}).catch(reason => { console.warn('Failed to add %s annotation for the reason', entity, reason) });
											return gid;
										}, debugLogging ? function(reason) {
											console.debug('Create %s %d failed (%s): postData=%o', entity, discogsId, reason, postData);
											if (reason != 'Incorrect response structure')
												alert(`Create ${entity} ${discogsId} failed (${reason}), see browser console for postdata dump`);
											return Promise.reject(reason);
										} : undefined);
									});
								}

								console.assert(params.createMissingEntities);
								if (!(params.searchSize > 0))
									return Promise.reject('Exhaustive lookups not allowed (create entity)');
								if (!['rg', 'release', 'recording', 'work'].some(entity => params[entity + 'Relations'])
										&& !['series'].includes(entity) && entity in credits
										&& lookupIndexes[entity][discogsId].contexts.every(context => context in credits[entity]))
									return Promise.reject('Prerequisites not met for create entity');
								const postData = new URLSearchParams, edit = { }, urls = [ ];
								const resolverAdapter = (resolver, postData) =>
									resolver.then(mbid => Object.assign({ 'target': mbid }, postData));
								let relations = [ ], disambiguation, m, annotation;
								const extractYear = (entry, rx) => entry && entry.profile && rx instanceof RegExp
									&& (rx = new RegExp(`(?:${rx.source})\\b((?:1\\d|20)\\d{2})\\b`, 'i').exec(entry.profile)) != null
									&& (rx = parseInt(rx[1])) >= 1000 && rx <= new Date().getUTCFullYear() ? rx : undefined;
								const connectEverywhere = typeof GM_info == 'object' && [
									GM_info?.script?.connects,
									GM_info?.script?.options?.override?.use_connects,
								].some(root => Array.isArray(root) && root.includes('*'));
								const urlLinkTypes = {
									artist: {
										'ignored': -1, 'unknown': 185,
										'apple music': 1131, 'bandcamp': 718, 'soundcloud': 291, 'youtube music': 1080,
										'youtube': 193, 'purevolume': 174, 'BookBrainz': 852, 'CPDL': 981, 'discogs': 180,
										'IMDb': 178, 'IMSLP': 754, 'last.fm': 840, 'secondhandsongs': 307, 'setlistfm': 816,
										'songkick': 785, 'vgmdb': 191, 'VIAF': 310, 'wikidata': 352, 'wikipedia': 179,
										'allmusic': 283, 'bandsintown': 862, 'CD Baby': 919, 'official homepage': 183,
										'fanpage': 172, 'biography': 182, 'discography page': 184, 'interview': 707, 'image': 173,
										'lyrics': 197, 'social network': 192,  'video channel': 303, 'online community': 185,
										'art gallery': 1192, 'blog': 199, 'crowdfunding': 902, 'patronage': 897, 'ticketing': 1193,
										'purchase for mail-order': 175, 'purchase for download': 176, 'download for free': 177,
										'free streaming': 194, 'streaming': 978, 'other databases': 188,
									},
									label: {
										'ignored': -1, 'unknown': 219,
										'official site': 219, 'lyrics': 982, 'blog': 224, 'history site': 211, 'catalog site': 212,
										'logo': 213, 'image': 213, 'fanpage': 214, 'crowdfunding': 903, 'patronage': 899, 'ticketing': 1194,
										'social network': 218, 'soundcloud': 290, 'video channel': 304, 'youtube': 225,
										'purchase for mail-order': 960, 'purchase for download': 959, 'download for free': 958,
										'free streaming': 997, 'streaming': 1005, 'apple music': 1130, 'bandcamp': 719,
										'other databases': 222, 'BookBrainz': 851, 'discogs': 217, 'IMDb': 313, 'last.fm': 838,
										'secondhandsongs': 977, 'vgmdb': 210, 'VIAF': 311, 'wikidata': 354, 'wikipedia': 216,
									},
									place: {
										'ignored': -1, 'unknown': 363,
										'official homepage': 363, 'blog': 627, 'image': 396, 'social network': 429,
										'soundcloud': 940, 'video channel': 495, 'youtube': 528, 'crowdfunding': 909,
										'fanpage': 1191, 'history site': 984, 'patronage': 900, 'ticketing': 1195,
										'other databases': 561, 'bandsintown': 861, 'discogs': 705, 'geonames': 934, 'IMDb': 706,
										'last.fm': 837, 'setlistfm': 817, 'songkick': 787, 'vgmdb': 1013, 'VIAF': 920,
										'wikidata': 594, 'wikipedia': 595,
									},
									series: {
										'ignored': -1, 'unknown': 745,
										'official homepage': 745, 'schedule': 1083, 'social network': 784, 'soundcloud': 870,
										'podcast feed': 915, 'video channel': 805, 'youtube': 792, 'crowdfunding': 910,
										'fanpage': 1189, 'patronage': 901, 'ticketing': 1196, 'other databases': 746,
										'BookBrainz': 1167, 'discogs': 747, 'setlistfm': 938, 'VIAF': 1001, 'wikidata': 749,
										'wikipedia': 744,
									},
								};
								const discogsEntry = dcApiRequest(discogsEntity(entity) + 's/' + discogsId), createHandler = ({
									artist: () => discogsEntry.then(function(artist) {
										function addUrl(url, linkTypeId) {
											if (!(url = validateURL(url))) return;
											if (!linkTypeId) linkTypeId = typeIdFromUrl(url);
											if (!linkTypeId && (isDomainpart(stripDiscogsNameVersion(artist.name), url)
													|| artist.realname && isDomainpart(stripDiscogsNameVersion(artist.realname), url)
													|| artist.aliases && artist.aliases.some(alias => isDomainpart(stripDiscogsNameVersion(alias.name), url))))
												linkTypeId = urlLinkTypes[entity]['official homepage'];
											if (!(linkTypeId < 0)) if (!linkTypeId) unknownUrlHandler(url); else {
												const relation = { link_type_id: linkTypeId, text: url.href };
												urls.push(connectEverywhere ? GlobalXHR.get(url, { responseType: null, anonymous: true })
													.then(response => relation, reason => null) : relation);
											}
										}
										function groupAttributes(group, member) {
											const attributes = [ ];
											if (namedBy(group, member, 'name', 'alias', 'anv', 'realname'))
												attributes.push('4fd3b255-a7d7-4424-9a63-40fa543b601c'); // original
											if (namedBy(group, member, 'name'))
												attributes.push('15eea3b8-5655-43c8-b2c2-dd03c901a79b'); // eponymous
											if (attributes.length > 0) return Object.assign.apply(this, attributes.map((attribute, index) =>
												({ [`attributes.${index}.type.gid`]: attribute })));
										}

										const name = capitalizeName(stripDiscogsNameVersion(artist.name.trim()));
										if (/(?:\&|And|With)\s+(?:Friends)$/i.test(name)) return Promise.reject('Pseudo entity');
										const typeIds = new Set, nameParsers = {
											1: /^(?:DJ|Dj|MC)\b/,
											2: /\b(?:Group|Band|Ensemble|Duo|Trio|(?:Quartet|Quintet|Sextet|Septet|Octet|Nonet|Tentet)(?:te?)?|All[ \-]?tars?|Players|Collective|Gang|Crew|Consort|Conjurito|Conjunto)\b|\s+(?:[\&\+]|and|vs\.?)\s+/i,
											3: /\b(?:Management|Agency|Company|(?:Entertainment|Enterprise|Marketing|Communication|Consult(?:ing)?|Production|Association|Advertisement|Record(?:ing)?|Studio|Atelier|Est[uú]dio)s?)\b/i,
											//4: => character
											5: /(?:or(?:ch|qu|k)est|(?:ph|f)ilharmon|s[yi][mn](?:ph|f)oni|kapelle\b|orķest|оркест)/i,
											6: /\b(?:Choir|Chorus|Chorale|[ck]oro|Chœur|Chöre|Chor|Singers|Chanteurs|Voices|хор)\b|(?:koor)$/i,
										}, rxs = [
											/^(The|Da|Le|La|El|Les|Los|Der|Die|Das|DJ|Dj|MC)\s+/,
											/\s+(?:[\&\+]|and)\s+/i,
											/\b(?:Project|Soloists)\b/i, // natural sort, unknown type
											/^["„]?[']?\p{L}(?:[\-']?\p{L})*[']?\.?["“]?$/u,
											/^[']?\p{L}(?:[\-']?\p{L})+[']?$/u,
										];
										for (let typeId in nameParsers) if (nameParsers[typeId].test(name))
											typeIds.add(parseInt(typeId));
										if (typeIds.size == 1) edit.type_id = typeIds.values().next().value;
										if (!edit.type_id && (artist.members && artist.members.length > 1)) edit.type_id = 2;
										if (!edit.type_id && (artist.realname || artist.groups && artist.groups.length > 0)
												|| artist.realname && artist.groups && artist.groups.length > 0)
											edit.type_id = 1;
										if ((m = rxs[0].exec(name)) != null && !rxs[1].test(name)) {
											edit.sort_name = m.input.slice(m[0].length) + ', ' + m[1];
											if (!edit.type_id) edit.type_id = -1;
										} else if (edit.type_id == 1) edit.sort_name = sortLegalName(name);
										else edit.sort_name = name;
										if (!edit.type_id) {
											const words = stripDiscogsNameVersion(artist.name.trim()).split(/\s+/);
											if (words.length < 2 || words.length > 3 || words.every(word => word.toLowerCase() == word)
													//|| words.some(word => /^[\p{L}]{2,}$/u.test(word) && word.toUpperCase() == word)
													|| !words.every((word, n, a) => rxs[n < a.length - 1 ? 3 : 4].test(word)))
												edit.type_id = -1; // not a legal name
										}
										if (!edit.type_id && rxs[2].test(name)) edit.type_id = -1;
										if (!edit.type_id && params.openCreatedEntries) edit.type_id = -2;
										// gender_id: 1=M. 2=F, 3=🤷, 4=not applicable, 5=other
										if (edit.type_id == 3) edit.gender_id = 4;
										if (!edit.type_id) return Promise.reject('Undeterminable sort name');
										addUrl([dcOrigin, discogsEntity(entity), artist.id].join('/'));
										if (artist.urls) for (let url of artist.urls) addUrl(url);
										// if (artist.images) artist.images.forEach((image, index) =>
										// 	{ if (index == 0 && (image = image.uri || image.resource_url)) addUrl(image, 173) });
										const isCollectiveEntity = [2, 5, 6].includes(edit.type_id);
										if (artist.profile) {
											var profile = normProfile(artist.profile.trim().replace(/\r?\n[\S\s]*$/, '').trimRight());
											profile = translateDiscogsMarkup(profile, false);
										} else if (!isCollectiveEntity)
											profile = getArtistCreditTypes(discogsId).then(guessArtistProfile);
										disambiguation = Promise.all([
											profile,
											getArtistDiscographyReleases(artist.id)
												.then(releaseGroups => getCollaborationsWith(artist, releaseGroups)),
										].map(safePromiseHandler)).then(function([profile, performsWith]) {
											let disambiguation = [ ];
											if (artist.realname && uniqueRealName(artist.realname, stripDiscogsNameVersion(artist.name))
													&& !isCollectiveEntity) disambiguation.push(capitalizeName(artist.realname));
											const weakProfile = !profile || profile.length < 40, [aliases, groups, members] = [
												(artist.aliases || [ ]).filter(alias => !artist.realname
													|| uniqueRealName(artist.realname, stripDiscogsNameVersion(alias.name))),
												(artist.groups || [ ]).filter(group => group.active)
													.map(group => stripDiscogsNameVersion(group.name)),
												(artist.members || [ ]).filter(member => member.active)
													.map(member => stripDiscogsNameVersion(member.name)),
											];
											if (weakProfile && members.length > 0)
												disambiguation = [[members.pop(), members.join(', ')].filter(Boolean).reverse().join(' & ')];
											if (profile) disambiguation.push(profile);
											if (weakProfile) {
												if (members.length <= 0 && aliases.length > 0)
													disambiguation.push('aka. ' + aliases.map(alias => stripDiscogsNameVersion(alias.name)).join(', '));
												console.assert(!performsWith || Array.isArray(performsWith));
												if (!isCollectiveEntity) if (members.length <= 0 && groups.length > 0)
													disambiguation.push('member of ' + groups.join(', '));
												else if (groups.length <= 0 && performsWith)
													disambiguation.push('performs with ' + performsWith.map(artist =>
														capitalizeName(stripDiscogsNameVersion(artist.name))).join(', '));
											}
											return disambiguation.filter(Boolean).join('; ') || undefined;
										});
										if (artist.profile) {
											if (!(edit.type_id > 4)) {
												if ((m = /\s+\([^\(\)]*\b((?:1\d|20)\d{2})\b[^\(\)]*-[^\(\)]*\b((?:1\d|20)\d{2})\b[^\(\)]*\)/.exec(artist.profile)) != null) {
													edit['period.begin_date.year'] = parseInt(m[1]);
													edit['period.end_date.year'] = parseInt(m[2]);
												}
												if (!(edit.type_id > 1) && (m = extractYear(artist, /\b(?:born\b.{1,30}?|b\.\s*)/)) > 0
														|| edit.type_id != 1 && (m = extractYear(artist, /\b(?:(?:est(?:\.|ablished\b)|founded\b|started\b).{1,30}?|(?:active (?:from|since)|formed in)\b.{1,15}?)/)) > 0)
													edit['period.begin_date.year'] = m;
												if (!(edit.type_id > 1) && (m = extractYear(artist, /\b(?:died|deceased|passed away|dead)\b.{1,30}?/)) > 0
														|| edit.type_id != 1 && (m = extractYear(artist, /\b(?:dissolved|ended|disbanded)\b.{1,15}?/)) > 0)
													[edit['period.end_date.year'], edit['period.ended']] = [m, 1];
											}
											extractIdentifiers(artist);
										}
										const periodEnded = relative => 'active' in relative ? relative.active ? 0 : 1 : undefined;
										if (artist.aliases) artist.aliases.forEach(function(alias) {
											if (stripDiscogsNameVersion(alias.name) == stripDiscogsNameVersion(artist.name)) return;
											if (!artist.realname) return;
											const relation = { 'link_type_id': 108, 'period.ended': periodEnded(alias) };
											if (!uniqueRealName(artist.realname, artist.name)) // performs as
												relations.push(resolverAdapter(relationResolver(entity, alias), Object.assign({ 'backward': 0 }, relation)));
											if (!uniqueRealName(artist.realname, alias.name)) // performance name of
												relations.push(resolverAdapter(relationResolver(entity, alias), Object.assign({ 'backward': 1 }, relation)));
										});
										if (artist.members) artist.members.forEach(function(member) {
											if (stripDiscogsNameVersion(member.name) == stripDiscogsNameVersion(artist.name)) return;
											const mbidResolver = relationResolver(entity, member);
											relations.push(resolverAdapter(mbidResolver, Object.assign({
												'link_type_id': 103,
												'backward': 1,
												'period.ended': periodEnded(member),
											}, groupAttributes(artist, member))));
											if (namedBy(artist, member, 'name', 'alias', 'anv', 'realname')) // founded by
												relations.push(resolverAdapter(mbidResolver, { 'link_type_id': 895, 'backward': 1 }));
										});
										if (artist.groups) artist.groups.forEach(function(group) {
											if (stripDiscogsNameVersion(group.name) == stripDiscogsNameVersion(artist.name)) return;
											const mbidResolver = relationResolver(entity, group);
											relations.push(resolverAdapter(mbidResolver, Object.assign({
												'link_type_id': 103,
												'backward': 0,
												'period.ended': periodEnded(group),
											}, groupAttributes(group, artist))));
											if (namedBy(group, artist, 'name', 'alias', 'anv', 'realname')) // founded by
												relations.push(resolverAdapter(mbidResolver, { 'link_type_id': 895, 'backward': 0 }));
										});
										const promise = create(artist);
										if (params.createAliases > 0) promise.then(function(mbid) {
											const aliasWorkers = [ ];
											if (edit.type_id == 1 && artist.realname && uniqueRealName(artist.realname, name))
												aliasWorkers.push(createAlias(entity, mbid, artist.realname, 2, sortLegalName(artist.realname)));
											if (artist.namevariations && artist.namevariations.length > 0 && params.createAliases >= 2) {
												const anvs = artist.namevariations.filter(function(anv) {
													if (anv.length < 3 || /^\w(?:\W+\w)*$/.test(anv)) return false;
													const cmpNorm = str => str && toASCII(str).toLowerCase()
														.replace(/[\s\‐\−\—\–\x00-\x25\x27-\x2F\x3A-\x40\x5B-\x5E\x60\x7B-\x7F\u2019]+/g, '');
													const sameStringValues = (...strVals) => strVals.length > 0 && strVals.every(strVal1 => strVal1
														&& strVals.every(strVal2 => strVal2 && cmpNorm(strVal2) == cmpNorm(strVal1)));
													return !sameStringValues(anv, name) && !sameStringValues(anv, artist.realname);
												});
												if (anvs.length > 0) {
													const anvsRanked = Promise.all(anvs.concat(undefined).map(anv => getArtistDiscographyStats(discogsId, anv))).then(function(stats) {
														const totals = stats.map(anvStats => Object.values(anvStats)
															.filter(property => property instanceof Object && 'count' in property)
															.reduce((total, category) => total + category.count, 0));
														const total = totals.pop();
														return anvs.filter((anv, index) => totals[index] >= total / 6);
													}).catch(function(reason) {
														console.warn('Error fetching ANVs stats for %s %d: %s', entity, discogsId, reason);
														return null;
													});
													Array.prototype.push.apply(aliasWorkers, anvs.map(anv => anvsRanked.then(function(anvsRanked) {
														if (anvsRanked == null) return Promise.resolve(-1);
														const index = anvsRanked.filter(anv => anvs.includes(anv)).indexOf(anv);
														if (index < 0 || index >= GM_getValue('max_anvs', 5)) return Promise.resolve(0);
														return createAlias(entity, mbid, anv, similarStringValues(anv, name, 0.9) ? 3 : 1);
													})));
												}
											}
											if (aliasWorkers.length > 0) Promise.all(aliasWorkers).then(function(statusCodes) {
												statusCodes = statusCodes.filter(statusCode => statusCode >= 200 && statusCode < 400);
												if (statusCodes.length <= 0) return;
												notify(`${statusCodes.length} alias(es) for ${entity} <b>${name}</b> successfully created`, 'aliascreated');
												console.info('%d alias(es) for %s %s successfully created', statusCodes.length, entity, name);
											}, function(reason) {
												console.warn('Failed to create some alias(es) for %s %s (%s)', entity, name, reason);
											});
										});
										return promise;
									}),
									label: () => discogsEntry.then(function(label) {
										function addUrl(url, linkTypeId) {
											if (!(url = validateURL(url))) return;
											if (!linkTypeId) linkTypeId = typeIdFromUrl(url);
											if (!linkTypeId && isDomainpart(stripDiscogsNameVersion(label.name).replace(...rxBareLabel), url))
												linkTypeId = urlLinkTypes[entity]['official site'];
											if (!(linkTypeId < 0)) if (!linkTypeId) unknownUrlHandler(url); else {
												const relation = { link_type_id: linkTypeId, text: url.href };
												urls.push(connectEverywhere ? GlobalXHR.get(url, { responseType: null, anonymous: true })
													.then(response => relation, reason => null) : relation);
											}
										}
										function guessLabelType(value) {
											if (!value) return;
											const typeIds = new Set;
											if (/\b(?:publish(?:er|ings?))\b/i.test(value)) typeIds.add(7);
											if (/\b(?:distribut(?:or|ions?|ing))\b/i.test(value)) typeIds.add(1);
											if (/\b(?:prod(?:uctions?)?)\b/i.test(value)) typeIds.add(3);
											if (/\b(?:manufactur(?:er|ings?)|pressing|(?:re|du)plicat(?:or|ions?))\b/i.test(value)) typeIds.add(10);
											if (/\b(?:imprint)\b/i.test(value)) typeIds.add(9);
											if (/\b(?:holdings?)\b/i.test(value)) typeIds.add(2);
											if (/\b(?:rights|copyright|licens(?:ings?|or))\b/i.test(value)) typeIds.add(8);
											if (typeIds.size == 1) return edit.type_id = typeIds.values().next().value;
										}

										addUrl([dcOrigin, discogsEntity(entity), label.id].join('/'));
										if (label.urls) for (let url of label.urls) addUrl(url);
										// if (label.images) label.images.forEach((image, index) =>
										// 	{ if (index == 0 && (image = image.uri || image.resource_url)) addUrl(image, 213) });
										if (label.profile) {
											processLabelProfile(label);
											guessLabelType(label.profile);
											const id = /\b(?:LC|Label\s?Code)\b.{1,20}?\b(\d+)\b/is.exec(label.profile);
											if (id != null) edit.label_code = id[1];
											extractIdentifiers(label);
										}
										if (!edit.type_id) guessLabelType(stripDiscogsNameVersion(label.name));
										const labelAdapter = (relative, backward = false) =>
											resolverAdapter(relationResolver(entity, relative),
												{ 'link_type_id': 200, 'backward': backward ? 1 : 0 });
										if (label.sublabels) Array.prototype.push.apply(relations,
											label.sublabels.map(subLabel => labelAdapter(subLabel, false)));
										if (label.parent_label) relations.push(labelAdapter(label.parent_label, true));
										let promise = create(label);
										if (label.profile && params.createAliases > 0) promise = promise.then(function(mbid) {
											aliasesFromProfile(mbid, label);
											return mbid;
										});
										return promise;
									}),
									series: () => discogsEntry.then(function(series) {
										function addUrl(url, linkTypeId) {
											if (!(url = validateURL(url))) return;
											if (!linkTypeId) linkTypeId = typeIdFromUrl(url);
											if (!linkTypeId && isDomainpart(stripDiscogsNameVersion(series.name), url))
												linkTypeId = urlLinkTypes[entity]['official homepage'];
											if (!(linkTypeId < 0)) if (!linkTypeId) unknownUrlHandler(url); else {
												const relation = { link_type_id: linkTypeId, text: url.href };
												urls.push(connectEverywhere ? GlobalXHR.get(url, { responseType: null, anonymous: true })
													.then(response => relation, reason => null) : relation);
											}
										}

										if (series.parent_label) edit.type_id = 2;
										if (!edit.type_id && series.profile
												&& /\b(?:editions?\b|remasters?|re-?issues?|anniversary\b)/i.test(series.profile))
											edit.type_id = 2;
										if (!edit.type_id && cmpNorm(release.title).includes(cmpNorm(stripDiscogsNameVersion(series.name))))
											edit.type_id = 1;
										if (!edit.type_id && params.openCreatedEntries && !['release', 'release-group'].some(relateAtLevel))
											edit.type_id = 1;
										if (!edit.type_id) return Promise.reject('Series type not determinable for ' + series.name);
										edit.ordering_type_id = 1;
										addUrl([dcOrigin, discogsEntity(entity), series.id].join('/'));
										if (series.urls) for (let url of series.urls) addUrl(url);
										if (series.profile) {
											disambiguation = normProfile(series.profile.trim().replace(/\r?\n[\S\s]*$/, '').trimRight());
											disambiguation = translateDiscogsMarkup(disambiguation, false);
										}
										if (series.parent_label) relations.push(resolverAdapter(relationResolver('label', series.parent_label),
											{ 'link_type_id': 933, 'backward': 0 }));
										let promise = create(series);
										if (series.profile && params.createAliases > 0) promise = promise.then(function(mbid) {
											aliasesFromProfile(mbid, series);
											return mbid;
										});
										return promise;
									}),
									place: () => discogsEntry.then(function(place) {
										function addUrl(url, linkTypeId) {
											if (!(url = validateURL(url))) return;
											if (!linkTypeId) linkTypeId = typeIdFromUrl(url);
											if (!linkTypeId && isDomainpart(stripDiscogsNameVersion(place.name).replace(...rxBareLabel), url))
												linkTypeId = urlLinkTypes[entity]['official homepage'];
											if (!(linkTypeId < 0)) if (!linkTypeId) unknownUrlHandler(url); else {
												const relation = { link_type_id: linkTypeId, text: url.href };
												urls.push(connectEverywhere ? GlobalXHR.get(url, { responseType: null, anonymous: true })
													.then(response => relation, reason => null) : relation);
											}
										}
										function guessPlaceType(value, uniqueMatch = false) {
											if (!value) return;
											const typeIds = new Set;
											if (/\b(?:(?:Studio|Est[uú]dio)s?|Studiot)\b/i.test(value)) typeIds.add(1);
											if (/\b(?:Stadium)\b/i.test(value)) typeIds.add(4);
											if (/\b(?:Arena)\b/i.test(value)) typeIds.add(5);
											if (/\b(?:Park)\b/i.test(value)) typeIds.add(9);
											if (/\b(?:Amphitheat(?:re|er))\b/i.test(value)) typeIds.add(43);
											if (/\b(?:Hall|Theat(?:re|er))\b/i.test(value)) typeIds.add(44);
											if (/\b(?:Club)\b/i.test(value)) typeIds.add(42);
											if (/\b(?:Festival)\b/i.test(value)) typeIds.add(45);
											if (/\b(?:Venue)\b/i.test(value)) typeIds.add(2);
											if (typeIds.size > 0 && (typeIds.size == 1 || !uniqueMatch))
												return edit.type_id = typeIds.values().next().value;
										}

										if ((!place.name || !guessPlaceType(stripDiscogsNameVersion(place.name, true)))
												&& place.profile) guessPlaceType(place.profile, true);
										addUrl([dcOrigin, discogsEntity(entity), place.id].join('/'));
										if (place.urls) for (let url of place.urls) addUrl(url);
										// if (place.images) place.images.forEach((image, index) =>
										// 	{ if (index == 0 && (image = image.uri || image.resource_url)) addUrl(image, 396) });
										if (place.profile) {
											processLabelProfile(place);
										}
										if (place.contact_info) edit.address = place.contact_info.split(/(?:\r?\n)+/)
											.map(line => line.trim()).filter(Boolean).join(', ');
										relations.push(resolverAdapter(relationResolver('label', place).catch(reason =>
											!isFatalReason(reason) && place.parent_label ? relationResolver('label', place.parent_label)
												: Promise.reject(reason)), { 'link_type_id': 989, 'backward': 1 }));
										let promise = create(place);
										if (place.profile && params.createAliases > 0) promise = promise.then(function(mbid) {
											aliasesFromProfile(mbid, place);
											return mbid;
										});
										return promise;
									}),
								}[entity]);
								console.assert(typeof createHandler == 'function', entity);
								if (typeof createHandler != 'function') return Promise.reject('Create not implemented for ' + entity);
								const hasLookupEntry = entity in lookupIndexes && discogsId in lookupIndexes[entity];
								return getCachedMBID(entity, discogsId).catch(reason => (hasLookupEntry ? mbApiRequest(entity, {
									query: searchQueryBuilder(entity, lookupIndexes[entity][discogsId], false),
								}).then(function(results) {
									results = results[mbEntities(entity)];
									if (debugLogging && results.length > 0) console.debug('Search results for %s %d (unfiltered):', entity, discogsId, results);
									results = results.filter(function(result) {
										const equal = (name, normFn = name => name && toASCII(name).toLowerCase()) => {
											const cmp = root => normFn(root.name) == normFn(name);
											return cmp(result) || result.aliases && result.aliases.some(cmp);
										};
										return equal(stripDiscogsNameVersion(lookupIndexes[entity][discogsId].name))
											|| lookupIndexes[entity][discogsId].anv && equal(lookupIndexes[entity][discogsId].anv);
									});
									if (debugLogging && results.length > 0) console.debug('Search results for %s %d (filtered):', entity, discogsId, results);
									return Promise.all(results.map(result => mbApiRequest(entity + '/' + result.id, { inc: `aliases+url-rels+${entity}-rels` }).then(function(entry) {
										const discogsIds = getDiscogsRels(entry, entity);
										if (debugLogging) console.debug('Entry', entry.id, 'Discogs ids:', discogsIds, 'Relations:', entry.relations);
										if (discogsIds.includes(parseInt(discogsId))) return /*discogsIds.length > 1 ? true : */entry.id;
										return discogsIds.length <= 0;
									}).catch(reason => true)));
								}) : Promise.reject(`Assertion failed: Entry ${entity} ${discogsId} not found in lookup indexes`)).catch(function(reason) {
									console.warn('Presearch for createEntry not performed for the reason:', reason);
									return null;
								}).then(function(results) {
									if (debugLogging) console.debug('Processed search results for %s %d:', entity, discogsId, results);
									if (results != null) {
										const mbids = results.filter(result => mbIdExtractor(result));
										if (mbids.length == 1) {
											discogsName(entity, discogsId).then(name =>
												{ notify(`MBID for ${entity} <b>${name}</b> found by having direct Discogs relative`, 'foundbybacklink') });
											saveToCache(entity, discogsId, mbids[0]);
											return mbids[0];
										} else if (results.filter(Boolean).length <= 0) return createHandler();
									}
									if (!hasLookupEntry) return Promise.reject('Name collision');
									results = new URL('/ws/js/check_duplicates', mbOrigin);
									results.searchParams.set('type', entity);
									results.searchParams.set('name', stripDiscogsNameVersion(lookupIndexes[entity][discogsId].name));
									return GlobalXHR.get(results, { responseType: 'json', recoverableErrors: [429] }).then(({json}) =>
										json.duplicates.length > 0 ? Promise.reject('Name collision') : createHandler());
								}));
							}

							let promise = findMBID(entity, discogsId);
							if (params.createMissingEntities) promise = promise.catch(reason => !isFatalReason(reason) ?
								createEntity(entity, discogsId) : Promise.reject(reason));
							return promise.then(function(resolved) {
								function checkMBID(resolved) {
									if (resolved === null || rxMBID.test(resolved)) return;
									throw `Assertion failed: Entity ${entity} (${discogsId}) resolving to invalid MBID ${resolved}`;
								}

								if (!Array.isArray(resolved)) {
									checkMBID(resolved);
									if (resolved == null) return null;
									if (entity == 'artist' && discogsId in artistLookupWorkers) artistLookupWorkers[discogsId].then(function(mbids) {
										if (!Object.keys(mbids).includes(resolved)) {
											console.warn('MBID %s for artist', resolved, [dcOrigin, 'artist', discogsId].join('/'),
												'matching different entities:', printArtistMBIDs(mbids),
												'Related tracks:', mbids.tracks, 'Matched recordings:', mbids.recordings);
											const params = mbids.tracks.length == 1 ? { 'filter.name': mbids.tracks[0].title } : null;
											openInconsistent(entity, discogsId, [resolved].concat(Object.keys(mbids)), 'recordings', params);
											chord.play();
										} else if (Object.keys(mbids).length > 1) {
											console.warn('MBID %s for artist', resolved, [dcOrigin, 'artist', discogsId].join('/'),
												'can resolve to multiple entities:', printArtistMBIDs(mbids),
												'Related tracks:', mbids.tracks, 'Matched recordings:', mbids.recordings);
											const params = mbids.tracks.length == 1 ? { 'filter.name': mbids.tracks[0].title } : null;
											openInconsistent(entity, discogsId, Object.keys(mbids), 'recordings', params);
											chord.play();
										} else if (debugLogging) console.debug('MBID %s for artist %d verified consistent with score %d, evaluated tracks:',
											resolved, discogsId, Object.values(mbids)[0], mbids.tracks, mbids.recordings);
									});
								} else resolved.forEach(checkMBID);
								resolveFormData(entity, discogsId, resolved);
								return resolved;
							}).catch(function(reason) {
								if (/^(?:Assertion failed\b)/i.test(reason)) return alert(reason);
								if (GM_getValue('resolve_unresolved_as_unknown', false)) return mb.spa.unknown;
								const discogsLink = [dcOrigin, discogsEntity(entity), discogsId].join('/');
								const searchLink = new URL('search', mbOrigin);
								searchLink.searchParams.set('query', encodeQuotes(stripDiscogsNameVersion(lookupIndexes[entity][discogsId].name)));
								searchLink.searchParams.set('type', entity);
								searchLink.searchParams.set('method', 'direct'); // 'indexed'
								console.log('%s %d (%s) finally not resolved with last reason:', entity, discogsId,
									lookupIndexes[entity][discogsId].name, reason, discogsLink, searchLink.href);
								if (GM_getValue('open_unresolved_entities', false)) {
									GM_openInTab(searchLink.href, true);
									if (entity in lookupHints && discogsId in lookupHints[entity]
											&& Array.isArray(lookupHints[entity][discogsId]))
										for (let pathname of lookupHints[entity][discogsId])
											GM_openInTab(mbOrigin + '/' + pathname, true);
									GM_openInTab(discogsLink, true);
								}
								return null;
							});
						})))).then(lookupResults => new Promise((resolve, reject) => GM_getTabs(function(tabs) {
							// console.assert(tabs instanceof Object);
							let deleted = 0;
							for (let tab of Object.values(tabs)) if (tab instanceof Object && 'deletedDiscogsBindings' in tab)
								for (let entity in tab.deleted) if (Array.isArray(tab.deletedDiscogsBindings[entity]))
									for (let discogsId of tab.deletedDiscogsBindings[entity]) if (parseInt(discogsId) > 0) {
										if (entity in discogsBindingsCache && discogsId in discogsBindingsCache[entity]) {
											delete discogsBindingsCache[entity][discogsId];
											GM_setValue('discogs_to_mb_bindings', discogsBindingsCache);
										}
										const ndx1 = Object.keys(lookupIndexes).indexOf(entity);
										if (ndx1 < 0) continue;
										const ndx2 = Object.keys(lookupIndexes[entity]).indexOf(discogsId);
										if (ndx2 < 0) continue;
										lookupResults[ndx1][ndx2] = null;
										++deleted;
									}
							if (deleted > 0 && !prompt(`There are ${deleted} externally deleted linkages, collected data may result in wrongly assigned entities.\n\nContinue anyway?`))
								reject('User cancelled (externally deleted linkages)');
							resolve(lookupResults);
						}))).then(function(lookupResults) {
							function getMBIDs(entity, discogsId) {
								console.assert(entity in lookupIndexes, entity);
								const entityIndex = Object.keys(lookupIndexes).indexOf(entity);
								if (entityIndex < 0) return null;
								const index = Object.keys(lookupIndexes[entity])
									.findIndex(key => parseInt(key) == parseInt(discogsId));
								if (index < 0) return null;
								const resolved = lookupResults[entityIndex][index];
								return resolved ? Array.isArray(resolved) ? resolved : [resolved] : null;
							}

							// Object.keys(lookupIndexes).forEach(function(entity, ndx1) {
							// 	console.assert(lookupResults[ndx1]);
							// 	if (lookupResults[ndx1]) Object.keys(lookupIndexes[entity]).forEach(function(discogsId, ndx2) {
							// 		const resolved = lookupResults[ndx1][ndx2];
							// 		if (resolved) resolveFormData(entity, discogsId, resolved);
							// 	});
							// });
							workers.push(Promise.all(relationWorkers).then(function(relations) {
								relations = Array.prototype.concat.apply([ ], relations).filter(relation =>
									relation && ['linkTypeId', 'target', 'targetType'].every(prop => relation[prop]));
								(relations = relations.filter(function(relation, index, relations) {
									if (getLinkType(relation.linkTypeId) == 'performer' && ['instrument', 'vocal'].some(linkType => relations.some(function(relation2) {
										if (relation2 == relation || relation2.target != relation.target
												|| getLinkType(relation2.linkTypeId) != linkType) return false;
										if (!relation.dataset && !relation2.dataset) return true;
										if (!relation.dataset || !relation2.dataset) return false;
										const equal = (relation1, relation2) => Object.keys(relation1.dataset)
											.every(key => relation2.dataset[key] == relation1.dataset[key]);
										return equal(relation, relation2) && equal(relation2, relation);
									}))) return false;
									return true;
								})).forEach(function(relation, index, relations) {
									const prefix = `rel.${index}.`;
									formData.set(prefix + 'link_type_id', relation.linkTypeId);
									formData.set(prefix + 'backward', relation.backward ? 1 : 0);
									formData.set(prefix + 'target_type', relation.targetType);
									formData.set(prefix + 'target', relation.target);
									formData.set(prefix + 'name', relation.name);
									if (relation.credit) formData.set(prefix + 'credit', relation.credit);
									if (relation.attributes) {
										const attributes = mbAttributesValidator(relation);
										if (attributes != null) formData.set(prefix + 'attributes', JSON.stringify(attributes));
									}
									if (relation.dataset) for (let key in relation.dataset)
										formData.set(prefix + key, relation.dataset[key]);
								});
								return relations;
							}));
							if (params.basicMetadata && params.rgLookup && !formData.has('release_group') && Array.isArray(release.artists)) {
								function rgResolver(releaseGroups) {
									if (!releaseGroups) return null;
									const rgFilter = (releaseGroups, strictType = false, strictName = true) => releaseGroups.filter(function(releaseGroup) {
										if (formData.has('type') && releaseGroup['primary-type']) {
											const types = formData.getAll('type');
											const cmpNocase = (...str) => str.every((s, n, a) => s.toLowerCase() == a[0].toLowerCase());
											if (!types.some(type => cmpNocase(type, releaseGroup['primary-type']))) return false;
											if (strictType && releaseGroup['secondary-types']) {
												if (!releaseGroup['secondary-types'].every(secondaryType =>
														types.some(type => cmpNocase(type, secondaryType)))) return false;
												if (!types.every(type => cmpNocase(type, releaseGroup['primary-type'])
														|| releaseGroup['secondary-types'].some(secondaryType =>
															cmpNocase(secondaryType, type)))) return false;
											}
										}
										return sameTitleMapper(releaseGroup, release.title, strictName ?
												sameStringValues : similarStringValues, releaseTitleNorm)
											|| releaseGroup.releases && releaseGroup.releases.some(release2 =>
												sameTitleMapper(release2, release.title, strictName ?
													sameStringValues : similarStringValues, releaseTitleNorm));
									});
									let filtered = rgFilter(releaseGroups, false, true);
									if (filtered.length > 1) filtered = rgFilter(releaseGroups, true, true);
									else if (filtered.length < 1) filtered = rgFilter(releaseGroups, false, false);
									if (filtered.length != 1) filtered = rgFilter(releaseGroups, true, false);
									return filtered.length == 1 ? filtered[0] : null;
								}

								if (release.artists.length > 0) {
									let query = (keyword, ...terms) => terms.filter(uniqueValues)
										.map(term => `${keyword}:"${encodeQuotes(term)}"`).join(' OR ');
									query = [[
										query('releasegroup', release.title, releaseTitleNorm(release.title), anyBracketsStripper(release.title)),
										query('alias', release.title, releaseTitleNorm(release.title)),
										query('release', release.title, releaseTitleNorm(release.title)),
									].join(' OR ')].concat(release.artists.map(function(artist) {
										const arids = getMBIDs('artist', artist.id);
										return arids != null ? arids.filter(Boolean).map(arid => `arid:${arid}`).join(' AND ') : `(artistname:"${encodeQuotes(stripDiscogsNameVersion(artist.name))}" OR creditname:"${encodeQuotes(creditedName(artist))}")`;
									})).map(term => `(${term})`).join(' AND ');
									rgLookupWorkers.push(mbApiRequest('release-group', { query: query, limit: 100 })
										.then(results => rgResolver(results['release-groups']), console.error));
								}
								for (let artist of release.artists) if (!weakArtistTest(artist)) {
									const mbids = getMBIDs('artist', artist.id);
									if (mbids != null) for (let mbid of mbids) if (mbid != null)
										rgLookupWorkers[mbids.length > 1 ? 'push' : 'unshift']
											(mbLookupById('release-group', 'artist', mbid).then(rgResolver, console.error));
								}
							}
							workers.push((function consolidateLabels() {
								const labels = [ ], props = ['name', 'mbid', 'catalog_number'];
								for (let index = 0; props.some(prop => formData.has(`labels.${index}.${prop}`)); ++index)
									labels.push({
										name: formData.get(`labels.${index}.name`),
										mbid: formData.get(`labels.${index}.mbid`),
										catalogNumber: formData.get(`labels.${index}.catalog_number`),
									});
								const consolidated = labels.filter(function(label1, index, labels) {
									const safeString = str => (str || '').toLowerCase();
									return labels.findIndex(function(label2) {
										if (safeString(label2.mbid) != safeString(label1.mbid)) return false;
										if (!label2.mbid && !label1.mbid && safeString(label2.name) != safeString(label1.name)) return false;
										if (safeString(label2.catalogNumber) != safeString(label1.catalogNumber)) return false;
										return true;
									}) == index;
								});
								if (consolidated.length < labels.length) for (let index = 0; index < labels.length; ++index)
									if (index < consolidated.length) {
										formData.set(`labels.${index}.name`, consolidated[index].name);
										formData.set(`labels.${index}.mbid`, consolidated[index].mbid);
										formData.set(`labels.${index}.catalog_number`, consolidated[index].catalogNumber);
									} else for (let prop of props) formData.delete(`labels.${index}.${prop}`);
								return Promise.resolve(consolidated);
							})());
							workers.push(Promise.all(rgLookupWorkers).then(function(releaseGroups) {
								const releaseGroup = releaseGroups.find(Boolean);
								if (releaseGroup) formData.set('release_group', releaseGroup.id); else return null;
								const notification = [`MBID for release group <b>${releaseGroup.name || releaseGroup.title}</b>`];
								if (releaseGroup['first-release-date'])
									notification.push(`(<b>${getReleaseYear(releaseGroup['first-release-date'])}</b>)`);
								notification.push(`found by ${'relations' in releaseGroup ? 'unique name match' : 'known URL relation'}`);
								notify(notification.join(' '), 'rgfound');
								return releaseGroup;
							}).then(function findExistingRecordings(releaseGroup) {
								if (!(params.recordingsLookup > 0) || !media || !(params.recordingsLookup > 1)
										&& (hasType('Live') || descriptors.some(RegExp.prototype.test.bind(/^(?:Mono$)/i))
										|| !hasType('Single') && (formData.has('release_group') || hasType('DJ-mix', 'Remix', 'Live')
										|| descriptors.some(RegExp.prototype.test.bind(/^(?:Mix(?:ed|tape)\b|(?:Re-?mix|Rework)(?:ed)?\b|RMX\b|Mono$)/i)))))
									return null;
								return Promise.all(media.map(function(medium, mediumIndex) {
									if (!medium || !Array.isArray(medium.tracks) || /\b(?:Blu-Ray|DVD)\b/.test(medium.format)) return null;
									return Promise.all(medium.tracks.map(function(track, trackIndex) {
										function findRecording(recordings) {
											if ((recordings = recordings.filter(recording => !/\b(?:live)\b/i
													.test(recording.disambiguation))).length <= 0) return Promise.reject('No matches');
											formData.set(`mediums.${mediumIndex}.track.${trackIndex}.recording`, recordings[0].id);
											let notifyText = `MBID for recording <b>${track.title}</b> found`, firstRelease = [ ];
											if (recordingDate(recordings[0]))
												firstRelease.push(`<b>${getReleaseYear(recordingDate(recordings[0]))}</b>`);
											if (recordings[0].releases && recordings[0].releases.length > 0) {
												const release = recordings[0].releases.length > 1 ? recordings[0].releases.find(release =>
													release.date == recordingDate(recordings[0])) : recordings[0].releases[0];
												if (release) {
													firstRelease.push('on');
													let releaseType = release['release-group'] && release['release-group']['primary-type'];
													if (releaseType && releaseType.toUpperCase() != releaseType) releaseType = releaseType.toLowerCase();
													if (releaseType && release['release-group']['secondary-types']
															&& release['release-group']['secondary-types'].includes('Live'))
														releaseType = 'live ' + releaseType;
													if (releaseType) firstRelease.push(releaseType);
													firstRelease.push(`<b>${release.title}</b>`);
												}
											}
											if (firstRelease.length > 0) notifyText += ` (first released ${firstRelease.join(' ')})`;
											notify(notifyText, 'recordingfound');
											if (debugLogging) console.debug('Closest recordings for track %o:', track, recordings);
											return recordings[0];
										}

										if (medium.format == 'Enhanced CD' && sessions != null && mediumIndex in sessions
												&& (tocEntries => tocEntries != null && !tocEntries[trackIndex])
													(getTocAudioEntries(sessions[mediumIndex]))) return false;
										if (!(params.recordingsLookup > 1) && ['dj mix', 'dj-mix'].some(function(role) {
											const extraArtists = resolveExtraArtists([release, track]);
											return extraArtists && extraArtists.some(extraArtist => extraArtist.roles.includes(role));
										})) return null;
										let lookupWorker = recordingsLookup(track, { aridLookupFn: getMBIDs }).then(findRecording);
										if (rawRecordingLookups.has(track)) lookupWorker = lookupWorker
											.catch(reason => rawRecordingLookups.get(track).then(findRecording));
										return lookupWorker.catch(reason => null);
									}));
								}));
							}));
							if (params.composeAnnotation && 'series' in lookupIndexes) {
								const seriesIndex = Object.keys(lookupIndexes).indexOf('series');
								const missingSeries = Object.keys(lookupIndexes.series).map(function(discogsId, index) {
									if (lookupResults[seriesIndex][index] != null) return;
									const series = release.series.find(series => series.id == parseInt(discogsId));
									console.assert(series, release.series, discogsId);
									if (series) return discogsSeriesMapper(series).replace(...mbWikiEncoder);
								}).filter(Boolean).join('\n');
								if (missingSeries) if (annotation instanceof Promise) workers.push(annotation.then(function(annotation) {
									annotation = annotation ? missingSeries + '\n\n' + annotation : missingSeries;
									formData.set('annotation', annotation);
									return annotation;
								})); else {
									formData.set('annotation', missingSeries);
									workers.push(Promise.resolve(missingSeries));
								}
							}
							return Promise.all(workers);
						});
					}));
					return Promise.all(workers).then(() => formData);
				});
			}
			function seedFromAllMusic(formData, allMusicId, params, cdLengths) {
				function getReleaseMeta(allMusicId) {
					if (!allMusicId) throw new Error('Invalid argument');
					const idExtractor = (url, entity) => url && entity
						&& (entity = new RegExp(`\\bm${entity}\\d{10}\\b`, 'i').exec(url)) != null ? entity[0] : undefined;
					return GlobalXHR.get(amOrigin + '/album/release/' + allMusicId).then(function(response) {
						function coverResolver(element) {
							if (element instanceof HTMLImageElement) try {
								if (!(element = new URL(element.src)).pathname.includes('/images/no_image/')) {
									element.searchParams.set('f', 0);
									return element.href;
								}
							} catch(e) { console.warn(e) }
						}
						function trackListingAdapter(body) {
							if (!(body instanceof HTMLBodyElement)) return null;
							const media = Array.from(body.querySelectorAll('div#trackListing div.disc'), function(disc) {
								const medium = {
									title: textMapper(disc.querySelector(':scope > h3')),
									tracks: Array.from(disc.querySelectorAll(':scope > div.track'), track => ({
										trackNum: textMapper(track.querySelector('div.trackNum')),
										title: textMapper(track.querySelector('div.title > a:first-of-type')),
										artists: Array.from(track.querySelectorAll('div.performer > a'), artistMapper),
										featArtists: Array.from(track.querySelectorAll('span.featuring > a'), artistMapper),
										composers: Array.from(track.querySelectorAll('div.composer > a'), artistMapper),
										duration: textMapper(track.querySelector('div.duration')),
									})),
								};
								if (medium.title && !(medium.title = medium.title.replace(/^Disc\s+\d+(?:\s*[:\-])?\s*/, '')))
									medium.title = undefined;
								return medium.tracks.length > 0 ? medium : null;
							});
							return media.filter(Boolean).length > 0 ? media : null;
						}
						function creditsAdapter(body) {
							if (!(body instanceof HTMLBodyElement)) return null;
							const credits = { artists: [ ], featArtists: [ ], extraArtists: { } };
							body.querySelectorAll('table.creditsTable > tbody > tr').forEach(function(tr) {
								const artists = Array.from(tr.querySelectorAll('td.singleCredit > span > a'), artistMapper);
								if (artists.length <= 0) return;
								let artistCredits = textMapper(tr.querySelector('span.artistCredits')) || 'Primary Artist';
								artistCredits = artistCredits.split(',').map(artist => artist.trim().toLowerCase());
								for (let artistCredit of artistCredits) switch (artistCredit) {
									case 'primary artist': Array.prototype.push.apply(credits.artists, artists); break;
									case 'featured artist': Array.prototype.push.apply(credits.featArtists, artists); break;
									default:
										if (!(artistCredit in credits.extraArtists)) credits.extraArtists[artistCredit] = [ ];
										Array.prototype.push.apply(credits.extraArtists[artistCredit], artists);
								}
							});
							return credits;
						}
						function urlResolver(elem) {
							if (elem instanceof HTMLElement) try { return new URL(elem.getAttribute('href'), amOrigin).href }
								catch(e) { console.warn(e) }
						}

						const textMapper = elem => elem instanceof Element ? elem.textContent.trim() : undefined;
						const artistMapper = elem => elem instanceof Element ? {
							id: idExtractor(elem.href, 'n'),
							name: textMapper(elem),
							url: urlResolver(elem),
						} : undefined;
						const ajaxAdapter = url => GlobalXHR.get(url, { headers: { Referer: response.finalUrl } })
								.then(({document}) => document ? document.body : null, function(reason) {
							console.warn(reason);
							return null;
						});
						const reviewAdapter = body => body instanceof HTMLBodyElement ? body.querySelector('div#review') : null;
						const body = response.document.body, release = {
							id: idExtractor(response.finalUrl, 'r'),
							title: textMapper(body.querySelector('h1#releaseTitle')),
							artists: Array.from(body.querySelectorAll('div#releaseHeadline > h2 > a'), artistMapper),
							date: textMapper(body.querySelector('div#basicInfoMeta > div.releaseDate > span')),
							format: textMapper(body.querySelector('div#basicInfoMeta > div.format > span')),
							labels: Array.from(body.querySelectorAll('div#basicInfoMeta > div.label a'), artistMapper),
							catalogNumber: textMapper(body.querySelector('div#basicInfoMeta > div.catalogNumber > span')),
							genres: Array.from(body.querySelectorAll('div#basicInfoMeta > div.genre a'), textMapper),
							styles: Array.from(body.querySelectorAll('div#basicInfoMeta > div.styles a'), textMapper),
							releaseTypes: textMapper(body.querySelector('div#basicInfoMeta > div.releaseInfo > div')),
							recordingDate: textMapper(body.querySelector('div.recording-date > div')),
							recordingLocations: Array.from(body.querySelectorAll('div#basicInfoMeta > div.recordingLocation > div:not([id])'), textMapper),
							cover: coverResolver(body.querySelector('div#releaseCover img')),
							url: response.finalUrl,
						};
						let mainAlbum = body.querySelector('div#mainAlbumMeta a');
						if (mainAlbum != null) mainAlbum = urlResolver(mainAlbum);
						mainAlbum = mainAlbum ? Promise.all([
							GlobalXHR.get(mainAlbum).then(response => ({
								id: idExtractor(response.finalUrl, 'w'),
								url: response.finalUrl,
								title: textMapper(response.document.body.querySelector('h1#albumTitle')),
								artists: Array.from(response.document.body.querySelectorAll('h2#albumArtists > a'), artistMapper),
								date: textMapper(response.document.body.querySelector('div#basicInfoMeta > div.release-date > span')),
								genres: Array.from(response.document.body.querySelectorAll('div#basicInfoMeta > div.genre a'), textMapper),
								styles: Array.from(response.document.body.querySelectorAll('div#basicInfoMeta > div.styles a'), textMapper),
								recordingDate: textMapper(response.document.body.querySelector('div.recording-date > div')),
								recordingLocations: Array.from(response.document.body.querySelectorAll('div#basicInfoMeta > div.recording-location > div:not([id])'), textMapper),
								cover: coverResolver(response.document.body.querySelector('div#albumCover img')),
							})).catch(function(reason) {
								console.warn(reason);
								return null;
							}),
							ajaxAdapter(mainAlbum + '/trackListingAjax').then(trackListingAdapter),
							ajaxAdapter(mainAlbum + '/creditsAjax').then(creditsAdapter),
							ajaxAdapter(mainAlbum + '/reviewAjax').then(reviewAdapter),
						]).then(([mainAlbum, media, artistCredits, review]) => mainAlbum && Object.assign(mainAlbum, {
							media: media,
							artistCredits: artistCredits,
							review: review,
						})) : Promise.resolve(null);
						let [trackListingAjax, creditsAjax, reviewAjax] = ['trackListingAjax', 'creditsAjax', 'reviewAjax']
							.map(ajax => ajaxAdapter(response.finalUrl + '/' + ajax));
						trackListingAjax = trackListingAjax.then(trackListingAdapter);
						creditsAjax = creditsAjax.then(creditsAdapter);
						reviewAjax = reviewAjax.then(reviewAdapter);
						if (release.releaseTypes && (release.releaseTypes = release.releaseTypes.split(/\r?\n/)
								.map(releaseType => releaseType.trim()).filter(Boolean)).length <= 0)
							release.releaseTypes = undefined;
						return Promise.all([release, mainAlbum, trackListingAjax, creditsAjax, reviewAjax]);
					}).then(([release, mainAlbum, media, artistCredits, review]) => Object.freeze(Object.assign(release, {
						mainAlbum: Object.freeze(mainAlbum),
						media: Object.freeze(media),
						artistCredits: Object.freeze(artistCredits),
						review: Object.freeze(review),
					})));
				}

				if (formData instanceof Object && allMusicId) params = Object.assign({
					basicMetadata: true, tracklist: true,
					recordingsLookup: 1, lookupArtistsByRecording: true, rgLookup: true,
					searchSize: GM_getValue('mbid_search_size', 30),
					languageIdentifier: GM_getValue('external_language_id', true),
					composeAnnotation: GM_getValue('compose_annotation', true),
					openInconsistent: GM_getValue('open_inconsistent', true),
					assignUncertain: GM_getValue('assign_uncertain', true),
					extendedMetadata: false, rgRelations: false, releaseRelations: false,
					recordingRelations: false, workRelations: false, preferTrackRelations: 1,
				}, params); else throw new Error('Invalid argument');
				return getReleaseMeta(allMusicId).then(function(release) {
					function addLookupEntry(entity, entry, context) {
						console.assert(entity && entry);
						if (!entity || !entry) throw new Error('Invalid argument');
						console.assert(entry.name, entry);
						if (!entry.id || !entry.name) return;
						if (!(entity in lookupIndexes)) lookupIndexes[entity] = { };
						if (!(entry.id in lookupIndexes[entity]))
							lookupIndexes[entity][entry.id] = { name: entry.name, contexts: [ ] };
						if (context && !lookupIndexes[entity][entry.id].contexts.includes(context))
							lookupIndexes[entity][entry.id].contexts.push(context);
					}
					function addCredit(entity, context, entry) {
						if (!entity || !context || !entry) throw new Error('Invalid argument');
						if (!(entity in credits)) credits[entity] = { };
						if (!(context in credits[entity])) credits[entity][context] = [ ];
						if (credits[entity][context].some(_entry => _entry.id == entry.id)) return;
						credits[entity][context].push({ id: entry.id, name: entry.name });
					}
					function addCredits(root) {
						if (root.artistCredits) for (let role in root.artistCredits.extraArtists) {
							for (let extraArtist of root.artistCredits.extraArtists[role])
								addCredit('artist', role, extraArtist);
							if ('dj mix' in root.artistCredits.extraArtists) formData.append('type', 'DJ-mix');
						}
						if (root.composers) for (let composer of root.composers) addCredit('artist', 'composer', composer);
					}
					function resolvePerformers(...roots) {
						const root = (roots = roots.filter(Boolean)).reverse().find(root => root?.artists?.length > 0);
						if (!root) return; else roots = roots.reverse().slice(roots.indexOf(root));
						roots = Array.prototype.concat.apply([ ], roots.map(root =>
							(root.extraArtists || root).featArtists).filter(Boolean));
						return root.length > 0 ? root.artists.map((artist, index, artists) => ({
							id: artist.id,
							name: artist.name,
							join: [',', '&', 'feat.'][Math.sign(index + 2 - artists.length) + 1],
						})).concat(roots.map((featArtist, index, featArtists) => ({
							id: featArtist.id,
							name: featArtist.name,
							join: [',', '&'][Math.sign(index + 2 - featArtists.length) + 1],
						}))) : root.artists.map((artist, index, artists) => ({
							id: artist.id,
							name: artist.name,
							join: [',', '&'][Math.sign(index + 2 - artists.length) + 1],
						}));
					}
					function samePerformers(...performers /* resolved */) {
						if (performers.length <= 0) return false;
						const performersCount = performers.filter(Boolean).length;
						if (performersCount <= 0) return true; else if (performersCount < performers.length) return false;
						performers = performers.map(performers => performers.filter(Boolean));
						console.assert(performers.every(Array.isArray), performers);
						return performers.every(performers1 => performers.every(function(performers2) {
							const samePerformers = (performers1, performers2) =>
								performers1.every(performer1 => performers2.some(performer2 => performer2.id == performer1.id));
							return samePerformers(performers1, performers2) && samePerformers(performers2, performers1);
						}));
					}
					function resolveExtraArtists(roots, roleTrackEvaluator = function(role) {
						let linkType = relationsMapping.artist[role];
						return !linkType || !findRelationLevels('artist', linkType).some(isReleaseLevel);
					}) {
						function addRole(role, artists) {
							if (role && artists) for (let artist of artists) {
								let extraArtist = extraArtists.find(extraArtist => extraArtist.id == artist.id);
								if (!extraArtist) extraArtists.push(extraArtist = { id: artist.id, name: artist.name, roles: [ ] });
								if (!extraArtist.roles.includes(role)) extraArtist.roles.push(role);
							}
						}

						console.assert(Array.isArray(roots) && roots.length > 0, roots);
						console.assert(typeof roleTrackEvaluator == 'function', roleTrackEvaluator);
						const extraArtists = [ ];
						for (let root of roots) if (root) {
							if (root.artistCredits) for (let role in root.artistCredits.extraArtists)
								if (params.preferTrackRelations || roleTrackEvaluator(role)) {
									let artists = release.artistCredits.extraArtists[role];
									if (role == 'composer' && release.media != null) artists = artists.filter(artist =>
										!release.media.some(medium => medium.tracks != null && medium.tracks.some(track =>
											track.composers.some(composer => composer.id == artist.id))));
									if (artists.length > 0) addRole(role, artists);
								}
							if (root.composers) for (let composer of root.composers) addRole('composer', root.composers);
						}
						return extraArtists.length > 0 ? extraArtists : null;
					}
					function seedArtists(resolvedPerformers, prefix) {
						if (Array.isArray(resolvedPerformers)) resolvedPerformers.forEach(function(artist, index, artists) {
							let artistPrefix = 'artist_credit.names.' + index;
							if (prefix) artistPrefix = prefix + artistPrefix;
							if (/^Various(?: Artists)?$/i.test(artist.name))
								formData.set(`${artistPrefix}.artist.mbid`, MB.spa.VA);
							else {
								formData.set(`${artistPrefix}.artist.name`, capitalizeName((artist.name)));
								guessSPA(artist).then(function(mbid) {
									if ([mb.spa.theatre, mb.spa.disney, mb.spa.churchChimes, mb.spa.dialogue].includes(mbid))
										formData.set(`${artistPrefix}.name`, creditedName(artist));
								});
								if (params.basicMetadata) addLookupEntry('artist', artist, artistPrefix);
							}
							const joinPhrase = [',', '&'][Math.sign(index + 2 - artists.length) + 1];
							if (joinPhrase) formData.set(`${artistPrefix}.join_phrase`, fmtJoinPhrase(joinPhrase));
							//else formData.delete(`${artistPrefix}.join_phrase`);
						});
					}
					function totalTime(tracks) {
						const totalTime = tracks.reduce((totalTime, track) => totalTime + timeStrToTime(track.duration), 0);
						return totalTime >= 0 ? [
							Math.floor(totalTime / 60).toString(),
							(totalTime % 60).toString().padStart(2, '0'),
						].join(':') : undefined;
					}
					function layoutMatch(media) {
						if (!media) return -Infinity; else if (!Array.isArray(cdLengths) || cdLengths.length <= 0) return 0;
						if ((media = media.filter(medium => ['CD', 'CD-R'].includes(mediumFormat(medium)))).length != cdLengths.length) return -2;
						if (media.every((medium, mediumIndex) => medium.tracks.length == cdLengths[mediumIndex])) return 3;
						if (media.every((medium, mediumIndex) => medium.tracks.length == cdLengths[mediumIndex]
								|| medium.format == 'Enhanced CD' && medium.tracks.length > cdLengths[mediumIndex])) return 2;
						if (cdLengths.length > 1) {
							const index = { };
							for (let key of cdLengths) if (!(key in index))
								index[key] = media.filter(medium => medium.tracks.length == key).length;
							if (Object.keys(index).every(key1 => index[key1] == cdLengths.filter(key2 => key2 == parseInt(key1)).length)) {
								notify('Tracks layout matched to reordered logs', 'layoutmatched');
								return 1;
							}
						}
						return -1;
					}
					function addUrlRef(url, level, type) {
						const linkTypeId = getLinkTypeId(level, 'url', type);
						if (linkTypeId > 0) urls.push({ url: url, link_type: linkTypeId });
						else console.warn('Undetermined link type id for', url, level, type);
					}
					function searchQueryBuilder(entity, entry, wideSearch = true) {
						if (!entry || !entry.name) return;
						const fields = wideSearch ? { [entity]: 2, alias: 1, comment: 0.5 } : undefined, query = { };
						if (fields && ['artist', 'label'].includes(entity)) fields.sortname = 1;
						const addName = (expr, priority = 1) => {
							if (expr) if (fields) for (let field in fields) {
								if (!(field in query)) query[field] = { };
								query[field][expr] = priority;
							} else query[expr] = priority;
						};
						const name = entry.name;
						addName(name);
						if (wideSearch && ['label', 'place'].includes(entity)) {
							const bareName = labelMapper(name.replace(...rxBareLabel));
							if (bareName != name) addName(bareName, 0.75);
						}
						const orPhrases = (term, phraseMapper) => {
							const phrases = { [wideSearch ? '(' + encodeLuceneTerm(term) + ')' : '"' + encodeQuotes(term) + '"']: 1 };
							const words = term.split(/\s+/);
							if (words.length > 1 && wideSearch)
								phrases['(' + words.map(encodeLuceneTerm).join(' AND ') + ')'] = 0.25;
							return Object.entries(phrases).map(entry => phraseMapper(...entry)).filter(Boolean).join(' OR ');
						};
						return Object.keys(query).map(fields ? field => Object.keys(query[field]).map(function(term) {
							const priority = fields[field] * query[field][term];
							if (priority > 0) return orPhrases(term, function(phrase, pp) {
								phrase = field + ':' + phrase;
								if ((pp *= priority) > 0) return pp != 1 ? `${phrase}^${pp}` : phrase;
							});
						}).filter(Boolean).join(' OR ') : function(term) {
							if (query[term] > 0) return orPhrases(term, (phrase, pp) =>
								{ if ((pp *= query[term]) > 0) return pp != 1 ? `${phrase}^${pp}` : phrase });
						}).filter(Boolean).join(' OR ');
					}
					function openInconsistent(entity, allMusicId, mbids, subpage) {
						Array.from(mbids).reverse().forEach(mbid =>
							{ GM_openInTab([mbOrigin, entity, mbid, subpage].filter(Boolean).join('/'), true) });
						GM_openInTab([amOrigin, amEntity(entity), allMusicId].join('/'), true);
					}
					function initBindingsCache() {
						if (amBindingsCache instanceof Object) return;
						if (!(amBindingsCache = GM_getValue('allmusic_to_mb_bindings'))) amBindingsCache = { };
						else console.info('AllMusic to MB bindings cache loaded:', Object.keys(amBindingsCache)
							.map(key => `${Object.keys(amBindingsCache[key]).length} ${mbEntities(key)}`).join(', '));
						GM_addValueChangeListener('allmusic_to_mb_bindings',
							(name, oldVal, newVal, remote) => { amBindingsCache = newVal });
						// if (debugLogging) console.debug('Cache synced with remote window, key sizes:',
						// 	Object.keys(amBindingsCache).map(entity => entity + ': ' + Object.keys(amBindingsCache[entity]).length).join(', '));
						const defaults = { };
						for (let entity in defaults) {
							if (!(entity in amBindingsCache)) amBindingsCache[entity] = { };
							for (let allMusicId in defaults[entity]) if (!(allMusicId in amBindingsCache[entity]))
								amBindingsCache[entity][allMusicId] = defaults[entity][allMusicId] || null;
						}
						const bce = new BindingsCacheEditor('allmusic_to_mb_bindings', allMusicIdExtractor, 'am_logo', function(entity, allMusicId) {
							const url = [amOrigin, amEntity(entity), allMusicId].join('/');
							const textMapper = elem => elem instanceof Element ? elem.textContent.trim() : undefined;
							return GlobalXHR.get(url).then(({document}) => ({
								url: url,
								name: textMapper(document.body.querySelector('div#artistHeader h1#artistName')),
								disambiguation: textMapper(document.body.querySelector('div#artistHeader p#bioHeadline')),
							}));
						});
						GM_registerMenuCommand('AllMusic to MB bindings cache editor', () => { bce.edit(amBindingsCache) });
					}
					function saveToCache(entity, allMusicId, mbid) {
						console.assert(entity && allMusicId);
						if (!entity || !allMusicId || !['artist', 'label', 'series', 'place'].includes(entity)) return;
						if (!(entity in amBindingsCache)) amBindingsCache[entity] = { };
						console.assert(mbid === null || rxMBID.test(mbid), mbid);
						amBindingsCache[entity][allMusicId] = mbid;
						GM_setValue('allmusic_to_mb_bindings', amBindingsCache);
					}
					function getCachedMBID(entity, allMusicId) {
						if (!entity || !allMusicId) throw new Error('Invalid argument');
						initBindingsCache();
						const verifyMBID = mbid => (rxMBID.test(mbid) ? GlobalXHR.head(`${mbOrigin}/${entity}/${mbid}`, {
							redirect: 'follow', anonymous: true,
							recoverableErrors: [429],
						}).then(function(response) {
							const verified = response = mbIdExtractor(response.finalUrl, entity);
							if (!verified) return Promise.reject(`Cached check failed (${response.finalUrl})`);
							console.log('Entity binding for', entity, discogsId, 'found in cache');
							allMusicName(entity, allMusicId).then(name =>
								{ notify(`MBID for ${entity} <b>${name}</b> found in cache`, 'foundincache') });
							if (verified != mbid)
								console.info('MB entry for %s %d has moved: %s => %s', entity, allMusicId, mbid, verified);
							return verified;
						}) : mbid === null ? Promise.resolve(mbid) : Promise.reject('Invalid format')).catch(function(reason) {
							console.warn('Failed to verify %s ID %s (%s)', entity, mbid, reason);
							return mbid;
						});
						if (entity in amBindingsCache && allMusicId in amBindingsCache[entity]) {
							var resolved = amBindingsCache[entity][allMusicId];
							if (resolved === null) return Promise.resolve(null);
							if (!Array.isArray(resolved)) return verifyMBID(resolved).then(function(verified) {
								if (verified != resolved) {
									amBindingsCache[entity][allMusicId] = verified;
									saveToCache(entity, allMusicId, verified);
								}
								return verified;
							});
							return Promise.all(resolved.map(mbid => verifyMBID(mbid))).then(function(verified) {
								if (!verified.every(verified => resolved.includes(verified))) {
									amBindingsCache[entity][allMusicId] = verified;
									saveToCache(entity, allMusicId, verified);
								}
								return verified;
							});
						}
						return Promise.reject('ID not cached');
					}
					function isCached(entity, allMusicId) {
						initBindingsCache();
						if (entity in amBindingsCache && allMusicId in amBindingsCache[entity]) return true;
						return false;
					}
					function findMBID(entity, allMusicId, entry) {
						if (!entity || !allMusicId) throw new Error('Invalid argument');
						if (!(entry instanceof Object) && entity in lookupIndexes && allMusicId in lookupIndexes[entity])
							entry = lookupIndexes[entity][allMusicId];
						console.assert(entry instanceof Object, entity, allMusicId);
						const allMusicName = entry ? entry.name : entity + allMusicId;
						return getCachedMBID(entity, allMusicId).catch(function(reason) {
							function weakMatchHandler(mbid) {
								GM_openInTab([mbOrigin, entity, mbid].join('/'), true);
								GM_openInTab([amOrigin, amEntity(entity), allMusicId].join('/'), true);
								return mbid;
							}
							function heuristicLookup(mbids) {
								function resolveUrl(elem) {
									if (elem instanceof HTMLElement) try {
										return new URL(elem.getAttribute('href'), amOrigin).href;
									} catch(e) { console.warn(e) } else throw new Error('Invalid argument');
								}

								if (!Array.isArray(mbids)) throw new Error('Invalid argument');
								if (mbids.length <= 0) return Promise.reject('No MusicBrainz entries');
								const amLoadSection = (channel, selector, itemMapper) => (function loadPage(page = 1) {
									if (!channel || !selector || typeof itemMapper != 'function') throw new Error('Invalid argument');
									const path = [amOrigin, amEntity(entity), allMusicId, channel + 'Ajax', 'all'];
									if (!['compositions'].includes(channel)) path.push(page);
									return GlobalXHR.get(path.join('/'), {
										headers: { Referer: [amOrigin, amEntity(entity), allMusicId].join('/') },
									}).then(function({document}) {
										if (!document) return null;
										const entries = Array.from(document.body.querySelectorAll(selector), itemMapper).filter(Boolean);
										const nextPage = document.body.querySelector('button.paginationNext');
										return nextPage == null || nextPage.disabled ? entries : loadPage(page + 1).then(nextEntries =>
											Array.isArray(nextEntries) && nextEntries.length > 0 ? entries.concat(nextEntries) : entries);
									});
								})().catch(console.error);
								const textAdapter = elem => elem instanceof HTMLElement ? elem.textContent.trim() : undefined;
								const intAdapter = elem => elem instanceof HTMLElement && parseInt(elem.textContent) || undefined;
								const artistAdapter = elem => elem instanceof HTMLElement ? ({
									id: allMusicIdExtractor(resolveUrl(elem), 'artist'),
									name: textAdapter(elem),
									url: resolveUrl(elem),
								}) : undefined;
								const allMusicEntry = GlobalXHR.get([amOrigin, amEntity(entity), allMusicId].join('/')).then(function({document}) {
									const artistListFrom = selector => Array.from(document.body.querySelectorAll(selector), artistAdapter);
									return {
										id: allMusicId,
										name: textAdapter(document.body.querySelector('h1#artistName')),
										profile: textAdapter(document.body.querySelector('p#bioHeadline')),
										activeDates: textAdapter(document.body.querySelector('div#basicInfoMeta > div.activeDates > div')),
										birth: textAdapter(document.body.querySelector('div#basicInfoMeta > div.birth > div')),
										genre: textAdapter(document.body.querySelector('div#basicInfoMeta > div.genre > div')),
										styles: Array.from(document.body.querySelectorAll('div#basicInfoMeta > div.styles > div > a'), a => a.textContent.trim()),
										members: artistListFrom('div#basicInfoMeta > div.group-members a'),
										groups: artistListFrom('div#basicInfoMeta > div.member-of a'),
									};
								});
								let rels = ['url', entity], creditTypes;
								if (entity == 'artist') {
									rels.push('release', 'recording', 'release-group', 'work');
									// creditTypes = getArtistCreditTypes(allMusicId);
								}
								rels = rels.map(entity => entity + '-rels');
								const results = mbids.map(function(mbid) {
									if (entity in amBindingsCache) {
										const cacheIndex = Object.values(amBindingsCache[entity]).indexOf(mbid);
										if (cacheIndex >= 0) {
											const _allMusicId = Object.keys(amBindingsCache[entity])[cacheIndex];
											console.assert(_allMusicId != allMusicId, allMusicId,
												Object.entries(amBindingsCache[entity])[cacheIndex]);
											// GM_openInTab([mbOrigin, entity, mbid].join('/'), true);
											// GM_openInTab([amOrigin, amEntity(entity), _allMusicId].join('/'), true);
											return Promise.resolve(false);
										}
									}
									return mbApiRequest(entity + '/' + mbid, { inc: ['aliases', 'annotation'].concat(rels).join('+') }).then(function(entry) {
										const allMusicIds = getAllMusicRels(entry, entity);
										return allMusicIds.length > 0 && !allMusicIds.includes(allMusicId) ? false : entry;
									}, function(reason) {
										console.warn(reason);
										return true;
									});
								}), lookupMethods = [ ];
								if (entity == 'artist') lookupMethods.push([getArtistTracks, tracks => Promise.all([
									amLoadSection('songs', 'div.singleSongResult', function(song) {
										const title = song.querySelector('span.songTitle > a');
										if (title != null) return {
											id: allMusicIdExtractor(resolveUrl(title), 'song'),
											title: textAdapter(title),
											featArtists: Array.from(song.querySelectorAll('span.songTitle span.featuredArtists > a'), artistAdapter),
											composers: Array.from(song.querySelectorAll('span.songComposers > a'), artistAdapter),
											type: title.pathname.startsWith('/song/') ? 'song' : 'unknown',
											relationType: 'track_artist',
											url: resolveUrl(title),
										};
									}),
									amLoadSection('compositions', 'table.compositionsTable > tbody > tr.singleComposition', function(composition) {
										const elems = ['td.year', 'td.title a:first-of-type'].map(selector => album.querySelector(selector));
										if (elems[1] != null) return {
											id: allMusicIdExtractor(resolveUrl(elems[1]), 'composition'),
											year: intAdapter(elems[0]),
											title: textAdapter(elems[1]),
											type: elems[1].pathname.startsWith('/composition/') ? 'composition' : 'unknown',
											relationType: 'composer',
											url: resolveUrl(elems[1]),
										};
									}),
									amLoadSection('credits', 'table.creditsTable > tbody > tr', function(album) {
										const elems = [
											'td.creditYear',
											'td.creditMeta span.album > a:first-of-type',
											'td.creditMeta span.credits',
										].map(selector => album.querySelector(selector));
										if (elems[1] == null) return null;
										const type = elems[1].pathname.startsWith('/song/') ? 'song'
											: elems[1].pathname.startsWith('/composition/') ? 'composition' : undefined;
										return type ? {
											id: allMusicIdExtractor(resolveUrl(elems[1]), 'recording')
												|| allMusicIdExtractor(resolveUrl(elems[1]), 'work'),
											year: intAdapter(elems[0]),
											artists: Array.from(album.querySelectorAll('td.creditMeta span.artists > a'), artistAdapter),
											title: textAdapter(elems[1]),
											type: type,
											url: resolveUrl(elems[1]),
											relationType: elems[2] != null && elems[2].textContent.toLowerCase().split(',').map(credit =>
												credit.trim().replace(/^(?:primary artist)$/, 'track_artist')).join(', ') || undefined,
										} : null;
									}),
								]).then(tracks => Array.prototype.concat.apply([ ], tracks.filter(Boolean))).then(function(amTracks) {
									function openUncertain() {
										GM_openInTab([mbOrigin, entity, mbids[hiIndex]].join('/'), true);
										GM_openInTab([amOrigin, amEntity(entity), allMusicId, 'songs'].join('/'), true);
									}

									if (amTracks.length <= 0) return Promise.reject('No matches by common tracks');
									const mutualScores = tracks.map(tracks => [amTracks, tracks].every(Array.isArray) ? tracks.reduce(function(score, track) {
										console.assert(track);
										const tracks = amTracks.filter(function(amTrack) {
											//if ((amTrack.type == 'composition') != ['composer', 'writer', 'lyricist'].includes(track.relationType)) return false;
											return sameTitleMapper(track, amTrack.title, sameStringValues, trackTitleNorm);
										});
										if (tracks.length <= 0) return score;
										if (debugLogging) console.debug('Found matching tracks:', track, tracks);
										//return score + 0.5 + (songs.length - 1) * 0.25;
										const base = 1/3, q = track.title ? trackTitleNorm(track.title).length / 25 : 0;
										return score + base + q * (1 - base);
									}, 0) : 0);
									const hiScore = Math.max(...mutualScores);
									if (debugLogging) console.debug('Common titles lookup method #2: Entity:', entity,
										'AllMusic ID:', allMusicId, 'MBIDs:', mbids, 'Scores:', mutualScores, 'HiScore:', hiScore);
									if (!(hiScore > 0)) return Promise.reject('No matches by common tracks');
									const hiIndex = mutualScores.indexOf(hiScore);
									console.assert(hiIndex >= 0, hiScore, mutualScores);
									const dataSize = Math.min(amTracks.length, tracks[hiIndex].length);
									if (!(Math.pow(hiScore, 3) * 10 >= Math.min(dataSize, 10) && hiScore * 50 >= dataSize))
										if (params.assignUncertain) openUncertain();
											else return Promise.reject('Matched by common tracks with too low score');
									else if (hiScore < 1) openUncertain();
									console.log('Entity binding found by having score %f:\n%s\n%s',
										hiScore, [amOrigin, amEntity(entity), allMusicId].join('/'),
										[mbOrigin, entity, mbids[hiIndex], 'tracks'].join('/'));
									if (mutualScores.filter(score => score > 0).length > 1) {
										console.log('Matches by more entities:', mutualScores.map((score, index) =>
											score > 0 && [mbOrigin, entity, mbids[index], 'tracks'].join('/') + ' (' + score + ')').filter(Boolean));
										if (mutualScores.reduce((sum, score) => sum + score, 0) >= hiScore * 1.5)
											return Promise.reject('Ambiguity (tracks)');
										chord.play();
										if (params.openInconsistent) openInconsistent(entity, allMusicId,
											mutualScores.map((score, index) => score > 0 && mbids[index]).filter(Boolean), 'tracks');
									}
									allMusicName(entity, allMusicId).then(name =>
										{ notify(`MBID for ${entity} <b>${name}</b> found by score <b>${hiScore.toFixed(1)}</b> out of ${dataSize} track(s)`, 'foundbytracks') });
									return mbids[hiIndex];
								})]);
								lookupMethods.push([mbGetReleasesAdapter(entity), results => Promise.all([
									GlobalXHR.get([amOrigin, amEntity(entity), allMusicId, 'discographyAjax'].join('/'), {
										headers: { Referer: [amOrigin, amEntity(entity), allMusicId].join('/') },
									}).then(({document}) => document && Promise.all(Array.from(document.body.querySelectorAll('select#releaseType > option[value]'), option => option.value).filter(releaseType => releaseType != 'all').map((releaseType, index) => GlobalXHR.get([amOrigin, amEntity(entity), allMusicId, 'discographyAjax', releaseType].join('/'), {
										headers: { Referer: [amOrigin, amEntity(entity), allMusicId].join('/') },
									}).then(({document}) => Array.from(document.body.querySelectorAll('table.discographyTable > tbody > tr'), function(album) {
										const elems = ['td.year', 'td.meta > span.title a:first-of-type']
											.map(selector => album.querySelector(selector));
										if (elems[1] != null) return {
											id: allMusicIdExtractor(resolveUrl(elems[1]), 'release-group')
												|| allMusicIdExtractor(resolveUrl(elems[1]), 'release'),
											year: intAdapter(elems[0]),
											title: textAdapter(elems[1]),
											type: elems[1].pathname.startsWith('/album/release/') ? 'release'
												: elems[1].pathname.startsWith('/album/') ? 'album' : 'unknown',
											url: resolveUrl(elems[1]),
											releaseType: releaseType,
											relationType: releaseType == 'compilations' ? 'track_artist' : 'artist',
										};
									}).filter(Boolean)))).then(releases => Array.prototype.concat.apply([ ], releases))).catch(console.error),
									amLoadSection('credits', 'table.creditsTable > tbody > tr', function(album) {
										const elems = [
											'td.creditYear',
											'td.creditMeta span.album > a:first-of-type',
											'td.creditMeta span.credits',
										].map(selector => album.querySelector(selector));
										if (elems[1] == null) return null;
										const type = elems[1].pathname.startsWith('/album/release/') ? 'release'
											: elems[1].pathname.startsWith('/album/') ? 'album' : undefined;
										return type ? {
											id: allMusicIdExtractor(resolveUrl(elems[1]), 'release-group')
												|| allMusicIdExtractor(resolveUrl(elems[1]), 'release'),
											year: intAdapter(elems[0]),
											artists: Array.from(album.querySelectorAll('td.creditMeta span.artists > a'), artistAdapter),
											title: textAdapter(elems[1]),
											type: type,
											url: resolveUrl(elems[1]),
											relationType: elems[2] != null && elems[2].textContent.toLowerCase().split(',').map(credit =>
												credit.trim().replace(/^(?:primary artist)$/, 'track_artist')).join(', ') || undefined,
										} : null;
									}),
								]).then(albums => Array.prototype.concat.apply([ ], albums.filter(Boolean))).then(function(amAlbums) {
									function openUncertain() {
										GM_openInTab([mbOrigin, entity, mbids[hiIndex], 'releases'].join('/'), true);
										GM_openInTab([amOrigin, amEntity(entity), allMusicId].join('/'), true);
									}

									if (!amAlbums || amAlbums.length <= 0) return Promise.reject('No matches by common releases');
									const mutualScores = results.map(results => results ? results.reduce(function(score, result) {
										const relatedAlbums = [ ];
										switch (result.targetType) {
											case 'release':
												for (let allMusicId of getAllMusicRels(result['release-group'], 'album'))
													Array.prototype.push.apply(relatedAlbums, amAlbums.filter(amAlbum => amAlbum.id == allMusicId));
												break;
											case 'release_group':
												for (let allMusicId of getAllMusicRels(result, 'album'))
													Array.prototype.push.apply(relatedAlbums, amAlbums.filter(amAlbum => amAlbum.id == allMusicId));
												break;
											default: console.warn('Unexpected result level:', result);
										}
										if (relatedAlbums.length > 0) {
											console.assert(relatedAlbums.length < 2, relatedAlbums);
											if (debugLogging) console.debug('Found matching releases by existing relation:', result, relatedAlbums);
											return score + 1;
										} else return score + Math.max(...amAlbums.map(function(amAlbum) {
											function titleSimilarity(root) {
												if (root) if (sameTitleMapper(root, amAlbum.title, sameStringValues))
													return root.title.length;
												else if (sameTitleMapper(root, amAlbum.title, sameStringValues, releaseTitleNorm))
													return releaseTitleNorm(root.title).length;
												return 0;
											}

											const releaseGroup = result.targetType == 'release_group' ? result : result['release-group'];
											const primaryType = releaseGroup && releaseGroup['primary-type'];
											if (primaryType && (amAlbum.releaseType == 'singles')
													!= (['Single', 'EP'].includes(primaryType))) return 0;
											const secondaryTypes = releaseGroup && releaseGroup['secondary-types'];
											if (secondaryTypes && (amAlbum.releaseType == 'compilations')
													!= ['Compilation'].some(secondaryType => secondaryTypes.includes(secondaryType))) return 0;
											const q = [0, 0];
											const releaseYear = result.targetType == 'release' ? getReleaseYear(result.date) : NaN;
											const rgYear = releaseGroup && getReleaseYear(releaseGroup['first-release-date']) || NaN;
											if (!(amAlbum.year > 0)) return 0; else if (amAlbum.type == 'album') {
												if (amAlbum.year == rgYear) q[0] = 1; else if (amAlbum.year <= releaseYear) q[0] = 1/2;
											} else if (amAlbum.type == 'release') {
												if (amAlbum.year == releaseYear) q[0] = 1; else if (amAlbum.year >= rgYear) q[0] = 1/2;
											}
											if (!(q[0] > 0)) return 0;
											if (amAlbum.type == 'album') q[1] = titleSimilarity(releaseGroup);
											else if (amAlbum.type == 'release' && result.targetType == 'release') q[1] = titleSimilarity(result);
											if (!(q[1] > 0)) return 0;
											let score = q[0] * ((base, confidencyLen, exp = 1, factor = 1) =>
												base + Math.pow(Math.min(q[1], confidencyLen) / confidencyLen, exp) * factor * (1 - base))
													(0, 5, 0.75, 0.80);
											if (entity == 'artist' && (result.relationType == 'track_artist'
													|| amAlbum.relationType == 'track_artist')) score *= 2/3;
											if (debugLogging) console.debug('Found matching releases:', result, amAlbum, 'Score:', score);
											return score;
										}));
									}, 0) : 0);
									const hiScore = Math.max(...mutualScores);
									if (debugLogging) console.debug('Common titles lookup method #1: Entity:', entity,
										'AllMusic ID:', allMusicId, 'MBIDs:', mbids, 'Scores:', mutualScores, 'HiScore:', hiScore);
									if (!(hiScore > 0)) return Promise.reject('No matches by common releases');
									const hiIndex = mutualScores.indexOf(hiScore);
									console.assert(hiIndex >= 0, hiScore, mutualScores);
									if (debugLogging && hiIndex < 0) alert('HiIndex not found! (see the log)');
									const dataSize = Math.min(amAlbums.length, results[hiIndex].length);
									if (!(Math.pow(hiScore, 3) * 10 >= Math.min(dataSize, 10) && hiScore * 50 >= dataSize))
										if (params.assignUncertain) openUncertain();
											else return Promise.reject('Matched by common releases with too low match rate');
									else if (hiScore < 1) openUncertain();
									console.log('Entity binding found by having score %f (%d):\n%s\n%s', hiScore, dataSize,
										[amOrigin, amEntity(entity), allMusicId].join('/'),
										[mbOrigin, entity, mbids[hiIndex], 'releases'].join('/'));
									if (mutualScores.filter(score => score > 0).length > 1) {
										console.log('Matches by more entities:', mutualScores.map((score, index) =>
											score > 0 && [mbOrigin, entity, mbids[index], 'releases'].join('/') + ' (' + score + ')').filter(Boolean));
										if (params.openInconsistent) openInconsistent(entity, allMusicId,
											mutualScores.map((score, index) => score > 0 && mbids[index]).filter(Boolean), 'releases');
										chord.play();
										if (mutualScores.reduce((sum, score) => sum + score, 0) >= hiScore * 1.5)
											return Promise.reject('Ambiguity (releases)');
									}
									allMusicName(entity, allMusicId).then(name =>
										{ notify(`MBID for ${entity} <b>${name}</b> found by score <b>${hiScore.toFixed(1)}</b> out of ${dataSize} release(s)`, 'foundbyreleases') });
									return mbids[hiIndex];
								})]);
								const resultsScanner = (resultTester, method) => Promise.all(results.map(promise => promise.then(function(result) {
									if (!(result instanceof Object)) return false;
									if (typeof resultTester != 'function') return Promise.reject('Evaluator not provided');
									return allMusicEntry.then(allMusicEntry => resultTester(result, allMusicEntry));
								}).catch(reason => false))).then(function(statuses) {
									const matches = statuses.filter(Boolean).length;
									if (matches > 1) return Promise.reject('Ambiguity (' + method + ')');
									if (matches != 1) return Promise.reject('No unique match (' + method + ')');
									const mbid = mbids[statuses.findIndex(Boolean)];
									console.assert(mbid, statuses, mbids);
									notify(`MBID for ${entity} <b>${allMusicName}</b> found by ${method || 'similarity'}`, 'foundbysimilarity');
									return mbid;
								});
								let lookupWorker = resultsScanner(function(entry, allMusicEntry) {
									const allMusicIds = getAllMusicRels(entry, entity);
									return allMusicIds.includes(allMusicEntry.id);
								}, 'having direct AllMusic relative');
								if (entity == 'artist') lookupWorker = lookupWorker.catch(reason => !isFatalReason(reason) ? resultsScanner(function(entry, allMusicEntry) {
									const relations = entry.relations.filter(relation => relation[entity] instanceof Object);
									const hasSameRelative = (allMusicRelative, relationType, forward) => allMusicRelative instanceof Object
										&& relationType && relations.filter(relation => relation.type == relationType
											&& (forward === undefined || relation.direction == (forward ? 'forward' : 'backward')))
										.map(relation => relation[entity]).some(mbRelative => entity in amBindingsCache
											&& allMusicRelative.id in amBindingsCache[entity] ?
												mbRelative.id == amBindingsCache[entity][allMusicRelative.id]
											: sameStringValues(allMusicRelative.name, mbRelative.name) || mbRelative.aliases
												&& mbRelative.aliases.some(alias => sameStringValues(allMusicRelative.name, alias.name)));
									const hasSameRelatives = (prop, relationType, forward) => (allMusicEntry[prop] || [ ])
										.some(allMusicRelative => hasSameRelative(allMusicRelative, relationType, forward));
									if (hasSameRelatives('groups', 'member of band', true) || hasSameRelatives('groups', 'founder', true)) {
										if (debugLogging) console.debug('Same %ss found by having same relative(s):', entity, discogsEntry, entry);
										return true;
									}
									return false;
								}, 'linking to same url or having same relative') : Promise.reject(reason));
								lookupWorker = lookupWorker.catch(reason => !isFatalReason(reason) ? (function lookupMethod(methodIndex = 0) {
									if (!(methodIndex < lookupMethods.length)) return Promise.reject('Not found by common titles');
									return (function(lookupMethod) {
										if (!lookupMethod || !Array.isArray(lookupMethod) || lookupMethod.length < 2)
											return Promise.reject('Lookup method incomplete or missing');
										const workers = mbids.map((mbid, index) => results[index].then(result => Boolean(result) ?
											lookupMethod[0](mbid).catch(reason => (console.warn(reason), null)) : null));
										return Promise.all(workers).then(lookupMethod[1]);
									})(lookupMethods[methodIndex]).catch(reason => !isFatalReason(reason) ? lookupMethod(methodIndex + 1) : Promise.reject(reason));
								})() : Promise.reject(reason));
								lookupWorker = lookupWorker.catch(reason => !isFatalReason(reason) ? resultsScanner(function(entry, allMusicEntry) {
									if (similarProfiles(entry.disambiguation, allMusicEntry.profile) || similarProfiles(entry.annotation, allMusicEntry.profile)) {
										if (debugLogging) console.debug('Same %ss found by having same profile info:', entity, discogsEntry, entry);
										return true;
									}
									return false;
								}, 'similarity in profiles (weak match)').then(weakMatchHandler) : Promise.reject(reason));
								return lookupWorker.then(function(mbid) {
									saveToCache(entity, allMusicId, mbid);
									return mbid;
								}, reason => Promise.reject('Not found by any similarity'));
							}

							if (!(entity in lookupWorkers)) lookupWorkers[entity] = { };
							if (allMusicId in lookupWorkers[entity]) return lookupWorkers[entity][allMusicId];
							let lookupWorker = findAllMusicRelatives(entity, allMusicId).then(function(entries) {
								console.assert(entries.length == 1, 'Ambiguous %s linkage for AllMusic id', entity, allMusicId, entries);
								if (entries.length > 1) return Promise.reject('Ambiguity (multiple direct AllMusic relatives)');
								notify(`MBID for ${entity} <b>${allMusicName}</b> found by having direct AllMusic relative`, 'foundbybacklink');
								saveToCache(entity, allMusicId, entries[0].id);
								return entries[0].id;
							});
							if (params.searchSize > 0 && entry instanceof Object) lookupWorker = lookupWorker.catch(reason => !isFatalReason(reason) ? mbApiRequest(entity, {
								query: searchQueryBuilder(entity, entry, true),
								limit: params.searchSize,
							}).then(results => heuristicLookup(results[mbEntities(entity)].filter(function(result) {
								if (result.score > 90) return true;
								const equal = (name, normFn = str => str) => {
									const cmp = root => similarStringValues(normFn(root.name), normFn(name));
									return cmp(result) || result.aliases && result.aliases.some(cmp);
								};
								return equal((entry.name)) || entry.anv && equal(entry.anv)
									|| ['label', 'place'].includes(entity) && equal((entry.name),
										entity => entity && entity.replace(...rxBareLabel));
							}).map(result => result.id))) : Promise.reject(reason));
							return lookupWorkers[entity][allMusicId] = lookupWorker;
						});
					}
					function purgeArtists(fromIndex = 0) {
						const artistSuffixes = ['mbid', 'name', 'artist.name', 'join_phrase'];
						const key = (ndx, sfx) => `artist_credit.names.${ndx}.${sfx}`;
						for (let ndx = 0; artistSuffixes.some(sfx => formData.has(key(ndx, sfx))); ++ndx)
							artistSuffixes.forEach(sfx => { formData.delete(key(ndx, sfx)) });
					}
					function namedBy(entity, artist) {
						if (!(entity instanceof Object)) return false;
						if (!(artist instanceof Object) || artist.id == '') return false;
						const entityTester = (root, fn) => {
							if (!(root instanceof Object) || typeof fn != 'function') return false;
							const _fn = name => name && fn(name.split(/[^\p{L}\w\d]+/u).filter(Boolean)
								.map(name => toASCII(name).toLowerCase()));
							if (_fn((root.name))) return true;
							return false;
						};
						return entityTester(entity, entity => entityTester(artist, artist =>
							artist.length > 0 && artist.every(namePart => entity.includes(namePart))));
					}

					if (debugLogging) console.debug('AllMusic release metadata for %s:', allMusicId, release);
					const relateAtLevel = sourceEntity => Boolean({
						'work': params.workRelations,
						'recording': params.recordingRelations,
						'release': params.releaseRelations,
						'release-group': params.rgRelations,
					}[sourceEntity]);
					const relateAtAnyLevel = ['work', 'recording', 'release', 'release-group'].some(relateAtLevel);
					if (['recording', 'work'].some(relateAtLevel)) params.tracklist = true;
					const rxMLang = /^(.+?)\s*=\s*(.+)$/, literals = { }, credits = { };
					const workers = [ ], lookupIndexes = { }, lookupWorkers = { }, rgLookupWorkers = [ ];
					const allMusicName = (entity, allMusicId) =>
						(entity in lookupIndexes && allMusicId in lookupIndexes[entity] ?
							Promise.resolve(lookupIndexes[entity][allMusicId].name)
								: GlobalXHR.get([amOrigin, amEntity(entity), allMusicId].join('/')).then(({document}) =>
									(document = document.body.querySelector('body div[id$="Header"] > div[id$="Headline"] > h1')) != null ?
										document.textContent.trim() : Promise.reject('Entity title not found'))
											.catch(reason => entity + '#' + allMusicId)).then(name => '<b>' + name + '</b>');
					const matchNameVariant = (artist, nameVariant) => artist && nameVariant && artist.name
						&& sameStringValues(artist.name, nameVariant);
					const hasType = (...types) => types.some(type => formData.getAll('type').includes(type));
					const noCreditAsArtists = [ ], openedIds = { };
					const weakArtistTest = artist => /^(?:Various(?: Artists)?|VA|Unknown(?: Artist)?|No Artist)$|\b(?:Cast|Disney)\b/i.test(artist.name);
					const isFatalReason = reason => /^(?:Ambiguity)\b/.test(reason);
					formData.set('name', normSeedTitle(release.title));
					let releaseDate = dateParser(release.date);
					if (releaseDate == null) try {
						releaseDate = new Date(release.date);
						releaseDate = isNaN(releaseDate) ? null : [
							releaseDate.getUTCFullYear(),
							releaseDate.getUTCMonth() + 1,
							releaseDate.getUTCDate(),
						];
					} catch(e) { releaseDate = null }
					if (releaseDate != null) {
						function setDate(index, part) {
							const key = 'events.0.date.' + part;
							if ((index = releaseDate[index]) > 0) formData.set(key, index); else formData.delete(key);
						}

						setDate(0, 'year'); setDate(1, 'month'); setDate(2, 'day');
					}
					let defaultFormat = 'CD';
					const relationsMapping = Object.freeze({
						artist: caselessProxy({
							'vocals': 'vocal', 'vocals (background)': 'vocal', 'choir/chorus': 'vocal',
							'guest artist': 'performer',
							'mastering': 'mastering', 'mixing': 'mix', 'engineer': 'engineer', 'producer': 'producer',
							'sleeve art': 'artwork', 'cover art': 'artwork', 'design': 'design', 'art direction': 'art direction',
							'sleeve notes': 'liner notes',
							'photography': 'photography', 'cover photo': 'photography', 'photographer': 'photography',
							'composer': 'writer', 'arranger': 'arranger', 'director': 'music director',
							'audio supervisor': 'misc', 'assistant photographer': 'misc', 'project manager': 'misc',
							'project assistant': 'misc',
						}),
					}), relationResolvers = { }, relsBlacklist = ['group member'], urls = [ ];
					if (rxBracketsMatcher('()', 0b11, phrases.live).test(release.title)) formData.append('type', 'Live');
					if (rxBracketsMatcher('()', 0b11, phrases.soundtrack).test(release.title)) formData.append('type', 'Soundtrack');
					if (/^8cm (?!CD(?:\+G)?$)/.test(defaultFormat)) defaultFormat = defaultFormat.slice(4);
					if (params.basicMetadata) (release.labels && release.labels.length > 0 ? release.labels : [undefined]).forEach(function(label, index) {
						const prefix = 'labels.' + index;
						if (label && label.name) {
							formData.set(prefix + '.name', capitalizeName(label.name));
							if ((rxNoLabel.test(label.name) || release?.artists?.some(artist => namedBy(label, artist)))
									&& !isCached('label', label.id))
								formData.set(prefix + '.mbid', mb.spl.noLabel);
							else addLookupEntry('label', label, prefix);
						}
						if (release.catalogNumber) formData.set(prefix + '.catalog_number',
							rxNoCatno.test(release.catalogNumber) ? '[none]' : release.catalogNumber);
					});
					if (!Array.isArray(cdLengths) || cdLengths.length <= 0) cdLengths = false;
					const media = params.tracklist ? release.media || release.mainAlbum && release.mainAlbum.media : null;
					const mediumFormat = medium => medium.format || release.format || 'CD';
					const releasePerformers = resolvePerformers(release);
					if (params.tracklist) if (media != null) media.forEach(function(medium, mediumIndex) {
						formData.set(`mediums.${mediumIndex}.format`, mediumFormat(medium));
						if (medium.title) formData.set(`mediums.${mediumIndex}.name`, normSeedTitle(medium.title));
						medium.tracks.forEach(function(track, trackIndex) {
							addCredits(track);
							const prefix = `mediums.${mediumIndex}.track.${trackIndex}.`;
							if (track.trackNum) formData.set(prefix + 'number', track.trackNum);
							if (track.title) formData.set(prefix + 'name', normSeedTitle(track.title));
							const trackPerformers = resolvePerformers(release, track);
							if (!samePerformers(releasePerformers, trackPerformers)) seedArtists(trackPerformers, prefix);
							if (track.duration) formData.set(prefix + 'length', track.duration);
						});
					}); else console.log('AllMusic release', release.id, 'has no tracklist, track names won\'t be seeded');
					addCredits(release);
					if (relateAtAnyLevel && 'artist' in credits) for (const role in credits.artist) {
						const normRole = { }[role] || role;
						if (relsBlacklist.some(role => role.toLowerCase() == normRole.toLowerCase())) continue;
						const relation = { type: relationsMapping.artist[normRole] };
						if (!relation.type) {
							const ap = new AttributeParser(normRole);
							if (ap.isModified && (relation.type = relationsMapping.artist[ap.creditType]))
								Object.assign(relation, { attributes: ap.modifiers });
						}
						relationResolvers[role] = (relation.type ? Promise.resolve(relation) : instrumentResolver(normRole).then(instrumentMapper, function(reason) {
							if (debugLogging) console.debug(`Credit type not resolved (${role})`);
							return { type: 'misc' };
						})).then(function(relation) {
							console.assert(relation instanceof Object && relation.type, relation);
							if (debugLogging) console.debug('Relation resolved:', role, '→', relation.type);
							if (!findRelationLevels('artist', relation.type).some(relateAtLevel))
								return Promise.reject(`Not to be related (${role})`);
							for (let extraArtist of credits.artist[role]) addLookupEntry('artist', extraArtist, role);
							return Object.assign(relation, { creditType: normRole });
						});
					}
					if (debugLogging) console.debug('Credits table:', credits);
					if (media != null) for (let medium of media) if (medium.tracks) for (let track of medium.tracks)
						if (track.title) frequencyAnalysis(literals, anyBracketsStripper(track.title));
					if (Object.keys(literals).length > 0) guessTextRepresentation(formData, literals);
					if (params.languageIdentifier && release.media)
						workers.push(languageIdentifier(release.media.map(medium => (medium.tracks || [ ])
							.filter(track => track.title).map(track => anyBracketsStripper(track.title) + '.')
								.join(' ')).join(' ')).then(function(result) {
						/*if (!formData.has('language')) */formData.set('language', result.iso6393);
						if (params.extendedMetadata) formData.set('language_en', result.language);
						notify(`<b>${result.language}</b> identified as release language`, 'languageidentified');
					}, reason => { console.warn('Remote language identification failed') }));
					if (!formData.has('status')) formData.set('status', 'official');
					addUrlRef([amOrigin, 'album/release', release.id].join('/'), 'release', 'allmusic');
					if (relateAtLevel('release-group') && release.mainAlbum != null)
						addUrlRef([amOrigin, 'album', release.mainAlbum.id].join('/'), 'release-group', 'allmusic');
					urls.filter(Boolean).forEach(function(url, index) {
						for (let key in url) formData.set(`urls.${index}.${key}`, url[key]);
					});
					purgeArtists();
					seedArtists(releasePerformers);
					//if (params.composeAnnotation) formData.set('annotation', ...);
					formData.set('edit_note', ((formData.get('edit_note') || '') +
						`\nSeeded from AllMusic release id ${release.id} (${[amOrigin, 'album/release', release.id].join('/')})`).trimLeft());
					if (params.basicMetadata && params.rgLookup && !formData.has('release_group') && release.mainAlbum)
						rgLookupWorkers.push(findAllMusicRelatives('release-group', release.mainAlbum.id).then(function(releaseGroups) {
							console.assert(releaseGroups.length > 0);
							console.assert(releaseGroups.length == 1, 'Ambiguous master %d release referencing:', release.master_id, releaseGroups);
							return releaseGroups.length == 1 ? releaseGroups[0] : Promise.reject('Ambiguity');
						}).catch(reason => null));
					if (params.extendedMetadata) {
						const tagMappers = { };
						let tags = release.genres.concat(release.styles);
						if (release.mainAlbum != null) {
							Array.prototype.push.apply(tags, release.mainAlbum.genres);
							Array.prototype.push.apply(tags, release.mainAlbum.styles);
						}
						tags = Array.prototype.concat.apply([ ], tags.map(tag => tagMappers[tag] || [tag])).map(tag => tag.toLowerCase());
						tags.filter(uniqueValues).forEach((tag, index) => { formData.set(`tags.${index}`, tag) })
					}
					if (params.preferTrackRelations == 1) params.preferTrackRelations = media ?
						media.reduce((sum, medium) => sum + (medium.tracks ? medium.tracks.length : 0), 0) == 1 : false;
					else params.preferTrackRelations = Boolean(params.preferTrackRelations);
					if (debugLogging) console.debug('Lookup indexes:', lookupIndexes);
					workers.push(getSessionsFromTorrent(torrentId).catch(reason => null).then(function(sessions) {
						function recordingsLookup(track, params) {
							function queryBuilder(lockToDuration = true) {
								let query = [track.title, anyBracketsStripper(track.title)].filter(uniqueValues)
									.map(term => ['recording', 'alias'].map(field => field + ':' + (params.looseSearch ?
										`(${encodeLuceneTerm(term)})` : `"${encodeQuotes(term)}"`)).join(' OR ')).join(' OR ');
								query = [query].concat((function(artists) {
									if (artists.length < 2) return artists; else artists = artists.map(artist => '(' + artist + ')');
									const term = [`(${artists.join(' AND ')})`];
									if (artists.length > 1 && !someArtistWeak) term.push(`(${artists.join(' OR ')})^0.5`);
									return term.join(' OR ');
								})(artists.map(function(artist) {
									const arid = aridLookupFn('artist', artist.id);
									return arid ? 'arid:' + arid : (params.looseSearch ? [
										`artistname:(${encodeLuceneTerm(artist.name)})`,
										`creditname:(${encodeLuceneTerm(creditedName(artist))})`,
									] : [
										`artistname:"${encodeQuotes(artist.name)}"`,
										`creditname:"${encodeQuotes(creditedName(artist))}"`,
									]).join(' OR ');
								})));
								if (lockToDuration && trackLength > 0 && params.maxLengthDifference > 0)
									query.push(`dur:[${Math.max(Math.round(trackLength) - params.maxLengthDifference, 0)} TO ${Math.round(trackLength) + params.maxLengthDifference}]  OR (NOT dur:[* TO *])`);
								if (!canContainVideo) query.push('video:false');
								return query.map(expr => '(' + expr + ')').join(' AND ');
							}

							if (!track) throw new Error('Invalid argument'); else if (!media) return Promise.reject('Missing media');
							if (!track.title) return Promise.reject('Missing track name');
							const medium = media.find(medium => medium?.tracks?.includes(track));
							console.assert(medium, media, track);
							if (!medium) throw 'Assertion failed: medium not found';
							const mediumIndex = media.indexOf(medium), trackIndex = medium.tracks.indexOf(track);
							console.assert(mediumIndex >= 0 && trackIndex >= 0);
							if (mediumIndex < 0 || trackIndex < 0) throw 'Assertion failed: Index not found';
							let trackLength = (function() {
								if (!(layoutMatch(media) > 2) || sessions == null || !['CD', 'CD-R'].includes(mediumFormat(medium))) return;
								if (!(mediumIndex >= 0) || !(trackIndex >= 0)) return;
								const tocEntries = getTocAudioEntries(sessions[mediumIndex]);
								if (tocEntries != null && tocEntries[trackIndex]) return tocEntries[trackIndex].length * 1000 / 75;
							})();
							if (isNaN(trackLength)) trackLength = getTrackLength(track);
							params = Object.assign({
								maxLengthDifference: GM_getValue('max_recording_length_distance', 10000),
								lengthRequired: false,
								dateRequired: false,
								looseSearch: false,
							}, params);
							const aridLookupFn = params.aridLookupFn instanceof Function ? params.aridLookupFn
								: trackLength > 0 ? () => null : null;
							if (typeof aridLookupFn != 'function') return Promise.reject('Missing track length');
							const artists = resolvePerformers(release, track);
							console.assert(artists != null, track);
							if (!artists || artists.length <= 0) return Promise.reject('No artists associated with track');
							const everyArtistWeak = artists.every(weakArtistTest), someArtistWeak = artists.some(weakArtistTest);
							if (everyArtistWeak) [params.lengthRequired, params.dateRequired, params.maxLengthDifference] =
								[true, true, Math.min(params.maxLengthDifference, 1500)];
							const canContainVideo = medium.format && (/\b(?:Blu-Ray|DVD)\b/.test(medium.format)
								|| medium.format == 'Enhanced CD' && Array.isArray(sessions) && mediumIndex in sessions
								&& (tocEntries => tocEntries != null && !tocEntries[trackIndex])(getTocAudioEntries(sessions[mediumIndex])));
							let query = queryBuilder(true);
							//if (debugLogging) console.debug('Recording search query for "%s":', track.title, query);
							return mbApiRequest('recording', { query: query, limit: 100 })
									.then(results => results.count > 0 || !(trackLength > 0) ? results : Promise.reject('No results'))
									.catch(reason => mbApiRequest('recording', { query: query = queryBuilder(false), limit: 100 })).then(function(recordings) {
								function hasArtist(recording, artist) {
									console.assert(recording instanceof Object && artist instanceof Object);
									if (!(recording instanceof Object) || !(artist instanceof Object)) return false;
									let arid = aridLookupFn('artist', artist.id);
									return recording['artist-credit'].some(arid != null ?
											artistCredit => artistCredit.artist && artistCredit.artist.id == arid
										: artistCredit => sameStringValues(artist.name, artistCredit.artist.name)
											|| artistCredit.name && sameStringValues(artist.name, artistCredit.name));
								}

								console.assert(recordings.count > 0 == recordings.recordings.length > 0);
								if (recordings.count <= 0) return Promise.reject('No results');
								const deltaMapper = recording => recording.length > 0 && trackLength > 0 ? Math.abs(recording.length - trackLength) : NaN;
								return (recordings = recordings.recordings.filter(function(recording) {
									function sameType(pattern, secondaryType) {
										if (pattern) try {
											pattern = [rxBracketsMatcher(['()', '[]'], 0b11, pattern), pattern]
												.map(expr => new RegExp(expr, 'i'));
										} catch(e) { console.warn(e); pattern = undefined; }
										let localFlag = secondaryType && hasType(secondaryType) || pattern
											&& ([track, medium, release].filter(Boolean).some(root => pattern[0].test(root.title)));
										// if (debugLogging && localFlag) console.debug('Local flag triggered for (%o, %s):',
										// 	pattern, secondaryType, formData.getAll('type'), track.title, release.title);
										const releases = recording.releases || [ ], rgTypeFlag = releaseGroups => {
											if (!secondaryType || releaseGroups.length <= 0) return false;
											const matched = releaseGroups.filter(releaseGroup =>
												(releaseGroups['secondary-types'] || [ ]).includes(secondaryType));
											return matched.length * 2 >= releaseGroups.length;
										}, releaseTitleFlag = releaseTitles => {
											if (!pattern || releaseTitles.length <= 0) return false;
											const matched = releaseTitles.filter(RegExp.prototype.test.bind(pattern[0]));
											return matched.length * 2 >= releaseTitles.length;
										};
										let remoteFlag = rgTypeFlag(releases.map(release => release['release-group']).filter(Boolean))
											|| pattern && (pattern[0].test(recording.title) || pattern[1].test(recording.disambiguation)
												|| releaseTitleFlag(releases.map(release => release.title)));
										// if (debugLogging && remoteFlag) console.debug('Remote flag triggered for (%o, %s):',
										// 	pattern, secondaryType, releases, recording.title, recording.disambiguation);
										return Boolean(remoteFlag) == Boolean(localFlag);
									}

									if (recording.score < 20 || !canContainVideo && recording.video) return false;
									if (params.dateRequired && !recordingDate(recording)) return false;
									if (!(recording.length > 0) && (params.lengthRequired/* || aridLookupFn.length <= 0*/)) return false;
									if ((recording['artist-credit'] || [ ]).length <= 0
											|| !artists.some(artist => hasArtist(recording, artist))) return false;
									const delta = deltaMapper(recording);
									if (params.maxLengthDifference > 0 && delta > params.maxLengthDifference) return false;
									const accuracyLevel = !isNaN(delta) && params.maxLengthDifference > 0 ?
										Math.floor(Math.min(delta * 3 / params.maxLengthDifference, 3)) : undefined;
									if (!(accuracyLevel < 2) && !artists.every(artist => hasArtist(recording, artist))) return false;
									const typeFlags = [
										sameType(phrases.live, 'Live'), sameType(phrases.instrumental), sameType(phrases.remix),
										sameType(phrases.acoustic), sameType(phrases.acappella), sameType(phrases.clean),
										sameType(phrases.demo, 'Demo'), sameType(phrases.mono), sameType(phrases.multichannel),
										sameType(undefined, 'Interview'), sameType(phrases.karaoke),
									];
									if (!typeFlags.every(Boolean)) return false;
									if (!sameTitleMapper(recording, track.title,
											[weakMatchMapper, similarStringValues][accuracyLevel] || sameStringValues)) return false;
									return true;
								})).length > 0 ? recordings.sort(function(...recordings) {
									const cmpVal = testFn => {
										console.assert(typeof testFn == 'function');
										testFn = recordings.map(testFn);
										return testFn[0] && !testFn[1] ? -1 : testFn[1] && !testFn[0] ? +1 : 0;
									}, factor = (index, f = 1) => {
										f = Math.max(Math.min(f, 1), 0);
										return (1 - f) + Math.max(index, 0) * f;
									}, methods = [
										recording => artists.filter(artist => hasArtist(recording, artist)).length / artists.length,
										recording => Math.max(...[recording].concat(recording.aliases || [ ]).map(root => root.title ?
											jaroWinklerSimilarity(...[root, track].map(root => toASCII(root.title).toLowerCase())) : 0)),
									];
									if (params.maxLengthDifference > 0 && recordings.every(recording => recording.length > 0))
										methods.push(recording => factor((1 - deltaMapper(recording) / params.maxLengthDifference), 0.5));
									if (recordings.every(recording => recording.releases)) methods.push(recording =>
										1 + Math.min(Math.log10(recording.releases.length), 1) / 10);
									const indexes = recordings.map(recording =>
										methods.reduce((index, method) => index * method(recording), 1));
									if (recordings.every(recordingDate)) {
										const releaseYears = recordings.map(recordingDate).map(recordingDate =>
											(recordingDate = /\b(\d{4})\b/.exec(recordingDate)) != null ? parseInt(recordingDate[1]) : NaN);
										const result = Math.sign(releaseYears[0] - releaseYears[1]);
										if (result) indexes[result > 0 ? 0 : 1] *= 0.8;
									}
									return Math.sign(indexes[1] - indexes[0]) || cmpVal(recordingDate) || cmpVal(recording => recording.length > 0);
								}) : Promise.reject('No filtered matches');
							});
						}
						function resolveFormData(entity, allMusicId, mbid) {
							console.assert(entity && allMusicId && mbid);
							if (!entity || !allMusicId || !mbid) return;
							console.assert(lookupIndexes[entity] && lookupIndexes[entity][allMusicId], entity, allMusicId);
							if (!lookupIndexes[entity] || !lookupIndexes[entity][allMusicId]) return;
							console.assert(Array.isArray(lookupIndexes[entity][allMusicId].contexts), lookupIndexes[entity][allMusicId]);
							if (!Array.isArray(lookupIndexes[entity][allMusicId].contexts)) return;
							lookupIndexes[entity][allMusicId].contexts.forEach(function(context) {
								if (!(entity in credits && context in credits[entity])) formData.set(context + '.mbid', mbid);
								else if (!relsBlacklist.includes(context)) {
									function getRelation(linkTypeId, attributes, params, extraData) {
										if (!((linkTypeId = parseInt(linkTypeId)) > 0) || mbExcludedTypeIds.includes(linkTypeId)) return null;
										params = Object.assign({ backward: false }, params);
										return {
											linkTypeId: linkTypeId, backward: Boolean(params.backward),
											targetType: entity, target: mbid,
											name: credit.name, credit: params.creditedAs,
											attributes: (attributes || [ ]).length > 0 ? attributes : null,
											dataset: extraData instanceof Object && Object.keys(extraData).length > 0 ? extraData : null,
										};
									}

									const credit = credits[entity][context].find(entity => entity.id == allMusicId);
									console.assert(credit, credits[entity][context], allMusicId);
									console.info('MBID for %s %s:', context, credit.name, mbid);
									let linkType = relationsMapping[entity][context];
									switch (entity) {
										case 'artist': {
											console.assert(relationResolvers[context] instanceof Promise, entity, context);
											if (!(relationResolvers[context] instanceof Promise)) break;
											relationWorkers.push(relationResolvers[context].then(function(relation) {
												function isCredited(track) {
													if (!levels.some(isTrackLevel)) return false;
													const etraArtists = resolveExtraArtists([release, track], role => role == context);
													return Boolean(etraArtists) && etraArtists.some(extraArtist =>
														extraArtist.id == allMusicId && extraArtist.roles.includes(context));
												}

												console.assert(relation.type, entity, context);
												const levels = findRelationLevels(entity, relation.type).filter(level =>
													!mbExcludedTypeIds.includes(getLinkTypeId(level, entity, relation.type)));
												const relateAtTrackLevel = levels.some(isTrackLevel) && media != null
													&& media.some(medium => medium.tracks && medium.tracks.some(isCredited));
												const debugLabel = `AllMusicID: ${allMusicId}, context: ${context}`;
												if (debugLogging) {
													console.groupCollapsed(debugLabel);
													console.debug('Lookup entry:', lookupIndexes[entity][allMusicId], 'MBID:', mbid, 'Relation:', relation, 'Levels:', levels);
													console.debug('Relate at track level:', relateAtTrackLevel);
												}
												const relations = levels.filter(level => relateAtLevel(level) && isTrackLevel(level) == relateAtTrackLevel).map(function(level) {
													const linkTypeId = getLinkTypeId(level, entity, relation.type);
													console.assert(linkTypeId > 0, level, entity, relation.type);
													if (!(linkTypeId > 0)) return null;
													const exclusiveTo = (exclusiveTo, _level) => level == _level && _level != exclusiveTo && levels.includes(exclusiveTo);
													if (exclusiveTo('recording', 'work') || exclusiveTo('release', 'release-group')) return null;
													const creditType = relation.creditType || context, attributes = Array.from(relation.attributes || [ ]);
													switch (context) {
														case 'vocals': attributes.push({ id: 'd92884b7-ee0c-46d5-96f3-918196ba8c5b' }); break;
														case 'vocals (background)': attributes.push({ id: '75052401-7340-4e5b-a71d-ea024a128849' }); break;
														case 'choir/chorus': attributes.push({ id: '43427f08-837b-46b8-bc77-483453af6a7b' }); break;
														case 'guest artist': attributes.push({ id: mbAttrIds.guest }); break;
													}
													if (['misc'].includes(relation.type) || ['sleeve art', 'cover art', 'cover photo'].includes(context))
														attributes.push(taskAttribute(creditType));
													const creditedAs = noCreditAsArtists.includes(allMusicId) ? undefined : creditedName(credit);
													if (debugLogging) console.debug('LinkType:', relation.type, 'LinkTypeId:', linkTypeId, 'Attributes:', attributes, 'Credit type:', creditType);
													if (relateAtTrackLevel) return Array.prototype.concat.apply([ ], media.map(function(medium, mediumIndex) {
														if (debugLogging) console.debug('Medium %d', mediumIndex + 1);
														return medium.tracks ? medium.tracks.map(function(track, trackIndex) {
															const _isCredited = isCredited(track);
															if (debugLogging) console.debug('Track %d:', trackIndex + 1, track, 'is credited:', _isCredited);
															return _isCredited ? getRelation(linkTypeId, attributes, { creditedAs: creditedAs },
																{ medium: mediumIndex, track: trackIndex }) : null;
														}) : null;
													})); else {
														const roleArtists = resolveExtraArtists([release], role => role == context);
														const relateAtReleaseLevel = roleArtists && roleArtists
															.some(roleArtist => roleArtist.id == allMusicId);
														if (debugLogging) console.debug('Relate at release level:', relateAtReleaseLevel);
														return relateAtReleaseLevel ? getRelation(linkTypeId, attributes, { creditedAs: creditedAs }) : null;
													}
												});
												if (debugLogging) console.groupEnd(debugLabel);
												return Array.prototype.concat.apply([ ], relations).filter(Boolean);
											}).catch(console.log));
											break;
										}
										default: console.warn('Unexpected entity type:', entity);
									}
								}
							});
						}

						const canContainVideo = medium => medium && medium.format
							&& ['BLU-RAY', 'DVD'].includes(medium.format.toUpperCase());
						const workers = [ ], relationWorkers = [ ], artistLookupWorkers = { }, rawRecordingLookups = new Map;
						if (params.lookupArtistsByRecording && !hasType('Live') && media && params.searchSize > 0)
							for (let medium of media) if ('tracks' in medium) for (let track of medium.tracks) (function addArtistLookups(artists) {
								if (artists != null) for (let artist of artists) {
									if (!rawRecordingLookups.has(track)) rawRecordingLookups.set(track, recordingsLookup(track));
									if (!(artist.id in artistLookupWorkers)) artistLookupWorkers[artist.id] = [ ];
									artistLookupWorkers[artist.id].push(rawRecordingLookups.get(track).then(function(recordings) {
										const mbids = [ ];
										for (let recording of recordings) if ('artist-credit' in recording)
											for (let artistCredit of recording['artist-credit'])
												if (artistCredit.artist && (sameStringValues(artist.name, artistCredit.artist.name)
														|| artistCredit.name && sameStringValues(artist.name, artistCredit.name)))
													mbids.push(artistCredit.artist.id);
										return mbids.length > 0 ? mbids : null;
									}).catch(reason => null));
								}
							})(resolvePerformers(release, track));
						if (params.searchSize > 0) for (let allMusicId in artistLookupWorkers)
							artistLookupWorkers[allMusicId] = Promise.all(artistLookupWorkers[allMusicId]).then(function(mbids) {
								const scores = { };
								for (let _mbids of mbids.filter(Boolean)) for (let mbid of _mbids)
									if (!(mbid in scores)) scores[mbid] = 1; else ++scores[mbid];
								return Object.keys(scores).length > 0 ? scores : Promise.reject('No matches');
							});
						return Promise.all(Object.keys(lookupIndexes).map(entity => Promise.all(Object.keys(lookupIndexes[entity]).map(function(allMusicId) {
							const printArtistMBIDs = mbids => Object.keys(mbids).map(mbid =>
								[mbOrigin, 'artist', mbid, 'recordings'].join('/') + ' => ' + mbids[mbid]);
							let promise = findMBID(entity, allMusicId);
							if (entity == 'artist' && allMusicId in artistLookupWorkers) promise = promise.catch(function(reason) {
								if (isFatalReason(reason)) return Promise.reject(reason);
								return artistLookupWorkers[allMusicId].then(function(mbids) {
								const hiValue = Math.max(...Object.values(mbids));
								if (Object.values(mbids).reduce((sum, count) => sum + count, 0) >= hiValue * 1.5) {
									console.warn('MBID for artist', [amOrigin, 'artist', allMusicId].join('/'),
											'resolved to multiple entities:', printArtistMBIDs(mbids), '(rejected)',
											'Related tracks:', mbids.tracks);
									return Promise.reject('Ambiguity (recordings)');
								} else if (Object.keys(mbids).length > 1) {
									console.warn('MBID for artist', [amOrigin, 'artist', allMusicId].join('/'),
										'resolved to multiple entities:', printArtistMBIDs(mbids), '(accepted)',
										'Related tracks:', mbids.tracks);
									if (params.openInconsistent && (!(entity in openedIds) || !openedIds[entity].has(allMusicId))) {
										if (!(entity in openedIds)) openedIds[entity] = new Set;
										openedIds[entity].add(allMusicId);
										const params = mbids.tracks.length == 1 ? { 'filter.name': mbids.tracks[0].title } : null;
										openInconsistent(entity, allMusicId, Object.keys(mbids), 'recordings', params);
									}
									chord.play();
								}
								const mbid = Object.keys(mbids).find(key => mbids[key] == hiValue);
								if (!mbid) return Promise.reject('Assertion failed: MBID indexed lookup failed');
								if (debugLogging) console.debug('Entity binding found by matching existing recordings:',
									[amOrigin, amEntity(entity), allMusicId].join('/') + '#' + entity,
									[mbOrigin, entity, mbid, 'releases'].join('/'));
								notify(`MBID for ${entity} <b>${lookupIndexes[entity][allMusicId].name}</b> found by match with <b>${hiValue}</b> existing recordings`, 'foundbyrecordings');
								saveToCache(entity, allMusicId, mbid);
								return mbid;
								});
							});
							if (entity == 'artist') promise = promise.catch(reason => isFatalReason(reason) ?
								Promise.reject(reason) : guessSPA(lookupIndexes[entity][allMusicId]));
							return promise.then(function(resolved) {
								function checkMBID(resolved) {
									if (resolved === null || rxMBID.test(resolved)) return;
									throw `Assertion failed: Entity ${entity} (${allMusicId}) resolving to invalid MBID ${resolved}`;
								}

								checkMBID(resolved);
								if (resolved == null) return null;
								if (entity == 'artist' && allMusicId in artistLookupWorkers) artistLookupWorkers[allMusicId].then(function(mbids) {
									if (!Object.keys(mbids).includes(resolved)) {
										console.warn('MBID %s for artist', resolved, [amOrigin, 'artist', allMusicId].join('/'),
											'matching different entities:', printArtistMBIDs(mbids), 'Related tracks:', mbids.tracks);
										if (params.openInconsistent && (!(entity in openedIds) || !openedIds[entity].has(allMusicId))) {
											if (!(entity in openedIds)) openedIds[entity] = new Set;
											openedIds[entity].add(allMusicId);
											const params = mbids.tracks.length == 1 ? { 'filter.name': mbids.tracks[0].title } : null;
											openInconsistent(entity, allMusicId, [resolved].concat(Object.keys(mbids)), 'recordings', params);
										}
										chord.play();
									} else if (Object.keys(mbids).length > 1) {
										console.warn('MBID %s for artist', resolved, [amOrigin, 'artist', allMusicId].join('/'),
											'can resolve to multiple entities:', printArtistMBIDs(mbids), 'Related tracks:', mbids.tracks);
										if (params.openInconsistent && (!(entity in openedIds) || !openedIds[entity].has(allMusicId))) {
											if (!(entity in openedIds)) openedIds[entity] = new Set;
											openedIds[entity].add(allMusicId);
											const params = mbids.tracks.length == 1 ? { 'filter.name': mbids.tracks[0].title } : null;
											openInconsistent(entity, allMusicId, Object.keys(mbids), 'recordings', params);
										}
										chord.play();
									} else if (debugLogging) console.debug('MBID %s for artist %d verified consistent with score %d',
										resolved, allMusicId, Object.values(mbids)[0], 'Evaluated tracks:', mbids.tracks);
								});
								resolveFormData(entity, allMusicId, resolved);
								return resolved;
							}).catch(function(reason) {
								if (/^(?:Assertion failed\b)/i.test(reason)) return alert(reason);
								const searchLink = new URL('search', mbOrigin);
								searchLink.searchParams.set('query',
									encodeQuotes(lookupIndexes[entity][allMusicId].name));
								searchLink.searchParams.set('type', entity);
								searchLink.searchParams.set('method', 'direct'); // 'indexed'
								const amLink = [amOrigin, amEntity(entity), allMusicId].join('/');
								console.log('%s %s (%s) finally not resolved with last reason:', entity, allMusicId,
									lookupIndexes[entity][allMusicId].name, reason, amLink, searchLink.href);
								if (GM_getValue('open_unresolved_entities', false)) {
									GM_openInTab(searchLink.href, true);
									GM_openInTab(amLink, true);
								}
								return null;
							});
						})))).then(lookupResults => new Promise((resolve, reject) => GM_getTabs(function(tabs) {
							console.assert(tabs instanceof Object);
							let deleted = 0;
							for (let tab of Object.values(tabs)) if (tab instanceof Object && 'deletedAllMusicBindings' in tab)
								for (let entity in tab.deleted) if (Array.isArray(tab.deletedAllMusicBindings[entity]))
									for (let allMusicId of tab.deletedAllMusicBindings[entity]) if (allMusicId) {
										if (entity in amBindingsCache && allMusicId in amBindingsCache[entity]) {
											delete amBindingsCache[entity][allMusicId];
											GM_setValue('discogs_to_mb_bindings', amBindingsCache);
										}
										const ndx1 = Object.keys(lookupIndexes).indexOf(entity);
										if (ndx1 < 0) continue;
										const ndx2 = Object.keys(lookupIndexes[entity]).indexOf(allMusicId);
										if (ndx2 < 0) continue;
										lookupResults[ndx1][ndx2] = null;
										++deleted;
									}
							if (deleted > 0 && !prompt(`There are ${deleted} externally deleted linkages, collected data may result in wrongly assigned entities.\n\nContinue anyway?`))
								reject('User cancelled (externally deleted linkages)');
							resolve(lookupResults);
						}))).then(function(lookupResults) {
							function getMBID(entity, allMusicId) {
								console.assert(entity in lookupIndexes);
								if (!(entity in lookupIndexes)) return null;
								let index = Object.keys(lookupIndexes[entity]).findIndex(key => key == allMusicId);
								return index >= 0 ? lookupResults[Object.keys(lookupIndexes).indexOf(entity)][index] : null;
							}

							// Object.keys(lookupIndexes).forEach(function(entity, ndx1) {
							// 	console.assert(lookupResults[ndx1]);
							// 	if (lookupResults[ndx1]) Object.keys(lookupIndexes[entity]).forEach(function(allMusicId, ndx2) {
							// 		const mbid = lookupResults[ndx1][ndx2];
							// 		if (mbid != null) resolveFormData(entity, allMusicId, mbid);
							// 	});
							// });
							workers.push(Promise.all(relationWorkers).then(function(relations) {
								relations = Array.prototype.concat.apply([ ], relations).filter(relation =>
									relation && ['linkTypeId', 'target', 'targetType'].every(prop => relation[prop]));
								(relations = relations.filter(function(relation, index, relations) {
									if (getLinkType(relation.linkTypeId) == 'performer' && ['instrument', 'vocal'].some(linkType => relations.some(function(relation2) {
										if (relation2 == relation || relation2.target != relation.target
												|| getLinkType(relation2.linkTypeId) != linkType) return false;
										if (!relation.dataset && !relation2.dataset) return true;
										if (!relation.dataset || !relation2.dataset) return false;
										const equal = (relation1, relation2) => Object.keys(relation1.dataset)
											.every(key => relation2.dataset[key] == relation1.dataset[key]);
										return equal(relation, relation2) && equal(relation2, relation);
									}))) return false;
									return true;
								})).forEach(function(relation, index, relations) {
									const prefix = `rel.${index}.`;
									formData.set(prefix + 'link_type_id', relation.linkTypeId);
									formData.set(prefix + 'backward', relation.backward ? 1 : 0);
									formData.set(prefix + 'target_type', relation.targetType);
									formData.set(prefix + 'target', relation.target);
									formData.set(prefix + 'name', relation.name);
									if (relation.credit) formData.set(prefix + 'credit', relation.credit);
									if (relation.attributes) {
										const attributes = mbAttributesValidator(relation);
										if (attributes != null) formData.set(prefix + 'attributes', JSON.stringify(attributes));
									}
									if (relation.dataset) for (let key in relation.dataset) formData.set(prefix + key, relation.dataset[key]);
								});
								return relations;
							}));
							if (params.basicMetadata && params.rgLookup && !formData.has('release_group') && Array.isArray(release.artists)) {
								function rgResolver(releaseGroups) {
									if (!releaseGroups) return null;
									const rgFilter = (releaseGroups, strictType = false, strictName = true) => releaseGroups.filter(function(releaseGroup) {
										if (formData.has('type') && releaseGroup['primary-type']) {
											const types = formData.getAll('type');
											const cmpNocase = (...str) => str.every((s, n, a) => s.toLowerCase() == a[0].toLowerCase());
											if (!types.some(type => cmpNocase(type, releaseGroup['primary-type']))) return false;
											if (strictType && releaseGroup['secondary-types']) {
												if (!releaseGroup['secondary-types'].every(secondaryType =>
														types.some(type => cmpNocase(type, secondaryType)))) return false;
												if (!types.every(type => cmpNocase(type, releaseGroup['primary-type'])
														|| releaseGroup['secondary-types'].some(secondaryType =>
															cmpNocase(secondaryType, type)))) return false;
											}
										}
										return sameTitleMapper(releaseGroup, release.title, strictName ?
												sameStringValues : similarStringValues, releaseTitleNorm)
											|| releaseGroup.releases && releaseGroup.releases.some(release2 =>
												sameTitleMapper(release2, release.title, strictName ?
													sameStringValues : similarStringValues, releaseTitleNorm));
									});
									let filtered = rgFilter(releaseGroups, false, true);
									if (filtered.length > 1) filtered = rgFilter(releaseGroups, true, true);
									else if (filtered.length < 1) filtered = rgFilter(releaseGroups, false, false);
									if (filtered.length != 1) filtered = rgFilter(releaseGroups, true, false);
									return filtered.length == 1 ? filtered[0] : null;
								}

								if (release.artists.length > 0) {
									let query = (keyword, ...terms) => terms.filter(uniqueValues)
										.map(term => `${keyword}:"${encodeQuotes(term)}"`).join(' OR ');
									query = [[
										query('releasegroup', release.title, releaseTitleNorm(release.title), anyBracketsStripper(release.title)),
										query('alias', release.title, releaseTitleNorm(release.title)),
										query('release', release.title, releaseTitleNorm(release.title)),
									].join(' OR ')].concat(release.artists.map(function(artist) {
										const arid = getMBID('artist', artist.id);
										return arid != null ? `arid:${arid}`
											: `(artistname:"${encodeQuotes(stripDiscogsNameVersion(artist.name))}" OR creditname:"${encodeQuotes(creditedName(artist))}")`;
									})).map(term => '(' + term + ')').join(' AND ');
									rgLookupWorkers.push(mbApiRequest('release-group', { query: query, limit: 100 })
										.then(results => rgResolver(results['release-groups']), console.error));
								}
								for (let artist of release.artists) if (!weakArtistTest(artist)) {
									const mbid = getMBID('artist', artist.id);
									if (mbid != null) rgLookupWorkers.unshift(mbLookupById('release-group', 'artist', mbid).then(rgResolver, console.error));
								}
							}
							workers.push(Promise.all(rgLookupWorkers).then(function(releaseGroups) {
								const releaseGroup = releaseGroups.find(Boolean);
								if (releaseGroup) formData.set('release_group', releaseGroup.id); else return null;
								let notification = [`MBID for release group <b>${releaseGroup.name || releaseGroup.title}</b>`];
								if (releaseGroup['first-release-date'])
									notification.push(`(<b>${getReleaseYear(releaseGroup['first-release-date'])}</b>)`);
								notification.push(`found by ${'relations' in releaseGroup ? 'unique name match' : 'known URL relation'}`);
								notify(notification.join(' '), 'rgfound');
								return releaseGroup;
							}).then(function findExistingRecordings(releaseGroup) {
								if (!(params.recordingsLookup > 0) || !media || !(params.recordingsLookup > 1)
										&& (hasType('Live') || !hasType('Single') && (formData.has('release_group') || hasType('DJ-mix', 'Remix', 'Live'))))
									return null;
								return Promise.all(media.map(function(medium, mediumIndex) {
									if (!medium || !Array.isArray(medium.tracks) || /\b(?:Blu-Ray|DVD)\b/.test(medium.format)) return null;
									return Promise.all(medium.tracks.map(function(track, trackIndex) {
										function findRecording(recordings) {
											if ((recordings = recordings.filter(recording => !/\b(?:live)\b/i
													.test(recording.disambiguation))).length <= 0) return Promise.reject('No matches');
											formData.set(`mediums.${mediumIndex}.track.${trackIndex}.recording`, recordings[0].id);
											let notifyText = `MBID for recording <b>${track.title}</b> found`, firstRelease = [ ];
											if (recordingDate(recordings[0])) firstRelease.push('<b>' +
												getReleaseYear(recordingDate(recordings[0])) + '</b>');
											if (recordings[0].releases && recordings[0].releases.length > 0) {
												const release = recordings[0].releases.length > 1 ? recordings[0].releases.find(release =>
													release.date == recordingDate(recordings[0])) : recordings[0].releases[0];
												if (release) {
													let releaseType = release['release-group'] && release['release-group']['primary-type'];
													if (releaseType && releaseType.toUpperCase() != releaseType) releaseType = releaseType.toLowerCase();
													if (releaseType && release['release-group']['secondary-types']
															&& release['release-group']['secondary-types'].includes('Live'))
														releaseType = 'live ' + releaseType;
													firstRelease.push('on <b>' + (releaseType ? releaseType + ' ' + release.title : release.title) + '</b>');
												}
											}
											if (firstRelease.length > 0) notifyText += ` (first released ${firstRelease.join(' ')})`;
											notify(notifyText, 'recordingfound');
											if (debugLogging) console.debug('Closest recordings for track %o:', track, recordings);
											return recordings[0];
										}

										if (medium.format == 'Enhanced CD' && sessions != null && mediumIndex in sessions
												&& (tocEntries => tocEntries != null && !tocEntries[trackIndex])
													(getTocAudioEntries(sessions[mediumIndex]))) return false;
										if (!(params.recordingsLookup > 1) && ['dj mix', 'dj-mix'].some(function(role) {
											const extraArtists = resolveExtraArtists([release, track]);
											return extraArtists && extraArtists.some(extraArtist => extraArtist.roles.includes(role));
										})) return null;
										let lookupWorker = recordingsLookup(track, { aridLookupFn: getMBID }).then(findRecording);
										if (rawRecordingLookups.has(track)) lookupWorker = lookupWorker
											.catch(reason => rawRecordingLookups.get(track).then(findRecording));
										return lookupWorker.catch(reason => null);
									}));
								}));
							}));
							return Promise.all(workers);
						});
					}));
					return Promise.all(workers).then(() => formData);
				});
			}
			function finalizeSeed(formData) {
				if (!formData || typeof formData != 'object') throw new Error('Invalid argument');
				// if (!formData.has('language')) formData.set('language', 'eng');
				const releaseTypes = formData.getAll('type');
				if (formData.get('artist_credit.names.0.mbid') == mb.spa.VA && !releaseTypes.includes('Compilation')
						&& !['Soundtrack', 'Live'].some(secondaryType => releaseTypes.includes(secondaryType)))
					formData.append('type', 'Compilation');
				if (!formData.has('script') && formData.has('language')) {
					const script = scriptFromLanguage(formData.get('language'));
					if (script) formData.set('script', script);
				}
				return getSessionsFromTorrent(torrentId).catch(reason => null).then(function(sessions) {
					if (sessions != null) sessions.forEach(function(session, discIndex) {
						const key = `mediums.${discIndex}.format`, format = formData.get(key);
						if (!format || format == 'CD') switch (getDataTracks(getTocEntries(session))) {
							case 0: formData.set(key, 'CD'); break;
							case 1: formData.set(key, 'Enhanced CD'); break;
							case 2: case 3: formData.set(key, 'Copy Control CD'); break;
							default: console.warn(`Disc ${discIndex + 1} unknown ToC type`, getTocEntries(session));
						}
					});
					return formData;
				});
			}
			function seedNewRelease(formData, makeVotable = !(mbSeedNew >= 2)) {
				if (!formData || typeof formData != 'object') throw new Error('Invalid argument');
				if (scriptSignature) formData.set('edit_note', ((formData.get('edit_note') || '') + '\nSeeded by ' + scriptSignature).trimLeft());
				if (makeVotable) formData.set('make_votable', 1);
				const seedUrl = new URL('/release/add', mbOrigin);
				seedUrl.searchParams.set('skip_confirmation', 1);
				const form = Object.assign(document.createElement('form'), {
					method: 'POST',
					action: seedUrl,
					target: '_blank',
					hidden: true,
				});
				for (let entry of formData) {
					const field = document.createElement(entry[1].includes('\n') ? 'textarea' : 'input');
					form.append(Object.assign(field, { name: entry[0], value: entry[1] }));
				}
				document.body.appendChild(form).submit();
				document.body.removeChild(form);
			}
			function editNoteFromSession(session) {
				let editNote = GM_getValue('insert_upload_reference', false) ?
					`Release identification from torrent ${document.location.origin}/torrents.php?torrentid=${torrentId} edition info\n` : '';
				editNote += 'TOC derived from EAC/XLD ripping log';
				if (session) editNote += '\n\n' + (mbSubmitLog ? session
					: 'Medium fingerprint:\n' + getMediumFingerprint(session)) + '\n';
				if (scriptSignature) editNote += '\nSubmitted by ' + scriptSignature;
				return editNote;
			}
			function attachToMBIcon(mbId, style, tooltip, tooltipster) {
// <svg height="0.9em" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
// 	<circle fill="${staticIconColor}" cx="50" cy="50" r="50"/>
// 	<path fill="white" d="M68.13 32.87c2.18,-0.13 5.27,-0.31 7.1,0.94 2.03,1.37 2.1,3.8 1.97,6.01 -0.55,9.72 -0.13,19.52 -0.21,29.25 -0.05,5.73 -2.35,10.96 -6.57,14.84 -4.85,4.46 -11.39,6.42 -17.86,6.78 -0.04,0 -0.08,0.01 -0.11,0.01l-4.5 0c-0.03,0 -0.05,0 -0.07,-0.01 -0.18,0 -0.36,-0.01 -0.54,-0.02 -6.89,-0.43 -14,-2.82 -19,-7.74 -2.53,-2.48 -4.26,-5.23 -5.01,-8.71 -0.62,-2.89 -0.49,-5.88 -0.47,-8.81 0.1,-12.96 -0.24,-25.93 -0.02,-38.89 0.05,-3.01 0.42,-5.94 1.97,-8.57 1.81,-3.07 4.83,-5.05 7.99,-6.53 2.69,-1.26 5.73,-1.91 8.69,-2.11 0.05,0 0.09,-0.01 0.13,-0.01l3.59 0c0.05,0 0.08,0.01 0.13,0.01 3.61,0.23 7.41,1.15 10.55,2.99 3.09,1.8 5.79,4.11 7.13,7.52 1.09,2.79 1.07,5.79 1.01,8.74 -0.14,6.49 -0.06,12.98 -0.02,19.47 0.02,4.95 0.98,15.66 -1.95,19.61 -2.26,3.06 -6.11,4.59 -9.79,5 -3.82,0.43 -8.01,-0.26 -11.32,-2.27 -3.28,-1.98 -4.54,-5.39 -4.89,-9.04 -0.16,-1.6 -0.14,-3.22 -0.07,-4.83 0.05,-1.32 0.15,-2.64 0.16,-3.96 0.05,-6.1 0.06,-12.21 0.21,-18.31 0.03,-1.09 0.92,-1.95 2,-1.95l6.37 0c1.1,0 2,0.9 2,2 0,2.02 -0.09,4.06 -0.14,6.08 -0.08,3.09 -0.14,6.18 -0.15,9.27 0,2.99 0.02,6.03 0.23,9.01 0.06,0.87 0.29,3.78 0.7,4.63 1.08,0.91 3.95,0.88 5.06,0.1 1.09,-0.76 0.71,-3.87 0.68,-4.99 -0.14,-5.16 -0.01,-10.32 -0.01,-15.48 0,-5.21 -0.07,-10.42 0.03,-15.63 0.08,-4.8 -0.58,-7.19 -5.63,-8.72 -2.35,-0.71 -4.97,-0.78 -7.36,-0.21 -1.96,0.47 -4.04,1.46 -5.29,3.08 -1.77,2.29 -1.09,10.23 -1.08,13.15 0.02,10.39 0.1,20.78 0.01,31.16 -0.04,4.6 -0.76,8.12 2.93,11.61 6.55,6.2 19.73,6.26 26.32,0.08 3.76,-3.53 3.06,-6.86 3.02,-11.54 -0.09,-10.33 0.01,-20.67 0.01,-31 0,-0.77 0.4,-1.42 1.08,-1.77 0.32,-0.17 0.66,-0.25 0.99,-0.24z"/>
				return addIcon(minifyHTML(`
<svg height="0.9em" fill="#aa0" viewBox="0 0 56 100" xmlns="http://www.w3.org/2000/svg">
	<path d="M43.56 30.51c0,0 0.77,-4.33 -4.16,-4.33 -4.93,0 -4.14,4.24 -4.14,4.24l0 37.66c0,0 1.69,10.1 -7.26,10.02 -8.94,-0.1 -7.26,-10.02 -7.26,-10.02l0 -49.37c0,0 -0.77,-12.11 13.49,-12.12 14.25,0.01 13.47,12.15 13.47,12.15l0 55.48c0,0 1.81,19.13 -19.82,19.13 -21.64,0 -19.56,-19.13 -19.56,-19.13l-0.01 -42.13c0,0 0.51,-4.33 -4.15,-4.33 -4.66,0 -4.14,4.33 -4.14,4.33l0 48.33c0,0 1.16,19.13 27.98,19.13 26.83,0 28,-19.13 28,-19.13l-0.01 -66.44c0,0 -0.9,-13.98 -21.76,-13.98 -20.87,0 -21.77,13.98 -21.77,13.98l-0.01 57.16c0,0 -1.8,13.27 15.69,13.27 17.49,0 15.41,-13.27 15.41,-13.27l0.01 -40.63z"/>
</svg>`), function clickHandler(evt) {
					let target = evt.currentTarget;
					if (target instanceof HTMLElement) target.disabled = true; else target = null;
					const animation = target && flashElement(target);
					attachToMB(mbId, evt.altKey, evt.ctrlKey).then(function(attached) {
						if (animation != null) animation.cancel();
						if (target != null) target.disabled = false;
					});
				}, !mbId && function dropHandler(evt, url) {
					const mbReleaseId = mbIdExtractor(url, 'release');
					if (!mbReleaseId) return;
					let target = evt.currentTarget;
					if (target instanceof HTMLElement) target.disabled = true; else target = null;
					const animation = target && flashElement(target);
					attachToMB(mbReleaseId, evt.altKey, evt.ctrlKey).then(function(attached) {
						if (animation != null) animation.cancel();
						if (target != null) target.disabled = false;
					});
				}, 'attach-toc', style, tooltip, tooltipster);
			}
			function seedToMB(target, torrent, params) {
				function relationsHandler(releases) {
					console.assert(releases.length > 0);
					if (releases.length > 1 && !confirm(`This release already exists by ambiguous binding from

${releases.map(release => `\t${mbOrigin}/release/${release.id}`).join('\n')}

Create new release anyway?`)) return Promise.resolve('Cancelled');
					if (releases.length == 1 && confirm(`This release already exists as ${mbOrigin}/release/${releases[0].id}.
Attach the TOC(s) instead?`)) return attachToMB(releases[0].id, false, false);
					return Promise.reject('New release enforced');
				}

				if (!(target instanceof HTMLElement) || !torrent) throw new Error('Invalid argument');
				const timestamp = Date.now();
				params = Object.assign({ }, params);
				let seedWorker = Promise.reject('No references');
				if (params.discogsId > 0) seedWorker = seedWorker.catch(reason =>
					findDiscogsRelatives('release', params.discogsId).then(relationsHandler));
				if (params.allMusicId) seedWorker = seedWorker.catch(reason =>
					findAllMusicRelatives('release', params.allMusicId).then(relationsHandler));
				return seedWorker.catch(reason => getSessionsFromTorrent(torrent.torrent.id).catch(reason => null).then(function(sessions) {
					if (sessions != null && sessions.map(getTocEntries).some(tocEntries => tocEntries != null && tocEntries[0].startSector > 0)) {
						if (logScoreTest(uncalibratedReadOffset)
								&& !confirm('At least one session ripped with wrong read offset, continue anyway?'))
							return Promise.reject('Incorrect ToC entries (uncalibrated read offset)');
						if (logScoreTest(logStatus => !(logStatus.score > 0))
								&& !confirm('At least one logfile seems to have very bad score, continue anyway?'))
							return Promise.reject('Incorrect ToC entries (bad score)');
					}
					return getMbTOCs().then(function(mbTOCs) {
						const formData = new URLSearchParams;
						if (rxMBID.test(params.releaseGroupId)) formData.set('release_group', params.releaseGroupId);
						seedFromTorrent(formData, torrent, params && params.torrentReference);
						seedWorker = seedFromTOCs(formData, mbTOCs, params.addMediaFingerprints);
						const cdLengths = mbTOCs.every(Boolean) ? mbTOCs.map(mbTOC => mbTOC[1]) : undefined;
						if (params.discogsId > 0) seedWorker = seedWorker.then(formData =>
							seedFromDiscogs(formData, params.discogsId, params, cdLengths));
						if (params.allMusicId) seedWorker = seedWorker.then(formData =>
							seedFromAllMusic(formData, params.allMusicId, params, cdLengths));
						return seedWorker;
					}).then(finalizeSeed).then(formData => (function tabStatusHandler() {
						if ((params.discogsId > 0 || params.allMusicId)
								&& (target.hold || BindingsCacheEditor.lastOpened >= timestamp)
								&& !confirm('Hold flag is active, confirm seeding new release with current mappings'))
							return Promise.reject('Cancelled by user');
						if (!document.hidden) return Promise.resolve(true);
						const notifyTimeout = GM_getValue('mb_seed_active', 0);
						return notifyTimeout > 0 ? new Promise(function(resolve) {
							if (document.hidden) {
								function activationListener(evt) {
									window.removeEventListener('focus', activationListener);
									resolve(!document.hidden);
								}

								window.addEventListener('focus', activationListener);
								const hdr = document.body.querySelector('div#content div.header > h2');
								GM_notification({
									title: GM_info.script.name, text: [
										'New MusicBrainz release seeding form is ready:',
										hdr != null && hdr.textContent.trim(),
										params.discogsId > 0 && 'Discogs ID ' + params.discogsId,
										params.allMusicId && 'AllMusic ID ' + params.allMusicId,
									].filter(Boolean).join('\n'),
									highlight: false, silent: false, image: GM_info.script.icon, timeout: notifyTimeout * 1000,
								}, activationListener);
							} else resolve(true);
						}) : Promise.resolve(!document.hidden);
					})().then(windowState => seedNewRelease(formData, params.makeVotable)));
				}));
			}
			function updateFromExternalDb(mbid, metaCollector, sourceRef, params) {
				const timestamp = Date.now();
				if (mbid && typeof metaCollector == 'function') params = Object.assign({
					updateMetadata: true,
					overwrite: false, touchReleaseWithRels: true, touchTrackWithRels: true, touchReleaseWithRelsOnTracks: 1,
					touchEntityWithTargetId: true, touchEntityWithLinkType: 1,
					makeVotable: !(mbUpdateRelease >= 2),
					createMissingWorks: GM_getValue('mb_create_works', 1),
					importTagsToRG: Number(GM_getValue('mb_import_rg_tags', 1)),
					importTagsToRelease: Number(GM_getValue('mb_import_release_tags', 1)),
					importTagsToRecordings: Number(GM_getValue('mb_import_track_tags', 1)),
					importTagsToWorks: Number(GM_getValue('mb_import_track_tags', 1)),
					simulationMode: false,
				}, params); else throw new Error('Invalid argument');
				if (params.simulationMode) params.createMissingWorks = 0;
				const mbRelease = mbApiRequest('release/' + mbid, { inc: [
					'release-groups', 'artist-credits', 'labels', 'media', 'recordings', 'annotation', 'tags',
					'artist-rels', 'label-rels', 'series-rels', 'place-rels', 'work-rels', 'url-rels',
					'release-group-level-rels', 'recording-level-rels', 'work-level-rels',
				].join('+') });
				return Promise.all([
					getMBEditObjects('release', mbid).catch(console.warn),
					mbRelease,
					Promise.all([mbRelease, getMbTOCs()]).then(([mbRelease, mbTOCs]) => metaCollector({
						languageIdentifier: params.overwrite || !mbRelease['text-representation'].language,
					}, mbTOCs.every(Boolean) ? mbTOCs.map(mbTOC => mbTOC[1]) : undefined)).then(finalizeSeed),
				]).then(function([mbEditObjects, mbRelease, formData]) {
					function getEditId(list, property, allowLoose) {
						if (mbEditObjects && list && (mbEditObjects[list = list + 'Ids'] instanceof Object))
							return mbEditObjects[list].get(property, allowLoose);
					}
					function forEachRelation(worker) {
						if (typeof worker != 'function') throw new Error('Invalid argument');
						for (let index = 0; formData.has(`rel.${index}.link_type_id`); ++index) {
							const relation = (function(index) {
								const relation = {
									targetType: formData.get(`rel.${index}.target_type`),
									target: formData.get(`rel.${index}.target`),
									linkTypeId: parseInt(formData.get(`rel.${index}.link_type_id`)),
									backward: Boolean(parseInt(formData.get(`rel.${index}.backward`))),
									name: formData.get(`rel.${index}.name`) || undefined,
									creditedAs: formData.get(`rel.${index}.credit`) || undefined,
									attributes: formData.get(`rel.${index}.attributes`),
								};
								console.assert(/*relation.targetType && */relation.target && relation.linkTypeId > 0 && relation.name);
								if (/*!relation.targetType || */!relation.target || !(relation.linkTypeId > 0)) return null;
								relation.level = findRelationLevel(relation.linkTypeId);
								console.assert(relation.level, 'No relation level for unknown link type id', relation);
								if (!relation.level) return null;
								relation.targetType = Object.keys(mbRelationsIndex[relation.level])
									.find(entity => relation.linkTypeId in mbRelationsIndex[relation.level][entity]);
								console.assert(relation.targetType, mbRelationsIndex[relation.level], relation.linkTypeId);
								if (!relation.targetType) return null;
								relation.type = mbRelationsIndex[relation.level][relation.targetType][relation.linkTypeId];
								console.assert(relation.type, relation.type, relation.level, relation.targetType, relation.linkTypeId);
								if (relation.attributes) try { relation.attributes = JSON.parse(relation.attributes) } catch(e) {
									console.warn(e);
									delete relation.attributes;
								}
								if (isTrackLevel(relation.level)) for (let prop of ['medium', 'track']) {
									if (!formData.has(`rel.${index}.${prop}`)) continue;
									relation[prop + 'Index'] = formData.get(`rel.${index}.${prop}`);
									if (relation[prop = prop + 'Index'] != null) relation[prop] = parseInt(relation[prop]);
										else delete relation[prop];
								}
								return Object.freeze(relation);
							})(index);
							console.assert(relation instanceof Object, index);
							if (relation instanceof Object) worker(relation, index);
						}
					}
					function addTags(entity, entry) {
						if (!(entry instanceof Object)) return;
						const entityTags = tags.filter(tag => !(entry.tags || [ ]).some(entityTag =>
							sameStringValues(entityTag.name, tag)/* && entityTag.count > 0*/));
						if (entityTags.length <= 0) return;
						const url = new URL([entity, entry.id, 'tags', 'upvote'].join('/'), mbOrigin);
						url.searchParams.set('tags', entityTags.join(', '));
						GlobalXHR.get(url, { responseType: null, recoverableErrors: [429] }).then(function({status}) {
							notify(`${entityTags.length} tag(s) successfully added to ${entity} <b>${entry.title}</b>`, 'tagsadded');
							console.log('%d tags for %s id %s added with response code %d', entityTags.length, entity, entry.id, status);
						}, console.error);
					}

					// if (debugLogging) console.debug('Edit objects:', mbEditObjects, mbRelease);
					const barcodesMismatch = (...barcodes) => barcodes.every(Boolean) && barcodes.map(barcode =>
						checkBarcode(barcode.toString().replace(/\W+/g, ''), true)).some((barcode1, index, barcodes) =>
							!barcode1 || barcodes.some(barcode2 => !barcode2 || parseInt(barcode2) != parseInt(barcode1)));
					if (barcodesMismatch(mbRelease.barcode, formData.get('barcode'))
							&& !confirm(`Releases don't match by barcode: ${mbRelease.barcode} ≠ ${formData.get('barcode')},\nApply edits anyway?`))
						return;
					const edits = [ ], releaseEdits = { }, batchSize = 500;
					let tags = [ ], editNote;
					for (let index = 0; formData.has(`tags.${index}`); ++index) tags.push(formData.get(`tags.${index}`));
					tags = tags.filter(Boolean).map(tag => tag.replace(/,\s*(&|and\b)/gi, ' $1').replace(/\s+/g, ' ')).filter(uniqueValues);
					if (params.updateMetadata && (params.overwrite || !mbRelease.status)) {
						const statusId = mbEditObjects?.statusIds?.get(formData.get('status'), true);
						if (statusId > 0) releaseEdits.status_id = statusId;
					}
					if (params.updateMetadata && (params.overwrite || !mbRelease.packaging)) {
						const packagingId = mbEditObjects?.packagingIds?.get(formData.get('packaging'), true);
						if (packagingId > 0) releaseEdits.packaging_id = packagingId;
					}
					if (params.updateMetadata && (params.overwrite || !mbRelease['text-representation']?.language)) {
						const languageId = mbEditObjects?.languageIds?.get({
							aar: 'Afar', abk: 'Abkhazian', abs: 'Malay', ace: 'Achinese', ach: 'Acoli', ada: 'Adangme',
							ady: 'Adyghe', aer: 'Eastern Arrernte', afh: 'Afrihili', afr: 'Afrikaans', aib: 'Ainu', ain: 'Ainu',
							aka: 'Akan', akk: 'Akkadian', ale: 'Aleut', alq: 'Algonquin', alt: 'Southern Altai', amh: 'Amharic',
							ang: 'English, Old (ca.450-1100)', anp: 'Angika', ara: 'Arabic', are: 'Western Arrarnta',
							arg: 'Aragonese', arn: 'Mapudungun', arp: 'Arapaho', arw: 'Arawak', asm: 'Assamese', ast: 'Asturian',
							atj: 'Atikamekw', ava: 'Avaric', ave: 'Avestan', awa: 'Awadhi', aym: 'Aymara', aze: 'Azerbaijani',
							bak: 'Bashkir', bal: 'Baluchi', bam: 'Bambara', ban: 'Balinese', bar: 'Bavarian', bas: 'Basa',
							bej: 'Beja', bel: 'Belarusian', bem: 'Bemba', ben: 'Bengali', bho: 'Bhojpuri', bik: 'Bikol',
							bis: 'Bislama', bla: 'Siksika', bod: 'Tibetan', bos: 'Bosnian', box: 'Buamu', bpq: 'Malay',
							bra: 'Braj', bre: 'Breton', brx: 'Bodo (India)', bsk: 'Burushaski', btj: 'Malay', bua: 'Buriat',
							bug: 'Buginese', bul: 'Bulgarian', bvd: 'Baeggu', bve: 'Malay', bvu: 'Malay', byn: 'Blin',
							bzw: 'Basa', cab: 'Garifuna', cad: 'Caddo', car: 'Galibi Carib', cat: 'Catalan', ccm: 'Malay',
							ceb: 'Cebuano', ces: 'Czech', cha: 'Chamorro', chb: 'Chibcha', che: 'Chechen', chg: 'Chagatai',
							chk: 'Chuukese', chm: 'Mari', chn: 'Chinook jargon', cho: 'Choctaw', chp: 'Chipewyan',
							chr: 'Cherokee', chu: 'Church Slavic', chv: 'Chuvash', chy: 'Cheyenne', cmn: 'Mandarin Chinese',
							coa: 'Malay', cop: 'Coptic', cor: 'Cornish', cos: 'Corsican', cre: 'Cree', crh: 'Crimean Tatar',
							csb: 'Kashubian', cym: 'Welsh', dak: 'Dakota', dan: 'Danish', dar: 'Dargwa', del: 'Delaware',
							den: 'Slave (Athapascan)', deu: 'German', dgo: 'Dogri', dgr: 'Dogrib', din: 'Dinka', div: 'Divehi',
							dje: 'Zarma', dsb: 'Sorbian, Lower', dua: 'Duala', dum: 'Dutch, Middle (ca.1050-1350)',
							dyu: 'Dyula', dzo: 'Dzongkha', efi: 'Efik', egy: 'Egyptian (Ancient)', eka: 'Ekajuk', ell: 'Greek',
							elx: 'Elamite', eng: 'English', enm: 'English, Middle (1100-1500)', epo: 'Esperanto', est: 'Estonian',
							esu: 'Central Yupik', eus: 'Basque', ewe: 'Ewe', ewo: 'Ewondo', fak: 'Fang', fan: 'Fang',
							fao: 'Faroese', fas: 'Persian', fat: 'Fanti', fij: 'Fijian', fil: 'Filipino', fin: 'Finnish',
							fon: 'Fon', fra: 'French', frc: 'Cajun French', fro: 'French, Old (842-ca.1400)', frr: 'Frisian, Northern',
							frs: 'Frisian, Eastern', fry: 'Frisian, Western', fuc: 'Pulaar', ful: 'Fulah', fur: 'Friulian',
							gaa: 'Ga', gay: 'Gayo', gba: 'Gbaya', gbp: 'Gbaya', gbq: 'Gbaya', gcf: 'Guadeloupean Creole French',
							gez: 'Geez', gil: 'Gilbertese', gla: 'Scottish Gaelic', gle: 'Irish', glg: 'Galician', glv: 'Manx',
							gmh: 'German, Middle High (ca.1050-1500)', gml: 'German, Low', gmm: 'Gbaya', gnn: 'Gumatj',
							goh: 'German, Old High (ca.750-1050)', gom: 'Konkani', gon: 'Gondi', gor: 'Gorontalo',
							gos: 'Gronings', got: 'Gothic', grb: 'Grebo', grc: 'Greek, Ancient', grn: 'Guarani',
							gsw: 'German, Swiss', guf: 'Gupapuyngu', guj: 'Gujarati', gul: 'Sea Island Creole English',
							gwi: 'Gwich\'in', gyn: 'Guyanese Creole English', hai: 'Haida', hat: 'Haitian Creole',
							hau: 'Hausa', haw: 'Hawaiian', heb: 'Hebrew', her: 'Herero', hil: 'Hiligaynon', hin: 'Hindi',
							hmf: 'Hmong', hmg: 'Hmong', hmo: 'Hiri Motu', hmv: 'Hmong', hna: 'Mina (Cameroon)', hob: 'Mari',
							hrv: 'Croatian', hsb: 'Sorbian, Upper', hun: 'Hungarian', hup: 'Hupa', hye: 'Armenian', iba: 'Iban',
							ibo: 'Igbo', ido: 'Ido', iii: 'Sichuan Yi', iku: 'Inuktitut', ile: 'Interlingue', ilo: 'Iloko',
							ina: 'Interlingua', ind: 'Indonesian', inh: 'Ingush', ipk: 'Inupiaq', isl: 'Icelandic',
							isv: /* Interslavic */'[Artificial (Other)]', ita: 'Italian', izh: 'Ingrian', jaj: 'Zaza',
							jam: 'Jamaican Creole English', jav: 'Javanese', jax: 'Malay', jbo: 'Lojban', jpn: 'Japanese',
							jpr: 'Judeo-Persian', jrb: 'Judeo-Arabic', kaa: 'Kara-Kalpak', kab: 'Kabyle', kac: 'Kachin',
							kal: 'Greenlandic', kam: 'Kamba', kan: 'Kannada', kas: 'Kashmiri', kat: 'Georgian', kau: 'Kanuri',
							kaz: 'Kazakh', kbd: 'Kabardian', kca: 'Khanty', kea: 'Kabuverdianu', kha: 'Khasi',
							khm: 'Khmer, Central', kik: 'Kikuyu', kin: 'Kinyarwanda', kir: 'Kirghiz', kjd: 'Southern Kiwai',
							kmb: 'Kimbundu', knn: 'Konkani', kok: 'Konkani', kom: 'Komi', kon: 'Kongo', kor: 'Korean',
							kos: 'Kosraean', kpe: 'Kpelle', krc: 'Karachay-Balkar', krl: 'Karelian', krs: 'Gbaya',
							kru: 'Kurukh', ksh: 'Kölsch', ktu: 'Kituba (Democratic Republic of Congo)', kua: 'Kuanyama',
							kum: 'Kumyk', kur: 'Kurdish', kut: 'Kutenai', lad: 'Ladino', lah: 'Lahnda', lam: 'Lamba',
							lao: 'Lao', lat: 'Latin', lav: 'Latvian', lez: 'Lezghian', lim: 'Limburgish', lin: 'Lingala',
							lit: 'Lithuanian', liv: 'Liv', lkt: 'Lakota', lld: 'Ladin', lol: 'Mongo',
							lou: 'Louisiana Creole French', loz: 'Lozi', lrt: 'Malay', ltz: 'Luxembourgish', lua: 'Luba-Lulua',
							lub: 'Luba-Katanga', lug: 'Ganda', lui: 'Luiseno', lun: 'Lunda', luo: 'Luo', lus: 'Lushai',
							luw: 'Luo', luy: 'Luyia', lzz: 'Laz', mad: 'Madurese', mag: 'Magahi', mah: 'Marshallese',
							mai: 'Maithili', mak: 'Makasar', mal: 'Malayalam', man: 'Mandingo', mar: 'Marathi', mas: 'Masai',
							max: 'Malay', mbf: 'Malay', mbx: 'Mari', mdf: 'Moksha', mdr: 'Mandar', men: 'Mende', meo: 'Malay',
							mfa: 'Malay', mfp: 'Malay', mhp: 'Malay', mhr: 'Mari', mic: 'Mi\'kmaq', min: 'Minangkabau',
							mkd: 'Macedonian', mkn: 'Malay', mkw: 'Kituba (Congo)', mlg: 'Malagasy', mlt: 'Maltese',
							mnc: 'Manchu', mni: 'Manipuri', mns: 'Mansi', moe: 'Innu', moh: 'Mohawk', mon: 'Mongolian',
							mos: 'Mossi', mqg: 'Malay', mri: 'Maori', mrj: 'Mari', msa: 'Malay', msi: 'Malay', mus: 'Creek',
							mvi: 'Miyako', mwl: 'Mirandese', mwr: 'Marwari', mww: 'Hmong', mya: 'Burmese', myv: 'Erzya',
							nan: 'Min Nan Chinese', nap: 'Neapolitan', nau: 'Nauru', nav: 'Navajo', nbl: 'Ndebele, South',
							nde: 'Ndebele, North', ndo: 'Ndonga', nep: 'Nepali', nia: 'Nias', niu: 'Niuean', nld: 'Dutch',
							nno: 'Norwegian Nynorsk', nob: 'Norwegian Bokmål', nog: 'Nogai', non: 'Norse, Old', nor: 'Norwegian',
							npi: 'Nepali', nqo: 'N\'Ko', nrn: 'Norn', nso: 'Sotho, Northern', nwc: 'Nepal Bhasa',
							nya: 'Chichewa', nym: 'Nyamwezi', nyn: 'Nyankole', nyo: 'Nyoro', nzi: 'Nzima', oci: 'Occitan',
							oji: 'Ojibwa', omy: 'Malay', ori: 'Oriya', orm: 'Oromo', ort: 'Oriya', ory: 'Oriya', osa: 'Osage',
							oss: 'Ossetian', ota: 'Turkish, Ottoman', oui: 'Uighur', pag: 'Pangasinan', pal: 'Pahlavi',
							pam: 'Pampanga', pan: 'Punjabi', pap: 'Papiamento', pau: 'Palauan', pjt: 'Pitjantjatjara',
							pka: 'Ardhamāgadhī Prākrit', pli: 'Pali', pmy: 'Malay', pol: 'Polish', pon: 'Pohnpeian',
							por: 'Portuguese', prg: 'Prussian', pro: 'Provençal, Old (to 1500)', pse: 'Malay', pus: 'Pushto',
							pyu: 'Puyuma', que: 'Quechua', qya: 'Quenya', raj: 'Rajasthani', rap: 'Rapanui', rar: 'Rarotongan',
							rcf: 'Réunion Creole French', roh: 'Romansh', rom: 'Romany', ron: 'Romanian', rue: 'Rusyn',
							run: 'Rundi', rup: 'Aromanian', rus: 'Russian', rys: 'Yaeyama', ryu: 'Central Okinawan',
							sad: 'Sandawe', sag: 'Sango', sah: 'Yakut', sam: 'Samaritan Aramaic', san: 'Sanskrit', sas: 'Sasak',
							sat: 'Santali', sci: 'Malay', scn: 'Sicilian', sco: 'Scots', sel: 'Selkup', sgg: 'German, Swiss',
							shn: 'Shan', sid: 'Sidamo', sim: 'Mende', sin: 'Sinhala', sjn: 'Sindarin', sju: 'Ume Sami',
							slk: 'Slovak', slv: 'Slovenian', sma: 'Sami, Southern', sme: 'Sami, Northern', smj: 'Sami, Lule',
							smn: 'Sami, Inari', smo: 'Samoan', sms: 'Sami, Skolt', sna: 'Shona', snd: 'Sindhi', snk: 'Soninke',
							som: 'Somali', sot: 'Sotho, Southern', spa: 'Spanish', sqi: 'Albanian', srd: 'Sardinian',
							srn: 'Sranan Tongo', srp: 'Serbian', srr: 'Serer', ssw: 'Swati', suk: 'Sukuma', sun: 'Sundanese',
							sus: 'Susu', sva: 'Svan', swa: 'Swahili', swc: 'Swahili', swe: 'Swedish', swh: 'Swahili',
							syr: 'Syriac', tah: 'Tahitian', tam: 'Tamil', tat: 'Tatar', tel: 'Telugu', tem: 'Timne',
							ter: 'Tereno', tet: 'Tetum', tgk: 'Tajik', tgl: 'Tagalog', tha: 'Thai', tig: 'Tigre', tir: 'Tigrinya',
							tiv: 'Tiv', tkl: 'Tokelau', tlh: 'Klingon', tli: 'Tlingit', tmh: 'Tamashek', tmr: 'Jewish Babylonian Aramaic (ca. 200-1200 CE)',
							tog: 'Tonga (Nyasa)', tok: 'Toki Pona', ton: 'Tonga (Tonga Islands)', tpi: 'Tok Pisin',
							tsi: 'Tsimshian', tsn: 'Tswana', tso: 'Tsonga', tuk: 'Turkmen', tum: 'Tumbuka', tur: 'Turkish',
							tvl: 'Tuvalu', twi: 'Twi', tyv: 'Tuvinian', udm: 'Udmurt', ukr: 'Ukrainian', umb: 'Umbundu',
							urd: 'Urdu', uzb: 'Uzbek', vai: 'Vai', ven: 'Venda', vep: 'Veps', vie: 'Vietnamese', vkt: 'Malay',
							vol: 'Volapük', vot: 'Votic', vro: 'Võro', wae: 'Walser', wal: 'Wolaitta', war: 'Waray', was: 'Washo',
							wbp: 'Warlpiri', wln: 'Walloon', wol: 'Wolof', wrz: 'Waray', wyn: 'Wyandot', xal: 'Kalmyk',
							xce: 'Celtiberian', xho: 'Xhosa', xlu: 'Cuneiform Luwian', xmm: 'Malay', xug: 'Kunigami', yao: 'Yao',
							yap: 'Yapese', yid: 'Yiddish', yor: 'Yoruba', yox: 'Yoron', yrl: 'Nhengatu', yua: 'Yucateco',
							yue: 'Yue Chinese', zap: 'Zapotec', zen: 'Zenaga', zha: 'Zhuang', zho: 'Chinese', zlm: 'Malay',
							zmi: 'Malay', zsm: 'Malay', zul: 'Zulu', zun: 'Zuni',
						}[formData.get('language')]) || mbEditObjects?.languageIds?.get(formData.get('language_en'), true);
						if (languageId > 0) releaseEdits.language_id = languageId;
					}
					if (params.updateMetadata && (params.overwrite || !mbRelease['text-representation']?.script)) {
						const scriptId = mbEditObjects?.scriptIds?.get({
							Arab: 'Arabic', Armn: 'Armenian', Bali: 'Balinese', Beng: 'Bengali', Bopo: 'Bopomofo',
							Brai: 'Braille', Bugi: 'Buginese', Buhd: 'Buhid', Cans: 'Canadian Syllabics', Cari: 'Carian',
							Cham: 'Cham', Cher: 'Cherokee', Copt: 'Coptic', Cprt: 'Cypriot', Cyrl: 'Cyrillic',
							Deva: 'Devanagari', Dsrt: 'Deseret', Egyp: 'Egyptian hieroglyphs', Ethi: 'Ethiopic',
							Geok: 'Khutsuri', Geor: 'Georgian', Glag: 'Glagolitic', Goth: 'Gothic', Grek: 'Greek',
							Gujr: 'Gujarati', Guru: 'Gurmukhi', Hang: 'Hangul', Hani: 'Han (Hanzi, Kanji, Hanja)',
							Hano: 'Hanunoo', Hans: 'Han (Simplified variant)', Hant: 'Han (Traditional variant)',
							Hebr: 'Hebrew', Hira: 'Hiragana', Hrkt: 'Japanese syllabaries', Ital: 'Old Italic',
							Jpan: 'Japanese', Kali: 'Kayah Li', Kana: 'Katakana', Khar: 'Kharoshthi', Khmr: 'Khmer',
							Knda: 'Kannada', Kore: 'Korean', Laoo: 'Lao', Latn: 'Latin', Lepc: 'Lepcha', Limb: 'Limbu',
							Linb: 'Linear B', Lyci: 'Lycian', Lydi: 'Lydian', Mlym: 'Malayalam', Mong: 'Mongolian',
							Mymr: 'Myanmar', Nkoo: 'N\'ko', Ogam: 'Ogham', Olck: 'Ol Chiki', Orkh: 'Old Turkic', Orya: 'Oriya',
							Osma: 'Osmanya', Phag: 'Phags-pa', Phnx: 'Phoenician', Rjng: 'Rejang', Runr: 'Runic',
							Saur: 'Saurashtra', Shaw: 'Shavian', Sinh: 'Sinhala', Sund: 'Sundanese', Sylo: 'Syloti Nagri',
							Syrc: 'Syriac', Tagb: 'Tagbanwa', Tale: 'Tai Le', Talu: 'New Tai Lue', Taml: 'Tamil', Telu: 'Telugu',
							Tfng: 'Tifinagh', Tglg: 'Tagalog', Thaa: 'Thaana', Thai: 'Thai', Tibt: 'Tibetan', Ugar: 'Ugaritic',
							Vaii: 'Vai', Xpeo: 'Old Persian', Xsux: 'Cuneiform, Sumero-Akkadian', Yiii: 'Yi',
							Zmth: 'Mathematical notation', Zsym: 'Symbols',
						}[formData.get('script')], true);
						if (scriptId > 0) releaseEdits.script_id = scriptId;
					}
					if (params.updateMetadata) {
						const dateParts = ['year', 'month', 'day'];
						let events = mbEditObjects?.sourceEntity?.events || [ ], updateEvents = false;
						events = params.overwrite || events.length <= 0 ? { } : Object.assign.apply(this, events.map(event => ({ [event.country?.country_code?.toUpperCase() || '']: {
							countryId: event.country?.id,
							date: dateParts.map(prop => parseInt(event.date?.[prop]) || undefined),
						} })));
						const hasDate = country => Array.isArray(events[country]?.date) && events[country].date[0] > 0;
						const countries = Object.keys(events);
						for (let index = 0; ['country', 'date.year'].some(suffix => formData.has(`events.${index}.${suffix}`)); ++index) {
							const country = formData.get(`events.${index}.country`) || '';
							const date = dateParts.map(unit => (unit = formData.get(`events.${index}.date.${unit}`))
								&& (unit = parseInt(unit)) > 0 ? unit : undefined);
							if (!events[country]) {
								events[country] = { date: date };
								updateEvents = true;
							}
							for (let index = 0; index < 3; ++index) if (!(date[index] > 0)) break;
								else if (params.overwrite || !(events[country].date[index] > 0)) {
									if (events[country].date[index] != date[index]) updateEvents = true;
									events[country].date[index] = date[index];
								} else if (events[country].date[index] != date[index]) break;
						}
						for (let country of ['', 'XW']) if (events[country]) {
							const countries = Object.keys(events).filter(key => key != country);
							if (countries.length <= 0) continue;
							if (hasDate(country) && !countries.some(hasDate))
								countries.forEach(key => { events[key].date = events[country].date });
							delete events[country];
							updateEvents = true;
						}
						if (Object.keys(events).length <= 0) updateEvents = false;
						else if (Object.keys(events).length != countries.length
								|| !Object.keys(events).every(country => countries.includes(country)))
							updateEvents = true;
						if (updateEvents) releaseEdits.events = Promise.all(Object.keys(events).sort(function(a, b) {
							if (hasDate(a) && !hasDate(b)) return -1; else if (hasDate(b) && !hasDate(a)) return 1;
							if (a && !b) return -1; else if (b && !a) return 1;
							return 0;
						}).map(country => (function findCountryId(country) {
							if (!country) return Promise.resolve(null);
							if (events[country].countryId > 0) return Promise.resolve(events[country].countryId);
							return mbApiRequest('area', { query: `iso1:${encodeQuotes(country)}` }).then(function({areas}) {
								function findId(callback) {
									const countryIds = areas.map(callback).filter(Boolean);
									if (countryIds.length == 1) return countryIds[0];
								}

								areas = areas.filter(function(area) {
									if (area.type && area.type != 'Country') return false;
									const isoCodes = area['iso-3166-1-codes'];
									return !isoCodes || isoCodes.some(isoCode => isoCode.toUpperCase() == country.toUpperCase());
								});
								return findId(area => mbEditObjects?.countryIds?.get(area.name)) || findId(function(area) {
									if (!area.aliases) return;
									const ids = area.aliases.map(alias => mbEditObjects?.countryIds?.get(alias.name)).filter(Boolean);
									if (ids.length == 1) return ids[0];
								}) || findId(area => mbEditObjects?.countryIds?.get(area.name, true))
									|| Promise.reject(`Country/reegion id for ${country} not found`);
							});
						})(country).then(countryId => ({
							country_id: countryId,
							date: Object.assign.apply(this, dateParts.map((prop, index) =>
								({ [prop]: events[country].date[index] || null }))),
						}))));
					}
					if (params.updateMetadata) {
						const labels = mbEditObjects?.sourceEntity?.labels || [ ], matchedLabels = new Set;
						const props = ['name', 'mbid', 'catalog_number'];
						for (let index = 0; props.some(prop => formData.has(`labels.${index}.${prop}`)); ++index) {
							const [name, mbid, catalogNumber] = props.map(prop => formData.get(`labels.${index}.${prop}`));
							console.assert(mbid);
							if (!mbid) continue;
							const safeString = str => (str || '').toLowerCase();
							const findLabel = strict => labels.find(labelInfo => labelInfo
								&& (strict || !matchedLabels.has(labelInfo))
								&& ((strict ? !labelInfo.label && !mbid : !labelInfo.label || !mbid)
									|| safeString(labelInfo.label?.gid) == safeString(mbid))
								&& ((strict ? !labelInfo.catalogNumber && !catalogNumber : !labelInfo.catalogNumber || !catalogNumber)
									|| (params.overwrite ? safeString(labelInfo.catalogNumber) == safeString(catalogNumber)
										: sameStringValues(labelInfo.catalogNumber, catalogNumber))));
							let label = findLabel(true);
							if (!label) edits.push(Object.assign((label = findLabel(false)) && label.id > 0 ? {
								edit_type: 37,
								release_label: label.id,
							} : {
								edit_type: 34,
								release: mbRelease.id,
							}, {
								label: mbid || !params.overwrite && label?.label?.gid || null,
								catalog_number: catalogNumber || !params.overwrite && label?.catalogNumber || null,
							}));
							if (label) matchedLabels.add(label);
						}
						const unmatchedLabels = labels.filter(labelInfo => !matchedLabels.has(labelInfo) && labelInfo.id > 0);
						if (params.overwrite && unmatchedLabels.length > 0) Array.prototype.push.apply(edits, unmatchedLabels.map(labelInfo => ({
							edit_type: 36,
							release_label: labelInfo.id,
						})));
					}
					if (params.updateMetadata && (params.overwrite || !mbRelease.barcode)) {
						let barcode = formData.get('barcode');
						if (barcode && (barcode = checkBarcode(barcode, true))) releaseEdits.barcode = barcode;
					}
					if (params.updateMetadata && (params.overwrite || !mbRelease.disambiguation)) {
						const comment = formData.get('comment');
						if (comment) releaseEdits.comment = comment;
					}
					if (params.updateMetadata && Object.keys(releaseEdits).length > 0) {
						let workers = Object.keys(releaseEdits).filter(editProp => releaseEdits[editProp] instanceof Promise);
						workers = workers.map(editProp => releaseEdits[editProp].then(resolved => releaseEdits[editProp] = resolved, function(reason) {
							delete releaseEdits[editProp];
							console.warn('releaseEdits.%s unsresolved for the reason ', editProp, reason);
							return null;
						}));
						edits.push(Promise.all(workers).then(resolved => Object.keys(releaseEdits).length > 0 ? Object.assign(releaseEdits, {
							edit_type: 32,
							to_edit: mbRelease.id,
						}) : null));
					}
					if (params.updateMetadata && (params.overwrite || !mbRelease.annotation) && formData.get('annotation')) edits.push({
						edit_type: 35,
						entity: mbRelease.id,
						text: formData.get('annotation'),
					});
					const trackWorks = new Map, assignedWorks = new Set, reusedWorks = new Map, thisRunPendingWorks = new Set;
					const workLevel = (function guessWorkLevel() {
						const equal = (wc1, wc2) => wc1 && wc2 && ['mbid', 'linkTypeId', 'mediumIndex', 'trackIndex']
							.every(prop => wc1[prop] == wc2[prop]);
						const workCredits = { };
						forEachRelation(function(relation) {
							if (relation.level != 'work') return;
							const ndx = `${relation.mediumIndex}|${relation.trackIndex}`;
							if (!(ndx in workCredits)) workCredits[ndx] = [ ];
							const workCredit = {
								mbid: relation.target,
								linkTypeId: relation.linkTypeId,
								mediumIndex: relation.mediumIndex,
								trackIndex: relation.trackIndex,
							};
							if (!workCredits[ndx].some(workCredit2 => equal(workCredit2, workCredit))) workCredits[ndx].push(workCredit);
						});
						if (Object.keys(workCredits).length > 0) return Object.keys(workCredits).every(index1 =>
							Object.keys(workCredits).every(index2 => index2 == index1 || workCredits[index1].every(workCredit1 =>
								workCredits[index2].some(workCredit2 => equal(workCredit2, workCredit1))))) ? 'release' : 'recording';
					})();
					const releaseWork = workLevel == 'release' ? (function(root) {
						if (!(root instanceof Object)) return Promise.reject('Invalid root');
						const findWorkType = (secondaryType, typeId) => typeId > 0
							&& root?.['release-group']?.['secondary-types']?.includes(secondaryType) ? typeId : undefined;
						let typeId = findWorkType('Soundtrack', 22) || findWorkType('Audio drama', 25);
						if (!typeId || !(typeId = ({
							1: 'Aria', 2: 'Ballet', 3: 'Cantata', 4: 'Concerto', 5: 'Sonata',
							6: 'Suite', 7: 'Madrigal', 8: 'Mass', 9: 'Motet', 10: 'Opera',
							11: 'Oratorio', 12: 'Overture', 13: 'Partita', 14: 'Quartet', 15: 'Song-cycle',
							16: 'Symphony', 17: 'Song', 18: 'Symphonic poem', 19: 'Zarzuela', 20: 'Étude',
							21: 'Poem', 22: 'Soundtrack', 23: 'Prose', 24: 'Operetta', 25: 'Audio drama',
							26: 'Beijing opera', 28: 'Play', 29: 'Musical', 30: 'Incidental music',
						}[typeId]))) return Promise.reject('Undetermined release work type');
						if (typeId == 'Song') return Promise.reject('Invalid release work type');
						console.assert(root instanceof Object, root);
						if (!root.title) return Promise.reject('Work name is missing');
						const title = bracketsStripper(root.title,
							[/\b(?:original)\b/.source, phrases.feat].join('|'),
							[
								'live', 'instrumental', 'acoustic', 'acappella', 'soundtrack',
								'mono', 'stereo', 'multichannel', 'demo', 'rehearsal',
							].map(cls => phrases[cls]).concat(/\b(?:sessions?)\b/.source).join('|'),
							[/\b(?:version|rework)\b/.source].join('|'),
						);
						return mbApiRequest('work', { query: [
							['work', 'alias'].map(field => `${field}:"${encodeQuotes(title)}"`).join(' OR '),
							`type:"${typeId}"`,
						].map(phrase => '(' + phrase + ')').join(' AND ') }).then(function({works}) {
							let work = works.filter(work => sameTitleMapper(work, title));
							if (work.length <= 0) work = works.filter(work => work.score >= 100);
							if (work.length <= 0) return Promise.reject('Not found');
							if (work.length > 1) return Promise.reject('Work unresolvable (ambiguity)');
							return (work = work[0]).relations ? work : mbApiRequest('work/' + work.id, { inc: 'work-rels' })
								.catch(reason => (console.warn(reason), work));
						});
					})(mbRelease) : undefined;
					const getWorks = track => (((track || { }).recording || { }).relations || [ ])
						.filter(relation => relation.type == 'performance' && relation.work instanceof Object)
						.map(relation => relation.work);
					forEachRelation(function(relation) {
						function createEdit(entity) {
							const edit = {
								edit_type: 90,
								linkTypeID: relation.linkTypeId,
								entities: [{ entityType: relation.targetType, gid: relation.target/*, name: relation.name*/ }],
								attributes: relation.attributes && relation.attributes.length > 0 ? relation.attributes.map(function(attribute) {
									const _attribute = { type: { gid: attribute.id } };
									if (attribute.creditedAs) _attribute.credited_as = attribute.creditedAs;
									if (attribute.value) _attribute.text_value = attribute.value;
									return _attribute;
								}) : null,
							};
							edit.entities[relation.backward ? 'unshift' : 'push'](entity);
							if (relation.creditedAs && ['release'].includes(relation.level)) {
								function _useANV(entry) {
									console.assert(entry instanceof Object);
									if (!(entry instanceof Object) || useANV(relation.creditedAs, entry.name))
										edit[`entity${relation.backward ? 1 : 0}_credit`] = relation.creditedAs;
									return edit;
								}
								return mbApiRequest(relation.targetType + '/' + relation.target).then(_useANV, function(reason) {
									console.warn(reason);
									return _useANV(relation);
								});
							}
							return edit;
						}
						function getRelationsOfType(relations, linkTypeId = relation.linkTypeId, attributes = relation.attributes) {
							const level = findRelationLevel(linkTypeId);
							console.assert(level, linkTypeId);
							if (!level) return false;
							const entity = Object.keys(mbRelationsIndex[level])
								.find(entity => linkTypeId in mbRelationsIndex[level][entity]);
							console.assert(entity, level, linkTypeId);
							const linkType = mbRelationsIndex[level][entity][linkTypeId];
							console.assert(linkType, level, entity, linkTypeId);
							return (relations || [ ]).filter(function(relation) {
								const hasType = (...types) => types.includes(relation.type);
								switch (linkType) {
									case 'writer': return hasType('writer', 'composer', 'lyricist', 'librettist');
									case 'composer': return hasType('writer', 'composer');
									case 'lyricist': case 'librettist': return hasType('writer', 'lyricist', 'librettist');
									case 'performer': return hasType('performer', 'instrument', 'vocal');
									case 'publishing': case 'published': if (hasType('publishing', 'published')) break; else return false;
									default: if (!hasType(linkType)) return false;
								}
								switch (linkType) {
									case 'vocal':
										if ((relation.attributes || [ ]).length <= 0 && (attributes || [ ]).length > 0
												&& attributes.every(attribute => attribute.id == 'd92884b7-ee0c-46d5-96f3-918196ba8c5b'))
											return true;
										break;
								}
								return !attributes || attributes.every(function(attribute) {
									console.assert(attribute.id);
									if ([
										'additional', 'assistant', 'associate', 'co', 'executive',
										'guest', 'pre', 'solo', 'sub', 'translator',
									].some(prop => mbAttrIds[prop] == attribute.id)) return true;
									if (!relation.attributes) return false;
									const type = relation.attributes.find(type =>
										relation?.['attribute-ids']?.[type] == attribute.id);
									if (!type) return false; else if (!attribute.value) return true;
									const value = relation?.['attribute-values']?.[type];
									return value && (value == attribute.value || value.toString().toLowerCase()
										== attribute.value.toString().toLowerCase());
								});
							});
						}
						function relationToEntity(mbRelation) {
							if (!(mbRelation[relation.targetType] instanceof Object)) return false;
							console.assert(mbRelation[relation.targetType].id, mbRelation[relation.targetType]);
							if (mbRelation[relation.targetType].id == relation.target) return true;
							if (relation.targetType == 'artist' && mbRelation[relation.targetType].relations
									&& mbRelation[relation.targetType].relations.some(mbRelation =>
										mbRelation[relation.targetType] instanceof Object && mbRelation.type == 'is person'
										&& mbRelation[relation.targetType].id == relation.target)) return true;
							if (relation.targetType == 'artist' && [
								mb.spa.VA, mb.spa.noArtist, /*mb.spa.unknown, */mb.spa.anonymous, mb.spa.traditional,
								mb.spa.dialogue, mb.spa.data, mb.spa.disney, mb.spa.theatre, mb.spa.churchChimes,
								mb.spa.languageInstruction,
							].includes(mbRelation[relation.targetType].id)) return true;
							return false;
						}

						const getRelationsOfTargetType = (relations, targetType = relation.targetType) =>
							(relations || [ ]).filter(mbRelation => mbRelation[targetType] instanceof Object);
						const hasTargetTypeRels = entity => getRelationsOfTargetType((entity || { }).relations).length > 0;
						const hasTargetIdRels = entity => ((entity || { }).relations || [ ]).some(relationToEntity);
						const hasRelationOfType = (entity, distinctAttributes = true) =>
							getRelationsOfType(((entity || { }).relations || [ ]), undefined,
								distinctAttributes ? relation.attributes : null).length > 0;
						const hasRelation = entity => getRelationsOfType(((entity || { }).relations || [ ]).filter(relationToEntity)).length > 0;
						const canTouchEntity = entity => (params.touchEntityWithTargetId || !hasTargetIdRels(entity))
							&& (params.touchEntityWithLinkType >= 2 || !hasRelationOfType(entity, params.touchEntityWithLinkType >= 1));
						const canTouchTrackEntity = entity => (params.touchTrackWithRels || !hasTargetTypeRels(entity)) && canTouchEntity(entity);
						const relationOnTrack = track => hasRelation(track.recording) || getWorks(track).some(hasRelation);
						const conflictWithTracks = () => Boolean(mbRelease?.media?.some(medium => medium?.tracks?.some(function(track) {
							if (params.touchReleaseWithRelsOnTracks > 2) return false;
							if (relationOnTrack(track)) return true;
							if (params.touchReleaseWithRelsOnTracks > 1) return false;
							if (!canTouchTrackEntity(track.recording) || !getWorks(track).every(canTouchTrackEntity)) return true;
							if (params.touchReleaseWithRelsOnTracks > 0) return false;
							const relFilter = relation => relation.type != 'performance';
							return track.recording.relations.some(relFilter)
								|| getWorks(track).some(work => work.relations.some(relFilter));
						})));
						switch (relation.level) {
							case 'recording': case 'work':
								if (mbRelease.media) mbRelease.media.forEach(function(medium, mediumIndex) {
									if (!('mediumIndex' in relation) || relation.mediumIndex == mediumIndex) medium.tracks.forEach(function(track, trackIndex) {
										console.assert(track.recording, track);
										if (track.recording && (!('trackIndex' in relation) || relation.trackIndex == trackIndex) && !relationOnTrack(track)) switch (relation.level) {
											case 'recording':
												if (canTouchTrackEntity(track.recording))
													edits.push(createEdit({ entityType: relation.level, gid: track.recording.id }));
												break;
											case 'work': {
												let trackWork = getWorks(track);
												if (trackWork.length > 0) {
													if (trackWork.every(canTouchTrackEntity)) for (let work of trackWork)
														edits.push(createEdit({ entityType: relation.level, gid: work.id }));
													break;
												} else trackWork = relation.targetType == 'artist' ? (function workResolver(root) {
													console.assert(root instanceof Object, root);
													if (trackWorks.has(root.id)) return trackWorks.get(root.id);
													if (!root.title) return Promise.reject('Work name is missing');
													const title = trackTitleNorm(root.title), arids = new Set([relation.target]);
													if (/^Medley(?::\s+|\s+-\s+|\s+(?:\(.+\))$)/i.test(title)) return Promise.reject('Medley');
													forEachRelation(function(relation) {
														if (relation.targetType != 'artist' || relation.level != 'work') return;
														if ('mediumIndex' in relation && relation.mediumIndex != mediumIndex) return;
														if ('trackIndex' in relation && relation.trackIndex != trackIndex) return;
														arids.add(relation.target);
													});
													let workResolver = mbApiRequest('work', { query: [
														['work', 'alias'].map(field => `${field}:"${encodeQuotes(title)}"`).join(' OR '),
														Array.from(arids, arid => `arid:${arid}`).join(' OR '),
														'type:song OR (NOT type:*)',
													].map(term => `(${term})`).join(' AND ') }).then(function({works}) {
														let work = works.filter(work => sameTitleMapper(work, title) && hasRelation(work));
														if (work.length <= 0) work = works.filter(work => work.score >= 100);
														if (work.length <= 0) return Promise.reject('Not found');
														if (work.length > 1) return Promise.reject('Work unresolvable (ambiguity)');
														work = (work = work[0]).relations ? Promise.resolve(work) : mbApiRequest('work/' + work.id,
															{ inc: 'artist-rels+label-rels+series-rels+place-rels+recording-rels+tags' })
															.catch(reason => (console.warn(reason), work));
														return work.then(work => (reusedWorks.set(work.id, work), work.id));
													});
													if (params.createMissingWorks) workResolver = workResolver.catch(function(reason) {
														if (reason != 'Not found') return Promise.reject(reason);
														const edit = { edit_type: 41, type_id: 17, name: title, comment: '' };
														editNote = ['Auto-created'];
														if (sourceRef) editNote.push('from metadata of ' + sourceRef);
														if (scriptSignature) editNote.push('by ' + scriptSignature);
														return mbCreateEdit([edit], [
															editNote.join(' '),
															`Related recording id ${track.recording.id} (${[mbOrigin, 'recording', track.recording.id].join('/')})`,
															`Related release id ${mbRelease.id} (${[mbOrigin, 'release', mbRelease.id].join('/')})`,
														].join('\n'), !(params.createMissingWorks >= 2)).then(function([edit]) {
															console.assert(edit);
															if (edit.response != 1) return Promise.reject('Work create returns error response code ' + edit.response);
															notify(`Work <b>${title}</b> successfully created`, 'entitycreated');
															console.info('Work', title, 'successfully created (', edit.entity, ')');
															thisRunPendingWorks.add(edit.entity.gid);
															if (!pendingWorks.includes(edit.entity.gid)) {
																pendingWorks.push(edit.entity.gid);
																sessionStorage.setItem('pendingMBWorks', JSON.stringify(pendingWorks));
															}
															return edit.entity.gid;
														});
													});
													trackWorks.set(root.id, workResolver);
													return workResolver;
												})(track.recording) : Promise.reject('Work not searchable');
												edits.push(trackWork.then(function(workId) { // recording <= work relation
													function testForAttribute(rx) {
														if ([track.recording.title, track.title, mbRelease.title]
																.some(RegExp.prototype.test.bind(new RegExp(rxBracketsMatcher(['()', '[]'], 0b11, rx), 'i'))))
															return true;
														if (new RegExp(rx, 'i').test(track.recording.comment)) return true;
														return false;
													}

													if (assignedWorks.has(track.recording.id)) return Promise.reject('Work already assigned');
													assignedWorks.add(track.recording.id);
													const attributes = [ ];
													if (mbRelease?.['release-group']?.['secondary-types']?.includes('Live')
															|| testForAttribute(phrases.live)) attributes.push(mbAttrIds.live);
													if (testForAttribute(phrases.instrumental)) attributes.push(mbAttrIds.instrumental);
													if (testForAttribute(phrases.acappella)) attributes.push(mbAttrIds.acappella);
													if (testForAttribute(phrases.karaoke)) attributes.push(mbAttrIds.karaoke);
													return {
														edit_type: 90,
														linkTypeID: 278,
														entities: [
															{ entityType: 'recording', gid: track.recording.id },
															{ entityType: 'work', gid: workId },
														],
														attributes: attributes.length > 0 ?
															attributes.map(attributeId => ({ type: { gid: attributeId } })) : null,
													};
												}).catch(reason => null));
												edits.push(trackWork.then(function(workId) { // work <= artist relation
													const reusedWork = reusedWorks.get(workId);
													return !reusedWork || canTouchTrackEntity(reusedWork) && !hasRelation(reusedWork) ?
														createEdit({ entityType: relation.level, gid: workId }) : Promise.reject('Relation condition not met');
												}).catch(reason => null));
												if (releaseWork) edits.push(Promise.all([releaseWork, trackWork]).then(function([releaseWork, trackWorkId]) {
													console.assert(releaseWork instanceof Object, releaseWork);
													// if (params.importTagsToWorks > 0
													// 		&& (params.importTagsToWorks > 1 || !(releaseWork.tags?.length > 0)))
													// 	addTags('work', releaseWork);
													console.assert(trackWorkId, trackWorkId);
													if (!releaseWork || !trackWorkId) throw 'Assertion failed: either work not resolved';
													if (reusedWorks.has(trackWorkId)) return Promise.reject('Existing works will not be touched');
													if (releaseWork.relations && releaseWork.relations.some(relation => relation.type == 'parts'
															&& relation.work instanceof Object && relation.work.id == trackWorkId))
														return Promise.reject('Works are already related');
													return {
														edit_type: 90,
														linkTypeID: 281,
														entities: [
															{ entityType: 'work', gid: releaseWork.id },
															{ entityType: 'work', gid: trackWorkId },
														],
													};
												}).catch(reason => null));
												if (params.importTagsToWorks > 0) trackWork.then(function(workId) {
													let work = reusedWorks.get(workId);
													work = work ? Promise.resolve(work) : mbApiRequest('work/' + workId, { inc: 'tags' });
													work.then(function(work) {
														if (params.importTagsToWorks > 1 || !(work.tags?.length > 0)) addTags('work', work);
													});
												});
												break;
											}
										}
									});
								});
								break;
							case 'release':
								if ((params.touchReleaseWithRels || !hasTargetTypeRels(mbRelease))
										&& canTouchEntity(mbRelease)
										&& !hasRelation(mbRelease) && !hasRelation(mbRelease['release-group'])
										&& !conflictWithTracks())
									edits.push(createEdit({ entityType: 'release', gid: mbRelease.id }));
								break;
							case 'release-group':
								console.assert(mbRelease['release-group'] && mbRelease['release-group'].id, mbRelease);
								if ((params.touchReleaseWithRels || !hasTargetTypeRels(mbRelease['release-group']))
										&& canTouchEntity(mbRelease['release-group'])
										&& !hasRelation(mbRelease['release-group']) && !hasRelation(mbRelease)
										&& !conflictWithTracks())
									edits.push(createEdit({ entityType: 'release_group', gid: mbRelease['release-group'].id }));
								break;
							default:
								console.warn('Assertion failed, unexpected source entity type:', relation.level, relation);
						}
					});
					for (let index = 0; formData.has(`urls.${index}.url`); ++index) {
						const url = formData.get(`urls.${index}.url`);
						const linkTypeId = parseInt(formData.get(`urls.${index}.link_type`));
						if (!url || !(linkTypeId > 0) || linkTypeId == 284 && !params.updateMetadata) continue;
						const relationLevel = findRelationLevel(linkTypeId);
						console.assert(relationLevel, linkTypeId);
						if (!relationLevel) continue;
						const entity = ({ 'release': mbRelease, 'release-group': mbRelease['release-group'] }[relationLevel]);
						if (!entity.relations || !entity.relations.some(function(relation) {
							if (relation['target-type'] == 'url') try {
								const urls = [url, relation.url.resource].map(url => new URL(url));
								return ['hostname', 'pathname'].every(prop => urls[0][prop] == urls[1][prop]);
							} catch(e) { console.warn(e) }
							return false;
						})) edits.push({
							edit_type: 90,
							linkTypeID: linkTypeId,
							entities: [
								{ entityType: relationLevel.replace(/-/g, '_'), gid: entity.id },
								{ entityType: 'url', name: url },
							],
						});
					}
					if (mbRelease.media) for (let medium of mbRelease.media) if (medium.tracks) for (let track of medium.tracks) {
						if (params.importTagsToWorks > 0) getWorks(track).forEach(function(work) {
							if (params.importTagsToWorks > 1 || !(work.tags?.length > 0)) addTags('work', work);
						});
						if (params.importTagsToRecordings > 0
								&& (params.importTagsToRecordings > 1 || !(track.recording.tags?.length > 0)))
							addTags('recording', track.recording);
					}
					if (params.importTagsToRelease > 0
							&& (params.importTagsToRelease > 1 || !(mbRelease.tags?.length > 0)))
						addTags('release', mbRelease);
					if (params.importTagsToRG > 0
							&& (params.importTagsToRG > 1 || !(mbRelease['release-group'].tags?.length > 0)))
						addTags('release-group', mbRelease['release-group']);
					return edits.length > 0 ? Promise.all(edits).then(function(edits) {
						if ((edits = edits.filter(Boolean)).length <= 0) return null;
						if (debugLogging) {
							console.debug('Resolved edits:', edits);
							const uniqueEdits = edits.filter((edit1, index, edits) =>
								edits.findIndex(edit2 => objectsEqual(edit1, edit2)) == index);
							console.assert(uniqueEdits.length == edits.length, edits);
							if (uniqueEdits.length < edits.length)
								alert('Edit objects have duplicates, for details see browser console');
						}
						if (params.simulationMode) return null; else editNote = ['Release updated'];
						if (sourceRef) editNote.push('from metadata of ' + sourceRef);
						if (scriptSignature) editNote.push('by ' + scriptSignature);
						editNote = editNote.length > 0 ? editNote.join(' ') : undefined;
						if ((params.target instanceof HTMLElement && params.target.hold || BindingsCacheEditor.lastOpened >= timestamp)
								&& !confirm('Hold flag is active, confirm updating release with current mappings')) return null;
						return (function mbSubmitBatch(offset = 0) {
							const batch = edits.slice(offset, offset + batchSize);
							return mbCreateEdit(batch, editNote, params.makeVotable).then(function(results) {
								console.assert(results.length == batch.length, 'CreateEdit returns mismatching results set (%d != %d)', results.length, batch.length);
								return offset + batch.length >= edits.length ? results
									: mbSubmitBatch(offset + batch.length).then(Array.prototype.concat.bind(results));
							});
						})().then(function(edits) {
							if (thisRunPendingWorks.size > 0) {
								pendingWorks = pendingWorks.filter(workId => !thisRunPendingWorks.has(workId));
								sessionStorage.setItem('pendingMBWorks', JSON.stringify(pendingWorks));
							}
							const allSuccess = edits.every(edit => edit.response == 1);
							console.log('Release %s edits %s:', mbRelease.id, (allSuccess ? 'successfull' : 'successfull (some rejected)'), edits);
							let message = 'Release edits successfull';
							if (!allSuccess) message += ' (some rejected)';
							notify(message, allSuccess ? 'editsuccess' : 'editpartialsuccess');
							return edits;
						});
					}) : null;
				});
			}
			function seedToMBIcon(callback, style, tooltip, tooltipster) {
				function seedToMB(evt, prompt, required, input) {
					if (!(evt instanceof Event)) throw new Error('Invalid argument');
					let target = evt.currentTarget;
					if (target instanceof HTMLElement) target.disabled = true; else target = null;
					const animation = target && flashElement(target);
					(async function(prompt, input) {
						let createEntitiesTT = 'Applies to artists, labels and series';
						if (!evt.ctrlKey) createEntitiesTT += ' (votable)';
						createEntitiesTT += '\nIgnored for AllMusic';
						if ((input = await promptEx('Seed new MusicBrainz release', prompt && prompt + ':', required, input, [
							['Import tracklist', true],
							['Align media with TOCs', false, 'Only meaningful for multivolume releases; when tracklist numbering is missing volume resolution, checking the option tries to detect volumes by aligning with TOCs (logs attached to torrent in sorted sequence required)\nIgnored for AllMusic'],
							['Compose annotation', GM_getValue('compose_annotation', true)],
							['Heuristic MBID lookup (slower)', GM_getValue('mbid_search_size', 30) > 0],
							['Autocreate missing entities when possible', GM_getValue('mb_create_entities', 1), createEntitiesTT],
							['Release group lookup', true],
							['Recordings lookup', 1, '[-] indeterminate state: auto detect'],
						], [
							['Make edits votable', !(mbSeedNew >= 2)],
							['Note upload reference', GM_getValue('insert_upload_reference', false), 'Includes torrent permalink into edit note to improve backward edition verification'],
							['Note media fingerprints', GM_getValue('mb_seed_with_fingerprints', false), 'Includes all media fingerprints into edit note'],
						])) == null) return; else if (!input.input) return callback(target);
						let param, id;
						if (id = discogsIdExtractor(input.input, 'release')) param = 'discogsId';
						else if (id = allMusicIdExtractor(input.input, 'release')) param = 'allMusicId';
						return param ? callback(target, {
							[param]: id, basicMetadata: true,
							tracklist: input[0][0], alignWithTOCs: input[0][1],
							composeAnnotation: input[0][2],
							searchSize: input[0][3] ? Math.max(GM_getValue('mbid_search_size'), 0) || 30 : 0,
							createMissingEntities: input[0][4] ? !input[1][0] && !evt.shiftKey ? 2 : 1 : 0,
							rgLookup: input[0][5],
							recordingsLookup: input[0][6],
							makeVotable: input[1][0],
							torrentReference: input[1][1],
							addMediaFingerprints: input[1][2],
						}) : (function() {
							if (id = mbIdExtractor(input.input, 'release-group')) return Promise.resolve(id);
							if (id = mbIdExtractor(input.input, 'release')) return mbApiRequest('release/' + id, { inc: 'release-groups' })
								.then(release => release['release-group'].id);
							return Promise.reject('Input doesnot contain valid ID/URL');
						})().then(releaseGroupId => callback(target, { releaseGroupId: releaseGroupId })/*, reason => callback(target)*/);
					})(prompt, input).catch(alert).then(function() {
						if (animation != null) animation.cancel();
						if (target != null) {
							target.disabled = false;
							target.style.filter = null;
							target.hold = false;
						}
					});
				}

				const staticIcon = minifyHTML(`
<svg height="0.9em" fill="#0a0" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
	<circle cx="50" cy="50" r="50"/>
	<polygon fill="white" clip-path="circle(30)" points="41.34,0 58.66,0 58.66,41.34 100,41.34 100,58.66 58.66,58.66 58.66,100 41.34,100 41.34,58.66 0,58.66 0,41.34 41.34,41.34"/>
</svg>`);
				let prompt = 'Discogs/AllMusic release';
				if (!style) prompt += ' / MusicBrainc release group';
				prompt += ' ID or URL';
				return addIcon(staticIcon, function clickHandler(evt) {
					seedToMB(evt, prompt + ' (optional)', false);
				}, function dropHandler(evt, url) {
					if (/^https?:\/\//i.test(url)) seedToMB(evt, prompt, true, url);
				}, 'seed-mb-release', style, tooltip, tooltipster);
			}

			if (target.disabled) return; else target.disabled = true;
			[target.textContent, target.style.color] = ['Looking up...', null];
			const animation = flashElement(target);
			const getMbTOCs = () => getSessionsFromTorrent(torrentId)
				.then(sessions => sessions.map(getTocAudioEntries).map(tocEntriesToMbTOC));
			const mbWikiEncoder = [/[\[\]\|]/g, m => `&#${m.charCodeAt()};`];
			const scriptSignature = GM_getValue('signed_edits', true) ? GM_info.script.name.replace(...mbWikiEncoder) +
				' browser script v' + GM_info.script.version + ' (https://greasyfork.org/scripts/459083)' : undefined;
			const mbAttachMode = Number(GM_getValue('mb_attach_toc', 2));
			const mbSubmitLog = GM_getValue('mb_submit_log', false);
			const mbSeedNew = Number(GM_getValue('mb_seed_release', 2));
			const mbUpdateRelease = Number(GM_getValue('mb_update_release', 1));
			const mbEntities = entity => entity && ({ 'series': 'serie' }[entity = entity.toLowerCase()] || entity) + 's';
			const getDiscogsRels = (entry, entity = 'release') => entry && Array.isArray(entry.relations) ?
				entry.relations.filter(relation => relation['target-type'] == 'url' && relation.type == 'discogs')
					.map(relation => discogsIdExtractor(relation.url.resource, entity))
						.filter((discogsId, index, discogsIds) => discogsId > 0 && discogsIds.indexOf(discogsId) == index) : [ ];
			const getAllMusicRels = (entry, entity = 'release') => entry && Array.isArray(entry.relations) ?
				entry.relations.filter(relation => relation['target-type'] == 'url' && relation.type == 'allmusic')
					.map(relation => allMusicIdExtractor(relation.url.resource, entity))
						.filter((allMusicId, index, allMusicIds) => allMusicId && allMusicIds.indexOf(allMusicId) == index) : [ ];
			const relationAdapter = relation => relation ? Object.assign({
				targetType: relation['target-type'],
				relationType: relation.type,
				attributes: relation?.attributes?.length > 0 ? relation.attributes : null,
			}, relation[relation['target-type']]) : null;
			const uniqueRelations = (target1, index, relations) => relations.findIndex(target2 => ['targetType', 'relationType', 'id']
				.every(prop => target2[prop] == target1[prop]) && sameArrays(target2.attributes, target1.attributes)) == index;
			const getArtistTracks = mbid => Promise.all([
				mbLookupById('recording', 'artist', mbid).then(recordings => recordings.map(recording => Object.assign({
					targetType: 'recording',
					relationType: 'track_artist',
				}, recording)), console.warn),
				mbApiRequest('artist/' + mbid, { inc: 'aliases+recording-rels+work-rels' }).then(({relations}) => relations.filter(function(relation) {
					switch (relation['target-type']) {
						case 'recording': return true;
						case 'work': return !relation.work.type || ['Song'].includes(relation.work.type);
						default: return false;
					}
				}).map(relationAdapter).filter(uniqueRelations)).catch(console.warn),
				// mbLookupById('work', 'artist', mbid, 'aliases', 'artist-rels').then(works => works.filter(work =>
				// 	!work.type || ['Song'].includes(work.type)).map(work =>
				// 		Object.assign({ targetType: 'work', relationType: work.relations.filter(relation =>
				// 			relation.artist.id == mbid).map(relation => relation.type) }, work)), console.warn),
			]).then(flattenResults);
			const normSeedTitle = title => title && [ ].reduce((str, subst) => str.replace(...subst), title);
			const untitleCase = [/\b(\p{Lu}\p{Ll}+)\b/gu, (...m) => m[1].toLowerCase()];
			const dateParser = date => date && (date = /^((?:19|20)\d{2})(?:-(\d{2})(?:-(\d{2}))?)?$/.exec(date)) != null ?
				date.slice(1).map(n => (n = parseInt(n)) > 0 ? n : undefined) : null;
			const mbRelationsIndex = Object.freeze({
				'release-group': {
					artist: {
						62: 'artists and repertoire', 63: 'creative direction', 65: 'tribute', 868: 'dedicated to',
						974: 'named after',
					},
					label: { 970: 'tribute' },
					series: { 742: 'part of', 888: 'tour in support of', 1007: 'recorded during' },
					url: {
						89: 'wikipedia', 90: 'discogs', 93: 'lyrics', 94: 'review', 96: 'other databases', 97: 'IMDb',
						284: 'allmusic', 287: 'official homepage', 353: 'wikidata', 853: 'BookBrainz', 907: 'crowdfunding',
						1169: 'discography entry', 1190: 'fanpage',
					},
				},
				'release': {
					artist: {
						18: 'art direction', 19: 'design/illustration', 20: 'photography', 22: 'legal representation',
						23: 'booking', 24: 'liner notes', 25: 'misc', 26: 'mix', 27: 'graphic design', 28: 'engineer',
						29: 'sound', 30: 'producer', 31: 'audio', 32: 'publishing', 36: 'recording', 37: 'programming',
						38: 'editor', 40: 'orchestrator', 41: 'instrument arranger', 42: 'mastering', 43: 'mix-DJ',
						44: 'instrument', 45: 'performing orchestra', 46: 'conductor', 47: 'remixer', 48: 'compiler',
						49: 'samples from artist', 51: 'performer', 53: 'chorus master', 54: 'writer', 55: 'composer',
						56: 'lyricist', 57: 'librettist', 60: 'vocal', 295: 'arranger', 296: 'vocal arranger',
						709: 'copyright', 710: 'phonographic copyright', 727: 'balance', 759: 'concertmaster',
						871: 'translator', 927: 'illustration', 928: 'design', 929: 'booklet editor', 969: 'lacquer cut',
						987: 'instrument technician', 993: 'artwork', 1010: 'licensor', 1012: 'field recordist',
						1179: 'transfer', 1185: 'video director', 1187: 'audio director', 1235: 'sound effects',
					},
					label: {
						349: 'rights society', 359: 'promoted', 360: 'manufactured', 361: 'distributed', 362: 'published',
						708: 'copyright', 711: 'phonographic copyright', 712: 'licensor', 833: 'licensee', 848: 'marketed',
						942: 'pressed', 947: 'mixed for', 948: 'arranged for', 951: 'produced for', 952: 'manufactured for',
						955: 'glass mastered', 985: 'printed', 999: 'misc', 1170: 'artwork', 1171: 'design',
						1172: 'graphic design', 1173: 'illustration', 1174: 'art direction', 1175: 'photography',
						1183: 'mastered for', 1253: 'edited for',
					},
					series: { 741: 'part of' },
					place: {
						695: 'recorded at', 696: 'mixed at', 697: 'mastered at', 812: 'engineered at', 820: 'edited at',
						824: 'produced at', 828: 'remixed at', 865: 'arranged at', 941: 'pressed at', 953: 'manufactured at',
						954: 'glass mastered at', 968: 'lacquer cut at', 1182: 'transferred at', 1246: 'written at',
						1247: 'translated at', 1248: 'revised at', 1249: 'libretto written at', 1250: 'lyrics written at',
						1251: 'composed at',
					},
					url: {
						74: 'purchase for download', 75: 'download for free', 76: 'discogs', 77: 'amazon asin',
						78: 'cover art link', 79: 'purchase for mail-order', 82: 'other databases', 83: 'IMDB samples',
						85: 'free streaming', 86: 'vgmdb', 288: 'discography entry', 301: 'license', 308: 'secondhandsongs',
						729: 'show notes', 755: 'allmusic', 850: 'BookBrainz', 906: 'crowdfunding', 980: 'streaming',
					},
				},
				'recording': {
					artist: {
						123: 'photography', 125: 'graphic design', 127: 'publishing', 128: 'recording', 129: 'misc',
						130: 'design/illustration', 132: 'programming', 133: 'sound', 134: 'booking',
						135: 'artists and repertoire', 136: 'mastering', 137: 'art direction', 138: 'engineer', 140: 'audio',
						141: 'producer', 142: 'legal representation', 143: 'mix', 144: 'editor', 146: 'creative direction',
						147: 'compiler', 148: 'instrument', 149: 'vocal', 150: 'performing orchestra', 151: 'conductor',
						152: 'chorus master', 153: 'remixer', 154: 'samples from artist', 155: 'mix-DJ', 156: 'performer',
						158: 'instrument arranger', 297: 'arranger', 298: 'vocal arranger', 300: 'orchestrator',
						726: 'balance', 760: 'concertmaster', 858: 'video appearance', 869: 'phonographic copyright',
						962: 'video director', 986: 'instrument technician', 1011: 'field recordist', 1186: 'audio director',
						1230: 'choreographer', 1236: 'sound effects', 1241: 'artwork', 1242: 'design', 1243: 'animation',
						1244: 'illustration', 1245: 'cinematographer',
					},
					label: {
						206: 'publishing', 867: 'phonographic copyright', 946: 'mixed for', 949: 'arranged for',
						950: 'produced for', 998: 'misc', 1178: 'remixed for', 1228: 'broadcast', 1252: 'edited for',
					},
					series: { 740: 'part of', 1006: 'recorded during' },
					place: {
						693: 'recorded at', 694: 'mixed at', 813: 'engineered at', 819: 'edited at', 825: 'produced at',
						829: 'remixed at', 866: 'arranged at', 963: 'video shot at',
					},
					url: {
						254: 'purchase for download', 255: 'download for free', 258: 'IMDB samples', 268: 'free streaming',
						285: 'allmusic', 302: 'license', 306: 'other databases', 905: 'crowdfunding', 976: 'secondhandsongs',
						979: 'streaming',
					},
				},
				'work': {
					artist: {
						161: 'publishing', 162: 'misc', 164: 'orchestrator', 165: 'lyricist', 167: 'writer', 168: 'composer',
						169: 'librettist', 282: 'instrument arranger', 293: 'arranger', 294: 'vocal arranger',
						834: 'previous attribution', 844: 'revised by', 846: 'dedication', 872: 'translator',
						889: 'commissioned', 917: 'reconstructed by', 956: 'premiere', 972: 'named after',
					},
					label: { 208: 'publishing', 890: 'commissioned', 922: 'dedication' },
					series: { 743: 'part of', 891: 'commissioned' },
					place: {
						716: 'premiere', 874: 'written at', 876: 'composed at', 878: 'lyrics written at',
						880: 'libretto written at', 882: 'revised at', 883: 'translated at', 886: 'arranged at',
						892: 'commissioned', 983: 'dedication',
					},
					url: {
						271: 'lyrics', 273: 'other databases', 274: 'download for free', 279: 'wikipedia',
						280: 'secondhandsongs', 286: 'allmusic', 289: 'songfacts', 312: 'VIAF', 351: 'wikidata', 843: 'IMDb',
						854: 'BookBrainz', 908: 'crowdfunding', 912: 'purchase for download', 913: 'purchase for mail-order',
						921: 'work list entry', 939: 'license', 971: 'discogs', 992: 'vgmdb', 1188: 'fanpage',
					},
				}
			}), mbAttrIds = Object.freeze({
				acappella: '4721e916-56c5-4e23-8828-33aedc7a8103',
				additional: '0a5341f8-3b1d-4f99-a0c6-26b7f4e42c7f',
				assistant: '8c4196b1-7053-4b16-921a-f22b2898ed44',
				associate: '8d23d2dd-13df-43ea-85a0-d7eb38dc32ec',
				co: 'ac6f6b4c-a4ec-4483-a04e-9f425a914573',
				cover: '1e8536bd-6eda-3822-8e78-1c0f4d3d2113',
				executive: 'e0039285-6667-4f94-80d6-aa6520c6d359',
				guest: 'b3045913-62ac-433e-9211-ac683cdf6b5c',
				instrument: '0abd7f04-5e28-425b-956f-94789d9bcbe2',
				instrumental: 'c031ed4f-c9bb-4394-8cf5-e8ce4db512ae',
				karaoke: '3d984f6e-bbe2-4620-9425-5f32e945b60d',
				live: '70007db6-a8bc-46d7-a770-80e6a0bb551a',
				medley: '37da3398-5d1b-4acb-be25-df95e33e423c',
				partial: 'd2b63be6-91ec-426a-987a-30b47f8aae2d',
				pre: '288b973a-26ea-4880-8eca-45af4b8e8665',
				solo: '63daa0d3-9b63-4434-acff-4977c07808ca',
				sub: '4521ce8e-3d24-4b64-9805-59df6f3a4740',
				task: '39867b3b-0f1e-40d5-b602-4f3936b7f486',
				translator: '25dfb08e-9b99-44db-b30c-1d6ec6747af8',
				vocal: 'd92884b7-ee0c-46d5-96f3-918196ba8c5b',
			}), mbAttrLinkTypes = Object.freeze({
				additional: ['art direction', 'design/illustration', 'photography', 'legal representation', 'liner notes', 'mix', 'graphic design', 'engineer', 'sound', 'producer', 'audio', 'recording', 'programming', 'editor', 'orchestrator', 'instrument arranger', 'mastering', 'instrument', 'performing orchestra', 'conductor', 'remixer', 'samples from artist', 'performer', 'chorus master', 'writer', 'composer', 'lyricist', 'librettist', 'vocal', 'creative direction', 'arranger', 'vocal arranger', 'balance', 'translator', 'illustration', 'design', 'artwork', 'transfer'],
				assistant: ['art direction', 'mix', 'engineer', 'sound', 'producer', 'audio', 'recording', 'programming', 'editor', 'mastering', 'conductor', 'remixer', 'chorus master', 'balance', 'design', 'video director', 'transfer', 'audio director'],
				associate: ['mix', 'engineer', 'sound', 'producer', 'audio', 'recording', 'programming', 'editor', 'instrument arranger', 'mastering', 'arranger', 'vocal arranger', 'balance', 'transfer'],
				co: ['mix', 'engineer', 'sound', 'producer', 'audio', 'recording', 'editor', 'instrument arranger', 'mastering', 'arranger', 'vocal arranger', 'balance', 'transfer'],
				executive: ['engineer', 'producer'],
				guest: ['instrument', 'performer', 'vocal', 'concertmaster'],
				instrument: ['mix', 'engineer', 'sound', 'producer', 'audio', 'recording', 'programming', 'editor', 'instrument arranger', 'instrument', 'conductor', 'samples from artist', 'balance', 'instrument technician'],
				pre: ['mastering'],
				solo: ['instrument', 'performer', 'vocal'],
				sub: ['published', 'publishing'],
				task: ['photography', 'misc', 'mix', 'engineer', 'producer', 'artists and repertoire', 'graphic design', 'design', 'artwork', 'animation', 'illustration'],
				translator: ['liner notes'],
				vocal: ['mix', 'engineer', 'sound', 'producer', 'audio', 'recording', 'editor', 'performer', 'conductor', 'samples from artist', 'vocal', 'vocal arranger', 'balance'],
			}), mbRelationsAliases = { publishing: 'published', published: 'publishing' };
			const mbExcludedTypeIds = [19, 123, 125, 127, 130, 136, 206, 968, 969, 1241, 1242, 1244];
			const fetchAllInstruments = () => GlobalXHR.get(dcOrigin + '/help/creditslist', { anonymous: true }).then(({document}) =>
				Array.prototype.filter.call(document.body.querySelectorAll('div#page_content table.table_block > tbody > tr'),
					tr => tr.cells[2].textContent.trim() == 'Instruments').map(tr => tr.cells[0].textContent.trim()).filter(instrument => ![
				'Guest', 'Performer', 'Soloist', 'Accompanied By', 'Orchestra', 'Ensemble',
				'Band', 'Backing Band', 'Brass Band', 'Concert Band', 'Rhythm Section',
			].includes(instrument)));
			const taskAttribute = task => task ? {
				id: mbAttrIds.task,
				value: task/*.replace(/(?:\s+by$)/ig, '')*/.replace(...untitleCase),
			} : null;
			const isTrackLevel = level => ['recording', 'work'].includes(level);
			const isReleaseLevel = level => ['release-group', 'release'].includes(level);
			const findRelationLevels = (entity, type) => Object.keys(mbRelationsIndex).filter(level =>
				entity in mbRelationsIndex[level] && (Object.values(mbRelationsIndex[level][entity]).includes(type)
					|| type in mbRelationsAliases && Object.values(mbRelationsIndex[level][entity]).includes(mbRelationsAliases[type])));
			const findRelationLevel = linkTypeId => linkTypeId > 0 && Object.keys(mbRelationsIndex).find(level =>
				Object.keys(mbRelationsIndex[level]).some(entity => linkTypeId in mbRelationsIndex[level][entity]));
			const mbMarkupBold = str => str && `'''${str}'''`; const mbMarkupItalics = str => str && `''${str}''`;
			const mbMarkupHead = (str, level = 1) => str && `${'='.repeat(level)} ${str} ${'='.repeat(level)}`;
			const useANV = (anv, name) => anv && (!name || anv.toLowerCase() != name.toLowerCase()
				|| anv != name && ['Low', 'Upp'].some(c => anv[`to${c}erCase`]() == anv));
			const attachToMB = (mbId, attended = false, skipPoll = false) => getMbTOCs().then(function(mbTOCs) {
				function attachByHand() {
					if (mbTOCs != null) for (let discNumber = mbTOCs.length; discNumber > 0; --discNumber) {
						if (mbTOCs[discNumber - 1] != null) url.setTOC(discNumber - 1); else continue;
						GM_openInTab(url.href, discNumber > 1);
					}
					return false;
				}

				if (!mbTOCs.some(Boolean)) return Promise.reject('No valid ToCs found');
				const url = new URL('/cdtoc/attach', mbOrigin), warnings = [ ];
				Object.defineProperty(url, 'setTOC', { value: function(index = 0) { this.searchParams.set('toc', mbTOCs[index].join(' ')) } });
				return (mbId ? rxMBID.test(mbId) ? mbApiRequest('release/' + mbId, { inc: 'media+discids' }).then(function(release) {
					if (release.media && sameMedia(release).length < mbTOCs.length)
						return Promise.reject('not enough attachable media in this release');
					url.searchParams.set('filter-release.query', mbId);
					warnings[0] = sameMedia(release).map(medium => medium.discs ? medium.discs.length : 0);
					return mbId;
				}) : Promise.reject('invalid format') : Promise.reject(false)).catch(function(reason) {
					if (reason) alert(`Not linking to release id ${mbId} for the reason ` + reason);
				}).then(mbId => mbId && !attended && mbAttachMode > 1 ? Promise.all(mbTOCs.map(function(mbTOC, tocNdx) {
					if (mbTOC == null) return null; else url.setTOC(tocNdx);
					return GlobalXHR.get(url, { recoverableErrors: [429] }).then(({document}) =>
						Array.from(document.body.querySelectorAll('table > tbody > tr input[type="radio"][name="medium"][value]'), input => ({
							id: input.value,
							title: input.nextSibling != null && input.nextSibling.textContent.trim().replace(/(?:\r?\n|[\t ])+/g, ' '),
					})));
				})).then(function(mediums) {
					mediums = mediums.every(medium => medium == null || medium.length == 1) ?
						mediums.map(medium => medium && medium[0]) : mediums[0];
					if (mediums == null) return Promise.reject('No logs with valid ToC');
					if (mediums.length != mbTOCs.length)
						return Promise.reject('Unable to reliably bind volumes or not logged in');
					if (Array.isArray(warnings[0])) if (warnings[0].every(mediumIds => mediumIds > 0))
						warnings[0] = `all CD media already have assigned at least ${Math.min(...warnings[0])} disc id(s)`;
					else if (warnings[0].some(mediumIds => mediumIds > 0))
						warnings[0] = `some CD media already have assigned at least ${Math.min(...warnings[0].filter(mediaIds => mediaIds > 0))} disc id(s)`;
					else warnings[0] = false; else warnings[0] = false;
					if (mbTOCs.some(mbTOC => mbTOC != null && mbTOC[3] != preGap))
						warnings.push('at least one medium starts at nonzero offset');
					if (logScoreTest(uncalibratedReadOffset))
						warnings.push('at least one session ripped with uncalibrated or wrong read offset');
					if (logScoreTest(logStatus => !(logStatus.score > 0)))
						warnings.push('at least one logfile seems to have very bad score');
					if (!confirm([
						[
							`${mbTOCs.length != 1 ? mbTOCs.length.toString() + ' TOCs are' : 'TOC is'} going to be attached to release id ${mbId}`,
						], warnings.filter(Boolean).map(warning => 'ATTENTION: ' + warning), [
							mediums.length > 1 && 'Media titles:\n' + mediums.map((medium, index) => ' '.repeat(4) + (medium.title || 'CD ' + (index + 1))).join('\n'),
							'Submit mode: ' + (!skipPoll && mbAttachMode < 3 ? 'apply after poll close (one week or sooner)' : 'auto-edit (without poll)'),
							'Edit note: ' + (mbSubmitLog ? 'entire .LOG file per volume' : 'medium fingerprint only'),
						], [
							'Before you confirm make sure -',
							'- uploaded CD and MB release are identical edition',
							'- attached log(s) have no score deductions for uncalibrated read offset',
						],
					].map(lines => lines.filter(Boolean).join('\n')).filter(Boolean).join('\n\n'))) return false;
					const postData = new URLSearchParams;
					if (!skipPoll && mbAttachMode < 3) postData.set('confirm.make_votable', 1);
					return getSessionsFromTorrent(torrentId).then(sessions => Promise.all(mbTOCs.map(function(mbTOC, index) {
						if (mbTOC != null) url.setTOC(index); else return;
						url.searchParams.set('medium', mediums[index].id);
						postData.set('confirm.edit_note', editNoteFromSession(sessions[index]));
						return GlobalXHR.post(url, postData, { responseType: null, recoverableErrors: [429] });
					}))).then(responses => (GM_openInTab([mbOrigin, 'release', mbId, 'discids'].join('/'), document.hidden), true));
				}).catch(reason => (alert(reason + '\n\nAttach by hand'), attachByHand())) : attachByHand());
			}).catch(reason => (alert(reason), false));
			const weakMatchMapper = (...strings) => sameStringValues(...strings)
				|| strings.some(str1 => strings.every(str2 => str2.toLowerCase().startsWith(str1.toLowerCase())))
				|| strings.every(str1 => strings.every(str2 => sameStringValues(...[str1, str2]
					.map(str => anyBracketsStripper(str.toLowerCase()))) || similarStringValues(str1, str2)));
			const recordingDate = recording => recording['first-release-date'] || recording.date;
			const tooltip = [ ];
			getMbTOCs().then(function(mbTOCs) {
				if (mbTOCs.some(Boolean)) {
					target.dataset.tocs = JSON.stringify(mbTOCs);
					target.dataset.discIds = JSON.stringify(mbTOCs.map(mbTOC => mbTOC && mbComputeDiscID(mbTOC)));
					tooltip.push('<b>Disc IDs:</b>\n' + mbTOCs.map(mbTOC => mbTOC && mbComputeDiscID(mbTOC))
						.map(discIdFormatter).join('\n'));
				}
				return Promise.all(mbTOCs.map(mbTOC => mbLookupByDiscID(mbTOC, !evt.ctrlKey))).then(function(results) {
					if (animation) animation.cancel();
					if (logScoresCache && 'torrentId' in logScoresCache && logScoresCache[torrentId].every(uncalibratedReadOffset))
						return Promise.reject('Incorrect read offset');
					if (mbSeedNew > 0) target.after(seedToMBIcon((target, params) => queryAjaxAPICached('torrent', { id: torrentId })
						.then(torrent => seedToMB(target, torrent, params), alert), undefined, `Seed new MusicBrainz release from this CD TOC
Drop Discogs/AllMusic release link to import external metadata
or drop exising MusicBrainz release group link to add to this group
MusicBrainz account required`, true));
					if (mbAttachMode > 0) target.after(attachToMBIcon(undefined, undefined,
							'Attach this CD TOC by hand to release not shown in lookup results\nor drop release link here\nMusicBrainz account required', true));
					let score = results.every(medium => medium == null) ? 8 : results[0] == null ?
						results.every(medium => medium == null || !medium.attached) ? 7 : 6 : 5;
					if (score < 6 || !evt.ctrlKey) {
						target.dataset.haveResponse = true;
						tooltip.unshift('View releases on MusicBrainz');
					}
					if (score > 7) return Promise.reject('No matches'); else if (score > 5) {
						target.textContent = 'Unlikely matches';
						target.style.color = score > 6 ? '#f40' : '#f80';
						tooltip.unshift(`Matched media found only for some volumes (${score > 6 ? 'fuzzy' : 'exact'})`);
						return;
					}
					let releases = results[0].releases.filter(release => !release.media
						|| sameMedia(release).length == results.length, results);
					if (releases.length > 0) score = results.every(result => result != null) ?
							results.every(result => result.attached) ? 0 : results.some(result => result.attached) ? 1 : 2
						: results.some(result => result != null && result.attached) ? 3 : 4;
					if (releases.length <= 0) releases = results[0].releases;
					target.dataset.releaseIds = JSON.stringify(releases.map(release => release.id));
					(function(type, color) {
						type = `${releases.length} ${type} match`;
						target.textContent = releases.length != 1 ? type + 'es' : type;
						target.style.color = color;
					})(...[
						['exact', '#0a0'], ['hybrid', '#3a0'], ['fuzzy', '#6a0'],
						['partial', '#9a0'], ['partial', '#ca0'], ['irrelevant', '#f80'],
					][score]);
					if (autoOpenTab && score < 2) GM_openInTab(mbOrigin + '/cdtoc/' +
						(evt.shiftKey ? 'attach?toc=' + results[0].mbTOC.join(' ') : results[0].discId), true);
					if (score < 5) return queryAjaxAPICached('torrent', { id: torrentId }).then(function(torrent) {
						function buildEditionTitle(release) {
							const editionTitle = (release.disambiguation || '')
								.split(/[\,\;]/).map(str => str.trim()).filter(Boolean);
							if (release.status) switch (release.status) {
								case 'Official': break;
								case 'Bootleg': editionTitle.push('Unofficial'); break;
								default: editionTitle.push(release.status);
							}
							// if (release.packaging && !['Jewel Case'].includes(release.packaging))
							// 	editionTitle.push(release.packaging);
							Array.prototype.push.apply(editionTitle, release.media.filter(isCD)
								.map(medium => medium.format).filter(format => format != 'CD').filter(uniqueValues));
							let countries = Array.prototype.concat.apply([ ], release['release-events'].map(event =>
								event?.area?.['iso-3166-1-codes'] || [ ])).filter(uniqueValues);
							if (countries.length <= 0 && release.country) countries = [release.country];
							countries = countries.map(countryCode => countryCode.toUpperCase())
								.filter(countryCode => !['XW'].includes(countryCode));
							if (useCountryInTitle && countries.length > 0 && countries.length <= 3)
								Array.prototype.push.apply(editionTitle, countries.map(countryPrettyPrint));
							return editionTitle.length > 0 ? editionTitle.join(' / ') : undefined;
						}

						const isCompleteInfo = torrent.torrent.remasterYear > 0
							&& Boolean(torrent.torrent.remasterRecordLabel)
							&& Boolean(torrent.torrent.remasterCatalogueNumber);
						const is = what => !torrent.torrent.remasterYear && ({
							unknown: torrent.torrent.remastered,
							unconfirmed: !torrent.torrent.remastered,
						}[what]);
						if (torrent.torrent.description)
							torrentDetails.dataset.torrentDescription = torrent.torrent.description.trim();
						// add inpage search results
						const [thead, table, tbody] = createElements('div', 'table', 'tbody');
						[thead.style, thead.innerHTML] = [theadStyle, `<b>Applicable MusicBrainz matches</b> (${[
							'exact',
							`${results.filter(result => result != null && result.attached).length} exact out of ${results.length} matches`,
							'fuzzy',
							`${results.filter(result => result != null && result.attached).length} exact / ${results.filter(result => result != null).length} matches out of ${results.length}`,
							`${results.filter(result => result != null).length} matches out of ${results.length}`,
						][score]})`];
						table.style = 'margin: 0; max-height: 10rem; overflow-y: auto; empty-cells: hide;';
						table.className = 'mb-lookup-results mb-lookup-' + torrent.torrent.id;
						const [recordLabels, catalogueNumbers] = editionInfoParser(torrent.torrent);
						const labelInfoMapper = release => Array.isArray(release['label-info']) ?
							release['label-info'].map(labelInfo => ({
								label: labelInfo.label ? rxNoLabel.test(labelInfo.label.name) ? noLabel : labelInfo.label.name : undefined,
								catNo: rxNoCatno.test(labelInfo['catalog-number']) ? undefined : labelInfo['catalog-number'],
							})).filter(labelInfo => labelInfo.label || labelInfo.catNo) : [ ];
						const rowWorkers = [ ];
						releases.forEach(function(release, index) {
							const [tr, artist, title, releaseEvents, editionInfo, barcode, groupSize, releasesWithId] =
								createElements('tr', 'td', 'td', 'td', 'td', 'td', 'td', 'td');
							[tr.className, tr.style] = ['musicbrainz-release', 'transition: color 200ms ease-in-out;'];
							if (release.quality == 'low') tr.style.opacity = 0.75;
							[releaseEvents, barcode].forEach(elem => { elem.style.whiteSpace = 'nowrap' });
							[groupSize, releasesWithId].forEach(elem => { elem.style.textAlign = 'right' });
							setMusicBrainzArtist(release, artist);
							setMusicBrainzTitle(release, title);
							// attach CD TOC
							if (mbAttachMode > 0 && (score > 0 || results.some(medium => !medium.releases.some(_release =>
									_release.id == release.id)))) title.prepend(attachToMBIcon(release.id,
								'float: right; margin: 0 0 0 4pt;',
								`Attach CD TOC to release (verify CD rip and MB release are identical edition)
Submission mode: ${mbAttachMode > 1 ? 'unattended (Alt+click enforces attended mode, Ctrl+click disables poll)' : 'attended'}
MusicBrainz account required`));
							// Seed new edition
							if (mbSeedNew > 0) title.prepend(seedToMBIcon((target, params) =>
									seedToMB(target, torrent, Object.assign((params || { }), { releaseGroupId: release['release-group'].id })),
								'float: right; margin: 0 0 0 4pt;', `Seed new MusicBrainz edition from this CD TOC in same release group
Drop Discogs/AllMusic release link to import external metadata
MusicBrainz account required`));
							// update from external DB
							if (mbUpdateRelease > 0) {
								function updateFromXtrnDb(evt, prompt, input) {
									if (!(evt instanceof Event)) throw new Error('Invalid argument');
									let target = evt.currentTarget;
									if (target instanceof HTMLElement) target.disabled = true; else target = null;
									const animation = target && flashElement(target);
									(async function(prompt, input) {
										let releaseType = document.body.querySelector('div#content div.header > h2');
										if (releaseType != null) releaseType = /\s+\[([^\[\]]+)\]$/.exec(releaseType.lastChild.textContent.trim());
										releaseType = releaseType != null ? releaseType[1] : undefined;
										let title = 'Update MusicBrainz release';
										if (evt.altKey) title += ' (simulation mode)';
										let createEntitiesTT = 'Applies to artists, labels, series and places';
										if (!evt.ctrlKey) createEntitiesTT += ' (votable)';
										createEntitiesTT += '\nIgnored on AllMusic';
										const defensiveMode = ['Compilation', 'Anthology'].includes(releaseType);
										const hasDiscogsRelative = getDiscogsRels(release).length > 0;
										if ((input = await promptEx(title, prompt + ':', true, input, [
											/*  0 */ ['Update release metadata', GM_getValue('mb_update_metadata', !hasDiscogsRelative)],
											/*  1 */ ['Compose annotation', GM_getValue('compose_annotation', !hasDiscogsRelative)],
											/*  2 */ ['Heuristic MBID lookup (slower)', GM_getValue('mbid_search_size', 30) > 0],
											/*  3 */ ['Create release-level relationships', 2, 'Release and release group\n[-] Indeterminate state → create relations only on entities not having any relation to same target type'],
											/*  4 */ ['Create track-level relationships', 2, 'Recording and work\n[-] Indeterminate state → create relations only on entities not having any relation to same target type'],
											/*  5 */ ['Create relationships on entities with target ID', false, 'If unchecked, creates relations only on entities not having any relation to same target\nThis is restricting condition, not relaxing'],
											/*  6 */ ['Create relationships on entities with same link type', defensiveMode ? 0 : 2, 'If unchecked, creates relations only on entities not having any relation of same type\n[-] Indeterminate state permits attribute-distinct relationships of same type\nThis is restricting condition, not relaxing'],
											/*  7 */ ['Create relationships on release level if on tracks', defensiveMode ? 0 : 1, 'If unchecked and any track matches the creation rule\n[-] Indeterminate state compares unrestricted\nThis is restricting condition, not relaxing'],
											/*  8 */ ['Prefer track level over release level relationships', 1, 'Option affecting how to import entities related to release without specific track bindings. Relations available for both of release and track level will be created for all single tracks insted of for release. Relationships available only at release or track level will be created at that level regardless the option.\n[-] Indeterminate state: auto decide\nActivate this option only if sure that all relations listed for release are also valid for each single track.'],
											/*  9 */ ['Autocreate missing entities when possible', Boolean(GM_getValue('mb_create_entities', 1)), createEntitiesTT],
											/* 10 */ ['Autocreate new works', Boolean(GM_getValue('mb_create_works', 1)), 'Required to assign new writing credits on track level'],
											/* 11 */ ['Import tags to release', Number(GM_getValue('mb_import_release_tags', 1)), '[-] Indeterminate state - add only if no tags are already assigned to entity'],
											/* 12 */ ['Import tags to release group', Number(GM_getValue('mb_import_rg_tags', 1)), '[-] Indeterminate state - add only if no tags are already assigned to entity'],
											/* 13 */ ['Import tags to recordings and works', Number(GM_getValue('mb_import_track_tags', [
													'Album', 'EP', 'Single', 'Live Album',
													'Remix', 'DJ Mix', 'Mixtape',
													'Bootleg', 'Demo', 'Concert Recording',
												].includes(releaseType) ? 1 : 0)), '[-] Indeterminate state - add only if no tags are already assigned to entity'],
											/* 14 */ ['Align media with TOCs', false, 'Only meaningful for multivolume releases; when tracklist numbering is missing volume resolution, checking the option tries to detect volumes by aligning with TOCs (logs attached in ordered sequence required)'],
											/* 15 */ ['Overwrite existing values (not recommended, use with caution)', false],
											/* 16 */ ['Make edits votable', !(mbUpdateRelease >= 2)],
										])) == null) return;
										let param, xtrnDbId;
										if (xtrnDbId = discogsIdExtractor(input.input, 'release')) param = 'discogsId';
										else if (xtrnDbId = allMusicIdExtractor(input.input, 'release')) param = 'allMusicId';
										else throw 'Input doesnot contain valid ID/URL';
										const updateFromXtrnDb = (seeder, dbName) => updateFromExternalDb(release.id,
												(params, cdLengths) => seeder(new URLSearchParams, xtrnDbId, Object.assign({
											basicMetadata: input[0][0], extendedMetadata: true,
											composeAnnotation: input[0][1],
											searchSize: input[0][2] ? Math.max(GM_getValue('mbid_search_size'), 0) || 30 : 0,
											releaseRelations: input[0][3] > 0, rgRelations: input[0][3] > 0,
											recordingRelations: input[0][4] > 0, workRelations: input[0][4] > 0,
											preferTrackRelations: input[0][8],
											createMissingEntities: input[0][9] && !evt.altKey ? !input[0][16] && !evt.shiftKey ? 2 : 1 : 0,
											alignWithTOCs: input[0][14],
											tracklist: false, recordingsLookup: 0, rgLookup: false, lookupArtistsByRecording: false,
										}, params), cdLengths), `${dbName} release id ${xtrnDbId} (${({
											discogsId: [dcOrigin, 'release', xtrnDbId].join('/'),
											allMusicId: 'https://www.allmusic.com/album/release/' +  xtrnDbId,
										}[param])})`, {
											updateMetadata: input[0][0],
											createMissingWorks: input[0][10] && !evt.altKey ? !input[0][16] && !evt.shiftKey ? 2 : 1 : 0,
											importTagsToRG: input[0][12], importTagsToRelease: input[0][11],
											importTagsToRecordings: input[0][13], importTagsToWorks: input[0][13],
											touchReleaseWithRels: input[0][3] > 1, touchTrackWithRels: input[0][4] > 1,
											touchEntityWithTargetId: input[0][5], touchEntityWithLinkType: input[0][6],
											touchReleaseWithRelsOnTracks: input[0][7] + 1,
											overwrite: input[0][15],
											makeVotable: input[0][16],
											simulationMode: evt.altKey,
											target: target,
										}).then(function(results) {
											if (!evt.altKey) if (results === null) alert('Nothing to be updated');
											else if (results) GM_openInTab([mbOrigin, 'release', release.id,
												/*mbUpdateRelease > 1 ? 'edit' : */'edits'].join('/'), document.hidden);
										});
										switch (param) {
											case 'discogsId': return updateFromXtrnDb(seedFromDiscogs, 'Discogs');
											case 'allMusicId': return updateFromXtrnDb(seedFromAllMusic, 'AllMusic');
											default: throw 'Method not implemented';
										}
									})(prompt, input).catch(alert).then(function() {
										if (animation) animation.cancel();
										if (target != null) {
											target.disabled = false;
											target.style.filter = null;
											target.hold = false;
										}
									});
								}

								let prompt = 'Discogs/AllMusic release ID or URL';
								title.prepend(addIcon(minifyHTML(`
<svg fill="#0a8" height="0.9em" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
	<path d="M53.34 26.69c-2.26,-0.18 -6.1,-0.03 -7.24,0.16 -7.03,1.17 -13.53,5.68 -16.97,11.94 -1.86,3.38 -2.67,6.52 -2.84,10.38 -0.14,3.33 0.22,6.51 1.51,9.6l0.58 1.41 -0.12 0.58 -4.45 4.4c-0.74,0.73 -4.48,5.3 -5.88,3.9 -0.49,-0.66 -1.12,-2.12 -1.47,-2.83 -3.61,-7.38 -4.59,-15.72 -2.9,-23.75 2.7,-12.84 12.32,-23.33 24.76,-27.42 4.34,-1.42 6.82,-1.71 11.41,-1.71 0.53,0 1.57,0.03 2.49,0.02 -0.51,-0.65 -1.07,-1.3 -1.51,-1.83 -0.62,-0.77 -2.1,-2.53 -2.52,-3.38l-0.05 -0.1 -0.05 -0.21 0 -0.1c-0.03,-0.94 8.59,-7.79 9.66,-7.79l0.22 0 0.4 0.19 0.14 0.18c3.07,3.83 6.07,7.74 9.07,11.61 1.02,1.31 8.83,11.06 9.18,12.09l0.02 0.08 0.03 0.16 0 0.08c0,0.9 -23.51,19.18 -24.47,19.18 -0.88,0 -8.01,-9.05 -7.48,-10.1 0.26,-0.52 4.49,-3.7 5.1,-4.16 0.99,-0.77 2.27,-1.68 3.38,-2.58z"/>
	<path d="M50.29 87.29c1.05,1.32 2.26,2.69 3.28,3.84 1.48,1.66 -2.96,4.48 -4.01,5.35 -0.88,0.73 -4.55,4.48 -5.8,3.23 -3.13,-3.11 -6.8,-8 -9.71,-11.46 -2.55,-3.04 -5.15,-6.08 -7.63,-9.18 -0.58,-0.74 -2.53,-2.72 -1.25,-3.59 3.79,-2.97 7.6,-6.31 11.33,-9.44 1.03,-0.86 11.04,-9.54 11.85,-9.54 0.9,0 7.22,7.53 7.89,8.71 0.63,1.27 -4.47,4.95 -5.22,5.58 -0.86,0.71 -2.39,1.9 -3.56,2.95 0.13,0.01 0.25,0.01 0.35,0.02 3.35,0.31 7.62,-0.23 10.74,-1.47 7.82,-3.13 13.5,-9.94 14.95,-18.26 0.54,-3.14 0.28,-7.43 -0.64,-10.48l-0.45 -1.51 0.13 -0.53 4.52 -4.43c0.59,-0.59 4.29,-4.56 5.05,-4.56 0.94,0 1.49,1.63 1.81,2.32 5.26,11.59 4.22,25.13 -2.82,35.74 -4.63,6.97 -11.17,11.94 -19.09,14.64 -3.31,1.13 -6.61,1.67 -10.09,1.92 -0.51,0.04 -1.07,0.1 -1.63,0.15z"/>
</svg>`), evt => { updateFromXtrnDb(evt, prompt + ' (required)') }, function dropHandler(evt, url) {
									if (/^https?:\/\//i.test(url)) updateFromXtrnDb(evt, prompt, url);
								}, 'update-from-xtrn-source', 'float: right; margin: 0 0 0 2pt;', 'Update release info from external source and create relations\n(drop Discogs/AllMusic release link here)\nMusicBrainz account required'));
							}
							setMusicBrainzReleaseEvents(release, releaseEvents, torrent.torrent.remasterYear);
							if (Array.isArray(release['label-info'])) fillListRows(editionInfo, release['label-info']
								.map(labelInfo => editionInfoMapper(labelInfo.label && labelInfo.label.name,
									labelInfo['catalog-number'], recordLabels, catalogueNumbers,
										labelInfo.label && labelInfo.label.id && labelInfo.label.id != mb.spl.noLabel ?
											[mbOrigin, 'label', labelInfo.label.id].join('/') : undefined)));
							if (editionInfo.childElementCount <= 0) mbFindEditionInfoInAnnotation(editionInfo, release.id);
							if (release.barcode) {
								barcode.textContent = release.barcode;
								if (catalogueNumbers.some(catalogueNumber => sameBarcodes(catalogueNumber, release.barcode)))
									editionInfoMatchingStyle(barcode);
								barcodeStyle(barcode);
							}
							setMusicBrainzGroupSize(release, groupSize, releasesWithId, results.length);
							tr.dataset.releaseUrl = [mbOrigin, 'release', release.id].join('/');
							const releaseYear = getReleaseYear(release.date), _editionInfo = labelInfoMapper(release);
							if (!_editionInfo.some(labelInfo => labelInfo.catNo) && release.barcode)
								_editionInfo.push({ catNo: release.barcode });
							if (releaseYear > 0 && _editionInfo.length > 0) {
								tr.dataset.remasterYear = releaseYear;
								setEditionInfo(tr, _editionInfo);
								let editionTitle = buildEditionTitle(release);
								if (editionTitle) tr.dataset.remasterTitle = editionTitle;
								try {
									if (isCompleteInfo || !('editionGroup' in torrentDetails.dataset) || score > (is('unknown') ? 0 : 3)
											|| noEditPerms || !editableHosts.includes(document.domain) && !ajaxApiKey)
										throw 'Not applicable';
									if (!(releaseYear > 0)) throw 'Edition year missing';
									if (_editionInfo.length <= 0 && torrent.torrent.remasterYear > 0
											&& (torrent.torrent.remasterTitle || !editionTitle)) throw 'No additional edition information';
									applyOnClick(tr);
								} catch(e) { applyOnCtrlClick(tr) }
							}
							setMusicBrainzTooltip(release, tr);
							tr.append(artist, title, releaseEvents, editionInfo, barcode, groupSize, releasesWithId);
							for (let cell of tr.cells) cell.style.backgroundColor = 'inherit';
							['artist', 'title', 'release-events', 'edition-info', 'barcode', 'editions-total', 'discids-total']
								.forEach((className, index) => { tr.cells[index].classList.add(className) });
							tbody.append(tr);
							for (let discogsId of getDiscogsRels(release)) {
								if (title.querySelector('span.have-discogs-relatives') == null) {
									const span = document.createElement('span');
									[span.className, span.innerHTML] = ['have-discogs-relatives', GM_getResourceText('dc_icon')];
									span.firstElementChild.setAttribute('height', 6);
									span.firstElementChild.removeAttribute('width');
									span.firstElementChild.style.verticalAlign = 'top';
									svgSetTitle(span.firstElementChild, 'Has defined Discogs relative(s)');
									title.append(' ', span);
								}
								rowWorkers.push(dcApiRequest('releases/' + discogsId).then(function(release) {
									const [trDC, icon, artist, title, numTracks, releaseEvents, editionInfo, barcode, groupSize] =
										createElements('tr', 'td', 'td', 'td', 'td', 'td', 'td', 'td', 'td');
									[trDC.className, numTracks.style.textAlign, icon.style.textAlign] = ['discogs-release', 'right', 'right'];
									trDC.style = 'transition: color 200ms ease-in-out;';
									trDC.style.backgroundColor = trDC.dataset.backgroundColor ='#8881';
									[barcode.style.whiteSpace, groupSize.style.textAlign] = ['nowrap', 'right'];
									setDiscogsArtist(artist, release.artists);
									title.innerHTML = linkHTML(release.uri, release.title, 'discogs-release');
									let descriptors = getDiscogsReleaseDescriptors(release);
									if (descriptors.length > 0) appendDisambiguation(title, descriptors.join(', '));
									if (release.images && release.images.length > 0) {
										let thumbnail = release.images.find(image => image.type == 'primary') || release.images[0];
										addThumbnail(title, thumbnail && (thumbnail.uri150 || thumbnail.uri),
											[dcOrigin, 'release', release.id, 'images'].join('/'));
									}
									let realTracks = discogsReleaseTracks(release);
									if (realTracks = [undefined, realTracks[0], `${realTracks[0]}(${realTracks[1]})`][realTracks.length])
										numTracks.textContent = realTracks;
									if (release.country || release.released)
										fillListRows(releaseEvents, iso3166ToFlagCodes(discogsCountryToIso3166Mapper(release.country)).map(countryCode =>
											releaseEventMapper(countryCode, release.released && release.released.replace(/(?:-00)+$/, ''),
												torrent.torrent.remasterYear)), 3);
									if (Array.isArray(release.labels)) fillListRows(editionInfo, release.labels.map(label =>
										editionInfoMapper(stripDiscogsNameVersion(label.name), label.catno, recordLabels, catalogueNumbers,
											label.id && !label.name.startsWith('Not On Label') ? [dcOrigin, 'label', label.id].join('/') : undefined)));
									const barcodes = (release.identifiers || [ ]).filter(id => id.type == 'Barcode' && id.value)
										.map(barcode => barcode.value.replace(/\W+/g, ''));
									if (barcodes.length > 0) {
										barcode.textContent = barcodes.find(barcode => checkBarcode(barcode, false))
											|| barcodes.find(barcode => checkBarcode(barcode, true)) || barcodes[0];
										if (catalogueNumbers.some(catalogueNumber => barcodes.some(barcode =>
												sameBarcodes(catalogueNumber, barcode)))) editionInfoMatchingStyle(barcode);
										if (!barcodes.some(barcode => barcode == 'none' || checkBarcode(barcode, true))) {
											[barcode.style.color, barcode.title] = ['red', 'Invalid barcode'];
											barcode.classList.add('invalid');
										} else if (!barcodes.some(barcode => barcode == 'none' || checkBarcode(barcode, false))) {
											[barcode.style.color, barcode.title] = ['darkorange', 'Invalid barcode or check digit missing'];
											barcode.classList.add('invalid');
										} else barcode.classList.add('valid');
									}
									setDiscogsGroupSize(release, groupSize);
									icon.innerHTML = GM_getResourceText('dc_icon');
									icon.firstElementChild.style = '';
									icon.firstElementChild.removeAttribute('width');
									icon.firstElementChild.setAttribute('height', '0.9em');
									svgSetTitle(icon.firstElementChild, release.id);
									trDC.dataset.releaseUrl = [dcOrigin, 'release', release.id].join('/');
									const releaseYear = getReleaseYear(release.released);
									const _editionInfo = Array.isArray(release.labels) ? release.labels.map(label => ({
										label: rxNoLabel.test(label.name) ? noLabel : stripDiscogsNameVersion(label.name),
										catNo: rxNoCatno.test(label.catno) ? undefined : label.catno,
									})).filter(label => label.label || label.catNo) : [ ];
									if (!_editionInfo.some(label => label.catNo) && barcodes.length > 0) _editionInfo.push({
										catNo: barcodes.find(barcode => checkBarcode(barcode, false)) || barcodes[0],
									});
									if (releaseYear > 0 && _editionInfo.length > 0) {
										trDC.dataset.remasterYear = releaseYear;
										setEditionInfo(trDC, _editionInfo);
										descriptors = Array.from(descriptors).filter(description => ![
											'Mini-Album', 'Digipak', 'Digipack', 'Sampler', 'Mixtape', 'CD-TEXT', 'DVD', 'Reissue', //'Maxi-Single',
										].includes(description));
										if (release.formats) {
											if (release.formats.some(format => format.name == 'CDr')) descriptors.push('CD-R');
											if (release.formats.some(format => format.name == 'SACD') && descriptors.includes('Hybrid'))
												descriptors.push('Hybrid SACD');
											if (release.formats.some(format => format.name == 'Hybrid') && descriptors.includes('DualDisc'))
												descriptors.push('DualDisc');
										}
										const countriesIso3166 = discogsCountryToIso3166Mapper(release.country)
											.filter(countryIso3166 => countryIso3166 && !['XW'].includes(countryIso3166));
										if (useCountryInTitle && countriesIso3166.length > 0 && countriesIso3166.length <= 3)
											Array.prototype.push.apply(descriptors, countriesIso3166.map(countryPrettyPrint));
										if (descriptors.length > 0) trDC.dataset.remasterTitle = descriptors.join(' / ');
										try {
											if (isCompleteInfo || !('editionGroup' in torrentDetails.dataset) || score > (is('unknown') ? 0 : 3)
													|| noEditPerms || !editableHosts.includes(document.domain) && !ajaxApiKey)
												throw 'No additional edition information';
											if (!(releaseYear > 0)) throw 'Edition year missing';
											if (_editionInfo.length <= 0 && torrent.torrent.remasterYear > 0
													&& (torrent.torrent.remasterTitle || !descriptors))
												throw 'No additional edition information';
											applyOnClick(trDC);
										} catch(e) { applyOnCtrlClick(trDC) }
									}
									setDiscogsTooltip(release, trDC);
									trDC.append(artist, title, releaseEvents, editionInfo, barcode, groupSize, icon);
									for (let cell of trDC.cells) cell.style.backgroundColor = 'inherit';
									['artist', 'title', 'release-events', 'edition-info', 'barcode', 'editions-total', 'discogs-icon']
										.forEach((className, index) => { trDC.cells[index].classList.add(className) });
									tr.after(trDC); //tbody.append(trDC);
								}, reason => { svgSetTitle(title.querySelector('span.have-discogs-relatives').firstElementChild, reason) }));
							}
						});
						table.append(tbody);
						Promise.all(rowWorkers).then(() => { addResultsFilter(thead, tbody, 5) }, console.warn);
						addLookupResults(torrentId, thead, table);
						// Group set
						if (isCompleteInfo || !('editionGroup' in torrentDetails.dataset) || score > (is('unknown') ? 0 : 3)
								|| noEditPerms || !editableHosts.includes(document.domain) && !ajaxApiKey
								|| torrent.torrent.remasterYear > 0 && !(releases = releases.filter(release =>
									!release.date || getReleaseYear(release.date) == torrent.torrent.remasterYear))
										.some(release => release['label-info'] && release['label-info'].length > 0 || release.barcode)
								|| releases.length > (is('unknown') ? 1 : 2)) return;
						const releaseYear = releases.reduce((year, release) =>
							year > 0 ? year : getReleaseYear(release.date), undefined);
						if (!(releaseYear > 0) || releases.some(release1 => releases.some(release2 =>
									getReleaseYear(release2.date) != getReleaseYear(release1.date)))
								|| !releases.every((release, ndx, arr) =>
									release['release-group'].id == arr[0]['release-group'].id)) return;
						const a = document.createElement('a');
						[a.className, a.href, a.textContent, a.style.fontWeight] =
							['update-edition', '#', '(set)', score <= 0 && releases.length < 2 ? 'bold' : 300];
						let editionInfo = Array.prototype.concat.apply([ ], releases.map(labelInfoMapper)), editionTitle;
						const barcodes = releases.map(release => release.barcode).filter(Boolean);
						if (!editionInfo.some(labelInfo => labelInfo.catNo) && barcodes.length > 0)
							Array.prototype.push.apply(editionInfo, barcodes.map(barcode => ({ catNo: barcode })));
						if (releases.length < 2) editionTitle = buildEditionTitle(releases[0]);
						if (editionInfo.length <= 0 && torrent.torrent.remasterYear > 0
								&& (torrent.torrent.remasterTitle || !editionTitle)) return;
						a.dataset.remasterYear = releaseYear;
						setEditionInfo(a, editionInfo);
						if (editionTitle) a.dataset.remasterTitle = editionTitle;
						if (releases.length < 2) a.dataset.releaseUrl = [mbOrigin, 'release', releases[0].id].join('/');
						setTooltip(a, 'Update edition info from matched release(s)\n\n' + releases.map(release =>
							release['label-info'].map(labelInfo => [getReleaseYear(release.date), [
								labelInfo.label && labelInfo.label.name,
								labelInfo['catalog-number'] || release.barcode,
							].filter(Boolean).join(' / ')].filter(Boolean).join(' – ')).filter(Boolean).join('\n')).join('\n'));
						a.onclick = updateEdition;
						if (is('unknown') || releases.length > 1) a.dataset.confirm = true;
						target.after(a);
					}, alert);
				});
			}).catch(function(reason) {
				if (animation) animation.cancel();
				[target.textContent, target.style.color] = [reason, 'red'];
			}).then(function() {
				if (tooltip.length > 0) setTooltip(target, tooltip.join('\n\n'), { interactive: true }); else setTooltip(target);
				target.disabled = false;
			});
		}
	}, 'Lookup edition on MusicBrainz by Disc ID/TOC (Ctrl enforces strict TOC matching)\nUse Alt to lookup by CDDB ID');
	addLookup('CTDB', function(evt) {
		const target = evt.currentTarget;
		console.assert(target instanceof HTMLElement);
		if (target.disabled) return;
		const torrentId = parseInt(torrentDetails.dataset.torrentId);
		if (!(torrentId > 0)) throw 'Assertion failed: invalid torrentId';
		const ctdbTOCs = getSessionsFromTorrent(torrentId).then(sessions =>
			sessions.map(getTocAudioEntries).map(tocEntriesToCtdbTOC));
		if (Boolean(target.dataset.haveQuery) || autoOpenTab) ctdbTOCs.then(function(ctdbTOCs) {
			if (!ctdbTOCs.some(Boolean)) return Promise.reject('No valid ToCs found');
			if (target.dataset.hasMatches == 0) return Promise.reject('No matches');
			for (let tocId of ctdbTOCs.map(ctdbTOC => ctdbTOC && ctdbComputeDiscID(ctdbTOC)).filter(Boolean).reverse())
				GM_openInTab('https://db.cue.tools/?tocid=' + tocId, !Boolean(target.dataset.haveQuery));
		});
		if (Boolean(target.dataset.haveQuery)) return; else target.disabled = true;
		[target.textContent, target.style.color] = ['Looking up...', null];
		const ctdbLookup = params => getSessionsFromTorrent(torrentId).then(sessions => Promise.all(sessions.map(function(session) {
			const tocEntries = getTocAudioEntries(session);
			if (tocEntries == null) return;
			const url = new URL('https://db.cue.tools/lookup2.php');
			url.searchParams.set('ctdb', 1);
			url.searchParams.set('version', 3);
			url.searchParams.set('fuzzy', 0);
			url.searchParams.set('metadata', 'none');
			if (params) for (let param in params) url.searchParams.set(param, params[param]);
			url.searchParams.set('toc', tocEntries.map(tocEntry => tocEntry.startSector)
				.concat(tocEntries[tocEntries.length - 1].endSector + 1).join(':'));
			const saefInt = (base, property, radix) =>
				isNaN(property = parseInt(base.getAttribute(property), radix)) ? undefined : property;
			return GlobalXHR.get(url, { responseType: 'xml' }).then(function({xml}) {
				const result = {
					entries: Array.from(xml.getElementsByTagName('entry'), entry => ({
						id: saefInt(entry, 'id'),
						confidence: saefInt(entry, 'confidence'),
						crc32: saefInt(entry, 'crc32', 16),
						toc: entry.hasAttribute('toc') ? entry.getAttribute('toc').split(':').map(offset => parseInt(offset)) : undefined,
						trackcrcs: entry.hasAttribute('trackcrcs') ? entry.getAttribute('trackcrcs').split(' ').map(crc => parseInt(crc, 16)) : undefined,
						hasparity: entry.getAttribute('hasparity') || undefined,
						npar: saefInt(entry, 'npar'),
						stride: saefInt(entry, 'stride'),
						syndrome: entry.getAttribute('syndrome') || undefined,
					}))/*.filter(entry => entry.toc[0] == tocEntries[0].startSector)*/,
					metadata: Array.from(xml.getElementsByTagName('metadata'), metadata => ({
						source: metadata.getAttribute('source') || undefined,
						id: metadata.getAttribute('id') || undefined,
						artist: metadata.getAttribute('artist') || undefined,
						album: metadata.getAttribute('album') || undefined,
						year: saefInt(metadata, 'year'),
						trackCount: metadata.getElementsByTagName('track').length,
						discNumber: saefInt(metadata, 'discnumber'),
						discCount: saefInt(metadata, 'disccount'),
						release: Array.from(metadata.getElementsByTagName('release'), release => ({
							date: release.getAttribute('date') || undefined,
							country: release.getAttribute('country') || undefined,
						})),
						labelInfo: Array.from(metadata.getElementsByTagName('label'), label => ({
							name: label.getAttribute('name') || undefined,
							catno: label.getAttribute('catno') || undefined,
						})),
						barcode: metadata.getAttribute('barcode') || undefined,
						infourl: metadata.getAttribute('infourl') || undefined,
						extra: Array.from(metadata.getElementsByTagName('extra'), extra => extra.textContent.trim()),
						relevance: saefInt(metadata, 'relevance'),
					})).filter(function metaFilter(metadata) {
						if (metadata.trackCount > 0) console.assert(metadata.trackCount == tocEntries.length);
						if (!['musicbrainz', 'discogs'].includes(metadata.source)) return false;
						if (metadata.discCount > 0 && metadata.discCount != sessions.length) return false;
						//if (metadata.trackCount > 0 && metadata.trackCount != tocEntries.length) return false;
						return true;
					}),
				};
				if (result.entries.length <= 0) return Promise.reject('Result without entries');
				const mediaFingerprint = getSessionFingerprint(session);
				console.assert(mediaFingerprint != null);
				if (mediaFingerprint.isRangeRip) return result;
				result.entries = result.entries.map(entry => Object.defineProperty(Object.defineProperty(entry, 'crc32matched', {
					value: tocEntries.filter((tocEntry, index) =>
						mediaFingerprint[index].crc32 != undefined && entry.trackcrcs[index] != undefined
						&& mediaFingerprint[index].crc32 == entry.trackcrcs[index]).length,
					enumerable: true,
				}), 'matchRate', {
					value: tocEntries.length >= 3 ? Math.min(entry.crc32matched / (tocEntries.length - 2), 1) : undefined,
					enumerable: true,
				}));
				if (tocEntries.length >= 3) {
					const total = result.entries.reduce((total, entry) => total + (entry.confidence || 0), 0);
					result.confidence = Object.freeze({
						matched: result.entries.reduce((total, entry) => total + (entry.crc32matched >= tocEntries.length - 2 ? entry.confidence || 0 : 0), 0),
						mostlyMatched: result.entries.reduce((total, entry) => total + (entry.crc32matched >= (tocEntries.length - 2) / 2 ? entry.confidence || 0 : 0), 0),
						anyMatched: result.entries.reduce((total, entry) => total + (entry.crc32matched > 0 ? entry.confidence || 0 : 0), 0),
						matchRate: result.entries.reduce((total, entry) => total + entry.matchRate * (entry.confidence || 0), 0) / total,
						total: total,
					});
				}
				return result;
			}).catch(reason => null);
		})).then(function(results) {
			if (results.some(result => result && result.confidence)) {
				const total = results.reduce((total, result) => total + (result && result.confidence ? result.confidence.total : 0), 0);
				const defValue = propName => ({ [propName]: results.reduce((total, result) => total + (result && result.confidence ? result.confidence[propName] : 0), 0) });
				results.confidence = Object.freeze(Object.assign({
					matchRate: results.reduce((total, result) => total + (result && result.confidence ? result.entries.reduce((total, entry) => total + (entry.matchRate || 0) * (entry.confidence || 0), 0) : 0), 0) / total,
					total: total,
				}, defValue('matched'), defValue('mostlyMatched'), defValue('anyMatched')));
			}
			console.log('CTDB lookup (%s, %d) results:', params.metadata, params.fuzzy, results);
			return results;
		}));
		ctdbTOCs.then(function(ctdbTOCs) {
			if (!ctdbTOCs.some(Boolean)) return Promise.reject('No valid ToCs found');
			target.dataset.tocs = JSON.stringify(ctdbTOCs);
			target.dataset.tocIds = JSON.stringify(ctdbTOCs.map(ctdbTOC => ctdbTOC && ctdbComputeDiscID(ctdbTOC)));
			setTooltip(target, 'View in CUETools DB\n\n<b>TOCIDs:</b></b>\n' + ctdbTOCs
				.map(ctdbTOC => ctdbTOC && ctdbComputeDiscID(ctdbTOC))
				.map(discIdFormatter).join('\n'), { interactive: true });
		}).catch(reason => { setTooltip(target, reason) });
		ctdbLookup({ metadata: 'none', fuzzy: 1 }).then(function(results) {
			target.dataset.hasMatches = results.some(Boolean) ? 1 : 0;
			if (!results.some(result => result !== undefined))
				[target.textContent, target.style.color] = ['No valid ToCs found', 'red'];
			else if (!results.some(Boolean))
				[target.textContent, target.style.color] = ['No matches', 'red'];
			else if (!results.every(Boolean))
				[target.textContent, target.style.color] = ['Some media found', '#aa0'];
			else
				[target.textContent, target.style.color] = ['All media found', '#0a0'];
			if (!results.some(Boolean)) return;
			const confidenceBox = document.createElement('span'), confidenceColor = () => `rgb(${[
				(1 - results.confidence.matchRate) * 0xBB,
				0xAA + (1 - results.confidence.matchRate) * 0x11,
				0,
			].join(', ')})`;
			const matchedTooltip = param => [
				'Checksums',
				!results.filter(result => result && result.confidence).every(result => result.confidence.matched > 0) && 'partially',
				`matched for ${param} (confidence ${['matched', 'anyMatched'].map(prop => results.confidence[prop]).filter(uniqueValues).join('/')}/${results.confidence.total})`,
			].filter(Boolean).join(' ');
			if (results.every(result => result && result.confidence && result.confidence.anyMatched > 0)) {
				confidenceBox.innerHTML = svgCheckmark(confidenceColor());
				confidenceBox.className = results.confidence.matched > 0 ? 'ctdb-verified' : 'ctdb-partially-verified';
				setTooltip(confidenceBox, matchedTooltip('all discs'));
			} else if (results.some(result => result && result.confidence && result.confidence.anyMatched > 0)) {
				confidenceBox.innerHTML = svgQuestionMark(confidenceColor());
				confidenceBox.className = 'ctdb-partially-verified';
				setTooltip(confidenceBox, matchedTooltip('some discs'));
			} else if (results.some(result => result && result.confidence)) {
				confidenceBox.innerHTML = svgFail();
				confidenceBox.className = 'ctdb-not-verified';
				setTooltip(confidenceBox, 'No checksums matched');
			} else {
				confidenceBox.innerHTML = svgQuestionMark();
				confidenceBox.className = 'ctdb-not-verified';
				setTooltip(confidenceBox, 'Could not verify checksums\n(range rip or tracklists too short)');
			}
			target.parentNode.append(confidenceBox);
		}, reason => { [target.textContent, target.style.color] = [reason, 'red'] })
			.then(() => { [target.dataset.haveQuery, target.disabled] = [true, false] });
		const methods = [
			//{ metadata: 'fast', fuzzy: 0 }, { metadata: 'default', fuzzy: 0 }, { metadata: 'extensive', fuzzy: 0 },
			{ metadata: 'fast', fuzzy: 1 }, { metadata: 'default', fuzzy: 1 }, { metadata: 'extensive', fuzzy: 1 },
		];
		(function execMethod(index = 0, reason) {
			return index < methods.length ? ctdbLookup(methods[index]).then(function(results) {
				return results.some(result => result && result.metadata.length > 0) ? results : Promise.reject('No matches');
			}).then(results => Object.assign(results, { method: methods[index] }),
				reason => execMethod(index + 1, reason)) : Promise.reject(reason);
		})().then(results => queryAjaxAPICached('torrent', { id: torrentId }).then(function(torrent) {
			function buildEditionTitle(metadata) {
				const editionTitle = [ ];
				const countries = metadata.release.filter(release => release.country)
					.map(release => release.country.toUpperCase())
					.filter(countryCode => !['XW'].includes(countryCode)).map(countryPrettyPrint);
				if (useCountryInTitle && countries.length > 0 && countries.length <= 3)
					Array.prototype.push.apply(editionTitle, countries);
				return editionTitle.length > 0 ? editionTitle.join(' / ') : undefined;
			}

			if (logScoresCache && 'torrentId' in logScoresCache && logScoresCache[torrentId].every(uncalibratedReadOffset))
				return Promise.reject('Incorrect read offset');
			let releases = Array.prototype.concat.apply([ ], results.map(result => result.metadata)).filter((release1, index, releases) =>
				releases.findIndex(release2 => release2.source == release1.source && release2.id == release1.id) == index);
			console.assert(releases.length > 0);
			const isCompleteInfo = torrent.torrent.remasterYear > 0
				&& Boolean(torrent.torrent.remasterRecordLabel)
				&& Boolean(torrent.torrent.remasterCatalogueNumber);
			const is = what => !torrent.torrent.remasterYear && ({
				unknown: torrent.torrent.remastered,
				unconfirmed: !torrent.torrent.remastered,
			}[what]);
			if (torrent.torrent.description)
				torrentDetails.dataset.torrentDescription = torrent.torrent.description.trim();
			const [thead, table, tbody] = createElements('div', 'table', 'tbody');
			thead.style = theadStyle;
			thead.innerHTML = `<b>Applicable CTDB matches</b> (method: ${Boolean(results.method.fuzzy) ? 'fuzzy, ' : ''}${results.method.metadata})`;
			table.style = 'margin: 0; max-height: 10rem; overflow-y: auto; empty-cells: hide;';
			table.className = 'ctdb-lookup-results ctdb-lookup-' + torrentId;
			const [recordLabels, catalogueNumbers] = editionInfoParser(torrent.torrent);
			const labelInfoMapper = metadata => metadata.labelInfo.map(labelInfo => ({
				label: labelInfo.name ? rxNoLabel.test(labelInfo.name) ? noLabel :
					metadata.source == 'discogs' ? stripDiscogsNameVersion(labelInfo.name) : labelInfo.name : undefined,
				catNo: rxNoCatno.test(labelInfo.catno) ? undefined : labelInfo.catno,
			})).filter(labelInfo => labelInfo.label || labelInfo.catNo);
			const _getReleaseYear = metadata => (metadata = metadata.release.map(release => getReleaseYear(release.date)))
				.every((year, ndx, arr) => year > 0 && year == arr[0]) ? metadata[0] : NaN;
			releases.forEach(function(metadata) {
				const [tr, source, artist, title, release, editionInfo, barcode, relevance] =
					createElements('tr', 'td', 'td', 'td', 'td', 'td', 'td', 'td', 'td');
				[tr.className, tr.style] = ['ctdb-metadata', 'transition: color 200ms ease-in-out;'];
				tr.dataset.releaseUrl = { musicbrainz: mbOrigin, discogs: dcOrigin }[metadata.source];
				if (tr.dataset.releaseUrl) tr.dataset.releaseUrl = [tr.dataset.releaseUrl, 'release', metadata.id].join('/');
				else delete tr.dataset.releaseUrl;
				[release, barcode, relevance].forEach(elem => { elem.style.whiteSpace = 'nowrap' });
				[relevance].forEach(elem => { elem.style.textAlign = 'right' });
				if (source.innerHTML = GM_getResourceText(({ musicbrainz: 'mb_logo', discogs: 'dc_icon' }[metadata.source]))) {
					source.firstElementChild.removeAttribute('width');
					source.firstElementChild.setAttribute('height', '1em');
					svgSetTitle(source.firstElementChild, metadata.source);
				} else source.innerHTML = `<img src="http://s3.cuetools.net/icons/${metadata.source}.png" height="12" title="${metadata.source}" />`;
				artist.textContent = metadata.source == 'discogs' ? stripDiscogsNameVersion(metadata.artist) : metadata.artist;
				source.style.alignTop = '1pt';
				if (tr.dataset.releaseUrl)
					title.innerHTML = linkHTML(tr.dataset.releaseUrl, metadata.album, metadata.source + '-release');
				else title.textContent = metadata.album;
				if (metadata.source == 'discogs') findDiscogsRelatives('release', metadata.id).then(function(releases) {
					title.style = 'display: inline-flex; flex-flow: row wrap; column-gap: 3pt;';
					const span = Object.assign(document.createElement('span'), { className: 'musicbrainz-relations' });
					span.style = 'display: flex; flex-flow: column wrap; max-height: 1em;';
					span.append.apply(span, releases.map((release, index) => Object.assign(document.createElement('a'), {
						href: [mbOrigin, 'release', release.id].join('/'), target: '_blank',
						style: noLinkDecoration + ' vertical-align: top;',
						innerHTML: '<img src="https://musicbrainz.org/static/images/entity/release.svg" height="6" />',
						title: release.id,
					})));
					title.append(span);
				});
				if (Array.isArray(metadata.release)) fillListRows(release, Array.prototype.concat.apply([ ],
					metadata.release.map(release => iso3166ToFlagCodes([release.country]).map(countryCode =>
						releaseEventMapper(countryCode, release.date, torrent.torrent.remasterYear)))), 3);
				if (Array.isArray(metadata.labelInfo)) fillListRows(editionInfo, metadata.labelInfo.map(labelInfo =>
					editionInfoMapper(stripDiscogsNameVersion(labelInfo.name), labelInfo.catno, recordLabels, catalogueNumbers)));
				if (editionInfo.childElementCount <= 0 && metadata.source == 'musicbrainz')
					mbFindEditionInfoInAnnotation(editionInfo, metadata.id);
				if (metadata.barcode) {
					barcode.textContent = metadata.barcode;
					if (catalogueNumbers.some(catalogueNumber => sameBarcodes(catalogueNumber, metadata.barcode)))
						editionInfoMatchingStyle(barcode);
					barcodeStyle(barcode);
				}
				if (metadata.relevance >= 0) [relevance.textContent, relevance.title] =
					[metadata.relevance + '%', 'Relevance'];
				const releaseYear = _getReleaseYear(metadata), _editionInfo = labelInfoMapper(metadata);
				if (!_editionInfo.some(labelInfo => labelInfo.catNo) && metadata.barcode)
					_editionInfo.push({ catNo: metadata.barcode });
				if (releaseYear > 0 && _editionInfo.length > 0) {
					tr.dataset.remasterYear = releaseYear;
					setEditionInfo(tr, _editionInfo);
					const editionTitle = buildEditionTitle(metadata);
					if (editionTitle) tr.dataset.remasterTitle = editionTitle;
					if (!isCompleteInfo && 'editionGroup' in torrentDetails.dataset //&& !Boolean(results.method.fuzzy)
							&& !noEditPerms && (editableHosts.includes(document.domain) || ajaxApiKey)
							&& (!is('unknown') || results.every(result => result.confidence && result.confidence.anyMatched > 0))
							&& (!is('unknown') || results.method.metadata != 'extensive' || !(metadata.relevance < 100))) {
						if (!(releaseYear > 0)) throw 'Unknown or inconsistent release year';
						if (_editionInfo.length <= 0 && torrent.torrent.remasterYear > 0) throw 'No additional edition information';
						applyOnClick(tr);
					} else applyOnCtrlClick(tr);
				}
				if (metadata.extra.length > 0 || metadata.infourl)
					(tr.title ? title.querySelector('a.' + metadata.source + '-release') : tr).title =
						metadata.extra.concat(metadata.infourl).filter(Boolean).join('\n\n');
				tr.append(source, artist, title, release, editionInfo, barcode, relevance);
				for (let cell of tr.cells) cell.style.backgroundColor = 'inherit';
				['source', 'artist', 'title', 'release-events', 'edition-info', 'barcode', 'relevance'].forEach(function(className, index) {
					tr.cells[index].style.backgroundColor = 'inherit';
					tr.cells[index].classList.add(className);
				});
				tbody.append(tr);
			});
			table.append(tbody);
			addResultsFilter(thead, tbody, 5);
			addLookupResults(torrentId, thead, table);
			// Group set
			if (isCompleteInfo || !('editionGroup' in torrentDetails.dataset) || Boolean(results.method.fuzzy)
					|| noEditPerms || !editableHosts.includes(document.domain) && !ajaxApiKey
					|| torrent.torrent.remasterYear > 0 && !(releases = releases.filter(metadata =>
						isNaN(metadata = _getReleaseYear(metadata)) || metadata == torrent.torrent.remasterYear))
							.some(metadata => metadata.labelInfo && metadata.labelInfo.length > 0 || metadata.barcode)
					|| releases.length > (is('unknown') ? 1 : 2)
					|| is('unknown') && !results.every(result => result.confidence && result.confidence.anyMatched > 0)
					|| is('unknown') && results.method.metadata == 'extensive' && releases.some(metadata => metadata.relevance < 100))
				return;
			const releaseYear = releases.reduce((year, metadata) => isNaN(year) ? NaN :
				(metadata = _getReleaseYear(metadata)) > 0 && (year <= 0 || metadata == year) ? metadata : NaN, -Infinity);
			if (!(releaseYear > 0) || !releases.every(m1 => m1.release.every(r1 => releases.every(m2 =>
					m2.release.every(r2 => getReleaseYear(r2.date) == getReleaseYear(r1.date))))))
				throw 'No additional edition information';
			const a = document.createElement('a');
			[a.className, a.href, a.textContent] = ['update-edition', '#', '(set)'];
			if (releases.length > 1 || releases.some(metadata => metadata.relevance < 100)
					|| !results.every(result => result.confidence && result.confidence.anyMatched > 0)) {
				a.style.fontWeight = 300;
				a.dataset.confirm = true;
			} else a.style.fontWeight = 'bold';
			let editionInfo = Array.prototype.concat.apply([ ], releases.map(labelInfoMapper));
			const barcodes = releases.map(metadata => metadata.barcode).filter(Boolean);
			if (!editionInfo.some(labelInfo => labelInfo.catNo) && barcodes.length > 0)
				Array.prototype.push.apply(editionInfo, barcodes.map(barcode => ({ catNo: barcode })));
			if (editionInfo.length <= 0 && torrent.torrent.remasterYear > 0)
				throw 'No additional edition information';
			a.dataset.remasterYear = releaseYear;
			setEditionInfo(a, editionInfo);
			if (releases.length < 2) {
				a.dataset.releaseUrl = ({
					musicbrainz: [mbOrigin, 'release', releases[0].id],
					discogs: [dcOrigin, 'release', releases[0].id],
				}[releases[0].source]).join('/');
				const editionTitle = buildEditionTitle(releases[0]);
				if (editionTitle) tr.dataset.remasterTitle = editionTitle;
			}
			setTooltip(a, 'Update edition info from matched release(s)\n\n' + releases.map(metadata =>
				metadata.labelInfo.map(labelInfo => (({ discogs: 'Discogs', musicbrainz: 'MusicBrainz' }[metadata.source])) + ' ' + [
					_getReleaseYear(metadata),
					[stripDiscogsNameVersion(labelInfo.name), labelInfo.catno || metadata.barcode].filter(Boolean).join(' / '),
				].filter(Boolean).join(' – ') + (metadata.relevance >= 0 ? ` (${metadata.relevance}%)` : ''))
					.filter(Boolean).join('\n')).join('\n'));
			a.onclick = updateEdition;
			target.parentNode.append(a);
		}));
	}, 'Lookup edition in CUETools DB (TOCID)');
	if (GM_getValue('use_gnudb', false)) addLookup('GnuDb', function(evt) { // GnuDB is naughty
		const target = evt.currentTarget;
		console.assert(target instanceof HTMLElement);
		const entryUrl = entry => `https://gnudb.org/cd/${entry[1].slice(0, 2)}${entry[2]}`;
		if (Boolean(target.dataset.haveResponse)) {
			if (!('entries' in target.dataset)) return;
			for (let entry of JSON.parse(target.dataset.entries).reverse()) GM_openInTab(entryUrl(entry), false);
			return;
		} else if (target.disabled) return; else target.disabled = true;
		target.textContent = 'Looking up...';
		target.style.color = null;
		lookupByToc(parseInt(torrentDetails.dataset.torrentId), function(tocEntries) {
			console.info('Local CDDB ID:', getCDDBiD(tocEntries));
			console.info('Local AR ID:', getARiD(tocEntries));
			const reqUrl = new URL('https://gnudb.gnudb.org/~cddb/cddb.cgi');
			let tocDef = [tocEntries.length].concat(tocEntries.map(tocEntry => preGap + tocEntry.startSector));
			const tt = preGap + tocEntries[tocEntries.length - 1].endSector + 1 - tocEntries[0].startSector;
			tocDef = tocDef.concat(Math.floor(tt / msf)).join(' ');
			reqUrl.searchParams.set('cmd', `discid ${tocDef}`);
			reqUrl.searchParams.set('hello', `name ${document.domain} userscript.js 1.0`);
			reqUrl.searchParams.set('proto', 6);
			return GlobalXHR.get(reqUrl, { responseType: 'text' }).then(function({responseText}) {
				console.log('GnuDb CDDB discid:', responseText);
				const response = /^(\d+) Disc ID is ([\da-f]{8})$/i.exec(responseText.trim());
				if (response == null) return Promise.reject(`Unexpected response format (${responseText})`);
				console.assert((response[1] = parseInt(response[1])) == 200);
				reqUrl.searchParams.set('cmd', `cddb query ${response[2]} ${tocDef}`);
				return GlobalXHR.get(reqUrl, { responseType: 'text', context: response });
			}).then(function({responseText}) {
				console.log('GnuDb CDDB query:', responseText);
				let entries = /^(\d+)\s+(.+)/.exec((responseText = responseText.trim().split(/\r?\n/))[0]);
				if (entries == null) return Promise.reject('Unexpected response format');
				const statusCode = parseInt(entries[1]);
				if (statusCode < 200 || statusCode >= 400) return Promise.reject(`Server response error (${statusCode})`);
				if (statusCode == 202) return Promise.reject('No matches');
				entries = (statusCode >= 210 ? responseText.slice(1) : [entries[2]])
					.map(RegExp.prototype.exec.bind(/^(\w+)\s+([\da-f]{8})\s+(.*)$/i)).filter(Boolean);
				return entries.length <= 0 ? Promise.reject('No matches')
					: { status: statusCode, discId: arguments[0].context[2], entries: entries };
			});
		}).then(function(results) {
			if (logScoresCache && 'torrentId' in logScoresCache && logScoresCache[torrentId].every(uncalibratedReadOffset))
				return Promise.reject('Incorrect read offset');
			if (results.length <= 0 || results[0] == null) return Promise.reject('No matches');
			let caption = `${results[0].entries.length} ${['exact', 'fuzzy'][results[0].status % 10]} match`;
			if (results[0].entries.length > 1) caption += 'es';
			target.textContent = caption;
			target.style.color = '#0a0';
			if (results[0].entries.length <= 5) for (let entry of Array.from(results[0].entries).reverse())
				GM_openInTab(entryUrl(entry), true);
			target.dataset.entries = JSON.stringify(results[0].entries);
			target.dataset.haveResponse = true;
		}).catch(function(reason) {
			target.textContent = reason;
			target.style.color = 'red';
		}).then(() => { target.disabled = false });
	}, 'Lookup edition on GnuDb (CDDB disc id)');
}

(function(elem, tBody) {
	[elem, tBody] = [elem, tBody].map(selector => document.body.querySelector('div#discog_table > ' + selector));
	if (elem == null || tBody == null) return;
	const captions = ['Incomplete editions only', 'All editions'];
	elem.after(' ', Object.assign(document.createElement('a'), {
		textContent: captions[0], href: '#', className: 'brackets',
		onclick: function(evt) {
			if (captions.indexOf(evt.currentTarget.textContent) == 0) {
				for (let strong of tBody.querySelectorAll(':scope > tr.edition.discog > td.edition_info > strong')) (function(tr, show = true) {
					if (show) (function(tr) {
						show = false;
						while ((tr = tr.nextElementSibling) != null && tr.classList.contains('torrent_row')) {
							const a = tr.querySelector('td > a:last-of-type');
							if (a == null || !/\bFLAC\s*\/\s*Lossless\s*\/\s*Log\s*\(\-?\d+%\)/.test(a.textContent)) continue;
							show = true;
							break;
						}
					})(tr);
					if (show) (function(tr) {
						while (tr != null && !tr.classList.contains('group')) tr = tr.previousElementSibling;
						if (tr != null && (tr = tr.querySelector('div > a.show_torrents_link')) != null
								&& tr.parentNode.classList.contains('show_torrents')) tr.click();
					})(tr); else (function(tr) {
						do tr.hidden = true;
						while ((tr = tr.nextElementSibling) != null && tr.classList.contains('torrent_row'));
					})(tr);
				})(strong.parentNode.parentNode, incompleteEdition.test(strong.lastChild.textContent.trim()));
				for (let tr of tBody.querySelectorAll(':scope > tr.group.discog')) (function(tr) {
					if (!(function(tr) {
						while ((tr = tr.nextElementSibling) != null && !tr.classList.contains('group'))
							if (tr.classList.contains('edition') && !tr.hidden) return true;
						return false;
					})(tr)) tr.hidden = true;
				})(tr);
			} else for (let tr of tBody.querySelectorAll(':scope > tr.discog')) tr.hidden = false;
			evt.currentTarget.textContent = captions[1 - captions.indexOf(evt.currentTarget.textContent)];
		},
	}));
})('div.box.center > a:last-of-type', 'table.torrent_table.grouped > tbody');
