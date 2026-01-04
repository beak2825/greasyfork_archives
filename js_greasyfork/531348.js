// ==UserScript==
// @name         MangaDex: more edit links
// @namespace    https://andrybak.dev
// @version      1
// @description  Adds edit buttons/links in more places on MangaDex
// @author       Andrei Rybak
// @license      MIT
// @match        https://mangadex.org/user/me?tab=uploads
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mangadex.org
// @grant        none
// @require      https://cdn.jsdelivr.net/gh/rybak/userscript-libs@dc32d5897dcfa40a01c371c8ee0e211162dfd24c/waitForElement.js
// @downloadURL https://update.greasyfork.org/scripts/531348/MangaDex%3A%20more%20edit%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/531348/MangaDex%3A%20more%20edit%20links.meta.js
// ==/UserScript==

/*
 * Copyright (c) 2025 Andrei Rybak
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

	const PENCIL_ICON = `<svg data-v-9ba4cb7e="" data-v-c031ce93="" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="feather feather-edit-2 icon small text-primary" viewBox="0 0 24 24">
	<path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"></path></svg>`;

	function createEditLink(chapterHref) {
		// <a data-v-c031ce93="" href="/chapter/1a1a0c96-66e1-4a54-8b7b-28bfa3bd4d8b/edit" class="mx-1 px-1 flex flex-col justify-center" title="Edit chapter"></a>
		const editLink = document.createElement('a');
		editLink.href = chapterHref + '/edit';
		editLink.innerHTML = PENCIL_ICON;
		editLink.classList.add('mx-1', 'px-1', 'flex', 'flex-col', 'justify-center');
		return editLink;
	}

	function addEditLinksMyUploads() {
		// https://mangadex.org/chapter/1a1a0c96-66e1-4a54-8b7b-28bfa3bd4d8b/edit
		waitForElement('.chapter-feed__container').then(chaptersContainer => {
			document.querySelectorAll('.chapter-feed__chapters-list .chapter').forEach(chapterDiv => {
				const chapterGridAnchor = chapterDiv.querySelector('.chapter-grid');
				const editLink = createEditLink(chapterGridAnchor.href);
				chapterDiv.appendChild(editLink);
			});
		});
	}

	addEditLinksMyUploads();
})();