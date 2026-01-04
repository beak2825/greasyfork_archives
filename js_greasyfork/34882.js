// ==UserScript==
// @name         Netflix - Hide skip buttons and post-play
// @namespace    https://zornco.com/
// @version      1.0.0
// @description  This script removes interruptions from playback so that you can watch from beginning to end (including credits) without things like the "SKIP INTRO" button, the post-play screen, or the "WATCH CREDITS"/"NEXT EPISODE IN X" buttons
// @author       SystemDisc
// @match        http*://*.netflix.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34882/Netflix%20-%20Hide%20skip%20buttons%20and%20post-play.user.js
// @updateURL https://update.greasyfork.org/scripts/34882/Netflix%20-%20Hide%20skip%20buttons%20and%20post-play.meta.js
// ==/UserScript==

let headElem = document.querySelector('head');
let styleElem = document.createElement('style');
styleElem.type = 'text/css';
styleElem.textContent = `
	.skip-credits,
	[aria-label="Watch credits"],
	[aria-label^="Next episode in"] {
		/*display: none !important;*/
	}
	.NFPlayer.postplay {
		top: 0 !important;
		left: 0 !important;
		right: 0 !important;
		bottom: 0 !important;
		width: 100% !important;
		height: 100% !important;
		border: none !important;
		outline: none !important;
	}
`;
headElem.appendChild(styleElem);

let playerElem;
let getPlayer = function() {
	playerElem = document.querySelector('.NFPlayer');
	if (!playerElem) {
		requestAnimationFrame(getPlayer);
	}
};

let controlsElem;
let getControls = function() {
	controlsElem = document.querySelector('.controls');
	if (!controlsElem) {
		requestAnimationFrame(getControls);
	}
};

let watchUntilEnd = function() {
	if (controlsElem) {
		let creditsButtonContainer = controlsElem.querySelector('.PlayerControls--container > .main-hitzone-element-container > .SeamlessControls--container');
		if (creditsButtonContainer) {
			let creditsButton = creditsButtonContainer.querySelector('[aria-label="Watch credits"]');
			if (creditsButton && creditsButtonContainer.classList.contains('SeamlessControls--container-visible')) {
				console.log('click');
				creditsButton.click();
			}
		}
		else if (playerElem.classList.contains('postplay')) {
			playerElem.click();
		}
	}
	setTimeout(getPlayer);
	setTimeout(getControls);
	setTimeout(watchUntilEnd, 1000);
};
watchUntilEnd();

let toggleControls = function() {
	controlsElem = document.querySelector('.controls');
	if (controlsElem) {
		if (controlsElem.style.display !== 'none') {
			controlsElem.style.display = 'none';
		}
		else if (controlsElem.style.display === 'none') {
			controlsElem.style.display = null;
		}
	}
	else {
		requestAnimationFrame(toggleControls);
	}
};

document.addEventListener('keyup', function(e) {
	if (
		e.ctrlKey &&
		e.shiftKey &&
		e.altKey &&
		e.keyCode === 67
	) {
		toggleControls();
	}
}, false);