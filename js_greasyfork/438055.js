// ==UserScript==
// @name         MooMoo.io - AutoHeal + Anti AD & sarter resources
// @version      v1
// @description  Simple Autoheal and anti AD
// @author       W4IT
// @match        *://*.moomoo.io/*
// @require      https://code.jquery.com/jquery-3.3.1.slim.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.4.5/socket.io.min.js
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @require      https://cdn.jsdelivr.net/npm/msgpack-lite@0.1.26/dist/msgpack.min.js
// @require      https://cdn.jsdelivr.net/npm/fontfaceobserver@2.1.0/fontfaceobserver.standalone.min.js
// @grant        none
// @namespace    https://greasyfork.org/en/users/752105-w4it
// @downloadURL https://update.greasyfork.org/scripts/438055/MooMooio%20-%20AutoHeal%20%2B%20Anti%20AD%20%20sarter%20resources.user.js
// @updateURL https://update.greasyfork.org/scripts/438055/MooMooio%20-%20AutoHeal%20%2B%20Anti%20AD%20%20sarter%20resources.meta.js
// ==/UserScript==
document.querySelector("#pre-content-container").remove();
document.getElementById("enterGame").addEventListener('click', autohide);
function autohide(){
    $("#ot-sdk-btn-floating").hide();
}
let sr = setInterval(() => {
    window.follmoo && (window.follmoo(), clearInterval(sr));
}, 10);
let mouseX;
let mouseY;
let width;
let height;
function aim(x, y){
    var cvs = document.getElementById("gameCanvas");
    cvs.dispatchEvent(new MouseEvent("mousemove", {
        clientX: x,
        clientY: y
    }));
}
let coreURL = new URL(window.location.href);
window.sessionStorage.force = coreURL.searchParams.get("fc");
var foodType;
var ws;
var msgpack5 = msgpack;
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
let healSpeed = 100;
let healToggle = 1;
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
    if (item == "1" && myPlayer.id == null){
        myPlayer.id = data[1];
    }
    if (item == '33') {
        for (let i; i < data[1].length / 13; i++) {
            var object = data[1].slice(13 * i, 13 * i + 13);
            if (object[0] == myPlayer.id) {
                myPlayer.x = object[1];
                myPlayer.y = object[2];
                myPlayer.dir = object[3];
                myPlayer.object = object[4];
                myPlayer.weapon = object[5];
                myPlayer.clan = object[7];
                myPlayer.isLeader = object[8];
                myPlayer.hat = object[9];
                myPlayer.accessory = object[10];
                myPlayer.isSkull = object[11];
            }
        }
    }
    if(item == "h" && data[1] == myPlayer.id) {
        if(data[2] < 90 && data[2] > 0 && healToggle == 1) {
            setTimeout(() => {
                place(foodType, null);
                place(foodType, null);
            }, healSpeed);
        }
    }
    update();
}
function doNewSend(sender){
    ws.send(new Uint8Array(Array.from(msgpack5.encode(sender))));
}
function place(id) {
    doNewSend(["5", [id, null]]);
    doNewSend(['c', [1]]);
    doNewSend(['c', [0]]);
    doNewSend(['5', [myPlayer.weapon, true]]);
    doNewSend(["5", [id, null]]);
    doNewSend(['c', [1]]);
    doNewSend(['c', [0]]);
    doNewSend(['5', [myPlayer.weapon, true]]);
}
document.addEventListener('keydown', (e)=> {
    if(e.keyCode == 80 && document.activeElement.id.toLowerCase()!== 'chatbox') {
    	healToggle = (healToggle + 1) % 2;
        if(healToggle == 1) {
        	document.title = "Autoheal On";
        } else {
        	document.title = " Autoheal Off";
        }
    }
})
function isElementVisible(e) {
    return (e.offsetParent !== null);
}
function update() {
    for (let i=16;i<19;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            foodType = i - 16;
        }
    }
}