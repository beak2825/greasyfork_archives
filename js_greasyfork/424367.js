// ==UserScript==
// @name         AO3 Profile Fandom Hider
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Hides fandoms you don't want to see in your description. Type in your username/fandom to use
// @author       exuvia
// @match        https://archiveofourown.org/users/*
// @icon         http://archiveofourown.org/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424367/AO3%20Profile%20Fandom%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/424367/AO3%20Profile%20Fandom%20Hider.meta.js
// ==/UserScript==

(function() {

	//test on https://archiveofourown.org/users/astolat/ to see what this will look like

	let username = "astolat" // replace this username with your own
	let fandomname = "Supernatural" // replace this with the fandom you don't want

    if (window.location.href.includes("https://archiveofourown.org/users/" + username)){ //check if your username
		let fandoms = Array.from(document.getElementById("user-fandoms").getElementsByTagName("a"))
		fandoms.forEach(fandom => {
			if (fandom.innerText === fandomname) {	//iterate through and check if fandom name; if true, hide fandom
				fandom.parentElement.hidden = true
			}
		})
	}

})();