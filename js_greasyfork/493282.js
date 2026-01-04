// ==UserScript==
// @name          Majic_Hex_Shellshockers_theme
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Blue_hex_theme
// @author       You
// @match        https://shellshock.io/*
// @match        https://yolk.quest/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493282/Majic_Hex_Shellshockers_theme.user.js
// @updateURL https://update.greasyfork.org/scripts/493282/Majic_Hex_Shellshockers_theme.meta.js
// ==/UserScript==

(function () {
    const addScript = () => {
        document.head.innerHTML += `<style>
* {
	--ss-transparent: #00000000;
	--ss-black: #000;
	--ss-white: #FFFFFF; /*black Text*/
	--ss-offwhite: #FFF3E4;
	--ss-yellow0:#F7FFC1;
	--ss-yellow: #FAF179;
	--ss-yolk0: #f1c59a;
	--ss-yolk: #203b85; /*Yellow Buttons*/
	--ss-yolk2: #d97611;
	--ss-red0: #e29092;
	--ss-red: #d15354;
	--ss-red2: #801919;
	--ss-red-bright: #EF3C39;
	--ss-pink: #EC008C;
	--ss-pink1: #b9006e;
	--ss-pink-light: #ff3aaf;
	--ss-brown: #924e0c;
	--ss-blue00: #abe3f6;
	--ss-blue0: #c8edf8;
	--ss-blue1: #95E2FE;
	--ss-blue2: #5EBBD9;
	--ss-blue3: #0B93BD; /*Lighter Box Borders*/
	--ss-blue4: #0E7697; /*red Subtitles, Darker Box Borders*/
	--ss-blue5: #0a5771;
	--ss-green0: #87ddbb;
	--ss-green1: #3ebe8d;
	--ss-green2: #2a7256;
	--ss-orange1: #F79520;
	--ss-vip-gold: linear-gradient(to right, #D1A943, #CFCDAF, #CC8630, #D1AA44, #CC8630);
	--ss-clear: rgba(255, 255, 255, 0);
	--ss-blue2clear: rgba(94, 186, 217, 0);
	--ss-shadow: rgba(0,0,0,0.4);
	--ss-blueshadow: #0a577187;
	--ss-darkoverlay: rgba(0, 0, 0, 0.8);
	--ss-darkoverlay2: rgba(0, 0, 0, 0.2);
	--ss-lightoverlay: url("https://images.alphacoders.com/116/thumb-1920-1169862.jpg"); /*Main Background*/
	--ss-lightbackground: linear-gradient(var(--ss-blue1), var(--ss-blue2));
	--ss-blueblend1: linear-gradient(#349ec1, #5fbad8); /*Some Box fill colors*/
	--ss-scrollmask1: linear-gradient(var(--ss-blue2clear), var(--ss-blue2));
	--ss-scrollmask2: linear-gradient(rgba(56, 158, 192, 0), #389EC0);
	--ss-fieldbg: linear-gradient(#91CADB, #ffffff, #ffffff, #ffffff, #ffffff);
	--ss-white-60: rgba(255,255,255,.6);
	--ss-white-90: rgba(255,255,255,.9);

	--ss-me-player-bg: url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOkrKhpW1FJSYhMxIqDZrx5VFsuoPtB1dna55cMNlvEdFEIqACYohO25uZ3KUHKpMFK1g&usqp=CAU");
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
})();// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://greasyfork.org/en/scripts?q=shell+shockers+theme
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();