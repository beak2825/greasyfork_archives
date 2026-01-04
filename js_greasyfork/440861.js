// ==UserScript==
// @name         18-0241 ( x18_ ) Theme
// @namespace    http://tampermonkey.net/
// @version      2.0.5
// @description  Subscribe to x18_
// @author       18-0241
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
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440861/18-0241%20%28%20x18_%20%29%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/440861/18-0241%20%28%20x18_%20%29%20Theme.meta.js
// ==/UserScript==

(function () {
    const addScript = () => {
        document.head.innerHTML += `<style>
* {

	--ss-blue3: url("data:image/jpeg;base64,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"); /*Lighter Box Borders*/
	--ss-blue4: #ff474e; /*Blue Subtitles, Darker Box Borders*/
	--ss-blue5: #24a0c9;
	--ss-green0: #FFFFFF;
	--ss-green1: #FFFFFF;
	--ss-green2: #FFFFFF;
	--ss-orange1: #FFFFFF;
	--ss-vip-gold: url("https://pin.it/3Oy1p1Q")
	--ss-clear: rgba(255, 255, 255, 0);
	--ss-blue2clear: rgba(94, 186, 217, 0);
	--ss-shadow: rgba(0,0,0,0.4);
	--ss-blueshadow: #83gh943;
	--ss-darkoverlay: rgba(0, 0, 0, 0.8);
	--ss-darkoverlay2: rgba(0, 0, 0, 0.2);
	--ss-lightoverlay: url("https://images.unsplash.com/photo-1552910996-e666ad64695c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c25vd3klMjBiYWNrZ3JvdW5kfGVufDB8fDB8fA%3D%3D&w=1000&q=80"); /*Main Background*/
    --ss-lightoverlay2: url ("https://media.istockphoto.com/photos/winter-snowy-day-in-a-beautiful-forest-picture-id1069974748")
    --ss-lightbackground: url("https://images.unsplash.com/photo-1552910996-e666ad64695c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c25vd3klMjBiYWNrZ3JvdW5kfGVufDB8fDB8fA%3D%3D&w=1000&q=80=")
    --ss-scrollmask1: linear-gradient(var(--ss-blue2clear), var(--ss-blue2));
	--ss-scrollmask2: linear-gradient(rgba(56, 158, 192, 0), #389EC0);
	--ss-fieldbg: linear-gradient(#91CADB, #ffffff, #ffffff, #ffffff, #ffffff);
	--ss-white-60: rgba(255,255,255,.6);
	--ss-white-90: rgba(255,255,255,.9);

	--ss-me-player-bg: rgba(247,149,32,.8);
	--ss-them-blue-bg: rgba(0,66,87,.8);
	--ss-them-blue-color: #5ebbd9;
	--ss-them-red-bg:  rgb(133,0,0,.8);
	--ss-them-red-color: #ff4145
	--ss-me-red-bg: rgba(255,65,69,.8);
	--ss-me-blue-bg: rgb(94,187,217,.8);
} /* 1377 */

#maskmiddle {
	background: url('https://cdn.discordapp.com/attachments/922648564037992461/949851747659186246/EHHHHHHHHHHHHHHHHHHHHHHHHHH.png') center center no-repeat;
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
	background: #1d5c83.;
	width: 0.3em;
}
.crosshair.normal {
	left: calc(50% - 0.15em);
	background: #1d5c83.;
	width: 0.3em;
}

.crosshair.powerful {
	left: calc(50% - 0.25em);
	background: multicolour;
	width: 0.2em;
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

    background-image: url('https://c.tenor.com/pcw4us9DIyoAAAAC/we-bare-bears-snow-bear.gif');
    background-position: left center;
    background-size: contain;
    background-repeat: repeat;
}

#healthContainer {
	position: absolute;
	left: 50%; bottom: 1em;
	transform: translateX(-50%);
	display: inline-block;
	width: 6em; height: 6em;
	background: url("https://c.tenor.com/pcw4us9DIyoAAAAC/we-bare-bears-snow-bear.gif");
    background-position: bottom center;
	border-radius: 50%;
	text-align: center;
}

#health {
}

#healthHp {
	font-family: 'Nunito', bold italic;
    font-weight: bold;
    color: var(--ss-yellow);
    font-size: 1.2em;
    transform: translateY(-3.45em);
}

.healthBar {
	transform-origin: center;
	transform: rotate(90deg);
	fill: white;
	stroke: blue;
	stroke-width: 1em;
	stroke-dasharray: 14.4513em;
	transition: all 0.3s ease-in-out;
}

.healthYolk {
	fill: white;
}
.egg_icon {
    height: 2em;
    margin: var(--ss-space-micro) var(--ss-space-sm) 0 0;
    content: url(https://c.tenor.com/pcw4us9DIyoAAAAC/we-bare-bears-snow-bear.gif);
}

</style>`
    }
    document.body ? addScript() : document.addEventListener("DOMContentLoaded", e => addScript());
})();