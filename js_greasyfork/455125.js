// ==UserScript==
// @name         Truffle.TV Auto Claimer
// @namespace    https://github.com/whqwert/userscripts
// @version      1.2.0
// @description  Auto-claim Truffle.TV channel points
// @author       whqwert
// @match        https://new.ludwig.social/channel-points
// @match        https://*.truffle.site/channel-points
// @icon         https://cdn.bio/assets/images/branding/logomark.svg
// @supportURL   https://github.com/whqwert/userscripts/issues
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455125/TruffleTV%20Auto%20Claimer.user.js
// @updateURL https://update.greasyfork.org/scripts/455125/TruffleTV%20Auto%20Claimer.meta.js
// ==/UserScript==

(function () {
	'use strict';

	new MutationObserver((_, o) => {
		if (document.getElementById('root')) {
			o.disconnect();
			autoClaim();
		}
	}).observe(document.body, { childList: true, subtree: true });

	function autoClaim() {
		const shadow = document.getElementById('root').firstChild.shadowRoot;

		new MutationObserver(() => {
			const claim = shadow.querySelector('.claim');

			if (claim) claim.click();
		}).observe(shadow, { childList: true, subtree: true });
	}
})();
