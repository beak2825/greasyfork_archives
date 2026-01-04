// ==UserScript==
// @name         YouTube TV Volume Rememberer
// @namespace    typpi.online
// @supportURL   https://github.com/Nick2bad4u/UserStyles/issues
// @version      1.17
// @description  Remembers and controls volume levels on YouTube TV with keyboard shortcuts
// @author       Nick2bad4u
// @match        *://tv.youtube.com/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tv.youtube.com
// @license      UnLicense
// @tag          youtube
// @downloadURL https://update.greasyfork.org/scripts/513618/YouTube%20TV%20Volume%20Rememberer.user.js
// @updateURL https://update.greasyfork.org/scripts/513618/YouTube%20TV%20Volume%20Rememberer.meta.js
// ==/UserScript==

(() => {
	'use strict';

	const VOLUME_KEY = 'youtubeTVVolume';
	const DEFAULT_VOLUME = 100;

	const setVolume = (value) => {
		const slider = document.querySelector(
			'tp-yt-paper-slider[role="slider"].ytu-volume-slider',
		);
		if (slider) {
			console.log(`Setting volume to: ${value}`);
			slider.value = value;
			slider.setAttribute('value', value);
			slider.dispatchEvent(
				new Event('input', {
					bubbles: true,
				}),
			);
			slider.dispatchEvent(
				new Event('change', {
					bubbles: true,
				}),
			);
		} else {
			console.error('Volume slider not found');
		}
	};

	const loadSavedVolume = () => {
		const savedVolume = localStorage.getItem(VOLUME_KEY);
		console.log(`Saved volume found: ${savedVolume}`);
		if (savedVolume) {
			setVolume(parseFloat(savedVolume));
		} else {
			console.log('No saved volume found, defaulting to 100');
			setVolume(DEFAULT_VOLUME);
		}
	};

	const tryLoadVolume = () => {
		const slider = document.querySelector(
			'tp-yt-paper-slider[role="slider"].ytu-volume-slider',
		);
		if (slider) {
			loadSavedVolume();
		} else {
			console.error('Volume slider not found, retrying in 3 seconds');
			setTimeout(tryLoadVolume, 3000);
		}
	};

	const observeSliderChanges = () => {
		const slider = document.querySelector(
			'tp-yt-paper-slider[role="slider"].ytu-volume-slider',
		);
		if (slider) {
			console.log('Observing the volume slider for changes');
			const observer = new MutationObserver(() => {
				const currentValue = slider.value;
				console.log(`Current volume changed to: ${currentValue}`);
				localStorage.setItem(VOLUME_KEY, currentValue);
				if (currentValue === '100') {
					const savedVolume = localStorage.getItem(VOLUME_KEY);
					if (savedVolume) {
						console.log(`Resetting volume to saved value: ${savedVolume}`);
						setVolume(parseFloat(savedVolume));
					}
				}
			});
			observer.observe(slider, {
				attributes: true,
			});
		} else {
			console.error('Volume slider not found during initialization');
			setTimeout(observeSliderChanges, 1000);
		}
	};

	const monitorVolume = () => {
		const slider = document.querySelector(
			'tp-yt-paper-slider[role="slider"].ytu-volume-slider',
		);
		if (slider) {
			const currentValue = slider.value;
			const savedVolume = localStorage.getItem(VOLUME_KEY);
			if (currentValue === '100' && savedVolume) {
				console.log(
					`Monitoring: Resetting volume to saved value: ${savedVolume}`,
				);
				setVolume(parseFloat(savedVolume));
			}
		}
	};

	globalThis.addEventListener('load', () => {
		console.log('YouTube TV Volume Rememberer script loaded');
		setTimeout(() => {
			tryLoadVolume();
			observeSliderChanges();
			setInterval(monitorVolume, 1000);
		}, 1000);
	});

	globalThis.addEventListener('keydown', (event) => {
		const slider = document.querySelector(
			'tp-yt-paper-slider[role="slider"].ytu-volume-slider',
		);
		if (!slider) return;

		// Check if either Shift key is pressed
		const isShiftPressed = event.shiftKey;

		if (isShiftPressed && event.key === 'ArrowUp') {
			const newValue = Math.min(parseFloat(slider.value) + 5, 100);
			setVolume(newValue);
		} else if (isShiftPressed && event.key === 'ArrowDown') {
			const newValue = Math.max(parseFloat(slider.value) - 5, 0);
			setVolume(newValue);
		}
	});
})();
