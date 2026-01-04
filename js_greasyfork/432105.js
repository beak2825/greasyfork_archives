// ==UserScript==
// @name         DigDig.IO Tag Bot
// @namespace    https://tampermonkey.net/
// @version      0.0.1
// @description  A simple bot that tags people in digdig.io
// @author       Zertalious (Zert)
// @match        *://digdig.io/*
// @icon         https://www.google.com/s2/favicons?domain=digdig.io
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/432105/DigDigIO%20Tag%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/432105/DigDigIO%20Tag%20Bot.meta.js
// ==/UserScript==

let inDeathScreen = false;

let health = 0;
const healthX = [];

let border = null;

let waitingText;
let isWaiting = false;
	
let seekerText, hiderText;
let isSeeker = false;

const hiders = [];

let angle = 0;
let lastTime = 0;
let canBoost = true;

let isRunning = true;

Object.defineProperty( window, 'localStorage', {
	value: new Proxy( window.localStorage, {
		get( target, prop, receiver ) {

			if ( prop === 'digdig_gamemode' ) {

				return '2';

			}

			return Reflect.get( ...arguments );

		}
	} )
} );

window.requestAnimationFrame = new Proxy( window.requestAnimationFrame, {
	apply( target, thisArgs, args ) {

		if ( isRunning === true ) {

			args[ 0 ] = new Proxy( args[ 0 ], {
				apply( target, thisArgs, args ) {

					inDeathScreen = false;
					health = 0;

					isWaiting = false;

					hiders.length = 0;

					healthX.length = 0;
					health = 0;

					border = null;

					Reflect.apply( ...arguments );

					if ( inDeathScreen === true || health <= 0 ) {

						pressEnter();

						console.log( 'spam enter' );

						return;

					}

					if ( isWaiting === true ) {

						return;

					}

					if ( isSeeker === false ) {

						cp6.disconnect();

						return;

					}

					if ( health <= 0.05 ) {

						canBoost = false;

						setAttack( false );

					} else if ( health > 0.15 ) {

						canBoost = true;

					}

					if ( hiders.length > 0 ) {

						const [ x, y ] = hiders[ 0 ];

						setAttack( canBoost );

						angle = Math.atan2( y - window.innerHeight / 2, x - window.innerWidth / 2 );

						mouseMove( x, y );

						lastTime = Date.now() + 5000;

						return;

					}

					setAttack( false );

					const now = Date.now();

					if ( now - lastTime > 1000 ) {

						angle += ( Math.random() * 2 - 1 ) * Math.PI / 4;

						lastTime = now;

					}

					if ( border !== null ) {

						const x = border[ 0 ] - window.innerWidth / 2;
						const y = border[ 1 ] - window.innerHeight / 2;

						if ( Math.hypot( x, y ) > border[ 2 ] - 500 ) {

							angle = Math.atan2( y, x );

						}

					}

					mouseMove( 
						( Math.cos( angle ) * 0.5 + 0.5 ) * window.innerWidth, 
						( Math.sin( angle ) * 0.5 + 0.5 ) * window.innerHeight 
					);

				}
			} );

		}

		return Reflect.apply( ...arguments );

	}
} );

const Context = CanvasRenderingContext2D.prototype;

Context.arc = new Proxy( Context.arc, {
	apply( target, thisArgs, [ x, y, r ] ) {

		if ( r === 25 ) {

			if ( thisArgs.fillStyle === '#6096b5' ) {

				const { e, f } = thisArgs.getTransform();

				if ( Math.hypot( e - window.innerWidth, f - window.innerHeight ) > 10 ) {

					hiders.push( [ e, f ] );

				}

			}

		} else if ( thisArgs.fillStyle === '#222222' && x !== 0 && y !== 0 ) {

			border = [ x, y, r ];

		}

		return Reflect.apply( ...arguments );

	}
} );

const params = {
	apply( target, thisArgs, [ x ] ) {

		healthX[ target.name === 'moveTo' ? 0 : 1 ] = x;

		return Reflect.apply( ...arguments );

	}
};

Context.moveTo = new Proxy( Context.moveTo, params );
Context.lineTo = new Proxy( Context.lineTo, params );

Context.stroke = new Proxy( Context.stroke, {
	apply( target, thisArgs, args ) {

		if ( thisArgs.strokeStyle === '#75dd34' ) {

			health = ( healthX[ 0 ] - healthX[ 1 ] ) / ( 2 * healthX[ 0 ] );

		}

		return Reflect.apply( ...arguments );

	}
} );

const OffscreenContext = typeof OffscreenCanvasRenderingContext2D !== 'undefined' ? 
	OffscreenCanvasRenderingContext2D.prototype : Context;

OffscreenContext.fillRect = new Proxy( OffscreenContext.fillRect, {
	apply( target, thisArgs, args ) {

		if ( thisArgs.fillStyle === '#000000' ) {

			inDeathScreen = true;

		}

		return Reflect.apply( ...arguments );

	}
} );

OffscreenContext.fillText = new Proxy( OffscreenContext.fillText, {
	apply( target, { canvas }, [ text ] ) {

		if ( text.indexOf( 'Starting in' ) > - 1 && text.indexOf( 'Waiting for' ) > - 1 ) {

			waitingText = canvas;

		} else if ( text.indexOf( 'You are a seeker' ) > - 1 ) {

			seekerText = canvas;

		} else if ( text.indexOf( 'You are a hider' ) > - 1 ) {

			hiderText = canvas;

		}

		return Reflect.apply( ...arguments );

	}
} );

OffscreenContext.drawImage = new Proxy( OffscreenContext.drawImage, {
	apply( target, thisArgs, [ image ] ) {

		switch ( image ) {

			case waitingText : isWaiting = true; break;
			case seekerText : isSeeker = true; break;
			case hiderText : isSeeker = false; break;

		}

		return Reflect.apply( ...arguments );

	}
} );

function pressEnter() {

	keyEvent( 'keydown', 13 );
	keyEvent( 'keyup', 13 );

}

function setAttack( bool ) {

	keyEvent( bool !== false ? 'keydown' : 'keyup', 32 );

}

function setHeal( bool ) {

	keyEvent( bool !== false ? 'keydown' : 'keyup', 16 );

}

function keyEvent( type, keyCode ) {

	window.dispatchEvent( new KeyboardEvent( type, { keyCode } ) );

}

function mouseMove( clientX, clientY ) {

	window.Module.canvas.dispatchEvent(
		new MouseEvent( 'mousemove', { 
			clientX, 
			clientY 
		} )
	);

}