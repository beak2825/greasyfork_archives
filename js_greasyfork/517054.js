// ==UserScript==
// @name         mute spotify ads
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically mute Spotify ads.
// @author       crazy-cat-108
// @match https://open.spotify.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/517054/mute%20spotify%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/517054/mute%20spotify%20ads.meta.js
// ==/UserScript==

(function () {
    'use strict';
    
    const targetNode = document.body;

    const config = { attributes: true, childList: true, subtree: true };

    const observer = new MutationObserver(callback);

    observer.observe(targetNode, config);

    function callback(mutationList) {
        for (const mutation of mutationList) {
			const muteButton = document.querySelector('[data-testid="volume-bar-toggle-mute-button"]');
			const title = document.querySelector("title").textContent;
			if (title.includes("Spotify – Advertisement") && !muteButton?.hasAttribute("isMuted")) {
				muteButton.click();
				muteButton.setAttribute("isMuted", true);
			}
			if (!title.includes("Spotify – Advertisement") && muteButton?.hasAttribute("isMuted")) {
				muteButton.click();
				muteButton.removeAttribute("isMuted");
			}
        }
    }
    
})();