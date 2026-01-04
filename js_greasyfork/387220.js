// ==UserScript==
// @name         Do not redirect to China Version Website
// @namespace    ATGT
// @version      0.6
// @description  try to take over the world!
// @author       You
// @match        *://*.leetcode-cn.com/*
// @match        *://*.leetcode.com/*
// @grant        none
// @run-at		 document-start
// @downloadURL https://update.greasyfork.org/scripts/387220/Do%20not%20redirect%20to%20China%20Version%20Website.user.js
// @updateURL https://update.greasyfork.org/scripts/387220/Do%20not%20redirect%20to%20China%20Version%20Website.meta.js
// ==/UserScript==

(function() {
	console.log(`=== do not direct to china version web size ${location.host} ===`);
	'use strict';
	if (/leetcode-cn.com$/.test(location.host) || /utm_\w+/.test(location.search)) {
		console.log('redirect to leetcode.com');
		let enUrl = new URL(location.href);
		enUrl.host = enUrl.host.replace(/leetcode-cn.com$/, 'leetcode.com');
		enUrl.search = enUrl.search.replace(/utm_[^&]+&?/, '');
		enUrl.search = enUrl.search.replace(/\?$/, '');
		location.href = enUrl.href;
	}
	if (/leetcode.com$/.test(location.host)) {
		window.addEventListener('load',() => {
			setTimeout(() => {
				// close banner on main page
				let btn = document.querySelector('#region_switcher .close-btn');
				if (btn)
					btn.click();

			}, 500);
			setTimeout(() => {
				// close banner on problems page
				let btn = document.querySelector('#CNbanner .cn_close_btn');
				if (btn)
					btn.click();
			}, 1500);
		});
	}
	console.log(`=== /do not direct to china version web size ${location.host} ===`);
})();
