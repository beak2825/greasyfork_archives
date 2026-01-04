// ==UserScript==
// @name         Diep.IO 3D
// @namespace    http://tampermonkey.net/
// @version      0.0.8
// @description  Turns diep.io into real 3D
// @author       Zertalious (Zert)
// @match        *://diep.io/*
// @icon         https://www.google.com/s2/favicons?domain=diep.io
// @grant        none
// @require      https://unpkg.com/three@0.130.0/build/three.min.js
// @require      https://unpkg.com/three@0.130.0/examples/js/controls/OrbitControls.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/432833/DiepIO%203D.user.js
// @updateURL https://update.greasyfork.org/scripts/432833/DiepIO%203D.meta.js
// ==/UserScript==

const OUTLINE_LAYER = 0;
const MAIN_LAYER = 1;

let canvas = {};

let renderer, scene, camera;
let ortho;

let currentCamera;

let controls;

init();

const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();

const materialParams = { transparent: true };

let materialIndex = 0;

const outlineMaterial = new THREE.MeshBasicMaterial( materialParams );

const materials = [
	new THREE.MeshToonMaterial( materialParams ), 
	new THREE.MeshLambertMaterial( materialParams ),
	new THREE.MeshPhongMaterial( materialParams ), 
	outlineMaterial
];

function onBeforeCompile( shader ) {

	shader.vertexShader = shader.vertexShader.replace( 'void', `

		attribute vec2 scale;
		attribute float alpha;

		varying float vAlpha;

	void` ).replace( '<begin_vertex>', `<begin_vertex>

		if ( scale.x != 0.0 && scale.y != 0.0 ) {

			if ( transformed.x == 1.0 || transformed.x == 0.5 ) {

				transformed.yz *= scale.x;

			} else if ( transformed.x == - 1.0 || transformed.x == - 0.5 ) {

				transformed.yz *= scale.y;

			}

		}

		vAlpha = alpha;

	` );

	shader.fragmentShader = shader.fragmentShader.replace( 'void', `

		varying float vAlpha;

	void` ).replace( '}', `

		gl_FragColor.a *= vAlpha;

	}` );

}

for ( let i = 0; i < materials.length; i ++ ) {

	materials[ i ].onBeforeCompile = onBeforeCompile;

}

const instances = {};

const array = [ {
	name: 'sphere', 
	geometry: new THREE.SphereGeometry( 1, 16 ), 
	count: 150
}, {
	name: 'cylinder', 
	geometry: new THREE.CylinderGeometry( 0.5, 0.5, 1, 16 ).rotateZ( Math.PI / 2 ), 
	count: 75, 
	hasScaling: true
}, {
	name: 'poly3', 
	geometry: new THREE.CylinderGeometry( 1, 1, 1, 3, 1, false, - Math.PI / 6 ).rotateX( Math.PI / 2 ), 
	count: 75
}, {
	name: 'poly4', 
	geometry: new THREE.BoxGeometry( 1, 1, 1 ), 
	count: 75
}, {
	name: 'poly5', 
	geometry: new THREE.CylinderGeometry( 1, 1, 1, 5, 1, false, Math.PI / 10 ).rotateX( Math.PI / 2 ), 
	count: 40
}, {
	name: 'poly6', 
	geometry: new THREE.CylinderGeometry( 1, 1, 1, 6, 1, false, - Math.PI / 12 ).rotateX( Math.PI / 2 ),
	count: 10
} ];

for ( let i = 0; i < array.length; i ++ ) {

	const { name, geometry, count, hasScaling } = array[ i ];

	if ( hasScaling ) {

		geometry.setAttribute( 'scale', new THREE.InstancedBufferAttribute( new Float32Array( count * 2 ), 2 ) );

	}

	geometry.setAttribute( 'alpha', new THREE.InstancedBufferAttribute( new Float32Array( count ), 1 ) );

	const main = new THREE.InstancedMesh( geometry, materials[ materialIndex ], count );
	main.layers.set( MAIN_LAYER );
	scene.add( main );

	const outline = new THREE.InstancedMesh( geometry, outlineMaterial, count );
	outline.layers.set( OUTLINE_LAYER );
	scene.add( outline );

	main.setColorAt( 0, tempColor );
	outline.setColorAt( 0, tempColor );

	instances[ name ] = {
		main, 
		outline, 
		count, 
		hasScaling, 
		index: 0
	};

}

const stack = [];

function getStack( index ) {

	const result = stack[ stack.length - 1 - index ];

	if ( result ) {

		return result;

	}

	return { name: 'none' };

}

function setObject( name, x, y, z, sx, sy, sz, angle, color, alpha = 1, scaleX = 1, scaleY = 1 ) {

	tempObject.position.set( x, y, z );
	tempObject.scale.set( sx, sy, sz );
	tempObject.rotation.set( 0, 0, angle );

	tempObject.updateMatrix();

	tempColor.set( color );

	const instance = instances[ name ];

	instance.main.setMatrixAt( instance.index, tempObject.matrix );
	instance.main.setColorAt( instance.index, tempColor );

	instance.main.geometry.attributes.alpha.setX( instance.index, alpha );
	instance.outline.geometry.attributes.alpha.setX( instance.index, alpha );

	const outlineSize = 4 / window.innerHeight * ( name === 'sphere' ? 0.7 : 1 );

	if ( instance.hasScaling ) {

		tempObject.scale.x += outlineSize;
		tempObject.scale.y += outlineSize / scaleY;
		tempObject.scale.z += outlineSize / scaleY;

	} else {

		tempObject.scale.addScalar( outlineSize );

	}

	tempObject.updateMatrix();

	tempColor.multiplyScalar( 0.6 );

	instance.outline.setMatrixAt( instance.index, tempObject.matrix );
	instance.outline.setColorAt( instance.index, tempColor );

	if ( instance.hasScaling ) {

		instance.main.geometry.attributes.scale.setXY( instance.index, scaleX, scaleY );
		instance.outline.geometry.attributes.scale.setXY( instance.index, scaleX, scaleY );

	}

	instance.index ++;

	stack.push( { name, x, y, z, sx, sy, sz, angle, color, outlineSize, alpha } );

}

function init() {

	window.addEventListener( 'DOMContentLoaded', function () {
	
		canvas = document.getElementById( 'canvas' );

		renderer = new THREE.WebGLRenderer( { 
			antialias: true, 
			alpha: true 
		} );

		renderer.autoClear = false;

		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( canvas.width, canvas.height, false );

		controls = new THREE.OrbitControls( camera, canvas );

		controls.enabled = false;

		window.addEventListener( 'resize', onWindowResize );
	
	} );

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );

	ortho = new THREE.OrthographicCamera( - camera.aspect / 2, camera.aspect / 2, 0.5, - 0.5, 0, 1000 );

	currentCamera = camera;

	const oldZ = Math.sin( Math.PI / 3 );
	camera.position.z = ortho.position.z = oldZ;

	const ambLight = new THREE.AmbientLight( 0xffffff, 0.5 );
	ambLight.layers.set( MAIN_LAYER );
	scene.add( ambLight );

	const dirLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
	dirLight.layers.set( MAIN_LAYER );
	dirLight.position.z = 1;
	scene.add( dirLight );

	window.addEventListener( 'keyup', function ( event ) {

		const key = String.fromCharCode( event.keyCode );

		if ( key === 'V' ) {

			controls.enabled = ! controls.enabled;

			if ( ! controls.enabled ) {

				camera.position.set( 0, 0, oldZ );
				camera.rotation.set( 0, 0, 0 );

				controls.target.set( 0, 0, 0 );

				ortho.position.set( 0, 0, oldZ );
				ortho.rotation.set( 0, 0, 0 );

				ortho.zoom = 1;

			}

		} else if ( key === 'P' ) {

			currentCamera = currentCamera === camera ? ortho : camera;

			currentCamera.position.copy( controls.object.position );
			currentCamera.rotation.copy( controls.object.rotation );

			controls.object = currentCamera;

		} else if ( key === 'B' ) {

			materialIndex = ( materialIndex + 1 ) % materials.length;

			for ( let key in instances ) {

				instances[ key ].main.material = materials[ materialIndex ];

			}

		}

	} );

}

function onWindowResize() {

	renderer.setSize( canvas.width, canvas.height, false );
	
	camera.aspect = canvas.width / canvas.height;
	camera.updateProjectionMatrix();

	ortho.left = - camera.aspect / 2;
	ortho.right = camera.aspect / 2;
	ortho.updateProjectionMatrix();

}

window.requestAnimationFrame = new Proxy( window.requestAnimationFrame, {
	apply( target, thisArgs, args ) {

		args[ 0 ] = new Proxy( args[ 0 ], {
			apply( target, thisArgs, args ) {

				stack.length = 0;

				tempObject.position.setScalar( 0 );
				tempObject.scale.setScalar( 0 );
				tempObject.rotation.set( 0, 0, 0 );

				tempObject.updateMatrix();

				tempColor.setRGB( 0, 0, 0 );

				for ( let key in instances ) {

					const { main, outline, count, hasScaling } = instances[ key ];

					for ( let i = 0; i < count; i ++ ) {

						main.setMatrixAt( i, tempObject.matrix );
						outline.setMatrixAt( i, tempObject.matrix );

					}

					main.instanceMatrix.needsUpdate = true;
					main.instanceColor.needsUpdate = true;

					outline.instanceMatrix.needsUpdate = true;
					outline.instanceColor.needsUpdate = true;

					if ( hasScaling ) {

						main.geometry.attributes.scale.needsUpdate = true;
						outline.geometry.attributes.scale.needsUpdate = true;

					}

					main.geometry.attributes.alpha.needsUpdate = true;
					outline.geometry.attributes.alpha.needsUpdate = true;

					instances[ key ].index = 0;

				}

				arcCounter = 0;
				renderCounter = 0;

				Reflect.apply( ...arguments );


			}
		} );

		return Reflect.apply( ...arguments );

	}
} );

const Context2D = CanvasRenderingContext2D.prototype;

let arcCounter = 0;

Context2D.arc = new Proxy( Context2D.arc, {
	apply( target, thisArgs, args ) {

		if ( args[ 4 ] === Math.PI * 2 ) {

			if ( arcCounter === 0 ) {

				const matrix = thisArgs.getTransform();

				const r = matrix.a / canvas.height;

				const x = ( matrix.e / canvas.width - 0.5 ) * camera.aspect;
				const y = 0.5 - matrix.f / canvas.height;

				let z = 0;

				const s0 = getStack( 0 );
				const s1 = getStack( 1 );

				if ( s0.name === 'cylinder' && s1.name === 'sphere' && Math.hypot( x - s1.x, y - s1.y ) < 0.001 ) {

					z = s1.sz;

					const index = ( instances.cylinder.index - 1 ) * 16 + 14;

					const newDepth = z + r - s0.sz / 2;

					instances.cylinder.main.instanceMatrix.array[ index ] = newDepth;
					instances.cylinder.outline.instanceMatrix.array[ index ] = newDepth;

				} else myBlock: {

					if ( getStack( 0 ).name === 'cylinder' && 
						getStack( 1 ).name === 'sphere' && 
						getStack( 2 ).name === 'cylinder' &&
						getStack( 3 ).name === 'sphere' &&
						getStack( 4 ).name === 'cylinder' &&
						getStack( 5 ).name === 'poly3' &&
						getStack( 6 ).name === 'cylinder' ) {

						z = getStack( 5 ).sz / 2;

						const tr = getStack( 2 ).sz;

						for ( let i = 0; i < 3; i ++ ) {

							const index = ( instances.cylinder.index - 1 - i ) * 16 + 14;

							const newDepth = z + r - tr / 2;

							instances.cylinder.main.instanceMatrix.array[ index ] = newDepth;
							instances.cylinder.outline.instanceMatrix.array[ index ] = newDepth;

						}

						for ( let i = 0; i < 2; i ++ ) {

							const index = ( instances.sphere.index - 1 - i ) * 16 + 14;

							instances.sphere.main.instanceMatrix.array[ index ] = z;
							instances.sphere.outline.instanceMatrix.array[ index ] = z;

						}

						break myBlock;

					}

					for ( let i = 0; i < 5; i ++ ) {

						if ( getStack( i ).name !== 'cylinder' ) {

							break myBlock;

						}

					}

					if ( getStack( 0 ).angle !== getStack( 2 ).angle ) {

						break myBlock;

					}

					const a = r - getStack( 0 ).sy;

					for ( let i = 0; i < 5; i ++ ) {

						const index = ( instances.cylinder.index - 1 - i ) * 16 + 14;

						const newDepth = a - a * 2 * i / 4;

						instances.cylinder.main.instanceMatrix.array[ index ] = newDepth;
						instances.cylinder.outline.instanceMatrix.array[ index ] = newDepth;

					}

				}

				checkIfIsMainCanvas( thisArgs, 'sphere' );

				setObject( 
					'sphere',  
					x, 
					y, 
					z, 
					r, 
					r, 
					r, 
					0, 
					thisArgs.fillStyle, 
					thisArgs.globalAlpha
				);

			} else if ( arcCounter === 1 ) {

				tempColor.set( thisArgs.fillStyle );
				instances.sphere.main.setColorAt( instances.sphere.index - 1, tempColor );

				tempColor.multiplyScalar( 0.6 );
				instances.sphere.outline.setColorAt( instances.sphere.index - 1, tempColor );

			}

			arcCounter = ( arcCounter + 1 ) % 3;

		}

		return Reflect.apply( ...arguments );

	}
} );

Context2D.rect = new Proxy( Context2D.rect, {
	apply( target, thisArgs, args ) {

		const matrix = thisArgs.getTransform();

		const isTurret = matrix.b !== 0 && matrix.c !== 0;

		if ( isTurret || ( thisArgs.canvas === canvas && Math.hypot( matrix.c, matrix.d ) > 100 && thisArgs.globalAlpha === 1 ) ) {

			const center = new DOMPoint( 0.5, 0.5 ).matrixTransform( matrix );

			const scaleYZ = Math.hypot( matrix.c, matrix.d ) / canvas.height;

			const name = isTurret ? 'cylinder' : 'poly4';

			checkIfIsMainCanvas( thisArgs, name );

			setObject(
				name, 
				( center.x / canvas.width - 0.5 ) * camera.aspect, 
				0.5 - center.y / canvas.height, 
				isTurret ? 0 : 0.05, 
				Math.hypot( matrix.a, matrix.b ) / canvas.height, 
				scaleYZ, 
				isTurret ? scaleYZ : 0.1, 
				Math.atan2( matrix.c, matrix.d ), 
				thisArgs.fillStyle, 
				thisArgs.globalAlpha
			);

		}

		return Reflect.apply( ...arguments );

	}
} );

const points = [];
let hasCurve = true;

Context2D.beginPath = new Proxy( Context2D.beginPath, {
	apply( target, thisArgs, args ) {

		points.length = 0;
		hasCurve = false;

		return Reflect.apply( ...arguments );

	}
} );

const addPoint = {
	apply( target, thisArgs, [ x, y ] ) {

		points.push( new DOMPoint( x, y ).matrixTransform( thisArgs.getTransform() ) );

		return Reflect.apply( ...arguments );

	}
};

Context2D.moveTo = new Proxy( Context2D.moveTo, addPoint );
Context2D.lineTo = new Proxy( Context2D.lineTo, addPoint );

Context2D.arc = new Proxy( Context2D.arc, {
	apply( target, thisArgs, args ) {

		hasCurve = true;

		return Reflect.apply( ...arguments );

	}
} );

Context2D.fill = new Proxy( Context2D.fill, {
	apply( target, thisArgs, args ) {

		if ( ! hasCurve ) {

			if ( points.length > 2 && points.length < 7 ) myBlock: {

				const center = { x: 0, y: 0 };

				const count = points.length;

				for ( let i = 0; i < count; i ++ ) {

					center.x += points[ i ].x;
					center.y += points[ i ].y;

				}

				center.x /= count;
				center.y /= count;

				if ( points.length === 6 ) {

					const d1 = Math.hypot( points[ 0 ].x - center.x, points[ 0 ].y - center.y );
					const d2 = Math.hypot( points[ 1 ].x - center.x, points[ 1 ].y - center.y );

					if ( Math.abs( d1 - d2 ) > 0.01 ) {

						break myBlock;

					}

				}

				let s, sx, angle, scaleX, scaleY;

				let name = 'poly' + points.length;

				if ( points.length === 4 ) {

					const [ p0, p1, p2 ] = points;
					const pl = points[ points.length - 1 ];

					scaleX = Math.hypot( p1.x - p2.x, p1.y - p2.y ) / canvas.height;
					scaleY = Math.hypot( p0.x - pl.x, p0.y - pl.y ) / canvas.height;

					const dx = ( p1.x + p2.x ) / 2 - ( p0.x + pl.x ) / 2;
					const dy = ( p1.y + p2.y ) / 2 - ( p0.y + pl.y ) / 2;

					sx = Math.hypot( dx, dy ) / canvas.height;
					angle = Math.atan2( dx, dy ) - Math.PI / 2;

					if ( Math.abs( scaleX - scaleY ) > 0.001 ) {

						s = 1;
						name = 'cylinder';

					} else {

						s = sx = scaleY;

					}

				} else { 

					s = sx = Math.hypot( points[ 0 ].x - center.x, points[ 0 ].y - center.y ) / canvas.height;

					angle = - Math.atan2( points[ 0 ].y - center.y, points[ 0 ].x - center.x );

				}

				checkIfIsMainCanvas( thisArgs, name );

				setObject(
					name, 
					( center.x / canvas.width - 0.5 ) * camera.aspect, 
					0.5 - center.y / canvas.height, 
					0, 
					sx, 
					s, 
					s, 
					angle, 
					thisArgs.fillStyle, 
					thisArgs.globalAlpha, 
					scaleX, 
					scaleY
				);

			}

		}

		return Reflect.apply( ...arguments );

	}
} );

Context2D.fillText = new Proxy( Context2D.fillText, {
	apply( target, thisArgs, [ text ] ) {

		if ( text === 'diep.io' ) {

			thisArgs.canvas.isScoreboard = true;

		}

		return Reflect.apply( ...arguments );

	}
} );

let renderCounter = 0;

function render() {

	renderCounter ++;

	if ( renderCounter > 1 ) {

		console.log( renderCounter, '!!!!' );

	}

	renderer.clear();

	currentCamera.layers.set( OUTLINE_LAYER );

	renderer.render( scene, currentCamera );

	renderer.clearDepth();

	currentCamera.layers.set( MAIN_LAYER );

	renderer.render( scene, currentCamera );

}

function drawTexts( ctx ) {

	const texts = [ 'Diep3D by Zert', 'Also try triep.io & hornex.pro' ];

	const s = Math.min( ctx.canvas.width / 1200, ctx.canvas.height / 700 ) * 1.2;
	ctx.scale( s, s );

	ctx.translate( 10, 10 );

	ctx.font = 'bolder 11px Ubuntu';
	ctx.fillStyle = '#fff';
	ctx.strokeStyle = '#444';
	ctx.lineWidth = 2;

	ctx.textBaseline = 'top';
	ctx.textAlign = 'left';

	for ( let i = 0; i < texts.length; i ++ ) {
	
		const text = texts[ i ];

		ctx.strokeText( text, 0, 0 );
		ctx.fillText( text, 0, 0 );

		ctx.translate( 0, 14 );

	}

}

Context2D.drawImage = new Proxy( Context2D.drawImage, {
	apply( target, thisArgs, args ) {

		if ( args[ 0 ].isScoreboard && thisArgs.canvas.width === canvas.width && thisArgs.canvas.height === canvas.height ) {

			thisArgs.canvas.hasScoreboard = true;

		} else if ( args[ 0 ].hasScoreboard ) {

			render();

			thisArgs.save();
			thisArgs.globalAlpha = 1;
			thisArgs.setTransform( 1, 0, 0, 1, 0, 0 );

			Reflect.apply( target, thisArgs, [ renderer.domElement, 0, 0, canvas.width, canvas.height ] );

			drawTexts( thisArgs );

			thisArgs.restore();

		}

		if ( thisArgs.canvas === canvas && args[ 0 ].objects ) {

			const matrix = thisArgs.getTransform();

			const x = matrix.e / canvas.width;
			const y = matrix.f / canvas.height;

			const sx = Math.hypot( matrix.a, matrix.b );
			const sy = Math.hypot( matrix.c, matrix.d );

			for ( let i = 0; i < args[ 0 ].objects.length; i ++ ) {

				const { name, index } = args[ 0 ].objects[ i ];

				const instance = instances[ name ];

				const ma = instance.main.instanceMatrix.array;
				const oa = instance.outline.instanceMatrix.array;

				const idx = index * 16;

				const ox = ma[ idx + 12 ] / camera.aspect + 0.5;
				const oy = - ma[ idx + 13 ] + 0.5;

				const outlineOldSx = Math.hypot( oa[ idx + 0 ], oa[ idx + 1 ] );
				const outlineOldSy = Math.hypot( oa[ idx + 4 ], oa[ idx + 5 ] );

				const outlineSizeX = outlineOldSx - Math.hypot( ma[ idx + 0 ], ma[ idx + 1 ] );
				const outlineSizeY = outlineOldSy - Math.hypot( ma[ idx + 4 ], ma[ idx + 5 ] );

				ma[ idx + 0 ] *= sx;
				ma[ idx + 1 ] *= sx;
				ma[ idx + 4 ] *= sy;
				ma[ idx + 5 ] *= sy;
				ma[ idx + 10 ] *= sy;

				const nsx = Math.hypot( ma[ idx + 0 ], ma[ idx + 1 ] ) + outlineSizeX;
				const nsy = Math.hypot( ma[ idx + 4 ], ma[ idx + 5 ] ) + outlineSizeY;

				oa[ idx + 0 ] *= nsx / outlineOldSx;
				oa[ idx + 1 ] *= nsx / outlineOldSx;
				oa[ idx + 4 ] *= nsy / outlineOldSy;
				oa[ idx + 5 ] *= nsy / outlineOldSy;
				oa[ idx + 10 ] *= sy;

				ma[ idx + 12 ] = oa[ idx + 12 ] = ( ( ox * sx + x ) - 0.5 ) * camera.aspect;
				ma[ idx + 13 ] = oa[ idx + 13 ] = 0.5 - ( oy * sy + y );

				instance.main.geometry.attributes.alpha.array[ index ] = thisArgs.globalAlpha;
				instance.outline.geometry.attributes.alpha.array[ index ] = thisArgs.globalAlpha;

			}

			delete args[ 0 ][ 'objects' ];

		}

		return Reflect.apply( ...arguments );

	}
} );

function checkIfIsMainCanvas( ctx, name ) {

	if ( ctx.canvas !== canvas ) {

		const { index } = instances[ name ];

		if ( ctx.canvas.objects ) {

			ctx.canvas.objects.push( { name, index } );

		} else {

			ctx.canvas.objects = [ { name, index } ];

		}

	}

}