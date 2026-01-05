// ==UserScript==
// @name        Bandcamp Keyboard Play/Pause
// @version     2.4
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

window.self === window.top && window.siteroot && "https://bandcamp.com" == window.siteroot && (function() {
	"use strict";

	if (window.self === window.top) {
        var startTime = new Date().getTime();
		console.log("BCKP: \"Anything I can do here?\"");

		var BCKP = function BCKP(startTime) {
			this.startTime = startTime;
			this.init = function() {
				var message = "BCKP: ";
				if (typeof window.siteroot !== "undefined" && window.siteroot === "https://bandcamp.com") {
					var pauseButton = document.getElementsByClassName('playbutton')[0];
					var pauseToggle;

					var initToggle = function() {
						pauseToggle = document.createEvent("MouseEvents");
						pauseToggle.initEvent("click", false, false);
					};

					initToggle();

					if (pauseButton && pauseToggle) {
						window.addEventListener("keydown", function(e) {
                            if ( // Catch pressed key
								(e.keyCode === 32 && 0 > ["INPUT", "TEXTAREA", "SELECT"].indexOf(document.activeElement.tagName)) || // Space bar when a control isn't active
								e.keyCode === 19 || // Pause
								false) {
									e.preventDefault(); // Cancel whatever default action the key might have
									pauseButton.dispatchEvent(pauseToggle); // Simulate a click on the Play/Pause button
									initToggle(); // Chrome seems to require redefinition of the simulated event for it to work more than once
									return false;
								}
						}, false);
					}
					message += "Initialized";
				} else {
					message += "Exited";
				}
				message += " in " + (new Date().getTime() - this.startTime) / 1000 + " seconds.";
				console.log(message);
			};
		};

		var inject = function(fn, startTime) {
			var script = document.createElement('script');
			script.type = "text/javascript";
			script.textContent = fn.toString() + '\nnew BCKP(' + startTime +').init();';
			document.body.appendChild(script);
		};

		var init = function(startTime) {
			if (typeof window.siteroot !== "undefined" && window.siteroot === "http://bandcamp.com") {
				new BCKP(startTime).init();
			} else {
				inject(BCKP, startTime);
			}
		};
		window.addEventListener('load', init(startTime), false);
	}

}());
