// ==UserScript==
// @name         POPMaster Script
// @namespace    http://tampermonkey.net/
// @version      1.3.6
// @description  create by POPMaster
// @author       POPMaster
// @match        http://gota.io/web/*
// @grant        GM_addStyle
// @contributor  Verseh, Superdoggy
// @icon         http://i.imgur.com/UgSeZJj.png
// @downloadURL https://update.greasyfork.org/scripts/29309/POPMaster%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/29309/POPMaster%20Script.meta.js
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
GM_addStyle('* #logo {background-image: url("http://i.imgur.com/PIy1bq2.png");}'); 
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
document.getElementById("leaderboard-panel").style.borderRadius = "5px";
document.getElementById("leaderboard-panel").style.borderWidth = "2px"; 
document.getElementById("leaderboard-panel").style.boxShadow = "0px 0px 0px black";
document.getElementById("score-panel").style.borderRadius = "5px";
document.getElementById("score-panel").style.borderWidth = "2px"; 
document.getElementById("score-panel").style.boxShadow = "0px 0px 0px black";
document.getElementById("minimap-panel").style.borderRadius = "5px";
document.getElementById("minimap-panel").style.borderWidth = "2px"; 
document.getElementById("minimap-panel").style.boxShadow = "0px 0px 0px black";
document.getElementById("party-panel").style.borderRadius = "5px";
document.getElementById("party-panel").style.borderWidth = "2px"; 
document.getElementById("party-panel").style.boxShadow = "0px 0px 0px black";

//Miscellaneous UI Changing code
GM_addStyle('* #chat-panel {width: 300px}');
GM_addStyle('* #chat-panel {height: 195px}');
GM_addStyle('* #chat-input {font-weight: bold}');
GM_addStyle('* .stext {margin-top: 2px}');
GM_addStyle('* .stext {margin-bottom: 2px}');
GM_addStyle('* #name-box {font-weight: bold}');
GM_addStyle('* .server-row:hover {font-size: 16px}');
GM_addStyle('* .server-row:hover {font-weight: bold}');
GM_addStyle('* .server-row {transition: all 0.3s}');
GM_addStyle('* .gota-btn:hover {filter: hue-rotate(25deg)}');
GM_addStyle('* .gota-btn:hover {box-shadow: 0px 0px 0px rgba(10,10,10,10)}');
GM_addStyle('* #main-cover {display: none}');
GM_addStyle('* .main-panel {background: #070707}');
GM_addStyle('* .bottom-btn {margin-bottom: 5px}');

//Social Media Button Removal
$(".main-bottom-links").replaceWith("");

//Script Version Indicator
var maincontent = document.getElementById("main-content");
  var ffscversion = document.createElement("div");
  ffscversion.innerHTML = 'E -16スプリット-|- Q -トリプルスプリット-|- D -ダブルスプリット|- R -ポップスプリット create by POPMaster';
  ffscversion.id = 'ffecscript';
  maincontent.appendChild(ffscversion);
document.getElementById("ffecscript").style.cssText = "text-align:center;font-size:12px;color:white;margin-top:-2px;";

//Custom Crosshair
GM_addStyle ('* body {cursor: url(http://i.imgur.com/tR9UQt5.gif)16 16, auto;}');

//Ad Remove
$("#main-rb").replaceWith("");
GM_addStyle ('* #main {left: 350px;}');

//Hide food toggle
document.addEventListener('keydown', function(e) {
var key = e.keyCod || e.which;
switch (key) {case 45: document.getElementById("cHideFood").click();}});

//Double Split Macro
(function() {
    var amount = 2; // Number of splits
    var duration = 5; // Split delay in milliseconds

    var overwriting = function(evt) {
        if (evt.keyCode === 16) { // 16 is Shift
            for (var i = 0; i < amount; ++i) {
                setTimeout(function() { // 32 is Space
                    window.onkeydown({keyCode: 32}); 
                    window.onkeyup({keyCode: 32});
                }, i * duration);
            }
        }
    };

    window.addEventListener('keydown', overwriting);
})();

//Tricksplit Macro
(function() {
    var amount = 4; // Number of splits
    var duration = 5; // Split delay in milliseconds

    var overwriting = function(evt) {
        if (evt.keyCode === 90) { // 90 is Z
            for (var i = 0; i < amount; ++i) {
                setTimeout(function() { // 32 is Space
                    window.onkeydown({keyCode: 32}); 
                    window.onkeyup({keyCode: 32});
                }, i * duration);
            }
        }
    };

    window.addEventListener('keydown', overwriting);
})();
