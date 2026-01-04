// ==UserScript==
// @name         MB Release Seeding Helper
// @namespace    https://greasyfork.org/users/321857-anakunda
// @version      1.10
// @description  Give better clues on reusing of existing releases/recordings for new release
// @match        https://*musicbrainz.org/release/add
// @run-at       document-end
// @author       Anakunda
// @iconURL      https://musicbrainz.org/static/images/entity/release.svg
// @license      GPL-3.0-or-later
// @grant        GM_getValue
// @require      https://openuserjs.org/src/libs/Anakunda/libStringDistance.min.js
// @downloadURL https://update.greasyfork.org/scripts/472248/MB%20Release%20Seeding%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/472248/MB%20Release%20Seeding%20Helper.meta.js
// ==/UserScript==

'use strict';

const mbID = /([\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12})/i.source;
const rxMBID = new RegExp(`^${mbID}$`, 'i');
const createElements = (...tagNames) => tagNames.map(Document.prototype.createElement.bind(document));
const mbRequestRate = 1000, mbRequestsCache = new Map, titleDiffThreshold = 5 /* % */;
let mbLastRequest = null;
const debugMode = false;
const timeParser = str => (str = /\b(\d+):(\d+)\b/.exec(str)) != null ?
	(parseInt(str[1]) * 60 + parseInt(str[2])) * 1000 : undefined;

function mbApiRequest(endPoint, params) {
	function errorHandler(response) {
		console.error('HTTP error:', response);
		let reason = 'HTTP error ' + response.status;
		if (response.status == 0) reason += '/' + response.readyState;
		let statusText = response.statusText;
		if (response.response) try {
			if (typeof response.response.error == 'string') statusText = response.response.error;
		} catch(e) { }
		if (statusText) reason += ' (' + statusText + ')';
		return reason;
	}
	function timeoutHandler(response) {
		console.error('HTTP timeout:', response);
		let reason = 'HTTP timeout';
		if (response.timeout) reason += ' (' + response.timeout + ')';
		return reason;
	}

	if (!endPoint) throw 'Endpoint is missing';
	const url = new URL('/ws/2/' + endPoint.replace(/^\/+|\/+$/g, ''), document.location.origin);
	url.search = new URLSearchParams(Object.assign({ fmt: 'json' }, params));
	const cacheKey = url.pathname.slice(6) + url.search;
	if (mbRequestsCache.has(cacheKey)) return mbRequestsCache.get(cacheKey);
	const recoverableHttpErrors = [429, 500, 502, 503, 504, 520, /*521, */522, 523, 524, 525, /*526, */527, 530];
	const request = new Promise(function(resolve, reject) {
		function request() {
			if (mbLastRequest == Infinity) return setTimeout(request, 50);
			const availableAt = mbLastRequest + mbRequestRate, now = Date.now();
			if (now < availableAt) return setTimeout(request, availableAt - now); else mbLastRequest = Infinity;
			xhr.open('GET', url, true);
			xhr.setRequestHeader('Accept', 'application/json');
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			xhr.send();
		}

		let retryCounter = 0;
		const xhr = Object.assign(new XMLHttpRequest, {
			responseType: 'json',
			timeout: 60e3,
			onload: function() {
				mbLastRequest = Date.now();
				if (this.status >= 200 && this.status < 400) resolve(this.response);
				else if (recoverableHttpErrors.includes(this.status))
					if (++retryCounter < 60) setTimeout(request, 1000); else reject('Request retry limit exceeded');
				else reject(errorHandler(this));
			},
			onerror: function() { mbLastRequest = Date.now(); reject(errorHandler(this)); },
			ontimeout: function() { mbLastRequest = Date.now(); reject(timeoutHandler(this)); },
		});
		request();
	});
	mbRequestsCache.set(cacheKey, request);
	return request;
}

function mbIdExtractor(expr, entity) {
	if (!expr || !expr) return null;
	let mbId = rxMBID.exec(expr);
	if (mbId) return mbId[1].toLowerCase(); else if (!entity) return null;
	try { mbId = new URL(expr) } catch(e) { return null }
	return mbId.hostname.endsWith('musicbrainz.org')
		&& (mbId = new RegExp(`^\\/${entity}\\/${mbID}\\b`, 'i').exec(mbId.pathname)) != null ?
			mbId[1].toLowerCase() : null;
}

function textDiff(...strings) {
	if (strings.length < 1 || !strings.some(Boolean)) return [ ];
	if (!strings[1]) return [[-1, strings[0]]]; else if (!strings[0]) return [[+1, strings[1]]];
	if (strings[0] == strings[1]) return [[0, strings[0]]];
	let length, indexes = [ ];
	outer: for (length = Math.min(...strings.map(string => string.length)); length > 0; --length)
		for (indexes[0] = 0; indexes[0] <= strings[0].length - length; ++indexes[0])
			if ((indexes[1] = strings[1].indexOf(strings[0].slice(indexes[0], indexes[0] + length))) >= 0) break outer;
	console.assert(!(length > 0) || indexes.every(ndx => ndx >= 0), strings, length, indexes);
	return length > 0 ? textDiff(...strings.map((string, index) => string.slice(0, indexes[index])))
		.concat([[0, strings[0].slice(indexes[0], indexes[0] + length)]],
			textDiff(...strings.map((string, index) => string.slice(indexes[index] + length))))
				: [[-1, strings[0]]].concat(strings.slice(1).map(string => [+1, string]));
}

function diffsToHTML(elem, diffs, type) {
	if (!(elem instanceof HTMLElement) || !Array.isArray(diffs)) throw 'Invalid argument';
	while (elem.lastChild != null) elem.removeChild(elem.lastChild);
	for (let diff of diffs) if (diff[0] == type) elem.append(Object.assign(document.createElement('span'), {
		style: 'color: red;',
		textContent: diff[1],
	})); else if (diff[0] == 0) elem.append(diff[1]);
}

function recalcScore(row) {
	if (!(row instanceof HTMLTableRowElement)) return;
	if (row.nextElementSibling != null && row.nextElementSibling.matches('tr.similarity-score-detail'))
		row.nextElementSibling.remove();
	let mbid = row.querySelector('input[type="radio"][name="base-release"]');
	if (mbid != null) mbid = mbid.value; else return;
	if (dupesTbl.tHead.querySelector('tr > th.similarity-score') == null)
		dupesTbl.tHead.rows[0].insertBefore(Object.assign(document.createElement('th'), {
			className: 'similarity-score',
			textContent: 'Similarity',
		}), dupesTbl.tHead.rows[0].cells[2]);
	let score = row.querySelector('td.similarity-score');
	if (score == null) row.insertBefore(score = Object.assign(document.createElement('td'),
		{ className: 'similarity-score' }), row.cells[2]);
	[score.style, score.onclick] = ['text-align: center; padding: 0.2em 0.5em;', null];
	delete score.dataset.score;
	const media = Array.from(document.body.querySelectorAll('div#recordings fieldset table#track-recording-assignation'),
		(medium, mediumIndex) => ({ tracks: Array.from(medium.querySelectorAll('tbody > tr.track'), function(track, trackIndex) {
			let position = track.querySelector('td.position');
			position = position != null ? position.textContent.trim() : undefined;
			let name = track.querySelector('td.name');
			name = name != null ? name.textContent.trim() : undefined;
			let length = track.querySelector('td.length');
			length = length != null ? timeParser(length.textContent) : undefined;
			let artists = track.nextElementSibling != null && track.nextElementSibling.matches('tr.artist') ?
				track.nextElementSibling.cells[0] : null;
			artists = artists != null && artists.querySelectorAll('span.deleted').length <= 0 ?
				Array.from(artists.getElementsByTagName('a'), artist => ({
					id: mbIdExtractor(artist.href, 'artist'),
					name: artist.textContent.trim(),
					join: artist.nextSibling != null && artist.nextSibling.nodeType == Node.TEXT_NODE ?
						artist.nextSibling.textContent : undefined,
				})).filter(artist => artist.id) : undefined;
			if (artists && artists.length <= 0) artists = undefined;
			return { title: name, length: length, artists: artists };
		}) }));
	if (!media.some(medium => medium.tracks.some(track => track.title))) {
		score.textContent = '---';
		return;
	}
	document.body.querySelectorAll('div#tracklist fieldset.advanced-medium').forEach(function(medium, mediumIndex) {
		let format = medium.querySelector('td.format > select');
		format = format != null && format.selectedIndex > 0 ? format.options[format.selectedIndex].text.trim() : undefined;
		let title = medium.querySelector('td.format > input[type="text"]');
		title = title != null ? title.value.trim() : undefined;
		if (media[mediumIndex]) Object.assign(media[mediumIndex], { format: format, title: title });
	});
	const dataTrackFormats = ['Enhanced CD'];
	let mediaTracks = row.querySelector('td[data-bind="text: tracks"]');
	if (mediaTracks != null) mediaTracks = mediaTracks.textContent.split(' + ').map(tt => parseInt(tt));
	let mediaFormats = row.querySelector('td[data-bind="text: formats"]');
	if (mediaFormats != null) mediaFormats = mediaFormats.textContent.split(' + ')
		.map(format => !/^(?:Unknown(?: Medium)?|Medium)$/.test(format = format.trim()) ? format : undefined);
	let preCheck = mediaTracks && mediaTracks.length > 0 && mediaTracks.every(tt => tt > 0) ?
			mediaTracks.length == media.length && mediaTracks.every(function(tt, mediaIndex) {
		if (media[mediaIndex].tracks.length == tt) return true;
		if (mediaFormats && mediaFormats[mediaIndex] && !dataTrackFormats.includes(mediaFormats[mediaIndex]))
			return false;
		if (!(medium => medium && (!medium.format || dataTrackFormats.includes(medium.format)))(media[mediaIndex]))
			return false;
		return media[mediaIndex].tracks.length >= tt;
	}) : undefined;
	(preCheck != false ? mbApiRequest('release/' + mbid, { inc: 'artist-credits+recordings' }).then(function(release) {
		function backgroundByScore(elem, score) {
			elem.style.backgroundColor =
				`rgb(${Math.round((1 - score) * 0xFF)}, ${Math.round(score * 0xFF)}, 0, 0.25)`;
		}

		if (release.media.length != media.length) throw 'Media counts mismatch';
		const [tr, td, table, thead, trackNo, artist1, title1, dur1, artist2, title2, dur2] =
			createElements('tr', 'td', 'table', 'thead', 'th', 'th', 'th', 'th', 'th', 'th', 'th');
		tr.style = 'background-color: unset;';
		table.className = 'media-comparison';
		table.style = 'padding-left: 20pt; border-collapse: separate; border-spacing: 0;';
		[tr.className, tr.hidden, td.colSpan] = ['similarity-score-detail', true, 10];
		[
			trackNo.textContent,
			artist1.textContent, title1.textContent, dur1.textContent,
			artist2.textContent, title2.textContent, dur2.textContent,
		] = ['Pos', 'Release artist', 'Release title', 'Len', 'Seeded artist', 'Seeded title', 'Len'];
		[trackNo, artist1, title1, dur1, artist2, title2, dur2]
			.forEach(elem => { elem.style = 'padding: 0 5pt; text-align: left;' });
		[trackNo, artist1, title1, dur1, artist2, title2, dur2]
			.forEach(elem => { elem.style.borderTop = elem.style.borderBottom = 'solid 1px #999' });
		[dur1, dur2].forEach(elem => { elem.style.whiteSpace = 'nowrap' });
		thead.append(trackNo, artist1, title1, dur1, artist2, title2, dur2); table.append(thead);
		const scoreToText = score => (score * 100).toFixed(0) + '%';
		const scores = Array.prototype.concat.apply([ ], release.media.map(function(medium, mediumIndex) {
			const tracks = (medium.tracks || [ ]).concat(medium['data-tracks'] || [ ]);
			if (tracks.length != media[mediumIndex].tracks.length)
				throw `Medium ${mediumIndex + 1} tracklist length mismatch`;
			const [tbody, thead, mediumNo, mediumTitle1, mediumTitle2] =
				createElements('tbody', 'tr', 'td', 'td', 'td');
			tbody.className = `medium-${mediumIndex + 1}-tracks`;
			[thead.className, thead.style] = ['medium-header', 'font-weight: bold;'];
			let mediaTitles = [
				'#' + (mediumIndex + 1),
				medium.format || 'Unknown medium',
				media[mediumIndex].format || 'Unknown medium',
			];
			if (medium.title) mediaTitles[1] += ': ' + medium.title;
			if (media[mediumIndex].title) mediaTitles[2] += ': ' + media[mediumIndex].title;
			[mediumTitle1, mediumTitle2].forEach(elem => { elem.colSpan = 3 });
			[mediumNo.textContent, mediumTitle1.textContent, mediumTitle2.textContent] = mediaTitles;
			[mediumNo, mediumTitle1, mediumTitle2].forEach(elem =>
				{ elem.style = 'padding: 3pt 5pt; border-top: dotted 1px #999; border-bottom: dotted 1px #999;' });
			mediumNo.style.textAlign = 'right';
			thead.append(mediumNo, mediumTitle1, mediumTitle2); tbody.append(thead);
			const scores = tracks.map(function(track, trackIndex) {
				function insertArtists(elem, artists) {
					if (Array.isArray(artists)) artists.forEach(function(artistCredit, index, array) {
						elem.append(Object.assign(document.createElement('a'), {
							href: `/artist/${artistCredit.id}/recordings`, target: '_blank',
							textContent: artistCredit.name,
						}));
						if (index > array.length - 2) return;
						elem.append(artistCredit.join || (index < array.length - 2 ? ', ' : ' & '));
					});
				}

				const seedTrack = media[mediumIndex].tracks[trackIndex];
				const [tr, trackNo, artist1, title1, dur1, artist2, title2, dur2, recording] =
					createElements('tr', 'td', 'td', 'td', 'td', 'td', 'td', 'td', 'a');
				const trackTitle = titleFromRecording && track.recording && track.recording.title || track.title;
				let score = similarity(seedTrack.title, trackTitle);
				[title1, title2].forEach(elem => { backgroundByScore(elem, score); elem.dataset.score = score });
				if (score < titleDiffThreshold / 100) {
					[title1, title2].forEach(elem => { elem.style.color = 'red' });
					tr.classList.add('highlight');
				}
				const trackLength = timeFromRecording && track.recording && track.recording.length
					|| timeParser(track.length) || track.length;
				if (trackLength > 0 && seedTrack.length > 0) {
					let delta = Math.abs(trackLength - seedTrack.length);
					if (delta > 5000) score *= 0.1;
					[dur1, dur2].forEach(elem => { backgroundByScore(elem, delta > 5000 ? 0 : 1 - delta / 10000) });
				}
				if (seedTrack.artists) {
					if (seedTrack.artists.length != track['artist-credit'].length
							|| !seedTrack.artists.every(seedArtist => track['artist-credit']
								.some(artistCredit => artistCredit.artist.id == seedArtist.id))) {
						score *= 0.75;
						[artist1, artist2].forEach(elem => { backgroundByScore(elem, 0) });
					} else [artist1, artist2].forEach(elem => { backgroundByScore(elem, 1) });
				}
				trackNo.textContent = trackIndex + 1;
				insertArtists(artist1, track['artist-credit'].map(artistCredit => ({
					id: artistCredit.artist.id,
					name: artistCredit.name,
					join: artistCredit.joinphrase,
				})));
				if (seedTrack.artists) insertArtists(artist2, seedTrack.artists);
					else [artist2.textContent, artist2.style.color] = ['???', 'grey'];
				[recording.href, recording.target] = ['/recording/' + track.recording.id, '_blank'];
				recording.dataset.title = recording.textContent = trackTitle;
				recording.style.color = 'inherit';
				title1.append(recording);
				title2.dataset.title = title2.textContent = seedTrack.title;
				[recording, title2].forEach(elem => { elem.className = 'name' });
				[dur1.textContent, dur2.textContent] = [trackLength, seedTrack.length].map(length =>
					length > 0 ? Math.floor((length = Math.round(length / 1000)) / 60) + ':' +
						(length % 60).toString().padStart(2, '0') : '?:??');
				[dur1, dur2].forEach(elem => { if (!timeParser(elem.textContent)) elem.style.color = '#aaa' });
				[trackNo, artist1, title1, dur1, artist2, title2, dur2]
					.forEach(elem => { elem.style.padding = '0 5pt' });
				[trackNo, dur1, dur2].forEach(elem => { elem.style.textAlign = 'right' });
				[tr.className, tr.title, tr.dataset.score] = ['track', scoreToText(score), score];
				tr.append(trackNo, artist1, title1, dur1, artist2, title2, dur2); tbody.append(tr);
				for (let td of tr.cells) if (!td.style.backgroundColor) backgroundByScore(td, score);
				return score;
			});
			table.append(tbody);
			const loScore = Math.min(...scores);
			backgroundByScore(thead, loScore);
			const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
			thead.title = `Average score ${scoreToText(avgScore)} (worst: ${scoreToText(loScore)})`;
			thead.dataset.score = avgScore;
			return scores;
		}));
		const loScore = Math.min(...scores);
		const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
		[score.textContent, score.dataset.score] = [scoreToText(avgScore), avgScore];
		score.style.cursor = 'pointer';
		score.style.color = '#' + ((Math.round((1 - avgScore) * 0x80) * 2**16) +
			(Math.round(avgScore * 0x80) * 2**8)).toString(16).padStart(6, '0');
		if (loScore >= 0.8) score.style.fontWeight = 'bold';
		backgroundByScore(score, loScore);
		score.onclick = function(evt) {
			const tr = evt.currentTarget.parentNode.nextElementSibling;
			console.assert(tr != null);
			if (tr == null) return alert('Assertion failed: table row not exist');
			if (!(tr.hidden = !tr.hidden)) for (let row of tr.querySelectorAll('table.media-comparison > tbody > tr.track')) {
				if (row.classList.contains('highlight')) continue; else row.classList.add('highlight');
				const nodes = row.getElementsByClassName('name');
				if (nodes.length < 2) continue; // assertion failed
				const diffs = textDiff(...Array.from(nodes, node => node.dataset.title));
				diffsToHTML(nodes[0], diffs, -1);
				diffsToHTML(nodes[1], diffs, +1);
			}
		};
		score.title = 'Worst track: ' + scoreToText(loScore);
		td.append(table); tr.append(td); row.after(tr);
	}) : Promise.reject('Media/track counts mismatch')).catch(function(reason) {
		score.textContent = /\b(?:mismatch)\b/i.test(reason) ? 'Mismatch' : 'Error';
		[score.style.color, score.title] = ['red', reason];
	});
}

function recalcScores() {
	if (debugMode) console.trace('recalcScores()');
	for (let tBody of dupesTbl.tBodies) for (let row of tBody.rows) recalcScore(row);
}

function installObserver(node, changeListener) {
	const mo = new MutationObserver(function(ml) {
		for (let mutation of ml) {
			for (let node of mutation.removedNodes) changeListener(node, 'remove', true);
			for (let node of mutation.addedNodes) changeListener(node, 'add', true);
		}
	});
	mo.observe(node, { childList: true });
	return mo;
}

function mediumChangeListener(node, action, autoRecalc = false) {
	if (debugMode) console.debug('mediumChangeListener(%o)', node);
	if (!(node instanceof HTMLTableRowElement)) return; else if (action == 'add') {
		if (node.classList.contains('track')) {
			const bdi = node.querySelector('td.name > bdi');
			console.assert(bdi != null && bdi.firstChild != null, node);
			if (bdi != null && bdi.firstChild != null) (node.trackListener = new MutationObserver(recalcScores))
				.observe(bdi.firstChild, { characterData: true });
		} else if (node.classList.contains('artist')) {
			const td = node.cells[0];
			console.assert(td instanceof HTMLTableCellElement, node);
			if (td instanceof HTMLTableCellElement) (node.trackListener = new MutationObserver(function(ml) {
				// for (let mutation of ml) {
				// 	for (let node of mutation.removedNodes) if (node.trackListener instanceof MutationObserver) {
				// 		node.trackListener.disconnect();
				// 		if (debugMode) alert('disconnected 1!');
				// 	}
				// 	for (let node of mutation.addedNodes) if (node.nodeName == 'SPAN') (node.trackListener = new MutationObserver(function(ml) {
				// 		if (debugMode) alert('MutationObserver(TD)');
				// 		if (ml.some(mutation => mutation.addedNodes.length > 0)) {
				// 			recalcScores();
				// 			if (debugMode) alert('recalc()!');
				// 		}
				// 	})).observe(node, { childList: true });
				// }
				recalcScores();
			})).observe(td, { childList: true });
		}
	} else if (action == 'remove') {
		// if (node.classList.contains('artist')) {
		// 	const td = node.cells[0];
		// 	if (td instanceof HTMLTableCellElement) for (let node of td.children)
		// 		if (node.trackListener instanceof MutationObserver) {
		// 			node.trackListener.disconnect();
		// 			if (debugMode) alert('disconnected 2!');
		// 		}
		// }
		if (node.trackListener instanceof MutationObserver) node.trackListener.disconnect();
	}
	if (autoRecalc && node.classList.contains('artist')) recalcScores();
}

function mediaChangeListener(node, action, autoRecalc = false) {
	if (debugMode) console.debug('mediaChangeListener(%o)', node);
	if (!(node instanceof HTMLTableSectionElement)) return;
	for (let track of node.rows) mediumChangeListener(track, action, false);
	if (action == 'add') node.mediumListener = installObserver(node, mediumChangeListener);
	else if (action == 'remove' && node.mediumListener instanceof MutationObserver) node.mediumListener.disconnect();
	if (autoRecalc) recalcScores();
}

function releaseChangeListener1(node, action, autoRecalc = false) {
	if (debugMode) console.debug('releaseChangeListener1(%o)', node);
	if (!(node instanceof HTMLFieldSetElement)
			|| (node = node.querySelector('table#track-recording-assignation')) == null) return;
	for (let tBody of node.tBodies) mediaChangeListener(tBody, action, false);
	if (action == 'add') node.mediaListener = installObserver(node, mediaChangeListener);
	else if (action == 'remove' && node.mediaListener instanceof MutationObserver) node.mediaListener.disconnect();
	if (autoRecalc) recalcScores();
}

function releaseChangeListener2(node, action, autoRecalc = false) {
	if (debugMode) console.debug('releaseChangeListener2(%o)', node);
	if (!(node instanceof HTMLFieldSetElement) || !node.classList.contains('advanced-medium')
			|| (node = node.querySelector('table.advanced-format > tbody > tr > td.format')) == null) return;
	['select', 'input[type="text"]'].map(selector => node.querySelector(':scope > ' + selector))
		.forEach(elem => { if (elem != null) elem[action + 'EventListener']('change', recalcScores) });
	//if (autoRecalc) recalcScores();
}

function highlightTrack(tr) {
	if (!(tr instanceof HTMLTableRowElement)) throw 'Invalid argument';
	if (debugMode) console.trace('highlightTrack(...)');
	const bdis = tr.querySelectorAll('td.name > bdi, td.name :not(span.comment) bdi');
	const lengths = tr.querySelectorAll('td.length');
	bdis.forEach(bdi => { if (bdi.childElementCount <= 0) bdi.dataset.title = bdi.textContent.trim() });
	const titles = Array.from(bdis, bdi => bdi.dataset.title);
	if (bdis.length < 2 || titles[0] == titles[1]) bdis.forEach(function(bdi) {
		bdi.style.color = null;
		bdi.style.backgroundColor = titles[0] == titles[1] ? '#0f01' : null;
		if (bdi.dataset.title && bdi.childElementCount > 0) bdi.textContent = bdi.dataset.title;
	}); else {
		const score = similarity(...titles);
		bdis.forEach(bdi => { bdi.style.backgroundColor = `rgb(255, 0, 0, ${0.3 - 0.2 * score})` });
		console.debug('Score:', score);
		if (score < titleDiffThreshold / 100) bdis.forEach(function(bdi) {
			bdi.style.color = 'red';
			if (bdi.dataset.title && bdi.childElementCount > 0) bdi.textContent = bdi.dataset.title;
		}); else {
			bdis.forEach(bdi => { bdi.style.color = null });
			const diffs = textDiff(...titles);
			diffsToHTML(bdis[0], diffs, -1);
			diffsToHTML(bdis[1], diffs, +1);
		}
	}
	const times = Array.from(lengths, td => timeParser(td.textContent));
	if (times.length >= 2 && times.every(Boolean)) {
		const delta = Math.abs(times[0] - times[1]);
		let styles = delta > 5000 ? ['color: white', 'font-weight: bold'] : [ ];
		styles.push('background-color: ' +
			(delta > 5000 ? '#f00' : delta < 1000 ? '#0f01' : `rgb(255, 0, 0, ${delta / 25000})`));
		styles = styles.map(style => style + ';').join(' ');
		lengths.forEach(td => { td.innerHTML = `<span style="${styles}">${td.textContent}</span>` });
	} else lengths.forEach(td => { td.textContent = td.textContent.trim() });
	lengths.forEach(td => { td.style.color = timeParser(td.textContent) > 0 ? null : 'grey' });
	let artists = tr.nextElementSibling;
	if (artists != null && artists.matches('tr.artist') && (artists = artists.cells).length > 0)
		for (let as of (artists = Array.from(artists, cell => cell.getElementsByTagName('a')))) for (let a of as)
			a.style.backgroundColor = artists.length >= 2 && artists.every(as => as.length > 0)
				&& (a = mbIdExtractor(a.href, 'artist')) ? artists.every(as =>
					Array.prototype.some.call(as, a2 => mbIdExtractor(a2, 'artist') == a)) ? '#0f01' : '#f002' : null;
}

function highlightAssocBubble(tr, bubbleTr) {
	if (!(tr instanceof HTMLTableRowElement) || !(bubbleTr instanceof HTMLTableRowElement)) throw 'Invalid argument';
	if (bubbleTr.querySelector('td.select') == null) return;
	const bdi = tr.querySelectorAll('td.name > bdi, td.name :not(span.comment) bdi')[0];
	const bubbleName = bubbleTr.querySelector('td.recording bdi');
	if (bdi && bubbleName != null) {
		const titles = [bdi.dataset.title, bubbleName.textContent.trim()];
		if (titles[0] == titles[1]) bubbleName.style.backgroundColor = '#0f01'; else {
			const score = similarity(...titles);
			bubbleName.style.backgroundColor = `rgb(255, 0, 0, ${0.3 - 0.2 * score})`;
			if (score < titleDiffThreshold / 100) bubbleName.style.color = 'red'; else {
				const diffs = textDiff(...titles);
				diffsToHTML(bubbleName, diffs, +1);
			}
		}
	}
	const length = tr.querySelectorAll('td.length')[0], bubbleLength = bubbleTr.querySelector('td.length');
	if (length && bubbleLength != null) {
		const times = [length, bubbleLength].map(td => timeParser(td.textContent));
		if (isNaN(times[1])) bubbleLength.style.color = 'grey';
		const delta = Math.abs(times[0] - times[1]);
		if (!isNaN(delta)) {
			let styles = delta > 5000 ? ['color: white', 'font-weight: bold'] : [ ];
			styles.push('background-color: ' +
				(delta > 5000 ? '#f00' : delta < 1000 ? '#0f01' : `rgb(255, 0, 0, ${delta / 25000})`));
			styles = styles.map(style => style + ';').join(' ');
			bubbleLength.innerHTML = `<span style="${styles}">${bubbleLength.textContent}</span>`;
		}
	}
	let artists = tr.nextElementSibling, bubbleArtists = bubbleTr.querySelector('td.artist');
	if (artists != null && artists.matches('tr.artist') && (artists = artists.cells[0]) && bubbleArtists != null) {
		[artists, bubbleArtists] = [artists, bubbleArtists].map(root => root.getElementsByTagName('a'));
		for (let bubbleArtist of bubbleArtists) {
			const arid = mbIdExtractor(bubbleArtist.href, 'artist');
			if (arid) bubbleArtist.style.backgroundColor = Array.prototype.some.call(artists,
				artist => mbIdExtractor(artist, 'artist') == arid) ? '#0f01' : '#f002';
		}
	}
}

const timeFromRecording = GM_getValue('time_from_recording', true);
const titleFromRecording = GM_getValue('title_from_recording', false);
const dupesTbl = document.body.querySelector('div#duplicates-tab > fieldset table');
if (dupesTbl == null) return;
// const similarityAlgo = (strA, strB) => Math.pow(0.985, sift4distance(strA, strB, 5, {
// 	tokenizer: characterFrequencyTokenizer,
// localLengthEvaluator: rewardLengthEvaluator,
// 	//transpositionsEvaluator: longerTranspositionsAreMoreCostly,
// }));
const similarityAlgo = (strA, strB) => Math.pow(jaroWinklerSimilarity(strA, strB), 6);
const similarity = (...str) => (str = str.slice(0, 2)).every(Boolean) ?
	similarityAlgo(...str.map(title => title.toLowerCase())) : 0;
for (let tBody of dupesTbl.tBodies) new MutationObserver(function(ml) {
	for (let mutation of ml) {
		for (let node of mutation.removedNodes) if (node.tagName == 'TR' && node.nextElementSibling != null
				&& node.nextElementSibling.matches('tr.similarity-score-detail')) node.nextElementSibling.remove();
		mutation.addedNodes.forEach(recalcScore);
	}
}).observe(tBody, { childList: true });
let root = document.querySelector('div#recordings');
if (root != null) new MutationObserver(function(ml) {
	for (let mutation of ml) {
		const active = mutation.target.style.display != 'none';
		mutation.target.querySelectorAll('table#track-recording-assignation > tbody > tr.artist').forEach(function(tr) {
			const td = tr.cells[1];
			if (active) {
				const trTrack = tr.previousElementSibling;
				console.assert(trTrack instanceof HTMLTableRowElement && trTrack.classList.contains('track'), tr);
				if (trTrack instanceof HTMLTableRowElement && trTrack.classList.contains('track')) highlightTrack(trTrack);
				console.assert(td instanceof HTMLTableCellElement, tr);
				if (td instanceof HTMLTableCellElement) (tr.recordingListener = new MutationObserver(function(ml) {
					for (let mutation of ml) {
						for (let node of mutation.removedNodes) if (node.recordingListener instanceof MutationObserver)
							node.recordingListener.disconnect();
						for (let node of mutation.addedNodes) if (node.nodeName == 'SPAN')
							(node.recordingListener = new MutationObserver(ml =>
								{ if (ml.some(mutation => mutation.addedNodes.length > 0)) highlightTrack(trTrack) }))
									.observe(node, { childList: true });
					}
					highlightTrack(trTrack);
				})).observe(td, { childList: true });
			} else {
				if (td instanceof HTMLTableCellElement) for (let node of td.children)
					if (node.recordingListener instanceof MutationObserver) node.recordingListener.disconnect();
				if (tr.recordingListener instanceof MutationObserver) tr.recordingListener.disconnect();
			}
		});
	}
}).observe(root, { attributes: true, attributeFilter: ['style'] });
if (root == null || (root = root.querySelector('div.half-width > div')) == null) return;
let fieldsets = root.getElementsByTagName('fieldset');
for (let fieldset of fieldsets) releaseChangeListener1(fieldset, 'add', false);
installObserver(root, releaseChangeListener1);
if (fieldsets.length > 0) recalcScores();
if (debugMode) new MutationObserver(ml => { console.debug('Child list changed:', ml) })
	.observe(root, { childList: true, subtree: true });
root = document.body.querySelector('div#tracklist > div[data-bind="with: rootField.release"]');
if (root != null) fieldsets = root.querySelectorAll('fieldset.advanced-medium'); else return;
for (let fieldset of fieldsets) releaseChangeListener2(fieldset, 'add', false);
installObserver(root, releaseChangeListener2);
const assocBubble = document.getElementById('recording-assoc-bubble');
if (assocBubble != null) {
	const assocBubbleListener = new MutationObserver(function(ml, mo) {
		for (let mutation of ml) {
			for (let node of mutation.addedNodes) if (node.nodeName == 'TBODY') {
				const tr = assocBubble.bubbleDoc.control.closest('tr.track');
				if (!(tr instanceof HTMLTableRowElement)) continue;
				(node.recordingListener = new MutationObserver(function(ml, mo) {
					for (let mutation of ml) for (let node of mutation.addedNodes)
						if (node.nodeName == 'TR') highlightAssocBubble(tr, node);
				})).observe(node, { childList: true });
				for (let row of node.rows) highlightAssocBubble(tr, row);
			}
			for (let node of mutation.removedNodes) if (node.nodeName == 'TBODY' && node.recordingListener)
				node.recordingListener.disconnect();
		}
	});
	assocBubbleListener.observe(assocBubble.querySelector(':scope > table'), { childList: true });
}
