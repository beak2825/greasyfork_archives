// ==UserScript==
// @name         RAGEMOD - AUTOHEAL - BETTER MAP - HAThotkeys in desc
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Better map , AUTOHEAL (slow). SUB TO ME : https://www.youtube.com/channel/UCjlciHtmaEpowTAJ-5Ybc-w
// @author       none :D
// @match        http://moomoo.io/
// @match        http://sandbox.moomoo.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=moomoo.io
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/msgpack-lite@0.1.26/dist/msgpack.min.js
// @require      https://cdn.jsdelivr.net/npm/fontfaceobserver@2.1.0/fontfaceobserver.standalone.min.js
// @downloadURL https://update.greasyfork.org/scripts/440869/RAGEMOD%20-%20AUTOHEAL%20-%20BETTER%20MAP%20-%20HAThotkeys%20in%20desc.user.js
// @updateURL https://update.greasyfork.org/scripts/440869/RAGEMOD%20-%20AUTOHEAL%20-%20BETTER%20MAP%20-%20HAThotkeys%20in%20desc.meta.js
// ==/UserScript==

function autohide(){
    $("#ot-sdk-btn-floating").hide();
}
document.getElementById("moomooio_728x90_home").style.display = "none";
$("#moomooio_728x90_home").parent().css({display: "none"});
document.getElementById('linksContainer2').innerHTML = ' RAGE MOD 1 ' ;
document.getElementById('gameName').innerHTML = 'RAGE MOD';
document.getElementById('loadingText').innerHTML = 'rage mod :D '
document.getElementById('diedText').innerHTML = "TRY BETTER!!";
document.getElementById('diedText').style.color = "#fe3200";
document.title = ' rage mod';
document.getElementById("leaderboard").append ('Rage mod');
$("#mapDisplay").css({background: `url('https://ksw2-center.glitch.me/users/fzb/map.png?z=${performance.now()}&u=a')`});
document.getElementById("storeHolder").style = "height: 310px; width: 400px;";
document.getElementById("promoImgHolder").remove();

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
(function() {
    'use strict';
 
    var ID_TankGear = 40;
    var ID_SoldierHelmet = 6;
    var ID_BullsHelmet = 7;
    var ID_BoosterHat = 12;
    var ID_EmpHelmet = 58;
    var ID_FlipperHat = 31;
    var ID_WinterHat = 15;
 
    document.addEventListener('keydown', function(e) {
        switch (e.keyCode) {
 
            case 82: storeEquip(ID_BullsHelmet); break; // R
            case 78: storeEquip(ID_TankGear); break; // N
            case 66: storeEquip(ID_SoldierHelmet); break; // B
            case 77: storeEquip(ID_BoosterHat); break; // M
            case 75: storeEquip(ID_FlipperHat); break; // K
            case 76: storeEquip(ID_WinterHat); break; // L
            case 74: storeEquip(ID_EmpHelmet); break; // J
 
        }
    });
 
})();
setInterval(() => {
    setTimeout(() => {
        document.getElementById('chatBox').placeholder = ".RAGEMOD.";
        setTimeout(() => {
            document.getElementById('chatBox').placeholder = ".RAGEMOD..";
            setTimeout(() => {
                document.getElementById('chatBox').placeholder = ".RAGEMOD...";
                setTimeout(() => {
                    document.getElementById('chatBox').placeholder = ".RAGEMOD....";
                }, 100);
            }, 100);
        }, 100);
    }, 100);
}, 500)
setInterval(function() {
    if (myPlayer.hat == 45) {
        newSend(['ch', ['ERROR HAT LOL RUN, KILL ME = F333']]);
        hat(13);
        acc(13);
    }
}, 100);