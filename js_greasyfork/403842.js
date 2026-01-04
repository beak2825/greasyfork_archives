// ==UserScript==
// @name         HoloTools Comment Widener
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Puts comments next to videos instead of inside of their boxes
// @author       TellowKrinkle
// @match        https://hololive.jetri.co/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403842/HoloTools%20Comment%20Widener.user.js
// @updateURL https://update.greasyfork.org/scripts/403842/HoloTools%20Comment%20Widener.meta.js
// ==/UserScript==

(function() {
	'use strict';

	const videoPadding = 3; // px
	const containerPadding = 5; // px
	const commentWidth = 300; // px

	/** Check if HoloTools is in auto layout mode */
	function isAutoLayout() {
		let layoutMode = document.getElementsByClassName("layout-mode")[0];
		if (!layoutMode) { return true; } // If holotools updates and this breaks, say yes
		return layoutMode.innerHTML !== "unfold_more";
	}

	/**
	 * Helper for mass update of HTML nodes
	 * For each (string, function) pair, calls function on all elements with the class string
	 * @param {Object.<string, function(HTMLElement):void>} updates
	 */
	function updateByClass(updates) {
		for (const className of Object.keys(updates)) {
			for (const element of document.getElementsByClassName(className)) {
				updates[className](element);
			}
		}
	}

	/** Resize all videos to the given width */
	function resizeVideos(videoWidth, containerHeight, hasComments) {
		const height = videoWidth * 9 / 16;
		const containerWidth = hasComments ? videoWidth + 300 : videoWidth;
		updateByClass({
			"player-yt-box": (container) => {
				container.style.width = `${containerWidth}px`;
				container.style.height = `${containerHeight}px`;
			},
			"player-yt-frame": (video) => {
				video.style.top = "0px";
				video.children[0].style.top = "0px";
				video.children[0].style.width = `${videoWidth}px`;
				video.children[0].style.height = `${height}px`;
			},
			"player-yt-info": (info) => { info.style.display = "none"; }
		});
	}

	/** Calculates the size of the video and its player */
	function calculateVideoSize(videoCount, videosWide, containerWidth, containerHeight, hasComments) {
		const videosHigh = Math.ceil(videoCount / videosWide);
		const widthPadding = videosWide * videoPadding;
		const heightPadding = videosHigh * videoPadding;
		const videoWidth = Math.floor((containerWidth - widthPadding) / videosWide) - (hasComments ? commentWidth : 0);
		const videoHeight = Math.floor((containerHeight - heightPadding) / videosHigh);
		return {width: Math.min(videoWidth, Math.floor(videoHeight * 16 / 9)), commentHeight: videoHeight};
	}

	/** Calculates the optimal number of videos wide to get the best usage of space */
	function calculateOptimalVideosWide(videoCount, containerWidth, containerHeight, hasComments) {
		let best = calculateVideoSize(videoCount, 1, containerWidth, containerHeight, hasComments).width;
		for (let videosWide = 2; videosWide < 10; videosWide++) {
			let newHeight = calculateVideoSize(videoCount, videosWide, containerWidth, containerHeight, hasComments).width;
			if (newHeight > best) {
				best = newHeight;
			} else {
				return videosWide - 1;
			}
		}
		throw `calculateOptimalVideosWide broke or there were so many videos that the optimal layout was 10 or more wide`;
	}

	let lastVideoWidth = 0; // To track whether we need to rerun relayoutVideos

	/** Recalculates the proper video size and applies it */
	function relayoutVideos() {
		const container = document.getElementsByClassName("player-container")[0];
		const videoCount = container.children.length;
		const containerWidth = container.clientWidth - containerPadding * 2;
		const containerHeight = container.clientHeight - containerPadding * 2;
		const hasComments = document.getElementsByClassName("withChat").length !== 0;
		const currentVideosWide = /repeat\((\d+)/.exec(container.style["grid-template-columns"])[1] | 0;
		let videosWide = currentVideosWide;
		if (isAutoLayout()) {
			videosWide = calculateOptimalVideosWide(videoCount, containerWidth, containerHeight, hasComments);
		}
		if (videosWide !== currentVideosWide) {
			container.style["grid-template-columns"] = `repeat(${videosWide}, 1fr)`;
		}
		const videoSize = calculateVideoSize(videoCount, videosWide, containerWidth, containerHeight, hasComments);
		console.log(`Will resize videos to ${videoSize.width}px wide`);
		lastVideoWidth = videoSize.width;
		resizeVideos(videoSize.width, videoSize.commentHeight, hasComments);
	}

	// In case someone wants to manually call it
	window.relayoutVideos = relayoutVideos;

	const videoResizeObserver = new MutationObserver(function(records) {
		for (const record of records) {
			if (record.attributeName !== "style" && record.attributeName !== "class") { continue; }
			if (record.target.style.width !== lastVideoWidth + "px") {
				relayoutVideos();
				return;
			}
		}
	});

	/** @param {HTMLElement} element */
	function watchPlayerResize(element) {
		videoResizeObserver.observe(element.children[0], {attributes: true});
		for (const child of element.children[0].children) {
			for (const grandchild of child.children) {
				if (grandchild.nodeName === "IFRAME") {
					videoResizeObserver.observe(grandchild, {attributes: true});
				}
			}
		}
	}

	/** @param {HTMLElement} element */
	function watchVideoAddRemove(element) {
		const videoAddRemoveObserver = new MutationObserver(function(records) {
			for (const record of records) {
				for (const node of record.addedNodes) {
					watchPlayerResize(node);
				}
			}
		});

		for (const child of element.children) { watchPlayerResize(child); }
		videoAddRemoveObserver.observe(element, {childList: true});
	}

	/** Initializes the userscript */
	function setup() {
		// Stores the currently-being-watched object so we don't double-watch it
		let currentWatch = document.getElementsByClassName("player-container")[0];
		if (currentWatch) { watchVideoAddRemove(currentWatch); }
		const observer = new MutationObserver(function() {
			let playerContainer = document.getElementsByClassName("player-container");
			if (currentWatch !== playerContainer[0]) {
				currentWatch = playerContainer[0];
				if (playerContainer[0]) {
					watchVideoAddRemove(playerContainer[0]);
				}
			}
		});

		const mainApp = document.getElementsByClassName("md-content")[0];
		observer.observe(mainApp, {childList: true});
	}

	// Run on page load
	if (document.readyState !== "loading") {
		setup();
	} else {
		document.addEventListener("DOMContentLoaded", setup);
	}
})();