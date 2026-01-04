// ==UserScript==
// @name         Paper.IO Skins & Zoom Hack
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Get all skins and ability to zoom in paper.io
// @author       Zertalious (Zert)
// @match        *://paper-io.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=paper.io
// @grant        none
// @antifeature  ads
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/444987/PaperIO%20Skins%20%20Zoom%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/444987/PaperIO%20Skins%20%20Zoom%20Hack.meta.js
// ==/UserScript==

Object.defineProperty( window, 'shop', {
	get() {

		return this._shop;

	},
	set( shop ) {

		console.log( 'SHOP!!', shop );

		Object.defineProperty( shop, 'btnsData', {
			set( btnsData ) {

				for ( let i = 0; i < btnsData.length; i ++ ) {

					Object.defineProperty( btnsData[ i ], 'status', {
						get() {

							if ( this._status === 'locked' ) {

								return 'open';

							}

							return this._status;

						},
						set( value ) {

							this._status = value;

						}
					} );

				}

				console.log( 'btnsData!!!', btnsData );

				this._btnsData = btnsData;

			},
			get() {

				return this._btnsData;

			}
		} )

		this._shop = shop;

	}
} );

Object.defineProperty( window, 'checkShouldUnlockSkin', {
	get() {

		return function () { return true; }

	}
} );

let scale = 1;

window.addEventListener( 'DOMContentLoaded', function () {

	const value = parseInt( new URLSearchParams( window.location.search ).get( 'showAd' ), 16 );

	const shouldShowAd = isNaN( value ) || Date.now() - value < 0 || Date.now() - value > 10 * 60 * 1000;

	const el = document.createElement( 'div' );

	el.innerHTML = `<style>

	.dialog {
		position: absolute;
		left: 50%;
		top: 50%;
		padding: 20px;
		background: rgba(0, 0, 0, 0.8);
		border: 6px solid rgba(0, 0, 0, 0.2);
		color: #fff;
		transform: translate(-50%, -50%);
		text-align: center;
		z-index: 999999;
	}

	.dialog * {
		color: #fff;
	}

	.dialog-close {
		position: absolute;
		right: 5px;
		top: 5px;
		width: 20px;
		height: 20px;
		opacity: 0.5;
		cursor: pointer;
	}

	.dialog-close:before, .dialog-close:after {
		content: ' ';
		position: absolute;
		left: 50%;
		top: 50%;
		width: 100%;
		height: 20%;
		transform: translate(-50%, -50%) rotate(-45deg);
		background: #fff;
	}

	.dialog-close:after {
		transform: translate(-50%, -50%) rotate(45deg);
	}

	.dialog-close:hover {
		opacity: 1;
	}

	.btn {
		cursor: pointer;
		padding: 0.4em;
		background: red;
		border-bottom: 5px solid rgba(0, 0, 0, 0.2);
	}

	.btn:active {
		transform: scale(0.8);
	}

	</style>
	<div class="dialog">${shouldShowAd ? `<big>Loading ad...</big>` : `<div class="dialog-close" onclick="this.parentNode.style.display='none';"></div>
		<big>Skins & Zoom Cheat</big>
		<br>
		Use the shop to equip any skin you like.
		<br>
		Scroll to zoom.
		<br>
		<br>
		By Zertalious
		<br>
		<br>
		<div style="display: grid; grid-template-columns: 1fr 1fr; grid-gap: 5px;">
			<div class="btn" onclick="window.open('https://discord.gg/K24Zxy88VM', '_blank')">Discord</div>
			<div class="btn" onclick="window.open('https://www.instagram.com/zertalious/', '_blank')">Instagram</div>
			<div class="btn" onclick="window.open('https://twitter.com/Zertalious', '_blank')">Twitter</div>
			<div class="btn" onclick="window.open('https://greasyfork.org/en/users/662330-zertalious', '_blank')">More scripts</div>
		</div>
		` }
	</div>`;

	while ( el.children.length > 0 ) {

		document.body.appendChild( el.children[ 0 ] );

	}

	if ( shouldShowAd ) {

		const url = new URL( window.location.href );

		url.searchParams.set( 'showAd', Date.now().toString( 16 ) );
		url.searchParams.set( 'scriptVersion', GM.info.script.version );

		window.location.href = 'https://zertalious.xyz?ref=' + new TextEncoder().encode( url.href ).toString();

	}

	const zoomEl = document.getElementById( 'the_game' );
	zoomEl.style.transformOrigin = '0 0';

	document.addEventListener( 'wheel', function ( event ) {

		scale *= event.deltaY > 0 ? 0.9 : 1.1;

		zoomEl.style.transform = 'scale(' + scale + ')';

		zoomEl.style.width = window.innerWidth / scale + 'px';
		zoomEl.style.height = window.innerHeight / scale + 'px';

	} );

} );

CanvasRenderingContext2D.prototype.clearRect = new Proxy( CanvasRenderingContext2D.prototype.clearRect, {
	apply( target, thisArgs, args ) {

		Reflect.apply( ...arguments );

		if ( args[ 2 ] === window.innerWidth && args[ 3 ] === window.innerHeight ) {

			thisArgs.restore();

			thisArgs.save();

			const f = ( 0.5 - scale * 0.5 );

			thisArgs.translate( window.innerWidth * f, window.innerHeight * f );

			thisArgs.scale( scale, scale );

		}

	}
} );