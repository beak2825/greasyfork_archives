// ==UserScript==
// @name         BearWizard360 theme
// @namespace    http://tampermonkey.net/
// @version      0.43
// @description  This is a theme created my me for bearwizard360
// @author       SilverHawk
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
// @icon         https://cdn.discordapp.com/attachments/1104426900765548554/1104472684152246342/hw4498r_1.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468234/BearWizard360%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/468234/BearWizard360%20theme.meta.js
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
	--ss-yolk: #000080; /*Yellow Buttons*/
	--ss-yolk2: #ffae00;
	--ss-red0: #f18f49;
	--ss-red: #f18f49;
	--ss-red2: #f18f49;
	--ss-red-bright: #f18f49;
	--ss-gold: gold;
	--ss-gold1: gold;
	--ss-gold-light: gold;
	--ss-brown: #f18f49;
	--ss-blue00: ##2A34D5;
	--ss-blue0: ##2A34D5;
	--ss-blue1: ##2A34D5;
	--ss-blue2: ##2A34D5;
	--ss-blue3: #00c0ff; /*Lighter Box Borders*/
	--ss-blue4: blue; /*Blue Subtitles, Darker Box Borders*/
	--ss-blue5: blue;
	--ss-green0: #000000;
	--ss-green1: #000000;
	--ss-green2: #000000;
	--ss-orange1: #595959;
	--ss-clear: rgba(255, 255, 255, 0);
	--ss-blue2clear: rgba(94, 186, 217, 0);
	--ss-shadow: rgba(0,0,0,0.4);
	--ss-blueshadow: #000080;
	--ss-darkoverlay: rgba((3, 138, 255);, 1);
	--ss-darkoverlay2: rgba((3, 138, 255);, 1);
    --ss-lightoverlay: url("https://cdn.discordapp.com/attachments/1104426900765548554/1116219416015814666/Untitled_design_3.png");/*Main Background*/
    --ss-lightbackground: linear-gradient(var(--ss-blue1), var(--ss-blue2));
    --ss-blueblend1: linear-gradient(#9ec134, #9ec134); /*Some Box fill colors*/
    --ss-scrollmask1: linear-gradient(var(--ss-blue2clear), var(--ss-blue2));
    --ss-scrollmask2: linear-gradient(rgba(000000), #000000);
    --ss-fieldbg: linear-gradient(#91CADB, #000000, #000000, #000000, #000000);
    --ss-white-60: rgba(255,255,255,.6);
    --ss-white-90: rgba(255,255,255,.9);
    --ss-them-blue-bg: rgba(255, 255, 0,.8);
	--ss-them-blue-color: #003b75;
	--ss-them-red-bg:  rgb(133,0,0,.8);
	--ss-them-red-color: red
	--ss-me-red-bg: rgba(255,65,69,.8);
	--ss-me-blue-bg: rgb(94,187,217,.8);
    --ss-me-player-bg: url("https://cdn.discordapp.com/attachments/1104426900765548554/1116216928315375626/Untitled_design_2.png")
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
	fill: Silver;
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
	background: aqua;
	width: 0.3em;
}

.crosshair.normal {
	left: calc(50% - 0.15em);
	background: aqua;
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
  content: url('https://cdn.discordapp.com/attachments/1104500998879334521/1104501149991714896/shieldshs.png');
}

.hardBoiledShield {
    position: absolute;
    transform: translateX(-50%);
    height: 100%;
  content: url('https://cdn.discordapp.com/attachments/1104500998879334521/1104501149991714896/shieldshs.png');
}

.crosshair.powerful {
	left: calc(50% - 0.25em);
	background: aqua;
	width: 0.2em;
}

#maskmiddle {
	background: url('https://cdn.discordapp.com/attachments/1104426900765548554/1116443744078680074/blue_scope.png') center center no-repeat;
	background-size: contain;
    width: 100vh;
	height: 100vh;
}
.playerSlot--icons .vip-egg {
	text-shadow: 1px 1px 2px rgb(0 0 0 / 50%);
  content: url('https://cdn.discordapp.com/attachments/1104426900765548554/1110269416693846066/Skullnado..webp') !important;
  max-height: 1.3em;
  max-width: 1.3em;
}


#best_streak_container h1 {
    margin: 0; padding: 0;
    display:inline
    text-shadow: var(--ss-space-micro) var(--ss-space-micro) var(--ss-shadow);



    font-family: 'Nunito', sans-serif !important;
    font-size: 2.5em !important;
    color: var(--ss-white) !important;
    font-weight: bold !important;
    text-transform: lowercase;

    padding-left: 1.5em;
    padding-top: 0em;

    background-image: url('https://cdn.discordapp.com/attachments/1107813254786469889/1116207798368350258/Grogu_Drip.png');
    background-position: left center;
    background-size: contain;
    background-repeat: no-repeat;


}

.egg_icon {
    height: 2em;
   margin: var(--ss-space-micro) var(--ss-space-sm) 0 0;
   content: url(https://cdn.discordapp.com/attachments/1107813254786469889/1116211923906736259/download.jpeg)
}

#killBox::before{
  font-size: 1.4em;
  font-weight: 900;
  content: 'YOU 360ed'!important;
  color: #000080;
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
  content: 'YOU GOT 360ed BY'!important;
  color: #000080;
}

.chat {
	position: absolute;
	font-weight: bold;
	color: silver;
	z-index: 6;
}

#chatOut {
	display: none;
	bottom: 2.5em;
	left: 1em;
}

#chatIn {
	display: none;
	color: silver;
	bottom: 1em;
	left: 1em;
	width: 30%;
	border: none;
	background: none;
}
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
{


</style>`
    }
    document.body ? addScript() : document.addEventListener("DOMContentLoaded", e => addScript());
})();