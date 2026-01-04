// ==UserScript==
// @name         Winter Theme (Shellshock.io)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Winter theme For Shellshock.io
// @author       SZN Winter
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
// @match        https://staging.shellshock.io/*
// @license MIT
// @icon         https://static-cdn.jtvnw.net/jtv_user_pictures/5c6d95b7-61ce-4112-b069-59f6990845dd-profile_image-300x300.png
// @downloadURL https://update.greasyfork.org/scripts/469311/Winter%20Theme%20%28Shellshockio%29.user.js
// @updateURL https://update.greasyfork.org/scripts/469311/Winter%20Theme%20%28Shellshockio%29.meta.js
// ==/UserScript==

    (function () {
    const addScript = () => {
        document.head.innerHTML += `<style>
* {
	--ss-transparent: #00000000;
	--ss-black: #000;s
	--ss-white: #000000; /*White Text*/
	--ss-offwhite: #00ffff;
	--ss-yellow0:##00ffff;
	--ss-yellow: #171717;
	--ss-yolk0: #171717;
	--ss-yolk: #00ffff; /*Yellow Buttons*/
	--ss-yolk2: #ffae00;
	--ss-red0: #00ffff;
	--ss-red: #00ffff;
	--ss-red2: #00ffff;
	--ss-red-bright: #00ffff;
	--ss-pink: #00ffff;
	--ss-pink1: #00ffff;
	--ss-pink-light: #00ffff;
	--ss-brown: #00ffff;
	--ss-blue00: ##-0000CC;
	--ss-blue0: #00ffff;
	--ss-blue1: #0407b8;
	--ss-blue2: ##0000CC;
	--ss-blue3: #CC66FF; /*Lighter Box Borders*/
	--ss-blue4: ##0000CC; /*Blue Subtitles, Darker Box Borders*/
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
	--ss-lightoverlay: url("https://static-cdn.jtvnw.net/jtv_user_pictures/f7ee3e7c-6aa1-4d95-a5f6-7f99a1c5a90e-profile_banner-480.png");  /*Main Background*/
	--ss-lightbackground: linear-gradient(var(--ss-blue1), var(--ss-blue2));
	--ss-blueblend1: linear-gradient(#349ec1, #5fbad8); /*Some Box fill colors*/
	--ss-scrollmask1: linear-gradient(var(--ss-blue2clear), var(--ss-blue2));
	--ss-scrollmask2: linear-gradient(rgba(56, 158, 192, 0), #389EC0);
	--ss-fieldbg: linear-gradient(#91CADB, #000000, #000000, #000000, #000000);
	--ss-white-60: rgba(10, 241, 229, 0.36);
	--ss-white-90: rgba(255, 255, 255, 1)

	--ss-me-player-bg: url("data:image/jpeg;base64,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");
	--ss-them-blue-bg: rgba(255, 145, 0, 1);
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
	stroke:blue;
	stroke-width: 1em;
	stroke-dasharray: 14.4513em;
	transition: all 0.3s ease-in-out;
}

.healthYolk {
	fill: aqua;
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
	background: cyan;
	width: 0.3em;
}

.crosshair.normal {
	left: calc(50% - 0.15em);
	background: cyan;
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
  content: url('https://i.gifer.com/Dv9E.gif');
}
.crosshair.powerful {
	left: calc(50% - 0.25em);
	background: cyan;
	width: 0.2em;
}

#maskmiddle {
	background: url('https://media.discordapp.net/attachments/705329064256208957/844281233432248390/boolet_scope.png') center center no-repeat;
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

    background-image: url('https://tse3.mm.bing.net/th?id=OIP.PYdSFJZdsy5MrCNl3bRKigHaHd&pid=Api&P=0&h=180');
    background-position: left center;
    background-size: contain;
    background-repeat: no-repeat;
}

.egg_icon {
    height: 2em;
   margin: var(--ss-space-micro) var(--ss-space-sm) 0 0;
   content: url(http://hypeorlando-prod.s3.amazonaws.com/millennial-mile/wp-content/uploads/sites/180/2017/01/snowflake-1077428_960_720.png)
}

#killBox::before{
  font-size: 1.4em;
  font-weight: 900;
  content: 'YOU FROZE'!important;
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
  content: 'YOU WERE FROZEN BY'!important;
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

	background-image: url('https://webstockreview.net/images/icicle-clipart-blue-snowflake-19.png');
    background-position: right center;
	background-size: contain;
    background-repeat: no-repeat;
}

</style>`
    }

    document.body ? addScript() : document.addEventListener("DOMContentLoaded", e => addScript());
})();