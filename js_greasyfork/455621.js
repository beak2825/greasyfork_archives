// ==UserScript==
// @name         Voxiom.IO Mod
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  e
// @author       my mom
// @match        *://voxiom.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=voxiom.io
// @grant        none
// @run-at       document-end
// @antifeature  ads
// @require      https://unpkg.com/three@latest/build/three.min.js
// @downloadURL https://update.greasyfork.org/scripts/455621/VoxiomIO%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/455621/VoxiomIO%20Mod.meta.js
// ==/UserScript==

const THREE = window.THREE;

Object.defineProperty( window, 'THREE', {
	get() {

		return undefined;

	}
} );

let showPlayers = true;


const geometry = new THREE.EdgesGeometry( new THREE.BoxGeometry( 1, 1, 1 ).translate( 0, 0.5, 0 ) );

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
			color: { value: new THREE.Color( color ) }
		}
	} );

}

let worldScene;

WeakMap.prototype.set = new Proxy( WeakMap.prototype.set, {
	apply( target, thisArgs, [ scene ] ) {

		if ( scene.type === 'Scene' && scene.children.length === 9 ) {

			worldScene = scene;

			window.scene = scene;

		}

		return Reflect.apply( ...arguments );

	}
} );

function animate() {

	if ( worldScene ) {

		const entities = worldScene.children[ 5 ].children;

		for ( let i = 0; i < entities.length; i ++ ) {

			const entity = entities[ i ];

			if ( entity.children.length === 0 ) {

				continue;

			}

			if ( ! entity.myBox ) {

				const box = new THREE.LineSegments( geometry );

				const name = entity.children[ 0 ].name;

				if ( name === 'Parachute' ) {

					entity.isPlayer = true;

					box.material = MyMaterial( 'red' );

					console.log( entity );

					box.scale.set( 0.5, 1.25, 0.5 );

				} else {

				

					if ( entity.isBlock === false ) {

						const fontSize = 40;
						const strokeSize = 8;
						const font = 'bolder ' + fontSize + 'px Arial';

						const canvas = document.createElement( 'canvas' );

						const ctx = canvas.getContext( '2d' );

						ctx.font = font;

						canvas.width = ctx.measureText( name ).width + strokeSize * 2;
						canvas.height = fontSize + strokeSize * 2;

						ctx.font = font;

						ctx.fillStyle = 'white';
						ctx.textBaseline = 'top';
						ctx.textAlign = 'left';

						ctx.lineWidth = strokeSize;
						ctx.strokeText( name, strokeSize, strokeSize );

						ctx.fillText( name, strokeSize, strokeSize );

						const sprite = new THREE.Sprite( new THREE.SpriteMaterial( {
							map: new THREE.CanvasTexture( canvas ),
							sizeAttenuation: false,
							fog: false,
							depthTest: false,
							depthWrite: false
						} ) );

						sprite.scale.y = 0.035;
						sprite.scale.x = sprite.scale.y * canvas.width / canvas.height;

						sprite.position.y = sprite.scale.y + 0.1;

						entity.add( sprite );

						entity.mySprite = sprite;

					}

				}

				entity.add( box );

				entity.myBox = box;

			}

			if ( entity.isPlayer ) {

				entity.myBox.visible = showPlayers;

			}

		}

	}

}

window.requestAnimationFrame = new Proxy( window.requestAnimationFrame, {
	apply( target, thisArgs, args ) {

		args[ 0 ] = new Proxy( args[ 0 ], {
			apply() {


					animate();



				return Reflect.apply( ...arguments );

			}
		} );

		return Reflect.apply( ...arguments );

	}
} );





