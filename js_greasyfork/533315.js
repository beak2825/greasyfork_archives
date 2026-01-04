// ==UserScript==
// @name        !Krunker.EXE (Aimbot, ESP, Etc)
// @name:en     !Krunker.EXE (Aimbot, ESP, Etc)
// @name:ar     !Krunker.exe (Aimbot ، ESP ، إلخ)
// @name:zh     !krunker.exe（AIMBOT，ESP等
// @name:nl     !Krunker.exe (AIMBOT, ESP, enz.)
// @name:fr     !Krunker.exe (AIBBOT, ESP, etc.)
// @name:de     !krunker.exe (Aimbot, Esp usw.)
// @name:it     !krunker.exe (Aimbot, ESP, ecc.
// @name:ja     !krunker.exe（aimbot、espなど）
// @name:ru     !krunker.exe (aimbot, esp и т. Д.)
// @name:es     !Krunker.exe (Aimbot, ESP, etc.)
// @description     Completely Free
// @description:en  Completely Free
// @description:ar  مجاني تماما
// @description:zh  Completamente gratis
// @description:nl  Volledig vrij
// @description:fr  Complètement libre
// @description:de  Völlig frei
// @description:it  Completamente gratuito
// @description:ja  完全に無料
// @description:ru  Полностью бесплатно
// @description:es  Completamente gratis
// @namespace    http://tampermonkey.net/
// @version      1.4
// @author       L-1000
// @match        *://krunker.io/*
// @match        *://browserfps.com/*
// @exclude      *://krunker.io/social*
// @exclude      *://krunker.io/editor*
// @icon         https://media.tenor.com/qDMan7R2yIoAAAAi/blue-emoji.gif
// @run-at       document-start
// @require      https://unpkg.com/three@0.150.0/build/three.min.js
// @grant        unsafeWindow
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/533315/%21KrunkerEXE%20%28Aimbot%2C%20ESP%2C%20Etc%29.user.js
// @updateURL https://update.greasyfork.org/scripts/533315/%21KrunkerEXE%20%28Aimbot%2C%20ESP%2C%20Etc%29.meta.js
// ==/UserScript==

/*
                                                                                                                                                                .
                                                                                                                                                                .
BBBBBBBBBBBBBBBBB                                 LLLLLLLLLLL                                1111111        000000000          000000000          000000000     .
B::::::::::::::::B                                L:::::::::L                               1::::::1      00:::::::::00      00:::::::::00      00:::::::::00   .
B::::::BBBBBB:::::B                               L:::::::::L                              1:::::::1    00:::::::::::::00  00:::::::::::::00  00:::::::::::::00 .
BB:::::B     B:::::B                              LL:::::::LL                              111:::::1   0:::::::000:::::::00:::::::000:::::::00:::::::000:::::::0
  B::::B     B:::::Byyyyyyy           yyyyyyy       L:::::L                                   1::::1   0::::::0   0::::::00::::::0   0::::::00::::::0   0::::::0
  B::::B     B:::::B y:::::y         y:::::y        L:::::L                                   1::::1   0:::::0     0:::::00:::::0     0:::::00:::::0     0:::::0
  B::::BBBBBB:::::B   y:::::y       y:::::y         L:::::L                                   1::::1   0:::::0     0:::::00:::::0     0:::::00:::::0     0:::::0
  B:::::::::::::BB     y:::::y     y:::::y          L:::::L                ---------------    1::::l   0:::::0 000 0:::::00:::::0 000 0:::::00:::::0 000 0:::::0
  B::::BBBBBB:::::B     y:::::y   y:::::y           L:::::L                -:::::::::::::-    1::::l   0:::::0 000 0:::::00:::::0 000 0:::::00:::::0 000 0:::::0
  B::::B     B:::::B     y:::::y y:::::y            L:::::L                ---------------    1::::l   0:::::0     0:::::00:::::0     0:::::00:::::0     0:::::0
  B::::B     B:::::B      y:::::y:::::y             L:::::L                                   1::::l   0:::::0     0:::::00:::::0     0:::::00:::::0     0:::::0
  B::::B     B:::::B       y:::::::::y              L:::::L         LLLLLL                    1::::l   0::::::0   0::::::00::::::0   0::::::00::::::0   0::::::0
BB:::::BBBBBB::::::B        y:::::::y             LL:::::::LLLLLLLLL:::::L                 111::::::1110:::::::000:::::::00:::::::000:::::::00:::::::000:::::::0
B:::::::::::::::::B          y:::::y              L::::::::::::::::::::::L                 1::::::::::1 00:::::::::::::00  00:::::::::::::00  00:::::::::::::00 .
B::::::::::::::::B          y:::::y               L::::::::::::::::::::::L                 1::::::::::1   00:::::::::00      00:::::::::00      00:::::::::00   .
BBBBBBBBBBBBBBBBB          y:::::y                LLLLLLLLLLLLLLLLLLLLLLLL                 111111111111     000000000          000000000          000000000     .
                          y:::::y                                                                                                                               .
                         y:::::y                                                                                                                                .
                        y:::::y                                                                                                                                 .
                       y:::::y                                                                                                                                  .
                      yyyyyyy                                                                                                                                   .
                                                                                                                                                                .
                                                                                                                                                                .





⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣤⣤⣤⣤⣤⣶⣦⣤⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀ .
⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⡿⠛⠉⠙⠛⠛⠛⠛⠻⢿⣿⣷⣤⡀⠀⠀⠀⠀⠀ .
⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⠋⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⠈⢻⣿⣿⡄⠀⠀⠀⠀ .
⠀⠀⠀⠀⠀⠀⠀⣸⣿⡏⠀⠀⠀⣠⣶⣾⣿⣿⣿⠿⠿⠿⢿⣿⣿⣿⣄⠀⠀⠀ .
⠀⠀⠀⠀⠀⠀⠀⣿⣿⠁⠀⠀⢰⣿⣿⣯⠁⠀⠀⠀⠀⠀⠀⠀⠈⠙⢿⣷⡄⠀ .
⠀⠀⣀⣤⣴⣶⣶⣿⡟⠀⠀⠀⢸⣿⣿⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣷⠀ .
⠀⢰⣿⡟⠋⠉⣹⣿⡇⠀⠀⠀⠘⣿⣿⣿⣿⣷⣦⣤⣤⣤⣶⣶⣶⣶⣿⣿⣿⠀ .
⠀⢸⣿⡇⠀⠀⣿⣿⡇⠀⠀⠀⠀⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠃⠀ .
⠀⣸⣿⡇⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠉⠻⠿⣿⣿⣿⣿⡿⠿⠿⠛⢻⣿⡇⠀⠀ .
⠀⣿⣿⠁⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣧⠀⠀ .
⠀⣿⣿⠀⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⠀⠀ .
⠀⣿⣿⠀⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⠀⠀ .
⠀⢿⣿⡆⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⡇⠀⠀ .
⠀⠸⣿⣧⡀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⠃⠀⠀ .
⠀⠀⠛⢿⣿⣿⣿⣿⣇⠀⠀⠀⠀⠀⣰⣿⣿⣷⣶⣶⣶⣶⠶⠀⢠⣿⣿⠀⠀⠀ .
⠀⠀⠀⠀⠀⠀⠀⣿⣿⠀⠀⠀⠀⠀⣿⣿⡇⠀⣽⣿⡏⠁⠀⠀⢸⣿⡇⠀⠀⠀ .
⠀⠀⠀⠀⠀⠀⠀⣿⣿⠀⠀⠀⠀⠀⣿⣿⡇⠀⢹⣿⡆⠀⠀⠀⣸⣿⠇⠀⠀⠀ .
⠀⠀⠀⠀⠀⠀⠀⢿⣿⣦⣄⣀⣠⣴⣿⣿⠁⠀⠈⠻⣿⣿⣿⣿⡿⠏⠀⠀⠀⠀ .
⠀⠀⠀⠀⠀⠀⠀⠈⠛⠻⠿⠿⠿⠿⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀





UPDATES LOGS 1.4



*/




const latestVersion = '1.4';
if (typeof GM_info !== 'undefined' && GM_info.script && GM_info.script.version !== latestVersion) {
    alert('⚠️ Your script is outdated!\n\nPlease update to the latest version from https://greasyfork.org/en/scripts/533315-krunker-exe-aimbot-esp-etc');
}



const THREE = window.THREE;
delete window.THREE;

const CheatSettings = {
	aimbotEnabled: false,
	aimbotOnRightMouse: false,
	espEnabled: false,
	espLines: false,
	wireframe: false
};

const keyToSetting = {
	KeyV: 'aimbotEnabled',
	KeyB: 'aimbotOnRightMouse',
	KeyN: 'espEnabled',
	KeyM: 'espLines',
	KeyL: 'wireframe'
};

let scene;

const x = {
	window: window,
	document: document,
	querySelector: document.querySelector,
	consoleLog: console.log,
	ReflectApply: Reflect.apply,
	ArrayPrototype: Array.prototype,
	ArrayPush: Array.prototype.push,
	ObjectPrototype: Object.prototype,
	clearInterval: window.clearInterval,
	setTimeout: window.setTimeout,
	reToString: RegExp.prototype.toString,
	indexOf: String.prototype.indexOf,
	requestAnimationFrame: window.requestAnimationFrame
};

x.consoleLog( 'Waiting for access...' );

const proxied = function ( object ) {

	try {

		if ( typeof object === 'object' &&
			typeof object.parent === 'object' &&
			object.parent.type === 'Scene' &&
			object.parent.name === 'Main' ) {

			x.consoleLog( 'Found Scene!' )
			scene = object.parent;
			x.ArrayPrototype.push = x.ArrayPush;

		}

	} catch ( error ) {}

	return x.ArrayPush.apply( this, arguments );

}

const gui = createGUI();

const tempVector = new THREE.Vector3();

const tempObject = new THREE.Object3D();
tempObject.rotation.order = 'YXZ';

const geometry = new THREE.EdgesGeometry( new THREE.BoxGeometry( 5, 15, 5 ).translate( 0, 7.5, 0 ) );

const material = new THREE.RawShaderMaterial( {
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

	void main() {

		gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );

	}

	`
} );

const line = new THREE.LineSegments( new THREE.BufferGeometry(), material );

line.frustumCulled = false;

const linePositions = new THREE.BufferAttribute( new Float32Array( 100 * 2 * 3 ), 3 );
line.geometry.setAttribute( 'position', linePositions );

let injectTimer = null;

function animate() {

	x.requestAnimationFrame.call( x.window, animate );

	if ( ! scene && ! injectTimer ) {

		const el = x.querySelector.call( x.document, '#loadingBg' );

		if ( el && el.style.display === 'none' ) {

			x.consoleLog( 'Inject timer started!' );

			injectTimer = x.setTimeout.call( x.window, () => {

				x.consoleLog( 'Injected!' );
				x.ArrayPrototype.push = proxied;

			}, 2e3 );

		}

	}


	const players = [];

	let myPlayer;

    if (!scene) return;

	for ( let i = 0; i < scene.children.length; i ++ ) {

		const child = scene.children[ i ];

		if ( child.type === 'Object3D' ) {

			try {

				if ( child.children[ 0 ].children[ 0 ].type === 'PerspectiveCamera' ) {

					myPlayer = child;

				} else {

					players.push( child );

				}

			} catch ( err ) {}

		} else if ( child.material ) {

			child.material.wireframe = CheatSettings.wireframe;

		}

	}

	if ( ! myPlayer ) {

		x.consoleLog( 'Player not found, finding new scene.' );
		x.ArrayPrototype.push = proxied;
		return;

	}

	let counter = 0;

	let targetPlayer;
	let minDistance = Infinity;

	tempObject.matrix.copy( myPlayer.matrix ).invert();

	for ( let i = 0; i < players.length; i ++ ) {

		const player = players[ i ];

		if ( ! player.box ) {

			const box = new THREE.LineSegments( geometry, material );
			box.frustumCulled = false;

			player.add( box );

			player.box = box;

		}

		if ( player.position.x === myPlayer.position.x && player.position.z === myPlayer.position.z ) {

			player.box.visible = false;

			if ( line.parent !== player ) {

				player.add( line );

			}

			continue;

		}

		linePositions.setXYZ( counter ++, 0, 10, - 5 );

		tempVector.copy( player.position );
		tempVector.y += 9;
		tempVector.applyMatrix4( tempObject.matrix );

		linePositions.setXYZ(
			counter ++,
			tempVector.x,
			tempVector.y,
			tempVector.z
		);

		player.visible = CheatSettings.espEnabled || player.visible;
		player.box.visible = CheatSettings.espEnabled;

		const distance = player.position.distanceTo( myPlayer.position );

		if ( distance < minDistance ) {

			targetPlayer = player;
			minDistance = distance;

		}

	}

	linePositions.needsUpdate = true;
	line.geometry.setDrawRange( 0, counter );

	line.visible = CheatSettings.espLines;

	if ( CheatSettings.aimbotEnabled === false || ( CheatSettings.aimbotOnRightMouse && ! rightMouseDown ) || targetPlayer === undefined ) {

		return;


	}

	tempVector.setScalar( 0 );

	if (targetPlayer?.children?.[0]?.children?.[0]) {
    targetPlayer.children[0].children[0].localToWorld(tempVector);
} else {
    return;
}


	if (!myPlayer || !myPlayer.position) return;
    tempObject.position.copy(myPlayer.position);

	tempObject.lookAt( tempVector );

	if (myPlayer.children?.[0]?.rotation) {
    myPlayer.children[0].rotation.x = -tempObject.rotation.x;
    myPlayer.rotation.y = tempObject.rotation.y + Math.PI;
}

}

/*
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣠⠤⠀⠒⠀⠈⠉⠉⢉⠉⡙⠛⠒⠒⠦⢄⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⡴⠖⠋⢁⣠⠤⠀⠀⠀⠂⠁⡈⢀⠐⠠⠐⢈⠐⡀⠂⠄⡉⠑⠶⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡠⠔⠉⠀⢀⡤⠚⠉⠀⠀⠀⠀⠁⠀⠂⠀⠄⠂⢁⠈⠄⠂⠄⡁⠂⠄⡁⠆⡠⢙⠳⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢀⡴⠋⠀⠀⠀⠰⠃⠀⠀⠀⠀⢲⠀⠀⠀⠂⠀⢁⠠⠈⢀⠂⠌⠐⠠⢀⠁⡂⠐⡄⠱⢌⠲⣡⢛⡶⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⡴⢫⠇⠀⠀⠀⠀⠀⠀⠀⢀⣠⡇⠀⠃⣄⠀⠀⠈⠀⡀⠐⠠⠀⠌⠠⢁⠂⡐⠠⠁⠄⡃⢎⡱⣌⠳⡼⣹⢷⡀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢠⠎⡰⠃⠀⠀⠀⠀⣀⣠⣴⣾⡿⠟⠁⠀⠀⠻⣿⣷⣶⣥⣤⣐⣤⣁⣂⣡⣀⡂⠄⠡⢈⠐⢌⠂⡵⢌⡳⣍⡳⣏⢿⣆⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⡰⢃⡜⠁⠠⠒⠚⠛⠛⠉⠉⠁⠀⠀⢰⠖⠀⠀⠀⠀⠈⠉⠉⠉⠉⢉⠉⡉⠁⠄⡈⠄⡁⠂⠌⣀⠳⡄⢇⡳⡜⡵⣫⠾⡽⣷⡀⠀⠀⠀⠀⠀
⠀⠀⠀⣰⠇⢸⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⡞⠀⠀⠀⠀⠀⢀⠀⠄⠂⠐⠈⠠⠁⠂⠄⠡⢀⠁⠂⠄⡉⠄⢳⡈⢧⢳⡱⢏⡶⣳⢻⣧⠀⠀⠀⠀⠀
⠀⠀⢠⠇⢀⠇⡀⠀⠀⠀⠀⠀⣀⣤⣴⣶⣿⣿⡇⠀⠀⠀⠀⠀⢺⡟⠛⡛⠛⠛⠟⠻⠿⣷⣶⣦⣬⣁⣂⠘⣌⠶⣍⡒⢧⣙⢮⢳⣭⣛⢾⣧⠀⠀⠀⠀
⠀⠀⡎⠀⢸⠀⢃⣀⣤⠴⠚⠉⣉⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠐⢀⣇⠀⣷⠀⠀⠀⣦⣼⣿⣿⣿⣿⠙⢿⣻⣼⣽⣽⢈⠷⣘⢎⡗⣲⡹⢮⡽⡆⠀⠀⠀
⠀⢸⠁⢀⠘⣴⣿⠉⣛⣀⣀⣀⣹⣿⣿⣿⣹⣿⠀⠀⢀⠀⠁⡀⠂⣿⡀⠘⢆⣀⣀⣈⣻⣿⣿⣿⣃⠀⠠⠈⣹⣿⣿⠌⣎⠵⣪⠼⣡⢛⠦⡝⣿⡀⠀⠀
⠀⡏⠀⠄⡀⠋⠉⠉⠁⠀⠀⠀⠀⠀⠀⠈⠛⠛⠀⠀⡀⠀⠂⠀⠴⠿⠉⠍⠩⠉⠍⡉⢉⠉⡉⢉⠉⡉⢉⠛⠛⠻⢿⡜⢤⠛⣔⢫⠖⡭⢚⡱⣽⡇⠀⠀
⠀⡇⡈⠄⠐⠈⡀⠂⠐⠀⠂⠐⠀⠂⠈⠀⠄⠀⡐⠀⡀⠂⢁⠈⠠⠀⠌⠠⢁⠈⠄⡀⢂⠐⡀⢂⠐⡀⠂⠌⠌⡅⢊⠝⡢⠝⣬⠓⢮⡑⢣⠕⡮⡇⠀⠀
⢀⡇⠐⡈⠠⢁⠠⢈⠀⠡⠈⡀⠌⠀⡁⠐⡀⠁⡀⠐⢀⠐⡀⠌⢀⠡⠈⡐⠠⢈⠐⡀⢂⠐⡈⠄⡉⠄⠡⡈⠰⢈⢆⢩⠒⡍⠶⡙⢦⠙⡢⠝⣜⣷⠀⠀
⢰⡇⠡⢀⠡⢀⠂⠄⡈⠐⠠⠀⠄⡁⢀⠂⠄⠂⠠⣁⠂⠠⢀⠂⠄⠂⡁⠐⡀⢂⠐⡀⢂⠐⡀⢂⠐⡈⠡⢀⠣⠌⡌⢢⠝⣌⠳⣉⠦⣙⠰⣩⢲⡇⠀⠀
⠀⣇⠂⠄⠂⠄⡈⠐⠠⢁⠂⢁⣂⣤⣤⣤⣀⡤⠦⢤⣝⢣⡀⠂⠌⡐⠠⢁⠐⡀⢂⠐⡀⢂⠐⠠⠂⡄⢃⠂⣅⡚⣌⢣⠞⣔⣋⠖⡑⢆⡃⢆⣳⡇⠀⠀
⠀⢸⡎⠠⡁⠂⠄⡁⠂⠄⣼⣋⣤⡀⡀⠀⣀⣀⣠⣀⠈⠳⣷⡈⠐⠠⢁⠂⡐⢀⠂⡐⢀⠂⣌⡰⣡⠜⣌⠳⣄⠳⣌⠖⣍⢲⡘⢬⡑⢢⠘⡬⣾⠁⠀⠀
⠀⠈⣷⡐⠤⡉⢂⠤⢁⠌⢿⡘⠛⠛⠛⢉⠛⠹⠛⠋⠷⢦⠹⢷⠈⡐⢀⠂⡐⢀⢂⡴⣊⠞⡴⣓⠴⣩⠒⡵⣈⠗⡬⡚⣌⠲⣉⢆⡘⠄⣃⢶⠇⠀⠀⠀
⠀⠀⠘⣗⡢⠍⡜⠤⣉⠦⡜⢿⣶⣶⣶⣦⣶⣶⣾⡴⢢⠍⣧⠀⠡⠐⡀⢂⡴⣋⠾⣔⡫⣝⠲⣍⢞⡡⢫⠴⣉⠞⡰⢩⠆⡓⢄⠢⠐⠌⠤⡟⠀⠀⡄⢀
⠀⠀⠀⠹⣧⡙⣌⠳⡌⢎⡙⠦⣉⠏⠻⡙⢏⠛⠥⢋⠇⠚⡘⠠⢁⠂⡐⣧⠞⣭⡓⢮⡱⢎⠳⡜⡌⢖⡱⢊⣴⠛⢻⡇⠘⡐⢀⠂⠡⢈⡾⠀⠀⢠⠃⢸
⠀⠀⠀⠀⠘⣷⡌⢳⡸⣌⢱⢣⡐⢌⠱⠈⡄⠨⠐⠠⠈⠥⢀⢁⠢⢐⡹⣜⡻⢦⡙⢧⠱⡍⢣⠱⢜⠢⡱⢹⣿⠀⢠⣇⠡⠐⠠⠈⢄⡟⠁⠀⢀⠎⢠⠇
⠀⠀⠀⠀⠀⠈⢻⣥⠲⡜⣊⢦⠱⡈⢆⡱⢀⢃⠩⡐⢡⠂⡅⢂⠆⡡⣟⡼⣓⢧⡹⣌⡓⣌⢣⡙⠢⢃⠔⡩⣿⠀⠀⢿⠀⡁⢂⣡⠋⠀⢀⡴⠃⣠⠏⠀
⠀⠀⠀⠀⠀⠀⠀⠙⢷⡘⢤⠋⢖⠡⢂⠔⣈⢂⠑⡈⢆⠒⡘⡄⢚⠰⣹⡚⡵⣊⡕⢢⡑⢂⠆⡌⠡⢂⠐⠠⢹⠀⠀⠘⣆⣰⠞⠁⠠⠔⠉⣠⠖⠁⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠈⠳⣌⠒⠌⠂⠌⠠⠉⠌⡐⠡⠌⡰⠡⠑⡌⠢⢍⡳⢥⢋⠕⡊⠱⠈⠄⡁⠂⠌⡐⠠⠘⡆⠀⠀⣿⠋⠀⠀⢀⡠⠔⠋⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠑⢮⣄⠡⠁⠌⡐⠠⢁⠂⠄⠡⢁⠰⢁⠊⠌⡑⠊⢄⠁⡂⢱⡏⠙⢳⣤⠴⠒⠋⠉⠉⠑⠚⠦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠑⠣⢆⡄⡁⠂⠌⠠⢁⠂⡐⠠⢈⠐⠠⢁⠂⡐⠠⠉⠳⣄⣺⡀⠀⢀⣀⡤⠤⠤⣀⣀⠈⢣⡀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠻⣶⣬⣐⣀⠂⠀⠁⠂⠈⠀⠀⣀⣀⣀⣤⣴⣿⣿⣿⣿⠟⡇⠀⠀⠀⠀⠀⠀⠀⣳⡀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠛⠛⠛⠛⠛⠛⠛⠉⠋⠉⠁⠀⠀⠙⢻⡏⢈⢙⡶⠖⠒⠋⠉⠉⠉⠹⣷⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣇⣼⡞⠠⣀⡀⠀⠀⠀⠀⣰⣿⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠿⣇⠦⣠⣿⣶⢦⠤⢀⣿⠏⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⣿⣿⣇⣤⡶⠟⠉⠀⠀⠀⠀⠀⠀⠀
*/

//                   |
// Most of the HTML  |
//                  \ /

const el = document.createElement( 'div' );

el.innerHTML = `<style>

@keyframes krkUIGlow {
	0%, 100% {
		box-shadow: 0 0 10px #8f00ff, 0 0 20px #4b0082, 0 0 30px #8f00ff;
	}
	50% {
		box-shadow: 0 0 20px #8f00ff, 0 0 30px #4b0082, 0 0 40px #8f00ff;
	}
}

.dialog {
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

.button {
	cursor: pointer;
	padding: 0.5em;
	background: red;
	border: 3px solid rgba(0, 0, 0, 0.2);
}

.button:active {
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

.krkUI {
	position: fixed;
	right: 10px;
	top: 0;
	z-index: 999;
	display: flex;
	flex-direction: column;
	font-family: monospace;
	font-size: 12px;
	color: #fff;
	width: 250px;
	user-select: none;
	border: 2px solid #000;
	background: radial-gradient(circle at top left, #1a0033, #000000);
	animation: krkUIGlow 2s infinite ease-in-out;
	border-radius: 8px;
	overflow: hidden;
}

.krkUI-item {
	padding: 4px 8px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: rgba(0, 0, 0, 0.4);
	cursor: pointer;
	border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.krkUI-item.text {
	justify-content: center;
	cursor: unset;
	text-align: center;
	background: #333;
}

.krkUI-item:hover {
	background: rgba(255, 255, 255, 0.05);
}

.krkUI-item span {
	color: #fff;
	font-family: monospace;
	font-size: 12px;
}

.krkUI-header {
	background: linear-gradient(to right, #8f00ff, #4b0082);
}

.krkUI-header span {
	font-size: 14px;
}

.krkUI-header:hover {
	background: linear-gradient(to right, #8f00ff, #4b0082);
}

.krkUI-on {
	color: #0f0;
}

.krkUI-item-value {
	font-size: 0.8em;
	font-weight: bold;
}

</style>
	`


/*
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░░░░░░░░░░░░░▄▄▄▄▄▄▄░░░░░░░░░
░░░░░░░░░▄▀▀▀░░░░░░░▀▄░░░░░░░
░░░░░░░▄▀░░░░░░░░░░░░▀▄░░░░░░
░░░░░░▄▀░░░░░░░░░░▄▀▀▄▀▄░░░░░
░░░░▄▀░░░░░░░░░░▄▀░░██▄▀▄░░░░
░░░▄▀░░▄▀▀▀▄░░░░█░░░▀▀░█▀▄░░░
░░░█░░█▄▄░░░█░░░▀▄░░░░░▐░█░░░
░░▐▌░░█▀▀░░▄▀░░░░░▀▄▄▄▄▀░░█░░
░░▐▌░░█░░░▄▀░░░░░░░░░░░░░░█░░
░░▐▌░░░▀▀▀░░░░░░░░░░░░░░░░▐▌░
░░▐▌░░░░░░░░░░░░░░░▄░░░░░░▐▌░
░░▐▌░░░░░░░░░▄░░░░░█░░░░░░▐▌░
░░░█░░░░░░░░░▀█▄░░▄█░░░░░░▐▌░
░░░▐▌░░░░░░░░░░▀▀▀▀░░░░░░░▐▌░
░░░░█░░░░░░░░░░░░░░░░░░░░░█░░
░░░░▐▌▀▄░░░░░░░░░░░░░░░░░▐▌░░
░░░░░█░░▀░░░░░░░░░░░░░░░░▀░░░
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
*/







const msgEl = el.querySelector( '.msg' );
const dialogEl = el.querySelector( '.dialog' );

window.addEventListener( 'DOMContentLoaded', function () {

	while ( el.children.length > 0 ) {

		document.body.appendChild( el.children[ 0 ] );

	}

	document.body.appendChild( gui );

} );


let rightMouseDown = false;

function handleMouse( event ) {

	if ( event.button === 2 ) {

		rightMouseDown = event.type === 'pointerdown' ? true : false;

	}

}

window.addEventListener( 'pointerdown', handleMouse );
window.addEventListener( 'pointerup', handleMouse );

window.addEventListener( 'keyup', function ( event ) {

	if ( x.document.activeElement && x.document.activeElement.value !== undefined ) return;

	if ( keyToSetting[ event.code ] ) {

		toggleSetting( keyToSetting[ event.code ] );

	}

	switch ( event.code ) {

		case 'Slash' :
			toggleElementVisibility( gui );
			break;

		case 'KeyH' :
			toggleElementVisibility( dialogEl );
			break;

	}

} );

function toggleElementVisibility( el ) {

	el.style.display = el.style.display === '' ? 'none' : '';

}

function showMsg( name, bool ) {

	msgEl.innerText = name + ': ' + ( bool ? 'ON' : 'OFF' );

	msgEl.style.display = 'none';
	void msgEl.offsetWidth;
	msgEl.style.display = '';

}

animate();

function createGUI() {

	const guiEl = fromHtml( `<div class="krkUI">
		<div class="krkUI-item krkUI-header">
			<span>[/] Menu</span>
			<span class="krkUI-item-value">[close]</span>
		</div>
		<div class="krkUI-content"></div>
	</div>` );

	const headerEl = guiEl.querySelector( '.krkUI-header' );
	const contentEl = guiEl.querySelector( '.krkUI-content' );
	const headerStatusEl = guiEl.querySelector( '.krkUI-item-value' );

	headerEl.onclick = function () {

		const isHidden = contentEl.style.display === 'none';

		contentEl.style.display = isHidden ? '' : 'none';
		headerStatusEl.innerText = isHidden ? '[close]' : '[open]';

	}

	const settingToKey = {};
	for ( const key in keyToSetting ) {

		settingToKey[ keyToSetting[ key ] ] = key;

	}

	for ( const prop in CheatSettings ) {

		let name = fromCamel( prop );
		let shortKey = settingToKey[ prop ];

		if ( shortKey ) {

			if ( shortKey.startsWith( 'Key' ) ) shortKey = shortKey.slice( 3 );
			name = `[${shortKey}] ${name}`;

		}

		const itemEl = fromHtml( `<div class="krkUI-item">
			<span>${name}</span>
			<span class="krkUI-item-value"></span>
		</div>` );
		const valueEl = itemEl.querySelector( '.krkUI-item-value' );

		function updateValueEl() {

			const value = CheatSettings[ prop ];
			valueEl.innerText = value ? 'ON' : 'OFF';
			valueEl.style.color = value ? 'green' : 'red';

		}
		itemEl.onclick = function() {

			CheatSettings[ prop ] = ! CheatSettings[ prop ];

		}
		updateValueEl();

		contentEl.appendChild( itemEl );

		const p = `__${prop}`;
		CheatSettings[ p ] = CheatSettings[ prop ];
		Object.defineProperty( CheatSettings, prop, {
			get() {

				return this[ p ];

			},
			set( value ) {

				this[ p ] = value;
				updateValueEl();

			}
		} );

	}

	contentEl.appendChild( fromHtml( `<div class="krkUI-item text">
		<span>Created by L-1000</span>
	</div>` ) );

	return guiEl;

}

function fromCamel( text ) {

	const result = text.replace( /([A-Z])/g, ' $1' );
	return result.charAt( 0 ).toUpperCase() + result.slice( 1 );

}

function fromHtml( html ) {

	const div = document.createElement( 'div' );
	div.innerHTML = html;
	return div.children[ 0 ];

}

function toggleSetting( key ) {

	CheatSettings[ key ] = ! CheatSettings[ key ];
	showMsg( fromCamel( key ), CheatSettings[ key ] );

}


/*
⠀⠀⠀⠠⣤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣤⠤⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢈⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣅⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⢠⣴⣿⡿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠿⣿⣷⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⢀⣴⣿⡷⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣿⣿⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⣾⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⣿⣿⣿⣧⠀⠀⠀⠘⣦⡀⠀⠀⠀⠀⠀⠀⠀⢀⣴⡇⠀⠀⠀⢀⣼⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠹⣿⣿⣿⣷⣦⣄⡀⣿⣱⡀⠀⠀⠀⠀⠀⠀⢸⢿⣧⣠⣴⣾⣿⣿⣿⣿⡿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠈⠛⢷⣿⣟⡿⠿⠿⡟⣓⣒⣛⡛⡛⢟⣛⡛⠟⠿⣻⢿⣿⣻⡿⠛⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⢠⣴⢻⡭⠖⡉⠥⣈⠀⣐⠂⡄⠔⢂⢦⡹⢬⡕⠊⠳⠈⢿⣳⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⢀⣼⣷⣋⠲⢮⣁⠀⣐⠆⡤⢊⣜⡀⡾⣀⠀⢠⢻⣌⣤⣥⣓⣌⢻⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⢰⣟⣽⢳⣯⣝⣦⡀⠓⡤⢆⠇⠂⠄⠤⡝⣂⠋⠖⢋⠀⣡⣶⣾⡿⡷⣽⡿⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⢸⣿⡜⢯⣿⣿⣿⣷⣿⣤⣧⣶⣬⣝⣃⣓⣈⣥⣶⣿⣾⣿⣿⢣⠇⢻⡞⣯⣹⠆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⢻⣼⣯⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⡔⡯⢧⢟⣟⣱⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⡼⡼⢁⡌⢼⡟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⣿⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣿⢇⡼⢃⡿⣼⣛⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⣧⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣯⠟⣡⣫⣢⢏⣼⡵⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⢸⣿⣏⢿⣿⣿⣿⣿⣿⣿⣿⡿⢿⣿⡾⢕⣻⣽⣵⠿⠛⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠘⢷⣮⣿⡼⢭⡟⠳⠞⡖⢛⣶⣷⣯⡶⠟⠛⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠉⠛⠛⠛⠿⠟⠛⠛⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
*/