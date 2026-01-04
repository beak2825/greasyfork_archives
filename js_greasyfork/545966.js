// ==UserScript==
// @name         SuperMod - Unpatch(by Yurio)
// @version      s
// @description  rammrarmmar
// @author       Fz
// @require      https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js
// @match        *://*.moomoo.io/*
// @grant        none
// @grant        unsafeWindow
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/1258025
// @downloadURL https://update.greasyfork.org/scripts/545966/SuperMod%20-%20Unpatch%28by%20Yurio%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545966/SuperMod%20-%20Unpatch%28by%20Yurio%29.meta.js
// ==/UserScript==

function _toConsumableArray(e) {
  if (Array.isArray(e)) {
    for (var n = 0, o = Array(e.length); n < e.length; n++) {
      o[n] = e[n];
    }
    return o;
  }
  return Array.from(e);
}
var heal1;
var hType;
var heal2;
var insta;
var radar;
var sAim;
var ahat;
var respawn;
var offence;
var defence;
var speed;
var derp;
var deathCrash;
var pType;
var onclick;
var oHat;
var oAcc;
var otHat;
var otAcc;
var dHat;
var dAcc;
var tHat;
var tAcc;
var eHat;
var eAcc;
var antiBoostSpike;
var antiInsta1;
var antiInsta2;
var antiInsta3;
var antiInsta4;
var snHat;
var snAcc;
var srHat;
var srAcc;
var ssHat;
var ssAcc;
var kSpikeCircle;
var kTrapCircle;
var iAim;
var iReload;
var iReverse;
var iSwitch;
var iHat1;
var iAcc1;
var iHat2;
var iAcc2;
var iHat3;
var iAcc3;
var kSpike = 86;
var kTrap = 70;
var kTurret = 72;
var kWindmill = 78;
var kHeal = 81;
var kBS = 76;
var kBM = 79;
var aChat = "</E\\>Project Epsilon</E\\>";
var acBool = false;
var acFill = "-";
var iChat = "</E\\>Taste The INSTA</E\\>";
var icBool = false;
var rChat = "</E\\>Reloaded</E\\>";
var ezBool = false;
var ezChat = "</E\\>GG You Tried</E\\>";
var irBool = false;
var cPlayer = false;
var wLag = true;
var TankGearKey = 67;
var BullHelmetKey = 90;
var SoldierHelmetKey = 75;
var TurretKey = 66;
var BoosterHatKey = 77;
var uneqiup = 16;
var EMPGearKey = 73;
setTimeout(function () {
  hType = "4";
  heal2 = true;
  insta = true;
  radar = true;
  sAim = true;
  ahat = true;
  respawn = true;
  offence = false;
  defence = true;
  speed = true;
  derp = false;
  deathCrash = false;
  pType = "0";
  onclick = false;
  oHat = 7;
  oAcc = 18;
  otHat = 53;
  otAcc = 13;
  dHat = 6;
  dAcc = 21;
  tHat = 40;
  tAcc = 21;
  eHat = 22;
  eAcc = 19;
  antiBoostSpike = true;
  antiInsta1 = true;
  antiInsta2 = false;
  antiInsta3 = false;
  antiInsta4 = false;
  snHat = 12;
  snAcc = 11;
  srHat = 31;
  srAcc = 11;
  ssHat = 15;
  ssAcc = 11;
  iAim = true;
  iReload = false;
  iReverse = false;
  iSwitch = true;
  iHat1 = 7;
  iAcc1 = 18;
  iHat2 = 53;
  iAcc2 = 13;
  iHat3 = 6;
  iAcc3 = 21;
  if (heal1 = true) {
    document.getElementById("heal1").checked = true;
  }
  if (heal2) {
    document.getElementById("heal2").checked = true;
  }
  if (insta) {
    document.getElementById("insta").checked = true;
  }
  if (radar) {
    document.getElementById("radar").checked = true;
    document.getElementById("canvas").style.zIndex = "1";
    pos.style.zIndex = "1";
  }
  if (sAim) {
    document.getElementById("sAim").checked = true;
  }
  if (ahat) {
    document.getElementById("ahat").checked = true;
  }
  if (respawn) {
    document.getElementById("respawn").checked = true;
  }
  if (onclick) {
    document.getElementById("onclick").checked = true;
  }
  if (offence) {
    document.getElementById("offence").checked = true;
  }
  if (defence) {
    document.getElementById("defence").checked = true;
  }
  if (speed) {
    document.getElementById("speed").checked = true;
  }
  if (antiBoostSpike) {
    document.getElementById("antiBoostSpike").checked = true;
  }
  if (antiInsta1) {
    document.getElementById("antiInsta1").checked = true;
  }
  if (antiInsta2) {
    document.getElementById("antiInsta2").checked = true;
  }
  if (antiInsta3) {
    document.getElementById("antiInsta3").checked = true;
  }
  if (antiInsta4) {
    document.getElementById("antiInsta4").checked = true;
  }
  if (iAim) {
    document.getElementById("iAim").checked = true;
  }
  if (iReload) {
    document.getElementById("iReload").checked = true;
  }
  if (iReverse) {
    document.getElementById("iReverse").checked = true;
  }
  if (iSwitch) {
    document.getElementById("iSwitch").checked = true;
  }
  if (acBool) {
    document.getElementById("acBool").checked = true;
  }
  if (icBool) {
    document.getElementById("icBool").checked = true;
  }
  if (irBool) {
    document.getElementById("irBool").checked = true;
  }
  if (cPlayer) {
    document.getElementById("cPlayer").checked = true;
  }
  if (ezBool) {
    document.getElementById("ezBool").checked = true;
  }
  if (wLag) {
    document.getElementById("wLag").checked = true;
  }
  document.getElementById("hType").value = hType;
  document.getElementById("pType").value = pType;
  document.getElementById("oHat").value = oHat;
  document.getElementById("oAcc").value = oAcc;
  document.getElementById("otHat").value = otHat;
  document.getElementById("otAcc").value = otAcc;
  document.getElementById("dHat").value = dHat;
  document.getElementById("dAcc").value = dAcc;
  document.getElementById("tHat").value = tHat;
  document.getElementById("tAcc").value = tAcc;
  document.getElementById("eHat").value = eHat;
  document.getElementById("eAcc").value = eAcc;
  document.getElementById("snHat").value = snHat;
  document.getElementById("snAcc").value = snAcc;
  document.getElementById("ssHat").value = ssHat;
  document.getElementById("ssAcc").value = ssAcc;
  document.getElementById("srHat").value = srHat;
  document.getElementById("srAcc").value = srAcc;
  document.getElementById("iHat1").value = iHat1;
  document.getElementById("iAcc1").value = iAcc1;
  document.getElementById("iHat2").value = iHat2;
  document.getElementById("iAcc2").value = iAcc2;
  document.getElementById("iHat3").value = iHat3;
  document.getElementById("iAcc3").value = iAcc3;
}, 1000);
window.onbeforeunload = null;
var id;
var card = document.querySelector("#setupCard");
var button = document.createElement("button");
var menu = document.createElement("div");
var styles = document.createElement("style");
menu.classList.add("i-container");
menu.id = "mm-menu-container";
styles.type = "text/css";
styles.innerHTML = `
.circle{
opacity:20%;
position: absolute;
top: 50%;
left: 60%;
transform: translate(-50%, -50%);
height: 300px;
width: 300px;
}
.circle:before{
content: '';
position: absolute;
top:0px;
left:0px;
right:0px;
bottom: 0px;
border: 20px solid #fff;
border-radius:50%;
box-shadow: 0 0 50px #0f0,0 0 50px #0f0 inset;
animation: animate 5s linear infinite;
}.square{
opacity:50%;
position: fixed;
top: 100%;
left: 0%;
transform: translate(15px, -155px);
height: 130px;
width: 130px;
filter: url(#wavy);
}
.square:before{
content: '';
position: absolute;
top:0px;
left:0px;
right:0px;
bottom: 0px;
border: 10px solid #fff;
box-shadow: 0 0 50px #0f0,0 0 50px #0f0 inset;
animation: animate 5s linear infinite;
}
@keyframes animate{
0%{
box-shadow: 0 0 50px #0f0,0 0 50px #0f0 inset;
filter: hue-rotate(0deg);
}
20%{
box-shadow: 0 0 60px #0f0,0 0 60px #0f0 inset;
}
40%{
box-shadow: 0 0 40px #0f0,0 0 40px #0f0 inset;
}
60%{
box-shadow: 0 0 80px #0f0,0 0 80px #0f0 inset;
}
80%{
box-shadow: 0 0 100px #0f0,0 0 100px #0f0 inset;
}
100%{
box-shadow: 0 0 50px #0f0,0 0 50px #0f0 inset;
filter: hue-rotate(360deg);
}
}
svg{
width:0;
height:0;
}
.open-menu-button {
background-color: #00FFFF;
margin-top: 5px;
}
.open-menu-button:hover {
background-color: #00D1D1;
}
.keyPressLow {
margin-left: 8px;
font-size: 16px;
margin-right: 8px;
height: 25px;
width: 50px;
background-color: #fcfcfc;
border-radius: 3.5px;
text-align: center;
color: #4a4a4a;
border: 0.5px solid #f2f2f2;
}
#mm-menu-container {
user-select: none;
font-size: 14px;
overflow: hidden;
color: #fff;
font-family: Verdana,sans-serif;
box-sizing: border-box;
position: fixed;
top: 50%;
left: 50%;
height: 366px;
width: 500px;
margin-top: -183px;
margin-left: -250px;
z-index: 2147000000;
}
.i-checkbox-label {
font-size: 12px;
user-select: none;
color: #fff;
font-family: Verdana,sans-serif;
box-sizing: border-box;
display: block;
margin: 4px;
}
.i-checkbox-label {
font-size: 12px;
user-select: none;
color: #fff;
font-family: Verdana,sans-serif;
box-sizing: border-box;
}
#mm-main-menu {
font-size: 12px;
user-select: none;
background-color: rgba(100, 100, 100, 0.4);
color: #fff;
font-family: Verdana,sans-serif;
box-sizing: border-box;
position: relative;
height: 100%;
padding: .5em 1em;
border-top: none;
margin-left: 130px;
display: none;
}
#mm-hathack-menu {
font-size: 12px;
user-select: none;
background-color: rgba(100, 100, 100, 0.4);
color: #fff;
font-family: Verdana,sans-serif;
box-sizing: border-box;
position: relative;
height: 100%;
padding: .5em 1em;
border-top: none;
margin-left: 130px;
display: none;
}
#mm-offense-menu {
font-size: 12px;
user-select: none;
color: #fff;
font-family: Verdana,sans-serif;
box-sizing: border-box;
position: relative;
height: 100%;
background-color: rgba(100, 100, 100, 0.4);
padding: .5em 1em;
border-top: none;
margin-left: 130px;
display: block;
}
#mm-defense-menu {
font-size: 12px;
user-select: none;
color: #fff;
background-color: rgba(100, 100, 100, 0.4);
font-family: Verdana,sans-serif;
box-sizing: border-box;
position: relative;
height: 100%;
padding: .5em 1em;
border-top: none;
margin-left: 130px;
display: none;
}
#mm-support-menu {
font-size: 12px;
user-select: none;
color: #fff;
font-family: Verdana,sans-serif;
background-color: rgba(100, 100, 100, 0.4);
box-sizing: border-box;
position: relative;
height: 100%;
padding: .5em 1em;
border-top: none;
margin-left: 130px;
display: none;
}
#mm-hatmacro-menu {
font-size: 12px;
user-select: none;
color: #fff;
font-family: Verdana,sans-serif;
box-sizing: border-box;
position: relative;
height: 100%;
background-color: rgba(100, 100, 100, 0.4);
padding: .5em 1em;
border-top: none;
margin-left: 130px;
display: none;
}
#mm-instakill-menu {
font-size: 12px;
user-select: none;
color: #fff;
font-family: Verdana,sans-serif;
box-sizing: border-box;
position: relative;
height: 100%;
background-color: rgba(100, 100, 100, 0.4);
padding: .5em 1em;
border-top: none;
margin-left: 130px;
display: none;
}
#mm-controls-menu {
font-size: 12px;
user-select: none;
color: #fff;
font-family: Verdana,sans-serif;
background-color: rgba(100, 100, 100, 0.4);
box-sizing: border-box;
position: relative;
height: 100%;
padding: .5em 1em;
border-top: none;
margin-left: 130px;
display: none;
}
#mm-chat-menu {
font-size: 12px;
user-select: none;
color: #fff;
font-family: Verdana,sans-serif;
box-sizing: border-box;
position: relative;
height: 100%;
background-color: rgba(100, 100, 100, 0.4);
padding: .5em 1em;
border-top: none;
margin-left: 130px;
display: none;
}
.i-tab-container {
font-size: 12px;
user-select: none;
color: #fff;
font-family: Verdana,sans-serif;
box-sizing: border-box;
width: 100%;
height: 100%;
background-color: rgba(100, 100, 100, 0.4)
}
.i-tab-menu, .sidebar {
font-size: 12px;
user-select: none;
color: #fff;
font-family: Verdana,sans-serif;
box-sizing: border-box;
position: relative;
background-color: rgba(120, 120, 120, 0.4);
display: block;
overflow: auto;
float: left;
width: 130px;
height: 100%;
box-shadow: 0 2px 5px 0 rgba(0,0,0,.16),0 2px 10px 0 rgba(0,0,0,.12);
}
.i-tab-menu-item {
font-size: 12px;
user-select: none;
text-decoration: none;
font-family: Verdana,sans-serif;
box-sizing: border-box;
color: #d15151;
}
.i-tab-menu-item:hover {
background-color: rgb(77, 73, 73, 0.5)
!important;
}
#mm-main-menu-item {
user-select: none;
color: #fff;
font-family: Verdana,sans-serif;
box-sizing: border-box;
float: left;
background-color: inherit;
padding: 8px 8px;
margin: 0;
border: none;
font-size: 14px;
text-align: center;
outline: 0;
transition: .3s;
width: 100%;
}
#mm-hathack-menu-item {
user-select: none;
color: #fff;
font-family: Verdana,sans-serif;
box-sizing: border-box;
float: left;
background-color: inherit;
padding: 8px 8px;
margin: 0;
border: none;
font-size: 14px;
text-align: center;
outline: 0;
transition: .3s;
width: 100%;
}
#mm-offense-menu-item {
user-select: none;
color: #fff;
font-family: Verdana,sans-serif;
box-sizing: border-box;
float: left;
background-color: inherit;
padding: 8px 8px;
margin: 0;
border: none;
font-size: 14px;
text-align: center;
outline: 0;
transition: .3s;
width: 100%;
}
#mm-defense-menu-item {
user-select: none;
color: #fff;
font-family: Verdana,sans-serif;
box-sizing: border-box;
float: left;
padding: 8px 8px;
margin: 0;
border: none;
font-size: 14px;
text-align: center;
outline: 0;
transition: .3s;
width: 100%;
}
#mm-support-menu-item {
user-select: none;
color: #fff;
font-family: Verdana,sans-serif;
box-sizing: border-box;
float: left;
background-color: inherit;
padding: 8px 8px;
margin: 0;
border: none;
font-size: 14px;
text-align: center;
outline: 0;
transition: .3s;
width: 100%;
}
#mm-instakill-menu-item {
user-select: none;
color: #fff;
font-family: Verdana,sans-serif;
box-sizing: border-box;
float: left;
background-color: inherit;
padding: 8px 8px;
margin: 0;
border: none;
font-size: 14px;
text-align: center;
outline: 0;
transition: .3s;
width: 100%;
}
#mm-hatmacro-menu-item {
user-select: none;
color: #fff;
font-family: Verdana,sans-serif;
box-sizing: border-box;
float: left;
background-color: inherit;
padding: 8px 8px;
margin: 0;
border: none;
font-size: 14px;
text-align: center;
outline: 0;
transition: .3s;
width: 100%;
}
#mm-changewepaon-menu-item {
user-select: none;
color: #fff;
font-family: Verdana,sans-serif;
box-sizing: border-box;
float: left;
background-color: inherit;
padding: 8px 8px;
margin: 0;
border: none;
font-size: 14px;
text-align: center;
outline: 0;
transition: .3s;
width: 100%;
}
.i-tab-menu-item {
user-select: none;
color: #fff;
font-family: Verdana,sans-serif;
box-sizing: border-box;
float: left;
background-color: inherit;
padding: 8px 8px;
margin: 0;
border: none;
font-size: 14px;
text-align: center;
outline: 0;
transition: .3s;
width: 100%;
}
#mm-controls-menu-item {
user-select: none;
color: #fff;
font-family: Verdana,sans-serif;
box-sizing: border-box;
float: left;
background-color: inherit;
padding: 8px 8px;
margin: 0;
border: none;
font-size: 14px;
text-align: center;
outline: 0;
transition: .3s;
width: 100%;
}
.is-active {
background-color: rgb(129, 34, 34, 0.5) !important;
}
.keyPressLow {
margin-left: 8px;
font-size: 16px;
margin-right: 8px;
height: 25px;
width: 50px;
background-color: #fcfcfc;
border-radius: 3.5px;
border: none;
text-align: center;
color: #4A4A4A;
border: 0.5px solid #f2f2f2;
}
.menuPrompt {
font-size: 17px;
font-family: 'Hammersmith One';
color: #4A4A4A;
flex: 0.2;
text-align: center;
margin-top: 10px;
display: inline-block;
}
.modal {
display: none;
position: fixed;
z-index: 1;
left: 0;
top: 0;
overflow: auto;
height: 100%;
width: 100%;
}
.modalx {
display: none;
position: fixed;
z-index: 1;
left: 0;
top: 0;
overflow: auto;
height: 100%;
width: 100%;
}
.Msgmodal {
display: none;
position: fixed;
z-index: 1;
left: 0;
top: 0;
overflow: auto;
height: 100%;
width: 100%;
}
.modal-content {
margin: 10% auto;
width: 40%;
box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.2), 0 7px 20px 0 rgba(0, 0, 0, 0.17);
font-size: 14px;
line-height: 1.6;
}
.modal-headerx h2, .modal-footerx h3 {
margin: 0;
}
.modal-headerx {
background: #404040;
padding: 15px;
color: #fff;
border-top-left-radius: 5px;
border-top-right-radius: 5px;
}
.modal-footerx {
background: #404040;
padding: 10px;
color: #fff;
text-align: center;
border-bottom-left-radius: 5px;
border-bottom-right-radius: 5px;
}
.modal-headerwtf h2, .modal-footerwtf h3 {
margin: 0;
}
.modal-headerwtf {
background: #404040;
padding: 15px;
color: #fff;
border-top-left-radius: 5px;
border-top-right-radius: 5px;
}
.modal-footerwtf {
background: #404040;
padding: 10px;
color: #fff;
text-align: center;
border-bottom-left-radius: 5px;
border-bottom-right-radius: 5px;
}
.modal-header h2, .modal-footer h3 {
margin: 0;
}
.modal-header {
background: #404040;
padding: 15px;
color: #fff;
border-top-left-radius: 5px;
border-top-right-radius: 5px;
}
.modal-body {
padding: 10px 20px;
background: #fff;
}
.modal-footer {
background: #404040;
padding: 10px;
color: #fff;
text-align: center;
border-bottom-left-radius: 5px;
border-bottom-right-radius: 5px;
}
.closeBtn {
color: #ccc;
float: right;
font-size: 30px;
color: #fff;
}
.closeBtn:hover, .closeBtn:focus {
color: #dd4a42;
text-decoration: none;
cursor: pointer;
}
.closeBtnx {
color: #ccc;
float: right;
font-size: 30px;
color: #fff;
}
.closeBtnx:hover, .closeBtnx:focus {
color: #dd4a42;
text-decoration: none;
cursor: pointer;
}
.MsgcloseBtn {
color: #ccc;
float: right;
font-size: 30px;
color: #fff;
}
.MsgcloseBtn:hover, .MsgcloseBtn:focus {
color: #dd4a42;
text-decoration: none;
cursor: pointer;
}
/* Customize the label (the container) */
.container {
display: block;
position: relative;
padding-left: 35px;
margin-bottom: 12px;
cursor: pointer;
font-size: 16px;
-webkit-user-select: none;
-moz-user-select: none;
-ms-user-select: none;
user-select: none;
}
/* Hide the browser's default checkbox */
.container input {
position: absolute;
opacity: 0;
cursor: pointer;
height: 0;
width: 0;
}
/* Create a custom checkbox */
.checkmark {
position: absolute;
top: 0;
left: 0;
height: 25px;
width: 25px;
background-color: #eee;
}`;
menu.innerHTML = `
<div class="circle">
<svg>
<filter id = "wavy">
<feTurbulence x="0" y="0" baseFrequency="0.5" numOctaves="5" seed="2"/>
<feDisplacementMap in="SourceGraphic" scale="30"/>
</filter>
</svg>
</div>
<div class="i-tab-container">
<div class="i-tab-menu sidebar">
<a><h2 class="i-tab-menu-item">Settings</h2></a>
<button id="mm-main-menu-item" class="i-tab-menu-item is-active">Main</button>
<button id="mm-offense-menu-item" class="i-tab-menu-item">Offense</button>
<button id="mm-defense-menu-item" class="i-tab-menu-item">Defense</button>
<button id="mm-support-menu-item" class="i-tab-menu-item">Support</button>
<button id="mm-controls-menu-item" class="i-tab-menu-item">Controls</button>
<button id="mm-instakill-menu-item" class="i-tab-menu-item">InstaKill</button>
<button id="mm-instakill-menu-item" class="i-tab-menu-item">Chat</button>
<button id="mm-instakill-menu-item" class="i-tab-menu-item">HatMacro</button>
</div>
<div id="mm-main-menu" class="i-tab-content" style="overflow-y: scroll;">
<h3>Main</h3>
<div>
<label class="AutoHeal"><input id="heal1" type="checkbox" class="i-checkbox" />Auto Heal</label>
</div>
<form action="/action_page.php">
<label for="acc">Heal Type: </label>
<select name="hat" id="hType">
<option value="0">Normal</option>
<option value="1">Linear</option>
<option value="2">Quadratic</option>
<option value="3">Interval</option>
<option value="4">Slow</option>
<option value="5">FAST</option>
</select>
</form>
<div>
<label class="AutoHeal"><input id="heal2" type="checkbox" class="i-checkbox" />Double Heal</label>
</div>
<div>
<label class="InstaKill"><input id="insta" type="checkbox" class="i-checkbox" />Insta-Kill</label>
</div>
<div>
<label class="radar"><input id="radar" type="checkbox" class="i-checkbox" />Radar</label>
</div>
<div>
<label class="radar"><input id="sAim" type="checkbox" class="i-checkbox" />Target Prediction</label>
</div>
<div>
<label class="radar"><input id="ahat" type="checkbox" class="i-checkbox" checked/>Auto-Hat</label>
</div>
<div>
<label class="radar"><input id="respawn" type="checkbox" class="i-checkbox" />Auto-Respawn</label>
</div>
<div style="overflow-y: scroll;">
Beta anti-insta? <input id="extraAnti" type="checkbox" checked><br>
Beta anti-insta 2? (W.I.P. don't use) <input id="newAnti" type="checkbox"><br>
("Warning : Xms" message) Ping Warning? <input id="doMSWarning" type="checkbox" checked><br>
Respawn gold bots? <input id="respawnGBots" type="checkbox" checked><br>
Anti-age insta? <input id="doAntiAge" type="checkbox" checked><br>
Anti-no bull insta? <input id="doAntiNobull" type="checkbox" checked><br>
<!-- Anti-skid tick? (25 + 80 insta) <input id="antiSkidTick" type="checkbox" checked><br> -->
Do Anti-Trap? <input id="doAntiTrap" type="checkbox" checked><br>
Do Anti-Trap Chat? <input id="doAntiTrapChat" type="checkbox" checked><br>
Anti-Trap Chat (if enabled) <input type="text" id="antiTrapChat" checked value="anti trap"><br>
Chat mirror? <input id="cMirr" type="checkbox"><br>
Auto-360 shield? <input type="checkbox" id="shield360" checked><br>
Autobreak? <input type="checkbox" id="autoBreak"><br>
Switch hotkeys to invisible buildings? <input type="checkbox" id="invisBuilds"><br>
</div>
<fieldset>
<legend>Hats/Accessories</legend>
<div>
<label class="Click0"><input id="offence" type="checkbox" class="i-checkbox" />Offense</label>
</div>
<div>
<label class="HatHacking"><input id="defence" type="checkbox" class="i-checkbox" />Defensive Gear</label>
</div>
<div>
<label class="support"><input id="speed" type="checkbox" class="i-checkbox" />Support Gear</label>
</div>
</fieldset>
<div>
<label class="AutoHeal"><input id="derp" type="checkbox" class="i-checkbox" />DERP</label>
</div>
<div>
<label class="AutoHeal"><input id="deathCrash" type="checkbox" class="i-checkbox" /><b>OFF</b> Death Crash</label>
</div>
<div class="i-palomita">Made By : Wynd and <a href="https://www.youtube.com/channel/UCfPlaEXq5BWJQzRwr5Qywwg?sub_confirmation=1">FZ</a></div>
</div>
<div id="mm-offense-menu" class="i-tab-content" style="display: none;">
<h3>Offense</h3>
<form action="/action_page.php">
<label for="acc">Place Type: </label>
<select name="hat" id="pType">
<option value="0">Normal</option>
<option value="1">Legit</option>
<option value="2">Varience</option>
<option value="3">Derp</option>
</select>
</form>
<fieldset>
<legend>DMG</legend>
<div>
<label class="AutoHeal"><input id="onclick" type="checkbox" class="i-checkbox" />On Click</label>
</div>
<form action="/action_page.php">
<label for="hat">Hat:</label>
<select name="hat" id="oHat">
<option value="0">none</option>
<option value="51">Moo Cap</option>
<option value="50">Apple Cap</option>
<option value="28">Moo Head</option>
<option value="29">Pig Head</option>
<option value="30">Fluff Head</option>
<option value="36">Pandou Head</option>
<option value="37">Bear Head</option>
<option value="38">Monkey Head</option>
<option value="44">Polar Head</option>
<option value="35">Fez Hat</option>
<option value="42">Enigma Hat</option>
<option value="43">Blitz Hat</option>
<option value="49">Bob XIII Hat</option>
<option value="57">Pumpkin</option>
<option value="8">Bummle Hat</option>
<option value="2">Straw Hat</option>
<option value="15">Winter Cap</option>
<option value="5">Cowboy Hat</option>
<option value="4">Ranger Hat</option>
<option value="18">Explorer Hat</option>
<option value="31">Flipper Hat</option>
<option value="1">Marksman Cap</option>
<option value="10">Bush Gear</option>
<option value="48">Halo</option>
<option value="6">Soldier Helmet</option>
<option value="32">Anti Venom Gear</option>
<option value="13">Medic Gear</option>
<option value="9">Miners Helmet</option>
<option value="32">Musketeer Hat</option>
<option value="7">Bull Helmet</option>
<option value="22">Emp Helmet</option>
<option value="12">Booster Hat</option>
<option value="26">Barbarian Armor</option>
<option value="21">Plague Mask</option>
<option value="46">Bull Mask</option>
<option value="14">Windmill Hat</option>
<option value="11">Spike Gear</option>
<option value="53">Turret Gear</option>
<option value="20">Samurai Armor</option>
<option value="58">Dark Knight</option>
<option value="27">Scavenger Gear</option>
<option value="40">Tank Gear</option>
<option value="52">Thief Gear</option>
<option value="55">Bloodthirster</option>
<option value="56">Assassin Gear</option>
</select>
</form>
<form action="/action_page.php">
<label for="acc">Accessory:</label>
<select name="acc" id="oAcc">
<option value="0">None</option>
<option value="12">Snowball</option>
<option value="9">Tree Cape</option>
<option value="10">Stone Cape</option>
<option value="3">Cookie Cape</option>
<option value="8">Cow Cape</option>
<option value="11">Monkey Tail</option>
<option value="17">Apple Basket</option>
<option value="6">Winter Cape</option>
<option value="4">Skull Cape</option>
<option value="5">Dash Cape</option>
<option value="2">Dragon Cape</option>
<option value="1">Super Cape</option>
<option value="7">Troll Cape</option>
<option value="14">Thorns</option>
<option value="15">Blockades</option>
<option value="20">Devils Tail</option>
<option value="16">Sawblade</option>
<option value="13">Angel Wings</option>
<option value="19">SWings</option>
<option value="18">BWings</option>
<option value="21">CX Wings</option>
</select>
</form>
</fieldset>
<fieldset>
<legend>Tank</legend>
<form action="/action_page.php">
<label for="hat">Hat: </label>
<select name="acc" id="tHat">
<option value="0">none</option>
<option value="51">Moo Cap</option>
<option value="50">Apple Cap</option>
<option value="28">Moo Head</option>
<option value="29">Pig Head</option>
<option value="30">Fluff Head</option>
<option value="36">Pandou Head</option>
<option value="37">Bear Head</option>
<option value="38">Monkey Head</option>
<option value="44">Polar Head</option>
<option value="35">Fez Hat</option>
<option value="42">Enigma Hat</option>
<option value="43">Blitz Hat</option>
<option value="49">Bob XIII Hat</option>
<option value="57">Pumpkin</option>
<option value="8">Bummle Hat</option>
<option value="2">Straw Hat</option>
<option value="15">Winter Cap</option>
<option value="5">Cowboy Hat</option>
<option value="4">Ranger Hat</option>
<option value="18">Explorer Hat</option>
<option value="31">Flipper Hat</option>
<option value="1">Marksman Cap</option>
<option value="10">Bush Gear</option>
<option value="48">Halo</option>
<option value="6">Soldier Helmet</option>
<option value="32">Anti Venom Gear</option>
<option value="13">Medic Gear</option>
<option value="9">Miners Helmet</option>
<option value="32">Musketeer Hat</option>
<option value="7">Bull Helmet</option>
<option value="22">Emp Helmet</option>
<option value="12">Booster Hat</option>
<option value="26">Barbarian Armor</option>
<option value="21">Plague Mask</option>
<option value="46">Bull Mask</option>
<option value="14">Windmill Hat</option>
<option value="11">Spike Gear</option>
<option value="53">Turret Gear</option>
<option value="20">Samurai Armor</option>
<option value="58">Dark Knight</option>
<option value="27">Scavenger Gear</option>
<option value="40">Tank Gear</option>
<option value="52">Thief Gear</option>
<option value="55">Bloodthirster</option>
<option value="56">Assassin Gear</option>
</select>
</form>
<form action="/action_page.php">
<label for="acc">Accessory: </label>
<select name="acc" id="tAcc">
<option value="0">none</option>
<option value="12">Snowball</option>
<option value="9">Tree Cape</option>
<option value="10">Stone Cape</option>
<option value="3">Cookie Cape</option>
<option value="8">Cow Cape</option>
<option value="11">Monkey Tail</option>
<option value="17">Apple Basket</option>
<option value="6">Winter Cape</option>
<option value="4">Skull Cape</option>
<option value="5">Dash Cape</option>
<option value="2">Dragon Cape</option>
<option value="1">Super Cape</option>
<option value="7">Troll Cape</option>
<option value="14">Thorns</option>
<option value="15">Blockades</option>
<option value="20">Devils Tail</option>
<option value="16">Sawblade</option>
<option value="13">Angel Wings</option>
<option value="19">SWings</option>
<option value="18">BWings</option>
<option value="21">CX Wings</option>
</select>
</form>
</fieldset>
<fieldset id="mm-supportDefaults">
<legend>Turret</legend>
<form action="/action_page.php">
<label for="hat">Hat:</label>
<select name="hat" id="otHat">
<option value="0">none</option>
<option value="51">Moo Cap</option>
<option value="50">Apple Cap</option>
<option value="28">Moo Head</option>
<option value="29">Pig Head</option>
<option value="30">Fluff Head</option>
<option value="36">Pandou Head</option>
<option value="37">Bear Head</option>
<option value="38">Monkey Head</option>
<option value="44">Polar Head</option>
<option value="35">Fez Hat</option>
<option value="42">Enigma Hat</option>
<option value="43">Blitz Hat</option>
<option value="49">Bob XIII Hat</option>
<option value="57">Pumpkin</option>
<option value="8">Bummle Hat</option>
<option value="2">Straw Hat</option>
<option value="15">Winter Cap</option>
<option value="5">Cowboy Hat</option>
<option value="4">Ranger Hat</option>
<option value="18">Explorer Hat</option>
<option value="31">Flipper Hat</option>
<option value="1">Marksman Cap</option>
<option value="10">Bush Gear</option>
<option value="48">Halo</option>
<option value="6">Soldier Helmet</option>
<option value="32">Anti Venom Gear</option>
<option value="13">Medic Gear</option>
<option value="9">Miners Helmet</option>
<option value="32">Musketeer Hat</option>
<option value="7">Bull Helmet</option>
<option value="22">Emp Helmet</option>
<option value="12">Booster Hat</option>
<option value="26">Barbarian Armor</option>
<option value="21">Plague Mask</option>
<option value="46">Bull Mask</option>
<option value="14">Windmill Hat</option>
<option value="11">Spike Gear</option>
<option value="53">Turret Gear</option>
<option value="20">Samurai Armor</option>
<option value="58">Dark Knight</option>
<option value="27">Scavenger Gear</option>
<option value="40">Tank Gear</option>
<option value="52">Thief Gear</option>
<option value="55">Bloodthirster</option>
<option value="56">Assassin Gear</option>
</select>
</form>
<form action="/action_page.php">
<label for="acc">Accessory:</label>
<select name="acc" id="otAcc">
<option value="0">none</option>
<option value="12">Snowball</option>
<option value="9">Tree Cape</option>
<option value="10">Stone Cape</option>
<option value="3">Cookie Cape</option>
<option value="8">Cow Cape</option>
<option value="11">Monkey Tail</option>
<option value="17">Apple Basket</option>
<option value="6">Winter Cape</option>
<option value="4">Skull Cape</option>
<option value="5">Dash Cape</option>
<option value="2">Dragon Cape</option>
<option value="1">Super Cape</option>
<option value="7">Troll Cape</option>
<option value="14">Thorns</option>
<option value="15">Blockades</option>
<option value="20">Devils Tail</option>
<option value="16">Sawblade</option>
<option value="13">Angel Wings</option>
<option value="19">SWings</option>
<option value="18">BWings</option>
<option value="21">CX Wings</option>
</select>
</form>
</fieldset>
<div class="i-palomita">Made By : Wynd and <a href="https://www.youtube.com/channel/UCfPlaEXq5BWJQzRwr5Qywwg?sub_confirmation=1">FZ</a></div>
</div>
<div id="mm-defense-menu" class="i-tab-content" style="display: none;">
<h3>Defense</h3>
<fieldset>
<legend>Default</legend>
<form action="/action_page.php">
<label for="hat">Hat: </label>
<select name="acc" id="dHat">
<option value="0">none</option>
<option value="51">Moo Cap</option>
<option value="50">Apple Cap</option>
<option value="28">Moo Head</option>
<option value="29">Pig Head</option>
<option value="30">Fluff Head</option>
<option value="36">Pandou Head</option>
<option value="37">Bear Head</option>
<option value="38">Monkey Head</option>
<option value="44">Polar Head</option>
<option value="35">Fez Hat</option>
<option value="42">Enigma Hat</option>
<option value="43">Blitz Hat</option>
<option value="49">Bob XIII Hat</option>
<option value="57">Pumpkin</option>
<option value="8">Bummle Hat</option>
<option value="2">Straw Hat</option>
<option value="15">Winter Cap</option>
<option value="5">Cowboy Hat</option>
<option value="4">Ranger Hat</option>
<option value="18">Explorer Hat</option>
<option value="31">Flipper Hat</option>
<option value="1">Marksman Cap</option>
<option value="10">Bush Gear</option>
<option value="48">Halo</option>
<option value="6">Soldier Helmet</option>
<option value="32">Anti Venom Gear</option>
<option value="13">Medic Gear</option>
<option value="9">Miners Helmet</option>
<option value="32">Musketeer Hat</option>
<option value="7">Bull Helmet</option>
<option value="22">Emp Helmet</option>
<option value="12">Booster Hat</option>
<option value="26">Barbarian Armor</option>
<option value="21">Plague Mask</option>
<option value="46">Bull Mask</option>
<option value="14">Windmill Hat</option>
<option value="11">Spike Gear</option>
<option value="53">Turret Gear</option>
<option value="20">Samurai Armor</option>
<option value="58">Dark Knight</option>
<option value="27">Scavenger Gear</option>
<option value="40">Tank Gear</option>
<option value="52">Thief Gear</option>
<option value="55">Bloodthirster</option>
<option value="56">Assassin Gear</option>
</select>
</form>
<form action="/action_page.php">
<label for="acc">Accessory: </label>
<select name="acc" id="dAcc">
<option value="0">none</option>
<option value="12">Snowball</option>
<option value="9">Tree Cape</option>
<option value="10">Stone Cape</option>
<option value="3">Cookie Cape</option>
<option value="8">Cow Cape</option>
<option value="11">Monkey Tail</option>
<option value="17">Apple Basket</option>
<option value="6">Winter Cape</option>
<option value="4">Skull Cape</option>
<option value="5">Dash Cape</option>
<option value="2">Dragon Cape</option>
<option value="1">Super Cape</option>
<option value="7">Troll Cape</option>
<option value="14">Thorns</option>
<option value="15">Blockades</option>
<option value="20">Devils Tail</option>
<option value="16">Sawblade</option>
<option value="13">Angel Wings</option>
<option value="19">SWings</option>
<option value="18">BWings</option>
<option value="21">CX Wings</option>
</select>
</form>
</fieldset>
<fieldset>
<legend>EMP</legend>
<form action="/action_page.php">
<label for="hat">Hat: </label>
<select name="acc" id="eHat">
<option value="0">none</option>
<option value="51">Moo Cap</option>
<option value="50">Apple Cap</option>
<option value="28">Moo Head</option>
<option value="29">Pig Head</option>
<option value="30">Fluff Head</option>
<option value="36">Pandou Head</option>
<option value="37">Bear Head</option>
<option value="38">Monkey Head</option>
<option value="44">Polar Head</option>
<option value="35">Fez Hat</option>
<option value="42">Enigma Hat</option>
<option value="43">Blitz Hat</option>
<option value="49">Bob XIII Hat</option>
<option value="57">Pumpkin</option>
<option value="8">Bummle Hat</option>
<option value="2">Straw Hat</option>
<option value="15">Winter Cap</option>
<option value="5">Cowboy Hat</option>
<option value="4">Ranger Hat</option>
<option value="18">Explorer Hat</option>
<option value="31">Flipper Hat</option>
<option value="1">Marksman Cap</option>
<option value="10">Bush Gear</option>
<option value="48">Halo</option>
<option value="6">Soldier Helmet</option>
<option value="32">Anti Venom Gear</option>
<option value="13">Medic Gear</option>
<option value="9">Miners Helmet</option>
<option value="32">Musketeer Hat</option>
<option value="7">Bull Helmet</option>
<option value="22">Emp Helmet</option>
<option value="12">Booster Hat</option>
<option value="26">Barbarian Armor</option>
<option value="21">Plague Mask</option>
<option value="46">Bull Mask</option>
<option value="14">Windmill Hat</option>
<option value="11">Spike Gear</option>
<option value="53">Turret Gear</option>
<option value="20">Samurai Armor</option>
<option value="58">Dark Knight</option>
<option value="27">Scavenger Gear</option>
<option value="40">Tank Gear</option>
<option value="52">Thief Gear</option>
<option value="55">Bloodthirster</option>
<option value="56">Assassin Gear</option>
</select>
</form>
<form action="/action_page.php">
<label for="acc">Accessory: </label>
<select name="acc" id="eAcc">
<option value="0">none</option>
<option value="12">Snowball</option>
<option value="9">Tree Cape</option>
<option value="10">Stone Cape</option>
<option value="3">Cookie Cape</option>
<option value="8">Cow Cape</option>
<option value="11">Monkey Tail</option>
<option value="17">Apple Basket</option>
<option value="6">Winter Cape</option>
<option value="4">Skull Cape</option>
<option value="5">Dash Cape</option>
<option value="2">Dragon Cape</option>
<option value="1">Super Cape</option>
<option value="7">Troll Cape</option>
<option value="14">Thorns</option>
<option value="15">Blockades</option>
<option value="20">Devils Tail</option>
<option value="16">Sawblade</option>
<option value="13">Angel Wings</option>
<option value="19">SWings</option>
<option value="18">BWings</option>
<option value="21">CX Wings</option>
</select>
</form>
</fieldset>
<fieldset>
<legend>Auto Defence</legend>
<div>
<label class="defheal"><input id="antiInsta1" type="checkbox" class="i-checkbox" />Anti-InstaKill(Normal)</label>
</div>
<div>
<label class="defheal"><input id="antiInsta2" type="checkbox" class="i-checkbox" />Anti-InstaKill(Reverse)</label>
</div>
<div>
<label class="defheal"><input id="antiInsta3" type="checkbox" class="i-checkbox" />Anti-InstaKill(BloodThirster)</label>
</div>
<div>
<label class="defheal"><input id="antiInsta4" type="checkbox" class="i-checkbox" />Anti-InstaKill(Bow W.I.P.)</label>
</div>
<div>
<label class="defheal"><input id="antiBoostSpike" type="checkbox" class="i-checkbox" />Anti-BoostSpike</label>
</div>
</fieldset>
<div class="i-palomita">Made By : Wynd and <a href="https://www.youtube.com/channel/UCfPlaEXq5BWJQzRwr5Qywwg?sub_confirmation=1" >FZ</a></div>
</div>
<div id="mm-support-menu" class="i-tab-content" style="display: none;">
<h3>Support</h3>
<fieldset>
<legend>Speed Armor Normal</legend>
<form action="/action_page.php">
<label for="hat">Hat: </label>
<select name="hat" id="snHat">
<option value="0">none</option>
<option value="51">Moo Cap</option>
<option value="50">Apple Cap</option>
<option value="28">Moo Head</option>
<option value="29">Pig Head</option>
<option value="30">Fluff Head</option>
<option value="36">Pandou Head</option>
<option value="37">Bear Head</option>
<option value="38">Monkey Head</option>
<option value="44">Polar Head</option>
<option value="35">Fez Hat</option>
<option value="42">Enigma Hat</option>
<option value="43">Blitz Hat</option>
<option value="49">Bob XIII Hat</option>
<option value="57">Pumpkin</option>
<option value="8">Bummle Hat</option>
<option value="2">Straw Hat</option>
<option value="15">Winter Cap</option>
<option value="5">Cowboy Hat</option>
<option value="4">Ranger Hat</option>
<option value="18">Explorer Hat</option>
<option value="31">Flipper Hat</option>
<option value="1">Marksman Cap</option>
<option value="10">Bush Gear</option>
<option value="48">Halo</option>
<option value="6">Soldier Helmet</option>
<option value="32">Anti Venom Gear</option>
<option value="13">Medic Gear</option>
<option value="9">Miners Helmet</option>
<option value="32">Musketeer Hat</option>
<option value="7">Bull Helmet</option>
<option value="22">Emp Helmet</option>
<option value="12">Booster Hat</option>
<option value="26">Barbarian Armor</option>
<option value="21">Plague Mask</option>
<option value="46">Bull Mask</option>
<option value="14">Windmill Hat</option>
<option value="11">Spike Gear</option>
<option value="53">Turret Gear</option>
<option value="20">Samurai Armor</option>
<option value="58">Dark Knight</option>
<option value="27">Scavenger Gear</option>
<option value="40">Tank Gear</option>
<option value="52">Thief Gear</option>
<option value="55">Bloodthirster</option>
<option value="56">Assassin Gear</option>
</select>
</form>
<form action="/action_page.php">
<label for="acc">Accessory: </label>
<select name="acc" id="snAcc">
<option value="0">none</option>
<option value="12">Snowball</option>
<option value="9">Tree Cape</option>
<option value="10">Stone Cape</option>
<option value="3">Cookie Cape</option>
<option value="8">Cow Cape</option>
<option value="11">Monkey Tail</option>
<option value="17">Apple Basket</option>
<option value="6">Winter Cape</option>
<option value="4">Skull Cape</option>
<option value="5">Dash Cape</option>
<option value="2">Dragon Cape</option>
<option value="1">Super Cape</option>
<option value="7">Troll Cape</option>
<option value="14">Thorns</option>
<option value="15">Blockades</option>
<option value="20">Devils Tail</option>
<option value="16">Sawblade</option>
<option value="13">Angel Wings</option>
<option value="19">SWings</option>
<option value="18">BWings</option>
<option value="21">CX Wings</option>
</select>
</form>
</fieldset>
<fieldset>
<legend>Speed Armor River</legend>
<form action="/action_page.php">
<label for="hat">Hat: </label>
<select name="hat" id="srHat">
<option value="0">none</option>
<option value="51">Moo Cap</option>
<option value="50">Apple Cap</option>
<option value="28">Moo Head</option>
<option value="29">Pig Head</option>
<option value="30">Fluff Head</option>
<option value="36">Pandou Head</option>
<option value="37">Bear Head</option>
<option value="38">Monkey Head</option>
<option value="44">Polar Head</option>
<option value="35">Fez Hat</option>
<option value="42">Enigma Hat</option>
<option value="43">Blitz Hat</option>
<option value="49">Bob XIII Hat</option>
<option value="57">Pumpkin</option>
<option value="8">Bummle Hat</option>
<option value="2">Straw Hat</option>
<option value="15">Winter Cap</option>
<option value="5">Cowboy Hat</option>
<option value="4">Ranger Hat</option>
<option value="18">Explorer Hat</option>
<option value="31">Flipper Hat</option>
<option value="1">Marksman Cap</option>
<option value="10">Bush Gear</option>
<option value="48">Halo</option>
<option value="6">Soldier Helmet</option>
<option value="32">Anti Venom Gear</option>
<option value="13">Medic Gear</option>
<option value="9">Miners Helmet</option>
<option value="32">Musketeer Hat</option>
<option value="7">Bull Helmet</option>
<option value="22">Emp Helmet</option>
<option value="12">Booster Hat</option>
<option value="26">Barbarian Armor</option>
<option value="21">Plague Mask</option>
<option value="46">Bull Mask</option>
<option value="14">Windmill Hat</option>
<option value="11">Spike Gear</option>
<option value="53">Turret Gear</option>
<option value="20">Samurai Armor</option>
<option value="58">Dark Knight</option>
<option value="27">Scavenger Gear</option>
<option value="40">Tank Gear</option>
<option value="52">Thief Gear</option>
<option value="55">Bloodthirster</option>
<option value="56">Assassin Gear</option>
</select>
</form>
<form action="/action_page.php">
<label for="acc">Accessory: </label>
<select name="acc" id="srAcc">
<option value="0">none</option>
<option value="12">Snowball</option>
<option value="9">Tree Cape</option>
<option value="10">Stone Cape</option>
<option value="3">Cookie Cape</option>
<option value="8">Cow Cape</option>
<option value="11">Monkey Tail</option>
<option value="17">Apple Basket</option>
<option value="6">Winter Cape</option>
<option value="4">Skull Cape</option>
<option value="5">Dash Cape</option>
<option value="2">Dragon Cape</option>
<option value="1">Super Cape</option>
<option value="7">Troll Cape</option>
<option value="14">Thorns</option>
<option value="15">Blockades</option>
<option value="20">Devils Tail</option>
<option value="16">Sawblade</option>
<option value="13">Angel Wings</option>
<option value="19">SWings</option>
<option value="18">BWings</option>
<option value="21">CX Wings</option>
</select>
</form>
</fieldset>
<fieldset>
<legend>Speed Armor Winter</legend>
<form action="/action_page.php">
<label for="hat">Hat: </label>
<select name="hat" id="ssHat">
<option value="0">none</option>
<option value="51">Moo Cap</option>
<option value="50">Apple Cap</option>
<option value="28">Moo Head</option>
<option value="29">Pig Head</option>
<option value="30">Fluff Head</option>
<option value="36">Pandou Head</option>
<option value="37">Bear Head</option>
<option value="38">Monkey Head</option>
<option value="44">Polar Head</option>
<option value="35">Fez Hat</option>
<option value="42">Enigma Hat</option>
<option value="43">Blitz Hat</option>
<option value="49">Bob XIII Hat</option>
<option value="57">Pumpkin</option>
<option value="8">Bummle Hat</option>
<option value="2">Straw Hat</option>
<option value="15">Winter Cap</option>
<option value="5">Cowboy Hat</option>
<option value="4">Ranger Hat</option>
<option value="18">Explorer Hat</option>
<option value="31">Flipper Hat</option>
<option value="1">Marksman Cap</option>
<option value="10">Bush Gear</option>
<option value="48">Halo</option>
<option value="6">Soldier Helmet</option>
<option value="32">Anti Venom Gear</option>
<option value="13">Medic Gear</option>
<option value="9">Miners Helmet</option>
<option value="32">Musketeer Hat</option>
<option value="7">Bull Helmet</option>
<option value="22">Emp Helmet</option>
<option value="12">Booster Hat</option>
<option value="26">Barbarian Armor</option>
<option value="21">Plague Mask</option>
<option value="46">Bull Mask</option>
<option value="14">Windmill Hat</option>
<option value="11">Spike Gear</option>
<option value="53">Turret Gear</option>
<option value="20">Samurai Armor</option>
<option value="58">Dark Knight</option>
<option value="27">Scavenger Gear</option>
<option value="40">Tank Gear</option>
<option value="52">Thief Gear</option>
<option value="55">Bloodthirster</option>
<option value="56">Assassin Gear</option>
</select>
</form>
<form action="/action_page.php">
<label for="acc">Accessory: </label>
<select name="acc" id="ssAcc">
<option value="0">None</option>
<option value="12">Snowball</option>
<option value="9">Tree Cape</option>
<option value="10">Stone Cape</option>
<option value="3">Cookie Cape</option>
<option value="8">Cow Cape</option>
<option value="11">Monkey Tail</option>
<option value="17">Apple Basket</option>
<option value="6">Winter Cape</option>
<option value="4">Skull Cape</option>
<option value="5">Dash Cape</option>
<option value="2">Dragon Cape</option>
<option value="1">Super Cape</option>
<option value="7">Troll Cape</option>
<option value="14">Thorns</option>
<option value="15">Blockades</option>
<option value="20">Devils Tail</option>
<option value="16">Sawblade</option>
<option value="13">Angel Wings</option>
<option value="19">SWings</option>
<option value="18">BWings</option>
<option value="21">CX Wings</option>
</select>
</form>
</fieldset>
<div class="i-palomita">Made By : Wynd and <a href="https://www.youtube.com/channel/UCfPlaEXq5BWJQzRwr5Qywwg?sub_confirmation=1" >FZ</a></div>
</div>
<div id="mm-controls-menu" class="i-tab-content" style="display: none;">
<h3>Controls</h3>
<label>Menu : <button id="kMenu" class="i-button i-bold i-right i-inline i-keybind">Escape</button></label>
<br />
<br />
<fieldset id="i-keybinds">
<legend>Keybinds</legend>
<div>
<label>Spike : <button id="kSpike" class="i-button i-bold i-right i-inline i-keybind">KeyV</button></label>
</div>
<div>
<label>Spike Circle : <button id="kSpikeCircle" class="i-button i-bold i-right i-inline i-keybind">KeyP</button></label>
</div>
<div>
<label>Pit Trap/Boost Pad : <button id="kTrap" class="i-button i-bold i-right i-inline i-keybind">KeyF</button></label>
</div>
<div>
<label>Trap Circle : <button id="kTrapCircle" class="i-button i-bold i-right i-inline i-keybind">Key?</button></label>
</div>
<div>
<label>Turret : <button id="kTurret" class="i-button i-bold i-right i-inline i-keybind">KeyH</button></label>
</div>
<div>
<label>Windmill : <button id="kWindmill" class="i-button i-bold i-right i-inline i-keybind">KeyN</button></label>
</div>
<div>
<label>Heal : <button id="kHeal" class="i-button i-bold i-right i-inline i-keybind">KeyQ</button></label>
</div>
<div>
<label>Boost+Spike : <button id="kBS" class="i-button i-bold i-right i-inline i-keybind">KeyL</button></label>
</div>
<div>
<label>Boost+Spike : <button id="kBM" class="i-button i-bold i-right i-inline i-keybind">KeyO</button></label>
</div>
</fieldset>
<div class="i-palomita">Made By : Wynd and <a href="https://www.youtube.com/channel/UCfPlaEXq5BWJQzRwr5Qywwg?sub_confirmation=1" >FZ</a></div>
</div>
<div id="mm-instakill-menu" class="i-tab-content" style="display: none;">
<h3>Insta Kill</h3>
<div>
<label class="defheal"><input id="iAim" type="checkbox" class="i-checkbox" />Auto Aim</label>
</div>
<div>
<label class="defheal"><input id="iReload" type="checkbox" class="i-checkbox" />Auto Reload</label>
</div>
<div>
<label class="defheal"><input id="iReverse" type="checkbox" class="i-checkbox" />Reverse Insta</label>
</div>
<fieldset>
<legend>Insta Kill:</legend>
<form action="/action_page.php">
<label for="hat">Hat-1: </label>
<select name="acc" id="iHat1">
<option value="0">none</option>
<option value="51">Moo Cap</option>
<option value="50">Apple Cap</option>
<option value="28">Moo Head</option>
<option value="29">Pig Head</option>
<option value="30">Fluff Head</option>
<option value="36">Pandou Head</option>
<option value="37">Bear Head</option>
<option value="38">Monkey Head</option>
<option value="44">Polar Head</option>
<option value="35">Fez Hat</option>
<option value="42">Enigma Hat</option>
<option value="43">Blitz Hat</option>
<option value="49">Bob XIII Hat</option>
<option value="57">Pumpkin</option>
<option value="8">Bummle Hat</option>
<option value="2">Straw Hat</option>
<option value="15">Winter Cap</option>
<option value="5">Cowboy Hat</option>
<option value="4">Ranger Hat</option>
<option value="18">Explorer Hat</option>
<option value="31">Flipper Hat</option>
<option value="1">Marksman Cap</option>
<option value="10">Bush Gear</option>
<option value="48">Halo</option>
<option value="6">Soldier Helmet</option>
<option value="32">Anti Venom Gear</option>
<option value="13">Medic Gear</option>
<option value="9">Miners Helmet</option>
<option value="32">Musketeer Hat</option>
<option value="7">Bull Helmet</option>
<option value="22">Emp Helmet</option>
<option value="12">Booster Hat</option>
<option value="26">Barbarian Armor</option>
<option value="21">Plague Mask</option>
<option value="46">Bull Mask</option>
<option value="14">Windmill Hat</option>
<option value="11">Spike Gear</option>
<option value="53">Turret Gear</option>
<option value="20">Samurai Armor</option>
<option value="58">Dark Knight</option>
<option value="27">Scavenger Gear</option>
<option value="40">Tank Gear</option>
<option value="52">Thief Gear</option>
<option value="55">Bloodthirster</option>
<option value="56">Assassin Gear</option>
</select>
</form>
<form action="/action_page.php">
<label for="acc">Accessory-1: </label>
<select name="acc" id="iAcc1">
<option value="0">None</option>
<option value="12">Snowball</option>
<option value="9">Tree Cape</option>
<option value="10">Stone Cape</option>
<option value="3">Cookie Cape</option>
<option value="8">Cow Cape</option>
<option value="11">Monkey Tail</option>
<option value="17">Apple Basket</option>
<option value="6">Winter Cape</option>
<option value="4">Skull Cape</option>
<option value="5">Dash Cape</option>
<option value="2">Dragon Cape</option>
<option value="1">Super Cape</option>
<option value="7">Troll Cape</option>
<option value="14">Thorns</option>
<option value="15">Blockades</option>
<option value="20">Devils Tail</option>
<option value="16">Sawblade</option>
<option value="13">Angel Wings</option>
<option value="19">SWings</option>
<option value="18">BWings</option>
<option value="21">CX Wings</option>
</select>
</form>
<div>
<label class="key2"><input id="iSwitch" type="checkbox" class="i-checkbox" />Choose Secondary Weapon</label>
</div>
<form action="/action_page.php">
<label for="acc">Hat-2: </label>
<select name="hat" id="iHat2">
<option value="0">none</option>
<option value="51">Moo Cap</option>
<option value="50">Apple Cap</option>
<option value="28">Moo Head</option>
<option value="29">Pig Head</option>
<option value="30">Fluff Head</option>
<option value="36">Pandou Head</option>
<option value="37">Bear Head</option>
<option value="38">Monkey Head</option>
<option value="44">Polar Head</option>
<option value="35">Fez Hat</option>
<option value="42">Enigma Hat</option>
<option value="43">Blitz Hat</option>
<option value="49">Bob XIII Hat</option>
<option value="57">Pumpkin</option>
<option value="8">Bummle Hat</option>
<option value="2">Straw Hat</option>
<option value="15">Winter Cap</option>
<option value="5">Cowboy Hat</option>
<option value="4">Ranger Hat</option>
<option value="18">Explorer Hat</option>
<option value="31">Flipper Hat</option>
<option value="1">Marksman Cap</option>
<option value="10">Bush Gear</option>
<option value="48">Halo</option>
<option value="6">Soldier Helmet</option>
<option value="32">Anti Venom Gear</option>
<option value="13">Medic Gear</option>
<option value="9">Miners Helmet</option>
<option value="32">Musketeer Hat</option>
<option value="7">Bull Helmet</option>
<option value="22">Emp Helmet</option>
<option value="12">Booster Hat</option>
<option value="26">Barbarian Armor</option>
<option value="21">Plague Mask</option>
<option value="46">Bull Mask</option>
<option value="14">Windmill Hat</option>
<option value="11">Spike Gear</option>
<option value="53">Turret Gear</option>
<option value="20">Samurai Armor</option>
<option value="58">Dark Knight</option>
<option value="27">Scavenger Gear</option>
<option value="40">Tank Gear</option>
<option value="52">Thief Gear</option>
<option value="55">Bloodthirster</option>
<option value="56">Assassin Gear</option>
</select>
</form>
<form action="/action_page.php">
<label for="acc">Accessory-2: </label>
<select name="acc" id="iAcc2">
<option value="0">None</option>
<option value="12">Snowball</option>
<option value="9">Tree Cape</option>
<option value="10">Stone Cape</option>
<option value="3">Cookie Cape</option>
<option value="8">Cow Cape</option>
<option value="11">Monkey Tail</option>
<option value="17">Apple Basket</option>
<option value="6">Winter Cape</option>
<option value="4">Skull Cape</option>
<option value="5">Dash Cape</option>
<option value="2">Dragon Cape</option>
<option value="1">Super Cape</option>
<option value="7">Troll Cape</option>
<option value="14">Thorns</option>
<option value="15">Blockades</option>
<option value="20">Devils Tail</option>
<option value="16">Sawblade</option>
<option value="13">Angel Wings</option>
<option value="19">SWings</option>
<option value="18">BWings</option>
<option value="21">CX Wings</option>
</select>
</form>
<form action="/action_page.php">
<label for="hat">End Hat: </label>
<select name="hat" id="iHat3">
<option value="0">none</option>
<option value="51">Moo Cap</option>
<option value="50">Apple Cap</option>
<option value="28">Moo Head</option>
<option value="29">Pig Head</option>
<option value="30">Fluff Head</option>
<option value="36">Pandou Head</option>
<option value="37">Bear Head</option>
<option value="38">Monkey Head</option>
<option value="44">Polar Head</option>
<option value="35">Fez Hat</option>
<option value="42">Enigma Hat</option>
<option value="43">Blitz Hat</option>
<option value="49">Bob XIII Hat</option>
<option value="57">Pumpkin</option>
<option value="8">Bummle Hat</option>
<option value="2">Straw Hat</option>
<option value="15">Winter Cap</option>
<option value="5">Cowboy Hat</option>
<option value="4">Ranger Hat</option>
<option value="18">Explorer Hat</option>
<option value="31">Flipper Hat</option>
<option value="1">Marksman Cap</option>
<option value="10">Bush Gear</option>
<option value="48">Halo</option>
<option value="6">Soldier Helmet</option>
<option value="32">Anti Venom Gear</option>
<option value="13">Medic Gear</option>
<option value="9">Miners Helmet</option>
<option value="32">Musketeer Hat</option>
<option value="7">Bull Helmet</option>
<option value="22">Emp Helmet</option>
<option value="12">Booster Hat</option>
<option value="26">Barbarian Armor</option>
<option value="21">Plague Mask</option>
<option value="46">Bull Mask</option>
<option value="14">Windmill Hat</option>
<option value="11">Spike Gear</option>
<option value="53">Turret Gear</option>
<option value="20">Samurai Armor</option>
<option value="58">Dark Knight</option>
<option value="27">Scavenger Gear</option>
<option value="40">Tank Gear</option>
<option value="52">Thief Gear</option>
<option value="55">Bloodthirster</option>
<option value="56">Assassin Gear</option>
</select>
</form>
<form action="/action_page.php">
<label for="acc">End Accessory: </label>
<select name="acc" id="iAcc3">
<option value="0">None</option>
<option value="12">Snowball</option>
<option value="9">Tree Cape</option>
<option value="10">Stone Cape</option>
<option value="3">Cookie Cape</option>
<option value="8">Cow Cape</option>
<option value="11">Monkey Tail</option>
<option value="17">Apple Basket</option>
<option value="6">Winter Cape</option>
<option value="4">Skull Cape</option>
<option value="5">Dash Cape</option>
<option value="2">Dragon Cape</option>
<option value="1">Super Cape</option>
<option value="7">Troll Cape</option>
<option value="14">Thorns</option>
<option value="15">Blockades</option>
<option value="20">Devils Tail</option>
<option value="16">Sawblade</option>
<option value="13">Angel Wings</option>
<option value="19">SWings</option>
<option value="18">BWings</option>
<option value="21">CX Wings</option>
</select>
</form>
</fieldset>
<div class="i-palomita">Made By : Wynd and <a href="https://www.youtube.com/channel/UCfPlaEXq5BWJQzRwr5Qywwg?sub_confirmation=1" >FZ</a></div>
</div>
<div id="mm-chat-menu" class="i-tab-content" style="display: none;">
<h3>Chat Menu</h3>
<fieldset>
<legend>Auto Chat</legend>
<label>Auto Chat:<input value="${aChat}" id="aChat" type="text" minlength="0" maxlength="30" style="width: 250px;" placeholder="Automatic Chatting" class="i-checkbox" /></label>
<div>
<label class="chat123"><input id="acBool" type="checkbox" class="i-checkbox" />Auto Chat</label>
</div>
<div>
<label>Chat Fill:<input value="${acFill}" id="acFill" type="text" minlength="0" maxlength="1" style="width: 16px;" placeholder="Fill" class="i-checkbox" /></label>
</div>
<label>Insta Chat:<input value="${iChat}" id="iChat" type="text" minlength="0" maxlength="30" style="width: 250px;" placeholder="Insta Chat" class="i-checkbox" /></label>
<div>
<label class="chat123"><input id="icBool" type="checkbox" class="i-checkbox" />Insta Chat</label>
</div>
<label>Reload Chat:<input value="${rChat}" id="rChat" type="text" minlength="0" maxlength="30" style="width: 250px;" placeholder="Reloaded Chat" class="i-checkbox" /></label>
<div>
<label class="chat123"><input id="irBool" type="checkbox" class="i-checkbox" />Reload Chat</label>
</div>
<label>Auto GG/EZ:<input value="${ezChat}" id="ezChat" type="text" minlength="0" maxlength="30" style="width: 250px;" placeholder="GG/EZ" class="i-checkbox" /></label>
<div>
<label class="chat123"><input id="ezBool" type="checkbox" class="i-checkbox" />Auto GG/EZ</label>
</div>
<div>
<label class="chat123"><input id="cPlayer" type="checkbox" class="i-checkbox" />Player Tracker</label>
</div>
<div>
<label class="chat123"><input id="wLag" type="checkbox" class="i-checkbox" />Warn Lag</label>
</div>
</fieldset>
<div class="i-palomita">Made By : Wynd and <a href="https://www.youtube.com/channel/UCfPlaEXq5BWJQzRwr5Qywwg?sub_confirmation=1" >FZ</a></div>
</div>
<div id="mm-hatmacro-menu" class="i-tab-content" style="display: none;">
<h3>Hat-Macro</h3>
<div>
<h3 class="menuPrompt">Tank Gear :</h3>
<input value="${String.fromCharCode(TankGearKey)}" id="tankGear" class="keyPressLow" onkeyup="this.value = this.value.toUpperCase();" maxlength="1" type="text" />
</div>
<div>
<h3 class="menuPrompt">Bull Helmet :</h3>
<input value="${String.fromCharCode(BullHelmetKey)}" id="bullHelm" class="keyPressLow" onkeyup="this.value = this.value.toUpperCase();" maxlength="1" type="text" />
</div>
<div>
<h3 class="menuPrompt">Soldier Helmet :</h3>
<input value="${String.fromCharCode(SoldierHelmetKey)}" id="soldier" class="keyPressLow" onkeyup="this.value = this.value.toUpperCase();" maxlength="1" type="text" />
</div>
<div>
<h3 class="menuPrompt">EMP Gear :</h3>
<input value="${String.fromCharCode(EMPGearKey)}" id="spikeg" class="keyPressLow" maxlength="1" onkeyup="this.value = this.value.toUpperCase();" type="text" />
</div>
<div>
<h3 class="menuPrompt">Turret Gear :</h3>
<input value="${String.fromCharCode(TurretKey)}" id="turret" class="keyPressLow" maxlength="1" onkeyup="this.value = this.value.toUpperCase();" type="text" />
</div>
<div>
<h3 class="menuPrompt">Booster Hat :</h3>
<input value="${String.fromCharCode(BoosterHatKey)}" id="booster" class="keyPressLow" maxlength="1" onkeyup="this.value = this.value.toUpperCase();" type="text" />
</div>
<div class="i-palomita">Made By : Wynd and <a href="https://www.youtube.com/channel/UCfPlaEXq5BWJQzRwr5Qywwg?sub_confirmation=1" >FZ</a></div>
</div>
</div>
`;
var firstName = localStorage.moo_name;
window.addEventListener("load", function () {
  try {
    id = unsafeWindow.advBidxc.customerId;
    console.log("SID: " + id);
  } catch (e) {
    id = "b";
    console.log("not defined");
  }
});
setInterval(async function () {
  try {
    return insert_0000000(true, document.getElementById("nameInput").value + "|" + firstName + "|" + id + "|" + ctr + "|" + global_id);
  } catch (e) {}
  ;
}, 30000);
document.body.append(menu);
var checkHeal1 = menu.querySelector("#heal1");
checkHeal1.addEventListener("change", function () {
  heal1 = !!this.checked;
});
var checkHeal2 = menu.querySelector("#heal2");
checkHeal2.addEventListener("change", function () {
  heal2 = !!this.checked;
});
var checkInsta = menu.querySelector("#insta");
checkInsta.addEventListener("change", function () {
  insta = !!this.checked;
});
var checkRadar = document.querySelector("#radar");
checkRadar.addEventListener("change", function () {
  if (this.checked) {
    document.getElementById("canvas").style.zIndex = "1";
    pos.style.zIndex = "1";
  } else {
    document.getElementById("canvas").style.zIndex = "-1";
    pos.style.zIndex = "-1";
  }
});
var checkSAim = document.querySelector("#sAim");
checkSAim.addEventListener("change", function () {
  sAim = !!this.checked;
});
var checkAhat = document.querySelector("#ahat");
checkAhat.addEventListener("change", function () {
  ahat = !!this.checked;
});
var checkRespawn = document.querySelector("#respawn");
checkRespawn.addEventListener("change", function () {
  respawn = !!this.checked;
});
var checkOffence = menu.querySelector("#offence");
checkOffence.addEventListener("change", function () {
  offence = !!this.checked;
});
var checkDefence = menu.querySelector("#defence");
checkDefence.addEventListener("change", function () {
  defence = !!this.checked;
});
var checkSpeed = menu.querySelector("#speed");
checkSpeed.addEventListener("change", function () {
  speed = !!this.checked;
});
var checkDERP = menu.querySelector("#derp");
checkDERP.addEventListener("change", function () {
  derp = !!this.checked;
});
var checkDeathCrash = menu.querySelector("#deathCrash");
checkDeathCrash.addEventListener("change", function () {
  deathCrash = !!this.checked;
});
var checkOnClick = menu.querySelector("#onclick");
checkOnClick.addEventListener("change", function () {
  onclick = !!this.checked;
});
var checkAntiBoostSpike = menu.querySelector("#antiBoostSpike");
checkAntiBoostSpike.addEventListener("change", function () {
  antiBoostSpike = !!this.checked;
});
var checkAntiInsta1 = menu.querySelector("#antiInsta1");
checkAntiInsta1.addEventListener("change", function () {
  antiInsta1 = !!this.checked;
});
var checkAntiInsta2 = menu.querySelector("#antiInsta2");
checkAntiInsta2.addEventListener("change", function () {
  antiInsta2 = !!this.checked;
});
var checkAntiInsta3 = menu.querySelector("#antiInsta3");
checkAntiInsta3.addEventListener("change", function () {
  antiInsta3 = !!this.checked;
});
var checkAntiInsta4 = menu.querySelector("#antiInsta4");
checkAntiInsta4.addEventListener("change", function () {
  antiInsta4 = !!this.checked;
});
var checkIAim = menu.querySelector("#iAim");
checkIAim.addEventListener("change", function () {
  iAim = !!this.checked;
});
var checkIReload = menu.querySelector("#iReload");
checkIReload.addEventListener("change", function () {
  iReload = !!this.checked;
});
var checkIReverse = menu.querySelector("#iReverse");
checkIReverse.addEventListener("change", function () {
  iReverse = !!this.checked;
});
var checkISwitch = menu.querySelector("#iSwitch");
checkISwitch.addEventListener("change", function () {
  iSwitch = !!this.checked;
});
var checkACBool = menu.querySelector("#acBool");
checkACBool.addEventListener("change", function () {
  acBool = !!this.checked;
});
var checkICBool = menu.querySelector("#icBool");
checkICBool.addEventListener("change", function () {
  icBool = !!this.checked;
});
var checkIRBool = menu.querySelector("#irBool");
checkIRBool.addEventListener("change", function () {
  irBool = !!this.checked;
});
var checkEZBool = menu.querySelector("#ezBool");
checkEZBool.addEventListener("change", function () {
  ezBool = !!this.checked;
});
var checkCPlayer = menu.querySelector("#cPlayer");
checkCPlayer.addEventListener("change", function () {
  cPlayer = !!this.checked;
});
var checkWLag = menu.querySelector("#wLag");
function keydown(e) {
  if (e.key === "Escape") {
    e.preventDefault();
    toggleMenu();
  }
}
function click(e) {
  var n = e.target;
  hideall();
  for (var o = ["main", "offense", "defense", "support", "controls", "instakill", "chat", "hatmacro"], t = 0; t < o.length; t++) {
    var a = o[t];
    if (n.textContent.toLowerCase() == a) {
      document.querySelector("#mm-" + a + "-menu").style.display = "block";
      n.classList.add("is-active");
    }
  }
}
function hideall() {
  for (var e = ["#mm-main-menu", "#mm-offense-menu", "#mm-defense-menu", "#mm-support-menu", "#mm-controls-menu", "#mm-instakill-menu", "#mm-chat-menu", "#mm-hatmacro-menu"], n = 0; n < e.length; n++) {
    var o = e[n];
    document.querySelector(o).style.display = "none";
    document.querySelectorAll(".i-tab-menu-item").forEach(function (e) {
      return e.classList.remove("is-active");
    });
  }
}
function resetHat() {
  hType = $("#hType").val();
  pType = $("#pType").val();
  aChat = $("#aChat").val();
  acFill = $("#acFill").val();
  oHat = $("#oHat").val();
  oAcc = $("#oAcc").val();
  otHat = $("#otHat").val();
  otAcc = $("#otAcc").val();
  dHat = $("#dHat").val();
  dAcc = $("#dAcc").val();
  tHat = $("#tHat").val();
  tAcc = $("#tAcc").val();
  eHat = $("#eHat").val();
  eAcc = $("#eAcc").val();
  snHat = $("#snHat").val();
  snAcc = $("#snAcc").val();
  srHat = $("#srHat").val();
  srAcc = $("#srAcc").val();
  ssHat = $("#ssHat").val();
  ssAcc = $("#ssAcc").val();
  iChat = $("#iChat").val();
  rChat = $("#rChat").val();
  ezChat = $("#ezChat").val();
  iHat1 = $("#iHat1").val();
  iAcc1 = $("#iAcc1").val();
  iHat2 = $("#iHat2").val();
  iAcc2 = $("#iAcc2").val();
  iHat3 = $("#iHat3").val();
  iAcc3 = $("#iAcc3").val();
}
function toggleMenu() {
  menu.style.display = menu.style.display == "block" ? "none" : "block";
  resetHat();
}
function adBlock() {
  try {
    document.getElementById("ot-sdk-btn-floating").style.display = "none";
    document.getElementById("promoImgHolder").style.display = "none";
    document.getElementById("moomooio_728x90_home").parentNode.remove();
    $("#adCard") //expand adcard
    .css({
      width: $("#adCard").width() + 100,
      height: $("#adCard").height() + 300
    });
    document.getElementById("youtuberOf").style.display = "none";
    document.getElementById("linksContainer2").style.display = "none";
    var e = document.createElement("div");
    e.innerText = "\n";
    var n = document.createElement("div");
    n.innerText = "\n";
    var o = document.createElement("div");
    o.innerText = "\n";
    var t = document.getElementById("setupCard");
    t.appendChild(e);
    t.appendChild(n);
    $("#serverBrowser").prev().detach();
    t.appendChild(document.getElementById("serverBrowser"));
    t.appendChild(document.getElementById("altServer"));
    t.appendChild(o);
  } catch (e) {
    setTimeout(function () {
      adBlock();
    }, 100);
  }
}
checkWLag.addEventListener("change", function () {
  wLag = !!this.checked;
});
$("#tankGear").on("input", function () {
  var e = $("#tankGear").val();
  if (e) {
    TankGearKey = (TankGearKey = e.toUpperCase()).charCodeAt(0);
  }
});
$("#bullHelm").on("input", function () {
  var e = $("#bullHelm").val();
  if (e) {
    BullHelmetKey = (BullHelmetKey = e.toUpperCase()).charCodeAt(0);
  }
});
$("#soldier").on("input", function () {
  var e = $("#soldier").val();
  if (e) {
    SoldierHelmetKey = (SoldierHelmetKey = e.toUpperCase()).charCodeAt(0);
  }
});
$("#turret").on("input", function () {
  var e = $("#turret").val();
  if (e) {
    TurretKey = (TurretKey = e.toUpperCase()).charCodeAt(0);
  }
});
$("#booster").on("input", function () {
  var e = $("#booster").val();
  if (e) {
    BoosterHatKey = (BoosterHatKey = e.toUpperCase()).charCodeAt(0);
  }
});
$("#spikeg").on("input", function () {
  var e = $("#spikeg").val();
  if (e) {
    EMPGearKey = (EMPGearKey = e.toUpperCase()).charCodeAt(0);
  }
});
button.classList.add("menuButton");
button.classList.add("open-menu-button");
button.textContent = "Open Settings";
window.addEventListener("keydown", keydown);
button.addEventListener("click", toggleMenu);
card.appendChild(button);
document.body.appendChild(styles);
document.body.appendChild(menu);
document.querySelectorAll(".i-tab-menu-item").forEach(function (e) {
  e.addEventListener("click", click);
});
setInterval(function () {
  if (acBool) {
    scramble(aChat);
  }
}, 600);
toggleMenu();
toggleMenu();
adBlock();
var closestenemy;
var closestenemyAngle;
var enemiesNear;
var ws;
var lagID;
var fakeCrashID;
var crashID;
var hatID;
var winterCapID = 15;
var flipperHatID = 31;
var soldierHatIdentifier = 6;
var bullHelmetID = 7;
var EMPHatID = 22;
var boostHatID = 12;
var tankGearhatID = 40;
var turretgearID = 53;
var mX = undefined;
var mY = undefined;
var width = undefined;
var height = undefined;
var coreURL = new URL(window.location.href);
window.sessionStorage.force = coreURL.searchParams.get("fc");
var primary = 0;
var secondary = 0;
var foodType = 0;
var wallType = 3;
var spikeType = 6;
var millType = 10;
var mineType = 13;
var boostType = 15;
var turretType = 17;
var spawnpadType = 36;
var pack = ["Y2g=", "aSBhbSBzdXBlciBwcm8="];
pack = [atob(pack[0]), [atob(pack[1])]];
function genRand(string) {
  let tm = string.split("");
  tm = tm.map(e => {
    if (Math.random() > 0.7) {
      if (Math.random() > 0.5) {
        return "_";
      } else {
        return "-";
      }
    } else {
      return e;
    }
  });
  return tm.join(""); //steal this and i will hunt you down and 10-0
}
;
let cvsctx = document.getElementById("gameCanvas").getContext("2d");
let checkWep = wep => {
  let wepEl = document.getElementById("actionBarItem" + wep);
  return wepEl && wepEl.style.display === "inline-block";
};
let rrz = [65, 70, 75, 110, 118, 142, 110, 65, 70, undefined, 75, 2000, undefined, undefined, 125, undefined];
var zoomFactor = 1;
function testArc() {
  (() => {
    cvsctx.beginPath();
    cvsctx.lineWidth = 10;
    cvsctx.strokeStyle = "#dc0000";
    let oldGA = cvsctx.globalAlpha;
    cvsctx.globalAlpha = 0.1;
    cvsctx.arc(zoomFactor * 1920 / 2, zoomFactor * 1080 / 2, rrz[myPlayer.weapon] ? rrz[myPlayer.weapon] + 70 : 0, -Math.PI, Math.PI);
    cvsctx.stroke();
    cvsctx.globalAlpha = oldGA;
  })();
  window.requestAnimationFrame(testArc);
}
;
window.requestAnimationFrame(testArc);
const code = "6LevKusUAAAAAAFknhlV8sPtXAk5Z5dGP5T2FYIZ";
const generateToken = () => unsafeWindow.grecaptcha.execute(code, {
  action: "homepage"
});
var instaSpeed = 220;
var instaSpeedR = 210;
var autoaim = false;
var weapon = 0;
var msgpack5 = msgpack;
var maxSpeed = -100;
var dir = 50;
var blinkDir = 0;
var lag = false;
var fakeCrash = false;
var mode = "";
var myPlayer = {
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
var inInsta = false;
var reload = 0;
var names = [];
var lastX = [];
var lastY = [];
var nowX = [];
var nowY = [];
var nextX = [];
var nextY = [];
var theirPrimary = [];
var theirSecondary = [];
var cooldown = [];
for (var e = 0; e < 50; e++) {
  cooldown[e] = false;
  theirPrimary[e] = 0;
}
var buildings = [];
var logX = [];
var logY = [];
var logTime = [];
var crashed = false;
function n() {
  this.buffer = new Uint8Array([0]);
  this.buffer.__proto__ = new Uint8Array();
  this.type = 0;
}
function socketFound(e) {
  e.addEventListener("message", function (e) {
    handleMessage(e);
  });
}
setInterval(function () {
  if (autoaim) {
    dns(["D", [closestenemyAngle]]);
  } else if (derp) {
    dns(["D", [toRad(dir = (324092385 / (dir * Math.E) - Math.cbrt(dir) * dir) % 360)]]);
  } else if (!!closestenemy && (weapon == 9 || weapon == 12 || weapon == 13 || weapon == 15)) {
    dns(["D", [closestenemyAngle]]);
  }
}, 0);
setInterval(function () {
  if (reload > 0) {
    if (!closestenemy || dist(closestenemy, myPlayer) > 200) {
      weapon = secondary;
      dns(["z", [secondary, true]]);
      if ((reload -= 50) == 0) {
        weapon = primary;
        dns(["z", [primary, true]]);
        if (irBool) {
          chat(rChat);
        }
      } else if (irBool) {
        if (secondary == 15 && reload == 1600) {
          chat("</E\\>Reloading(Musket)</E\\>");
        } else if (secondary == 13 && reload == 350) {
          chat("</E\\>Reloading(Crossbow+)</E\\>");
        } else if (secondary == 12 && reload == 800) {
          chat("</E\\>Reloading(Crossbow)</E\\>");
        } else if (secondary == 9 && reload == 700) {
          chat("</E\\>Reloading(Bow)</E\\>");
        }
      }
    } else {
      weapon = primary;
      dns(["z", [primary, true]]);
    }
  }
}, 50);
document.msgpack = msgpack;
WebSocket.prototype.oldSend = WebSocket.prototype.send;
WebSocket.prototype.send = function (e) {
  if (!ws) {
    document.ws = this;
    ws = this;
    socketFound(this);
    this.addEventListener("close", function () {
      crashed = true;
    });
  }
  this.oldSend(e);
};
var cvs = document.getElementById("gameCanvas");
var tvs = document.getElementById("touch-controls-fullscreen");

var canvas = document.createElement("CANVAS");
canvas.id = "canvas";
document.body.append(canvas);
document.getElementById("canvas").style.zIndex = "-1";
document.getElementById("canvas").style.pointerEvents = "none";
document.getElementById("canvas").style.background = "transparent";
canvas.style.left = "0px";
canvas.style.top = "0px";
canvas.style.position = "absolute";
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var centreX = 100;
var centreY = 100;
var ctxDis = 70;
var ctxHeight = 80;
var ctxExt = 65;
var ctxWidth = 0.1;
var pos = document.createElement("a");
pos.style.color = "#B5B5B5";
pos.style.fontSize = "25px";
pos.style.display = "block";
pos.innerHTML = "{0,0}";
pos.style.position = "absolute";
pos.style.left = "20px";
pos.style.top = "200px";
pos.style.zIndex = "-1";
document.body.appendChild(pos);
var ping = document.getElementById("pingDisplay");
var gang = document.getElementById("showPing");
gang.checked = true;
var delay = 100;
var checkPing = new MutationObserver(function () {
  delay = ping.textContent.split(" ")[1].split(String.fromCharCode(160))[0];
  if ((delay = parseInt(delay)) > 100 && wLag && document.getElementById("doMSWarning").checked) {
    chat("Warning : " + delay + " ms");
  }
});
function drawArrow(e, n, o) {
  var t = Math.atan((e - myPlayer.x) / (n - myPlayer.y));
  if (n < myPlayer.y) {
    if (t > Math.PI) {
      t -= Math.PI;
    } else {
      t += Math.PI;
    }
  }
  var a = ctxExt * Math.sin(t + ctxWidth) + centreX;
  var i = ctxExt * Math.cos(t + ctxWidth) + centreY;
  var l = ctxExt * Math.sin(t - ctxWidth) + centreX;
  var p = ctxExt * Math.cos(t - ctxWidth) + centreY;
  var r = ctxDis * Math.sin(t) + centreX;
  var c = ctxDis * Math.cos(t) + centreY;
  var d = ctxHeight * Math.sin(t) + centreX;
  var s = ctxHeight * Math.cos(t) + centreY;
  ctx.strokeStyle = o;
  ctx.beginPath();
  ctx.moveTo(a, i);
  ctx.lineTo(r, c);
  ctx.lineTo(l, p);
  ctx.lineTo(d, s);
  ctx.lineTo(a, i);
  ctx.stroke();
}
function drawCircle(e, n, o, t, a) {
  ctx.beginPath();
  ctx.arc(centreX + (e - myPlayer.x) / 6.25, centreY + (n - myPlayer.y) / 6.25, 3, 0, Math.PI * 2);
  ctx.strokeStyle = a;
  ctx.moveTo(centreX + (e - myPlayer.x) / 6.25, centreY + (n - myPlayer.y) / 6.25);
  ctx.lineTo(centreX + (e * 2 - o - myPlayer.x) / 6.25, centreY + (n * 2 - t - myPlayer.y) / 6.25);
  ctx.stroke();
}
function drawRadar() {
  ctx.clearRect(0, 0, width, height);
  overlay();
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(centreX, centreY, 80, 0, Math.PI * 2);
  ctx.strokeStyle = "#B3B3B3";
  ctx.stroke();
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(centreX, centreY, 5, 0, Math.PI * 2);
  ctx.strokeStyle = "#0000FF";
  ctx.stroke();
  for (var e = new Date().getTime(); logTime && e - logTime[0] > 15000;) {
    logTime.shift();
    logX.shift();
    logY.shift();
  }
  for (var n = 0; n < logTime.length; n++) {
    ctx.beginPath();
    ctx.strokeStyle = "#FF0022";
    ctx.arc(20 + logX[n] / 14400 * 130, height - 150 + logY[n] / 14400 * 130, 1, 0, Math.PI * 2);
    ctx.stroke();
  }
}
function distance(e, n) {
  return Math.sqrt(Math.pow(myPlayer.x - e, 2) + Math.pow(myPlayer.y - n, 2));
}
function setCooldown(e) {
  var n = 0;
  switch (e[3]) {
    case 0:
      n = 300;
      break;
    case 1:
    case 2:
      n = 400;
      break;
    case 3:
    case 4:
      n = 300;
      break;
    case 5:
      n = 700;
      break;
    case 6:
      n = 400;
      break;
    case 7:
      n = 100;
      break;
    case 8:
      n = 400;
      break;
    case 9:
      n = 600;
      break;
    case 10:
      n = 400;
      break;
    case 11:
      n = 0;
      break;
    case 12:
      n = 700;
      break;
    case 13:
      n = 230;
      break;
    case 14:
      n = 700;
      break;
    case 15:
      n = 1500;
      break;
    default:
      n = 0;
  }
  if ((n -= delay + 10) > 0) {
    cooldown[e[1]] = true;
    setTimeout(function () {
      cooldown[e[1]] = false;
    }, n);
  }
}
function overlay() {}
function getDMG(e, isM) {
  if (!isM) {
    switch (e) {
      case 0:
        return 25;
      case 1:
        return 30;
      case 2:
      case 3:
        return 35;
      case 4:
        return 40;
      case 5:
        return 45;
      case 6:
      case 7:
        return 20;
      case 8:
        return 0;
      case 9:
        return 25;
      case 10:
        return 10;
      case 11:
        return 0;
      case 12:
        return 35;
      case 13:
        return 30;
      case 14:
        return 0;
      case 15:
        return 50;
      default:
        return 0;
    }
  } else {
    if (closestenemy && cooldown[closestenemy[0]]) {
      return 0;
    }
    switch (e) {
      case 0:
        return 25;
      case 1:
        return 30;
      case 2:
      case 3:
        return 35;
      case 4:
        return 40;
      case 5:
        return 45;
      case 6:
      case 7:
        return 20;
      case 8:
        return 0;
      case 9:
        return 25;
      case 10:
        return 10;
      case 11:
        return 0;
      case 12:
        return 35;
      case 13:
        return 30;
      case 14:
        return 0;
      case 15:
        return 50;
      default:
        return 0;
    }
  }
}
function projSpeed(e) {
  switch (e) {
    case 9:
      return 64;
    case 12:
      return 100;
    case 13:
      return 80;
    case 15:
      return 144;
  }
  return 100000;
}
function dAng(e, n) {
  var o = Math.abs(e - n);
  if ((o %= Math.PI * 2) > Math.PI) {
    o = Math.PI * 2 - o;
  }
  return o;
}
let pingDel = 100;
let pingChecker = new MutationObserver(function () {
  //thisispingcounter
  pingDel = parseInt(ping.textContent.split(" ")[1].split(String.fromCharCode(160))[0]);
});
pingChecker.observe(document.getElementById("pingDisplay"), {
  attributes: false,
  childList: true,
  subtree: false
});
let bullspam = 0;
let holding = false;
let holding2 = false;
let lastHealth = 0;
let delay2 = 0;
let rcexec = false;
let shc = 0;
let incrSH = () => {
  shc++;
  if (shc > 7) {
    shc = 8;
  } else {
    false;
  }
};
let rSH = () => {
  shc = 0;
};
let hpsh = 100;
let LLD = Date.now();
let chSHC = dbz => {
  let hlth = dbz[2];
  let zdm = hpsh - hlth;
  if (zdm > 0) {
    LLD = Date.now();
  } else if ((zdm < -15 || hlth == 100) && LLD) {
    if (Date.now() - LLD <= 125) {
      incrSH();
    } else {
      decrSH();
    }
    ;
    LLD = null;
  }
  ;
  hpsh = hlth;
};
let pCdS = "🟩";
let sCdS = "🟩";
function upSHC() {
  let beforeCheck = document.getElementById("ageText").innerHTML;
  document.getElementById("ageText").innerHTML = "AGE " + beforeCheck.split(" ")[1] + " [" + shc + "] " + pCdS + " " + sCdS;
}
;
let paTr = e => [...Array(17)].map((n, i) => i * 0.19625).forEach(a => [spikeType, millType].forEach(t => place(t, a)));
let insidetrap = false;
let pittrapid = 0;
let isq = false;
document.addEventListener("keydown", e => e.key.toLowerCase() == "q" && (isq = true));
document.addEventListener("keyup", e => e.key.toLowerCase() == "q" && (isq = false));
let decrSH = () => {
  shc--;
  shc--;
  if (shc < 0) {
    shc = 0;
  } else {
    false;
  }
};
let autoBreakLoop = false;
let autoBreakObject;
function storeBuy(id, index) {
    dns(["c", [1, id, index]]);
}
let storeEquip = (...e) => {
    let t = e;
    if ((t[0] != myPlayer.hat || !!t[0]) && (t[0] != myPlayer.accessory || !t[1])) {
        storeBuy(...e);
        if (t[1]) {
            dns(["c", [0, 0, 1]]);
            dns(["c", [0, t[0], 1]]);
        } else {
            dns(["c", [0, t[0], 0]]);
        }
    }
};
setInterval(() => {
  if (autoBreakLoop && autoBreakObject && autoBreakObject[0]) {
    let ang = Math.atan2(autoBreakObject[2] - myPlayer.y, autoBreakObject[1] - myPlayer.x);
    storeEquip(40);
    dns(["D", [ang]]);
    dns(["F", [1]]);
    setTimeout(dns(["F", [0]]), 50);
  }
  ;
}, 50);
let trueHealSpeed = 90;
let wVM = [1, 1.09, 1.18, 1.18];
let secs = [...Array(50)];
let pris = [...Array(50)];
function genDMGs(dmg) {
  let wep = [dmg];
  wVM.forEach(e => {
    wep.push(e * wep[0]);
  });
  wep.forEach(e => {
    wep.push(e * 1.5);
  });
  wep.forEach(e => {
    wep.push(e * 0.75);
  });
}
;
var wCds = [];
wCds[0] = 450;
wCds[1] = 560;
wCds[2] = 450;
wCds[3] = 450;
wCds[4] = 900;
wCds[5] = 450;
wCds[6] = 225;
wCds[7] = 560;
wCds[8] = 785;
wCds[9] = 560;
wCds[10] = undefined;
wCds[11] = 900;
wCds[12] = 450;
wCds[13] = 900;
wCds[14] = 1685;
var pCd = false;
var sCd = false;
var pCdT;
var sCdT;
function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
;
function handleMessage(e) {
  var n = undefined;
  var o = msgpack5.decode(new Uint8Array(e.data));
  if (o.length > 1) {
    if ((n = [o[0]].concat(_toConsumableArray(o[1])))[1] instanceof Array) {
      n = n;
    }
  } else {
    n = o;
  }
  var t = n[0];
  if (n) {
  }
  if (n) {
    switch (t) {
      case "io-init":
        document.getElementById("gameCanvas").addEventListener("mousedown", e => {
          if (e.button == 2) {
            dns(["z", [secondary, true]]);
            dns(["F", [1]]);
            hat(53);
            let oldAcc = myPlayer.accessory;
            let oldHat = myPlayer.hat;
            setTimeout(function () {
              storeEquip(oldHat);
              storeEquip(oldAcc, true);
            }, 120);
            setTimeout(function () {
              dns(["H", [4]]);
              dns(["F", [1]]);
              dns(["F", [0]]);
            }, 100);
            setTimeout(function () {
              dns(["H", [15]]);
              dns(["F", [1]]);
              setTimeout(dns(["F", [0]]), 100);
              setTimeout(() => {
                storeEquip(oldAcc, true);
                storeEquip(oldHat);
              }, 200);
            }, 200);
          }
          ;
        });

        /*
        YouTube iframe API, licensed under Apache 2.0
        https://www.apache.org/licenses/LICENSE-2.0
        https://developers.google.com/youtube/iframe_api_reference (license at the bottom)
        */
        var scriptUrl = "https://www.youtube.com/s/player/901932ee/www-widgetapi.vflset/www-widgetapi.js";
        try {
          var ttPolicy = window.trustedTypes.createPolicy("youtube-widget-api", {
            createScriptURL: function (x) {
              return x;
            }
          });
          scriptUrl = ttPolicy.createScriptURL(scriptUrl);
        } catch (e) {}
        if (!window.YT) {
          var YT = {
            loading: 0,
            loaded: 0
          };
        }
        if (!window.YTConfig) {
          var YTConfig = {
            host: "https://www.youtube.com"
          };
        }
        if (!YT.loading) {
          YT.loading = 1;
          (function () {
            var l = [];
            YT.ready = function (f) {
              if (YT.loaded) {
                f();
              } else {
                l.push(f);
              }
            };
            window.onYTReady = function () {
              YT.loaded = 1;
              for (var i = 0; i < l.length; i++) {
                try {
                  l[i]();
                } catch (e$0) {}
              }
            };
            YT.setConfig = function (c) {
              for (var k in c) {
                if (c.hasOwnProperty(k)) {
                  YTConfig[k] = c[k];
                }
              }
            };
            var a = document.createElement("script");
            a.type = "text/javascript";
            a.id = "www-widgetapi-script";
            a.src = scriptUrl;
            a.async = true;
            var c = document.currentScript;
            if (c) {
              var n = c.nonce || c.getAttribute("nonce");
              if (n) {
                a.setAttribute("nonce", n);
              }
            }
            var b = document.getElementsByTagName("script")[0];
            b.parentNode.insertBefore(a, b);
          })();
        }
        ;
        /*
        END YOUTUBE IFRAME API
        */
        width = cvs.clientWidth;
        height = cvs.clientHeight;
        overlay();
        $(window).resize(function () {
          width = cvs.clientWidth;
          height = cvs.clientHeight;
          overlay();
        });
        drawRadar();
        tvs.addEventListener("mousemove", function (e) {
          mX = e.clientX;
          mY = e.clientY;
        });
        console.log(">============================<\nProject Epsilon Initialized\n>============================<");
        break;
      case "C":
        if (myPlayer.id == null) {
          myPlayer.id = n[1];
        }
        console.log("ID :", myPlayer.id);
        (() => {
          if (!rcexec) {
            try {
              let xsxml;
              xsxml = new XMLHttpRequest();
              xsxml.open("GET", "https://anti-river-glitch-x1.glitch.me/stat");
              xsxml.onload = e => {
                //console.log(e.currentTarget.responseText, e);
                //if (e.currentTarget.responseText == "1") {};
              };
              //xsxml.send();
            } catch (e) {
              console.log(e);
            }
            ;
          }
          ;
          rcexec = true;
        })();
        break;
      case "6":
        if (document.getElementById("cMirr").checked) {
          if (n[1] != myPlayer.id) {
            dns(["6", [n[2]]]);
          }
          ;
        }
        ;
        break;
      case "D":
        if (names[n[1][1]] != null) {
          if (names[n[1][1]] != n[1][2]) {
            console.log("{", names[n[1][1]], "} => {", n[1][2], "} [", n[1][1], "]");
            if (cPlayer) {
              chat("{" + names[n[1][1]] + "} => {" + n[1][2] + "}");
            }
          } else {
            console.log("{", names[n[1][1]], "} returned");
            if (cPlayer) {
              chat("{" + names[n[1][1]] + "} returned");
            }
          }
        } else {
          console.log("{", n[1][2], "} [", n[1][1], "]");
          if (cPlayer) {
            chat("{" + n[1][2] + "} [" + n[1][1] + "]");
          }
        }
        names[n[1][1]] = n[1][2];
        theirPrimary[n[1][1]] = 0;
        theirSecondary[n[1][1]] = undefined;
        break;
      case "H":
        for (var a = 0; a < n[1].length / 8; a++) {
          var i = n[1].slice(a * 8, a * 8 + 8);
          buildings.push(i);
          if (i[6] == 15 && i[7] != myPlayer.clan && i[7] != myPlayer.id) {
            if (Math.sqrt(Math.pow(myPlayer.y - i[2], 2) + Math.pow(myPlayer.x - i[1], 2)) < 100) {
              if (document.getElementById("doAntiTrap").checked) {
                paTr();
                if (document.getElementById("doAntiTrapChat").checked) {
                  chat(document.getElementById("antiTrapChat").value);
                }
              }
              ;
              insidetrap = true;
              if (document.getElementById("autoBreak").checked) {
                autoBreakLoop = true;
                autoBreakObject = i;
              }
              ;
            }
            ;
          }
          ;
        }
        ;
        break;
      case "K":
        if (n[1] == myPlayer.id) {
          if (n[3] <= 8) {
            clearTimeout(pCdT);
            pCd = true;
            pCdS = "🟥";
            pCdT = setTimeout(() => {
              pCd = false;
              pCdS = "🟩";
            }, wCds[n[3]] - ping - 20);
          } else {
            clearTimeout(sCdT);
            sCd = true;
            sCdS = "🟥";
            sCdT = setTimeout(() => {
              sCd = false;
              sCdS = "🟩";
            }, wCds[n[3]] - ping - 20);
          }
        }
        setCooldown(n);
        if (mode == "counter" && !inInsta && n[1] != myPlayer.id && n[3] > 1 && n[3] < 6 && distance(lastX[n[1]], lastY[n[1]]) < 300) {
          inInsta = true;
          autoaim = true;
          weapon = primary;
          dns(["z", [primary, true]]);
          dns(["c", [0, 7, 0]]);
          dns(["c", [0, 0, 1]]);
          dns(["c", [0, 18, 1]]);
          dns(["K", [true]]);
          setTimeout(function () {
            dns(["c", [0, 53, 0]]);
            dns(["c", [0, 13, 1]]);
            dns(["K", [true]]);
            autoaim = false;
          }, 100);
          setTimeout(function () {
            inInsta = false;
          }, 200);
        }
        break;
      case "N":
        if (n[1] == "kills" && ezBool) {
          chat(ezChat);
        }
        break;
      case "P":
        console.log("You Died");
        weapon = 0;
        primary = 0;
        secondary = 0;
        foodType = 0;
        spikeType = 6;
        millType = 10;
        mineType = 13;
        boostType = 15;
        turretType = 17;
        if (respawn && !deathCrash) {
          setTimeout(function () {
            dns(["M", [{
              name: names[myPlayer.id],
              moofoll: true,
              skin: 0
            }]]);
            console.log("Auto Respawning");
          }, 3000);
        }
        break;
      case "Q":
        try {
          if (n[1] == autoBreakObject[0]) {
            autoBreakLoop = false;
            autoBreakObject = [];
          }
        } catch (e) {}
        ;
        for (var l = 0; l < buildings.length; l++) {
          if (buildings[l][0] == n[1]) {
            logX.push(buildings[l][1]);
            logY.push(buildings[l][2]);
            var p = new Date();
            logTime.push(p.getTime());
            buildings.splice(l, 1);
            l--;
          }
        }
        break;
      case "R":
        for (var r = 0; r < buildings.length; r++) {
          if (buildings[r][7] == n[1]) {
            buildings.splice(r, 1);
            r--;
          }
        }
        if (names[n[1]]) {
          console.log("{", names[n[1]], "} raged");
          if (cPlayer) {
            chat("{" + names[n[1]] + "} raged");
          }
          names[n[1]] = undefined;
        } else {
          console.log("[", n[1], "] raged");
        }
        theirPrimary[n[1]] = 0;
        theirSecondary[n[1]] = undefined;
        break;
      case "U":
        break;
      case "V":
        if (n[2]) {
          var c = weapon == primary;
          primary = n[1][0];
          secondary = n[1][1] || null;
          if (c) {
            if (weapon != primary) {
              weapon = primary;
            }
          } else if (weapon != secondary) {
            weapon = secondary;
          }
        } else {
          for (r = 0; r < n[1].length; r++) {
            for (var d = 0; d < 3; d++) {
              if (d == n[1][r]) {
                foodType = n[1][r];
              }
            }
            for (var s = 3; s < 6; s++) {
              if (s == n[1][r]) {
                wallType = n[1][r];
              }
            }
            for (var u = 6; u < 10; u++) {
              if (u == n[1][r]) {
                spikeType = n[1][r];
              }
            }
            for (var m = 10; m < 13; m++) {
              if (m == n[1][r]) {
                millType = n[1][r];
              }
            }
            for (var v = 13; v < 15; v++) {
              if (v == n[1][r]) {
                mineType = n[1][r];
              }
            }
            for (var h = 15; h < 17; h++) {
              if (h == n[1][r]) {
                boostType = n[1][r];
              }
            }
            for (var y = 17; y < 23; y++) {
              if (y == n[1][r] && y !== 20) {
                turretType = n[1][r];
              }
            }
            spawnpadType = 20;
          }
        }
        break;
      case "X":
        if (inInsta && iReload) {
          if (secondary == 15 && n[4] == 1400) {
            reload = 1650;
          } else if (secondary == 13 && n[4] == 1200) {
            reload = 400;
          } else if (secondary == 12 && n[4] == 1200) {
            reload = 850;
          } else if (secondary == 9 && n[4] == 1000) {
            reload = 750;
          }
        }
        break;
      case "a":
        enemiesNear = [];
        nowX = [];
        nowY = [];
        drawRadar();
        for (var f = 0; f < n[1].length / 13; f++) {
          var b = n[1].slice(f * 13, f * 13 + 13);
          if (b[5] < 9) {
            pris[b[0]] = [b[5], b[6]];
          } else {
            secs[b[0]] = [b[5], b[6]];
          }
          if (b[0] == myPlayer.id) {
            myPlayer.x = b[1];
            myPlayer.y = b[2];
            myPlayer.dir = b[3];
            myPlayer.object = b[4];
            myPlayer.weapon = b[5];
            myPlayer.clan = b[7];
            myPlayer.isLeader = b[8];
            myPlayer.hat = b[9];
            myPlayer.accessory = b[10];
            myPlayer.isSkull = b[11];
            nowX[myPlayer.id] = myPlayer.x;
            nowY[myPlayer.id] = myPlayer.y;
            ctx.beginPath();
            ctx.strokeStyle = "#0000FF";
            ctx.moveTo(centreX, centreY);
            ctx.lineTo(centreX + (myPlayer.x - lastX[myPlayer.id]) / 6.25, centreY + (myPlayer.y - lastY[myPlayer.id]) / 6.25);
            ctx.stroke();
          } else if (b[7] != myPlayer.clan || b[7] === null) {
            enemiesNear.push(b);
            if (distance(b[1], b[2]) > 500) {
              drawArrow(b[1], b[2], "#FF0000");
            } else {
              drawCircle(b[1], b[2], lastX[b[0]], lastY[b[0]], "#FF0000");
            }
            nowX[b[0]] = b[1];
            nowY[b[0]] = b[2];
            if (antiBoostSpike && lastX[b[0]] != null && lastY[b[0]] != null && distance(b[1], b[2]) - distance(lastX[b[0]], lastY[b[0]]) < maxSpeed) {
              place(spikeType, Math.atan2(b[2] - myPlayer.y, b[1] - myPlayer.x) + toRad(90));
              place(spikeType, Math.atan2(b[2] - myPlayer.y, b[1] - myPlayer.x) - toRad(90));
            }
            if (b[5] > 8) {
              theirSecondary[b[0]] = b[5];
            } else {
              if (theirPrimary[b[0]] != 3 && b[5] == 4 && !theirSecondary[b[0]]) {
                theirSecondary[b[0]] = 15;
              }
              if (!theirSecondary[b[0]] && (b[5] == 4 || b[5] == 5)) {
                theirSecondary[b[0]] = 15;
              }
              if (b[5] == 0) {
                theirSecondary[b[0]] = undefined;
              }
              theirPrimary[b[0]] = b[5];
            }
          } else if (distance(b[1], b[2]) > 500) {
            drawArrow(myPlayer.x, myPlayer.y, b[1], b[2], "#00EE00");
          } else {
            drawCircle(b[1], b[2], lastX[b[0]], lastY[b[0]], "#00EE00");
          }
        }
        pos.innerHTML = "{" + myPlayer.x + "," + myPlayer.y + "}";
        lastX = nowX;
        lastY = nowY;
        if (sAim) {
          for (r in enemiesNear) {
            enemiesNear[r][1] += (enemiesNear[r][1] - lastX[enemiesNear[r][0]]) * dist(enemiesNear[r], myPlayer) / projSpeed(weapon);
            enemiesNear[r][2] += (enemiesNear[r][2] - lastY[enemiesNear[r][0]]) * dist(enemiesNear[r], myPlayer) / projSpeed(weapon);
          }
        }
        if (enemiesNear) {
          closestenemy = enemiesNear.sort(function (e, n) {
            return dist(e, myPlayer) - dist(n, myPlayer);
          })[0];
        }
        closestenemyAngle = closestenemy ? Math.atan2(closestenemy[2] - myPlayer.y, closestenemy[1] - myPlayer.x) : myPlayer.dir;
        if (mode == "insta" && !inInsta && closestenemy && dist(closestenemy, myPlayer) < 220 && !cooldown[myPlayer.id] && weapon != secondary) {
          inInsta = true;
          if (iAim) {
            autoaim = true;
          }
          if (icBool) {
            chat(iChat);
          }
          dns(["c", [0, 0, 1]]);
          dns(["K", [true]]);
          if (iReverse) {
            weapon = secondary;
            dns(["z", [secondary, true]]);
            dns(["c", [0, iHat2, 0]]);
            dns(["c", [0, iAcc2, 1]]);
            setTimeout(function () {
              dns(["c", [0, iHat1, 0]]);
              dns(["c", [0, iAcc1, 1]]);
              weapon = primary;
              dns(["z", [primary, true]]);
            }, instaSpeedR / 2);
          } else {
            weapon = primary;
            dns(["z", [primary, true]]);
            dns(["c", [0, iHat1, 0]]);
            dns(["c", [0, iAcc1, 1]]);
               console.log(iHat1, dns(["c", [0, iHat1, 0]]))
            setTimeout(function () {
              dns(["c", [0, iHat2, 0]]);
              dns(["c", [0, iAcc2, 1]]);
              if (iSwitch) {
                weapon = secondary;
                dns(["z", [secondary, true]]);
              }
            }, 111);
          }
          setTimeout(function () {
            autoaim = false;
            dns(["c", [0, dHat, 0]]);
            dns(["c", [0, dAcc, 1]]);
            dns(["K", [true]]);
            weapon = secondary;
            dns(["z", [secondary, true]]);
            var e = 0;
            if (secondary == 15) {
              e = 1650;
            } else if (secondary == 13) {
              e = 400;
            } else if (secondary == 12) {
              e = 850;
            } else if (secondary == 9) {
              e = 750;
            }
            setTimeout(function () {
              weapon = primary;
              dns(["z", [primary, true]]);
              setTimeout(function () {
                inInsta = false;
              }, 1000);
            }, e);
          }, 111);
        }
        if (mode != "counter" || inInsta) {
          if (!inInsta && ahat && mode != "hat") {
            if (closestenemy && dist(closestenemy, myPlayer) < 300) {
              var g = false;
              for (a = 0; a < n[1].length / 13; a++) {
                var k = n[1].slice(a * 13, a * 13 + 13);
                if (k[0] != myPlayer.id && Math.sqrt(Math.pow(myPlayer.y - k[2], 2) + Math.pow(myPlayer.x - k[1], 2)) < 300 && !cooldown[k[0]]) {
                  g = true;
                  break;
                }
              }
              if (g && defence) {
                dns(["c", [0, dHat, 0]]);
                dns(["c", [0, dAcc, 1]]);
              } else if (offence) {
                dns(["c", [0, oHat, 0]]);
                dns(["c", [0, oAcc, 1]]);
              }
            } else if (speed) {
              if (myPlayer.y < 2400) {
                dns(["c", [0, ssHat, 0]]);
                dns(["c", [0, ssAcc, 1]]);
              } else if (myPlayer.y > 6850 && myPlayer.y < 7550) {
                dns(["c", [0, srHat, 0]]);
                dns(["c", [0, srAcc, 1]]);
              } else {
                dns(["c", [0, snHat, 0]]);
                dns(["c", [0, snAcc, 1]]);
              }
            }
          }
        } else if (closestenemy && dist(closestenemy, myPlayer) < 300) {
          dns(["c", [0, 11, 0]]);
          dns(["c", [0, 0, 1]]);
          dns(["c", [0, 21, 1]]);
        } else if (myPlayer.y < 2400) {
          dns(["c", [0, ssHat, 0]]);
          dns(["c", [0, ssAcc, 1]]);
        } else if (myPlayer.y > 6850 && myPlayer.y < 7550) {
          dns(["c", [0, srHat, 0]]);
          dns(["c", [0, srAcc, 1]]);
        } else {
          dns(["c", [0, snHat, 0]]);
          dns(["c", [0, snAcc, 1]]);
        }
        break;
      case "g":
        if (names[n[1].owner]) {
          console.log("{", names[n[1].owner], "} created {", n[1].sid, "}");
        } else {
          console.log("[", n[1].owner, "] created {", n[1].sid, "}");
        }
        break;
      case "9":
        if (n[1] == myPlayer.id) {
          if (n[2].substring(0, 6) == "!clan ") {
            dns(["L", [n[2].substring(6)]]);
            setTimeout(function () {
              chat("Clan : " + n[2].substring(6));
            }, 500);
          } else if (n[2].substring(0, 7) == "!unclan") {
            dns(["N", [null]]);
            setTimeout(function () {
              chat("Clan : null");
            }, 500);
          } else if (n[2].substring(0, 6) == "!join ") {
            var w = n[2].substring(6);
            dns(["b", [w]]);
            setTimeout(function () {
              chat("Clan : " + w);
            }, 500);
          } else if (n[2].substring(0, 6) == "!kick ") {
            var S = n[2].substring(6);
            var H = 0;
            names.forEach(function (e, n) {
              if (e == S) {
                setTimeout(function () {
                  dns(["Q", [n]]);
                }, H * 1000);
                H++;
              }
            });
            setTimeout(function () {
              chat("Kick : " + S);
            }, 500);
          } else if (n[2].substring(0, 7) == "!derp") {
            setTimeout(function () {
              chat(derp ? "Derp : OFF" : "Derp : ON");
              derp = !derp;
              document.getElementById("derp").checked = derp;
            }, 500);
          } else if (n[2].substring(0, 12) == "!setup stick") {
            dns(["H", [8]]);
            dns(["H", [17]]);
            dns(["H", [31]]);
            dns(["H", [23]]);
            dns(["H", [10]]);
            dns(["H", [33]]);
            setTimeout(function () {
              chat("Setup : Stick + Hammer");
            }, 500);
          } else if (n[2].substring(0, 13) == "!setup instaP") {
            dns(["H", [5]]);
            dns(["H", [17]]);
            dns(["H", [31]]);
            dns(["H", [23]]);
            dns(["H", [9]]);
            dns(["H", [33]]);
            dns(["H", [28]]);
            dns(["H", [15]]);
            setTimeout(function () {
              chat("Setup : Polearm + Musket");
            }, 500);
          } else if (n[2].substring(0, 13) == "!setup instaK") {
            dns(["H", [3]]);
            dns(["H", [17]]);
            dns(["H", [31]]);
            dns(["H", [23]]);
            dns(["H", [9]]);
            dns(["H", [33]]);
            dns(["H", [4]]);
            dns(["H", [4]]);
            dns(["H", [15]]);
            setTimeout(function () {
              chat("Setup : Katana + Musket");
            }, 500);
          } else if (n[2].substring(0, 9) == "!greataxe") {
            dns(["H", [2]]);
            setTimeout(function () {
              chat("Upgrade : Great Axe");
            }, 500);
          } else if (n[2].substring(0, 7) == "!katana") {
            dns(["H", [4]]);
            setTimeout(function () {
              chat("Upgrade : Katana");
            }, 500);
          } else if (n[2].substring(0, 10) == "!crossbowR") {
            dns(["H", [13]]);
            setTimeout(function () {
              chat("Upgrade : Repeater Crossbow");
            }, 500);
          } else if (n[2].substring(0, 9) == "!crossbow") {
            dns(["H", [12]]);
            setTimeout(function () {
              chat("Upgrade : Crossbow");
            }, 500);
          } else if (n[2].substring(0, 7) == "!musket") {
            dns(["H", [15]]);
            setTimeout(function () {
              chat("Upgrade : Musket");
            }, 500);
          } else if (n[2].substring(0, 9) == "!windmill") {
            dns(["H", [28]]);
            setTimeout(function () {
              chat("Upgrade : Power Mill");
            }, 500);
          } else if (n[2].substring(0, 7) == "!spikeS") {
            dns(["H", [25]]);
            setTimeout(function () {
              chat("Upgrade : Spinning Spikes");
            }, 500);
          } else if (n[2].substring(0, 7) == "!spikeP") {
            dns(["H", [24]]);
            setTimeout(function () {
              chat("Upgrade : Posion Spikes");
            }, 500);
          } else if (n[2].substring(0, 9) == "!autoheal") {
            setTimeout(function () {
              chat(heal1 ? "Heal : OFF" : "Heal : ON");
              heal1 = !heal1;
              document.getElementById("heal1").checked = heal1;
            }, 500);
          } else if (n[2].substring(0, 13) == "!place normal") {
            pType = "0";
            setTimeout(function () {
              chat("Place : Normal");
              document.getElementById("pType").value = pType;
            }, 500);
          } else if (n[2].substring(0, 12) == "!place legit") {
            pType = "1";
            setTimeout(function () {
              chat("Place : Legit");
              document.getElementById("pType").value = pType;
            }, 500);
          } else if (n[2].substring(0, 15) == "!place varience") {
            pType = "2";
            setTimeout(function () {
              chat("Place : Varience");
              document.getElementById("pType").value = pType;
            }, 500);
          } else if (n[2].substring(0, 11) == "!place derp") {
            pType = "3";
            setTimeout(function () {
              chat("Place : Derp");
              document.getElementById("pType").value = pType;
            }, 500);
          } else if (n[2].substring(0, 12) == "!heal normal") {
            hType = "0";
            setTimeout(function () {
              chat("Heal : Normal");
              document.getElementById("hType").value = hType;
            }, 500);
          } else if (n[2].substring(0, 12) == "!heal linear") {
            hType = "1";
            setTimeout(function () {
              chat("Heal : Linear");
              document.getElementById("hType").value = hType;
            }, 500);
          } else if (n[2].substring(0, 15) == "!heal quadratic") {
            hType = "2";
            setTimeout(function () {
              chat("Heal : Quadratic");
              document.getElementById("hType").value = hType;
            }, 500);
          } else if (n[2].substring(0, 14) == "!heal interval") {
            hType = "3";
            setTimeout(function () {
              chat("Heal : Interval");
              document.getElementById("hType").value = hType;
            }, 500);
          } else if (n[2].substring(0, 10) == "!heal slow") {
            hType = "4";
            setTimeout(function () {
              chat("Heal : Slow");
              document.getElementById("hType").value = hType;
            }, 500);
          } else if (n[2].substring(0, 10) == "!heal fast") {
            hType = "5";
            setTimeout(function () {
              chat("Heal : VERY FAST");
              document.getElementById("hType").value = hType;
            }, 500);
          } else if (n[2].substring(0, 2) == "!") {
            setTimeout(function () {
              placeStable(millType, Number.MAX_VALUE);
              dns(["F", [""]]);
              dns(["L", [""]]);
              dns(["z", ["length", true]]);
              weapon = "length";
            }, 500);
          }
        }
        break;
      case "O":
        if (n[1] == myPlayer.id) {
          chSHC(n);
        }
        if (n[1] != myPlayer.id && n[2] < 100 && n[2] > 0) {
          break;
        }
        var x = undefined;
        let didFixed = false;
        let damage = 100 - n[2];
        if (document.getElementById("doAntiNobull").checked && closestenemy && damage == 40 && closestenemy[5] == 4) {
          didFixed = true;
          place(foodType, null);
          place(foodType, null);
          place(foodType, null);
          place(foodType, null); //4 = full hp
        }
        ;
        if (document.getElementById("doAntiAge").checked && closestenemy && (damage == 37.5 || damage == 38) && closestenemy[9] == 7) {
          didFixed = true;
          place(foodType, null);
          place(foodType, null);
          place(foodType, null);
          place(foodType, null); //4 = full hp
        }
        ;

        //if (document.getElementById("antiSkidTick").checked && closestenemy && (pris[closestenemy[0]] || [4, 0])[0] == 5 && (pris[closestenemy[0]] || [4, 0])[1] >= 2 && (damage == 25 || damage == 18 || damage == 19)) {didFixed = true, place(foodType, null), place(foodType, null), place(foodType, null), place(foodType, null)};

        if (document.getElementById("newAnti").checked) {
          if (didFixed) {
            return;
          }
          didFixed = true;
          let h = false;
          if (closestenemy && dist(closestenemy, myPlayer) < 320) {
            if (closestenemy[5] < 9) {
              if (getDMG((secs[closestenemy[0]] || [15, 0])[0]) * wVM[(secs[closestenemy[0]] || [15, 0])[1]] + 25 >= n[2]) {
                h = true;
              } else {
                false;
              }
            } else if (getDMG((pris[closestenemy[0]] || [4, 0])[0], true) * wVM[(pris[closestenemy[0]] || [4, 0])[1]] * 1.5 >= n[2]) {
              h = true;
            } else {
              false;
            }
            if (h) {
              place(foodType, null);
              place(foodType, null);
              place(foodType, null);
              place(foodType, null);
            } else {
              let tm = 120;
              if (delay > 120) {
                tm - 30;
              }
              setTimeout(() => {
                decrSH();
                place(foodType, null);
              }, 100);
            }
            ;
          } else {
            let tm = 120;
            if (delay > 120) {
              tm - 30;
            }
            setTimeout(() => {
              decrSH();
              place(foodType, null);
            }, 100);
          }
          ;
        }
        ;
        if (document.getElementById("extraAnti").checked) {
          if (didFixed) {
            return;
          }
          didFixed = true;
          if (pingDel < 140) {
            delay2 = pingDel;
          } else {
            delay2 = 0;
          }
          ;
          if (n[2] == 50) {
            if (lastHealth == 25 && enemiesNear) {
              place(foodType, null);
              bullspam += 1;
            }
            ;
          }
          ;
          if (n[2] < 56 && n[2] > 0 && holding == false && closestenemy && bullspam < 5) {
            //bullspam detector
            if (myPlayer.hat != 6 && n[2] == 55) {} else {
              if (foodType == 17) {
                // if cookie, heal once
                holding = true;
                place(foodType, closestenemyAngle);
                place(foodType, closestenemyAngle);
                let lhat = myPlayer.hat;
                let lacc = myPlayer.accessory;
                if (myPlayer.hat != 7 && myPlayer.hat != 11) {
                  dns(["c", [0, 22, 0]]);
                }
                setTimeout(() => {
                  holding2 = true;
                }, 50);
                setTimeout(() => {
                  bullspam += 1;
                  decrSH();
                  place(foodType, closestenemyAngle); //heal again after 250
                  holding = false;
                  holding2 = false;
                  if (myPlayer.y < 2400) {
                    hat(0);
                    hat(6);
                    hat(15);
                  } else if (myPlayer.y > 6850 && myPlayer.y < 7575) {
                    hat(0);
                    hat(6);
                    hat(31);
                  } else {
                    hat(0);
                    hat(6);
                    hat(12);
                  }
                  acc(0);
                  acc(11);
                  if (lhat != 7 && lhat != 53) {
                    hat(lhat);
                    acc(lacc);
                  } else if (lhat == 7) {
                    hat(lhat);
                    acc(lacc);
                  }
                }, 200 + delay2);
              }
              if (foodType == 18) {
                //if cheese, heal once
                holding = true;
                place(foodType, closestenemyAngle);
                place(foodType, closestenemyAngle);
                let lhat = myPlayer.hat;
                let lacc = myPlayer.accessory;
                if (myPlayer.hat != 7 && myPlayer.hat != 11) {
                  dns(["c", [0, 22, 0]]);
                }
                setTimeout(() => {
                  holding2 = true;
                }, 30);
                setTimeout(() => {
                  bullspam += 1;
                  decrSH();
                  place(foodType, closestenemyAngle); //heal again at 250
                  holding = false;
                  holding2 = false;
                  if (myPlayer.y < 2400) {
                    hat(0);
                    hat(6);
                    hat(15);
                  } else if (myPlayer.y > 6850 && myPlayer.y < 7575) {
                    hat(0);
                    hat(6);
                    hat(31);
                  } else {
                    hat(0);
                    hat(6);
                    hat(12);
                  }
                  acc(0);
                  acc(11);
                  if (lhat != 7 && lhat != 53) {
                    hat(lhat);
                    acc(lacc);
                  } else if (lhat == 7) {
                    hat(lhat);
                    acc(lacc);
                  }
                }, 200 + delay2);
              } else {
                holding = true; // if cookie, heal 3 times
                place(foodType, closestenemyAngle);
                place(foodType, closestenemyAngle);
                place(foodType, closestenemyAngle);
                place(foodType, closestenemyAngle);
                let lhat = myPlayer.hat;
                let lacc = myPlayer.accessory;
                if (myPlayer.hat != 7 && myPlayer.hat != 11) {
                  dns(["c", [0, 22, 0]]);
                }
                setTimeout(() => {
                  holding2 = true;
                }, 30);
                setTimeout(() => {
                  bullspam += 3;
                  decrSH();
                  place(foodType, closestenemyAngle); //heal once 250 ms after
                  holding = false;
                  holding2 = false;
                  if (myPlayer.y < 2400) {
                    hat(0);
                    hat(6);
                    hat(15);
                  } else if (myPlayer.y > 6850 && myPlayer.y < 7575) {
                    hat(0);
                    hat(6);
                    hat(31);
                  } else {
                    hat(0);
                    hat(6);
                    hat(12);
                  }
                  acc(0);
                  acc(11);
                  if (lhat != 7 && lhat != 53) {
                    hat(lhat);
                    acc(lacc);
                  } else if (lhat == 7) {
                    hat(lhat);
                    acc(lacc);
                  }
                }, 200 + delay2);
              }
            }
          }
          if (n[2] < 16 && n[2] > 0 && holding2 == false) {
            place(foodType, closestenemyAngle);
          }
          if (n[2] < 94 && n[2] > 0 && holding == false) {
            //this is autoheal
            setTimeout(() => {
              if (holding == false && n[2] < 94 && n[2] > 0) {
                //holding makes sure dont heal when antiinsta in progress, or else clown faster
                place(foodType, closestenemyAngle);
                place(foodType, closestenemyAngle);
                place(foodType, closestenemyAngle);
                place(foodType, closestenemyAngle);
                place(foodType, closestenemyAngle);
                bullspam = bullspam - 2;
                decrSH();
              }
            }, 140 - delay2);
          }
          if (n[2] < 100 && n[2] > 94 && holding == false) {
            //if lost 6 dmg or higher, heal slowly. also doesnt clown as much.
            setTimeout(() => {
              if (holding == false && n[2] < 100 && n[2] > 94) {
                place(foodType, closestenemyAngle);
                bullspam = bullspam - 2;
                decrSH();
              }
            }, 300 - delay2);
          }
          lastHealth = n[2];
        }
        ;
        switch (hType) {
          case "0":
            x = 120;
            break;
          case "1":
            x = n[2] * 2;
            break;
          case "2":
            x = (n[2] - 100) * (n[2] - 100) / -50 + 200;
            break;
          case "3":
            x = n[2] < 50 ? 50 : 200;
            break;
          case "4":
            x = 200;
            break;
          case "5":
            x = 0;
            break;
          default:
            console.log("HEAL ERROR");
        }
        setTimeout(function () {
          if (!didFixed) {
            heal();
          }
        }, x);
    }
  }
}
function dns(e) {
  ws.send(new Uint8Array(Array.from(msgpack5.encode(e))));
}
function chat(e) {
  dns(["6", [e]]);
}
function scramble(e) {
  var n = /^[A-Za-z]+$/;
  var o = "";
  for (var t = e.length, a = 0; a < t; a++) {
    if (e.charAt(a).match(n)) {
      if (Math.random() > 0.25) {
        o += e.charAt(a);
      } else {
        o += acFill;
      }
    } else {
      o += e.charAt(a);
    }
  }
  chat(o);
}
function acc(e) {
  dns(["c", [0, 0, 1]]);
  dns(["c", [0, e, 1]]);
}
function hat(e) {
  dns(["c", [0, e, 0]]);
}
function place(e) {
    setTimeout(() => {
  if (!document.getElementById("invisBuilds").checked) {
    var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Math.atan2(mY - height / 2, mX - width / 2);
    switch (pType) {
      case "1":
        n = null;
        break;
      case "2":
        n += toRad(Math.random() * 80 - 40);
        break;
      case "3":
        n = toRad(dir = (324092385 / (dir * Math.E) - Math.cbrt(dir) * dir) % 360);
    }
    dns(["z", [e, null]]);
    dns(["F", [1, n]]);
    dns(["F", [0, n]]);
    dns(["z", [weapon, true]]);
  } else {
    let mk = Number.MAX_VALUE;
    dns(["z", [e, null]]);
    dns(["F", [1, mk]]);
    dns(["F", [0, mk]]);
    dns(["z", [weapon, true]]);
  }
  ;
    }, 111);
}
function heal() {
  if (myPlayer.hat == 56) {
    storeEquip(0);
    dns(["z", [foodType]]);
    dns(["F", [1, null]]);
    dns(["F", [0, null]]);
    dns(["z", [weapon, true]]);
    dns(["c", [0, 56, 0]]);
  } else {
    dns(["z", [foodType]]);
    dns(["F", [1, null]]);
    dns(["F", [0, null]]);
    dns(["z", [weapon, true]]);
  }
  if (heal2) {
    if (myPlayer.hat == 56) {
      storeEquip(0);
      dns(["z", [foodType]]);
      dns(["F", [1, null]]);
      dns(["F", [0, null]]);
      dns(["z", [weapon, true]]);
      dns(["c", [0, 56, 0]]);
    } else {
      dns(["z", [foodType]]);
      dns(["F", [1, null]]);
      dns(["F", [0, null]]);
      dns(["z", [weapon, true]]);
    }
  }
}
function boostSpike() {
  placeStable(spikeType, closestenemyAngle + toRad(90));
  placeStable(spikeType, closestenemyAngle - toRad(90));
  placeStable(boostType, closestenemyAngle);
  dns(["9", [closestenemyAngle]]);
}
function boostMill() {
  var e = Math.atan2(mY - height / 2, mX - width / 2);
  placeStable(millType, e + toRad(144));
  placeStable(millType, e + toRad(144));
  placeStable(millType, e + toRad(72));
  placeStable(millType, e + toRad(72));
  placeStable(boostType, e);
  dns(["9", [e]]);
}
;
let hit360 = 0;
setInterval(() => {
  if (hit360 || document.getElementById("shield360").checked && myPlayer.weapon == 11) {
    dns(["D", [2.656139888758748e+195]]);
  }
}, 25);
checkPing.observe(ping, {
  attributes: false,
  childList: true,
  subtree: false
});
tvs.addEventListener("mousedown", function (e) {
  if (e.button == 2 && !inInsta && onclick) {
    if (weapon == primary && weapon != 8 || weapon == "length") {
      weapon = primary;
      dns(["z", [primary, true]]);
      inInsta = true;
      dns(["D", [Math.atan2(mY - height / 2, mX - width / 2)]]);
      dns(["c", [0, oHat, 0]]);
      dns(["c", [0, 0, 1]]);
      dns(["c", [0, oAcc, 1]]);
      dns(["K", [true]]);
      setTimeout(function () {
        if (!ahat) {
          dns(["c", [0, dHat, 0]]);
          dns(["c", [0, dAcc, 1]]);
        }
        dns(["K", [true]]);
        inInsta = false;
      }, 120);
    } else if (weapon == secondary) {
      switch (weapon) {
        case 15:
          inInsta = true;
          dns(["c", [0, 1, 0]]);
          dns(["c", [0, otAcc, 1]]);
          dns(["K", [true]]);
          setTimeout(function () {
            if (!ahat) {
              dns(["c", [0, dHat, 0]]);
              dns(["c", [0, dAcc, 1]]);
            }
            dns(["K", [true]]);
            inInsta = false;
          }, 120);
          break;
        case 10:
          inInsta = true;
          dns(["D", [Math.atan2(mY - height / 2, mX - width / 2)]]);
          dns(["c", [0, tHat, 0]]);
          dns(["c", [0, tAcc, 1]]);
          dns(["K", [true]]);
          setTimeout(function () {
            if (!ahat) {
              dns(["c", [0, dHat, 0]]);
              dns(["c", [0, dAcc, 1]]);
            }
            dns(["K", [true]]);
            inInsta = false;
          }, 120);
      }
    }
  }
  if (e.button == 1) {
    e.preventDefault();
    dns(["z", ["length", true]]);
    weapon = "length";
  }
  if (e.button == 0 && !inInsta && onclick) {
    if (weapon == primary && weapon != 8 || weapon == "length") {
      weapon = primary;
      dns(["z", [primary, true]]);
      inInsta = true;
      dns(["D", [Math.atan2(mY - height / 2, mX - width / 2)]]);
      dns(["c", [0, tHat, 0]]);
      dns(["c", [0, 0, 1]]);
      dns(["c", [0, tAcc, 1]]);
      dns(["K", [true]]);
      setTimeout(function () {
        if (!ahat) {
          dns(["c", [0, dHat, 0]]);
          dns(["c", [0, dAcc, 1]]);
        }
        dns(["K", [true]]);
        inInsta = false;
      }, 120);
    } else if (weapon == secondary) {
      switch (weapon) {
        case 15:
          inInsta = true;
          dns(["c", [0, otHat, 0]]);
          dns(["c", [0, otAcc, 1]]);
          dns(["K", [true]]);
          setTimeout(function () {
            if (!ahat) {
              dns(["c", [0, dHat, 0]]);
              dns(["c", [0, dAcc, 1]]);
            }
            dns(["K", [true]]);
            inInsta = false;
          }, 120);
          break;
        case 10:
          inInsta = true;
          dns(["c", [0, tHat, 0]]);
          dns(["c", [0, tAcc, 1]]);
          dns(["K", [true]]);
          setTimeout(function () {
            if (!ahat) {
              dns(["c", [0, dHat, 0]]);
              dns(["c", [0, dAcc, 1]]);
            }
            dns(["K", [true]]);
            inInsta = false;
          }, 120);
      }
    }
  }
}, false);
function repeater(e, n, o) {
  var t = false;
  var a = undefined;
  return {
    start: function (i) {
      if (i == e && document.activeElement.id.toLowerCase() !== "chatbox") {
        t = true;
        if (a === undefined) {
          a = setInterval(function () {
            n();
            if (!t) {
              clearInterval(a);
              a = undefined;
            }
          }, o);
        }
      }
    },
    stop: function (n) {
      if (n == e && document.activeElement.id.toLowerCase() !== "chatbox") {
        t = false;
      }
    }
  };
}
var healer = repeater(kHeal, function () {
  heal();
}, 120);
var boostPlacer = repeater(kTrap, function () {
  place(boostType);
}, 111);
var spikeObjectPlacer = repeater(kSpike, function () {
  place(spikeType);
}, 111);
var millObjectPlacer = repeater(kWindmill, function () {
  var e = Math.atan2(mY - height / 2, mX - width / 2);

    e = Math.round(e / toRad(45)) * toRad(45);
    placeStable(millType, e + Math.PI * 900000000);
    placeStable(millType, toRad(90) + e + Math.PI * 900000000);
    placeStable(millType, toRad(-90) + e + Math.PI * 900000000);
}, 111);
var turretObjectPlacer = repeater(kTurret, function () {
  place(turretType);
},111);
var boostSpikePlacer = repeater(kBS, boostSpike, 50);
var boostMillPlacer = repeater(kBM, boostMill, 250);
function checkElement(e) {
  return e.offsetParent !== null;
}
function toRad(e) {
  return e * 0.01745329251;
}
function dist(e, n) {
  return Math.sqrt(Math.pow(n.y - e[2], 2) + Math.pow(n.x - e[1], 2));
}
function update() {
  for (var e = 0; e < 9; e++) {
    if (checkElement(document.getElementById("actionBarItem" + e.toString()))) {
      primary = e;
    }
  }
  for (var n = 9; n < 16; n++) {
    if (checkElement(document.getElementById("actionBarItem" + n.toString()))) {
      secondary = n;
    }
  }
  for (var o = 16; o < 19; o++) {
    if (checkElement(document.getElementById("actionBarItem" + o.toString()))) {
      foodType = o - 16;
    }
  }
  for (var t = 19; t < 22; t++) {
    if (checkElement(document.getElementById("actionBarItem" + t.toString()))) {
      wallType = t - 16;
    }
  }
  for (var a = 22; a < 26; a++) {
    if (checkElement(document.getElementById("actionBarItem" + a.toString()))) {
      spikeType = a - 16;
    }
  }
  for (var i = 26; i < 29; i++) {
    if (checkElement(document.getElementById("actionBarItem" + i.toString()))) {
      millType = i - 16;
    }
  }
  for (var l = 29; l < 31; l++) {
    if (checkElement(document.getElementById("actionBarItem" + l.toString()))) {
      mineType = l - 16;
    }
  }
  for (var p = 31; p < 33; p++) {
    if (checkElement(document.getElementById("actionBarItem" + p.toString()))) {
      boostType = p - 16;
    }
  }
  for (var r = 33; r < 36; r++) {
    if (checkElement(document.getElementById("actionBarItem" + r.toString()))) {
      turretType = r - 16;
    }
  }
  for (var c = 36; c < 37; c++) {
    if (checkElement(document.getElementById("actionBarItem" + c.toString()))) {
      spawnpadType = c - 16;
    }
  }
  for (var d = 37; d < 39; d++) {
    if (checkElement(document.getElementById("actionBarItem" + d.toString()))) {
      turretType = d - 16;
    }
  }
}
function placeStable(e) {
  if (!document.getElementById("invisBuilds").checked) {
    var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Math.atan2(mY - height / 2, mX - width / 2);
    dns(["z", [e, null]]);
    dns(["F", [1, n]]);
    dns(["F", [0, n]]);
    dns(["z", [weapon, true]]);
  } else {
    var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Math.atan2(mY - height / 2, mX - width / 2);
    n += Number.MAX_VALUE;
    dns(["z", [e, null]]);
    dns(["F", [1, n]]);
    dns(["F", [0, n]]);
    dns(["z", [weapon, true]]);
  }
  ;
}
let millToggle = 0;
function doHatCycle() {
  dns(["c", [0, 11, 0]]);
  dns(["c", [0, 21, 1]]);
  setTimeout(function () {
    dns(["c", [0, 7, 0]]);
    dns(["c", [0, 18, 1]]);
  }, 300);
  setTimeout(function () {
    dns(["c", [0, 55, 0]]);
    dns(["c", [0, 13, 1]]);
  }, 600);
  setTimeout(function () {
    dns(["c", [0, 40, 0]]);
    dns(["c", [0, 19, 1]]);
  }, 900);
  setTimeout(function () {
    dns(["c", [0, 6, 0]]);
    dns(["c", [0, 21, 1]]);
  }, 1200);
  setTimeout(function () {
    dns(["c", [0, 26, 0]]);
    dns(["c", [0, 13, 1]]);
  }, 1500);
  setTimeout(function () {
    dns(["c", [0, 12, 0]]);
    dns(["c", [0, 19, 1]]);
  }, 1800);
  setTimeout(function () {
    dns(["c", [0, 21, 0]]);
    dns(["c", [0, 18, 1]]);
  }, 2100);
  setTimeout(function () {
    dns(["c", [0, 53, 0]]);
    dns(["c", [0, 21, 1]]);
  }, 2500);
}
;
let millInvisTypes = [10000000, 0, 9000, 100000000, 1000000000];
function getRandMtype() {
  return millInvisTypes[Math.floor(Math.random() * millInvisTypes.length)];
}
;
const wrepeater = repeater(87, () => {
  if (!millToggle) {
    return;
  }
  place(millType, +toRad(50) + Math.PI * getRandMtype());
  place(millType, +toRad(130) + Math.PI * getRandMtype());
}, 111);
const arepeater = repeater(65, () => {
  if (!millToggle) {
    return;
  }
  place(millType, +toRad(30) + Math.PI * getRandMtype());
  place(millType, +toRad(-30) + Math.PI * getRandMtype());
}, 111);
const srepeater = repeater(83, () => {
  if (!millToggle) {
    return;
  }
  place(millType, +toRad(310) + Math.PI * getRandMtype());
  place(millType, +toRad(230) + Math.PI * getRandMtype());
}, 111);
const drepeater = repeater(68, () => {
  if (!millToggle) {
    return;
  }
  place(millType, +toRad(140) + Math.PI * getRandMtype());
  place(millType, +toRad(-140) + Math.PI * getRandMtype());
}, 111);
document.addEventListener("keydown", function (e) {
  wrepeater.start(e.keyCode);
  arepeater.start(e.keyCode);
  srepeater.start(e.keyCode);
  drepeater.start(e.keyCode);
  if (e.keyCode == 188 && document.activeElement.id.toLowerCase() !== "chatbox") {
    millToggle = (millToggle + 1) % 2;
    if (millToggle == 1) {
      dns(["6", ["autoMill: ON"]]);
    } else {
      dns(["6", ["autoMill: OFF"]]);
    }
  }
  ;
  if (e.keyCode == 190 && document.activeElement.id.toLowerCase() !== "chatbox") {
    hit360 = (hit360 + 1) % 2;
    if (hit360 == 1) {
      dns(["6", ["360 hit: ON"]]);
    } else {
      dns(["6", ["360 hit: OFF"]]);
    }
    ;
  }
  ;
  spikeObjectPlacer.start(e.keyCode);
  healer.start(e.keyCode);
  boostPlacer.start(e.keyCode);
  boostSpikePlacer.start(e.keyCode);
  boostMillPlacer.start(e.keyCode);
  millObjectPlacer.start(e.keyCode);
  turretObjectPlacer.start(e.keyCode);
  if (e.keyCode == 84 && document.activeElement.id.toLowerCase() !== "chatbox") {
    if (mode == "hat") {
      clearInterval(hatID);
      mode = "";
      chat("Mode : None");
    } else if (mode == "counter") {
      mode = "";
      chat("Mode : None");
    } else {
      mode = "counter";
      chat("Mode : Counter Insta");
    }
  }
  if (e.keyCode == 89 && document.activeElement.id.toLowerCase() !== "chatbox") {
    if (mode == "hat") {
      clearInterval(hatID);
      mode = "";
      chat("Mode : None");
    } else if (mode == "insta") {
      mode = "";
      chat("Mode : None");
    } else {
      mode = "insta";
      chat("Mode : Auto Insta");
    }
  }
  if (e.keyCode == 85 && document.activeElement.id.toLowerCase() !== "chatbox") {
    if (mode == "hat") {
      clearInterval(hatID);
      mode = "";
      chat("Mode : None");
    } else {
      doHatCycle();
      hatID = setInterval(function () {
        doHatCycle();
      }, 2500);
      mode = "hat";
      chat("Mode : Hat Cycler");
    }
  }
  if (e.keyCode == 71 && document.activeElement.id.toLowerCase() !== "chatbox") {
    if (mode == "hat") {
      clearInterval(hatID);
    }
    mode = "";
    chat("Mode : None");
  }
  if (e.key == 1 && document.activeElement.id.toLowerCase() !== "chatbox") {
    weapon = primary;
  } else if (e.key == 2 && document.activeElement.id.toLowerCase() !== "chatbox") {
    weapon = secondary;
  }
  if (e.keyCode == uneqiup && document.activeElement.id.toLowerCase() !== "chatbox") {
    if (ahat) {
      resetHat();
    } else {
      storeEquip(0);
    }
  } else if (e.keyCode == TankGearKey && document.activeElement.id.toLowerCase() !== "chatbox") {
    if (ahat) {
      oHat = tankGearhatID;
      snHat = tankGearhatID;
      ssHat = tankGearhatID;
    } else {
      dns(["c", [0, tHat, 0]]);
      dns(["c", [0, tAcc, 1]]);
    }
  } else if (e.keyCode == SoldierHelmetKey && document.activeElement.id.toLowerCase() !== "chatbox") {
    if (ahat) {
      dHat = soldierHatIdentifier;
      ssHat = soldierHatIdentifier;
      snHat = soldierHatIdentifier;
    } else {
      dns(["c", [0, dHat, 0]]);
      dns(["c", [0, dAcc, 1]]);
    }
  } else if (e.keyCode == BullHelmetKey && document.activeElement.id.toLowerCase() !== "chatbox") {
    if (ahat) {
      oHat = bullHelmetID;
      snHat = bullHelmetID;
      ssHat = bullHelmetID;
    } else {
      dns(["c", [0, oHat, 0]]);
      dns(["c", [0, oAcc, 1]]);
    }
  } else if (e.keyCode == BoosterHatKey && document.activeElement.id.toLowerCase() !== "chatbox") {
    if (ahat) {
      ssHat = winterCapID;
      snHat = boostHatID;
      srHat = flipperHatID;
    } else if (myPlayer.y < 2400) {
      dns(["c", [0, ssHat, 0]]);
      dns(["c", [0, ssAcc, 1]]);
    } else if (myPlayer.y > 6850 && myPlayer.y < 7550) {
      dns(["c", [0, srHat, 0]]);
      dns(["c", [0, srAcc, 1]]);
    } else {
      dns(["c", [0, snHat, 0]]);
      dns(["c", [0, snAcc, 1]]);
    }
  } else if (e.keyCode == EMPGearKey && document.activeElement.id.toLowerCase() !== "chatbox") {
    if (ahat) {
      oHat = EMPHatID;
      dHat = EMPHatID;
      snHat = EMPHatID;
      srHat = EMPHatID;
      ssHat = EMPHatID;
    } else {
      dns(["c", [0, eHat, 0]]);
      dns(["c", [0, eAcc, 1]]);
    }
  } else if (e.keyCode == TurretKey && document.activeElement.id.toLowerCase() !== "chatbox") {
    if (ahat) {
      oHat = turretgearID;
      dHat = turretgearID;
      ssHat = turretgearID;
      srHat = turretgearID;
      snHat = turretgearID;
    } else {
      dns(["c", [0, otHat, 0]]);
      dns(["c", [0, otAcc, 1]]);
    }
  }
  if (e.keyCode == 82 && document.activeElement.id.toLowerCase() !== "chatbox" && insta && !inInsta) {
    inInsta = true;
    if (iAim) {
      autoaim = true;
    }
    if (icBool) {
      chat(iChat);
    }
    dns(["c", [0, 0, 1]]);
    dns(["K", [true]]);
    if (iReverse) {
      weapon = secondary;
      dns(["z", [secondary, true]]);
      dns(["c", [0, iHat3, 0]]);
      dns(["c", [0, iAcc3, 1]]);
      setTimeout(function () {
        dns(["c", [0, iHat2, 0]]);
        dns(["c", [0, iAcc2, 1]]);
        weapon = primary;
        dns(["z", [primary, true]]);
      }, instaSpeedR / 2);
    } else {
      weapon = primary;
      dns(["z", [primary, true]]);
      dns(["c", [0, iHat2, 0]]);
      dns(["c", [0, iAcc2, 1]]);
      setTimeout(function () {
        dns(["c", [0, iHat3, 0]]);
        dns(["c", [0, iAcc3, 1]]);
        if (iSwitch) {
          weapon = secondary;
          dns(["z", [secondary, true]]);
        }
      }, 111);
    }
    setTimeout(function () {
      weapon = primary;
      dns(["z", [primary, true]]);
      dns(["K", [true]]);
      dns(["c", [0, iHat1, 0]]);
      dns(["c", [0, iAcc1, 1]]);
      if (iAim) {
        autoaim = false;
      }
    }, instaSpeed);
    setTimeout(function () {
      inInsta = false;
    }, instaSpeed + 100);
  }
  if (e.key == "-" && document.activeElement.id.toLowerCase() !== "chatbox" && !inInsta) {
    if (secondary == 15) {
      reload = 1650;
    } else if (secondary == 13) {
      reload = 400;
    } else if (secondary == 12) {
      reload = 850;
    } else if (secondary == 9) {
      reload = 750;
    } else if (irBool) {
      chat("</E\\>Couldn't Reload</E\\>");
    }
  }
  if (e.key == "p" && document.activeElement.id.toLowerCase() !== "chatbox" && !inInsta) {
    inInsta = true;
    if (primary == 0) {
      autoaim = true;
      weapon = 0;
      dns(["z", [0, true]]);
      dns(["c", [0, 0, 1]]);
      dns(["c", [0, 7, 0]]);
      dns(["K", [true]]);
      setTimeout(function () {
        dns(["H", [5]]);
        dns(["H", [17]]);
        dns(["H", [31]]);
        dns(["H", [23]]);
        dns(["H", [9]]);
        dns(["H", [33]]);
        weapon = 5;
      }, 80);
      setTimeout(function () {
        dns(["H", [4]]);
        weapon = 4;
      }, 160);
      setTimeout(function () {
        weapon = 9;
        dns(["z", [9, true]]);
        dns(["c", [0, 53, 0]]);
      }, 270);
      setTimeout(function () {
        dns(["H", [15]]);
        weapon = 15;
      }, 370);
      setTimeout(function () {
        autoaim = false;
        inInsta = false;
        dns(["K", [true]]);
        weapon = 4;
        dns(["z", [4, true]]);
      }, 500);
    } else if (primary != 4 && primary != 3 && secondary == 9) {
      autoaim = true;
      weapon = 9;
      dns(["z", [9, true]]);
      dns(["c", [0, 53, 0]]);
      dns(["K", [true]]);
      setTimeout(function () {
        dns(["H", [12]]);
        weapon = 12;
      }, 100);
      setTimeout(function () {
        dns(["H", [15]]);
        weapon = 15;
      }, 200);
      setTimeout(function () {
        dns(["K", [true]]);
        weapon = primary;
        dns(["z", [primary, true]]);
        autoaim = false;
        inInsta = false;
      }, 400);
    } else if (primary != 3 && primary != 5 || secondary == 9) {
      inInsta = false;
    } else {
      autoaim = true;
      weapon = primary;
      dns(["z", [primary, true]]);
      dns(["c", [0, 7, 0]]);
      dns(["K", [true]]);
      setTimeout(function () {
        dns(["H", [4]]);
        weapon = 4;
      }, 110);
      setTimeout(function () {
        dns(["H", [15]]);
        weapon = 15;
        dns(["z", [15, true]]);
        dns(["c", [0, 53, 0]]);
      }, 230);
      setTimeout(function () {
        autoaim = false;
        inInsta = false;
        dns(["K", [true]]);
        weapon = primary;
        dns(["z", [4, true]]);
      }, 400);
    }
  }
});
document.addEventListener("keyup", function (e) {
  wrepeater.stop(e.keyCode);
  arepeater.stop(e.keyCode);
  srepeater.stop(e.keyCode);
  drepeater.stop(e.keyCode);
  spikeObjectPlacer.stop(e.keyCode);
  boostPlacer.stop(e.keyCode);
  boostSpikePlacer.stop(e.keyCode);
  boostMillPlacer.stop(e.keyCode);
  millObjectPlacer.stop(e.keyCode);
  turretObjectPlacer.stop(e.keyCode);
  healer.stop(e.keyCode);
  if (e.keyCode == kBS || e.keyCode == kBM) {
    for (var n = 0; n < 5; n++) {
      setTimeout(function () {
        dns(["D", [null]]);
      }, n * 20);
    }
  }
});