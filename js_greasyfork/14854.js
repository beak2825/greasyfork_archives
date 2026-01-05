// ==UserScript==
// @name         Meetup Better Event Exporter
// @namespace    http://boris.joff3.com
// @version      1.2.7
// @description  Export full Meetup event description to Google Calendar
// @author       Boris Joffe
// @match        http://*.meetup.com/*
// @match        https://*.meetup.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/14854/Meetup%20Better%20Event%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/14854/Meetup%20Better%20Event%20Exporter.meta.js
// ==/UserScript==
/* jshint -W097, -W041 */
/* eslint-disable no-console, no-unused-vars */
'use strict';

/*
The MIT License (MIT)

Copyright (c) 2015 Boris Joffe

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
var DEBUG = false;
function dbg() {
	if (DEBUG)
		console.log.apply(console, arguments);

	return arguments[0];
}


var
	qs = document.querySelector.bind(document),
	err = console.error.bind(console),
	log = console.log.bind(console),
	euc = encodeURIComponent;

function qsv(elmStr, parent) {
	var elm = parent ? parent.querySelector(elmStr) : qs(elmStr);
	if (!elm) err('(qs) Could not get element -', elmStr);
	return elm;
}

function getProp(obj, path, defaultValue) {
	path = Array.isArray(path) ? Array.from(path) : path.split('.');
	var prop = obj;

	while (path.length && obj) {
		prop = obj[path.shift()];
	}

	return prop != null ? prop : defaultValue;
}

function updateExportLink() {
	log('Event Exporter running');

	var
		calLink = qsv('a[href*="google.com/calendar"]'),
		descElm = qsv('#event-description-wrap'),
		desc;

	if (descElm.innerText) {
		desc = descElm.innerText;
	} else {
		// fallback, HTML encoded entities will appear broken
		desc = descElm.innerHTML
		              .replace(/<br>\s*/g, '\n') // fix newlines
		              .replace(/&nbsp;/g, ' ')
		              .replace(/&amp;/g, '&')
		              .replace(/<a href="([^"]*)"[^>]*>/g, '[$1] ') // show link urls
		              .replace(/<[^>]*>/g, '');  // strip html tags
	}

	var meetupGroupName = qsv('meta[property="og:title"]').getAttribute('content');

	var indexOfQuestionMark = location.href.indexOf('?');
	var hasExtraUrlJunk = indexOfQuestionMark !== -1;   // trim analytics stuff at end
	var eventUrl = hasExtraUrlJunk ? location.href.substring(0, indexOfQuestionMark) : location.href;

	var leadingText = meetupGroupName + '\n' + eventUrl + '\n\n';
	var oldUrl = calLink.href;
	dbg('old url is:', oldUrl);
	var notEmpty = function (s) { return s !== ''; };

	var meetupTitle = getProp(oldUrl.match(/text=[^&]*/), '0', '');
	// Add Meetup group name if it's not already part of the title
	if (meetupTitle.indexOf(euc(meetupGroupName)) === -1)
		meetupTitle += euc(' (' + meetupGroupName + ')');

	var exportUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE&' + [
			meetupTitle,
			getProp(oldUrl.match(/dates=[^&]*/), '0', ''),
			getProp(oldUrl.match(/location=[^&]*/), '0', ''),
			'details=' + euc(leadingText + desc)
		].filter(notEmpty).join('&');

	dbg('export url len = ', exportUrl.length);

	calLink.href = exportUrl;
	calLink.target = '_blank';

	// show color change to notify user that link changed
	var linkColor = 'rgba(0, 255, 255, 0.1)';
	calLink.parentNode.style.backgroundColor = linkColor;

	var exportBtn = qsv('#addToCalAction');
	exportBtn.style.backgroundColor = linkColor;

	// Add Google Export link at top level
	var calLinkClone = calLink.cloneNode();
	calLinkClone.innerHTML = '<span class="calOpt google"></span> Google Export';
	var li = document.createElement('li');
	li.className += 'D_dropdown';
	li.appendChild(calLinkClone);
	li.style.backgroundColor = linkColor;
	exportBtn.parentNode.appendChild(li);
}

window.addEventListener('load', updateExportLink, true);
