// ==UserScript==
// @name         Video Seek Forward Backward 3 Seconds
// @namespace    https://github.com/Dadangdut33/Video-Seek-Forward-Backward-3-Seconds
// @version      1.1
// @description  Use ctrl + \ and ctrl + ] to seek video forward and backward 3 seconds. To seek forward use ctrl + \. To seek backward use ctrl + ]. You can modify the key and the seek time to your desire easily in the script.
// @author       Dadangdut33
// @license Unlicense
// @include *
// @run-at document-load
// @downloadURL https://update.greasyfork.org/scripts/439804/Video%20Seek%20Forward%20Backward%203%20Seconds.user.js
// @updateURL https://update.greasyfork.org/scripts/439804/Video%20Seek%20Forward%20Backward%203%20Seconds.meta.js
// ==/UserScript==

(async function () {
	("use strict");

	// * use https://keycode.info/ to find the keycode
	// * Default key is:
	// * ctrl + ] to seek backward
	// * ctrl + \ to seek forward

	let foundVideo = false,
		tries = 0,
		videos,
		checkLimit = 10, // Set the number of tries to find the video element
		seekBackwardFor = 3, // Set the time to seek backward in seconds
		seekForwardFor = 3, // Set the time to seek forward in seconds
		seekBackwardKeyCode = 221, // Set the key code to seek backward (ctrl + seekBackwardKeyCode)
		seekForwardKeyCode = 220; // Set the key code to seek forward (ctrl + seekForwardKeyCode)

	// Check for video element
	let checkInterval = setInterval(function () {
		if (foundVideo) {
			clearInterval(checkInterval);
			return;
		}

		console.log(`[${new Date()}] Checking for video element`);
		videos = document.getElementsByTagName("video");

		if (videos.length > 0) {
			foundVideo = true;

			// Store the video element in an array
			const videoItem = [];
			for (let i = 0; i < videos.length; i++) {
				videoItem.push(videos.item(i));
			}

			// Loop through the video element array
			videoItem.forEach(function (video) {
				// add event listener to the window with key event that binds to the video
				window.addEventListener("keydown", function (event) {
					if (event.ctrlKey && event.keyCode === seekBackwardKeyCode) {
						video.currentTime -= seekBackwardFor; // time to seek backward
					}

					if (event.ctrlKey && event.keyCode === seekForwardKeyCode) {
						video.currentTime += seekForwardFor; // time to seek forward
					}
				});
			});

			return; // stop if found
		}

		tries++;

		if (tries < checkLimit) {
			console.log(`[${new Date()}] No video found, trying again in 5 seconds`);
		} else {
			console.log(`[${new Date()}] No video found, giving up`);
			clearInterval(checkInterval);
		}
	}, 5000);
})();
