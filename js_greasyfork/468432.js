// ==UserScript==
// @name        YouTube Download Button Mobile
// @description	Download video or mp3 from YouTube Mobile.
// @version     1.5
// @author      look997
// @match       https://m.youtube.com/watch*
// @homepageURL https://greasyfork.org/pl/users/4353-look997
// @namespace   https://greasyfork.org/pl/users/4353-look997
// @grant       none
// @run-at      document-end
// @icon        https://www.google.com/s2/favicons?domain=youtube.com
// @icon64      https://www.google.com/s2/favicons?domain=youtube.com
// @downloadURL https://update.greasyfork.org/scripts/468432/YouTube%20Download%20Button%20Mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/468432/YouTube%20Download%20Button%20Mobile.meta.js
// ==/UserScript==

function addButton () {
	const el = document.createElement("ytm-button-renderer");
	el.classList.add("slim_video_action_bar_renderer_button");
	const targetEl = document.querySelector("ytm-slim-video-action-bar-renderer > .slim-video-action-bar-actions");
  
	if (!targetEl) { return false; }
	targetEl.append(el);
	
console.log("bla-in-2");
	
	const buttonEl = document.createElement("button");
	buttonEl.textContent = "Download";
	buttonEl.title = "Download video or mp3";
	buttonEl.classList.add("yt-spec-button-shape-next");
	buttonEl.classList.add("yt-spec-button-shape-next--tonal");
	buttonEl.classList.add("yt-spec-button-shape-next--mono");
	buttonEl.classList.add("yt-spec-button-shape-next--size-m");
	buttonEl.classList.add("yt-spec-button-shape-next--icon-leading");
	
	function download(){
		const id = new URLSearchParams (window.location.search).get("v");
		const hrefDownload ='https://en.loader.to/4/?link=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D'+ id + '3&f=6&s=1&e=1&r=ddownr'
		window.open(hrefDownload, '_blank');
	}
	buttonEl.addEventListener("click", download);
	
	el.replaceChildren(buttonEl);
	
}

(function() {
	
	'use strict';
	
	window.addEventListener("yt-navigate-finish", addButton, true);
	setTimeout(addButton,1000);
	
})();
