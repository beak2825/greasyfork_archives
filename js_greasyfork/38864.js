// ==UserScript==
// @name         Twitch Auto Pause Host
// @version      0.1
// @description  Prevents hosted streams from auto playing.
// @author       Luxocracy
// @grant        none
// @match      	 https://www.twitch.tv/*
// @namespace https://greasyfork.org/users/30239
// @downloadURL https://update.greasyfork.org/scripts/38864/Twitch%20Auto%20Pause%20Host.user.js
// @updateURL https://update.greasyfork.org/scripts/38864/Twitch%20Auto%20Pause%20Host.meta.js
// ==/UserScript==

(function() {
	var observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			// Check if the mutation is the hosting video player being added.
			if(mutation.target.classList.contains('video-player-hosting-ui__container')) {
				let playButton = document.querySelector('div.pl-controls-bottom.pl-flex.qa-controls-bottom > div.player-buttons-left > button');
				// Loop to click the pause button once the stream starts playing.
				var pauseLoop = function() {
					if((playButton.firstChild.firstChild.dataset.tip.toLowerCase() === "pause")) {
						playButton.click(); // Click pause button
					} else {
						setTimeout(pauseLoop, 500);
					}
				};
				pauseLoop();
			}
		});
	});

	if (!window.location.pathname.match('directory')) observer.observe(document.querySelector('body'), { childList: true, subtree: true });
})();
