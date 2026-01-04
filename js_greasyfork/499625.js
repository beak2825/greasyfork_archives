// ==UserScript==
// @name         Wallhack
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description Join https://discord.gg/E3z883VjKB for unreleased hacks and client hacks
// @author      Graphicardeater
// @match        *://kour.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499625/Wallhack.user.js
// @updateURL https://update.greasyfork.org/scripts/499625/Wallhack.meta.js
// ==/UserScript==
 
( function() {
	'use strict';
 
	const WebGL = WebGL2RenderingContext.prototype;
	HTMLCanvasElement.prototype.getContext = new Proxy( HTMLCanvasElement.prototype.getContext, {
		apply( target, thisArgs, args ) {
			return Reflect.apply( ...arguments );
 
		}
	} );
	if( window.observer != undefined ) {
		window.observer.disconnect();
	}
	window.MutationObserver = {
		observe : function() {
			console.log( "Observed" );
		}
	};
	if( window.location.href.indexOf( "/a" ) != -1 ) {
		window.location.href = "https://kour.io";
	}
	var gl = null;
	const handler = {
		apply( target, thisArgs, args ) {
			const program = thisArgs.getParameter( thisArgs.CURRENT_PROGRAM );
 
			if( !program.uniforms ) {
 
				program.uniforms = {
					enabled: thisArgs.getUniformLocation( program, 'enabled' ),
					threshold: thisArgs.getUniformLocation( program, 'threshold' )
				};
 
			}
			var couldBePlayer = true;
			var threshold = 4.6;
			program.uniforms.enabled && thisArgs.uniform1i( program.uniforms.enabled, couldBePlayer );
			program.uniforms.threshold && thisArgs.uniform1f( program.uniforms.threshold, threshold );
			if( couldBePlayer ) {
				gl = thisArgs;
			}
 
			Reflect.apply( ...arguments );
 
		}
	};
 
	WebGL.drawElements = new Proxy( WebGL.drawElements, handler );
	WebGL.drawElementsInstanced = new Proxy( WebGL.drawElementsInstanced, handler );
 
	WebGL.shaderSource = new Proxy( WebGL.shaderSource, {
		apply( target, thisArgs, args ) {
			let [ shader, src ] = args;
			if( src.indexOf( 'gl_Position' ) > - 1 ) {
				if ( src.indexOf( 'OutlineEnabled' ) > - 1 ) {
					shader.isPlayerShader = true;
				}
				src = src.replace( `void main()
{`, `
					out float vDepth;
					out float enabled;
					uniform float threshold;
 
					void main() {
						enabled = 0.1;
 
					` );
				if( src.indexOf( "hlslcc_mtx4x4unity_WorldToObject" ) != -1 && src.indexOf( "_MaskSoftnessX" ) == -1
					&& src.indexOf( "vs_TEXCOORD5.xyz = unity_SHC.xyz * vec3(u_xlat16_2) + u_xlat16_3.xyz;" ) != -1
					&& src.indexOf( "_DetailAlbedoMap_ST" ) != -1
					&& src.indexOf( "vs_TEXCOORD1.w = 0.0;" ) != -1
				) {
					src = src.replace( "enabled = 0.0", `enabled = 1.0;
						if( in_POSITION0.y > 10.0 ) {
							//enabled = 2.0;
						}` );
					src = src.replace( /return;/, `
						gl_Position.z = 0.01 + gl_Position.z * 0.1;
					` );
				}
 
			} else if ( src.indexOf( 'SV_Target0' ) > - 1 ) {
				src = src.replace( 'void main', `
 
				in float vDepth;
				in float enabled;
 
				void main
 
				` ).replace( /return;/, `
 
				if( enabled > 0.5 && SV_Target0.a == 1.0 ) {
 
					SV_Target0 = mix( SV_Target0 * 0.8, vec4( 1.0, 0.0, 0.0, 1.0 ), 0.4 );
					if( enabled > 0.5 ) {
						//SV_Target0.xyz = vec3( 1.0, 0.0, 0.0 );
					}
					SV_Target0.a = 1.0;
 
				}
 
				` );
			}
			args[ 1 ] = src;
			return Reflect.apply( ...arguments );
		}
	} );
} )();