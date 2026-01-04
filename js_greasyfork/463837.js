// ==UserScript==
// @name         ThatGuySoda Theme
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Simple SS Theme using CSS Variables
// @icon         https://cdn.discordapp.com/attachments/1076580273380143184/1095093265566552167/image.png
// @author       TheAvenger
// @match        https://shellshock.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463837/ThatGuySoda%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/463837/ThatGuySoda%20Theme.meta.js
// ==/UserScript==

(function () {
    const addScript = () => {
        document.head.innerHTML += `<style>
* {
	--ss-transparent: #00000000;
	--ss-black: #000;
	--ss-white: #FFFFFF; /*White Text*/
	--ss-offwhite: #FFF3E4;
	--ss-yellow0:#580082;
	--ss-yellow: #580082;
	--ss-yolk0: #580082;
	--ss-yolk: #580082; /*Yellow Buttons*/
	--ss-yolk2: #580082;
	--ss-red0: #e29092;
	--ss-red: #d15354;
	--ss-red2: #801919;
	--ss-red-bright: #EF3C39;
	--ss-pink: #EC008C;
	--ss-pink1: #b9006e;
	--ss-pink-light: #ff3aaf;
	--ss-brown: #0000ff;
	--ss-blue00: #580082;
	--ss-blue0: #580082;
	--ss-blue1: #580082;
	--ss-blue2: #000000;
	--ss-blue3: #000000; /*Lighter Box Borders*/
	--ss-blue4: #580082; /*Blue Subtitles, Darker Box Borders*/
	--ss-blue5: #000000;
	--ss-green0: #87ddbb;
	--ss-green1: #3ebe8d;
	--ss-green2: #2a7256;
	--ss-orange1: #F79520;
	--ss-vip-gold: linear-gradient(to right, #D1A943, #CFCDAF, #CC8630, #D1AA44, #CC8630);
	--ss-clear: rgba(255, 255, 255, 0);
	--ss-blue2clear: rgba(94, 186, 217, 0);
	--ss-shadow: rgba(0,0,0,0.4);
	--ss-blueshadow: #000000;
	--ss-darkoverlay: rgba(0, 0, 0, 0.8);
	--ss-darkoverlay2: rgba(0, 0, 0, 0.2);
	--ss-lightoverlay: url("https://cdn.discordapp.com/attachments/1076580273380143184/1094327258237382809/image.png");/*Main Background*/
	--ss-lightbackground: linear-gradient(var(--ss-blue1), var(--ss-blue2));
	--ss-blueblend1: linear-gradient #000000; /*Some Box fill colors*/
	--ss-scrollmask1: linear-gradient(var(--ss-blue2clear), var(--ss-blue2));
	--ss-scrollmask2: linear-gradient(rgba(56, 158, 192, 0), #389EC0);
	--ss-fieldbg: linear-gradient(#91CADB, #ffffff, #ffffff, #ffffff, #ffffff);
	--ss-white-60: rgba(255,255,255,.6);
	--ss-white-90: rgba(255,255,255,.9);

	--ss-me-player-bg: rgba(151, 4, 219);
	--ss-them-blue-bg: rgba(0,66,87,.8);
	--ss-them-blue-color: #5ebbd9;
	--ss-them-red-bg:  rgb(133,0,0,.8);
	--ss-them-red-color: #ff4145
	--ss-me-red-bg: rgba(255,65,69,.8);
	--ss-me-blue-bg: rgb(94,187,217,.8);
/*---------------------------------------------------------crosshair*/

.crosshair {
	position: absolute;
	transform-origin: 50% top;
	top: 50%;
	border: solid 0.05em #478ef8;
	height: 0.8em;
	margin-bottom: 0.12em;
	opacity: 0.7;
}

.crosshair.normal {
	left: calc(50% - 0.15em);
	background: #9803fc;
	width: 0.3em;
}

.crosshair.powerful {
	left: calc(50% - 0.25em);
	background: red;
	width: 0.5em;
}

#dotReticle {
	position: absolute;
	left: 50%; top: 50%;
	transform: translate(-50%, -50%);
	background: var(--ss-yolk);
	width: 0.7em; height: 0.7em;
	border-radius: 100%;
}

#shotReticleContainer {
	position: absolute;
	text-align: center;
	left: 50%; top: 50%;
	transform: translate(-50%, -50%);
	opacity: 0.7;
	overflow-x: hidden;
}

#reticleContainer {
	position: fixed;
	top: 0; left: 0;
	width: 100%; height: 100%;
}

#crosshairContainer {
	position: absolute;
	left: 50%; top: 50%;
	transform: perspective(0px);
}

.shotReticle {
	box-sizing: border-box;
	position: absolute;
	left: 50%;
	width: 2.5em;
	height: 100%;
	transform-origin: center;
	background: transparent;
	border: solid;
	border-left: solid transparent;
	border-right: solid transparent;
	border-radius: 1.25em 1.25em 1.25em 1.25em;
}

.shotReticle:nth-child(1n) {
	transform: translateX(-50%) rotate(0deg);
}

.shotReticle:nth-child(2n) {
	transform: translateX(-50%) rotate(90deg);
}

.shotReticle.fill {
}

.shotReticle.border {
}

.shotReticle.fill.normal {
	border-color: #9803fc;
	border-left: solid transparent;
	border-right: solid transparent;
	border-width: 0.1em;
	padding: 0.1em;
}

.shotReticle.fill.powerful {
	border-color: red;
	border-left: solid transparent;
	border-right: solid transparent;
	border-width: 0.3em;
	padding: 0.1em;
}

.shotReticle.border.normal {
	border-color: #9803fc;
	border-left: solid transparent;
	border-right: solid transparent;
	border-width: 0.2em;
}

.shotReticle.border.powerful {
	border-color: #9803fc;
	border-left: solid transparent;
	border-right: solid transparent;
	border-width: 0.4em;
}

/*--------------------------*/
/*----glow stuff----------*/
#stream_mask,.news_mask,.yt_mask {
    position: absolute;
    bottom: 0;
    left: 0.25em;
    height: 2em;
    background: none;
    width: 100%;
    pointer-events: none;
}
#item_mask {
    position: absolute;
    bottom: 0.5em;
    left: 1em;
    height: 2em;
    background: none;
    width: 17.6em;
    pointer-events: none;
    z-index: 1;
*----------health----*/
#healthContainer {
	position: absolute;
	left: 50%; bottom: 1em;
	transform: translateX(-50%);
	display: inline-block;
	width: 6em; height: 6em;
	background: url(https://media.discordapp.net/attachments/1076580273380143184/1095093265566552167/image.png?width=2036&height=1146);
	border-radius: 90% 50%;
	text-align: center;
}
#healthHp {
	font-family: 'Nunito', sans-serif;
    font-weight: bold;
    color: var(--ss-white);
    font-size: 1.2em;
    transform: translateY(-3.45em);
}
.healthBar {
	transform-origin: center;
	transform: rotate(90deg);
	fill: transparent;
	stroke: #9803fc;
	stroke-width: 1em;
	stroke-dasharray: 14.4513em;
	transition: all 0.3s ease-in-out;
}
.healthYolk {
	fill: #9803fc;
}

/*you killed stuff*/
#killBox h3{
	display:none;
}

#killBox::before{
font-size: 1em;
font-weight: 900;
content: 'YOU CANNED'!important;
color: #9803fc;
}
#KILL_STREAK::before{
  display: normal !important;
}
#deathBox h3{
display:none;
}

#deathBox::before{
font-size: 1em;
font-weight: 900;
content: 'YOU GOT CANNED BY'!important;
color: #9803fc;
}

#KILL_STREAK {
    display: normal !important;
/*------badges*/
.playerSlot--icons {
    width: 2.7em;
    display: block;
    position: absolute;
    right: -3.1em;
    top: 0;
    color: #478ef8;
}

.hardBoiledShield {
    position: absolute;
    transform: translateX(-50%);
    height: 100%;
  content: url('https://shellshock.io/img/hardBoiledEmpty.png');
}

#hardBoiledShieldFill {
  content: url('https://media.discordapp.net/attachments/1076580273380143184/1095093265566552167/image.png?width=2036&height=1146');
}
</style>`
    }
    document.body ? addScript() : document.addEventListener("DOMContentLoaded", e => addScript());
})();