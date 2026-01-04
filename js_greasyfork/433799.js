// ==UserScript==
// @name         Join Data Copier
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       Enderspearl184
// @match        https://*.brick-hill.com/play/*
// @grant        none
// @description    fart
// @downloadURL https://update.greasyfork.org/scripts/433799/Join%20Data%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/433799/Join%20Data%20Copier.meta.js
// ==/UserScript==
function main() {
	const placeData = {
		ip: window.BH.apps.PlayButton.$children[0].ip,
		port: window.BH.apps.PlayButton.$children[0].port,
		id: window.BH.apps.PlayButton.$children[0].set_id,
		play: window.BH.apps.PlayButton.$children[0].play,
	}

	// The game is not currently active
	if (!placeData.play) return

	// Inject buttons
	const buttonDiv = document.querySelector('div#playbutton-v')
	const brickPlayerButton = document.createElement('button')
	const buttonContent = document.createTextNode('Copy Join Data')

	brickPlayerButton.appendChild(buttonContent)
	brickPlayerButton.classList.add('blue', 'mb2')
	buttonDiv.appendChild(brickPlayerButton)

	// Handle launch
	function brickPlayerConnect() {
		console.log('Launching game...')
		fetch('https://api.brick-hill.com/v1/auth/generateToken?set='+placeData.id, {
			credentials: 'include'
		})
			.then((res => res.json()))
			.then((data) => {
				const token = data.token
				navigator.clipboard.writeText(`{"token":"${token}","id":"${placeData.id}","port":"${placeData.port}","ip":"${placeData.ip}"}`)
			})
	}

	brickPlayerButton.onclick = brickPlayerConnect
}

function inject(source) {
	const script = document.createElement('script')
	script.text = `(${source})()`
	document.documentElement.appendChild(script)
}

(function() {
    'use strict';
    	const target = document.querySelector('div#playbutton-v')
	// Button already exists
	if (target) {
		console.log('Target already exists')
		return inject(main)
	}

	// Wait for the play button to be added to the dom
	const observer = new MutationObserver(() => {
		if (document.contains(document.querySelector('div#playbutton-v'))) {
			observer.disconnect()
			return inject(main)
		}
	})

	observer.observe(document, {
		childList: true,
		subtree: true,
	})
})();