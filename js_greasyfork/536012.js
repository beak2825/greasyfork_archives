// ==UserScript==
// @name         Garmin Connect - Auto-Paste on Right Click
// @namespace    typpi.online
// @version      1.7
// @description  Automatically pastes clipboard content into specific input fields on right-click. Clipboard access requires HTTPS and user permission. Right-clicking on target fields will auto-paste clipboard content. (Note: Clipboard API support may vary by browser.)
// @author       Nick2bad4u
// @match        *://connect.garmin.com/*
// @license      UnLicense
// @tag          garmin
// @icon         https://www.google.com/s2/favicons?sz=64&domain=connect.garmin.com
// @grant        none
// @run-at       document-end
// @homepageURL  https://github.com/Nick2bad4u/UserStyles
// @supportURL   https://github.com/Nick2bad4u/UserStyles/issues
// @downloadURL https://update.greasyfork.org/scripts/536012/Garmin%20Connect%20-%20Auto-Paste%20on%20Right%20Click.user.js
// @updateURL https://update.greasyfork.org/scripts/536012/Garmin%20Connect%20-%20Auto-Paste%20on%20Right%20Click.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// === Configurable Section ===
	const FIELD_CONFIG = [
		{
			selector: 'input[name="elev-gain"]',
			name: 'elev-gain',
			sanitize: (text) => text.replace(/[^\d.-]/g, ''),
		},
		{
			selector: 'input[name="elev-loss"]',
			name: 'elev-loss',
			sanitize: (text) => text.replace(/[^\d.-]/g, ''),
		},
		{
			selector: 'input[name="youtubeUrl"]',
			name: 'youtubeUrl',
			// Allow more URL-safe characters
			sanitize: (text) => text.replace(/[^\w\-.:/?=&%#~@!$*'(),]/g, ''),
		},
		{
			selector: 'textarea#activity-description',
			name: 'activity-description',
			// Allow most printable characters, but sanitize HTML special chars
			sanitize: (text) => text.replace(/[<>&"'`]/g, (char) => escapeMap[char] || char),
		},
	];
	const TARGET_INPUT_SELECTOR = FIELD_CONFIG.map((f) => f.selector).join(', ');

	// Define escapeMap outside the event handler for efficiency
	const escapeMap = {
		'<': '&lt;',
		'>': '&gt;',
		'&': '&amp;',
		'"': '&quot;',
		"'": '&#39;',
		'`': '&#96;',
	};

	// Add a tooltip to target fields to inform users about right-click auto-paste
	function addAutoPasteTooltip() {
		document.querySelectorAll(TARGET_INPUT_SELECTOR).forEach((input) => {
			if (!input.hasAttribute('data-autopaste-tooltip')) {
				input.setAttribute('title', 'Right-click to auto-paste clipboard content. Clipboard access required.');
				input.setAttribute('aria-label', 'Right-click to auto-paste clipboard content. Clipboard access required.');
				input.setAttribute('data-autopaste-tooltip', '1');
			}
		});
	}

	// Debounce function for performance
	function debounce(fn, delay) {
		let timer;
		return function (...args) {
			clearTimeout(timer);
			timer = setTimeout(() => fn.apply(this, args), delay);
		};
	}

	// Initial tooltip set and observe for dynamically added fields
	addAutoPasteTooltip();
	const observer = new MutationObserver(debounce(addAutoPasteTooltip, 200));
	observer.observe(document.body, { childList: true, subtree: true });

	document.body.addEventListener('contextmenu', async function (event) {
		const target = event.target;
		// Type safety: ensure target is an input or textarea element
		if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;
		// Check if right-clicked element is one of the target input fields
		const field = FIELD_CONFIG.find((f) => target.matches(f.selector));
		if (field) {
			event.preventDefault(); // Prevent default right-click menu

			if (navigator.clipboard && navigator.clipboard.readText) {
				try {
					// Use clipboard API to read the text and paste it
					const clipboardText = await navigator.clipboard.readText();
					// Sanitize clipboard content to prevent injection of malicious content
					let sanitizedText = clipboardText.replace(/[<>&"'`]/g, (char) => escapeMap[char] || char);
					// Use field-specific sanitizer if available
					if (field.sanitize) sanitizedText = field.sanitize(sanitizedText);
					target.value = sanitizedText; // Paste sanitized clipboard content into the field
				} catch (err) {
					console.error(
						`Clipboard read error on input field "${target.name}" at URL "${window.location.href}" using browser "${navigator.userAgent}":`,
						err
					);
					alert(
						'Failed to access clipboard. Clipboard access may require HTTPS and browser permission. Please check your browser settings or use Ctrl+V manually.'
					);
				}
			} else {
				alert('Clipboard API is not supported in this browser or context. Please use Ctrl+V to paste manually.');
			}
		}
	});
})();
