// ==UserScript==
// @name        Tiki Highlight Deals Based on Discount
// @namespace   metapone
// @version     1.0
// @description Highligh deals above a certain discount value
// @author      metapone
// @license     GPL-2.0-only; https://opensource.org/licenses/GPL-2.0
// @homepage    https://github.com/metapone/userscript-collection
// @supportURL  https://github.com/metapone/userscript-collection/issues
// @noframes
// @match       *://tiki.vn/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/424431/Tiki%20Highlight%20Deals%20Based%20on%20Discount.user.js
// @updateURL https://update.greasyfork.org/scripts/424431/Tiki%20Highlight%20Deals%20Based%20on%20Discount.meta.js
// ==/UserScript==

const threshold = 50; // Minimum sale to highlight
const color = "yellow"; // Highlight CSS color

function highlightSale(node) {
	if (node.nodeType !== Node.ELEMENT_NODE) return;

	if (node.getAttribute("data-brick-level") == "item") highlightItem(node);
	else node.querySelectorAll(".product-item").forEach(item => highlightItem(item));
}

function highlightItem(node) {
	const colorNode = getColorNode(node);
	if (colorNode === null) return;

	const discountNode = node.querySelector(".price-discount__discount");
	if (!discountNode) return;

	const discount = parseInt(discountNode.innerText, 10);
	if (discount <= -threshold) colorNode.style.backgroundColor = color;
}

function getColorNode(node) {
	if (node.classList.contains("product-item")) return node; // Normal pages
	if (node.getAttribute("data-brick-level") == "item") return node.firstChild; // tiki.vn/khuyen-mai/san-uu-dai-sach-hang-thang
	return null;
}

function callback(mutationsList) {
	for (let mutation of mutationsList) {
		for (let addedNode of mutation.addedNodes) {
			highlightSale(addedNode);
		}
	}
}

window.addEventListener('load', function () {
	const targetNode = document.body;
	const observer = new MutationObserver(callback);
	observer.observe(targetNode, { subtree: true, childList: true });
	highlightSale(targetNode);
}, false);
