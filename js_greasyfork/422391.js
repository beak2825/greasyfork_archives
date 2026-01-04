// ==UserScript==
// @name         lucid's gota no lag extension
// @namespace    http://tampermonkey.net/
// @version      0.4.1
// @description  Official Lucid Gota.io Extension
// @author       Lucid
// @match        https://gota.io/web/*
// @grant        GM_addStyle
// @contributor  APX
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/422391/lucid%27s%20gota%20no%20lag%20extension.user.js
// @updateURL https://update.greasyfork.org/scripts/422391/lucid%27s%20gota%20no%20lag%20extension.meta.js
// ==/UserScript==

addStyleSheet('@import url(https://fonts.googleapis.com/css?family=Karla);');

function addStyleSheet(style){
  var getHead = document.getElementsByTagName("HEAD")[0];
  var cssNode = window.document.createElement( 'style' );
  var elementStyle= getHead.appendChild(cssNode);
  elementStyle.innerHTML = style;
  return elementStyle;
}

var fillTextz = CanvasRenderingContext2D.prototype.fillText;
CanvasRenderingContext2D.prototype.fillText = function(){
    var argumentz = arguments;
    if(this.canvas.id == 'leaderboard-canvas'){
    this.font = 'bold 15px Karla';
    }
    if(this.canvas.id == 'minimap-canvas'){
    this.font = 'bold 15px Karla';
    }
    if(this.canvas.id == 'party-canvas'){
    this.font = 'bold 15px Karla';
    }
    fillTextz.apply(this, arguments);
};

///////////////
// Cosmetics //
///////////////

GM_addStyle('*{font-family: Karla;}');
GM_addStyle('.coordinates {font-family: Karla;}');
GM_addStyle('.gota-btn {font-family: Karla !important;}');
GM_addStyle('#leaderboard-panel {font-size: 22px;}');
GM_addStyle('.main-panel {border: solid 3px rgba(99, 97, 95, 0.5)}');
GM_addStyle('.main-panel {border-radius: 5px}');
GM_addStyle('.main-panel {background: #070707}');
GM_addStyle('.main-version {width: 290px; font-size: 11px;}');
GM_addStyle('#main {width: 1075px; background-color: transparent; border: none;}');
GM_addStyle('#main-content {height: 490px; margin-top: 80px; padding: 0 15px 0 15px;}');
GM_addStyle('#main-left {margin-top: 80px; margin-right: 1px; margin-left: -16px; height: 490px; width: 371px;}');
GM_addStyle('#main-right {height: 490px; width: 345px; margin-top: 80px;}');
GM_addStyle('#main-account {margin: 10px 10px;}');
GM_addStyle('#main-social {background: none; border: none;}');
GM_addStyle('.main-bottom {margin-bottom: 12px;}');
GM_addStyle('.main-bottom-stats {border-radius: 5px}');
GM_addStyle('.main-input-btns {margin-top: 12px;}');
GM_addStyle('.gota-btn {border-radius: 15px;}');
GM_addStyle('.gota-btn:hover {filter: hue-rotate(25deg)}');
GM_addStyle('.gota-btn:hover {box-shadow: 0px 0px 0px rgba(10,10,10,10)}');
GM_addStyle('#popup-party {border-radius: 5px; border-width: 2px;}');
GM_addStyle('#popup-login {border-radius: 5px; border-width: 2px;}');
GM_addStyle('.login-input {border-radius: 0px}');
GM_addStyle('#chat-input {border-radius: 0px}');
GM_addStyle('#chat-container {border-radius: 5px 5px 0px 0px}');
GM_addStyle('#leaderboard-panel, #score-panel, #minimap-panel, #party-panel {border-radius: 5px; border-width: 2px; box-shadow: none;}');
GM_addStyle('#chat-input {font-weight: bold}');
GM_addStyle('#name-box {font-weight: bold}');
GM_addStyle('.stext {margin-top: 2px; margin-bottom: 2px;}');
GM_addStyle('.server-row:hover {background: rgb(119, 119, 119);}');
GM_addStyle('.server-row {transition: all 0.3s}');
GM_addStyle('.server-container, .options-container {width: 90%;}');
GM_addStyle('.server-selected {background-color: rgba(0, 255, 255, 0.8) !important;}');
GM_addStyle('.sp-replacer, input[type="checkbox" i] {margin-right: 7.5px;}');
GM_addStyle('.scrimmage-select {border: 2px solid black; border-radius: 10px; padding: 4px; font-weight: bold; margin-top: 3px;}');
GM_addStyle('.xp-meter > span {background: linear-gradient(to right, red, orange, yellow, green, cyan, blue, violet, pink);}');
GM_addStyle('.xp-meter, .xp-meter > span {border-radius: 5px;}');
GM_addStyle(' #onesignal-bell-container.onesignal-reset .onesignal-bell-launcher.onesignal-bell-launcher-md .onesignal-bell-launcher-button {display: none;}');
GM_addStyle('#name-box {display: inline-flex;}');
GM_addStyle('input[type="checkbox" i] {-webkit-appearance: none; background: #ff0000; color: white; border-radius: 5px; padding: 4px; transition: background 0.3s;}');
GM_addStyle('input[type="checkbox" i]:checked {background: #00f000; color: #014401; padding: 4px; padding-right: 9px;}');
GM_addStyle('input[type="checkbox" i]:checked:after {content: "ON";}');
GM_addStyle('input[type="checkbox" i]:not(:checked):before {content: "OFF"}');
GM_addStyle('.options-container::-webkit-scrollbar, tbody#servers-body-eu::-webkit-scrollbar, tbody#servers-body-na::-webkit-scrollbar, .scrimmage-mode-box::-webkit-scrollbar {background-color: #3d3d3d; border-radius: 10px; width: 10px;}');
GM_addStyle('.options-container::-webkit-scrollbar-thumb {background-color: #5f5f5f; border-radius: 10px;}');
GM_addStyle('tbody#servers-body-eu::-webkit-scrollbar-thumb, tbody#servers-body-na::-webkit-scrollbar-thumb, .scrimmage-mode-box::-webkit-scrollbar-thumb {background-color: #7f7f7f; border-radius: 10px;}');

/////////////////
// Other Stuff //
/////////////////

$( "#btn-trello" ).remove();
$(".main-bottom-links").remove();
$(".current-status").remove();
$('#btn-play').text('Play');
$('#btn-servers').text('Servers');
