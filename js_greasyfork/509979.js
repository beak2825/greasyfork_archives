// ==UserScript==
// @name         Studydrive Downloader
// @namespace    http://tampermonkey.net/
// @version      2025-06-07
// @description  Download Studydrive documents
// @author       You
// @match        https://www.studydrive.net/*/doc/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=studydrive.net
// @grant        GM_download
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509979/Studydrive%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/509979/Studydrive%20Downloader.meta.js
// ==/UserScript==

(function () {
	'use strict';

	let pdfBlob = null;

	// --- 1. Intercept Fetch ---
	function interceptFetch() {
		const origFetch = window.fetch;
		window.fetch = async function (...args) {
			const resp = await origFetch.apply(this, args);

			// Process only if response is PDF and status is OK
			try {
				const contentType = resp.headers.get('content-type') || '';
				if (contentType.includes('application/pdf')) {
					const buffer = await resp.clone().arrayBuffer();
					const blob = new Blob([buffer], { type: 'application/pdf' });
					window.dispatchEvent(new CustomEvent('pdf-intercepted', { detail: { blob } }));
				}
			} catch (err) {
				console.error('[StudydriveDL] Error in fetch interception:', err);
			}

			return resp;
		};
	}

	// --- 2. Download logic ---
	function download() {
		if (!pdfBlob) {
			console.log('[StudydriveDL] PDF data not loaded yet!');
			return;
		}
		const blobUrl = URL.createObjectURL(pdfBlob);

		// Try to extract a nice filename, fallback to something reasonable
		const heading = document.querySelector("#main-container h1");
		let fileName = heading && heading.textContent.trim()
		? (heading.textContent.trim().replace(/[\/\\:*?"<>|]+/g, '_').replace(/\.pdf$/, '') + '.pdf')
		: 'document.pdf';

		console.log("[StudydriveDL] Downloading", blobUrl, "as", fileName);
		GM_download(blobUrl, fileName);
	}

	// --- 3. Button Setup ---
	function replaceWithDownloadButton() {
		const origBtn = document.querySelector("button[data-specific-auth-trigger=download]");
		if (!origBtn) return false;

		// Remove all listeners by cloning node
		const btnCopy = origBtn.cloneNode(true);
		btnCopy.addEventListener('click', download);
		origBtn.replaceWith(btnCopy);

		console.log("[StudydriveDL] Download button connected");
		return true;
	}

	// --- 4. Injection & Init ---

	// Inject fetch interception as early as possible
	function inject(pageFn) {
		const script = document.createElement('script');
		script.textContent = '(' + pageFn.toString() + ')();';
		document.documentElement.appendChild(script);
		script.remove();
	}
	inject(interceptFetch);

	// Listen for intercepted PDF in the userscript
	window.addEventListener('pdf-intercepted', (event) => {
		pdfBlob = event.detail.blob;
	});

	// Keep trying to setup the button to handle SPA navigation/timing issues
	const buttonInterval = setInterval(() => {
		if (replaceWithDownloadButton()) clearInterval(buttonInterval);
	}, 500);

	// Also register menu for fallback/manual use
	GM_registerMenuCommand("Download (Studydrive PDF)", download);
})();