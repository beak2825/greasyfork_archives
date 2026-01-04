// ==UserScript==
// @name         Bangumi Staff Folding
// @namespace    https://greasyfork.org/users/193469
// @description  Fold the excessive long staff list
// @version      1.2
// @author       Rui LIU (@liurui39660)
// @match        https://bgm.tv/subject/*
// @match        https://bangumi.tv/subject/*
// @icon         https://icons.duckduckgo.com/ip2/bgm.tv.ico
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/432812/Bangumi%20Staff%20Folding.user.js
// @updateURL https://update.greasyfork.org/scripts/432812/Bangumi%20Staff%20Folding.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// If there are 12 names, the 11th and 12th will be hidden
	// Another typical value is 1, where only the most essential info is shown
	const threshold = 10;

	for (const li of document.querySelectorAll('#infobox > li')) {
		if (li.childNodes.length > threshold * 2 + 1) { // Entry name and commas
			const folded = document.createElement('span');
			for (let i = threshold * 2 + 1; i < li.childNodes.length;)
				folded.append(li.removeChild(li.childNodes[i]));
			folded.hidden = true;
			li.append(folded);

			const button = document.createElement('a');
			button.text = `\t[+${Math.ceil(folded.childNodes.length / 2)}]`;
			button.alt_text = '\t[<<<]';
			button.href = 'javascript:;';
			button.onclick = () => {
				folded.hidden = !folded.hidden;
				[button.text, button.alt_text] = [button.alt_text, button.text];
			};
			li.append(button);
		}
	}
})();
