// ==UserScript==
// @name         Adjust video audio
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Adjust the audio of any video on any site
// @author       CoilBlimp
// @match        *://*/*
// @grant        none
// @exclude      https://www.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/409924/Adjust%20video%20audio.user.js
// @updateURL https://update.greasyfork.org/scripts/409924/Adjust%20video%20audio.meta.js
// ==/UserScript==

(function() {
    'use strict';
	const cookieName = "AudioAdjust_hueUkeLIZfdSz674qTym";
	let videoElements = [];
	let cookie = getCookie(cookieName);
	let volumeValue = 10;
	let sliderMade = false;

	// Initial check
	searchAndExcecute();

	// Add a listener that checks for new video elements
	window.addEventListener('DOMSubtreeModified', function(sliderMade) {
		searchAndExcecute();
	}, false);

	// Main script
	function searchAndExcecute(){
		videoElements = getVideoElements();
		if(videoElements.length > 0){
			if(cookie !== null){
				volumeValue = cookie;
			}
			if(!sliderMade){
				sliderMade = true;
				updateVolume(videoElements, volumeValue);
				createSlider();
				console.log("Initial volume: " + volumeValue)
			}
		}
	}

	// Event when the slider is moved
	function sliderChange(event){
		let value = event.target.value;
		let videoElements = getVideoElements();
		updateVolume(videoElements, value);
		document.getElementById("volumeAdjusterValue").innerHTML = value;
	}
	// Gets all video elements
	function getVideoElements(){
		return document.getElementsByTagName('video');
	}
	// Updates the volume of all video elements with the given value
	function updateVolume(videoElements, value){
		console.log("Updating volume of all video elements to " + value)
		for(let i = 0; i < videoElements.length; i++){
			videoElements[i].volume = (value/100);
		}
		setCookie(cookieName, value, 365)
	}

	// Creates the slider used to change volume
	function createSlider(){
		let volumeAdjusterSlider = Object.assign(document.createElement("input"), {
			type: "range",
			min: "0",
			max: "100",
			value: volumeValue
		});
		volumeAdjusterSlider.style.cssText = "border:0;margin:0;float:right";
		volumeAdjusterSlider.addEventListener("input", sliderChange);

		let volumeAdjusterValue = Object.assign(document.createElement("div"), {id: "volumeAdjusterValue"});
		volumeAdjusterValue.style.cssText = "float:left;width:3em";
		volumeAdjusterValue.innerHTML = volumeValue;

		let volumeAdjusterDiv = Object.assign(document.createElement("div"));
		volumeAdjusterDiv.style.cssText = "position:fixed;top:0;right:0;border:0;margin:0;opacity:0.7;z-index:10000000000";
		volumeAdjusterDiv.appendChild(volumeAdjusterValue);
		volumeAdjusterDiv.appendChild(volumeAdjusterSlider);
		console.log("creating slider")
		document.body.appendChild(volumeAdjusterDiv);
	}

	// Set a cookie to remember the volume for the specific site
	function setCookie(name,value,days) {
		var expires = "";
		if (days) {
			var date = new Date();
			date.setDate(date.getDate() + days);
			expires = "; expires=" + date.toUTCString();
		}
		document.cookie = name + "=" + (value || "") + expires + "; path=/";
	}
	// Get the cookie for the site
	function getCookie(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	}
})();