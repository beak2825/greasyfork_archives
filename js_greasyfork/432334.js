// ==UserScript==
// @name         Arras.IO/Diep.IO 3D Effect
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  3D effect for arras.io and diep.io. No performance issues!
// @author       Zertalious (Zert)
// @match        *://diep.io/*
// @match        *://arras.io/*
// @icon         https://www.google.com/s2/favicons?domain=diep.io
// @grant        none
// @require      https://unpkg.com/three@latest/build/three.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/432334/ArrasIODiepIO%203D%20Effect.user.js
// @updateURL https://update.greasyfork.org/scripts/432334/ArrasIODiepIO%203D%20Effect.meta.js
// ==/UserScript==

window.Image = new Proxy( window.Image, {
	construct() {

		const result = Reflect.construct( ...arguments ); 

		result.crossOrigin = 'anonymous';

		return result;

	}
} );

const canvas = document.getElementById( 'canvas' );

canvas.style.opacity = '0';

const renderer = new THREE.WebGLRenderer( { alpha: true } );

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );

renderer.domElement.style.position = 'absolute';
renderer.domElement.style.left = '0';
renderer.domElement.style.top = '0';
renderer.domElement.style.pointerEvents = 'none';

canvas.parentNode.insertBefore( renderer.domElement, canvas );

const scene = new THREE.Scene();

scene.background = new THREE.Color( 'red' );

const camera = new THREE.PerspectiveCamera( 60, 1, 0.1, 1000 );

camera.position.z = Math.sin( Math.PI / 3 ) * 2;

const texture = new THREE.CanvasTexture( canvas );

texture.minFilter = texture.magFilter = THREE.LinearFilter;

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

		uniform sampler2D mainTexture;
		uniform float depth;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		varying vec3 vPosition;

		void main() {

			vec3 groundColor = vec3( 0.803921568627451, 0.803921568627451, 0.803921568627451 );
			vec3 red = vec3( 0.8666666666666667, 0.6745098039215687, 0.6784313725490196 );
		
			vec4 a, b;

			const int count = 20;

			for ( int i = 0; i <= count; i ++ ) {

				vec3 position = vec3( vPosition.xy, float( i ) / float( count ) * depth );

				vec4 transformed = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				vec2 uv = transformed.xy / transformed.w * 0.5 + 0.5;

				if ( uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0 ) {

					b = vec4( groundColor, 1.0 ); 

				} else {

					b = texture2D( mainTexture, uv );

				}

				if ( length( b.rgb - groundColor ) < 0.22 || length( b.rgb - red ) < 0.1 ) {

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
		mainTexture: { value: texture },
		depth: { value: 0.2 }
    }
} );

const geometry = new THREE.PlaneGeometry( 2, 2 );

const mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );

window.addEventListener( 'resize', function () {

	renderer.setSize( window.innerWidth, window.innerHeight );

}, false );

function animate() {

	texture.needsUpdate = true;

	renderer.render( scene, camera );

	window.requestAnimationFrame( animate );

}

animate();