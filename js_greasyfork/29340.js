// ==UserScript==
// @name            Xhamster - AUTO Video Infinite LOOP v.10 Fix by smartacephale

// @version         v.10.00
// @description	    Video Auto Infinite Replay - Fix by smartacephale (https://greasyfork.org/fr/scripts/493935-xhamster-improved)
// @icon            https://external-content.duckduckgo.com/ip3/fr.xhamster.com.ico
//
// @namespace       https://greasyfork.org/fr/users/7434-janvier56
// @homepage        https://greasyfork.org/fr/users/7434-janvier56

// @match           https://*.xhamster.com/videos/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/29340/Xhamster%20-%20AUTO%20Video%20Infinite%20LOOP%20v10%20Fix%20by%20smartacephale.user.js
// @updateURL https://update.greasyfork.org/scripts/29340/Xhamster%20-%20AUTO%20Video%20Infinite%20LOOP%20v10%20Fix%20by%20smartacephale.meta.js
// ==/UserScript==

function waitForElementExists(parent, selector, callback) {
	const observer = new MutationObserver((_mutations) => {
		const el = parent.querySelector(selector);
		if (el) {
			observer.disconnect();
			callback(el);
		}
	});
	observer.observe(document.body, { childList: true, subtree: true });
}

waitForElementExists(document, "video", forceInfinitePlay);

function forceInfinitePlay() {
	let video = document.querySelector("video");
	// if (!video) {
	// 	video = document
	// 		.querySelector("iframe")
	// 		.contentDocument.querySelector("video");
	// }
	console.log("Video element:", video);

	// const overlayMenu = document.querySelector(
	// 	"html:not(.tablet) .xplayer.overlay-menu-opened .xp-aftershot",
	// );
	// console.log("Overlay menu:", overlayMenu);
	// if (overlayMenu) {
	// 	overlayMenu.remove();
	// }

	// Add an event listener to loop the video
	video.addEventListener("ended", () => {
		console.log("Video ended, looping...");
		video.currentTime = 0;
		video.play();
	});
}