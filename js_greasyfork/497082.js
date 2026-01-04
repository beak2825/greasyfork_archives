// ==UserScript==
// @name         bilibili live auto like
// @namespace    xygodcyx
// @version      2024-06-05
// @description  可以在b站直播间里自动点赞(特定的)
// @author       You
// @match        https://live.bilibili.com/1758151881?*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497082/bilibili%20live%20auto%20like.user.js
// @updateURL https://update.greasyfork.org/scripts/497082/bilibili%20live%20auto%20like.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// Your code here...
	const ev = new MouseEvent('click');
	console.log('auto like start...');
	let like_btn = document.querySelector('.like-btn');
	setInterval(() => {
		if (!like_btn) {
			like_btn = document.querySelector('.like-btn');
		}
		like_btn.dispatchEvent(ev);
	}, 100);
})();
