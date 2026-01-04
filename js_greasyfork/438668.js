// ==UserScript==
// @name         Gemini Quan Theme
// @namespace    http://tampermonkey.net/
// @version      1
// @description  GMN theme for shellshock.io
// @author       Quan
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
// @downloadURL https://update.greasyfork.org/scripts/438668/Gemini%20Quan%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/438668/Gemini%20Quan%20Theme.meta.js
// ==/UserScript==

(function () {
    const addScript = () => {
        document.head.innerHTML += `<style>
* {
   --ss-transparent: #00000000;
   --ss-green: #0beba0;
   --ss-white: #FFFFFF;
   --ss-offwhite: #FFF3E4;
   --ss-yellow0:#F7FFC1;
   --ss-yellow: #FAF179;
   --ss-yolk0: #f1c59a00;
   --ss-yolk: #000000;
   --ss-yolk2: #d9761100;
   --ss-red0: #e2909200;
   --ss-red: #000000;
   --ss-red2: #80191900;
   --ss-red-bright: #EF3C39;
   --ss-pink: #EC008C;
   --ss-pink1: #b9006e;
   --ss-pink-light: #ff3aaf;
   --ss-brown: #ffffff;
  --ss-blue00: #00a30b;
   --ss-blue0: #00a30b;
   --ss-blue1: #00a30b;
   --ss-blue2: #008724;
   --ss-blue3: #000000;
   --ss-blue4: #000000;
   --ss-blue5: #000000;
   --ss-green0: #87ddbb00;
   --ss-green1: #000000;
   --ss-green2: #2a725600;
   --ss-orange1: #F79520;
   --ss-vip-gold: linear-gradient(to right, #D1A943, #CFCDAF, #CC8630, #D1AA44, #CC8630);
   --ss-gold: #D1AA44;
   --ss-blue2clear: rgba(94, 186, 217, 0);
   --ss-shadow: rgba(0,0,0,0.4);
   --ss-blueshadow: #0a577187;
   --ss-darkoverlay: rgba(0, 0, 0, 0.8);
   --ss-darkoverlay2: rgba(0, 0, 0, 0.2);
   --ss-lightoverlay: url("https://thienvanhanoi.org/wp-content/uploads/2017/11/Cung-ho%C3%A0ng-%C4%91%E1%BA%A1o-elleman-4.png"); /*Main Background*/
   --ss-lightbackground: url("https://thienvanhanoi.org/wp-content/uploads/2017/11/Cung-ho%C3%A0ng-%C4%91%E1%BA%A1o-elleman-4.png")
   --ss-blueblend1: linear-gradient(#0000ff91,#ff0000c2);
   --ss-scrollmask1: #0000;
   --ss-scrollmask2: #0000;
   --ss-fieldbg: linear-gradient(#91CADB, 00ffea, #69ff8e, #ff5959, #306eff);
   --ss-nugSecs: 3600s;
   --ss-white-60: rgba(255,255,255,.6);
   --ss-white-90: rgba(255,255,255,.9);

   --ss-me-player-bg: url(https://thumbs.gfycat.com/DimSerpentineEsok-size_restricted.gif);

   --ss-them-blue-bg: rgba(0,66,87,.8);
   --ss-them-blue-color: #5ebbd9;
   --ss-them-red-bg:  rgb(133,0,0,.8);
   --ss-them-red-color: #ffaa00;

   --ss-me-red-bg: rgba(255,65,69,.8);
   --ss-me-blue-bg: rgb(94,187,217,.8);



   font-size: 1.95vh;
   font-family: Trebuchet MS,Arial,sans-serif;

   scrollbar-width: thin;
   scrollbar-color: var(--ss-yolk) var(--ss-white);
} /* 1377 */

#maskmiddle {
	background: url('https://media.discordapp.net/attachments/929178886674206730/932293483845267456/scope.png') center center no-repeat;
	background-size: contain;
	width: 100vh;
	height: 100vh;
}
#logo {
	width: 100%;
	min-width: var(--ss-min-width);
	height: var(--ss-header-height);
	position: absolute;
	text-align: center;
	top: 3em;
	left: 0;
	margin: 0 auto;
	pointer-events: none;
}
#mainFooter {
	display: flex;
	flex-direction: row;
	height: var(--ss-footer-height);
	margin: 0 auto;
	width: 100%;
	position: relative;
	text-align: center;
	font-size: 0.8em;
	letter-spacing: 0.01em;
	min-width: var(--ss-min-width);
}
.playerSlot--icons .hidden {
	display: none;
}

.playerSlot--icons i {
	margin-right: .2em;
}

.playerSlot--icons .vip-egg {
	text-shadow: 1px 1px 2px rgb(0 0 0 / 50%);
  content: url('https://media.discordapp.net/attachments/720146565096013874/866426038149316628/mono_ocean.png') !important;
  max-height: 1.1em;
  max-width: 1.1em;
}

#mainFooter:after { /* Added Code  */
content: 'Theme By |[ꁅꎭꈤ] » ꆰꀎꍏꈤ️ ‎‏‏‎ ‎‏‏‎ ‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎' !important;
font-family: 'Nunito', sans-serif;

    text-align: center;

  align-items: center;

  font-weight: 100;
    font-size: 1.7em;
    letter-spacing: 0.01em;
color: #FFFFFF;
}
#logo img {
	height: 100%;
	pointer-events: auto;
  content: url('https://media.discordapp.net/attachments/720146565096013874/881831505427570749/smalloceanlogo.png?width=1080&height=507');
}
.egg_icon {
	height: 2em;
	margin: var(--ss-space-micro) var(--ss-space-sm) 0 0;
  content: url('https://media.discordapp.net/attachments/927072346647429200/927587229134618644/gemini-removebg-preview.png')
}
.crosshair {
	position: absolute;
	transform-origin: 50% top;
	top: 50%;
	border: solid 0.05em blue;
	height: 0.8em;
	margin-bottom: 0.12em;
	opacity: 0.7;

	left: calc(50% - 0.15em);
	background: linear-gradient(#1d4801,green);
	width: 0.3em;
}
.crosshair.normal {
	left: calc(50% - 0.15em);
	background: linear-gradient(#1d4801,green);
	width: 0.5em;
}
.crosshair.powerful {
	left: calc(50% - 0.25em);
	background: #1d4801;
	width: 0.15em;
}
#dotReticle {
	position: absolute;
	left: 50%; top: 50%;
	transform: translate(-50%, -50%);
	background: var(--ss-blue4);
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
	background: #0cf80b00;
	border: solid;
	border-left: solid #f5494900;
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
	border-color: #09f505;
	border-left: solid transparent;
	border-right: solid transparent;
	border-width: 0.5em;
	padding: 0.1em;
}

.shotReticle.fill.powerful {
	border-color: #00ff0d;
	border-left: solid transparent;
	border-right: solid transparent;
	border-width: 0.5em;
	padding: 0.1em;
}

.shotReticle.border.normal {
	border-color: #fb2b2b;
	border-left: solid transparent;
	border-right: solid transparent;
	border-width: 0.2em;
}

.shotReticle.border.powerful {
	border-color: #ed0b0b;
	border-left: solid transparent;
	border-right: solid transparent;
	border-width: 0.4em;
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
#ammo {
	text-align: right;
	font-size: 3.25em;
	font-family: 'Nunito', sans-serif;
	font-weight: bold;
	line-height: 1em;
	margin: 0;

	padding-right: 1.2em;
	padding-top: 0em;
	margin-bottom: 0.1em;

	background-image: url('https://media.discordapp.net/attachments/929178886674206730/932285683240955964/AcademicHatwithStarWarsSniper.png?width=895&height=503');
    background-position: right center;
	background-size: contain;
    background-repeat: no-repeat;
}
#health {
}

#healthHp {
	font-family: 'Nunito', bold italic;
    font-weight: bold;
    color: var(--ss-blue);
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
	font-family: 'Nunito', sans-serif;
    font-weight: bold;
    color: var(--ss-white);
    font-size: 1.6em;
    transform: translateY(-2.6em);
}
.hardBoiledShield {
    position: absolute;
    transform: translateX(-50%);
    height: 100%;
  content: url('https://cdn.discordapp.com/attachments/862051198617124905/931942031419379742/wiz_shell.png');
}

.hardBoiledShield {
    position: absolute;
    transform: translateX(-50%);
    height: 100%;
  content: url('https://cdn.discordapp.com/attachments/862051198617124905/931942031419379742/wiz_shell.png');
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
	color: green;
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
	color: #00a30b;
	z-index: 6;
}

#chatOut {
	display: none;
	bottom: 2.5em;
	left: 1em;

}

#chatIn {
	display: none;
	color: #00a30b;
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

    background-image: url('https://i.makeagif.com/media/10-30-2013/xRorgf.gif');
    background-position: left center;
    background-size: contain;
    background-repeat: no-repeat;
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
    background: #00a30b;
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
#grenadeThrowContainer {
	position: absolute;
	display: flex;
	visibility: hidden;
	align-items: flex-end;
	top: 50%;
	left: 50%;
	transform: translate(-6em, -3em);
	width: 1em;
	height: 6em;
	background: rgb(45 227 62 / 25%);
	border-radius: 0.3em;
	padding: 0.25em;
}

#grenadeThrow {
	width: 100%;
	height: 50%;
	border-radius: 0.05em;
	background: #0bc5e8;
}

#account_top {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    flex-direction: row;
}


element.style {
    display: block;
}
.playerSlot--icons {
    width: 2.7em;
    display: block;
    position: absolute;
    right: -3.1em;
    top: 0;
    color: url("https://i.makeagif.com/media/10-30-2013/xRorgf.gif");
}
.playerSlot--icons {
    width: 2.7em;
    display: block;
    position: absolute;
    right: -3.1em;
    top: 0;
    color: var(--ss-greenshadow);
}
#killBox::before{
  font-size: 1em;
  font-weight: 900;
  content: '🌊♊ꐟꆂꐇ ꃃꆂꆂ꓅ꍟꁕ♊🌊'!important;
  color: green;
  }
#killBox h3{
  display:none;
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
  content: '🌊♊ꌩꂦꀎ ꅏꍟꋪꍟ ꍟ꒒ꀤꎭꀤꈤꍏ꓄ꍟꀸ ꌃꌩ♊🌊'!important;
  color: green;
}
</style>`
    }
    document.body ? addScript() : document.addEventListener("DOMContentLoaded", e => addScript());
})();