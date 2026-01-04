// ==UserScript==
// @name         Bandcamp Downloader
// @namespace    https://github.com/whqwert/userscripts
// @version      1.2.0
// @description  Adds a download link to songs on Bandcamp
// @author       whqwert
// @match        https://*.bandcamp.com/*
// @icon         https://s4.bcbits.com/img/favicon/favicon-32x32.png
// @supportURL   https://github.com/whqwert/userscripts/issues
// @license      MIT
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/435824/Bandcamp%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/435824/Bandcamp%20Downloader.meta.js
// ==/UserScript==

(function () {
	'use strict';

	const adata = unsafeWindow.TralbumData;
	if (!adata) return;

	const uiTypes = {
		desktop: {
			elem: '.share-collect-controls > ul',
			button: `<li id="download-button">
						<span class="bc-ui2 share-embed-icon" style="
							clip-path: polygon(65% 0%, 15% 50%, 15% 85%, 65% 80%, 100% 37%);
							transform: rotate(90deg) scale(1.06);
						"></span>
						<span class="share-embed-label">
							<button type="button">
								Download
							</button>
						</span>
					</li>`,
			insert: 'beforeend'
		},
		mobile1: {
			elem: '.main-button',
			button: `<h4 class="ft compound-button" id="download-button">
							<button type="button" class="download-link buy-link">
								Download Track
							</button>
							&nbsp;
						</h4>`,
			insert: 'afterend'
		},
		mobile2: {
			elem: '#purchase-options-btn',
			button: `<button id="download-button" style="
					margin-top: .875rem;
					background: var(--cta-background-color);
					color: var(--cta-text-color);
					min-height: var(--touch-target-size);
					font-weight: bold;
					outline-offset: -4px;">
						Download Track
					</button>`,
			insert: 'afterend'
		}
	};

	let uiType;
	const data = JSON.parse(
		document.getElementById('pagedata').getAttribute('data-blob')
	);
	if (!data.templglobals.is_phone) {
		uiType = uiTypes.desktop;
	} else {
		// pagedata does not have as many values with mobile2
		if (data.env) {
			uiType = uiTypes.mobile1;
		} else {
			uiType = uiTypes.mobile2;
		}
	}

	function downloadSong(file, title) {
		GM_download({
			url: file,
			name: adata.artist + ' - ' + title + '.mp3',
			saveAs: true
		});
	}

	const table = document.querySelectorAll('#track_table > tbody > tr');

	if (table.length) {
		// isAlbum
		const dlinks = document.getElementsByClassName('dl_link');
		for (const [i, track] of adata.trackinfo.entries()) {
			const link = dlinks[i];
			const file = track.file['mp3-128'];
			const title = track.title;

			link.innerHTML = `<a
				href="${file}"
				title="${adata.artist} - ${title}">
				download
			</a>`;
			link.firstChild.onclick = () => {
				downloadSong(file, title);
				return false;
			};
		}
	} else {
		// isSong
		const file = unsafeWindow.TralbumData.trackinfo[0].file['mp3-128'];
		const { elem, insert, button } = uiType;
		document.querySelector(elem).insertAdjacentHTML(insert, button);
		document.getElementById('download-button').onclick = () => {
			downloadSong(file, adata.current.title);
		};
	}
})();
