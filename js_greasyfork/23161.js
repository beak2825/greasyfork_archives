// ==UserScript==
// @name         Fix Middle Click on Suit Supply
// @namespace    https://greasyfork.org/users/649
// @version      1.0.1
// @description  Makes middle click open the links on a new tab
// @author       Adrien Pyke
// @match        *://us.suitsupply.com/*
// @require      https://greasyfork.org/scripts/5679-wait-for-elements/code/Wait%20For%20Elements.js?version=122976
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/23161/Fix%20Middle%20Click%20on%20Suit%20Supply.user.js
// @updateURL https://update.greasyfork.org/scripts/23161/Fix%20Middle%20Click%20on%20Suit%20Supply.meta.js
// ==/UserScript==

(function() {
	'use strict';

	waitForElems('a.sel-product-container', function(link) {
		link.onclick = function(e) {
			e.preventDefault();
			e.stopImmediatePropagation();
			if (e.button === 1) {
				GM_openInTab(link.href, true);
			} else {
				window.location.href = link.href;
			}
			return false;
		};
		link.onauxclick = link.onclick;
	});
})();