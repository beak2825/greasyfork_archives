// ==UserScript==
// @namespace           https://greasyfork.org/en/users/988790
// @name                Block ads on Youtube
// @author				pixxy contact me at  discord server|https://discord.gg/GUNx3rq6
// @match               https://*.youtube.com/*
// @version             1.2
// @description         Ad blocker userscript for Youtube
// @run-at 				document-start
// @include             https://*.youtube.com/*
// @grant			    GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/455628/Block%20ads%20on%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/455628/Block%20ads%20on%20Youtube.meta.js
// ==/UserScript==

GM_addStyle(`
#player-ads,
.adDisplay,
.ad-container,
.ytd-display-ad-renderer,
.video-ads,
#masthead-ad {
	display: none !important;
}
`);

let video

const observer = new MutationObserver(mutations => {
	for(const mutation of mutations) {
		for(const addedNode of mutation.addedNodes) {
			if(addedNode.className && (addedNode.classList.contains("ytp-ad-skip-button-slot") || addedNode.classList.contains("ytp-ad-overlay-close-button"))) {
				console.log("ytp-ad")
				addedNode.click()
			} else if(addedNode.className && addedNode.classList.contains("ad-showing")) {
				console.log("ad-showing")
				if(!isNaN(video.duration)) {
					video.play()
					video.currentTime = video.duration
				}
			} else if(addedNode.tagName === "VIDEO" && addedNode.classList.contains("html5-main-video")) {
				console.log("video")
				video = addedNode
				video.addEventListener("durationupdate", () => {
					console.log("durationupdate")
					video.play()
					video.currentTime = video.duration
				})
				video.addEventListener("timeupdate", () => {
					const adSkipButton = document.querySelector(".ytp-ad-skip-button-slot button,.ytp-ad-overlay-close-button")
					if(adSkipButton) {
						adSkipButton.click()
					}
					if(document.querySelector(".ad-showing")) {
						if(!isNaN(video.duration)) {
							video.play()
							video.currentTime = video.duration
						}
					}
				})
			}
		}
	}
})

observer.observe(document.documentElement, { subtree: true, childList: true, attributes: true })