// ==UserScript==
// @name         Redacted seeding/leeching counts
// @namespace    z50hn1in5jpbd070i
// @version      1.2.1
// @description  Shows seeding/leeching counts in the info bar
// @license      MIT
// @match        https://redacted.sh/*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/430358/Redacted%20seedingleeching%20counts.user.js
// @updateURL https://update.greasyfork.org/scripts/430358/Redacted%20seedingleeching%20counts.meta.js
// ==/UserScript==

(async function() {
	"use strict";

	const insertMode = "append"; // append or prepend to info bar
	const cacheTime = 120000; // 2 minutes

	let updateTimer;

	let userID;

	if (typeof unsafeWindow !== "undefined" && "userid" in unsafeWindow) {
		userID = String(unsafeWindow.userid);
	} else {
		// Extract it from the DOM
		const link = document.querySelector("#nav_userinfo a[href*='id=']");
		userID = new URLSearchParams(link.search).get("id");
	}
	if (!userID) {
		return;
	}

	const endpoint = "/ajax.php?" + new URLSearchParams({
		action: "community_stats",
		userid: userID
	});

	// Container elements to update later
	const seeding = document.createElement("li");
	const leeching = document.createElement("li");
	const textSeeding = document.createElement("span");
	const textSeedingPercent = document.createElement("span");
	const textLeeching = document.createElement("span");


	function initElements() {
		seeding.innerHTML = `<a href="torrents.php?type=seeding&amp;userid=${userID}">Seeding</a>: `;

		const seedingStat = document.createElement("span");
		seedingStat.className = "stat";
		seedingStat.append(textSeeding, " (", textSeedingPercent, "%)");
		seeding.append(seedingStat);

		leeching.innerHTML = `<a href="torrents.php?type=leeching&amp;userid=${userID}">Leeching</a>: `;
		textLeeching.className = "stat";
		leeching.append(textLeeching);

		seeding.style.display = "none";
		leeching.style.display = "none";

		seeding.className = "tooltip";
		leeching.className = "tooltip";

		const frag = document.createDocumentFragment();
		frag.append(seeding, leeching);

		const infobar = document.getElementById("userinfo_stats");
		infobar.insertBefore(frag, (insertMode === "append") ? null : infobar.firstChild);
	}

	function updateDisplay(data) {
		textSeeding.textContent = data.seeding;
		textSeedingPercent.textContent = data.seedingperc;
		textLeeching.textContent = data.leeching;

		seeding.title = `Seeding Torrents: ${data.seeding} (${data.seedingperc}%)`;
		seeding.style.display = "";

		// Hide leeching if nothing is being downloaded
		if (parseInt(data.leeching, 10) === 0) {
			leeching.style.display = "none";
		} else {
			leeching.title = `Leeching Torrents: ${data.leeching}`;
			leeching.style.display = "";
		}

	}

	let broadcast;

	if (typeof BroadcastChannel === "function") {
		// When we fetch data, notify other tabs so they can update immediately
		const broadcastHandler = ({ data }) => {
			if (data === "fetched") {
				// A different tab fetched data, update info
				fetchStatsFromCache();
			}
		};

		const initBroadcast = () => {
			broadcast = new BroadcastChannel("pUx2Isvbq3za4rYdHWjJZBURZXle6wWf");
			broadcast.onmessage = broadcastHandler;
		};

		initBroadcast();

		// Disable the channel when the page is unloaded
		// so we don't fuck up the bfcache
		window.addEventListener("pagehide", () => {
			broadcast.close();
		});

		// Restore when page is re-loaded
		window.addEventListener("pageshow", (event) => {
			if (event.persisted) {
				initBroadcast();
			}
		});
	}

	async function updateStats(firstLoad = false) {
		const lastUpdate = await GM.getValue("lastUpdate");

		// Only update if cache is expired
		if (!lastUpdate || Date.now() > (parseInt(lastUpdate, 10) + cacheTime)) {
			fetchStatsFromNetwork();
		} else if (firstLoad || !broadcast) {
			fetchStatsFromCache();
		}

		queueUpdate();
	}

	function queueUpdate() {
		// Kill pending update
		if (updateTimer) {
			clearTimeout(updateTimer);
		}

		// Add a random delay between 0.1-10 seconds
		const delay = cacheTime + Math.floor(Math.random() * (10000 - 100 + 1) + 100);
		updateTimer = setTimeout(updateStats, delay);
	}

	function fetchStatsFromNetwork() {
		fetch(endpoint, {
			method: "GET",
			mode: "same-origin",
			credentials: "same-origin",
		})
		.then(response => response.json())
		.then(async json => {
			if (json.status === "success") {
				updateDisplay(json.response);

				await GM.setValue("seeding", json.response.seeding);
				await GM.setValue("leeching", json.response.leeching);
				await GM.setValue("seedingperc", json.response.seedingperc);
				GM.setValue("lastUpdate", String(Date.now()));

				// Notify other tabs
				broadcast?.postMessage("fetched");
			}
		});
	}

	async function fetchStatsFromCache() {
		updateDisplay({
			seeding: await GM.getValue("seeding"),
			leeching: await GM.getValue("leeching"),
			seedingperc: await GM.getValue("seedingperc")
		});
	}


	initElements();
	// Kick off the first request
	updateStats(true);
})();
