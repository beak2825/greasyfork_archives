// ==UserScript==
// @name         YouTube Volume Display
// @namespace    typpi.online
// @version      1.3
// @description  Display current YouTube volume level in the UI
// @match        *://www.youtube.com/*
// @grant        none
// @author       Nick2bad4u
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license      UnLicense
// @tag          youtube
// @downloadURL https://update.greasyfork.org/scripts/517024/YouTube%20Volume%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/517024/YouTube%20Volume%20Display.meta.js
// ==/UserScript==

(function () {
	'use strict';

	const playerReady = setInterval(() => {
		const videoPlayer = document.querySelector('video');
		const leftControls = document.querySelector('.ytp-left-controls');

		if (videoPlayer && leftControls) {
			clearInterval(playerReady);

			// Create an input element to display volume level
			const volumeDisplay = document.createElement('input');
			volumeDisplay.type = 'text';
			volumeDisplay.value = videoPlayer.muted
				? '0'
				: Math.round(videoPlayer.volume * 100);
			volumeDisplay.readOnly = true;

			// Style the display element
			Object.assign(volumeDisplay.style, {
				width: '40px',
				marginLeft: '10px',
				backgroundColor: 'rgba(255, 255, 255, 0.0)',
				color: 'white',
				border: '0px solid rgba(255, 255, 255, 0.0)',
				borderRadius: '4px',
				zIndex: 9999,
				height: '24px',
				fontSize: '16px',
				padding: '0 4px',
				position: 'relative',
				top: '13px',
			});

			// Update display when volume changes
			videoPlayer.addEventListener('volumechange', () => {
				volumeDisplay.value = videoPlayer.muted
					? '0'
					: Math.round(videoPlayer.volume * 100);
			});

			// Insert the display element into the left controls
			leftControls.appendChild(volumeDisplay);
		}
	}, 500);
})();
