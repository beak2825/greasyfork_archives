// ==UserScript==
// @name         Valeria  script
// @namespace    http://greasyfork.org/
// @version      3.9.5
// @description  a script i made for my friend's girlfriend
// @author       Vux
// @match        https://algebra.best/*
// @match        https://algebra.vip/*
// @match        https://biologyclass.club/*
// @match        https://deadlyegg.com/*
// @match        https://deathegg.world/*
// @match        https://egg.dance/*
// @match        https://eggboy.club/*
// @match        https://eggboy.xyz/*
// @match        https://eggcombat.com/*
// @match        https://eggfacts.fun/*
// @match        https://egghead.institute/*
// @match        https://eggisthenewblack.com/*
// @match        https://eggsarecool.com/*
// @match        https://eggshooter.best/*
// @match        https://geometry.best/*
// @match        https://geometry.monster/*
// @match        https://geometry.pw/*
// @match        https://geometry.report/*
// @match        https://hardboiled.life/*
// @match        https://hardshell.life/*
// @match        https://humanorganising.org/*
// @match        https://mathactivity.xyz/*
// @match        https://mathdrills.info/*
// @match        https://mathdrills.life/*
// @match        https://mathfun.rocks/*
// @match        https://mathgames.world/*
// @match        https://math.international/*
// @match        https://mathlete.fun/*
// @match        https://mathlete.pro/*
// @match        https://new.shellshock.io/*
// @match        https://overeasy.club/*
// @match        https://scrambled.best/*
// @match        https://scrambled.tech/*
// @match        https://scrambled.today/*
// @match        https://scrambled.us/*
// @match        https://scrambled.world/*
// @match        https://shellshock.io/*
// @match        https://shellsocks.com/*
// @match        https://shellshockers.club/*
// @match        https://shellshockers.site/*
// @match        https://shellshockers.us/*
// @match        https://shellshockers.world/*
// @match        https://shellshockers.xyz/*
// @match        https://softboiled.club/*
// @match        https://urbanegger.com/*
// @match        https://violentegg.club/*
// @match        https://violentegg.fun/*
// @match        https://yolk.best/*
// @match        https://yolk.life/*
// @match        https://yolk.quest/*
// @match        https://yolk.rocks/*
// @match        https://yolk.tech/*
// @match        https://yolk.today/*
// @match        https://zygote.cafe/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488816/Valeria%20%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/488816/Valeria%20%20script.meta.js
// ==/UserScript==
 
(function () {
    const addScript = () => {
        document.title="youtube.com/@vux730."
        document.head.innerHTML += `<style>
 
 
/*----------GLOBAL----------*/
 
:root {
    --select-border: #777;
    --select-focus: blue;
    --select-arrow: var(--select-border);
    --ss-black: #000;
    --ss-adblocker-text: #003449;
    --ss-white: #FFFFFF;
    --ss-offwhite: #FFF3E4;
    --ss-yellow0: #F7FFC1;
    --ss-yellow: #FAF179;
    --ss-yolk0: #ff6060;
    --ss-yolk: var(--ss-lightoverlay);
    --ss-yolk2: var(--ss-blue4);
    --ss-red0: #e29092;
    --ss-red: #d15354;
    --ss-red2: #801919;
    --ss-egg-org: #EE2524;
    --ss-red-bright: #EF3C39;
    --ss-pink: #EC008C;
    --ss-pink1: #b9006e;
    --ss-pink-light: #ff3aaf;
    --ss-pink-dark: #a7098c;
    --ss-brown: #fff
    --ss-blue00: #000;
    --ss-blue0: #9d9d9d;
    --ss-blue1: #000;
    --ss-blue2: #000;
    --ss-blue3: #fff;
    --ss-blue4: #f9b5b5;
    --ss-blue5: #fff;
    --ss-blue6: #2e2e2e;
    --ss-blue7: var(--ss-yolk2);
    --ss-blue8: #fec5e5;
    --ss-green0: #ffffff;
    --ss-green1: #606060;
    --ss-green2: #000000;
    --ss-green-login: #a7a7a7;
    --ss-orange1: #F79520;
    --ss-vip-blue: #0E7FFF;
    --ss-vip-pink: #FF5AF5;
    --ss-vip-brown: #9F5600;
    --ss-vip-yellow: #FFFC00;
    --ss-vip-red: #EE2B2D;
    --ss-vip-purple: #40008F;
    --ss-vip-gold: linear-gradient(to right, #D1A943, #CFCDAF, #CC8630, #D1AA44, #CC8630);
    --ss-gold: #FED838;
    --ss-clear: rgba(255, 255, 255, 0);
    --ss-blue2clear: rgba(94, 186, 217, 0);
    --ss-blue2alpha7: rgba(94, 186, 217, .7);
    --ss-white-60: rgba(255,255,255,.6);
    --ss-white-90: rgba(255,255,255,.9);
    --ss-twitch: #0000;
    --twitch-color: #6441a5;
    --twitch-yellow: var(--ss-white);
    --twitch-pink: #F00DC9;
    --twitch-dk-pink: #c00aa0;
    --twitch-lt-purple: #0000;
    --twitch-dk-purple: #40008F;
    --twitch-xtr-dk-purple: #1e0043;
    --ss-orange: #F7941D;
    --ss-brown-2: #894B00;
    --ss-vip: #FFF000;
    --ss-red-btn-fill: #E81616;
    --ss-red-btn-outline: #881A1A;
    --ss-limited: #ffb3e8;
    --ss-limited-txt: #ff1bba;
    --ss-premium: #87ec4a;
    --ss-premium-txt: #204908;
    ----ss-vip: #fff000;
    --ss-vip-txt: #676000;
    --ss-darkoverlay: rgba(0, 0, 0, 0.6);
    --ss-darkoverlay2: rgba(0, 0, 0, 0.2);
    --ss-lightoverlay: url(https://cdn.discordapp.com/attachments/1127992184688357388/1213487461741625395/Screenshot_2024-03-02_7.54.49_AM.png?ex=65f5a744&is=65e33244&hm=48786e9a7294602b47d8b2dac86eb87c99a186c6f1228a0e8720681ff5486b88&);
    --ss-lightbackground: linear-gradient(var(--ss-blue1), var(--ss-blue2) );
    --ss-blueblend1: linear-gradient(#349ec1, #5fbad8);
    --ss-scrollmask1: linear-gradient(var(--ss-blue2clear), #0000);
    --ss-scrollmask2: linear-gradient(rgba(56, 158, 192, 0), #0000);
    --ss-fieldbg: linear-gradient(#91CADB, #ffffff, #ffffff, #ffffff, #ffffff);
    --ss-nugSecs: 3600s;
    --ss-me-player-bg: rgb(205 205 205 / 80%);
    --ss-team-blue-light: rgb(96, 192, 224);
    --ss-team-blue-light-trans: rgb(96, 192, 224, 0.8);
    --ss-team-blue-dark: rgb(48, 128, 160);
    --ss-team-blue-dark-trans: rgb(48, 96, 160, 0.8);
    --ss-team-red-light: rgb(255, 64, 48);
    --ss-team-red-light-trans: rgb(255, 64, 48, 0.8);
    --ss-team-red-dark: rgb(160, 32, 24);
    --ss-team-red-dark-trans: rgb(160, 32, 24, 0.8);
    --ss-big-message-border-color: rgb(0, 0, 0);
    --ss-header-height: 10em;
    --ss-footer-height: 4em;
    --ss-main-width: 90em;
    --ss-min-width: 68em;
    --ss-space-xxxxl: calc(var(--ss-space-lg)*4);
    --ss-space-xxl: 2.3em;
    --ss-space-xl: 1.5em;
    --ss-space-lg: 1em;
    --ss-space-md: calc(var(--ss-space-lg)/2);
    --ss-space-sm: calc(var(--ss-space-md)/1.5);
    --ss-space-xs: calc(var(--ss-space-sm)/2);
    --ss-space-micro: calc(var(--ss-space-xs)/2);
    --border-radius: 0.4em;
    --ss-border-radius-sm: 0.2em;
    --ss-common-border-width: .2em;
    --ss-logo-width: calc(var(--ss-space-lg)*14);
    --ss-menu-width: calc(var(--ss-logo-width) - var(--ss-space-lg));
    --ss-main-sidebar-width: 16em;
    --ss-sidebar-width: calc(var(--ss-space-lg)*18.2);
    --ss-aside-panel-width: 20em;
    --ss-item-mask-height: calc(var(--ss-space-lg)*4);
    --ss-item-mask-width: calc(var(--ss-aside-panel-width) - 1.3em);
    --ss-item-box: calc(var(--ss-space-lg)*5.5);
    --ss-account-panel-height: calc(var(--ss-space-lg)*4);
    --ss-chat-wrapper-width: 14.5em;
    --ss--chat-height: 14.5em;
    --ss-media-social-width: 17.7em;
    --paused-ui-scale: .6;
    --paused-ui-vip-scale: .9;
    --chw-bubble-width: 9em;
    --chw-bubble-height: 3.3em;
    --home-screen-r-padding: .68em;
    --ss-box-shadow-1: .16em .16em 0 rgb(0 0 0 / 100%);
    --ss-box-shadow-2: .15em .15em 0 rgb(0 0 0 / 90%);
    --ss-box-shadow-3: .15em .15em 0 rgba(217,118,17,.9);
    --ss-text-shadow-1: .1em .1em 0 rgba(11, 147, 189,.8);
    --ss-shadow: rgba(0,0,0,.4);
    --ss-blueshadow: #0a577187;
    --ss-btn-common-txt-shadow: .1em .1em 0 rgb(0 0 0 / 30%);
    --ss-btn-common-txt-shadow-blur: .1em .1em .5em rgb(0 0 0 / 30%);
    --ss-shadow-filter: drop-shadow(var(--ss-btn-common-txt-shadow));
    --ss-btn-light-bevel: inset 0 .15em .2em;
    --ss-btn-dark-bevel: inset -.1em -.15em .1em;
    --ss-border-blue5: var(--ss-common-border-width) solid var(--ss-blue5);
    --ss-type-icon-size: 2.8em;
    --ss-equip-icon-size: 4em;
    --ss-media-stats-height: 30.5em;
    --ss-alphaclear: #0000
}
 
 
 
 
    /*--------HOME SCREEN TABS-------*/
.load_screen {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: absolute;
    top: 0; left: 0;
    z-index: 20;
    width: 100%; height: 100%;
    background-image:  url(https://cdn.discordapp.com/attachments/1127992184688357388/1213488524549029928/Screenshot_2024-03-02_8.09.59_AM.png?ex=65f5a841&is=65e33341&hm=42e57327ae83d8ceabc0c8c98763ce87c1f507af054c598429705579e0311658&);
    background-repeat: no-repeat;
    background-size: cover;
}
.main-menu-button:hover .main-nav-item-bg, .current-screen .main-nav-item-bg {
    fill: var(--ss-blue8);
    stroke: var(--ss-white);
    color: var(--ss-white);
}
.ss_field, .firebaseui-input {
    border-radius: var(--ss-space-sm) !important;
    border: var(--ss-common-border-width) solid var(--ss-blue4) !important;
    margin: 0 0 var(--ss-space-md) 0 !important;
    padding: var(--ss-space-sm) var(--ss-space-md) !important;
    box-shadow: inset 0.3em 0.3em 0.03em rgb(0 0 0 / 50%) !important;
    background: var(--ss-white) !important;
    color: #000 !important;
    font-weight: bold !important;
    min-height: 2.45em !important;
}
.ss_smtab.selected, .ss_smtab:hover {
    background: #ffb6c1;
}
.bevel_yolk {
    box-shadow: var(--ss-box-shadow-1), var(--ss-btn-dark-bevel) var(--ss-yolk2), var(--ss-btn-light-bevel) #420000;
}
 
/*-----------STATS-----------*/
.stat-wrapper .stat:nth-child(even) > div {
    background-color: var(--ss-alphaclear);
}
.stat-wrapper .stat:nth-child(odd) > div {
    background-color: var(--ss-alphaclear);
}
 
 
/*------------INVENTORY-----------*/
.weapon_img {
    box-sizing: border-box;
    background-color: #000;
    height: 4em;
    width: 4em;
    border: var(--ss-common-border-width) solid var(--ss-blue3);
    fill: var(--ss-white);
}
#weapon_select .weapon_selected {
    background-color: #000;
}
.weapon_img:hover, #weapon_select .weapon_selected {
    border: var(--ss-common-border-width) solid #ffb6c1;
    box-shadow: var(--ss-box-shadow-1);
}
.secondary .equip_icon, .primary .equip_icon {
    filter: drop-shadow(0 2mm 0 rgba(200, 0, 0, .3));
}
.ico_itemtype {
    border-width: var(--ss-common-border-width);
    border-style: solid;
    border-color: #FFB6C1;
    width: var(--ss-type-icon-size);
    height: var(--ss-type-icon-size);
    margin: 0 var(--ss-space-micro) 0.25em var(--ss-space-micro);
    background: rgb(0 0 0 / 20%);
    box-sizing: border-box;
}
.btn_green {
    background: radial-gradient(#ffffff, #f4c2c2, var(--ss-black));
    border-color: var(--ss-green2);
}
.bevel_green {
    box-shadow: var(--ss-box-shadow-1), var(--ss-btn-dark-bevel) rgb(231 231 231), var(--ss-btn-light-bevel) var(--ss-green0);
}
.ss_bigtab {
    height: 3em;
    text-transform: uppercase;
    color: var(--ss-blue5);
    border: var(--ss-common-border-width) solid var(--ss-blue5);
    background: #000;
    min-width: 8em;
    padding: var(--ss-space-micro);
    cursor: pointer;
    /* box-shadow: none !important; */
    box-shadow: var(--ss-box-shadow-1) !important;
}
#equip_grid .grid-item:not(.morestuff) {
    background: var(--ss-lightoverlay);
    border: var(--ss-common-border-width) solid var(--ss-blue5);
}
.secondary .equip_icon, .primary .equip_icon {
    filter: drop-shadow(0 2mm 0 rgba(200, 0, 0, .0));
}
 
 
/*-----------------Random stuff that I found everywhere--------*/
.main-menu-button .menu-icon.menu-icon-star, .icon-star {
    transform: rotate(35deg) !important;
    fill: #fff;
    stroke: var(--ss-yolk);
    stroke-width: 3px;
    right: -1em;
    height: 2em;
    width: 2em;
}
.popup_window {
    z-index: 2000;
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--ss-space-lg);
    color: var(--ss-white);
    background-image: var(--ss-lightoverlay);
    border: var(--ss-common-border-width) solid var(--ss-blue5);
}
.bevel_blue {
    box-shadow: var(--ss-box-shadow-1), var(--ss-btn-dark-bevel) rgb(0 0 0), var(--ss-btn-light-bevel) rgb(255 255 255);
}
.btn_blue {
    background-color: #ffb6c1;
    border-color: #fff
}
.bevel_blue_light {
    box-shadow: var(--ss-box-shadow-1), var(--ss-btn-dark-bevel) rgb(110 110 110), var(--ss-btn-light-bevel) rgb(110 110 110 );
}
.text_blue1 {
    color: #fff !important;
}
.text_blue4 {
    color: #a9a9a9 !important;
}
.text_blue8 {
    color: #ffffff !important;
}
.bg_blue2 {
    background-color: var(--ss-alphaclear);
}
.bg_blue3 {
    background-color: #0000 !important;
}
.bg_blue6 {
    background-color: #0000 !important;
}
.option-box li:hover {
    background: rgb(241 241 241 / 50%);
}
.option-box {
    padding: var(--ss-space-md) 0;
    bottom: 4em;
    right: -50%;
    border: var(--ss-common-border-width) solid var(--ss-blue5);
    box-shadow: 0.26em 0.26em 0 rgb(0 0 0 / 50%);
}
.changelog_content {
    overflow-y: auto;
    height: 24em;
    padding: var(--ss-space-lg);
    color: var(--ss-white);
    font-weight: 600;
    background: var(--ss-alphaclear);
}
#feedback_panel p, #feedback_panel li {
    color: #ffffff;
    font-weight: 600;
}
.load_message {
    color: var(--ss-white);
    margin-top: 5em;
    margin-bottom: 3.5em;
}
 
 
/*----------SETTINGS WINDOW-------*/
.ss_keybind {
    border-radius: var(--ss-space-md);
    border: none;
    margin: 0 0 var(--ss-space-sm) 0;
    padding: var(--ss-space-sm);
    color: #ffffff;
    background: url(https://cdn.discordapp.com/attachments/1127992184688357388/1213488524549029928/Screenshot_2024-03-02_8.09.59_AM.png?ex=65f5a841&is=65e33341&hm=42e57327ae83d8ceabc0c8c98763ce87c1f507af054c598429705579e0311658&);
    font-weight: bold;
    width: 9em;
    text-align: center;
    text-transform: uppercase;
}
.label {
    display: inline;
    color: #858585;
    font-weight: bold;
    margin-left: var(--ss-space-md);
    font-size: 1em;
}
.checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 1.9em;
    width: 1.9em;
    background-color: var(--ss-alphaclear);
    border-radius: var(--ss-space-md);
}
.ss_checkbox .checkmark:after {
    left: 0.55em;
    top: 0.2em;
    width: 0.4em;
    height: 1em;
    border: solid #ffffff;
    border-width: 0 0.4em 0.4em 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
}
.ss_select {
    border-radius: var(--ss-space-sm);
    border: var(--ss-common-border-width) solid var(--ss-blue4);
    margin: 0 0 var(--ss-space-md) 0;
    padding: var(--ss-space-sm);
    box-shadow: inset 3px 3px 10px var(--ss-blue1), 0.1em 0.1em 3px var(--ss-blue3);
    background: var(--ss-alphaclear);
    color: var(--ss-blue3);
    font-weight: bold;
    min-height: 2.45em;
}
/*---------PRIVATE GAMES-------------*/
#joinPrivateGamePopup .inner-wrapper {
    background-color: var(--ss-alphaclear);
    padding: var(--ss-space-md) var(--ss-space-xxl) var(--ss-space-lg);
}
 
/*----------PLAY MENU------------*/
.weapon-select--title h1 {
    color: var(--ss-alphaclear);
    font-size: 1.3em;
    background: url(https://cdn.discordapp.com/attachments/1127992184688357388/1213488524549029928/Screenshot_2024-03-02_8.09.59_AM.png?ex=65f5a841&is=65e33341&hm=42e57327ae83d8ceabc0c8c98763ce87c1f507af054c598429705579e0311658&)
    margin-bottom: var(--ss-space-md);
}
.playerSlot--name {
	overflow: hidden;
    color: var(--ss-yolk2) !important;
}
.pause-screen-btn-spectate {
    position: absolute;
    bottom: var(--ss-space-lg);
    left: var(--ss-space-lg);
    margin: 0;
    min-width: auto;
    border-radius: 100%;
    width: 4em;
    height: 4em;
    text-align: center;
    padding: 0;
    box-shadow: 0.15em 0.15em 0 rgba(0, 0, 0,.3), var(--ss-btn-dark-bevel) var(--ss-black), var(--ss-btn-light-bevel) var(--ss-black) !important;
}
.btn-respawn.bevel_green {
    box-shadow: 0.15em 0.15em 0 rgba(0, 0, 0,.3), var(--ss-btn-dark-bevel) rgb(255 255 255), var(--ss-btn-light-bevel) var(--ss-green0);
}
 
/*-----------CHAT----------*/
#chatIn {
    display: none;
    color: var(--ss-blue7);
    bottom: 1em;
    left: 1em;
    width: 100%;
    border: none;
    background: none;
}
#chatOut span {
    color: #fff !important;
}
.chat {
    font-weight: bold;
    color: #fff;
    opacity: 0.7;
    z-index: 5;
}
.chat-player-name {
	font-weight: bolder;
	color: var(--ss-blue4) !important
}
.is-paused .pause-ui-element {
    background-color: rgb(249, 181, 181, 0.4);
    border: var(--ss-common-border-width) solid var(--ss-blue5);
    bottom: 0;
    width: var(--ss-chat-wrapper-width);
    height: var(--ss--chat-height);
}
 
/*---------------READOUTS-------------*/
#inGameUI {
    position: absolute;
    right: 0.5em;
    top: 4em;
    right: 1.5em;
    top: 5em;
    padding: 1em;
    background-color: #0000;
    border: var(--ss-common-border-width) solid #ffb6c1;
}
#inGameUI .title {
    font-size: .4em;
    color: #0000;
}
#tutorialPopup {
    background-image: var(--ss-lightoverlay);
}
 
/*------------CHICKN WINNER--------*/
.chw-circular-timer-container-shadow {
    background: rgb(0 0 0 / 0%);
    opacity: 1;
    width: var(--chw-bubble-width);
    height: var(--chw-bubble-height);
    align-items: center;
    position: relative;
    border-radius: 0.5em;
    padding: 0.4em 1em;
    z-index: 2;
    position: absolute;
    left: 4.3em;
    bottom: 1.6em;
    z-index: 1;
}
.egg-chick-wrapper {
    background-color: var(--ss-alphaclear);
    margin: var(--ss-space-lg) auto;
    height: 15em;
    align-items: end;
    min-width: 51em;
}
 
/*------------TWITCH-----------*/
#giveStuffPopup.twitchDrops .twitch-btn {
    font-size: 1em;
    background: var(--ss-black);
}
#giveStuffPopup.twitchDrops footer {
    padding-bottom: 1em;
    background-color: #00000000;
}
#giveStuffPopup.twitchDrops .egg-give-stuff, #giveStuffPopup.twitchDrops .grid-item {
    width: 9em;
    height: 9em;
    max-width: 9em;
    max-height: 9em;
    min-width: 9em;
    min-height: 9em;
    border: 0.5em solid;
    margin-bottom: 1em;
    border-radius: var(--ss-space-lg);
    background-color: #0000003b;
}
 
.crosshair {
	position: absolute;
	transform-origin: 50% top;
	top: 50%;
	border: solid 0.03em rgb(249, 181, 181);
	height: 0.8em;
	margin-bottom: 0.12em;
	opacity: 1;
}
 
.crosshair.normal {
	left: calc(50% - 0.15em);
	background: #ffb6c1;
	width: 0.3em;
    opacity: 0.4;
}
 
#reticleDot {
	position: absolute;
	transform: translate(-50%, -50%);
	top: 50%;
	left: 50%;
	background: #f9b5b5;
	border: solid 0.05em black;
	width: 0.3em;
	height: 0.3em;
	opacity: 0.7;
}
 
#healthContainer {
	position: absolute;
	left: 50%; bottom: 1em;
	transform: translateX(-50%);
	display: inline-block;
	width: 6em; height: 6em;
	background: #f9b5b5;
    opacity: 0.6;
	border-radius: 50%;
	text-align: center;
}
 
.healthYolk {
	fill: #f9b5b5;
    opacity: 0.6;
}
#best_streak_container h1 {
    margin: 0;
    padding: 0;
    display: inline;
    text-shadow: var(--ss-space-micro) var(--ss-space-micro) var(--ss-shadow);
    font-family: 'Nunito', sans-serif !important;
    font-size: 2.5em !important;
    color: var(--ss-white) !important;
    font-weight: bold !important;
    text-transform: lowercase;
    padding-left: 1.25em;
    padding-top: 0em;
    background-image: url(https://cdn.discordapp.com/attachments/1127992184688357388/1213488524549029928/Screenshot_2024-03-02_8.09.59_AM.png?ex=65f5a841&is=65e33341&hm=42e57327ae83d8ceabc0c8c98763ce87c1f507af054c598429705579e0311658&););
    background-position: left center;
    background-size: contain;
    background-repeat: no-repeat;
}
 
#killBox::before{
    font-size: 1em;
    font-weight: 900;
    content: 'YOU  KILLED'!important;
    color: #f9b5b5;
}
 
#killBox h3{
	display:none;
}
 
#deathBox::before{
    font-size: 1em;
    font-weight: 900;
    content: 'YOU  WAS KILLED BY '!important;
    color: #f9b5b5;
}
 
#deathBox h3{
display:none;
}
 
.hardBoiledShield {
    position: absolute;
    transform: translateX(-50%);
    height: 100%;
    content: url('https://cdn.discordapp.com/attachments/1127992184688357388/1213488524549029928/Screenshot_2024-03-02_8.09.59_AM.png?ex=65f5a841&is=65e33341&hm=42e57327ae83d8ceabc0c8c98763ce87c1f507af054c598429705579e0311658&');
}
 
#hardBoiledShieldFill {
  content: url(https://cdn.discordapp.com/attachments/1127992184688357388/1213488524549029928/Screenshot_2024-03-02_8.09.59_AM.png?ex=65f5a841&is=65e33341&hm=42e57327ae83d8ceabc0c8c98763ce87c1f507af054c598429705579e0311658&);
}
 
</style>`
    }
    document.body ? addScript() : document.addEventListener("DOMContentLoaded", e => addScript());
})();