/* eslint-disable no-multi-spaces */

// ==UserScript==
// @name               超星允许粘贴
// @name:zh-CN         超星允许粘贴
// @namespace          http://tampermonkey.net/
// @version            0.1
// @description        超星学习通允许粘贴
// @description:zh-CN  超星学习通允许粘贴
// @author             PY-DNG
// @license            GPL-v3
// @match              *://*.chaoxing.com/*
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/452718/%E8%B6%85%E6%98%9F%E5%85%81%E8%AE%B8%E7%B2%98%E8%B4%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/452718/%E8%B6%85%E6%98%9F%E5%85%81%E8%AE%B8%E7%B2%98%E8%B4%B4.meta.js
// ==/UserScript==

(function __MAIN__() {
    'use strict';

	// DoLog
	const LogLevel = {
		None: 0,
		Error: 1,
		Success: 2,
		Warning: 3,
		Info: 4,
	}

	// Arguments: level=LogLevel.Info, logContent, asObject=false
	// Needs one call "DoLog();" to get it initialized before using it!
	function DoLog() {
		// Get window
		const win = (typeof(unsafeWindow) === 'object' && unsafeWindow !== null) ? unsafeWindow : window;

		const LogLevelMap = {};
		LogLevelMap[LogLevel.None] = {
			prefix: '',
			color: 'color:#ffffff'
		}
		LogLevelMap[LogLevel.Error] = {
			prefix: '[Error]',
			color: 'color:#ff0000'
		}
		LogLevelMap[LogLevel.Success] = {
			prefix: '[Success]',
			color: 'color:#00aa00'
		}
		LogLevelMap[LogLevel.Warning] = {
			prefix: '[Warning]',
			color: 'color:#ffa500'
		}
		LogLevelMap[LogLevel.Info] = {
			prefix: '[Info]',
			color: 'color:#888888'
		}
		LogLevelMap[LogLevel.Elements] = {
			prefix: '[Elements]',
			color: 'color:#000000'
		}

		// Current log level
		DoLog.logLevel = win.isPY_DNG ? LogLevel.Info : LogLevel.Warning; // Info Warning Success Error

		// Log counter
		DoLog.logCount === undefined && (DoLog.logCount = 0);

		// Get args
		let level, logContent, asObject;
		switch (arguments.length) {
			case 1:
				level = LogLevel.Info;
				logContent = arguments[0];
				asObject = false;
				break;
			case 2:
				level = arguments[0];
				logContent = arguments[1];
				asObject = false;
				break;
			case 3:
				level = arguments[0];
				logContent = arguments[1];
				asObject = arguments[2];
				break;
			default:
				level = LogLevel.Info;
				logContent = 'DoLog initialized.';
				asObject = false;
				break;
		}

		// Log when log level permits
		if (level <= DoLog.logLevel) {
			let msg = '%c' + LogLevelMap[level].prefix + (typeof MODULE_DATA === 'object' ? '[' + MODULE_DATA.name + ']' : '');
			let subst = LogLevelMap[level].color;

			if (asObject) {
				msg += ' %o';
			} else {
				switch (typeof(logContent)) {
					case 'string':
						msg += ' %s';
						break;
					case 'number':
						msg += ' %d';
						break;
					case 'object':
						msg += ' %o';
						break;
				}
			}

			if (++DoLog.logCount > 512) {
				console.clear();
				DoLog.logCount = 0;
			}
			console.log(msg, subst, logContent);
		}
	}

	const dealed = [];
	let count = 0;
	const interval = setInterval(deal, 1000);

	function deal() {
		// Max: 40 time deals
		if (++count > 40) {
			clearInterval(interval);
			return false;
		}

		// Get iframes & <html>s
		const iframes = $All('iframe[id^="ueditor"]');
		const htmls = Array.from(iframes).concat([document.head.parentElement]).map((elm) => {
			// Repeat check
			if (dealed.includes(elm)) {
				// Dealed iframe, skip
				return false;
			} else {
				// Push into dealed list
				dealed.push(elm);
			}

			// Get <html>
			if (elm.contentDocument) {
				// Get success
				DoLog('success', elm);
				const html = elm.contentDocument.head.parentElement;
				return html;
			} else {
				// Get failed (Access denied maybe);
				DoLog('denied', elm);
				return null;
			}
		});

		// Add listener
		htmls.forEach((html) => (html && html.addEventListener('paste', function(e) {e.stopImmediatePropagation();}, true)));
		htmls.some(h => h) && DoLog(htmls);

		return true;
	}

	// Basic functions
	// querySelector
	function $() {
		switch(arguments.length) {
			case 2:
				return arguments[0].querySelector(arguments[1]);
				break;
			default:
				return document.querySelector(arguments[0]);
		}
	}
	// querySelectorAll
	function $All() {
		switch(arguments.length) {
			case 2:
				return arguments[0].querySelectorAll(arguments[1]);
				break;
			default:
				return document.querySelectorAll(arguments[0]);
		}
	}
	// createElement
	function $CrE() {
		switch(arguments.length) {
			case 2:
				return arguments[0].createElement(arguments[1]);
				break;
			default:
				return document.createElement(arguments[0]);
		}
	}
})();