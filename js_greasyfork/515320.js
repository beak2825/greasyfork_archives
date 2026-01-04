// ==UserScript==
// @name         Open DotA - Add Parse Button
// @match        https://www.opendota.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=opendota.com
// @grant        none
// @version      6
// @description  Adds parse button to each match row
// @namespace    OpenDotAParseScript
// @downloadURL https://update.greasyfork.org/scripts/515320/Open%20DotA%20-%20Add%20Parse%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/515320/Open%20DotA%20-%20Add%20Parse%20Button.meta.js
// ==/UserScript==

setInterval( function () {
	for ( const dateObj of document.querySelectorAll( 'div.sc-dxgOiQ.jehLtr[data-hint]' ) ) {
		dateObj.textContent = dateObj.dataset.hint;
	}

	if ( location.href.startsWith( 'https://www.opendota.com/players/' ) ) {
		for ( const game of document.querySelectorAll( 'table tr td:first-child a' ) ) {
			if ( game.href.search( /https:\/\/www.opendota.com\/matches\/\d+$/ ) == -1 ) continue
			const id = game.href.split( '/' )[ 4 ];
			if ( !game.parentNode.parentNode.querySelector( '#laning' ) ) {
				const href = `https://www.opendota.com/matches/${id}/laning`;
				const button = document.createElement( 'a' );
				button.id = 'laning'
				button.classList.add( 'directLink' );
				button.textContent = '[Laning]';
				button.href = href;
				game.parentNode.appendChild( button );
			}
		}

		for ( const game of document.querySelectorAll( 'tr .unparsed ~ .textContainer a[href*=matches]' ) ) {
			if ( game.parentNode.parentNode.querySelector( '#parse' ) ) continue;
			if ( game.href.search( /https:\/\/www.opendota.com\/matches\/\d+$/ ) == -1 ) continue
			const id = game.href.split( '/' )[ 4 ];
			const href = `https://www.opendota.com/request#${id}`;
			game.parentNode.parentNode.parentNode.firstElementChild.classList.remove( 'unparsed' );
			const button = document.createElement( 'button' );
			button.id = 'parse';
			button.classList.add( 'directLink' );
			button.textContent = '[PARSE]';
			button.addEventListener( 'click' , () => {
				const apiUrl = `https://api.opendota.com/api/request/${id}`;
				const data = {};

				const requestOptions = {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(data),
				};

				fetch(apiUrl, requestOptions).then(response => {
					if (!response.ok) {
						throw new Error('Network response was not ok');
					}
					button.textContent = '[REQUESTED]';
				} )
				.catch( error => {
					console.error('Error:', error);
				} );
			} )
			game.parentNode.appendChild( button );
		}
	}
} , 500 );