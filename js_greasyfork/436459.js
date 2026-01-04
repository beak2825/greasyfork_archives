// ==UserScript==
// @name     Remove yt volumebar focus
// @description Sets focus to video element after using volume bar, so that left/right arrow keys can be used for video seeking instead of volume change
// @license MIT
// @version  1.30
// @grant    none
// @match    https://www.youtube.com/*
// @namespace https://greasyfork.org/users/847699
// @downloadURL https://update.greasyfork.org/scripts/436459/Remove%20yt%20volumebar%20focus.user.js
// @updateURL https://update.greasyfork.org/scripts/436459/Remove%20yt%20volumebar%20focus.meta.js
// ==/UserScript==

const getVideoElem = () => document.querySelector("video.html5-main-video");
const elementToObserve = document.querySelector("body");

const observer = new MutationObserver(function(mutations_list) {
	mutations_list.forEach(function(mutation) {
		mutation.addedNodes.forEach(function(added_node) {
			if(added_node.id == 'movie_player') {
                const volumeArea = document.querySelector(".ytp-volume-area");
                const videoProgressBar = document.querySelector(".ytp-progress-bar-container");

                volumeArea.addEventListener("click", (_) => {
                    setTimeout(() => {
                        getVideoElem().focus();
                    }, 50);
                });
                videoProgressBar.addEventListener("click", (_) => {
                    setTimeout(() => {
                        getVideoElem().focus();
                    }, 50);
                });

				observer.disconnect();
			}
		});
	});
});

observer.observe(elementToObserve, {subtree: true, childList: true});
