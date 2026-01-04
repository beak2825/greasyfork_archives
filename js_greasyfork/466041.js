// ==UserScript==
// @name         docs.gradle.org: permalink to actual version
// @description  Adds a permanent link for Gradle documentation pages (including /current/) to the exact version to help create better links to docs.gradle.org
// @version      4
// @match        https://docs.gradle.org/*
// @namespace    https://github.com/rybak
// @license      MIT
// @author       Andrei Rybak
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gradle.org
// @grant        none
// @require      https://cdn.jsdelivr.net/gh/rybak/userscript-libs@e86c722f2c9cc2a96298c8511028f15c45180185/waitForElement.js
// @downloadURL https://update.greasyfork.org/scripts/466041/docsgradleorg%3A%20permalink%20to%20actual%20version.user.js
// @updateURL https://update.greasyfork.org/scripts/466041/docsgradleorg%3A%20permalink%20to%20actual%20version.meta.js
// ==/UserScript==

/*
 * Copyright (c) 2023-2025 Andrei Rybak
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

/* globals siteDecorateVersion waitForElement */

(function() {
	'use strict';

	const LOG_PREFIX = '[docs.gradle.org permalink]:';

	function info(...toLog) {
		console.info(LOG_PREFIX, ...toLog);
	}

	function warn(...toLog) {
		console.warn(LOG_PREFIX, ...toLog);
	}

	function getPermaUrl(version) {
		const currentUrl = document.location.href;
		if (currentUrl.includes('/current/')) {
			return currentUrl.replace('docs.gradle.org/current/', 'docs.gradle.org/' + version + '/');
		} else {
			return currentUrl;
		}
	}

	function createPermalink(version) {
		const permaUrl = getPermaUrl(version);
		info('Permalink:', permaUrl);
		const a = document.createElement('a');
		a.href = permaUrl;
		a.append(document.createTextNode("[permalink " + version + "]"));
		a.style.marginTop = '1.2em';
		a.style.marginLeft = '1em';
		a.style.display = 'block';
		a.style.alignSelf = 'center';
		a.style.height = '36px';
		return a;
	}

	function addPermalink() {
		const versionElement = document.querySelector("#command_line_interface > div.layout > header > nav > div.site-header__navigation-header > div.site-header-version > ul > li > span > span");

		// siteDecorateVersion is a variable in Gradle's own JS
		if (versionElement || typeof siteDecorateVersion !== 'undefined') {
			if (typeof siteDecorateVersion !== 'undefined') {
				info('siteDecorateVersion', siteDecorateVersion);
			} else {
				warn('siteDecorateVersion is not defined');
			}

			const version = typeof siteDecorateVersion !== 'undefined' ? siteDecorateVersion : versionElement.innerHTML;
			const a = createPermalink(version);

			/*
			 * element that contains either the version selector dropdown (in tutorial docs) or
			 * the version display `.site-header-version` (javadocs)
			 */
			waitForElement('nav .site-header__navigation-header, nav#navigation-wrapper').then(container => {
				if (container.id === 'navigation-wrapper') {
					info('Detected new HTML layout of Kotlin DSL reference docs');
					a.style.color = 'var(--ring-action-link-color)';
					container.insertBefore(a, container.querySelector('.navigation-controls'));
				} else {
					// older HTML layout
					info('Detected older HTML layout');
					container.append(a);
				}
				info('Navigation header has loaded. Added permalink.');
			});
		} else {
			info('Did not find version element and siteDecorateVersion is not defined. Trying again...');
			setTimeout(createPermalink, 500);
		}
	}

	addPermalink();
})();