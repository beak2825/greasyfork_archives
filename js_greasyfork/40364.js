// ==UserScript==
// @name        Steam: Auto-submit Family View PIN
// @namespace   jycaplsilxrklkcsoamspgyiwilbprtd
// @description Remembers and automatically submits your Family View PIN
// @license     MIT License
// @match       https://steamcommunity.com/*
// @match       https://store.steampowered.com/*
// @version     1.3
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.deleteValue
// @run-at      document-start
// @inject-into content
// @downloadURL https://update.greasyfork.org/scripts/40364/Steam%3A%20Auto-submit%20Family%20View%20PIN.user.js
// @updateURL https://update.greasyfork.org/scripts/40364/Steam%3A%20Auto-submit%20Family%20View%20PIN.meta.js
// ==/UserScript==

/* jshint bitwise: true, curly: true, eqeqeq: true, esversion: 11, forin: true,
freeze: true, futurehostile: true, latedef: true, leanswitch: true, noarg: true,
nocomma: true, nonbsp: true, nonew: true, noreturnawait: true, regexpu: true,
shadow: outer, singleGroups: true, strict: true, trailingcomma: true, undef: true,
unused: true, varstmt: true, browser: true */
/* globals AbortController, BroadcastChannel, GM */

(async function () {
	"use strict";


	// Double-check the origin just so we're extra
	// sure we're not sending the PIN to other sites.
	// Greasemonkey can be tricked into running
	// scripts on different sites, like this:
	// http://example.org/?://steamcommunity.com/
	const origin = location.origin;

	if (origin !== "https://steamcommunity.com" && origin !== "https://store.steampowered.com") {
		return;
	}

	// Random unique string for cross-tab communication
	// so we don't clash with site code (BroadcastChannel and Lock)
	const crossTabKey = "jycaplsilxrklkcsoamspgyiwilbprtd";


	let isFamilyViewPage, doReloadLater;
	let aborter = new AbortController();
	let broadcast;
	let onBroadcastMessage, initBroadcast, pauseBroadcast, onPageResume, killBroadcast;


	onBroadcastMessage = ({ data }) => {
		if (data === crossTabKey) {
		    // Another tab has unlocked family view
			aborter.abort();
			killBroadcast();

			if (isFamilyViewPage) {
				location.reload();
			} else {
				// We don't know if this is a family view page yet,
				// check and reload later.
				doReloadLater = true;
			}
		}
	};

	initBroadcast = () => {
		broadcast = new BroadcastChannel(crossTabKey);
		broadcast.addEventListener("message", onBroadcastMessage);
	};

	pauseBroadcast = () => {
		broadcast.close();
		broadcast = null;
	};

	onPageResume = ({ persisted }) => {
		if (persisted) {
			// also resume the channel
			initBroadcast();
		}
	};

	// Disable broadcast channel for the rest of the page load
	killBroadcast = () => {
		window.removeEventListener("pageshow", onPageResume);
		pauseBroadcast();
	};


	initBroadcast();

	// Tear down and resume BroadcastChannel so we can
	// remain eligible for the bfcache.
	// This doesn't work at all but maybe in the future it will
	window.addEventListener("pagehide", pauseBroadcast);
	window.addEventListener("pageshow", onPageResume);


	let pinPref = "pin";



	async function unlock(pin) {
		// Get session ID from cookies
		const sid = document.cookie.match(/[; ]sessionid=([^\s;]*)/u)?.[1];

		if (!sid || !pin) {
			return false;
		}

		const request = fetch(origin + "/parental/ajaxunlock", {
			method: "POST",
			mode: "same-origin",
			redirect: "error",
			referrerPolicy: "strict-origin",
			credentials: "include",
			headers: { Accept: "application/json", },
			body: new URLSearchParams([["pin", pin,], ["sessionid", sid,],]),
			keepalive: true,
			signal: aborter.signal,
		});

		try {
			const json = await (await request).json();

			if (json.success) {
				broadcast.postMessage(crossTabKey);
				killBroadcast();
				location.reload();

				return true;
			} else if (json.eresult === 15) {
				// We got an explicit failure reply.
				// success is false and eresult is 15 (AccessDenied).
				// Assume the PIN has changed and delete it.
				GM.deleteValue(pinPref);
			}


		} catch (ignore) {}

		return false;
	}



	window.addEventListener("DOMContentLoaded", async () => {
		const form = document.getElementById("unlock_form");
		isFamilyViewPage = Boolean(form);

		if (!isFamilyViewPage) {
			// Nothing to do here
			killBroadcast();
			return;
		}

		// BroadcastChannel told us to reload
		if (doReloadLater) {
			location.reload();
			return;
		}

		// We're on a family view PIN entry page
		// and we need to unlock it

		// Find account ID in the page
		const accountID = document.querySelector("[data-miniprofile]")?.dataset.miniprofile;

		// Add account ID to our pref name
		// so we can support multiple accounts
		if (accountID) {
			pinPref += accountID;
		}

		// Get PIN from script values
		const pin = await GM.getValue(pinPref);


		if (!pin) {
			// We don't have a PIN so we can't auto-unlock yet.
			// Capture it for next time.
			const capturePIN = () => {
				GM.setValue(pinPref, String(form.elements.pin.value));
			};

			form.addEventListener("submit", capturePIN, { capture: true, passive: true, });
			form.elements.submit_btn?.addEventListener("click", capturePIN, { capture: true, passive: true, });
		} else {
			// Make sure only one tab is fetching
			navigator.locks.request(crossTabKey, { ifAvailable: true, }, (lock) => {
				if (lock) {
					// Wait for this async function to complete
					// before releasing the lock by returning its Promise
					return unlock(pin);
				}
			});
		}
	});
})();
