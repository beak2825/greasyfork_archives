// ==UserScript==
// @name         共
// @version      1.1
// @description  刷课
// @author       chen
// @match        http://202.200.126.234/jjfz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=126.234
// @grant        none
// @namespace https://greasyfork.org/users/830612
// @downloadURL https://update.greasyfork.org/scripts/446444/%E5%85%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/446444/%E5%85%B1.meta.js
// ==/UserScript==

(function () {
	'use strict';
	player.on('ended', function () {
		console.log("播完了");
		let link = document.querySelector("body > div.wrap_video > div.video_fixed.video_cut > div:nth-child(5) > ul").querySelector("li.video_red1 + li a").href
		window.location = link
	})
	setInterval(() => {
		player.play()
	}, 1E3);
})();