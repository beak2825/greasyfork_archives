// ==UserScript==
// @name         Google Form Heavy Traffic Checker
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       You
// @match        https://docs.google.com/forms/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451146/Google%20Form%20Heavy%20Traffic%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/451146/Google%20Form%20Heavy%20Traffic%20Checker.meta.js
// ==/UserScript==

(function () {
	'use strict';

	Audio.prototype.play = (function (play) {
		return function () {
			var audio = this,
				args = arguments,
				promise = play.apply(audio, args);
			if (promise !== undefined) {
				promise.catch(_ => {
					// Autoplay was prevented. This is optional, but add a button to start playing.
					var el = document.createElement("button");
					el.innerHTML = "Play";
					el.addEventListener("click", function () {
						play.apply(audio, args);
					});
					this.parentNode.insertBefore(el, this.nextSibling)
				});
			}
		};
	})(Audio.prototype.play);

	function reload() {
		console.log("reloading page")
		location.reload()
	}

    function playaudio() {
        console.log("playing audio...")
    document.querySelector("body > audio").play()
    setTimeout(playaudio, 1000);
    }
	var text = document.querySelector("#innerContainer")
	if (text != null) {
		if (text.textContent.includes("heavy traffic")) {
			console.log("meh")
			var customText = document.createElement("h1")
			customText.textContent = "Hmm. Heavy traffic... Reloading in 5 seconds."
			text.appendChild(customText)
			setTimeout(reload, 5000);
		}
	} else {
		console.log("YEAHHH")
        // playaudio()
        // enable if you want ^^^
	}

	// Your code here...
})();