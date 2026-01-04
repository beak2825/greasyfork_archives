// ==UserScript==
// @name         YouTube Subscriptions Page: Hide Viewed Videos
// @namespace    hideViewedVideos_kk
// @description  Once a video is clicked, it will be hidden from the subscription page
// @version      1.6
// @author       Kai Krause <kaikrause95@gmail.com>
// @match        http://*.youtube.com/*
// @match        https://*.youtube.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32710/YouTube%20Subscriptions%20Page%3A%20Hide%20Viewed%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/32710/YouTube%20Subscriptions%20Page%3A%20Hide%20Viewed%20Videos.meta.js
// ==/UserScript==

// Youtube's inline loading method may confuse the browser
if (!location.href.includes('youtube.com/feed/subscriptions')) return;

// Helper functions
function getTarget(e) {
	e = e || window.event;
	return e.target || e.srcElement;
}
function rightClick(e) {
	e = e || window.event;
	if ("which" in e) { // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
		return e.which === 3;
	} else if ("button" in e) { // IE, Opera
		return e.button === 2;
	}
}

// Hide 'video is hidden' message from hidden videos
function autoHideHidden () {
	setTimeout(function(){
		let dismissed = document.querySelectorAll('[is-dismissed], .ytDismissibleItemReplacedContent');
		for (let d of dismissed) {
			d.remove();
		}
	}, 100);
}
//document.addEventListener('mouseup', autoHideHidden);

setInterval(() => {
	// Disable video preview in new YT subscription page for click target context
	document.querySelector("#video-preview")?.remove();
}, 100);

// Hide videos when clicked
function autoHideClicked (e) {
	if (rightClick(e)) return;
	let target = getTarget(e);

	// Disable video channel clicks from removing the video
	if (target.href && (target.href.includes('/user/') || target.href.includes('/channel/'))) return;
	// Disable video menu clicks from removing the video, and ignore the thumbnail 'play' animation
	if (target.tagName === "BUTTON" || target.tagName === "YT-ICON" && target.id !== "play") return;

	while (target) {
		// ignore menu button and hidden video elements on-click
		let ignoredClasses = ["yt-icon-button", "yt-spec-touch-feedback-shape__fill", "ytDismissibleItemReplacedContent"];
		for (let iClass of ignoredClasses) {
			if (target?.classList?.contains(iClass)) return;
			//if (target.querySelector(iClass)) return;
		}

		if (
			["ytd-grid-video-renderer", "ytd-rich-item-renderer"].includes(target?.tagName.toLowerCase()) ||
			target.id === "dismissible" && target?.classList?.contains("ytd-rich-grid-media")
		){
			let isVideo = target.querySelector('[href*="/watch"]');
			let isShort = target.querySelector('[href*="/shorts/"]');
			if (!isVideo && !isShort) break;

			let hideMenuButton = target.getElementsByTagName("button")[0];
			hideMenuButton.click();

			setTimeout(function() {
				// Hide the video via the youtube menus, because 1) lazy, 2) easier to update in future
				let hideMenu = document.querySelector(".style-scope tp-yt-iron-dropdown") || document.querySelector(".ytd-menu-popup-renderer");
				let hideButton = hideMenu.querySelectorAll("yt-formatted-string, yt-list-item-view-model");
				if (!isShort) hideButton[hideButton.length-1].click();
				else hideButton[hideButton.length-2].click();
				//autoHideHidden();
			}, 4);

			break;
		}
		else {
			target = target.parentNode;
		}
	}
}
document.addEventListener('mouseup', autoHideClicked);
