// ==UserScript==
// @name         DigDig.IO Temporary Account
// @namespace    http://tampermonkey.net/
// @version      0.0.6
// @description  Creates a temporary account whenever you join the game. Good for using cheats and not get banned.
// @author       Zertalious (Zert)
// @match        *://digdig.io/*
// @icon         https://www.google.com/s2/favicons?domain=digdig.io
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432324/DigDigIO%20Temporary%20Account.user.js
// @updateURL https://update.greasyfork.org/scripts/432324/DigDigIO%20Temporary%20Account.meta.js
// ==/UserScript==

const style = document.createElement( 'style' );

style.textContent = `

span {
	position: absolute;
	bottom: 10px;
	left: 50%;
	transform: translate(-50%, 0);
	color: #fff;
	font-family: Ubuntu;
	z-index: 999;
	cursor: pointer;
	padding: 4px 8px;
	text-shadow: 1px 0 #000, -1px 0 #000, 0 1px #000, 0 -1px #000, 1px 1px #000, -1px -1px #000;
}

span:active {
	background: rgba(0, 0, 0, 0.25);
}

`;


const span = document.createElement( 'span' );

span.style.display = 'none';

span.textContent = 'waiting for account...';

span.onclick = function () {

	navigator.clipboard.writeText( span.textContent );

}

window.addEventListener( 'DOMContentLoaded', function () {

    document.body.appendChild( style );

    document.body.appendChild( span );

}, false );

window.addEventListener( 'keyup', function ( event ) {

	if ( String.fromCharCode( event.keyCode ) === 'Z' ) {

		span.style.display = span.style.display === '' ? 'none' : '';

	}

} );

Object.defineProperty( window, 'localStorage', {
	value: new Proxy( window.localStorage, {
		get( target, prop, receiver ) {

			if ( prop === 'cp6_player_id' ) {

				return '';

			}

			return Reflect.get( ...arguments );

		},
		set( target, prop, value, receiver ) {

			if ( prop === 'cp6_player_id' ) {

				span.textContent = value;

				return;

			}

			return Reflect.set( ...arguments );

		}
	} )
} );