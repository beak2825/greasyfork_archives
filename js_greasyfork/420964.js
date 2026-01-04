// ==UserScript==
// @name         Disney+ | Picture in Picture
// @namespace    https://victorwesterlund.com/
// @version      1.0
// @description  Enable Picture in Picture on Disney+
// @author       VictorWesterlund
// @match        https://www.disneyplus.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420964/Disney%2B%20%7C%20Picture%20in%20Picture.user.js
// @updateURL https://update.greasyfork.org/scripts/420964/Disney%2B%20%7C%20Picture%20in%20Picture.meta.js
// ==/UserScript==

(function() {
	'use strict';
	// PIP SVG - Copied from Full Screen <button>
	const PIPicon = '<div class="focus-hack-div" tabindex="-1"><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" tabindex="-1" focusable="false"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 11h-8v6h8v-6zm4 8V4.98C23 3.88 22.1 3 21 3H3c-1.1 0-2 .88-2 1.98V19c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zm-2 .02H3V4.97h18v14.05z" fill="white"/></svg></div>';
	let timeout = null;

	function initPIP() {
		const mediaControlsWrapper = document.getElementsByClassName("btm-media-overlays-container")[0];
		const video = document.getElementsByTagName("video")[0];
		video.removeAttribute("disablepictureinpicture");

		function togglePIP() {
			if(document.pictureInPictureElement) {
				document.exitPictureInPicture();
			} else {
				if(document.pictureInPictureEnabled) {
					video.requestPictureInPicture();
				}
			}
		}
		// Append the PIP button to target
		function insertPIPtoggle(target) {
			if(document.getElementById("pip-toggle") ?? false) {
				return false;
			}
			const button = document.createElement("button");
			button.setAttribute("id", "pip-toggle");
			button.setAttribute("aria-label", "PIP");
			button.setAttribute("role", "button");
			button.classList.add("control-icon-btn");
			button.addEventListener("click", () => togglePIP());
			button.insertAdjacentHTML("beforeend", PIPicon);
			target.appendChild(button);
		}
		// Attempt to locate target for PIP button
		const mediaControlsMutated = (mutations, observer) => {
			const target = mediaControlsWrapper.getElementsByClassName("controls__right")[0] ?? false;
			if (!target || target.length < 1) {
				return false;
			}
			insertPIPtoggle(target);
		}
		const mediaControls = new MutationObserver(mediaControlsMutated);
		mediaControls.observe(mediaControlsWrapper, {
			childList: true
		});
	}
	// Poll document tree until video element is loaded
	const init = (mutations, observer) => {
		clearTimeout(timeout);
		if(!window.location.href.includes("/video/")) {
			return false;
		}
		if(document.getElementsByTagName("video")[0]) {
			initPIP();
			return;
		}
		timeout = setTimeout(init, 500);
	}
	const page = new MutationObserver(init);
	page.observe(document.body, {
		childList: true
	});
})();
