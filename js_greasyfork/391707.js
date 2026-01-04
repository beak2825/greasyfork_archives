// ==UserScript==
// @name            jetsetradio.live pause & seek
// @description     Adds a pause button, pauses on spacebar input, seeks on L/R arrow keys
// @include         https://jetsetradio.live/
// @icon            https://jetsetradio.live/media/icons/favicon.ico
// @namespace       https://whompingwalr.us/
// @version         1.0
// @run-at          document-idle
// @downloadURL https://update.greasyfork.org/scripts/391707/jetsetradiolive%20pause%20%20seek.user.js
// @updateURL https://update.greasyfork.org/scripts/391707/jetsetradiolive%20pause%20%20seek.meta.js
// ==/UserScript==

// Configuration:
var seekWithArrowKeys = true;
var numOfSecondsToSeek = 3;
var displayPauseButton = true;
var pauseOnSpace = true;


// Enable left/right keys to seek 5s backward/forward in time (anywhere but textareas and input fields)
if (seekWithArrowKeys) {
	var body = document.querySelector("body");
	body.addEventListener("keydown",function(e){
		var isInput = ~["TEXTAREA", "INPUT"].indexOf(e.target.tagName);
		// left
		if(e.keyCode == 37 && !isInput){
			var audioElement = document.getElementById('audioPlayer');
			audioElement.currentTime = audioElement.currentTime-numOfSecondsToSeek;
		}
		// up
//		if(e.keyCode === 38 && !isInput){
//		}
		// right
		if(e.keyCode == 39 && !isInput){
			var audioElement = document.getElementById('audioPlayer');
			audioElement.currentTime = audioElement.currentTime+numOfSecondsToSeek;
		}
		// down
//		if(e.keyCode === 40 && !isInput){
//		}
	});
}

// Add pause button
if (displayPauseButton) {
	// Initialize pause button
	var pauseButton = document.createElement('SPAN');
	pauseButton.id = 'hackedInPauseButton';
	pauseButton.innerText = '⏸';
	pauseButton.style.color = '#ffffff';
	pauseButton.style.fontSize = '25pt';
	pauseButton.style.position = 'absolute';
	pauseButton.style.top = '-40px';
	pauseButton.style.right = '0.1vw';
	pauseButton.style.zIndex = '301';
	pauseButton.style.pointerEvents = 'all';
	pauseButton.onclick = togglePause;
	// Attach the pause button
	document.getElementById('information').insertBefore(pauseButton, document.getElementById('nextTrackButton'));
}

// Pause on spacebar input (anywhere but textareas and input fields)
if (pauseOnSpace) {
	var body = document.querySelector("body");
	body.addEventListener("keydown",function(e){
		var isInput = ~["TEXTAREA", "INPUT"].indexOf(e.target.tagName);
		if(e.key === " " && !isInput)
			togglePause();
	});
}
	
// Pause or play, depending on program state 
function togglePause() {
	var audioElement = document.getElementById('audioPlayer');
	var pauseButton = document.getElementById('hackedInPauseButton');
	if (audioElement.paused === true) {
		audioElement.play();
		pauseButton.innerText = '⏸';
	}
	else {
		audioElement.pause();
		pauseButton.innerText = '▶';
	} 
}
