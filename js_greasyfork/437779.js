// ==UserScript==
// @name         Praveen Theme
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Subscribe to B-GO
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
// @downloadURL https://update.greasyfork.org/scripts/437779/Praveen%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/437779/Praveen%20Theme.meta.js
// ==/UserScript==

(function () {
    const addScript = () => {
        document.head.innerHTML += `<style>
* {
	--ss-transparent: #00000000;
	--ss-black: #000;
	--ss-white: #ffffff;
	--ss-offwhite: #fff3e4;
	--ss-yellow0:#F7FFC1;
	--ss-yellow: #FAF179;
	--ss-yolk0: #f1c59a00;
	--ss-yolk: #e8ca80;
	--ss-yolk2: #00000000;
	--ss-red0: #e2909200;
	--ss-red: #d1535400;
	--ss-red2: #02ff96;
	--ss-red-bright: #ef3c3900;
	--ss-pink: #ec008c00;
	--ss-pink1: #b9006e00;
	--ss-pink-light: #000000;
	--ss-brown: #000000;
	--ss-blue00: #000000d6;
	--ss-blue0: #00ff9542;
	--ss-blue1: #ffffff;
	--ss-blue2: #005163c9;
	--ss-blue3: #000000;
	--ss-blue4: #163eafd6;
	--ss-blue5: #000000;
	--ss-green0: #87ddbb;
	--ss-green1: #3ebe8d00;
	--ss-green2: #2a7256;
	--ss-orange1: #F79520;
	--ss-vip-gold: linear-gradient(to right, #D1A943, #CFCDAF, #CC8630, #D1AA44, #CC8630);
	--ss-gold: #D1AA44;
	--ss-clear: rgba(255, 255, 255, 0);
	--ss-blue2clear: rgba(94, 186, 217, 0);
	--ss-shadow: rgba(0,0,0,0.4);
	--ss-blueshadow: #0a577187;
	--ss-darkoverlay: rgba(0, 0, 0, 0.8);
	--ss-darkoverlay2: rgba(0, 0, 0, 0.2);
   --ss-lightoverlay: url("https://cdn.discordapp.com/attachments/909790661916651530/925935972573651014/Praveen-12-30-2021.png"); /*Main Background*/
   --ss-lightbackground: url("https://th.bing.com/th/id/OIP.8ZaeDIQtvxCceliSZFT5xQHaEK?w=331&h=186&c=7&r=0&o=5&pid=1.7")
   --ss-blueblend1: linear-gradient(#0000ff91,#ff0000c2);
   --ss-scrollmask1: #0000;
   --ss-scrollmask2: #0000;
   --ss-fieldbg: linear-gradient(#91CADB, 00ffea, #69ff8e, #ff5959, #306eff);
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
   font-family: Futura,Trebuchet MS,Arial,sans-serif;

   scrollbar-width: thin;
   scrollbar-color: var(--ss-yolk) var(--ss-white);
} /* 1377 */

#maskmiddle {
	background: url('https://cdn.discordapp.com/attachments/811268272418062359/856630492417490955/unknown.png') center center no-repeat;
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
	background: red;
	width: 0.3em;
}
.crosshair.normal {
	left: calc(50% - 0.15em);
	background: yellow;
	width: 0.3em;
}

.crosshair.powerful {
	left: calc(50% - 0.25em);
	background: blue;
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
	stroke: green;
	stroke-width: 1em;
	stroke-dasharray: 14.4513em;
	transition: all 0.3s ease-in-out;
}

.healthYolk {
	fill: blue;
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

    background-image: url('https://cdn.discordapp.com/attachments/909790661916651530/925932737356005427/th-removebg-preview_4.png');
    background-position: left center;
    background-size: contain;
    background-repeat: no-repeat;
}

</style>`
    }
    document.body ? addScript() : document.addEventListener("DOMContentLoaded", e => addScript());
})();