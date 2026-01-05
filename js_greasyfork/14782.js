// ==UserScript==
// @name         Facebook Event Exporter
// @namespace    http://boris.joff3.com
// @version      1.3.11
// @description  Export Facebook events
// @author       Boris Joffe
// @match        https://www.facebook.com/*
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/14782/Facebook%20Event%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/14782/Facebook%20Event%20Exporter.meta.js
// ==/UserScript==
/* jshint -W097 */
/* globals console*/
/* eslint-disable no-console, no-unused-vars */
'use strict';

/*
The MIT License (MIT)

Copyright (c) 2015, 2017, 2018 Boris Joffe

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/


// Util
var
	qs = document.querySelector.bind(document),
	qsa = document.querySelectorAll.bind(document),
	err = console.error.bind(console),
	log = console.log.bind(console),
	euc = encodeURIComponent;

var DEBUG = false;
function dbg() {
  if (DEBUG)
	  console.log.apply(console, arguments);

  return arguments[0];
}

function qsv(elmStr, parent) {
	var elm = parent ? parent.querySelector(elmStr) : qs(elmStr);
	if (!elm) err('(qs) Could not get element -', elmStr);
	return elm;
}

function qsav(elmStr, parent) {
	var elm = parent ? parent.querySelectorAll(elmStr) : qsa(elmStr);
	if (!elm) err('(qsa) Could not get element -', elmStr);
	return elm;
}

/*
function setProp(parent, path, val) {
	if (!parent || typeof parent !== 'object')
		return;
	path = Array.isArray(path) ? Array.from(path) : path.split('.');
	var child, prop;
	while (path.length > 1) {
		prop = path.shift();
		child = parent[prop];
		if (!child || typeof child !== 'object')
			parent[prop] = {};
		parent = parent[prop];
	}
	parent[path.shift()] = val;
}

function getProp(obj, path, defaultValue) {
	path = Array.isArray(path) ? Array.from(path) : path.split('.');
	var prop = obj;

	while (path.length && obj) {
		prop = obj[path.shift()];
	}

	return prop != null ? prop : defaultValue;
}

*/

// ==== Scrape =====


// == Title ==

function getTitle() {
	// only include the first host for brevity
	return document.title + ' (' + getHostedByText()[0] + ')';
}


// == Dates ==

function convertDateString(dateObj) {
	return dateObj.toISOString()
		.replace(/-/g, '')
		.replace(/:/g, '')
		.replace('.000Z', '');
}

function getDates() {
	return qsv('#event_time_info ._2ycp')
		.getAttribute('content')
		.split(' to ')
		.map(date => new Date(date))
		.map(convertDateString);
}

function getStartDate() { return getDates()[0]; }
function getEndDate() { return getDates()[1]; }


// == Location / Address ==

function getLocation() {
	var hovercard = qsv('[data-hovercard]', qs('#event_summary'));
	return hovercard ? hovercard.innerText : '';
}

function getAddress() {
	var hovercard = qsv('[data-hovercard]', qs('#event_summary')),
		addr = qsv('#u_0_1h');
	if (hovercard)
		return hovercard.nextSibling.innerText || 'No Address Specified';
	else if (addr)
		return addr.innerText;
	else
		// certain addresses like GPS coordinates
		// e.g. https://facebook.com/events/199708740636288/
		// HACK: don't have a unique way to get the text (matches time and address - address is second)
		return Array.from(qsav('._5xhk')).slice(-1)[0].innerText;
}

function getLocationAndAddress() {
	return getLocation() ?
		(getLocation() + ', ' + getAddress())
		: getAddress();
}


// == Description ==

function getDescription() {
	var seeMore = qsv('.see_more_link');
	if (seeMore)
		seeMore.click();  // expand description

	return location.href +
		'\n\n' +
		qsv('[data-testid="event-permalink-details"]').innerText;
		// Zip text array with links array?
		//'\n\nHosted By:\n' +
		//getHostedByText().join(', ') + '\n' + getHostedByLinks().join('\n') +
}

function getHostedByText() {
	var el = qsv('._5gnb [content]');
	var text = el.getAttribute('content');
	if (text.lastIndexOf(' & ') !== -1)
		text = text.substr(0, text.lastIndexOf(' & ')); // chop off trailing ' & '

	return text.split(' & ');
}


// ==== Make Export URL =====
function makeExportUrl() {
	console.time('makeExportUrl');
	var ev = {
		title       : getTitle(),
		startDate   : getStartDate(),
		endDate     : getEndDate() || getStartDate(),  // set to startDate if undefined
		locAndAddr  : getLocationAndAddress(),
		description : getDescription()
	};

	var totalLength = 0;
	for (var prop in ev) if (ev.hasOwnProperty(prop)) {
		ev[prop] = euc(dbg(ev[prop], ' - ' + prop));
		totalLength += ev[prop].length;
	}

	// max is about 8200 chars but allow some slack for the base URL
	const MAX_URL_LENGTH = 8000;

	console.info('event props totalLength', totalLength);
	if (totalLength > MAX_URL_LENGTH) {
		var numCharsOverLimit = totalLength - MAX_URL_LENGTH;
		var maxEventDescriptionChars = ev.description.length - numCharsOverLimit;

		// will only happen if event title or location is extremely long
		// FIXME: truncate event title / location if necessary
		if (maxEventDescriptionChars < 1) {
			console.warn('maxEventDescriptionChars is', maxEventDescriptionChars);
		}

		console.warn('Event description truncated from', ev.description.length, 'characters to', maxEventDescriptionChars, 'characters');

		ev.description = ev.description.substr(0, maxEventDescriptionChars) + '...';
	}


	// gcal format - http://stackoverflow.com/questions/10488831/link-to-add-to-google-calendar

	// Create link, use UTC timezone to be compatible with toISOString()
	var exportUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=[TITLE]&dates=[STARTDATE]/[ENDDATE]&details=[DETAILS]&location=[LOCATION]&ctz=UTC';

	exportUrl = exportUrl
	                     .replace('[TITLE]', ev.title)
	                     .replace('[STARTDATE]', ev.startDate)
	                     .replace('[ENDDATE]', ev.endDate)
	                     .replace('[LOCATION]', ev.locAndAddr)
	                     .replace('[DETAILS]', ev.description);

	console.info('exportUrl length =', exportUrl.length);

	console.timeEnd('makeExportUrl');
	return dbg(exportUrl, ' - Export URL');
}


function addExportLink() {
	console.time('addExportLink');
	log('Event Exporter running');

	var
		evBarElm = qsv('#event_button_bar'),
		exportElmLink = qsv('a', evBarElm),
		exportElmParent = exportElmLink.parentNode;

	exportElmLink = exportElmLink.cloneNode();
	exportElmLink.href = makeExportUrl();
	exportElmLink.textContent = 'Export Event';

	// Disable Facebook event listeners (that are attached due to cloning element)
	exportElmLink.removeAttribute('ajaxify');
	exportElmLink.removeAttribute('rel');
	exportElmLink.removeAttribute('data-onclick');

	// Open in new tab
	exportElmLink.target = '_blank';

	exportElmParent.appendChild(exportElmLink);

	var evBarLinks = qsav('a', evBarElm);
	Array.from(evBarLinks).forEach(function (a) {
		// fix styles
		a.style.display = 'inline-block';
	});
	console.timeEnd('addExportLink');
}


(function (oldPushState) {
	// monkey patch pushState so that script works when navigating around Facebook
	window.history.pushState = function () {
		dbg('running pushState');
		oldPushState.apply(window.history, arguments);
		setTimeout(addExportLinkWhenLoaded, 1000);
	};
	dbg('monkey patched pushState');
})(window.history.pushState);

// onpopstate is sometimes null causing the following error:
// 'Cannot set property onpopstate of #<Object> which has only a getter'
if (window.onpopstate) {
	window.onpopstate = function () {
		dbg('pop state event fired');
		setTimeout(addExportLinkWhenLoaded, 1000);
	};
} else {
	dbg('Unable to set "onpopstate" event', window.onpopstate);
}

function addExportLinkWhenLoaded() {
	if (location.href.indexOf('/events/') === -1) {
		dbg('not an event page. skipping...');
		return;
	} else if (!qs('#event_button_bar') || !qs('#event_summary')) {
		// not loaded
		dbg('page not loaded...');
		setTimeout(addExportLinkWhenLoaded, 1000);
	} else {
		// loaded
		dbg('page loaded...adding link');
		addExportLink();
	}
}

var onLoad = addExportLinkWhenLoaded;

window.addEventListener('load', onLoad, true);
