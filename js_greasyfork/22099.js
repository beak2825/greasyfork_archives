// ==UserScript==
// @name         Furvilla Post Normalizer
// @namespace    fortytwo
// @version      0.2
// @description  Removes post CSS.
// @author       fortytwo
// @match        http://www.furvilla.com/forums/thread/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22099/Furvilla%20Post%20Normalizer.user.js
// @updateURL https://update.greasyfork.org/scripts/22099/Furvilla%20Post%20Normalizer.meta.js
// ==/UserScript==

/***
	NOTICE: YOU ARE AGREEING THAT ANY USE OF THE FOLLOWING SCRIPT IS AT
	YOUR OWN RISK. I DO NOT MAKE ANY GUARANTEES THE SCRIPT WILL WORK, NOR 
	WILL I HOLD MYSELF ACCOUNTABLE FOR ANY DAMAGES TO YOUR DEVICE.
	
	WHILE THE SCRIPT IS UNLIKELY TO CAUSE ANY HARM, AS WITH ALL TECHNICAL
	COMPONENTS, BUGS AND GLITCHES CAN HAPPEN.
	
	Find me here:
		http://42-dragons.tumblr.com/
		http://www.furvilla.com/profile/34742
***/
(function() {
	'use strict';
    var posts = document.getElementsByClassName("thread-user-post-middle");

	for(var i = 0; i < posts.length; ++i){
		posts[i].setAttribute('style', "");
	}
})();