// ==UserScript==
// @name         Ragdoll YT Theme
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Subscribe to B-GO and Ragdoll YT
// @author       B-GO
// @match        https://shellshock.io/*
// @match        https://eggcombat.com/*
// @match        https://eggfacts.fun/*
// @match        https://biologyclass.club/*
// @match        https://egghead.institute/*
// @match        https://egg.dance/*
// @match        https://eggisthenewblack.com/*
// @match        https://mathfun.rocks/*
// @match        https://hardboiled.life/*
// @match        https://overeasy.club/*
// @match        https://zygote.cafe/*
// @match        https://mathdrills.info
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
// @match        https://krunker.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439801/Ragdoll%20YT%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/439801/Ragdoll%20YT%20Theme.meta.js
// ==/UserScript==

(function () {
    const addScript = () => {
        document.head.innerHTML += `<style>
* {
	--ss-transparent: #00000000;
	--ss-black: #000;
	--ss-white: #FFFFFF;
	--ss-offwhite: #FFF3E4;
	--ss-yellow0:#F7FFC1;
	--ss-yellow: #FAF179;
	--ss-yolk0: #f1c59a00;
	--ss-yolk: #000000a6;
	--ss-yolk2: #d9761100;
	--ss-red0: #e2909200;
	--ss-red: #000000bf;
	--ss-red2: #80191900;
	--ss-red-bright: #EF3C39;
	--ss-pink: #EC008C;
	--ss-pink1: #b9006e;
	--ss-pink-light: #ff3aaf;
	--ss-brown: #000000;
	--ss-blue00: #000000;
	--ss-blue0: #000000;
	--ss-blue1: #ffffff;
	--ss-blue2: #ab5600;
	--ss-blue3: #ff7600;
	--ss-blue4: #000000;
	--ss-blue5: #000000;
	--ss-green0: #87ddbb00;
	--ss-green1: #000000b0;
	--ss-green2: #2a725600;
	--ss-orange1: #F79520;
	--ss-vip-gold: linear-gradient(to right, #D1A943, #CFCDAF, #CC8630, #D1AA44, #CC8630);
	--ss-gold: #D1AA44;
	--ss-clear: rgba(255, 255, 255, 0);
	--ss-blue2clear: rgba(94, 186, 217, 0);
	--ss-shadow: rgba(0,0,0,0.4);
	--ss-blueshadow: #0a577187;
	--ss-darkoverlay: rgba(0, 0, 0, 0.8);
	--ss-darkoverlay2: rgba(0, 0, 0, 0.2);
	--ss-lightoverlay: url("data:image/jpeg;base64,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"); /*Main Background*/
	--ss-lightbackground:url("https://cdn.discordapp.com/attachments/918747766891642900/940510885875679232/96ADB4E0-DC90-481C-BD09-C65ECA6C0F98.jpeg")
	--ss-blueblend1: linear-gradient(45deg, #000000d1, #310071c4);
	--ss-scrollmask1: #0000;
	--ss-scrollmask2: #0000;
	--ss-fieldbg: linear-gradient(#91CADB, #ffffff, #ffffff, #ffffff, #ffffff);
	--ss-nugSecs: 3600s;
	--ss-white-60: rgba(255,255,255,.6);
	--ss-white-90: rgba(255,255,255,.9);

	--ss-me-player-bg: rgba(247,149,32,.8);

	--ss-them-blue-bg: rgba(0,66,87,.8);
	--ss-them-blue-color: #5ebbd9;
	--ss-them-red-bg:  rgb(133,0,0,.8);
	--ss-them-red-color: #ff4145;

	--ss-me-red-bg: rgba(255,65,69,.8);
	--ss-me-blue-bg: rgb(94,187,217,.8);

	font-size: 1.95vh;
  font-family: Bold;

	scrollbar-width: thin;
    scrollbar-color: var(--ss-yolk) var(--ss-white);
}
/* 1377 */

#maskmiddle {
	background: url('https://cdn.discordapp.com/attachments/940796647615651911/941155155259297852/Untitled.png') center center no-repeat;
	background-size: contain;
    width: 100vh;
	height: 100vh;
}
.crosshair {
	position: absolute;
	transform-origin: 50% top;
	top: 50%;
	border: solid 0.05em ;
	height: 0.8em;
	margin-bottom: 0.12em;
	opacity: 1;

	left: calc(50% - 0.15em);
	background: orange;
	width: 0.3em;
}
.crosshair.normal {
	left: calc(50% - 0.15em);
	background: orange;
	width: 0.3em;
}

.crosshair.powerful {
	left: calc(50% - 0.25em);
	background: red;
	width: 0.2em;
}

#best_streak_container h1 {
	margin: 0; padding: 0;
	display: inline;

	text-shadow: var(--ss-space-micro) var(--ss-space-micro) var(--ss-shadow);

	font-family: 'Nunito', bold italic !important;
	font-size: 2.5em !important;
	color: var(--ss-white) !important;
}

#healthContainer {
	position: absolute;
	left: 50%; bottom: 1em;
	transform: translateX(-50%);
	display: inline-block;
	width: 6em; height: 6em;
	background: var(--ss-blueshadow);
	border-radius: 50%;
	text-align: center;
}

#health {
}

#healthHp {
	font-family: 'Nunito', bold italic;
    font-weight: bold;
    color: var(--ss-green);
    font-size: 1.2em;
    transform: translateY(-3.45em);
}

.healthBar {
	transform-origin: center;
	transform: rotate(90deg);
	fill: red;
	stroke: pink;
	stroke-width: 1em;
	stroke-dasharray: 14.4513em;
	transition: all 0.3s ease-in-out;
}

.healthYolk {
	fill: red;
}

.healthSvg {
	width: 100%; height: 100%;
}

#hardBoiledContainer {
	position: absolute;
	left: 50%; bottom: 1em;
	transform: translateX(-50%);
	display: inline-block;
	width: 6em; height: 6em;
	text-align: center;
}

#hardBoiledValue {
	font-family: 'Nunito', bold;
    font-weight: bold;
    color: var(--ss-blue);
    font-size: 1.6em;
    transform: translateY(-2.6em);
}

#hardBoiledShieldContainer {
	width: 100%;
	height: 100%;
}

.hardBoiledShield {
	position: absolute;
	transform: translateX(-50%);
	height: 100%;
}

#eggBreakerContainer {
	position: absolute;
	left: calc(50% + 9em); bottom: 1em;
	transform: scale(4) translateY(-3em);
	transform-origin: 50% 100%;
	width: 6em; height: 6em;
}

#eggBreakerContainer.on {
	visibility: visible;
	transform: scale(1) translateY(0);
	transition: 1s;
}

#eggBreakerContainer.off {
	visibility: hidden;
}

#eggBreakerIcon {
	position: absolute;
	height: 100%;
}

#eggBreakerTimer {
	position: absolute;
	color: white;
	text-shadow: var(--ss-green) 0 0 0.1em, black 0 0.1em 0.2em;
	font-size: 2.5em;
	font-family: 'Nunito', bold italic;
	font-weight: 900;
	text-align: center;
	width: 100%;
	top: 24%;
}

#shellStreakContainer {
    position: absolute;
    top: 18%;
    left: 50%;
	transform: translateX(-50%);
	text-align: center;
	z-index: 6;
}

#shellStreakCaption {
	color: var(--ss-blue);
	text-shadow: var(--ss-space-micro) var(--ss-space-micro) var(--ss-shadow);
	margin: 0;
}

#shellStreakMessage {
	color: var(--ss-blue);
	text-shadow: var(--ss-space-micro) var(--ss-space-micro) var(--ss-shadow);
	font-size: 2.5em;
	margin: 0;
}

#shellStreakMessage.appear {
    visibility: visible;
    transform: scale(1);
    transition: 0.5s;
}

#shellStreakMessage.disappear {
    visibility: hidden;
    transform: scale(2);
}

#deathBox {
	position: absolute;
	display: none;
	width: 100%;
	transform-origin: center top;
	top: 20%;
	color: #00fff3;
	text-align: center;
}

#gameMessage {
	position: absolute;
	display: none;
	top: 45%; left: 60%;
	color: #54ff76;
	text-align: center;
	z-index: 6;
}

.chat {
	position: absolute;
	font-weight: bold;
	color: #99ff9c;
	z-index: 6;
}

#chatOut {
	display: none;
	bottom: 2.5em;
	left: 1em;

}

#chatIn {
	display: none;
	color: #00ffea;
	bottom: 1em;
	left: 1em;
	width: 30%;
	border: none;
	background: none;
}

#killTicker {
	position: absolute;
	text-align: right;
	right: 1em;
	top: 10em;
	height: 7em;
	transform-origin: top right;
	text-shadow: #ff4d4d;
}

#playerList {
	display: table;
	border-collapse: separate;
	border-spacing: 0.2em;
	position: absolute;
	left: 1em; top: 1em;
	z-index: 6;
	width: 12em;
}

#spectate {
	display: none;
	position: absolute;
	right: 1em;
	bottom: 1em;
	text-align: center;
	padding: 0.5em 1em 0.5em 1em;
	border-radius: 0.3em;
	font-weight: bold;
	color: var(--ss-white);
	background: rgba(2, 1, 4, 5.3);
}

#serverAndMapInfo {
	position: absolute;
	right: var(--ss-space-sm);
	bottom: var(--ss-space-sm);
	text-align: right;
	color: var(--ss-blue);
	font-weight: bold;
	font-size: 1.4em;
	line-height: 1em;
	z-index: 6;
}

#inGameUI {
	position: absolute; right: 0.3em; top: 0em;
}

#readouts {
	position: absolute;
	top: 2.2em;
	right: 0em;
	display: block;
	text-align: right;
	color: var(--ss-white);
	font-weight: bold;
	clear: both;
	font-size: 1.3em !important;
	text-transform: uppercase;
	line-height: 1em;
	white-space: nowrap;
	z-index: 6;
}

#best_streak_container h1 {
    margin: 0; padding: 0;
    display: inline;

    text-shadow: var(--ss-space-micro) var(--ss-space-micro) var(--ss-shadow);

    font-family: 'Nunito', sans-serif !important;
    font-size: 2.5em !important;
    color: var(--ss-white) !important;
    font-weight: bold !important;
    text-transform: lowercase;

    padding-left: 1.5em;
    padding-top: 0em;

    background-image: url('');
    background-position: left center;
    background-size: contain;
    background-repeat: no-repeat;
}

.egg_icon {
    height: 2em;
    margin: var(--ss-space-micro) var(--ss-space-sm) 0 0;
    content: url(https://cdn.discordapp.com/attachments/940796647615651911/941158904149200976/images__4_-removebg-preview.png);
}

</style>`
    }
    document.body ? addScript() : document.addEventListener("DOMContentLoaded", e => addScript());
})();