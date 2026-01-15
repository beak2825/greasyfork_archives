// ==UserScript==
// @name        Bandcamp Keyboard Play/Pause
// @version     2.6
// @author      raina
// @namespace   raina
// @description Allows you to pause and resume playback with the Space bar and Pause keys.
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAAtBAMAAADMwS+UAAAAMFBMVEVNTU3///8tLS3Q0NDT09P6+vr+/v75+fnS0tL9/f38/Pz7+/vR0dHPz8+QkJD4+PiM28Q0AAAAAXRSTlMAQObYZgAAAKJJREFUOMtjYHDBBhwYGFgEsQERBgZHrBKCBmRJiCWiCc7elohDYvdGiFFiaagSmTMnQiWmoUqAjMAukbUQn0QjWELskZKSkqAQkHgGMwooIZgoKK0Ek9CG+aMRTIvDJdRRJeThEvpE6qCtxMGhJWFIHwlgusISURAJnDoE4ankNaodWFI7TomLNJWApF1SJAg4l1nweygGKBRmYGAwxgYMGAAd3YaWDmVo4gAAAABJRU5ErkJggg==
// @license     http://www.gnu.org/licenses/gpl-3.0.txt
// @include     /^https?:\/\//
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/1309/Bandcamp%20Keyboard%20PlayPause.user.js
// @updateURL https://update.greasyfork.org/scripts/1309/Bandcamp%20Keyboard%20PlayPause.meta.js
// ==/UserScript==

window.self === window.top && window?.siteroot == "https://bandcamp.com" && (function() {

	const startTime = new Date().getTime();
	const pauseButton = document.getElementsByClassName("playbutton")[0];
	if (pauseButton) {
		window.addEventListener("keydown", function(e) {
			if ( // Catch pressed key
				(e.keyCode === 32 && 0 > ["INPUT", "TEXTAREA", "SELECT", "MENU-BAR"].indexOf(document.activeElement.tagName)) || // Space bar when a control isn't active
				e.keyCode === 19 || // Pause
				false) {
					e.preventDefault(); // Cancel whatever default action the key might have
					pauseButton.dispatchEvent(new MouseEvent("click")); // Simulate a click on the Play/Pause button
					return false;
				}
		}, false);
	}

}());
