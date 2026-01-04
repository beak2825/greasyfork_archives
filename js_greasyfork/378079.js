// ==UserScript==
// @name         Gota.io Extension By : MvCroco Reza
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  NO LAG GOTA.IO PLAY!
// @author       Reza
// @match        https://gota.io/web/*
// @grant        GM_addStyle
// @contributor  Reza
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @icon         https://i.imgur.com/CJ8FNs5.png
// @downloadURL https://update.greasyfork.org/scripts/378079/Gotaio%20Extension%20By%20%3A%20MvCroco%20Reza.user.js
// @updateURL https://update.greasyfork.org/scripts/378079/Gotaio%20Extension%20By%20%3A%20MvCroco%20Reza.meta.js
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
GM_addStyle('#logo {background-image: url("https://i.imgur.com/Ec1OrqYg.png");}');
GM_addStyle('#minimap-canvas {background-image: url("http://i.imgur.com/2e89LnJ.png");}');
GM_addStyle('*{font-family: Ubuntu;}');
GM_addStyle('.coordinates {font-family: Ubuntu;}');
GM_addStyle('#leaderboard-panel {font-size: 24px;}');

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
GM_addStyle('.main-panel {border: solid 3px rgba(99, 97, 95, 0.5)}');
GM_addStyle('.main-panel {border-radius: 5px}');
GM_addStyle('.main-panel {box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.52)}');

GM_addStyle('.gota-btn {border-radius: 15px}');

GM_addStyle('.main-bottom-stats {border-radius: 5px}');
GM_addStyle('.main-bottom-stats {box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.52)}');

GM_addStyle('#popup-party {border-radius: 5px; border-width: 2px;}');
GM_addStyle('#popup-party {box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.25)}');

GM_addStyle('#popup-login {border-radius: 5px; border-width: 2px;}');
GM_addStyle('#popup-login {box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.25)}');

GM_addStyle('.login-input {border-radius: 0px}');
GM_addStyle('#chat-input {border-radius: 0 0 0px 0px}');

GM_addStyle('.ui-pane {box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.52)}');
GM_addStyle('#chat-container {border-radius: 5px 5px 0px 0px}');

GM_addStyle('#leaderboard-panel, #score-panel, #minimap-panel, #party-panel {border-radius: 5px; border-width: 2px; box-shadow: none;}')


//Miscellaneous UI Changing code
GM_addStyle('#chat-input {font-weight: bold}');

GM_addStyle('.stext {margin-top: 2px; margin-bottom: 2px;}');

GM_addStyle('#name-box {font-weight: bold}');

GM_addStyle('.server-row:hover {font-size: 16px; font-weight: bold;}');
GM_addStyle('.server-row {transition: all 0.3s}');

GM_addStyle('.gota-btn:hover {filter: hue-rotate(25deg)}');
GM_addStyle('.gota-btn:hover {box-shadow: 0px 0px 0px rgba(10,10,10,10)}');

GM_addStyle('.main-panel {background: #070707}');
GM_addStyle('.bottom-btn {margin-bottom: 3px}');

GM_addStyle('#main {width: 1025px; background-color: transparent; border: none;}');
GM_addStyle('#main-content {width: 305px; height: 490px; margin-top: 80px;}');
GM_addStyle('#main-side {height: 490px; margin-top: 80px;}');
GM_addStyle('#main-left {margin-top: 80px; margin-right: 11px; margin-left: -16px; height: 490px;}');
GM_addStyle('#main-account {margin: 10px 10px;}');
GM_addStyle('#main-social {background: none; border: none;}');

GM_addStyle('.keybinds-btn {background: white; border: 1.5px solid black; border-radius: 15px; color: black; font-weight: bold}');
GM_addStyle('.keybinds-table {background: #333; border-radius: 5px; padding: 12px;}');

GM_addStyle('.sp-replacer, input[type="checkbox" i] {margin-right: 7.5px;}');
GM_addStyle('.scrimmage-select {border: 2px solid black; border-radius: 10px; padding: 4px; font-weight: bold; margin-top: 3px;}');
GM_addStyle('.xp-meter, .xp-meter > span {border-radius: 10px;}');


//Removal of unnecessary elements
$(".main-bottom-links").remove();
GM_addStyle(' #onesignal-bell-container.onesignal-reset .onesignal-bell-launcher.onesignal-bell-launcher-md .onesignal-bell-launcher-button {display: none;}');

//Namebox display fix
GM_addStyle('#name-box {display: inline-flex;}');

//Script Version Indicator
var maincontent = document.getElementById("main-content");
  var ffscversion = document.createElement("div");
  ffscversion.innerHTML = 'Script Version: 1.4.6.2<br>Release Date: July 1st, 2018';
  ffscversion.id = 'ffecscript';
  maincontent.appendChild(ffscversion);
document.getElementById("ffecscript").style.cssText = "text-align:center;font-size:12px;color:white;";

//Custom Crosshair
GM_addStyle ('body {cursor: url(https://i.imgur.com/bX1fOny.gif)16 16, auto;}');

//Custom Checkboxes
GM_addStyle('input[type="checkbox" i] {-webkit-appearance: none; background: #ff0000; color: white; border-radius: 5px; padding: 4px; transition: background 0.3s;}');
GM_addStyle('input[type="checkbox" i]:checked {background: #00f000; color: #014401; padding: 4px; padding-right: 9px;}');
GM_addStyle('input[type="checkbox" i]:checked:after {content: "ON";}');
GM_addStyle('input[type="checkbox" i]:not(:checked):before {content: "OFF"}');

//Custom scrollbars
GM_addStyle('.options-container::-webkit-scrollbar, tbody#servers-body-eu::-webkit-scrollbar, tbody#servers-body-na::-webkit-scrollbar, .scrimmage-mode-box::-webkit-scrollbar {background-color: #3d3d3d; border-radius: 10px; width: 10px;}');
GM_addStyle('.options-container::-webkit-scrollbar-thumb {background-color: #5f5f5f; border-radius: 10px;}');
GM_addStyle('tbody#servers-body-eu::-webkit-scrollbar-thumb, tbody#servers-body-na::-webkit-scrollbar-thumb, .scrimmage-mode-box::-webkit-scrollbar-thumb {background-color: #7f7f7f; border-radius: 10px;}');