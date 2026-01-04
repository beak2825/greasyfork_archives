// ==UserScript==
// @name         YouTube Shorts key controls
// @version      0.1
// @namespace    Violentmonkey Scripts
// @description  Adds key controls to YouTube Shorts
// @author       CarlosMarques
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465140/YouTube%20Shorts%20key%20controls.user.js
// @updateURL https://update.greasyfork.org/scripts/465140/YouTube%20Shorts%20key%20controls.meta.js
// ==/UserScript==

(function(){
	let listening2clicks = false;
	let mObserver = new MutationObserver(function(mutations){
		if(!listening2clicks && document.getElementById("shorts-player").getElementsByTagName("video")[0]){
			document.addEventListener("keydown", function(e){
				let shortVideo = document.getElementById("shorts-player").getElementsByTagName("video")[0];
				switch (e.key){
				case 'j':
					shortVideo.currentTime = shortVideo.currentTime - 10;
					break;
				case 'l':
					shortVideo.currentTime = shortVideo.currentTime + 10;
					break;
				case 'ArrowLeft':
					shortVideo.currentTime = shortVideo.currentTime - 5;
					break;
				case 'ArrowRight':
					shortVideo.currentTime = shortVideo.currentTime + 5;
					break;
				}
			})
			listening2clicks = true;
		}
	})
	mObserver.observe(document.body, {subtree: true, childList: true, characterData: true});
})()
