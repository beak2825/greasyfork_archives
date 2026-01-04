// ==UserScript==
// @name         CxS Clan Theme
// @namespace    http://greasyfork.org/
// @version      1.1
// @description  The official CxS Clan Theme
// @author       bendy
// @match        https://shellshock.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467394/CxS%20Clan%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/467394/CxS%20Clan%20Theme.meta.js
// ==/UserScript==

(function () {
    const addScript = () => {
        document.title="CxS Clan Theme"
        document.head.innerHTML += `<style>


/* ----------------------------------------------------------------- Global -- */

:root {
	--select-border: #000;
	--select-focus: black;
	--select-arrow: var(--select-border);

	--ss-transparent: #00000000;
	--ss-black: #000;
	--ss-adblocker-text: #000000;
	--ss-white: #000000;
	--ss-offwhite: #3b333e;
	--ss-yellow0:#000000;
	--ss-yellow: #0082ff;
	--ss-yolk0: #0082ff;
	--ss-yolk: #0082ff;
	--ss-yolk2: #0082ff;
	--ss-red0: #0082ff;
	--ss-red: #000000;
	--ss-red2: #000000;
	--ss-egg-org: #0082ff;
	--ss-red-bright: #0082ff;
	--ss-pink: #d55bff;
	--ss-pink1: #d55bff;
	--ss-pink-light: #d55bff;
	--ss-pink-dark: #a7098c;
	--ss-brown: #08e694;
	--ss-blue00: #08e694;
	--ss-blue0: #08e694;
	--ss-blue1: #0082ff;
	--ss-blue2: #d55bff;
	--ss-blue3: #d55bff;
	--ss-blue4: #000000;
	--ss-blue5: #0C576F;
	--ss-blue6: #0082ff;
	--ss-blue7: #00c0ff;
	--ss-blue8: #000000;
	--ss-green0: #87ddbb;
	--ss-green1: #13BA65;
	--ss-green2: #046306;
	--ss-green-login: #13ba65;
	--ss-orange1: #0082ff;
	--ss-vip-blue: #0E7FFF;
	--ss-vip-pink: #FF5AF5;
	--ss-vip-brown: #0082ff;
	--ss-vip-yellow: #08e694;
	--ss-vip-red: #0082ff;
	--ss-vip-purple: #0082ff;
	--ss-vip-gold: linear-gradient(to right, #D1A943, #CFCDAF, #CC8630, #D1AA44, #CC8630);
	--ss-gold: #0082ff;
	--ss-clear: rgba(255, 255, 255, 0);
	--ss-blue2clear: rgba(94, 186, 217, 0);
	--ss-blue2alpha7: rgb(0 0 0 / 70%);
	--ss-white-60: rgba(255,255,255,.6);
	--ss-white-90: rgba(255,255,255,.9);
	--ss-twitch: #df00ff;
    --twitch-color: #c603ff;
	--twitch-yellow: #0082ff;
	--twitch-pink: #ffa6f0;
	--twitch-dk-pink: #c00aa0;
	--twitch-lt-purple: #0082ff;
	--twitch-dk-purple: #000000;
	--twitch-xtr-dk-purple: #000000;


	/* Redsign colors */
	--ss-orange: #000000;
	--ss-brown-2: #0082ff;
	--ss-vip: #000000;
	--ss-red-btn-fill: #0082ff;
	--ss-red-btn-outline: #000000;

	--ss-limited: #000000;
	--ss-limited-txt: #ff16b8;
	--ss-premium: #08e694;
	--ss-premium-txt: #000000;
	----ss-vip: #08e694;
	--ss-vip-txt: #000000;

	--ss-darkoverlay: rgba(0, 0, 0, 0.6);
	--ss-darkoverlay2: rgba(0, 0, 0, 0.2);
	--ss-lightoverlay: linear-gradient(#000000, #000000, var(--ss-blue00), var(--ss-blue00));
	--ss-lightbackground: linear-gradient(var(--ss-blue1), var(--ss-blue2) );
	--ss-blueblend1: linear-gradient(#000000, #000000);
	--ss-scrollmask1: linear-gradient(var(--ss-blue2clear), var(--ss-blue00));
	--ss-scrollmask2: linear-gradient(rgba(56, 158, 192, 0), #389EC0);
	--ss-fieldbg: linear-gradient(#000000, #ffffff, #ffffff, #ffffff, #ffffff);
	--ss-nugSecs: 3600s;
	--ss-me-player-bg: rgb(41 255 166 / 80%);

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

	--border-radius: 0.4em;
	--ss-border-radius-sm: 0.2em;
	--ss-common-border-width: .2em;


	/* Element dimensions */
	--ss-logo-width: calc(var(--ss-space-lg)*14);
	--ss-menu-width: calc(var(--ss-logo-width) - var(--ss-space-lg));

	--ss-main-sidebar-width: 16em;
	--ss-sidebar-width: calc(var(--ss-space-lg)*18.2);
	--ss-aside-panel-width: 20em;

	--ss-item-mask-height: calc(var(--ss-space-lg)*4);
	--ss-item-mask-width: calc(var(--ss-aside-panel-width) - 1.3em);
	--ss-item-box: calc(var(--ss-space-lg)*5.5);

	--ss-account-panel-height: calc(var(--ss-space-lg)*4);

	--ss-chat-wrapper-width: 14.5em;
	--ss--chat-height: 14.5em;

	--ss-media-social-width: 17.7em;

	--paused-ui-scale: .6;
	--paused-ui-vip-scale: .9;

	--chw-bubble-width: 9em;
	--chw-bubble-height: 3.3em;

	--home-screen-r-padding: .68em;

	/* shadows */
	--ss-box-shadow-1:  .16em .16em 0 rgb(0 0 0 / 50%);
	--ss-box-shadow-2: .15em .15em 0 rgb(0 0 0 / 90%);
	--ss-box-shadow-3: .15em .15em 0 rgb(0 0 0 / 90%);
	--ss-text-shadow-1: .1em .1em 0 rgb(0 0 0 / 80%);

	--ss-shadow: rgba(0,0,0,.4);
	--ss-blueshadow: #0a577187;
	--ss-btn-common-txt-shadow: .1em .1em 0 rgb(0 0 0 / 30%);
	--ss-btn-common-txt-shadow-blur: .1em .1em .5em rgb(0 0 0 / 30%);

	--ss-shadow-filter: drop-shadow(var(--ss-btn-common-txt-shadow));


	/* button bevel */
	--ss-btn-light-bevel: inset 0 .15em .2em;
	--ss-btn-dark-bevel: inset -.1em -.15em .1em;


	--ss-border-blue5: var(--ss-common-border-width) solid var(--ss-blue5);

	--ss-type-icon-size: 2.8em;

	--ss-equip-icon-size: 4em;

	--ss-media-stats-height: 30.5em;
	--gauge-timer-sec: 2deg;
	--gauge-value-start: 0deg;
	--gauge-value-end: 180deg;
	--gauge-value: 180deg;
	--gauge-shadow-blur: 2em;
}


#killBox::before{
  font-size: 1.4em;
  font-weight: 900;
  content: 'YOU ELIMINATED'!important;
  color: black;
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
  content: 'YOU GOT ELIMINATED BY'!important;
  color: black;
}

#scopeBorder {
	box-sizing: initial;
	display: flex;
	flex-direction: row;
	justify-content: center;
	width: 100vw; height: 100vh;
	position: absolute;
	top: 0px; left: 0px;
	pointer-events: none;
	overflow-x: hidden;
}

#maskleft, #maskright {
	background: var(--ss-black);
	flex: 1;
}

#maskmiddle {
	background: url('../img/scope.png') center center no-repeat;
	background-size: contain;
	width: 100vh;
	height: 100vh;
}

.crosshair {
	position: absolute;
	transform-origin: 50% top;
	top: 50%;
	border: solid 0.05em #d55bff;
	height: 0.8em;
	margin-bottom: 0.12em;
	opacity: 0.7;
}

.crosshair.normal {
	left: calc(50% - 0.15em);
	background: #05fcf4;
	width: 0.3em;
}

.crosshair.powerful {
	left: calc(50% - 0.25em);
	background: red;
	width: 0.5em;
}

#dotReticle {
	position: absolute;
	left: 50%; top: 50%;
	transform: translate(-50%, -50%);
	background: var(--ss-yolk);
	width: 0.7em; height: 0.7em;
	border-radius: 100%;
}

#shotReticleContainer {
	position: absolute;
	text-align: center;
	left: 50%; top: 50%;
	transform: translate(-50%, -50%);
	opacity: 0.7;
	overflow-x: hidden;
}

#reticleContainer {
	position: fixed;
	top: 0; left: 0;
	width: 100%; height: 100%;
}

#crosshairContainer {
	position: absolute;
	left: 50%; top: 50%;
	transform: perspective(0px);
}

.shotReticle {
	box-sizing: border-box;
	position: absolute;
	left: 50%;
	width: 2.5em;
	height: 100%;
	transform-origin: center;
	background: transparent;
	border: solid;
	border-left: solid transparent;
	border-right: solid transparent;
	border-radius: 1.25em 1.25em 1.25em 1.25em;
}

.shotReticle:nth-child(1n) {
	transform: translateX(-50%) rotate(0deg);
}

.shotReticle:nth-child(2n) {
	transform: translateX(-50%) rotate(90deg);
}

.shotReticle.fill {
}

.shotReticle.border {
}

.shotReticle.fill.normal {
	border-color: blue;
	border-left: solid transparent;
	border-right: solid transparent;
	border-width: 0.1em;
	padding: 0.1em;
}

.shotReticle.fill.powerful {
	border-color: red;
	border-left: solid transparent;
	border-right: solid transparent;
	border-width: 0.3em;
	padding: 0.1em;
}

.shotReticle.border.normal {
	border-color: #d55bff;
	border-left: solid transparent;
	border-right: solid transparent;
	border-width: 0.2em;
}

.shotReticle.border.powerful {
	border-color: #d55bff;
	border-left: solid transparent;
	border-right: solid transparent;
	border-width: 0.4em;
}
}

#ammo {
	text-align: right;
	font-size: 3.25em;
	font-family: 'Nunito', sans-serif;
	font-weight: bold;
	line-height: 1em;
	margin: 0;

	padding-right: 1.2em;
	padding-top: 0em;
	margin-bottom: 0.1em;

	background-image: url(../img/ico_ammo.png);
    background-position: right center;
	background-size: contain;
    background-repeat: no-repeat;
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
	font-family: 'Nunito', sans-serif;
    font-weight: bold;
    color: var(--ss-white);
    font-size: 1.2em;
    transform: translateY(-3.45em);
}

.healthBar {
	transform-origin: center;
	transform: rotate(90deg);
	fill: transparent;
	stroke: white;
	stroke-width: 1em;
	stroke-dasharray: 14.4513em;
	transition: all 0.3s ease-in-out;
}

.healthYolk {
	fill: green;
}

.healthSvg {
	width: 100%; height: 100%;
}

#hardBoiledContainer {
	position: absolute;
	left: 50%; bottom: 1em;
	transform: translateX(-50%);
	display: inline-block;
	width: 6em; height: 6em;
	text-align: center;
}

#hardBoiledValue {
	font-family: 'Nunito', sans-serif;
    font-weight: bold;
    color: var(--ss-white);
    font-size: 1.6em;
    transform: translateY(-2.6em);
}

#hardBoiledShieldContainer {
	width: 100%;
	height: 100%;
}

.hardBoiledShield {
	position: absolute;
	transform: translateX(-50%);
	height: 100%;
}

</style>`
    }
    document.body ? addScript() : document.addEventListener("DOMContentLoaded", e => addScript());
})();