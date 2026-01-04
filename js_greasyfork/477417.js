// ==UserScript==
// @name         Ev.IO ChronoHack
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Free ChronoHack cheat for the game ev.io with features such as esp, convenient aimbot and beautiful clickgui
// @author       ilyxa05
// @match        *://ev.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ev.io
// @grant        none
// @run-at       document-end
// @antifeature  ads
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/477417/EvIO%20ChronoHack.user.js
// @updateURL https://update.greasyfork.org/scripts/477417/EvIO%20ChronoHack.meta.js
// ==/UserScript==

let espEnabled = false;
let aimbotEnabled = false;
let tracers = true;
let espSize = 1;
const ver = 'v0.1';
let AIMBOT_FOV = THREE.MathUtils.degToRad(50);
let AIMBOT_DELAY = 300;  // 300 миллисекунд = 0.3 секунды

const geometry = new THREE.EdgesGeometry( new THREE.BoxGeometry( 1, 2, 1 ).translate( 0, 1, 0 ) );

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

let worldScene;

WeakMap.prototype.set = new Proxy( WeakMap.prototype.set, {
	apply( target, thisArgs, [ object ] ) {

		if ( object.type === 'Scene' ) {

			if ( object.children.length > 4 ) {

				worldScene = object;

				console.log( 'SCENE FOUND!', worldScene );

			}

		}

		return Reflect.apply( ...arguments );

	}
} );

const precision = Math.pow( 10, 4 );

function createKey( object ) {

	return Math.round( precision * object.position.x ) + ',' + Math.round( precision * object.position.z );

}

function findHeadBone( player ) {

	for ( let j = 0; j < player.children.length; j ++ ) {

		const child = player.children[ j ].children[ 0 ];

		if ( child && child.isSkinnedMesh ) {

			const bones = child.skeleton.bones;

			for ( let k = 0; k < bones.length; k ++ ) {

				const bone = bones[ k ];

				if ( bone.name.indexOf( 'Head' ) > - 1 ) {

					return bone;

				}

			}

		}

	}

	return null;

}

const canvas = document.getElementById( 'canvas' );
const p = new THREE.Vector3();

const raycaster = new THREE.Raycaster();

/*let tracersLines = [];

function createTracer(start, end) {
    const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const geometry = new THREE.Geometry();
    geometry.vertices.push(start, end);

    const line = new THREE.Line(geometry, material);
    worldScene.add(line);
    return line;
}*/


function animate() {

	if ( worldScene ) {

		let myCamera;

		const spriteMap = {};

		const players = [];

		for ( let i = 0; i < worldScene.children.length; i ++ ) {

			const child = worldScene.children[ i ];

			if ( child.type === 'PerspectiveCamera' ) {

				myCamera = child;

			} else if ( child.type === 'Sprite' ) {

				try {

					if ( child.material.map.image.className === 'canvas_healthbar' ) {

						child.isEnemy = child.material.depthTest === true;
						spriteMap[ createKey( child ) ] = child;

					}

				} catch ( err ) {}

			} else if ( child.name !== '' && child.type === 'Group' && child.visible ) {

				if ( child.headBone === undefined ) {

					child.headBone = findHeadBone( child );

				}

				if ( child.headBone ) {

					players.push( child );

				}

			}

		}

		let targetPlayer;
		let minDistance = Infinity;

		for ( let i = 0; i < players.length; i ++ ) {

			const player = players[ i ];

			p.setScalar( 0 ).applyMatrix4( player.headBone.matrixWorld )

			player.isAlive = Math.hypot( p.x - player.position.x, p.z - player.position.z ) < 1;

			if ( ! player.myBox ) {

				player.myBox = new THREE.LineSegments( geometry, material );
				player.add( player.myBox );

			}

			player.myBox.scale.setScalar( espSize );

			if ( ! player.sprite || player.sprite.parent !== worldScene ) {

				player.sprite = spriteMap[ createKey( player ) ];

			}

			player.myBox.visible = player.isAlive && ( player.sprite ? player.sprite.isEnemy : true );

			if ( player.myBox.visible ) {

				const d = player.position.distanceTo( myCamera.position );

				if ( d < minDistance ) {

					targetPlayer = player;
					minDistance = d;

				}

			}

			player.myBox.visible &&= espEnabled;

		}

        /*if (tracers) {
        // Очистка старых линий
        tracersLines.forEach(line => worldScene.remove(line));
        tracersLines = [];

        players.forEach(player => {
            if (player.myBox.visible) {
                const startPoint = new THREE.Vector3(0, 0, 0.5).unproject(myCamera);
                // Создаем трейсер между центром экрана и игроком
                const line = createTracer(startPoint, player.position);
                worldScene.add(line);
                tracersLines.push(line);
            }
        });
    } else {
        // Если трейсеры выключены, удаляем все линии
        tracersLines.forEach(line => worldScene.remove(line));
        tracersLines = [];
    }*/


        //aimbot func | if ( aimbotEnabled && targetPlayer ) {
		if (aimbotEnabled && targetPlayer) {
    const directionToPlayer = targetPlayer.position.clone().sub(myCamera.position).normalize();
    const angle = directionToPlayer.angleTo(myCamera.getWorldDirection(new THREE.Vector3()));

    if (angle < AIMBOT_FOV) {
        setTimeout(() => {
            const yaw = myCamera.rotation.y;
            const pitch = myCamera.rotation.x;

            myCamera.rotation.order = 'YXZ';
            myCamera.lookAt(targetPlayer.position.x, targetPlayer.position.y + 1.5, targetPlayer.position.z);

            canvas.dispatchEvent(new MouseEvent('mousemove', {
                movementX: (yaw - myCamera.rotation.y) * 500,
                movementY: (pitch - myCamera.rotation.x) * 500
            }));
        }, AIMBOT_DELAY);
    }
}



	}
}

window.requestAnimationFrame = new Proxy( window.requestAnimationFrame, {
	apply( target, thisArgs, args ) {

		args[ 0 ] = new Proxy( args[ 0 ], {
			apply( target, thisArgs, args ) {

				Reflect.apply( ...arguments );

				animate();

			}
		} );

		return Reflect.apply( ...arguments );

	}
} );

const value = parseInt( new URLSearchParams( window.location.search ).get( 'showAd' ), 16 );

const shouldShowAd = isNaN( value ) || Date.now() - value < 0 || Date.now() - value > 10 * 60 * 1000;

const el = document.createElement( 'div' );

const msgClassName = randomString();
const dialogClassName = randomString();
const aimfovsliderClassName = randomString();

//kvadratik
const statusBoxEl = document.createElement('div');
statusBoxEl.className = 'statusBox';

const espStatusEl = document.createElement('div');
espStatusEl.className = 'statusIndicator';
espStatusEl.textContent = espEnabled ? 'ESP [V]: ON' : 'ESP [V]: OFF';
espStatusEl.style.borderRight = espEnabled ? "3px solid #77eb34" : "3px solid #eb4034";

const aimbotStatusEl = document.createElement('div');
aimbotStatusEl.className = 'statusIndicator';
aimbotStatusEl.textContent = aimbotEnabled ? 'Aimbot [B]: ON' : 'Aimbot [B]: OFF';
aimbotStatusEl.style.borderRight = aimbotEnabled ? '3px solid #77eb34' : '3px solid #eb4034';

const watermark = document.createElement('div');
watermark.className = 'watermark';
watermark.textContent = "Chrono b1 | by ilyxa05";

statusBoxEl.appendChild(aimbotStatusEl);
statusBoxEl.appendChild(espStatusEl);
document.body.appendChild(statusBoxEl);
document.body.appendChild(watermark);



//html interpritator
el.innerHTML = `
<style>
.watermark{
    border-radius: 4px!important;
    display: flex;
    justify-content: center;
    align-items: center;
    color:#fff;
    width: 300px;
    height: 30px;
    background: #29292970;
    position: absolute;
    top: 5px;
    right: 5px;
    z-index: 999999;
    border-top: 4px solid;
    border-image: url(https://i.giphy.com/media/3otO6NFBIAFg2vPZuM/giphy.webp) 100;
}
.dialog {
	position: absolute;
	left: 50%;
	top: 50%;
	background: rgba(31, 31, 31, 0.8);
	border-radius: 6px!important;
	color: #fff;
	transform: translate(-50%, -50%);
	box-shadow: 0 0 0 10000px rgba(0, 0, 0, 0.3);
	text-align: center;
	z-index: 999998;
}

.dialog * {
	color: #fff;
}

.dialog .btn {
	cursor: pointer;
	padding: 0.5em;
	background: hsla(0, 67%, 44%, 0.7);
	border: 3px solid rgba(0, 0, 0, 0.2);
}

.dialog .btn:active {
	transform: scale(0.8);
}
.chrono{
    font-weight: 700;
    font-size: 20px;
    margin-right: 20px;
    display: flex;
    align-items: center;
    z-index: 999999;
}
.chrono img{
    width: 35px;
    height: 35px;
}
.tab-container {
    display: flex;
    align-items: center;
    padding: 5px;
    border-radius: 6px!important;
    background: rgba(26, 26, 26, 0.8);
    display: flex;
  }

  .tab-button {
    width: 80px;
    border-radius: 4px!important;
    padding: 10px 20px;
    margin: 5px;
    border: none;
    cursor: pointer;
    background-color: #a96ec7;
  }

  .tab-button:hover {
    background-color: #8b54a6;
  }

  .tab-content {
    margin-top: 10px;
    display: flex;
    justify-content: center;
  }

  .tab-content h2 {
    margin-top: 0;
  }

  .tab-content p {
    margin-bottom: 0;
  }
.chronolabelcheck{
    margin-right: 4px;
    margin-left: 10px;
}
.chronoslider{
    margin-bottom: 20px;
    max-width: 200px;
}
.chronosliders{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
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


.msg {
	position: absolute;
	left: 10px;
	bottom: 10px;
	background: rgba(50, 0, 0, 0.8);
	color: #fff;
	padding: 15px;
	animation: msg 0.5s forwards, msg 0.5s reverse forwards 3s;
	z-index: 999999;
	pointer-events: none;
    background: #29292990;
}

@keyframes msg {
	from {
		transform: translate(-120%, 0);
	}

	to {
		transform: none;
	}
}
.statusBox {
        position: absolute;
        top: 76px;
        right: 10px;
        border-radius: 5px;
        z-index: 9999999;
    }
    .statusIndicator {
        background: #29292990;
        display: block;
        margin: 5px 0;
        width: 130px;
        height: 30px;
        color: #fff;
        text-align: right;
        padding-right: 10px;
        line-height: 30px;
        border-top-left-radius: 5px!important;
        border-bottom-left-radius: 5px!important;

    }
#aimbot-fov {
            border-collapse: separate;
            perspective: 1px;
            position: absolute;
            top: 50%;
            left: 50%;
            border-radius: 50%!important;
            border: 2px solid red;
            pointer-events: none;
            z-index: 9999;
        }
.chronocheckbox{
    margin-right: 5px;
    width: 9px;
    height: 9px;
}
</style>
<div class="dialog">
    <div class="tab-container">
        <div class="chrono">
            <img src="https://i.ibb.co/YkpnJvC/chrono-logo.png" alt="">Chrono
        </div>
        <button class="tab-button" id="tab1Button">AimBot</button>
        <button class="tab-button" id="tab2Button">Visuals</button>
        <button class="tab-button" id="tab3Button">Misc</button>
    </div>

    <div id="tab1" class="tab-content">
        <label class="chronolabelcheck" for="aimbotcheckbox"> AimBot: </label>
        <input class="chronocheckbox" type="checkbox" id="aimbotCheckbox" onchange="toggleAimbot()">

        <label class="chronolabelcheck" for="ragefovcheckbox"> RageFOV: </label>
        <input class="chronocheckbox" type="checkbox" id="ragefovcheckbox" onchange="toggleRageFOV()">
        <br>

        <div class="chronosliders">
            <label for="aimfovslider">AimBot FOV: <span id="aimfovvalue"> 50</span></label>
            <input class="chronoslider" type="range" id="aimfovslider" min="10" max="100" value="50">
        </div>

        <div class="chronosliders">
            <label for="aimdelayslider">AimBot Delay: <span id="aimdelayvalue"> 300</span></label>
            <input class="chronoslider" type="range" id="aimdelayslider" min="20" max="800" value="50">
        </div>
    </div>


      <div id="tab2" class="tab-content">
        <label for="espCheckbox"> ESP: </label>
        <input class="chronocheckbox" type="checkbox" id="espCheckbox" onchange="toggleEsp()">

        <label for="wallhackCheckbox"> WallHack: </label>
        \
        <input class="chronocheckbox" type="checkbox" id="espCheckbox" onchange="toggleWallHack()">

      </div>

      <div id="tab3" class="tab-content">
        <p>soon.</p>
      </div>
</div>
<div class="msg" style="display: none;"></div>
<div id="aimbot-fov"></div>
`
	.replaceAll( 'dialog', dialogClassName )
	.replaceAll( 'close', randomString() )
	.replaceAll( 'msg', msgClassName )
	.replaceAll( 'btn', randomString() );

//render aimbotfov
function updateAimbotFovVisibility() {
    const fovElement = document.getElementById('aimbot-fov');
    if (aimbotEnabled) {
        fovElement.style.display = 'block';
    } else {
        fovElement.style.display = 'none';
    }
}
function updateAimbotFovElement() {
    const fovElement = document.getElementById('aimbot-fov');
    if (!fovElement) return;

    const fovDiameterPx = Math.tan(AIMBOT_FOV / 2) * window.innerHeight; // Это только пример. Формула может отличаться в зависимости от вашей реализации.

    fovElement.style.width = `${fovDiameterPx}px`;
    fovElement.style.height = `${fovDiameterPx}px`;
    fovElement.style.marginTop = `-${fovDiameterPx / 2}px`;
    fovElement.style.marginLeft = `-${fovDiameterPx / 2}px`;
}
window.onload = updateAimbotFovElement;

function randomString() {

	return Math.random().toString( 32 ).slice( 2 ).replace( /^\d/, 'a' );

}

const msgEl = el.getElementsByClassName( msgClassName )[ 0 ];
const dialogEl = el.getElementsByClassName( dialogClassName )[ 0 ];


while ( el.children.length > 0 ) {

	document.body.appendChild( el.children[ 0 ] );

}

function toggleWallHack() {
    const checkbox = document.getElementById('wallhackCheckbox');
    if (checkbox.checked) {
        enableWallHack();
        showMsg( 'Aimbot: ' + ( aimbotEnabled ? 'ON' : 'OFF' ) );
    } else {
        disableWallHack();
    }
}

function enableWallhack() {
    worldScene.traverse(function(child) {
        console.log(child);  // Логирование каждого объекта в сцене для отладки
        if (child instanceof THREE.Mesh && child.name === 'Enemy') {  // Проверьте правильность имени 'Enemy' для вашей игры
            if (Array.isArray(child.material)) {
                child.material.forEach(mat => {
                    mat.transparent = true;
                    mat.opacity = 0.5;
                });
            } else {
                child.material.transparent = true;
                child.material.opacity = 0.5;
            }
        }
    });
}

function disableWallHack() {
    if (worldScene) {
        worldScene.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
                if (child.name === 'Enemy') {
                    child.material.transparent = false;
                    child.material.opacity = 1;
                }
            }
        });
    }
}


function updateAimbotFovFromSlider() {
    const sliderValue = document.getElementById('aimfovslider').value;
    AIMBOT_FOV = THREE.MathUtils.degToRad(parseInt(sliderValue));
    updateAimbotFovElement();
}

const aimfovslider = document.getElementById('aimfovslider');
aimfovslider.addEventListener('input', updateAimbotFovFromSlider);

document.addEventListener('DOMContentLoaded', () => {
    updateAimbotFovElement();
});

function updateAimbotDelayFromSlider() {
    const sliderValue = document.getElementById('aimfovslider').value;
    AIMBOT_FOV = THREE.MathUtils.degToRad(parseInt(sliderValue));
    updateAimbotDelayElement();
}

const aimdelayslider = document.getElementById('aimdelayslider');
aimdelayslider.addEventListener('input', updateAimbotDelayFromSlider);

document.addEventListener('DOMContentLoaded', () => {
    updateAimbotDelayElement();
});

function openTab(tabName) {
  var i, tabContent;
  tabContent = document.getElementsByClassName("tab-content");
  for (i = 0; i < tabContent.length; i++) {
    tabContent[i].style.display = "none";
  }
  document.getElementById(tabName).style.display = "block";
}

document.getElementById('aimfovslider').addEventListener('input', function() {
    const fovValue = this.value;
    document.getElementById('aimfovvalue').textContent = ' '+fovValue;

    // Здесь вы можете также обновить значение AIMBOT_FOV, если необходимо
    AIMBOT_FOV = THREE.MathUtils.degToRad(fovValue);
});

document.getElementById('aimdelayslider').addEventListener('input', function() {
    const delayValue = this.value;
    document.getElementById('aimdelayvalue').textContent = ' '+delayValue;

    AIMBOT_DELAY = delayValue;
});

document.getElementById("tab1Button").addEventListener("click", function() {
  openTab('tab1');
});

document.getElementById("tab2Button").addEventListener("click", function() {
  openTab('tab2');
});

document.getElementById("tab3Button").addEventListener("click", function() {
  openTab('tab3');
});

openTab('tab1');

function toggleEsp() {
    espEnabled = !espEnabled;
}
function toggleAimbot() {
    updateAimbotFovVisibility();
}
updateAimbotFovVisibility();

document.addEventListener('DOMContentLoaded', function() {
    const espCheckbox = document.getElementById('espCheckbox');
    espCheckbox.addEventListener('change', toggleWallHack); // Или enableWallhack, в зависимости от вашего имени функции
});




const espCheckbox = document.getElementById('espCheckbox');

  // Добавляем обработчик события для изменения состояния чекбокса
espCheckbox.addEventListener('change', function () {
    espEnabled = espCheckbox.checked; // Обновляем значение переменной в зависимости от состояния чекбокса
    showMsg('ESP: ' + (espEnabled ? 'ON' : 'OFF'));
    espStatusEl.textContent = espEnabled ? 'ESP [V]: ON' : 'ESP [V]: OFF';
    espStatusEl.style.borderRight = espEnabled ? "3px solid #77eb34" : "3px solid #eb4034";
});

const aimbotCheckbox = document.getElementById('aimbotCheckbox');

aimbotCheckbox.addEventListener('change', function () {
    aimbotEnabled = aimbotCheckbox.checked;
    showMsg('AimBot: ' + (aimbotEnabled ? 'ON' : 'OFF'));

    updateAimbotFovVisibility();
    aimbotStatusEl.textContent = aimbotEnabled ? 'AimBot [B]: ON' : 'AimBot [B]: OFF';
    aimbotStatusEl.style.borderRight = aimbotEnabled ? "3px solid #77eb34" : "3px solid #eb4034";
});

let defaultFOV = THREE.MathUtils.degToRad(50);

const ragefovcheckbox = document.getElementById('ragefovcheckbox').addEventListener('change', toggleRageFOV);
function toggleRageFOV() {
    console.log("toggleRageFOV function is called!");
    const rageFovCheckbox = document.getElementById('ragefovcheckbox');

     if (rageFovCheckbox.checked) {
        AIMBOT_FOV = THREE.MathUtils.degToRad(999);
        console.log("RageFOV activated:", AIMBOT_FOV); // Добавьте этот вывод для отладки
    } else {
        AIMBOT_FOV = defaultFOV;
        console.log("RageFOV deactivated:", AIMBOT_FOV); // Добавьте этот вывод для отладки
    }
    showMsg('RageFOV: ON');
}

window.addEventListener( 'keyup', function ( event ) {

	switch ( event.code ) {

            case 'KeyV':
            espEnabled = !espEnabled;
            showMsg('ESP: ' + (espEnabled ? 'ON' : 'OFF'));
            espStatusEl.textContent = espEnabled ? 'ESP [V]: ON' : 'ESP [V]: OFF';
            espStatusEl.style.borderRight = espEnabled ? "3px solid #77eb34" : "3px solid #eb4034";
            break;

          case 'KeyB':
			aimbotEnabled = ! aimbotEnabled;
            updateAimbotFovVisibility();
			showMsg( 'Aimbot: ' + ( aimbotEnabled ? 'ON' : 'OFF' ) );
            aimbotStatusEl.textContent = aimbotEnabled ? 'AimBot [B]: ON' : 'AimBot [B]: OFF';
            aimbotStatusEl.style.borderRight = aimbotEnabled ? '3px solid #77eb34' : '3px solid #eb4034';
			break;

		case 'Comma':

			if (AIMBOT_FOV > THREE.MathUtils.degToRad(10)) {

				AIMBOT_FOV -= THREE.MathUtils.degToRad(5);
                updateAimbotFovElement();
				showMsg("AIMBOT_FOV Size Descreased");
            }

			break;

		case 'Period':
            if (AIMBOT_FOV < THREE.MathUtils.degToRad(360)) {

			    AIMBOT_FOV += THREE.MathUtils.degToRad(5);
                updateAimbotFovElement();
		    showMsg("AIMBOT_FOV Size Increased");

            }
			break;

		case 'KeyH':
			dialogEl.style.display = dialogEl.style.display === '' ? 'none' : '';
			break;

	}

} );

function showMsg( msg ) {

	msgEl.innerText = msg;

	msgEl.style.display = 'none';

	void msgEl.offsetWidth;

	msgEl.style.display = '';

}