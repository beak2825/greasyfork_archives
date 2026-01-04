// ==UserScript==
// @name        BrickLink Tracking Column
// @name:en     BrickLink Tracking Column
// @namespace   Violentmonkey Scripts
// @match       https://www.bricklink.com/orderPlaced.asp*
// @grant       none
// @version     1.0
// @author      The0x539
// @description Adds a column with tracking links to BrickLink's "Orders Placed" page.
// @license     AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/511367/BrickLink%20Tracking%20Column.user.js
// @updateURL https://update.greasyfork.org/scripts/511367/BrickLink%20Tracking%20Column.meta.js
// ==/UserScript==

// Customize me!
const trackingUrl = code => `//tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=${code}`;

function main() {
	const rows = document.querySelectorAll('table.orders-table > tbody > tr:not(:first-child)');
	for (const row of rows) {
		process(row);
	}
}

async function process(row) {
	if (getStatus(row) !== 'Shipped') {
		return;
	}

	const id = row.firstElementChild.firstElementChild.innerHTML;
	const doc = await fetchOrderDetail(id);
	const code = getTrackingNo(doc);
	if (!code) {
		return;
	}
	addTrackingColumn();
	row.lastElementChild.innerHTML = `<a href="${trackingUrl(code)}">${code}</a>`;
}

function getStatus(row) {
	const statusEl = row.children[8].firstElementChild;
	if (statusEl instanceof HTMLSelectElement) {
		for (const option of statusEl.children) {
			if (option.selected) {
				return option.innerHTML;
			}
		}
		return null;
	} else {
		return statusEl.innerText;
	}
}

async function fetchOrderDetail(id) {
	const response = await fetch(`/orderDetail.asp?ID=${id}`);
	const html = await response.text();
	const doc = new DOMParser().parseFromString(html, 'text/html');
	return doc;
}

function getTrackingNo(doc) {
	const fields = doc.querySelectorAll('table._bltLeftTable table:not(.ta) td table tr');

	for (const field of fields) {
		const key = field.children[0].innerText.trim();
		if (key === 'Tracking\xA0No:') {
			return field.children[1].innerText.trim();
		}
	}
	return null;
}

function addTrackingColumn() {
	const rows = document.querySelectorAll('table.orders-table > tbody > tr');
	if (rows[0].children.length === 14) {
		return; // job's already done
	}
	for (let i = 0; i < rows.length; i++) {
		const cell = rows[i].insertCell();
		if (i === 0) {
			cell.innerHTML = 'Tracking';
		}
	}
}

main();