// ==UserScript==
// @name         Valiez theme
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Val's theme 
// @author       You
// @match        https://shellshock.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448293/Valiez%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/448293/Valiez%20theme.meta.js
// ==/UserScript==

(function () {
    const addScript = () => {
        document.head.innerHTML += `<style>
* {
	--ss-transparent: #00000000;
	--ss-black: #000;
	--ss-white: #FFFFFF; /*White Text*/
	--ss-offwhite: #FFF3E4;
	--ss-yellow0:#F7FFC1;
	--ss-yellow: #FAF179;
	--ss-yolk0: #f1c59a;
	--ss-yolk: #F79520; /*Yellow Buttons*/
	--ss-yolk2: #d97611;
	--ss-red0: #cf9d7a;
	--ss-red:  #b08d74;
	--ss-red2: #801919;
	--ss-red-bright: #EF3C39;
	--ss-pink: #EC008C;
	--ss-pink1: #b9006e;
	--ss-pink-light: #ff3aaf;
	--ss-brown: #924e0c;
	--ss-blue00:#ffc7e0;
	--ss-blue0: #fa93c1;
	--ss-blue1: #f2b1ce;
	--ss-blue2: #ffd4e7;
	--ss-blue3: #ffabd0; /*Lighter Box Borders*/
	--ss-blue4: #ffbfdc; /*Blue Subtitles, Darker Box Borders*/
	--ss-blue5: #dbb39c;
	--ss-green0: #87ddbb;
	--ss-green1: #cf9d7a;
	--ss-green2: #c29b80;
	--ss-orange1:#ffc2e9;
	--ss-vip-gold: linear-gradient(to right, #D1A943, #CFCDAF, #CC8630, #D1AA44, #CC8630);
	--ss-clear: rgba(255, 255, 255, 0);
	--ss-blue2clear: rgba(94, 186, 217, 0);
	--ss-shadow: rgba(0,0,0,0.4);
	--ss-blueshadow: #0a577187;
	--ss-darkoverlay: rgba(0, 0, 0, 0.8);
	--ss-darkoverlay2: rgba(0, 0, 0, 0.2);
	--ss-lightoverlay: url("https://media.discordapp.net/attachments/937129070121066546/999986326776582234/vecteezy_spring-cherry-blossom-mountain-landscape_5447389.jpg?width=715&height=457"); /*Main Background*/
	--ss-lightbackground: linear-gradient(var(--ss-blue1), var(--ss-blue2));
	--ss-blueblend1: , white /*Some Box fill colors*/
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
}
</style>`
    }
    document.body ? addScript() : document.addEventListener("DOMContentLoaded", e => addScript());
})();
