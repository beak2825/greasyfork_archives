// ==UserScript==
// @name         Shellshock.IO Aimbot & ESP
// @namespace    http://tampermonkey.net/
// @version      0.4.1
// @description  Locks aim to the nearest player in shellshock.io. Comes with an ESP too. Press B, V, N, L to toggle aimbot, esp, esp lines, aimbot on right mouse hold.
// @author       Zertalious (Zert)
// @match        *://shellshock.io/*
// @match        *://algebra.best/*
// @match        *://algebra.vip/*
// @match        *://biologyclass.club/*
// @match        *://deadlyegg.com/*
// @match        *://deathegg.world/*
// @match        *://eggcombat.com/*
// @match        *://egg.dance/*
// @match        *://eggfacts.fun/*
// @match        *://egghead.institute/*
// @match        *://eggisthenewblack.com/*
// @match        *://eggsarecool.com/*
// @match        *://geometry.best/*
// @match        *://geometry.monster/*
// @match        *://geometry.pw/*
// @match        *://geometry.report/*
// @match        *://hardboiled.life/*
// @match        *://hardshell.life/*
// @match        *://humanorganising.org/*
// @match        *://mathdrills.info/*
// @match        *://mathfun.rocks/*
// @match        *://mathgames.world/*
// @match        *://math.international/*
// @match        *://mathlete.fun/*
// @match        *://mathlete.pro/*
// @match        *://overeasy.club/*
// @match        *://scrambled.best/*
// @match        *://scrambled.tech/*
// @match        *://scrambled.today/*
// @match        *://scrambled.us/*
// @match        *://scrambled.world/*
// @match        *://shellshockers.club/*
// @match        *://shellshockers.site/*
// @match        *://shellshockers.us/*
// @match        *://shellshockers.world/*
// @match        *://softboiled.club/*
// @match        *://violentegg.club/*
// @match        *://violentegg.fun/*
// @match        *://yolk.best/*
// @match        *://yolk.life/*
// @match        *://yolk.rocks/*
// @match        *://yolk.tech/*
// @match        *://zygote.cafe/*
// @icon         https://www.google.com/s2/favicons?domain=shellshock.io
// @grant        none
// @run-at       document-start
// @antifeature  ads
// @require      https://cdn.jsdelivr.net/npm/lil-gui@0.19
// @require      https://cdn.jsdelivr.net/npm/babylonjs@7.15.0/babylon.min.js
// @downloadURL https://update.greasyfork.org/scripts/436330/ShellshockIO%20Aimbot%20%20ESP.user.js
// @updateURL https://update.greasyfork.org/scripts/436330/ShellshockIO%20Aimbot%20%20ESP.meta.js
// ==/UserScript==

const keys = {};

const StringReplace = String.prototype.replace;

function log( msg, ...args ) {

	console.log( '%c' + msg, 'color: red; background: black; font-size: 2em;', ...args );

}

window.XMLHttpRequest = class extends window.XMLHttpRequest {

	open( method, url ) {

		if ( url.indexOf( 'shellshock.js' ) > - 1 ) {

			this.isScript = true;

		}

		return super.open( ...arguments );

	}

	get response() {

		if ( this.isScript ) {

			let code = super.response;

			let babylonVarName,
				playersVarName,
				myPlayerVarName,
				sceneVarName,
				cullFuncName;

			const extractors = { 
				BracketSingleQuote() {

					const matches = /([a-zA-Z_$0-9]+)\['([^']+)'\]\['([^']+)'\]\("[^"]+",{si/.exec( code );

					babylonVarName = matches[ 1 ];
					playersVarName = /[a-zA-Z_$0-9]+\['[^']+'\]\),!([a-zA-Z_$0-9]+)\[/.exec( code )[ 1 ];
					myPlayerVarName = /document\.pointerLockElement&&([^&]+)&&/.exec( code )[ 1 ];
					sceneVarName = /if\([a-zA-Z_$0-9]+\['[^']+'\]\(([a-zA-Z_$0-9]+),[a-zA-Z_$0-9]+,[a-zA-Z_$0-9]+,null/.exec( code )[ 1 ];
					cullFuncName = /=([a-zA-Z_$0-9]+)\(this\['([^']+)'\],\.[0-9]+\)/.exec( code )[ 1 ];

					keys.MeshBuilder = matches[ 2 ];
					keys.CreateBox = matches[ 3 ];
					keys.CreateLines = /\['([^']+)'\]\("",{po/.exec( code )[ 1 ];
					keys.Vector3 = /new [a-zA-Z_$0-9]+\['([^']+)'\]\(\.5,\.5,\.5\),/.exec( code )[ 1 ];
					keys.actor = /this\['([^']+)'\]\['([^']+)'\]\.position,!/.exec( code )[ 1 ];
					keys.playing = /OPEN&&[a-zA-Z_$0-9]+\['([^']+)'\]/.exec( code )[ 1 ];

					keys.yaw = /\*=[a-zA-Z_$0-9]+,[a-zA-Z_$0-9]+\['([^']+)'\]=Math\.r/.exec( code )[ 1 ];
					keys.pitch = /\),[a-zA-Z_$0-9]+\['([^']+)'\]=Math\.max\(Math\.min/.exec( code )[ 1 ];
					keys.mesh = /,\.[0-9]+\);this\['([^']+)'\]\['([^']+)'\]\(/.exec( code )[ 1 ];

				},
				BracketDoubleQuote() { // might not be needed but just in case

					const matches = /([a-zA-Z_$0-9]+)\["([^"]+)"\]\["([^"]+)"\]\("[^"]+",{si/.exec( code );

					babylonVarName = matches[ 1 ];
					playersVarName = /[a-zA-Z_$0-9]+\["[^"]+"\]\),!([a-zA-Z_$0-9]+)\[/.exec( code )[ 1 ];
					myPlayerVarName = /document\.pointerLockElement&&([^&]+)&&/.exec( code )[ 1 ];
					sceneVarName = /if\([a-zA-Z_$0-9]+\["[^"]+"\]\(([a-zA-Z_$0-9]+),[a-zA-Z_$0-9]+,[a-zA-Z_$0-9]+,null/.exec( code )[ 1 ];
					cullFuncName = /=([a-zA-Z_$0-9]+)\(this\["([^"]+)"\],\.[0-9]+\)/.exec( code )[ 1 ];

					keys.MeshBuilder = matches[ 2 ];
					keys.CreateBox = matches[ 3 ];
					keys.CreateLines = /\["([^"]+)"\]\("",{po/.exec( code )[ 1 ];
					keys.Vector3 = /new [a-zA-Z_$0-9]+\["([^"]+)"\]\(\.5,\.5,\.5\),/.exec( code )[ 1 ];
					keys.actor = /this\["([^"]+)"\]\["([^"]+)"\]\.position,!/.exec( code )[ 1 ];
					keys.playing = /OPEN&&[a-zA-Z_$0-9]+\["([^"]+)"\]/.exec( code )[ 1 ];

					keys.yaw = /\*=[a-zA-Z_$0-9]+,[a-zA-Z_$0-9]+\["([^"]+)"\]=Math\.r/.exec( code )[ 1 ];
					keys.pitch = /\),[a-zA-Z_$0-9]+\["([^"]+)"\]=Math\.max\(Math\.min/.exec( code )[ 1 ];
					keys.mesh = /,\.[0-9]+\);this\["([^"]+)"\]\["([^"]+)"\]\(/.exec( code )[ 1 ];

				}, 
				Dot() { // in case the shellshock devs revert back to dot syntax :skull:

					playersVarName = /[a-zA-Z_$0-9]+\.[a-zA-Z_$0-9]+\),!([a-zA-Z_$0-9]+)\[/.exec( code )[ 1 ];
					myPlayerVarName = /document\.pointerLockElement&&([^&]+)&&/.exec( code )[ 1 ];
					sceneVarName = /if\([a-zA-Z_$0-9]+\.[a-zA-Z_$0-9]+\(([a-zA-Z_$0-9]+),[a-zA-Z_$0-9]+,[a-zA-Z_$0-9]+,null/.exec( code )[ 1 ];
					cullFuncName = /=([a-zA-Z_$0-9]+)\(this\.([a-zA-Z_$0-9]+),\.[0-9]+\)/.exec( code )[ 1 ];
	 
					keys.actor = /this\.([a-zA-Z_$0-9]+)\.[a-zA-Z_$0-9]+\.position,!/.exec( code )[ 1 ];
					keys.playing = /OPEN&&[a-zA-Z_$0-9]+\.([a-zA-Z_$0-9]+)/.exec( code )[ 1 ];
	 
					keys.yaw = /\*=[a-zA-Z_$0-9]+,[a-zA-Z_$0-9]+\.([a-zA-Z_$0-9]+)=Math\.r/.exec( code )[ 1 ];
					keys.pitch = /\),[a-zA-Z_$0-9]+\.([a-zA-Z_$0-9]+)=Math\.max\(Math\.min/.exec( code )[ 1 ];
					keys.mesh = /,\.[0-9]+\);this\.([a-zA-Z_$0-9]+)\.[a-zA-Z_$0-9]+\(/.exec( code )[ 1 ];

				}
			};

			const numExtractors = Object.keys( extractors ).length;
			let failures = 0;

			for ( const name in extractors ) {

				try {

					extractors[ name ]();

					log( `SUCCESS: ${name} passed!` );
					break;

				} catch ( error ) {

					log( `WARNING: ${name} extractor failed!` );

					failures ++;
					if ( failures >= numExtractors ) {

						log( `FATAL: Script failed to inject.`, getVars() );
						alert( 'Script failed to inject. Report the issue to the script developer.\n' + JSON.stringify( getVars(), undefined, 2 ) );
						return code;

					}

				}

			}

			function getVars() {

				return {
					babylonVarName,
					playersVarName,
					myPlayerVarName,
					playersVarName,
					sceneVarName,
					cullFuncName,
					keys
				};

			}

			log( 'Injecting code', getVars() );

			code = StringReplace.call( code, sceneVarName + '.render()', `

				window[ '${onUpdateFuncName}' ]( 
					${playersVarName}, 
					${myPlayerVarName}
				);

			${sceneVarName}.render()` );
			code = StringReplace.call( code, `function ${cullFuncName}`, `

				function ${cullFuncName}() {

					return true;

				}

			function someFunctionWhichWillNeverBeUsedNow` );

			return code;

		}

		return super.response;

	}

};

const settings = {
	aimbotEnabled: true, 
	aimbotOnRightMouse: false, 
	espEnabled: true, 
	showLines: true, 
	showTeam: false, 
	createdBy: 'Zertalious', 
	showHelp() {

		dialogEl.style.display = dialogEl.style.display === '' ? 'none' : '';

	}
};

const keyToSetting = {
	'KeyB': 'aimbotEnabled', 
	'KeyV': 'espEnabled', 
	'KeyN': 'showLines', 
	'KeyL': 'aimbotOnRightMouse',
	'KeyK': 'showTeam'
};

let gui, controllers;

function initGui() {

	const settingToKey = {};
	for ( const key in keyToSetting ) {

		settingToKey[ keyToSetting[ key ] ] = key;

	}

	gui = new lil.GUI();
	controllers = {};
	for ( const key in settings ) {

		let name = fromCamel( key );
		let shortKey = settingToKey[ key ];

		if ( shortKey ) {

			if ( shortKey.startsWith( 'Key' ) ) shortKey = shortKey.slice( 3 );
			name = `[${shortKey}] ${name}`;

		}

		controllers[ key ] = gui.add( settings, key ).name( name ).listen();

	}

	const titleEl = gui.domElement.querySelector( '.title' );
	titleEl.innerText = `[/] Controls`;

	gui.domElement.style.zIndex = '99999';
	controllers.createdBy.disable();

}

function fromCamel( text ) {

	const result = text.replace( /([A-Z])/g, ' $1' );
	return result.charAt( 0 ).toUpperCase() + result.slice( 1 );

}

const temp = document.createElement( 'div' );

temp.innerHTML = `<style>

.info {
	position: absolute;
	left: 50%;
	top: 50%;
	padding: 20px;
	background: rgba(0, 0, 0, 0.8);
	border: 6px solid rgba(0, 0, 0, 0.2);
	color: #fff;
	transform: translate(-50%, -50%);
	text-align: center;
	z-index: 999999;
	font-weight: bolder;
}

.info * {
	color: #fff;
}

.close-icon {
	position: absolute;
	right: 5px;
	top: 5px;
	width: 20px;
	height: 20px;
	opacity: 0.5;
	cursor: pointer;
}

.close-icon:before, .close-icon:after {
	content: ' ';
	position: absolute;
	left: 50%;
	top: 50%;
	width: 100%;
	height: 20%;
	transform: translate(-50%, -50%) rotate(-45deg);
	background: #fff;
}

.close-icon:after {
	transform: translate(-50%, -50%) rotate(45deg);
}

.close-icon:hover {
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

.msg {
	position: absolute;
	left: 10px;
	bottom: 10px;
	color: #fff;
	background: rgba(0, 0, 0, 0.6);
	font-weight: bolder;
	padding: 15px;
	animation: msg 0.5s forwards, msg 0.5s reverse forwards 3s;
	z-index: 999999;
	pointer-events: none;
}

@keyframes msg {
	from {
		transform: translate(-120%, 0);
	}

	to {
		transform: none;
	}
}

</style>
<div class="msg" style="display: none;"></div>
<div class="info">${`<div class="close-icon" onclick="this.parentNode.style.display='none';"></div>
	<big>== Shellshock.IO Aimbot & ESP ==</big>
	<br>
	<br>
	[B] to toggle aimbot
	<br>
	[V] to toggle ESP
	<br>
	[N] to toggle ESP Lines
	<br>
	[K] to toggle team ESP
	<br>
	[L] to toggle aimbot on <br>right mouse hold
	<br>
	[H] to show/hide help
	<br>
	[/] to show/hide control panel
	<br>
	<br>
	By Zertalious
	<br>
	<br>
	<div style="display: grid; grid-template-columns: 1fr 1fr; grid-gap: 5px;">
		<div class="btn" onclick="window.open('https://discord.gg/K24Zxy88VM', '_blank')">Discord</div>
		<div class="btn" onclick="window.open('https://www.instagram.com/zertalious/', '_blank')">Instagram</div>
		<div class="btn" onclick="window.open('https://twitter.com/Zertalious', '_blank')">Twitter</div>
		<div class="btn" onclick="window.open('https://greasyfork.org/en/users/662330-zertalious', '_blank')">More scripts</div>
	</div>
	` }
</div>`;

const msgEl = temp.querySelector( '.msg' );
const dialogEl = temp.querySelector( '.info' );

window.addEventListener( 'DOMContentLoaded', async function () {

	initGui();

	while ( temp.children.length > 0 ) {

		document.body.appendChild( temp.children[ 0 ] );

	}

} );

let rightMouseDown = false;

function handleMouse( event ) {

	if ( event.button === 2 ) {

		rightMouseDown = event.type === 'pointerdown' ? true : false;

	}

}

window.addEventListener( 'pointerdown', handleMouse );
window.addEventListener( 'pointerup', handleMouse );

function toggleSetting( key ) {

	settings[ key ] = ! settings[ key ];
	showMsg( fromCamel( key ), settings[ key ] );

}

window.addEventListener( 'keyup', function ( event ) {

	if ( document.activeElement && document.activeElement.tagName === 'INPUT' ) return;

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

let initialized = false;
let lineOrigin, linesArray;
let colors;

const onUpdateFuncName = btoa( Math.random().toString( 32 ) );

window[ onUpdateFuncName ] = function ( players, myPlayer ) {

	if ( ! myPlayer ) return; 

	if ( ! initialized ) {

		initialized = true;

		lineOrigin = new BABYLON.Vector3();
		linesArray = [];

		colors = {
			enemy: new BABYLON.Color3( 1, 0, 0 ), 
			team: new BABYLON.Color3( 0, 0, 1 ), 
		};

	}

	lineOrigin.copyFrom( myPlayer[ keys.actor ][ keys.mesh ].position );

	for ( let i = 0; i < linesArray.length; i ++ ) {

		linesArray[ i ].playerExists = false;

	}

	for ( let i = 0; i < players.length; i ++ ) {

		const player = players[ i ];

		if ( ! player || player === myPlayer ) continue;

		if ( player.sphere === undefined ) {

			log( 'Adding sphere...' );

			const material = new BABYLON.StandardMaterial( 'myMaterial', player[ keys.actor ].scene );
			material.wireframe = true;

			const sphere = BABYLON.MeshBuilder.CreateBox( 'mySphere', { width: 0.5, height: 0.75, depth: 0.5 }, player[ keys.actor ].scene );
			sphere.material = material;
			sphere.position.y = 0.3;
			sphere.parent = player[ keys.actor ][ keys.mesh ];
			sphere.renderingGroupId = 1;

			player.sphere = sphere;

		}

		if ( player.lines === undefined ) {

			const options = {
				points: [ lineOrigin, player[ keys.actor ][ keys.mesh ].position ],
				updatable: true
			};

			const lines = options.instance = BABYLON.MeshBuilder.CreateLines( 'lines', options, player[ keys.actor ].scene );
			lines.alwaysSelectAsActiveMesh = true;
			lines.renderingGroupId = 1;

			player.lines = lines;
			player.lineOptions = options;

			linesArray.push( lines );

			log( 'Adding line...' );

		}

		player.lines.playerExists = true;
		player.lines = BABYLON.MeshBuilder.CreateLines( 'lines', player.lineOptions );

		const isEnemy = myPlayer.team === 0 || myPlayer.team !== player.team;
		player.sphere.visibility = settings.espEnabled && ( isEnemy || settings.showTeam );
		player.lines.visibility = settings.showLines && player[ keys.playing ] && ( isEnemy || settings.showTeam );

		player.sphere.material.emissiveColor = 
			player.sphere.material.diffuseColor = 
			player.lines.color = isEnemy ? colors.enemy : colors.team;

	}

	for ( let i = 0; i < linesArray.length; i ++ ) {

		if ( ! linesArray[ i ].playerExists ) {

			log( 'Removing line...' );

			linesArray[ i ].dispose();
			linesArray.splice( i, 1 );

		}

	}

	if ( settings.aimbotEnabled && ( settings.aimbotOnRightMouse ? rightMouseDown : true ) && myPlayer[ keys.playing ] ) {

		let minDistance = Infinity;
		let targetPlayer;

		for ( let i = 0; i < players.length; i ++ ) {

			const player = players[ i ];

			if ( player && player !== myPlayer && player[ keys.playing ] && ( myPlayer.team === 0 || player.team !== myPlayer.team ) ) {

				const distance = Math.hypot( 
					getPos( player, 'x' ) - getPos( myPlayer, 'x' ), 
					getPos( player, 'y' ) - getPos( myPlayer, 'y' ), 
					getPos( player, 'z' ) - getPos( myPlayer, 'z' ) 
				);

				if ( distance < minDistance ) {

					minDistance = distance;
					targetPlayer = player;

				}

			}

		}

		if ( targetPlayer ) {

			const x = getPos( targetPlayer, 'x' ) - getPos( myPlayer, 'x' );
			const y = getPos( targetPlayer, 'y' ) - getPos( myPlayer, 'y' );
			const z = getPos( targetPlayer, 'z' ) - getPos( myPlayer, 'z' );

			myPlayer[ keys.yaw ] = Math.radAdd( Math.atan2( x, z ), 0 );
			myPlayer[ keys.pitch ] = - Math.atan2( y, Math.hypot( x, z ) ) % 1.5;

		}

	}

}

function getPos( player, component ) {

	return player[ keys.actor ][ keys.mesh ].position[ component ];

}

delete localStorage[ 'lastVersionPlayed' ];