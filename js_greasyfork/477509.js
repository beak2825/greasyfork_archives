// ==UserScript==
// @name         Netflix Tweaks
// @namespace    joeytwiddle
// @version      0.0.4
// @description  Hide the advert on the home page, adjust brightness/contrast
// @author       joeytwiddle
// @license      ISC
// @match        https://www.netflix.com/*
// @icon         https://www.google.com/s2/favicons?domain=netflix.com
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/477509/Netflix%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/477509/Netflix%20Tweaks.meta.js
// ==/UserScript==

(function() {
    'use strict';

	const hideTopRecommendation = true;

	// Note: When increasing the brightness, we need to reduce the other two for balance.
	// Otherwise the saturation appears increased, and the top whites get washed out.
	const videoFilter = 'brightness(1.3) contrast(0.9) saturate(0.85)';

	if (typeof hideTopRecommendation !== 'undefined' && hideTopRecommendation) {
		GM_addStyle(`
			.volatile-billboard-animations-container {
				display: none;
			}
			/* Add some whitespace to compensate */
			#main-view {
				padding-top: 4em;
			}
		`);
	}

	if (typeof videoFilter === 'string' && videoFilter !== '') {
		GM_addStyle(`
			video {
				filter: ${videoFilter};
			}
		`);
	}

})();
