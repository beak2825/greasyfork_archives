// ==UserScript==
// @name         Clear Steam Wishlist
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes all games from steam wishlist
// @author       gortik
// @license      MIT
// @match        https://store.steampowered.com/wishlist/profiles/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steampowered.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488724/Clear%20Steam%20Wishlist.user.js
// @updateURL https://update.greasyfork.org/scripts/488724/Clear%20Steam%20Wishlist.meta.js
// ==/UserScript==

(function() {
    'use strict';
    addHTML();
    // Your code here...
})();

function addHTML() {
	let parentElem = document.querySelector( '.control_row' );
	parentElem.insertAdjacentHTML( 'beforeend', '<div class="filter_tab" id="clear_wishlist" style="margin-left: 15px;"><span>Clear</span></div>' );
	document.querySelector( '#clear_wishlist' ).addEventListener( 'click', clearWishlist );
}

// 1st remove wasnt detecting enter
async function pressEnter( ) {
	// create a new keyboard event and set the key to "Enter"
	const key_down = new KeyboardEvent( 'keydown', {
		key: 'Enter',
		code: 'Enter',
		which: 13,
		keyCode: 13,
	});

	const key_up = new KeyboardEvent( 'keyup', {
		key: 'Enter',
		code: 'Enter',
		which: 13,
		keyCode: 13,
	});

	// dispatch the event on some DOM element
	document.dispatchEvent( key_down );
	await sleep( 250 );
	document.dispatchEvent( key_up );
	await sleep( 250 );
}

async function confirmRemove() {
	if ( !document.querySelector('.newmodal') ) {
		console.log( 'Modal wasnt created.' );
		return;
	}
	document.querySelector('.newmodal .btn_green_steamui').click();
	await sleep( 500 );
}


function sleep( ms ) {
        return new Promise( resolve => {
		console.log( 'Sleep: ' + ms/1000 + 's.' );
		setTimeout( resolve, ms )
	});
}

async function clearWishlist() {
	let	games = document.querySelectorAll( '.delete' );

	for ( let remove_elem of games ) {
		remove_elem.click();
		await sleep( 1000 );
		// modal window with ok/cancel buttons
		if ( document.querySelector('.newmodal') )
			confirmRemove();
	}
}

addHTML()
