// ==UserScript==
// @name        Tab De-Throttler
// @version     0.1.1
// @description Prevents the browser from throttling a tab by playing very quiet audio.
// @author      parseHex
// @namespace   https://greasyfork.org/users/8394
// @include     http*://worker.mturk.com/?filters[search_term]=pandacrazy=on*
// @include     http*://worker.mturk.com/requesters/PandaCrazy/projects*
// @include     http*://worker.mturk.com/?end_signin=1&filters%5Bsearch_term%5D=pandacrazy%3Don*
// @grant       unsafeWindow
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/37351/Tab%20De-Throttler.user.js
// @updateURL https://update.greasyfork.org/scripts/37351/Tab%20De-Throttler.meta.js
// ==/UserScript==

var audioFixStarted = false;

// set up and play a quiet low-frequency sound
// browsers won't throttle tabs playing audio
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function setupFixSound() {
	if (!audioCtx) {
		// last try wasn't successful, make a new audioCtx
		audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	}

	// don't need to run this more than once
	if (audioFixStarted) return;
	audioFixStarted = true;

	// this comes from the examples on https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API
	var oscillator = audioCtx.createOscillator();
	var gainNode = audioCtx.createGain();
	oscillator.connect(gainNode);
	gainNode.connect(audioCtx.destination);

	// could try other types besides sine wave
	// triangle sounds okay
	oscillator.type = 'sine';

	// this seems to be about the lowest volume before the browser ignores the sound
	// tested it by lowering and checking if the sound icon showed up on the tab
	gainNode.gain.setTargetAtTime(0.0004, audioCtx.currentTime, 0);

	// picked a low frequency to make it less noticeable
	// too low and i noticed some audio 'crackling'
	// with 100 there's a slight crackle when the sound starts but that's it
	oscillator.frequency.setTargetAtTime(30, audioCtx.currentTime + 0.5, 0.5);

	oscillator.start();

	removeListeners();
}

setTimeout(() => {
	if (audioCtx.state === 'running') {
		setupFixSound();
	} else {
		// have to wait for a user gesture to play sound
		audioCtx.close();
		audioCtx = null;
	}
}, 500);

// audioCtx is suspended; wait for an input event and try again
if (!audioFixStarted) {
	// starting in a later version of chrome, audio can't be played until the user interacts with the page
	// listen for a click or keypress and setup the sound then
	window.addEventListener('click', setupFixSound);
	window.addEventListener('keypress', setupFixSound);
}


function removeListeners() {
	window.removeEventListener('click', setupFixSound);
	window.removeEventListener('keypress', setupFixSound);
}

// setTimeout(function () {
// 	// if there hasn't been an input event yet, try setting up sound just in case
// 	try {
// 		setupFixSound();

// 		// remove the listeners if it setup
// 		removeListeners();
// 	} catch (e) {
// 		console.log('Couldn\'t setup de-throttler sound.');
// 		console.error(e);
// 	}
// }, 15000);
