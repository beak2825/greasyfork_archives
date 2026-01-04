// ==UserScript==
// @name         Simple Queue Low Time Alert
// @version      1.1
// @description  Alert if time is running out on HITs
// @author       slothbear
// @icon         http://i.imgur.com/yptTSAh.gif
// @include      https://worker.mturk.com/tasks*

// @namespace https://greasyfork.org/users/64880
// @downloadURL https://update.greasyfork.org/scripts/37877/Simple%20Queue%20Low%20Time%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/37877/Simple%20Queue%20Low%20Time%20Alert.meta.js
// ==/UserScript==


// This script watches the shortest timer in the queue
// and plays an audio alert if it falls under a certain
// number of minutes (default is 10).
//
// The script will reload the queue every 15 seconds while
// a timer is going off so it can reset and not be annoying.




//alert time in minutes
//set to 100 to test or debug
const WARNING_TIMER = 10;



function watchTimer(timer, audioElement) {
	var warningClock = 0;
	let originalTitle = document.title;

	setInterval(function(){
		let time = extractMinutesFromTime(timer.innerText);
		let visualTrigger = false;
		if (checkMinutesLeft(time)) {
			if (warningClock === 0) audioAlert(audioElement);
			if (warningClock === 14) window.location.reload();
			warningClock++;
			visualTrigger = true;
		} else {
			visualTrigger = false;
		}
		if (visualTrigger) visualAlert(warningClock, originalTitle);
	}, 1000);
}

function extractMinutesFromTime(time) {
	let length = time.length;
	let minutes;
	if (length > 5) minutes = 99; // this happens if over 1 hour left
	if (length === 5) minutes = time.substring(length-5,length-3);
	if (length < 5) minutes = time.substring(length-4,length-3);
	return minutes;
}

function visualAlert(count, originalTitle) {
	let firstRow = document.querySelector('li.table-row');
	if (count %2 === 0)	{
		document.title = "█████████████████████";
		firstRow.style.backgroundColor = "#D66462";
	} else {
		document.title = originalTitle;
		firstRow.style.backgroundColor = "#DCC784";
	}
}

function init_audio() {
	let audioElement = [];
	audioElement[0] = document.createElement('audio');
	audioElement[0].setAttribute('src', 'http://themushroomkingdom.net/sounds/wav/smb/smb_warning.wav');
	return audioElement;
}

function audioAlert(audioElement) {
	console.log("Tasks are about to expire. HURRY!");
	audioElement[0].play();
}

function grabFocus() {
	let quickFocus = window.open("https://www.chronicle.com/blogs/linguafranca/files/2017/11/Nothing-to-See-15a34a2fc727c8.jpg", "_blank");
	quickFocus.close();
}

function getTimer(pos) {
	return document.querySelectorAll('span.completion-timer')[pos];
}

function minutesToSeconds(minutes) {
	return minutes * 60;
}

function checkMinutesLeft(time) {
	return (time < WARNING_TIMER);
}



(function main() {

	//checks for a completion timer,
	//then stops if none found.
	let shortestTimer = getTimer(0);
	if (!shortestTimer) return false;

	//get the audio setup so the file is ready
	//and then start watching the shortest timer
	let audioElement = init_audio();
	watchTimer(shortestTimer, audioElement);

})();
