// ==UserScript==
// @name         Shake Theme (Shellshock.io)
// @namespace    http://tampermonkey.net/
// @version      0.42
// @description  Become a God Trickshotter!
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
// @icon         data:image/jpeg;base64,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
// @grant        none
// @lisense MIT
// @downloadURL https://update.greasyfork.org/scripts/444012/Shake%20Theme%20%28Shellshockio%29.user.js
// @updateURL https://update.greasyfork.org/scripts/444012/Shake%20Theme%20%28Shellshockio%29.meta.js
// ==/UserScript==

    (function () {
    const addScript = () => {
        document.head.innerHTML += `<style>
* {
	--ss-transparent: #00000000;
	--ss-black: #000;s
	--ss-white: #000000; /*White Text*/
	--ss-offwhite: #f18f49;
	--ss-yellow0:##f18f49;
	--ss-yellow: #171717;
	--ss-yolk0: #171717;
	--ss-yolk: #f18f49; /*Yellow Buttons*/
	--ss-yolk2: #ffae00;
	--ss-red0: #f18f49;
	--ss-red: #f18f49;
	--ss-red2: #f18f49;
	--ss-red-bright: #f18f49;
	--ss-pink: #f18f49;
	--ss-pink1: #f18f49;
	--ss-pink-light: #f18f49;
	--ss-brown: #f18f49;
	--ss-blue00: ##ffff33;
	--ss-blue0: #f18f490;
	--ss-blue1: #0407b8;
	--ss-blue2: ##ffff33;
	--ss-blue3: #ffba01; /*Lighter Box Borders*/
	--ss-blue4: ##ffff33; /*Blue Subtitles, Darker Box Borders*/
	--ss-blue5: #171717;
	--ss-green0: #000000;
	--ss-green1: #000000;
	--ss-green2: #000000;
	--ss-orange1: #595959;
	--ss-vip-gold: linear-gradient(to right, #0004ff, #0003c9, #0002a1, #000170, #000147);
	--ss-clear: rgba(255, 255, 255, 0);
	--ss-blue2clear: rgba(94, 186, 217, 0);
	--ss-shadow: rgba(0,0,0,0.4);
	--ss-blueshadow: #f18f49;
	--ss-darkoverlay: rgba(0, 0, 0, 0.8);
	--ss-darkoverlay2: rgba(0, 0, 0, 0.2);
	--ss-lightoverlay: url("https://media.discordapp.net/attachments/946410906840084490/968007320091115580/funny-cat-names-1.jpg"); /*Main Background*/
	--ss-lightbackground: linear-gradient(var(--ss-blue1), var(--ss-blue2));
	--ss-blueblend1: linear-gradient(#349ec1, #5fbad8); /*Some Box fill colors*/
	--ss-scrollmask1: linear-gradient(var(--ss-blue2clear), var(--ss-blue2));
	--ss-scrollmask2: linear-gradient(rgba(56, 158, 192, 0), #389EC0);
	--ss-fieldbg: linear-gradient(#91CADB, #000000, #000000, #000000, #000000);
	--ss-white-60: rgba(255,255,255,.6);
	--ss-white-90: rgba(255,255,255,.9);

	--ss-me-player-bg: url("data:image/jpeg;base64,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");
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
	stroke: Magenta;
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
	background: gold;
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
  content: url('https://cdn.discordapp.com/attachments/862051198617124905/931942031419379742/wiz_shell.png');
}

.hardBoiledShield {
    position: absolute;
    transform: translateX(-50%);
    height: 100%;
  content: url('https://cdn.discordapp.com/attachments/862051198617124905/931942031419379742/wiz_shell.png');
}

.crosshair.powerful {
	left: calc(50% - 0.25em);
	background: gold;
	width: 0.2em;
}

#maskmiddle {
	background: url('https://media.discordapp.net/attachments/946410906840084490/968067016554602506/scopeshake.png?width=946&height=946') center center no-repeat;
	background-size: contain;
    width: 100vh;
	height: 100vh;
}

.playerSlot--icons .vip-egg {
	text-shadow: 1px 1px 2px rgb(0 0 0 / 50%);
  content: url('https://icones.pro/wp-content/uploads/2021/03/logo-discord-icone-png-violet.png') !important;
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

    background-image: url('https://shellshock.io/img/eggPose01.png');
    background-position: left center;
    background-size: contain;
    background-repeat: no-repeat;
}

.egg_icon {
    height: 2em;
   margin: var(--ss-space-micro) var(--ss-space-sm) 0 0;
   content: url(https://media.discordapp.net/attachments/946410906840084490/968059484633169950/item_hat_dragon.gif)
}

#killBox::before{
  font-size: 1.4em;
  font-weight: 900;
  content: '🎖YOU SHAKED🎖'!important;
  color: blue;
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
  content: 'YOU GOT 🎖SHAKE🎖 BY'!important;
  color: blue;
}

.chat {
	position: absolute;
	font-weight: bold;
	color: #4b0076;
	z-index: 6;
}

#chatOut {
	display: none;
	bottom: 2.5em;
	left: 1em;

}

#chatIn {
	display: none;
	color: #4b0076;
	bottom: 1em;
	left: 1em;
	width: 30%;
	border: none;
	background: none;
}

#ammo {
	text-align: right;
	font-size: 3.25em;
	font-family: 'Nunito', sans-serif;
	font-weight: bold;
	line-height: 1em;
	margin: 0;

	padding-right: 1.4em;
	padding-top: 0em;
	margin-bottom: 0.1em;

	background-image: url('https://media.discordapp.net/attachments/927072346647429200/949922254853128212/ammo-removebg-preview.png');
    background-position: right center;
	background-size: contain;
    background-repeat: no-repeat;
}

</style>`
    }
    document.body ? addScript() : document.addEventListener("DOMContentLoaded", e => addScript());
})();