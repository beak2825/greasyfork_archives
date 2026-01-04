// ==UserScript==
// @name         Company Inactivity Highlight
// @namespace    https://www.torn.com/profiles.php?XID=1936821
// @version      1.5
// @description  Highlight inactive members of company.
// @author       TheFoxMan [1936821]
// @match        https://www.torn.com/companies.php*
// @match        https://www.torn.com/joblist.php*
// @run-at       document-end
// @license      Apache License 2.0
// @downloadURL https://update.greasyfork.org/scripts/482250/Company%20Inactivity%20Highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/482250/Company%20Inactivity%20Highlight.meta.js
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

const APICOMMENT = "CompanyLastAction";

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
	if (!document.head.insertAdjacentHTML)
		alert("Case -1");
	
	document.head.insertAdjacentHTML(
		"beforeend",
		`<style>
			#employees .employee-list > li::after,
			.content-wrapper .employees-list > li::after {
				display: block;
				content: attr(data-last-action);
				color: #fff;
			}
		</style>`
	);

	showLastAction();
	window.addEventListener("hashchange", showLastAction);
})();

async function showLastAction() {
	await waitFor(".content-wrapper :is(.employee-list, .employees-list) > li");

	if (document.find(".content-wrapper :is(.employee-list, .employees-list) > li[data-last-action]")) {
		return;
	}

	const directorID = document.find(".details-wrap [href*='profiles.php']").getAttribute("href").split("?XID=")[1];
	const companyID = (await (await fetch(`https://api.torn.com/user/${directorID}?selections=&key=${APIKEY}&comment=${APICOMMENT}`)).json()).job.company_id;

	const data = await (await fetch(`https://api.torn.com/company/${companyID}?selections=&key=${APIKEY}&comment=${APICOMMENT}`)).json();

	document.findAll(".content-wrapper :is(.employee-list, .employees-list) > li").forEach((row) => {
		const profileID = row.find("[href*='profiles.php']").getAttribute("href").split("?XID=")[1];

		row.setAttribute("data-last-action", data.company.employees[profileID].last_action.relative);

		const numberOfDays = Math.floor((Date.now() / 1000 - data.company.employees[profileID].last_action.timestamp) / (24 * 60 * 60));

		let color;
		activityHighlights.forEach((rule) => {
			if (rule[0] <= numberOfDays && numberOfDays <= rule[1]) color = rule[2];
		});

		if (!color) return;

		row.style.backgroundColor = color;
	});
}