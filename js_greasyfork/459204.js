// ==UserScript==
// @name        MooMoo.io Auto-heal
// @namespace    MooMoo.io Auto-Heal
// @version     Fixed
// @description Simple just Auto-heal
// @author      Nuro + Fixed by Mordecai Rigby
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/msgpack-lite@0.1.26/dist/msgpack.min.js
// @require      https://cdn.jsdelivr.net/npm/fontfaceobserver@2.1.0/fontfaceobserver.standalone.min.js
// @downloadURL https://update.greasyfork.org/scripts/459204/MooMooio%20Auto-heal.user.js
// @updateURL https://update.greasyfork.org/scripts/459204/MooMooio%20Auto-heal.meta.js
// ==/UserScript==

window.onbeforeunload = null;
let mouseX;
let mouseY;
let width;
let height;
let coreURL = new URL(window['location']['href']);
window['sessionStorage']['force'] = coreURL['searchParams']['get']('fc');
var foodType;
var ws;
var msgpack5 = msgpack;
let myPlayer = {
    'id': null,
    'x': null,
    'y': null,
    'dir': null,
    'object': null,
    'weapon': null,
    'clan': null,
    'isLeader': null,
    'hat': null,
    'accessory': null,
    'isSkull': null
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
function socketFound(a) {
    a['addEventListener']('message', function (b) {
        handleMessage(b);
    });
}
function handleMessage(a) {
    let b = msgpack5['decode'](new Uint8Array(a['data']));
    let c;
    if (b['length'] > 0x1) {
        c = [b[0x0], ...b[0x1]];
        if (c[0x1] instanceof Array) {
            c = c;
        }
    } else {
        c = b;
    }
    let d = c[0x0];
    if (!c) {
        return;
    };
    if (d === 'io-init') {
        let e = document['getElementById']('gameCanvas');
        width = e['clientWidth'];
        height = e['clientHeight'];
        $(window)['resize'](function () {
            width = e['clientWidth'];
            height = e['clientHeight'];
        });
        e['addEventListener']('mousemove', f => {
            mouseX = f['clientX'];
            mouseY = f['clientY'];
        });
    }
    if (d == '1' && myPlayer['id'] == null) {
        myPlayer['id'] = c[0x1];
    }
    if (d == 'h' && c[0x1] == myPlayer['id']) {
        if (c[0x2] < 0x64 && c[0x2] > 0x0) {
            setTimeout(() => {
                sendws(foodType, null);
            }, 0x82);
        }
    }
    update();
}


function socketsender(a) {
    ws['send'](new Uint8Array(Array['from'](msgpack5['encode'](a))));
}
function sendws(id, angle = Math.atan2(mouseY - height / 2, mouseX - width / 2)) {
    socketsender(["5", [id, null]]);
    socketsender(["c", [1, angle]]);
    socketsender(["c", [0, angle]]);
    (["5", [myPlayer.weapon, true]]);
}
function isElementVisible(a) {
    return a['offsetParent'] !== null;
}
function update() {
    for (let a = 0x10; a < 0x13; a++) {
        if (isElementVisible(document['getElementById']('actionBarItem' + a['toString']()))) {
            foodType = a - 0x10;
        }
    }
}