// ==UserScript==
// @name         YouTube Volume Control with Memory
// @namespace    typpi.online
// @version      4.1
// @description  Set YouTube volume manually on a scale of 1-100, remember last set volume, and inject the UI to the left of the volume slider on the video player. Syncs the slider, disables invalid inputs, and adds debugging.
// @author       Nick2bad4u
// @match        *://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM.getValue
// @grant        GM.setValue
// @license      UnLicense
// @tag          youtube
// @downloadURL https://update.greasyfork.org/scripts/513759/YouTube%20Volume%20Control%20with%20Memory.user.js
// @updateURL https://update.greasyfork.org/scripts/513759/YouTube%20Volume%20Control%20with%20Memory.meta.js
// ==/UserScript==

(async function () {
	'use strict';

	// Default volume if none is saved
	let previousVolume = await GM.getValue('youtubeVolume', 5);

	// Create input element for volume control
	const volumeInput = document.createElement('input');
	volumeInput.type = 'number';
	volumeInput.min = 0;
	volumeInput.max = 100;
	volumeInput.value = previousVolume;

	// Set input field styles to resemble YouTube's UI
	volumeInput.style.width = '30px';
	volumeInput.style.marginRight = '10px';
	volumeInput.style.backgroundColor = 'rgba(255, 255, 255, 0.0)';
	volumeInput.style.color = 'white';
	volumeInput.style.border = '0px solid rgba(255, 255, 255, 0.0)';
	volumeInput.style.borderRadius = '4px';
	volumeInput.style.zIndex = 9999;
	volumeInput.style.height = '24px';
	volumeInput.style.fontSize = '16px';
	volumeInput.style.padding = '0 4px';
	volumeInput.style.transition = 'border-color 0.3s, background-color 0.3s';
	volumeInput.style.outline = 'none';
	volumeInput.style.position = 'relative';
	volumeInput.style.top = '13px';

	// Change border color on focus
	volumeInput.addEventListener('focus', () => {
		volumeInput.style.borderColor = 'rgba(255, 255, 255, 0.6)';
	});

	volumeInput.addEventListener('blur', () => {
		volumeInput.style.borderColor = 'rgba(255, 255, 255, 0.3)';
	});

	// Change background color on hover
	volumeInput.addEventListener('mouseenter', () => {
		volumeInput.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
	});

	volumeInput.addEventListener('mouseleave', () => {
		volumeInput.style.backgroundColor = 'rgba(255, 255, 255, 0.0)';
	});

	// Prevent YouTube hotkeys when typing in the input
	volumeInput.addEventListener('keydown', function (event) {
		event.stopPropagation();
		console.log('Keydown event in volume input, stopping propagation.');
	});

	// Function to set the volume based on input value
	async function setVolume(volumeValue) {
		const player = document.querySelector('video');
		if (player) {
			// Validate input (must be between 0 and 100)
			if (volumeValue < 0) volumeValue = 0;
			if (volumeValue > 100) volumeValue = 100;
			volumeInput.value = volumeValue;

			// Set the player volume and save to Tampermonkey storage
			player.volume = volumeValue / 100;
			await GM.setValue('youtubeVolume', volumeValue);
			console.log(
				`Volume set to ${volumeValue} and saved to Tampermonkey storage.`,
			);

			// Sync YouTube's volume slider UI
			const volumeSlider = document.querySelector('.ytp-volume-slider-handle');
			if (volumeSlider) {
				volumeSlider.style.left = `${volumeValue}%`;
				console.log('YouTube volume slider updated.');
			}
		}
	}

	// Event listener for input change (manually changing the volume in the input box)
	volumeInput.addEventListener('input', () => setVolume(volumeInput.value));

	// Function to update the input field when YouTube's player volume is changed
	async function updateVolumeInput() {
		const player = document.querySelector('video');
		if (player) {
			const currentVolume = Math.round(player.volume * 100);
			volumeInput.value = currentVolume;
			await GM.setValue('youtubeVolume', currentVolume);
			console.log(
				`Volume input updated to ${currentVolume} from video player.`,
			);

			// Show 0 if the video is muted
			if (player.muted) {
				volumeInput.value = 0;
			}
		}
	}

	// Function to handle mute changes
	async function handleMuteChange() {
		const player = document.querySelector('video');
		if (player) {
			if (player.muted) {
				volumeInput.value = 0; // Show 0 when muted
			} else {
				volumeInput.value = previousVolume; // Restore previous volume when unmuted
				player.volume = previousVolume / 100; // Set the player volume back to previous
			}
			console.log(`Mute state changed: muted = ${player.muted}`);
		}
	}

	// Inject the input box into YouTube's control bar
	function injectVolumeControl() {
		const volumeSliderPanel = document.querySelector('.ytp-volume-panel');
		if (volumeSliderPanel) {
			volumeSliderPanel.parentNode.insertBefore(volumeInput, volumeSliderPanel);
			setVolume(previousVolume); // Set initial volume
			const player = document.querySelector('video');
			if (player) {
				player.addEventListener('volumechange', updateVolumeInput);
				player.addEventListener('mute', handleMuteChange);
				player.addEventListener('unmute', handleMuteChange);
				console.log('Volume input injected and event listeners attached.');
			}
		} else {
			console.log('Volume panel not found, retrying...');
			setTimeout(injectVolumeControl, 500);
		}
	}

	// Inject the volume control when the page is ready
	injectVolumeControl();
})();
