// ==UserScript==
// @name         YouTubeTV Volume Control with Memory
// @namespace    typpi.online
// @version      4.1
// @description  Remembers and controls volume levels on YouTube TV with keyboard shortcuts and a UI for manual input
// @author       Nick2bad4u
// @match        *://tv.youtube.com/*
// @grant        GM.setValue
// @grant        GM.getValue
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tv.youtube.com
// @license      UnLicense
// @tag          youtube
// @downloadURL https://update.greasyfork.org/scripts/513786/YouTubeTV%20Volume%20Control%20with%20Memory.user.js
// @updateURL https://update.greasyfork.org/scripts/513786/YouTubeTV%20Volume%20Control%20with%20Memory.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// Wait for the YouTube player and controls to load
	const playerReady = setInterval(() => {
		const videoPlayer = document.querySelector('video');
		const leftControls = document.querySelector('.ytp-left-controls');
		const volumeSliderHandle = document.querySelector(
			'.ytp-volume-slider-handle',
		);
		const volumePanel = document.querySelector('.ytp-volume-panel');
		const muteButton = document.querySelector('.ytp-mute-button');

		if (videoPlayer && leftControls && volumeSliderHandle && muteButton) {
			clearInterval(playerReady);

			// Retrieve the saved volume level from localStorage
			let ytVolumeData = localStorage.getItem('yt-player-volume');
			let savedVolume = videoPlayer.volume;
			let savedMuted = videoPlayer.muted;

			if (ytVolumeData) {
				try {
					ytVolumeData = JSON.parse(ytVolumeData);
					const data = JSON.parse(ytVolumeData.data);
					savedVolume = data.volume / 100; // YouTube stores volume from 0 to 100
					savedMuted = data.muted;
				} catch (e) {
					console.error('Failed to parse yt-player-volume:', e);
				}
			}

			// Ensure savedVolume is within [0, 1] range
			videoPlayer.volume = Math.max(0, Math.min(1, savedVolume));
			videoPlayer.muted = savedMuted;

			// Update the slider handle position
			const updateSliderHandle = () => {
				if (videoPlayer.muted) {
					volumeSliderHandle.style.left = `0%`;
				} else {
					volumeSliderHandle.style.left = `${videoPlayer.volume * 100}%`;
				}
			};
			updateSliderHandle();

			// Set the aria-valuenow attribute on the volume panel
			if (volumePanel) {
				volumePanel.setAttribute('aria-valuenow', videoPlayer.volume * 100);
			}

			// Create input element for volume control
			const volumeInput = document.createElement('input');
			volumeInput.type = 'number';
			volumeInput.min = 0;
			volumeInput.max = 100;
			volumeInput.value = videoPlayer.muted
				? 0
				: Math.round(videoPlayer.volume * 100);

			// Style the input field
			Object.assign(volumeInput.style, {
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
				transition: 'border-color 0.3s, background-color 0.3s',
				outline: 'none',
				position: 'relative',
				top: '13px',
			});

			// Prevent hotkeys from interfering with the input
			volumeInput.addEventListener('keydown', (e) => e.stopPropagation());

			// Input focus and hover styling
			volumeInput.addEventListener(
				'focus',
				() => (volumeInput.style.borderColor = 'rgba(255, 255, 255, 0.6)'),
			);
			volumeInput.addEventListener(
				'blur',
				() => (volumeInput.style.borderColor = 'rgba(255, 255, 255, 0.3)'),
			);
			volumeInput.addEventListener(
				'mouseenter',
				() => (volumeInput.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'),
			);
			volumeInput.addEventListener(
				'mouseleave',
				() => (volumeInput.style.backgroundColor = 'rgba(255, 255, 255, 0.0)'),
			);

			// Handle volume change from input
			let lastSetVolume = videoPlayer.volume;
			volumeInput.addEventListener('input', () => {
				let volume = parseInt(volumeInput.value, 10);
				volume = isNaN(volume) ? 100 : Math.max(0, Math.min(100, volume)); // Clamp between 0 and 100

				videoPlayer.volume = volume / 100; // Convert to [0, 1] range

				if (volume === 0) {
					videoPlayer.muted = true;
				} else {
					videoPlayer.muted = false;
				}

				lastSetVolume = videoPlayer.volume;

				// Update the slider handle position
				updateSliderHandle();

				// Save the new volume to localStorage
				const ytVolumeObject = {
					data: JSON.stringify({
						volume: volume, // Volume from 0 to 100
						muted: videoPlayer.muted,
					}),
					expiration: Date.now() + 2592000000, // Expires in 30 days
					creation: Date.now(),
				};
				const ytVolumeString = JSON.stringify(ytVolumeObject);
				localStorage.setItem('yt-player-volume', ytVolumeString);
			});

			// Update input value when volume changes from other controls
			let previousMutedState = videoPlayer.muted;

			videoPlayer.addEventListener('volumechange', () => {
				if (previousMutedState && !videoPlayer.muted) {
					// Player was muted and is now unmuted
					videoPlayer.volume = lastSetVolume;
					volumeInput.value = Math.round(videoPlayer.volume * 100);
					updateSliderHandle();
				}

				previousMutedState = videoPlayer.muted;

				// Update lastSetVolume if the volume changed and not muted
				if (!videoPlayer.muted) lastSetVolume = videoPlayer.volume;

				volumeInput.value = videoPlayer.muted
					? 0
					: Math.round(videoPlayer.volume * 100);

				// Update the slider handle position
				updateSliderHandle();

				// Save the volume to localStorage
				const volumePercent = Math.round(videoPlayer.volume * 100);
				const ytVolumeObject = {
					data: JSON.stringify({
						volume: volumePercent,
						muted: videoPlayer.muted,
					}),
					expiration: Date.now() + 2592000000,
					creation: Date.now(),
				};
				const ytVolumeString = JSON.stringify(ytVolumeObject);
				localStorage.setItem('yt-player-volume', ytVolumeString);
			});

			// Insert the input into the left controls
			leftControls.appendChild(volumeInput);
		}
	}, 500);
})();
