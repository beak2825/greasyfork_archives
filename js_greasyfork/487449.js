// ==UserScript==
// @name         🌟GZMod🌟
// @namespace    https://discord.gg/Z3TXQBPV4F
// @version      2.6
// @description  🌟GZMod🌟 - by Gonza - N-AutoTripleMills V-spikes F-Traps H-Doble TP/Turrets Space-SpikeTick RightClick-AutoBreaker R-NormalInsta T-ReverseInsta ,-BoosTick
// @author       Gonza?<3
// @license      MIT
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaDpUOqUoF4GZsqiPys2mxZOUR5DoUBwSAOQ&usqp=CAU
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @match        *://dev.moomoo.io/*
// @require      https://greasyfork.org/scripts/368273-msgpack/code/msgpack.js?version=598723
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @require      https://cdn.jsdelivr.net/npm/msgpack-lite@0.1.26/dist/msgpack.min.js
// @require      https://cdn.jsdelivr.net/npm/fontfaceobserver@2.1.0/fontfaceobserver.standalone.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487449/%F0%9F%8C%9FGZMod%F0%9F%8C%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/487449/%F0%9F%8C%9FGZMod%F0%9F%8C%9F.meta.js
// ==/UserScript==
document.querySelector("#joinPartyButton").remove();
document.querySelector("#pre-content-container").remove(); //ANTI AD
var elementToRemove = document.getElementById("/21823819281/frvr-frvr-moomoo-display-banner-frvr_moomoo_728x90");
if (elementToRemove) {
    elementToRemove.parentNode.removeChild(elementToRemove);
}
const interfaceStyle = "box-shadow: 0 0 10px 10px rgba(0, 0, 0, 0.0)";

const setupCardDiv = document.getElementById("setupCard");
if (setupCardDiv) {
    setupCardDiv.style.cssText += interfaceStyle;
}
document.getElementById("guideCard")
document.getElementById("promoImg").remove();
document.getElementById("promoImgHolder").remove();
document.getElementById("/21823819281/frvr-frvr-moomoo-display-banner-frvr_moomoo_300x250").remove();
const guideCardDiv = document.getElementById("guideCard");
if (guideCardDiv) {
    guideCardDiv.style.cssText += interfaceStyle;
    setupCardDiv.style.backgroundColor = "#181811";
    guideCardDiv.style.backgroundColor = "#181811";
        function cambiarContenido() {
        //Name Game
        var elementoJuego = document.getElementById("gameName");
        if (elementoJuego) {
            elementoJuego.textContent = "GZ Mod";
        //Died Text
        }
        var elementoMuerto = document.getElementById("diedText");
        if (elementoMuerto) {
            elementoMuerto.textContent = "F";
        }
        //Load Text
        var elementoCarga = document.getElementById("loadingText");
        if (elementoCarga) {
            elementoCarga.textContent = "Loading GZMod";
        }
    }

    // Esperar a que la página esté completamente cargada antes de cambiar el contenido
    window.addEventListener('load', cambiarContenido);

$("#mapDisplay").css("background", "url('https://wormax.org/chrome3kafa/moomooio-background.png')");

let lastPing = -1;
let cvs = document.getElementById("gameCanvas"),
    ctx = cvs.getContext("2d");
let Ie = document.getElementById("pingDisplay");
Ie.replaceWith(document.createElement("div"));
Ie.style.fontSize = "20px";
Ie.style.fontFamily = "Calibri";
Ie.style.display = "block";
Ie.style.zIndex = "1";
document.body.appendChild(Ie);
setInterval(() => {
    Ie.style.display = "block";
    Ie.innerText = `${window.pingTime} ping | ${fps} fps`;
}, 0);
const times = [];
let fps;
    function createCompactMenu() {
        if (document.getElementById('compactMenu')) {
            // Si ya existe, eliminarlo
            document.getElementById('compactMenu').remove();
            return;
        }
        var compactMenu = document.createElement('div');
        compactMenu.id = 'compactMenu';
        compactMenu.innerHTML = `
            <div id="compactMenuContent" style="position: fixed; top: 20px; right: 1550px; background-color: rgba(0, 0, 0, 0.8); padding: 10px; border-radius: 5px; color: #fff;">
                <div><strong>Menu</strong></div>
                <hr style="border-top: 1px solid #fff;">
                <div><input type="checkbox" id="bruh" checked>Bruh ( nothing )</div>
                <hr style="border-top: 1px solid #fff;">
                <div><strong>Controles:</strong></div>
                <ul style="list-style: none; padding-left: 0;">
                    <li>C - SquadSpike</li>
                    <li>N - Auto Triple Mill</li>
                    <li>V - Spike</li>
                    <li>F - Trap</li>
                    <li>H - Double Turrets</li>
                    <li>Space - Perfect Stacked Spiketick</li>
                    <li>RightClick - AutoBreaker</li>
                    <li>R - Normal Instakill</li>
                    <li>T - Reverse Instakill</li>
                    <li>Y - OneTick</li>
                    <li>, - Boost OneTick</li>
                    <li>Esc - Menu</li>
                </ul>
            </div>
        `;

        // Agregar el menú compacto al body del documento
        document.body.appendChild(compactMenu);
    }

    // Evento de escucha para la tecla "Esc"
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            // Crea o cierra el menú compacto cuando se presiona "Esc"
            createCompactMenu();
        }
    });

function refreshLoop() {
    window.requestAnimationFrame(() => {
        const now = performance.now();
        while (times.length > 0 && times[0] <= now - 1000) {
            times.shift();
        }
        times.push(now);
        fps = times.length;
        refreshLoop();
    });
}
document.title = " GZMod";
var menuCard = document.querySelector('.menuCard#setupCard');

    // Verificar si se encontró el elemento del menú
    if (menuCard) {
        // Cambiar el color de fondo del menú
        menuCard.style.backgroundColor = '#101010';
    }
let anti = true;
let hitBack = false;
let stackInsta = false;
let lastDamageTick = 0;
let HP = 100;
let gameTick = 0;
var shame = 0;
let shameTime,
    damageTimes = 0;
let mouseX;
let mouseY;

let width;
let height;
//autoaim1
setInterval(() => {
    if (autoaim == true) {
        doNewSend(["D", [nearestEnemyAngle]]);
    }
}, 10);

setInterval(() => {
    if (hatToggle == 1) {
        if (oldHat != normalHat) {
            hat(normalHat);
        }
        if (oldAcc != normalAcc) {
            acc(normalAcc);
        }
        oldHat = normalHat;
        oldAcc = normalAcc
    }
}, 25);

setInterval(function () {
    if (myPlayer.hat == 45) {
        doNewSend(["6", ["plez no kil :c"]]);
    }
}, 1980);// messages send ever 2000ms but this is incase of packet mashes

function normal() {
    hat(normalHat);
    acc(normalAcc);
}

function aim(x, y) {
    var cvs = document.getElementById("gameCanvas");
    cvs.dispatchEvent(new MouseEvent("mousemove", {
        clientX: x,
        clientY: y

    }));
}

let coreURL = new URL(window.location.href);
window.sessionStorage.force = coreURL.searchParams.get("fc");

var packet
var nearestEnemy;
var nearestEnemyAngle;
var oppositeEnemyAngle;
var enemyRan;
let trap_a = null;
let intrap = false;
let trapid = null;
var antitrap = false;
var isEnemyNear;
var primary;
var secondary;
var foodType;
var wallType;
var spikeType;
var millType;
var mineType;
var boostType;
var turretType;
var spawnpadType;
var autoaim = false;
var autoprimary = false;
var autosecondary = false;
var tick = 1;
var oldHat;
var oldAcc;
var enemiesNear;
var normalHat;
var normalAcc;
var ws;
var msgpack5 = msgpack;
var boostDir;
let myPlayer = {
    id: null,
    x: null,
    y: null,
    dir: null,
    object: null,
    weapon: null,
    clan: null,
    isLeader: null,
    hat: null,
    accessory: null,
    isSkull: null,
};

let healSpeed = 100;
var messageToggle = 0;
var clanToggle = 0;
let healToggle = 1;
let hatToggle = 1;
document.msgpack = msgpack;

function n() {
    this.buffer = new Uint8Array([0]);
    this.buffer.__proto__ = new Uint8Array;
    this.type = 0;
}

WebSocket.prototype.oldSend = WebSocket.prototype.send;
WebSocket.prototype.send = function(m) {
    if (!ws) {
        document.ws = this;

        ws = this;
        socketFound(this);
    }
    this.oldSend(m);
};
function socketFound(socket) {
    socket.addEventListener('message', function(message) {
        handleMessage(message);
    });
}
function handleMessage(m) {
    let temp = msgpack5.decode(new Uint8Array(m.data));
    let data;
    if (temp.length > 1) {
        data = [temp[0], ...temp[1]];
        if (data[1] instanceof Array) {
            data = data;
        }
    } else {
        data = temp;
    }
    let item = data[0];
    if (!data) {
        return
    };


    if (item === "io-init") {
        let cvs = document.getElementById("gameCanvas");
        width = cvs.clientWidth;
        height = cvs.clientHeight;
        $(window).resize(function() {
            width = cvs.clientWidth;
            height = cvs.clientHeight;
        });
        cvs.addEventListener("mousemove", e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
    }

    if (item == "C" && myPlayer.id == null) {
        myPlayer.id = data[1];
    }

    if (item == "a") {
        enemiesNear = [];
        for (let i = 0; i < data[1].length / 13; i++) {
            let playerInfo = data[1].slice(13 * i, 13 * i + 13);
            if (playerInfo[0] == myPlayer.id) {
                myPlayer.x = playerInfo[1];
                myPlayer.y = playerInfo[2];
                myPlayer.dir = playerInfo[3];
                myPlayer.object = playerInfo[4];
                myPlayer.weapon = playerInfo[5];
                myPlayer.clan = playerInfo[7];
                myPlayer.isLeader = playerInfo[8];
                myPlayer.hat = playerInfo[9];
                myPlayer.accessory = playerInfo[10];
                myPlayer.isSkull = playerInfo[11];
            } else if (playerInfo[7] != myPlayer.clan || playerInfo[7] === null) {
                enemiesNear.push(playerInfo);
            }
        }
    }
    update();
    if (item == "H") {
        for(let i = 0; i < data[1].length / 8; i++) {
            let info = data[1].slice(8*i, 8*i+8);
            if(info[6] == millType && info[7] == myPlayer.id){
                friendlyMillLocs.push(info)
            }
            if(info[7] == myPlayer.id){
                onWeapon = true;
            }
        }
    }
    update();
    if(item == "Q"){
        removeArraysWithValue(friendlyMillLocs, data[1])
    }
    update();
    if(item == "R"){
        removeArraysWithValue(friendlyMillLocs, data[1])
    }
    update();
    if(item == "S"){
        if(data[1] == 3){
            millCount = data[2];
        }
    }
    update();
    if(friendlyMillLocs){
        nearestFriendlyMill = friendlyMillLocs.sort((a,b) => dist(a, myPlayer) - dist(b, myPlayer))[0];

        if(nearestFriendlyMill){
            nearestFriendlyMillX = nearestFriendlyMill[1]
            nearestFriendlyMillY = nearestFriendlyMill[2]
            nearestFriendlyMillScale = nearestFriendlyMill[4]
        }
    }
    if(Math.sqrt(Math.pow((myPlayer.y-nearestFriendlyMillY), 2) + Math.pow((myPlayer.x-nearestFriendlyMillX), 2)) < nearestFriendlyMillScale + 100) {
        console.log(true)
        isNextToFriendlyMill = true;
    } else {
        isNextToFriendlyMill = false;
    }
    WebSocket.prototype.send = function(m){
        let xcc = new Uint8Array(m);
        this.oldSend(m);
        let realData = {};
        let realInfo = msgpack5.decode(xcc);
        if (realInfo[1] instanceof Array){
            realData.data = [realInfo[0], ...realInfo[1]]
        }
        let rd0 = realData.data[0];
        let rd1 = realData.data[1];
        let rd2 = realData.data[2]

        if(rd0 == 'a'){
            movementDirection = rd1
        }
    };
    isEnemyNear = false;
    if (enemiesNear) {
        nearestEnemy = enemiesNear.sort((a, b) => dist(a, myPlayer) - dist(b, myPlayer))[0];
    }
    if (nearestEnemy) {
        nearestEnemyAngle = Math.atan2(nearestEnemy[2] - myPlayer.y, nearestEnemy[1] - myPlayer.x);
        oppositeEnemyAngle = Math.atan2(nearestEnemy[2] + myPlayer.y, nearestEnemy[1] + myPlayer.x);
        enemyRan = Math.sqrt(Math.pow((myPlayer.y - nearestEnemy[2]), 2) + Math.pow((myPlayer.x - nearestEnemy[1]), 2));
        if (Math.sqrt(Math.pow((myPlayer.y - nearestEnemy[2]), 2) + Math.pow((myPlayer.x - nearestEnemy[1]), 2)) < 285) {
            isEnemyNear = true;
            if (autoaim == false && myPlayer.hat != 7 && myPlayer.hat != 53) {
                normalHat = 6;
                if (primary != 8) {
                    normalAcc = 21
                }
            };
        }
    }
    if (isEnemyNear == false && autoaim == false) {
        if (myPlayer.y < 2400) {
            normalHat = 15;
        } else if (myPlayer.y > 6850 && myPlayer.y < 7550) {
            normalHat = 31;
        } else {
            normalHat = 12;
        }
    }
    if(isEnemyNear == true && nearestEnemy[5] == 4 && nearestEnemy[9] == 7 && hitBack == true && myPlayer.hat != 7 && myPlayer.hat != 53 && myPlayer.hat != 22 && myPlayer.hat != 11){
        doNewSend(["c", [0, 11, 0]]);
        setTimeout(()=>{
            doNewSend(["c", [0, 21, 1]]);
        },60);
    }
    if (!nearestEnemy) {
        nearestEnemyAngle = myPlayer.dir;
    }
    if (item == "X") {
        if (data[5] == 3.6) {
            let dir_1 = (dir) => Math.atan2(Math.sin(dir), Math.cos(dir));
            let a1 = dir_1(
                (Math.atan2(data[2] - myPlayer.y, data[1] - myPlayer.x) +
                 Math.PI +
                 Math.PI) %
                (Math.PI * 2)
            );
            let a2 = dir_1((dir_1(data[3]) + Math.PI) % (Math.PI * 2));
            let a3 = a1 - a2;
            if (0.36 > a3 && -0.36 < a3) {
                doNewSend(["D",[Math.atan2(data[2] - myPlayer.y, data[1] - myPlayer.x)],]);
                if (data[2] < 80 && data[2] > 0) {
                    doNewSend(["c", [0, 6, 0]]);
                    place(foodType);
                    place(foodType);
                }
            }
        }
    }
    if (myPlayer.hat == 45 && shame) shameTime = 30000;
    if (myPlayer.hat == 45 && shame) shame = 30000;
    if (data[0] == "a") {
        gameTick++;
    }
    if (item == "O" && data[1] == myPlayer.id) {
        gameTick = 0;
        lastDamageTick = 0;
        shame = 0;
        HP = 100;
        shameTime = 0;
        if (item == "O" && data[1] == myPlayer.id) {
            let damage = HP - data[2];
            HP = data[2];
            if (damage <= -1) {
                damageTimes++;
                if (!lastDamageTick) return;
                let healTime = gameTick - lastDamageTick;
                lastDamageTick = 0;
                if (healTime <= 1) {
                    shame = shame++;
                } else {
                    shame = Math.max(0, shame - 2);
                }
            } else {
                lastDamageTick = gameTick;
            }
        }
        if (data[2] < 100 && data[2] > 0 && healToggle == true) {
            //normal heal
            setTimeout(() => {
                place(foodType);
                place(foodType);
                doNewSend(["c", [0, 6, 0]]);
            }, 115);
        }
        if (data[2] < 48 && data[2] > 0 && anti == true && (nearestEnemy[5] == 5 || nearestEnemy[5] == 3)) {
            healToggle = false;
            doNewSend(["c", [0, 22, 0]]);
            place(foodType);
            setTimeout(() => {
                place(foodType);
                doNewSend(["c", [0, 6, 0]]);
                healToggle = true;
            }, 200);
            setTimeout(() => {
                doNewSend(["c", [0, 7, 0]]);
            }, 700);
            setTimeout(() => {
                doNewSend(["c", [0, 6, 0]]);
            }, 1900);
        }
        if (data[2] < 62 && data[2] > 41 && anti == true && (nearestEnemy[5] == 5 || nearestEnemy[5] == 3)) {
            healToggle = false;
            doNewSend(["c", [0, 22, 0]]);
            place(foodType);
            setTimeout(() => {
                place(foodType);
                doNewSend(["c", [0, 6, 0]]);
                healToggle = true;
            }, 200);
            setTimeout(() => {
                doNewSend(["c", [0, 7, 0]]);
            }, 700);
            setTimeout(() => {
                doNewSend(["c", [0, 6, 0]]);
            }, 1900);
        }
        if (data[2] < 56 && data[2] > 50) {
            healToggle = false;
            setTimeout(() => {
                place(foodType);
                place(foodType);
                healToggle = true;
            }, 140);
        }
        if (data[2] < 41 && data[2] > 0 && hitBack == true && nearestEnemy[5] == 4) {
            healToggle = false;
            autoaim = true;
            setTimeout(() => {
                place(foodType);
                place(foodType);
            }, 133);
            place(spikeType, nearestEnemyAngle);
            doNewSend(["d", [1]]);
            doNewSend(["c", [0, 7, 0]]);
            doNewSend(["G", [primary, true]]);
            setTimeout(() => {
                doNewSend(["c", [0, 53, 0]]);
                doNewSend(["d", [0]]);
                healToggle = true;
            }, 150);
            setTimeout(() => {
                doNewSend(["c", [0, 11, 0]]);
                autoaim = false;
            }, 300);
        }
    }
    update();
}
function doNewSend(sender) {
    ws.send(new Uint8Array(Array.from(msgpack5.encode(sender))));
}

function acc(id) {
    doNewSend(["c", [0, 0, 1]]);
    doNewSend(["c", [0, id, 1]]);
}

function hat(id) {
    doNewSend(["c", [0, id, 0]]);
}

function placeO(id, angle = Math.atan2(mouseY - height / 2, mouseX - width / 2)) {
    doNewSend(["G", [myPlayer.weapon, true]]);
    doNewSend(["G", [id, null]]);
    doNewSend(["d", [1, angle]]);
    doNewSend(["d", [0, angle]]);
    doNewSend(["G", [myPlayer.weapon, true]]);
}

function place(id, angle = Math.atan2(mouseY - height / 2, mouseX - width / 2)) {
    doNewSend(["G", [id, null]]);
    doNewSend(["d", [1, angle]]);
    doNewSend(["d", [0, angle]]);
    doNewSend(["G", [myPlayer.weapon, true]]);
}

var repeater = function(key, action, interval, bu) {
    let _isKeyDown = false;
    let _intervalId = undefined;

    return {
        start(keycode) {
            if (keycode == key && document.activeElement.id.toLowerCase() !== 'chatbox') {
                _isKeyDown = true;
                if (_intervalId === undefined) {
                    _intervalId = setInterval(() => {
                        action();
                        if (!_isKeyDown) {
                            clearInterval(_intervalId);
                            _intervalId = undefined;
                        }
                    }, interval);
                }
            }
        },

        stop(keycode) {
            if (keycode == key && document.activeElement.id.toLowerCase() !== 'chatbox') {
                _isKeyDown = false;
            }
        }
    };
}
function removeArraysWithValue(arr, valueToRemove) {
    for (let i = arr.length - 1; i >= 0; i--) {
        const innerArray = arr[i];
        if (innerArray.includes(valueToRemove)) {
            arr.splice(i, 1);
        }
    }
}
let movementDirection
let millCount = 0;
let nearestRandomObjectX;
let nearestRandomObjectY;
let friendlyMillLocs = [];
let nearestFriendlyMill;
let nearestFriendlyMillX;
let nearestFriendlyMillY;
let nearestFriendlyMillScale;
let isNextToFriendlyMill = false;
let automilling = false
let automill = false
setInterval(()=>{
    if(automill == true && isNextToFriendlyMill == false && millCount < 298 && automilling == false){
        automilling = true;
        doNewSend(["G",[millType, null]])
        doNewSend(["d",[1, (movementDirection - 1.90)]])
        doNewSend(["d",[0, (movementDirection - 1.90)]])
        doNewSend(["G",[myPlayer.weapon, true]])
        doNewSend(["G",[millType, null]])
        doNewSend(["d",[1, (movementDirection - 3.14)]])
        doNewSend(["d",[0, (movementDirection - 3.14)]])
        doNewSend(["G",[myPlayer.weapon, true]])
        doNewSend(["G",[millType, null]])
        doNewSend(["d",[1, (movementDirection + 1.90)]])
        doNewSend(["d",[0, (movementDirection + 1.90)]])
        doNewSend(["G",[myPlayer.weapon, true]])
        automilling = false
    }
}, 100)
const boostPlacer = repeater(70,() => {place(boostType);},50);
const spikePlacer = repeater(86,() => {place(spikeType);},50);
const placers = [boostPlacer, spikePlacer];
let prevCount = 0;
const handleMutations = (mutationsList) => {
    for (const mutation of mutationsList) {
        if (mutation.target.id === "killCounter") {
            const count = parseInt(mutation.target.innerText, 10) || 0;
            if (count > prevCount) {
                doNewSend(["6", ["Nah, i'd Win"]]);
                setTimeout(()=>{
                    doNewSend(["6", ["🌟GZMod🌟 By Gonza"]]);
                },650);
                prevCount = count;
            }
        }
    }
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
    if (e.keyCode == 78 && document.activeElement.id.toLowerCase() !== "chatbox") {// N = Automill
        automill = !automill;
    }
    if (e.keyCode == 72 && document.activeElement.id.toLowerCase() !== "chatbox") {// H = Turret/Teleporter
        for (let i = 0; i < Math.PI * 1; i+= Math.PI / 2) {
            place(turretType, myPlayer.dir + i);
            place(turretType, myPlayer.dir - i);
        }
    }
const surroundWithSpikes = () => {
    const playerDirection = myPlayer.dir;
    const angles = [
        playerDirection,
        playerDirection + Math.PI,
        playerDirection + Math.PI / 2,
        playerDirection - Math.PI / 2
    ];
    angles.forEach(angle => {
        place(spikeType, angle);
    });
};
document.addEventListener('keydown', (e) => {
    if (e.keyCode === 67 && document.activeElement.id.toLowerCase() !== "chatbox") {
        surroundWithSpikes();
    }
});
    if (e.keyCode == 32 && document.activeElement.id.toLowerCase() !== "chatbox") {
        autoaim = true;
        place(spikeType, nearestEnemyAngle);
        doNewSend(["d", [1]]);
        doNewSend(["c", [0, 7, 0]]);
        doNewSend(["G", [primary, true]]);
        doNewSend(["d", [1]]);
        setTimeout(() => {
            doNewSend(["c", [0, 6, 0]]);
            doNewSend(["d", [0]]);
            autoaim = false;
        }, 400);
    }
    if (e.keyCode == 82 &&document.activeElement.id.toLowerCase() !== "chatbox") {
        if (stackInsta == false) {
            autoaim = true;
            doNewSend(["c", [0, 7, 0]]);
            doNewSend(["G", [primary, true]]);
            doNewSend(["c", [0, 0, 1]])
            doNewSend(["d", [1]]);
            acc(18)
            doNewSend(["c", [1]]);
            setTimeout(() => {
                doNewSend(["G", [secondary, true]]);
                doNewSend(["c", [0, 53, 0]]);
                doNewSend(["c", [0, 0, 1]]);
                acc(21)
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
                acc(21)
                autoaim = false;
            }, 215);
        } else {
            autoaim = true;
            doNewSend(["c", [0, 7, 0]]);
            doNewSend(["G", [primary, true]]);
            doNewSend(["c", [0, 0, 1]])
            doNewSend(["d", [1]]);
            acc(18)
            doNewSend(["c", [1]]);
            setTimeout( () => {
                var sck = "";
                doNewSend(["G", [secondary, true]]);
                doNewSend(["c", [0, 53, 0]]);
                doNewSend(["c", [0, 0, 1]]);
                for(let i = 0; i < 850; i++){
                    let caas = new Uint8Array(550);
                    for(let i = 0; i <caas.length;i++){
                        caas[i] = Math.floor(Math.random()*270);
                        sck += caas[i]
                    }
                }
                ws.send(caas);
            }, 105);
            setTimeout(() => {
                doNewSend(["G", [secondary, true]]);
            }, 200);
            setTimeout(() => {
                doNewSend(["G", [primary, true]]);
                doNewSend(["d", [0, null]]);
                doNewSend(["c", [0, 6, 0]]);
                doNewSend(["c", [0, 0, 0]]);
                doNewSend(["c", [0, 0, 1]]);
                hat(12)
                acc(21)
                autoaim = false;
            }, 215);
        }
    }
    if (e.keyCode == 188 &&document.activeElement.id.toLowerCase() !== "chatbox") {
        autoaim = true;
        setTimeout(()=>{
            doNewSend(["d", [1]]);
            doNewSend(["G", [secondary, true]]);
        },99);
        setTimeout(()=>{
            doNewSend(["c", [0, 53, 0]]);
            place(boostType);
        },50);
        setTimeout(() => {
            doNewSend(["G", [primary, true]]);
            doNewSend(["c", [0, 7, 0]]);
            doNewSend(["d", [1]]);
            doNewSend(["d", [0]]);
        }, 175);
        setTimeout(() => {
            doNewSend(["G", [primary, true]]);
            doNewSend(["c", [0, 6, 0]]);
            doNewSend(["d", [0]]);
            autoaim = false;
        }, 500);
    }
    if (e.keyCode == 84 && document.activeElement.id.toLowerCase() !== "chatbox") {
        if(stackInsta == false){
            // insta
            autoaim = true;
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
                autoaim = false;
            }, 500);
        } else {
            autoaim = true;
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
                    }
                }
                ws.send(caas);
            }, 80);
            setTimeout(() => {
                doNewSend(["G", [primary, true]]);
                doNewSend(["c", [0, 6, 0]]);
                doNewSend(["d", [0]]);
                autoaim = false;
            }, 500);
        }
    }
    if (e.keyCode == 66 &&document.activeElement.id.toLowerCase() !== "chatbox") {//manual bulltick
        doNewSend(["c", [0, 7, 0]]);
        setTimeout(()=>{
            doNewSend(["c", [0, 13, 1]]);
        },60);
    }
})
document.addEventListener('keyup', (e) => {
    if (["allianceinput", "chatbox", "nameinput", "storeHolder"].includes(document.activeElement.id.toLowerCase()))
        return null;
    placers.forEach((t) => {
        t.stop(e.keyCode);
    })
})
document.addEventListener("mouseup", (event) => {
    // Verificar si el evento proviene de un elemento dentro de storeMenu
    const storeMenu = document.getElementById("storeMenu");
    if (storeMenu.contains(event.target)) {
        // El evento ocurrió dentro del storeMenu, no hagas nada
        return;
    }

    // Aquí colocas el código que quieres ejecutar solo si el evento no está dentro del storeMenu
    if (event.button == 0) {
        doNewSend(["d", [1]]);
        doNewSend(["c", [0, 7, 0]]);
        doNewSend(["G", [primary, true]]);
        setTimeout(()=>{
            doNewSend(["d", [0]]);
            doNewSend(["c", [0, 12, 0]]);
        },100);
    } else if (event.button == 0) {
        doNewSend(["d", [1]]);
        doNewSend(["c", [0, 7, 0]]);
        setTimeout(()=>{
            doNewSend(["d", [0]]);
            doNewSend(["c", [0, 12, 0]]);
        },100);
    }
});

document.addEventListener("mousedown", (event) => {
    if (event.button == 2 && secondary != 10) {
        doNewSend(["d", [1]]);
        doNewSend(["c", [0, 40, 0]]);
        doNewSend(["G", [primary, true]]);
        setTimeout(()=>{
            doNewSend(["d", [0]]);
            doNewSend(["c", [0, 6, 0]]);
        },100);
    } else if (event.button == 2) {
        doNewSend(["d", [1]]);
        doNewSend(["c", [0, 40, 0]]);
        doNewSend(["G", [secondary, true]]);
        setTimeout(()=>{
            doNewSend(["d", [0]]);
            doNewSend(["c", [0, 6, 0]]);
        },100);
    }
});
function isElementVisible(e) {
    return (e.offsetParent !== null);
}

function toRad(angle) {
    return angle * 0.01745329251;
}

function dist(a, b) {
    return Math.sqrt(Math.pow((b.y - a[2]), 2) + Math.pow((b.x - a[1]), 2));
}
function update() {
    for (let i = 0; i < 9; i++) {
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))) {
            primary = i;
        }
    }
    for (let i = 9; i < 16; i++) {
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))) {
            secondary = i;
        }
    }
    for (let i = 16; i < 19; i++) {
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))) {
            foodType = i - 16;
        }
    }
    for (let i = 19; i < 22; i++) {
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))) {
            wallType = i - 16;
        }
    }
    for (let i = 22; i < 26; i++) {
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))) {
            spikeType = i - 16;
        }
    }
    for (let i = 26; i < 29; i++) {
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))) {
            millType = i - 16;
        }
    }
    for (let i = 29; i < 31; i++) {
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))) {
            mineType = i - 16;
        }
    }
    for (let i = 31; i < 33; i++) {
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))) {
            boostType = i - 16;
        }
    }

    for (let i = 33; i < 39; i++) {
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString())) && i != 36) {
            turretType = i - 16;
        }
    }
    spawnpadType = 36;
}
var styleItem = document.createElement("style");
styleItem.type = "text/css";
styleItem.appendChild(document.createTextNode(`
  .loader {
  position: absolute;
  top:110%;
  left:46%;
    border: 16px solid #333;
    border-radius: 50%;
    border-top: 16px solid #181818;
    box-shadow: 0 0 10px 10px rgba(0, 0, 0, 0.4);
    width: 60px;
    height: 60px;
    -webkit-animation: spin 0.5s linear infinite; /* Safari */
    animation: spin 0.5s linear infinite;
  }
  @-webkit-keyframes spin {
    0% { -webkit-transform: rotate(0deg); }
    100% { -webkit-transform: rotate(360deg); }
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  #gameUI .joinAlBtn, a {
    animation: 5s infinite linear both normal rainbow;
  }

  @keyframes rainbow {
    0% { filter: hue-rotate(0deg) }
    100% { filter: hue-rotate(360deg) }
  }`));
document.head.appendChild(styleItem);
window.addEventListener("load", () => {
    let toggleRender = true;
    let canvas = document.getElementById("gameCanvas");
    let ctx = canvas.getContext("2d");
    let screenWidth = 1920;
    let screenHeight = 1080;
    let screenW = screenWidth / 2;
    let screenH = screenHeight / 2;
document.addEventListener("keydown", function (e) {
    if (e.keyCode == 27) {
        $('#infomenu').toggle();
        ext = !ext;
    };
});
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
        setInterval(() => {
            // Function to clear console
function clearConsole() {
    console.clear();
}

// Clear console initially
clearConsole();

// Set interval to clear console every 2 minutes and 30 seconds (150000 milliseconds)
setInterval(clearConsole, 150000);
    })}})})}