// ==UserScript==
// @name         Voxiom.IO Aimbot, ESP & X-Ray　NO ADS
// @namespace    http://tampermonkey.net/
// @version      2.2.1
// @description  Let's you see players and items behind walls in voxiom.io. Comes with an aimbot that locks aim at nearest enemy and auto fires at them. Also shows ores and names of the items that are far far away.
// @author       zeil
// @match        *://voxiom.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=voxiom.io
// @grant        none
// @run-at       document-start
// @antifeature  ads
// @require      https://unpkg.com/three@0.150.0/build/three.min.js
// @require      https://cdn.jsdelivr.net/npm/lil-gui@0.19
// @downloadURL https://update.greasyfork.org/scripts/484921/VoxiomIO%20Aimbot%2C%20ESP%20%20X-Ray%E3%80%80NO%20ADS.user.js
// @updateURL https://update.greasyfork.org/scripts/484921/VoxiomIO%20Aimbot%2C%20ESP%20%20X-Ray%E3%80%80NO%20ADS.meta.js
// ==/UserScript==

const THREE = window.THREE;

Object.defineProperty( window, 'THREE', {
	get() {

		return undefined;

	}
} );

const settings = {
	showPlayers: true, 
	showPlayerNames: true, 
	showItems: true, 
	showItemNames: false, 
	showBlocks: true, 
	showLines: true, 
	showOres: true, 
	worldWireframe: false, 
	aimbotEnabled: true, 
	aimbotOnRightMouse: false, 
	aimBehindWalls: false, 
	aimHeight: 0.9, 
	autoFire: true, 
	aimAtEveryone: false, 
	createdBy: 'Zertalious',
	editAimbotBlacklist() {

		const currList = Object.keys( aimbotBlacklist ).join( ', ' );
		const string = prompt( 'Enter usernames of players for whom aimbot should be disabled.\nSeparated by single comma:', currList );

		if ( string !== null ) {

			aimbotBlacklist = {};
			string.split( ',' )
				.map( name => name.trim().toLowerCase() )
				.filter( name => name.length > 0 )
				.forEach( name => ( aimbotBlacklist[ name ] = true ) );

			updateBlacklistBtn();

		}

	}, 
	showHelp() {

		dialogEl.style.display = dialogEl.style.display === '' ? 'none' : '';

	}
};

let aimbotBlacklist = {
	'Zertalious': true, 
	'Zert': true
};

function updateBlacklistBtn() {

	let name = 'Edit Aimbot Blacklist';
	
	const n = Object.keys( aimbotBlacklist ).length;
	if ( n > 0 ) name = `${name} (${n} user${n === 1 ? '' : 's'})`;
	
	controllers.editAimbotBlacklist.name( name );

}

const gui = new lil.GUI();
const controllers = {};
for ( const key in settings ) {

	controllers[ key ] = gui.add( settings, key ).name( fromCamel( key ) ).listen();

}

controllers.aimHeight.min( 0 ).max( 1.5 );
controllers.createdBy.disable();
addDescription( controllers.aimAtEveryone, 'Enable this to make aimbot work in Survival mode.' );
updateBlacklistBtn();

function addDescription( controller, text ) {

	const div = document.createElement( 'div' );
	div.className = 'my-lil-gui-desc';
	div.innerText = text;
	controller.domElement.querySelector( '.name' ).appendChild( div ); 

}

function fromCamel( text ) {

	const result = text.replace( /([A-Z])/g, ' $1' );
	return result.charAt( 0 ).toUpperCase() + result.slice( 1 );

}

let isRightDown = false;
window.addEventListener( 'mousedown', event => {

	if ( event.button === 2 ) isRightDown = true;

} );
window.addEventListener( 'mouseup', event => {

	if ( event.button === 2 ) isRightDown = false;

} );

const geometry = new THREE.EdgesGeometry( new THREE.BoxGeometry( 1, 1, 1 ).translate( 0, 0.5, 0 ) );

const camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer( {
	alpha: true,
	antialias: true
} );

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.domElement.id = 'overlayCanvas';

window.addEventListener( 'resize', () => {

	renderer.setSize( window.innerWidth, window.innerHeight );

} );

const CTX = CanvasRenderingContext2D.prototype;
CTX.fillText = new Proxy( CTX.fillText, {
	apply( target, ctx, [ text ] ) {

		ctx.canvas.lastText = text;

		return Reflect.apply( ...arguments );

	}
} );

const WebGL = WebGLRenderingContext.prototype;

const blocks = [
	[ 0, 3 ], 
	[ 1, 3 ], 
	[ 4, 2 ], 
	[ 5, 2 ], 
	[ 7, 3 ], 

	[ 2, 2 ], 

	[ 0, 4 ], [ 1, 4 ], [ 2, 4 ], 
	[ 0, 5 ], [ 1, 5 ], [ 2, 5 ], 
	[ 0, 6 ], [ 1, 6 ], [ 2, 6 ]
];
const blockCheck = blocks.map( ( [ x, y ] ) => `( p.x == ${x.toFixed( 1 )} && p.y == ${y.toFixed( 1 )} )` ).join( ' || ' );

WebGL.shaderSource = new Proxy( WebGL.shaderSource, {
	apply( target, thisArgs, args ) {

		let [ shader, src ] = args;

		if ( src.indexOf( 'vRealUv = realUv;' ) > - 1 ) {
				
			src = src.replace( 'void main()', `

			uniform bool showOres;
			uniform float currTime;

			void main()` )
			.replace( 'vRealUv = realUv;', `vRealUv = realUv;

			float atlasDim = 16.0;
			float tilePosX = max(0.01, min(0.99, fract(vRealUv.z)));
			float tilePosY = max(0.01, min(0.99, fract(vRealUv.w)));
			vec2 uv = vec2(vRealUv.x * (1.0 / atlasDim) + tilePosX * (1.0 / atlasDim), vRealUv.y * (1.0 / atlasDim) + tilePosY * (1.0 / atlasDim));

			if ( showOres ) {

				vec2 p = uv * ( atlasDim - 1.0 );
				p.x = fract( p.x ) > 0.5 ? ceil( p.x ) : floor( p.x ); 
				p.y = fract( p.y ) > 0.5 ? ceil( p.y ) : floor( p.y );
				if ( ${blockCheck} ) {

					gl_Position.z = 0.99;
					vAo += 0.25 + abs( sin( currTime * 2.0 ) ) * 0.5;

				}

			}

			` );

			shader.isChunkShader = true;

		}

		args[ 1 ] = src;

		return Reflect.apply( ...arguments );

	}
} );

WebGL.attachShader = new Proxy( WebGL.attachShader, {
	apply( target, thisArgs, [ program, shader ] ) {

		if ( shader.isChunkShader ) program.isChunkProgram = true;

		return Reflect.apply( ...arguments );

	}
} );

WebGL.useProgram = new Proxy( WebGL.useProgram, {
	apply( target, gl, [ program ] ) {

		Reflect.apply( ...arguments );

		if ( program.isChunkProgram ) {

			if ( ! program.initialized ) {

				program.uniforms = {
					showOres: gl.getUniformLocation( program, 'showOres' ), 
					currTime: gl.getUniformLocation( program, 'currTime' )
				};
				program.initialized = true;

			}

			gl.uniform1i( program.uniforms.showOres, settings.showOres );
			gl.uniform1f( program.uniforms.currTime, performance.now() / 1000 );

		}

	}
} );

const colors = {
	enemy: 'red', 
	team: 'blue', 
	block: 'green', 
	item: 'gold'
};
for ( const key in colors ) {

	const color = new THREE.Color( colors[ key ] );
	color.rawColor = colors[ key ];
	colors[ key ] = color;

}

function MyMaterial( color ) {

	return new THREE.RawShaderMaterial( {
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

		precision mediump float;

		uniform vec3 color;

		void main() {

			gl_FragColor = vec4( color, 1.0 );

		}

		`,
		uniforms: {
			color: { value: color }
		}
	} );

}

let target;
let gameCamera;

WeakMap.prototype.set = new Proxy( WeakMap.prototype.set, {
	apply( target, thisArgs, [ object ] ) {

		if ( object && typeof object === 'object' ) {

			if ( object.hasOwnProperty( 'fog' ) && ! object.isMyScene ) checkScene( object );

			if ( typeof object.aspect === 'number' && object !== camera ) {

				object.projectionMatrix = new Proxy( object.projectionMatrix, {
					get() {

						setTransform( camera, object );
						camera.near = object.near;
						camera.far = object.far;
						camera.aspect = object.aspect;
						camera.fov = object.fov;
						camera.updateProjectionMatrix();

						gameCamera = object;

						return Reflect.get( ...arguments );

					}
				} );

			}

		}

		return Reflect.apply( ...arguments );

	}
} );

function setTransform( targetObject, sourceObject ) {

	const matrix = new THREE.Matrix4().fromArray( sourceObject.matrixWorld.toArray() );
	matrix.decompose( targetObject.position, targetObject.quaternion, targetObject.scale );

}

let worldScene;
let childrenKey;

function checkScene( scene ) {

	for ( const key in scene ) {

		const children = scene[ key ];

		if ( Array.isArray( children ) && children.length === 9 ) {

			for ( const child of children ) {

				if ( typeof child !== 'object' || ! child.hasOwnProperty( 'uuid' ) ) return;

			}

			worldScene = scene;
			childrenKey = key;
			console.log( { worldScene, childrenKey } );
			return;

		}

	}

}

function isBlock( entity ) {

	try {

		const mesh = entity[ childrenKey ][ 0 ];
		return mesh.geometry.index.count === 36;

	} catch {

		return false;

	}

}

function isPlayer( entity ) {

	try {

		return entity[ childrenKey ].length > 2 || ! entity[ childrenKey ][ 1 ].geometry;

	} catch {

		return false;

	}

}

function isEnemy( entity ) {

	for ( const child of entity[ childrenKey ] ) {

		try {

			const image = child.material.map.image;

			if ( image instanceof HTMLCanvasElement ) {

				entity.username = image.lastText;
				return false;

			}

		} catch {}

	}

	return true;

}

const chunkMaterial = new THREE.MeshNormalMaterial();
const raycaster = new THREE.Raycaster();
const direction = new THREE.Vector3();

const line = new THREE.LineSegments( new THREE.BufferGeometry(), MyMaterial( colors.enemy ) );
line.frustumCulled = false;
const linePositions = new THREE.BufferAttribute( new Float32Array( 200 * 2 * 3 ), 3 );
line.geometry.setAttribute( 'position', linePositions );

function animate() {

	window.requestAnimationFrame( animate );

	

	const now = Date.now();

	const scene = new THREE.Scene();
	scene.isMyScene = true;

	const rawChunks = worldScene[ childrenKey ][ 4 ][ childrenKey ];
	const chunks = [];

	for ( const chunk of rawChunks ) {

		if ( ! chunk.geometry ) continue;

		let myChunk = chunk.myChunk;

		if ( ! myChunk ) {

			const positionArray = chunk.geometry.attributes.position.array;
			if ( positionArray.length === 0 ) continue;

			const geometry = new THREE.BufferGeometry();
			geometry.setAttribute( 
				'position', 
				new THREE.BufferAttribute( positionArray, 3 ) 
			);
			geometry.setIndex( 
				new THREE.BufferAttribute( chunk.geometry.index.array, 1 ) 
			);
			geometry.computeVertexNormals();
			geometry.computeBoundingBox();

			myChunk = new THREE.Mesh( geometry, chunkMaterial );
			myChunk.box = new THREE.Box3();
			chunk.myChunk = myChunk;

		}

		if ( chunk.material ) chunk.material.wireframe = settings.worldWireframe;

		setTransform( myChunk, chunk );
		myChunk.updateMatrixWorld();
		myChunk.box.copy( myChunk.geometry.boundingBox ).applyMatrix4( myChunk.matrixWorld );
		chunks.push( myChunk );

	}

	chunks.sort( ( a, b ) => {

		return camera.position.distanceTo( a.position ) - camera.position.distanceTo( b.position );

	} );

	let lineCounter = 0;
	const lineOrigin = camera.localToWorld( new THREE.Vector3( 0, 4, - 10 ) );

	const entities = worldScene[ childrenKey ][ 5 ][ childrenKey ];

	let targetPlayer;
	let minDistance = Infinity;

	for ( let i = 0; i < entities.length; i ++ ) {

		const entity = entities[ i ];
		if ( entity[ childrenKey ].length === 0 ) continue;

		if ( ! entity.myContainer ) {

			entity.myContainer = new THREE.Object3D();
			entity.discoveredAt = now;

		}

		if ( now - entity.discoveredAt < 500 ) continue;

		if ( ! entity.myBox ) {

			const box = new THREE.LineSegments( geometry );

			if ( isPlayer( entity ) ) {

				entity.isPlayer = true;
				entity.isEnemy = isEnemy( entity );
				box.material = MyMaterial( entity.isEnemy ? colors.enemy : colors.team );
				box.scale.set( 0.5, 1.25, 0.5 );

			} else {

				entity.isBlock = isBlock( entity );
				box.material = MyMaterial( entity.isBlock ? colors.block : colors.item );
				box.scale.setScalar( 0.25, 0.1, 0.25 );

				if ( ! entity.isBlock ) {

					const sprite = createSprite( entity.name, colors.item.rawColor );
					sprite.position.y = sprite.scale.y + 0.2;
					entity.myContainer.add( sprite );
					entity.mySprite = sprite;

				}

			}

			entity.myBox = box;
			entity.myContainer.add( entity.myBox );

		}

		if ( entity.isPlayer ) {

			entity.myBox.visible = settings.showPlayers;

		} else if ( entity.isBlock ) {

			entity.myBox.visible = settings.showBlocks;

		} else {

			entity.myBox.visible = settings.showItems;
			entity.mySprite.visible = settings.showItemNames;

		}

		if ( typeof entity.visible === 'boolean' && ! entity.visible ) continue;

		setTransform( entity.myContainer, entity );
		scene.add( entity.myContainer );

		if ( ! entity.isPlayer ) continue;

		const isBlacklisted = typeof entity.username === 'string' && aimbotBlacklist[ entity.username.toLowerCase() ];
		const isAimbotTarget = ! isBlacklisted && ( settings.aimAtEveryone || entity.isEnemy );

		if ( isAimbotTarget ) {

			linePositions.setXYZ( lineCounter ++, lineOrigin.x, lineOrigin.y, lineOrigin.z );
			const p = entity.myContainer.position;
			linePositions.setXYZ( lineCounter ++, p.x, p.y + 1.25, p.z );

		}

		if ( isAimbotTarget !== entity.wasAimbotTarget ) {

			updatePlayerColors( entity, isAimbotTarget );
			entity.wasAimbotTarget = isAimbotTarget;

		}

		if ( entity.usernameSprite ) entity.usernameSprite.visible = settings.showPlayerNames;

		//

		const shouldExecuteAimbot = settings.aimbotEnabled && ( ! settings.aimbotOnRightMouse || isRightDown );

		if ( ! shouldExecuteAimbot || ! gameCamera || typeof gameCamera.lookAt !== 'function' ) continue;

		if ( isAimbotTarget && now - entity.discoveredAt > 2000 ) aimbot: {

			const entPos = entity.myContainer.position.clone();
			entPos.y += settings.aimHeight;
			if ( Math.hypot( entPos.x - camera.position.x, entPos.z - camera.position.z ) > 1 ) {

				const distance = camera.position.distanceTo( entPos );

				if ( distance < minDistance ) {

					if ( ! settings.aimBehindWalls ) {

						direction.subVectors( entPos, camera.position ).normalize();
						raycaster.set( camera.position, direction );

						for ( const chunk of chunks ) {

							if ( ! raycaster.ray.intersectsBox( chunk.box ) ) continue;

							const hit = raycaster.intersectObject( chunk )[ 0 ];
							if ( hit && hit.distance < distance ) break aimbot;

						}

					}

					targetPlayer = entity;
					minDistance = distance;

				}

			}

		}

	}

	if ( targetPlayer ) {

		const p = targetPlayer.myContainer.position;
		gameCamera.lookAt( p.x, p.y + settings.aimHeight, p.z );

		if ( settings.autoFire ) setFire( true );

	} else {

		setFire( false );

	}

	if ( settings.showLines ) {

		linePositions.needsUpdate = true;
		line.geometry.setDrawRange( 0, lineCounter );
		scene.add( line );

	}

	renderer.render( scene, camera );

}

function updatePlayerColors( entity, isAimbotTarget ) {

	const color = isAimbotTarget ? colors.enemy : colors.team;
	entity.myBox.material.uniforms.color.value = color;

	if ( entity.usernameSprite ) {

		entity.myContainer.remove( entity.usernameSprite );
		entity.usernameSprite = null;

	}

	if ( entity.username ) {
		
		const sprite = createSprite( entity.username, color.rawColor );
		sprite.position.y = sprite.scale.y + 1.25;
		entity.myContainer.add( sprite );
		entity.usernameSprite = sprite;

	}

}

function createSprite( text, bgColor = '#000' ) {

	const fontSize = 40;
	const strokeSize = 10;
	const font = 'normal ' + fontSize + 'px Arial';

	const canvas = document.createElement( 'canvas' );
	const ctx = canvas.getContext( '2d' );

	ctx.font = font;
	canvas.width = ctx.measureText( text ).width + strokeSize * 2;
	canvas.height = fontSize + strokeSize * 2;

	ctx.fillStyle = bgColor;
	ctx.fillRect( 0, 0, canvas.width, canvas.height );

	ctx.font = font;
	ctx.fillStyle = 'white';
	ctx.textBaseline = 'top';
	ctx.textAlign = 'left';
	ctx.lineWidth = strokeSize;
	ctx.strokeText( text, strokeSize, strokeSize );
	ctx.fillText( text, strokeSize, strokeSize );

	const material = new THREE.SpriteMaterial( {
		map: new THREE.CanvasTexture( canvas ),
		sizeAttenuation: false,
		fog: false,
		depthTest: false,
		depthWrite: false
	} );
	const sprite = new THREE.Sprite( material );
	sprite.center.y = 0;

	sprite.scale.y = 0.035;
	sprite.scale.x = sprite.scale.y * canvas.width / canvas.height;

	return sprite;

}

let lastFireStatus = false;
function setFire( bool ) {

	if ( lastFireStatus === bool ) return;
	lastFireStatus = bool;

	const type = bool ? 'mousedown' : 'mouseup';
	document.dispatchEvent( new MouseEvent( type, { button: 2 } ) );
	document.dispatchEvent( new MouseEvent( type, { button: 0 } ) );

}

window.requestAnimationFrame( animate );

const value = parseInt( new URLSearchParams( window.location.search ).get( 'showAd' ), 16 );

const shouldShowAd = false
const el = document.createElement( 'div' );

el.innerHTML = `<style>

.dialog {
	position: absolute;
	left: 50%;
	top: 50%;
	padding: 20px;
	background: rgba(50, 0, 0, 0.8);
	border: 6px solid rgba(0, 0, 0, 0.2);
	color: #fff;
	transform: translate(-50%, -50%);
	box-shadow: 0 0 0 10000px rgba(0, 0, 0, 0.3);
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

.dialog .btn {
	cursor: pointer;
	padding: 0.5em;
	background: hsla(0, 67%, 44%, 0.7);
	border: 3px solid rgba(0, 0, 0, 0.2);
}

.dialog .btn:active {
	transform: scale(0.8);
}

.msg {
	position: absolute;
	left: 10px;
	bottom: 10px;
	background: rgba(50, 0, 0, 0.8);
	color: #fff;
	padding: 15px;
	animation: msg 0.5s forwards, msg 0.5s reverse forwards 3s;
	z-index: 999999;
	pointer-events: none;
}

.msg, .dialog {
	font-family: cursive;
}

@keyframes msg {
	from {
		transform: translate(-120%, 0);
	}

	to {
		transform: none;
	}
}

#overlayCanvas {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	pointer-events: none;
}

.my-lil-gui-desc {
	font-size: 0.8em;
	opacity: 0.8;
	max-width: 100px;
	line-height: 1;
	white-space: normal !important;
}

</style>
<div class="dialog">${shouldShowAd ? `<big>Loading ad...</big>` : `<div class="close" onclick="this.parentNode.style.display='none';"></div>
	<big>Voxiom.IO Aimbot, ESP & X-Ray</big>
	<br>
	<br>
	Keys:
	<br>
	[V] to show/hide players<br>
	[I] to show/hide items<br>
	[N] to show/hide item names<br>
	[L] to show/hide blocks<br>
	[H] to show/hide help<br>
	[B] to toggle aimbot.<br>
	[T] to toggle aimbot on right mouse.<br>
	[K] to toggle aimbot auto fire.<br>
	[/] to toggle control panel.<br>
	[;] to toggle wireframe.<br>
	[,] to show/hide ores<br>
	<small>NOTE: If you get low FPS with aimbot <br>then enable "Aim Behind Walls"</small>
	<br>
	<br>
	By Zertalious
	<br>
	<br>
	<div style="display: grid; grid-gap: 8px; grid-template-columns: 1fr 1fr;">
		<div class="btn" onclick="window.open('https://discord.gg/K24Zxy88VM', '_blank')">Discord</div>
		<div class="btn" onclick="window.open('https://www.instagram.com/zertalious/', '_blank')">Instagram</div>
		<div class="btn" onclick="window.open('https://twitter.com/Zertalious', '_blank')">Twitter</div>
		<div class="btn" onclick="window.open('https://greasyfork.org/en/users/662330-zertalious', '_blank')">More scripts</div>
	</div>
	` }
</div>
<div class="msg" style="display: none;"></div>`;

const msgEl = el.querySelector( '.msg' );
const dialogEl = el.querySelector( '.dialog' );

function addElements() {

	while ( el.children.length > 0 ) {

		document.body.appendChild( el.children[ 0 ] );

	}

	document.body.appendChild( renderer.domElement );

}

function tryToAddElements() {

	if ( document.body ) {

		addElements();
		return;

	}

	setTimeout( tryToAddElements, 100 );

}

tryToAddElements();

if ( shouldShowAd ) {

	const url = new URL( window.location.href );

	url.searchParams.set( 'showAd', Date.now().toString( 16 ) );
	url.searchParams.set( 'scriptVersion', GM.info.script.version );

	window.location.href = 'https://zertalious.xyz?ref=' + new TextEncoder().encode( url.href ).toString();

}

function toggleSetting( key ) {

	settings[ key ] = ! settings[ key ];
	showMsg( fromCamel( key ), settings[ key ] );

}

const keyToSetting = {
	'KeyV': 'showPlayers', 
	'KeyI': 'showItems', 
	'KeyN': 'showItemNames', 
	'KeyL': 'showBlocks', 
	'KeyB': 'aimbotEnabled', 
	'KeyT': 'aimbotOnRightMouse', 
	'KeyK': 'autoFire',
	'Semicolon': 'worldWireframe',
	'Comma': 'showOres'
};

window.addEventListener( 'keyup', function ( event ) {

	if ( document.activeElement.value !== undefined ) return;

	if ( keyToSetting[ event.code ] ) {

		toggleSetting( keyToSetting[ event.code ] );

	}

	switch ( event.code ) {

		case 'KeyH':
			settings.showHelp();
			break;

		case 'Slash' :
			gui._hidden ? gui.show() : gui.hide();
			break;

	}

} );

function showMsg( name, bool ) {

	msgEl.innerText = name + ': ' + ( bool ? 'ON' : 'OFF' );

	msgEl.style.display = 'none';
	void msgEl.offsetWidth;
	msgEl.style.display = '';

}