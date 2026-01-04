// ==UserScript==
// @name         Show War Local Time
// @namespace    https://www.torn.com/profiles.php?XID=1936821
// @version      1.6
// @description  Shows the war end time in local time.
// @author       TheFoxMan
// @owner        Phillip_J_Fry [2184575]
// @license      Apache License 2.0
// @match        https://www.torn.com/factions.php*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/482256/Show%20War%20Local%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/482256/Show%20War%20Local%20Time.meta.js
// ==/UserScript==

// Made for Phillip_J_Fry [2184575].
// DO NOT EDIT.

if (!Document.prototype.find)
	Object.defineProperties(Document.prototype, {
		find: {
			value(selector) {
				return document.querySelector(selector);
			},
			enumerable: false
		},
		findAll: {
			value(selector) {
				return document.querySelectorAll(selector);
			},
			enumerable: false
		}
	});

if (!Element.prototype.find)
	Object.defineProperties(Element.prototype, {
		find: {
			value(selector) {
				return this.querySelector(selector);
			},
			enumerable: false
		},
		findAll: {
			value(selector) {
				return this.querySelectorAll(selector);
			},
			enumerable: false
		}
	});

async function waitFor(sel, parent = document) {
	return new Promise((resolve) => {
		const intervalID = setInterval(() => {
			const el = parent.find(sel);
			if (el) {
				resolve(el);
				clearInterval(intervalID);
			}
		}, 500);
	});
}

(async () => {
	showWarTimes();

	window.addEventListener("hashchange", showWarTimes);
})();

async function showWarTimes() {
	if (window.location.hash.includes("tab=")) return;

	const warList = await waitFor("#faction_war_list_id");

	if (window.location.hash.includes("tab=")) return;

	document.findAll(".war-end-time").forEach((x) => x.remove());

	warList.findAll("[class*='warListItem__']").forEach((war) => {
		if (war.find(".timer")) {
			// Territory War
			const timer = war.find(".timer");
			const timeLeft = parseTime(timer.textContent);
			let date = Date.now();
			// date -= timeLeft;
			date += timeLeft;
			// date += 3 * 24 * 60 * 60 * 1000;
			date = (new Date(date)).toLocaleString()
			timer.insertAdjacentHTML("afterend", "<div class='war-end-time'>" + date + "</div>");
			return;
		}

		// RW
		if (!war.find("[data-warid]")) return;

		const bottomDiv = war.find("[class*='bottomBox__']");
		const timer = bottomDiv.find("[class*='timer__']");
		if (bottomDiv.textContent.includes("WINNER")) return;

		if (!parseTime(bottomDiv.textContent)) return;

		// console.log(Date.now() - parseTime(timer.textContent));
		const date = (new Date(Date.now() - parseTime(timer.textContent) + 123 * 60 * 60 * 1000)).toLocaleString();
		bottomDiv.insertAdjacentHTML(
			"beforeend",
			"<div class='war-end-time'>" + date + "</div>"
		);
	});
}

function parseTime(str) {
	const splits = str.split(":").map((x) => parseInt(x));
	// console.log(splits);
	let time = 0;
	time += splits[0] * 1000 * 60 * 60 * 24;
	time += splits[1] * 1000 * 60 * 60;
	time += splits[2] * 1000 * 60;
	time += splits[3] * 1000;
	return time;
}