// ==UserScript==
// @name         Faction Inactivity Highlight
// @namespace    https://www.torn.com/profiles.php?XID=1936821
// @version      1.5
// @description  Highlight inactive members of faction.
// @author       TheFoxMan [1936821]
// @match        https://www.torn.com/factions.php*
// @run-at       document-end
// @license      Apache License 2.0
// @downloadURL https://update.greasyfork.org/scripts/482249/Faction%20Inactivity%20Highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/482249/Faction%20Inactivity%20Highlight.meta.js
// ==/UserScript==

const APIKEY = "###PDA-APIKEY###";

const activityHighlights = [
	[1, 1, "#FFFFFF80"],
	[2, 4, "#ff990080"],
	[5, 6, "#FF000080"],
	[7, 999, "#cc00ff80"]
];

// SCRIPT BEYOND.
// DO NOT EDIT.

const APICOMMENT = "FactionLastAction";

if (!document.find)
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

(() => {
	document.head.insertAdjacentHTML(
		"beforeend",
		`<style>
			.faction-info-wrap .members-list .table-body > li::after {
				display: block;
				content: attr(data-last-action);
				color: #fff;
			}
		</style>`
	);

	if (window.location.href.includes("step=your") && window.location.hash.includes("tab=info")) showLastAction();

	if (window.location.href.includes("step=profile")) showLastAction();

	window.addEventListener("hashchange", () => {
		if (window.location.href.includes("step=your") && window.location.hash.includes("tab=info")) showLastAction();
	});
})();

async function showLastAction() {
	await waitFor(".faction-info-wrap .members-list .table-body");

	if (document.find(".faction-info-wrap .members-list .table-body > li[data-last-action]")) return;

	const factionID = document.find("#view-wars").parentElement.getAttribute("href")?.match(/\d+/)?.[0];
	const data = await (await fetch(`https://api.torn.com/faction/${factionID || ""}?selections=basic&key=${APIKEY}&comment=${APICOMMENT}`)).json();

	document.findAll(".faction-info-wrap .members-list .table-body > li").forEach((row) => {
		const profileID = parseInt(row.find("a[href*='profiles.php']").getAttribute("href").split("XID=")[1]);

		row.setAttribute("data-last-action", data.members[profileID].last_action.relative);

		const numberOfDays = Math.floor((Date.now() / 1000 - data.members[profileID].last_action.timestamp) / (24 * 60 * 60));

		let color;
		activityHighlights.forEach((rule) => {
			if (rule[0] <= numberOfDays && numberOfDays <= rule[1]) color = rule[2];
		});

		if (!color) return;

		row.style.backgroundColor = color;
	});
}