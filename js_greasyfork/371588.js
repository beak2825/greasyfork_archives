// ==UserScript==
// @name         AR Clan Script
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Official Gota.io Aryo Clan Extension
// @author       Sasuke
// @match        https://gota.io/web/*
// @grant        GM_addStyle
// @contributor  FFEC
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @icon         https://raw.githubusercontent.com/trailyy/ar-extension/master/AR.png
// @downloadURL https://update.greasyfork.org/scripts/371588/AR%20Clan%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/371588/AR%20Clan%20Script.meta.js
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
GM_addStyle('#logo {background-image: url("https://i.imgur.com/QhI9V3C.png");}');
GM_addStyle('#minimap-canvas {background-image: url("https://i.imgur.com/sJHfBYc.png");}');
GM_addStyle('*{font-family: Karla;}');
GM_addStyle('.coordinates {font-family: Karla;}');
GM_addStyle('.gota-btn {font-family: Karla !important; background-color: rgba(0, 0, 0, 0) !important; border-color: #00ffff !important; color: #00ffff !important}');
GM_addStyle('#leaderboard-panel {font-size: 22px;}');
GM_addStyle('.main-panel {border: solid 3px rgba(99, 97, 95, 0.5)}');
GM_addStyle('.main-panel {border-radius: 5px}');
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
GM_addStyle('#leaderboard-panel {color: aqua !important}');
GM_addStyle('#inner-rb {background-color: rgba(0, 0, 0, 0)}');
GM_addStyle('#main-rb {background-color: rgba(0, 0, 0, 0)}');
GM_addStyle('#main-account {background-color: rgba(0, 0, 0, 0)}');
GM_addStyle('.main-bottom-stats {background-color: rgba(0, 0, 0, 0) !important}');
GM_addStyle('#main-scrimmage {background-color: rgba(0, 0, 0, 0) !important}');
GM_addStyle('#scrimmage-menu {background-color: rgba(0, 0, 0, 0) !important}');
GM_addStyle('#scrimmage-custom-btn-container {background-color: rgba(0, 0, 0, 0) !important}');
GM_addStyle('#scrimmage-mode-info {background-color: rgba(0, 0, 0, 0) !important}');
GM_addStyle('.scrimmage-mode-box {background-color: rgba(0, 0, 0, 0) !important}');
GM_addStyle('#popup-profile {background-color: rgba(0, 0, 0, 0) !important}');
GM_addStyle('#emote-panel {background-color: rgba(0, 0, 0, 0) !important}');
GM_addStyle('#autocomplete-panel {background-color: rgba(0, 0, 0, 0) !important}');
GM_addStyle('#popup-party {background-color: rgba(0, 0, 0, 0) !important}');
GM_addStyle('#server-tab-eu, #server-tab-na, #server-tab-ap {background-color: rgba(0, 0, 0, 0) !important}');
GM_addStyle('#servers-body-eu, #server-content {background-color: rgba(0, 0, 0, 0) !important}');
GM_addStyle('#servers-body-na, #server-content {background-color: rgba(0, 0, 0, 0) !important}');
GM_addStyle('#servers-body-ap, #server-content {background-color: rgba(0, 0, 0, 0) !important}');
GM_addStyle('.server-selected {background-color: rgba(255, 0, 0, 0.78) !important}');
GM_addStyle('.server-table {color: rgba(0, 255, 255, 1) !important}');
GM_addStyle('#name-box {color: #00ffff !important; border-color: #00ffff !important; background-color: rgba(255, 255, 255, 0) !important}');
GM_addStyle('.options-container {background-color: rgba(50, 50, 50, 0) !important}');
GM_addStyle('.main-bottom-stats {color: aqua !important; border-color: aqua !important}')
GM_addStyle('#main-stats {color: #00ffff !important}')
GM_addStyle('.title-text {color: #00ffff !important}')
GM_addStyle('#username-container {color: #00ffff !important}')
GM_addStyle('.main-panel {border-color: #00ffff}')
GM_addStyle('.popup-panel {color: {background-color: rgba(50, 50, 50, 0) !important}');
GM_addStyle('#chat-container {border-color: aqua}');
GM_addStyle('#main-rb-title {color: aqua}');
GM_addStyle('#main-rb {background-image: url(https://i.imgur.com/v9e0st7.png)}');
GM_addStyle('#popup-profile {color: #00ffff !important}');
GM_addStyle('#main-social {color: #00ffff !important}');
GM_addStyle('.username {color: #00ffff !important}');
GM_addStyle('.material-icons {color: #00ffff !important}');
GM_addStyle('#leaderboard-panel {background-color: rgba(23, 22, 23, 0) !important; border-color: aqua}');
GM_addStyle('#minimap-panel {background-color: rgba(23, 22, 23, 0) !important; border-color: aqua}');
GM_addStyle('#score-panel {background-color: rgba(23, 22, 23, 0) !important; border-color: aqua}');
GM_addStyle('#party-panel {border-color: aqua}');
GM_addStyle('#chat-panel {border-color: aqua}');
GM_addStyle('#main-scrimmage {color: aqua!important; border-color: red !important}');
GM_addStyle('.main-version {color: aqua!important}');
/////////////////
// Other Stuff //
/////////////////

$(".main-rb-title").remove();
$("#inner-rb").remove();
$("#btn-trello").remove();
$(".main-bottom-links").remove();
$(".current-status").remove();
$('#server-tab-eu').text('Nice Servers');
$("#server-tab-eu").css({
    "color":"green"
});
$('#server-tab-na').text('Average Ping');
$("#server-tab-na").css({
    "color":"orange"
});
$('#server-tab-ap').text('Ultra High Ping');
$("#server-tab-ap").css({
    "color":"red"
});

$('#btn-play').text('Rekt Bitches');
$('#btn-spec').text('Watch Bitches');
$('#profile-clan-membership').text('Δ𐍂 ~ Aryo');
$(".main-bottom-left").append('<a id="ArDiscord" href=https://discord.gg/xAthAVy" target="_blank">Discord</a>');
$("#umdiscord").css({
    "border-style": "solid",
    "border-width": "1px",
    "border-color": "aqua",
    "background-color": "rgba(23, 22, 23, 0)",
    "margin-bottom": "8px",
    "border-radius": "15px",
    "padding": "0 10px 3px 10px",
    "color": "aqua",
    "font-size": "20px",
    "text-align": "center"
});

$("#main-content").append('<a id="trailyt" href="" target="_blank">SasukeIsTheBest</a>');
$("#trailyt").css({
    "border-style": "solid",
    "border-width": "1px",
    "border-color": "red",
    "background-color": "rgba(23, 22, 23, 0)",
    "border-radius": "15px",
    "padding": "0 10px 3px 10px",
    "color": "red",
    "font-size": "20px",
    "text-align": "center"
});
////////////////////
// Console Log(s) //
////////////////////

console.log("%cAR Clan Script is enabled. Message Trail (trail#0001) if help needed.", "font-size: 25px; font-weight: bold; background: red; color: white; padding: 10px; border: solid 2px orange;");
