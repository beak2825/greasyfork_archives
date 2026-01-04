// ==UserScript==
// @name         YouTube: thumbnail previews
// @icon         https://youtube.com/favicon.ico
// @namespace    andrybak.dev
// @version      5
// @description  Shows the collection of available thumbnails in the highest possible resolution.
// @author       puzzle, andrybak
// @license      MIT
// @match        https://www.youtube.com/watch*
// @match        https://www.youtube.com/live/*
// @grant        GM_addStyle
// @run-at       document-idle
// @connect      i.ytimg.com
// @require      https://cdn.jsdelivr.net/gh/rybak/userscript-libs@dc32d5897dcfa40a01c371c8ee0e211162dfd24c/waitForElement.js
// @downloadURL https://update.greasyfork.org/scripts/498894/YouTube%3A%20thumbnail%20previews.user.js
// @updateURL https://update.greasyfork.org/scripts/498894/YouTube%3A%20thumbnail%20previews.meta.js
// ==/UserScript==

/*
 * This script is a very simplified fork of the script
 * https://greasyfork.org/en/scripts/367855-youtube-com-thumbnail
 * by Greasy Fork user "puzzle".
 *
 * This script is not intended to be used all the time.
 * Instead, just turn it on in your userscript manager
 * whenever you need access to the thumbnails.
 */

(function() {
	'use strict';

	const prefix = 'userscript_youtube-thumbnail-previews__';

	GM_addStyle(`
		/* userscript thumbnail */
		.${prefix}img {
			margin-inline-start: unset; margin-inline-end: unset;
			height: 90px; width: 160px; border-radius: 3px; margin-right: 15px;
			background-size: cover;
			box-shadow: 2px 2px 5px 0px black;
		}
	`);

	async function createImage(parent, filename) {
		const video_id = new URLSearchParams(location.search).get('v') || location.pathname.match(/\/live\/([\w-_]+)/i)[1];
		const linkId = `${prefix}link${filename}`;
		const imgId = `${prefix}img${filename}`;
		let img = document.getElementById(imgId);
		let link = document.getElementById(linkId);
		if (img) {
			if (img.dataset.video_id === video_id) {
				return;
			}
		} else {
			img = document.createElement('figure');
			img.classList.add(`${prefix}img`);
			link = document.createElement('a');
			link.id = linkId;
			link.target = "_blank"; // to avoid misclicks ruining the viewing experience
			link.rel = "noopener noreferrer";
			link.appendChild(img);
			parent.appendChild(link);
		}
		const url = `https://i.ytimg.com/vi/${video_id}/${filename}.jpg`
		img.id = imgId;
		img.dataset.video_id = video_id;
		img.style.backgroundImage = `url(${url})`;
		link.href = url;
	}

	function createOrUpdateImage() {
		/*
		 * Middle row seems to not be used on most videos.
		 * It's empty and is just sitting there.
		 */
		waitForElement('.watch-active-metadata #middle-row').then(p => {
			/*
			 * so that all thumbnails are in rows, not in a column
			 */
			p.style.display = 'flex';
			p.style.flexWrap = 'wrap';
			/*
			 * sorted roughtly in popularity/usefulness, from best to worst
			 * TODO:
			 *   try using <img> with srcset property https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/srcset
			 *   and let browser figure out the best image
			 */
			createImage(p, "maxresdefault");
			createImage(p, "maxres1");
			createImage(p, "maxres2");
			createImage(p, "maxres3");
			createImage(p, "hqdefault");
			createImage(p, "sddefault");
			createImage(p, "mqdefault");
		});
	}

	document.addEventListener('readystatechange',function(e) {
		if (document.readyState === 'complete') {
			createOrUpdateImage();
		}
	});

	document.addEventListener('yt-navigate-finish',function(e) {
		createOrUpdateImage();
	});
})();