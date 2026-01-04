// ==UserScript==
// @name         Vcid.lol | ryzemn#0001 discord
// @version      1
// @description  im gay
// @author       Ryzemn
// @namespace    no
// @match        https://1v1.lol/*
// @icon         https://www.google.com/s2/favicons?domain=1v1.lol
// @require      https://greasyfork.org/scripts/436749-wasm-patcher/code/wasm_patcher.js
// @downloadURL https://update.greasyfork.org/scripts/462515/Vcidlol%20%7C%20ryzemn0001%20discord.user.js
// @updateURL https://update.greasyfork.org/scripts/462515/Vcidlol%20%7C%20ryzemn0001%20discord.meta.js
// ==/UserScript==
 
const Log = function(msg) {
    console.log("1v1.www : " + msg);
};
 
const wasm = WebAssembly;
const oldInstantiate = wasm.instantiate; //
 
wasm.instantiate = async function(bufferSource, importObject) {
    const patcher = new WasmPatcher(bufferSource);
 
    patcher.aobPatchEntry({
        scan: 'B 20 1 20 1 28 ? ? 41 1 [ 6B ] 36 ? ? 41 84 D7 95 3',
        code: [
            OP.drop,
        ],
        onsuccess: () => Log('Infinite Ammo')
    });
 
    patcher.aobPatchEntry({
        scan: '2A ? ? | 38 ? ? C 2 B 20 0',
        code: [
            OP.drop,
            OP.f32.const, VAR.f32(0)
        ],
        onsuccess: () => Log('Rapid Fire')
    });
 
    patcher.aobPatchEntry({
 
        scan: '5 20 0 20 0 28 ? ? ? 20 1 [ 6B ] 36 ? ? ?',
        code: [
            OP.drop,
        ],
        onsuccess: () => Log('Infinite Armor')
    });
 
    if(new URLSearchParams( window.location.search ).get('TU9SRUhBQ0tT') === 'true') {
 
        alert('[FreeFly] is added');
 
        const pressSpaceKeyIndex = patcher.addGlobalVariableEntry({
            type: 'u32',
            value: 0,
            mutability: true,
            exportName: 'PRESS_SPACE_KEY'
        });
 
        patcher.aobPatchEntry({
            scan: '4 40 20 B 20 1D 38 2 0 20 F 20 1E [ 38 2 0 ]',
            code: [
                OP.global.get, pressSpaceKeyIndex,
                OP.i32.const, VAR.s32(1),
                OP.i32.eq,
                OP.if,
                    OP.local.get, VAR.u32(15),
                    OP.f32.const, VAR.f32(2.5),
                    OP.f32.store, VAR.u32(2), VAR.u32(0),
                OP.end
            ],
            onsuccess: () => Log('Free Fly (offline)')
        });
 
        patcher.aobPatchEntry({
            scan: '4 40 20 6 21 3 B 20 1A 20 21 38 2 0 20 F 20 22 [ 38 2 0 ]',
            code: [
                OP.drop,
                OP.drop,
                OP.global.get, pressSpaceKeyIndex,
                OP.i32.const, VAR.s32(1),
                OP.i32.eq,
                OP.if,
                    OP.local.get, VAR.u32(15),
                    OP.f32.const, VAR.f32(2.5),
                    OP.f32.store, VAR.u32(2), VAR.u32(0),
                OP.end
            ],
            onsuccess: () => Log('Free Fly (online)')
        });
    }
 
    const result = await oldInstantiate(patcher.patch(), importObject);
 
    if(new URLSearchParams( window.location.search ).get('TU9SRUhBQ0tT') === 'true') {
        const exports = result.instance.exports;
 
        const pressSpaceKey = exports.PRESS_SPACE_KEY;
 
        document.addEventListener('keydown', evt => evt.code === 'Space' && (pressSpaceKey.value = 1));
        document.addEventListener('keyup', evt => evt.code === 'Space' && (pressSpaceKey.value = 0));
 
        localStorage.removeItem('TU9SRUhBQ0tT');
    }
 
    return result;
};
 
if(new URLSearchParams( window.location.search ).get('TU9SRUhBQ0tT') === 'true') return;
 
const $moreHacks = document.createElement('a');
const $ads = document.querySelector('ads');
$moreHacks.innerText = 'Made By | ryzemn#0001 ON DISCORD';
$moreHacks.style.display = 'flex';
$moreHacks.style.position = 'absolute';
$moreHacks.style.zIndex = '50';
$moreHacks.style.color = 'black';
$moreHacks.style.cursor = 'pointer';
document.body.prepend($moreHacks);
 
 
 
 
    var MODMENU = document.createElement('MODMENU');
    MODMENU.innerText = 'ESP';
MODMENU.style.display = 'flex';
MODMENU.style.position = 'absolute';
MODMENU.style.zIndex = '100';
MODMENU.style.color = 'black';
MODMENU.style.cursor = 'pointer';
document.body.prepend(MODMENU);
 
 
 
MODMENU.onclick = function() {
    espEnabled = ! espEnabled;
};
 
let espEnabled = true;
let wireframeEnabled = false;
let shield = true;
 
const WebGL = WebGL2RenderingContext.prototype;
 
const uniformName = 'myUniform';
 
WebGL.shaderSource = new Proxy( WebGL.shaderSource, {
    apply( target, thisArgs, args ) {
 
        const isVertexShader = args[ 1 ].indexOf( 'gl_Position' ) > - 1;
 
        if ( isVertexShader || args[ 1 ].indexOf( 'SV_Target0' ) > - 1 ) {
 
            const varName = isVertexShader ? 'gl_Position.z' : 'SV_Target0';
            const value = isVertexShader ? '1.0' : 'vec4(1.0, 0.0, 0.0, 1.0)';
 
            args[ 1 ] = args[ 1 ].replace( 'void main', 'uniform bool ' + uniformName + ';\nvoid main' )
                .replace( /return;/, `${varName} = ${uniformName} ? ${value} : ${varName};` );
 
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
 
WebGL.drawElements = new Proxy( WebGL.drawElements, {
    apply( target, thisArgs, args ) {
 
        const program = thisArgs.getParameter( thisArgs.CURRENT_PROGRAM );
 
        if ( ! program.uniformLocation ) {
 
            program.uniformLocation = thisArgs.getUniformLocation( program, uniformName );
 
        }
 
        thisArgs.uniform1i( program.uniformLocation, espEnabled && args[ 1 ] > 4000 );
 
        args[ 0 ] = wireframeEnabled && ! program.isUIProgram && args[ 1 ] > 6 ? thisArgs.LINES : args[ 0 ];
 
        return Reflect.apply( ...arguments );
 
    }
} );
 
window.addEventListener( 'keyup', function ( event ) {
 
    switch ( String.fromCharCode( event.keyCode ) ) {
 
        case 'O' : espEnabled = ! espEnabled; break;
        case 'P' : wireframeEnabled = ! wireframeEnabled; break;
        case 'L' : shield = ! shield; break;
    }
 
} );
 
window.addEventListener( 'DOMContentLoaded', function () {
 
    const value = parseInt( new URLSearchParams( window.location.search ).get( 'showAd' ), 16 );
 
    const shouldShowAd = isNaN( value ) || Date.now() - value < 0 || Date.now() - value > 10 * 60 * 1000;
 
    const el = document.createElement( 'div' );
 
    el.innerHTML = `<style>
 
    .dialog {
        position: absolute;
        left: 50%;
        top: 50%;
        padding: 20px;
        background: #1e294a;
        color: #fff;
        transform: translate(-50%, -50%);
        text-align: center;
        z-index: 999999;
        font-family: cursive;
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
 
    </style>
    <div class="dialog">${shouldShowAd ? `<big>Loading ad...</big>` : `<div class="close" onclick="this.parentNode.style.display='none';"></div>
        <big>ESP & Wireframe</big>
        <br>
        <br>
        [V] to toggle ESP
        <br>
        [N] to toggle wireframe
        <br>
        <br>
        By Zertalious
        <br>
        <br>
        <div style="display: grid; grid-template-columns: 1fr 1fr; grid-gap: 5px;">
            <div class="btn" onclick="window.open('https://discord.gg/K24Zxy88VM')">Discord</div>
            <div class="btn" onclick="window.open('https://www.instagram.com/zertalious/', '_blank')">Instagram</div>
            <div class="btn" onclick="window.open('https://twitter.com/Zertalious', '_blank')">Twitter</div>
            <div class="btn" onclick="window.open('https://greasyfork.org/en/users/662330-zertalious', '_blank')">More scripts</div>
        </div>
        ` }
    </div>`;
})
 
 
 
 
 
 // ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.tampermonkey.net/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Your code here...
})();