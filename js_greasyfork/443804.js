// ==UserScript==
// @name         Space and Time
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Look up, what do you see?
// @author       austin_is_cool_23
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
// @icon         https://st4.depositphotos.com/1000451/30856/i/1600/depositphotos_308568652-stock-photo-golden-egg-with-gold-crown.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443804/Space%20and%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/443804/Space%20and%20Time.meta.js
// ==/UserScript==
 
    (function () {
    const addScript = () => {
        document.head.innerHTML += `<style>
* {
	--ss-transparent: #00000000;
	--ss-black: #000;
	--ss-white: #8cb8ff; /*White Text*/
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
	--ss-blue00: #003b75;
	--ss-blue0: #ffffff;
	--ss-blue1: #0407b8;
	--ss-blue2: #003b75;
	--ss-blue3: #000123; /*Lighter Box Borders*/
	--ss-blue4: #003b75; /*Blue Subtitles, Darker Box Borders*/
	--ss-blue5: #171717;
	--ss-green0: #000000;
	--ss-green1: #000000;
	--ss-green2: #000000;
	--ss-orange1: #595959;
	--ss-vip-gold: linear-gradient(to right, #0004ff, #0003c9, #0002a1, #000170, #000147);
	--ss-clear: rgba(255, 255, 255, 0);
	--ss-blue2clear: rgba(94, 186, 217, 0);
	--ss-shadow: rgba(0,0,0,0.4);
	--ss-blueshadow: #4a4dff;
	--ss-darkoverlay: rgba(0, 0, 0, 0.8);
	--ss-darkoverlay2: rgba(0, 0, 0, 0.2);
	--ss-lightoverlay: url("https://cdn.discordapp.com/attachments/947546062615351327/967020457092067398/build-wallpaper.jpg"); /*Main Background*/
	--ss-lightbackground: linear-gradient(var(--ss-blue1), var(--ss-blue2));
	--ss-blueblend1: linear-gradient(#349ec1, #5fbad8); /*Some Box fill colors*/
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
</style>`
    }
    document.body ? addScript() : document.addEventListener("DOMContentLoaded", e => addScript());
})();
 
 