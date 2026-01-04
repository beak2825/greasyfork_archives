// ==UserScript==
// @name         貓羽雫 蛋蛋槍戰材質包
// @namespace    http://tampermonkey.net/
// @namespace    http://violentmonkey.net/
// @version      0.47
// @description  uwu
// @author       好吃蘿蔔ouo 🥕🥕🥕  (https://www.youtube.com/@Carrot_ouo)
// @match        https://shellshock.io/
// @match        https://yolk.tech/
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
// @icon         https://steamuserimages-a.akamaihd.net/ugc/1725423276537911211/827AF720B865ACEB5164BBB620CABF5F31A1D3DD/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465495/%E8%B2%93%E7%BE%BD%E9%9B%AB%20%E8%9B%8B%E8%9B%8B%E6%A7%8D%E6%88%B0%E6%9D%90%E8%B3%AA%E5%8C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/465495/%E8%B2%93%E7%BE%BD%E9%9B%AB%20%E8%9B%8B%E8%9B%8B%E6%A7%8D%E6%88%B0%E6%9D%90%E8%B3%AA%E5%8C%85.meta.js
// ==/UserScript==

    (function () {
    const addScript = () => {
        document.head.innerHTML += `<style>
* {
	--ss-transparent: #00000000;
	--ss-black: #000;s
	--ss-white: #000000; /*White Text*/
	--ss-offwhite: #000000;
	--ss-yellow0:#00002B;
	--ss-yellow: #00FFCD;
	--ss-yolk0: #171717;
	--ss-yolk: #159E66; /*Green Color Buttons*/
    --ss-yolk1: #ff0000;
	--ss-yolk2: #;
	--ss-red0: #00002B;
	--ss-red: #00002B;
	--ss-red2: #00002B;
	--ss-red-bright: #00002B;
	--ss-pink: #00002B;
	--ss-pink1: #00002B;
	--ss-pink-light: #00002B;
	--ss-brown: #00002B;
	--ss-blue00: #00FFCD;
	--ss-blue0: #00002B;
	--ss-blue1: #292929; /*Grey Boxes: 1*/
	--ss-blue2: #000000;
    --ss-blue3: #008EFF; /*Blue Text and Box Fills*/
	--ss-blue4: #C91350; /*Blood-Red Subtitles, Darker Box Borders*/
	--ss-blue5: #FFFFFF; /*White Text - Announcements Tab*/
    --ss-blue6: #2D2D2D; /*Grey Boxes: 2*/
    --ss-blue7: #00BDCD; /*Blue: Play With Friends Button Fill*/
    --ss-blue8: #C91350; /*Blood-Red Text*/
	--ss-green0: #03E90D; /*Green Buttons 1*/
	--ss-green1: #00D709; /*Green Buttons 2*/
	--ss-green2: #00D709; /*Green Buttons 3*/
	--ss-orange1: #09FFF4;
	--ss-vip-gold: linear-gradient(to right, #0004ff, #0003c9, #0002a1, #000170, #000147);
	--ss-clear: rgba(255, 255, 255, 0);
	--ss-blue2clear: rgba(18, 0, 75, 0);
	--ss-shadow: rgba(0,0,0,0.4);
	--ss-blueshadow: #FFFFFF; /*Outside Of The Eye of Nezuko*/
	--ss-darkoverlay: rgba(0, 0, 0, 0.8);
	--ss-darkoverlay2: rgba(0, 0, 0, 0.2);
	--ss-lightoverlay: url("https://img.syt5.com/2021/0715/20210715091149858.jpg"); /*Main Background*/
	--ss-lightbackground:
	--ss-blueblend1: linear-gradient(#FF0000, #FF0000); /*Some Box fill colors*/
	--ss-scrollmask1: linear-gradient(var(--ss-blue2clear), var(--ss-blue2));
	--ss-scrollmask2: linear-gradient(rgba(0, 73, 249, 0), #389EC0);
	--ss-fieldbg: linear-gradient(#122962, #000000, #000000, #000000, #000000);
	--ss-white-60: rgba(255,255,255,.6);
	--ss-white-90: rgba(255,255,255,.9);

	--ss-me-player-bg: url(''); /*FFA My Player Banner*/
	--ss-them-blue-bg: rgba(0,66,87,.8);
	--ss-them-blue-color: #003b75;
	--ss-them-red-bg:  rgb(133,0,0,.8);
	--ss-them-red-color: #ff4145
	--ss-me-red-bg: rgba(255,65,69,.8);
	--ss-me-blue-bg: rgb(0,16,119,.8);
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

	background-image: url('');
    background-position: right center;
	background-size: contain;
    background-repeat: no-repeat;
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
	background: cyan;
	width: 0.3em;
}

.crosshair.normal {
	left: calc(50% - 0.15em);
	background: #00b3ff;
	width: 0.3em;
}

#hardBoiledValue {
	font-family: 'Nunito', sans-serif;
    font-weight: bold;
    color: var(--ss-white);
    font-size: 1.6em;
    transform: translateY(-2.6em);
}
.hardBoiledShield {
    position: absolute;
    transform: translateX(-50%);
    height: 100%;
  content: url('https://i03piccdn.sogoucdn.com/2c4610d40f668796'); /*Main Background*/

.hardBoiledShield {
    position: absolute;
    transform: translateX(-50%);
    height: 100%;
  content: url('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/96269ce8-4a07-4702-936a-6860e1b5594f/degolb5-bdd1f66a-6c4d-4b82-bfba-05011329668b.png/v1/fill/w_947,h_843,strp/blue_energy_ball_12__alt_2__by_venjix5_degolb5-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9ODQzIiwicGF0aCI6IlwvZlwvOTYyNjljZTgtNGEwNy00NzAyLTkzNmEtNjg2MGUxYjU1OTRmXC9kZWdvbGI1LWJkZDFmNjZhLTZjNGQtNGI4Mi1iZmJhLTA1MDExMzI5NjY4Yi5wbmciLCJ3aWR0aCI6Ijw9OTQ3In1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.HKXMT4nGm5bdoAveDl1Mz6heAztfKRTDEx8-f2JNP2E');
}


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
	background: black; /*Outline Of Grenade Range*/
	border-radius: 0.3em;
	padding: 0.25em;
}

}

#maskmiddle {
	background: url('https://png.pngtree.com/png-clipart/20201224/ourmid/pngtree-sniper-rifle-sight-icon-png-image_2623068.jpg') center center no-repeat;
	background-size: contain;
    width: 100vh;
	height: 100vh;
}

.playerSlot--icons .vip-egg {
	text-shadow: 1px 1px 2px rgb(0 0 0 / 50%);
  content: url('https://steamuserimages-a.akamaihd.net/ugc/1916872490636194078/B6B1067A51220A3428C9C75CAA8854BB643F6537/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false') !important;
  max-height: 1.3em;
  max-width: 1.3em;
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

    background-image: url('https://steamuserimages-a.akamaihd.net/ugc/1916872490636194078/B6B1067A51220A3428C9C75CAA8854BB643F6537/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false=');
    background-position: left center;
    background-size: contain;
    background-repeat: no-repeat;
}

.egg_icon {
    height: 2em;
   margin: var(--ss-space-micro) var(--ss-space-sm) 0 0;
   content: url('https://images8.alphacoders.com/118/1182918.png')
}

#killBox::before{
  font-size: 1.4em;
  font-weight: 900;
  content: 'uwu'!important;
  color: darkblue;
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
  content: 'QAQ'!important;
  color: lightpink;
}

.chat {
	position: absolute;
	font-weight: bold;
	color: #00000;
	z-index: 6;
}

#chatOut {
	display: none;
	bottom: 2.5em;
	left: 1em;

}

#chatIn {
	display: none;
	color: #00000;
	bottom: 1em;
	left: 1em;
	width: 30%;
	border: none;
	background: none;
}

#healthHp {
	font-family: 'Nunito', bold italic;
    font-weight: bold;
    color:
    font-size: .98em;
    transform: translateY(-3.45em);
}

.healthBar {
	transform-origin: center;
	transform: rotate(90deg);
	fill: #00ffea;
	stroke: #2756ba;
	stroke-width: 1em;
	stroke-dasharray: 14.4513em;
	transition: all 0.3s ease-in-out;
}

.healthYolk {
	fill: #00ffea; /*Black Iris of Health Eye*/
}

.healthSvg {
	width: 100%; height: 100%;
}

</style>`
    }
    document.body ? addScript() : document.addEventListener("DOMContentLoaded", e => addScript());
})();