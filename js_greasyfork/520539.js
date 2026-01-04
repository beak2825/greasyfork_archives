// ==UserScript==
// @name         Nuker (Original by DOGEWARE) - Krunker.io script / WORKING
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Krunker's Mod Menu Aimbot targets nearest VISIBLE player. Adjust Smoothing for precision. Use Xray to see through walls, wireframe for players & world, and more
// @author       GreasyNigga
// @match        *://krunker.io/*
// @match        *://browserfps.com/*
// @exclude      *://krunker.io/social*
// @exclude      *://krunker.io/editor*
// @icon         https://cdn.pixabay.com/animation/2022/10/03/09/01/09-01-52-110_512.gif
// @grant        none
// @require      https://unpkg.com/three@0.150.0/build/three.min.js
// @antifeature  ads
// @downloadURL https://update.greasyfork.org/scripts/520539/Nuker%20%28Original%20by%20DOGEWARE%29%20-%20Krunkerio%20script%20%20WORKING.user.js
// @updateURL https://update.greasyfork.org/scripts/520539/Nuker%20%28Original%20by%20DOGEWARE%29%20-%20Krunkerio%20script%20%20WORKING.meta.js
// ==/UserScript==


let WorldScene;
let intersections;
let DOGEWARE = {
    player: {
        wireframe: false,
        opacity: 1,
        charmsColor: "#Ff0000"
    },
    spin: {
        spinbot: false,
        speed: 0.1,
        spinAngle: 0
    },
    ESP: {
        BoxESP: true,
        Charms: true,
        wireframe: false,
        layer: 2,
        opacity: 0.3
    },
    Cam: {
        x: 0,
        y: 0,
        z: 0
    },
    aimbot: {
        krunkAimbot: false,
        smoothingFactor: 0.6,
        AimOffset: 0,
        far: 1,
    },
}
let norms = {
    allowTarget: true,
    console: console.log,
    injectTime: 3000
}
const origialArrayPush = Array.prototype.push
const getMainScene = function(object) {
    if(object && object.parent && object.parent.type === "Scene" && object.parent.name === "Main") {
        WorldScene = object.parent;
        norms.console(WorldScene)
        Array.prototype.push = origialArrayPush;
    }
    return origialArrayPush.apply(this, arguments);
};

const ESPMatrix = new THREE.EdgesGeometry(new THREE.BoxGeometry( 5, 13, 0.02 ).translate(0,5,0));

const ESPMaterial = new THREE.RawShaderMaterial({
    vertexShader: `
        attribute vec3 position;

        uniform mat4 projectionMatrix;
        uniform mat4 modelViewMatrix;

        void main() {
            vec4 pos = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            pos.z = 0.9999;
            gl_Position = pos;
        }
    `,
    fragmentShader: `
        void main() {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
    `,
    depthTest: false,
    depthWrite: false,
    transparent: true
});
function HBO() {
    requestAnimationFrame.call(window, HBO);
    if(!WorldScene) {
        window.setTimeout(() => {
            Array.prototype.push = getMainScene;
        }, norms.injectTime)
    }
    const entities = []
    let myController
    let PlayerTarget
    let RangeFactor = Infinity

    WorldScene.children.forEach(child => {
        if(child.material)child.material.wireframe = DOGEWARE.ESP.wireframe
        if(child.type === 'Object3D') {
            try {
                const Camera = child.children[0]?.children[0]
                if(Camera && Camera.type === 'PerspectiveCamera') {
                    myController = child
                } else {
                    entities.push(child)
                }
            } catch {}
        }
    });
    if(!myController) {
        Array.prototype.push = getMainScene
        return
    }
    function DoSpin(){
        DOGEWARE.spin.spinAngle += DOGEWARE.spin.speed
        const targetRotationY = DOGEWARE.spin.spinAngle % (Math.PI * 2)
        myController.children[0].rotation.y += (targetRotationY - myController.children[0].rotation.y) * DOGEWARE.aimbot.smoothingFactor
    }
    entities.forEach(player => {
        try{
            if(player.children[0].children[4].children[0].name === "head"){
                const charmsColor = new THREE.Color(DOGEWARE.player.charmsColor);
                const material = player.children[0].children[0].material
                material.transparent = true
                material.fog = false;
                material.color.copy(charmsColor);
                material.emissive.copy(charmsColor);
                material.depthTest = DOGEWARE.ESP.Charms ? false : true;
                material.depthWrite = false
                material.wireframe = DOGEWARE.player.wireframe;
                material.opacity = DOGEWARE.player.opacity;
                const vertex = new THREE.LineSegments(ESPMatrix, ESPMaterial)
                if (!player.vertex) player.add(vertex)
                vertex.frustumCulled = false
                player.vertex = vertex;
                player.vertex.visible = DOGEWARE.ESP.BoxESP
                const { x: playerX, z: playerZ } = player.position;
                const { x: controllerX, z: controllerZ } = myController.position;

                if (playerX !== controllerX || playerZ !== controllerZ) {
                    const dist = player.position.distanceTo(myController.position)
                    if(dist < RangeFactor) {
                        PlayerTarget = player
                        RangeFactor = dist
                    }
                }
            }
        }catch(e){}
    });
    if(DOGEWARE.spin.spinbot)DoSpin()
    const Vector = new THREE.Vector3()
    const HoldObject = new THREE.Object3D()
    HoldObject.rotation.order = 'YXZ'
    HoldObject.matrix.copy(myController.matrix).invert()
    myController.children[0].position.set(DOGEWARE.Cam.x,DOGEWARE.Cam.y,DOGEWARE.Cam.z)
    if( myController !== undefined && PlayerTarget !== undefined) {
        if(DOGEWARE.aimbot.krunkAimbot){
            try{
                const dist = PlayerTarget.position.distanceTo(myController.position)
                Vector.setScalar(0)
                PlayerTarget.children[0].children[4].children[0].localToWorld(Vector)
                HoldObject.position.copy(myController.position)
                HoldObject.lookAt(Vector.x, Vector.y, Vector.z)

                const targetRotationX = -HoldObject.rotation.x + DOGEWARE.aimbot.AimOffset / dist * 5
                const targetRotationY = HoldObject.rotation.y + Math.PI
                myController.children[0].rotation.x += (targetRotationX - myController.children[0].rotation.x) * DOGEWARE.aimbot.smoothingFactor
                myController.rotation.y += (targetRotationY - myController.rotation.y) * DOGEWARE.aimbot.smoothingFactor

            }catch{}
        }

    } else {}
}
function createMenuItem() {
    const styleTag = document.createElement('style')
    styleTag.textContent = `
        .menuItem1:hover img{
          transform: scale(1.1);
        }
      `;
    document.head.appendChild(styleTag)
    const menuItemDiv = document.createElement('div')
    menuItemDiv.classList.add('menuItem')
    menuItemDiv.classList.add('menuItem1')
    menuItemDiv.setAttribute('onmouseenter', 'playTick()');
    menuItemDiv.setAttribute('onclick', 'playSelect()');
    const iconSpan = document.createElement('span')
    iconSpan.innerHTML = `<img src="https://cdn.pixabay.com/animation/2022/10/03/09/01/09-01-52-110_512.gif" width='60' height='60'>`
    iconSpan.style.color = '#ff6a0b';
    const titleDiv = document.createElement('div')
    titleDiv.classList.add('menuItemTitle1')
    titleDiv.classList.add('menuItemTitle')
    titleDiv.id = 'menuBtnProfile';
    titleDiv.style.fontSize = '18px';
    titleDiv.textContent = 'Nuker';
    menuItemDiv.addEventListener('click', openCheats)
    menuItemDiv.appendChild(iconSpan);
    menuItemDiv.appendChild(titleDiv);
    const menuItemContainer = document.getElementById('menuItemContainer')
    if(menuItemContainer) {
        menuItemContainer.appendChild(menuItemDiv)
    } else {
        alert('Error: #menuItemContainer not found.')
    }
}
setTimeout(function() {
    createMenuItem()
}, 700)
let Update;

fetch('https://raw.githubusercontent.com/SigmaMaleSnow/UpdateLogKrunker/main/Update.txt')
    .then(response => {
    if (response.ok) {
        return response.text();
    } else {
        throw new Error('Failed to fetch data');
    }
})
    .then(data => {
    Update = data;
    console.log('Fetched data:', Update);
})
    .catch(error => {
    console.error('Error:', error);
});

const style = document.createElement('style');
style.innerHTML = `
/* Dark theme styling */


#menuContainer *{
    color: #ffffff !important;
        font-family: monospace !important;
        letter-spacing: -0.5px;
}
#menuContainer {
background-color: #1a1a1a !important;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
    margin: 0 !important;
    padding: 0 !important;
    position: fixed !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    padding: 20px !important;
    border-radius: 10px !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
    z-index: 1000 !important;
    width: 345px;
}

.menuHeaderText1 {
    font-size: 20px !important;
    text-align: center !important;
    width: 170px;
}

.menuItemTitle1 {
    font-size: 18px !important;
    animation: rgbAnimation 0.5s infinite alternate !important;
}


@keyframes rgbAnimation {
    0% { color: rgb(255, 0, 0); }
    25% { color: rgb(255, 255, 0); }
    50% { color: rgb(0, 255, 0); }
    75% { color: rgb(0, 255, 255); }
    100% { color: rgb(255, 0, 255); }
}

.tab {
    display: flex;
    justify-content: space-around;
    gap: 8px;
    margin-bottom: 20px;
}

.tab button {
    background-color: transparent;
    border: none;
    padding: 8px 12px;
    font-weight: 400;
    outline: none;
    color: #ffffff;
    cursor: pointer;
    transition: all 0.3s ease;
}

.tab button:hover,
.tab button.active {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 5px;
}

.tabcontent {
    display: none;
    margin-top: 20px;
}

.tabcontent.active {
    display: block;
}

.dropdown-toggle {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-color: #1f1f1f;
    color: #ffffff;
    border: none;
    margin-top: 7px;
    padding: 13px;
    border-radius: 5px;
    cursor: pointer;
    float: right 1;
    margin-left: 139.8px !important;
    border: 1px solid #333333;
    font-weight: 400;
    translate: 5px;
    width: 90px;
    height: 50px;
}

.dropdown-toggle:focus {
    outline: none;
}

.dropdown-toggle option {
    background-color: #1f1f1f;
    color: #ffffff;
}

.dropdown-toggle:hover,
.dropdown-toggle:focus {
    background-color: #333333;
}

input[type="text"] {
    width: 140px;
    padding: 12px;
    margin-bottom: 10px;
    border-radius: 5px;
    border: 1px solid #333333;
    background-color: #1f1f1f;
    color: #ffffff;
    float: right;
    margin-left: 10px;
    height: 20px;
    margin-top: 7px;

}

/* Add a class for labels to float them left and make them inline-block */
.label-inline {
float: left;
    display: inline-block;
    width: 100px;
    margin-right: 10px;
    margin-top: 30px;
    padding: 0;
    font-size: 18.5px;
}
.overlay {
    position: fixed !important;
    top: 0;
    left: 0;
    width: 100% !important;
    height: 100% !important;
    background-color: rgba(0, 0, 0, 0.5) !important;
    backdrop-filter: blur(5px);
    z-index: 999 !important;
    display: none;
}

.overlay.show {
    display: block; /* Show overlay when menu is visible */
}
.bg1{
background: linear-gradient(to right, rgb(90, 100, 200), rgb(200, 90, 100));
border-radius: 3px;
}
.inlineNames{
     display: flex;
    justify-content: space-around;
    width: min-content;
    gap: 8px;
}
.inlineNames img{
 object-fit: cover;
 border-radius: 10px;
}
`;
document.head.appendChild(style);

const overlay = document.createElement('div');
overlay.classList.add('overlay');
document.body.appendChild(overlay);
const notification = document.createElement('div');
notification.innerHTML = `
<style>

  #notification {
    position: fixed;
    top: -300px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #1a1a1a;
    color: #fff;
    padding: 15px;
    border-radius: 5px;
    transition: top 0.5s ease;
    z-index: 999999; /* Set z-index as high as possible */
    font-size: 16px; /* Adjust font size */
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* Add box shadow for depth */
    width: 300px;
  }

  .notification-text * {
    font-family: monospace !important;
    margin-bottom: 10px;
    color: #fff;
  }
  @keyframes slideWidth {
    0% {
      width: 0%;
    }
    100% {
      width: 100%;
    }
  }
  .slider-container {
    margin-top: 5px;
    height: 4px;
    border-radius: 0px;
    animation: slideWidth 7.7s linear forwards;
    background-color: #ccc;
    position: relative;
    overflow: hidden;
    transition: width 0.3s ease;
    background: linear-gradient(to right, rgb(90, 100, 200), rgb(100, 150, 200));

  }

</style>
<div id="notification">
  <div class="notification-text">
  <h2 style="text-align: center; font-weight: 600px;">Update 0.8:</h2>
  <p id="dogeupdate">${Update}</p>
  <h3 style="text-align: center; font-weight: 600px;">[O]HIDE MENU</h3>
  </div>
  <div class="slider-container">
  </div>
</div>
`;

document.body.appendChild(notification);

setTimeout(() => {
    const notificationDiv = document.getElementById("notification")

    notificationDiv.style.top = "20px"
    setTimeout(() => {
        notificationDiv.style.top = "-1000px"
    }, 8000)

}, 500)
setInterval(function(){
    if(Update)document.getElementById('dogeupdate').innerHTML = Update
})

const menuContainer = document.createElement('div');
menuContainer.id = 'menuContainer';
document.body.appendChild(menuContainer);
const header = document.createElement('div')
header.innerHTML = `
   <div class="header">
    <section class="inlineNames">
    <img width="60" height="60" src="https://cdn.pixabay.com/animation/2022/10/03/09/01/09-01-52-110_512.gif">
    <p class='menuHeaderText1'>Nuker</p>
    </section>
      <div class="bg1" style="height: 6px;"></div>
    </div>
    <div style="height: 18px;"></div>
`
menuContainer.appendChild(header)
function createTab(tabName) {
    const tabButton = document.createElement('button');
    tabButton.textContent = tabName.charAt(0).toUpperCase() + tabName.slice(1);
    tabButton.addEventListener('click', () => openTab(tabName));
    tabLinks.appendChild(tabButton);

    const tabContent = document.createElement('div');
    tabContent.classList.add('tabcontent');
    menuContainer.appendChild(tabContent);
    tabContents[tabName] = tabContent;

    populateTab(tabName);
}

function populateTab(tabName) {
    const tabContent = tabContents[tabName];
    const tabOptions = DOGEWARE[tabName];
    for (const option in tabOptions) {
        if (typeof tabOptions[option] !== 'object') {
            const label = document.createElement('label');
            label.textContent = option.charAt(0).toUpperCase() + option.slice(1);
            label.classList.add('label-inline');
            tabContent.appendChild(label);

            if (typeof tabOptions[option] === 'boolean') {
                const dropdownContainer = document.createElement('div');
                dropdownContainer.classList.add('dropdown-container');

                const dropdownButton = document.createElement('button');
                dropdownButton.classList.add('dropdown-toggle');
                dropdownButton.textContent = tabOptions[option] ? 'Enabled' : 'Disabled';
                dropdownButton.addEventListener('click', event => {
                    tabOptions[option] = !tabOptions[option];
                    dropdownButton.textContent = tabOptions[option] ? 'Enabled' : 'Disabled';
                    DOGEWARE[tabName][option] = tabOptions[option];
                });
                dropdownContainer.appendChild(dropdownButton);

                tabContent.appendChild(dropdownContainer);
            } else {
                const inputField = document.createElement('input');
                inputField.type = 'text';
                inputField.value = tabOptions[option];
                inputField.classList.add('input-field');
                inputField.addEventListener('input', event => {
                    tabOptions[option] = event.target.value;
                    DOGEWARE[tabName][option] = tabOptions[option];
                });
                tabContent.appendChild(inputField);
            }
            tabContent.appendChild(document.createElement('br'));
        }
    }
}

function openTab(tabName) {
    const tabs = document.querySelectorAll('.tabcontent');
    tabs.forEach(tab => tab.classList.remove('active'));
    const tabButtons = document.querySelectorAll('.tab button');
    tabButtons.forEach(tabButton => tabButton.classList.remove('active'));
    const tabContent = tabContents[tabName];
    tabContent.classList.add('active');
    const tabButton = [...tabLinks.querySelectorAll('button')].find(button => button.textContent === tabName.charAt(0).toUpperCase() + tabName.slice(1));
    tabButton.classList.add('active');
}


const tabLinks = document.createElement('div')
tabLinks.classList.add('tab')
menuContainer.appendChild(tabLinks)

const tabContents = {}
const tabNames = Object.keys(DOGEWARE)
tabNames.forEach(tabName => {
    createTab(tabName)
});
openTab(tabNames[0]);
let firstOpen = false
overlay.classList.add('show')


setInterval(function(){
    console.log(DOGEWARE)
},2000)

function openCheats() {
    const displayStyle = menuContainer.style.display;
    menuContainer.style.transition = 'opacity 0.3s ease';
    menuContainer.style.opacity = '0';

    if (displayStyle === 'none') {
        menuContainer.style.display = 'block';
        setTimeout(() => {
            menuContainer.style.opacity = '1';
            overlay.classList.add('show')
        }, 10);
    } else {
        menuContainer.style.opacity = '0';
        setTimeout(() => {
            menuContainer.style.display = 'none';
            overlay.classList.remove('show')
        }, 300);
    }
}

document.addEventListener('keydown', function(event) {
    if(event.keyCode === 79) {
        openCheats()
    }
});

HBO()