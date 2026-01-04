// ==UserScript==
// @name        US Certificate Digital Auto Authentication
// @name:es     Autenticacion con Certificado Digital Universidad de Sevilla
// @namespace   Violentmonkey Scripts
// @match       https://sso.us.es/*
// @grant       none
// @version     1.5
// @author      Alf
// @description Automatically clicks on the "Certificado digital" authentication button on Universidad de Sevilla login page
// @description:es Automaticamente clica en "Certificado digital" en la pagina de login de la Universidad de Sevilla
// @run-at      document-end
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/532523/US%20Certificate%20Digital%20Auto%20Authentication.user.js
// @updateURL https://update.greasyfork.org/scripts/532523/US%20Certificate%20Digital%20Auto%20Authentication.meta.js
// ==/UserScript==

/* MIT License
 *
 * Copyright (c) 2025 Alf
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

(function () {
	"use strict";

	// Track the current page URL to detect navigation
	let currentUrl = window.location.href;
	// Remember if we've acted on this specific page already
	let actedOnThisPage = false;

	// Function to check and handle the confirmation dialog
	function checkForConfirmationDialog() {
		// Skip if we've already acted on this page
		if (actedOnThisPage) {
			return false;
		}

		// Look for the confirmation dialog button with "Aceptar" text
		const confirmButton = document.querySelector(
			".ui-dialog-buttonset button span#submit_confirm"
		);

		if (
			confirmButton &&
			(confirmButton.textContent === "Aceptar" ||
				confirmButton.textContent.includes("Aceptar"))
		) {
			console.log('Confirmation dialog found, clicking "Aceptar"...');

			// Click the confirmation button
			confirmButton.closest("button").click();
			actedOnThisPage = true;

			// Clear any existing intervals
			if (window.checkIntervalId) {
				clearInterval(window.checkIntervalId);
				window.checkIntervalId = null;
			}

			return true;
		}

		return false;
	}

	// Main function to handle authentication
	function handleAuthentication() {
		// Reset our "acted" flag when URL changes (navigation or reload)
		if (currentUrl !== window.location.href) {
			currentUrl = window.location.href;
			actedOnThisPage = false;
			console.log("New page detected, ready to authenticate if needed");
		}

		// Skip if we've already acted on this page
		if (actedOnThisPage) {
			return;
		}

		// First check if we're already on the confirmation dialog
		if (checkForConfirmationDialog()) {
			return;
		}

		// If not, look for the certificate button
		const certButton = document.getElementById("x509_module");

		if (certButton) {
			console.log("Certificate digital button found, clicking...");
			certButton.click();
			actedOnThisPage = true;

			// Set up observer to detect when confirmation dialog appears
			const observer = new MutationObserver(function (mutations) {
				// Reset flag for confirmation dialog since it's a new element
				actedOnThisPage = false;

				for (const mutation of mutations) {
					if (mutation.addedNodes.length) {
						if (checkForConfirmationDialog()) {
							observer.disconnect();
							break;
						}
					}
				}
			});

			// Start observing the document for changes
			observer.observe(document.body, { childList: true, subtree: true });

			// Also set a fallback timer to check for the dialog (just once)
			setTimeout(function () {
				// Reset flag for confirmation dialog that might appear late
				actedOnThisPage = false;
				checkForConfirmationDialog();
			}, 1000);
		}
	}

	// Wait for page to fully load
	window.addEventListener("load", function () {
		// Short delay to ensure all elements are rendered
		setTimeout(handleAuthentication, 1000);
	});

	// Watch for URL changes (via History API)
	const originalPushState = history.pushState;
	history.pushState = function () {
		originalPushState.apply(this, arguments);
		actedOnThisPage = false;
		currentUrl = window.location.href;
	};

	const originalReplaceState = history.replaceState;
	history.replaceState = function () {
		originalReplaceState.apply(this, arguments);
		actedOnThisPage = false;
		currentUrl = window.location.href;
	};

	// Watch for URL changes (via navigation)
	window.addEventListener("popstate", function () {
		actedOnThisPage = false;
		currentUrl = window.location.href;
	});

	// Check once initially for dialog
	setTimeout(checkForConfirmationDialog, 500);

	// Short interval check for confirmation dialog
	// This will only run for a few seconds and will be cleared once a dialog is found
	window.checkIntervalId = setInterval(function () {
		if (!actedOnThisPage) {
			checkForConfirmationDialog();
		} else {
			clearInterval(window.checkIntervalId);
			window.checkIntervalId = null;
		}
	}, 1000);

	// Auto-clear interval after 5 seconds to prevent continuous checking
	setTimeout(function () {
		if (window.checkIntervalId) {
			clearInterval(window.checkIntervalId);
			window.checkIntervalId = null;
		}
	}, 5000);
})();
