// ==UserScript==
// @name         Neopets - Auto PIN filler
// @namespace    np
// @version      0.1
// @description  Supports multiple accounts!
// @author       none
// @match        http://www.neopets.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410613/Neopets%20-%20Auto%20PIN%20filler.user.js
// @updateURL https://update.greasyfork.org/scripts/410613/Neopets%20-%20Auto%20PIN%20filler.meta.js
// ==/UserScript==

var accounts = [
//-------------------------------------------
// Fill in your username and PIN number here!
	// USERNAME    PIN
	["username1", "1111"],
	["username2", "2222"],
	["username3", "3333"],
	["username4", "4444"],
	["username5", "5555"]
];
//--------------------------------------------

var d = document;

if (d.getElementById("pin_field")) {
	var username = d.getElementById("header").querySelector("a[href*='/userlookup']").innerHTML;
	for (var i = 0; i < accounts.length; i++) {
		if (accounts[i][0] === username) {
			d.getElementById("pin_field").value = accounts[i][1];
			break;
		}
	}
}