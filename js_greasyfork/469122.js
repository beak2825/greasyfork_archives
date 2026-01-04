// ==UserScript==
// @name Metal Pipe Typing Sound
// @namespace http://tampermonkey.net/
// @version 0.1
// @description Play a metal pipe sound when you type on any website
// @match *://*/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/469122/Metal%20Pipe%20Typing%20Sound.user.js
// @updateURL https://update.greasyfork.org/scripts/469122/Metal%20Pipe%20Typing%20Sound.meta.js
// ==/UserScript==
(function() {
 'use strict';
 // Load the metal pipe sound from a URL
 var sound = new Audio("https://freesound.org/data/previews/60/60087_703779-lq.mp3");
 // Add an event listener to the document for keypress events
 document.addEventListener("keypress", function(e) {
 // Play the sound whenever a key is pressed
 sound.play();
 });
})();
