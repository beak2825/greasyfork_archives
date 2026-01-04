// ==UserScript==
// @name         Youtube Enchancements
// @namespace    http://tampermonkey.net/
// @version      0.43
// @description  Fixing the new youtube shitty interface!
// @icon         https://www.youtube.com/favicon.ico
// @author       mattiadr96@gmail.com
// @match        http*://www.youtube.com/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/397196/Youtube%20Enchancements.user.js
// @updateURL https://update.greasyfork.org/scripts/397196/Youtube%20Enchancements.meta.js
// ==/UserScript==

/* utility */
/*******************************************************************************************************************************************************************/
function intervalQuerySelector(selector, callback, timeout, maxTries) {
	maxTries = maxTries || 100;
	let int = setInterval(function() {
		let item = document.querySelector(selector);
		// if found callback and stop
		if (item) {
			callback(item);
			clearInterval(int);
		}
		// stop if too many fails
		maxTries--;
		if (maxTries <= 0) {
			clearInterval(int);
		}
	}, timeout || 200);
}

function createStyle(css) {
	let style = document.createElement('style');
	style.type = 'text/css';
	style.appendChild(document.createTextNode(css));
	return style;
}

function injectStyle(style) {
	if (style && style.parentElement != document.head) {
		document.head.appendChild(style);
	}
}

async function sha1(message) {
	const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
	const hashBuffer = await crypto.subtle.digest("SHA-1", msgUint8); // hash the message
	const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
	const hashHex = hashArray
		.map((b) => b.toString(16).padStart(2, "0"))
		.join(""); // convert bytes to hex string
	return hashHex;
}

async function buildHeaders() {
	const ts = new Date().getTime();
	const SAPISID = document.cookie.match(/SAPISID=(.+?);/)[1];
	const hash = await sha1(ts + " " + SAPISID + " " + origin);

	return {
		authorization: `SAPISIDHASH ${ts}_${hash}`,
		"x-origin": origin
	};
}

function addToPlaylist(videoId, playlistId) {
	return new Promise(async (resolve, reject) => {
		const headers = await buildHeaders();

		const data = {
			context: {
				client: {
					clientName: "WEB",
					clientVersion: "2.20230323.03.00"
				}
			},
			actions: [{
				action: "ACTION_ADD_VIDEO",
				addedVideoId: videoId
			}],
			playlistId: playlistId
		};

		console.log("[INFO] adding video");
		console.log(data);

		GM_xmlhttpRequest({
			method: "POST",
			url: "https://www.youtube.com/youtubei/v1/browse/edit_playlist",
			headers: headers,
			data: JSON.stringify(data),
			onload: (resp) => {
				if (resp.status == 200) {
					const js = JSON.parse(resp.responseText);
					if (js.status == "STATUS_SUCCEEDED") return resolve();
				}
				reject(resp);
			}
		});
	});
}

function removeFromPlaylist(videoId, playlistId) {
	return new Promise(async (resolve, reject) => {
		const headers = await buildHeaders();

		const data = {
			context: {
				client: {
					clientName: "WEB",
					clientVersion: "2.20230323.03.00"
				}
			},
			actions: [{
				action: "ACTION_REMOVE_VIDEO_BY_VIDEO_ID",
				removedVideoId: videoId
			}],
			playlistId: playlistId
		};

		console.log("[INFO] removing video");
		console.log(data);

		GM_xmlhttpRequest({
			method: "POST",
			url: "https://www.youtube.com/youtubei/v1/browse/edit_playlist",
			headers: headers,
			data: JSON.stringify(data),
			onload: (resp) => {
				if (resp.status == 200) {
					const js = JSON.parse(resp.responseText);
					if (js.status == "STATUS_SUCCEEDED") return resolve();
				}
				reject(resp);
			}
		});
	});
}

// (?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})
const VIDEO_ID_REGEX = /(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)([^"&?\/\s]{11})/;

function getVideoIdFromURL(url) {
	console.log(`[INFO] parsing url: ${url}`);

	const match = VIDEO_ID_REGEX.exec(url);
	if (match) {
		return match[1];
	} else {
		return null;
	}
}

/* styles */
/*******************************************************************************************************************************************************************/
const globalStyle = createStyle(`
	/* scrollbar */
	::-webkit-scrollbar {
		width: 10px;
	}

	::-webkit-scrollbar-thumb {
		background: hsla(0, 0%, 53.3%, 0.4);
	}

	/* disable blue highlight */
	:focus {
		outline: none;
	}

	/* sidebar hide shorts */
	#items > ytd-guide-entry-renderer:nth-child(2) {
		display: none;
	}

	/* sidebar hide your channel, your videos */
	/*
	#section-items > ytd-guide-entry-renderer:nth-child(1), #section-items > ytd-guide-entry-renderer:nth-child(4) {
		display: none;
	}
	*/

	/* sidebar hide blue dot near channel name */
	#newness-dot {
		display: none!important;
	}

	/* remove tooltip over channel name */
	paper-tooltip.ytd-channel-name {
		display: none!important;
	}

	/* change scrollbar */
	::-webkit-scrollbar {
		width: 9px!important
	}
	body::-webkit-scrollbar {
		width: 13px!important
	}
	::-webkit-scrollbar-corner {
		background: #ababab
	}
	::-webkit-scrollbar-track {
		background: #2d2d2d!important;
		border-radius: 0!important;
		-webkit-box-shadow: inset 0 0 4px rgba(0, 0, 0, .3)!important
	}
	body::-webkit-scrollbar-track {
		background: #2d2d2d!important
	}
	::-webkit-scrollbar-thumb {
		background-color: #565656!important;
		min-height: 50px;
		border-radius: 5px!important;
		border: 0px!important;
		-webkit-box-shadow: inset 0 0 4px rgba(0, 0, 0, .5)!important
	}

	/* fix black bar height on top of the home page */
	#frosted-glass {
		height: 56px!important;
	}

	/* invert subscriptions and you sections in the sidebar */
	#sections {
		display: flex;
  		flex-direction: column;
	}
	#sections > ytd-guide-section-renderer:nth-child(1) { order: 1; }
	#sections > ytd-guide-section-renderer:nth-child(2) { order: 3; }
	#sections > ytd-guide-section-renderer:nth-child(3) { order: 2; }
	#sections > ytd-guide-section-renderer:nth-child(4) { order: 4; }
	#sections > ytd-guide-section-renderer:nth-child(5) { order: 5; }
	#sections > ytd-guide-section-renderer:nth-child(6) { order: 6; }
`);

const homeStyle = createStyle(`
	/* home 6 thumbs per row + spacing */
	ytd-rich-grid-renderer {
		--ytd-rich-grid-items-per-row: 6!important;
    	--ytd-rich-grid-posts-per-row: 6!important;
    	--ytd-rich-grid-slim-items-per-row: 6!important;
    	--ytd-rich-grid-game-cards-per-row: 6!important;
		margin: 0 80px 0 80px;
	}

	#contents > .ytd-rich-grid-renderer {
		margin-bottom: 24px!important;
	}

	/* home title spacing */
	#meta.ytd-rich-grid-video-renderer {
		padding-right: 16px;
	}

	ytd-menu-renderer.ytd-rich-grid-video-renderer {
		--paper-icon-button_-_width: 16px;
	}

	/* home font sizes */
	#video-title.ytd-rich-grid-video-renderer {
		font-size: 1.4rem!important;
	}

	ytd-video-meta-block[rich-meta] #channel-name.ytd-video-meta-block, ytd-video-meta-block[rich-meta] #metadata-line.ytd-video-meta-block {
		font-size: 1.3rem!important;
	}

	/* hide posts and similar */
	ytd-rich-section-renderer {
		display: none!important;
	}

	/* hide top filter bar */
	ytd-rich-grid-renderer > #header {
		display: none!important;
	}

	/* hide recommendation bar */
	#chips {
		display: none;
	}

	/* hide "also watch this channel" */
	ytd-thumbnail-overlay-endorsement-renderer {
		display: none;
	}

	/* video title font */
	#video-title.ytd-rich-grid-media {
		font-size: var(--yt-link-font-size, 1.4rem)!important;
	}
`);

const subscriptionsStyle = createStyle(`
	/* subscriptions margin height */
	#contents.ytd-shelf-renderer {
		margin-top: 12px;
	}
	ytd-item-section-renderer:has(div#contents > ytd-reel-shelf-renderer > div#title-container span#title) {
		display: none;
	}
`);

const videoStyle = createStyle(`
	/* hide autoplay button */
	.ytp-button[data-tooltip-target-id='ytp-autonav-toggle-button'] {
		display: none;
	}

	/* hide related videos filters */
	yt-related-chip-cloud-renderer.ytd-watch-next-secondary-results-renderer {
		display: none;
	}

	/* hide end cards */
	.ytp-ce-element {
		display: none;
	}

	/* hide useless video buttons */
	ytd-download-button-renderer.ytd-menu-renderer,
	#flexible-item-buttons > ytd-button-renderer.ytd-menu-renderer:not(:last-child):not(.quickWL) {
		display: none;
	}
`);

/* jump table */
/*******************************************************************************************************************************************************************/
let pages = [];

/* global */
/*******************************************************************************************************************************************************************/
pages.push({
	re: [/youtube\.com.+/],
	func: function() {
		injectStyle(globalStyle);

		// set wide cookie
		document.cookie = "wide=1;domain=.youtube.com;max-age=315360000";

		// expand channel list
		intervalQuerySelector("#sections > ytd-guide-section-renderer:nth-child(2) > #items > ytd-guide-collapsible-entry-renderer a", function(item) {
			item.click();
		});
	}
});

/* home */
/*******************************************************************************************************************************************************************/
pages.push({
	re: [/youtube\.com\/?$/],
	func: function() {
		injectStyle(homeStyle);
	}
});

/* subscriptions */
/*******************************************************************************************************************************************************************/
pages.push({
	re: [/youtube\.com\/feed\/subscriptions/],
	func: function() {
		injectStyle(subscriptionsStyle);
	}
});

/* video page */
/*******************************************************************************************************************************************************************/
pages.push({
	re: [/youtube\.com\/watch.+/],
	func: function() {
		// load style
		injectStyle(videoStyle);

		// expand video description
		// intervalQuerySelector("#meta-contents #container #more", function(item) {
		// 	console.log(item);
		// 	item.click();
		// });

		// add WL button
		// setTimeout(function() {
		// 	const buttonContainer = $("div#menu.ytd-watch-metadata div#flexible-item-buttons");
		// 	if ($("div#menu.ytd-watch-metadata ytd-button-renderer.quickWL").length > 0) return;
		// 	// adding button renderer automatically creates yt-button-shape and childs tp-yt-paper-tooltip
		// 	const buttonRenderer = $(`<ytd-button-renderer class="style-scope ytd-menu-renderer quickWL" button-renderer=""></ytd-button-renderer>`);
		// 	buttonRenderer.css("margin-left", "8px");
		// 	buttonRenderer.insertBefore(buttonContainer);
		// 	// add button
		// 	const button = $(`<button class="yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading " aria-label="Watch Later" style=""></button>`);
		// 	buttonRenderer.children().first().append(button);
		// 	// add icon
		// 	const iconDiv = $(`<div class="yt-spec-button-shape-next__icon" aria-hidden="true"><yt-icon style="width: 24px; height: 24px;"></yt-icon></div>`);
		// 	button.append(iconDiv);
		// 	const icon = iconDiv.children().first();
		// 	icon.append(`<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="style-scope yt-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;">
		// 		<g class="style-scope yt-icon">
		// 			<path d="M14.97,16.95L10,13.87V7h2v5.76l4.03,2.49L14.97,16.95z M12,3c-4.96,0-9,4.04-9,9s4.04,9,9,9s9-4.04,9-9S16.96,3,12,3 M12,2c5.52,0,10,4.48,10,10s-4.48,10-10,10S2,17.52,2,12S6.48,2,12,2L12,2z" class="style-scope yt-icon"></path>
		// 		</g>
		// 	</svg>`);
		// 	const text = $(`<div class="cbox yt-spec-button-shape-next--button-text-content"><span class="yt-core-attributed-string yt-core-attributed-string--white-space-no-wrap" role="text">Watch Later</span></div>`);
		// 	button.append(text);
		// 	// add listner
		// 	let addedToWL = false;
		// 	buttonRenderer.click(function() {
		// 		const videoId = getVideoIdFromURL(window.location.href);
		// 		if (addedToWL) {
		// 			// remove video from WL
		// 			removeFromPlaylist(videoId, "WL").then(() => {
		// 				addedToWL = false;
		// 				icon.children().remove();
		// 				icon.append(`<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="style-scope yt-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;">
		// 					<g class="style-scope yt-icon">
		// 						<path d="M14.97,16.95L10,13.87V7h2v5.76l4.03,2.49L14.97,16.95z M12,3c-4.96,0-9,4.04-9,9s4.04,9,9,9s9-4.04,9-9S16.96,3,12,3 M12,2c5.52,0,10,4.48,10,10s-4.48,10-10,10S2,17.52,2,12S6.48,2,12,2L12,2z" class="style-scope yt-icon"></path>
		// 					</g>
		// 				</svg>`);
		// 			}).catch((err) => {
		// 				console.log("[ERROR] error while removing the video from WL");
		// 				console.log(err);
		// 			});
		// 		} else {
		// 			// add video to WL
		// 			addToPlaylist(videoId, "WL").then(() => {
		// 				addedToWL = true;
		// 				icon.children().remove();
		// 				icon.append(`<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="style-scope yt-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;">
		// 					<g class="style-scope yt-icon"><path d="M9,18.7l-5.4-5.4l0.7-0.7L9,17.3L20.6,5.6l0.7,0.7L9,18.7z" class="style-scope yt-icon"></path></g>
		// 				</svg>`);
		// 			}).catch((err) => {
		// 				console.log("[ERROR] error while adding the video to WL");
		// 				console.log(err);
		// 			});
		// 		}
		// 	});
		// }, 200);
	}
});

/* video page for a WL video */
/*******************************************************************************************************************************************************************/
// pages.push({
// 	re: [/youtube\.com\/watch.+list=WL.+/],
// 	func: function() {
// 		// add button to remove video from playlist
// 		let buttonContainers = $("div#menu.ytd-playlist-panel-video-renderer ytd-menu-renderer.ytd-playlist-panel-video-renderer");

// 		buttonContainers.each(function() {
// 			if ($(this).children("#button").length > 1) return;

// 			const iconButton = $(`<yt-icon-button id="button" class="dropdown-trigger style-scope ytd-menu-renderer" style-target="button"></yt-icon-button>`);
// 			const icon = $(`<yt-icon class="style-scope ytd-menu-renderer"></yt-icon>`);
// 			$(this).append(iconButton);
// 			iconButton.children().first().append(icon);
// 			icon.append(`<svg xmlns='http://www.w3.org/2000/svg' viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="style-scope yt-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;">
// 				<g class="style-scope yt-icon"><path d="M11,17H9V8h2V17z M15,8h-2v9h2V8z M19,4v1h-1v16H6V5H5V4h4V3h6v1H19z M17,5H7v15h10V5z" class="style-scope yt-icon"></path></g>
// 			</svg>`);
// 			const video = $(this).parents("ytd-playlist-panel-video-renderer.ytd-playlist-panel-renderer");
// 			const href = $(this).parent().prev().attr("href");
// 			iconButton.click(function() {
// 				const videoId = getVideoIdFromURL(href);
// 				removeFromPlaylist(videoId, "WL").then(() => {
// 					video.remove();
// 				}).catch((err) => {
// 					console.log("[ERROR] error while removing the video from WL");
// 					console.log(err);
// 				});
// 			});
// 		});
// 	}
// });

/* watch later page */
/*******************************************************************************************************************************************************************/
pages.push({
	re: [/youtube\.com\/playlist\?list=WL/],
	func: function() {
		setTimeout(function() {
			// count total playlist time
			let times = $("#contents.ytd-playlist-video-list-renderer > ytd-playlist-video-renderer > #content > #container > #thumbnail > #thumbnail > #overlays > ytd-thumbnail-overlay-time-status-renderer > #text");
			let h = 0, m = 0, s = 0;
			times.each(function() {
				let t = $(this).text().trim().split(":");
				if (t.length === 2) {
					m += parseInt(t[0]);
					s += parseInt(t[1]);
				} else if (t.length === 3) {
					h += parseInt(t[0]);
					m += parseInt(t[1]);
					s += parseInt(t[2]);
				}
			});

			m += Math.floor(s / 60);
			s = s % 60;

			h += Math.floor(m / 60);
			m = m % 60;

			let text = `${m < 10 ? "0":""}${m}:${s < 10 ? "0":""}${s}`;
			if (h > 0) text = h + ":" + text;
			text = "(" + text + ")";
			$("#page-manager > ytd-browse > ytd-playlist-header-renderer > div > div.immersive-header-content.style-scope.ytd-playlist-header-renderer > div.thumbnail-and-metadata-wrapper.style-scope.ytd-playlist-header-renderer\
			  > div > div.metadata-action-bar.style-scope.ytd-playlist-header-renderer > div.metadata-text-wrapper.style-scope.ytd-playlist-header-renderer > ytd-playlist-byline-renderer > div > yt-formatted-string:nth-child(4)").text(text);

			// // add button to remove video from playlist
			// let buttonContainers = $("div#menu.ytd-playlist-video-renderer ytd-menu-renderer.ytd-playlist-video-renderer");

			// buttonContainers.each(function() {
			// 	if ($(this).children("#button").length > 1) return;

			// 	const iconButton = $(`<yt-icon-button id="button" class="dropdown-trigger style-scope ytd-menu-renderer" style-target="button"></yt-icon-button>`);
			// 	const icon = $(`<yt-icon class="style-scope ytd-menu-renderer"></yt-icon>`);
			// 	$(this).append(iconButton);
			// 	iconButton.children().first().append(icon);
			// 	icon.append(`<svg xmlns='http://www.w3.org/2000/svg' viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="style-scope yt-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;">
			// 		<g class="style-scope yt-icon"><path d="M11,17H9V8h2V17z M15,8h-2v9h2V8z M19,4v1h-1v16H6V5H5V4h4V3h6v1H19z M17,5H7v15h10V5z" class="style-scope yt-icon"></path></g>
			// 	</svg>`);
			// 	const video = $(this).parents("ytd-playlist-video-renderer");
			// 	const href = video.find("a#video-title").attr("href");
			// 	iconButton.click(function() {
			// 		const videoId = getVideoIdFromURL(href);
			// 		removeFromPlaylist(videoId, "WL").then(() => {
			// 			video.remove();
			// 		}).catch((err) => {
			// 			console.log("[ERROR] error while removing the video from WL");
			// 			console.log(err);
			// 		});
			// 	});
			// });
		}, 200);
	}
});

/* executes globally once */
function globalOnce() {
	setInterval(() => {
		_lact = Date.now();
	}, 60 * 1000);
}

/* main */
/*******************************************************************************************************************************************************************/
function main() {
	for (let i = 0; i < pages.length; i++) {
		for (let j = 0; j < pages[i].re.length; j++) {
			if (window.location.href.match(pages[i].re[j])) {
				pages[i].func();
				// break so we don't execute the same function twice
				break;
			}
		}
		// we don't break the external for, so we can execute multiple different function on the same page
	}
}

// execute main when changing page
window.addEventListener("yt-navigate-finish", main);
globalOnce();
