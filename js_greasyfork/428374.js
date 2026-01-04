// ==UserScript==
// @name        Youtube Comment History batch Delete
// @namespace
// @match       https://myactivity.google.com/*
// @grant       none
// @version     1.2
// @author      wayhee
// @description use it to delete your youtube comment history at https://myactivity.google.com/page?hl=en&page=youtube_comments
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/428374/Youtube%20Comment%20History%20batch%20Delete.user.js
// @updateURL https://update.greasyfork.org/scripts/428374/Youtube%20Comment%20History%20batch%20Delete.meta.js
// ==/UserScript==
(function () {
	'use strict';
	var clicker = function () {
		var e = document.querySelectorAll('.YxbmAc .yHy1rc')[Math.random() * 100 >= 50 ? 0 : 1];
		if (e) {
			console.log("Clicked", e);
			e.click();
		} else {
			console.log("No Button found");
		}
	};
	window.setInterval(clicker, 5000);
})();