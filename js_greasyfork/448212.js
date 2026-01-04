// ==UserScript==
// @name         ss設定
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  My 030, made with 豬豬
// @author       You
// @match        https://shellshock.io/
// @icon         https://cdn.discordapp.com/attachments/926271057986482277/983564181108293682/c33e56442f8f91a8.gif
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448212/ss%E8%A8%AD%E5%AE%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/448212/ss%E8%A8%AD%E5%AE%9A.meta.js
// ==/UserScript==

(function () {
    const addScript = () => {
        document.head.innerHTML += `<style>
* {
	--ss-transparent: #00000000;
	--ss-black: #000;s
	--ss-white: #000000; /*White Text*/
	--ss-offwhite: #bf3f43;
	--ss-yellow0:##bf3f43;
	--ss-yellow: #171717;
	--ss-yolk0: #171717;
	--ss-yolk: #7941e8; /*Yellow Buttons*/
	--ss-yolk2: #d984cc;
	--ss-red0: #bf3f43;
	--ss-red: #bf3f43;
	--ss-red2: #bf3f43;
	--ss-red-bright: #bf3f43;
	--ss-pink: #bf3f43;
	--ss-pink1: #bf3f43;
	--ss-pink-light: #bf3f43;
	--ss-brown: #bf3f43;
	--ss-blue00: ##ffff33;
	--ss-blue0: #bf3f43;
	--ss-blue1: #0407b8;
	--ss-blue2: ##ffff33;
	--ss-blue3: #c477e0; /*Lighter Box Borders*/
	--ss-blue4: #a84591; /*Blue Subtitles, Darker Box Borders*/
	--ss-blue5: #e8cacf;
	--ss-green0: #000000;
	--ss-green1: #000000;
	--ss-green2: #000000;
	--ss-orange1: #d69fce;
	--ss-vip-gold: linear-gradient(to right, #0004ff, #0003c9, #0002a1, #000170, #000147);
	--ss-clear: rgba(255, 255, 255, 0);
	--ss-blue2clear: rgba(94, 186, 217, 0);
	--ss-shadow: rgba(0,0,0,0.4);
	--ss-blueshadow: #bf3f43;
	--ss-darkoverlay: rgba(0, 0, 0, 0.8);
	--ss-darkoverlay2: rgba(0, 0, 0, 0.2);
	--ss-lightoverlay: url("https://cdn.discordapp.com/attachments/926271057986482277/983564181108293682/c33e56442f8f91a8.gif"); /*Main Background*/
	--ss-lightbackground: linear-gradient(var(--ss-blue1), var(--ss-blue2));
	--ss-blueblend1: url("https://cdn.discordapp.com/attachments/868143532999860326/996601591568289792/unknown.png"); /*Some Box fill colors*/
	--ss-scrollmask1: linear-gradient(var(--ss-blue2clear), var(--ss-blue2));
	--ss-scrollmask2: linear-gradient(rgba(56, 158, 192, 0), #389EC0);
	--ss-fieldbg: linear-gradient(#91CADB, #000000, #000000, #000000, #000000);
	--ss-white-60: rgba(255,255,255,.6);
	--ss-white-90: rgba(255,255,255,.9);

	--ss-me-player-bg: rgba(247,149,32,.8);
	--ss-them-blue-bg: rgba(0,66,87,.8);
	--ss-them-blue-color: #003b75;
	--ss-them-red-bg:  rgb(133,0,0,.8);
	--ss-them-red-color: #ff4145
	--ss-me-red-bg: rgba(255,65,69,.8);
	--ss-me-blue-bg: rgb(94,187,217,.8);
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
	fill: white;
	stroke: gold;
	stroke-width: 1em;
	stroke-dasharray: 14.4513em;
	transition: all 0.3s ease-in-out;
}

.healthYolk {
	fill: white;
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
	background: gold;
	width: 0.3em;
}

.crosshair.normal {
	left: calc(50% - 0.15em);
	background: purple;
	width: 0.3em;
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
  content: url('https://cdn.discordapp.com/attachments/868143532999860326/996338553464295474/25e114194dbbbade.png');
}

.crosshair.powerful {
	left: calc(50% - 0.25em);
	background: gold;
	width: 0.2em;
}

#maskmiddle {
	background: url('https://cdn.discordapp.com/attachments/868143532999860326/996408068223025192/ez.png') center center no-repeat;
	background-size: contain;
    width: 100vh;
	height: 100vh;
}

.playerSlot--icons .vip-egg {
	text-shadow: 1px 1px 2px rgb(0 0 0 / 50%);
  content: url('https://cdn.discordapp.com/attachments/868143532999860326/996409691016011836/e860f8905b796890667f5292456df15e.png') !important;
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

    background-image: url('https://cdn.discordapp.com/attachments/868143532999860326/996409691016011836/e860f8905b796890667f5292456df15e.png');
    background-position: left center;
    background-size: contain;
    background-repeat: no-repeat;
}

.egg_icon {
    height: 2em;
   margin: var(--ss-space-micro) var(--ss-space-sm) 0 0;
   content: url(https://cdn.discordapp.com/attachments/868143532999860326/996357338296504330/image001.png)
}

#killBox::before{
  font-size: 1.4em;
  font-weight: 900;
  content: ' 🧨你殺了🧨 '!important;
  color: purple;
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
  content: ' 🎃你被殺了🎃 '!important;
  color: purple;
}

.chat {
	position: absolute;
	font-weight: bold;
	color: #00000;
	z-index: 6;
}

#chatOut {
	display: none;
	bottom: 2.5em;
	left: 1em;

}

#chatIn {
	display: none;
	color: #00000;
	bottom: 1em;
	left: 1em;
	width: 30%;
	border: none;
	background: none;
}

</style>`
    }
    document.body ? addScript() : document.addEventListener("DOMContentLoaded", e => addScript());
})();