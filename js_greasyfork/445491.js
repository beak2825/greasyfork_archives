// ==UserScript==
// @name         dazn, media controls
// @description  allows forward/backwards with arrow keys and pause with space
// @version      1.1
// @author       Tobias L
// @include      *.dazn.com/*
// @license      GPL-3.0-only
// @namespace    https://github.com/WhiteG00se/User-Scripts
// @downloadURL https://update.greasyfork.org/scripts/445491/dazn%2C%20media%20controls.user.js
// @updateURL https://update.greasyfork.org/scripts/445491/dazn%2C%20media%20controls.meta.js
// ==/UserScript==
// goes well with this steam controller profile:
// steam://controllerconfig/413080/2807431315

function backward() {
	let button = document.querySelector('[data-test-id="PLAYER_BUTTON_REWIND"]')
	if (button == null)
		button = document.querySelector('[data-test-id="PLAYER_BUTTON_REWIND PLAYER_BUTTON_REWIND_VISIBLE"]')
	button.click()
}
function forward() {
	let button = document.querySelector('[data-test-id="PLAYER_BUTTON_FAST_FORWARD"]')
	if (button == null)
		button = document.querySelector('[data-test-id="PLAYER_BUTTON_FAST_FORWARD PLAYER_BUTTON_FAST_FORWARD_VISIBLE"]')
	button.click()
}
function pause() {
	let button = document.querySelector('[data-test-id="PLAYER_BUTTON_PAUSE"]')
	if (button == null) 
		button = document.querySelector('[data-test-id="PLAYER_BUTTON_PAUSE PLAYER_BUTTON_PAUSE_VISIBLE"]')
	if (button == null) 
		button = document.querySelector('[data-test-id="PLAYER_BUTTON_PLAY"]')
	if (button == null) 
		button = document.querySelector('[data-test-id="PLAYER_BUTTON_PLAY PLAYER_BUTTON_PLAY_VISIBLE"]')

	button.click()
}

document.body.addEventListener("keydown", function (e) {
	if (e.key === "ArrowLeft") {
		e.preventDefault()
		backward()
	}
	if (e.key === "ArrowRight") {
		e.preventDefault()
		forward()
	}
	if (e.key === " ") {
		e.preventDefault()
		pause()
	}
})
