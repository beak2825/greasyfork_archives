// ==UserScript==
// @name         Fix Window Height of USA Today Games
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Prevents the top and bottom of the embedded game windows (iframes) on USA Today's site from being cut off as they currently are.
// @author       Koolstr
// @match        https://games.usatoday.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=usatoday.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495005/Fix%20Window%20Height%20of%20USA%20Today%20Games.user.js
// @updateURL https://update.greasyfork.org/scripts/495005/Fix%20Window%20Height%20of%20USA%20Today%20Games.meta.js
// ==/UserScript==


//Overrides game's iframe height to always be at its max.
(function() {
  'use strict';
	window.addEventListener('load', () => { //Not using window.onload since that doesn't trigger when navigating history with browser's Back/Forward buttons.
		console.log("Overriding game's iframe height.")
		//Using guesstimate timeout since window completes its load event before iframe finishes loading in as well, and this override only works after iframe completes its initial load.
		//Height needs to be set this way as raw style instead of height attribute since some of the games have their forced height values hardcoded as style overrides themselves, which can only be overriden the same way.
		setTimeout(() => document.querySelector('div#game-canvas > iframe')?.setAttribute('style', 'height: 100%'), 8000)
	})
})();
