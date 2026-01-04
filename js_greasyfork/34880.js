// ==UserScript==
// @name        Neopets - Magma pool helper
// @namespace   https://greasyfork.org/en/users/58051-roblox
// @description Refreshes the page every five minutes until the guard is asleep, then prints the current time
// @include     http://www.neopets.com/magma/pool.phtml
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/34880/Neopets%20-%20Magma%20pool%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/34880/Neopets%20-%20Magma%20pool%20helper.meta.js
// ==/UserScript==

var time = document.getElementById("nst").textContent;
var pool = document.getElementById("poolOuter");
var text = pool.textContent.trim();

if (text.startsWith("I'm sorry, ")) {
	console.log("No");
	setTimeout(function() {
		location.reload(false);
	}, 5 * 60 * 1000);
} else {
	console.log("Success");
	document.title = time;
}

console.log(time);