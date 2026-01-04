// ==UserScript==
// @name         Spotify Downloader - Download Spotify songs, playlists, and albums
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Downloads Spotify songs, playlists, and albums as MP3. Can also download full playlist or album as ZIP.
// @author       Zertalious (Zert)
// @match        *://open.spotify.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spotify.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446143/Spotify%20Downloader%20-%20Download%20Spotify%20songs%2C%20playlists%2C%20and%20albums.user.js
// @updateURL https://update.greasyfork.org/scripts/446143/Spotify%20Downloader%20-%20Download%20Spotify%20songs%2C%20playlists%2C%20and%20albums.meta.js
// ==/UserScript==

const style = document.createElement( 'style' );

style.innerText = `

[role='grid'] {
	margin-left: 50px;
}

[data-testid='tracklist-row'] {
	position: relative;
}

[role="presentation"] > * {
	contain: unset;
}

.btn {
	width: 40px;
	height: 40px;
	border-radius: 50%;
	border: 0;
	background-color: #1fdf64;
	background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path d="M17 12v5H3v-5H1v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5z"/><path d="M10 15l5-6h-4V1H9v8H5l5 6z"/></svg>');
	background-position: center;
	background-repeat: no-repeat;
	cursor: pointer;
}

.btn:hover {
	transform: scale(1.1);
}

[data-testid='tracklist-row'] .btn {
	position: absolute;
	top: 50%;
	right: 100%;
	margin-top: -20px;
	margin-right: 10px;
}

`;

document.body.appendChild( style );

function sleep( ms ) {

	return new Promise( resolve => setTimeout( resolve, 0 ) );

}

function animate() {

	const tracks = document.querySelectorAll( '[data-testid="tracklist-row"]' );

	for ( let i = 0; i < tracks.length; i ++ ) {

		const track = tracks[ i ];

		if ( ! track.hasButton ) {

			addButton( track ).onclick = async function () {

				const btn = track.querySelector( '[data-testid="more-button"]' );
				btn.click();

				await sleep( 1 );

				const highlight = document.querySelector( '#context-menu a[href*="highlight"]' ).href.match( /highlight=(.+)/ )[ 1 ];

				document.dispatchEvent( new MouseEvent( 'mousedown' ) );

				const url = 'https://open.' + highlight.replace( ':', '.com/' ).replace( ':', '/' );

				download( url );

			}

		}

	}

	const actionBarRow = document.querySelector( '[data-testid="action-bar-row"]:last-of-type' );

	if ( actionBarRow && ! actionBarRow.hasButton ) {

		addButton( actionBarRow ).onclick = function () {

			download( window.location.href );

		}

	}

}

function download( link ) {

	window.open( 'https://spotdownloader.com/?link=' + link, '_blank' );

}

function addButton( el ) {

	const button = document.createElement( 'button' );

	button.className = 'btn';

	el.appendChild( button );

	el.hasButton = true;

	return button;

}

setInterval( animate, 1000 );