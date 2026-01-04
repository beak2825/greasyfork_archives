// ==UserScript==
// @name         DigDig.IO/DigWorm.IO Effects
// @namespace    http://tampermonkey.net/
// @version      0.2.5
// @description  3D, particles and glow effect for DigDig.IO and DigWorm.IO. Use num keys from 1 to 3 to toggle effects
// @author       Zertalious (Zert)
// @match        *://digdig.io/*
// @match        *://digworm.io/*
// @icon         https://www.google.com/s2/favicons?domain=digdig.io
// @grant        none
// @require      https://unpkg.com/three@0.120.0/build/three.min.js
// @require      https://unpkg.com/three@0.120.0/examples/js/postprocessing/EffectComposer.js
// @require      https://unpkg.com/three@0.120.0/examples/js/postprocessing/RenderPass.js
// @require      https://unpkg.com/three@0.120.0/examples/js/postprocessing/UnrealBloomPass.js
// @require      https://unpkg.com/three@0.120.0/examples/js/postprocessing/ShaderPass.js
// @require      https://unpkg.com/three@0.120.0/examples/js/shaders/LuminosityHighPassShader.js
// @require      https://unpkg.com/three@0.120.0/examples/js/shaders/CopyShader.js
// @downloadURL https://update.greasyfork.org/scripts/429166/DigDigIODigWormIO%20Effects.user.js
// @updateURL https://update.greasyfork.org/scripts/429166/DigDigIODigWormIO%20Effects.meta.js
// ==/UserScript==

window.enable3d = true;

window.enableParticles = function ( bool ) {

	if ( bool === undefined ) {

		bool = ! particlesEnabled();

	}

	maskMaterial.uniforms.enableParticles.value = bool;

}

window.enableGlow = function ( bool ) {

	if ( bool === undefined ) {

		bool = ! glowEnabled();

	}

	maskMaterial.uniforms.enableGlow.value = bool;

}

window.addEventListener( 'keyup', function ( event ) {

	const key = String.fromCharCode( event.keyCode );

	switch ( key ) {

		case '1' : enable3d = ! enable3d; break;
		case '2' : enableGlow(); break;
		case '3' : enableParticles(); break;

	}

} );

const canvas = document.getElementById( 'canvas' );
canvas.style.opacity = '0';

const particleColor = '#0000ff';

CanvasRenderingContext2D.prototype.fillRect = new Proxy( CanvasRenderingContext2D.prototype.fillRect, {
	apply( target, ctx, args ) {

		if ( ctx.globalAlpha <= 1 ) {

			if ( ctx.fillStyle === '#000000' ) {

				return;

			} if ( particlesEnabled() ) {

				if ( ctx.getTransform().d < 20 ) {

					ctx.fillStyle = '#00' + Math.floor( ctx.globalAlpha * 256 ).toString( 16 ).padStart( 2, '0' ) + 'ff';
					ctx.globalAlpha = 1;

				}

			}

		}

		return Reflect.apply( ...arguments );

	}
} );

const Canvas = window.OffscreenCanvas ? OffscreenCanvas.prototype : HTMLCanvasElement.prototype;

Canvas.getContext = new Proxy( Canvas.getContext, {
	apply( target, canvas, args ) {

		const ctx = Reflect.apply( ...arguments );

		ctx.fillRect = new Proxy( ctx.fillRect, {
			apply( target, thisArgs, args ) {

				if ( ctx.globalAlpha < 1 ) {

					if ( ctx.fillStyle === '#000000' ) {

						return;

					}

				}

				return Reflect.apply( ...arguments );

			}
		} );

		return ctx;

	}
} );

window.Image = new Proxy( window.Image, {
	construct( target, thisArgs, args ) {

		const image = Reflect.construct( ...arguments );

		image.crossOrigin = 'anonymous';

		return image;

	}
} );

const renderer = new THREE.WebGLRenderer( { antialias: true, preserveDrawingBuffer: true } );

renderer.domElement.style.position = 'absolute';
renderer.domElement.style.left = '0';
renderer.domElement.style.top = '0';
renderer.domElement.style.pointerEvents = 'none';

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );

canvas.parentNode.insertBefore( renderer.domElement, canvas );

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 60, 1, 0.1, 1000 );

camera.position.z = Math.sin( camera.fov * Math.PI / 180 ) * 2;

const texture = new THREE.CanvasTexture( canvas );
texture.minFilter = texture.magFilter = THREE.NearestFilter;

scene.background = new THREE.Color( '#522e00' );

const ground = toVec3( scene.background );
const diamond = toVec3( '#31a59e' );
const gold = toVec3( '#a59e15' );
const lava = toVec3( '#a61906' );
const uranium = toVec3( '#32a430' );
const particle = toVec3( particleColor );
const grid = toVec3( '#4e2c00' );
const amethyst = toVec3( '#b332b5' );

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

			vec4 a;

			const int count = 20;

			for ( int i = 0; i <= count; i ++ ) {

				vec4 p = projectionMatrix * modelViewMatrix * vec4( vec3( vPosition.xy, float( i ) / float( count ) * depth ), 1.0 );

				vec4 b = texture2D( map, p.xy / p.w * 0.5 + 0.5 );

				if ( length( b.rgb - ${ground} ) < 0.1 || length( b.rgb - ${grid} ) < 0.1 ) {

					if ( i != count ) {

						b.a = 0.0;

					}

				} else if ( i != 0 ) {

					b.rgb = ${ground} * 0.8;

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
            value: 0.20
        }
    }
} );

const tessellation = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), material );
scene.add( tessellation );

const rtt = new THREE.WebGLRenderTarget( window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio );

const array = [ diamond, gold, lava, uranium, amethyst ];

let text = '';

for ( let i = 0; i < array.length; i ++ ) {

	text += 'length( ' + array[ i ] + ' - gl_FragColor.rgb ) > 0.1';

	if ( i < array.length - 1 ) {

		text += ' && ';

	}

}

const maskMaterial = new THREE.RawShaderMaterial( {
	vertexShader: `

	precision mediump float;

	attribute vec3 position;
	attribute vec2 uv;

	uniform mat4 projectionMatrix;
	uniform mat4 modelViewMatrix;

	varying vec2 vUv;

	void main() {

		gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		vUv = uv;

	}

	`,
	fragmentShader: `

	precision mediump float;

	uniform sampler2D texture;
	uniform bool enableParticles;
	uniform bool enableGlow;

	varying vec2 vUv;

	void main() {

		gl_FragColor = texture2D( texture, vUv );

		float value = length( ${particle} - gl_FragColor.rgb ) / 0.2;

		if ( enableParticles && gl_FragColor.r == 0.0 && gl_FragColor.b == 1.0 ) {

			gl_FragColor = vec4( 1.0, 1.0 - gl_FragColor.g, gl_FragColor.g * 0.5 + 0.5, 1.0 );

		} else if ( ! enableGlow || ${text} ) {

			gl_FragColor = vec4( 0.0 );

		}

	}

	`,
	uniforms: {
		texture: { value: undefined },
		enableParticles: { value: true },
		enableGlow: { value: true }
	}
} );

function toVec3( color ) {

	if ( color.isColor ) {

		return 'vec3(' + color.r + ', ' + color.g + ', ' + color.b + ')';

	} else {

		const [ r, g, b ] = toRGB( color );

		return 'vec3(' + r + ', ' + g + ', ' + b + ')';

	}

}

function toRGB( hex ) {

	return [
		parseInt( hex.slice( 1, 3 ), 16 ) / 255,
		parseInt( hex.slice( 3, 5 ), 16 ) / 255,
		parseInt( hex.slice( 5, 7 ), 16 ) / 255
	]

}

const bloomScene = new THREE.Scene();
bloomScene.background = null;

const bloomCamera = new THREE.OrthographicCamera();

bloomCamera.position.z = 5;

const mask = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), maskMaterial );
bloomScene.add( mask );

const finalPass = new THREE.ShaderPass(
	new THREE.ShaderMaterial( {
		uniforms: {
			baseTexture: { value: null },
			originalTexture: { value: undefined }
		},
		vertexShader: `

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}

		`,
		fragmentShader: `

		uniform sampler2D baseTexture;
		uniform sampler2D originalTexture;

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( originalTexture, vUv ) + texture2D( baseTexture, vUv );

		}

		`,
		defines: {}
	} ), 'baseTexture'
);

const params = {
	exposure: 1,
	bloomStrength: 0.5,
	bloomThreshold: 0,
	bloomRadius: 0
};

const bloomPass = new THREE.UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
bloomPass.threshold = params.bloomThreshold;
bloomPass.strength = params.bloomStrength;
bloomPass.radius = params.bloomRadius;

const renderPass = new THREE.RenderPass( bloomScene, bloomCamera );

const composer = new THREE.EffectComposer( renderer );
composer.addPass( renderPass );
composer.addPass( bloomPass );
composer.addPass( finalPass );

window.addEventListener( 'resize', function () {

	composer.setSize( window.innerWidth, window.innerHeight );

	renderer.setSize( window.innerWidth, window.innerHeight );

	rtt.setSize( window.innerWidth, window.innerHeight );

	render();

} );

window.requestAnimationFrame = new Proxy( window.requestAnimationFrame, {
	apply( target, thisArgs, args ) {

		args[ 0 ] = new Proxy( args[ 0 ], {
			apply() {

				Reflect.apply( ...arguments );

				render();

			}
		} )

		Reflect.apply( ...arguments );

	}
} );

function particlesEnabled() {

	return maskMaterial.uniforms.enableParticles.value === true;

}

function glowEnabled() {

	return maskMaterial.uniforms.enableGlow.value === true;

}

function render() {

	if ( ! ( enable3d || glowEnabled() || particlesEnabled() ) ) {

		if ( canvas.style.opacity === '0' ) {

			canvas.style.opacity = '1';
			renderer.domElement.style.display = 'none';

		}

		return;

	} else {

		if ( canvas.style.opacity === '1' ) {

			canvas.style.opacity = '0';
			renderer.domElement.style.display = '';

		}

	}

	texture.needsUpdate = true;

	bloomPass.strength = ( Math.sin( Date.now() / 150 ) * 0.5 + 0.5 ) * 0.75 + 0.5;

	if ( enable3d ) {

		finalPass.material.uniforms.originalTexture.value = maskMaterial.uniforms.texture.value = rtt.texture;

		renderer.setRenderTarget( rtt );
		renderer.render( scene, camera );

		renderer.setRenderTarget( null );

	} else {

		finalPass.material.uniforms.originalTexture.value = maskMaterial.uniforms.texture.value = texture;

	}

	composer.render();

}