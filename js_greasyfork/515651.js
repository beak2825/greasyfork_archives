// ==UserScript==
// @name         GOTOES Fit File Editor - Auto Close Popup
// @namespace    typpi.online
// @version      2024.11.06
// @description  Automatically clicks the close button on popup donation nag
// @author       Nick2bad4u
// @match        https://gotoes.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gotoes.org
// @grant        none
// @homepageURL  https://github.com/Nick2bad4u/UserStyles
// @supportURL   https://github.com/Nick2bad4u/UserStyles/issues
// @license      UnLicense
// @downloadURL https://update.greasyfork.org/scripts/515651/GOTOES%20Fit%20File%20Editor%20-%20Auto%20Close%20Popup.user.js
// @updateURL https://update.greasyfork.org/scripts/515651/GOTOES%20Fit%20File%20Editor%20-%20Auto%20Close%20Popup.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// Function to click the close button
	function closePopup() {
		const popupContent = document.querySelector(
			'a[href="https://gotoes.org/stravatoolsforum/viewtopic.php?f=2&t=115"] h3',
		);
		console.log('closePopup: popupContent', popupContent);
		if (
			popupContent &&
			popupContent.innerHTML.includes('Option 2:<br>Help Others (FREE)')
		) {
			const closeButton = document.getElementById('cboxClose');
			console.log('closePopup: closeButton', closeButton);
			if (closeButton) {
				closeButton.click();
				console.log('closePopup: closeButton clicked');
			}
		}
	}

	// Observe changes in the DOM to detect when the popup appears
	const observer = new MutationObserver(() => {
		const popupContent = document.querySelector(
			'a[href="https://gotoes.org/stravatoolsforum/viewtopic.php?f=2&t=115"] h3',
		);
		console.log('MutationObserver: popupContent', popupContent);
		if (popupContent) {
			closePopup();
		}
	});
	observer.observe(document.body, {
		childList: true,
		subtree: true,
	});

	// Initial check in case the popup is already present
	const popupContent = document.querySelector(
		'a[href="https://gotoes.org/stravatoolsforum/viewtopic.php?f=2&t=115"] h3',
	);
	console.log('Initial check: popupContent', popupContent);
	if (popupContent) {
		closePopup();
	}
})();
