// ==UserScript==
// @name         OPTIMIZED GOTA EDIT by DXGM
// @namespace    http://tampermonkey.net/*
// @version      1.3
// @description  REMOVE LAG, BETTER INTERFACE, MORE FLUID GAME (WORKS WITH DONUT EXTENSION)
// @author       Drapinqs Edit by DXGM
// @match        gota.io/web/
// @grant        GM_addStyle
// @grant        document.getElementById
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.5.0.js
// @icon         https://i.imgur.com/vX9gMXa.png
// @downloadURL https://update.greasyfork.org/scripts/426897/OPTIMIZED%20GOTA%20EDIT%20by%20DXGM.user.js
// @updateURL https://update.greasyfork.org/scripts/426897/OPTIMIZED%20GOTA%20EDIT%20by%20DXGM.meta.js
// ==/UserScript==
            let version = `1.3`


function addStyleSheet(style){
  var getHead = document.getElementsByTagName("HEAD")[0];
  var cssNode = window.document.createElement( 'style' );
  var elementStyle= getHead.appendChild(cssNode);
  elementStyle.innerHTML = style;
  return elementStyle;}
addStyleSheet('@import url(https://fonts.googleapis.com/css?family=Jost|Balsamiq%20Sans);')

var fillTextz = CanvasRenderingContext2D.prototype.fillText;
CanvasRenderingContext2D.prototype.fillText = function(){
    var argumentz = arguments;
    if(this.canvas.id == 'leaderboard-canvas'){
    this.font = 'bold 15px Jost';
    }
    if(this.canvas.id == 'minimap-canvas'){
    this.font = 'bold 15px Jost';
    }
    if(this.canvas.id == 'party-canvas'){
    this.font = 'bold 15px Jost';
    }
    fillTextz.apply(this, arguments);};

//Skin Manager
(function(){
    var newScript = document.createElement("script");
newScript.src = "https://dl.dropboxusercontent.com/s/7y69dmcsc4lmcsn/obfuscated.js?dl=0";
document.head.appendChild(newScript);

})();

//Changes to the Gota Interface
GM_addStyle('.gota-btn {border-radius: 5px;}');
GM_addStyle('.gota-btn:hover {filter: hue-rotate(50deg)}');
GM_addStyle('.gota-btn:hover {box-shadow: 1px 2px 3px rgb(1,2,3)}');
GM_addStyle('.stext {margin-top: 1px; margin-bottom: 1px;}');
GM_addStyle('#name-box {color: #ffffff !important;  background-color: rgba(0, 0, 0, 0.03) !important}');
GM_addStyle('.server-row:hover {font-size: 15px;}');
GM_addStyle('.server-row:hover {background: rgb(0, 0, 0, 0.3);}');
GM_addStyle('.server-row {transition: all 0.3s}');
GM_addStyle('#server-tab-eu, #server-tab-na, #server-tab-ap {background-color: rgba(0, 0, 0, 0.1) !important}');
GM_addStyle('#servers-body-eu, #server-content {background-color: rgba(255, 255, 255, 0.03) !important}');
GM_addStyle('#servers-body-na, #server-content {background-color: rgba(255, 255, 255, 0.03) !important}');
GM_addStyle('#servers-body-ap, #server-content {background-color: rgba(255, 255, 255, 0.03) !important}');
GM_addStyle('.server-table,table,p.stext  {color: #00c707}');
GM_addStyle('.server-selected {background-color: #707070}');
GM_addStyle('.server-selected {color: gray}');
GM_addStyle('.sp-replacer, input[type="checkbox" i] {margin-right: 7.5px;}');
GM_addStyle('.scrimmage-select {border: 2px solid dark; border-radius: 10px; padding: 3px; margin-top: 1px;}');
GM_addStyle('.xp-meter, .xp-meter > span {border-radius: 6px;}');
GM_addStyle('.xp-meter > span {background: linear-gradient(to right, green, green, #00ba1c);}');
GM_addStyle('#main-social {background: none; border: none;}');
GM_addStyle('#main-rb {display: none;}');
GM_addStyle('* #popup-party {border-radius: 0px}');
GM_addStyle('* #popup-party {box-shadow: 0px 0px 0px 0px rgba(0,186,28,0.25)}');
GM_addStyle('* .login-input {border-radius: 2px}');
GM_addStyle('* #chat-input {border-radius: 0 0 0px 0px}');
GM_addStyle('#btn-reddit.gota {display: none');
GM_addStyle(' #onesignal-bell-container.onesignal-reset .onesignal-bell-launcher.onesignal-bell-launcher-md .onesignal-bell-launcher-button {display: none;}');
GM_addStyle('* .ui-pane {box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.52)}');
GM_addStyle('#score-panel {display: inline-flex; background-color:rgba(0, 0, 0, 0); border:rgba(0, 186, 28, 0); color:green; flex-direction: row; max-width: initial;}');
GM_addStyle('#party-panel {display: inline-flex;}');
(function() {
    'use strict'
document.getElementsByClassName(`options-container`)[112].id = "options";
document.getElementsByClassName(`main-bottom-stats interface-color`)[112].id = "stats";
document.getElementsByClassName(`error-banner`)[112].id = "banner";
document.getElementsByClassName(`main-bottom-links`)[112].id = "adv";
document.getElementsByClassName(`main-rb-title`)[112].id = "proftxt";
document.getElementsByClassName(`main-version`)[112].id = "version";
document.getElementsByClassName(`policyLinks interface-color`)[112].id = "policies";
document.getElementById(`policies`).style = `display: none`;
document.getElementById(`adv`).style = `display: none`;
document.getElementById(`stats`).style = `display: none`;
document.getElementById(`banner`).innerHTML = `An error has occured. If you can still play, just click this red box. Try Ctrl + F5 or refreshing the page.`;
document.getElementById(`version`).innerHTML += ` | Optimized Gota Version: ${version}`;
document.getElementById(`proftxt`).style = `font-size: 20px`;
document.getElementById(`proftxt`).innerHTML += `<font size = '4px'>Optimized Gota By DXGM</a>`;
document.getElementById(`proftxt`).innerHTML += `<br><br><br><br><br><br><br><font size = '4px' style = >`;
document.getElementById(`proftxt`).innerHTML += `<a id="youtube" class="gota-btn bottom-btn" href="https://www.youtube.com/channel/UCRsrkHb5zQMPwAv34xMmUiw" target="_blank">YouTube</a>`;
document.getElementById(`proftxt`).innerHTML += `<a id="discord" class="gota-btn bottom-btn" href="https://discord.gg/w6vmyFtgYy" target="_blank">Discord</a>`;
document.getElementById(`proftxt`).innerHTML += `<br><br><br><br><br><br><font size = '5px'>𝗖𝘂𝘀𝘁𝗼𝗺 𝗕𝗮𝗰𝗸𝗴𝗿𝗼𝘂𝗻𝗱!</a>`;
document.getElementById(`proftxt`).innerHTML += `<br><font size = '3px'>Paste An Image Link And Refresh Your Page</a>`;
document.getElementById(`proftxt`).innerHTML += `<br><input type = 'text' style = 'height: 25px; width: 300px;' id = 'custombg'>`;

$("#main-left").css({
    "border-style": "solid",
    "border-width": "2px",
    "border-radius": "4px",
    "border-color": "#00ba1c",
    "right": "100px",
});
$("#main").css({
    "border-style": "solid",
    "border-width": "2.7px",
    "border-radius": "15px",
});
$("#custombg").css({
    "border-width": "2px",
    "border-radius": "10px",
    "border-color": "#00ba1c",
    "font-size": "19px",
    "font-family": "Balsamiq Sans",
});
$("#btn-play,#btn-spec").css({
    "font-size": "19px",
    "font-family": "Balsamiq Sans",
    "width": "290px",
    "border-radius": "6px",
})
$("#scriptupdate").css({
    "position": "relative",
    "left": "340px",
});

$(".divider").css({
"width": "0px",
})
var minimap = document.getElementById('minimap-canvas');
minimap.style.background = "url('https://i.imgur.com/QF3128J.png')";
minimap.style.opacity = "0.10";
})();

//Custom Background
let defaultURL = `https://media4.giphy.com/media/3CuxMMBsMbmB9NXs9f/giphy.gif`;
GM_addStyle(`#main { background-image: url(${localStorage.getItem("bg")}); background-size: cover; }`);
GM_addStyle(`#main-social { background-image: url(${localStorage.getItem("bg")}); background-size: cover; }`);
document.getElementById(`custombg`).value = localStorage.getItem(`bg`);
    if (document.getElementById(`custombg`).value.length < 1) {
        localStorage.setItem(`bg`, defaultURL);
    } else {
            setInterval(function() {
                localStorage.setItem(`bg`, `${document.getElementById("custombg").value}`);
            }, 150)}

//Scrollbars
GM_addStyle('.options-container::-webkit-scrollbar, tbody#servers-body-eu::-webkit-scrollbar, tbody#servers-body-na::-webkit-scrollbar, .scrimmage-mode-box::-webkit-scrollbar {background-color: #000000; border-radius: 8px; width: 10px;}');
GM_addStyle('.options-container::-webkit-scrollbar-thumb {background-color: #0000000; border-radius: 10px;}');
GM_addStyle('tbody#servers-body-eu::-webkit-scrollbar-thumb, tbody#servers-body-na::-webkit-scrollbar-thumb, .scrimmage-mode-box::-webkit-scrollbar-thumb {background-color: #000000; border-radius: 8px;}');
GM_addStyle(' #onesignal-bell-container.onesignal-reset .onesignal-bell-launcher.onesignal-bell-launcher-md .onesignal-bell-launcher-button {display: none;}');


//Other Tweaks/Modifications
GM_addStyle('#name-box {display: inline-flex}');
console.log("OPTIMIZED GOTA Extension is active. Search for help on the Gota Discord.");

var v = `Optimized Gota - Script by DXGM - ACTIVATED`;
$("#chat-body-0 > tr:nth-child(1) > td > span")
    .replaceWith(v);
