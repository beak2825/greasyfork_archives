// ==UserScript==
// @name        IMod[Tester][By AFK]
// @namespace   -
// @version     v1
// @description Script [Fixed And Private atm]
// @author      AFK
// @include        /^https?\:\/\/(sandbox\.)?moomoo\.io\/([?#]|$)/
// @grant       none
// @require      https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js
// @icon         https://t4.ftcdn.net/jpg/02/66/76/83/360_F_266768305_jxxjP3ivAYLHxbOejYQ4095SvaGfTjc3.jpg
// @downloadURL https://update.greasyfork.org/scripts/439969/IMod%5BTester%5D%5BBy%20AFK%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/439969/IMod%5BTester%5D%5BBy%20AFK%5D.meta.js
// ==/UserScript==
        let checker = setInterval(() => {
        let remover = document.getElementById("ot-sdk-btn-floating");
        let remover2 = document.getElementById("partyButton");
        let remover3 = document.getElementById("joinPartyButton");
        let remover4 = document.getElementById("youtuberOf");
        let remover5 = document.getElementById("moomooio_728x90_home");
        let remover6 = document.getElementById("darkness");
        let remover7 = document.getElementById("gameUI");
        let remover8 = document.getElementById("adCard");
        let remover9 = document.getElementById("chatButton");
        let remover10 = document.getElementById("promoImgHolder");
        if(remover || remover2 || remover3 || remover4 || remover5 || remover6 || remover7 || remover8 || remover9 || remover10){
            remover.remove();
            if(hacks == true){
            remover2.remove();
            remover3.remove();
            remover4.remove();
            remover5.remove();
            remover6.remove();
            if(removeui == true){
            remover7.remove();
            }
            remover8.remove();
            remover9.remove();
            remover10.remove();
            }
            clearInterval(checker);
        }
    })
document.getElementById("adCard").innerHTML =
`
<div>
<center>
Also Add Me On Discord For Any Bugs Or Reviews afk.#0186
<fieldset>
Update Log
-
-Updated Insta <br>
-Updated Menu <br>
-Updated Heal <br>
-Added Autohat
-Updated PlaceType(More Cps) <br>
-high preformance Mode (less lag) <br>
-Ip limit Bypass <br>
-fixed hitting glitch <br>
-fixed dash and freeze
</fieldset>
</center>
</div>
<br>
<fieldset>
<h3>Welcome ${localStorage.moo_name}</h3>
<h3>Date: ${localStorage._pubcid_exp}</h3>
</fieldset>
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
var hacks = true;
var automill = false;
var removeui = false;
var HiWorld = false;
var autohat = true;
var heal = true;
var autohat = true;
var healspeed = 71;
var anti = false;
var antispeed = 55;
var instaspeed = 115;
var soldierKey = 90;//z
var bullKey = 66;//b
var tankKey = 67;//c
var dash = 9;//tab
var biomeKey = 77;//m
var unequipKey = 16;//shift
var dashKey = 18;//alt
var instacht = `_~IMOD By-AFK Insta~_`;
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
let trapid = null;
let trap_a = null;
let intrap = false;
let TrapCoord = {
    x: null,
    y: null
}
var msgpack5 = msgpack;
if (window.sessionStorage.force != "false" && window.sessionStorage.force && window.sessionStorage.force.toString() != "null"){
    document.getElementsByClassName("menuHeader")[0].innerHTML = `Servers <span style="color: red;">Force (${window.sessionStorage.force})</span>`;
}
class ForceSocket extends WebSocket {
          constructor(...args){
              if (window.sessionStorage.force != "false" && window.sessionStorage.force && window.sessionStorage.force.toString() != "null"){
                  let server = window.sessionStorage.force;
                  let sip = "";
                  for (let gameServer of window.vultr.servers){
                      if (`${gameServer.region}:${gameServer.index}:0` == server){
                               sip = gameServer.ip;
                      }
                  }
                  args[0] = `wss://ip_${sip}.moomoo.io:8008/?gameIndex=0`;
                  delete window.sessionStorage.force;
              }

             super(...args);

          }


}

WebSocket = ForceSocket;
var spin = false;
setInterval(() => {
if(spin == true && hacks == true){
spinex(Number.MAX_VALUE)
}
},20);
setInterval(() => {
if(autoaim == true && hacks == true){
spin = false;
doNewSend(["2",[nearestEnemyAngle]]);
}else{
spin = true;
}
},20);
function spinex(speed){
doNewSend(["2", [speed]]);
}

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
let coreURL = new URL(window.location.href);
window.sessionStorage.force = coreURL.searchParams.get("fc");
document.getElementById("gameName").innerHTML = "Imod > V1 <"
function place(id, angle = Math.atan2(mouseY - height / 2, mouseX - width / 2)) {
if(hacks == true){
spin = false;
doNewSend(["5", [id, null]]);
doNewSend(["c", [1, angle]]);
doNewSend(["c", [0, angle]]);
doNewSend(["5", [myPlayer.weapon, true]]);
spin = true;
}
}
function isElementVisible(e) {
return (e.offsetParent !== null);
}
function toRad(angle) {
return angle * 0.01745329251;
}
function dist(a, b){
return Math.sqrt( Math.pow((b.y-a[2]), 2) + Math.pow((b.x-a[1]), 2) );
}
function distance_1(a, b) {
return Math.sqrt(Math.pow((b.y-a[2]), 2) + Math.pow((b.x-a[1]), 2));
}
function distance_2(a, b) {
return Math.sqrt(Math.pow((b[2]-a[2]), 2) + Math.pow((b[1]-a[1]), 2));
}
function distance_3(a, b) {
return Math.sqrt(Math.pow((b.y-a.y), 2) + Math.pow((b.x-a.x), 2));
}
function doNewSend(sender) {
    ws.send(new Uint8Array(Array.from(msgpack5.encode(sender))));
}
function chat(sender) {
if(hacks == true){
doNewSend(["ch", [sender]]);
}
}
function chatoff(id) {
doNewSend(["ch", [id]]);
}
function equip(hat,acc) {
if(hacks == true){
doNewSend(["13c", [1, hat, 0]]);
doNewSend(["13c", [1, acc, 1]]);
doNewSend(["13c", [0, hat, 0]]);
doNewSend(["13c", [0, acc, 1]]);
}
}
Math.RAND_NUMBER = (max, min) => {
return Math.floor(Math.random() * (max - min + 1)) + min;
};
function lag(level, power) {
for (let i = 0; i < level; i++) {
ws.oldSend(Math.RAND_NUMBER(0, power));
};
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
console.log("claered");
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
function wep(id){
if(hacks == true){
doNewSend(["5", [id, true]]);
}
}
function hit() {
if(hacks == true){
doNewSend(["c", [1]]);
}
}
function stophit() {
if(hacks == true){
doNewSend(["c", [0, null]]);
}
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
wep(primary)
equip(6.13);
autoaim = false;
},230);
}

const mill = repeater(78, () => {
    if(autoplacemill == false){
aim(Random(0, 2e3), Random(0, 2e3))
place(millType, 0 + millAngle);
place(millType, 1.25663706072 + millAngle);
place(millType, -1.25663706072 + millAngle);
    }
}, 50);
const spike = repeater(86, () => {
place(spikeType);
}, 0);
const turret = repeater(72, () => {
place(turretType, myPlayer.dir + toRad(45));
place(turretType, myPlayer.dir - toRad(45));
}, 0);
const qheal = repeater(81, () => {
place(foodType)
}, 0);
const boost = repeater(70, () => {
for (let i=0;i<4;i++){
let angle = myPlayer.dir + toRad(i * 90);
place(boostType, angle)
}
}, 20);
const pits = repeater(70, () => {
place(boostType)
}, 0);
const spawn = repeater(48, () => {
place(spawnpadType, 0 + millAngle);
place(spawnpadType, 1.25663706072 + millAngle);
place(spawnpadType, -1.25663706072 + millAngle);
}, 50);
const insta1 = repeater(82, () => {
insta(instacht)
}, 0);
document.addEventListener('keydown', (e)=>{
insta1.start(e.keyCode);
turret.start(e.keyCode);
qheal.start(e.keyCode);
spike.start(e.keyCode);
if(window.location.host == "sandbox.moomoo.io"){
boost.start(e.keyCode);
}
if(window.location.host == "moomoo.io"){
pits.start(e.keyCode);
}
mill.start(e.keyCode);
spawn.start(e.keyCode);
})
document.addEventListener('keyup', (e)=>{
insta1.stop(e.keyCode);
qheal.stop(e.keyCode);
spike.stop(e.keyCode);
if(window.location.host == "sandbox.moomoo.io"){
boost.stop(e.keyCode);
}
if(window.location.host == "moomoo.io"){
pits.stop(e.keyCode);
}
turret.stop(e.keyCode);
mill.stop(e.keyCode);
spawn.start(e.keyCode);
})
document.addEventListener('keydown', (e)=>{
if(e.keyCode == 80 && heal == true && document.activeElement.id.toLowerCase() !== 'chatbox'){
chat("Heal Off")
heal = false;
}else if(e.keyCode == 80 && heal == false && document.activeElement.id.toLowerCase() !== 'chatbox'){
chat("Heal On")
heal = true;
}
if(e.keyCode == 222 && hacks == true && document.activeElement.id.toLowerCase() !== 'chatbox'){
chatoff("Hacks Off")
hacks = false;
}else if(e.keyCode == 222 && hacks == false && document.activeElement.id.toLowerCase() !== 'chatbox'){
chatoff("Hacks On")
hacks = true;
}
if(e.keyCode == 76 && autohat == true && document.activeElement.id.toLowerCase() !== 'chatbox'){
chat("Hat Off")
autohat = false;
}else if(e.keyCode == 76 && autohat == false && document.activeElement.id.toLowerCase() !== 'chatbox'){
chat("Hat On")
autohat = true;
}
if(e.keyCode == 188 && automill == true && document.activeElement.id.toLowerCase() !== 'chatbox'){
chat("Mills Off")
automill = false;
}else if(e.keyCode == 188 && automill == false && document.activeElement.id.toLowerCase() !== 'chatbox'){
chat("Mills On")
automill = true;
}
//------------- macros
if(e.keyCode == dash && document.activeElement.id.toLowerCase() !== 'chatbox' && hacks == true){//dash by AFK
lag(500, 10000000);
}else if(e.keyCode == bullKey && document.activeElement.id.toLowerCase() !== 'chatbox'){
equip(7,18)
}else if(e.keyCode == soldierKey && document.activeElement.id.toLowerCase() !== 'chatbox'){
equip(6,21)
}else if(e.keyCode == tankKey && document.activeElement.id.toLowerCase() !== 'chatbox'){
equip(40,19)
}else if(e.keyCode == unequipKey && document.activeElement.id.toLowerCase() !== 'chatbox'){
equip(0,0)
}else if(e.keyCode == dashKey && hacks == true && document.activeElement.id.toLowerCase() !== 'chatbox'){
lag(500, 100000000);//dashes to other side of map
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
/*Auto Hat*/
/*End of auto hat*/
  //-------------------------------------[Menu]------------------------------------\\
  var textG = document.createElement('div');
  document.getElementsByTagName('body')[0].appendChild(textG);
  textG.innerHTML = `
<!DOCTYPE html>

<html>

  <head>
    <style>
      #myhover a {
        background-color: rgba(0,0,0,.5);
        background-repeat: repeat;
        background-attachment: fixed;
        background-size: 160px 100px;
        position: absolute;
        left: -300px;
        transition: 0.3s;
        padding: 15px;
        width: 300px;
        text-decoration: none;
        font-size: 10px;
        font-family: 'bold', cursive;
        text-shadow: black 0px 1px, red 0px 2px, red 0px 3px;
        src: url('https://fonts.googleapis.com/css2?family=bold&display=swap');
        color: red;
        border-radius: 5 5px 5px 5;
        border-style: solid;
        border-width: thick;
        border-top-left-radius: 20px 50px;
        border-top-left-radius: 20px 50px;
        border-top-width: 20px;
        border-style: double;
        border-bottom-left-radius: 20px 50px;
        border-bottom-left-radius: 20px 50px;
        border-top-color: red;
        border-left-color: red;
        border-bottom-color: red;
        border-left-color: red;
      }

      #myhover a:hover {
        left: 0;
      }

      #modtab {
        top: 0px;
        background-color: red
      }

      .popup {
        position: relative;
        display: inline-block;
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }

      .popup .popuptext {
        visibility: hidden;
        width: 160px;
        background-color: red;
        color: red;
        text-align: center;
        border-radius: 6px;
        padding: 8px 0;
        position: absolute;
        z-index: 1;
        bottom: 125%;
        right: 50%;
        margin-right: -80px;
      }

      .popup .popuptext::after {
        content: "";
        position: absolute;
        top: 100%;
        right: 50%;
        margin-right: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: red transparent transparent transparent;
      }

      .popup .show {
        visibility: visible;
      }
      .pointer {
      cursor: pointer;
      }
            .smalltxt2 {
        position: absolute;
        transform: rotate(45deg) display: inline-block;
        font-size: 15px;
        color: red;
    }
    .bigtxt2 {
        display: inline-block;
        font-size: 30px;
        color: white;
    }
      .button:hover {
      transform: translateX(-10px);
      background: orange;
      }

      .button {position: relative; transition-duration: 0s; overflow: hidden;}

      .button:after {
      content: "";
      background: green;
      display: block;
      position: absolute;
      padding-top: 300%;
      padding-left: 350%;
      margin-left: -20px!important;
      margin-top: -120%;
      opacity: 0;
      transition: all 0.8s
      }

      .button:active:after {
      padding:0;
      margin:0;
      opacity:1;
      transition:0s
      }

    </style>
  </head>
  <body>
    <div id="myhover" class="hover">
      <a id="modtab">
        <h1><legend id="EquilpMenuOpener" align="center"><div class="bigtxt2">Imod Menu<span class="smalltxt2">By AFK</span></div></legend></h1>
        <button id="heal" class="button" type="button" style="cursor: pointer; background-color:red; font-family: 'bold'; src: url('https://fonts.googleapis.com/css2?family=bold&display=swap'); color:black; width:200px; height:26px;" onclick="input.execute('game_stats_build 456845687456845687456845687456877')">Heal</button>

        <br><button id="autohat" class="button" type="button" style="cursor: pointer; background-color:red; font-family: 'bold'; src: url('https://fonts.googleapis.com/css2?family=bold&display=swap'); color:black; width:200px; height:26px;" onclick="input.execute('game_stats_build 567456745678567456745678567488888')"class="ontoggle: ON;">AutoHat</button>

        <br><button id="anti" class="button" type="button" style="cursor: pointer; background-color:red; font-family: 'bold'; src: url('https://fonts.googleapis.com/css2?family=bold&display=swap'); color:black; width:200px; height:26px;" onclick="input.execute('game_stats_build 567456745678567456745678567488888')">Anti</button>

        <br><button id="autoaim" class="button" type="button" style="cursor: pointer; background-color:red; font-family: 'bold'; src: url('https://fonts.googleapis.com/css2?family=bold&display=swap'); color:black; width:200px; height:26px;" onclick="input.execute('game_stats_build 567456745678567456745678567488888')">AutoAim</button>

        <br><button id="HiWorld" class="button" type="button" style="cursor: pointer; background-color:red; font-family: 'bold'; src: url('https://fonts.googleapis.com/css2?family=bold&display=swap'); color:black; width:200px; height:26px;" onclick="input.execute('game_stats_build 0')">Hello World</button>
      </a>
    </div>
  </body>
</html>
`
document.getElementById("heal").onclick = () => {
if(heal == true){
heal = false;
chat("heal off")
}else if(heal == false){
heal = true;
chat("heal on")
}
}
document.getElementById("autohat").onclick = () => {
if(autohat == true){
autohat = false;
chat("autohat off")
}else if(autohat == false){
autohat = true;
chat("autohat on")
}
}
document.getElementById("anti").onclick = () => {
if(anti == true){
anti = false;
chat("anti off")
}else if(anti == false){
anti = true;
chat("anti on")
}
}
document.getElementById("HiWorld").onclick = () => {
if(HiWorld == true){
HiWorld = false;
chat("greet people off")
}else if(HiWorld == false){
HiWorld = true;
chat("greet people on")
}
}
document.getElementById("autoaim").onclick = () => {
if(autoaim == true){
autoaim = false;
chat("autoaim off")
}else if(autoaim == false){
autoaim = true;
chat("autoaim on")
}
}
  var tgl = document.createElement('div');
  document.getElementsByTagName('body')[0].appendChild(tgl);
  tgl.style = "position:absolute; pointer-events: none; top:10px; right:200px; font-family: 'bold', cursive; color: #FFFFFF; font-size: 20px; text-shadow: black 0px 1px, red 0px 2px, white 0px 3px";
  tgl.innerHTML =
  `
  Press {Open Stats} To Open Stat Menu
  `
  var imgfh = document.createElement('div');
  document.getElementsByTagName('body')[0].appendChild(imgfh);
  imgfh.style = "position:absolute; pointer-events: none; top:10px; right:10px; font-family: 'bold', cursive; color: #FFFFFF; font-size: 20px; text-shadow: black 0px 1px, red 0px 2px, white 0px 3px";
 imgfh.innerHTML = `
<div>
  <style>
@import url('https://fonts.googleapis.com/css2?family=bold&display=swap');

    img {
  background-color: red;
  width: 200px;
  border: 5px solid red;
  padding: 5px;

}

a.hidden {
  display: none;
}
a.hiddentwo {
  display: none;
}

.column {
  float: left;
  width: 12%;
  padding: 5px;
  vertical-align: top;
  display: inline-block;
  text-align: center;
}

a.hidden::after {
  content: "";
  clear: both;
  display: table;
}

.caption {
    display: block;
}

  </style>
  <a id="img2" class="hidden">
  <h3 style="font-style:20px;">Being Added</h3>
  </a>
</div>

`
  function hmm() {
    var xp = document.getElementById("img2");
    if (xp.style.display === "none") {
      xp.style.display = "block";
    } else {
      xp.style.display = "none";
    }
  }

  function mmh() {
    var xp = document.getElementById("img2two");
    if (xp.style.display === "none") {
      xp.style.display = "block";
    } else {
      xp.style.display = "none";
    }
  }

  function keydownFunction() {
    var x = document.getElementById("myhover");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }
  document.body.onkeyup = function(ep) {
    if (ep.keyCode === 220) {
      hmm();
      mmh();
    }
    if (ep.keyCode === 27 && document.activeElement.id.toLowerCase() !== 'chatbox') {
      keydownFunction();
    }
  }

  var tglinfo = document.createElement('div');
  document.getElementsByTagName('body')[0].appendChild(tglinfo);
  tglinfo.style = "position:absolute; pointer-events: none; top:10px; left:400px; font-family: 'bold', cursive; color: #FFFFFF; font-size: 20px; text-shadow: black 0px 1px, red 0px 2px, pink 0px 3px";
 tglinfo.innerHTML = `
  Press {ESC} To Open Menu
  `
//end of menu
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
    isSkull: null,
    millslastx: 0,
    millslasty: 0
};
var enemiesNear;
var enemyX;
var enemyY;
var isEnemyNear;
var nearestEnemy;
var nearestEnemyAngle;
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
/*Auto Place/Replace*/
if(item == "12"){
if(window.location.host == "sandbox.moomoo.io" && Math.sqrt(Math.pow((myPlayer.y-nearestEnemy[2]), 2) + Math.pow((myPlayer.x-nearestEnemy[1]), 2)) < 150){
place(spikeType, nearestEnemyAngle + toRad(180));
for(let i = 1; i <= 10; i++) {
place(boostType, nearestEnemyAngle + toRad(180 + i * 10));
}
for(let i = 1; i <= 10; i++) {
place(spikeType, nearestEnemyAngle + toRad(180 - i * 10));
}
}else if(Math.sqrt(Math.pow((myPlayer.y-nearestEnemy[2]), 2) + Math.pow((myPlayer.x-nearestEnemy[1]), 2)) < 150){
place(boostType, nearestEnemyAngle);
place(spikeType, nearestEnemyAngle + toRad(90));
place(spikeType, nearestEnemyAngle - toRad(90));
}
}
/*end of auto place / replace */
/* heal */
var healSpeed = 80;
var EmpAnti = false;
if(item == "h" && data[1] == myPlayer.id){
if(data[2] < 100 && data[2] > 0 && heal == true){// Regular Heal
setTimeout(() => {
place(foodType, null);
},healSpeed);
}
if(EmpAnti == true && heal == true){//Emp Anti
equip(22,13)
setTimeout(() => {
equip(6,21)
},500);
}
if(data[2] < 55 && data[2] > 0 && heal == true){//Auto Q
setTimeout(() => {
place(foodType)
EmpAnti = true;
},2200);
}
}
/* End Of Heal */
/* Auto Break */
function autobreak() {
setInterval(() => {
if(intrap == true && Math.sqrt(Math.pow((myPlayer.y - TrapCoord.y), 2) + Math.pow ((myPlayer.x - TrapCoord.x), 2)) < 90){
spinex(Number.MAX_VALUE)
}else{
wep(primary)
stophit()
}
},20);
if(intrap == false){
chat(`|[Trap]~~{GONE}|`)
}
if(intrap == true){
for(let i = 0; i < 36; i++) {
place(spikeType, nearestEnemyAngle + toRad(i * 36));
}
for(let i = 0; i < 36; i++) {
place(millType, nearestEnemyAngle + toRad(i * 36));
}
}
setInterval(() => {
if(intrap == true && Math.sqrt(Math.pow((myPlayer.y - TrapCoord.y), 2) + Math.pow ((myPlayer.x - TrapCoord.x), 2)) < 90){
if (secondary == "10") {
wep(secondary);
}else{
wep(primary)
}
}
},0);
setInterval(() => {
if(intrap == true && Math.sqrt(Math.pow((myPlayer.y - TrapCoord.y), 2) + Math.pow ((myPlayer.x - TrapCoord.x), 2)) < 90){
equip(40,21)
hit()
setTimeout(() => {
equip(26,13)
stophit()
},100);
}
},250);
}
    var outoftrap = true;
    if(item == "6" && nearestEnemy.id){
        for(let i = 0; i < data[1].length / 8; i++){
            let objectInfo = data[1].slice(8*i, 8*i+8);
            if(objectInfo[6] == 15 && objectInfo[7] != myPlayer.id){
                trap_a = Math.atan2(objectInfo[2] - myPlayer.y, objectInfo[1] - myPlayer.x);
                TrapCoord.x = objectInfo[1];
                TrapCoord.y = objectInfo[2];
                if(Math.sqrt(Math.pow((myPlayer.y-objectInfo[2]), 2) + Math.pow((myPlayer.x-objectInfo[1]), 2)) < 90){
                    intrap = true;
                    outoftrap = false;
                    trapid = objectInfo[0];
                    autobreak()
                }
            }
        }
    }
    if (item == "12") {
        if(intrap == true) {
            if(trapid == data[1]) {
                outoftrap = true;
                intrap = false;
                stophit()
                equip(6,13)
                wep(primary)
            }
        }
    }
/* End of auto break */
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
                if(automill == true) {
let angle = Math.atan2(myPlayer.millslasty - myPlayer.y, myPlayer.millslastx - myPlayer.x);
                            place(millType, angle);
                            place(millType, angle - toRad(72));
                            place(millType, angle + toRad(72));
                            place(millType, angle - toRad(36));
                            place(millType, angle + toRad(36));
                        myPlayer.millslastx = myPlayer.x;
                        myPlayer.millslasty = myPlayer.y;
                }
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
        nearestEnemyAngle = Math.atan2(nearestEnemy[2]-myPlayer.y, nearestEnemy[1]-myPlayer.x);
        if(Math.sqrt(Math.pow((myPlayer.y-nearestEnemy[2]), 2) + Math.pow((myPlayer.x-nearestEnemy[1]), 2)) < 300) {
            isEnemyNear = true;
        }
    }
    if (!nearestEnemy) {
        nearestEnemyAngle = myPlayer.dir;
    }
    update();
}