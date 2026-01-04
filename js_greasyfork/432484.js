// ==UserScript==
// @name         Non-Printable Character Detection
// @namespace    https://greasyfork.org/users/193469
// @description  Replace non-printable characters, e.g., zero-width spaces, with a visible symbol.
// @version      1.2
// @author       Rui LIU (@liurui39660)
// @match        *://*/*
// @icon         https://icons.duckduckgo.com/ip2/example.com.ico
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/432484/Non-Printable%20Character%20Detection.user.js
// @updateURL https://update.greasyfork.org/scripts/432484/Non-Printable%20Character%20Detection.meta.js
// ==/UserScript==

(function () {
	'use strict';

	const regex = /\p{Cf}/gu; // https://stackoverflow.com/a/12054775/8056404
	const to = '\u2756'; // ❖

	const replace = root => new Promise(() => {
		const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
		let node;
		while (node = walker.nextNode())
			node.nodeValue = node.nodeValue.replaceAll(regex, to);
	})

	new MutationObserver(mutations => mutations.forEach(mutation => mutation.addedNodes.forEach(node => replace(node)))).observe(document.body, {subtree: true, childList: true});

	replace(document.body);
})();
