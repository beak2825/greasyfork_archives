// ==UserScript==
// @name         Boolet Theme
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Boolet' theme
// @author       Made By Not Revan designed by Bruhseidon
// @license MIT
// @match        https://shellshock.io/
// @match        https://www.crazygames.com/game/shellshockersio
// @icon         https://media.discordapp.net/attachments/1110510036943384668/1160922228695777300/image.png?ex=65366c14&is=6523f714&hm=1bd1b1f4765716b718e76479ff40c4007db9862bfacae74b6938e80a4f2038ff&=
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477239/Boolet%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/477239/Boolet%20Theme.meta.js
// ==/UserScript==


(function () {
    const addScript = () => {
        document.title="Boolet"
        document.head.innerHTML += `<style>



:root {
	--select-border: #777;
	--select-focus: blue;
	--select-arrow: var(--select-border);

	--ss-transparent: #ffffff00;
	--ss-black: #000;
	--ss-adblocker-text: #000000;
	--ss-white: #4487f3;
	--ss-offwhite: #FFF3E4;
	--ss-yellow0:#F7FFC1;
	--ss-yellow: #FAF179;
	--ss-yolk0: #f1c59a;
	--ss-yolk: #000000;
	--ss-yolk2: #000000;
	--ss-red0: #e29092;
	--ss-red: #d15354;
	--ss-red2: #801919;
	--ss-egg-org: #EE2524;
	--ss-red-bright: #EF3C39;
	--ss-pink: #EC008C;
	--ss-pink1: #b9006e;
	--ss-pink-light: #ff3aaf;
	--ss-pink-dark: #a7098c;
	--ss-brown: #924e0c;
	--ss-blue00: #30a7cf;
	--ss-blue0: #3eb6da;
	--ss-blue1: #000000;
	--ss-blue2: #0d1ce7;
	--ss-blue3: #001dff;
	--ss-blue4: #0E7697;
	--ss-blue5: #0C576F;
	--ss-blue6: #1c93ba;
	--ss-blue7: #00c0ff;
	--ss-blue8: #1192BC;
	--ss-green0: #87ddbb;
	--ss-green1: #13BA65;
	--ss-green2: #046306;
	--ss-green-login: #13ba65;
	--ss-orange1: #F79520;
	--ss-vip-blue: #0E7FFF;
	--ss-vip-pink: #FF5AF5;
	--ss-vip-brown: #9F5600;
	--ss-vip-yellow: #FFFC00;
	--ss-vip-red: #EE2B2D;
	--ss-vip-purple: #40008F;
	--ss-vip-gold: linear-gradient(to right, #D1A943, #CFCDAF, #CC8630, #D1AA44, #CC8630);
	--ss-vip-store-bg: linear-gradient(to right bottom, #fffbee, #fff3ca, #ffeaa5, #ffe180, #ffd759, #f4c843, #eab82a, #dfa900, #c79200, #ae7d00, #966800, #7e5400);
	--ss-gold: #FED838;
	--ss-gray1: #999;
	--ss-gray2: #555;
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


	/* Redsign colors */
	--ss-orange: #000000;
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
	--ss-lightoverlay: url("https://images-ext-1.discordapp.net/external/ex-WDMMXa89PoAKfe1eSDP1b-skqqbh_DOaZqNAIk5o/https/wallpapercave.com/wp/oju5y5S.jpg?width=1075&height=605");
	--ss-lightbackground: linear-gradient(var(--ss-blue1), var(--ss-blue2) );
	--ss-blueblend1: linear-gradient(#349ec1, #5fbad8);
	--ss-scrollmask1: linear-gradient(var(--ss-blue2clear), var(--ss-blue00));
	--ss-scrollmask2: linear-gradient(rgba(56, 158, 192, 0), #389EC0);
	--ss-fieldbg: linear-gradient(#91CADB, #ffffff, #ffffff, #ffffff, #ffffff);
	--ss-nugSecs: 3600s;
	--ss-me-player-bg: rgba(247,149,32,.8);

	--ss-team-blue-light: rgb(0, 204, 255);
	--ss-team-blue-light-trans: rgb(0, 0, 0, 0.8);
	--ss-team-blue-dark: rgb(0, 145, 255);
	--ss-team-blue-dark-trans: rgb(0, 0, 0, 0.8);

	--ss-team-red-light: rgb(0, 0, 0);
	--ss-team-red-light-trans: rgb(255, 255, 255, 0.8);
	--ss-team-red-dark: rgb(0, 0, 0);
	--ss-team-red-dark-trans: rgb(255, 255, 255, 0.8);

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

	--social-icons-dimen: calc(var(--ss-space-lg)*2);

	/* shadows */
	--ss-box-shadow-1:  .16em .16em 0 rgba(11, 147, 189,.5);
	--ss-box-shadow-2: .15em .15em 0 rgba(11, 147, 189,.9);
	--ss-box-shadow-3: .15em .15em 0 rgba(217,118,17,.9);
	--ss-text-shadow-1: .1em .1em 0 rgba(11, 147, 189,.8);

	--ss-shadow: rgba(0,0,0,.4);
	--ss-blueshadow: #0a577187;
	--ss-btn-common-txt-shadow: .1em .1em 0 rgb(0 0 0 / 30%);
	--ss-btn-common-txt-shadow-blur: .1em .1em .5em rgb(0 0 0 / 30%);
	--ss-btn-dark-shadow: .15em .15em 0 rgba(0, 0, 0,.3);

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
.egg_icon {
height: 1.5em;
    margin: var(--ss-space-micro) var(--ss-space-sm) 0 0;
}
#killBox::before{
  font-size: 1.4em;
  font-weight: 900;
  content: 'YOU CLAPPED'!important;
  color: #0b5ad9;
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
  content: 'YOU GOT CLAPPED BY'!important;
  color: #0b5ad9;
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
	background: black;
	flex: 1;
}
.load_screen {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: absolute;
    top: 0; left: 0;
    z-index: 20;
    width: 100%; height: 100%;
    background-image: url('https://wallpapercave.com/wp/oju5y5S.jpg');
    background-repeat: no-repeat;
    background-size: cover;
}
#best_streak_container h1 {
    margin: 0; padding: 0;
    display:inline
    text-shadow: var(--ss-space-micro) var(--ss-space-micro) var(--ss-shadow);



    font-family: 'Nunito', sans-serif !important;
    font-size: 2.5em !important;
    color: var(--ss-white) !important;
    font-weight: bold !important;
    text-transform: lowercase;

    padding-left: 1.5em;
    padding-top: 0em;

    background-image: url('https://media.discordapp.net/attachments/1110510036943384668/1160889360837779476/rickroll_4k.png?ex=65364d77&is=6523d877&hm=a7c3497c0481e7fbf173fe5cd8a6d5f1c8f8b956c4fc65f6671dc54f34d6cfaf&=&width=907&height=605');
    background-position: left center;
    background-size: contain;
    background-repeat: no-repeat;

.weapon_img {
	box-sizing: border-box;
	background: none;
	height: 4em;
	border: none;
	margin: 0 -0.1em;
}
.weapon_img:hover {
    cursor: pointer;
    border: none;
    background: none;
}
#weapon_select .weapon_selected {
    background: url("https://cdn.discordapp.com/attachments/754060573657792612/846389541677957159/unknown.png");
    border: none;
}

#readouts {
  color: #478ef8
}
#item_grid {
	position: relative;
	padding: 0 0.5em var(--ss-space-md) 0;
  background: none;
}
#equip_equippedslots .equip_item {
	background: var(--ss-blue2);
	width: 6em;
	height: 6em;
	margin: var(--ss-space-sm);
	border: none;
  background: none;
}
  #equip_sidebox {
    background-image: none;
    border: none;
    min-width: 21em;
    background-repeat: no repeat;
  }
.media-tabs-content.front_panel {
    background: url("https://cdn.discordapp.com/attachments/754060573657792612/846389541677957159/unknown.png") !important;
    margin: 0 auto;
    height: 17.5em;
     background-repeat: no repeat;
    background-size: contain, cover;
}
.popup_window {
	z-index: 2000;
	position: absolute;
    display: flex;
    flex-direction: column;
    background: url(https://cdn.discordapp.com/attachments/754060573657792612/846389541677957159/unknown.png);
    align-items: center;
    padding: var(--ss-space-lg);
    color: var(--ss-white);
}

.popup_lg {
	background: url(https://cdn.discordapp.com/attachments/754060573657792612/846389541677957159/unknown.png);
	border: var(--ss-space-sm) solid var(--ss-blue3);
	padding: var(--ss-space-xxl);
}
#equip_grid .store_item {
	background: url("https://cdn.discordapp.com/attachments/754060573657792612/846389541677957159/unknown.png");
	position: relative;
	border: var(--ss-space-sm) solid var(--ss-blue4);
	font-weight: bold;
	margin: 0 0 var(--ss-space-sm) var(--ss-space-sm);
	color: var(--ss-blue4);
	width: 5.5em;
	height: 5.5em;
	text-align: center;
	vertical-align: center;
	padding: 0.5em;

}
.front_panel {
	border: var(--ss-space-sm) solid #478ef8;
	margin-top: 0.6em;
	background-image: url("https://cdn.discordapp.com/attachments/754060573657792612/846389541677957159/unknown.png");
	padding: var(--ss-space-lg);
	min-width: 21.2em;
	max-width: 21.2em;
    background-repeat: no repeat;
}
}

.account_eggs {
	display: flex;
  border: 0.2em solid #478ef8;
	vertical-align: center;
	height: 2.3em;
	min-width: 6.4em;
	background: url("https://cdn.discordapp.com/attachments/754060573657792612/846389541677957159/unknown.png");
	text-align: right;
	padding: 0.05em var(--ss-space-lg) 0 var(--ss-space-md);
	position: relative;
}
flex: 1;
}

#maskmiddle {
    background: url('https://media.discordapp.net/attachments/1000151470634700900/1010127774356348968/boolet_scope.png?width=556&height=556') center center no-repeat;
    background-size: contain;
    width: 100vh;
    height: 100vh;
}

.crosshair {
	position: absolute;
	transform-origin: 50% top;
	top: 50%;
	border: solid 0.05em #478ef8;
	height: 0.8em;
	margin-bottom: 0.12em;
	opacity: 0.7;
}

.crosshair.normal {
	left: calc(50% - 0.15em);
	background: #478ef8;
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
	border-color: #478ef8;
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
	border-color: #478ef8;
	border-left: solid transparent;
	border-right: solid transparent;
	border-width: 0.2em;
}

.shotReticle.border.powerful {
	border-color: #478ef8;
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
background: url(https://cdn.discordapp.com/attachments/754060573657792612/846389541677957159/unknown.png);
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
fill: #12e39a;
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
  content: url('https://media.discordapp.net/attachments/834508857719390220/880132345909346334/corgoshield.png');
}

</style>`
    }
    document.body ? addScript() : document.addEventListener("DOMContentLoaded", e => addScript());
})();
