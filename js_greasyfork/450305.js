// ==UserScript==
// @name         SMBC-comics reading helper
// @namespace    http://tampermonkey.net/
// @version      5
// @description  Shows the hover title immediately and the red button panel after a delay to help reading the Saturday Morning Breakfast Cereal web comics.
// @author       andrybak
// @license      MIT
// @match        https://www.smbc-comics.com/comic/*
// @match        https://www.smbc-comics.com/
// @match        https://www.smbc-comics.com/index.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=smbc-comics.com
// @require      https://cdn.jsdelivr.net/gh/rybak/userscript-libs@e86c722f2c9cc2a96298c8511028f15c45180185/waitForElement.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450305/SMBC-comics%20reading%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/450305/SMBC-comics%20reading%20helper.meta.js
// ==/UserScript==

/*
 * Copyright (c) 2022-2025 Andrei Rybak
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/* jshint esversion: 6 */
/* globals waitForElement */

(function() {
	'use strict';

	const LOG_PREFIX = '[SMBC reading helper]:';

	function info(...toLog) {
		console.info(LOG_PREFIX, ...toLog);
	}

	function warn(...toLog) {
		console.warn(LOG_PREFIX, ...toLog);
	}

	function error(...toLog) {
		console.error(LOG_PREFIX, ...toLog);
	}

	waitForElement('#cc-comic').then(ccComic => {
		info('Found #cc-comic');
		const text = ccComic.title;
		const span = document.createElement('span');
		span.style.fontFamily = "'Comic Sans MS'";
		span.style.fontSize = '150%';
		span.append(text);
		const div = document.createElement('div');
		div.style.clear = 'both';
		div.appendChild(span);
		document.getElementById('cc-comicbody').appendChild(div);
		info('Hidden text has been shown.');
		setTimeout(() => {
			// IDs are not unique on the website
			const buttons = document.querySelectorAll('#extracomic');
			if (buttons.length < 1) {
				error('Cannot find red buttons.');
			} else {
				buttons.forEach(redButton => {
					if (redButton.offsetParent !== null) {
						redButton.click();
					}
				});
				info('Hidden panel has been shown.');
			}
		}, 2000);
	});
	info('Waiting...');
})();