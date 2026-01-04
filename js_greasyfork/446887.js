
// ==UserScript==
// @name         Autokey helper script - nitro type bot
// @namespace   https://ginfio.com/giveaways
// @version      3
// @description This script is used for copying the text on nitrotype.com/race to the clipboard. It works in co-operation with the Autokey app. Autokey will then type the text which this script copied. It will do so for each race that you set it to do. Autokey will be found on my site ginfio.com/hacks/autokey. This script is NOT an auto typer by itself. It just copies the text for Autokey to type.
// @match      https://www.nitrotype.com/race/*
// @match https://www.nitrotype.com/race
// @license GNU Affero General Public License v3.0
// @downloadURL https://update.greasyfork.org/scripts/446887/Autokey%20helper%20script%20-%20nitro%20type%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/446887/Autokey%20helper%20script%20-%20nitro%20type%20bot.meta.js
// ==/UserScript==
 
 

 
function copyText(e) {
	navigator.clipboard.writeText(e)
}

function checkForRaceText() {
	let e = setInterval(function() {
		document.querySelector(".dash-copy") && (copyRaceText(), clearInterval(e))
	}, 1e3)
}

function reload_page() {
	window.location.reload()
}

function checkForDisqualified() {
	setInterval(function() {
		document.querySelector(".modal--raceError") && (copyText("Waiting for race to start..."), reload_page())
	}, 1e4)
}

function after_race() {
    // wait for race to start
	let e = setInterval(function() {
		document.querySelector(".raceResults") && (reload_page(), copyText("Waiting for race to start..."), clearInterval(e))
	}, Math.floor(1e3 * Math.random()))
}

function copyRaceText() {
	setTimeout(function() {
		copyText("start_typing|||" + document.querySelector(".dash-copy").textContent)
		// copy race text
	}, 1e3)
}

function checkForContinueButton() {
	setInterval(function() {
		btns = Array.from(document.querySelectorAll(".btn.btn--primary.btn--fw")), continue_btn = [], 0 < btns.length && (continue_btn = btns.filter(function(e) {
			return e.textContent.includes("ntinue")
		})), 0 < continue_btn.length ? window.location.reload() : console.log("did't find.")
	}, 1e4)
}

function refreshJustIncase() {
	setTimeout(function() {
		window.location.href = "https://www.nitrotype.com/race"
	}, 80000)
}
after_race(), checkForRaceText(), checkForDisqualified(), checkForContinueButton(), refreshJustIncase();