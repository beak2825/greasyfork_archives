// ==UserScript==
// @name         FrostPanda Theme
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Frost Panda YT's theme
// @author       Galeggy
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
// @downloadURL https://update.greasyfork.org/scripts/438159/FrostPanda%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/438159/FrostPanda%20Theme.meta.js
// ==/UserScript==

(function () {
    const addScript = () => {
        document.head.innerHTML += `<style>
* {
   --ss-transparent: #00000000;
   --ss-black: #000;
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
   --ss-blue00: #000000;
   --ss-blue0: #dd00ff;
   --ss-blue1: #dd00ff;
   --ss-blue2: #00fff7;
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
   --ss-lightoverlay: url("https://cdn.discordapp.com/attachments/913020191917625344/928922318468685824/unknown.png"); /*Main Background*/
   --ss-lightbackground: url("https://cdn.discordapp.com/attachments/913020191917625344/928922318468685824/unknown.png")
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

   scrollbar-width: thin;
   scrollbar-color: var(--ss-yolk) var(--ss-white);
} /* 1377 */

#maskmiddle {
	background: url('https://cdn.discordapp.com/attachments/366644989650010113/917761977495994378/Remix_scope.png') center center no-repeat;
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
	background: orange;
	width: 0.3em;
}
.crosshair.normal {
	left: calc(50% - 0.15em);
	background: orange;
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

    background-image: url('https://cdn.discordapp.com/attachments/928619502789328896/929000142772768768/channels4_profile-modified.png');
    background-position: left center;
    background-size: contain;
    background-repeat: no-repeat;
}

#healthContainer {
	position: absolute;
	left: 50%; bottom: 1em;
	transform: translateX(-50%);
	display: inline-block;
	width: 6em; height: 6em;
	background: url("ttps://cdn.discordapp.com/attachments/928619502789328896/929000142772768768/channels4_profile-modified.png");
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
	fill: yellow;
	stroke: blue;
	stroke-width: 1em;
	stroke-dasharray: 14.4513em;
	transition: all 0.3s ease-in-out;
}

.healthYolk {
	fill: green;
}
.egg_icon {
    height: 2em;
    margin: var(--ss-space-micro) var(--ss-space-sm) 0 0;
    content: url(https://cdn.discordapp.com/attachments/909790661916651530/925290665636691968/038.png);
}

</style>`
    }
    document.body ? addScript() : document.addEventListener("DOMContentLoaded", e => addScript());
})();