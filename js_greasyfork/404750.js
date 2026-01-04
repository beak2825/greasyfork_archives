// ==UserScript==
// @name         Dark theme for surviv.io
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       KrityTeam
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @run-at       document-end
// @match        *://surviv.io/*
// @downloadURL https://update.greasyfork.org/scripts/404750/Dark%20theme%20for%20survivio.user.js
// @updateURL https://update.greasyfork.org/scripts/404750/Dark%20theme%20for%20survivio.meta.js
// ==/UserScript==

if(window.location.href.includes("stats")){
document.getElementById("adsLeaderBoardTop").remove(); // ad
document.getElementById("adsPlayerTop").remove(); // ad

setTimeout(function blockAds(){
if(document.getElementById("sticky-footer") == null){
}
else{
document.getElementById("sticky-footer").remove(); // ad
}
},400);
}

else{
document.getElementById("background").style = "filter:brightness(35%);background-image:url(https://i.imgur.com/XjgPHE2.png);";
document.getElementById("start-top-left").style = "display:none;";
document.getElementById("start-bottom-left").style = "display:none;";
document.getElementById("start-bottom-middle").style = "display:none;";
document.getElementById("start-row-header").style = "height:140px;width:375px;visibility:hidden;"; // IceHack logo on main menu
document.getElementById("left-column").style = "visibility:hidden;";
document.getElementById("pass-block").style = "background:rgba(0,0,0,0);";
document.getElementById("btns-quick-start").style = "display:none;"; // dual and squad
document.getElementById("btn-help").style = "display:none;"; // BTN Help
document.getElementById("ui-stats-logo").remove(); // IceHack logo when over game
document.getElementById("start-menu").style = "background:rgba(0,0,0,0);";
document.getElementById("server-select-main").style = "display:none;"; // select server
document.getElementById("player-name-input-solo").style = "border-radius:0px;opacity:50%;";
document.getElementById("btn-start-mode-0").style = "background-color:#221E23;box-shadow:none;border-bottom:2px solid #010003;border-radius:0px;"; // Play Solo
document.getElementById("btn-customize").style = "background:rgba(0,0,0,0);background-image:url(https://surviv.io/img/emotes/surviv.svg);border-bottom:none;box-shadow:none;background-position: 8px 5px;background-repeat: no-repeat;background-size: 28px;";
document.getElementById("btn-join-team").style = "background-color:#221E23;box-shadow:none;border-bottom:2px solid #010003;border-radius:0px;";
document.getElementById("btn-create-team").style = "background-color:#221E23;box-shadow:none;border-bottom:2px solid #010003;border-radius:0px;";

document.querySelector("#start-top-right > div > div:first-child > div > div:nth-child(3)").style.display = "none";
document.querySelector("#start-top-right > div > div:first-child > div > div:nth-child(1)").style.display = "none";

document.getElementById("survivio_728x90_start").remove(); // ad
document.getElementById("survivio_300x250_start").remove(); // ad
document.getElementById("survivio_300x250_over").remove(); // ad
}
// WTF 7!??!
GM_addStyle(`
.account-details-top-buttons>.account-details-link-out{
background-color:#221E23;
box-shadow:none;
border-bottom:2px solid #010003;
border-radius:0px;
}
.account-details-top-buttons{
background:rgba(0,0,0,0);
}
.account-details-block{
background:rgba(0,0,0,0.08);
}
.btn-account-turq{
background-color:#221E23;
box-shadow:none;
border-bottom:2px solid #010003;
border-radius:0px;
}
.btn-account-grey{
background-color:#3F3841;
box-shadow:none;
border-bottom:2px solid #010003;
border-radius:0px;
}
.account-buttons{
background:rgba(0,0,0,0.08);
}
`);
// OMG THIS WORK...

// LOL THIS SHITCODE WORK OMG