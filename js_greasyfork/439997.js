// ==UserScript==
// @name         MooMoo.io Addons
// @namespace    -
// @version      v2.7
// @description  Addons: Better minimap, SlowAutoHeal (for afk), Building macro (F = trap/boost pad,V = spike, N = mill,P = active/unactive autoheal, lag reducer, crash reducer, all weapons select (might not work for all devices), removes ads, removes cookie references.
// @author       no one
// @match        *://*.moomoo.io/*
// @require      https://code.jquery.com/jquery-3.3.1.slim.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.4.5/socket.io.min.js
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @require      https://cdn.jsdelivr.net/npm/msgpack-lite@0.1.26/dist/msgpack.min.js
// @require      https://cdn.jsdelivr.net/npm/fontfaceobserver@2.1.0/fontfaceobserver.standalone.min.js
// @grant        none
// @namespace    https://greasyfork.org/en/users/847171-mr-cookies-world-tv
// @downloadURL https://update.greasyfork.org/scripts/439997/MooMooio%20Addons.user.js
// @updateURL https://update.greasyfork.org/scripts/439997/MooMooio%20Addons.meta.js
// ==/UserScript==
document.querySelector("#pre-content-container").remove();
document.getElementById("enterGame").addEventListener('click', autohide);
function autohide(){
    $("#ot-sdk-btn-floating").hide();
}
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
var millType;
var boostType;
var spikeType;
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
    if(item == "h" && data[1] == myPlayer.id) {
        if(data[2] < 90 && data[2] > 0 && healToggle == 1) {
            setTimeout(() => {
                placeQ(foodType, null);
                placeQ(foodType, null);
            }, healSpeed);
        }
    }
    update();
}
function doNewSend(sender){
    ws.send(new Uint8Array(Array.from(msgpack5.encode(sender))));
}
function place(id, angle = Math.atan2(mouseY - height / 2, mouseX - width / 2)) {
    doNewSend(["5", [id, null]]);
}
function placeQ(id, angle = Math.atan2(mouseY - height / 2, mouseX - width / 2)) {
    doNewSend(["5", [id, null]]);
    doNewSend(['c', [1, angle]]);
    doNewSend(['c', [0, angle]]);
    doNewSend(['5', [myPlayer.weapon, true]]);
}
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
                        }
                    }, interval);
                }
            }
        },
        stop(keycode) {
            if(keycode == key && document.activeElement.id.toLowerCase() !== 'chatbox') {
                _isKeyDown = false;
            }
        }
    };
}
const spikeHolder = repeater(86, () => {place(spikeType)}, 0);
const boostHolder = repeater(70, () => {place(boostType)}, 0);
const millHolder = repeater(78, () => {place(millType)}, 0);
document.addEventListener('keydown', (e)=>{
    spikeHolder.start(e.keyCode);
    boostHolder.start(e.keyCode);
    millHolder.start(e.keyCode);
    if(e.keyCode == 80 && document.activeElement.id.toLowerCase()!== 'chatbox') {
    	healToggle = (healToggle + 1) % 2;
        if(healToggle == 1) {
        	document.title = "Autoheal On";
        } else {
        	document.title = " Autoheal Off";
        }
    }
})
document.addEventListener('keyup', (e)=>{
    spikeHolder.stop(e.keyCode);
    boostHolder.stop(e.keyCode);
    millHolder.stop(e.keyCode);
})
function isElementVisible(e) {
    return (e.offsetParent !== null);
}
function toRad(angle) {
    return angle * 0.01745329251;
}
function update() {
    for (let i=16;i<19;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            foodType = i - 16;
        }
    }
    for (let i=22;i<26;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            spikeType = i - 16;
        }
    }
    for (let i=26;i<29;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            millType = i - 16;
        }
    }
    for (let i=31;i<33;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            boostType = i - 16;
        }
    }
}