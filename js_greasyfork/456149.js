// ==UserScript==
// @name         SteamGifts Simplify Holiday Event Boxes
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Replace every box with one image.
// @author       gortik
// @license      MIT
// @match        https://www.steamgifts.com/happy-holidays*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamgifts.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456149/SteamGifts%20Simplify%20Holiday%20Event%20Boxes.user.js
// @updateURL https://update.greasyfork.org/scripts/456149/SteamGifts%20Simplify%20Holiday%20Event%20Boxes.meta.js
// ==/UserScript==

(function() {
    'use strict';
    modifyBoxes();
    // Your code here...
})();

function getImageLink( element ) {
	const regexp = /https:\/\/i.imgur.com\/[\d\w]+\.\w{3}/g;
	const arr = [...element.innerHTML.matchAll( regexp )];
	let	imgLink;

	for (let i = 0; i < arr.length; i++) {
		imgLink = arr[0][0];
		if ( !imgLink.endsWith('gif') )
			break;
	}
	return imgLink;
}

function deleteChildren( element ) {
	const children = [ element.firstElementChild ];
	children.forEach( child => child.remove() );
}

function createImage( element, imgLink ) {
	const html = `<img src="${imgLink}" class="giveaway_box">`;
	element.insertAdjacentHTML('afterbegin', html);
}

function modifyBox( element ) {
	const imgLink = getImageLink( element );
	deleteChildren( element );
	createImage( element, imgLink );
}

function modifyBoxes() {
	const arr = document.querySelectorAll('.giveaway_box_container ');
	arr.forEach( box => modifyBox( box ) );
}
