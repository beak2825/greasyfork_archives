// ==UserScript==
// @name         DigDig.IO Gold Bot
// @namespace    https://tampermonkey.net/
// @version      0.0.8
// @description  A simple bot that farms gold in digdig.io
// @author       Zertalious (Zert)
// @match        *://digdig.io/*
// @icon         https://www.google.com/s2/favicons?domain=digdig.io
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/432066/DigDigIO%20Gold%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/432066/DigDigIO%20Gold%20Bot.meta.js
// ==/UserScript==

let goldCount = 0;
let timeRan = 0;

let lastTime = 0;

const chunkSize = 64;
const goldPositions = [];

let isDead = false;
let isRunning = false;

let health = 0;

let border = null;

const chunks = [];

let serverIndex = 0;
const servers = [];

const modes = [ 'ffa', 'teams', 'maze' ];

let angle = Math.random() * Math.PI * 2;

init();

async function init() {

	for ( let i = 0; i < modes.length; i ++ ) {

		const response = await fetch( 'https://api.n.m28.io/endpoint/digdig-' + modes[ i ] + '/findEach' );

		const json = await response.json();

		for ( let key in json.servers ) {

			servers.push( json.servers[ key ].id );

		}

	}

	isRunning = true;

	window.addEventListener( 'keyup', function ( event ) {

		if ( String.fromCharCode( event.keyCode ) === 'B' ) {

			isRunning = ! isRunning;

			setTimeout( function () {

				setAttack( isRunning );

			}, 0 );

		}

	} );

}

window.requestAnimationFrame = new Proxy( window.requestAnimationFrame, {
	apply( target, thisArgs, args ) {

		if ( isRunning === true ) {

			args[ 0 ] = new Proxy( args[ 0 ], {
				apply( target, thisArgs, args ) {

					isDead = false;

					healthX.length = 0;
					health = 0;

					border = null;

					goldPositions.length = 0;

					Reflect.apply( ...arguments );

					const now = Date.now();

					if ( isRunning && lastTime > 0 ) {

						timeRan += now - lastTime;

					}

					lastTime = now;

					if ( isDead === true || health <= 0 ) {

						pressEnter();

						return;

					}

					setAttack( true );

					if ( goldPositions.length > 0 ) {

						let target;

						if ( border !== null ) {

							const [ bx, by, br ] = border;

							for ( let i = 0; i < goldPositions.length; i ++ ) {

								const [ x, y ] = goldPositions[ i ];

								if ( Math.hypot( x - bx, y - by ) < br ) {

									mouseMove( x, y );
									
									return;

								}

							}

						} else {

							mouseMove( 
								goldPositions[ 0 ][ 0 ], 
								goldPositions[ 0 ][ 1 ]
							);

							return;

						}
						

					}

					mouseMove( 
						( Math.cos( angle ) * 0.5 + 0.5 ) * window.innerWidth, 
						( Math.sin( angle ) * 0.5 + 0.5 ) * window.innerHeight 
					);

					if ( health <= 0.05 ) {

						angle = Math.random() * Math.PI * 2;

						serverIndex = ( serverIndex + 1 ) % servers.length;

						cp6.forceServerID( servers[ serverIndex ] );

						while ( chunks.length > 0 ) {

							chunks.shift().golds.length = 0;

						}

					}

				}
			} );

		}

		return Reflect.apply( ...arguments );

	}
} );

const Context = CanvasRenderingContext2D.prototype;

Context.arc = new Proxy( Context.arc, {
	apply( target, ctx, [ x, y, r ] ) {

		Reflect.apply( ...arguments );

		if ( isRunning && ctx.fillStyle === '#222222' && x !== 0 && y !== 0 ) {

			border = [ x, y, r ];

			ctx.save();

			ctx.translate( window.innerWidth / 2, 10 );

			ctx.font = 'bolder 30px Ubuntu';

			ctx.textAlign = 'center';
			ctx.textBaseline = 'top';

			const a = goldCount + ' gold found';

			ctx.lineWidth = 2;
			ctx.strokeStyle = '#000';

			ctx.strokeText( a, 0, 0 );

			ctx.fillStyle = '#fff';
			ctx.fillText( a, 0, 0 );

			const seconds = timeRan / 1000;
			const mins = Math.floor( seconds / 60 );

			const b ='in ' + ( mins > 0 ? mins + 'm ' : '' ) + ( seconds % 60 ).toFixed( 1 ) + 's';

			ctx.font = 'bolder 18px Ubuntu';

			ctx.strokeText( b, 0, 32 );
			ctx.fillText( b, 0, 32 );

			ctx.restore();

		}

	}
} );

Context.drawImage = new Proxy( Context.drawImage, {
	apply( target, thisArgs, [ { golds } ] ) {

		if ( golds !== undefined ) {

			const { a, d, e, f } = thisArgs.getTransform();

			for ( let i = 0; i < golds.length; i ++ ) {

				const [ m, n, ] = golds[ i ];

				goldPositions.push( [
					m / chunkSize * a + e, 
					n / chunkSize * d + f
				] );

				if ( ! golds[ i ].counted ) {

					goldCount ++;

					golds[ i ].counted = true;

				}

			}

		}

		return Reflect.apply( ...arguments );

	}
} );

const healthX = [];

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

OffscreenContext.drawImage = new Proxy( OffscreenContext.drawImage, {
	apply( target, thisArgs, [ { golds } ] ) {

		if ( golds !== undefined ) {

			console.log( 'here!' );

			thisArgs.canvas.golds = golds;

		}

		return Reflect.apply( ...arguments );

	}
} );

OffscreenContext.fillRect = new Proxy( OffscreenContext.fillRect, {
	apply( target, thisArgs, args ) {

		if ( thisArgs.fillStyle === '#000000' ) {

			isDead = true;

		}

		return Reflect.apply( ...arguments );

	}
} );

OffscreenContext.putImageData = new Proxy( OffscreenContext.putImageData, {
	apply( target, thisArgs, [ { data } ] ) {

		console.log( thisArgs.canvas );

		if ( thisArgs.canvas.width === chunkSize && thisArgs.canvas.height === chunkSize ) {

			thisArgs.canvas.golds = [];

			for ( let i = 0; i < data.length; i += 4 ) {

				if ( isGoldColor( data[ i ], data[ i + 1 ], data[ i + 2 ] ) ) {

					const index = i / 4;

					thisArgs.canvas.golds.push( [
						index % chunkSize, 
						Math.floor( index / chunkSize )
					] );

				}

			}

			chunks.push( thisArgs.canvas );

		}

		return Reflect.apply( ...arguments );

	}
} );

OffscreenContext.fillRect = new Proxy( OffscreenContext.fillRect, {
	apply( target, thisArgs, [ x, y, width, height ] ) {

		if ( thisArgs.canvas.width === chunkSize && thisArgs.canvas.height === chunkSize ) {

			if ( thisArgs.canvas.golds === undefined ) {

				thisArgs.canvas.golds = [];

			}

			if ( isGoldColor( thisArgs.fillStyle ) ) {

				thisArgs.canvas.golds.push( [ x, y ] );

			}

		}

		return Reflect.apply( ...arguments );

	} 
} );

OffscreenContext.clearRect = new Proxy( OffscreenContext.clearRect, {
	apply( target, thisArgs, [ x, y, width, height ] ) {

		if ( thisArgs.canvas.golds !== undefined ) {

			if ( width === chunkSize && height === chunkSize ) {

				thisArgs.canvas.golds.length = 0;

			} else {

				for ( let i = 0; i < thisArgs.canvas.golds.length; i ++ ) {

					const [ m, n ] = thisArgs.canvas.golds[ i ];

					if ( m === x && n === y ) {

						thisArgs.canvas.golds.splice( i, 1 );
						break;

					}

				}

			}
			
		}

		return Reflect.apply( ...arguments );

	} 
} );

function isGoldColor( r, g, b ) {

	if ( arguments.length === 1 ) {

		g = parseInt( r.substring( 3, 5 ), 16 );
		b = parseInt( r.substring( 5, 7 ), 16 );
		r = parseInt( r.substring( 1, 3 ), 16 );

	}

	return Math.hypot( 0xa5 - r, 0x9e - g, 0x15 - b ) < 25;

}

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