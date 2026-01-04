// ==UserScript==
// @name         Company ErbUpdate ToShare
// @namespace    https://www.torn.com/profiles.php?XID=2013988
// @version      1.0
// @description  Show Helpful information on company pages.
// @author       bandirao -- Edited by Erb
// @match        https://www.torn.com/joblist.php*
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/476778/Company%20ErbUpdate%20ToShare.user.js
// @updateURL https://update.greasyfork.org/scripts/476778/Company%20ErbUpdate%20ToShare.meta.js
// ==/UserScript==

const API = "";

const elFind = (sel) => document.querySelector(sel);
const elFindAll = (sel) => document.querySelectorAll(sel);

if (window.location.href.includes("#")) {
	func();
	window.addEventListener("hashchange", func);
	async function func() {
		if (window.location.href.includes("p=corp")) {
			let page = 1;
			if (window.location.hash.includes("start=")) page = Math.floor((+window.location.hash.split("start=")[1] + 25) / 25);
			await waitFor(`.page-number.active[page*='${page}']`);

			elFindAll(".company-list a[href*='#!p=corpinfo&ID=']").forEach(link => {
				const companyId = link.getAttribute("href").split("ID=")[1];
				if (inCache(companyId)) {
					const { employeesHired, employeesCapacity, daysold } = getCache(companyId);
					link.parentElement.insertAdjacentHTML("afterend", `<li style="margin-left: -275px; position: absolute;">${employeesHired} / ${employeesCapacity}  ${daysold}</li>`);
				} else {
					fetch(`https://api.torn.com/company/${companyId}?selections=&key=${API}`)
					.then((compDataRes) => {
						if (compDataRes.status !== 200) {
							console.error(`Torn API Fetch Status Error 3: ${compDataRes.status}`);
							return;
						}

						compDataRes.json().then(async (compData) => {
							// Code
							if (compData.error) {
								console.error("Error: " + compData.error);
								link.parentElement.insertAdjacentHTML("afterend", `<li style="margin-left: -275px; position: absolute;">${compData.error}</li>`);
								return;
							}

							link.parentElement.insertAdjacentHTML("afterend", `<li style="margin-left: -275px; position: absolute;">${compData.company.employees_hired} / ${compData.company.employees_capacity}  ${compData.company.days_old}</li>`);
							updateCache(companyId, compData.company.employees_hired, compData.company.employees_capacity, compData.company.days_old);
						}).catch((err) => console.error("4 " + err));
					})
					.catch((err) => console.error(`Torn API Fetch Error 5: ${err}`));
				}
			});
		}
	}
}

async function waitFor(sel) {
	return new Promise((resolve) => {
		setInterval(() => {
			const el = elFind(sel);
			if (el) resolve(el);
		}, 500);
	});
}

async function waitUntil(func) {
	return new Promise((resolve) => {
		setInterval(() => {
			const output = func();
			if (output) resolve(output);
		}, 500);
	});
}

function inCache(companyId) {
	const cache = GM_getValue("companyListingCache", null);
	if (cache === null || !(companyId in cache)) return false;
	else
		if (Date.now() - cache[companyId].timestamp > 100000) {
			delete cache[companyId];
			setCache(cache);
			return false;
		}
		return true;
}

function getCache(companyId) {
	const cache = GM_getValue("companyListingCache", null);
	if (cache === null) throw Error("Cache is null.");
	else {
		return { employeesHired: cache[companyId].employeesHired, employeesCapacity: cache[companyId].employeesCapacity, daysold: cache[companyId].daysold };
	}
}

function updateCache(companyId, employeesHired, employeesCapacity, daysold) {
	let cache = GM_getValue("companyListingCache", null);
	if (cache == null) cache = {};
	cache[companyId] = { employeesHired: employeesHired, employeesCapacity: employeesCapacity, daysold: daysold, timestamp: Date.now() };
	setCache(cache);
}

function setCache(cache) {
	GM_setValue("companyListingCache", cache);
};