// ==UserScript==
// @name         voxoim.io Wireframe View cant work
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Let's you see players behind walls. やったるでぇ
// @author       DOFURA (DFR)
// @match        *://voxiom.io/*
// @icon         https://www.google.com/s2/favicons?domain=voxiom.io
// @grant        none
// @run-at       document-start
// @antifeature  ads
// @downloadURL https://update.greasyfork.org/scripts/457716/voxoimio%20Wireframe%20View%20cant%20work.user.js
// @updateURL https://update.greasyfork.org/scripts/457716/voxoimio%20Wireframe%20View%20cant%20work.meta.js
// ==/UserScript==
 
let wireframeEnabled = true;

const WebGL = WebGL2RenderingContext.prototype;

HTMLCanvasElement.prototype.getContext = new Proxy( HTMLCanvasElement.prototype.getContext, {
	apply( target, thisArgs, args ) {
 
		if ( args[ 1 ] ) {
 
			args[ 1 ].preserveDrawingBuffer = true;
 
		}
 
		return Reflect.apply( ...arguments );
 
	}
} );
 
WebGL.shaderSource = new Proxy( WebGL.shaderSource, {
	apply( target, thisArgs, args ) {
 
		if ( args[ 1 ].indexOf( 'gl_Position' ) > - 1 ) {
 
			args[ 1 ] = args[ 1 ].replace( 'void main', `
 
				out float vDepth; 
				uniform bool enabled; 
				uniform float threshold;
 
				void main
 
			` ).replace( /return;/, `
 
				vDepth = gl_Position.z; 
 
				if ( enabled && vDepth > threshold ) { 
 
					gl_Position.z = 1.0; 
 
				}
 
			` );
 
		} else if ( args[ 1 ].indexOf( 'SV_Target0' ) > - 1 ) {
 
			args[ 1 ] = args[ 1 ].replace( 'void main', `
 
				in float vDepth; 
				uniform bool enabled; 
				uniform float threshold; 
 
				void main
 
			` ).replace( /return;/, `
 
				if ( enabled && vDepth > threshold ) { 
 
					SV_Target0 = vec4( 1.0, 0.0, 0.0, 1.0 ); 
 
				}
 
			` );
 
		}
 
		return Reflect.apply( ...arguments );
 
	}
} );
 
WebGL.getUniformLocation = new Proxy( WebGL.getUniformLocation, {
	apply( target, thisArgs, [ program, name ] ) {
 
		const result = Reflect.apply( ...arguments );
 
		if ( result ) {
 
			result.name = name;
			result.program = program;
 
		}
 
		return result;
 
	}
} );
 
WebGL.uniform4fv = new Proxy( WebGL.uniform4fv, {
	apply( target, thisArgs, args ) {
 
		if ( args[ 0 ].name === 'hlslcc_mtx4x4unity_ObjectToWorld' ) {
 
			args[ 0 ].program.isUIProgram = true;
 
		}
 
		return Reflect.apply( ...arguments );
 
	}
} );
 
let movementX = 0, movementY = 0;
let count = 0;
 