// ==UserScript==
// @name         RemyMod(Macro)
// @version      v2
// @description  just a simple macro(sorry no auto heal)
// @author       Remy:D
// @match        *://*.moomoo.io/*
// @match        *://*.sandbox.moomoo.io/*
// @require      https://code.jquery.com/jquery-3.3.1.slim.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/msgpack-lite/0.1.26/msgpack.min.js
// @require      https://code.jquery.com/jquery-3.3.1.slim.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.4.5/socket.io.min.js
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @require      https://cdn.jsdelivr.net/npm/msgpack-lite@0.1.26/dist/msgpack.min.js
// @require      https://cdn.jsdelivr.net/npm/fontfaceobserver@2.1.0/fontfaceobserver.standalone.min.js
// @require      https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js
// @require      https://cdn.jsdelivr.net/npm/fontfaceobserver@2.1.0/fontfaceobserver.standalone.min.js
// @grant        none
// @icon         https://moomoo.io/img/favicon.png?v=1
// @namespace https://greasyfork.org/users/823036
// @downloadURL https://update.greasyfork.org/scripts/473733/RemyMod%28Macro%29.user.js
// @updateURL https://update.greasyfork.org/scripts/473733/RemyMod%28Macro%29.meta.js
// ==/UserScript==

//Visual xd
  //i did it by myself
    document.getElementById('loadingText').style = "text-shadow: black 2px 2px 40px;";
    document.getElementById("loadingText").innerHTML = "Loading wait";
    document.getElementById("pingDisplay").style.color = "#00ff00";
    document.getElementById("enterGame").style.backgroundColor = "black";
    document.getElementById("enterGame").style.color = "white";
    document.getElementById('enterGame').innerHTML = 'Macro frr';
    document.getElementById('diedText').innerHTML = 'U died..';
    document.getElementById("storeHolder").style = "height: 1000px; width: 480px;";
    $("#mapDisplay").css({background: `url('http://i.imgur.com/Qllo1mA.png')`});
    document.getElementById('diedText').style.color = "red";
    document.getElementById('gameName').style = "text-shadow: #ff0000 2px 2px 40px;";
    document.getElementById('gameName').innerHTML = 'RemyMod';
    document.getElementById('chatBox').style.color = "#800000";
    document.getElementById('chatBox').style.backgroundColor = "gray";
    document.getElementById("ageText").style.color = "white";
    document.getElementById("leaderboard").style.color = "black";
    document.getElementById("leaderboard").style.backgroundColor = "rgba(0, 0, 0, 0.75)";

//Health bar rainbow:D
   //QWAKE GAMING
let hue = 0;

let replaceInterval = setInterval(() => {
if (CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = ((oldFunc) => function() { if (this.fillStyle == "#8ecc51") this.fillStyle = `hsl(${hue}, 100%, 50%)`; return oldFunc.call(this, ...arguments); })(CanvasRenderingContext2D.prototype.roundRect);
  clearInterval(replaceInterval);
}}, 10);

function changeHue() {
  hue += Math.random() * 3;
}

setInterval(changeHue, 10);

// hats
   //W4IT
setInterval(() => window.follmoo && follmoo(), 10);

function Hat(id){
    storeBuy(id);
    storeEquip(id);
}

document.addEventListener('keydown', function(e) {
    if (e.keyCode == 66 && document.activeElement.id.toLowerCase() !== 'chatbox') { // B for Solider
        Hat(6);
    }
    if (e.keyCode == 27 && document.activeElement.id.toLowerCase() !== 'chatbox') { // ESC for uneuip hat
        Hat(0);
    }
    if (e.keyCode == 71 && document.activeElement.id.toLowerCase() !== 'chatbox') { // G for Turret gear
        Hat(53);
    }
    if (e.keyCode == 16 && document.activeElement.id.toLowerCase() !== 'chatbox') { // SHIFT for booster hat
        Hat(12);
    }
    if (e.keyCode == 188 && document.activeElement.id.toLowerCase() !== 'chatbox') { // "," for snow hat
        Hat(15);
    }
    if (e.keyCode == 67 && document.activeElement.id.toLowerCase() !== 'chatbox') { // < for flipper hat
        Hat(31);;
    }
    if (e.keyCode == 90 && document.activeElement.id.toLowerCase() !== 'chatbox') { // Z for tank gear
        Hat(40);
    }
    if (e.keyCode == 74 && document.activeElement.id.toLowerCase() !== 'chatbox') { // J for emp helmet
        Hat(22);
    }
    if (e.keyCode == 84 && document.activeElement.id.toLowerCase() !== 'chatbox') { // T for bull helmet
        Hat(7);
    }
    if (e.keyCode == 89 && document.activeElement.id.toLowerCase() !== 'chatbox') { // Y for samurai
        Hat(20);
    }
    if (e.keyCode == 192 && document.activeElement.id.toLowerCase() !== 'chatbox') { //
        Hat(45);
    }
    if (e.keyCode == 82 && document.activeElement.id.toLowerCase() !== 'chatbox') { //
        Hat(29);
    }
});
//Anti- kick
   //Nudo
(function() {
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
})()
//rebinds
  //W4It - sorry i edited it a bit:(
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
var millType;
var boostType;
var spikeType;
var turretType;
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
        if(data[2] < 91 && healToggle == 1) {
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
function hold(id) {
    doNewSend(["5", [id]]);
}
function place(id, angle = Math.atan2(mouseY - height / 2, mouseX - width / 2)) {
    doNewSend(["5", [id, null]]);
    doNewSend(['c', [1, angle]]);
    doNewSend(['c', [0, angle]]);
    doNewSend(['5', [myPlayer.weapon, true]]);
}
document.addEventListener('keydown', (e)=>{
    if(e.keyCode == 86 && document.activeElement.id.toLowerCase()!== 'chatbox') {
    	hold(spikeType);
    }
    if(e.keyCode == 70 && document.activeElement.id.toLowerCase()!== 'chatbox') {
    	hold(boostType);
    }
    if(e.keyCode == 78 && document.activeElement.id.toLowerCase()!== 'chatbox') {
    	hold(millType);
    }
    if(e.keyCode == 72 && document.activeElement.id.toLowerCase()!== 'chatbox') {
    	hold(turretType);
    }
})

function isElementVisible(e) {
    return (e.offsetParent !== null);
}
function toRad(angle) {
    return angle * 0.01745329251;
}
function update() {
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
    for (let i=33;i<39;i++) {
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            turretType = i- 16;
        }
    }
}