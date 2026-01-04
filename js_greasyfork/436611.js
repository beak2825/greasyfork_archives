// ==UserScript==
// @name         EwaTheWabbit Theme
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Subscribe to B-GO and Ewa!
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
// @downloadURL https://update.greasyfork.org/scripts/436611/EwaTheWabbit%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/436611/EwaTheWabbit%20Theme.meta.js
// ==/UserScript==

(function () {
    const addScript = () => {
        document.head.innerHTML += `<style>
* {
   --ss-transparent: #00000000;
   --ss-black: #000;
   --ss-white:#ffffff; /*White Text*/
   --ss-offwhite: #g38r3g;
   --ss-yellow0:#52b0c7;
   --ss-yellow: #0acdfc;
   --ss-yolk0: #0acdfc;
   --ss-yolk: #00fbff;
   --ss-yolk2: #00fbff;
   --ss-red0: #38bg4u;
   --ss-red: #g234hj;
   --ss-red2: #f55858;
   --ss-red-bright: #f7211e;
   --ss-pink: #457df5; /*Pink Buttons*/
   --ss-pink1: #00319c;
   --ss-pink-light: #a142ff;
   --ss-brown: #debdff;
   --ss-blue00: #d9f4fc;
   --ss-blue0: #c8edf8;
   --ss-blue1: #09ff00;
   --ss-blue2: #f2ff00;
   --ss-blue3: url("data:image/jpeg;base64,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"); /*Lighter Box Borders*/
   --ss-blue4: url("https://c4.wallpaperflare.com/wallpaper/267/568/941/bunny-rabbit-hd-two-brown-and-white-rabbits-wallpaper-preview.jpg"); /*Back Subtitles, Darker Box Borders*/
   --ss-blue5: #24a0c9;
   --ss-green0: #b0ffe9;
   --ss-green1: #b0fffa;
   --ss-green2: #48fad6;
   --ss-orange1: #3a00f7;
   --ss-vip-gold: url("https://c4.wallpaperflare.com/wallpaper/141/766/362/the-secret-life-of-pets-2016-backgrounds-rabbit-snowball-wallpaper-preview.jpg")
   --ss-blue2clear: rgba(94, 186, 217, 0);
   --ss-shadow: rgba(0,0,0,0.4);
   --ss-blueshadow: #83gh943;
   --ss-darkoverlay: rgba(0, 0, 0, 0.8);
   --ss-darkoverlay2: rgba(0, 0, 0, 0.2);
   --ss-lightoverlay: url("https://cdn.discordapp.com/attachments/911168967408746496/917017053049794611/unknown.png"); /*Main Background*/
   --ss-lightbackground: url ("data:image/jpeg;base64,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")
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
   scrollbar-color: var(--ss-pink) var(--ss-white);
} /* 1377 */

#maskmiddle {
	background: url('https://cdn.discordapp.com/attachments/811268272418062359/857671002251329576/unknown.png') center center no-repeat;
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
	background: pink;
	width: 0.3em;
}
.crosshair.normal {
	left: calc(50% - 0.15em);
	background: blue;
	width: 0.3em;
}

.crosshair.powerful {
	left: calc(50% - 0.25em);
	background: green;
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
	stroke: blue;
	stroke-width: 1em;
	stroke-dasharray: 14.4513em;
	transition: all 0.3s ease-in-out;
}

.healthYolk {
	fill: pink;
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
	text-shadow: var(--ss-pink) 0 0 0.1em, black 0 0.1em 0.2em;
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
	color: var(--ss-pink);
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
	color: ##ff177f;
	z-index: 6;
}

#chatOut {
	display: none;
	bottom: 2.5em;
	left: 1em;

}

#chatIn {
	display: none;
	color: ##d587ed;
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
	text-shadow: ##ff3849;
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

#readouts div {
	display: inline;
	font-size: 1em !important;
	margin-left: 0.1em;
}

#game_account_panel {
	z-index: 6;
	width: auto;
	position: absolute;
	top: var(--ss-space-sm);
	right: var(--ss-space-sm);
}

#chickenBadge {
	position: absolute;
	top: 5.25em;
	width: 5em;
	height: 5em;
	right: var(--ss-space-sm);
	z-index: 6;
}

#chickenBadge img {
	width: 100%;
	height: 100%;
}

#scopeBorder {
	box-sizing: initial;
	display: flex;
	flex-direction: row;
	justify-content: center;
	width: 100vw; height: 100vh;
	position: absolute;
	top: 0px; left: 0px;
	pointer-events: none;
	overflow-x: hidden;
}

#pausePopup {
    animation-fill-mode: auto;
    top: auto;
    left: initial;
    transform: none;
    width: 970px;
    width: 70em;
    width: auto;
    padding: var(--ss-blue);
    min-height: 17.7em;
    display: flex;
    : ;
    justify-content: center;
    margin-right: auto;
    margin-left: auto;
    grid-column: 2 / span 1;
    align-self: center;
    align-items: baseline;
}

element.style {
}
.bevel_yolk {
    box-shadow: 0.05em 0.05em 0.3em var(--ss-blue4), inset -0.1em -0.1em 0.3em var(--ss-yolk), inset 0.1em 0.1em 0.3em var(--ss-yolk0);
}
.btn_md {
    min-width: 12em;
}
.btn_yolk {
    background: #75ffa5;
    border: 0.2em solid #00ffea;
    text-shadow: 0.1em 0.1em 20px var(--ss-blue) !important;
}
.ss_button {
    border-radius: var(--ss-space-sm);
    border: 0.2em solid var(--ss-blue5);
    background: #ff5266;
    color: var(--ss-green);
    text-align: center;
    font-weight: bold;
    line-height: 1em;
    padding: var(--ss-space-sm) var(--ss-space-lg);
    box-shadow: 0.1em 0.1em 3px var(--ss-blue4);
    margin: 0 0 var(--ss-space-md) 0;
    cursor: pointer;
    white-space: nowrap;
}

#account_top {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    flex-direction: row;
}
</style>`
    }
    document.body ? addScript() : document.addEventListener("DOMContentLoaded", e => addScript());
})();