// ==UserScript==
// @name        BrickLink Price Averages
// @name:en     BrickLink Price Averages
// @namespace   Violentmonkey Scripts
// @match       https://store.bricklink.com/*
// @grant       none
// @version     1.0
// @author      The0x539
// @description Adds the currently-for-sale price average to BL store listings
// @run-at      document-body
// @license     AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/511380/BrickLink%20Price%20Averages.user.js
// @updateURL https://update.greasyfork.org/scripts/511380/BrickLink%20Price%20Averages.meta.js
// ==/UserScript==

const RealXMLHttpRequest = window.XMLHttpRequest;
class PatchedXMLHttpRequest extends RealXMLHttpRequest {
	constructor(...args) {
		super(...args);
		this.isSearch = false;
		this.jobDone = false;
	}

	open(...args) {
		if (args[1].startsWith('/ajax/clone/store/searchitems.ajax')) {
			this.isSearch = true;
		}
		return super.open(...args);
	}

	get responseText() {
		if (this.isSearch && !this.jobDone) {
			const response = JSON.parse(super.responseText);
			processSearchResponse(response);
			this.jobDone = true;
		}

		return super.responseText;
	}
}
window.XMLHttpRequest = PatchedXMLHttpRequest;

const promises = new Map();

function processSearchResponse(response) {
	for (const item of response.result.groups.flatMap(g => g.items)) {
		const { itemID, colorID, itemName, colorName } = item;
		const key = (colorName + '\xA0' + itemName).trimStart();
		if (!promises.has(key)) {
			promises.set(key, getPrices(itemID, colorID));
		}
	}
}

async function getPrices(itemID, colorID) {
	const response = await fetch(`/v2/catalog/catalogitem_pgtab.page?idItem=${itemID}&idColor=${colorID}`);
	const html = await response.text();
	const doc = new DOMParser().parseFromString(html, 'text/html');

	const rows = doc.querySelectorAll('table.pcipgSummaryTable tr');
	const averages = [...rows]
		.filter(row => row.firstElementChild.innerText === 'Avg Price:')
		.map(row => row.lastElementChild.innerText);

	const [new6Months, used6Months, newForSale, usedForSale] = averages;
	return { new6Months, used6Months, newForSale, usedForSale };
}

function onUpdatePage(records, observer) {
	const selector = '.store-items article.table-row:not(:has(.buy div.average))';

	const rows = records
		.flatMap(r => [...r.addedNodes])
		.filter(n => n instanceof HTMLElement)
		.flatMap(n => [...n.querySelectorAll(selector)]);

	for (const row of rows) {
		addAverage(row);
	}
}

async function addAverage(listing) {
	const key = listing.querySelector('.description p').innerText;
	const prices = await promises.get(key);

	const condition = listing.querySelector('.condition strong').innerText;
	const price = (condition === 'Used') ? prices.usedForSale : prices.newForSale;

	const newHtml = `
		<div class="average">
			<span>Average: </span>
			<strong>${price}</strong>
		</div>
	`;
	listing.querySelector('.buy').children[1].insertAdjacentHTML('afterend', newHtml);
}

const observeOptions = { childList: true, subtree: true };
new MutationObserver(onUpdatePage).observe(document.body, observeOptions);