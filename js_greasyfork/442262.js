// ==UserScript==
// @name         Viking Theme
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Theme for Viking
// @author       Stormii Cloud
// @match        https://shellshock.io/
// @icon         https://cdn.discordapp.com/attachments/842139863125327925/936795148409503794/viking_logo.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442262/Viking%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/442262/Viking%20Theme.meta.js
// ==/UserScript==

(function () {
    const addScript = () => {
        document.head.innerHTML += `<style>
*{
    --select-border: #777;
    --select-focus: blue;
    --select-arrow: var(--select-border);
    --ss-transparent: #00000000;
    --ss-black: #000;
    --ss-white: #FFFFFF;
    --ss-offwhite: #FFF3E4;
    --ss-yellow0: #F7FFC1;
    --ss-yellow: #FAF179;
    --ss-yolk0: #f1c59a;
    --ss-yolk: #F79520;
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
    --ss-blue3: #0B93BD;
    --ss-blue4: #0E7697;
    --ss-blue5: #0a5771;
    --ss-green0: #87ddbb;
    --ss-green1: #3ebe8d;
    --ss-green2: #2a7256;
    --ss-orange1: #F79520;
    --ss-vip-blue: #0E7FFF;
    --ss-vip-pink: #FF5AF5;
    --ss-vip-brown: #9F5600;
    --ss-vip-yellow: #FFFC00;
    --ss-vip-red: #EE2B2D;
    --ss-vip-purple: #40008F;
    --ss-vip-gold: linear-gradient(to right, #D1A943, #CFCDAF, #CC8630, #D1AA44, #CC8630);
    --ss-gold: #D1AA44;
    --ss-clear: rgba(255, 255, 255, 0);
    --ss-blue2clear: rgba(94, 186, 217, 0);
    --ss-shadow: rgba(0,0,0,0.4);
    --ss-blueshadow: #0a577187;
    --ss-darkoverlay: rgba(0, 0, 0, 0.8);
    --ss-darkoverlay2: rgba(0, 0, 0, 0.2);
    --ss-lightoverlay: url("https://cdn.discordapp.com/attachments/928071029358723192/928354450630934528/Screen_Shot_2022-01-05_at_10.28.49_AM.png"); /*Main Background*/
    --ss-lightbackground: linear-gradient(var(--ss-blue1), var(--ss-blue2) );
    --ss-blueblend1: linear-gradient(#349ec1, #5fbad8);
    --ss-scrollmask1: linear-gradient(var(--ss-blue2clear), var(--ss-blue2));
    --ss-scrollmask2: linear-gradient(rgba(56, 158, 192, 0), #389EC0);
    --ss-fieldbg: linear-gradient(#91CADB, #ffffff, #ffffff, #ffffff, #ffffff);
    --ss-nugSecs: 3600s;
    --ss-white-60: rgba(255,255,255,.6);
    --ss-white-90: rgba(255,255,255,.9);
    --ss-twitch: #6441a5;
    --twitch-color: #6441a5;
    --twitch-yellow: #FFFE61;
    --twitch-orange: #F7941D;
    --twitch-pink: #F00DC9;
    --twitch-dk-pink: #c00aa0;
    --twitch-lt-purple: #9146FF;
    --twitch-dk-purple: #40008F;
    --twitch-xtr-dk-purple: #1e0043;
    --ss-me-player-bg: rgba(247,149,32,.8);
    --ss-team-blue-light: rgb(96, 192, 224);
    --ss-team-blue-light-trans: rgb(96, 192, 224, 0.8);
    --ss-team-blue-dark: rgb(48, 128, 160);
    --ss-team-blue-dark-trans: rgb(48, 96, 160, 0.8);
    --ss-team-red-light: rgb(255, 64, 48);
    --ss-team-red-light-trans: rgb(255, 64, 48, 0.8);
    --ss-team-red-dark: rgb(160, 32, 24);
    --ss-team-red-dark-trans: rgb(160, 32, 24, 0.8);
    --ss-big-message-border-color: rgb(0, 0, 0);
    --ss-header-height: 10em;
    --ss-footer-height: 4em;
    --ss-main-width: 90em;
    --ss-min-width: 68em;
    --ss-space-xxxxl: calc(var(--ss-space-lg)*4);
    --ss-space-xxl: 2.3em;
    --ss-space-xl: 1.5em;
    --ss-space-lg: 1em;
    --ss-space-md: calc(var(--ss-space-lg)/2);
    --ss-space-sm: calc(var(--ss-space-md)/1.5);
    --ss-space-xs: calc(var(--ss-space-sm)/2);
    --ss-space-micro: calc(var(--ss-space-xs)/2);
}

#best_streak_container h1 {
    margin: 0;
    padding: 0;
    display: inline;
    text-shadow: var(--ss-space-micro) var(--ss-space-micro) var(--ss-shadow);
    font-family: 'Nunito', sans-serif !important;
    font-size: 2.5em !important;
    color: var(--ss-white) !important;
    font-weight: bold !important;
    text-transform: lowercase;
    padding-left: 1.1em;
    padding-top: 0em;
    background-image: url(https://cdn.discordapp.com/attachments/842139863125327925/941180805537988679/viking_logo.png);
    background-position: left center;
    background-size: contain;
    background-repeat: no-repeat;
}

#maskmiddle {
    background: url('https://cdn.discordapp.com/attachments/929836756717682748/941179460231786536/Viking_Scope.png') center center no-repeat;
    background-size: contain;
    width: 100vh;
    height: 100vh;
}

#maskleft, #maskright {
	background: black;
	flex: 1;
}

#logo {
  background-image: url('https://cdn.discordapp.com/attachments/929836756717682748/941174631333769236/3e2f9e12e83836313f8d333ea6323212.MOV-5.png');
  background-position: center;
  background-repeat: no-repeat;
	width: 100%;
  background-size: 17%;
  z-index: 5;
	min-width: var(--ss-min-width);
	height: var(--ss-header-height);
	position: absolute;
	text-align: center;
	top: 5em;
	left: 0;
	margin: 0 auto;
	pointer-events: none;
}

#logo img {
  display: none;
	height: 100%;
	pointer-events: none;
}

</style>`
    }
    document.body ? addScript() : document.addEventListener("DOMContentLoaded", e => addScript());
})();
