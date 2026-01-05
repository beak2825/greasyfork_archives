// ==UserScript==
// @name        microjungle JsonML to DocumentFragment
// @description Based on https://github.com/deepsweet/microjungle by Kir Belevich
// @namespace   https://greasyfork.org/en/users/447-spooky-donkey
// @ecmaVersion 6
// @version     3
// @grant       none
// ==/UserScript==

/*exported MicrojungleJsonMLtoDocumentFragment*/
const MicrojungleJsonMLtoDocumentFragment = function () {
	"use strict";
	return function frag(template, target = document.createDocumentFragment()) {
		if (!Array.isArray(template)) {
			return target;
		}
		const stringOrFinite = a => typeof a === "string" ||
			(typeof a === "number" && isFinite(a));
		function createElement(item, s = item[1]) {
			const elem = document.createElement(item.shift());
			if (!!s && s.constructor === Object) {
				const attrList = item.shift();
				Object.entries(attrList).forEach(([attrName, attrValue]) => {
					if (stringOrFinite(attrValue)) {
						elem.setAttribute(attrName, attrValue);
					}
				});
			}
			target.appendChild(frag(item, elem));
		}
		template.forEach(item => {
			if (stringOrFinite(item)) {
				target.appendChild(document.createTextNode(item));
			} else if (item) {
				if (typeof item[0] === "string") {
					createElement(item);
				} else if (item.nodeType) {
					target.appendChild(item);
				} else {
					frag(item, target);
				}
			}
		});
		return target;
	};
};
