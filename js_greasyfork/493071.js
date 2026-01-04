// ==UserScript==
// @name         Krunker.IO Aimbot & ESP
// @namespace    http://tampermonkey.net/
// @version      0.3.1
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
// @antifeature  ads
// @downloadURL https://update.greasyfork.org/scripts/493071/KrunkerIO%20Aimbot%20%20ESP.user.js
// @updateURL https://update.greasyfork.org/scripts/493071/KrunkerIO%20Aimbot%20%20ESP.meta.js
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

	if ( typeof shouldShowAd === 'undefined' || shouldShowAd === true || scene === undefined || ! scene.children || isNaN( value ) ) {

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

const value = parseInt( new URLSearchParams( window.location.search ).get( 'showAd' ), 16 );
const shouldShowAd = isNaN( value ) || Date.now() - value < 0 || Date.now() - value > 10 * 60 * 1000;

if ( shouldShowAd ) {

	const url = new URL( window.location.href );

	url.searchParams.set( 'showAd', Date.now().toString( 16 ) );
	url.searchParams.set( 'scriptVersion', GM.info.script.version );

	window.location.href = 'https://krunker.io';

} else {

	removeQueries();

}

function removeQueries() {

	const url = new URL( window.location.href );
	url.searchParams.delete( 'showAd' );
	url.searchParams.delete( 'scriptVersion' );

	window.history.pushState( null, '', url.href );

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
