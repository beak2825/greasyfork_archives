// ==UserScript==
// @name         Krunker.IO Aimbot & ESP
// @namespace    http://tampermonkey.net/
// @version      0.3.3
// @description  Locks aim to the nearest player in krunker.io and shows players behind walls. Also shows a line between you and them.
// @author       Zertalious (Zert)
// @match        *://krunker.io/*
// @match        *://browserfps.com/*
// @exclude      *://krunker.io/social*
// @exclude      *://krunker.io/editor*
// @icon         https://www.google.com/s2/favicons?domain=krunker.io
// @grant        none
// @run-at       document-start
// @require      https://unpkg.com/three@0.150.0/build/three.min.js
// @downloadURL https://update.greasyfork.org/scripts/432453/KrunkerIO%20Aimbot%20%20ESP.user.js
// @updateURL https://update.greasyfork.org/scripts/432453/KrunkerIO%20Aimbot%20%20ESP.meta.js
// ==/UserScript==

const THREE = window.THREE;
delete window.THREE;

const settings = {
	aimbotEnabled: true, 
	aimbotOnRightMouse: false,
	espEnabled: true, 
	espLines: true, 
	wireframe: false
};

const keyToSetting = {
	KeyB: 'aimbotEnabled',
	KeyL: 'aimbotOnRightMouse',  
	KeyM: 'espEnabled', 
	KeyN: 'espLines', 
	KeyK: 'wireframe'
};

const gui = createGUI();

let scene;

const x = {
	window: window,
	document: document,
	querySelector: document.querySelector,
	consoleLog: console.log,
	ReflectApply: Reflect.apply,
	ArrayPrototype: Array.prototype,
	ArrayPush: Array.prototype.push,
	ObjectPrototype: Object.prototype,
	clearInterval: window.clearInterval,
	setTimeout: window.setTimeout,
	reToString: RegExp.prototype.toString,
	indexOf: String.prototype.indexOf, 
	requestAnimationFrame: window.requestAnimationFrame
};

x.consoleLog( 'Waiting to inject...' );

const proxied = function ( object ) {

	// [native code]

	try {

		if ( typeof object === 'object' &&
			typeof object.parent === 'object' &&
			object.parent.type === 'Scene' &&
			object.parent.name === 'Main' ) {

			x.consoleLog( 'Found Scene!' )
			scene = object.parent;
			x.ArrayPrototype.push = x.ArrayPush;

		}

	} catch ( error ) {}

	return x.ArrayPush.apply( this, arguments );

}

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

const line = new THREE.LineSegments( new THREE.BufferGeometry(), material );

line.frustumCulled = false;

const linePositions = new THREE.BufferAttribute( new Float32Array( 100 * 2 * 3 ), 3 );
line.geometry.setAttribute( 'position', linePositions );

let injectTimer = null;

function animate() {

	x.requestAnimationFrame.call( x.window, animate );

	if ( ! scene && ! injectTimer ) {

		const el = x.querySelector.call( x.document, '#loadingBg' );

		if ( el && el.style.display === 'none' ) {

			x.consoleLog( 'Inject timer started!' );

			injectTimer = x.setTimeout.call( x.window, () => {

				x.consoleLog( 'Injected!' );
				x.ArrayPrototype.push = proxied;

			}, 2e3 );

		}

	}

	if ( scene === undefined || ! scene.children ) {

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

		} else if ( child.material ) {

			child.material.wireframe = settings.wireframe;

		}

	}

	if ( ! myPlayer ) {

		x.consoleLog( 'Player not found, finding new scene.' );
		x.ArrayPrototype.push = proxied;
		return;

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

		player.visible = settings.espEnabled || player.visible;
		player.box.visible = settings.espEnabled;

		const distance = player.position.distanceTo( myPlayer.position );

		if ( distance < minDistance ) {

			targetPlayer = player;
			minDistance = distance;

		}

	}

	linePositions.needsUpdate = true;
	line.geometry.setDrawRange( 0, counter );

	line.visible = settings.espLines;

	if ( settings.aimbotEnabled === false || ( settings.aimbotOnRightMouse && ! rightMouseDown ) || targetPlayer === undefined ) {

		return;

	}

	tempVector.setScalar( 0 );

	targetPlayer.children[ 0 ].children[ 0 ].localToWorld( tempVector );

	tempObject.position.copy( myPlayer.position );

	tempObject.lookAt( tempVector );

	myPlayer.children[ 0 ].rotation.x = - tempObject.rotation.x;
	myPlayer.rotation.y = tempObject.rotation.y + Math.PI;

}

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

.zui {
	position: fixed;
	right: 10px;
	top: 0;
	z-index: 999;
	display: flex;
	flex-direction: column;
	font-family: monospace;
	font-size: 14px;
	color: #fff;
	width: 250px;
	user-select: none;
	border: 2px solid #000;
}

.zui-item {
	padding: 5px 8px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: #222;
	cursor: pointer;
}

.zui-item.text {
	justify-content: center;
	cursor: unset;
	text-align: center;
	background: #333;
}

.zui-item:hover {
	background: #333;
}

.zui-item span {
	color: #fff;
	font-family: monospace;
	font-size: 14px;
}

.zui-header {
	background: #000;
}

.zui-header span {
	font-size: 16px;
}

.zui-header:hover {
	background: #000;
}

.zui-on {
	color: green;
}

.zui-item-value {
	font-size: 0.8em;
}

.zui-content .zui-item-value {
	font-weight: bolder;
}

</style>
<div class="msg" style="display: none;"></div>
<div class="dialog">${`<div class="close" onclick="this.parentNode.style.display='none';"></div>
	<big>== Aimbot & ESP ==</big>
	<br>
	<br>
	[B] to toggle aimbot
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

const msgEl = el.querySelector( '.msg' );
const dialogEl = el.querySelector( '.dialog' );

window.addEventListener( 'DOMContentLoaded', function () {

	while ( el.children.length > 0 ) {

		document.body.appendChild( el.children[ 0 ] );

	}

	document.body.appendChild( gui );

} );

let rightMouseDown = false;

function handleMouse( event ) {

	if ( event.button === 2 ) {

		rightMouseDown = event.type === 'pointerdown' ? true : false;

	}

}

window.addEventListener( 'pointerdown', handleMouse );
window.addEventListener( 'pointerup', handleMouse );

window.addEventListener( 'keyup', function ( event ) {

	if ( x.document.activeElement && x.document.activeElement.value !== undefined ) return;

	if ( keyToSetting[ event.code ] ) {

		toggleSetting( keyToSetting[ event.code ] );

	}

	switch ( event.code ) {

		case 'Slash' :
			toggleElementVisibility( gui );
			break;

		case 'KeyH' :
			toggleElementVisibility( dialogEl );
			break;

	}

} );

function toggleElementVisibility( el ) {

	el.style.display = el.style.display === '' ? 'none' : '';

}

function showMsg( name, bool ) {

	msgEl.innerText = name + ': ' + ( bool ? 'ON' : 'OFF' );

	msgEl.style.display = 'none';
	void msgEl.offsetWidth;
	msgEl.style.display = '';

}

animate();

function createGUI() {

	const guiEl = fromHtml( `<div class="zui">
		<div class="zui-item zui-header">
			<span>[/] Controls</span>
			<span class="zui-item-value">[close]</span>
		</div>
		<div class="zui-content"></div>
	</div>` );

	const headerEl = guiEl.querySelector( '.zui-header' );
	const contentEl = guiEl.querySelector( '.zui-content' );
	const headerStatusEl = guiEl.querySelector( '.zui-item-value' );

	headerEl.onclick = function () {

		const isHidden = contentEl.style.display === 'none';

		contentEl.style.display = isHidden ? '' : 'none';
		headerStatusEl.innerText = isHidden ? '[close]' : '[open]';

	}

	const settingToKey = {};
	for ( const key in keyToSetting ) {

		settingToKey[ keyToSetting[ key ] ] = key;

	}

	for ( const prop in settings ) {

		let name = fromCamel( prop );
		let shortKey = settingToKey[ prop ];

		if ( shortKey ) {

			if ( shortKey.startsWith( 'Key' ) ) shortKey = shortKey.slice( 3 );
			name = `[${shortKey}] ${name}`;

		}

		const itemEl = fromHtml( `<div class="zui-item">
			<span>${name}</span>
			<span class="zui-item-value"></span>
		</div>` );
		const valueEl = itemEl.querySelector( '.zui-item-value' );

		function updateValueEl() {

			const value = settings[ prop ];
			valueEl.innerText = value ? 'ON' : 'OFF';
			valueEl.style.color = value ? 'green' : 'red';

		}
		itemEl.onclick = function() {

			settings[ prop ] = ! settings[ prop ];

		}
		updateValueEl();

		contentEl.appendChild( itemEl );

		const p = `__${prop}`;
		settings[ p ] = settings[ prop ];
		Object.defineProperty( settings, prop, {
			get() {

				return this[ p ];

			}, 
			set( value ) {

				this[ p ] = value;
				updateValueEl();

			}
		} );

	}

	contentEl.appendChild( fromHtml( `<div class="zui-item text">
		<span>Created by Zertalious!</span>
	</div>` ) );

	return guiEl;

}

function fromCamel( text ) {

	const result = text.replace( /([A-Z])/g, ' $1' );
	return result.charAt( 0 ).toUpperCase() + result.slice( 1 );

}

function fromHtml( html ) {

	const div = document.createElement( 'div' );
	div.innerHTML = html;
	return div.children[ 0 ];

}

function toggleSetting( key ) {

	settings[ key ] = ! settings[ key ];
	showMsg( fromCamel( key ), settings[ key ] );

}