// ==UserScript==
// @name         DigDig.IO Raio-X
// @namespace    https://tampermonkey.net/
// @version      0.1.0
// @description  Let's you see more in digdig.io
// @author       JG plays
// @match        *://digdig.io/*
// @icon         https://www.google.com/s2/favicons?domain=digdig.io
// @require      https://cdn.jsdelivr.net/gh/Qwokka/WAIL@9ed21abc43045e19f9b3756de109a6e361fb9292/wail.js
// @downloadURL https://update.greasyfork.org/scripts/490937/DigDigIO%20Raio-X.user.js
// @updateURL https://update.greasyfork.org/scripts/490937/DigDigIO%20Raio-X.meta.js
// ==/UserScript==

// Only works when fow is done client side
// Should or shouldn't work depending on the current live build
// Created on build: 41e6c4662ebb8e04b62e5ac95c03eb1d8f5427d1

const _instantiateStreaming = WebAssembly.instantiateStreaming;

WebAssembly.instantiateStreaming = function () {

	return _instantiateStreaming( new Response() );

}

const _instantiate = WebAssembly.instantiate;

WebAssembly.instantiate = function ( buffer, imports ) {

	const array = new Uint8Array( buffer );

	find( array, [
		OP_END,
		OP_I32_LOAD8_U, - 1, - 1,
		OP_I32_CONST, 1,
		OP_I32_SUB,
		OP_BR_TABLE
	], function ( i, end ) {

		console.log( 'here!!' );

		i ++;

		array[ i ++ ] = OP_BR;
		array[ i ++ ] = 1;
		array[ i ++ ] = OP_NOP;

		i ++;

		array[ i ] = OP_NOP;

	} );

	find( array, [
		OP_F32_CONST, ...Float32ToArray( 2 ),
		OP_SET_LOCAL, - 1
	], function ( start, end ) {

		array.set( Float32ToArray( - 1 ), start + 1 );

	} );

	// changes the shape of the fog to a rectangle

	find( array, [
		OP_F64_CONST, ...Float64ToArray( 1.4142135623730951 )
	], function ( start, end ) {

		array.set( Float64ToArray( 1 ), start + 1 );

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

const value = parseInt( new URLSearchParams( window.location.search ).get( 'showAd' ), 16 );

const shouldShowAd = isNaN( value ) || Date.now() - value < 0 || Date.now() - value > 10 * 60 * 1000;

const el = document.createElement( 'div' );

el.innerHTML = `<style>

.dialog {
	position: absolute;
	left: 50%;
	top: 50%;
	padding: 25px;
	background: #784400;
	border: 6px solid rgba(0, 0, 0, 0.2);
	color: #fff;
	transform: translate(-50%, -50%);
	text-align: center;
	z-index: 999999;
	font-family: Ubuntu;
	box-shadow: 0 0 0 100vw rgba(0, 0, 0, 0.5);
	text-shadow: 1px 0 #000, -1px 0 #000, 0 1px #000, 0 -1px #000, 1px 1px #000, -1px -1px #000;
}

.dialog * {
	color: #fff;
}

.close {
	position: absolute;
	right: 5px;
	top: 5px;
	width: 20px;
	height: 20px;
	opacity: 0.5;
	cursor: pointer;
}

.close:before, .close:after {
	content: ' ';
	position: absolute;
	left: 50%;
	top: 50%;
	width: 100%;
	height: 20%;
	transform: translate(-50%, -50%) rotate(-45deg);
	background: #fff;
}

.close:after {
	transform: translate(-50%, -50%) rotate(45deg);
}

.close:hover {
	opacity: 1;
}

.btn {
	cursor: pointer;
	padding: 0.4em;
	background: #30a199;
	border: 5px solid rgba(0, 0, 0, 0.2);
	margin-bottom: 5px;
	border-radius: 6px;
}

.btn:active {
	transform: scale(0.8);
}


</div>

	`
;

while ( el.children.length > 0 ) {

	document.body.appendChild( el.children[ 0 ] );




}