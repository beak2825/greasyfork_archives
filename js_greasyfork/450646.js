// ==UserScript==
// @name         YouTube Better Window Title
// @namespace    http://borisjoffe.com
// @version      2.0.5
// @description  Add video length in minutes (rounded) and Channel Name to Window Title
// @author       Boris Joffe
// @match        https://*.youtube.com/*
// @exclude      https://accounts.youtube.com/RotateCookiesPage*
// @exclude      https://studio.youtube.com/persist_identity*
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450646/YouTube%20Better%20Window%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/450646/YouTube%20Better%20Window%20Title.meta.js
// ==/UserScript==

/*
The MIT License (MIT)

Copyright (c) 2018, 2020-2025 Boris Joffe

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

/* jshint -W097, -W041 */
/* eslint-disable no-console, no-unused-vars */
'use strict';

// skip inner frames: /persist_identity, /RotateCookiesPage, etc
if (unsafeWindow.top !== unsafeWindow.self)
	return console.log('NOT in top frame - SKIP:', location.href)


function onVideoPage() {
	// if (unsafeWindow.location.pathname === '/watch') dbg(new Date().getSeconds(), getWindowTitleRefresh()/1000, location.pathname)
	return unsafeWindow.location.pathname === '/watch'
		|| unsafeWindow.location.pathname.startsWith('/live/')

	// shorts have different HTML elements which need to be scraped separately. The globals with that data only work on the first video
	// || location.pathname.startsWith('/shorts')

	// below is undefined when going to a non-watch page
	//&& unsafeWindow.ytInitialPlayerResponse
}

// GM_deleteValue('titlerefresh')
// GM_listValues()
const DEFAULT_WINDOW_TITLE_REFRESH_MS = 4000
const MINIMUM_WINDOW_TITLE_REFRESH_MS = 50
function isValidTitleRefresh(val) { return val && val >= MINIMUM_WINDOW_TITLE_REFRESH_MS && isFinite(val) }
function getWindowTitleRefresh() {
	const ms = JSON.parse(GM_getValue('titlerefresh', DEFAULT_WINDOW_TITLE_REFRESH_MS))
	if (isValidTitleRefresh(ms)) return ms
	else return DEFAULT_WINDOW_TITLE_REFRESH_MS
}
console.log('titlerefresh', getWindowTitleRefresh())

function getExpandComments() { return JSON.parse(GM_getValue('expandcomments', false)) }
console.log('expandcomments', getExpandComments())

function getQuickReport() { return JSON.parse(GM_getValue('quickreport', false)) }
console.log('quickreport', getQuickReport())

GM_registerMenuCommand("Set window title refresh interval", function() {
	var val = prompt("How often should the window title refresh?"
		+ "\n\nDefault: " + DEFAULT_WINDOW_TITLE_REFRESH_MS + "ms (" + DEFAULT_WINDOW_TITLE_REFRESH_MS / 1000 + " seconds)"
		+ "\nMinimum: " + MINIMUM_WINDOW_TITLE_REFRESH_MS + "ms (" + MINIMUM_WINDOW_TITLE_REFRESH_MS / 1000 + " seconds)"
		+ "\nRecommended: 500-5000ms (0.5 - 5 seconds)"
		// + "\n\n1000 milliseconds = 1 second"
		+ "\n\nCurrent value is listed below (in milliseconds)"
		, getWindowTitleRefresh())

	if (val === null) alert('Cancelled. Refresh interval remains at ' + getWindowTitleRefresh() + 'ms')
	else if (isValidTitleRefresh(val)) GM_setValue("titlerefresh", JSON.parse(val));
	else alert('Invalid interval. Skipping setting titlerefresh')
})

GM_registerMenuCommand("Set EXPAND_COMMENTS", function() {
	var val = prompt("Value for EXPAND_COMMENTS? (true or false) Current value is listed below", getExpandComments())
	GM_setValue("expandcomments", !!JSON.parse(val));
})

GM_registerMenuCommand("Set QUICK_REPORT_COMMENT", function() {
	var val = prompt("Value for QUICK_REPORT_COMMENT? (true or false) Current value is listed below", getQuickReport())
	GM_setValue("quickreport", !!JSON.parse(val));
})

function useVideoObject() { return true || JSON.parse(localStorage.getItem('vidobject')) }
console.log('useVideoObject (experimental)', useVideoObject())

// Util
function getDebug() { return false || JSON.parse(unsafeWindow.localStorage.getItem('DEBUG')) }
function dbg() {
	if (getDebug())
		console.log.apply(console, ['DBG:', ...arguments])

	return arguments[0];
}


var
	qs = document.querySelector.bind(document),
	qsa = document.querySelectorAll.bind(document),
	err = console.error.bind(console),
	log = console.log.bind(console),
	euc = encodeURIComponent;

function qsv(elmStr, parent) {
	var elm
	if (typeof parent === 'string') elm = qsv(parent).querySelector(elmStr)
	else if (typeof parent === 'object') elm = parent.querySelector(elmStr)
	else elm = qs(elmStr);

	if (!elm) err('(qs) Could not get element -', elmStr);
	return elm;
}

function qsav(elmStr, parent) {
	var elm
	if (typeof parent === 'string') elm = qsv(parent).querySelectorAll(elmStr)
	else if (typeof parent === 'object') elm = parent.querySelectorAll(elmStr)
	else elm = qsa(elmStr);

	if (!elm) err('(qsa) Could not get element -', elmStr);
	return elm;
}

function getProp(obj, path, defaultValue) {
	path = Array.isArray(path) ? Array.from(path) : path.split('.');
	var prop = obj;

	while (path.length && obj) {
		prop = prop[path.shift()]
	}

	return prop != null ? prop : defaultValue;
}

function getWindowTitle() { return document.title; }

function setWindowTitle(newTitle) {
	document.title = newTitle;
	log('newTitle =', newTitle);
}

function getVideoObject(path, defaultValue) {
	if (!useVideoObject()) return defaultValue

	// TODO: cache obj for 1-20ms
	try {
		const obj = JSON.parse(qsv('player-microformat-renderer script').textContent)
		return getProp(obj, path, defaultValue)
	} catch (e) {
		console.error('Could not get video object. Path was', path)
		if (getDebug()) alert('Could not get video object. Path was', path)
		return defaultValue
	}
}

function getVideoLengthSeconds() {
	// only works for first video
	// return getProp(unsafeWindow.ytplayer, 'config.args.length_seconds')
	// return unsafeWindow.ytInitialPlayerResponse.videoDetails.lengthSeconds;

	return qsv('.ytp-progress-bar').getAttribute('aria-valuemax')
}

function getVideoLengthFriendly() {
	// TODO: update
	return Math.round(getVideoLengthSeconds() / 60) + 'm';
}

function getChannelName() {
	// only works for first video
	// return getProp(unsafeWindow.ytplayer, 'config.args.author')
	// return unsafeWindow.ytInitialPlayerResponse.videoDetails.author;

	// WARNING: #channel-name is not a unique id
	return getVideoObject('author') || qsv('#below #channel-name a').innerText.replaceAll('\n', '').trim()
}

function getChannelNameShort() {
	return getChannelName().substr(0, 20);
}

function getVideoTitle() {
	// only works for first video
	// return getProp(unsafeWindow.ytplayer, 'config.args.title')
	// return unsafeWindow.ytInitialPlayerResponse.videoDetails.title;

	return getVideoObject('name') || qsv('.title.ytd-video-primary-info-renderer').innerText
}

function getVideoTitleShort() {
	return getVideoTitle()//.substr(0, 30);
}

function updateWindowTitle() {
	var videoLength = getVideoLengthFriendly()
	var channelName = getChannelNameShort()
	var videoTitle = getVideoTitleShort()

	// Don't duplicate channel name if it's part of the video title
	if (videoTitle.startsWith(channelName))
		videoTitle = videoTitle.substring(channelName.length)
	// Trim leading dashes e.g. often used as "<artist> - <title>"
	if (videoTitle.trim().startsWith('-'))
		videoTitle = videoTitle.trim().substring(1).trim()

	setWindowTitle([videoLength + ',' + channelName, videoTitle].join('—'))
	return videoTitle
	// setTimeout(updateWindowTitle, getWindowTitleRefresh());
}

function getVideoDate() {
	return getVideoObject('uploadDate', '').split('T')[0] ||
		getProp(qsv('#date'), 'innerText', '').trim() ||
		qsv('meta[itemprop="uploadDate"]').getAttribute('content').split('T')[0]
}

function getVideoYear() {
	const dateArr = getVideoDate().split(',')
	return dateArr[dateArr.length - 1].trim()
}

function createWikiLink() {
	return '[[' + window.location.href + '|' + getVideoTitle() + ']] - '
		+ getChannelName() + ', ' + getVideoYear() + ', ' + getVideoLengthFriendly()
}

function $createWikiLink($ev) {
	/*
	qsv('#info.ytd-video-primary-info-renderer').lastChild.innerHTML +=
		'<div class="style-scope ytd-video-primary-info-renderer" style="color: white">'
		+ createWikiLink()
		+ '</div>'
	*/

	log('dblclick ev.target', $ev.target)
	if (!['SPAN', 'YT-FORMATTED-STRING'].includes($ev.target.tagName)) {
		log('SKIPPING dblclick: ev target is not SPAN or YT-FORMATTED-STRING. Is:', $ev.target.tagName)
		return
	}

	const isValidClassName = ['ytd-video-primary-info-renderer', 'yt-formatted-string']
		.filter(validClassName => $ev.target.className.includes(validClassName))
		.length

	if (isValidClassName) {
		const wikiLink = createWikiLink()
		navigator.clipboard.writeText(wikiLink)
		log('DOUBLE CLICK: wiki link copied to clipboard:', wikiLink)
	} else {
		console.debug('SKIPPING dblclick: ev target is span, but not right class. Classes are:', $ev.target.className)
	}
}


function waitForLoad() {
	// dbg('waitforload start', new Date().getSeconds(), '+', getWindowTitleRefresh() / 1e3, location.pathname)

	setTimeout(waitForLoad, getWindowTitleRefresh())

	if (!onVideoPage()) return dbg('skip waitforload. not on video page', unsafeWindow.location.href)
	// log('waitForLoad');

	// if (! unsafeWindow.ytInitialPlayerResponse) {
	// 	log('waiting another 2 sec for ytInitialPlayerResponse')
	// 	setTimeout(waitForLoad, 2_000)
	// 	return;
	// }

	//dbg('video details:', unsafeWindow.ytInitialPlayerResponse.videoDetails)

	console.time('waitforload')
	// console.debug('video title =', getVideoTitleShort())
	updateWindowTitle()

	// setInterval(function() {
	// 	var j = JSON.parse(qsv('player-microformat-renderer script').textContent)
	// 	console.debug('EXPERIMENTAL json:', j)
	// }, 30_000)

	// NOTE: some of these IDs are NOT unique on the page
	// const eventSelectors = ['#description-inner'/*, '#description', '#info-strings'*/]
	// eventSelectors
	// 	.map(selector => qsv(selector).addEventListener('dblclick', $createWikiLink, true))
	const $desc = qsv('#description-inner')
	$desc.removeEventListener('dblclick', $createWikiLink, true)
	$desc.addEventListener('dblclick', $createWikiLink, true)

	console.timeEnd('waitforload')
}

setInterval($clickReadMoreInComments, 10_000)

/** Click "Read More" to expand comments and expand replies to comments too */
function $clickReadMoreInComments() {
	if (!getExpandComments() || !onVideoPage()) return
	qsav('.more-button').forEach(($btn) => $btn.checkVisibility() && $btn.click())
	// 2025-10 - new "replies" button - need to avoid sponsorship click (by narrowing to #comments) and "Reply" click by selecting aria-controls element
	qsav('#comments [aria-controls="expanded-threads"] .yt-spec-button-shape-next__button-text-content').forEach(($btn) => $btn.checkVisibility() && $btn.click())
}


setInterval($quickReportComment, 5_000)

function handleDropdownClick(e) {
	setTimeout(() => {
		// click "Report"
		qsv('ytd-menu-popup-renderer yt-icon').click()
		// click Spam
		setTimeout(() =>
			Array.from(qsav('.ytRadioButtonItemViewModelLabel'))
				.filter(x => x.textContent.includes('Spam'))[0]
				.click()
		, 250)
	}, 250)
}

// Click "Report" when clicking comment dropdown
function $quickReportComment() {
	if (!getQuickReport() || !onVideoPage()) return
	const dropdownButtons = Array.from(qsav('.yt-icon-button'))
	dropdownButtons.map(btn => {
		btn.removeEventListener('click', handleDropdownClick)
		btn.addEventListener('click', handleDropdownClick)
	})
	// log('(YT Better Window Title) Added quickReportComment listener')
}

setTimeout(waitForLoad, getWindowTitleRefresh());

// setTimeout(function () {
// 	waitForLoad();
// }, 6_000);
// window eventListener doesn't work well for some reason
// window.addEventListener('load', waitForLoad, true);
// window.addEventListener('focus', waitForLoad, true);
log('YouTube Better Window Title: started script')

