// ==UserScript==
// @name         Ev.IO Aimbot, NameTags ESP & Wireframe View
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Ev.IO's aimbot enables you to target the closest enemy even through walls and objects, with customizable settings such as Smoothing and offsetY. The NameTag ESP feature lets you view enemy health bars through walls, which can be toggled in the menu. Customize the game lighting and make the scene wireframe.
// @author       DOGEWARE
// @match        *://ev.io/*
// @icon         https://media.tenor.com/images/c51500433e6f6fff5a8c362335bc8242/tenor.gif
// @grant        none
// @antifeature  ads
// @downloadURL https://update.greasyfork.org/scripts/493114/EvIO%20Aimbot%2C%20NameTags%20ESP%20%20Wireframe%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/493114/EvIO%20Aimbot%2C%20NameTags%20ESP%20%20Wireframe%20View.meta.js
// ==/UserScript==

function showPopup(message) {
    var popupContainer = document.createElement('div')
    popupContainer.style.position = 'fixed'
    popupContainer.style.top = '0'
    popupContainer.style.left = '0'
    popupContainer.style.width = '100%'
    popupContainer.style.backgroundColor = '#1a1a1a'
    popupContainer.style.color = '#fff'
    popupContainer.style.padding = '10px'
    popupContainer.style.textAlign = 'center'
    popupContainer.style.zIndex = '9999'

    var textElement = document.createElement('div')
    textElement.innerHTML = message
    textElement.style.fontSize = '18px'
    textElement.style.color = '#fff'
    textElement.style.fontFamily = 'monospace !important';

    var buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'inline-block';

    var closeButton = document.createElement('button');
    closeButton.innerHTML = '<b>Confirm</b>';
    closeButton.style.padding = '8px 14px';
    closeButton.style.backgroundColor = '#ff6600';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '6px !important';
    closeButton.style.color = '#fff';
    closeButton.style.cursor = 'pointer';
    closeButton.style.marginLeft = '10px';
    closeButton.style.fontFamily = 'monospace !important';

    closeButton.addEventListener('click', function() {
        document.body.removeChild(popupContainer);
    });

    popupContainer.appendChild(textElement);
    popupContainer.appendChild(buttonContainer);
    popupContainer.appendChild(closeButton);

    document.body.appendChild(popupContainer);
}

const alertMsg = `
🚀 Time to Power Up! 🚀

Attention! 📣 Access to this script now requires our exclusive license key for activation. 🛡️ Secure yours now by visiting our official page at dogescripts.pages.dev. It's quick and easy, taking just a few seconds. Remember, this process needs to be completed about twice a day to keep things running smoothly. Let's level up together! 💪

🫷 Ads OnClick (Popunder) If You Get Redirected Please Close Page👍
`;

const urlParams = new URLSearchParams(window.location.search);

const Start = ["H7", "J6", "P9", "H8"];
const End = ["BJ8", "C8Y", "PLOG", "C149"];

let normalKey = urlParams.get('key');

let paidKeyExpirationTime = localStorage.getItem("paid_key_expiration");

let isValidKey = false;

if (normalKey) {
    for (const startStr of Start) {
        if (normalKey.startsWith(startStr)) {
            for (const endStr of End) {
                if (normalKey.endsWith(endStr)) {
                    isValidKey = true;
                    break;
                }
            }
            break;
        }
    }
} else {
    alert(alertMsg)
    location.href = `https://dogescripts.pages.dev/games/?script=${location.hostname}`
    return;
}

if (isValidKey) {
    showPopup(`Vaild <b>${location.hostname}</b> Script Key! <b>NOTE:</b> [O]Toggle <b>Menu</b>`);
    urlParams.delete("key");
    history.replaceState(null, null, "/" + urlParams.toString());
    console.log('Valid Key');
} else {
    location.href = `https://dogescripts.pages.dev/games/?script=${location.hostname}`;
    return;
}

const prototype_ = {
    ESP: {
        nameTags: true,
        msg: "See More Options On The Experimental Tab"
    },
    aimbot: {
        enabled: true,
        offsetY: 1.5,
        smoothing: 0.8,
        msg: "See More Options On The Experimental Tab"
    },
    lights: {
        msg: "Modifying These Settings May Not Be Changed Back Till Reload",
        intensityDirect: 0.3,
        intensityHemi: 0.6
    },
    experimental:{
        wireframe: true,
        AutoShootOnDist: false,
        AutoMinDist: 20
    }

}
let Scene

let players = []
let TP
let Camera
const sens = 500
const game = document.getElementById( 'canvas' )
const originalWeakMapGet = WeakMap.prototype.get
const CustomSceneColor = new THREE.Color(prototype_.lights.customColor)
function ShootHold(bool) {

    const type = bool ? 'mousedown' : 'mouseup';
    game.dispatchEvent( new MouseEvent( type, { button: 2 } ) );
    game.dispatchEvent( new MouseEvent( type, { button: 0 } ) );

}
if(prototype_.experimental.AutoShootOnDist)setInterval(()=>ShootHold(false), 900)
function HFO(){
    for(const child of Scene.children){
        if(child.type === "PerspectiveCamera"){
            Camera = child
        }
        if (child.type === 'Sprite') {

            if (child.material.map.image.className.includes('healthbar')) {
                child.material.depthTest = prototype_.ESP.nameTags ? false : true
                child.material.depthWrite = true
                players.push(child)

            }

        }else if(child.type === "Group"){
            if(child.children.length === 1){
                try{
                    for(const byteGroup of child.children[0].children){
                        if(byteGroup.type !== "Mesh")continue
                        for(const material of byteGroup.material){
                            material.wireframe = prototype_.experimental.wireframe
                        }
                    }
                }catch{}
            }
        }else if(child.type === "DirectionalLight"){
            child.intensity = prototype_.lights.intensityDirect
        }else if(child.type === "HemisphereLight"){
            child.intensity = prototype_.lights.intensityHemi
        }
    }
    let SkoonDist = Infinity
    let dist
    for (const player of players) {
        try{
            dist = player.position.distanceTo(Camera.position)
            if ( dist < SkoonDist ) {
                TP = player
                SkoonDist = dist
            }
        }catch{}

    }
    if(TP && TP.visible && prototype_.aimbot.enabled){
        const OriginalY = Camera.rotation.y
        const OriginalX = Camera.rotation.x
        Camera.rotation.order = 'YXZ';
        const targetPosition = new THREE.Vector3(TP.position.x, TP.position.y - prototype_.aimbot.offsetY, TP.position.z)
        const targetRotation = new THREE.Quaternion().setFromRotationMatrix(
            new THREE.Matrix4().lookAt(Camera.position, targetPosition, Camera.up)
        );
        Camera.quaternion.slerp(targetRotation, prototype_.aimbot.smoothing);

        game.dispatchEvent( new MouseEvent( 'mousemove', {
            movementX: ( OriginalY - Camera.rotation.y ) * sens,
            movementY: ( OriginalX - Camera.rotation.x ) * sens
        }))
        if(TP && prototype_.experimental.AutoShootOnDist){
            dist = TP.position.distanceTo(Camera.position)
            if(dist < prototype_.experimental.AutoMinDist){
                ShootHold(true)
            }else{
                ShootHold(false)
            }
        }
    }

    players.length = 0

}

WeakMap.prototype.get = function(key) {
    const value = originalWeakMapGet.call(this, key)
    if (key && key.type === "Scene" && key.children instanceof Array && key.children.length > 4) {
        Scene = key

        HFO()
    }
    return value
};



const style = document.createElement('style');
style.innerHTML = `
/* Dark theme styling */
*{
    font-family: monospace !important;
}
#menuContainer * {
    color: #ffffff !important;
    font-family: monospace;
}

#menuContainer {
    background-color: #1a1a1a !important;
    font-family: monospace;
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
    width: 345px !important;
}

.menuHeaderText1 {
    font-size: 20px !important;
    text-align: center !important;
    width: 170px !important;
    margin-top: 15px;

}

.menuItemTitle1 {
    font-size: 18px !important;
    animation: rgbAnimation 0.5s infinite alternate !important;
}

@keyframes rgbAnimation {
    0% { color: rgb(255, 0, 0) !important; }
    25% { color: rgb(255, 255, 0) !important; }
    50% { color: rgb(0, 255, 0) !important; }
    75% { color: rgb(0, 255, 255) !important; }
    100% { color: rgb(255, 0, 255) !important; }
}

.tab {
    gap: 1.3px !important;
display: flex !important;
    justify-content: space-around !important;
    margin-bottom: 20px !important;
}

.tab button {
    background-color: transparent !important;
    border: none !important;
    padding: 8px 12px !important;
    font-weight: 400 !important;
    outline: none !important;
    color: #ffffff !important;
    cursor: pointer !important;
    transition: all 0.3s ease !important;
}

.tab button:hover,
.tab button.active {
    background-color: rgba(255, 255, 255, 0.2) !important;
    border-radius: 5px !important;
}

.tabcontent {
    display: none !important;
    margin-top: 20px !important;
}

.tabcontent.active {
    display: block !important;
}

.dropdown-toggle {
    appearance: none !important;
    -webkit-appearance: none !important;
    -moz-appearance: none !important;
    background-color: #1f1f1f !important;
    color: #ffffff !important;
    border: none !important;
    margin-top: -37px !important;
    padding: 13px !important;
    border-radius: 5px !important;
    cursor: pointer !important;
    float: right !important;
    margin-left: 139.8px !important;
    border: 1px solid #333333 !important;
    font-weight: 400 !important;
    width: 90px !important;
    height: 50px !important;
}

.dropdown-toggle:focus {
    outline: none !important;
}

.dropdown-toggle option {
    background-color: #1f1f1f !important;
    color: #ffffff !important;
}

.dropdown-toggle:hover,
.dropdown-toggle:focus {
    background-color: #333333 !important;
}

input[type="text"] {
   width: 140px !important;
    padding: 20px !important;
    margin-bottom: 10px !important;
    border-radius: 5px !important;
    border: 1px solid #333333 !important;
    background-color: #1f1f1f !important;
    color: #ffffff !important;
    float: right !important;
    margin-left: 10px !important;
    height: 20px !important;
    margin-top: 7px !important;
}

.label-inline {
    float: left !important;
    display: inline-block !important;
    width: 100px !important;
    margin-right: 10px !important;
    margin-top: 20px !important;
    padding: 0 !important;
    font-size: 18.5px !important;
}

.overlay {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    background-color: rgba(0, 0, 0, 0.5) !important;
    backdrop-filter: blur(5px) !important;
    z-index: 999 !important;
    display: none !important;
}

.overlay.show {
    display: block !important;
}

.bg1 {
    background: linear-gradient(to right, rgb(90, 100, 200), rgb(200, 90, 100)) !important;
    border-radius: 3px !important;
}

.inlineNames {
    display: flex !important;
    justify-content: space-around !important;
    width: min-content !important;
    gap: 8px !important;
}

.inlineNames img {
    object-fit: cover !important;
    border-radius: 10px !important;
    top: -7px;
    position: relative;
}

`;
document.head.appendChild(style)

const overlay = document.createElement('div')
overlay.classList.add('overlay')
document.body.appendChild(overlay)


const menuContainer = document.createElement('div')
menuContainer.id = 'menuContainer'
document.body.appendChild(menuContainer)
const header = document.createElement('div')
header.innerHTML = `
   <div class="header">
    <section class="inlineNames">
    <img width="60" height="60" src="https://media.tenor.com/images/c51500433e6f6fff5a8c362335bc8242/tenor.gif">
    <p class='menuHeaderText1'>🎉KrunkWare🎉</p>
    </section>
      <div class="bg1" style="height: 6px;"></div>
    </div>
    <div style="height: 18px;"></div>
    <br>
`
menuContainer.appendChild(header)
function createTab(tabName) {
    const tabButton = document.createElement('button')
    tabButton.textContent = tabName.charAt(0).toUpperCase() + tabName.slice(1)
    tabButton.addEventListener('click', () => openTab(tabName))
    tabLinks.appendChild(tabButton)

    const tabContent = document.createElement('div')
    tabContent.classList.add('tabcontent')
    menuContainer.appendChild(tabContent)
    tabContents[tabName] = tabContent

    populateTab(tabName)
}

function populateTab(tabName) {
    const tabContent = tabContents[tabName]
    const tabOptions = prototype_[tabName]
    for (const option in tabOptions) {
        if (typeof tabOptions[option] !== 'object') {
            const label = document.createElement('label')
            label.textContent = option.charAt(0).toUpperCase() + option.slice(1)
            label.classList.add('label-inline')
            tabContent.appendChild(label)

            if (typeof tabOptions[option] === 'boolean') {
                const dropdownContainer = document.createElement('div')
                dropdownContainer.classList.add('dropdown-container')

                const dropdownButton = document.createElement('button')
                dropdownButton.classList.add('dropdown-toggle')
                dropdownButton.textContent = tabOptions[option] ? 'Enabled' : 'Disabled'
                dropdownButton.addEventListener('click', event => {
                    tabOptions[option] = !tabOptions[option]
                    dropdownButton.textContent = tabOptions[option] ? 'Enabled' : 'Disabled'
                });
                dropdownContainer.appendChild(dropdownButton)

                tabContent.appendChild(dropdownContainer)
            } else {
                const inputField = document.createElement('input')
                inputField.type = 'text'
                inputField.value = tabOptions[option]
                inputField.classList.add('input-field')
                inputField.addEventListener('change', event => {
                    tabOptions[option] = event.target.value
                });
                tabContent.appendChild(inputField)
            }
            tabContent.appendChild(document.createElement('br'))
        }
    }
}



function openTab(tabName) {
    const tabs = document.querySelectorAll('.tabcontent')
    tabs.forEach(tab => tab.classList.remove('active'))
    const tabButtons = document.querySelectorAll('.tab button')
    tabButtons.forEach(tabButton => tabButton.classList.remove('active'))
    const tabContent = tabContents[tabName]
    tabContent.classList.add('active')
    const tabButton = [...tabLinks.querySelectorAll('button')].find(button => button.textContent === tabName.charAt(0).toUpperCase() + tabName.slice(1))
    tabButton.classList.add('active')
}


const tabLinks = document.createElement('div')
tabLinks.classList.add('tab')
menuContainer.appendChild(tabLinks)

const tabContents = {}
const tabNames = Object.keys(prototype_)
tabNames.forEach(tabName => {
    createTab(tabName)
});
openTab(tabNames[0])
let firstOpen = false
overlay.classList.add('show')
document.addEventListener('keydown', function(event) {
    if (event.keyCode === 79) {
        const displayStyle = menuContainer.style.display
        menuContainer.style.display = displayStyle === 'none' ? 'block' : 'none'

        if (menuContainer.style.display === 'block') {
            overlay.classList.add('show')
        } else {
            overlay.classList.remove('show')
        }

        if (!firstOpen) {
            window.open('https://dogescripts.pages.dev/games/promo-page', '_blank')
            firstOpen = true
        }
    }
})