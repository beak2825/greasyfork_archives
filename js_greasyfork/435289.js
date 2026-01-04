// ==UserScript==
// @name         Surviv.io - Dark Theme & Custom Background 
// @namespace    http://tampermonkey.net/
// @version      1.4
// @icon         https://media.discordapp.net/attachments/828306103448109097/871941998393831454/svgviewer-png-output_1.png
// @description  The original script was not owned by me, i just remake it for 2021. Remake this script from https://github.com/EPIC-afk/Customs-Map-survivio
// @author       Samer Kizi#8293 and Spring rolls#9901
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @match        *://surviv.io/*
// @match        *://surviv2.io/*
// @match        *://2dbattleroyale.com/*
// @match        *://2dbattleroyale.org/*
// @match        *://piearesquared.info/*
// @match        *://thecircleisclosing.com/*
// @match        *://archimedesofsyracuse.info/*
// @match        *://secantsecant.com/*
// @match        *://parmainitiative.com/*
// @match        *://nevelskoygroup.com/*
// @match        *://kugahi.com/*
// @match        *://chandlertallowmd.com/*
// @match        *://ot38.club/*
// @match        *://kugaheavyindustry.com/*
// @match        *://drchandlertallow.com/*
// @match        *://rarepotato.com/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/435289/Survivio%20-%20Dark%20Theme%20%20Custom%20Background.user.js
// @updateURL https://update.greasyfork.org/scripts/435289/Survivio%20-%20Dark%20Theme%20%20Custom%20Background.meta.js
// ==/UserScript==


(function() {
    'use strict';
var left = document.querySelector('#modal-how-to-play');
left.innerHTML = `<div class="frog">
    <div class="modal-header" style="height: 80px;">
        <span class="close close-corner" style="margin-top: 30px;margin-right: 5px;">
        </span>
        <h2 data-l10n="index-settings" style="margin-top: 30px;text-align: left;font-size: 30px;font-weight: bolder;margin-left: 130px;">Custom Background</h2>
        <h2 data-l10n="index-settings" style="margin-top: -42px;text-align: right;font-size: 20px;font-weight: 100;margin-right: 135px;">ver1.3</h2>
    </div>

<div class="wrapper">
<div class="maps">

    <div class="bg classic">
        <img src="https://raw.githubusercontent.com/Samer-Kizi/Surviv.io_Darktheme/icon/crate-01.png" alt="" class="map-img" style="width: 100px;height: 100px;">
    </div>
    <div class="bg cobalt">
        <img src="https://raw.githubusercontent.com/Samer-Kizi/Surviv.io_Darktheme/icon/class-shell-03a.png" alt="" class="map-img" style="width: 100px;height: 100px;">
    </div>
    <div class="bg desert">
        <img src="https://raw.githubusercontent.com/Samer-Kizi/Surviv.io_Darktheme/icon/crate-18.png" alt="" class="map-img" style="width: 100px;height: 100px;">
    </div>
    <div class="bg halloween">
        <img src="https://raw.githubusercontent.com/Samer-Kizi/Surviv.io_Darktheme/icon/pumpkin-02.png" alt="" class="map-img" style="width: 100px;height: 100px;">
    </div>
    <div class="bg faction">
        <img src="https://raw.githubusercontent.com/Samer-Kizi/Surviv.io_Darktheme/icon/airdrop-03.png" alt="" class="map-img" style="width: 100px;height: 100px;">
    </div>
    <div class="bg savannah">
        <img src="https://raw.githubusercontent.com/Samer-Kizi/Surviv.io_Darktheme/icon/crate-21.png" alt="" class="map-img" style="width: 100px;height: 100px;">
    </div>
    <div class="bg spring">
        <img src="https://raw.githubusercontent.com/Samer-Kizi/Surviv.io_Darktheme/icon/bush-07sp.png" alt="" class="map-img" style="width: 100px;height: 100px;">
    </div>
    <div class="bg winter">
        <img src="https://raw.githubusercontent.com/Samer-Kizi/Surviv.io_Darktheme/icon/crate-02a.png" alt="" class="map-img" style="width: 100px;height: 100px;">
    </div>
    </div>
</div>




`;

var wrapper = document.querySelector('.wrapper');
wrapper.setAttribute("style", "width: 100%; overflow-y: scroll; height: 100%;text-align: center; box-sizing: border-box;padding:50px;" );

var maps = document.querySelector('.maps');
maps.setAttribute("style", "display: flex; flex-wrap: wrap; box-sizing: border-box;margin-top:-20px;");

left.setAttribute("style", "height:400px;width:600px; box-sizing: border-box;margin-block:175px;margin-inline:375px;");

var bg = document.querySelectorAll('.bg');
bg.forEach(item => {item.setAttribute("style", "flex-grow: 1; flex-basis: 25%; cursor: pointer; box-sizing: border-box;margin-top:15px;")})


function addStyleString(str) {
  var node = document.createElement('style');
  node.innerHTML = str;
  document.body.appendChild(node);
}


function removeBorder() {
  bg.forEach(item => { item.classList.remove('active') })
}
bg.forEach(function (item) {
        var background = document.querySelector('#background');
        item.addEventListener('click', function () {

            if (item.className == "bg classic") {
                background.style = "filter:brightness(100%);background-image:url('https://raw.githubusercontent.com/Samer-Kizi/Surviv.io_UserMods/background/splash_river_1920x1080.png');";
                removeBorder();
                item.className += " active";
            }
            if (item.className == "bg cobalt") {
                background.style = "filter:brightness(100%);background-image:url('https://media.discordapp.net/attachments/882591502574968863/884616394388439050/Cobalt.png?width=1920&height=1080');";
                removeBorder();
                item.className += " active";
            }
            if (item.className == "bg desert") {
                background.style = "filter:brightness(100%);background-image:url('https://i.imgur.com/W5DJa5i.png')";
                removeBorder();
                item.className += " active";
            }
            if (item.className == "bg halloween") {
                background.style = "filter:brightness(100%);background-image:url('https://media.discordapp.net/attachments/882591502574968863/884625342600458240/Main_splash_Halloween.png?width=1920&height=1080')";
                removeBorder();
                item.className += " active";
            }
            if (item.className == "bg faction") {
                background.style = "filter:brightness(100%);background-image:url('https://media.discordapp.net/attachments/882591502574968863/884625291413172285/Main_splash_50v50.png?width=1920&height=1080')";
                removeBorder();
                item.className += " active";
            }
            if (item.className == "bg savannah") {
                background.style = "filter:brightness(100%);background-image:url('https://media.discordapp.net/attachments/882591502574968863/884615732367855677/unknown.png?width=1920&height=1080')";
                removeBorder();
                item.className += " active";
            }
            if (item.className == "bg spring") {
                background.style = "filter:brightness(100%);background-image:url('https://media.discordapp.net/attachments/882591502574968863/884625418206978048/Main_splash_Spring.png?width=1920&height=1080')";
                removeBorder();
                item.className += " active";
            }
            if (item.className == "bg winter") {
                background.style = "filter:brightness(100%);background-image:url('https://media.discordapp.net/attachments/882591502574968863/884625382924517386/Main_splash_Snow.png?width=1920&height=1080')";
                removeBorder();
                item.className += " active";
            }
        });
    });
})();



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
document.getElementById("background").style = "filter:brightness(100%);background-image:url(https://raw.githubusercontent.com/Samer-Kizi/Surviv.io_UserMods/background/splash_river_8k.png);";
document.getElementById("start-menu").style = "display:none;";
document.getElementById("free-gp-offer").style = "display:none;opacity:0;";
document.getElementById("missions-name").style = "background-image:none";
document.getElementById("missions-wrapper").style = "margin-block:155px;";
document.getElementById("social-share-block").style = "display:none;";
document.getElementById("pass-block").style = "background-color:rgb(0 0 0 / 20%);border-radius:0;";
document.getElementById("start-row-header").style = "display:none;";
document.getElementById("btn-support").style = "display:none;";
document.getElementById("modal-body-warning").style = "background:rgb(255 255 255 / 0%);";
document.getElementById("start-top-left").style = "display:none;";

document.getElementById("prestige-loading").style = "color:rgb(0 0 0 / 70%);";
document.getElementById("start-row-top").style = "margin-left:250px;margin-block:200px;";
document.getElementById("squad-boost-perc").style = "display:none;";
document.getElementById("btn-team-leave").style = "background-color:#221E23;box-shadow:none;border-bottom:2px solid #010003;border-radius:0px;";
document.getElementById("boost-warning").style = "background:rgb(34 30 35);padding:5px;opacity:0.2;font-size:16px;margin-block-start:0px;display:block;";
document.getElementById("xp-team-text").style = "display:none;";
document.getElementById("team-menu-members").style = "margin-block:77px;";
document.getElementById("team-menu-columns").style = "margin-block:150px;margin-inline:-100px";
document.getElementById("invite-code-text").style = "opacity:0;";
document.getElementById("invite-link-text").style = "opacity:0;";
document.getElementById("team-url").style = "background:rgb(255 255 255 / 50%);border-radius:0;width:550px;margin-left:-138px;";
document.getElementById("team-hide-url").style = "margin-inline:5000px";
document.getElementById("team-code").style = "width:0px;font-size:0px;";
document.getElementById("team-link-input").style = "width:550px;border-radius:0px;margin-left:-195px;color:rgb(255 255 255 / 70%);";
document.getElementById("msg-wait-reason").style = "margin-bottom:47px;";

document.getElementById("ui-spectate-video-ad-container-desktop").style = "display:none;margin-block:-5000px;opacity:0;";
document.getElementById("ui-spectate-ad-container-desktop").style = "display:none;margin-block:-5000px;opacity:0;";
document.getElementById("pass-buy-btn-spectate").style = "display:none;";
document.getElementById("ui-stats-ad-container-desktop").style = "display:none;";

document.getElementById("modal-customize-cat-title").style = "opacity:0;";
document.getElementById("modal-customize-sort").style = "display:none;";
document.getElementById("modal-customize-header").style = "border-radius:0px;background-color:rgba(0,0,0,0.08);"
document.getElementById("modal-customize-footer").style = "border-radius:0px;background-color:rgba(0,0,0,0.08);";
document.getElementById("modal-customize-unlocks").style = "display:none;";
document.getElementById("button-sell-item").style = "background-color:#221E23;box-shadow:none;border-bottom:2px solid #010003;border-radius:0px;";
document.getElementById("modal-customize-item-sell-container").style = "background-color:rgba(0,0,0,0.08);";
document.getElementById("modal-customize-item-header").style = "display:none;";
document.getElementById("modal-customize-body").style = "background-color:rgba(0,0,0,0.08);";
document.getElementById("modal-customize-list").style = "background-color:rgba(0,0,0,0);";

document.getElementById("market-change-type").style = "background-color:#221E23;box-shadow:none;border-bottom:2px solid #010003;border-radius:0px;";
document.getElementById("market-change-rarity").style = "box-shadow:none;border-bottom:2px solid #010003;border-radius:0px;";
document.getElementById("market-change-sort").style = "background-color:#221E23;box-shadow:none;border-bottom:2px solid #010003;border-radius:0px;";
document.getElementById("market-change-mode").style = "background-color:#221E23;box-shadow:none;border-bottom:2px solid #010003;border-radius:0px;";

document.getElementById("btn-help").style = "background-color:#221E23;box-shadow:none;border-bottom:2px solid #010003;border-radius:0px;";
document.getElementById("btn-news").style = "background-color:#221E23;box-shadow:none;border-bottom:2px solid #010003;border-radius:0px;margin-block:2.5px;";
document.getElementById("news-block").style = "border-radius:0px;";
document.getElementById("open-arena-button").style = "margin-inline:-20px;";

document.getElementById("modal-prestige-body").style = "background:rgba(250,250,250,0.3);";
document.getElementById("modal-battle-window").style = "background:rgba(250,250,250,0);";
document.getElementById("modal-prestige-wrapper").style = "margin-inline:-55px;";

document.getElementById("btn-game-fullscreen").style = "box-shadow:none;border-radius:0px;background:rgba(250,250,250,0.3);border-bottom:none;background-image:url(../img/gui/minimize.svg);background-size:34px;background-position:4px 2px;background-repeat:no-repeat;";
document.getElementById("btn-game-sound").style = "box-shadow:none;border-radius:0px;background:rgba(250,250,250,0.3);border-bottom:none;background-image:url(../img/gui/audio-on.svg);background-size:34px;background-position:4px 2px;background-repeat:no-repeat;";
document.getElementById("btn-game-quit").style = "box-shadow:none;border-radius:0px;background:rgba(250,250,250,0.3);border-bottom:none;background-image:url(../img/gui/quit.svg);background-size:34px;background-position:4px 2px;background-repeat:no-repeat;";
document.getElementById("btn-game-resume").style = "box-shadow:none;border-radius:0px;background:rgba(250,250,250,0.3);border-bottom:none;background-image:url(../img/gui/resume.svg);background-size:34px;background-position:4px 2px;background-repeat:no-repeat;";
document.getElementById("btn-game-settings").style = "border-radius:0px;";
document.getElementById("btn-game-keybinds").style = "border-radius:0px;";

document.getElementById("ui-stats-contents-inner").style = "background-color:rgba(0,0,0,0);";
document.getElementById("ui-stats-header").style = "opacity:0;";

document.getElementById("btn-help").textContent = "Change BG";

}

GM_addStyle(`
#modal-prestige-arena #modal-prestige-wrapper #modal-prestige-header #prestige-game-summary-button.selected, #modal-prestige-arena #modal-prestige-wrapper #modal-prestige-header #prestige-create-button.selected, #modal-prestige-arena #modal-prestige-wrapper #modal-prestige-header #prestige-spectate-button.selected, #modal-prestige-arena #modal-prestige-wrapper #modal-prestige-header #prestige-battle-button.selected{
background-color:rgba(250,250,250,0.3);
}
#modal-prestige-arena #modal-prestige-wrapper #modal-prestige-header #prestige-battle-button{
background-image:none;
}
#modal-prestige-arena #modal-prestige-wrapper #modal-prestige-header #prestige-game-summary-button, #modal-prestige-arena #modal-prestige-wrapper #modal-prestige-header #prestige-create-button, #modal-prestige-arena #modal-prestige-wrapper #modal-prestige-header #prestige-spectate-button, #modal-prestige-arena #modal-prestige-wrapper #modal-prestige-header #prestige-battle-button{
background:#221E23;
}
#modal-prestige-arena #modal-prestige-wrapper #modal-prestige-header #prestige-game-summary-button{
background-image:none;

}
.account-buttons-wrapper{
right:18px;
}
.account-name-user{
margin-left:15px;
}
#modal-prestige-arena #modal-prestige-wrapper #modal-prestige-body .modal-prestige-body-inner{
background:rgba(250,250,250,0);
border-radius:0px;
box-shadow:none;

}
#modal-prestige-arena #modal-prestige-wrapper #modal-prestige-body .modal-prestige-body-inner #modal-summary-window .input-group .battle-summary-entry, #modal-prestige-arena #modal-prestige-wrapper #modal-prestige-body .modal-prestige-body-inner #modal-battle-window .input-group .battle-summary-entry, #modal-prestige-arena #modal-prestige-wrapper #modal-prestige-body .modal-prestige-body-inner #modal-summary-window .input-group .battle-link-entry, #modal-prestige-arena #modal-prestige-wrapper #modal-prestige-body .modal-prestige-body-inner #modal-battle-window .input-group .battle-link-entry {
background:rgba(250,250,250,0.7);
height:45px;
color:rgba(0,0,0,0.7);
font-weight:bolder;
font-size:17px;

}
#modal-prestige-arena #modal-prestige-wrapper #modal-prestige-body .modal-prestige-body-inner #modal-summary-window .input-group #battle-search-button-2, #modal-prestige-arena #modal-prestige-wrapper #modal-prestige-body .modal-prestige-body-inner #modal-battle-window .input-group #battle-search-button-2, #modal-prestige-arena #modal-prestige-wrapper #modal-prestige-body .modal-prestige-body-inner #modal-summary-window .input-group #battle-search-button, #modal-prestige-arena #modal-prestige-wrapper #modal-prestige-body .modal-prestige-body-inner #modal-battle-window .input-group #battle-search-button {
height:45px;
width:45px;
}
#modal-prestige-arena #modal-prestige-wrapper #modal-prestige-body .modal-prestige-body-inner{
height:auto;
}
#modal-prestige-arena #modal-prestige-wrapper #modal-prestige-body .modal-prestige-body-inner #modal-summary-window .battle-mode, #modal-prestige-arena #modal-prestige-wrapper #modal-prestige-body .modal-prestige-body-inner #modal-battle-window .battle-mode{
color:white;
background:#221E23;
border-radius:0px;
}
#modal-prestige-arena #modal-prestige-wrapper #modal-prestige-body .modal-prestige-body-inner #modal-summary-window .button-group, #modal-prestige-arena #modal-prestige-wrapper #modal-prestige-body .modal-prestige-body-inner #modal-battle-window .button-group{
display:none;
}
#modal-prestige-arena #modal-prestige-wrapper #modal-prestige-body .modal-prestige-body-inner #modal-summary-window .battle-type, #modal-prestige-arena #modal-prestige-wrapper #modal-prestige-body .modal-prestige-body-inner #modal-battle-window .battle-type{
color:white;
background:#221E23;
border-radius:0px
}
.account-details-block{
height:43px;
margin-block:2.5px;
right:10px;
margin-inline:20px;
}
.btn-open-arena{
font-size:0px;
background-position:center;
width:80px;
}
.news-toggle {
font-size:0px;
background-position:center;
width:29px;
}
.ui-stats-ad-container{
top:5000px;
opacity:0;
}
#ui-game-tab-keybinds > .btn-keybind-restore{
box-shadow:none;
border-radius:0px;
background:rgba(250,250,250,0.3);
border-bottom:none;
}
.ui-keybind-container>.btn-keybind-desc{
box-shadow:none;
border-radius:0px;
background:rgba(250,250,250,0.3);
border-bottom:none;
}
#modal-news>.modal-content>.modal-body{
background-color:rgba(250,250,250,0.05);
}
.modal-body {
background-color:rgba(250,250,250,0.05);
}
.btn-keybind{
background-color:#221E23;
box-shadow:none;
border-bottom:2px solid #010003;
border-radius:0px;
}
#btn-start-fullscreen{
background-color:#221E23;
box-shadow:none;
border-bottom:2px solid #010003;
border-radius:0px;
}
.btn-start-mute{
background-color:#221E23;
box-shadow:none;
border-bottom:2px solid #010003;
border-radius:0px;
}
.btn-settings{
background-color:#221E23;
box-shadow:none;
border-bottom:2px solid #010003;
border-radius:0px;
}
.market-container{
background:rgba(0,0,0,0.08);
}
.market-container .market-items-list-container {
background:rgba(0,0,0,0.08);
}
.market-list-item-container{
background:rgba(0,0,0,0.08);
}
.market-list-item-container .market-item-info-container .market-item-stats-container .market-item-stats-text p{
color:rgba(250,250,250,0.5);
}
#market-modal-sell-item .modal-content .modal-body, #market-modal-buy-item .modal-content .modal-body, #market-modal-notification .modal-content .modal-body{
background:rgba(250,250,250,.1);
}
#market-modal-sell-item .modal-content .modal-body .market-modal-sell-item-container, #market-modal-buy-item .modal-content .modal-body .market-modal-sell-item-container, #market-modal-notification .modal-content .modal-body .market-modal-sell-item-container {
background:rgba(250,250,250,.1);
}
.modal{
overflow:unset;
}
.modal-footer{
background:rgba(250,250,250,.1);
}
#market-modal-sell-item .modal-content .modal-body .market-modal-price-container, #market-modal-buy-item .modal-content .modal-body .market-modal-price-container, #market-modal-notification .modal-content .modal-body .market-modal-price-container{
background:rgba(250,250,250,.1);
background-image:none;
}
#market-modal-sell-item .modal-content .modal-body .market-modal-price-container .market-modal-price, #market-modal-buy-item .modal-content .modal-body .market-modal-price-container .market-modal-price, #market-modal-notification .modal-content .modal-body .market-modal-price-container .market-modal-price{
background-image:none;
color:white;
}
.btn-modal-confirm{
background-color:#221E23;
box-shadow:none;
border-bottom:2px solid #010003;
border-radius:0px;
}
.btn-modal-confirm span {
color:#fff;
}
.market-list-item-container .market-item-action-container .market-item-action-btn{
background-color:#221E23;
box-shadow:none;
border-bottom:2px solid #010003;
border-radius:0px;
}
.btn-market-filter-gray{
background-color:#221E23;
box-shadow:none;
border-bottom:2px solid #010003;
border-radius:0px;
}
.market-change-selection div .right-market-btn{
background-color:#221E23;
box-shadow:none;
border-radius:0px;
}
.close-corner{
display:block;
}
#iap-modal .iap-screen .iap-container .iap-limited-offers{
background:rgba(0,0,0,0.08);
}
#iap-modal .iap-screen .iap-container .iap-limited-offers .iap-lto-packs-container .iap-lto-pack .iap-discount{
opacity:0
}
#iap-modal .iap-screen .iap-container .iap-limited-offers .iap-lto-packs-container .iap-lto-pack{
background-color:#221E23;
box-shadow:none;
border-bottom:2px solid #010003;
border-radius:0px;
}
#iap-modal .iap-screen .iap-container .iap-limited-offers .iap-lto-packs-container .iap-lto-pack .iap-lto-item-container{
background:rgba(255,255,255,0);
}
#iap-modal .iap-screen .iap-container .iap-limited-offers .iap-lto-title-container .iap-lto-time-left-text{
color:rgba(255,255,255,.8);
}
#iap-modal .iap-screen .iap-container .iap-limited-offers .iap-lto-packs-container .iap-lto-pack {
height:320px;
}
#iap-modal .iap-screen .iap-container .iap-gp .iap-gp-packs-container .iap-gp-pack{
background-color:#221E23;
box-shadow:none;
border-bottom:2px solid #010003;
border-radius:0px;
}
#iap-modal .iap-screen .iap-container .iap-gp .iap-gp-packs-container .iap-gp-pack .iap-gp-item-container{
background:rgba(255,255,255,0);
}
.market-container{
background-color:none;
}

.btn-offerwall-shop .btn-offerwall{
background-color:#221E23;
box-shadow:none;
border-bottom:2px solid #010003;
border-radius:0px;
}
#crates-modal .crates-screen .crates-container .crate-display .crate-spinner{
display:none;
}
.btn-offerwall-container{
background:none;
box-shadow:none;
}
.modal-content-right{
background:rgba(0,0,0,0.08);
border:none;
border-radius:0px;
}
.modal-customize-cat{
background-color:rgba(0,0,0,0.08);
box-shadow:none;
border-radius:0px;
}
.modal-customize-cat-connect-selected{
opacity:0;
}
::-webkit-scrollbar{
display:none;
}
::-webkit-scrollbar-thumb{
border-radius:0px;
box-shadow:none;
}
::-webkit-scrollbar-track{
border-radius:0px;
box-shadow:none;
}

.modal-content-shadow{
box-shadow:10px 10px 8px 0 rgb(0 0 0 / 0%);
}

#modal-customize-close span.close-corner{
display:none;
}
.modal-account>.modal-content>.modal-footer-name{
opacity:0.8;
border-radius:0px;
}
.modal-account>.modal-content>.modal-body-name{
opacity:0.8;
border-radius:0px;
}
.modal-account>.modal-content>.modal-header-name{
opacity:0.8;
border-radius:0px;
}
.modal-account>.modal-content .close-corner{
display:none;
}
.modal-account>.modal-content #modal-account-name-title{
text-align:center;
}
#modal-account-name-change .player-name-input{
border-radius:0px;
}
.modal-account>.modal-content>.modal-header-reset-stats, .modal-account>.modal-content .modal-header-delete{
opacity:0.8;
border-radius:0;
}
.player-name-input{
background-color:rgb(255 255 255 / 50%);
border-radius:0;
color:rgb(0 0 0 / 70%);
}
.modal-account>.modal-content>.modal-footer-reset-stats, .modal-account>.modal-content .modal-footer-delete {
opacity:0.8;
border-radius:0;
}
.modal-account>.modal-content>.modal-footer>.finish{
background-color:#221E23;
box-shadow:none;
border-bottom:2px solid #010003;
border-radius:0px;
}
.modal-header{
background-color:#221E23;
box-shadow:none;
border-bottom:2px solid #010003;
border-radius:0px;
}
#modal-settings .modal-header{
background-color:#221E23;
box-shadow:none;
border-bottom:2px solid #010003;
border-radius:0px;
}
#modal-how-to-play{
background-color:rgba(0,0,0,0.3);
}
#modal-how-to-play>.modal-content>.modal-header{
background-color:#221E23;
box-shadow:none;
border-bottom:2px solid #010003;
border-radius:0px;
}
#modal-news>.modal-content>.modal-header{
background-color:#221E23;
box-shadow:none;
border-bottom:2px solid #010003;
border-radius:0px;
}
#modal-how-to-play>.modal-content>.modal-body{
background-color:rgba(250,250,250,0.05);
box-shadow:none;
border-radius:0px;
}
#modal-news>.modal-content>.modal-body{
background-color:rgba(250,250,250,0.05);
box-shadow:none;
border-radius:0px;
}
#team-menu .modal-header{
display:none;
}
#modal-customize-header {
opacity:1;
}


.trainee-block {
display:none;
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
.account-details-link-out{
background-image:none;
background-color:#221E23;
box-shadow:none;
border-bottom:2px solid #010003;
border-radius:0px;
}
.server-select{
background-color:#221E23;
box-shadow:none;
border-bottom:2px solid #010003;
border-radius:0px;
}
.ad-block-leaderboard-bottom{
display:none;
}
.ad-block-med-rect{
display:none;
}
.ad-block-left-bottom{
display:none;
}
.index-offer-time-left-text{
opacity:0;
}
.btn-open-iap{
background-color:#221E23;
box-shadow:none;
border-bottom:2px solid #010003;
border-radius:0px;
}
.animated-loadout>.character-container{
display:none;
}
.btn-login-facebook{
background-color:#221E23;
box-shadow:none;
border-bottom:2px solid #010003;
border-radius:0px;
}
.btn-login-facebook>.login-button-name>.icon{
background-image:none;
}
.login-button-name>.icon::after{
display:none;
}
.login-button-name{
margin-left:0;
text-shadow:none;
}
.btn-login-google{
background-color:#221E23;
box-shadow:none;
border-bottom:2px solid #010003;
border-radius:0px;
}
.btn-login-google>.login-button-name>.icon{
display:none;
}
.btn-login-twitch{
background-color:#221E23;
box-shadow:none;
border-bottom:2px solid #010003;
border-radius:0px;
}
.btn-login-twitch>.login-button-name>.icon{
display:none;
}
.btn-login-discord{
background-color:#221E23;
box-shadow:none;
border-bottom:2px solid #010003;
border-radius:0px;
}
.btn-login-discord>.login-button-name>.icon{
display:none;
}
.btn-login-apple{
background-color:#221E23;
box-shadow:none;
border-bottom:2px solid #010003;
border-radius:0px;
}
.btn-login-apple>.login-button-name>.icon{
display:none;
}
.btn-login-steam{
background-color:#221E23;
box-shadow:none;
border-bottom:2px solid #010003;
border-radius:0px;
}
.btn-login-steam>.login-button-name>.icon{
display:none;
}
.btn-login-linked{
background-size:20px;
background-position-x:50%;
}
.notLogged{
background-color:#221E23;
box-shadow:none;
border-bottom:2px solid #010003;
border-radius:0px;
}
.island-text p{
display:none;

}
.menu-block{
background-color:rgba(0,0,0,0);
}
.account-alert:before{
display:none;
}
.account-alert:after{
display:none;
}
.animated-loadout .btn-prestige p span{
color:rgb(0 0 0 / 70%)
}
.animated-loadout .btn-green, .animated-loadout .btn-prestige{
width:56px;

}
.animated-loadout .btn-prestige{
background:rgb(255 255 255 / 50%);
border-radius:0;
width:340px;
margin-bottom:-55px;
margin-right:95px;
}
.btn-green{
background-color:#221E23;
box-shadow:none;
border-bottom:2px solid #010003;
border-radius:0px;
}
.btn-prestige{
margin-bottom:100px;
}
.animated-loadout .btns-container{
margin-top:140px;
}
.animated-loadout .user-new-prestige{
opacity:0;
}
.animated-loadout .btn-green p, .animated-loadout .btn-prestige p{
font-size:0;
margin-top:27.5px;
letter-spacing:7.5px;
}
.animated-loadout #prestige-loadin {
margin-top:12.5px;
}
.btn-green.btn-darken.menu-option.account-loadout-link{
background-image:url("img/gui/emote.svg");
background-repeat:no-repeat;
background-size:50px;
background-position-x:5px;
background-position-y:2px;
background-color:#FF000000;
box-shadow:none;
border-bottom:none;
border-radius:0;
}
.btn-battle-container {
background-color:none
box-shadow:none;
border-radius:0px;
}
.btn-battle{
-webkit-animation-name:none;
}
.btn-team-option{
background-color:#221E23;
box-shadow:none;
border-bottom:2px solid #010003;
border-radius:0px;
}
.account-loading-container{
display:none;
}
.pass-quest-xp{
font-size:16px;
}
.btn-change-mode-selection div .right-play-btn{
background-color:#221E23;
box-shadow:none;
border-bottom:2px solid #010003;
border-radius:0px;
}
.btn-change-type-selection div .right-play-btn{
background-color:#221E23;
box-shadow:none;
border-bottom:2px solid #010003;
border-radius:0px;
}
.btn-change-type-selection{
max-height:500px;
}
.btn-change-mode-selection {
max-height:500px;
}
.xp-boost-bar-container{
display:none;
}
.menu-team-autofill-option{
background-color:#221E23;
box-shadow:none;
border-bottom:2px solid #010003;
border-radius:0px;
height:45px;
}
.btn-team-fill{
background:#0000;
}
.team-menu-member{
display:block;
height:0px;
background:rgb(255 255 255 / 0%);
vertical-align:none;
}
.member-boost-value {
display:none;
}
.member-name-placeholder {
display:none;
}
.copy-toast{
font-size:12px;
color:rgb(255 255 255 / 50%);
}
#team-desc-text span{
color:rgb(0 0 0 / 70%);
}
.copy-item{
background-color:#221E23;
box-shadow:none;
border-bottom:2px solid #010003;
border-radius:0px;
width:173px;
}
.hide-item{
display:none;
}
.hide-item btn-darken{
display:none;
}
#team-code-text{
margin-block:-55px;
}
#btn-team-mobile-link-join{
margin-left:14px;
}
.name-self{
color:rgba(255, 255, 255, 0.7);
background:rgba(255,255,255,.2);
}
#pass-block.stimfield-bonus{
border:5px solid rgb(255 255 255 / 50%);
}
.pass-stimfield-container {
bottom:-52px;
background:rgb(255 255 255 / 50%);
}
.btn-mode-desert{
box-shadow:inset 0 -2px #ffffff00!important;
}
.team-menu-member>.icon-kick {
background-color:#221E23;
box-shadow:none;
border-bottom:2px solid #010003;
border-radius:0px;
width:173px;
height:65px;
margin-inline:0px;
margin-block:-90px;
background-position:center;
}
.team-menu-member>.icon-leader{
background-color:#221E23;
box-shadow:none;
border-bottom:2px solid #010003;
border-radius:0px;
width:173px;
height:65px;
margin-inline:0px;
margin-block:-90px;
background-position:center;
background-size:40px;
}
.name{
margin-block:-196px;
border-radius:0px;
}
.team-menu-member>.icon{

}
.team-menu-member{
display:inline-table;
}
.gwd-page-container{
display:none;
`);