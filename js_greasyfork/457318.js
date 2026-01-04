// ==UserScript==
// @name        STM client side inventory fetch test
// @namespace   Violentmonkey Scripts
// @match       https://www.steamtradematcher.com/*
// @version     1.0
// @description Adds client side fetching on STM
// @grant       GM.xmlHttpRequest
// @connect     steamcommunity.com
// @inject-into content
// @run-at      document-start
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/457318/STM%20client%20side%20inventory%20fetch%20test.user.js
// @updateURL https://update.greasyfork.org/scripts/457318/STM%20client%20side%20inventory%20fetch%20test.meta.js
// ==/UserScript==

(async function () {
	"use strict";


	function getLoggedInSteamID() {
		return new Promise((resolve, reject) => {
			GM.xmlHttpRequest({
				method: "GET",
				url: "https://steamcommunity.com/my?xml=1",
				anonymous: false,
				responseType: "text",
				headers: {
					Accept: "text/xml"
				},

				onerror: reject,

				onload(res) {
					if (res.status !== 200) {
						reject(res);
					} else if (res.finalUrl.startsWith("https://steamcommunity.com/login/")) {
						resolve(null); // not logged in
					} else {
						try {
							const doc = new DOMParser().parseFromString(res.responseText, "text/xml");
							resolve(doc.getElementsByTagName("steamID64")[0].textContent);
						} catch {
							reject(res);
						}
					}
				}
			});
		});
	}


	function fetchInventory(profileID, startAssetID = null) {
		const endpoint = `https://steamcommunity.com/inventory/${profileID}/753/6?`;
		const params = new URLSearchParams([["l", "english"], ["count", "5000"]]);

		if (startAssetID) {
			params.set("start_assetid", startAssetID);
		}

		return new Promise((resolve, reject) => {
			GM.xmlHttpRequest({
				method: "GET",
				url: endpoint + params,
				anonymous: false, // use creds if we're logged in
				responseType: "json",
				headers: {
					Accept: "application/json"
				},

				onerror: reject,

				onload(res) {
					if (res.status !== 200 || !res.response.success) {
						reject(res);
					} else {
						resolve(res);
					}
				}
			});
		});
	}


	function sleep(ms) {
		return new Promise((resolve) => {
			setTimeout(resolve, ms);
		});
	}


	// Listen for messages like { type: "stm-userscript-fetch-inventory", id: "123456" }
	// Fetch inventory data for Steam ID and reply
	window.addEventListener("message", async (event) => {
		// Vibe check
		if (event.origin !== location.origin) {
			return;
		}

		// Message check
		const { data } = event;
		if (data.type !== "stm-userscript-fetch-inventory" || !data.id) {
			return;
		}

		// Steam ID check (only numbers)
		const id = String(data.id).replaceAll(/[^0-9]/gu, "");
		if (!id) {
			return;
		}

		// Default failure reply
		const reply = { type: "stm-userscript-inventory-fetched", id: id, success: false, loggedInAsID: null };

		// Delay milliseconds between requests, no idea if this value actually works tbh
		let delay = 10_000;

		// Check if we're logged in
		try {
			if (await getLoggedInSteamID() === id) {
				reply.loggedInAsID = true;
				delay = 0; // no (obvious) rate limits for our own inventory
			} else {
				reply.loggedInAsID = false;
			}
		} catch (e) {
			// just ignore this request if it fails
			console.log("getLoggedInSteamID() failed", e);
		}


		let combinedAssets, combinedDescriptions;
		let startAsset = null;
		let sanityCounter = 0;

		do {
			let invPart;

			try {
				invPart = await fetchInventory(id, startAsset);
			} catch (e) {
				// DONE - we failed
				console.log("fetchInventory() failed", e);
				break;
			}

			const json = invPart.response;

			if (!combinedAssets) {
				combinedAssets = json.assets || [];
				combinedDescriptions = json.descriptions || [];
			} else {
				combinedAssets.push(...json.assets);
				combinedDescriptions.push(...json.descriptions);
			}

			if (json.more_items) {
				// keep going
				startAsset = json.last_assetid;

				if (delay) {
					await sleep(delay);
				}
			} else {
				// DONE - we succeeded
				reply.success = true;
				reply.inventory = { assets: combinedAssets, descriptions: combinedDescriptions };
				break;
			}
		} while (++sanityCounter < 1000); // hard cap at 5 million items, nobody has that many I think

		// Send our reply, successful or not
		window.postMessage(reply, location.origin);
	});
})();
