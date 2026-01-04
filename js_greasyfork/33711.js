// ==UserScript==
// @name         Redeem Steam Key
// @namespace    https://savagecore.eu
// @version      0.1.0
// @description  Redirect to Steam Register Key page when copying key
// @author       SavageCore
// @include      *
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/33711/Redeem%20Steam%20Key.user.js
// @updateURL https://update.greasyfork.org/scripts/33711/Redeem%20Steam%20Key.meta.js
// ==/UserScript==
//
/* global document window GM_openInTab */

(function () {
	'use strict';

	// Automatically accept Steam Subscriber Agreement
	if (window.location.href.match(/^https?:\/\/store.steampowered.com\/account\/registerkey/)) {
		const ssaElem = document.getElementById('accept_ssa');
		if (ssaElem) {
			ssaElem.checked = 'checked';
		}
	} else {
		const activateProduct = function (e) {
			const productKey = window.getSelection().toString().trim() || e.target.value;
			let m;
			if ((m = /^[\d\w]{2,5}(-[\d\w]{4,5}){2,4}$/.exec(productKey)) !== null) {
				// GM_openInTab so that the 'popup' is not blocked by browser
				GM_openInTab('https://store.steampowered.com/account/registerkey?key=' + m[0]); // eslint-disable-line new-cap
			}
		};

		window.addEventListener('copy', activateProduct, false);
	}
})();
