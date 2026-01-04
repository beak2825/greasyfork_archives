// ==UserScript==
// @name         Narrow One LB
// @namespace    http://tampermonkey.net/
// @version      2024-02-21
// @description  Narrow One LeaderBoard
// @author       N1 Lb Team
// @match        https://narrow.one/*
// @icon         data:image/png;base64,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
// @grant        none
// @license      Mozilla Public License 2.0
// @downloadURL https://update.greasyfork.org/scripts/487958/Narrow%20One%20LB.user.js
// @updateURL https://update.greasyfork.org/scripts/487958/Narrow%20One%20LB.meta.js
// ==/UserScript==

//let debug = true;
let debug = false;

function debugLog(...args) {
	if (debug) console.log("[N1 LB]", ...args);
}

async function getData() {
	// Open the IndexedDB database
	await new Promise((r) => setTimeout(r, 2000));
	var request = indexedDB.open("keyValuesDb");

	request.onerror = function (event) {
		console.error("Failed to open the database:", event.target.errorCode);
	};

	request.onsuccess = function (event) {
		var db = event.target.result;

		var transaction = db.transaction(["keyValues"], "readwrite");

		var objectStore = transaction.objectStore("keyValues");

		// Get the value by key ("cachedProfileState")
		var request = objectStore.get("cachedProfileState");

		request.onsuccess = function (event) {
			// Access the data
			var cachedProfileState = event.target.result;

			// Do something with cachedProfileState
			debugLog("Cached Profile State:",cachedProfileState)
			// debugLog("Json Format for api test :) :", JSON.stringify(cachedProfileState))

			// The URL where you want to send the POST request
			const apiUrl = "https://n1-api.vercel.app/api/post";

			debugLog(`Sending POST request to: ${apiUrl}`);

			// send the POST request
			fetch(apiUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(cachedProfileState),
			})
				.then((response) => {
					if (!response.ok) {
						throw new Error("Network response was not ok");
					}
					// console.log({ success: true });
					debugLog("POST request was successful");
				})
				.catch((error) => {
					// console.error("Error:", error.message);
					debugLog("POST request failed");
					console.log(
						debug ? { success: false, error: error.message } : ""
					);
				});
		};

		request.onerror = function (event) {
			console.error("Error retrieving data:", event.target.errorCode);
		};
	};
}


getData();
