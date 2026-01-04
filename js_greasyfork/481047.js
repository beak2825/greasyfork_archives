// ==UserScript==
// @name        Placement Macros
// @author      Seryo
// @description Spike = V, Trap = F, Windmill = N, Food = Q, H = Turret, 0 = Spawnpad, Keycode 18 = Wall
// @
// @ Hold & Place Macros
// @
// @ These macros depend on CPS; you can modify them in line 33 (31 works best for me).
// @ Controls:
// @
// @ •	V = Spike / Great spike / Spinning spike / Poison spike
// @ •	F = Trap / Boost
// @ •	N = Windmill / Faster windmill / Power mill
// @ •	H = Turret / Teleport / Blocker / Platform / Healing pad
// @ •	0 = Spawn pad
// @ •	Keycode 18 = Wood wall / Stone wall / Castle wall
// @ •	Q = Apple / Cookie / Cheese
// @
// @ Toggle them with Keycode 186 (you can change the keycode in line 261).
// @ Modify Macro Keycodes on line 130.
// @
// @version     2.1
// @match       *://*.moomoo.io/*
// @namespace   https://greasyfork.org/users/1190411
// @icon        https://cdn.glitch.com/82ae8945-dcc6-4276-98a9-665381b4cd2b/cursor12.png
// @require     https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js
// @namespace   http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/481047/Placement%20Macros.user.js
// @updateURL https://update.greasyfork.org/scripts/481047/Placement%20Macros.meta.js
// ==/UserScript==

let pr, sec, st, bt, ft, mlt, wt, spt, tr;

let pressedF, pressedV, pressedN, pressedQ, pressedH, pressed0, pressedAlt;

let cps = 31;
let realCps = Math.round(1020 / cps);
let macrosEnabled = true;

var mouseX;
var mouseY;
var ws;
var width;
var height;
var msgpack5 = msgpack;

function isChatOpen(element) {
    return element.id.toLowerCase() === 'chatbox';
}

function isAllianceInputActive(element) {
    return element.id.toLowerCase() === 'allianceinput';
}

function shouldHandleHotkeys() {
    const activeElement = document.activeElement;
    return !isChatOpen(activeElement) && !isAllianceInputActive(activeElement);
}

const place = (id, thisCps) => {
    if (macrosEnabled) {
        if (pressedV & pressedQ || pressedN & pressedQ || pressedF & pressedQ || pressedH) {
            thisCps = cps;
            cps = thisCps / 2;
            doNewSend(["G", [id, null]]);
            doNewSend(["d", [1]]);
            doNewSend(["d", [0]]);

            cps = thisCps;
            pressedQ = false;
            pressedV = false;
            pressedF = false;
            pressedN = false;
            pressedH = false;
            pressed0 = false;
            pressedAlt = false;
        } else {
            doNewSend(["G", [id, null]]);
            doNewSend(["d", [1]]);
            doNewSend(["d", [0]]);
        }
    }
};

const isElementVisible = (e) => e.offsetParent !== null;

const doNewSend = (sender) => {
    ws.send(new Uint8Array(Array.from(msgpack5.encode(sender))));
}

const repeater = (e, o, t) => {
    var a = false, n = void 0;
    return {
        start(r) {
            if (a) return;
            if (r == e && shouldHandleHotkeys()) {
                a = true;
                if (typeof o === "function") {
                    o();
                }
                n = setInterval(function() {
                    typeof o === "function" && o();
                }, t);
            }
        },
        stop(r) {
            if (r == e && "chatbox" !== document.activeElement.id.toLowerCase()) {
                a = false;
                clearInterval(n);
                n = void 0;
            }
        }
    };
};

var joinButton = document.querySelector('#enterGame');
document.getElementById("promoImgHolder").remove();
document.querySelector("#pre-content-container").remove();
$("#youtuberOf").remove();
$("#adCard").remove();
$("#mobileInstructions").remove();
$("#downloadButtonContainer").remove();
$("#mobileDownloadButtonContainer").remove();
$(".downloadBadge").remove()
function e(playerName) {
    playerName = document.getElementById("nameInput").value;
    $("#ot-sdk-btn-floating").hide();
    };

joinButton.addEventListener('click', function() {
    e();
});
const spike = repeater(86, () => {
    pressedV = true
    place(st)
}, realCps);
const food = repeater(81, () => {
    pressedQ = true
    place(ft);
}, 78);
const boost = repeater(70, () => {
    pressedF = true
    place(bt)
}, realCps);
const windmills = repeater(78, () => {
    pressedN = true
    place(mlt)
}, realCps);
const walls = repeater(18, () => {
    pressedN = true
    place(wt)
}, realCps);
const spawns = repeater(48, () => {
    pressedN = true
    place(spt)
}, realCps);
const turret = repeater(72, () => {
    pressedN = true
    place(tr)
}, realCps);
document.addEventListener('keydown', (e)=>{
    windmills.start(e.keyCode);
    food.start(e.keyCode);
    spike.start(e.keyCode);
    boost.start(e.keyCode);
    walls.start(e.keyCode);
    spawns.start(e.keyCode);
    turret.start(e.keyCode);
})
document.addEventListener('keyup', (e) => {
    windmills.stop(e.keyCode);
    food.stop(e.keyCode);
    spike.stop(e.keyCode);
    boost.stop(e.keyCode);
    walls.stop(e.keyCode);
    spawns.stop(e.keyCode);
    turret.stop(e.keyCode);
});

function update() {
    for (let i=0;i<9;i++){ if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){ pr = i; }}

    for (let i=9;i<16;i++){ if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){ sec = i; }}

    for (let i=16;i<19;i++){ if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){ ft = i - 16; }}

    for (let i=19;i<22;i++){ if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){ wt = i - 16; }}

    for (let i=22;i<26;i++){ if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){ st = i - 16; }}

    for (let i=26;i<29;i++){ if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){ mlt = i - 16; }}

    for (let i=31;i<33;i++){ if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){ bt = i - 16; }}

   for (let i=33;i<39;i++){ if (isElementVisible(document.getElementById("actionBarItem" + i.toString())) && i != 36){ tr = i - 16; }}

        spt = 20;
}

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
    isSkull: null
};

document.msgpack = msgpack;
function n(){
    this.buffer = new Uint8Array([0]);
    this.buffer.__proto__ = new Uint8Array;
    this.type = 0;
}
WebSocket.prototype.oldSend = WebSocket.prototype.send;
WebSocket.prototype.send = function(m){
    if (!ws){
        document.ws = this;
        ws = this;
        socketFound(this);
    }
    this.oldSend(m);
};
function socketFound(socket){
    socket.addEventListener('message', function(message){
        handleMessage(message);
    });
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
    if(item === "io-init") {
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
    update();
}

document.addEventListener('keydown', (e) => {
    if (e.keyCode === 186 && shouldHandleHotkeys()) {
        macrosEnabled = !macrosEnabled;
        document.title = macrosEnabled ? "𝙼𝚊𝚌𝚛𝚘𝚜 𝙾𝙽" : "𝙼𝚊𝚌𝚛𝚘𝚜 𝙾𝙵𝙵";
        console.log("macros is now " + (macrosEnabled ? "ON" : "OFF"));
    }
});