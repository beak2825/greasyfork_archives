// ==UserScript==
// @name Облегчённые купоны METRO Cash & Carry
// @namespace github.com/a2kolbasov
// @version 1.3.0
// @description Убирает ненужные элементы и уменьшает отступы. Полезно для печати.
// @author Aleksandr Kolbasov
// @license CC-BY-4.0
// @grant GM_addStyle
// @run-at document-start
// @match *://*.offer.metro-cc.ru/*
// @downloadURL https://update.greasyfork.org/scripts/500476/%D0%9E%D0%B1%D0%BB%D0%B5%D0%B3%D1%87%D1%91%D0%BD%D0%BD%D1%8B%D0%B5%20%D0%BA%D1%83%D0%BF%D0%BE%D0%BD%D1%8B%20METRO%20Cash%20%20Carry.user.js
// @updateURL https://update.greasyfork.org/scripts/500476/%D0%9E%D0%B1%D0%BB%D0%B5%D0%B3%D1%87%D1%91%D0%BD%D0%BD%D1%8B%D0%B5%20%D0%BA%D1%83%D0%BF%D0%BE%D0%BD%D1%8B%20METRO%20Cash%20%20Carry.meta.js
// ==/UserScript==

(function() {
let css = `
	@media print {
		.coupon-watch-link,
		.coupon-img {
			display: none;
		}
		/*
		.coupons-column {
			padding: 0;
		}
		.coupons-column::after {
			content: "";
			display: inline-block;
		}
		*/
		.coupons-column * {
			height: auto;
			margin: auto;
			padding: 0;
		}
		.coupon {
			padding-top: 1ex;
			border-color: unset;
		}
		.coupons-list {
			margin: auto !important;
		}
		.coupon-info-sale {
			color: unset;
			background: unset;
			top: auto;
		}
		.coupon-info-note {
			font-weight: unset;
		}
		header,
		footer,
		.how,
		.steps,
		.hgroup-column-x1,
		.hgroup-column-x2,
		.conditions-all {
			display: none;
		}
	}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
