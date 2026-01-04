// ==UserScript==
// @name         Quackshot Theme (shellshock.io)
// @namespace    http://tampermonkey.net/
// @version      10.7
// @description  Quack those hard-boiled eggs! Main Code made by Silver Hawk
// @author       Quackshot YT
// @match        https://shellshock.io/
// @match        https://algebra.best/
// @match        https://algebra.vip/
// @match        https://biologyclass.club/
// @match        https://deadlyegg.com/
// @match        https://deathegg.world/
// @match        https://egg.dance/
// @match        https://eggboy.club/
// @match        https://eggboy.xyz/
// @match        https://eggcombat.com/
// @match        https://eggfacts.fun/
// @match        https://egghead.institute/
// @match        https://eggisthenewblack.com/
// @match        https://eggsarecool.com/
// @match        https://eggshooter.best/
// @match        https://geometry.best/
// @match        https://geometry.monster/
// @match        https://geometry.pw/
// @match        https://geometry.report/
// @match        https://hardboiled.life/
// @match        https://hardshell.life/
// @match        https://humanorganising.org/
// @match        https://mathactivity.xyz/
// @match        https://mathdrills.info/
// @match        https://mathdrills.life/
// @match        https://mathfun.rocks/
// @match        https://mathgames.world/
// @match        https://math.international/
// @match        https://mathlete.fun/
// @match        https://mathlete.pro/
// @match        https://new.shellshock.io/
// @match        https://overeasy.club/
// @match        https://scrambled.best/
// @match        https://scrambled.tech/
// @match        https://scrambled.today/
// @match        https://scrambled.us/
// @match        https://scrambled.world/
// @match        https://shellsocks.com/
// @match        https://shellshockers.club/
// @match        https://shellshockers.site/
// @match        https://shellshockers.us/
// @match        https://shellshockers.world/
// @match        https://shellshockers.xyz/
// @match        https://softboiled.club/
// @match        https://urbanegger.com/
// @match        https://violentegg.club/
// @match        https://violentegg.fun/
// @match        https://yolk.best/
// @match        https://yolk.life/
// @match        https://yolk.quest/
// @match        https://yolk.rocks/
// @match        https://yolk.tech/
// @match        https://yolk.today/
// @match        https://zygote.cafe/
// @icon         https://yt3.googleusercontent.com/gQQDVazSkagvTOYk4UAI_hAwbIhOjMp82ewhQ4NpkOt1mtA-Z1Bc1dYX97gzZKHECKw13uNF=s176-c-k-c0x00ffffff-no-rj
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467192/Quackshot%20Theme%20%28shellshockio%29.user.js
// @updateURL https://update.greasyfork.org/scripts/467192/Quackshot%20Theme%20%28shellshockio%29.meta.js
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
	--ss-blue00: #800080;
	--ss-blue0: #800080;
	--ss-blue1: #800080;
	--ss-blue2: #800080;
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
	--ss-blueshadow: #f18f49;
	--ss-darkoverlay: rgba(0, 0, 0, 0.8);
	--ss-darkoverlay2: rgba(0, 0, 0, 0.2);
    --ss-lightoverlay: url("https://media.discordapp.net/attachments/954955109417226300/1111583642146320464/Untitled_design_2.png?width=1766&height=994");/*Main Background*/
    --ss-lightbackground: linear-gradient(var(--ss-blue1), var(--ss-blue2));
    --ss-blueblend1: linear-gradient(#9ec134, #9ec134); /*Some Box fill colors*/
    --ss-scrollmask1: linear-gradient(var(--ss-blue2clear), var(--ss-blue2));
    --ss-scrollmask2: linear-gradient(rgba(56, 158, 192, 0), #389EC0);
    --ss-fieldbg: linear-gradient(#91CADB, #000000, #000000, #000000, #000000);
    --ss-white-60: rgba(255,255,255,.6);
    --ss-white-90: rgba(255,255,255,.9);
    --ss-them-blue-bg: rgba(255, 255, 0,.8);
	--ss-them-blue-color: #003b75;
	--ss-them-red-bg:  rgb(133,0,0,.8);
	--ss-them-red-color: red
	--ss-me-red-bg: rgba(255,65,69,.8);
	--ss-me-blue-bg: rgb(94,187,217,.8);
    --ss-me-player-bg: url("https://www.icolorpalette.com/download/solidcolorimage/d4af37_solid_color_background_icolorpalette.png")
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
	fill: gold;
	stroke: Silver;
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
  content: url('https://media-public.canva.com/FlgRo/MAFUCLFlgRo/1/tl.png');
}

.hardBoiledShield {
    position: absolute;
    transform: translateX(-50%);
    height: 100%;
  content: url('https://media-public.canva.com/FlgRo/MAFUCLFlgRo/1/tl.png');
}

.crosshair.powerful {
	left: calc(50% - 0.25em);
	background: gold;
	width: 0.2em;
}

#maskmiddle {
	background: url('https://media.discordapp.net/attachments/954955109417226300/1111821961631371314/Untitled1.png?width=994&height=994') center center no-repeat;
	background-size: contain;
    width: 100vh;
	height: 100vh;
}
.playerSlot--icons .vip-egg {
	text-shadow: 1px 1px 2px rgb(0 0 0 / 50%);
  content: url('https://media.discordapp.net/attachments/954955109417226300/1111593846128779336/VIP-removebg-preview.png?width=994&height=994') !important;
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

    background-image: url('https://media.discordapp.net/attachments/954955109417226300/1111597988951904256/channels4_profile-removebg-preview.png?width=352&height=352');
    background-position: left center;
    background-size: contain;
    background-repeat: no-repeat;


}

.egg_icon {
    height: 2em;
   margin: var(--ss-space-micro) var(--ss-space-sm) 0 0;
   content: url(https://cdn.discordapp.com/attachments/1104500998879334521/1104501138478333962/egg.png)
}

#killBox::before{
  font-size: 1.4em;
  font-weight: 900;
  content: 'YOU QUACKED'!important;
  color: yellow;
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
  content: 'YOU GOT QUACKED BY'!important;
  color: yellow;
}

.chat {
	position: absolute;
	font-weight: bold;
	color: gold;
	z-index: 6;
}

#chatOut {
	display: none;
	bottom: 2.5em;
	left: 1em;
}

#chatIn {
	display: none;
	color: gold;
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



</style>`
    }
    document.body ? addScript() : document.addEventListener("DOMContentLoaded", e => addScript());
})();