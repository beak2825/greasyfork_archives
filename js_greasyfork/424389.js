// ==UserScript==
// @name        Text-to-speech for artofchording.com
// @match       https://www.artofchording.com/*
// @grant       none
// @version     1.1
// @author      Rebane
// @description Script that reads selected text on artofchording.com (change @match to make it work for other sites).
// @namespace https://greasyfork.org/users/447264
// @downloadURL https://update.greasyfork.org/scripts/424389/Text-to-speech%20for%20artofchordingcom.user.js
// @updateURL https://update.greasyfork.org/scripts/424389/Text-to-speech%20for%20artofchordingcom.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

// Initiate speechSynthesis
var synth = window.speechSynthesis;
var voices = [];

// Load and log voices when ready
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = () => {
  	voices = synth.getVoices();
	console.log(voices);
  };
}

// Choose your voice id here if you wish to change it
var selectedVoice = 0;

// When more than one character is selected on mouseup, speak the selection
window.addEventListener('mouseup', function(event){
  if (window.getSelection) {  // all browsers, except IE before version 9
    let text = window.getSelection().toString();
    if (text.length > 1 && text.length < 30){
      // Uncomment to log selected text
      //console.log(text);
      let utterThis = new SpeechSynthesisUtterance(text);
      utterThis.voice = voices[selectedVoice];
      synth.speak(utterThis);
    }
  } 
})