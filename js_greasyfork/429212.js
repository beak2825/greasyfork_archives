// ==UserScript==
// @name         DigDig.IO 3D Effect
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  3D effect for DigDig.IO
// @author       Zertalious (Zert)
// @match        *://digdig.io/*
// @icon         https://www.google.com/s2/favicons?domain=digdig.io
// @require      https://unpkg.com/three@latest/build/three.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429212/DigDigIO%203D%20Effect.user.js
// @updateURL https://update.greasyfork.org/scripts/429212/DigDigIO%203D%20Effect.meta.js
// ==/UserScript==

const CTX = CanvasRenderingContext2D.prototype;

CTX.createPattern = new Proxy( CTX.createPattern, {
	apply( target, thisArgs, args ) {

		console.log( args );

		return Reflect.apply( ...arguments );

	}
} )

const canvas = document.getElementById( 'canvas' );
canvas.style.opacity = '0';

const renderer = new THREE.WebGLRenderer( { alpha: true, preserveDrawingBuffer: true } );

renderer.domElement.style.position = 'absolute';
renderer.domElement.style.left = '0';
renderer.domElement.style.top = '0';
renderer.domElement.style.pointerEvents = 'none';

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );

document.body.insertBefore( renderer.domElement, canvas );

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 60, 1, 0.1, 10 );
camera.position.z = Math.sin( camera.fov * Math.PI / 180 ) * 2;

const texture = new THREE.CanvasTexture( canvas );
texture.minFilter = texture.magFilter = THREE.NearestFilter;

const material = new THREE.RawShaderMaterial( {
    vertexShader: `

		attribute vec3 position;

		varying vec3 vPosition;

		void main() {

			vPosition = position;

			gl_Position = vec4( position, 1.0 );

		}

		`,
    fragmentShader: `

		precision mediump float;

		uniform sampler2D map;
		uniform float depth;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		varying vec3 vPosition;

		void main() {

			vec3 groundColor = vec3( 0.32, 0.18, 0.0 );

			vec4 a;

			const int count = 20;

			for ( int i = 0; i <= count; i ++ ) {

				vec4 p = projectionMatrix * modelViewMatrix * vec4( vec3( vPosition.xy, float( i ) / float( count ) * depth ), 1.0 );

				vec4 b = texture2D( map, p.xy / p.w * 0.5 + 0.5 );

				if ( length( b.rgb - groundColor ) < 0.1 ) {

					if ( i != count ) {

						b.a = 0.0;

					}

				} else if ( i != 0 ) {

					b.rgb = groundColor * 0.8;

				}

				a.rgb = a.rgb * a.a + b.rgb * b.a * ( 1.0 - a.a );
				a.a = a.a + b.a * ( 1.0 - a.a );

			}

			gl_FragColor = a;

		}

		`,
    uniforms: {
        map: {
            value: texture
        },
        depth: {
            value: 0.25
        }
    }
} );

const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), material );
scene.add( mesh );

window.addEventListener( 'resize', function () {

	renderer.setSize( window.innerWidth, window.innerHeight );

	renderer.render( scene, camera );

} );

function animate() {

	requestAnimationFrame( animate );

	texture.needsUpdate = true;

	renderer.render( scene, camera );

}

animate();