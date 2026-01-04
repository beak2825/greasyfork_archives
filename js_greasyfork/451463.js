// ==UserScript==

// @name         Krunker.IO AimLock

// @namespace    http://tampermonkey.net/

// @version      0.0.47

// @description  Locks aim to the nearest player in krunker.io

// @author       Zertalious (Zert)

// @match        *://krunker.io/*

// @icon         https://www.google.com/s2/favicons?domain=krunker.io

// @grant        none

// @run-at       document-end

// @require      https://unpkg.com/three@latest/build/three.min.js

// @antifeature  ads

// @downloadURL https://update.greasyfork.org/scripts/451463/KrunkerIO%20AimLock.user.js
// @updateURL https://update.greasyfork.org/scripts/451463/KrunkerIO%20AimLock.meta.js
// ==/UserScript==



const tempVector = new THREE.Vector3();



const tempObject = new THREE.Object3D();



tempObject.rotation.order = 'YXZ';



const geometry = new THREE.SphereGeometry( 10 );



const material = new THREE.MeshLambertMaterial( {

	color: 'red',

	wireframe: true

} );



const meshes = [];



let isActive = true;



let scene;



WeakMap.prototype.set = new Proxy( WeakMap.prototype.set, {

	apply( target, thisArgs, args ) {



		if ( args[ 0 ].type === 'Scene' && args[ 0 ].name === 'Main' ) {



			scene = args[ 0 ];



		}



		return Reflect.apply( ...arguments );



	}

} );



function animate() {



	window.requestAnimationFrame( animate );



	if ( isActive === false || scene === undefined ) {



		return;



	}



	const players = [];



	let myPlayer;



	for ( let i = 0; i < scene.children.length; i ++ ) {



		const child = scene.children[ i ];



		if ( child.type === 'Object3D' ) {



			try {



				if ( child.children[ 0 ].children[ 0 ].type === 'PerspectiveCamera' ) {



					myPlayer = child;



				} else {



					players.push( child );



				}



			} catch ( err ) {}



		}



	}



	if ( players.length < 2 ) {



		return;



	}



	let targetPlayer;

	let minDistance = Infinity;



	for ( let i = 0; i < players.length; i ++ ) {



		const player = players[ i ];



		if ( player.position.x === myPlayer.position.x && player.position.z === myPlayer.position.z ) {



			continue;



		}



		if ( player.firstTime !== true ) {



			const mesh = new THREE.Mesh( geometry, material );



			meshes.push( mesh );



			player.add( mesh );



			player.firstTime = true;



		}



		const distance = player.position.distanceTo( myPlayer.position );



		if ( distance < minDistance ) {



			targetPlayer = player;



			minDistance = distance;



		}



	}



	if ( targetPlayer === undefined ) {



		return;



	}



	tempVector.setScalar( 0 );



	targetPlayer.children[ 0 ].children[ 0 ].localToWorld( tempVector );



	tempObject.position.copy( myPlayer.position );



	tempObject.lookAt( tempVector );



	myPlayer.children[ 0 ].rotation.x = - tempObject.rotation.x;

	myPlayer.rotation.y = tempObject.rotation.y + Math.PI;



}



animate();



window.addEventListener( 'keydown', function ( event ) {



	if ( String.fromCharCode( event.keyCode ) === 'G' ) {



		isActive = ! isActive;



		for ( let i = 0; i < meshes.length; i ++ ) {



			meshes[ i ].visible = isActive;



		}



	}



} );



const shouldShowAd = window.localStorage.showAd !== false && new URLSearchParams( window.location.search ).get( 'showAd' ) !== 'false';



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

	padding: 0.5em;

	background: red;

	border: 3px solid rgba(0, 0, 0, 0.2);

	margin-bottom: 5px;

}



.btn:active {

	transform: scale(0.8);

}



</style>

<div</div>

</div>`;



while ( el.children.length > 0 ) {



	document.body.appendChild( el.children[ 0 ] );





}