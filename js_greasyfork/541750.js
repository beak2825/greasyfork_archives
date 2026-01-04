// ==UserScript==
// @name         Google Sheets Image Zoom
// @namespace    https://github.com/1LineAtaTime/TamperMonkey-Scripts
// @version      4.0
// @description  Auto-preview Google Sheets image tooltips with zoom-to-fit and crosshairs. ESC or click to close. Clean native cursor only. Only triggers on Google Drive file links. Optimized for instant popup without spam logging.
// @author       1LineAtaTime
// @match        https://docs.google.com/spreadsheets/*
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/541750/Google%20Sheets%20Image%20Zoom.user.js
// @updateURL https://update.greasyfork.org/scripts/541750/Google%20Sheets%20Image%20Zoom.meta.js
// ==/UserScript==

(function () {
	'use strict';

	const DEBUG = false;
	const FILL_PERCENTAGE = 1.0;
	const SHOW_CROSSHAIRS = true;
	const DRIVE_FILE_REGEX = /^https?:\/\/drive\.google\.com\/(?:file\/d\/([^/]+)\/view|uc\?id=([^&]+))/i;

	const BUBBLE_SELECTOR = '.waffle-multilink-tooltip';
	const IMAGE_ID = 'gs_bubble_preview_img';
	const VLINE_ID = 'gs_crosshair_vline';
	const HLINE_ID = 'gs_crosshair_hline';
	const ZINDEX = 999999;

	let currentHref = '';
	let bubbleObserver = null;
	let bodyObserver = null;
	let lastUrl = location.href; // Track URL changes (sheet tab switches)

	function log(...args) { if (DEBUG) console.log('[GS-Preview]', ...args); }

	function isVisible(el) {
		if (!el) return false;
		const style = getComputedStyle(el);
		return style.display !== 'none';
	}

	function hideOverlay(resetCache = false) {
		[IMAGE_ID, VLINE_ID, HLINE_ID].forEach(id => {
			const el = document.getElementById(id);
			if (el) el.remove();
		});
		document.removeEventListener('mousemove', globalMouseMoveHandler);
		if (resetCache) currentHref = '';
	}

	function buildOverlay(imgSrc) {
		hideOverlay(false);

		const img = document.createElement('img');
		img.id = IMAGE_ID;
		img.src = imgSrc;
		img.style.cssText = `
			position: fixed;
			inset: 0;
			margin: auto;
			width: auto;
			height: auto;
			object-fit: contain;
			z-index: ${ZINDEX};
			background: transparent;
			cursor: default;
			box-shadow: 0 0 25px rgba(0,0,0,0.6);
			transition: opacity 0.15s ease;
			opacity: 0;
		`;

		img.addEventListener('click', () => hideOverlay(false));

		img.onload = () => {
			const vw = window.innerWidth;
			const vh = window.innerHeight;
			const iw = img.naturalWidth;
			const ih = img.naturalHeight;

			const aspectRatio = iw / ih;
			const maxW = vw * FILL_PERCENTAGE;
			const maxH = vh * FILL_PERCENTAGE;

			let finalW, finalH;
			if (maxW / maxH < aspectRatio) {
				finalW = maxW;
				finalH = finalW / aspectRatio;
			} else {
				finalH = maxH;
				finalW = finalH * aspectRatio;
			}

			img.style.width = `${finalW}px`;
			img.style.height = `${finalH}px`;
			img.style.opacity = '1';

			if (SHOW_CROSSHAIRS) setupCrosshairs();
		};

		document.body.appendChild(img);
		log('Overlay built for', imgSrc);
	}

	function setupCrosshairs() {
		let vLine = document.getElementById(VLINE_ID);
		let hLine = document.getElementById(HLINE_ID);

		if (!vLine) {
			vLine = document.createElement('div');
			vLine.id = VLINE_ID;
			vLine.style.cssText = `
				position: fixed;
				width: 1px;
				background: red;
				left: 0;
				top: 0;
				z-index: ${ZINDEX + 1};
				pointer-events: none;
			`;
			document.body.appendChild(vLine);
		}

		if (!hLine) {
			hLine = document.createElement('div');
			hLine.id = HLINE_ID;
			hLine.style.cssText = `
				position: fixed;
				height: 1px;
				background: red;
				left: 0;
				top: 0;
				z-index: ${ZINDEX + 1};
				pointer-events: none;
			`;
			document.body.appendChild(hLine);
		}

		document.addEventListener('mousemove', globalMouseMoveHandler);
	}

	function globalMouseMoveHandler(e) {
		const img = document.getElementById(IMAGE_ID);
		const vLine = document.getElementById(VLINE_ID);
		const hLine = document.getElementById(HLINE_ID);
		if (!img || !vLine || !hLine) return;

		const rect = img.getBoundingClientRect();
		const x = e.clientX;
		const y = e.clientY;

		if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
			vLine.style.display = 'none';
			hLine.style.display = 'none';
			return;
		}

		vLine.style.display = 'block';
		hLine.style.display = 'block';

		vLine.style.left = `${x}px`;
		vLine.style.top = `${rect.top}px`;
		vLine.style.height = `${rect.height}px`;

		hLine.style.left = `${rect.left}px`;
		hLine.style.top = `${y}px`;
		hLine.style.width = `${rect.width}px`;
	}

	function normToUc(url) {
		const match = url.match(DRIVE_FILE_REGEX);
		if (!match) return null;
		const id = match[1] || match[2];
		return `https://drive.google.com/uc?id=${id}`;
	}

	function extractDriveUrl(bubble) {
		const dataEl = bubble.querySelector('[data-url*="drive.google.com"]');
		if (dataEl) {
			const raw = dataEl.getAttribute('data-url');
			const finalUrl = normToUc(raw || '');
			if (finalUrl) {
				log('extractDriveUrl: used data-url element', dataEl);
				return finalUrl;
			}
		}
		const aTag = bubble.querySelector('a[href*="drive.google.com"]');
		if (aTag) {
			const finalUrl = normToUc(aTag.href || '');
			if (finalUrl) {
				log('extractDriveUrl: used <a> href from', aTag);
				return finalUrl;
			}
		}
		log('extractDriveUrl: no valid URL found yet');
		return null;
	}

	function startBubbleObserver(bubble) {
		if (bubbleObserver) bubbleObserver.disconnect();

		bubbleObserver = new MutationObserver(() => {
			if (!isVisible(bubble)) {
				log('Bubble hidden — clearing overlay and URL cache');
				hideOverlay(true);
				startBodyObserver();
				return;
			}
			const url = extractDriveUrl(bubble);
			if (url && url !== currentHref) {
				currentHref = url;
				buildOverlay(url);
			}
		});

		bubbleObserver.observe(bubble, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ['style']
		});
	}

	function startBodyObserver() {
		if (bodyObserver) bodyObserver.disconnect();

		bodyObserver = new MutationObserver(() => {
			const bubble = document.querySelector(BUBBLE_SELECTOR);
			if (!bubble) return;
			if (!isVisible(bubble)) return;

			log('Bubble found — starting fast image extraction');
			startBubbleObserver(bubble);

			const url = extractDriveUrl(bubble);
			if (url && url !== currentHref) {
				currentHref = url;
				buildOverlay(url);
			}
			bodyObserver.disconnect();
		});

		bodyObserver.observe(document.body, { childList: true, subtree: true });
	}

	// Heartbeat + URL change detection
	setInterval(() => {
		if (location.href !== lastUrl) {
			log('URL changed (sheet tab switch) — resetting');
			lastUrl = location.href;
			hideOverlay(true);
			startBodyObserver();
		}

		// Restart observers if somehow disconnected
		const bubble = document.querySelector(BUBBLE_SELECTOR);
		if (bubble && !bubbleObserver) {
			log('Heartbeat: bubble exists but no observer — restarting');
			startBubbleObserver(bubble);
		} else if (!bubble && !bodyObserver) {
			log('Heartbeat: no bubble and no bodyObserver — restarting');
			startBodyObserver();
		}
	}, 1000);

	document.addEventListener('keydown', e => { if (e.key === 'Escape') hideOverlay(false); });

	window.addEventListener('load', () => {
		log('Starting bubble watcher...');
		startBodyObserver();
	});
})();
