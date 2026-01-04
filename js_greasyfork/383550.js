// ==UserScript==
// @name SvPO audio snelheid
// @namespace http://www.jaron.nl/
// @description Voegt knop toe voor vertragen audio
// @match           http://ib3.nl/*
// @match           https://ib3.nl/*
// @match           http://www.ib3.nl/*
// @match           https://www.ib3.nl/*
// @version 0.0.2
// @downloadURL https://update.greasyfork.org/scripts/383550/SvPO%20audio%20snelheid.user.js
// @updateURL https://update.greasyfork.org/scripts/383550/SvPO%20audio%20snelheid.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

(function() {
const css = `
	body {
		font-family: arial, helvetica, sans-serif;
	}

	button {
		width: 1.4em;
		height: 1.4em;
		font-size: 1.25rem;
	}

	.speed-controls {
		padding: 1em 2em;
	}

	.current-speed {
		display: inline-block;
		width: 1.6em;
		text-align: right;
	}
`;

const audioElm = document.querySelector('audio');
let playbackRate;
const step = 0.1;
const minRate = 0.5;
const maxRate = 1.0;
let currRateElm;
	

/**
* add css styles
* @returns {undefined}
*/
const addStyles = function() {
	const styles = document.createElement('style');
	styles.innerHTML = css;
	document.querySelector('head').appendChild(styles);
};


/**
* change the speed
* @returns {undefined}
*/
const changeSpeed = function(stp) {
	const newPlaybackRate = playbackRate + stp;
	if (newPlaybackRate >= minRate && newPlaybackRate <= maxRate) {
		playbackRate = newPlaybackRate;
		// audioElm.playbackRate = newPlaybackRate;// does not work; using query selector here does
		document.querySelector('audio').playbackRate = playbackRate;
		currRateElm.textContent = Math.round(10*playbackRate)/10;
	}
};



/**
* voeg button voor sneller en langzamer toe
* @returns {undefined}
*/
const addButtons = function() {
	playbackRate = audioElm.playbackRate;
	const controlElm = `
		<div class="speed-controls">
			snelheid: <span id="current-speed" class="current-speed"></span>&times;
			<button id="speed-down" class="speed-down">-</button>
			<button id="speed-up" class="speed-up">+</button>
		</div>`
	document.body.innerHTML += controlElm;

	currRateElm = document.getElementById(`current-speed`);
	const downButton = document.getElementById(`speed-down`);
	const upButton = document.getElementById(`speed-up`);

	downButton.addEventListener('click', () => changeSpeed(-step));
	upButton.addEventListener('click', () => changeSpeed(step));

	changeSpeed(0);

};


/**
* initialiseer alles
* @returns {undefined}
*/
const init = function() {
	if (audioElm) {
		addStyles();
		addButtons();
	}
};


init();

})();