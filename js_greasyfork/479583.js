// ==UserScript==
// @name         A Green ShellShock Theme
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  It's ShellShockers but Green!
// @icon         https://www.clker.com/cliparts/d/E/Y/K/Q/E/happy-green-face-md.png
// @author       Lei
// @match        https://shellshock.io/*
// @match        https://staging.shellshock.io/*
// @match        https://dev.shellshock.io/*
// @match        https://algebra.best/*
// @match        https://algebra.vip/*
// @match        https://biologyclass.club/*
// @match        https://deadlyegg.com/*
// @match        https://deathegg.world/*
// @match        https://egg.dance/*
// @match        https://eggboy.club/*
// @match        https://eggboy.xyz/*
// @match        https://eggcombat.com/*
// @match        https://eggfacts.fun/*
// @match        https://egghead.institute/*
// @match        https://eggisthenewblack.com/*
// @match        https://eggsarecool.com/*
// @match        https://eggshooter.best/*
// @match        https://geometry.best/*
// @match        https://geometry.monster/*
// @match        https://geometry.pw/*
// @match        https://geometry.report/*
// @match        https://hardboiled.life/*
// @match        https://hardshell.life/*
// @match        https://humanorganising.org/*
// @match        https://mathactivity.xyz/*
// @match        https://mathdrills.info/*
// @match        https://mathdrills.life/*
// @match        https://mathfun.rocks/*
// @match        https://mathgames.world/*
// @match        https://math.international/*
// @match        https://mathlete.fun/*
// @match        https://mathlete.pro/*
// @match        https://new.shellshock.io/*
// @match        https://overeasy.club/*
// @match        https://scrambled.best/*
// @match        https://scrambled.tech/*
// @match        https://scrambled.today/*
// @match        https://scrambled.us/*
// @match        https://scrambled.world/*
// @match        https://shellsocks.com/*
// @match        https://shellshockers.club/*
// @match        https://shellshockers.site/*
// @match        https://shellshockers.us/*
// @match        https://shellshockers.world/*
// @match        https://shellshockers.xyz/*
// @match        https://softboiled.club/*
// @match        https://urbanegger.com/*
// @match        https://violentegg.club/*
// @match        https://violentegg.fun/*
// @match        https://yolk.best/*
// @match        https://yolk.life/*
// @match        https://yolk.quest/*
// @match        https://yolk.rocks/*
// @match        https://yolk.tech/*
// @match        https://yolk.today/*
// @match        https://zygote.cafe/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479583/A%20Green%20ShellShock%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/479583/A%20Green%20ShellShock%20Theme.meta.js
// ==/UserScript==

(function () {
    const addScript = () => {
        document.title="Green Shell Shockers"
        document.head.innerHTML += `<style>

:root {
    --select-border: #777;
    --select-focus: blue;
    --select-arrow: var(--select-border);
    --ss-transparent: #00000000;
    --ss-black: #000;
    --ss-adblocker-text: #003449;
    --ss-white: #baff86;
    --ss-offwhite: #000000;
    --ss-yellow0: #F7FFC1;
    --ss-yellow: #FAF179;
    --ss-yolk0: #6bebff;
    --ss-yolk: #20f7cd;
    --ss-yolk2: #11d9c0;
    --ss-red0: #e29092;
    --ss-red: #d15354;
    --ss-red2: #000000;
    --ss-egg-org: #EE2524;
    --ss-red-bright: #EF3C39;
    --ss-pink: #EC008C;
    --ss-pink1: #b9006e;
    --ss-pink-light: #ff3aaf;
    --ss-pink-dark: #a7098c;
    --ss-brown: #016e0f;
    --ss-blue00: #abf6be;
    --ss-blue0: #c8f8d1;
    --ss-blue1: #95fea5;
    --ss-blue2: #63d95e;
    --ss-blue3: #0bbd28;
    --ss-blue4: #0e9728;
    --ss-blue5: #0c6f1f;
    --ss-blue6: #90ea8d;
    --ss-blue7: #00ff0d;
    --ss-blue8: #1abc11;
    --ss-green0: #90dd87;
    --ss-green1: #1bba13;
    --ss-green2: #046306;
    --ss-green-login: #3dba13;
    --ss-orange1: #F79520;
    --ss-vip-blue: #0E7FFF;
    --ss-vip-pink: #FF5AF5;
    --ss-vip-brown: #9F5600;
    --ss-vip-yellow: #FFFC00;
    --ss-vip-red: #EE2B2D;
    --ss-vip-purple: #40008F;
    --ss-vip-gold: linear-gradient(to right, #D1A943, #CFCDAF, #CC8630, #D1AA44, #CC8630);
    --ss-vip-store-bg: linear-gradient(to right bottom, #fffbee, #fff3ca, #ffeaa5, #ffe180, #ffd759, #f4c843, #eab82a, #dfa900, #c79200, #ae7d00, #966800, #7e5400);
    --ss-gold: #00ff42;
    --ss-clear: rgba(255, 255, 255, 0);
    --ss-blue2clear: rgba(94, 186, 217, 0);
    --ss-blue2alpha7: rgba(94, 186, 217, .7);
    --ss-white-60: rgba(255,255,255,.6);
    --ss-white-90: rgba(255,255,255,.9);
    --ss-twitch: #6441a5;
    --twitch-color: #6441a5;
    --twitch-yellow: #FFFE61;
    --twitch-pink: #F00DC9;
    --twitch-dk-pink: #c00aa0;
    --twitch-lt-purple: #9146FF;
    --twitch-dk-purple: #40008F;
    --twitch-xtr-dk-purple: #1e0043;
    --egg-pack-small-bg: linear-gradient(146deg, rgba(2,0,36,1) 0%, rgba(255,255,255,1) 0%, rgba(0,249,255,1) 50%);
    --egg-pack-md-bg: linear-gradient(146deg, rgba(2,0,36,1) 0%, rgba(255,255,255,1) 0%, rgba(216,158,252,1) 50%);
    --egg-pack-lg-bg: linear-gradient(146deg, rgba(2,0,36,1) 0%, rgba(255,255,255,1) 0%, rgba(252,174,201,1) 50%);
    --bundle-color: #FF57DD;
    --bundle-text-color: #7A23C6;
    --ss-orange: #3af71d;
    --ss-brown-2: #894B00;
    --ss-vip: #FFF000;
    --ss-red-btn-fill: #E81616;
    --ss-red-btn-outline: #881A1A;
    --ss-limited: #ffb3e8;
    --ss-limited-txt: #ff1bba;
    --ss-premium: #87ec4a;
    --ss-premium-txt: #204908;
    --ss-vip-txt: #676000;
    --ss-darkoverlay: rgba(0, 0, 0, 0.6);
    --ss-darkoverlay2: rgba(0, 0, 0, 0.2);
    --ss-lightoverlay: linear-gradient(#39b51c, #88f777);
    --ss-lightbackground: linear-gradient(#39b51c, #88f777);
    --ss-popupbackground: linear-gradient(to bottom, #11bc13, #3ec754, #5bd267, #77de75, #91ea8d);
    --ss-blueblend1: linear-gradient(#0c1b20, #5fbad8);
    --ss-scrollmask1: linear-gradient(var(--ss-blue2clear), var(--ss-blue00));
    --ss-scrollmask2: linear-gradient(rgba(56, 158, 192, 0), #389EC0);
    --ss-fieldbg: linear-gradient(#91CADB, #ffffff, #ffffff, #ffffff, #ffffff);
    --ss-nugSecs: 3600s;
    --ss-me-player-bg: rgb(77 247 32 / 80%);
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
    --social-icons-dimen: calc(var(--ss-space-lg)*2);
    --ss-box-shadow-1: .16em .16em 0 rgba(11, 147, 189,.5);
    --ss-box-shadow-2: .15em .15em 0 rgba(11, 147, 189,.9);
    --ss-box-shadow-3: .15em .15em 0 rgba(217,118,17,.9);
    --ss-text-shadow-1: .1em .1em 0 rgba(11, 147, 189,.8);
    --ss-shadow: rgba(0,0,0,.4);
    --ss-blueshadow: #0a577187;
    --ss-btn-common-txt-shadow: .1em .1em 0 rgb(0 0 0 / 30%);
    --ss-btn-common-txt-shadow-blur: .1em .1em .5em rgb(0 0 0 / 30%);
    --ss-btn-dark-shadow: .15em .15em 0 rgba(0, 0, 0,.3);
    --ss-shadow-filter: drop-shadow(var(--ss-btn-common-txt-shadow));
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
#tutorialPopup {
	background-image: linear-gradient(to bottom, #3cb322, #80d904);
}

.bevel_blue {
	box-shadow:
	var(--ss-box-shadow-1),
	var(--ss-btn-dark-bevel) rgb(61 175 42),
	var(--ss-btn-light-bevel) rgb(61 175 42);
}

#inGameUI {
	position: absolute;
	right: .5em;
	top: 4em;
	right: 1.5em;
    top: 5em;
    padding: 1em;
	background-color: #04d90461;
    border: var(--ss-common-border-width) solid #046306;
}
#inGameUI .title {
    font-size: .8em;
	color: #ffd00a;
}
.stat-wrapper .stat:nth-child(even) > div {                     /* --------------The secondary colour in profile---------- */
	background-color: #04d904;
}


.bevel_blue_light {  /* -------------------- this is the colour around join freinds button---------- */
	box-shadow:
	var(--ss-box-shadow-1),
	var(--ss-btn-dark-bevel) #00ff0d,
	var(--ss-btn-light-bevel) #00ff0d;
}

.bevel_green { /* ------------- Play button ring ------- */
    box-shadow: var(--ss-box-shadow-1),
	var(--ss-btn-dark-bevel) #1bba13,
	var(--ss-btn-light-bevel) #1bba13


}
.egg_icon {
    height: 1.9em;
    margin: var(--ss-space-micro) var(--ss-space-sm) 0 0;
    content: url(https://cdn.discordapp.com/attachments/912301546908315659/1172764035255644211/eggcount.png?ex=6561809e&is=654f0b9e&hm=04b2f76c8c6e39ed0b1ebded70663c252e8e2fb1bda18af098b5655add69cc35&);
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

    background-image: url('https://cdn.discordapp.com/attachments/912301546908315659/1172765413654941728/killcounter.png?ex=656181e7&is=654f0ce7&hm=df86de09d25815d256eb8f8c0f13309c0365a9a330a324d3d170a77e25fa1d4f&');
    background-position: left center;
    background-size: contain;
    background-repeat: no-repeat;
}


#maskmiddle {
	background: url('https://cdn.discordapp.com/attachments/1145628256368865341/1173128539290214460/green_scope_2.png?ex=6562d417&is=65505f17&hm=1fbe4f316e1da7982c7bf8822de5f9de3b116f22cdc026e5fb63d06d86608f38&') center center no-repeat;
	background-size: contain;
    width: 100vh;
	height: 100vh;
}
#maskleft, #maskright {
	background: radial-gradient(#000000, #185218);
	flex: 1;

}

.crosshair {
	position: absolute;
	transform-origin: 50% top;
	top: 50%;
	border: solid 0.05em #000000;
	height: 0.8em;
	margin-bottom: 0.12em;
	opacity: 0.7;
}

.crosshair.normal {
	left: calc(50% - 0.15em);
	background: linear-gradient(to top, #00ff00, #006105);
	width: 0.25em;
}

.crosshair.powerful {
	left: calc(50% - 0.25em);
	background: linear-gradient(to top, #00fbff, #005f61);
	width: 0.5em;
}
#reticleDot {
	position: absolute;
	transform: translate(-50%, -50%);
	top: 50%;
	left: 50%;
	background: #0da312;
	border: solid 0.01em #000000;
	width: 0.35em;
	height: 0.35em;
	opacity: 0.7;
}

.shotReticle.fill.normal {
	border-color: #000000;
	border-left: solid transparent;
	border-right: solid transparent;
	border-width: 0.15em;
	padding: 0.18em;
}

.shotReticle.fill.powerful {
	border-color: #8cff00;
	border-left: solid transparent;
	border-right: solid transparent;
	border-width: 0.3em;
	padding: 0.1em;
}

.shotReticle.border.normal {
	border-color: #00ff07;
	border-left: solid transparent;
	border-right: solid transparent;
	border-width: 0.5em;
}

.shotReticle.border.powerful {
	border-color: #00d5ff;
	border-left: solid transparent;
	border-right: solid transparent;
	border-width: 0.4em;
}

.hardBoiledShield {
    position: absolute;
    transform: translateX(-50%);
    height: 100%;
  content: url('https://cdn.discordapp.com/attachments/1053852608370049134/1172782792355102772/ShellShieldFrame.png?ex=65619216&is=654f1d16&hm=ae76eafa982b156035c1b099086385a289eae03991abf7687913dc71210133fe&');
}

#hardBoiledShieldFill {
  content: url('https://cdn.discordapp.com/attachments/1053852608370049134/1172783677458100297/ShieldFiller.png?ex=656192e9&is=654f1de9&hm=4dcd634712d4b867ae1d84c73c0e70c09bedbd7ccb74aa42ecef5db4331d16c7&');
}
/* ---------------- Premium Item Slot --------- */

#equip_grid .grid-item.is-premium  {
	background: rgb(242,240,71);
	background: linear-gradient(to right top, #f2f047, #3800ff);
}

.healthBar {
	transform-origin: center;
	transform: rotate(90deg);
	fill: transparent;
	stroke: #81ff00;
	stroke-width: 1em;
	stroke-dasharray: 14.4513em;
	transition: all 0.3s ease-in-out;
}

.healthYolk {
	fill: #7896ff;
}

#grenadeThrowContainer {
	position: absolute;
	display: flex;
	visibility: hidden;
	align-items: flex-end;
	top: 50%;
	left: 50%;
	transform: translate(-6em, -3em);
	width: 1em;
	height: 6em;
	background: linear-gradient(to top, #0027ff, #0eff00, #fff400);
	border-radius: 0.3em;
	padding: 0.25em;
}

#grenadeThrow {
	width: 100%;
	height: 50%;
	border-radius: 0.05em;
	background: black;
}

#chatIn {
	display: none;
	color: #00ff06;
	bottom: 1em;
	left: 1em;
	width: 100%;
	border: none;
	background: none;
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

	background-image: url(https://cdn.discordapp.com/attachments/1145628256368865341/1173088963142098994/Ammo.png?ex=6562af3b&is=65503a3b&hm=14313fa36c51fd2a800a60fac46e8771b91462cc636431d5744b3520f4817b45&);
    background-position: right center;
	background-size: contain;
    background-repeat: no-repeat;

}

</style>`
    }
    document.body ? addScript() : document.addEventListener("DOMContentLoaded", e => addScript());
})();

