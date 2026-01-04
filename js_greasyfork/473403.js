// ==UserScript==
// @name         Auto ad skipper
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Auto-skips ads on youtube!
// @author       Wapplee (qrco)
// @match        *://*.youtube.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473403/Auto%20ad%20skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/473403/Auto%20ad%20skipper.meta.js
// ==/UserScript==

(function() {
	'use strict';

	setInterval(function(){
		["ytp-ad-skip-button-modern","ytp-ad-skip-button"].forEach((a)=>{
			Object.values(document.getElementsByClassName(a)).forEach((a)=>a.click())
		})
		let isad = document.getElementsByClassName("ytp-ad-text")[0];
		if (isad) {
			let video = document.getElementsByClassName("video-stream html5-main-video")[0];
			if (video) {
				video.play();
				video.pause();
				video.currentTime = video.duration;
			}
		}
		[
			"yt-simple-endpoint style-scope ytd-action-companion-ad-renderer",
			"ytd-in-feed-ad-layout-renderer"
		].forEach((delstr)=>{
			Array.from(document.getElementsByClassName(delstr)).forEach((element)=>element.remove());
		});
	}, 1);

})();