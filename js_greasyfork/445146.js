// ==UserScript==
// @name         Red Punda Theme (Shellshock.io)
// @namespace    http://tampermonkey.net/
// @version      0.42
// @description  Become a Cute little Panda!
// @author       Blizzard
// @match        https://shellshock.io/
// @match        https://algebra.best/
// @match        https://eggcombat.com/*
// @match        https://shellshock.io/*
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
// @icon         data:file:///Users/nicolasmg/Blizzard.jpg
// @grant        none
// @lisense MIT
// @downloadURL https://update.greasyfork.org/scripts/445146/Red%20Punda%20Theme%20%28Shellshockio%29.user.js
// @updateURL https://update.greasyfork.org/scripts/445146/Red%20Punda%20Theme%20%28Shellshockio%29.meta.js
// ==/UserScript==

    (function () {
    const addScript = () => {
        document.head.innerHTML += `<style>
* {
	--ss-transparent: #00000000;
	--ss-black: #000;
	--ss-white: #FFFFFF; /*White Text*/
	--ss-offwhite: #FFF3E4;
	--ss-yellow0:#000000;
	--ss-yellow: #171717;
	--ss-yolk0: #171717;
	--ss-yolk: #000000; /*Yellow Buttons*/
	--ss-yolk2: #0044b3;
	--ss-red0: #000000;
	--ss-red: #000000;
	--ss-red2: #000000;
	--ss-red-bright: #000000;
	--ss-pink: #000000;
	--ss-pink1: #000000;
	--ss-pink-light: #000000;
	--ss-brown: #000147;
	--ss-blue00: #d10c04;
	--ss-blue0: #ffffff;
	--ss-blue1: #710c04;
	--ss-blue2: #710c04;
	--ss-blue3: #bc544b; /*Lighter Box Borders*/
	--ss-blue4: #710c04; /*Blue Subtitles, Darker Box Borders*/
	--ss-blue5: #171717;
	--ss-green0: #000000;
	--ss-green1: #000000;
	--ss-green2: #000000;
	--ss-orange1: #595959;
	--ss-vip-gold: linear-gradient(to right, #0004ff, #0003c9, #0002a1, #000170, #000147);
	--ss-clear: rgba(255, 255, 255, 0);
	--ss-blue2clear: rgba(94, 186, 217, 0);
	--ss-shadow: rgba(0,0,0,0.4);
	--ss-blueshadow: #bc544b;
	--ss-darkoverlay: rgba(0, 0, 0, 0.8);
	--ss-darkoverlay2: rgba(0, 0, 0, 0.2);
	--ss-lightoverlay: url("https://media.discordapp.net/attachments/967708118534483979/976030723389681724/42090d461b624453927232ac01cf4aef-1920.png?width=1680&height=945"); /*Main Background*/
	--ss-lightbackground: linear-gradient(var(--ss-blue1), var(--ss-blue2));
	--ss-blueblend1: linear-gradient(#349ec1, #5fbad8); /*Some Box fill colors*/
	--ss-scrollmask1: linear-gradient(var(--ss-blue2clear), var(--ss-blue2));
	--ss-scrollmask2: linear-gradient(rgba(56, 158, 192, 0), #389EC0);
	--ss-fieldbg: linear-gradient(#91CADB, #000000, #000000, #000000, #000000);
	--ss-white-60: rgba(255,255,255,.6);
	--ss-white-90: rgba(255,255,255,.9);

	--ss-me-player-bg: url(https://imagesvc.meredithcorp.io/v3/mm/image?q=60&c=sc&poi=face&w=2000&h=1000&url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F24%2F2016%2F11%2Fbamboo_forest-122180080-2000.jpg);
	--ss-them-blue-bg: rgba(0,66,87,.8);
	--ss-them-blue-color: #003b75;
	--ss-them-red-bg:  rgb(133,0,0,.8);
	--ss-them-red-color: #ff4145
	--ss-me-red-bg: rgba(255,65,69,.8);
	--ss-me-blue-bg: rgb(94,187,217,.8);
}

#logo {
  background-image: url('https://media.discordapp.net/attachments/967708118534483979/976031066546655302/723b6bc40aefc6f495d03906a83c7ff9-modified.png');
  background-position: center;
  background-repeat: no-repeat;
	width: 100%;
  background-size: 9%;
  z-index: 5;
	min-width: var(--ss-min-width);
	height: var(--ss-header-height);
	position: absolute;
	text-align: center;
	top: 5em;
	left: 0;
	margin: 0 auto;
	pointer-events: none;
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
    color: var(--ss-red);
    font-size: 1.2em;
    transform: translateY(-3.45em);
}

.healthBar {
	transform-origin: center;
	transform: rotate(90deg);
	fill: red;
	stroke: white;
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
	background: red;
	width: 0.3em;
}

.crosshair.powerful {
	left: calc(50% - 0.25em);
	background: red;
	width: 0.2em;
}

#maskmiddle {
	background: url('https://media.discordapp.net/attachments/967708118534483979/976287415306182719/red_punda_sp.png?width=946&height=946') center center no-repeat;
	background-size: contain;
    width: 100vh;
	height: 100vh;
}

.playerSlot--icons .vip-egg {
	text-shadow: 1px 1px 2px rgb(0 0 0 / 50%);
  content: url('https://media.discordapp.net/attachments/967708118534483979/976113836945989702/8f3e1b61cbfa719577edee3e446ccec1-modified.png') !important;
  max-height: 1.3em;
  max-width: 1.3em;
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

    background-image: url('https://media.discordapp.net/attachments/967708118534483979/976031335162445824/download-1-modified.png');
    background-position: left center;
    background-size: contain;
    background-repeat: no-repeat;
}

.egg_icon {
    height: 2em;
    margin: var(--ss-space-micro) var(--ss-space-sm) 0 0;
    content: url(https://media.discordapp.net/attachments/967708118534483979/976031066546655302/723b6bc40aefc6f495d03906a83c7ff9-modified.png);
}

#killBox::before{
  font-size: 1.4em;
  font-weight: 900;
  content: '🎋 YOU BOOPED 🎋 '!important;
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
  font-size: 1.4em;
  font-weight: 900;
  content: '🎋 YOU WERE BOOPED BY 🎋 '!important;
  color: Green;
}

</style>`
    }
    document.body ? addScript() : document.addEventListener("DOMContentLoaded", e => addScript());
})();