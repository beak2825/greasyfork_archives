// ==UserScript==
// @name         Prisjakt Search for Products Missing Direct Link
// @version      1
// @namespace    https://greasyfork.org/users/1495521
// @description  Add direct link to a google search for items that are missing direct links
// @license      MIT
// @match        https://www.prisjakt.nu/produkt.php?p=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=prisjakt.nu
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542744/Prisjakt%20Search%20for%20Products%20Missing%20Direct%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/542744/Prisjakt%20Search%20for%20Products%20Missing%20Direct%20Link.meta.js
// ==/UserScript==

(function() {
	'use strict';

	function updateItem(li) {
		const row = li.querySelector('a[data-test="UnfeaturedRow"]');

		if (!row) {
			console.warn('Item missing link element', li);
			return;
		}

		const storeElem = row.querySelector('span');
		const productElem = row.querySelector('.bodysmalltext');
		const store = storeElem?.textContent.trim();
		const product = productElem?.textContent.trim();

		if (!store || !product) {
			console.warn('Failed to find store or product names for item', li);
			return;
		}

		const query = encodeURIComponent(`${store} ${product}`);
		const url = `https://www.google.com/search?q=${query}`;

		row.removeAttribute('disabled');
		row.href = url;
		row.style.cursor = 'pointer';

		// Click event is hijacked to show coercion message. Add a new listener to re-enable left click
		row.addEventListener('click', e => {
			if (e.button === 0) {
				e.preventDefault();
				window.open(url, '_blank');
			}
		});
	}

	const list = document.querySelector('[data-testid="primary-price-list"]');

	if (!list) {
		console.warn('Price list not found');
		return;
	}

	list.querySelectorAll('li').forEach(updateItem);

	const observer = new MutationObserver(mutations => {
		mutations
			.flatMap(mutation => Array.from(mutation.addedNodes))
			.filter(node => node.nodeType === Node.ELEMENT_NODE && node.tagName === 'LI')
			.forEach(updateItem);
	});

	observer.observe(list, { childList: true });
})();