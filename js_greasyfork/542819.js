// ==UserScript==
// @name         Tarnkappe Adblocker Bypass
// @version      1.0
// @namespace    Unknown
// @description  Remove Anti-Adblocker from Tarnkappe.info
// @match        https://tarnkappe.info/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542819/Tarnkappe%20Adblocker%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/542819/Tarnkappe%20Adblocker%20Bypass.meta.js
// ==/UserScript==

(function() {
	'use strict';

	function removeAntiAdblocker() {
		// Remove Overlay
		document.querySelectorAll('.adblock-card-overlay').forEach(el => el.remove());

    const postOverlay = document.querySelector('.adblock-post-overlay');
		if (postOverlay) {
			postOverlay.remove();
		}

		// Remove Blur
		document.querySelectorAll('.card-content .media, .card-content .entry-content').forEach(el => {
			if (el.style.filter === "blur(7px)") {
				el.style.filter = "none";
			}

			el.style.filter = "none";
			el.style.pointerEvents = "auto";
		});

		document.querySelectorAll('.container.is-max-desktop').forEach(el => {
			el.style.filter = 'none';
			el.style.pointerEvents = 'auto';
		});
	}

	window.addEventListener('load', removeAntiAdblocker);

	const observer = new MutationObserver(removeAntiAdblocker);
	observer.observe(document.body, {
		childList: true,
		subtree: true
	});
})();