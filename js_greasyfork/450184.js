// ==UserScript==
// @name         chess.com, wasd controls
// @description  allows user to go back and forth using the keys a and d, w and s are commented out
// @version      1.2
// @author       Tobias L
// @include      *.chess.com/*
// @license      GPL-3.0-only
// @namespace    https://github.com/WhiteG00se/User-Scripts
// @downloadURL https://update.greasyfork.org/scripts/450184/chesscom%2C%20wasd%20controls.user.js
// @updateURL https://update.greasyfork.org/scripts/450184/chesscom%2C%20wasd%20controls.meta.js
// ==/UserScript==

function simulateKeyPress(key) {
	let keyPress = new KeyboardEvent('keydown', {
		key: key,
		code: key,
		bubbles: true,
		cancelable: true,
		view: window,
	})
	document.dispatchEvent(keyPress)
}

document.body.addEventListener('keydown', function (event) {
	switch (event.key) {
		// case 'w':
		// 	simulateKeyPress('ArrowUp')
		// 	break
		case 'a':
			simulateKeyPress('ArrowLeft')
			break
		// case 's':
		// 	simulateKeyPress('ArrowDown')
		// 	break
		case 'd':
			simulateKeyPress('ArrowRight')
			break
	}
})