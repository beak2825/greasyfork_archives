// see: <https://violentmonkey.github.io/api/metadata-block/>
// ==UserScript==
// @name				wikipedia dark 2024 - wikipedia.org
// @author			pdpt
// @version			0.0.1
// @icon				https://wikipedia.org/favicon.ico
// @match				http*://*wikipedia.org/*
//
// @run-at			document-end
// @grant 			GM_getResourceText
//
// @resource		gadget-dark-mode https://en.wikipedia.org/w/index.php?title=MediaWiki:Gadget-dark-mode.css&action=raw&ctype=text/css
//
// @description adds the MediaWiki:Gadget-dark-mode as a style to any wikipedia page.
// ** the style is not written or maintained by me **
// * you can view that style at: <https://en.wikipedia.org/w/index.php?title=MediaWiki:Gadget-dark-mode.css>
// * or the raw: <https://en.wikipedia.org/w/index.php?title=MediaWiki:Gadget-dark-mode.css&action=raw&ctype=text/css>
// * should automatically update as the imported css is updated.
//
// the authors of that style are listed as: (as of 2024-06-14)
//  * Wikimedia Design Team 2019-2021
//  * Original authors:
//  * - Volker E. – [[User:Volker_E._(WMF)]]
//  * - Alex Hollender
//  * - MusikAnimal
//  * - Carolyn Li-Madeo
//  * - Jdlrobson
//
// @namespace https://greasyfork.org/users/229349
// @downloadURL https://update.greasyfork.org/scripts/497963/wikipedia%20dark%202024%20-%20wikipediaorg.user.js
// @updateURL https://update.greasyfork.org/scripts/497963/wikipedia%20dark%202024%20-%20wikipediaorg.meta.js
// ==/UserScript==

(function () {
	/** Code Here * */

	const theme = GM_getResourceText('gadget-dark-mode');

	const addStyle = function addStyle(s) {
		const style = document.createElement('style');
		style.innerHTML = s;
		document.documentElement.appendChild(style);
	};

	addStyle(theme);

}());
