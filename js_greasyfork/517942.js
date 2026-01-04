// ==UserScript==
// @name         Kick Volume Wheel Control
// @namespace    https://github.com/pabli24
// @version      1.0.2
// @description  Use the mouse wheel to adjust the volume. Middle-click to mute or unmute the player. Volume slider always visible.
// @author       Pabli
// @license      MIT
// @match        https://kick.com/*
// @icon         data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmVyc2lvbj0iMS4wIiB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDc1IDc1Ij4NCjxwYXRoIGQ9Ik0zOS4zODksMTMuNzY5IEwyMi4yMzUsMjguNjA2IEw2LDI4LjYwNiBMNiw0Ny42OTkgTDIxLjk4OSw0Ny42OTkgTDM5LjM4OSw2Mi43NSBMMzkuMzg5LDEzLjc2OXoiIHN0eWxlPSJzdHJva2U6IzUzZmMxODtzdHJva2Utd2lkdGg6NTtzdHJva2UtbGluZWpvaW46cm91bmQ7ZmlsbDojNTNmYzE4OyIvPg0KPHBhdGggZD0iTTQ4LDI3LjZhMTkuNSwxOS41IDAgMCAxIDAsMjEuNE01NS4xLDIwLjVhMzAsMzAgMCAwIDEgMCwzNS42TTYxLjYsMTRhMzguOCwzOC44IDAgMCAxIDAsNDguNiIgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6IzUzZmMxODtzdHJva2Utd2lkdGg6NTtzdHJva2UtbGluZWNhcDpyb3VuZCIvPg0KPC9zdmc+
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517942/Kick%20Volume%20Wheel%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/517942/Kick%20Volume%20Wheel%20Control.meta.js
// ==/UserScript==

(function() {
	"use strict";

const CONFIG = {
	VOLUME_STEP: 1,
	SHOW_CONTROLS_ON_SCROLL: true,
	SLIDER_ALWAYS_VISIBLE: true,
	HIDE_CURSOR_DELAY: 4000
};

function setCookie(name, value, days) {
	const date = new Date();
	date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
	document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
}

function prevent(e) {
	e.preventDefault();
	e.stopPropagation();
	e.stopImmediatePropagation();
}

const observer = new MutationObserver(mutations => {
	const video = document.getElementById("video-player");
	if (!video) return;
	wheel(video);
});
observer.observe(document.body, { childList: true, subtree: true });

function wheel(video) {
	const videoDiv = document.querySelector("#injected-embedded-channel-player-video > div");
	if (videoDiv.hasAttribute("kpvolume")) return;
	videoDiv.setAttribute("kpvolume", "");

	videoDiv.addEventListener("wheel", (event) => {
		prevent(event);
		
		if (CONFIG.SHOW_CONTROLS_ON_SCROLL === true) {
			const showEvent = new Event('mousemove');
			videoDiv.dispatchEvent(showEvent);
		}
		
		if (video.muted && videoDiv.getAttribute("kpvolume")) {
			video.muted = false;
			setTimeout(() => {
				video.volume = videoDiv.getAttribute("kpvolume");
				slider();
			}, 50)
		} else if (event.deltaY < 0) {
			video.volume = Math.min(1, video.volume + (CONFIG.VOLUME_STEP / 100)); // Increase volume
		} else if (event.deltaY > 0) {
			video.volume = Math.max(0, video.volume - (CONFIG.VOLUME_STEP / 100)); // Decrease volume
		}

		setTimeout(slider, 50);
		setTimeout(() => setCookie("volume", video.volume, 365), 3000);
	});
	
	let hideCursorTimeout;
	videoDiv.addEventListener("mousemove", (event) => {
		setTimeout(() => {
			muteBtn();
			slider();
		}, 50)
		setTimeout(() => setCookie("volume", video.volume, 365), 3000);
		
		if (videoDiv.contains(event.target)) {
			videoDiv.style.cursor = 'default';
			if (hideCursorTimeout) clearTimeout(hideCursorTimeout);
			
			hideCursorTimeout = setTimeout(() => {
				videoDiv.style.cursor = 'none';
			}, CONFIG.HIDE_CURSOR_DELAY);
		}
	});
	videoDiv.addEventListener("mouseenter", (event) => {
		setTimeout(() => setCookie("volume", video.volume, 365), 100);
	});

	function slider() {
		const controls = videoDiv.querySelector('div > div.z-controls');
		if (!controls) return;
		const sliderFill = controls.querySelector('span[style*="right:"]'); // style="left: 0%; right: 40%;"

		const videoVolume = Math.round(video.volume * 100);
		sliderFill.style.right = `${100 - videoVolume}%`;

		const sliderThumb = controls.querySelector('span[style*="transform: var(--radix-slider-thumb-transform)"]'); // left: calc(40% + 1.6px);
		const offset = 8 + (videoVolume / 100) * -16;
		sliderThumb.style.left = `calc(${videoVolume}% + ${offset}px)`;

		const sliderValuenow = controls.querySelector('span[aria-valuenow]'); // aria-valuenow="40"
		sliderValuenow.setAttribute("aria-valuenow", videoVolume);

		const sliderP = controls.querySelector('.group\\/volume .betterhover\\:group-hover\\/volume\\:flex');
		sliderP.setAttribute("playervolume", videoVolume + "%");
	}

	function muteBtn() {
		const muteButton = document.querySelector('#injected-embedded-channel-player-video > div > div.z-controls .group\\/volume > button');
		if (!muteButton) return;
		muteButton.addEventListener("click", (event) => {
			prevent(event);
			mute();
		});
	}
	function mute() {
		if (video.muted) {
			video.muted = false;
			setTimeout(() => {
				video.volume = videoDiv.getAttribute("kpvolume");
				slider();
			}, 50)
		} else {
			videoDiv.setAttribute("kpvolume", video.volume);
			video.muted = true;
		}
	}
	videoDiv.addEventListener("mousedown", ({ button }) => {
		if (event.button === 1) {
			prevent(event);
			mute();
		}
	});
	document.addEventListener("keydown", (event) => {
		if ((event.key === 'M' || event.key === 'm') && event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA' && event.target.isContentEditable !== true) {
			prevent(event);
			mute();
		}
	});
}

let styles = `
#injected-embedded-channel-player-video > div > div.z-controls .group\\/volume .betterhover\\:group-hover\\/volume\\:flex::after {
	content: attr(playervolume);
	font-weight: 600;
	font-size: .875rem;
	line-height: 1.25rem;
	margin-left: .5rem;
	width: 4ch;
}`
if (CONFIG.SLIDER_ALWAYS_VISIBLE === true) {
	styles += `
#injected-embedded-channel-player-video > div > div.z-controls .group\\/volume .betterhover\\:group-hover\\/volume\\:flex {
	display: flex;
	align-items: center;
}`
}
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

})();