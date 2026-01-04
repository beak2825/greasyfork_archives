// ==UserScript==
// @name         Christmas ShellShockers!
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  It's ShellShockers but Christmas Themed!
// @icon         https://cdn.discordapp.com/attachments/1145628256368865341/1173865657448808530/stsmall507x507-pad600x600f8f8f8.png?ex=65658296&is=65530d96&hm=95c70daf0c6278bcc66c44b4b1b11f18374f39d03bccbebc3aa443c7a5b2d9fa&
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
// @downloadURL https://update.greasyfork.org/scripts/481198/Christmas%20ShellShockers%21.user.js
// @updateURL https://update.greasyfork.org/scripts/481198/Christmas%20ShellShockers%21.meta.js
// ==/UserScript==

(function () {
    const addScript = () => {
        document.title="Christmas Shell Shockers"
        document.head.innerHTML += `<style>

:root {
    --select-border: #777;
    --select-focus: blue;
    --select-arrow: var(--select-border);
    --ss-transparent: #00000000;
    --ss-black: #000;
    --ss-adblocker-text: #003449;
    --ss-white: #ff9a9a;
    --ss-offwhite: #000000;
    --ss-yellow0: #F7FFC1;
    --ss-yellow: #FAF179;
    --ss-yolk0: #ff0000;
    --ss-yolk: #ff0000;
    --ss-yolk2: #ff0000;
    --ss-red0: #e29092;
    --ss-red: #d15354;
    --ss-red2: #000000;
    --ss-egg-org: #EE2524;
    --ss-red-bright: #EF3C39;
    --ss-pink: #EC008C;
    --ss-pink1: #b9006e;
    --ss-pink-light: #ff3aaf;
    --ss-pink-dark: #a7098c;
    --ss-brown: #a50000;
    --ss-blue00: #000000;
    --ss-blue0: #00ff46;
    --ss-blue1: #8e1b1b;
    --ss-blue2: #00ff1a;
    --ss-blue3: #099400;
    --ss-blue4: #00ff0b;
    --ss-blue5: #42ff00;
    --ss-blue6: #b21515;
    --ss-blue7: #ff0000;
    --ss-blue8: #19ff00;
    --ss-green0: #ff0000;
    --ss-green1: #ff0000;
    --ss-green2: #42ff00;
    --ss-green-login: #00ff31;
    --ss-orange1: #009e25;
    --ss-vip-blue: #0E7FFF;
    --ss-vip-pink: #FF5AF5;
    --ss-vip-brown: #9F5600;
    --ss-vip-yellow: #FFFC00;
    --ss-vip-red: #EE2B2D;
    --ss-vip-purple: #40008F;
    --ss-vip-gold: linear-gradient(to right, #D1A943, #CFCDAF, #CC8630, #D1AA44, #CC8630);
    --ss-vip-store-bg: linear-gradient(to right bottom, #fffbee, #fff3ca, #ffeaa5, #ffe180, #ffd759, #f4c843, #eab82a, #dfa900, #c79200, #ae7d00, #966800, #7e5400);
    --ss-gold: #1eff00;
    --ss-clear: rgba(255, 255, 255, 0);
    --ss-blue2clear: rgba(94, 186, 217, 0);
    --ss-blue2alpha7: rgba(94, 186, 217, .7);
    --ss-white-60: rgba(255,255,255,.6);
    --ss-white-90: rgb(255 0 0 / 90%);
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
    --ss-orange: #22ff00;
    --ss-brown-2: #894B00;
    --ss-vip: #111;
    --ss-lightoverlay: url(https://wallpaperaccess.com/full/1466431.jpg);
    --ss-blueblend1: linear-gradient(#0c1b20, #5fbad8);
    --ss-lightbackground: linear-gradient(var(--ss-blue1), var(--ss-blue2) );
    --ss-popupbackground: url(https://freerangestock.com/sample/140321/red-christmas-background.jpg);
    --ss-fieldbg: linear-gradient(#91CADB, #ffffff, #ffffff, #ffffff, #ffffff);
    --ss-nugSecs: 3600s;
    --ss-me-player-bg: #00ff31;
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
	background-image: linear-gradient(to bottom, #a30000, #05a300);

}   /* THIS IS THE BACKGROUND OF JOIN/LEAVE GAME, SETTINGS */

.popup_window {
	z-index: 2000;
	position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--ss-space-lg);
    color: var(--ss-white);
	background-image: linear-gradient(to top right, #05a300, #a30023);
	border: var(--ss-common-border-width) solid var(--ss-blue5);
}

.bevel_blue {
	box-shadow:
	var(--ss-box-shadow-1),
	var(--ss-btn-dark-bevel) #099400,
	var(--ss-btn-light-bevel) #099400;
}

#inGameUI {
	position: absolute;
	right: .5em;
	top: 4em;
	right: 1.5em;
    top: 5em;
    padding: 1em;
	background-color: #a3002361;
    border: var(--ss-common-border-width) solid #1f7d00;
}
#inGameUI .title {
    font-size: .8em;
	color: #13a300;
}
.stat-wrapper .stat:nth-child(even) > div {                     /* --------------The secondary colour in profile---------- */
	background-color: #a3002c;

}
.bevel_blue_light {  /* -------------------- this is the colour around join freinds button---------- */
	box-shadow:
	var(--ss-box-shadow-1),
	var(--ss-btn-dark-bevel)#ff0000,
	var(--ss-btn-light-bevel) #ff0000;
}

.bevel_green { /* ------------- Play button ring ------- */
    box-shadow: var(--ss-box-shadow-1),
	var(--ss-btn-dark-bevel) #ff0000,
	var(--ss-btn-light-bevel) #ff0000

}

.account_eggs {
	display: flex;
  border: 0.2em solid #;
	vertical-align: center;
	height: 2em;
	min-width: 6.4em;
	background: #940000; /* ----- Edit this for the background ----- */
	text-align: right;
	padding: 0.05em var(--ss-space-lg) 0 var(--ss-space-md);
	position: relative;

}
.egg_icon {
    height: 1.9em;
    margin: var(--ss-space-micro) var(--ss-space-sm) 0 0;
    content: url(https://openseauserdata.com/files/b11bb7406d81c9a3d8c6e69192d75641.png);
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

    background-image: url('https://creazilla-store.fra1.digitaloceanspaces.com/cliparts/64206/santa-claus-face-clipart-xl.png');
    background-position: left center;
    background-size: contain;
    background-repeat: no-repeat;
}


#maskmiddle {
	background: url('https://cdn.discordapp.com/attachments/1145628256368865341/1173888622039154749/christmas_scope.png?ex=656597f9&is=655322f9&hm=d999ea12ccd1352f7149033b828c2f7591c6605ae54b2f97c23a80fdee5bb9bf&') center center no-repeat;
	background-size: contain;
    width: 100vh;
	height: 100vh;
}
#maskleft, #maskright {
	background: radial-gradient(#081f00, #38000f);
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
	background: linear-gradient(to top, #ff0000, #09ff00);
	width: 0.25em;
}

.crosshair.powerful {
	left: calc(50% - 0.25em);
	background: linear-gradient(to top, #09ff00, #f2ff00);
	width: 0.5em;
}
#reticleDot {
	position: absolute;
	transform: translate(-50%, -50%);
	top: 50%;
	left: 50%;
	background: #37ff00;
	border: solid 0.01em #000000;
	width: 0.35em;
	height: 0.35em;
	opacity: 0.7;
}

.shotReticle.fill.normal {
	border-color: #ffffff;
	border-left: solid transparent;
	border-right: solid transparent;
	border-width: 0.15em;
	padding: 0.18em;
}

.shotReticle.fill.powerful {
	border-color: #37ff00;
	border-left: solid transparent;
	border-right: solid transparent;
	border-width: 0.3em;
	padding: 0.1em;
}

.shotReticle.border.normal {
	border-color: #99ff00;
	border-left: solid transparent;
	border-right: solid transparent;
	border-width: 0.5em;
}

.shotReticle.border.powerful {
	border-color: #37ff00;
	border-left: solid transparent;
	border-right: solid transparent;
	border-width: 0.5em;
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
	background: conic-gradient(#2bff00, #ff0000, #2bff00);
}

.healthBar {
	transform-origin: center;
	transform: rotate(90deg);
	fill: transparent;
	stroke: #1aff00;
	stroke-width: 1em;
	stroke-dasharray: 14.4513em;
	transition: all 0.3s ease-in-out;
}

.healthYolk {
	fill: #ff0000;
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
	background: linear-gradient(to top, #ff0000, #1d9c00, #ff0000, #1d9c00);
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
	color: #2fff00;
	bottom: 1em;
	left: 1em;
	width: 100%;
	border: none;
	background: none;

}

.is-paused .pause-ui-element {
	background-color: rgb(255, 0, 0 / 26%);
    border: var(--ss-common-border-width) solid var(--ss-blue5);
    bottom: 0;
    width: var(--ss-chat-wrapper-width);
    height: var(--ss--chat-height);
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

	background-image: url(https://cdn.discordapp.com/attachments/1145628256368865341/1173886062335107112/christmas_ammo.png?ex=65659597&is=65532097&hm=6255b9086aad4ee4f3b3c4898d7d84b81f264d53a634cc500165b6b155f8d46e&);
    background-position: right center;
	background-size: contain;
    background-repeat: no-repeat;

}

.btn-dark-bevel.bevel_green, #vipEnded .bevel_green { /* INGAME PLAY BUTTON */
	box-shadow: var(--ss-btn-dark-shadow), var(--ss-btn-dark-bevel) rgb(255, 0, 0), var(--ss-btn-light-bevel) var(--ss-green0);


}

</style>`
    }
    document.body ? addScript() : document.addEventListener("DOMContentLoaded", e => addScript());
})();

