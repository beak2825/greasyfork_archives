// ==UserScript==
// @name        IMod[Brand New,] Anti Insta - Fast Insta - Fast Heal [By AFK]
// @namespace   -
// @version     v3
// @description Script [Fixed And Public]
// @author      AFK
// @include     *://*.moomoo.io/*
// @grant       none
// @require      https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/433834/IMod%5BBrand%20New%2C%5D%20Anti%20Insta%20-%20Fast%20Insta%20-%20Fast%20Heal%20%5BBy%20AFK%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/433834/IMod%5BBrand%20New%2C%5D%20Anti%20Insta%20-%20Fast%20Insta%20-%20Fast%20Heal%20%5BBy%20AFK%5D.meta.js
// ==/UserScript==

//if u dont wanna update remove the dotted line section

//.......................
//alert("Update Is Needed")
//window.open("https://afk-io.glitch.me/")
//.....................
document.getElementById("adCard").innerHTML =
`
<div>
<center>
Also Add Me On Discord For Any Bugs Or Reviews afk.#0186
<fieldset>
Update Log
-
-added insta
-added one time info menu
-added heal
-added place types
</fieldset>
</center>
</div>
`
var primary = 0,
secondary = 0,
foodType = 0,
wallType = 3,
spikeType = 6,
millType = 10,
mineType = 13,
boostType = 15,
turretType = 17,
spawnpadType = 36;
var removeui = false;
var heal = true;
var healspeed = 71;
var instaspeed = 110;
var soldierKey = 90;//z
var bullKey = 66;//b
var tankKey = 67;//c
var biomeKey = 77;//m
var unequipKey = 16;//shift
var dashKey = 9;//tab
var freezeKey = 222;// [ ' ]
var instacht = `POG~GG~POG`;
var autoaim = false;
var dist;
var mouseX;
var millAngle;
var autoplacemill = false;
var lastx;
var lasty;
var mouseY;
var ws;
var width;
var height;
var msgpack5 = msgpack;

(function() {//fps booster
    let checker = setInterval(() => {
        let remover = document.getElementById("ot-sdk-btn-floating");
        let remover2 = document.getElementById("partyButton");
        let remover3 = document.getElementById("joinPartyButton");
        let remover4 = document.getElementById("youtuberOf");
        let remover5 = document.getElementById("moomooio_728x90_home");
        let remover6 = document.getElementById("darkness");
        let remover7 = document.getElementById("gameUI");
        if(remover || remover2 || remover3 || remover4 || remover5 || remover6 || remover7){
            remover.remove();
            remover2.remove();
            remover3.remove();
            remover4.remove();
            remover5.remove();
            remover6.remove();
            if(removeui == true){
            remover7.remove();
            }
            clearInterval(checker);
        }
    })
})();
setInterval(() => {
if(autoaim == true){
doNewSend(["2",[nearestEnemyAngle]]);
}
},20);

function Random(e, t) {
	return Math.floor(Math.random() * t) + e
}

function aim(e, t) {
	document.getElementById("gameCanvas")
		.dispatchEvent(new MouseEvent("mousemove", {
			clientX: e,
			clientY: t
		}))
}
document.getElementById("gameName").innerHTML = "Spleed > V1 <"
function place(id, angle=Math.atan2(mouseY - height / 2, mouseX - width / 2)) {
    doNewSend(["5", [id, null]]);
    doNewSend(["c", [1, angle]]);
    doNewSend(["c", [3, angle]]);
    doNewSend(["5", [myPlayer.weapon, true]]);
}
function isElementVisible(e) {
    return (e.offsetParent !== null);
}
function doNewSend(sender) {
    ws.send(new Uint8Array(Array.from(msgpack5.encode(sender))));
}
function chat(sender) {
doNewSend(["ch", [sender]]);
}
function equip(hat,acc) {
doNewSend(["13c", [1, hat, 0]]);
doNewSend(["13c", [1, acc, 1]]);
doNewSend(["13c", [0, hat, 0]]);
doNewSend(["13c", [0, acc, 1]]);
}
function lag(level, power) {
for(let i = 0; i < level; i++) {
ws.oldSend(Math.RAND_NUMBER(0, power));
};
}
var repeater = function(key, action, interval) {
    let _isKeyDown = false;
    let _intervalId = undefined;
    return {
        start(keyCode) {
            if (keyCode == key && document.activeElement.id.toLowerCase() !== 'chatbox') {
                _isKeyDown = true;
                if (_intervalId === undefined) {
                    _intervalId = setInterval(()=>{
                        action();
                        if (!_isKeyDown) {
                            clearInterval(_intervalId);
                            _intervalId = undefined;
                        }
                    }
                    , interval);
                }
            }
        },
        stop(keyCode) {
            if (keyCode == key && document.activeElement.id.toLowerCase() !== 'chatbox') {
                _isKeyDown = false;
            }
        }
    };
}
function wep(id){
doNewSend(["5", [id, true]]);
}
function hit() {
doNewSend(["c", [1]]);
}
function stophit() {
doNewSend(["c", [0, null]]);
}
function insta(id) {
autoaim = true;
chat(id)
equip(7,21);
wep(primary)
hit()
setTimeout(() => {
wep(secondary)
hit()
equip(53,13);
},instaspeed);
setTimeout(() => {
stophit()
stophit()
wep(primary)
equip(6.13);
},230);
autoaim = false;
}
const mill = repeater(78, () => {
    if(autoplacemill == false){
  place(millType, 0 + millAngle), place(millType, 1.25663706072 + millAngle), place(millType, -1.25663706072 + millAngle);
    }
    setInterval(() => {
        if(autoplacemill == true){
     place(millType, 0 + millAngle), place(millType, 1.25663706072 + millAngle), place(millType, -1.25663706072 + millAngle);
    }
        },1000);
}, 50);
const spike = repeater(86, () => {place(spikeType)}, 0);
const qheal = repeater(81, () => {place(foodType)}, 0);
const boost = repeater(70, () => {place(boostType)}, 0);
const insta1 = repeater(82, () => {insta(instacht)}, 0);
document.addEventListener('keydown', (e)=>{
insta1.start(e.keyCode);
qheal.start(e.keyCode);
spike.start(e.keyCode);
boost.start(e.keyCode);
mill.start(e.keyCode);
})
document.addEventListener('keydown', (e)=>{
if(e.keyCode == 80 && heal == true && document.activeElement.id.toLowerCase() !== 'chatbox'){
chat("Heal Off")
heal = false;
}else if(e.keyCode == 80 && heal == false && document.activeElement.id.toLowerCase() !== 'chatbox'){
chat("Heal On")
heal = true;
}
if(e.keyCode == 188 && autoplacemill == true && document.activeElement.id.toLowerCase() !== 'chatbox'){
chat("Mills Off")
autoplacemill = false;
}else if(e.keyCode == 188 && autoplacemill == false && document.activeElement.id.toLowerCase() !== 'chatbox'){
chat("Mills On")
autoplacemill = true;
}
//------------- macros
if(e.keyCode == bullKey && document.activeElement.id.toLowerCase() !== 'chatbox'){
equip(7,18)
}else if(e.keyCode == soldierKey && document.activeElement.id.toLowerCase() !== 'chatbox'){
equip(6,21)
}else if(e.keyCode == tankKey && document.activeElement.id.toLowerCase() !== 'chatbox'){
equip(40,19)
}else if(e.keyCode == unequipKey && document.activeElement.id.toLowerCase() !== 'chatbox'){
equip(0,0)
}else if(e.keyCode == dashKey && document.activeElement.id.toLowerCase() !== 'chatbox'){
lag(1000, 1000000);
}else if(e.keyCode == freezeKey && document.activeElement.id.toLowerCase() !== 'chatbox'){
lag(1000, 10000000);
}else if(e.keyCode == biomeKey && document.activeElement.id.toLowerCase() !== 'chatbox'){
if (myPlayer.y < 2400) {
equip(15,11)
}else if (myPlayer.y > 6850 && myPlayer.y < 7550) {
equip(31,11)
} else if (myPlayer.y > 2400 && (myPlayer.y < 6850 || myPlayer.y > 7550)) {
equip(12,11)
}
}
//--------------------
})
document.addEventListener('keyup', (e)=>{
insta1.stop(e.keyCode);
qheal.stop(e.keyCode);
spike.stop(e.keyCode);
boost.stop(e.keyCode);
mill.stop(e.keyCode);
})
function update() {
for (let i=0;i<9;i++){ if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){ primary = i; } } for (let i=9;i<16;i++){ if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){ secondary = i; } } for (let i=16;i<19;i++){ if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){ foodType = i - 16; } } for (let i=19;i<22;i++){ if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){ wallType = i - 16; } } for (let i=22;i<26;i++){ if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){ spikeType = i - 16; } } for (let i=26;i<29;i++){ if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){ millType = i - 16; } } for (let i=29;i<31;i++){ if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){ mineType = i - 16; } } for (let i=31;i<33;i++){ if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){ boostType = i - 16; } } for (let i=33;i<39;i++){ if (isElementVisible(document.getElementById("actionBarItem" + i.toString())) && i != 36){ turretType = i - 16; } } spawnpadType = 36; for (let i=36;i<37;i++){ if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){ spawnpadType = i - 16; } }
}
try {
    document.getElementById("moomooio_728x90_home").style.display = "none";
    $("moomooio728x90_home").parent().css({display: "none"});
} catch (e) {
    console.log("There was an error removing the ads.");
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
var enemiesNear;
var enemyX;
var enemyY;
var isEnemyNear;
var nearestEnemy;
var nearestEnemyAngle
function toRad(angle) {
    return angle * 0.01745329251;
}
document.msgpack = msgpack;
function n(){
this.buffer = new Uint8Array([0]);
this.buffer.__proto__ = new Uint8Array;
this.type = 0;
}
const CanvasAPI = document.getElementById("gameCanvas")
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
//stats go here
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
console.log(data)
}
if(item == "h" && data[1] == myPlayer.id){
if(data[2] < 100 && data[2] > 0 && heal == true){
setTimeout(() => {
place(foodType, null)
},healspeed);
}
}
    if (item == "1" && myPlayer.id == null) {
        myPlayer.id = data[1];
    }
    if (item == "33") {
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
                millAngle = Math.atan2(lasty - myPlayer.y, lastx - myPlayer.x), lastx = myPlayer.x, lasty = myPlayer.y;
let cursorDisplay = document.createElement("div");
cursorDisplay.id = "healthnumber"
document.body.prepend(cursorDisplay);
document.getElementById('healthnumber').style.position='absolute'
document.getElementById('healthnumber').style.textAlign='center'
document.getElementById('healthnumber').style.display='none'
document.getElementById('healthnumber').style.top='70px'
document.getElementById('healthnumber').style.left='50px'
document.getElementById('healthnumber').style.backgroundColor='rgb(255,255,255,0.2)'
document.getElementById('healthnumber').style.color = 'black'
document.getElementById("healthnumber").innerHTML =`
<fieldset>
<h3 style="font-size: 40px>${playerInfo[0]}</h3><br>
<h3 style="font-size: 40px>${playerInfo[1]}</h3><br>
<h3 style="font-size: 40px>${playerInfo[2]}</h3><br>
<h3 style="font-size: 40px>${playerInfo[3]}</h3><br>
<h3 style="font-size: 40px>${playerInfo[4]}</h3><br>
<h3 style="font-size: 40px>${playerInfo[5]}</h3><br>
<h3 style="font-size: 40px>${playerInfo[6]}</h3><br>
<h3 style="font-size: 40px>${playerInfo[7]}</h3><br>
<h3 style="font-size: 40px>${playerInfo[8]}</h3><br>
<h3 style="font-size: 40px>${playerInfo[9]}</h3><br>
<h3 style="font-size: 40px>${playerInfo[10]}</h3><br>
<h3 style="font-size: 40px>${playerInfo[11]}</h3><br>
</fieldset>
`;
            } else if (playerInfo[7] != myPlayer.clan || playerInfo[7] === null) {
                enemiesNear.push(playerInfo);
            }
        }
    }
    isEnemyNear = false;
    if (enemiesNear) {
        nearestEnemy = enemiesNear.sort((a,b)=>dist(a, myPlayer) - dist(b, myPlayer))[0];
    }
    if(nearestEnemy) {
        enemy.x = nearestEnemy[1];
        enemy.y = nearestEnemy[2];
        nearestEnemyAngle = Math.atan2(nearestEnemy[2]-myPlayer.y, nearestEnemy[1]-myPlayer.x);
        if(Math.sqrt(Math.pow((myPlayer.y-nearestEnemy[2]), 2) + Math.pow((myPlayer.x-nearestEnemy[1]), 2)) < 290) {
            isEnemyNear = true;
        }
    }
    if (!nearestEnemy) {
        nearestEnemyAngle = myPlayer.dir;
    }
    update();
}
var style2 = document.createElement("style");
style2.type = "text/css";
style2.appendChild(document.createTextNode(`
.AFKMENU {
    display: none;
    position: fixed;
    z-index: 1;
    center: 0;
    overflow: auto;
}

.AFKMENU {
    position: absolute;
    z-index: 1;
    center: 0;
    overflow: auto;
    height: 100%;
    width: 100%;
}
`))
document.head.appendChild(style2);
/*
document.addEventListener("keydown", function(e) {
    if (e.keyCode == 27) {
        $('#healthnumber').toggle();
        ext = !ext;
    };
});
*/