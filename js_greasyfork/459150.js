// ==UserScript==
// @name         Bitbucket: PR author avatar as favicon
// @namespace    https://github.com/rybak/atlassian-tweaks
// @version      5
// @license      MIT
// @description  Set Bitbucket PR favicon to author's avatar
// @author       Andrei Rybak
// @include      https://*bitbucket*/*/repos/*/pull-requests/*
// @match        https://bitbucket.example.com/*/repos/*/pull-requests/*
// @match        https://bitbucket.org/*/pull-requests/*
// @icon         https://bitbucket.org/favicon.ico
// @homepageURL  https://github.com/rybak/atlassian-tweaks
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459150/Bitbucket%3A%20PR%20author%20avatar%20as%20favicon.user.js
// @updateURL https://update.greasyfork.org/scripts/459150/Bitbucket%3A%20PR%20author%20avatar%20as%20favicon.meta.js
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

(function() {
	'use strict';

	function info(...toLog) {
		console.info("[PR avatars]", ...toLog);
	}

	function debug(...toLog) {
		console.debug("[PR avatars]", ...toLog);
	}

	function error(...toLog) {
		console.error("[PR avatars]", ...toLog);
	}

	window.addEventListener('load', function() {
		info("Looking for author avatar...")
		let userAvatar = document.querySelector("[data-testid=pull-request-author--image]");
		let url = null;

		if (userAvatar) {
			// Bitbucket Server
			let image = userAvatar.style.backgroundImage;
			url = image.substr(5, image.length - 7); // cut out the URL from CSS code `url('...');`
			if (url == '') {
				info('userAvatar.style.backgroundImage is empty, using userAvatar.src...');
				url = userAvatar.src;
			}
		} else {
			// fallback to bitbucket.org's layout (Bitbucket Cloud?)
			info("Falling back to layout as on bitbucket.org for the avatar...");
			userAvatar = document.querySelector('div[data-qa="pr-header-author-styles"] img, div[data-qa="pr-header-author"] img')
			url = userAvatar.src;
		}

		let shortcutIcon = document.querySelector('link[rel="shortcut icon"], link[rel="icon"]');

		debug("userAvatar =", userAvatar);
		debug("shortcutIcon =", shortcutIcon);
		debug("URL =", url);
		if (url && shortcutIcon) {
			shortcutIcon.href = url;
		} else {
			error("Something went wrong");
		}
	}, false);
})();
