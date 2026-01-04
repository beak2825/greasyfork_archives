// ==UserScript==
// @name         Toggle youtube player ui
// @version      2024-08-17
// @description  Press q to toggle youtube player ui for all your video screenshotting needs
// @author       PersonWhoExists
// @match        https://www.youtube.com/*
// @icon         https://www.youtube.com/s/desktop/c22661fa/img/favicon_144x144.png
// @grant        none
// @namespace https://greasyfork.org/users/1308162
// @downloadURL https://update.greasyfork.org/scripts/496268/Toggle%20youtube%20player%20ui.user.js
// @updateURL https://update.greasyfork.org/scripts/496268/Toggle%20youtube%20player%20ui.meta.js
// ==/UserScript==

(function() {
	let state = false
	document.addEventListener("keydown", function(event) {
		if (event.key === "q") {
            const roundedCorners = document.querySelector("#ytd-player")
			const button = document.querySelector(".ytp-chrome-bottom")
			const grad = document.querySelector(".ytp-gradient-bottom")
            const titleBar = document.querySelector(".ytp-title-text")
            const fullScreenControls = document.querySelector(".ytp-chrome-top-buttons")

            roundedCorners.style.transitionProperty = 'border-radius';
            roundedCorners.style.transitionDuration = '0.5s';
            roundedCorners.style.transitionTimingFunction = 'ease';

			if (state == false) {
                roundedCorners.style.borderRadius = "0px"
				button.style.display = "none"
				grad.style.display = "none"
                titleBar.style.display = "none"
                fullScreenControls.style.display = "none"
                state = true
			}
			else if (state == true) {
                roundedCorners.style.borderRadius = "12px"
				button.style.display = ""
				grad.style.display = ""
                titleBar.style.display = ""
                fullScreenControls.style.display = ""
                state = false
			}
		}
	})
})();