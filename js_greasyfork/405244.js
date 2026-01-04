// ==UserScript==
// @name         Erik Script (Gota.io)
// @namespace    http://tampermonkey.net/
// @version      0.3
// @match        https://gota.io/web/*
// @grant        GM_addStyle
// @autor        saku
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @icon         https://i.imgur.com/iRM0Agi.png

// @description sperma
// @downloadURL https://update.greasyfork.org/scripts/405244/Erik%20Script%20%28Gotaio%29.user.js
// @updateURL https://update.greasyfork.org/scripts/405244/Erik%20Script%20%28Gotaio%29.meta.js
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

GM_addStyle('.main {background: url("https://i.imgur.com/0OqboFy.png")}');
GM_addStyle('#minimap-canvas {background-image: url("https://i.imgur.com/VOyfn2a.png");}');
GM_addStyle('*{font-family: Karla;}');
GM_addStyle('.coordinates {font-family: Karla;}');
GM_addStyle('.gota-btn {font-family: Karla !important;}');
GM_addStyle('#leaderboard-panel {font-size: 22px;}');
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
GM_addStyle('.xp-meter > span {background: url(https://i.imgur.com/MQdpj4P.png);}');
GM_addStyle('.xp-meter, .xp-meter > span {border-radius: 5px;}');
GM_addStyle(' #onesignal-bell-container.onesignal-reset .onesignal-bell-launcher.onesignal-bell-launcher-md .onesignal-bell-launcher-button {display: none;}');
GM_addStyle('#name-box {display: inline-flex;}');
GM_addStyle('input[type="checkbox" i] {-webkit-appearance: none; background: url("https://i.imgur.com/zfBE9p6.png"); color: white; border-radius: 10px; padding: 13.5px; transition: background 0.3s;}');
GM_addStyle('input[type="checkbox" i]:checked {background: url("https://i.imgur.com/IeIqdDZ.png"); color: white; padding: 13px; padding-right: 9px;}');
GM_addStyle('.options-container::-webkit-scrollbar, tbody#servers-body-eu::-webkit-scrollbar, tbody#servers-body-na::-webkit-scrollbar, .scrimmage-mode-box::-webkit-scrollbar {background-color: #3d3d3d; border-radius: 10px; width: 10px;}');
GM_addStyle('.options-container::-webkit-scrollbar-thumb {background-color: #ff6347; border-radius: 10px;}');
GM_addStyle('tbody#servers-body-eu::-webkit-scrollbar-thumb, tbody#servers-body-na::-webkit-scrollbar-thumb, .scrimmage-mode-box::-webkit-scrollbar-thumb {background-color: #7f7f7f; border-radius: 10px;}');
console.log("%cНет украинских роботов.", "font-size: 25px; font-weight: bold; background: red; color: white; padding: 10px; border: solid 2px orange;");

/////////////////
// Other Stuff //
/////////////////

$( "#btn-trello" ).remove();
$(".main-bottom-links").remove();
$(".current-status").remove();
$('#server-tab-eu').text('Eat');
$("#server-tab-eu").css({
    "color":"green"
});
$('#server-tab-na').text('my');
$("#server-tab-na").css({
    "color":"orange"
});
$('#server-tab-ap').text('Ass');
$("#server-tab-ap").css({
    "color":"red"
});