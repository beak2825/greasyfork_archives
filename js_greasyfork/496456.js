// ==UserScript==
// @name         EZ HACK MOD by EZ HACK v 1.5 Beta
// @namespace    no
// @license      MIT
// @version      1.5
// @author       EZ HACK
// @description  A mod suitable for professionals only, not automatic, only automatic healing.
// @match        *://*.moomoo.io/*
// @match        *://dev.moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @require 	 https://greasyfork.org/scripts/478839-moomoo-io-packet-code/code/MooMooio%20Packet%20Code.js
// @require      https://cdn.jsdelivr.net/npm/msgpack-lite@0.1.26/dist/msgpack.min.js
// @require      https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js
// @grant        none
// @icon         https://i.imgur.com/Q7vI76D.png
// @downloadURL
// @downloadURL https://update.greasyfork.org/scripts/496456/EZ%20HACK%20MOD%20by%20EZ%20HACK%20v%2015%20Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/496456/EZ%20HACK%20MOD%20by%20EZ%20HACK%20v%2015%20Beta.meta.js
// ==/UserScript==
/*
Key code :
R__insta kill
T__revers insta
F__trap
V__spieks
O__4 spieaks
C__no hat
N__auto 3 mill
G__ boster hat / wanter cap / Fish hat
H__ 2 turret
E__tank gear / solder helmet    If you have a problem with the E button, press the number zero
0-zero__tank gear / solder helmet
Q __speed auto heal
U__store Menu
Y__alliance Menu
L__on / off funy
CLICK FORWARD__ tank gear / solder helmet
Right click__ nice DMG
Space__1 spieks + DMG
Shift__solder helmet
Click scroll wheel__ 4 trap
INSERT__Hide accessories
B__chat(turret pls)
M__chat(fuck Israel)
*/
(function() {
    "use strict"

    const adSelectors = [
        "#adCard", "#adBlock", "#promoImgHolder",
        "#pre-content-container"
    ]
    const meaninglessSelectors = [
        "#joinPartyButton", "#partyButton", "#settingsButton",
        `script[src="./libs/howler.core.min.js"]`, "#errorNotification",
        "#youtubeFollow", "#linksContainer2", "#twitterFollow",
        "#followText", "#youtuberOf", "#mobileInstructions",
        "#downloadButtonContainer", "#mobileDownloadButtonContainer", ".downloadBadge",
        "#altServer"
    ]
    const stateColors = {
        enabled: "#7ee559",
        disabled: "#e55959"
    }

    function removeElement(selector) {
        const elements = [ ...document.querySelectorAll(selector) ]

        for (const element of elements) {
            if (!element) continue

            if (!(element.remove instanceof Function)) {
                element.style.display = "none !important"
                element.style.visiblity = "hidden !important"

                continue
            }

            element.remove()
        }
    }

    function removeElements(selectors) {
        for (const selector of selectors) {
            if (!selector) continue

            removeElement(selector)
        }
    }

    function getCustomId(id) {
        id = id.toLowerCase().replace(/(\-|\s)/g, "_")

        return `beta_adapter_${id}`
    }

    function getGameDefaultButton(id) {
        const button = document.createElement("div")

        button.classList.add("menuButton")

        button.id = id

        return button
    }

    function addButtonToSetupCard(name, state, listener) {
        const setupCard = document.getElementById("setupCard")
        const id = getCustomId(name)
        const button = getGameDefaultButton(id)

        button.innerHTML = `<span>${name}</span>`
        button.style.marginTop = "16px"

        setupCard.appendChild(button)

        button.setState = function(_state) {
            const stateColor = stateColors[_state ? "enabled" : "disabled"]

            button.style.backgroundColor = stateColor
        }

        button.setState(state)

        if (!(listener instanceof Function)) return

        button.addEventListener("click", listener.bind(null, button))
    }

    function getRemoveStoreHatsState() {
        return JSON.parse(localStorage.getItem("remove_store_hats"))
    }

    function setRemoveStoreHatsState(_state) {
        localStorage.setItem("remove_store_hats", JSON.stringify(_state))
    }

    function onDOMLoaded() {
        removeElements(adSelectors)
        removeElements(meaninglessSelectors)

        addButtonToSetupCard("Remove store hats", getRemoveStoreHatsState(), (button) => {
            const state = !getRemoveStoreHatsState()

            button.setState(state)
            setRemoveStoreHatsState(state)
        })

        const storeButton = document.getElementById("storeButton")
        const storeTabs = document.querySelectorAll(".storeTab")
        const removeHatsButtons = [ storeButton, ...storeTabs ]

        removeHatsButtons.forEach((button) => {
            button.addEventListener("click", () => {
                if (!getRemoveStoreHatsState()) return

                const interval = setInterval(() => {
                    const mainMenu = document.getElementById("mainMenu")
                    const hatPreview = document.querySelector(".hatPreview")

                    if (mainMenu) return clearInterval(interval)
                    if (!hatPreview) return

                    removeElement(".hatPreview")
                    clearInterval(interval)
                })
            })
        })
    }

    window.location.native_resolution = true

    const oldReqAnimFrame = window.requestAnimationFrame

    window.requestAnimationFrame = function(callback) {
        if (callback.toString().length === 69) {
            return window.setTimeout(callback, 1e3 / 111)
        }

        return oldReqAnimFrame(callback)
    }

    Object.defineProperty(HTMLImageElement.prototype, "src", {
        get() {
            return this[Symbol("src")]
        },
        set(value) {
            if (this.classList.contains("hatPreview")) {
                if (getRemoveStoreHatsState() && (/\/hats\/hat\_/.test(value) || /\/accessories\/access\_/.test(value))) {
                    return this.remove()
                }
            }

            this.setAttribute("src", value)

            this[Symbol("src")] = value
        },
        configurable: true
    })

    Object.defineProperty(Object.prototype, "turnSpeed", {
        get() {
            return 0
        },
        set(value) {
            this[Symbol("turnSpeed")] = 0
        },
        configurable: true
    })

    const maxScreenWidth = 1920
    const maxScreenHeight = 1080
    const { lineTo, moveTo } = CanvasRenderingContext2D.prototype
    const gridAlpha = 0.06

    CanvasRenderingContext2D.prototype.moveTo = function(x, y) {
        if (this.globalAlpha === gridAlpha) return

        return moveTo.apply(this, arguments)
    }

    CanvasRenderingContext2D.prototype.lineTo = function(x, y) {
        if (this.globalAlpha === gridAlpha && (y === maxScreenHeight || x === maxScreenWidth)) return

        return lineTo.apply(this, arguments)
    }

    window.addEventListener("DOMContentLoaded", onDOMLoaded)
})()
const PASSWORD = "EZ HACK MOD";
    let password = prompt("Enter Your Password!");
    while (password !== PASSWORD) {
        alert("LOL");
        password = prompt("Enter Password");
    }
document.getElementById('enterGame').innerText = "⇏ ‍ ‍ Enter_game. ‍ ‍ ‍⇍";
document.getElementById("enterGame").addEventListener("mouseenter", function() {
	document.getElementById('enterGame').innerText = "⇏ Enter_game. ‍⇍";
});
document.getElementById("enterGame").addEventListener("mouseleave", function() {
	document.getElementById('enterGame').innerText = "⇏ ‍  ‍  Enter_game. ‍ ‍   ‍⇍";
});
$('#itemInfoHolder').css({
	'text-align': 'center',
	'top': '25px',
	'left': '440px',
	'right': '350px',
	'max-width': '350px'
});
document.getElementById('chatBox').innerHTML = 'Hi LOL-_-';
document.getElementById('gameName').innerHTML = '';
setTimeout(() => {
	document.getElementById('gameName').innerHTML = 'Loading..';
	setTimeout(() => {
		document.getElementById('gameName').innerHTML = 'E';
		setTimeout(() => {
			document.getElementById('gameName').innerHTML = 'EZ';
			setTimeout(() => {
				document.getElementById('gameName').innerHTML = 'EZ ';
				setTimeout(() => {
					document.getElementById('gameName').innerHTML = 'EZ H';
					setTimeout(() => {
						document.getElementById('gameName').innerHTML = 'EZ HA';
						setTimeout(() => {
							document.getElementById('gameName').innerHTML = 'EZ HAC';
							setTimeout(() => {
								document.getElementById('gameName').innerHTML = 'EZ HACK';
								setTimeout(() => {
									document.getElementById('gameName').innerHTML = 'EZ HACK ';
									setTimeout(() => {
										document.getElementById('gameName').innerHTML = 'EZ HACK MOD v1.5 Beta';
									}, 120);
								}, 120);
							}, 120);
						}, 120);
					}, 120);
				}, 120);
			}, 120);
		}, 120);
	}, 120);
}, 120);
document.getElementById('loadingText').innerHTML = 'Loading...';
setTimeout(() => {
	document.getElementById('loadingText').innerHTML = 'loading_Game';
}, 710);
(function () {
  'use strict';
let allianceMenu = document.getElementById('allianceMenu');
let storeMenu = document.getElementById('storeMenu');
document.addEventListener('keydown', function (event) {
if (shouldHandleMenus(event)) {
if (event.key === 'y') {
toggleMenu(allianceMenu, storeMenu);
} else if (event.key === 'u') {
toggleMenu(storeMenu, allianceMenu);
  }
if (event.key === 'Y') {
toggleMenu(allianceMenu, storeMenu);
} else if (event.key === 'U') {
toggleMenu(storeMenu, allianceMenu);
  }
 }
});
function shouldHandleMenus(event) {
const chatboxActive = document.activeElement.id.toLowerCase() === 'chatbox';
const allianceInputActive = document.activeElement.id.toLowerCase() === 'allianceinput';
return !chatboxActive && !allianceInputActive;
}
function toggleMenu(menu, otherMenu) {
if (menu.style.display === 'none' || menu.style.display === '') {
menu.style.display = 'block';
if (otherMenu.style.display !== 'none') {
otherMenu.style.display = 'none';
}
} else {
menu.style.display = 'none';
 }
}
})();
document.getElementById('loadingText').innerHTML = '....LOL HACK -_-....'
document.getElementById('gameName').style.textShadow = 'none';
document.getElementById('gameName').style.fontSize = "155px";
document.getElementById('linksContainer2').style.background = "black";
document.getElementById('mapDisplay').height = '450';
document.getElementById('mapDisplay').width = '450';
document.getElementById('diedText').innerHTML = "its..ok";
document.getElementById('diedText').style.color = "black";
$("#moomooio_728x90_home").parent().css({display: "none"});
document.getElementById('linksContainer2').innerHTML = 'EZ HACK MOD' ;
document.querySelector("#gameName").innerHTML = "EZ HACK";
document.getElementById("storeHolder").style = "height: 345px; width: 410px;";
document.getElementById('enterGame').innerText = "EZ HACK MOD";
document.getElementById("enterGame").style.color = "#000000";
document.getElementById("enterGame").style.backgroundColor = "black";
document.title = ' EZ HACK MOD';
$("#mapDisplay").css({background: `url('https://i.imgur.com/aGpK7hj.png')`});
$("#wideAdCard").remove();
$("#storeDisplay1").remove();
$("#adCard").remove();
$("#promoImgHolder").remove();
let style = document.createElement('style')
style.appendChild(document.createTextNode(`
`))
    document.head.appendChild(style)
let replaceInterval = setInterval(() => {
if (CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = ((oldFunc) => function() { if (this.fillStyle == "#8ecc51") this.fillStyle = `hsl(180, 100%, 50%)`; return oldFunc.call(this, ...arguments); })(CanvasRenderingContext2D.prototype.roundRect);
  clearInterval(replaceInterval);
}}, 10);
setInterval(() => {
    if (autoaim == true) {
        doNewSend(["D", [nearestEnemyAngle]]);
    }
}, 10);
var spikeType;
var isEnemyNear;
var nearestEnemyAngle;
var autoaim = false;
var primary;
var secondary;
var foodType;
let hitBack = false;
let stackInsta = false;
let anti = true;
let hitTToggle = 1;
let hitToggle = 0;
let hatToggle = 1;
let ais = [];
let ws;
let x = 0;
let y = 0;
let msgpack5 = window.msgpack;
let scale = 45;
let placeOffset = 5;
let crashing;
let cmds = {
autoheal: false,
automill: false
}
let inv = {
primary: null,
secondary: null,
food: null,
wall: null,
spike: null,
trap: null,
mill: null,
mine: null,
boostPad: null,
spikeType: null,
turret: null,
spawnpad: null
};
let myPlayer = {
sid: null,
hp: null,
x: null,
y: null,
dir: null,
buildIndex: null,
weaponIndex: null,
weaponVariant: null,
team: null,
isLeader: null,
skinIndex: null,
tailIndex: null,
iconIndex: null
};
let enemy;
let nearestEnemy;
let enemyInf = { hat: null, x: null, y: null, weaponIndex: null}
document.msgpack = window.msgpack;
WebSocket.prototype.oldSend = WebSocket.prototype.send;
WebSocket.prototype.send = function (e) {
ws || (document.ws = this, ws = this, document.ws.addEventListener("message", hookWS));
this.oldSend(e);
};
function dist(a, b){
return Math.sqrt( Math.pow((b.y-a[2]), 2) + Math.pow((b.x-a[1]), 2) );
}
function handleMessage(m){
let temp = msgpack5.decode(new Uint8Array(m.data));
let data;
if(temp.length > 1) {
data = [temp[0], ...temp[1]];
if (data[1] instanceof Array){
data = data;
}
} else {
data = temp;
}
let item = data[0];
if(!data) {return};
}
let join = message => Array.isArray(message) ? [...message] : [...message];
let hookWS = ms => {
let tmpData = msgpack5.decode(new Uint8Array(ms.data));
let data;
if(tmpData.length > 1) { data = [tmpData[0], ...tmpData[1]]; if (data[1] instanceof Array){ data = data } } else { data = tmpData }
let item = data[0];
if(!data) {return};
if (item == "C" && myPlayer.sid == null){
myPlayer.sid = data[1];
}
if (item == "O" && data[1] == myPlayer.sid) {
let hp = data[2]
if (hp < 91) {
let c;
if (hp < 100) c = 2;
for (let i=0;i<c;i++) setTimeout(() => { place(foodType); }, i * 0.2);
for (let i=0;i<2;i++) setTimeout(() => { place(foodType); }, i * 0);
  }
}
/*if (data[2] < 62 && data[2] > 41 && anti == true && (nearestEnemy[5] == 5 || nearestEnemy[5] == 3)) {
//console.log("anti insta - polearm");
doNewSend(["c", [0, 22, 0]]);
place(inv.food);
for (let i=0;i<2;i++) { place(inv.food); }
setTimeout(() => {
place(inv.food);
doNewSend(["c", [0, 6, 0]]);
}, 240);
}*/
if (item == "a") {
enemy = [];
for(let i = 0; i < data[1].length / 13; i++) {
let inf = data[1].slice(13*i, 13*i+13);
if(inf[0] == myPlayer.sid) {
myPlayer.x = inf[1];
myPlayer.y = inf[2];
myPlayer.dir = inf[3];
myPlayer.buildIndex = inf[4];
myPlayer.weaponIndex = inf[5];
myPlayer.weaponVariant = inf[6];
myPlayer.team = inf[7];
myPlayer.isLeader = inf[8];
myPlayer.skinIndex = inf[9];
myPlayer.tailIndex = inf[10];
myPlayer.iconIndex = inf[11];
} else if(inf[7] != myPlayer.team || inf[7] === null) {
enemy.push(inf);
    }
  }
}
isEnemyNear = false;
if (enemy) {
nearestEnemy = enemy.sort((a, b) => dist(a, myPlayer) - dist(b, myPlayer))[0];
}
isEnemyNear = false;
if (enemy) {
nearestEnemy = enemy.sort((a, b) => dist(a, myPlayer) - dist(b, myPlayer))[0];
}
if (nearestEnemy) {
 nearestEnemyAngle = Math.atan2(nearestEnemy[2] - myPlayer.y, nearestEnemy[1] - myPlayer.x);
}
if (nearestEnemy) {
 enemyInf.weaponIndex = nearestEnemy[5]
 enemyInf.hat = nearestEnemy[9]
 enemyInf.x = nearestEnemy[1]
 enemyInf.y = nearestEnemy[2]
}
if (y !== myPlayer.y || x !== myPlayer.x) {
 if (cmds.automill) {
 let angle = Math.atan2(y - myPlayer.y, x - myPlayer.x);
 place(inv.mill, angle + Math.PI / 2.2);
 place(inv.mill, angle);
 place(inv.mill, angle - Math.PI / 2.2);
}
x = myPlayer.x;
y = myPlayer.y;
  }
 refresh();
}
var turretType;
var repeater = function(key, action, interval) {
let _isKeyDown = false;
let _intervalId = undefined;
return {
 start(keycode) {
  if(keycode == key && document.activeElement.id.toLowerCase() !== 'chatbox') {
   _isKeyDown = true;
   if(_intervalId === undefined) {
    _intervalId = setInterval(() => {
     action();
     if(!_isKeyDown){
     clearInterval(_intervalId);
     _intervalId = undefined;
} }, interval) } } }, stop(keycode) { if(keycode == key && document.activeElement.id.toLowerCase() !== 'chatbox') { _isKeyDown = false; } } } }
function noAcc() {
setTimeout(() => { doNewSend(["c", [0, 0, 1]])}, 10)
setTimeout(() => { doNewSend(["c", [0, 0, 1]])}, 20)
setTimeout(() => { doNewSend(["c", [0, 0, 1]])}, 60)
setTimeout(() => { doNewSend(["c", [0, 0, 1]])}, 70)
setTimeout(() => { doNewSend(["c", [0, 0, 1]])}, 90)
}
function biomeHat() {
if (myPlayer.y < 2400) {
storeEquip(15); doNewSend(["c", [0, 11, 1]]); doNewSend(["c", [0, 15, 0]]); hat(15)
} else {
if (myPlayer.y > 6850 && myPlayer.y < 7550) {
storeEquip(31); doNewSend(["c", [0, 31, 0]]); hat(31); doNewSend(["c", [0, 11, 1]]);
} else {
storeEquip(12); doNewSend(["c", [0, 12, 0]]); hat(12); doNewSend(["c", [0, 11, 1]]);
    }
  }
}
if (!nearestEnemy) {
nearestEnemyAngle = myPlayer.dir;
}
function isElementVisible(e) {
return (e.offsetParent !== null);
}
if (crashing && !closed) {
for (let e = 0; e < 1000; e++) {
let result = new Uint8Array(Math.round(Math.random() * 18));for (let i = 0; i < result.length; i++) {if (i == 0) {result[i] = Math.round(Math.random() * 256);} else {if (i == 1) {result[i] = Math.round(Math.random() * 256);} else {if (i == 2) {result[i] = Math.round(Math.random() * 128);} else {if (i == 3) {result[i] = Math.round(Math.random() * 85);} else {if (i == 4) {result[i] = Math.round(Math.random() * 64);} else {if (i == 5) {result[i] = Math.round(Math.random() * 51);} else {if (i == 6) {result[i] = Math.round(Math.random() * 42);} else {if (i == 7) {result[i] = Math.round(Math.random() * 36);} else {if (i == 8) {result[i] = Math.round(Math.random() * 32);} else {if (i == 9) {result[i] = Math.round(Math.random() * 28);} else {if (i == 10) {result[i] = Math.round(Math.random() * 25);} else {if (i == 11) {result[i] = Math.round(Math.random() * 23);} else {if (i == 12) {result[i] = Math.round(Math.random() * 21);} else {if (i == 13) {result[i] = Math.round(Math.random() * 19);} else {if (i == 14) {result[i] = Math.round(Math.random() * 18);} else {if (i == 15) {result[i] = Math.round(Math.random() * 17);} else {if (i == 16) {result[i] = Math.round(Math.random() * 16);} else {if (i == 17) {result[i] = Math.round(Math.random() * 15);}}}}}}}}}}}}}}}}}}}ws.oldSend(result);
 }
}
function doNewSend(sender){
ws.send(new Uint8Array(Array.from(msgpack5.encode(sender))));
}
const emit = (e, a, b, c, m, r) => ws.send(Uint8Array.from([...msgpack5.encode([e, [a, b, c, m, r]])]));
const place = (e, l) => {
emit("G", e, false);
emit("d", 1, l);
emit("d", 0, l);
emit("G", myPlayer.weaponIndex, true);
};
function chat(msg) { emit("6", msg); }
function acc(id) {
doNewSend(["c", [0, 0, 1]]);
doNewSend(["c", [0, id, 1]]);
}
function hat(id) {
emit("c", myPlayer.skinIndex, id, 0);
doNewSend(["c", [0, id, 0]]);
}
function weapon(e) {
if (e === 'primary') { emit("G", inv.primary, true); }
if (e === 'secondary') { emit("G", inv.secondary, true) }
}
function toRad(angle) {
return angle * 0.01745329251;
}
function hit(e) {
if (e == true || e == false) emit("K", true)
}
const refresh = () => {
for (let c = 0; c < 9; c++) {
var _document$getElementB;
if (((_document$getElementB = document.getElementById(`actionBarItem${c}`)) === null || _document$getElementB === void 0 ? void 0 : _document$getElementB.offsetParent) !== null) {
inv.primary = c;
 }
}
for (let s = 9; s < 16; s++) {
var _document$getElementB2;
if (((_document$getElementB2 = document.getElementById(`actionBarItem${s}`)) === null || _document$getElementB2 === void 0 ? void 0 : _document$getElementB2.offsetParent) !== null) {
inv.secondary = s;
 }
}
for (let P = 16; P < 19; P++) {
var _document$getElementB3;
if (((_document$getElementB3 = document.getElementById(`actionBarItem${P}`)) === null || _document$getElementB3 === void 0 ? void 0 : _document$getElementB3.offsetParent) !== null) {
inv.food = P - 16;
 }
}
for (let f = 19; f < 22; f++) {
var _document$getElementB4;
if (((_document$getElementB4 = document.getElementById(`actionBarItem${f}`)) === null || _document$getElementB4 === void 0 ? void 0 : _document$getElementB4.offsetParent) !== null) {
inv.wall = f - 16;
 }
}
for (let _ = 22; _ < 26; _++) {
var _document$getElementB5;
if (((_document$getElementB5 = document.getElementById(`actionBarItem${_}`)) === null || _document$getElementB5 === void 0 ? void 0 : _document$getElementB5.offsetParent) !== null) {
inv.spike = _ - 16;
 }
}
for (let u = 26; u < 29; u++) {
var _document$getElementB6;
if (((_document$getElementB6 = document.getElementById(`actionBarItem${u}`)) === null || _document$getElementB6 === void 0 ? void 0 : _document$getElementB6.offsetParent) !== null) {
inv.mill = u - 16;
 }
}
for (let I = 29; I < 31; I++) {
var _document$getElementB7;
if (((_document$getElementB7 = document.getElementById(`actionBarItem${I}`)) === null || _document$getElementB7 === void 0 ? void 0 : _document$getElementB7.offsetParent) !== null) {
inv.mine = I - 16;
 }
}
for (let p = 31; p < 33; p++) {
var _document$getElementB8;
if (((_document$getElementB8 = document.getElementById(`actionBarItem${p}`)) === null || _document$getElementB8 === void 0 ? void 0 : _document$getElementB8.offsetParent) !== null) {
inv.boostPad = p - 16;
 }
}
for (let x = 31; x < 33; x++) {
var _document$getElementB9;
if (((_document$getElementB9 = document.getElementById(`actionBarItem${x}`)) === null || _document$getElementB9 === void 0 ? void 0 : _document$getElementB9.offsetParent) !== null) {
inv.trap = x - 16;
 }
}
for (let i = 22; i < 26; i++) {
if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))) {
spikeType = i - 16;
 }
}
for (let i = 16; i < 19; i++) {
if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))) {
foodType = i - 16;
 }
}
for (let i = 9; i < 16; i++) {
if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))) {
secondary = i;
 }
}
for (let i = 0; i < 9; i++) {
if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))) {
primary = i;
 }
}
for (let i=33;i<36;i++){
if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
turretType = i - 16;
 }
}
for (let i=37;i<39;i++){
if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
turretType = i - 16;
  }
 }
};
const boostPlacer = repeater(70,() => {place(inv.trap);},60);
const spikePlacer = repeater(86,() => {place(spikeType);},50);
const placers = [boostPlacer, spikePlacer];
let prevCount = 0;
const handleMutations = (mutationsList) => {
for (const mutation of mutationsList) {
if (mutation.target.id === "killCounter") {
const count = parseInt(mutation.target.innerText, 10) || 0;
if (count > prevCount) {
setTimeout(()=>{ chat('Master Kill') },0);
setTimeout(()=>{
chat('NOOB!!!')
},950);
setTimeout(()=>{
chat('Mod By EZ HACK')
},1930);
setTimeout(()=>{
chat('Mod By EZ HACK')
},2200);
prevCount = count;
}
if (count > prevCount) {
setTimeout(()=>{ chat('Master Kill') },10);
setTimeout(()=>{
chat('NOOB!!!')
},950);
setTimeout(()=>{
chat('Mod By EZ HACK')
},1920);
setTimeout(()=>{
chat('Mod By EZ HACK')
},2200);
prevCount = count;
}}}
};
const observer = new MutationObserver(handleMutations);
observer.observe(document, {
subtree: true,
childList: true,
});
document.addEventListener('keydown', (e) => {
if (["allianceinput", "chatbox", "nameinput", "storeHolder"].includes(document.activeElement.id.toLowerCase()))
return null;
placers.forEach((t) => {
t.start(e.keyCode);
});
if (e.keyCode == 78) {
if (cmds.automill == true) { cmds.automill = false } else { cmds.automill = true }
}
if (e.keyCode === 81) {
for (let i=0;i<2;i++) { place(inv.food); } // Q
};
if (e.keyCode == 16) { storeEquip(6); doNewSend(["c", [0, 31, 0]]); hat(6); setTimeout(() => {doNewSend(["c", [0, 21, 1]]); setTimeout(() => { doNewSend(["c", [0, 21, 1]]);}, 70)}, 70) } // SHIFT
if (e.keyCode == 16) { storeEquip(6); doNewSend(["c", [0, 31, 0]]); hat(6); setTimeout(() => {doNewSend(["c", [0, 21, 1]]); setTimeout(() => { doNewSend(["c", [0, 21, 1]]);}, 70)}, 70) } // SHIFT
if (e.keyCode == 17) { storeEquip(22); doNewSend(["c", [0, 21, 1]]); doNewSend(["c", [0, 22, 0]]); hat(22); setTimeout(() => { doNewSend(["c", [0, 21, 1]]);}, 70) } // CTRL
if (e.keyCode == 17) { storeEquip(22); doNewSend(["c", [0, 21, 1]]); doNewSend(["c", [0, 22, 0]]); hat(22); setTimeout(() => { doNewSend(["c", [0, 21, 1]]);}, 70) } // CTRL
if (e.keyCode == 32) { storeEquip(7); doNewSend(["c", [0, 0, 1]]); setTimeout(() => { storeEquip(53)}, 70); setTimeout(() => { doNewSend(["c", [0, 0, 1]]);}, 70) } // SPACE
if (e.keyCode == 32) { storeEquip(7); doNewSend(["c", [0, 0, 1]]); setTimeout(() => { storeEquip(53)}, 70); setTimeout(() => { doNewSend(["c", [0, 0, 1]]);}, 70) } // SPACE
if (e.keyCode == 67) { chat(''); doNewSend(["c", [0, 0, 0]]); hat(0); setTimeout(() => { doNewSend(["c", [0, 0, 1]])}, 70) } // C
if (e.keyCode == 67) { chat('EZ KILL IM SUPER PRO'); doNewSend(["c", [0, 0, 0]]); hat(0); setTimeout(() => { doNewSend(["c", [0, 0, 1]])}, 70) } // C
if (e.keyCode == 90) { storeEquip(13); doNewSend(["c", [0, 17, 1]]); doNewSend(["c", [0, 13, 0]]); hat(13); setTimeout(() => { doNewSend(["c", [0, 13, 1]]);}, 120) } // Z
if (e.keyCode == 90) { storeEquip(13); doNewSend(["c", [0, 17, 1]]); doNewSend(["c", [0, 13, 0]]); hat(13); setTimeout(() => { doNewSend(["c", [0, 13, 1]]);}, 120) } // Z
if (e.keyCode == 66) { chat('turret pls') } // B
if (e.keyCode == 77) { chat('fak israel') } // M
if (e.keyCode == 32) { chat('Spike insta kill...') } // SPACE
if (e.keyCode == 71) { // G
setTimeout(() => { doNewSend(["c", [0, 11, 1]]);}, 70)
setTimeout(() => { doNewSend(["c", [0, 11, 1]]);}, 50)
setTimeout(() => { doNewSend(["c", [0, 11, 1]]);}, 40)
biomeHat(); biomeHat();
biomeHat(); biomeHat();
}
if (e.keyCode == 69) { // E
hitToggle = (hitToggle + 1) % 2;
if(hitTToggle == 1){
if(hitToggle == 1) {
if(!isEnemyNear){
doNewSend(["c", [0, 40, 0]]);
}
}else{
doNewSend(["c", [0, 6, 0]]);
  }
 }
}
if (e.keyCode == 48) { // 0
hitToggle = (hitToggle + 1) % 2;
if(hitTToggle == 1){
if(hitToggle == 1) {
if(!isEnemyNear){
doNewSend(["c", [0, 40, 0]]);
}
}else{
doNewSend(["c", [0, 6, 0]]);
  }
 }
}
if (e.keyCode == 72) { // H
place(turretType, myPlayer.dir + toRad(45));
place(turretType, myPlayer.dir - toRad(45));
}
if (e.keyCode == 32) { // SPACE
place(inv.spike);
doNewSend(["d", [1]]);
doNewSend(["c", [0, 7, 0]]);
doNewSend(["G", [primary, true]]);
doNewSend(["d", [1]]);
weapon('primary')
hit(true)
setTimeout(() => {
doNewSend(["c", [0, 6, 0]]);
doNewSend(["d", [0]]);
}, 400);
setTimeout(() => {
setTimeout(()=>{storeEquip(53); storeEquip(53) }, 70)
setTimeout(() => { hit(false); storeEquip(6); hat(6) }, 350)
}, 180) } 20
if (e.keyCode == 79) { // O
place(inv.spike, myPlayer.dir + toRad(45));
place(inv.spike, myPlayer.dir - toRad(45));
place(inv.spike, myPlayer.dir + toRad(135));
place(inv.spike, myPlayer.dir - toRad(135));
}
if (e.keyCode == 67) { // C
noAcc();
setTimeout(() => { doNewSend(["c", [0, 0, 1]]);}, 70)
setTimeout(() => { doNewSend(["c", [0, 0, 1]]);}, 50)
setTimeout(() => { doNewSend(["c", [0, 0, 1]]);}, 40)
}
if (e.keyCode == 84) { // T
if(stackInsta == false){
// autoaim = true;
doNewSend(["d", [1]]);
doNewSend(["G", [secondary, true]]);
doNewSend(["c", [0, 53, 0]]);
setTimeout(() => {
doNewSend(["G", [primary, true]]);
doNewSend(["c", [0, 7, 0]]);
doNewSend(["d", [1]]);
doNewSend(["d", [0]]);
}, 80);
setTimeout(() => {
doNewSend(["G", [primary, true]]);
doNewSend(["c", [0, 6, 0]]);
doNewSend(["d", [0]]);
// autoaim = false;
}, 500);
} else {
// autoaim = true;
doNewSend(["d", [1]]);
doNewSend(["G", [secondary, true]]);
doNewSend(["c", [0, 53, 0]]);
setTimeout(() => {
var sck = "";
doNewSend(["G", [primary, true]]);
doNewSend(["c", [0, 7, 0]]);
doNewSend(["d", [1]]);
doNewSend(["d", [0]]);
for(let i = 0; i < 850; i++){
let caas = new Uint8Array(550);
for(let i = 0; i <caas.length;i++){
caas[i] = Math.floor(Math.random()*270);
sck += caas[i]
}}
ws.send(caas);
}, 80);
setTimeout(() => {
doNewSend(["G", [primary, true]]);
doNewSend(["c", [0, 6, 0]]);
doNewSend(["d", [0]]);
// autoaim = false;
}, 500);
}
}
if (e.keyCode == 82) { // R
// autoaim = true;
doNewSend(["c", [0, 7, 0]]);
doNewSend(["G", [primary, true]]);
doNewSend(["G", [weapon('primary'), true]]);
weapon('primary')
doNewSend(["d", [1]]);
}
if (e.keyCode == 82) { // R
if (stackInsta == false) {
// autoaim = true;
doNewSend(["c", [0, 7, 0]]);
doNewSend(["G", [primary, true]]);
doNewSend(["c", [0, 0, 1]])
doNewSend(["d", [1]]);
doNewSend(["c", [1]]);
setTimeout(() => {
weapon('secondary')
doNewSend(["G", [secondary, true]]);
}, 98);
setTimeout(() => {
weapon('secondary')
doNewSend(["G", [secondary, true]]);
}, 100);
setTimeout(() => {
weapon('secondary')
doNewSend(["G", [secondary, true]]);
}, 103.7);
setTimeout(() => {
doNewSend(["G", [secondary, true]]);
doNewSend(["c", [0, 53, 0]]);
doNewSend(["c", [0, 0, 1]]);
}, 105);
setTimeout(() => {
doNewSend(["G", [secondary, true]]);
}, 110);
setTimeout(() => {
doNewSend(["G", [secondary, true]]);
}, 115);
setTimeout(() => {
doNewSend(["G", [primary, true]]);
doNewSend(["d", [0, null]]);
doNewSend(["c", [0, 6, 0]]);
doNewSend(["c", [0, 0, 0]]);
doNewSend(["c", [0, 0, 1]]);
hat(6)
// autoaim = false;
}, 215);
} else {
// autoaim = true;
doNewSend(["c", [0, 7, 0]]);
doNewSend(["G", [primary, true]]);
doNewSend(["c", [0, 0, 1]])
doNewSend(["d", [1]]);
doNewSend(["c", [1]]);
setTimeout( () => {
var sck = "";
doNewSend(["G", [secondary, true]]);
weapon('secondary')
doNewSend(["c", [0, 53, 0]]);
doNewSend(["c", [0, 0, 1]]);
for(let i = 0; i < 850; i++){
let caas = new Uint8Array(550);
for(let i = 0; i <caas.length;i++){
caas[i] = Math.floor(Math.random()*270);
sck += caas[i]
}}
ws.send(caas);
}, 98);
setTimeout(() => {
doNewSend(["G", [secondary, true]]);
}, 200);
setTimeout(() => {
doNewSend(["G", [primary, true]]);
doNewSend(["d", [0, null]]);
doNewSend(["c", [0, 6, 0]]);
doNewSend(["c", [0, 0, 0]]);
doNewSend(["c", [0, 0, 1]]);
hat(6)
acc(21)
// autoaim = false;
}, 215);//215
}}
})
document.addEventListener("keydown", function(event) {
if (event.keyCode === 45) { // INSERT
const chatHolder = document.getElementById("gameUI");
if (chatHolder) {
const currentDisplay = chatHolder.style.display;
chatHolder.style.display = currentDisplay === "none" ? "block" : "none";
}}
});
document.addEventListener('keyup', (e) => {
if (["allianceinput", "chatbox", "nameinput", "storeHolder"].includes(document.activeElement.id.toLowerCase()))
return null;
placers.forEach((t) => {
t.stop(e.keyCode);
})
})
document.addEventListener("mousedown", event => {
if (event.button == 1) {
place(inv.trap, myPlayer.dir + toRad(45));
place(inv.trap, myPlayer.dir - toRad(45));
place(inv.trap, myPlayer.dir + toRad(135));
place(inv.trap, myPlayer.dir - toRad(135));
}
})
document.addEventListener("mousedown", (event) => {
if (event.button == 4) {
doNewSend(["d", [1]]);
doNewSend(["c", [0, 40, 0]]);
doNewSend(["G", [primary, true]]);
setTimeout(()=>{
doNewSend(["d", [0]]);
doNewSend(["c", [0, 6, 0]]);
},100);
} else if (event.button == 4) {
doNewSend(["d", [1]]);
doNewSend(["c", [0, 40, 0]]);
doNewSend(["G", [primary, true]]);
setTimeout(()=>{
doNewSend(["d", [0]]);
doNewSend(["c", [0, 6, 0]]);
},110);
}
})
document.addEventListener("mousedown", event => {
if (event.button == 2) {
weapon('primary')
storeEquip(7)
storeEquip(7)
setTimeout(() => { storeEquip(53); hat(53) }, 100)
setTimeout(() => { storeEquip(6); hat(6) }, 310)
}
});
let ping = document.createElement("div");
ping = document.getElementById("pingDisplay");
ping.style.top = "10px";
ping.style.fontSize = "12px";
ping.style.display = "block";
document.body.append(ping);
window.onbeforeunload = null;

class forReal {
constructor() {
this.time = 100;
this.hatIndex = [50, 28, 29, 30, 36, 37, 38, 44, 35, 43, 49, 57];
this.currentIndex = 0;
this.isActivated = false;
}
newTick(callback, delay) {
setTimeout(callback, delay);
}
toggleActivation() {
this.isActivated = !this.isActivated;
if (this.isActivated) {
chat('on_L')
this.equip();
}else{
setTimeout(()=>{
chat('off_L')
window.storeEquip(0);
}, 500);
}}
equip() {
if (this.currentIndex < this.hatIndex.length) {
let equipNumber = this.hatIndex[this.currentIndex];
window.storeEquip(equipNumber);
this.currentIndex++;
} else {
this.currentIndex = 0;
}
if (this.isActivated) {
setTimeout(() => {
this.newTick(() => this.equip(), this.time);
}, 80);
}}
start() {
document.body.onkeyup = (e) => {
if (e.keyCode === 76) {
this.toggleActivation();
}};}}
const equipManager = new forReal();
equipManager.start();

(function() {
let oldLineTo = CanvasRenderingContext2D.prototype.lineTo;
let oldFillRect = CanvasRenderingContext2D.prototype.fillRect;
CanvasRenderingContext2D.prototype.lineTo = function() {
    if (this.globalAlpha != .06) oldLineTo.apply(this, arguments);
};
document.getElementById("enterGame").addEventListener('click', rwrw)
var RLC = 0
var MLC = 0
var KFC = 0
function rwrw() {
console.log("Game Start")
S = 1;
M = 1;
H = 1
}
var H = 1,
M = 1,
S = 1
setInterval(() => {
RLC++
S++
}, 1000);
setInterval(() => {
if (RLC == 60) {
MLC++
RLC = 0
}
if (MLC == 60) {
KFC++
MLC = 0
}
if (S == 60) {
M++
S = 0
}
if (M == 60) {
H++
M = 0
}
}, 0);
const { msgpack } = window
function AntiKick() {
this.resetDelay = 500
this.packetsLimit = 40
this.ignoreTypes = [ "pp", "rmd" ]
this.ignoreQueuePackets = [ "5", "c", "33", "2", "7", "13c" ]
this.packetsStorage = new Map()
this.tmpPackets = []
this.packetsQueue = []
this.lastSent = Date.now()
this.onSend = function(data) {
const binary = new Uint8Array(data)
const parsed = msgpack.decode(binary)
if (Date.now() - this.lastSent > this.resetDelay) {
this.tmpPackets = []
this.lastSent = Date.now()
}
if (!this.ignoreTypes.includes(parsed[0])) {
if (this.packetsStorage.has(parsed[0])) {
const oldPacket = this.packetsStorage.get(parsed[0])
switch (parsed[0]) {
case "2":
case "33":
if (oldPacket[0] == parsed[1][0]) return true
break
 }
}

if (this.tmpPackets.length > this.packetsLimit) {
if (!this.ignoreQueuePackets.includes(parsed[0])) {
this.packetsQueue.push(data)
}
return true
}
this.tmpPackets.push({
type: parsed[0],
data: parsed[1]
})
this.packetsStorage.set(parsed[0], parsed[1])
   }
return false
 }
}
const antiKick = new AntiKick()
let firstSend = false
window.WebSocket.prototype.send = new Proxy(window.WebSocket.prototype.send, {
apply: function(target, _this) {
if (!firstSend) {
_this.addEventListener("message", (event) => {
if (!antiKick.packetsQueue.length) return
const binary = new Uint8Array(event.data)
const parsed = msgpack.decode(binary)
if (parsed[0] === "33") {
_this.send(antiKick.packetsQueue[0])
antiKick.packetsQueue.shift()
}
})
firstSend = true
}
if (antiKick.onSend(arguments[2][0])) return
return Reflect.apply(...arguments)
   }
})
})();
;(async () => {
const MARKER_COLOUR = {
MY_PLAYER: {
render: true,
colour: "#a7f060"
},
TEAMMATE: {
render: true,
colour: "#fceb65"
},
ENEMY: {
render: true,
colour: "#f76363"
 }
}
const MARKER_SIZE = 10
function getItemColour(sid) {
if (sid === myPlayerSID) return MARKER_COLOUR.MY_PLAYER
if (teammates.includes(sid)) return MARKER_COLOUR.TEAMMATE
return MARKER_COLOUR.ENEMY
}
var myPlayerSID = null
var teammates = []
let init = false
await new Promise(async (resolve) => {
let { send } = WebSocket.prototype
WebSocket.prototype.send = function (...x) {
send.apply(this, x)
this.send = send
if (!init) {
init = true
this.addEventListener("message", (e) => {
if (!e.origin.includes("moomoo.io") && !unsafeWindow.privateServer) return
const [packet, data] = msgpack.decode(new Uint8Array(e.data))
switch (packet) {
case PACKETCODE.RECEIVE.setupGame:
myPlayerSID = data[0]
break
case PACKETCODE.RECEIVE.setPlayerTeam:
if (!data[0][1]) {
teammates = []
}
break
case PACKETCODE.RECEIVE.setAlliancePlayers:
teammates = []
for (let i = 0; i < data[0][1].length; i += 2) {
const [sid, name] = data[0][1].slice(i, i + 2)
teammates.push(sid)
}
break
}
})
}
resolve(this)
}
})
let item = null
const symbol = Symbol("isItem")
Object.defineProperty(Object.prototype, "isItem", {
get() {
if (this[symbol] === true) {
item = this
}
return this[symbol]
},
set(value) {
this[symbol] = value
},
configurable: true
})
function drawMarker(ctx) {
if (!item || !item.owner || myPlayerSID === null) return
const type = getItemColour(item.owner.sid)
if (!type.render) return
ctx.fillStyle = type.colour
ctx.beginPath()
ctx.arc(0, 0, MARKER_SIZE, 0, 2 * Math.PI)
ctx.fill()
item = null
}
CanvasRenderingContext2D.prototype.restore = new Proxy(CanvasRenderingContext2D.prototype.restore, {
apply(target, _this, args) {
drawMarker(_this)
return target.apply(_this, args)
}
})
})()
(function() {'use strict';const htmlCanvas = document.getElementById("canvas");const offscreen = htmlCanvas.transferControlToOffscreen();const worker = new Worker("offscreencanvas.js");worker.postMessage({ canvas: offscreen }, [offscreen]);})();

if (window.location.hostname.includes("moomoo.io") ||
window.location.hostname.includes("sandbox.moomoo.io") ||
window.location.hostname.includes("dev.moomoo.io")) {
(() => {
"use strict";
const PACKET_LIMITS = {
PER_MINUTE: 1000,
PER_SECOND: 80,
};
const IGNORED_PACKET_TYPES = new Set(["pp", "rmd"]);
const IGNORED_QUEUE_PACKETS = new Set(["5", "c", "33", "2", "7", "13c"]);
class AntiKick {
constructor() {
this.resetRateLimit();
}
resetRateLimit() {
this.packetHistory = new Map();
this.packetQueue = [];
this.lastSent = Date.now();
}
isRateLimited(data) {
const binaryData = new Uint8Array(data);
if (Date.now() - this.lastSent > PACKET_LIMITS.PER_MINUTE) {
this.resetRateLimit();
}
const packetType = binaryData[0];
if (!IGNORED_PACKET_TYPES.has(packetType)) {
if (this.packetHistory.has(packetType) &&
(("2" === packetType || "33" === packetType) && this.packetHistory.get(packetType)[0] === binaryData[1])) {
return true;
}
if (this.packetQueue.length > PACKET_LIMITS.PER_SECOND) {
return IGNORED_QUEUE_PACKETS.has(packetType) || this.packetQueue.push(data);
}
this.packetQueue.push({ type: packetType, data: binaryData.slice(1) });
this.packetHistory.set(packetType, binaryData.slice(1));
}
return false;
}
}
const antiKick = new AntiKick();
WebSocket.prototype.send = new Proxy(WebSocket.prototype.send, {
apply(target, thisArg, binary) {
if (!thisArg.messageListenerSet) {
thisArg.addEventListener("message", (event) => {
if (antiKick.packetQueue.length) {
const binaryData = new Uint8Array(event.data);
if (binaryData[0] === 51) {
thisArg.send(antiKick.packetQueue[0]);
antiKick.packetQueue.shift();
  }
 }
});
thisArg.messageListenerSet = true;
}
if (!antiKick.isRateLimited(binary)) {
return Reflect.apply(target, thisArg, binary);
   }
  },
 });
})();
}
var antii = document.querySelector("#anti")
antii.addEventListener('change', function() {
if (this.checked) {
anti = true;
} else {
anti = false;
}
});
var hitBackk = document.querySelector("#hitBack")
hitBackk.addEventListener('change', function() {
if (this.checked) {
hitBack = true;
} else {
hitBack = false;
}
});
var stackInstaa = document.querySelector("#stackInsta")
stackInstaa.addEventListener('change', function() {
if (this.checked) {
stackInsta = true;
} else {
stackInsta = false;
}
});
// www.mohmoh.eu
localStorage.moofoll = !0;
localStorage.setItem("res", 1000000);