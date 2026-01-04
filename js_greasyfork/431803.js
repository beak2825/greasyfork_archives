// ==UserScript==
// @name         DigDig.IO Minimap
// @namespace    http://tampermonkey.net/
// @version      0.0.5
// @description  Minimap for digdig.io
// @author       Zertalious (Zert)
// @match        *://digdig.io/*
// @icon         https://www.google.com/s2/favicons?domain=digdig.io
// @require      https://cdn.jsdelivr.net/gh/Qwokka/WAIL@9ed21abc43045e19f9b3756de109a6e361fb9292/wail.js
// @downloadURL https://update.greasyfork.org/scripts/431803/DigDigIO%20Minimap.user.js
// @updateURL https://update.greasyfork.org/scripts/431803/DigDigIO%20Minimap.meta.js
// ==/UserScript==

const _instantiateStreaming = WebAssembly.instantiateStreaming;

WebAssembly.instantiateStreaming = function () {

	return _instantiateStreaming( new Response() );

}

const _instantiate = WebAssembly.instantiate;

WebAssembly.instantiate = function ( buffer, imports ) {

	const array = new Uint8Array( buffer );

	find( array, [
		OP_SELECT,
		OP_F64_PROMOTE_F32,
		OP_TEE_LOCAL, - 1,
		OP_GET_LOCAL, - 1,
		OP_F64_MUL,
		OP_F64_ADD,
		OP_F64_GE,
		OP_BR_IF, 0
	], function ( start, end ) {

		array[ end - 1 ] = OP_DROP;
		array[ end ] = OP_NOP;

	} );

	return _instantiate( buffer, imports );

}

function find( array, search, callback ) {

	main: for ( let i = 0; i < array.length; i ++ ) {

		for ( let j = 0; j < search.length; j ++ ) {

			if ( search[ j ] !== - 1 && array[ i + j ] !== search[ j ] ) {

				continue main;

			}

		}

		callback( i, i + search.length - 1 );

	}

}

function Float32ToArray( x ) {

	return new Uint8Array( new Float32Array( [ x ] ).buffer );

}

function Float64ToArray( x ) {

	return new Uint8Array( new Float64Array( [ x ] ).buffer );

}

const CTX = CanvasRenderingContext2D.prototype;
 
let temp;
 
CTX.arc = new Proxy( CTX.arc, {
	apply( target, ctx, args ) {
 
		if ( [ 25, 28, 3, 50, 9 ].indexOf( args[ 2 ] ) === - 1 && ctx.fillStyle === '#222222' ) {
 
			temp = args;
 
		}
 
		return Reflect.apply( ...arguments );
 
	}
} );

let offsetY = window.innerHeight;
 
CTX.fill = new Proxy( CTX.fill, {
	apply( target, ctx, args ) {
 
		Reflect.apply( ...arguments );
 
		if ( temp ) {

			const [ x, y, r ] = temp;
 
			temp = null;

			offsetY = Math.min( offsetY, window.innerHeight );
 
			const size = 50;
			const pointSize = 2;
 
			ctx.save();
 
			ctx.globalAlpha = 0.8;
 
			ctx.translate( 10 + size, offsetY - 10 - size );
 
			ctx.beginPath();
 
			ctx.arc( 0, 0, size, 0, Math.PI * 2 );
 
			ctx.fillStyle = '#111';
			ctx.fill();
 
			ctx.beginPath();
 
			const a = size - pointSize;
 
			ctx.arc( ( window.innerWidth / 2 - x ) / r * a, ( window.innerHeight / 2 - y ) / r * a, 2, 0, Math.PI * 2 );
 
			ctx.fillStyle = '#fff';
			ctx.fill();
 
			ctx.restore();
 
			ctx.beginPath();

			offsetY = window.innerHeight;
 
		}
 
	}
} );

let statsText;

const OffscreenContext = typeof OffscreenCanvasRenderingContext2D !== 'undefined' ? 
	OffscreenCanvasRenderingContext2D.prototype : Context;

OffscreenContext.fillText = new Proxy( OffscreenContext.fillText, {
	apply( target, thisArgs, [ text ] ) {

		if ( text === 'Stats' ) {

			statsText = thisArgs.canvas;

		}

		return Reflect.apply( ...arguments );

	}
} );

OffscreenContext.drawImage = new Proxy( OffscreenContext.drawImage, {
	apply( target, thisArgs, [ image ] ) {

		if ( image === statsText ) {

			offsetY = thisArgs.getTransform().f;

		}

		return Reflect.apply( ...arguments );

	}
} );