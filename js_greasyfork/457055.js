// ==UserScript==
// @name         docs.gradle.org: redirect current to actual version
// @description  Redirects /current/ to an exact version of Gradle docs to help create better permalinks to docs.gradle.org
// @version      2
// @match        https://docs.gradle.org/*
// @namespace    http://tampermonkey.net/
// @license      MIT
// @author       Andrei Rybak
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gradle.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457055/docsgradleorg%3A%20redirect%20current%20to%20actual%20version.user.js
// @updateURL https://update.greasyfork.org/scripts/457055/docsgradleorg%3A%20redirect%20current%20to%20actual%20version.meta.js
// ==/UserScript==

/*
 * Copyright (c) 2022-2023 Andrei Rybak
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

(function() {
	'use strict';

	function log(...toLog) {
		console.log('[gradle.org current redirecter]:', ...toLog);
	}

	function redirect() {
		const currentUrl = document.location.href;
		const versionElement = document.querySelector("#command_line_interface > div.layout > header > nav > div.site-header__navigation-header > div.site-header-version > ul > li > span > span");

		// siteDecorateVersion is a variable in Gradle's own JS
		if (versionElement || siteDecorateVersion) {
			log("siteDecorateVersion", siteDecorateVersion);
			const version = siteDecorateVersion ? siteDecorateVersion : versionElement.innerHTML;
			const permaUrl = currentUrl.replace('docs.gradle.org/current/', 'docs.gradle.org/' + version + '/');
			log('Redirecting to', permaUrl);
			document.location.assign(permaUrl);
		} else {
			log('Did not find version element and siteDecorateVersion is not defined. Trying again...');
			setTimeout(redirect, 500);
		}
	}

	/*
	 * For convenience the script is active on all documentation pages.
	 * That way, it can be turned off even after redirection.
	 * This is why we have to check the URL before trying to redirect.
	 */
	if (document.location.href.includes('/current/')) {
		redirect();
	}
})();