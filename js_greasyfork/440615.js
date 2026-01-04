// ==UserScript==
// @name		 Discord Image Link Fixer
// @namespace	https://greasyfork.org
// @version	  1.1
// @description  Re-injects clickable links over image embeds, as well as correcting Twitter image links to the highest quality source.
// @author	   ScocksBox
// @icon		 https://i.imgur.com/ZOKp8LH.png
// @include	  https://discord.com/*
// @license	  MIT
// @run-at	   document-end
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/440615/Discord%20Image%20Link%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/440615/Discord%20Image%20Link%20Fixer.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

const selectorStr = ".message-2CShn3 a, .downloadLink-1OAglv";

function fixLink(link) {
	let href = link.href;
	if (href.match(/^https?:\/\/pbs\.twimg\.com\/media\//) && (!href.match(/name=orig/) || href.match(/\?format=/))) {
		let newHref = href.replace('?format=', '.').replace(/&name=(\w+)/g, '').replace(/:[a-zA-Z0-9]+/g, '') + "?name=orig";
		link.href = newHref;
	}
}

var callback = function (mutationsList, observer) {
	for (const mutation of mutationsList) {
		for (const added of mutation.addedNodes) {
			if (added.nodeType !== Node.ELEMENT_NODE) {
				continue;
			}

			if (added.matches(selectorStr)) {
				fixLink(added);
			}

			const linkSet = added.querySelectorAll(selectorStr);
			for (let i = 0; i < linkSet.length; i++) {
				fixLink(linkSet[i]);
			}
		}
	}
};

const observer = new MutationObserver(callback);
observer.observe(document.body, { attributes: true, childList: true, subtree: true });
