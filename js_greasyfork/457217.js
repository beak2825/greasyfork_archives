// ==UserScript==
// @name         Jira: Project icon as tab icon
// @namespace    https://github.com/rybak/atlassian-tweaks
// @version      6
// @license      MIT
// @description  Changes browser tab icon to Jira project icon
// @author       Sergey Lukashevich
// @include      https://*jira*/*
// @match        https://jira.example.com/*
// @icon         https://jira.atlassian.com/favicon.ico
// @homepageURL  https://github.com/rybak/atlassian-tweaks
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457217/Jira%3A%20Project%20icon%20as%20tab%20icon.user.js
// @updateURL https://update.greasyfork.org/scripts/457217/Jira%3A%20Project%20icon%20as%20tab%20icon.meta.js
// ==/UserScript==

/*
 * Copyright (c) 2022-2023 Sergey Lukashevich
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

	let projectAvatar = document.getElementById('project-avatar');
	let url = null;
	if (!projectAvatar) {
		let elements = document.getElementsByClassName('aui-avatar-project');
		if (elements.length === 1) {
			let byTagName = elements[0].getElementsByTagName('img');
			if (byTagName.length === 1) {
				projectAvatar = byTagName[0];
			}
		}
	}
	if (projectAvatar) {
		url = projectAvatar.src;
	} else {
		// try layout as in the cloud version of Jira Software
		projectAvatar = document.querySelector('div[data-navheader="true"] span[style*=background]');
		if (projectAvatar) {
			const bgImage = projectAvatar.style.getPropertyValue("background-image");
			url = bgImage.slice(5, bgImage.length - 7); // cut out the URL from CSS code `url('...');`
		}
	}

	let shortcutIco = document.querySelector('link[rel="shortcut icon"]');

	if (url && shortcutIco) {
		shortcutIco.href = url;
	}
})();
