// ==UserScript==
// @name        Anime1 overhaul
// @namespace   Violentmonkey Scripts
// @match       http*://anime1.me/*
// @match       http*://anime1.pw/*
// @exclude     http*://anime1.me/
// @exclude     http*://anime1.pw/
// @grant       none
// @version     1.0.2
// @author      CcydtN
// @description It currently do two things. One, set player to full page width (and remove the side bar). Second, disable volume change on scroll.
// @downloadURL https://update.greasyfork.org/scripts/487685/Anime1%20overhaul.user.js
// @updateURL https://update.greasyfork.org/scripts/487685/Anime1%20overhaul.meta.js
// ==/UserScript==

// Entry point
$(document).ready(() => {
	set_content_to_full_width();
	disable_volume_change_on_scroll();
	follow_video_on_resize();
});

function set_content_to_full_width() {
	$("#primary").css("width", "100%");
	$(".vjscontainer").css("height", "100%");
	$(".vjscontainer").css("max-width", "100%");
	// remove side bar
	$("#secondary").css("display", "none");
}

function disable_volume_change_on_scroll() {
	$(".vjscontainer")
		.children()
		.each((id, element) => {
			// Volume change is trigger by "mousewheel" event
			// Disable the event is impossible, because the function reference cannot be obtain. Check "removeEventListener"
			//
			// But "mousewheel" is deprecated, "wheel" is suggested.
			// In vivaldi, execution of "mousewheel" can be prevent by adding handler to "wheel".
			// I assume all chromium-base browser have same behaviour
			//
			// Can be tested by the following code
			// $(element).on("wheel", ()=>{console.log("wheel")})
			// $(element).on("mousewheel", ()=>{console.log("mousewheel")})
			$(element).on("wheel", () => {});
		});
}

// Content height changes base on the windows width after setting content to full width
// => When resize happened, height of document change, but scroll position stay the same.
// => The viewport content changes, user need to scroll up to view the original content.

// This fix the issue by tracking which content is being view before resize.
function follow_video_on_resize() {
	// Save the center(y-axis) of each video
	let video_players = $(".vjscontainer")
		.toArray()
		.map((elem) => elem.offsetTop + elem.offsetHeight / 2);

	// Keep track of the current scroll position
	let current_pos = 0;
	window.addEventListener("scroll", () => {
		current_pos = document.documentElement.scrollTop || document.body.scrollTop;
	});

	window.addEventListener("resize", () => {
		// Stop trigger this handler when playing video in fullscreen
		if (window.innerHeight === screen.height) {
			return;
		}

		// Compute which content is being view before resizing.
		const centre_before = current_pos + window.innerHeight / 2;
		const video_idx_before = findClosestIdx(video_players, centre_before);

		// Scroll to that content
		$(".vjscontainer").get(video_idx_before).scrollIntoView({
			behavior: "smooth",
			block: "center",
		});

		// Update the center position for the next resize event.
		video_players = $(".vjscontainer")
			.toArray()
			.map((elem) => elem.offsetTop + elem.offsetHeight / 2);
	});
}

// find the index of the closest element in array
// array should be small, so O(n) should be fine
function findClosestIdx(arr, target) {
	let left = 0;
	let right = arr.length - 1;
	while (left < right) {
		if (Math.abs(arr[left] - target) <= Math.abs(arr[right] - target)) {
			right--;
		} else {
			left++;
		}
	}
	return left;
}
