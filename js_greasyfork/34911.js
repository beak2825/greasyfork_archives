// ==UserScript==
// @name         YouTube global shortcuts
// @namespace    https://gist.github.com/stefansundin/
// @homepage     https://gist.github.com/stefansundin/65e3d6db697636d8e7f1
// @version      1.1
// @author       Stefan Sundin
// @description  Makes the YouTube shortcuts work even if the player is not focused.
// @icon         https://www.youtube.com/favicon.ico
// @match        https://www.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/34911/YouTube%20global%20shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/34911/YouTube%20global%20shortcuts.meta.js
// ==/UserScript==

// Space = Pause/play
// F = Toggle fullscreen
// M = Toggle mute
// P = Previous video (if in playlist)
// N = Next video (if in playlist)
// left and right keys focuses the button, but the first keydown won't trigger seeking unfortunately
// P and N already works without this userscript, but you must hold shift.
// Use Ctrl+Space to scroll down, Shift+Space to scroll up

window.addEventListener('keydown', function (e) {
	var button = document.getElementsByClassName('ytp-play-button')[0] || document.getElementById('movie_player');

	if (!button) {
		return;
	}

	if (['TEXTAREA','INPUT'].indexOf(e.srcElement.tagName) !== -1 ||
	    ['yt-commentbox-text', 'yt-simplebox-text', 'ytp-progress-bar', 'ytp-volume-panel'].indexOf(e.srcElement.className) !== -1) {
		return;
	}

	if (e.srcElement.classList.contains('html5-video-player')) {
		return;
	}

	var c = String.fromCharCode(e.keyCode).toLowerCase();

	if (c === ' ' || e.keyCode === 37 || e.keyCode === 39) { // 37 = left key, 39 = right key
		if (c === ' ' && (e.shiftKey || e.ctrlKey)) {
			return;
		}

		if (c === ' ') {
			document.activeElement.blur();
			button.click();
			button.blur();
			e.preventDefault();
		}
	} else if (c === 'n') {
		document.getElementsByClassName('ytp-next-button')[0].click();
	} else if (c === 'p') {
		document.getElementsByClassName('ytp-prev-button')[0].click();
	}
});