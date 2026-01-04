// ==UserScript==
// @name         theCrag - Display crag coordinates
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Displays crag coordinates as link, click copies them to clipboard
// @author       You
// @match        https://www.thecrag.com/es/escalar/*
// @match        https://www.thecrag.com/climbing/*
// @icon         https://www.google.com/s2/favicons?domain=thecrag.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431674/theCrag%20-%20Display%20crag%20coordinates.user.js
// @updateURL https://update.greasyfork.org/scripts/431674/theCrag%20-%20Display%20crag%20coordinates.meta.js
// ==/UserScript==

function copyStringToClipboard(str) {
	// Create new element
	var el = document.createElement('textarea')
	// Set value (string to be copied)
	el.value = str
	// Set non-editable to avoid focus and move outside of view
	el.setAttribute('readonly', '')
	el.style = { position: 'absolute', left: '-9999px' }
	document.body.appendChild(el)
	// Select text inside element
	el.select()
	// Copy text to clipboard
	document.execCommand('copy')
	// Remove temporary element
	document.body.removeChild(el)
}

console.log('theCrag - Display crag coordinates')

// Find Google Maps link
let elements = document.querySelectorAll(
	"a[href^='https://www.google.com/maps/dir/']"
)
if (elements !== null) {
	const regex = /-?\d+\.\d+,-?\d+\.\d+/ // this should match GPS coordinates of type "38.694833,-9.446831"
	for (var i = 0; i < elements.length; i++) {
		// Extract coordinates and identify parent
		const href = elements[i].href
		const foundCoordinates = href.match(regex)[0]
		const paragraph = elements[i].parentElement

		// Append coordinates as clickable link
		const a = document.createElement('a')
		const coordinatesText = document.createTextNode(foundCoordinates)
		a.appendChild(coordinatesText)
		a.href = 'javascript:void(0)'
		a.onclick = function () {
			copyStringToClipboard(foundCoordinates)
		}
		paragraph.appendChild(a)
	}
}
