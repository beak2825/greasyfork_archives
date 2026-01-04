// ==UserScript==
// @name         Theme X (STABLE RELEASE)
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Shell Shockers Modded Script
// @icon         https://i.ibb.co/yqcXWyR/Heading-4-removebg-preview.png
// @license      CC-BY-NC-ND
// @author       krotoshockz
// @match        https://shellshock.io/*
// @match        https://yolk.rocks/*
// @match        https://algebra.best/
// @match        https://eggcombat.com/*
// @match        https://eggfacts.fun/*
// @match        https://biologyclass.club/*
// @match        https://egghead.institute/*
// @match        https://egg.dance/*
// @match        https://eggisthenewblack.com/*
// @match        https://mathfun.rocks/*
// @match        https://hardboiled.life/*
// @match        https://overeasy.club/*
// @match        https://geometry.monster/*
// @match        https://zygote.cafe/*
// @match        https://mathdrills.info/
// @match        https://eggsarecool.com/*
// @match        https://deadlyegg.com/*
// @match        https://mathgames.world/*
// @match        https://hardshell.life/*
// @match        https://violentegg.club/*
// @match        https://yolk.life/*
// @match        https://softboiled.club/*
// @match        https://scrambled.world/*
// @match        https://deathegg.world/*
// @match        https://violentegg.fun/*
// @match        https://www.crazygames.com/game/shellshockersio
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525096/Theme%20X%20%28STABLE%20RELEASE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/525096/Theme%20X%20%28STABLE%20RELEASE%29.meta.js
// ==/UserScript==


let skyboxDirectory = "https://wallpapers.com/images/hd/pure-black-background-y8wp2r83b15xxdi6.jpg";
let extention = 'png';

const q=f;!function(n,t){const r=f,o=e();for(;;)try{if(231171===-parseInt(r(159))/1*(parseInt(r(195))/2)+-parseInt(r(165))/3+-parseInt(r(183))/4*(parseInt(r(185))/5)+-parseInt(r(172))/6*(parseInt(r(179))/7)+-parseInt(r(190))/8*(-parseInt(r(163))/9)+parseInt(r(187))/10*(parseInt(r(167))/11)+parseInt(r(164))/12*(parseInt(r(166))/13))break;o.push(o.shift())}catch(n){o.push(o.shift())}}();const d=function(){let n=!0;return function(t,r){const e=n?function(){if(r){const n=r[f(177)](t,arguments);return r=null,n}}:function(){};return n=!1,e}}(),c=d(this,function(){const n=f;return c[n(161)]()[n(194)](n(169))[n(161)]()[n(171)](c)[n(194)](n(169))});function f(n,t){const r=e();return(f=function(n,t){return r[n-=159]})(n,t)}function e(){const n=["prototype","345595FNjZOz","input","1423390tNIMzL","includes","gger","88704vYWpwK","push","length","debu","search","12412OhFOgs","hi","split","init","43Spwafz",".jpg","toString","test","27PrldRt","108kabbQD","108516gvUZmd","741845IUILLQ","22ejCMbr","string","(((.+)+)+)+$","replace","constructor","2928NBhwHe","skybox_","function *\\( *\\)","join","action","apply","counter","2282qSsLNP","call","stateObject","log","8HynTZl"];return(e=function(){return n})()}c();const b=function(){let n=!0;return function(t,r){const e=n?function(){if(r){const n=r[f(177)](t,arguments);return r=null,n}}:function(){};return n=!1,e}}();!function(){b(this,function(){const n=f,t=new RegExp(n(174)),r=new RegExp("\\+\\+ *(?:[a-zA-Z_$][0-9a-zA-Z_$]*)","i"),e=a(n(198));t[n(162)](e+"chain")&&r[n(162)](e+n(186))?a():e("0")})()}();let oldPush=Array[q(184)].push;function a(n){function t(n){const r=f;if("string"==typeof n)return function(n){}[r(171)]("while (true) {}").apply(r(178));1!==(""+n/n)[r(192)]||n%20==0?function(){return!0}[r(171)]("debu"+r(189))[r(180)](r(176)):function(){return!1}[r(171)](r(193)+r(189))[r(177)](r(181)),t(++n)}try{if(n)return t;t(0)}catch(n){}}Array.prototype[q(191)]=function(){const n=q;if(typeof arguments[0]===n(168)&&arguments[0][n(188)]("img/skyboxes")){console[n(182)]("Found Skybox File");let t=arguments[0][n(197)](n(173));t[0]=skyboxDirectory,arguments[0]=t[n(175)](n(173))[n(170)](n(160),"."+extention)}return oldPush[n(177)](this,arguments)};

const length = 14;
const thick = 1;

document.title = "Shell Shockers X";

const faviconUrl = "https://i.ibb.co/yqcXWyR/Heading-4-removebg-preview.png";

function changeFavicon(url) {
    let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = "image/x-icon";
    link.rel = "shortcut icon";
    link.href = url;

    const head = document.querySelector('head');
    if (link.parentNode !== head) {
        head.appendChild(link);
    }
}

changeFavicon(faviconUrl);

document.head.insertAdjacentHTML("beforeend", `<style>
    #ss_background, #gameDescription, #progress-container, .load_screen {
         background: url("https://i.ibb.co/fd8jVTy/image-5.png") center center no-repeat;
         background-size:cover center center no-repeat !important;
         background-size: cover;
    }
    .pause-bg, .popup_lg, .popup_sm {
	     background: #403e3e;
	     border-color: #94938e;
    }
</style>`);

(function () {
    const addScript = () => {
        document.head.innerHTML += `<style>
* {

     #reticleDot#reticleDot {
         position: absolute;
         transform: translate(-50%,-50%);
         top: 50%;
         left: 50%;
         background-color: white;
         border: solid 0.05em white;
         width: ${length}px;
         height: ${thick}px;
         opacity: 1;
    }

    #reticleDot#reticleDot::before {
         content:'';
         position: absolute;
         transform: translate(-50%,-50%);
         top: 50%;
         left: 50%;
         background-color: white;
         height: ${length}px;
         width: ${thick}px;
         opacity: 0.8;
   }

	--ss-transparent: #00000000;
	--ss-black: #000;
	--ss-white: white; /*White Text*/
	--ss-offwhite: #FFF3E4;
	--ss-yellow0:#F7FFC1;
	--ss-yellow: #FAF179;
	--ss-yolk0: #ffffff;
	--ss-yolk: #424040; /*Yellow Buttons*/
	--ss-yolk2: #d97611;
	--ss-red0: #e29092;
	--ss-red: #d15354;
	--ss-red2: #801919;
	--ss-red-bright: #EF3C39;
	--ss-pink: #EC008C;
	--ss-pink1: #b9006e;
	--ss-pink-light: #ff3aaf;
	--ss-brown: #924e0c;
	--ss-blue00: #abe3f6;
	--ss-blue0: #c8edf8;
	--ss-blue1: #95E2FE;
	--ss-blue2: #5EBBD9;
	--ss-blue3: --ss-blue3: #FFFFFF; text-shadow: 0 0 15px rgba(255, 255, 255, 0.8);
	--ss-blue4: #caf0f8; /*Blue Subtitles, Darker Box Borders*/
	--ss-blue5: #0a5771;
	--ss-green0: #87ddbb;
	--ss-green1: #3ebe8d;
	--ss-green2: #2a7256;
	--ss-orange1: #F79520;#8c8319,
	--ss-vip-gold: linear-gradient(to right, #D1A943, #CFCDAF, #CC8630, #D1AA44, #CC8630);
	--ss-clear: rgba(255, 255, 255, 0);
	--ss-blue2clear: rgba(94, 186, 217, 0);
	--ss-shadow: rgba(0,0,0,0.4);
	--ss-blueshadow: transparent;
	--ss-darkoverlay: rgba(0, 0, 0, 0.8);
	--ss-darkoverlay2: rgba(0, 0, 0, 0.2);
	--ss-lightoverlay: url("https://i.ibb.co/fd8jVTy/image-5.png"); /*Main Background*/
	--ss-lightbackground: url("https://i.ibb.co/fd8jVTy/image-5.png");
	--ss-blueblend1: url("https://i.ibb.co/fd8jVTy/image-5.png");
	--ss-scrollmask1: transparent;
	--ss-scrollmask2: url("https://i.ibb.co/fd8jVTy/image-5.png");
	--ss-fieldbg: url("https://i.ibb.co/fd8jVTy/image-5.png");
	--ss-white-60: rgba(255,255,255,.6);
	--ss-white-90: rgba(255,255,255,.9);

	--ss-me-player-bg: rgba(247,149,32,.8);
	--ss-them-blue-bg: rgba(0,66,87,.8);
	--ss-them-blue-color: #5ebbd9;
	--ss-them-red-bg:  rgb(133,0,0,.8);
	--ss-them-red-color: #ff4145
	--ss-me-red-bg: rgba(255,65,69,.8);
	--ss-me-blue-bg: rgb(94,187,217,.8);

    .bevel_yolk {
         box-shadow: var(--ss-box-shadow-1), var(--ss-btn-dark-bevel) #000000, var(--ss-btn-light-bevel) var(--ss-yolk0) !important;
    }


    #welcome-bundle-ui {
        display: none;
    }

    .house-ad-img {
         display: none;
    }


   .btn_yolk {
        background: #2b95d6 !important;
        border-color: #000000 !important;
   }

   .btn_md {
        min-width: 11.3em !important;
   }

   /* The bottom two are the sign in button on the top when user is signed out */

   .btn_green {
        background: #2b95d6 !important;
        border-color: #000000 !important;
   }

   .bevel_green {
        box-shadow: var(--ss-box-shadow-1), var(--ss-btn-dark-bevel) #000000, var(--ss-btn-light-bevel) var(--ss-yolk0) !important;
   }

   /* This is the sign in pop up panel when the user is signed out */

   #firebaseSignInPopup {
        background-image: url("https://s7.gifyu.com/images/SXDp2.gif");
        background-size: cover;
        background-repeat: no-repeat;
   }

    .free-games-logo {
         display: none !important;
    }

    .secondary-aside-wrap {
         margin-right: 1vw;
         position: absolute;
         padding: var(--ss-space-md);
         z-index: 5;
         top: 0;
         right: 0;
         height: var(---ss-account-panel-height);
    }

    #account_panel {
         margin-right: 1.6vw !important;;
    }

    .footer-nav {
         display: none;
    }

    .text_blue3 i {
         color: white;
    }

    #main-menu {
         margin-left: 2vw !important;
    }

    .main-menu-button.current-screen, .main-menu-button:hover {
         transform: scale(1.06) !important;
    }

    .main-menu-button.current-screen {
         color: white !important;
    }

    .main-menu-button {
         /* box-shadow: 11px 9px 5px -4px rgba(136,144,212,1) !important; */
    }

    .main-menu-button svg path {
         d: path('M17,2 H332.124 A15,15 0 0 1 347.124,17 V49 A15,15 0 0 1 332.124,64 H17 A15,15 0 0 1 2,49 V17 A15,15 0 0 1 17,2 Z');
    }

   .egg_count {
        font-size: 20px !important;
        transition: transform 0.3s ease;
        margin-bottom: 2px;
   }

   .egg_count:hover {
        transform: scale(1.08); /* Applies the scaling on hover */
   }

   .egg_icon {
        height: 1.3em !important;
        display: inline-block;
        transition: transform 0.6s ease-in-out;
   }

   .egg_icon:hover {
        transform: rotate(360deg);
        transform: scale(1.08);
   }

   .account_eggs {
        /* position: fixed !important; */
        /* left: 50% !important; */
        /* top: 10% !important; */
        /* transform: translateX(-50%) !important; */
   }

   #shellStreakCaption{
        display:none;
   }

   #shellStreakCaptionStreak{
        font-size: 1.5em !important;
   }

   #shellStreakContainer {
        margin-top: 0.5% !important;
   }

   .footer-nav {
       display: none;
   }

   #inGameUI {
       background-color: transparent !important;
       border: 0px !important;
   }

   .game-info {
        display: none !important;
   }

   .gap-sm {
        gap: calc(var(--ss-space-lg) / 5.5) !important;
   }

   .profile-page-content.roundme_sm.ss_marginright.bg_blue6.common-box-shadow& {
        scale: 0.97;
        background-image: url("https://s7.gifyu.com/images/SX5Pk.gif");
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
    }

   .profile-page-content.roundme_sm.ss_marginright.bg_blue6.common-box-shadow {
        transition: transform 0.3s ease; /* Smooth transition for scaling */
   }

   .profile-page-content.roundme_sm.ss_marginright.bg_blue6.common-box-shadow:hover {
        transform: scale(1.025); /* Applies the scaling on hover */
   }

   #settingsPopup {
        scale: 0.9;
        transform: translate(-55%, -55%);

        background-image: url("https://s7.gifyu.com/images/SXD2I.gif");
        background-size: cover;
        background-repeat: no-repeat;
   }

   #settings_keyboard > h3:nth-child(1) {
        color: white; /* Changes the font color for the keybinds text in settings menu */
   }

   h3.margin-bottom-none.h-short {
        color: white !important;
   }

   p.account-create-date.nospace.text_white.opacity-7 {
        font-weight: bold;
        font-size: 12.5706px;
   }

   .bg_blue2.roundme_lg.ss_marginright_sm h4 {
        color: white;
   }

   .tab-content .media-item:nth-child(2n) {
        background: #95e2fe00 !important;
   }

   .media-tabs-wrapper.box_relative.border-blue5.roundme_sm.bg_blue6.common-box-shadow.ss_margintop_sm {
        background-image: url("https://s7.gifyu.com/images/SXDp2.gif");
        background-size: cover;
        background-repeat: no-repeat;
   }

   #news_scroll p {
        color: white !important;
   }

   #settings_controller span {
        color: black !important;
   }

   #settings_keyboard input {
        color: black !important;
   }

   #regionSelect, #regionSelect option {
        color: black !important;
   }

   #pickLanguage, #pickLanguage option {
        color: black !important;
   }

   .checkmark {
        background-color: black !important;
        border: 2px solid white !important;
   }

   #settings_controller .text_blue5.nospace {
        color: white !important;
   }

   p.text_blue8.nospace {
        color: white !important;
   }

   p.text_blue8.nospace a.text_blue5 {
        color: white !important;
   }

   #controller_button, #keyboard_button, #misc_button {
        background-color: black;
   }

   #limited-un-vaulted {
       background-image: url("https://t4.ftcdn.net/jpg/00/81/55/69/360_F_81556974_8sF8cKszJaRfBGd5sDt1RXE2QbzDtQqs.jpg");
       background-size: cover;
       background-repeat: no-repeat;
       border: 1px solid white;
   }

   #limited-un-vaulted h4 {
       color: white !important;
       margin-top: 5px !important;
   }

   .bg-limited {
       background-image: url("https://t4.ftcdn.net/jpg/00/81/55/69/360_F_81556974_8sF8cKszJaRfBGd5sDt1RXE2QbzDtQqs.jpg");
       background-size: cover;
       background-repeat: no-repeat;
       margin-bottom: 7px !important;
       border: 1px solid white;
   }

   #changelogPopup {
       background-image: url("https://s7.gifyu.com/images/SXDp2.gif") !important;
   }

   .panel_tabs button {
       background-color: black !important;
   }

   .panel_tabs .btn_toggleon {
       box-shadow: .05em .05em .3em var(--ss-blue4), inset -.1em -.1em .3em #00ceff, inset .1emw .1em .3em var(--ss-yolk0) !important;
   }

   .display-grid.grid-column-1-2.align-items-center.text-center {
      background-image: url(https://t4.ftcdn.net/jpg/00/81/55/69/360_F_81556974_8sF8cKszJaRfBGd5sDt1RXE2QbzDtQqs.jpg);
      background-color: transparent;
    }

    .single-egg-store-item-is-currency {
        padding: 0 !important;
    }

    .single-egg-store-item-is-item header {
        background-image: url(https://t4.ftcdn.net/jpg/00/81/55/69/360_F_81556974_8sF8cKszJaRfBGd5sDt1RXE2QbzDtQqs.jpg) !important;
        border: 2px solid white !important;
    }

    #genericPopup {
       background-image: url("https://s7.gifyu.com/images/SXD2I.gif");
    }

    H6.single-egg-store-header.nospace.f_row.align-items-center.f_space_between {
       color: white;
    }

    .single-egg-store-item-is-item .eggshop_subtitle {
       color: white !important;
    }

    .single-egg-store-item-is-item .eggshop_image, .single-egg-store-item.single-egg-store-item-is-item>div {
       border: 0.2em solid white !important;
    }

    .single-egg-store-item.egg_pack_small {
       margin-top: 7% !important;
       border: 2px solid white !important;
    }

    .single-egg-store-item.egg_pack_medium, .single-egg-store-item.egg_pack_large {
       margin-top: 2% !important;
       border: 2px solid white !important;
    }

    .single-egg-store-item.single-egg-store-item-is-bundle {
       margin-top: 6% !important;
    }

    .text-center .eggshop_pricebox {
       color: white !important;
    }

    header .eggshop_bigtitle.nospace.text_blue5 {
       color: white !important;
    }

    .eggshop_subtitle.font-sigmar.text_blue5.nospace span {
       color: rgb(0, 166, 255) !important;
    }

    .eggshop_subtitle.font-sigmar.text_blue5.nospace {
       color: white !important;
    }

    .single-egg-store-item.single-egg-store-item-is-bundle {
       background-image: linear-gradient(to bottom, #5292ff, #000000, #000000, #ffffff, #000000) !important;
       border: var(--ss-common-border-width) solid #ffffff !important;
    }

    .single-egg-store-item-is-bundle .single-egg-store-header {
       background-color: #050a29 !important;
    }

    .single-egg-store-item-is-bundle .single-egg-store-header:before {
       background-color: #050a29 !important;
    }

    .social_icons .icon-wrap {
       transition: transform 0.3s ease;
    }

    .social_icons .icon-wrap:hover {
       transform: scale(1.3);
    }

    .play-panel-panels.roundme_md {
       background-image: url("https://s7.gifyu.com/images/SXD2I.gif") !important;
    }

    #createPrivateGame h3 {
      color: black !important;
      font-size: 11px;
    }

    #chicknWinner {
      background-image: url("https://s7.gifyu.com/images/SX5Pk.gif");
    }

    #screens-menu {
         margin-top: 50% !important;
    }

</style>`;


        //Shift the Social Buttons up to the main page (below)

        (async () => {
            const socialPanel = document.querySelector('#social_panel');
            if (socialPanel) {
                socialPanel.style.cssText = `
              position: fixed;
              bottom: 0;
              right: 0;
              width: auto;
              height: auto;
              display: flex;
              flex-direction: row;
              justify-content: flex-end;
              align-items: flex-end;
              margin-bottom: 10px;
              margin-right: 15px;
         `;
            }
        })();


    }


    document.body ? addScript() : document.addEventListener("DOMContentLoaded", e => addScript());

})();
