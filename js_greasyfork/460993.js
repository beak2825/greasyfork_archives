// ==UserScript==
// @name     Transcending Obscurity Needs To Sell You Booty Shorts Bro
// @version  1.1
// @description hides merch on Transcending Obscurity bandcamp pages
// @grant    none
// @include https://*.bandcamp.com/*
// @namespace https://greasyfork.org/users/708837
// @downloadURL https://update.greasyfork.org/scripts/460993/Transcending%20Obscurity%20Needs%20To%20Sell%20You%20Booty%20Shorts%20Bro.user.js
// @updateURL https://update.greasyfork.org/scripts/460993/Transcending%20Obscurity%20Needs%20To%20Sell%20You%20Booty%20Shorts%20Bro.meta.js
// ==/UserScript==

//determine whether we're on a transcending obscurity pages

obscurity = window.find("Transcending Obscurity");
//console.log(obscurity);

if (obscurity) {

	//find instances of swag being hocked

	var merchElements = document.getElementsByClassName('buyItem package');
	if (merchElements.length) {
		//console.log("MERCH ELEMTS GET");
		//console.log(merchElements);
		
		for (let i = 0; i < merchElements.length; i++) {
			//console.log(merchElements.item(i));
			merchElements.item(i).innerHTML = '';
		}
	}
}