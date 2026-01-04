// ==UserScript==
// @name         MB Auto Track Lengths from CD TOC
// @version      1.14
// @match        https://musicbrainz.org/release/*
// @match        https://beta.musicbrainz.org/release/*
// @match        https://musicbrainz.org/cdtoc/*
// @match        https://beta.musicbrainz.org/cdtoc/*
// @run-at       document-end
// @author       Anakunda
// @namespace    https://greasyfork.org/users/321857
// @copyright    2024, Anakunda (https://greasyfork.org/users/321857)
// @license      GPL-3.0-or-later
// @description  Autoset track lengths from unique CD-TOC
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @require      https://openuserjs.org/src/libs/Anakunda/xhrLib.min.js
// @downloadURL https://update.greasyfork.org/scripts/493916/MB%20Auto%20Track%20Lengths%20from%20CD%20TOC.user.js
// @updateURL https://update.greasyfork.org/scripts/493916/MB%20Auto%20Track%20Lengths%20from%20CD%20TOC.meta.js
// ==/UserScript==

'use strict';

const loggedIn = document.body.querySelector('div.links-container > ul.menu > li.account') != null;
if (!loggedIn) console.warn('Not logged in: the script functionality is limited');
const getTime = text => text ? text.split(':').reverse()
	.reduce((t, v, n) => t + parseInt(v) * Math.pow(60, n), 0) : NaN;

function getDiscIdDeltas(document = window.document) {
	if (!(document instanceof HTMLDocument)) throw 'Invalid argument';
	return Array.from(document.body.querySelectorAll('div#page > table.wrap-block.details'), function(track) {
		const times = ['old', 'new'].map(function(cls) {
			if ((cls = track.querySelector('td.' + cls)) != null) cls = cls.textContent; else return NaN;
			return getTime(cls);
		});
		return Math.abs(times[1] - times[0]);
	});
}

const computeCompoundScore = deltas => Array.isArray(deltas) ? (deltas = deltas.filter(delta => !isNaN(delta)))
	.length > 0 ? deltas.reduce((score, delta) => score + (isNaN(delta) ? 0 : delta), 0) / deltas.length : 0 : NaN;

// State bits for medium
// 7 - disc id(s) attached
// 6 - set times enabled for this id
// 4-5 - similarity level 0-3
// 3 - unique id
// 2 - set times enabled for all ids
// 1 - all ids similar
// 0 - applied now

function tooltipFromState(state, param) {
	if (state < 0) return 'Unhandled error occured (see browser console for more details)';
	if ((state >> 7 & 1) == 0) return 'No disc IDs attached';
	if ((state >> 0 & 1) != 0) return 'TOC lengths successfully applied on tracks';
	if ((state >> 6 & 1) == 0) return 'Track times match CD TOC';
	if ((state >> 3 & 0b11111) == 0b11111) return loggedIn ? 'Unique CD TOC available to apply' : 'Unique CD TOC';
	if ((state >> 3 & 1) == 0 && param != undefined) {
		let title = 'Ambiguity: multiple disc IDs attached to medium';
		if ((state >> 4 & 0b11) < 0b11) title += ' (some suspicious)';
		return title;
	} else if ((state >> 4 & 0b11) < 0b11)
		return `Suspicious CD TOC (${(state >> 4 & 0b11) < 2 ? 'severe' : 'considerable'} timing differences)`;
	if ((state >> 4 & 0b1111) == 0b1111 && loggedIn) return 'CD TOC fine to apply';
}

function styleByState(element, state, considerAmbiguity = false) {
	console.assert(element instanceof HTMLElement);
	if (!(element instanceof HTMLElement)) throw 'Invalid argument';
	element.dataset.trackLengthsState = state.toString(2);
	if (element.offsetParent == null || (state & 1) != 0) return;
	if (state < 0) element.style = 'color: white; background-color: red;'; else {
		if ((state >> 4 & 0b11) < 1) element.style = 'color: #f00; background-color: #f002;';
		else if ((state >> 4 & 0b11) < 2) element.style = 'color: #f00;';
		else if ((state >> 4 & 0b11) < 3) element.style = 'color: #f60;';
		if (considerAmbiguity && (state >> 3 & 1) == 0) element.style.color = (state >> 4 & 0b11) < 3 ? '#f08' : '#d0d';
		if ((state >> 4 & 0b1111) == 0b1111) element.style.backgroundColor = '#0f01';
		if (loggedIn && (state >> 3 & 0b11111) == 0b11111) element.style.fontWeight = 'bold';
	}
	if (!element.title) {
		const tooltip = tooltipFromState(state, considerAmbiguity || undefined);
		if (tooltip) element.title = tooltip;
	}
}

function computeDifferenceState(deltas) {
	if (!Array.isArray(deltas)) throw 'Invalid argument';
	const loThreshold = 5, hiThreshold = 15;
	let q = (loThreshold + 0.5 - computeCompoundScore(deltas)) / (hiThreshold - loThreshold);
	q = Math.max(Math.min(Math.ceil(q), 1) + 2, 1);
	const hasPresence = (threshold, rate) =>
		deltas.filter(delta => delta >= threshold + 0.5).length >= deltas.length * rate;
	if ((deltas = deltas.filter(delta => !isNaN(delta))).length > 0
			&& (hasPresence(hiThreshold, 1/3) || hasPresence(loThreshold, 2/3))) --q; // q = 0;
	console.assert(q >= 0 && q <= 3, deltas, computeCompoundScore(deltas));
	return q << 4;
}

if (document.location.pathname.endsWith('/set-durations')) {
	const deltas = getDiscIdDeltas();
	const compoundScore = computeCompoundScore(deltas);
	const scoreElem = Object.assign(document.createElement('div'), {
		innerHTML: `<b>Average delta:</b> <span class="avg-delta">${compoundScore.toFixed(3)}s</span>`,
		style: 'margin-top: 4pt;',
		className: 'compound-score',
	});
	let anchor = document.body.querySelector('form[method="post"]');
	if (anchor != null) anchor = anchor.parentNode.querySelector(':scope > table.details:last-of-type');
	if (anchor != null) {
		anchor.after(scoreElem);
		if ((anchor = scoreElem.querySelector('span.avg-delta')) != null)
			styleByState(anchor, 0b11 << 6 | computeDifferenceState(deltas));
	}
	return;
}

let autoSet = loggedIn && GM_getValue('auto_set', true);
const flashElement = elem => elem instanceof HTMLElement ? elem.animate([
	{ offset: 0.0, opacity: 1 },
	{ offset: 0.4, opacity: 1 },
	{ offset: 0.5, opacity: 0.1 },
	{ offset: 0.9, opacity: 0.1 },
], { duration: 600, iterations: Infinity }) : null;
if ('mbDiscIdStates' in sessionStorage) try {
	var discIdStates = JSON.parse(sessionStorage.getItem('mbDiscIdStates'));
} catch(e) { console.warn(e) }
if (typeof discIdStates != 'object') discIdStates = { };
const getEntity = url => /^\/(\w+)\/([\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12})(?=[\/\?]|$)/i.exec(url.pathname);

if (loggedIn) {
	const setMenu = oldId => GM_registerMenuCommand(`Switch to ${autoSet ? 'conservative' : 'full auto'} mode`, function(param) {
		GM_setValue('auto_set', autoSet = !autoSet);
		if (autoSet) document.location.reload(); else menuId = setMenu(menuId);
	}, { id: oldId, autoClose: false, title: `Operating in ${autoSet ? 'full auto' : 'conservative'} mode

Full auto mode: autoset times in background and report the status as style/tooltip
Conservative mode: evaluate status in background and autoset times on user click` });
	let menuId = setMenu();
}

const mbRequestRate = 1000, mbRequestsCache = new Map;
let mbLastRequest = null;
function apiRequest(endPoint, params) {
	if (!endPoint) throw 'Endpoint is missing';
	const url = new URL('/ws/2/' + endPoint.replace(/^\/+|\/+$/g, ''), 'https://musicbrainz.org');
	if (params) for (let key in params) url.searchParams.set(key, params[key]);
	url.searchParams.set('fmt', 'json');
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
			ontimeout: function() {
				mbLastRequest = Date.now();
				console.error('HTTP timeout:', this);
				let reason = 'HTTP timeout';
				if (this.timeout) reason += ' (' + this.timeout + ')';
				reject(reason);
			},
		});
		request();
	});
	mbRequestsCache.set(cacheKey, request);
	return request;
}

function saveDiscIdStates(releaseId, states) {
	if (states) discIdStates[releaseId] = states; else delete discIdStates[releaseId];
	sessionStorage.setItem('mbDiscIdStates', JSON.stringify(discIdStates));
}

function getRequestparams(link) {
	console.assert(link instanceof HTMLAnchorElement);
	if (!(link instanceof HTMLAnchorElement)) throw 'Invalid argument';
	const params = { discId: /^\/cdtoc\/([\w\_\.\-]+)\/set-durations$/i.exec(link.pathname) };
	if (params.discId != null) params.discId = params.discId[1]; else return null;
	const query = new URLSearchParams(link.search);
	if (!query.has('medium')) return null;
	console.assert(link.textContent.trim() == 'Set track lengths', link);
	params.mediumId = parseInt(query.get('medium'));
	console.assert(params.mediumId > 0, link.href);
	return params.mediumId >= 0 ? params : null;
}

const getSetLink = row => Array.prototype.find.call(row.querySelectorAll('td a'), a => getRequestparams(a) != null) || null;
const replacedLinkLabel = () => Object.assign(document.createElement('span'), {
	textContent: 'Track lengths successfully set',
	style: 'color: green;',
});

function processRelease(param, autoSet = true, setParams) {
	if (param instanceof HTMLDocument) {
		function getDiscIds(row) {
			console.assert(row instanceof HTMLElement);
			const discIds = [ ], isDiscIdRow = row => row instanceof HTMLElement && ['odd', 'even']
				.some(cls => row.classList.contains(cls));
			while (isDiscIdRow(row = row.nextElementSibling)) discIds.push(getSetLink(row));
			return discIds;
		}
		function processTrackLengths(link, autoSet = true) {
			console.assert(link instanceof HTMLAnchorElement);
			if (!(link instanceof HTMLAnchorElement)) throw 'Invalid argument';
			if (loggedIn && autoSet && visible) link.disabled = true;
			const animation = visible ? flashElement(link) : null;
			let state = 0b11 << 6;
			return localXHR(link).then(getDiscIdDeltas).then(function(deltas) {
				state |= computeDifferenceState(deltas);
				const compoundScore = computeCompoundScore(deltas);
				link.dataset.compoundScore = compoundScore.toFixed(3);
				console.log('Compound score for %o:', getRequestparams(link), compoundScore);
				return (state >> 4 & 0b11) >= 3 ? Promise.resolve(state) : Promise.reject(state);
			}).then(function(state) {
				if (!loggedIn || !autoSet) {
					if (animation) animation.cancel();
					link.disabled = false;
					return state;
				}
				const postData = new URLSearchParams({ 'confirm.edit_note': GM_getValue('edit_note', '') });
				if (GM_getValue('make_votable', false)) postData.set('confirm.make_votable', 1);
				return localXHR(link, { responseType: null }, postData).then(function(statusCode) {
					console.log('Lengths set for %o with status code %d', getRequestparams(link), statusCode);
					if (visible) link.replaceWith(replacedLinkLabel());
					return state & ~(1 << 6) | 1 << 0;
				});
			}).catch(function(reason) {
				if (animation) animation.cancel();
				link.disabled = false;
				if (Number.isInteger(reason)) return reason; else if (visible) link.title = reason;
				return -1;
			});
		}
		function processMedium(medium) {
			function clickHandler(evt) {
				const link = evt.currentTarget;
				if (!link.disabled) processTrackLengths(link, true)
					.then(state => { if ((state & 1) == 0) document.location.assign(link) });
				return false;
			}

			console.assert(medium instanceof HTMLElement);
			if (!(medium instanceof HTMLElement)) throw 'Invalid argument';
			const discIds = getDiscIds(medium), settable = discIds.filter(Boolean);
			let state = 0;
			if (discIds.length <= 0) return Promise.resolve(state); else state |= 1 << 7;
			if (discIds.length == 1) state |= 1 << 3;
			if (settable.length <= 0) return Promise.resolve(state |= 0b111010); else state |= 1 << 6;
			if (settable.length >= discIds.length) state |= 1 << 2;
			if (discIds.length > 1) {
				if (loggedIn && visible) settable.forEach(function(link) {
					link.onclick = clickHandler;
					processTrackLengths(link, false).then(function(status) {
						status |= state & ~(0b11 << 6);
						if ((status >> 4 & 0b1111) != 0b1111) link.onclick = null;
						if (visible) styleByState(link, status);
					});
				});
				return Promise.resolve(state | 0b11 << 4);
			} else {
				if (loggedIn && visible) settable[0].onclick = autoSet ? evt => !evt.currentTarget.disabled : clickHandler;
				return processTrackLengths(settable[0], autoSet).then(function(status) {
					if (((status |= state & ~(0b11 << 6)) >> 4 & 0b11) >= 3) status |= 1 << 1;
					if ((status >> 4 & 0b1111) != 0b1111) settable[0].onclick = null;
					if (visible && (status & 1) == 0) styleByState(settable[0], status);
					return status;
				});
			}
		}

		const visible = param == window.document;
		const media = param.body.querySelectorAll('table.tbl > tbody > tr.subh');
		if (media.length <= 0) return Promise.reject('No media found');
		else if (setParams && typeof setParams == 'object') {
			const medium = Array.prototype.find.call(media, medium => getDiscIds(medium).some(function(link) {
				if (link == null) return false;
				const requestParams = getRequestparams(link);
				return requestParams != null && (requestParams.discId == setParams.discId)
					&& (requestParams.mediumId == setParams.mediumId);
			}));
			console.assert(medium, setParams, media);
			return medium ? processMedium(medium) : Promise.reject('Medium not found');
		} else return Promise.all(Array.from(media, processMedium));
	} else if (param)	{
		const url = `/release/${param}/discids`;
		if (setParams) return localXHR(url).then(document => processRelease(document, autoSet, setParams));
		return (param in discIdStates ? Promise.resolve(discIdStates[param]) : (function getDisdIdStates() {
			return apiRequest('release/' + param, { inc: 'recordings+discids'}).then(function(release) {
				const states = release.media.map(function(medium, mediumIndex) {
					let state = 0;
					if (!medium.discs || medium.discs.length <= 0) return state; else state |= 1 << 7;
					const discIdStates = medium.discs.map(function(discId, tocIndex) {
						const grpLabel = `Medium ${mediumIndex + 1} / Disc ID ${tocIndex + 1}`;
						console.groupCollapsed(grpLabel);
						const deltas = medium.tracks.map(function lengthsEqual(track, index, tracks) {
							const trackLength = 'length' in track ? typeof track.length == 'number' ? track.length / 1000
								: typeof track.length == 'string' ? getTime(track.length) : NaN : NaN;
							const hiOffset = (index + 1) in discId.offsets ? discId.offsets[index + 1] : discId.sectors;
							const tocLength = (hiOffset - discId.offsets[index]) / 75;
							const delta = Math.abs(tocLength - trackLength);
							console.debug('[%02d] Track length: %.3f (%s), TOC length: %.4f, Delta: %.4f',
								index + 1, trackLength, track.length, tocLength, delta);
							return delta;
						}), compoundScore = computeCompoundScore(deltas);
						console.log('Compound score:', compoundScore);
						console.groupEnd(grpLabel);
						return medium.tracks.every(function lengthsEqual(track, index, tracks) {
							if (typeof track.length != 'number') return false;
							const hiOffset = (index + 1) in discId.offsets ? discId.offsets[index + 1] : discId.sectors;
							return track.length == Math.floor((hiOffset - discId.offsets[index]) * 1000 / 75);
						}) ? 0b11 << 4 : 1 << 6 | computeDifferenceState(deltas);
					});
					if (discIdStates.some(state => (state >> 6 & 1) != 0)) state |= 1 << 6;
					if (discIdStates.every(state => (state >> 6 & 1) != 0)) state |= 1 << 2;
					if (discIdStates.every(state => (state >> 4 & 0b11) >= 3)) state |= 1 << 1;
					state |= Math.min(...discIdStates.map(state => state & 0b11 << 4));
					if (discIdStates.length == 1) state |= 1 << 3;
					return state;
				});
				return states;
			}).catch(reason => { console.warn('Disc ID states query failed:', reason, '; falling back to scraping HTML') });
		})()).then(function(states) {
			if (states && !(autoSet && states.some(state => (state >> 3 & 0b11111) == 0b11111))) return states;
			return localXHR(url).then(document => processRelease(document, autoSet));
		});
	} else throw 'Invalid argument';
}

if (document.location.pathname.startsWith('/release/')) {
	let releaseId = getEntity(document.location);
	console.assert(releaseId != null && releaseId[1] == 'release', document.location.pathname);
	if (releaseId != null &&  releaseId[1] == 'release') releaseId = releaseId[2];
		else throw 'Failed to identify entity from page url';
	let tabLinks = document.body.querySelectorAll('div#page ul.tabs > li a');
	tabLinks = Array.prototype.filter.call(tabLinks, a => a.pathname.endsWith('/discids'));
	console.assert(tabLinks.length == 1, tabLinks);
	if (tabLinks.length != 1) throw 'Assertion failed: Disc ID tab links mismatch';
	const tabLink = tabLinks[0], li = tabLink.closest('li');
	console.assert(li != null);
	if (document.location.pathname.endsWith('/discids') || li.classList.contains('sel')) {
		saveDiscIdStates(releaseId);
		processRelease(document, autoSet).then(function(states) {
			if (states.every(state => (state >> 6 & 1) == 0)) saveDiscIdStates(releaseId, states);
		});
		return;
	} else if (li.classList.contains('disabled')) return Promise.reject('Release has no disc IDs attached');
	const animation = flashElement(tabLink);
	processRelease(releaseId, autoSet).then(function(states) {
		if (!states.some(state => state < 0)) saveDiscIdStates(releaseId, states.map(state => state & ~(1 << 0)));
		if (animation) animation.cancel();
		const setColor = color => { for (let child of li.children) child.style.color = color };
		if (states.some(state => state < 0)) {
			li.style.backgroundColor = 'red';
			setColor('white');
		} else {
			if (states.every(state => /*(state >> 7 & 1) == 0 || */(state >> 4 & 0b1111) == 0b1011)) setColor('#050');
			if (states.some(state => (state >> 7 & 1) != 0 && (state >> 4 & 0b11) < 1)) setColor('#840');
			if (states.some(state => (state >> 7 & 1) != 0 && (state >> 4 & 0b11) < 3)) setColor('#800');
			if (states.some(state => (state >> 3 & 0b10001) == 0b10000)) setColor('#804');
			if (states.some(state => (state & 1) != 0)) li.style.backgroundColor = '#0f02';
			if (states.some(state => (state >> 3 & 0b11111) == 0b11111)) li.style.fontWeight = 'bold';
		}
		li.title = states.map(tooltipFromState).map((state, index) => `Medium ${index + 1}: ${state}`).join('\n');
	}, function(reason) {
		if (animation) animation.cancel();
		[li.style, li.title] = ['color: white; background-color: red;', 'Something went wrong: ' + reason];
	});
} else if (document.location.pathname.startsWith('/cdtoc/'))
	document.body.querySelectorAll('table.tbl > tbody > tr').forEach(function(medium, index) {
		function processLink(userClick) {
			setLink.disabled = true;
			const animation = flashElement(setLink);
			processRelease(release[2], userClick || autoSet, setparams).then(function(state) {
				if ((state & 1) != 0) {
					saveDiscIdStates(release[2]);
					return setLink.replaceWith(replacedLinkLabel());
				}
				if (animation) animation.cancel();
				styleByState(setLink, state, true);
				const redirect = (state >> 3 & 1) == 0 ? `/release/${release[2]}/discids` : undefined;
				if (userClick) return document.location.assign(redirect || setLink);
				if (redirect) setLink.href = redirect;
				if ((state >> 3 & 0b11111) != 0b11111) setLink.onclick = null;
				setLink.disabled = false;
			}, function(reason) {
				if (animation) animation.cancel();
				[setLink.style, setLink.disabled, setLink.title] =
					['color: white; background-color: red;', false, 'Something went wrong: ' + reason];
			});
		}

		let release = Array.prototype.find.call(medium.querySelectorAll(':scope > td a'),
			a => (a = getEntity(a)) != null && a[1] == 'release');
		console.assert(release, medium);
		if (release) release.pathname += '/discids';
		const setLink = getSetLink(medium);
		if (setLink != null && release) release = getEntity(release); else return;
		console.assert(release != null, medium);
		const setparams = getRequestparams(setLink);
		console.assert(setparams != null, setLink);
		if (loggedIn) setLink.onclick = autoSet ? evt => !evt.currentTarget.disabled : function(evt) {
			if (!evt.currentTarget.disabled) processLink(true);
			return false;
		};
		processLink(false);
	});
