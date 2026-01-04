// ==UserScript==
// @name        BrickLink - Navigate Between Orders
// @name:en     BrickLink - Navigate Between Orders
// @namespace   Violentmonkey Scripts
// @match       https://www.bricklink.com/orderPlaced.asp*
// @match       https://www.bricklink.com/orderDetail.asp*
// @grant       GM.setValue
// @grant       GM.getValue
// @version     0.2
// @author      The0x539
// @description Adds buttons to quickly switch between orders on the Order Detail page.
// @license     AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/539551/BrickLink%20-%20Navigate%20Between%20Orders.user.js
// @updateURL https://update.greasyfork.org/scripts/539551/BrickLink%20-%20Navigate%20Between%20Orders.meta.js
// ==/UserScript==

function stashOrderIds() {
	const elements = document.querySelectorAll('table.orders-table > * > tr:not(:first-child) > td:first-child > a');
	const ids = [...elements].map(id => id.textContent);
	ids.sort();
	GM.setValue('order-ids', ids);

	// TODO: Improve this to use data from past page loads rather than replacing everything with whatever was seen most recently
}

async function addLinks() {
	const header = document.querySelector('center > div');

	const mainHeader = header.firstElementChild;
	mainHeader.classList.replace('left', 'center');

	const ids = await GM.getValue('order-ids', []);

	if (ids.length < 2) return;

	const currentId = new URLSearchParams(location.search).get('ID');
	const i = ids.findIndex(v => v === currentId);
	if (i < 0) return;

	if (i - 1 > 0) {
		const link = document.createElement('a');
		link.href = `orderDetail.asp?ID=${ids[i-1]}`;
		link.innerHTML = '<< Previous';
		link.style.float = 'left';
		header.insertBefore(link, mainHeader);
	}
	if (i + 1 < ids.length) {
		const link = document.createElement('a');
		link.href = `orderDetail.asp?ID=${ids[i+1]}`;
		link.innerHTML = 'Next >>';
		link.style.float = 'right';
		header.insertBefore(link, mainHeader);
	}
}

if (location.pathname.includes('orderPlaced.asp')) {
	stashOrderIds();
} else {
	addLinks();
}
