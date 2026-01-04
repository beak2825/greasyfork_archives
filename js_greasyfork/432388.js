// ==UserScript==
// @name         DigDig.IO All Kirk
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Makes all skins in digdig.io a progeny of kirk.
// @author       Zertalious (Zert)
// @match        *://digdig.io/*
// @icon         https://www.google.com/s2/favicons?domain=digdig.io
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432388/DigDigIO%20All%20Kirk.user.js
// @updateURL https://update.greasyfork.org/scripts/432388/DigDigIO%20All%20Kirk.meta.js
// ==/UserScript==

const scale = 0.5;

let stateId = 0;
let faceStateId = - 1;

let x, y;

const array = [ CanvasRenderingContext2D.prototype ];

if ( typeof OffscreenCanvasRenderingContext2D !== 'undefined' ) {

	array.push( OffscreenCanvasRenderingContext2D.prototype );

}

for ( let i = 0; i < array.length; i ++ ) {

	const CTX = array[ i ];

	CTX.arc = new Proxy( CTX.arc, {
		apply( target, thisArgs, args ) {

			Reflect.apply( ...arguments );

			if ( args[ 2 ] === 25 ) {

				const { a, b, c, d, e, f } = thisArgs.getTransform();

				x = e;
				y = f;

				thisArgs.setTransform( 
					a * scale, 
					b * scale, 
					c * scale, 
					d * scale, 
					e, 
					f
				);

				faceStateId = stateId;

			}

		}
	} );

	CTX.save = new Proxy( CTX.save, {
		apply( target, thisArgs, args ) {

			stateId ++;

			return Reflect.apply( ...arguments );

		}
	} );

	CTX.restore = new Proxy( CTX.restore, {
		apply( target, thisArgs, args ) {

			if ( stateId === faceStateId ) {

				faceStateId = - 1;

			}

			stateId --;

			return Reflect.apply( ...arguments );

		}
	} );

	CTX.setTransform = new Proxy( CTX.setTransform, {
		apply( target, thisArgs, args ) {

			if ( faceStateId > - 1 ) {

				args[ 0 ] *= scale;
				args[ 1 ] *= scale;
				args[ 2 ] *= scale;
				args[ 3 ] *= scale;
				args[ 4 ] = x + ( args[ 4 ] - x ) * scale;
				args[ 5 ] = y + ( args[ 5 ] - y ) * scale;

			}

			return Reflect.apply( ...arguments );

		}
	} );

}