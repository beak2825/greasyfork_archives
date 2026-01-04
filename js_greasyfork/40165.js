// ==UserScript==
// @name         Ares script
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  No Lag Extension!
// @author       Ares
// @match        https://gota.io/web/
// @grant        GM_addStyle
// @contributor  Ares
// @icon         https://i.imgur.com/S0cv8zt.png
// @downloadURL https://update.greasyfork.org/scripts/40165/Ares%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/40165/Ares%20script.meta.js
// ==/UserScript==

function addStyleSheet(style){
  var getHead = document.getElementsByTagName("HEAD")[0];
  var cssNode = window.document.createElement( 'style' );
  var elementStyle= getHead.appendChild(cssNode);
  elementStyle.innerHTML = style;
  return elementStyle;
}

//Custom Font, Logo and Minimap
addStyleSheet('@import url(https://fonts.googleapis.com/css?family=Ubuntu);');  
GM_addStyle('* #logo {background-image: url("https://i.imgur.com/MVwH2Ev.png");}'); 
GM_addStyle('* #minimap-canvas {background-image: url("http://i.imgur.com/6KeZJh7.png");}'); 
GM_addStyle('*{font-family: Ubuntu;}');
GM_addStyle('* .coordinates {font-family: Ubuntu;}');
GM_addStyle('* #leaderboard-panel {font-size: 24px;}');

var fillTextz = CanvasRenderingContext2D.prototype.fillText;
CanvasRenderingContext2D.prototype.fillText = function(){
    var argumentz = arguments;
    if(this.canvas.id == 'leaderboard-canvas'){
    this.font = 'bold 15px Ubuntu';
    }
    if(this.canvas.id == 'minimap-canvas'){
    this.font = 'bold 15px Ubuntu';
    }
    if(this.canvas.id == 'party-canvas'){
    this.font = 'bold 15px Ubuntu';
    }
    fillTextz.apply(this, arguments);
};

//Custom Borders
GM_addStyle('* .main-panel {border: solid 3px rgba(99, 97, 95, 0.5)}');
GM_addStyle('* .main-panel {border-radius: 5px}');
GM_addStyle('* .main-panel {box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.52)}');
GM_addStyle('* .gota-btn {border-radius: 15px}');
GM_addStyle('* .main-bottom-stats {border-radius: 5px}');
GM_addStyle('* #popup-party {border-radius: 5px}');
GM_addStyle('* #popup-party {border-width: 2px}');
GM_addStyle('* #popup-party {box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.25)}');
GM_addStyle('* #popup-login {border-radius: 5px}');
GM_addStyle('* #popup-login {border-width: 2px}');
GM_addStyle('* #popup-login {box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.25)}');
GM_addStyle('* .login-input {border-radius: 0px}');
GM_addStyle('* #chat-input {border-radius: 0 0 0px 0px}');
GM_addStyle('* .ui-pane {box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.52)}');
GM_addStyle('* #chat-container {border-radius: 5px 5px 0px 0px}');
GM_addStyle('* .main-bottom-stats {box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.52)}');
document.getElementById("leaderboard-panel").style.borderRadius = "9px";
document.getElementById("leaderboard-panel").style.borderWidth = "4px"; 
document.getElementById("leaderboard-panel").style.boxShadow = "0px 0px 0px transparent";
document.getElementById("score-panel").style.borderRadius = "9px";
document.getElementById("score-panel").style.borderWidth = "4px"; 
document.getElementById("score-panel").style.boxShadow = "0px 0px 0px transparent";
document.getElementById("minimap-panel").style.borderRadius = "9px";
document.getElementById("minimap-panel").style.borderWidth = "4px"; 
document.getElementById("minimap-panel").style.boxShadow = "0px 0px 0px transparent";
document.getElementById("party-panel").style.borderRadius = "9px";
document.getElementById("party-panel").style.borderWidth = "4px"; 
document.getElementById("party-panel").style.boxShadow = "0px 0px 0px transparent";

//Miscellaneous UI Changing code
GM_addStyle('* #chat-panel {width: 300px}');
GM_addStyle('* #chat-panel {height: 195px}');
GM_addStyle('* #chat-input {font-weight: bold}');
GM_addStyle('* .stext {margin-top: 2px}');
GM_addStyle('* .stext {margin-bottom: 2px}');
GM_addStyle('* #name-box {font-weight: bold}');
GM_addStyle('* .server-row:hover {font-size: 16px}');
GM_addStyle('* .server-row:hover {font-weight: bold}');
GM_addStyle('* .server-row {transition: all 0.2s}');
GM_addStyle('* .gota-btn:hover {filter: hue-rotate(25deg)}');
GM_addStyle('* .gota-btn:hover {box-shadow: 0px 0px 0px rgba(10,10,10,10)}');
GM_addStyle('* .main-panel {background: #000000}');
GM_addStyle('* .bottom-btn {margin-bottom: 3px}');
GM_addStyle('* #main {width: 1025px; background-color: transparent; border: none;}');
GM_addStyle('* #main-content {width: 305px; height: 490px; margin-top: 80px;}');
GM_addStyle('* #main-side {height: 490px; margin-top: 80px;}');
GM_addStyle('* #main-left {margin-top: 80px; margin-right: 11px; margin-left: -16px; height: 300px;}');
GM_addStyle('* .keybinds-btn {background: white; border: 1.5px solid black; border-radius: 15px; color: black; font-weight: bold}');
GM_addStyle('* .keybinds-table {background: #333; border-radius: 5px; padding: 12px;}');

//Social Media Button Removal
$(".main-bottom-links").replaceWith("");

//Script Version Indicator
var maincontent = document.getElementById("main-content");
  var ffscversion = document.createElement("div");
  ffscversion.innerHTML = 'ItzJustAres';
  ffscversion.id = 'AresScript';
  maincontent.appendChild(ffscversion);
document.getElementById("AresScript").style.cssText = "text-align:center;font-size:18px;color:red;";

//Custom Crosshair
GM_addStyle ('* body {cursor: url(http://i.imgur.com/inmtCDl.png)16 16, auto;}');

//Hide food toggle
document.addEventListener('keydown', function(e) {
var key = e.keyCod || e.which;
switch (key) {case 45: document.getElementById("cHideFood").click();}});

//Disable coordinates
if (document.getElementById('cHideCoordinates').checked === false) {
    document.getElementById('cHideCoordinates').click();
}

//Custom Checkboxes
GM_addStyle('input[type="checkbox" i] {-webkit-appearance: none; background: #000000; color: white; border-radius: 5px; padding: 4px; transition: background 0.2s;}');
GM_addStyle('input[type="checkbox" i]:checked {background: #000000; color: #000000; padding: 5px; padding-right: 9px;}');
GM_addStyle('input[type="checkbox" i]:checked:after {content: "ON";}');
GM_addStyle('input[type="checkbox" i]:not(:checked):before {content: "OFF"}');