// ==UserScript==
// @name         Google Cloud SDK Autoconnect
// @description  Auto connect to your gcloud account when using 'gcloud auth login' command
// @version      1.2.0
// @author       Alexandre Picavet (https://github.com/AlexandrePicavet)
// @namespace    https://github.com/AlexandrePicavet/Google-Cloud-SDK-Autoconnect
// @supportURL   https://github.com/AlexandrePicavet/Google-Cloud-SDK-Autoconnect/issues
// @license      GPL-3.0
// @match        https://accounts.google.com/o/oauth2/auth*
// @match        https://accounts.google.com/signin/oauth/id*
// @match        https://accounts.google.com/signin/oauth/consent*
// @match        https://sdk.cloud.google.com/authcode.html*
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/504669/Google%20Cloud%20SDK%20Autoconnect.user.js
// @updateURL https://update.greasyfork.org/scripts/504669/Google%20Cloud%20SDK%20Autoconnect.meta.js
// ==/UserScript==

// @ts-check
(function() {
	"use strict";

	const application = "Google Cloud SDK";

	/**
	 * @param {string} query
	 * @param {(element: HTMLElement) => boolean} [predicate=() => true]
	 *
	 * @returns {Promise<HTMLElement>}
	 */
	function getElement(query, predicate = () => true) {
		return new Promise((resolve) =>
			observe(() => {
				/** @type HTMLElement | null */
				const element = document.querySelector(query);
				const elementMatches = element !== null && predicate(element);

				if (elementMatches) {
					resolve(element);
				}

				return elementMatches;
			}),
		);
	}

	/**
	 * @param {string} query
	 * @param {(elements: HTMLElement[]) => boolean} [predicate=() => true]
	 *
	 * @returns {Promise<HTMLElement[]>}
	 */
	function getElements(query, predicate = () => true) {
		return new Promise((resolve) =>
			observe(() => {
				const elements = /** @type {HTMLElement[]} */ ([
					...document.querySelectorAll(query),
				]);
				const elementsMatches = elements.length > 0 && predicate(elements);

				if (elementsMatches) {
					resolve(elements);
				}

				return elementsMatches;
			}),
		);
	}

	/**
	 * @param {() => boolean} onMutation that returns a boolean as to wether to disconnect from the observer or not.
	 */
	function observe(onMutation) {
		const isAlreadyFound = onMutation();

		if(isAlreadyFound) {
			return;
		}

		const observer = new MutationObserver(() => {
			const disconnect = onMutation();
			if (disconnect) {
				observer.disconnect();
			}
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});
	}

	console.log("Automatic google auth connection script started.");

	document.URL.startsWith("https://accounts.google.com/o/oauth2/auth") &&
		getElements("[data-third-party-email]", (elements) =>
			elements.some((element) => element.textContent?.trim() === application),
		)
			.then(() => getElement("[data-identifier]"))
			.then((element) => setInterval(() => element.click(), 100));

	document.URL.startsWith("https://accounts.google.com/signin/oauth/id") &&
		getElement(
			"#headingText",
			(element) => element.textContent?.trim().includes(application) ?? false,
		)
			.then(() => getElements("button"))
			.then((elements) => elements[1].click());

	document.URL.startsWith("https://accounts.google.com/signin/oauth/consent") &&
		getElement(
			"#developer_info_glif",
			(element) => element.textContent?.trim() === application,
		)
			.then(() => getElement("#submit_approve_access"))
			.then((element) => element.click());

	document.URL.startsWith("https://sdk.cloud.google.com/authcode.html") &&
		getElement(
			"code.auth-code",
			(element) => (element.textContent?.trim().length ?? 0) > 0,
		)
			.then((element) => element.textContent?.trim())
			.then((code) => GM_setClipboard(code, "text"))
			.then(() =>
				GM_notification({
					tag: "google-sdk-autoconnect",
					title: "Google SDK Autoconnect",
					text: "Google SDK auth-code copied to clipboard.",
				}),
			)
			.then(window.close);
})();