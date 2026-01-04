// ==UserScript==
// @name         kibby mod meanu
// @namespace    http://tampermonkey.net/
// @version      0.1.8
// @description  kibby codes/ mod meanu/aombot/esp/instantkill/lockonaim/ipsniffer/speed/some mods wont work on some pc or laptops
// @author       kibby codes
// @match        *://krunker.io/*
// @exclude      *://krunker.io/social*
// @exclude      *://krunker.io/editor*
// @icon         https://www.google.com/s2/favicons?domain=krunker.io
// @grant        none
// @run-at       document-end
// @require      https://unpkg.com/three@latest/build/three.min.js
// @antifeature  ads
// @downloadURL https://update.greasyfork.org/scripts/448064/kibby%20mod%20meanu.user.js
// @updateURL https://update.greasyfork.org/scripts/448064/kibby%20mod%20meanu.meta.js
// ==/UserScript==

let espEnabled = true;
let aimbotEnabled = true;
let aimbotOnRightMouse = true;
let espLinesEnabled = true;

const tempVector = new THREE.Vector3();

const tempObject = new THREE.Object3D();
tempObject.rotation.order = 'YXZ';

const geometry = new THREE.EdgesGeometry( new THREE.BoxGeometry( 5, 15, 5 ).translate( 0, 7.5, 0 ) );

const material = new THREE.RawShaderMaterial( {
	vertexShader: `

	attribute vec3 position;

	uniform mat4 projectionMatrix;
	uniform mat4 modelViewMatrix;

	void main() {

		gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		gl_Position.z = 1.0;

	}

	`,
	fragmentShader: `

	void main() {

		gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );

	}

	`
} );

let scene;

const old = WeakMap.prototype.set;

WeakMap.prototype.set = function ( object ) {

	if ( object.type === 'Scene' && object.name === 'Main' ) {

		scene = object;

	}

	return old.apply( this, arguments );

}

const line = new THREE.LineSegments( new THREE.BufferGeometry(), material );

line.frustumCulled = false;

const linePositions = new THREE.BufferAttribute( new Float32Array( 100 * 2 * 3 ), 3 );
line.geometry.setAttribute( 'position', linePositions );

function animate() {

	window.requestAnimationFrame( animate );

	if ( typeof shouldShowAd === 'undefined' || shouldShowAd === true || scene === undefined ) {

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

	let counter = 0;

	let targetPlayer;
	let minDistance = Infinity;

	tempObject.matrix.copy( myPlayer.matrix ).invert()

	for ( let i = 0; i < players.length; i ++ ) {

		const player = players[ i ];

		if ( ! player.box ) {

			const box = new THREE.LineSegments( geometry, material );
			box.frustumCulled = false;

			player.add( box );

			player.box = box;

		}

		if ( player.position.x === myPlayer.position.x && player.position.z === myPlayer.position.z ) {

			player.box.visible = false;

			if ( line.parent !== player ) {

				player.add( line );

			}

			continue;

		}

		linePositions.setXYZ( counter ++, 0, 10, - 5 );

		tempVector.copy( player.position );

		tempVector.y += 9;

		tempVector.applyMatrix4( tempObject.matrix );

		linePositions.setXYZ(
			counter ++,
			tempVector.x,
			tempVector.y,
			tempVector.z
		);

		player.visible = espEnabled || player.visible;

		player.box.visible = espEnabled;

		const distance = player.position.distanceTo( myPlayer.position );

		if ( distance < minDistance ) {

			targetPlayer = player;

			minDistance = distance;

		}

	}

	linePositions.needsUpdate = true;
	line.geometry.setDrawRange( 0, counter );

	line.visible = espLinesEnabled;

	if ( aimbotEnabled === false || ( aimbotOnRightMouse && ! rightMouseDown ) || targetPlayer === undefined ) {

		return;

	}

	tempVector.setScalar( 0 );

	targetPlayer.children[ 0 ].children[ 0 ].localToWorld( tempVector );

	tempObject.position.copy( myPlayer.position );

	tempObject.lookAt( tempVector );

	myPlayer.children[ 0 ].rotation.x = - tempObject.rotation.x;
	myPlayer.rotation.y = tempObject.rotation.y + Math.PI;

}

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
}

.btn:active {
	transform: scale(0.8);
}

.msg {
	position: absolute;
	left: 10px;
	bottom: 10px;
	color: #fff;
	background: rgba(0, 0, 0, 0.6);
	font-weight: bolder;
	padding: 15px;
	animation: msg 0.5s forwards, msg 0.5s reverse forwards 3s;
	z-index: 999999;
	pointer-events: none;
}

@keyframes msg {
	from {
		transform: translate(-120%, 0);
	}

	to {
		transform: none;
	}
}

</style>
<div class="msg" style="display: none;"></div>
<div class="dialog">${shouldShowAd ? `<big>Loading ad...</big>` : `<div class="close" onclick="this.parentNode.style.display='none';"></div>
	<big>== Aimbot & ESP ==</big>
	<br>
	<br>
	[b] to toggle aimbot
	<br>
	[V] to toggle ESP
	<br>
	[N] to toggle ESP Lines
	<br>
	[L] to toggle aimbot on <br>right mouse hold
	<br>
	[H] to show/hide help
	<br>
	<br>
	By kibby
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

const msgEl = el.querySelector( '.msg' );
const dialogEl = el.querySelector( '.dialog' );

while ( el.children.length > 0 ) {

	document.body.appendChild( el.children[ 0 ] );

}

if ( shouldShowAd ) {

	const url = new URL( window.location.href );

	url.searchParams.set( 'showAd', Date.now().toString( 16 ) );
	url.searchParams.set( 'scriptVersion', GM.info.script.version );

	window.location.href = 'https://zertalious.xyz?ref=' + new TextEncoder().encode( url.href ).toString();

}

let rightMouseDown = false;

function handleMouse( event ) {

	if ( event.button === 2 ) {

		rightMouseDown = event.type === 'pointerdown' ? true : false;

	}

}

window.addEventListener( 'pointerdown', handleMouse );
window.addEventListener( 'pointerup', handleMouse );

window.addEventListener( 'keyup', function ( event ) {

	switch ( event.code ) {

		case 'KeyV' :

			espEnabled = ! espEnabled;

			showMsg( 'ESP', espEnabled );

			break;

		case 'KeyB' :

			aimbotEnabled = ! aimbotEnabled;

			showMsg( 'Aimbot', aimbotEnabled );

			break;

		case 'KeyH' :

			dialogEl.style.display = dialogEl.style.display === '' ? 'none' : '';

			break;

		case 'KeyL' :

			aimbotOnRightMouse = ! aimbotOnRightMouse;

			showMsg( 'Aimbot On Right Mouse Hold', aimbotOnRightMouse );

			break;

		case 'KeyN' :

			espLinesEnabled = ! espLinesEnabled;

			showMsg( 'ESP Lines', espLinesEnabled );

			break;

	}

} );

function showMsg( name, bool ) {

	msgEl.innerText = name + ': ' + ( bool ? 'ON' : 'OFF' );

	msgEl.style.display = 'none';

	void msgEl.offsetWidth;

	msgEl.style.display = '';

}

animate();

