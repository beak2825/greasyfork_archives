// ==UserScript==
// @name         [RED] Similar CD Detector
// @namespace    https://greasyfork.org/users/321857-anakunda
// @version      1.11.5
// @description  Script for testing CD releases for duplicity by Gazelle tracker standard
// @match        https://redacted.sh/torrents.php?id=*
// @match        https://redacted.sh/torrents.php?page=*&id=*
// @match        https://redacted.sh/upload.php?groupid=*
// @run-at       document-end
// @author       Anakunda
// @license      GPL-3.0-or-later
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      musicbrainz.org
// @connect      db.cue.tools
// @require      https://openuserjs.org/src/libs/Anakunda/Requests.min.js
// @require      https://openuserjs.org/src/libs/Anakunda/libLocks.min.js
// @require      https://openuserjs.org/src/libs/Anakunda/gazelleApiLib.min.js
// @downloadURL https://update.greasyfork.org/scripts/455108/%5BRED%5D%20Similar%20CD%20Detector.user.js
// @updateURL https://update.greasyfork.org/scripts/455108/%5BRED%5D%20Similar%20CD%20Detector.meta.js
// ==/UserScript==

'use strict';

function getTorrentId(tr) {
	if (!(tr instanceof HTMLElement)) throw 'Invalid argument';
	if ((tr = tr.querySelector('a.button_pl')) != null
			&& (tr = parseInt(new URLSearchParams(tr.search).get('torrentid'))) > 0) return tr;
	throw 'Failed to get torrent id';
}

const toASCII = str => str && str.normalize('NFKD').replace(/[\x00-\x1F\u0300-\u036F]/gu, '');
const cmpNorm = str => str && toASCII(str).replace(/\s+(?:and|et|y|und|и)\s+/gi, ' & ').toLowerCase()
	.replace(/[\s\‐\−\—\–\x00-\x25\x27-\x2F\x3A-\x40\x5B-\x5E\x60\x7B-\x7F\u2019]+/g, '');
const dupePrecheckInLinkbox = false; // set to true to have own rip dupe precheck in group page linkbox
const noseedGracePeriod = 120; // tolerated torrent age in minutes to allow auto-reporting without being seeded
const maxRemarks = 60, allowReports = true;
const sessionsCache = new Map;
let selected = null, sessionsSessionCache;
// const rxStackedLogReducer = /^[\S\s]*(?:\r?\n)+(?=(?:Exact Audio Copy V|X Lossless Decoder version\s+|CUERipper v|EZ CD Audio Converter\s+)\d+\b)/;
// const stackedLogReducer = logFile => rxStackedLogReducer.test(logFile) ?
// 	logFile.replace(rxStackedLogReducer, '') : logFile;
const msf = 75, preGap = 2 * msf, msfTime = /(?:(-?\d+):)?(-?\d+):(-?\d+)[\.\:](-?\d+)/.source;
const msfToSector = time => Array.isArray(time) || (time = new RegExp('^\\s*' + msfTime + '\\s*$').exec(time)) != null ?
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
const rxTrackExtractor = /^(?:(?:(?:Track|Трек|Òðåê|音轨|Traccia|Spår|Pista|Трак|Utwór|Stopa)[^\S\r\n]+\d+\b.*|Track \d+ saved to\b.+)$(?:\r?\n^(?:[^\S\r\n]+.*)?$)*| +\d+:$\r?\n^ {4,}Filename:.+$(?:\r?\n^(?: {4,}.*)?$)*)/gm;
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
	sessionFingerprint.dataTracks = getDataTracks(sessionFingerprint);
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

function releaseFingerprintFromSessions(sessions, id) {
	if (sessions == null) return null; else if (!Array.isArray(sessions)) throw 'Invalid argument';
	return Object.freeze(Object.assign(sessions.map(getSessionFingerprint), { source: 'logfile', id: id }));
}

function getSessionsFromLogs(logFiles, detectCombinedLogs = true) {
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
			.filter(RegExp.prototype.test.bind(new RegExp('^(?:' + rxRipperSignatures + '|' + sessionHeader + ')')));
		return logFiles.length > 0 ? logFiles : null;
	} else if ((logFiles = logFiles.map(function(logFile) {
		let rxSessionsIndexer = new RegExp('^' + rxRipperSignatures, 'gm'), indexes = [ ], match;
		while ((match = rxSessionsIndexer.exec(logFile)) != null) indexes.push(match.index);
		if (indexes.length <= 0) {
			rxSessionsIndexer = new RegExp('^' + sessionHeader, 'gm');
			while ((match = rxSessionsIndexer.exec(logFile)) != null) indexes.push(match.index);
		}
		return (indexes = indexes.map((index, ndx, arr) => logFile.slice(index, arr[ndx + 1])).filter(function(session) {
			const rr = rxRangeRip.exec(session);
			if (rr == null) return true;
			// Ditch HTOA logs
			const tocEntries = getTocEntries(session);
			return tocEntries == null || parseInt(rr[1]) != 0 || parseInt(rr[2]) + 1 != tocEntries[0].startSector;
		})).length > 0 ? indexes : null;
	}).filter(Boolean)).length <= 0) return null;
	const sessions = new Map, useChecksums = logFiles.every(logFile => logFile.every(function(session) {
		const sessionFingerprint = getSessionFingerprint(session);
		return sessionFingerprint != null && (sessionFingerprint.dataTracks > 0 ?
			sessionFingerprint.slice(0, -sessionFingerprint.dataTracks) : sessionFingerprint)
				.every(tocEntry => tocEntry.crc32 != undefined);
	}));
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
	return sessions.size > 0 ? Array.from(sessions.values()) : null;
}

function getSessionsFromTorrent(torrentId, detectCombinedLogs, allowInvalid = true) {
	if (!((torrentId = parseInt(torrentId)) > 0)) throw 'Invalid argument';
	if (sessionsCache.has(torrentId)) return sessionsCache.get(torrentId);
	if (!sessionsSessionCache && 'ripSessionsCache' in sessionStorage) try {
		sessionsSessionCache = JSON.parse(sessionStorage.getItem('ripSessionsCache'));
	} catch(e) {
		console.warn(e);
		sessionStorage.removeItem('ripSessionsCache');
		sessionsSessionCache = undefined;
	}
	if (sessionsSessionCache && torrentId in sessionsSessionCache)
		return sessionsSessionCache[torrentId] || allowInvalid ?
			Promise.resolve(sessionsSessionCache[torrentId]) : Promise.reject('No valid logfiles attached');
	// let request = queryAjaxAPICached('torrent', { id: torrentId }).then(({torrent}) => torrent.logCount > 0 ?
	// 		Promise.all(torrent.ripLogIds.map(ripLogId => queryAjaxAPICached('riplog', { id: torrentId, logid: ripLogId })
	// 			.then(response => response))) : Promise.reject('No logfiles attached'));
	let request = LocalXHR.get('/torrents.php?' + new URLSearchParams({ action: 'loglist', torrentid: torrentId }));
	request = request.then(({document}) => Array.from(document.body.querySelectorAll(':scope > blockquote > pre:first-child'), pre => pre.textContent));
	request = request.then(logFiles => getSessionsFromLogs(logFiles, detectCombinedLogs)).then(function(sessions) {
		try {
			if (!sessionsSessionCache) sessionsSessionCache = { };
			sessionsSessionCache[torrentId] = sessions;
			sessionStorage.setItem('ripSessionsCache', JSON.stringify(sessionsSessionCache));
		} catch(e) { console.warn(e) }
		return sessions || allowInvalid ? sessions : Promise.reject('No valid logfiles attached');
	});
	sessionsCache.set(torrentId, request);
	return request;
}
function releaseFingerprintFromTorrent(torrent, detectCombinedLogs) {
	if (torrent instanceof HTMLElement) torrent = getTorrentId(torrent);
	return getSessionsFromTorrent(torrent, detectCombinedLogs)
		.then(sessions => releaseFingerprintFromSessions(sessions, torrent));
}

// progressive method tries to de-round track peaks expressed in %
function testSimilarity(release1, release2, matchAnyOrder = true, progressivePeaksComparison = true) {
	function compareMedium(...media) {
		function addTrackRemark(trackIndex, remark) {
			if (!(trackIndex in volRemarks)) volRemarks[trackIndex] = [ ];
			volRemarks[trackIndex].push(remark);
		}

		if (media.length < 2) throw 'Two arguments required';
		const mediumIndexes = [release1.indexOf(media[0]), release2.indexOf(media[1])];
		let volDescriptor = (mediumIndexes[0] + 1).toString();
		if (mediumIndexes[1] != mediumIndexes[0]) volDescriptor += '↔' + (mediumIndexes[1] + 1);
		if (media.some(medium => !Array.isArray(medium))) return [`disc ${volDescriptor} ${incompleteMedium}`];
		const remarks = [ ], volRemarks = [ ];
		let mediumLength = media.map(function(medium, mediumIndex) {
			let mediumLength = medium.length;
			if (medium.dataTracks < 0) remarks.push(`Disc ${mediumIndex + 1} having unknown layout type`);
			else if (medium.dataTracks > 0) mediumLength -= medium.dataTracks;
			return mediumLength;
		});
		if (mediumLength[0] == mediumLength[1]) mediumLength = Math.min(...mediumLength);
			else throw `disc ${volDescriptor} ToC lengths mismatch`;
		const tracksMapper = mapFn => Array.from(Array(mediumLength), (_, index) => mapFn(index));
		const htoaCount = media.filter(medium => medium[0].startSector > 150).length;
		if (htoaCount > 0) remarks.push(`Disc ${volDescriptor} ${htoaCount < 2 ? 'one rip' : 'both rips'} possibly containing leading hidden track (ToC starting at non-zero offset)`);
		// Compare TOCs
		const tocThresholds = [
			{ maxShift: 50, maxDrift: 10 }, // WiKi standard
			// { maxShift: 40, maxDrift: 40 }, // staff standard
		], maxPeakDelta = 0.001;
		const tocShifts = tracksMapper(trackIndex =>
			(media[1][trackIndex].endSector - media[1][0].startSector) -
			(media[0][trackIndex].endSector - media[0][0].startSector));
		const tocShiftOf = shifts => shifts.length > 0 ? Math.max(...shifts.map(Math.abs)) : 0;
		const tocDriftOf = shifts => shifts.length > 0 ? Math.max(...shifts) - Math.min(...shifts) : 0;
		let shiftsPool = tocShifts.length > 1 ? tocShiftOf(tocShifts.slice(0, -1)) : undefined;
		shiftsPool = tocShifts.find(trackShift => Math.abs(trackShift) == shiftsPool) || 0;
		const hasPostGap = [shiftsPool + 150, shiftsPool - 150].includes(tocShifts[tocShifts.length - 1]); // ??
		shiftsPool = !hasPostGap ? tocShifts : tocShifts.slice(0, -1);
		const tocShift = tocShiftOf(shiftsPool), tocDrift = tocDriftOf(shiftsPool);
		console.assert(tocDrift >= 0);
		const label = `ToC comparison for medium ${volDescriptor}`;
		console.group(label);
		console.table(tracksMapper(function(trackIndex) {
			const tocEntry = mediumIndex => {
				const label = releases[mediumIndex].source == 'logfile' ? releases[mediumIndex].id || 'USERLOG'
					: releases[mediumIndex].source ? releases[mediumIndex].source.toUpperCase() : mediumIndex + 1;
				return {
					['Start' + label]: media[mediumIndex][trackIndex].startSector,
					['End' + label]: media[mediumIndex][trackIndex].endSector,
					['Length' + label]: media[mediumIndex][trackIndex].length,
				};
			}
			return Object.assign({ 'Track#': trackIndex + 1 }, tocEntry(0), tocEntry(1), { 'Shift': tocShifts[trackIndex] });
		}));
		console.info(`ToC shift = ${tocShift}`);
		console.info(`ToC drift = ${Math.max(...tocShifts)} - ${Math.min(...tocShifts)} = ${Math.max(...tocShifts) - Math.min(...tocShifts)}`);
		console.groupEnd(label);
		if (tocThresholds.length > 0) (function tryIndex(reason, index = 0) {
			if (index < tocThresholds.length) try {
				if (!Object.keys(tocThresholds[index]).every(key => tocThresholds[index][key] > 0)) throw 'Invalid parameter';
				if (tocShift >= tocThresholds[index].maxShift)
					throw `disc ${volDescriptor} ToC shift not below ${tocThresholds[index].maxShift} sectors`;
				if (tocDrift >= tocThresholds[index].maxDrift)
					throw `disc ${volDescriptor} ToC drift not below ${tocThresholds[index].maxDrift} sectors`;
			} catch(reason) { tryIndex(reason, index + 1) } else throw reason || 'unknown reason';
		})();
		if (tocDrift > 0) remarks.push(`Disc ${volDescriptor} shifted ToCs by ${tocShift} sectors with ${tocDrift} sectors drift`);
		else if (tocShift > 0) remarks.push(`Disc ${volDescriptor} shifted ToCs by ${tocShift} sectors`);
		if (hasPostGap) remarks.push(`Disc ${volDescriptor} with post-gap`);
		if (media.some(medium => medium.isRangeRip == false && !(medium.trackRecords > 0)))
			throw `disc ${volDescriptor} no track records could be extracted for at least one rip`;
		else if (media.every(medium => medium.isRangeRip == false) && media[0].trackRecords != media[1].trackRecords)
			throw `disc ${volDescriptor} track records count mismatch (${media[0].trackRecords} <> ${media[1].trackRecords})`;
		tracksMapper(function(trackIndex) { // just informational
			const mismatches = [ ];
			if (media[0][trackIndex].startSector != media[1][trackIndex].startSector) mismatches.push('offsets');
			if (media[0][trackIndex].length != media[1][trackIndex].length) mismatches.push('lengths');
			if (mismatches.length > 0) addTrackRemark(trackIndex, mismatches.join(' and ') + ' mismatch');
		});
		// Compare pre-gaps - just informational
		if (media.every(medium => medium.isRangeRip == false)) tracksMapper(function(trackIndex) {
			if ((media[0][trackIndex].preGap || 0) != (media[1][trackIndex].preGap || 0))
				addTrackRemark(trackIndex, 'pre-gaps mismatch');
		});
		const identicalTracks = new Set;
		if (!media.some(medium => medium.isRangeRip)) tracksMapper(function(trackIndex) {
			if (media.every(medium => medium[trackIndex].crc32 != undefined)
					&& media[0][trackIndex].crc32 == media[1][trackIndex].crc32) identicalTracks.add(trackIndex);
		});
		// Compare peaks
		tracksMapper(function(trackIndex) {
			if (media.some(medium => medium[trackIndex].peak == undefined)) {
				if (media.every((medium, index) => releases[index].source == 'logfile' && medium.isRangeRip == false))
					throw `disc ${volDescriptor} track ${trackIndex + 1} one or both peak levels missing (assertion failed)`;
				if (!releases.some(release => release.source != 'logfile')) addTrackRemark(trackIndex, 'peak level missing');
				return;
			} else if (identicalTracks.has(trackIndex)) return;
			//const norm = [peak => peak[0], peak => Math.min(peak[1] <= 3 ? Math.floor(peak[0]) + 0.748 : peak[0], 1000)];
			const norm = (progressivePeaksComparison ? [-0.031, 0.901] : [0]).map(offset =>
				peak => Math.max(Math.min(peak[1] <= 3 ? Math.floor(peak[0]) + offset : peak[0], 1000)), 0);
			if (norm.every(fn => Math.abs(fn(media[0][trackIndex].peak) - fn(media[1][trackIndex].peak)) >= maxPeakDelta * 1000))
				throw `disc ${volDescriptor} track ${trackIndex + 1} peak difference above ${maxPeakDelta}`;
			if (media[0][trackIndex].peak[1] == media[1][trackIndex].peak[1]
					&& media[0][trackIndex].peak[0] != media[1][trackIndex].peak[0])
				addTrackRemark(trackIndex, 'peak levels mismatch');
		});
		// Compare checksums - just informational
		if (!media.every(medium => medium.isRangeRip)) tracksMapper(function(trackIndex) {
			if (media.some(medium => medium[trackIndex].crc32 == undefined && !medium.isRangeRip))
				addTrackRemark(trackIndex, 'checksum missing');
			if (media.some(medium => medium[trackIndex].crc32 == undefined)) return;
			if (media[0][trackIndex].crc32 != media[1][trackIndex].crc32) addTrackRemark(trackIndex, 'checksums mismatch');
			else if (releases.some(release => release.source != 'logfile')) addTrackRemark(trackIndex, 'checksums matched');
		});
		// Compare AR signatures - just informational
		if (!media.every(medium => medium.isRangeRip)) for (let V of [2, 1]) tracksMapper(function(trackIndex) {
			// if (media.some(medium => medium[trackIndex]['arv' + V] == undefined && medium.isRangeRip == false))
			// 	addTrackRemark(trackIndex, `AR v${V} hash missing`);
			if (media.some(medium => medium[trackIndex]['arv' + V] == undefined)) return;
			if (media[0][trackIndex]['arv' + V] != media[1][trackIndex]['arv' + V])
				addTrackRemark(trackIndex, `AR v${V} signatures mismatch`);
		});
		volRemarks.forEach(function(trackRemarks, trackIndex) {
			if (Array.isArray(trackRemarks))
				remarks.push(`Disc ${volDescriptor} track ${trackIndex + 1}: ${trackRemarks.join(', ')}`);
		});
		if (media.every(medium => medium.timeStamp != null) && media[0].timeStamp[0] == media[1].timeStamp[0])
			remarks.push(`Disc ${volDescriptor} ${identicalRip}`);
		return remarks;
	}
	function resultResolver(remarks) {
		console.assert(Array.isArray(remarks), remarks);
		const isAllFlag = pattern => remarks.filter(remark => remark.endsWith(pattern)).length >= releaseLength;
		return isAllFlag(identicalRip) ? true : isAllFlag(incompleteMedium) ? false : remarks;
	}

	const releases = [release1, release2];
	if (!releases.every(Array.isArray)) return false;
	if (!releases.every(release1 => releases.every(release2 => release2.length == release1.length)))
		throw 'media count mismatch';
	const releaseLength = Math.max(...releases.map(release => release.length));
	const identicalRip = 'originates in same ripping session';
	const incompleteMedium = 'uncertain result: ToC is missing for at least one medium';
	let remarks = [ ];
	if (releaseLength > 1 && matchAnyOrder) {
		const volumesMapping = new Map;
		outerLoop: for (let medium1 of release1) {
			for (let medium2 of release2) if (!volumesMapping.has(medium2)) try {
				Array.prototype.push.apply(remarks, compareMedium(medium1, medium2));
				volumesMapping.set(medium2, medium1);
				continue outerLoop;
			} catch(e) { console.info(e) }
			break;
		}
		if (release2.every(Map.prototype.has.bind(volumesMapping))) return resultResolver(remarks);
		remarks = [ ];
	}
	for (let index = 0; index < releaseLength; ++index)
		Array.prototype.push.apply(remarks, compareMedium(...releases.map(release => release[index])));
	return resultResolver(remarks);
}

Object.defineProperty(typeof unsafeWindow == 'object' ? unsafeWindow : window, 'similarCDDetector', { value: Object.freeze({
	apiVersion: typeof GM_info == 'object' ? GM_info.script.version : undefined,
	getTocEntries: getTocEntries,
	getSessionFingerprint: getSessionFingerprint,
	getSessionsFromLogs: getSessionsFromLogs,
	getSessionsFromTorrent: getSessionsFromTorrent,
	releaseFingerprintFromSessions: releaseFingerprintFromSessions,
	releaseFingerprintFromTorrent: releaseFingerprintFromTorrent,
	testSimilarity: testSimilarity,
}) });

function getEditionTitle(elem) {
	while (elem != null && !elem.classList.contains('edition')) elem = elem.previousElementSibling;
	if (elem != null && (elem = elem.querySelector('td.edition_info > strong')) != null)
		return elem.textContent.trimRight().replace(/^[\s\-\−]+/, '').replace(/\s*\/\s*CD$/, '');
}

switch (document.location.pathname) {
	case '/torrents.php': {
		function countSimilar(groupId) {
			if (groupId > 0) return queryAjaxAPI('torrentgroup', { id: groupId }).then(function({torrents}) {
				const torrentIds = torrents.filter(torrent => torrent.media == 'CD' && torrent.format == 'FLAC'
					&& torrent.encoding == 'Lossless' && torrent.hasLog).map(torrent => torrent.id);
				const compareWorkers = [ ];
				torrentIds.forEach(function(torrentId1, ndx1) {
					torrentIds.forEach(function(torrentId2, ndx2) {
						if (ndx2 > ndx1) compareWorkers.push(Promise.all([torrentId1, torrentId2].map(releaseFingerprintFromTorrent)).then(function(torrentReleases) {
							try { return Boolean(testSimilarity(...torrentReleases)) } catch(reason) { return false }
						}));
					});
				});
				return Promise.all(compareWorkers).then(results => results.filter(Boolean).length);
			}); else throw 'Invalid argument';
		}
		for (let selector of [
			'table.torrent_table > tbody > tr.group div.group_info > strong > a:last-of-type',
			'table.torrent_table > tbody > tr.torrent div.group_info > strong > a:last-of-type',
			'table.torrent_table > tbody > tr.group div.group_info > a:last-of-type',
			'table.torrent_table > tbody > tr.torrent div.group_info > a:last-of-type',
		]) for (let a of document.body.querySelectorAll(selector)) {
			a.onclick = function altClickHandler(evt) {
				if (!evt.altKey) return true;
				let groupId = new URLSearchParams(evt.currentTarget.search);
				if ((groupId = parseInt(groupId.get('id'))) > 0) countSimilar(groupId).then(count =>
					{ alert(count > 0 ? `Total ${count} CDs potentially duplicates` : 'No similar CDs found') }, alert);
				return false;
			};
			a.title = 'Use Alt + click to count considerable CD dupes in release group';
		}

		const torrents = Array.prototype.filter.call(document.body.querySelectorAll('table#torrent_details > tbody > tr.torrent_row'),
			tr => (tr = tr.querySelector('td > a')) != null && /\b(?:FLAC)\b.+\b(?:Lossless)\b.+\b(?:Log) \(\-?\d+\s*\%\)/.test(tr.textContent));
		if (torrents.length < 1) break;

		if (torrents.length >= 2) {
			for (let tr of torrents) {
				let torrentId = /^torrent(\d+)$/.exec(tr.id);
				if (torrentId == null || !((torrentId = parseInt(torrentId[1])) > 0)) continue;
				const div = document.createElement('DIV');
				div.innerHTML = '<svg height="14" viewBox="0 0 24 24" fill="gray"><path d="M14.0612 4.7156l4.0067-.7788a.9998.9998 0 10-.3819-1.9629l-4.0264.7826a2.1374 2.1374 0 00-3.7068.7205l-4.0466.7865a.9998.9998 0 10.3819 1.9629l4.0221-.7818a2.1412 2.1412 0 003.751-.729zM7.1782 9.5765a.9997.9997 0 00-1.8115 0l-3.2725 7A.9977.9977 0 002 16.9998v.7275a4.2727 4.2727 0 008.5454 0v-.7275a.9977.9977 0 00-.0942-.4233zm-.9057 2.7846l1.7014 3.6387H4.5713zm.0005 7.6387a2.268 2.268 0 01-2.2454-2h4.4902a2.268 2.268 0 01-2.2448 2zM18.6558 7.5765a.9997.9997 0 00-1.8116 0l-3.273 7a.9977.9977 0 00-.0941.4233v.7275a4.2727 4.2727 0 008.5454 0l.0005-.726a.997.997 0 00-.0943-.4248zm-.9058 2.7841l1.7017 3.6392h-3.4032zm0 7.6392a2.268 2.268 0 01-2.2454-2h4.4903a2.268 2.268 0 01-2.2449 2z" /></svg>';
				div.style = 'float: right; margin-left: 5pt; margin-right: 5pt; padding: 0; visibility: visible; cursor: pointer;';
				div.className = 'compare-release';
				div.onclick = function(evt) {
					console.assert(evt.currentTarget instanceof HTMLElement);
					const setActive = (elem, active = true) => { elem.children[0].setAttribute('fill', active ? 'orange' : 'gray') };
					if (selected instanceof HTMLElement) {
						if (selected == evt.currentTarget) {
							selected = null;
							setActive(evt.currentTarget, false);
						} else {
							const target = evt.currentTarget;
							setActive(target, true);
							const trs = [selected, target].map(node => node.parentNode.parentNode);
							Promise.all(trs.map(releaseFingerprintFromTorrent)).then(function(releases) {
								try {
									const remarks = testSimilarity(...releases);
									if (remarks === false) return alert('Can not be compared for duplicity, either release is missing valid log files');
									const permaLink = document.location.origin + '/torrents.php?torrentid=${torrentid}';
									if (remarks === true) {
										var message = 'Identical rips';
										var report = `Identical rip to [url=${permaLink}]\${editiontitle}[/url]`;
									} else {
										message = 'Releases may be duplicates (ToC shift/drift + peaks are too similar)';
										if (remarks.length > 0) message += '\n\n' + (maxRemarks > 0 && remarks.length > maxRemarks ?
											remarks.slice(0, maxRemarks - 1).join('\n') + '\n...' : remarks.join('\n'));
										const shorten = (index, sameStr) => report[index].length == 1 && report[index][0].startsWith('Disc 1') ?
											report[index][0].replace(/^Disc\s+\d+\s+/, '') : report[index].length > 0 ? report[index].join(', ') : sameStr;
										report = [remark => remark.includes('shifted'), remark => remark.includes('post-gap')].map(fn => remarks.filter(fn));
										report = `Same pressing as [url=${permaLink}]\${editiontitle}[/url] possible (${shorten(0, 'similar ToC(s)/peaks')}${shorten(1, '') ? ' with post-gap' : ''})`;
									}
									const getTorrentText = elem => (elem = elem.querySelector('a[href="#"][onclick]')) != null ? elem.textContent : undefined;
									const characteristics = trs.map(tr => [
										/* 0 */ /\b(?:(?:Pre|De)[\-\− ]?emphas|Pre-?gap\b|HTOA\b|Hidden\s+track|Clean|Censor)/i.test(getEditionTitle(tr)), // allowed to coexist
										/* 1 */ tr.querySelector('strong.tl_reported') != null,
										/* 2 */ (function(numberColumns) { // seeds
											console.assert(numberColumns.length == 4);
											return numberColumns.length >= 3 ? parseInt(numberColumns[2].textContent) : -1;
										})(tr.getElementsByClassName('number_column')),
										/* 3 */ Array.prototype.some.call(tr.querySelectorAll('strong.tl_notice'), strong => strong.textContent.trim() == 'Trumpable'),
										/* 4 */ (text => (text = /\bLog\s*\((\-?\d+)\%\)/.exec(text)) != null ?
											(text = parseInt(text[1])) >= 100 ? 100 : text > 0 ? 50 : 0 : NaN)(getTorrentText(tr)),
										/* 5 */ /\bCue\b/i.test(getTorrentText(tr)),
										/* 6 */ getTorrentId(tr),
										/* 7 */ (function(tr) { // get timestamp from tooltip
											console.assert(tr != null);
											if (tr == null) return;
											let timeStamp = tr.querySelector('blockquote > span.time');
											console.assert(timeStamp != null, tr);
											if (timeStamp == null) return; else timeStamp = (typeof jQuery.fn.tooltipster == 'function' ?
												$(timeStamp).data('tooltipsterContent') || $(timeStamp).tooltipster('content') : undefined)
												|| timeStamp.title;
											console.assert(timeStamp, 'Timestamp not accessible from tooltip', tr.nextElementSibling);
											if (timeStamp) return new Date(timeStamp + ' UTC').getTime();
										})(tr.nextElementSibling),
									]);
									let userAuth = document.body.querySelector('input[name="auth"][value]');
									if (userAuth != null) userAuth = userAuth.value;
									if (!userAuth || characteristics.some(ch => ch[0] || ch[1])
											|| characteristics.filter(ch => ch[3]).length > 1) return alert(message);
									const indexByDelta = delta => delta > 0 ? 0 : delta < 0 ? 1 : -1;
									let trumpIndex = indexByDelta(Number(isNaN(characteristics[0][4])) - Number(isNaN(characteristics[1][4])));
									if (trumpIndex < 0) trumpIndex = indexByDelta(characteristics[1][4] - characteristics[0][4]);
									if (trumpIndex < 0) trumpIndex = indexByDelta(Number(characteristics[0][3]) - Number(characteristics[1][3]));
									if (trumpIndex < 0 && characteristics.every(ch => ch[4] >= 100))
										trumpIndex = indexByDelta(Number(characteristics[1][5]) - Number(characteristics[0][5]));
									let dupeIndex = trumpIndex < 0 ? indexByDelta(characteristics[0][6] - characteristics[1][6]) : -1;
									console.assert(trumpIndex < 0 != dupeIndex < 0);
									const preserveIndex = 1 - (trumpIndex < 0 ? dupeIndex : trumpIndex);
									// Unseeded test
									if (characteristics[preserveIndex][2] <= 0 && (!characteristics[preserveIndex][7]
											|| Date.now() - characteristics[preserveIndex][7] > noseedGracePeriod * 60 * 1000))
										return alert(message + '\n\nReporting not offered for lack of seeds');
									if (trumpIndex >= 0) {
										class ExtraInfo extends Array {
											constructor(torrentId) {
												super();
												if (torrentId > 0) torrentId = document.getElementById('release_' + torrentId); else return;
												if (torrentId != null) for (torrentId of torrentId.querySelectorAll(':scope > blockquote'))
													if ((torrentId = /^Trumpable For:\s+(.+)$/i.exec(torrentId.textContent.trim())) != null)
														Array.prototype.push.apply(this, torrentId[1].split(/\s*,\s*/));
											}
										}

										const extraInfo = new ExtraInfo(characteristics[trumpIndex][6]), trumpMappings = {
											lineage_trump: /\b(?:Lineage)\b/i,
											checksum_trump: /^(?:Bad\/No Checksum\(s\))$/i,
											tag_trump: /^(?:Bad Tags)$/i,
											folder_trump: /\b(?:Folder)\b/i,
											file_trump: /^(?:Bad File Names)$|\b(?:180)\b/i,
											pirate_trump: /\b(?:Pirate)\b/i,
										};
										var trumpType = 'trump';
										for (let type in trumpMappings) if (extraInfo.some(RegExp.prototype.test.bind(trumpMappings[type])))
											trumpType = type;
									}
									message += `\n\nProposed ${trumpIndex < 0 ? 'dupe' : trumpType.replace(/_/g, ' ')} report for ${getEditionTitle(trs[trumpIndex < 0 ? dupeIndex : trumpIndex])}`;
									if (!allowReports || trumpIndex >= 0 && (characteristics[trumpIndex][3] && trumpType == 'trump'
											|| characteristics.every(ch => ch[4] == 50))) return alert(message);
									if (confirm(message + `\n\nTake the report now?`)) LocalXHR.post('/reportsv2.php?action=takereport', new URLSearchParams({
										auth: userAuth,
										categoryid: 1,
										torrentid: characteristics[trumpIndex < 0 ? dupeIndex : trumpIndex][6],
										type: trumpIndex < 0 ? 'dupe' : trumpType,
										sitelink: permaLink.replace('${torrentid}', characteristics[1 - (trumpIndex < 0 ? dupeIndex : trumpIndex)][6]),
										extra: report.replace('${torrentid}', characteristics[1 - (trumpIndex < 0 ? dupeIndex : trumpIndex)][6])
											.replace('${editiontitle}', getEditionTitle(trs[1 - (trumpIndex < 0 ? dupeIndex : trumpIndex)])),
									}), { responseType: null }).then(status => { document.location.reload() }, alert);
								} catch(reason) { alert('Releases not duplicates for the reason ' + reason) }
							}, alert).then(function() {
								for (let elem of [selected, target]) setActive(elem, false);
								selected = null;
							});
						}
					} else setActive(selected = evt.currentTarget, true);
				};
				div.title = 'Compare with different CD for similarity';
				const anchor = tr.querySelector('span.torrent_action_buttons');
				if (anchor != null) anchor.after(div);
			}

			function scanGroup(evt) {
				const compareWorkers = [ ];
				torrents.forEach(function(torrent1, ndx1) {
					torrents.forEach(function(torrent2, ndx2) {
						if (ndx2 > ndx1) compareWorkers.push(Promise.all([torrent1, torrent2].map(releaseFingerprintFromTorrent)).then(function(releases) {
							try { return testSimilarity(...releases) ? [torrent1, torrent2] : null } catch(reason) { return null }
						}));
					});
				});
				if (compareWorkers.length > 0) Promise.all(compareWorkers).then(function(results) {
					if ((results = results.filter(Array.isArray)).length > 0) {
						results.forEach(function(sameTorrents, groupNdx) {
							const randColor = () => 0xD0 + Math.floor(Math.random() * (0xF8 - 0xD0));
							const color = ['#dff', '#ffd', '#fdd', '#dfd', '#ddf', '#fdf'][groupNdx]
								|| `rgb(${randColor()}, ${randColor()}, ${randColor()})`;
							for (let elem of sameTorrents) if ((elem = elem.querySelector('div.compare-release')) != null) {
								elem.style.padding = '2px';
								elem.style.border = '1px solid #808080';
								elem.style.borderRadius = '3px';
								elem.style.backgroundColor = color;
							}
						});
						alert('Similar CDs detected in these editions:\n\n' + results.map(sameTorrents =>
							'− ' + getEditionTitle(sameTorrents[0]) + '\n− ' + getEditionTitle(sameTorrents[1])).join('\n\n'));
					} else alert('No similar CDs detected');
				}, alert);
			}
			const container = document.body.querySelector('table#torrent_details > tbody > tr.colhead_dark > td:first-of-type');
			if (container != null) container.append(Object.assign(document.createElement('SPAN'), {
				className: 'brackets',
				textContent: 'Find CD dupes',
				style: 'margin-left: 5pt; margin-right: 5pt; float: right; cursor: pointer; font-size: 8pt;',
				onclick: scanGroup,
			}));
			GM_registerMenuCommand('Find CD dupes', scanGroup, 'd');
		}

		function duplicityPrecheck() {
			const dialog = document.createElement('dialog'), submit = 'Check for duplicity';
			dialog.innerHTML = `
<form method="dialog" style="padding: 1rem; background-color: darkslategray; color: white; display: flex; flex-flow: column nowrap; row-gap: 10pt;">
	<div name="cd-log-text">
		<div style="margin-bottom: 5pt;">Paste .LOG content (for multi disc albums paste all logs one after another)</div>
		<textarea rows="40" cols="80" spellcheck="false" wrap="off" style="font: 8pt monospace; padding: 5px; color: white; background-color: #152323;"></textarea>
	</div>
	<div name="cd-log-files">Or select file(s): <input type="file" accept=".log" multiple style="font-size: 9pt;" /></div>
	<div style="text-align: center; display: flex; flex-flow: row; justify-content: flex-start; column-gap: 10pt;">
		<input type="submit" value="${submit}" style="margin: 0;" />
		<input type="button" name="close" value="Close" style="margin: 0;" />
	</div>
</form>
`.replace(/\s*(?:\r?\n)+\s*/g, '');
			dialog.style = 'position: fixed; top: 0; left: 0; margin: auto; max-width: 75%; max-height: 90%; box-shadow: 5px 5px 10px black; z-index: 99999;';
			dialog.onclose = function(evt) {
				document.body.removeChild(evt.currentTarget);
				if (evt.currentTarget.returnValue != submit) return;
				const logFilesAdaptor = logFiles => (logFiles = getSessionsFromLogs(logFiles, true)) != null ?
					Promise.resolve(logFiles) : Promise.reject('No valid input');
				Promise.all(Array.from(form.querySelector('[name="cd-log-files"] input[type="file"]').files, file => new Promise(function(resolve, reject) {
					const fr = new FileReader;
					fr.onload = evt => { resolve(evt.currentTarget.result) };
					fr.onerror = evt => { reject('File reading error') };
					fr.readAsText(file);
				}))).then(logFilesAdaptor).catch(reason => logFilesAdaptor(Array.from(form.querySelectorAll('[name="cd-log-text"] textarea'), textArea => textArea.value)))
						.then(userSessions => Promise.all(torrents.map(torrent => releaseFingerprintFromTorrent(torrent).then(function(torrentRelease) {
					try {
						const remarks = testSimilarity(releaseFingerprintFromSessions(userSessions), torrentRelease, true);
						return remarks ? { torrent: torrent, remarks: remarks } : null;
					} catch(reason) { return null }
				}))).then(function(results) {
					if ((results = results.filter(result => result != null)).length > 0) {
						alert('This pressing is considered dupe to\n\n' + results.map(function(result, index) {
							let message = getEditionTitle(result.torrent);
							if (result.remarks === true) message += '\nIdentical rips';
							else if (Array.isArray(result.remarks) && result.remarks.length > 0)
								message += '\n' + result.remarks.map(remark => '\t' + remark).join('\n');
							return message;
						}).join('\n\n'));
					} else alert('This pressing is unique within the release group');
				})).catch(alert);
			};
			const form = dialog.firstElementChild;
			form.elements.namedItem('close').onclick = evt => { dialog.close() };
			document.body.append(dialog);
			dialog.showModal();
		}
		const linkbox = document.body.querySelector('div.header > div.linkbox');
		GM_registerMenuCommand('CD rip duplicity precheck', duplicityPrecheck, 'd');

		GM_registerMenuCommand('Public database duplicity precheck', function(evt) {
			function ctdbLookup2(toc) {
				if (!Array.isArray(toc)) throw 'Invalid argument';
				const url = new URL('https://db.cue.tools/lookup2.php');
				url.searchParams.set('ctdb', 1);
				url.searchParams.set('version', 3);
				url.searchParams.set('fuzzy', 1);
				url.searchParams.set('metadata', 'none');
				url.searchParams.set('toc', toc.join(':'));
				const saefInt = (base, property, radix) =>
					isNaN(property = parseInt(base.getAttribute(property), radix)) ? undefined : property;
				return GlobalXHR.get(url, { responseType: 'xml' }).then(({xml}) => Promise.all(Array.from(xml.getElementsByTagName('entry'), entry => (entry = {
					id: saefInt(entry, 'id'),
					confidence: saefInt(entry, 'confidence'),
					crc32: saefInt(entry, 'crc32', 16),
					toc: entry.hasAttribute('toc') ?
						entry.getAttribute('toc').split(':').map(offset => parseInt(offset)) : undefined,
					trackcrcs: entry.hasAttribute('trackcrcs') ?
						entry.getAttribute('trackcrcs').split(' ').map(crc => parseInt(crc, 16)) : undefined,
					hasparity: entry.getAttribute('hasparity') || undefined,
					npar: saefInt(entry, 'npar'), stride: saefInt(entry, 'stride'),
					syndrome: entry.getAttribute('syndrome') || undefined,
				})/*.hasparity ? GlobalXHR.get(entry.hasparity, { responseType: 'arraybuffer' })
					.then(({response}) => Object.assign(entry, { hasparity: response }), reason => entry) : entry*/)));
			}

			let url = prompt('Duplicity precheck using online database: feature designed to reveal possible duplicity of intended upload with unknown/unconfirmed release in group without having the physical media at hand\n\nEnter entry URL in public database:\n(it can be a CUETools DB entry link or MusicBrainz release link)\n\n');
			if (url == null) return; else try { url = new URL(url) } catch(e) { return alert(e) }
			switch (url.hostname) {
				case 'db.cue.tools': var parser = 'ctdb'; break;
				case 'musicbrainz.org': case 'beta.musicbrainz.org': case 'musicbrainz.eu':
					parser = 'musicbrainz';
					break;
				default: return alert('Invalid URL');
			}
			({
				ctdb: function(url) {
					try { url = new URL(url) } catch(e) { return Promise.reject('Invalid URL') }
					return url.hostname == 'db.cue.tools' ? GlobalXHR.get(url, { responseType: 'text' }).then(function({responseText}) {
						let entries = /\b(?:ctdbEntryData)\s*\(\s*(\{.+\})\s*\)/;
						if ((entries = [
							new RegExp(`^\\s*var\\s+data\\s*=\\s*${entries.source};\\s*$`, 'm'),
							entries,
						].reduce((match, rx) => match || rx.exec(responseText), null)) != null) entries = eval('(' + entries[1] + ')');
						else return Promise.reject('Invalid url or CTDB entry data could not be extracted');
						entries = entries.rows.map(function(row) {
							const entry = Object.assign.apply(null, entries.cols.map((col, index) => ({ [col.label]: row.c[index].v })));
							if (entry.TOC) entry.TOC = entry.TOC.split(':').map(offset => parseInt(offset)); else throw 'Assertion failed: no TOC table';
							if (entry['Track CRCs']) entry['Track CRCs'] = entry['Track CRCs'].split(' ').map(crc => parseInt(crc, 16));
							return entry;
						});
						console.assert(entries.length > 0, entries);
						return Object.freeze(Object.assign([Object.freeze(entries.map(entry => Object.freeze(Object.assign(Array.from(Array(entry.TOC.length - 1), (_, index) => Object.freeze(exportTocEntry({
							trackNumber: index + 1,
							startSector: entry.TOC[index],
							endSector: entry.TOC[index + 1] - 1,
							crc32: index > 0 && index < entry.TOC.length - 2 ? entry?.['Track CRCs']?.[index] : undefined,
						}))), { ctdbId: entry['CTDB Id'], tocId: entry['Disc Id'], crc32: entry.CRC32, conf: entry.Cf }))))], { source: 'ctdb' }));
					}) : Promise.reject('Invalid URL');
				},
				musicbrainz: function(url) {
					try { url = new URL(url) } catch(e) { return Promise.reject('Invalid URL') }
					if (!['musicbrainz.org', 'musicbrainz.eu'].includes(url.hostname.split('.').slice(-2).join('.'))) return Promise.reject('Invalid URL');
					url = /^\/release\/([\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12})\b/i.exec(url.pathname);
					if (url != null) url = url[1]; else return Promise.reject('Invalid URL');
					return GlobalXHR.get(`https://musicbrainz.org/ws/2/release/${url}?fmt=json&inc=media%2Bdiscids`, { responseType: 'json' }).then(function({json}) {
						const media = json.media.filter(medium => /^(?:(?:SHM-|HD|HQ|DTS |Enhanced |Blu-spec |Copy Control |Minimax |Mixed Mode )?CD|CD-R|(?:8cm )?CD(?:\+G)?|Hybrid SACD(?: \(CD layer\))?|DualDisc(?: \(CD side\))?)$/.test(medium.format) || !medium.format && medium?.discs?.length > 0);
						if (media.length <= 0) return Promise.reject('Release without CD media');
						if (!media.every(medium => medium?.discs?.length > 0)) return Promise.reject('Some media miss disc ID');
						return Promise.all(media.map(medium => Promise.all(medium.discs.map(function(discId) {
							const offsets = discId.offsets.concat(discId.sectors).map(offset => offset - 150);
							return ctdbLookup2(offsets).then(entries => entries.length > 0 ? entries : null, reason => null).then(entries => (entries || [null]).map(function(entry) {
								const tocMatch = entry != null && Array.isArray(entry.toc) && offsets.length == entry.toc.length;
								const tocEntries = Object.assign(Array.from(Array(discId['offset-count']), (_, index) => Object.freeze(exportTocEntry({
									trackNumber: index + 1,
									startSector: offsets[index],
									endSector: offsets[index + 1] - 1,
									crc32: tocMatch && index > 0 && index < discId['offset-count'] - 1 && entry.trackcrcs ?
										entry.trackcrcs[index] : undefined,
								}))), { discId: discId.id });
								if (tocMatch) Object.assign(tocEntries, {
									ctdbId: entry.id, confidence: entry.confidence, ctdbTocOffset: (function(toc) {
										const tocOffsets = offsets.map((offset, index) => toc[index] - offset);
										console.assert(Math.min.apply(null, tocOffsets) == Math.max.apply(null, tocOffsets), toc, offsets, tocOffsets);
										if (Math.min.apply(null, tocOffsets) == Math.max.apply(null, tocOffsets)) return tocOffsets[0];
									})(entry.toc), crc32: entry.crc32,
									//hasparity: entry.hasparity, npar: entry.npar, stride: entry.stride, syndrome: entry.syndrome,
								});
								return Object.freeze(tocEntries);
							}));
						})).then(discs => Object.assign(discs, { discIds: medium.discs.length }))))
							.then(releaseFingerprint => Object.freeze(Object.assign(releaseFingerprint.map(medium =>
								Object.freeze(Object.assign(Array.prototype.concat.apply([ ], medium),
									{ discIds: medium.discIds }))), { source: 'musicbrainz', id: json.id })));
					});
				},
			})[parser](url).then(function(publicRelease) {
				if (!(publicRelease instanceof Object)) throw 'Assertion failed: Invalid public release fingerprints';
				const discIdCounts = publicRelease.map(medium => medium.discIds);
				if ((publicRelease = (function discMapper(tocEntries = [ ]) {
					if (!(tocEntries.length < publicRelease.length)) return [Object.assign(tocEntries, {
						source: publicRelease.source,
						id: publicRelease.id,
					})];
					tocEntries = publicRelease[tocEntries.length].map(discid => discMapper(tocEntries.concat([discid])));
					return Array.prototype.concat.apply([ ], tocEntries);
				})()).length > 0) return Promise.all(torrents.map(torrent => releaseFingerprintFromTorrent(torrent).then(function(torrentRelease) {
					if (torrentRelease == null) return null;
					const evaluator = result => result.remarks.filter(RegExp.prototype.test.bind(/\b(?:checksums matched)\b/i)).length;
					const results = publicRelease.map(function(publicRelease) {
						try {
							const remarks = testSimilarity(publicRelease, torrentRelease, true);
							return remarks ? { remarks: remarks, torrent: torrent, publicRelease: publicRelease } : null;
						} catch(reason) { return null };
					}).filter(result => result != null).sort((a, b) => evaluator(b) - evaluator(a));
					return results.length > 0 ? results[0] : null;
				}))).then(function(results) {
					if ((results = results.filter(result => result != null)).length > 0) {
						const message = ['This edition may be dupe to'];
						Array.prototype.push.apply(message, results.map(function(result, index) {
							let message = getEditionTitle(result.torrent);
							if (Array.isArray(result.remarks) && result.remarks.length > 0)
								message += '\n' + result.remarks.map(remark => '    ' + remark).join('\n');
							return message;
						}));
						message.push('Note: peaks are not provided by public databases - unless checksums are matching, this edition still may be unique pressing');
						if (discIdCounts.some(count => count > 1) && publicRelease.some(publicRelease => publicRelease.source == 'musicbrainz'))
							message.push('Note: some media have multiple ToCs attached, consider the positive result uncertain');
						alert(message.join('\n\n'));
					} else alert('This pressing is unique within the release group');
				});
			}).catch(alert);
		});

		break;
	}
	case '/upload.php': {
		function installLogWatchers(logFields) {
			console.assert(logFields instanceof HTMLElement);
			if (!(logFields instanceof HTMLElement)) return;
			const selector = 'input[type="file"]', listener = ['input', function(evt) {
				if (form.querySelector('table#upload-assistant') != null) return;
				dupeStatus = undefined;
				let allLogs = Array.from(logFields.querySelectorAll(selector), input => Array.from(input.files));
				const allSlotsTaken = allLogs.every(files => files.length > 0);
				allLogs = Array.prototype.concat.apply([ ], allLogs)
					.filter(file => file.name.toLowerCase().endsWith('.log'));
				if (allLogs.length > 0) allLogs = Promise.all(allLogs.map(logFile => new Promise(function(resolve, reject) {
					const fr = new FileReader;
					fr.onload = evt => { resolve(evt.currentTarget.result) };
					fr.onerror = evt => { reject(`Log file reading error (${logFile.name})`) };
					fr.readAsText(logFile);
				}))); else return;
				if (!(torrents instanceof Promise)) torrents = queryAjaxAPI('torrentgroup', { id: groupId })
					.then(torrentGroup => torrentGroup.torrents.filter(torrent => torrent.hasLog && !torrent.reported));
				Promise.all([allLogs, torrents]).then(function([logs, torrents]) {
					if (logs == null || torrents.length <= 0) return;
					const userRelease = releaseFingerprintFromSessions(getSessionsFromLogs(logs, true));
					if (userRelease != null) Promise.all(torrents.map(torrent => releaseFingerprintFromTorrent(torrent.id).then(function(torrentRelease) {
						try {
							const remarks = testSimilarity(userRelease, torrentRelease, true);
							return remarks ? { torrent: torrent, remarks: remarks } : null;
						} catch(reason) { return null }
					}))).then(results => results.filter(result => result != null)).then(function(results) {
						const toMessage = torrents => torrents.map(function(result, index) {
							let message = `- Torrent #${result.torrent.id}: ${result.torrent.remasterYear > 0 ? `${result.torrent.remasterYear} - ${[
								'remasterRecordLabel',
								'remasterCatalogueNumber',
								'remasterTitle',
							].map(prop => result.torrent[prop]).filter(Boolean).join(' / ')}` : (result.torrent.remastered ? 'unknown' : 'unconfirmed') + ' edition'}`;
							const indent = ' '.repeat(8); // '\t';
							if (result.remarks === true) message += `\n${indent}Identical rips`;
							else if (Array.isArray(result.remarks) && result.remarks.length > 0)
								message += '\n' + result.remarks.map(remark => indent + remark).join('\n');
							return message;
						}).join('\n');
						const strictDupes = results.filter(result => !result.torrent.trumpable && result.torrent.logScore >= 100);
						if (strictDupes.length > 0) dupeStatus = 'Warning: this mastering will be considered dupe to these editions:\n\n' + toMessage(strictDupes);
						else if (results.length > 0) dupeStatus = 'Notice: unless uploading a trump, this mastering will be considered dupe to these editions:\n\n' + toMessage(results);
						if (dupeStatus) alert(dupeStatus + '\n\n(If uploading a multi disc release with more .log files left to add, the message should be ignored until last log is added)');
					}); else console.log('No valid logfiles attached');
				}).catch(alert);
			}], setLogWatcher = input => { input.addEventListener(...listener) };
			logFields.querySelectorAll(selector).forEach(setLogWatcher);
			let logsWatcher = new MutationObserver(function(ml, mo) {
				for (let mutation of ml) {
					for (let node of mutation.addedNodes) if (node.nodeType == Node.ELEMENT_NODE
							&& node.matches(selector)) setLogWatcher(node);
					for (let node of mutation.removedNodes) if (node.nodeType == Node.ELEMENT_NODE
							&& node.matches(selector)) node.removeEventListener(...listener);
				}
			});
			logsWatcher.observe(logFields, { childList: true });
		}

		if (document.body.querySelector('form#upload_table table#upload-assistant') != null) break;
		const groupId = parseInt(new URLSearchParams(document.location.search).get('groupid'));
		console.assert(groupId > 0);
		if (!(groupId > 0)) break;
		const form = document.body.querySelector('form#upload_table');
		if (form == null) break; // assertion failed
		const category = form.querySelector('select#categories');
		console.assert(category != null);
		if (category == null || category.options[category.selectedIndex].text != 'Music') break;
		let torrents, dupeStatus;
		installLogWatchers(form.querySelector('div#dynamic_form td#logfields'));
		// form.addEventListener('submit', function(evt) {
		// 	if (!dupeStatus || confirm(dupeStatus + '\n\nUpload anyway?')) return true;
		// 	evt.preventDefault();
		// 	return false;
		// });
		break;
	}
}
