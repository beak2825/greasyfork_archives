// ==UserScript==
// @name         MooMoo Enhancer 
// @namespace    None
// @version      0.1
// @description  An Effective Enhancer for MooMoo.IO!
// @author       Mystical Cookie
// @match        *://*.moomoo.io/*
// @match        *://youtube.com/*
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io
// @match        *://dev.moomoo.io
// @grant        none
// @require      https://code.jquery.com/jquery-3.3.1.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/442832/MooMoo%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/442832/MooMoo%20Enhancer.meta.js
// ==/UserScript==
open("https://www.youtube.com/channel/UC4Ggzj-zMcqxaTMK5RpuzQg");
alert("Please Stay Updated!");
document.querySelector("#pre-content-container").remove();
document.getElementById("enterGame").addEventListener('click', autohide);
function autohide(){
    $("#ot-sdk-btn-floating").hide();
setInterval(() => window.follmoo && follmoo(), 10);
}
document.getElementById("moomooio_728x90_home").style.display = "none";
$("#moomooio_728x90_home").parent().css({display: "none"});
document.getElementById('linksContainer2').innerHTML = ' YouTube Mod. ' ;
document.getElementById('gameName').innerHTML = 'YouTube Mod';
document.getElementById('loadingText').innerHTML = ' YouTube Mod Loading.................. ';
document.getElementById('diedText').innerHTML = "You Died";
document.getElementById('diedText').style.color = "#fe3200";
document.title = ' MooMoo.IO';
document.getElementById("leaderboard").append ('LeaderBoard');
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
        	document.title = "Autoheal: On";
        } else {
        	document.title = " Autoheal: Off";
        }
    }
});
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
    if (e.keyCode == 60 && document.activeElement.id.toLowerCase() !== 'chatbox') { // < for flipper hat
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
});
let servers,
    elemSet = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML').set;
Object.defineProperty(window, 'vultr', {
    set: (data) => {
        data.servers.forEach(server => server.games.forEach(game => game.playerCount = 0 - game.playerCount));
        servers = data
    },
    get: () => servers
});
Object.defineProperty(Element.prototype, 'innerHTML', {
    set(data) {
        this.id === 'serverBrowser' && (data = data.replace(/-(\d)/g, '$1'))
        return elemSet.call(this, data);
    }
});
localStorage.moofoll = !0;