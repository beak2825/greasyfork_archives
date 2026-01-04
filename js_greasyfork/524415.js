// ==UserScript==
// @name         YTDLP Downloader
// @namespace    http://tampermonkey.net/
// @version      0.01
// @description  Downloads the current video locally via yt-dlp
// @author       TetteDev
// @match        https://www.youtube.com/watch?v=*
// @match        https://youtu.be/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_addStyle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/524415/YTDLP%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/524415/YTDLP%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';
	const btn = document.createElement("div");
	btn.id = "download_button";
	btn.textContent = "⬇️ Download with YTDLP";

	GM_addStyle(`
	#download_button {
		position:fixed;
		z-index: 9999;

		bottom: 0px;
		right: 25px;

		height: 25px;
		width: auto;
		padding-left: 5px;
		padding-right: 5px;

		background-color:#cc012a;
		color: #f1f1f1;
		font-size: 14px;

		-webkit-border-top-left-radius: 3px;
		-webkit-border-top-right-radius: 3px;
		-moz-border-radius-topleft: 3px;
		-moz-border-radius-topright: 3px;
		border-top-left-radius: 3px;
		border-top-right-radius: 3px;
		text-align: center;
		vertical-align: center;
		line-height: 25px;
		cursor: pointer;

		transform: translateY(85%);
		transition: transform 0.5s;
	}

	#download_button:hover {
		transform: translateY(0);
	}
	`);

	// TODO: add support for -cookie ytdlp parameter

	btn.onclick = (evt) => {
		let videoId = new URLSearchParams(window.location.search).get("v");
		debugger;
		if (videoId === null) {
			if (location.host === "www.youtu.be") {
				debugger;
				alert("handle youtu.be domain")
				return;
			} else {
				console.warn("Could not derive video id");
				return;
			}
		}
		const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
		window.open(`ytdlp:${videoUrl}`, '_blank');
	};

	document.body.appendChild(btn);
    
})();