// ==UserScript==
// @name        Roblox devforum link tracking disabler
// @namespace   https://greasyfork.org/en/users/58051-roblox
// @description Prevents clicked links being tracked
// @include     https://devforum.roblox.com/t/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/34879/Roblox%20devforum%20link%20tracking%20disabler.user.js
// @updateURL https://update.greasyfork.org/scripts/34879/Roblox%20devforum%20link%20tracking%20disabler.meta.js
// ==/UserScript==

function run() {
	var elements = document.querySelectorAll(".post-stream .contents a");
	
	for (var i = 0; i < elements.length; i++) {
		var v = elements[i];
		v.classList.add("no-track-link");
	}
}

setTimeout(run, 500);

// Just in case
setTimeout(run, 1500);
