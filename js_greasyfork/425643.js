// ==UserScript==
// @name ProutexMacro v6 Return
// @namespace -
// @version 6.0
// @description I'm sorry, but I won't update this macro! I'm going to create a cheat and post it on GreasyFork soon!
// @author Discord: GoblinTime#2714 : Greasy Fork: ♡⚠♡GoblinTime♡⚠♡
// @match *://*.moomoo.io/*
// @match *://moomoo.io/*
// @grant none
// @require https://cdn.jsdelivr.net/npm/msgpack-lite@0.1.26/dist/msgpack.min.js
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @require https://code.jquery.com/ui/1.12.0/jquery-ui.min.js
// @downloadURL https://update.greasyfork.org/scripts/425643/ProutexMacro%20v6%20Return.user.js
// @updateURL https://update.greasyfork.org/scripts/425643/ProutexMacro%20v6%20Return.meta.js
// ==/UserScript==
var title = document.title;
if(title === "Moo Moo") {
console.log("You play moomoo.io");
window.location.native_resolution = true;
} else {
console.log("You not play moomoo.io");
}

var pi = Math.PI,
    date = new Date(),
    old = Date.now(),
    cos = Math.cos,
    sin = Math.sin,
    abs = Math.abs,
    pow = Math.pow,
    min = Math.min,
    max = Math.max,
    atan2 = Math.atan2,
    sqrt = Math.sqrt,
    random = Math.random,
    floor = Math.floor;
function rdm(a,b) {
  return Math.floor(Math.random() *(b - a + 1)) + a;
}
    /* Add new colors for health bars */
    var ctxx = CanvasRenderingContext2D;
if(ctxx.prototype.roundRect) {
        ctxx.prototype.roundRect = ((func) => function() {
        if (this.fillStyle == "#8ecc51"){ //All allys
        this.fillStyle = "rgba(0, 66, 0, 0.47)";
        } else if(this.fillStyle == "#cc5151") { // All enemy
        this.fillStyle = "rgba(112, 6, 0, 0.47)";
        } else if(this.fillStyle == "#3d3f42") { // Background health bar
        this.fillStyle = "rgba(82, 82, 82, 0.47)";
        }
        return(func.call(this, ...arguments));
        })
        (ctxx.prototype.roundRect);
}
// Start Resource
function StartRes() {
    window.follmoo("moofoll", 1);
}
StartRes();

// Menu
$("body").after(`

<button onclick="InfoMenu()" class="NameMacro">ProutexMacro v6</button>
<div id="infomenu">
<div class="nameblock">Ping and Fps:</div>
<hr>
<div id="ping" class="text">.</div>
<div id="fps" class="text">.</div>
<hr>
<div class="nameblock">Additionally:</div>
<hr>
<ul>
<li></label><label><div class="text">Pro-Map<input type="checkbox" id="NewMap"><span class="checkmark"></div></li>
<li></label><label><div class="text">Show-Cps<input type="checkbox" id="CPSTOGGLER"><span class="checkmark"></div></li>
<li></label><label><div class="text">AutoHotKeys<input type="checkbox" id="AHK"><span class="checkmark"></div></li>
<li></label><label><div class="text">AutoRespawn<input type="checkbox" id="autospawn"><span class="checkmark"></div></li>
<li></label><label><div class="text">Soldier_Q<input type="checkbox" id="Soldier_Q"><span class="checkmark"></div></li>
<li></label><label><div class="text">LeftAndRightClick<input type="checkbox" id="Clicks"><span class="checkmark"></div></li>
<li><div class="text">Clan: <input type="text" class="Input_Text_style" minlength="0" maxlength="7" style ="width:60px;" placeholder="Clan Name" id="MakeClan"><button onclick="CreateClan();" class="Input_Buttob_style">Send</button><button onclick="RemoveClan();" class="Input_Buttob_style">Remove</button></div></li>
</ul>
<hr>
<div class="nameblock">Versions:</div>
<hr>

<div class="text">
Version-6:
<ul>
<li>1. Added AutoSpawn<br>You will appear automatically after death!
</li>
<li>2. To put a Turret or other. Press - (H )
</li>
<li>3. In the menu, you can now create a clan! And also delete it!
</li>
<li>4. After entering the game, you will automatically write Im user ProutexMacro! I'm sorry about this, but I want it to be like this!
</li>
</ul>
<hr>
Version-5:
<ul>
<li>1. Added WebSocket!
</li>
<li>2. All switch elements are moved to the menu!
</li>
<li>3. Added AutoHotKey! You can enable it in the menu!<br>Key - ( N ) = x1 Mill<br>Key - ( V ) = x1 Spike<br>Key - ( F ) = x1 Trap<br>Key - ( Q ) = Heal!<br> All buildings have x5 cps!
</li>
<li>4. Big Map. Key - (Home) its Beta!!! (Click a second time to close!)
</li>
</ul>
<hr>
Version-4:
<ul>
<li>1. Menu.<br> To open the menu, click on the text (ProutexMacro)! To close it, click on any place on your screen except the menu!
</li>
<li>2. Remove all hats and accessories. Press - ( B )
</li>
<li>3. AutoReload.<br> The page will automatically reload when it crashes
</li>
<li>4. Big Store.<br> The store has become much bigger!
</li>
<li>5. Pro Map.<br> The map shows all the biomes!
</li>
<li>6. Show your cps.<br> Shows your CPS when clicked!
</li>
</ul>
<hr>
Version-3:
<ul>
<li>1. I changed the color of the health bars! Now they are semi-transparent!
</li>
<li>2. Made the soldier-Q switch now you need to click on ( H ) to turn it on!
</li>
<li>3. Now you can hide the leaderboard on ( K ) . When you press the ( K ) button again, the leaderboard will appear again!
</li>
<li>4. When you press ( Y ), there will be a BullTick!<br>
Bulltick is when a bull helmet hat appears, and when it hits you, your shame counter resets after taking 5 points of damage!
</li>
</ul>
<hr>
Version-2:
<ul>
<li>1. Start Resource.
</li>
<li>2. Automatically sends a request to the very first clan in the list. Press - ( Up-Arrow )
</li>
<li>3. SoldierHelmet+XWings. Press - ( Q )
</li>
<li>4. I removed the "LeftAndRightClick: Off" radio button.<br>
 Now when you disable this feature, nothing will happen.<br>
 But I left the text when turning on!<br>
 When enabled, it will be "LeftAndRightClick: On".
</li>
</ul>
<hr>
Version-1:
<ul>
<li>1. Release!
</li>
<li>2. BullHelmet+BloodWings. Press - ( R )
</li>
<li>3. SoldierHelmet+XWings. Press - ( T )
</li>
<li>4. TankGear+BlackWings. Press - ( Z )
</li>
<li>5. Booster+Tail. Press - ( Shift )
</li>
<li>6. Responsible for the function switch! Press - ( J )<br>
When you turn it on, an inscription will appear in the upper-left corner!<br>
When you are enabled, you can click the left or right mouse button!<br>
And they will wear hats! <=( Left ) responsible for: BullHelmet+SpikeGear+TurretGear+SoldierHelmet=><br>
<=( Right ) responsible for: TankGear+SamuraiArmor+SoldierHelmet=>
</li>
</ul>
<hr>
</div>



</div>
<style>
button:active,
button:focus {
  outline: none !important;
}
button::-moz-focus-inner {
  border: 0 !important;
}
.nameblock {
font-size: 20px;
color: #dbdbdb;
text-align: center;
}
li {
font-size: 13px;
}
.text {
display: block;
font-size: 17px;
color: #fff;
text-align: left;
}
.NameMacro{
cursor: pointer;
position: absolute;
background: linear-gradient(to right, red, orange, yellow, green, cyan, blue, violet);
background-size: 400% 400%;
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
-webkit-animation: colorR 20s ease infinite;
animation: colorR 20s ease infinite;
font-family: "Hammersmith One";
display: block !important;
top: 5px;
left: 720px;
font-size: 17px;
}
::-webkit-scrollbar { width: 5px; height: 3px;}
::-webkit-scrollbar-button {  background-color: #000000; }
::-webkit-scrollbar-track {  background-color: #999;}
::-webkit-scrollbar-track-piece { background-color: rgba(0, 0, 0, 0.50);}
::-webkit-scrollbar-thumb { height: 50px; background-color: #666; border-radius: 3px;}
::-webkit-scrollbar-corner { background-color: #999;}}
::-webkit-resizer { background-color: #666;}
#infomenu {
overflow-y: scroll;
overflow-x: hidden;
padding: 20px;
position: absolute;
display: none;
background: rgba(102, 102, 102, 0.25);
width: 310px;
height: 450px;
border: 2px solid black;
border-radius: 4px;
top: 80px;
left: 20px;
z-index: 1;
}
input {outline: 0 !important;}
.Input_Text_style, .Input_Buttob_style {
background: rgba(102, 102, 102);
border: 2px solid black;
border-radius: 10px;
color: #fff;
-o-transition: all 1s ease;
-ms-transition: all 1s ease;
-moz-transition: all 1s ease;
-webkit-transition: all 1s ease;
transition: all 1s ease;
}
.Input_Text_style:focus,.Input_Buttob_style:focus {
border: 2px solid #fff;
}
</style>
<script>
function InfoMenu() {
$("#infomenu").css({
"display" : "block"
});
}
$(document).mouseup(function (e) {
    var container = $("#infomenu");
    if (container.has(e.target).length === 0){
        container.hide();
    }
});

(function() {
  var UPDATE_DELAY = 700;
  var lastUpdate = 0;
  var frames = 0;
var values;
  function updateCounter() {
    var now = Date.now();
    var elapsed = now - lastUpdate;
    if (elapsed < UPDATE_DELAY) {
      ++frames;
    } else {
      var fps = Math.round(frames / (elapsed / 1000));
      document.getElementById("fps").textContent ="Fps: " + fps ;
      frames = 0;
      lastUpdate = now;
    }
    requestAnimationFrame(updateCounter);
  }
  lastUpdate = Date.now();
  requestAnimationFrame(updateCounter);
})();
setInterval(()=>{
document.getElementById("ping").textContent = "Ping: " + window.pingTime;
},0);

</script>
`);
$("body").after(`
<div id="ShowMenu">
</span>
<div id="addtext">LeftAndRightClick: On</div>
<div id="addtext3">AutoHotKey: On</div>
<div id="addtext0">Soldier-Q: On</div>
<div id="addtext4">AutoSpawn: On</div>
<div id="addtext1">Left-Click</div>
<div id="addtext2">Right-Click</div>
<style>
   #ShowMenu {
   position:absolute !important;
   display:block;
   top: 5px;
   left: 5px;
   width: auto;
   height: auto;
   text-align: center;
   }
   #addtext,#addtext1,#addtext2,#addtext0,#addtext3,#addtext4{
   display: none;
   color: #fff;
   background: linear-gradient(to right, red, orange, yellow, green, cyan, blue, violet);
   background-size: 400% 400%;
   font-size: 20px;
   -webkit-background-clip: text;
   -webkit-text-fill-color: transparent;
   -webkit-animation: colorR 20s ease infinite;
   animation: colorR 20s ease infinite;
   }
   @-webkit-keyframes colorR {
   0% { background-position: 0% 50% }
   50% { background-position: 100% 50% }
   100% { background-position: 0% 50% }
   }
   @keyframes colorR {
   0% { background-position: 0% 50% }
   50% { background-position: 100% 50% }
   100% { background-position: 0% 50% }
   }
</style>
<script>
let tm;
let t = "Moo Moo";
function change(icon, text) {
    document.querySelector('head title').innerHTML = text;
    document.querySelector('link[rel="shortcut icon"]').setAttribute('href',
        icon);
}
window.onblur = () => {
    tm = setTimeout(() => {
        change("https://cdn.discordapp.com/attachments/837884067822436382/838321077775237140/w16h161372343790hearts16.png",
            "😓COMEBACK!😓");
    }, 5000);
}
window.onfocus = () => {
    change("https://sandbox.moomoo.io/img/favicon.png?v=1", t);
}
</script>
`);
var AutoReload = setInterval(() => {
    if(document.getElementById("loadingText").textContent=="disconnectedreload"){
        window.onbeforeunload = null;
        clearInterval(AutoReload);
        window.location.reload();
    }
});
    document.querySelector("#MakeClan").oninput = function(){
     if (this.value.length === 0) {
     $(".Input_Text_style").css("border","2px solid red");
     } else {
     $(".Input_Text_style").css("border","2px solid #fff");
     }
}
var Clan = true;
var Removec = true;
const removeClan = RemoveClan = (() => {
    if(Removec == true) {
emit("9", );
}
});
const clanMake = CreateClan = (() => {
    if(Clan == true) {
        emit("8", document.getElementById("MakeClan").value);
    }
})
$("#enterGame").click( () => {
setTimeout(() => {
emit('ch', 'Im user ProutexMacro');
},250);
});
let mouseX, mouseY, width,height;
let url = new URL(window.location.href);
window.sessionStorage.force = url.searchParams.get("fc");
var pr,sec,st,bt,ft,mt,tr;
var AHK = false;
var autospawn = false;
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
var websocket;
var MsgPack = msgpack;
document.msgpack = msgpack;
WebSocket.prototype.OldSend = WebSocket.prototype.send;
WebSocket.prototype.send = function(e) {
if(!websocket){
Greasy(this);
websocket = this;
document.websocket = this;
}
this.OldSend(e);
}
function Greasy(msg){
msg.addEventListener('message', function(cd){
        Handler(cd);
    });
}
function Handler(e) {
    let tmp = MsgPack.decode(new Uint8Array(e.data));
    let data;
    if(tmp.length >= 1) {
       data = [tmp[0], ...tmp[1]];
      if (data[1] instanceof Array){
       data = data;
     }
    } else {
    data = tmp;
    }
    let item = data[0];
    if(!data) {
    return;
    }
        if (item == "33") {
        for(let e = 0; e < data[1].length / 13; e++) {
            let Arr = data[1].slice(13*e, 13*e+13);
            if(Arr[0] == myPlayer.id) {
                myPlayer.x = Arr[1];
                myPlayer.y = Arr[2];
                myPlayer.dir = Arr[3];
                myPlayer.object = Arr[4];
                myPlayer.weapon = Arr[5];
                myPlayer.clan = Arr[7];
                myPlayer.isLeader = Arr[8];
                myPlayer.hat = Arr[9];
                myPlayer.accessory = Arr[10];
                myPlayer.isSkull = Arr[11];
            }
        }
    }
    if (item == "1" && myPlayer.id == null){
        myPlayer.id = data[1];
    }
 if (item == "io-init") {
        let cvs = document.getElementById("gameCanvas");
        width = cvs.clientWidth;
        height = cvs.clientHeight;
        $(window).resize(function() {
            width = cvs.clientWidth;
            height = cvs.clientHeight;
        });
        cvs.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
}
    UpdateItems();
if(autospawn == true){
        item == "11" &&
        setTimeout(() => {
        emit('sp', {name:localStorage.getItem("moo_name"), moofoll: "1", skin: rdm(8,1)});
        },3000);
        }
}
function acc(id) {
    emit("13c", 1,id, 1);
    emit("13c", 0,id, 1);
}

function hat(id) {
emit("13c", 1,id, 0);
emit("13c", 0,id, 0);
}
function Sender(e) {
    websocket.send(new Uint8Array(Array.from(MsgPack.encode(e))));
}
function emit(e,a,b,c,m,r) {
    Sender([e, [a,b,c,m,r]]);
}
function use(e, a = atan2(mouseY - height / 2, mouseX - width / 2)) {
    emit("5", e, null);
    emit("c", 1, a);
    emit("c", 0, a);
    emit("5", myPlayer.weapon, true);
}
function useQ(e, a = atan2(mouseY - height / 2, mouseX - width / 2)) {
    emit("5", e, null);
    emit("c", 1, null);
    emit("c", 0, null);
    emit("5", myPlayer.weapon, true);
}
var rptr = function(key, action, interval) { let _isKeyDown = false; let _intervalId = undefined; return { start(keycode) { if(keycode == key && document.activeElement.id.toLowerCase() !== 'chatbox') { _isKeyDown = true; if(_intervalId === undefined) { _intervalId = setInterval(() => { action(); if(!_isKeyDown){ clearInterval(_intervalId); _intervalId = undefined; } }, interval); } } }, stop(keycode) { if(keycode == key && document.activeElement.id.toLowerCase() !== 'chatbox') { _isKeyDown = false; } } };}
const KeyHeal_3 = rptr(51, () => {
useQ(ft, null)
},25);
const KeyHeal_Q = rptr(81, () => {
useQ(ft, null)
},25);
const Put_Boost = rptr(70, () => {
for(let i=0;i<3;i++)use(bt)
},0);
const Put_Spike = rptr(86, () => {
for(let i=0;i<3;i++)use(st)
},0);
const Put_Mills = rptr(78, () => {
for(let i=0;i<3;i++)use(mt)
},0);
const Put_Turret = rptr(72, () => {
for(let i=0;i<3;i++)use(tr);
},0);
document.addEventListener('keydown', (e)=>{
if(AHK == true){
KeyHeal_3.start(e.keyCode);
KeyHeal_Q.start(e.keyCode);
Put_Boost.start(e.keyCode);
Put_Spike.start(e.keyCode);
Put_Mills.start(e.keyCode);
Put_Turret.start(e.keyCode);
}
});
document.addEventListener('keyup', (e)=>{
if(AHK == true){
KeyHeal_3.stop(e.keyCode);
KeyHeal_Q.stop(e.keyCode);
Put_Boost.stop(e.keyCode);
Put_Spike.stop(e.keyCode);
Put_Mills.stop(e.keyCode);
Put_Turret.stop(e.keyCode);
}
});
function Element_Visible(e) {
    return e.offsetParent !== null;
}
function UpdateItems() {
    for (let i=0;i<9;i++){
        if (Element_Visible(document.getElementById("actionBarItem" + i.toString()))){
            pr = i;
        }
    }
    for (let i=9;i<16;i++){
        if (Element_Visible(document.getElementById("actionBarItem" + i.toString()))){
            sec = i;
        }
    }
    for (let i=16;i<19;i++){
        if (Element_Visible(document.getElementById("actionBarItem" + i.toString()))){
            ft = i - 16;
        }
    }
    for (let i=22;i<26;i++){
        if (Element_Visible(document.getElementById("actionBarItem" + i.toString()))){
            st = i - 16;
        }
    }
    for (let i=26;i<29;i++){
        if (Element_Visible(document.getElementById("actionBarItem" + i.toString()))){
            mt = i - 16;
        }
    }
    for (let i=31;i<33;i++){
        if (Element_Visible(document.getElementById("actionBarItem" + i.toString()))){
            bt = i - 16;
        }
    }
    for (let i=33;i<36;i++){
       if (Element_Visible(document.getElementById("actionBarItem" + i.toString()))){
           tr = i - 16;
       }
   }
   for (let i=33;i<36;i++){
       if (Element_Visible(document.getElementById("actionBarItem" + i.toString()))){
           tr = i - 16;
       }
   }
}
    var Soldier_Q = false;
    var Clicks = false;
    const cvs = document.getElementById("gameCanvas");
    cvs.addEventListener("mousedown", clicks, false);
    function clicks(e) {
        if (e.button == 0) { // Left Click

            if (Clicks == true) {
                document.getElementById('addtext1').style
                .display = "block";
                window.storeEquip(0, 1);
                window.storeEquip(7);
                window.storeEquip(18, 1);
                setTimeout(function() {
                    window.storeEquip(11);
                    window.storeEquip(21, 1);
                }, 100);
                setTimeout(function() {
                    window.storeEquip(53);
                    window.storeEquip(21, 1);
                }, 180);
                setTimeout(function() {
                    window.storeEquip(6);
                    window.storeEquip(13, 1);
                }, 260);
                setTimeout(function() {
                    document.getElementById('addtext1').style
                        .display = "none";
                }, 600);
            }
        }
        if (e.button == 2) { // Right Click
            if (Clicks == true) {
                document.getElementById('addtext2').style
                .display = "block";
                window.storeEquip(0, 1);
                window.storeEquip(20);
                window.storeEquip(19, 1);
                setTimeout(function() {
                    window.storeEquip(40);
                    window.storeEquip(19, 1);
                }, 120);
                setTimeout(function() {
                    window.storeEquip(6);
                    window.storeEquip(19, 1);
                }, 200);
                setTimeout(function() {
                    document.getElementById('addtext2').style
                        .display = "none";
                }, 600);
            }
        }
    }
var bigMap = false;
    var leaderBlock = document.getElementById("leaderboard");
    document.addEventListener('keydown', (e) => { // Add event
        switch (e.keyCode) {
                case 36: // [Button]- Home
                if (bigMap == false) {
                bigMap = true;
                $("#mapDisplay").css({"background-size": "420px"});
                $("#mapDisplay").css({
                "position": "absolute",
                "top": "150px",
                "left": "585px",
                "background-color":"rgba(0,0,0,0.65)",
                "height": "420px",
                "width": "420px",
                "box-shadow": "rgba(0,0,0,.5) 0 0 0 1000px",
                "border": "6px solid black"
                });
                } else {
                bigMap = false;
                $("#mapDisplay").css({"background-size": "130px"});
                $("#mapDisplay").css({
                "position": "absolute",
                "bottom": "20px",
                "left": "20px",
                "top": "638px",
                "background-color":"rgba(0,0,0,0.25)",
                "height": "130px",
                "width": "130px",
                "box-shadow": "none",
                "border": "none"
                });
                }
                break;
            case 75: // [Button]- K
              if (leaderBlock.style.display == "block") {
              $("#killCounter").css({"margin": "0"});
              $("#killCounter").css({"top": "0px"});
                leaderBlock.style.display = "none";
               } else {
               $("#killCounter").css({"top": "230px"});
                leaderBlock.style.display = "block";
             }
                break;
                case 66: // [Button]- B
                window.storeEquip(0,1); // [Equip, Acc]- 0
                window.storeEquip(0); // [Equip, Hat]- 0
                break;
                // Bull Tick::
                case 89: // [Button]- Y
                console.log("Bull Tick");
                window.storeEquip(7); // [Equip, Hat]- BullHelmet
                setTimeout(() => {
                window.storeEquip(6); // [Equip, Hat]- SoldierGear
                },800);
                break;
            case 38: // [Button]- Up Arrow
                window.sendJoin(0); // Send a request to the very first clan
                break;
            case 82: // [Button]- R
                console.log("Bull, Blood[Wings]");
                window.storeEquip(0, 1);
                window.storeBuy(7); // [Buy, Hat]- BullHelmet
                window.storeBuy(18, 1); // [Buy, Acc]- Blood Wings
                window.storeEquip(7); // [Equip, Hat]- BullHelmet
                window.storeEquip(21, 1); // [Equip, Acc]- Blood Wings
                break;
            case 81: // [Button]- Q
              if(Soldier_Q == true){
                console.log("Soldier, X[Wings]");
                window.storeEquip(0, 1);
                window.storeBuy(6); // [Buy, Hat]- SoldierGear
                window.storeBuy(21, 1); // [Buy, Acc]- X Wings
                window.storeEquip(6); // [Equip, Hat]- SoldierGear
                window.storeEquip(21, 1); // [Equip, Acc]- X Wings
                }
                break;
            case 16: // [Button]- Shift
                if (myPlayer.y < 2400) {
                acc(11);
                hat(15);
                } else if (myPlayer.y > 6850 && myPlayer.y < 7550) {
                acc(11);
                hat(31);
                } else {
                acc(11);
                hat(12);
                }
                break;
            case 84: // [Button]- T
                console.log("Soldier, X[Wings]");
                window.storeEquip(0, 1);
                window.storeBuy(6); // [Buy, Hat]- Soldier
                window.storeBuy(21, 1); // [Buy, Acc]- X Wings
                window.storeEquip(6); // [Equip, Hat]- Soldier
                window.storeEquip(21, 1); // [Equip, Acc]- X Wings
                break;
            case 90: // [Button]- Z
                console.log("Tank, Black[Wings]");
                window.storeEquip(0, 1);
                window.storeBuy(40); // [Buy, Hat]- Tank
                window.storeBuy(19, 1); // [Buy, Acc]- Black Wings
                window.storeEquip(40); // [Equip, Hat]- Tank
                window.storeEquip(19, 1); // [Equip, Acc]- Black Wings
                break;
        }
    });
// AutoSpawn
var AutoSpawn = document.querySelector("#autospawn")
AutoSpawn.addEventListener('change', function() {
    if (this.checked) {
    document.getElementById('addtext4').style.display = "block";
        autospawn = true;
    } else {
    document.getElementById('addtext4').style.display = "none";
        autospawn = false;
    }
})
// Toggler Cps
var cpsss = document.querySelector("#CPSTOGGLER")
cpsss.addEventListener('change', function() {
    if (this.checked) {
$("#cpss").css("display", "block");
    } else {
$("#cpss").css("display", "none");
    }
});
var AHKK = document.querySelector("#AHK")
AHKK.addEventListener('change', function() {
    if (this.checked) {
    document.getElementById('addtext3').style.display = "block";
AHK = true;
    } else {
    document.getElementById('addtext3').style.display = "none";
AHK = false;
    }
});
var soldierQQ = document.querySelector("#Soldier_Q")
soldierQQ.addEventListener('change', function() {
    if (this.checked) {
Soldier_Q = true;
document.getElementById('addtext0').style.display = "block";
} else {
Soldier_Q = false;
document.getElementById('addtext0').style.display = "none";
    }
});
var cl = document.querySelector("#Clicks")
cl.addEventListener('change', function() {
if (this.checked) {
document.getElementById('addtext').style.display = "block";
Clicks = true;
} else {
document.getElementById('addtext').style.display = "none";
Clicks = false;
    }
});

// Toggler Map
var NewMapp = document.querySelector("#NewMap")
NewMapp.addEventListener('change', function() {
    if (this.checked) {
            $("#mapDisplay").css("background", "url('https://wormax.org/chrome3kafa/moomooio-background.png')");
    } else {
            $("#mapDisplay").css("background", "rgba(0, 0, 0, 0.25)");
    }
})
$("killCounter").css({"top": "230px"});
    /* Instructions for adding items: You need to put this code in a comment here is how I commented out this text */
    //  /*
    document.getElementById("storeHolder").style = "height: 1500px; width: 450px;"
    document.getElementById('gameName').innerText = 'ProutexMacro';
    document.getElementById("moomooio_728x90_home").style.display = "none";
    $("#moomooio_728x90_home").parent().css({display: "none"});
    $("#moomooio_728x90_home").parent().css({"display" : "none"});
    document.getElementById("promoImg").remove();
    document.getElementById('adCard').remove();
    $("#youtuberOf").remove();
    $("#followText").remove();
    $("#promoImgHolder").remove();
    $("#twitterFollow").remove();
    $("#joinPartyButton").remove();
    $("#linksContainer2").remove();
    $("#partyButton").remove();
    $("#youtubeFollow").remove();
    $("#adCard").remove();
    $("#adBlock").remove();
    $("#mobileInstructions").remove();
    $("#downloadButtonContainer").remove();
    $("#mobileDownloadButtonContainer").remove();
    $(".downloadBadge").remove();
    //  */
    setTimeout(() => {
        document.getElementById('ot-sdk-btn-floating').remove();
        document.getElementById('pre-content-container').remove();
    }, 2000);
    var cps = 0;
var click = 1;
$("#gameCanvas").mousedown(function(e){
if(e.which == 1 && click == 1){
cps = (cps + 1)
setTimeout( () => {
    cps = (cps - 1)
}, 950);
}
});
$("#gameCanvas").mousedown(function(e){
if(e.which == 3 && click == 1){
cps = (cps + 1)
setTimeout( () => {
cps = (cps - 1)
}, 950);
}
});
document.addEventListener("mousedown", buttonPress, false);
function buttonPress(e) {
if(e.button == 1 && click == 1){
cps = (cps + 1)
setTimeout( () => {
cps = (cps - 1)
}, 950);
}
}

var cpsM = document.createElement("div");
cpsM.style.padding = "5px";
cpsM.id = "cpss";
cpsM.style.font = "30px Arial";
cpsM.style.display = "none";
cpsM.style.position = "fixed";
cpsM.style.top = "40%";
cpsM.style.left = "0%";
cpsM.style.color = "#fff";
document.body.appendChild(cpsM);
setInterval(()=>{
cpsM.textContent = "Cps: " + cps;
}, 0);