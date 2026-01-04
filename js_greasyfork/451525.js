// ==UserScript==
// @name         YouTube - Hide Watched
// @description  YouTube - Hide Watched.
// @version      0.7
// @author       to
// @namespace    https://github.com/to
// @license      MIT
// 
// @match        https://www.youtube.com/*
// @exclude      https://www.youtube.com/feed/history
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// 
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/451525/YouTube%20-%20Hide%20Watched.user.js
// @updateURL https://update.greasyfork.org/scripts/451525/YouTube%20-%20Hide%20Watched.meta.js
// ==/UserScript==

const THRESHOLD = 90;

new MutationObserver(throttleAndDebounce(() => {
	for (let progress of document.querySelectorAll('#progress')) {
		if (parseInt(progress.style.width) > THRESHOLD) {
			let video =
				progress.closest('ytd-rich-item-renderer') ||
				progress.closest('ytd-video-renderer') ||
				progress.closest('ytd-grid-video-renderer') ||
				progress.closest('ytd-compact-video-renderer')
			if (video) {
				video.style.display = 'none';
				video.classList.add('tm-watched')
			}
		}
	}
}, 500)).observe(document, {
	childList: true,
	subtree: true,
});

function throttleAndDebounce(fn, interval) {
	let timer;
	let lastTime = Date.now() - interval;
	return function () {
		if ((Date.now() - lastTime) > interval) {
			lastTime = Date.now();
			fn();
		} else {
			clearTimeout(timer);
			timer = setTimeout(() => {
				fn();
			}, interval);
		}
	}
}