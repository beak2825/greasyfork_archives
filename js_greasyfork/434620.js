// ==UserScript==
// @name         CloudeCombo's Theme
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Subscribe to CloudeCombo
// @author       CloudeCombo
// @match        https://violentegg.club/
// @match        https://shellshock.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434620/CloudeCombo%27s%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/434620/CloudeCombo%27s%20Theme.meta.js
// ==/UserScript==

(function () {
    const addScript = () => {
        document.head.innerHTML += `<style>
* {
	--ss-transparent: #00000000;
	--ss-black: #000;
	--ss-white: #FFFFFF; /*White Text*/
	--ss-offwhite: #94fff6;
	--ss-yellow0:#52b0c7;
	--ss-yellow: #0acdfc;
	--ss-yolk0: #0acdfc;
	--ss-yolk: #009ec4; /*Yellow Buttons*/
	--ss-yolk2: #0051ff;
	--ss-red0: #fcb8ba;
	--ss-red: #f59596;
	--ss-red2: #f55858;
	--ss-red-bright: #f7211e;
	--ss-pink: #457df5;
	--ss-pink1: #00319c;
	--ss-pink-light: #a142ff;
	--ss-brown: #debdff;
	--ss-blue00: #d9f4fc;
	--ss-blue0: #c8edf8;
	--ss-blue1: #a2e3fa;
	--ss-blue2: #86e0fc;
	--ss-blue3: #4dd1fa; /*Lighter Box Borders*/
	--ss-blue4: #19c8ff; /*Blue Subtitles, Darker Box Borders*/
	--ss-blue5: #24a0c9;
	--ss-green0: #b0ffe9;
	--ss-green1: #b0fffa;
	--ss-green2: #48fad6;
	--ss-orange1: #3a00f7;
	--ss-vip-gold: linear-gradient(to right, #fce19a, #fcfbe3, #fab969, #ffd363, #f7a33b);
	--ss-clear: rgba(255, 255, 255, 0);
	--ss-blue2clear: rgba(94, 186, 217, 0);
	--ss-shadow: rgba(0,0,0,0.4);
	--ss-blueshadow: #0a577187;
	--ss-darkoverlay: rgba(0, 0, 0, 0.8);
	--ss-darkoverlay2: rgba(0, 0, 0, 0.2);
	--ss-lightoverlay: url("https://wallpaperaccess.com/full/1169836.jpg"); /*Main Background*/
	--ss-lightbackground: linear-gradient(var(--ss-blue1), var(--ss-blue2));
	--ss-blueblend1: linear-gradient(#349ec1, #5fbad8); /*Some Box fill colors*/
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
	background: url('https://cdn.discordapp.com/attachments/811268272418062359/856940530214109244/unknown.png') center center no-repeat;
	background-size: contain;
	width: 100vh;
	height: 100vh;
}
.crosshair {
	position: absolute;
	transform-origin: 50% top;
	top: 50%;
	border: solid 0.05em black;
	height: 0.8em;
	margin-bottom: 0.12em;
	opacity: 1;

	left: calc(50% - 0.15em);
	background: white;
	width: 0.3em;
}
.crosshair.normal {
	left: calc(50% - 0.15em);
	background: cyan;
	width: 0.3em;
}

.crosshair.powerful {
	left: calc(50% - 0.25em);
	background: black;
	width: 0.2em;
}
</style>`
    }
    document.body ? addScript() : document.addEventListener("DOMContentLoaded", e => addScript());
})();


