// ==UserScript==
// @name         Surviv.IO Aimbot, ESP & X-Ray
// @namespace    https://greasyfork.org/en/users/662330-zertalious
// @version      0.0.4
// @description  Aimbot and ESP for surviv.io. Locks the aim to the nearest player and shows lines between nearby players. Removes ceilings from buildings and let's you see inside them too.
// @author       Zertalious (Zert)
// @match        *://survev.io/*
// @match        *://expandedwater.online/*
// @match        *://2dbattleroyale.com/*
// @match        *://2dbattleroyale.org/*
// @match        *://piearesquared.info/*
// @match        *://thecircleisclosing.com/*
// @match        *://archimedesofsyracuse.info/*
// @match        *://secantsecant.com/*
// @match        *://parmainitiative.com/*
// @match        *://nevelskoygroup.com/*
// @match        *://kugahi.com/*
// @match        *://chandlertallowmd.com/*
// @match        *://ot38.club/*
// @match        *://kugaheavyindustry.com/*
// @match        *://drchandlertallow.com/*
// @match        *://rarepotato.com/*
// @icon         https://www.google.com/s2/favicons?domain=surviv.io
// @grant        none
// @run-at       document-start
// @antifeature  ads
// @downloadURL https://update.greasyfork.org/scripts/518972/SurvivIO%20Aimbot%2C%20ESP%20%20X-Ray.user.js
// @updateURL https://update.greasyfork.org/scripts/518972/SurvivIO%20Aimbot%2C%20ESP%20%20X-Ray.meta.js
// ==/UserScript==
 
let espEnabled = true;
let aimbotEnabled = true;
let xrayEnabled = true;
 
Object.defineProperty( Object.prototype, 'textureCacheIds', {
	set( value ) {
 
		this._textureCacheIds = value;
 
		if ( Array.isArray( value ) ) {
 
			const scope = this;
 
			value.push = new Proxy( value.push, {
				apply( target, thisArgs, args ) {
 
					if ( args[ 0 ].indexOf( 'ceiling' ) > - 1 ) {
 
						Object.defineProperty( scope, 'valid', {
							set( value ) {
 
								this._valid = value;
 
							},
							get() {
 
								return xrayEnabled ? false : this._valid;
 
							}
						} );
 
					}
 
					return Reflect.apply( ...arguments );
 
				}
			} );
 
		}
 
	},
	get() {
 
		return this._textureCacheIds;
 
	}
} );
 
const params = {
	get() {
 
		console.log( 'getting ctx', this );
 
		return null;
 
	}
};
 
Object.defineProperty( window, 'WebGLRenderingContext', params );
Object.defineProperty( window, 'WebGL2RenderingContext', params );
 
let ctx;
 
HTMLCanvasElement.prototype.getContext = new Proxy( HTMLCanvasElement.prototype.getContext, {
	apply( target, thisArgs, args ) {
 
		const result = Reflect.apply( ...arguments );
 
		if ( thisArgs.parentNode ) {
 
			ctx = result;
 
		}
 
		return result;
 
	}
} );
 
const players = [];
 
let radius;
 
let mouseX = 0, mouseY = 0;
 
window.addEventListener( 'mousemove', function ( event ) {
 
	if ( event.dispatchedByMe !== true ) {
 
		mouseX = event.clientX;
		mouseY = event.clientY;
 
	}
 
} );
 
window.addEventListener( 'keyup', function ( event ) {
 
	switch ( String.fromCharCode( event.keyCode ) ) {
 
		case 'N' : espEnabled = ! espEnabled; break;
		case 'B' : aimbotEnabled = ! aimbotEnabled; break;
		case 'H' : xrayEnabled = ! xrayEnabled; break;
 
	}
 
} );
 
const Context2D = CanvasRenderingContext2D.prototype;
 
Context2D.drawImage = new Proxy( Context2D.drawImage, {
	apply( target, thisArgs, args ) {
 
		if ( aimbotEnabled && args[ 0 ].src && args[ 0 ].src.indexOf( 'loadout' ) > - 1 && args[ 8 ] === 142 ) {
 
			const { a, b, e, f } = thisArgs.getTransform();
 
			radius = Math.hypot( a, b ) * args[ 8 ] + 10;
 
			const centerX = thisArgs.canvas.width / 2;
			const centerY = thisArgs.canvas.height / 2;
 
			if ( e !== centerX && f !== centerY ) {
 
				players.push( { x: e, y: f } );
 
			}
 
		}
 
		return Reflect.apply( ...arguments );
 
	}
} );
 
window.requestAnimationFrame = new Proxy( window.requestAnimationFrame, {
	apply( target, thisArgs, args ) {
 
		args[ 0 ] = new Proxy( args[ 0 ], {
			apply( target, thisArgs, args ) {
 
				players.length = 0;
 
				Reflect.apply( ...arguments );
 
				ctx.fillStyle = '#fff';
 
				const array = [
					[ '[B] Aimbot', aimbotEnabled ],
					[ '[N] ESP', espEnabled ],
					[ '[H] X-Ray', xrayEnabled ]
				];
 
				const fontSize = 20;
 
				ctx.textAlign = 'center';
				ctx.textBaseline = 'top';
 
				ctx.font = 'bolder ' + fontSize + 'px monospace';
 
				for ( let i = 0; i < array.length; i ++ ) {
 
					const [ text, status ] = array[ i ];
 
					ctx.globalAlpha = status ? 1 : 0.5;
 
					ctx.fillText( text + ': ' + ( status ? 'ON' : 'OFF' ), ctx.canvas.width / 2, 10 + i * fontSize );
 
				}
 
				ctx.globalAlpha = 1;
 
				if ( players.length === 0 ) {
 
					return;
 
				}
 
				ctx.lineWidth = 5;
				ctx.strokeStyle = 'red';
 
				if ( espEnabled ) {
 
					const centerX = ctx.canvas.width / 2;
					const centerY = ctx.canvas.height / 2;
 
					ctx.beginPath();
 
					for ( let i = 0; i < players.length; i ++ ) {
 
						const player = players[ i ];
 
						ctx.moveTo( centerX, centerY );
 
						ctx.lineTo( player.x, player.y );
 
					}
 
					ctx.stroke();
 
				}
 
				if ( aimbotEnabled ) {
 
					let minDistance = Infinity;
					let targetPlayer;
 
					for ( let i = 0; i < players.length; i ++ ) {
 
						const player = players[ i ];
 
						const distance = Math.hypot( player.x - mouseX, player.y - mouseY );
 
						if ( distance < minDistance ) {
 
							minDistance = distance;
							targetPlayer = player;
 
						}
 
					}
 
					ctx.beginPath();
 
					ctx.arc( targetPlayer.x, targetPlayer.y, radius, 0, Math.PI * 2 );
 
					ctx.stroke();
 
					window.dispatchEvent( new MouseEvent( 'mousemove', {
						clientX: targetPlayer.x,
						clientY: targetPlayer.y,
						dispatchedByMe: true
					} ) );
 
				}
 
			}
		} );
 
		return Reflect.apply( ...arguments );
 
	}
} );
 
window.addEventListener( 'DOMContentLoaded', function () {
 
	const value = parseInt( new URLSearchParams( window.location.search ).get( 'showAd' ), 16 );
 
	const shouldShowAd = isNaN( value ) || Date.now() - value < 0 || Date.now() - value > 10 * 60 * 1000;
 
	const el = document.createElement( 'div' );
 
	el.innerHTML = `<style>
 
	.my-dialog {
		position: absolute;
		left: 50%;
		top: 50%;
		padding: 20px;
		background: rgba(0, 0, 0, 0.9);
		box-shadow: 0 0 0 1000vw rgba(0, 0, 0, 0.5);
		border-radius: 5px;
		color: #fff;
		transform: translate(-50%, -50%);
		text-align: center;
		z-index: 999999;
	}
 
	.my-dialog * {
		color: #fff;
	}
 
	.my-close {
		position: absolute;
		right: 5px;
		top: 5px;
		width: 20px;
		height: 20px;
		opacity: 0.5;
		cursor: pointer;
	}
 
	.my-close:before, .my-close:after {
		content: ' ';
		position: absolute;
		left: 50%;
		top: 50%;
		width: 100%;
		height: 20%;
		transform: translate(-50%, -50%) rotate(-45deg);
		background: #fff;
	}
 
	.my-close:after {
		transform: translate(-50%, -50%) rotate(45deg);
	}
 
	.my-close:hover {
		opacity: 1;
	}
 
	</style>
	<div class="my-dialog">${shouldShowAd ? `<big>Loading ad...</big>` : `<div class="my-close" onclick="this.parentNode.style.display='none';"></div>
		<big style="font-size: 2em;">Aimbot, ESP & X-Ray</big>
		<br>
		<br>
		[B] to toggle aimbot
		<br>
		[H] to toggle x-ray
		<br>
		[N] to toggle esp
		<br>
		<br>
		By Zertalious
		<br>
		<br>
		<div class="btn-purple btn-darken menu-option" style="position: unset !important;" onclick="window.open('https://discord.gg/K24Zxy88VM')">Discord</div>
		<div class="btn-orange btn-darken menu-option" onclick="window.open('https://www.instagram.com/zertalious/', '_blank')">Instagram</div>
		<div class="btn-blue btn-darken menu-option" onclick="window.open('https://twitter.com/Zertalious', '_blank')">Twitter</div>
		<div class="btn-green btn-darken menu-option" onclick="window.open('https://greasyfork.org/en/users/662330-zertalious', '_blank')">More scripts</div>
		` }
	</div>`;
 
	while ( el.children.length > 0 ) {
 
		document.body.appendChild( el.children[ 0 ] );
 
	}
 
	if ( shouldShowAd ) {
 
		const url = new URL( window.location.href );
 
		url.searchParams.set( 'showAd', Date.now().toString( 16 ) );
 
		window.location.href = 'https://zertalious.xyz?ref=' + new TextEncoder().encode( url.href ).toString();
 
	}
 
} );