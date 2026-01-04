// ==UserScript==
// @name         A$G Theme (Shellshock.io)
// @namespace    http://tampermonkey.net/
// @version      0.42
// @description  Become a A$G!
// @author       Blizzard
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
// @icon         data:file:///Users/nicolasmg/Blizzard.jpg
// @grant        none
// @lisense MIT
// @downloadURL https://update.greasyfork.org/scripts/444496/A%24G%20Theme%20%28Shellshockio%29.user.js
// @updateURL https://update.greasyfork.org/scripts/444496/A%24G%20Theme%20%28Shellshockio%29.meta.js
// ==/UserScript==

    (function () {
    const addScript = () => {
        document.head.innerHTML += `<style>
/* ----------------------------------------------------------------- Logo -- */
* {
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    --ss-header-height: 10em;
    --ss-footer-height: 4em;
    --ss-main-width: 90em;
    --ss-min-width: 68em;
    --ss-space-xxl: 2.3em;
    --ss-space-xl: 1.5em;
    --ss-space-lg: 1em;
    --ss-space-md: calc(var(--ss-space-lg)/2);
    --ss-space-sm: calc(var(--ss-space-md)/1.5);
    --ss-space-xs: calc(var(--ss-space-sm)/2);
    --ss-space-micro: calc(var(--ss-space-xs)/2);
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
    --ss-red: #ff0002;
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
    --ss-vip-gold: linear-gradient(to right, #D1A943, #CFCDAF, #CC8630, #D1AA44, #CC8630);
    --ss-gold: #D1AA44;
    --ss-clear: rgba(255, 255, 255, 0);
    --ss-blue2clear: rgba(94, 186, 217, 0);
    --ss-shadow: rgba(0,0,0,0.4);
    --ss-blueshadow: #0a577187;
    --ss-darkoverlay: rgba(0, 0, 0, 0.8);
    --ss-darkoverlay2: rgba(0, 0, 0, 0.2);

}


#logo {
  background-image: url('https://media.discordapp.net/attachments/961984354941284402/971669587915595796/AGlogo.png');
  background-position: center;
  background-repeat: no-repeat;
	width: 100%;
  background-size: 9%;
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
/* ----------------------------------------------------------------- scope -- */
#maskmiddle {
    background: url('https://media.discordapp.net/attachments/970944020245282816/971299935830024222/AG.png') center center no-repeat;
    background-size: contain;
    width: 100vh;
    height: 100vh;
}
/*---------------------------------------------------------crosshair*/
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

#readyBrackets.ready {
	animation: armed 0.2s linear;
	width: 4em; height: 4em;
	border-color: rgb(0, 255, 0);
}

#readyBrackets.ready {
	animation: armed 0.2s linear;
	width: 4em; height: 4em;
	border-color: rgb(0, 255, 0);
}

#readyBrackets.notReady {
	animation: unarmed 0.2s linear;
	width: 8em; height: 8em;
	border-color: rgb(255, 0, 0);
}
#ss_background {
   background: url(data:image/webp;base64,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);
   background-repeat: no-repeat;
 background-size: cover;
}
#load_screen {
 background: url(data:image/webp;base64,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);
}
header.weapon-select weapon-select--title pause-bg roundme_sm {
  background-attachment: red;
  color:red
}

#readouts {
  color: black
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
	border: var(--ss-space-sm) solid var(--ss-blue4);
  background: url("")
}
  #equip_sidebox {
    background-image: url(https://c4.wallpaperflare.com/wallpaper/244/150/511/simple-background-texture-wallpaper-preview.jpg);
    border: var(--ss-space-sm) solid var(--ss-blue3);
    min-width: 21em;
  }
.media-tabs-content.front_panel {
    background: url(https://c4.wallpaperflare.com/wallpaper/244/150/511/simple-background-texture-wallpaper-preview.jpg) !important;
    margin: 0 auto;
    height: 17.5em;
}
.popup_window {
	z-index: 2000;
	position: absolute;
    display: flex;
    flex-direction: column;
    background: url(https://media.istockphoto.com/photos/detail-of-a-textured-blue-exterior-wall-picture-id656767274);
    align-items: center;
    padding: var(--ss-space-lg);
    color: var(--ss-white);
}

.popup_lg {
	background: url(https://media.istockphoto.com/photos/detail-of-a-textured-blue-exterior-wall-picture-id656767274);
	border: var(--ss-space-sm) solid var(--ss-blue3);
	padding: var(--ss-space-xxl);
}
#equip_grid .store_item {
	background: url("https://media.istockphoto.com/photos/detail-of-a-textured-blue-exterior-wall-picture-id656767274");
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
	border: var(--ss-space-sm) solid black;
	margin-top: 0.6em;
	background-image: url(https://c4.wallpaperflare.com/wallpaper/244/150/511/simple-background-texture-wallpaper-preview.jpg);
	padding: var(--ss-space-lg);
	min-width: 21.2em;
	max-width: 21.2em;

}
.media-tabs-content.front_panel {
    background: url(https://c4.wallpaperflare.com/wallpaper/244/150/511/simple-background-texture-wallpaper-preview.jpg);
    margin: 0 auto;
    height: 17.5em;

}
.account_eggs {
	display: flex;
  border: 0.2em solid black;
	vertical-align: center;
	height: 2.3em;
	min-width: 6.4em;
	background: url("https://media.istockphoto.com/photos/detail-of-a-textured-blue-exterior-wall-picture-id656767274");
	text-align: right;
	padding: 0.05em var(--ss-space-lg) 0 var(--ss-space-md);
	position: relative;
}
.egg_count {
    width: auto;
    font-size: 1.2em;
    font-weight: bold;
    color: var(--ss-white);
}
.egg_icon {
    height: 1.5em;
    margin: var(--ss-space-micro) var(--ss-space-sm) 0 0;
}

.box_blue2 {
    padding: var(--ss-space-lg);
    background:url(https://media.istockphoto.com/photos/detail-of-a-textured-blue-exterior-wall-picture-id656767274);
    border: 0.3em solid black;
}
.popup_lg {
    background: var(--ss-space-sm);
    border: var(--ss-space-sm);
}
.respawn-container {
    position: relative;
  background: none;
  background-color: none;
  display: none;
    z-index: 0;
}

#pausePopupInnards {
    width: 100%;
}
#pauseAdPlacement,
.pauseAdPlacement {
    position: relative;
    z-index: 10;

    margin-right: auto;
    margin-left: auto;

    display: none;
}
.pauseAdPlacement.shellshockers-respawn-banner-2 {
    min-width: auto;
  display: none;
}
#pauseAdPlacement iframe,
.pauseAdPlacement iframe{
    margin: 0 auto;
  display: none;

}

.display-ad-container > div,
.display-ad-container > img {
    margin: 0 auto;
  display: none;

}
.house-ad-small {
    display: none;
}
.house-ad-wrap {
    display: none;
}
.adBlockerVideo {
  display: none;
}
    /*----------------HUD-------------*/


.playerSlot-player-is-me {
	background: url(https://media.istockphoto.com/photos/detail-of-a-textured-blue-exterior-wall-picture-id656767274);
	color: var(--ss-white-90);

}
.playerSlot-player-is-them {
    background: none;
}
/*-------stats------*/
#stat_item h4 {
    font-size: 0.8em;
    font-weight: bold;
    margin: 0.4em var(--ss-space-md);
    padding: 0;
    color: white;
    font-family: 'Nunito', sans-serif;
}
.stat_stat {
    color: white;
    margin-right: var(--ss-space-md);
    font-size: 1.2em;
}
/*--------youtube-twitch-news-hud-----------*/
.news_item, .stream_item, .ytube-item  {
    background: none;
    color: var(--ss-white);
    text-align: left;
    min-height: 4.7em;
    margin: 0 0 var(--ss-space-sm) 0;
    padding: var(--ss-space-sm);
    display: flex;
}
.news_item:nth-child(odd), .stream_item:nth-child(odd) {
    background: none;
}

/*----glow shit----------*/
#stream_mask,.news_mask,.yt_mask {
    position: absolute;
    bottom: 0;
    left: 0.25em;
    height: 2em;
    background: none;
    width: 100%;
    pointer-events: none;
}
#item_mask {
    position: absolute;
    bottom: 0.5em;
    left: 1em;
    height: 2em;
    background: none;
    width: 17.6em;
    pointer-events: none;
    z-index: 1;
}
/*---------------inv store----*/
.bevel_blue,.bevel_blue:hover {
	box-shadow:none;
  	background: none;
}
.btn_toggleon, {
    border-color:none !important;
    color: none !important;
    background: none !important;
    box-shadow: none !important;
}

/*----------health----*/
#healthContainer {
	position: absolute;
	left: 50%; bottom: 1em;
	transform: translateX(-50%);
	display: inline-block;
	width: 6em; height: 6em;
	background: url(https://png.pngtree.com/png-vector/20190413/ourlarge/pngtree-blue-wavy-shape-vector-on-transparent-png-image_936328.jpg);
	border-radius: 50%;
	text-align: center;
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
	stroke: #0000FF;
	stroke-width: 1em;
	stroke-dasharray: 14.4513em;
	transition: all 0.3s ease-in-out;
}
.healthYolk {
	fill: #0000FF;
}
/*--------------------------------menu-------------------*/
.pause-bg {
    background: none;
    padding: var(--ss-space-md);
    text-align: center;
    flex: 1 0 auto;
}
.ss_button {
    border-radius: var(--ss-space-sm);
    border: 0.2em solid var(--ss-blue5);
    background: none;
    color: var(--ss-white);
    text-align: center;
    font-weight: bold;
    line-height: 1em;
    padding: var(--ss-space-sm) var(--ss-space-lg);
    box-shadow: 0.1em 0.1em 3px var(--ss-blue4);
    margin: 0 0 var(--ss-space-md) 0;
    cursor: pointer;
    white-space: nowrap;
}
/*------ads---------*/
#pausePopupInnards {
    width: 100%;
}
#pauseAdPlacement,
.pauseAdPlacement {
    position: relative;
    z-index: 10;

    margin-right: auto;
    margin-left: auto;

    display: none;
}
.pauseAdPlacement.shellshockers-respawn-banner-2 {
    min-width: auto;
  display: none;
}
#pauseAdPlacement iframe,
.pauseAdPlacement iframe{
    margin: 0 auto;
  display: none;

}

.display-ad-container > div,
.display-ad-container > img {
    margin: 0 auto;
  display: none;

}
.house-ad-small {
    display: none;
}
.house-ad-wrap {
    display: none;
}
.adBlockerVideo {
  display: none;
}
/*------inv-----*/
 #stat_item {
	flex: 0 0 48%;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	background: url(data:image/jpeg;base64,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);
	margin: 0 0 var(--ss-space-sm) 0;
	color: var(--ss-white);
	font-weight: bold;
}
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
    background: url(data:image/jpeg;base64,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);
    border: none;
}

#equip_grid .store_item{
	border: none;
	background: none;
	color: var(--ss-white);
}
#equip_grid .store_item:hover {
    background: url(data:image/jpeg;base64,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);
    border: none;
}
#equip_grid .highlight {
    background:  url(data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBYVFRgWFhYZGRgaHB4eGhwcHB4dHhweHh8cIR4eHB4fIS4lHh4rHx4eJjgmKy8xNTU1HCQ7QDs0Py40NTEBDAwMEA8QHxISHzQrJSs0NjY0NDE6ND09NDQ0NDQ0NDY0NDQ0NDQ0NDY0NDQ0ND00NDQ0NDQ0NDQ2NDQ0NDQ0NP/AABEIAT4AnwMBIgACEQEDEQH/xAAbAAADAQEBAQEAAAAAAAAAAAACAwQBAAUHBv/EADQQAAEDAgMGBgMBAAEEAwAAAAEAAhEhMQNBURJhcYGR8AShscHR4RMi8TJSFEKCogVicv/EABkBAAMBAQEAAAAAAAAAAAAAAAECAwQABf/EACgRAAICAgICAQQBBQAAAAAAAAABAhEDIRIxQVETBGFxgZEiUqHB8P/aAAwDAQACEQMRAD8A+UPxABCW14OUJb29ZWMHfmtEsj5CKKocR3KEiVjX9NE2AQINU6kpCtUSOW8vlUOwwdxXBgCn8TsbkhQEcO/NOY8jeOKTjBZhsJsCgrUqQXTWz0HYgcDrmOF0HixPRF4dkAzBPDvTuUnExZOXee/grylUf6vJFR3omouO8ffZELuOY13wgcVlbLjGUy7zXTWUQ/yPPPVYwd/PmivRxjhXqsjTucu9UTxVaXRPCFzWwJihdaaHu646rI1shdIJjb71hXArQKIBGOwytY6Lj5VO1/e+6Li0QJFpqLrS8dbRLl7FtZIo6OK2NeSM4QNjbI0WbP624eS6vsCwyCQIFZ8kIbNxVOYKXThhhoqYpIjKaisz6q0Y32TcqIgyaJ7sAtbIjvd35ongE995porce1U6xdgczy8V516Zcd6Xn6b1T4ppa6vlqLjopgw2XnzTUqZpi1WjX996II73TCMUyziyw59+iUIU/rvnyiiLD9KW11Q4f30W4Zr3knj2gPphPYZnvhuWP0zpy5prnGb/ABRCWihPkmkuwJ9CCINkT2ZgyPNHy156+oSQSCkuhgSFjU7FZBPWiSQlao5bL2MPJMaYuKd2XBwG4Zo2Dn8LevSMzYt9P2EA11rv05LYECt7I3tobwZivtGvp0xuAYachPPhu+0Ixlb0FtV2Gx0Wr7fCDEnPzyRNEZVXPMxKqloS9nNFOPumsdTvv+JbQjmytHQJGeIwg4LzHNgwf537r2iJB5qTxGDtNkCvKqz/AFOK/wCqI2KdaZ57hnksigPd/pcaLJi3qvPNQzBoZ0+lsQ4ce+zqhwnwfmvqje3McfXfoAeqaL0B9lDWXBQ47ZEgZ8kYdbWFr2StUknGkQTp7IhU1XOJaeyOhombE+nqmHfyy1WdQtbK8iV+fD6qlOTXZ970pynIdHp4+HaDXRPwWECTRbcyGwTn8dFrmGxA4+y9T44qTkkY29UwgwEg556c96Z+OtJ69Uhkgk6+aoY61N32VWFehJWLc2ApH3VOJwkzTzy0TG4FSUzi5Ojk1FWyfCYT33qnfhy81WzB0ITGuAoaq0cKS2Tll9EjGyC0378lhb+u8fN+CrewVSYkb6/fVCeKjlOzyvF+HH+hncaFRQF7rmA0yNO9683F8OWuItl1FfJeTnxU7RtxZL0yZgv3vR4VTB4ImMGWaFrIPfos6VMo9jWeiMmDXqEcVPCMj0+UOG4HKY8lqik6RFsWSTxKWXV3e/YT3sjIqcj1QnBpDRdizwSy2sJ2xZLxL3WaUWuyqdnr7cWz75LmP1lNGHOQCx3h9e+wvUcZdmHlE7De0UJcTrTpqnsFTQwIrSu5S7ERHv3oq8Z+yBScxvPfoqYm6fLpCy715BLYNs7ppZSY6mEnw+KXAzG7kqHYgAm9uWS0xlGuXgnK06BCzEJbETVAzG/atpy7905ztmTd2q5ZIyTfo5xaasxr8ikAwXaW31R4XiS52y4AZ142pC0srolUlkVx8Brjph4GFIDjQ0ySfFskiOHuO9652E7JxG665uFBBc4mNZ7/AIpSi2uNfsMdPlZJieEIrmO4S8fBoHRuK9WA6Y47uiw4Y2SD32FOX0a20OszXZ5jBUCKx38dFRht2QK0775IGMGflqEx9aRSLcdY3KEY8Va7KSlf4FtwAZkqfHwtkqtg/YjKPT+KfxJoNwg+iebXHo6LfLslAS3tFaJtRkacL8YPRdEx6d6LNJc1RdOtnqgkLS7qgwcStaSnvIPJeio2rTML0waESRWOEHKd3TkmCHtgfxLGGYhTvBa6NMhpuSuThtq09MNKXT2hzPDOZn3M9UTGSacOio8M+RUrPwFrrGHeR+PlaI44tJx6Jubtp9ivwkRv3+yodAFVxk60XYjZbMd5qigo3Qjk3Vk34JM2sQZ0ndA+kcRwzKEgkzUViPfcnNaQPUfd1LEkm2kUk35F4hIsEv8AFtCpjzTmOyPn7JowhcK3xKTvwJy4isPDI3jX29VggxE881TtQLpLjURw4LpwqqejlKxAZ+x0QvYLWPwD7JzW1326JWIO5WVRVMopOxYOvApL4JJMn5361RmmsJwAI7g/aVRtUPdbJ8MyILRHBL8R4Sxb0CocyvBd+QDKqVxi1UhlJp2ibBxCQIAkXAsai2k+yuwnzx4KHwjzJExWZBG6vKZV7WZgx2fOql9PKUnbGzRSKMIVAsJk8veqmeRtSU5os6SA0jnH36KTxOOMppTdTsLR9VPjFIjijcitzg6tBNzYZe6s8PibQaDUjMUtfvNfmRiuLjeZ1tWeK9jw+OGkOJgxBGtAl+l+puVSDmw0tFz2wsc5oaBeO/lGaiZukYhF7R1nivQnKlaMkd9keL+pdBqB7x7KMh3+pj1octeCfh4kuIMmZ7hMYynPovMnH5Gq0jbF8FsYMZoiedKd/ae7GAA0PDd1XjPxDJAMV1VDHZGw/wAnTdoRfSE2P6mW4/5BLCqTLXvJM0O4X/q3DFa9/aS1rciqMFwmLkrVif8AcyMlS0ZBAMjgfgqVrZorcc9PZIBAzgHNGUIppeARbqzC3+27CSGgDPnfmqMV4ydCHaExrne9gdFOSXIeLdCXEzu4oaZ29ETgDIkToUPh8O5JuT5JGm2kh9VZB4RxBkXNJGkVykSCR1Xo+HcNlxIt7UFOaFngiMo1z03rDhOJ2IgXJmZ00UsOGUKtFckoz8lzcMERlCgx8CJpwP8AFcyQAL0uua/a7otWbDHIknpmWM3Bto8vBOw4OEyLU1HwqPDAEGwN5meNeBR4/hRMgX8uKDGbsAHfygiFihglCdPpGhzUlrtj8fFc2xpellI/FJFSde9yt8OA1oHMzvS/wA/5Of8Aneewq5cc30/16JwcYva/ZEcTh78bSrmDabLa699TCQ7w5OXwqfCMLQMtd0mYS4VNSprQ2SUWtEOK0lxhsxQ0vRO/CR/kmIoCmuIBMWNpnp3qqHCcooKjeujgtunuwSyNJHmPb10IE8jYo8Jki5nKBlyFOCqdgSbn09k1mA0CsZXEro/TyctheVJCDhmgkjj9rdsH/tdTMn6VBwQLAckrFds5c1peKUVt/wCyakpdAPa1wgCvHhpdLDaQCeHfFCMWpB90zEMwcx571nk0todJ9C8bBktGsjvonMaNKAU+1J4h8xJ+kzDx7gwlx5oKTGlCXFFElwuQcrxz3QCP/GyNuMLEwRQtrM7tee5TMxN/LlFvdWtLTDiBMGsLThbku9k568CsXELR+wgmSPkxXkpsDFJoRM2O/wAk7xLxTMm+XJSYeK7lbhaFlz5GsmnpFMcU10VeDxiTBrNuvnT0TPEbNJnZkkxnAJhS+HdbWd9Z4ZUtuRwXHKAbHjXsKmHJJxaewTilK1oacWkU4ek/Sxp0jr8pGP8A6qKrT4gWPtuSPNJydug8NKlZQX//AGb3vUr/ABLq1G4f1a52nohIMED2tf4QlPJJaf8AB0YpdjMBxNwCMwDb6VQfJBnKI4KNjtWnj3zVDbCkVnuE+By8sTIlY8Yo4JWPiUpySHtjPyyrxQteZM3VHlltMCxrtFAxSc8tw6Ge4K5viZ3jz91K5s2tMrGYZBn09oTRyT1YeMRvisODTiJ5/SWzEIERMb481YWBwvWwWHDYG1BJjIgdPtNLDbbTpAU/DJA4aEz3Ud/E+PfsKkN2ZsaTwU+MymdNN9Z8/MLz80aWkaMctneHjO+4evkrmYsm9+n0oGPJIyrebckbH1IypfI5zSyfHJxqgTjy7LsTC2gVA8OaYgeXOq9LCr36JOKxo06T00V8+KMlyWmRhJxdMmwnTeOsa6GVXgYRApJGlDymPNQ4j2DN1/8AkBfcBSybhvaaNLhz+6BZsWXi6e/2WnFtFOOw7X+ben0pHs3eiczGLR+ruslY5pJmnKeZ4Iy4y92LG4kxGZ9NPJU4RgGw0RsIIM5XMUr/AHRSPauSUVaC3emPZi13nznuZRufTVRVPfdFXhiAnwty0LOKWxTsQSNQja0kCaT3VUsw9aJowxGp1Wj4G9tiPIl0CzD/AFk8PtdsZClOHrwTS0xGXqtDDdaFCqojy9i8I3yj/QjhUdUnFI2TF5GXe5Bi4paS0EhpIMWHQXWz+u1cb+XfJSeTknH1ZVRp37IcRxJnqUxj+sdVrqVz76LcNoAkzn7bvdYuNF7tE7GxJkemW/mqm7MbUVzm0/xTsw6U4C3X0Vf4yG0glUjF09AmzPzmD56Z09ehXYlf9DM+XFRwZq0iunBG50G9dd1OhEDu+d5JvsZQRv4gZiRfu+5AcNopI9+FLp9XClN+uVNI9kDfDBtTI7kQIlLKOk0hk/DYvZ09ePmja6Pet6U53Wf6JGzuvpvGUC63ZaBUidCJ849+qK9po5+mGHmBpxlGHDdvkKchh+pCY1jRYnqc+FlSMpfYVxj9xm2LCBO5UYWHJqY8ypsJrQf2BdnUweERVW+GYysAgi4NPNasNv1/JHJpDm4Y4oXAW6wUh9CTI3RK52PPzPmrvIuqoioNhOeBn6rcPG3c0lj5MbjXWPb4WscZtERM+yRZHfY7hrZvjmV2oPTTsJL8YEQRUEU4BVuAcFL4nCgSMkk4yTcl0wwknSYov7qhMZTu+RXuUwYNCZHWqz9Wi8nTvNRlG1b0VT9Ch4iIBFkeH4m0VG8dEL8VjaH9jxEZXPILB/8AIRVrWgeWVONe4SfKo6lL+B+HLpFTngx5fPmoPEETBGqLE8btQXNtvPf8U78UG6TNmhJUmNDG49jsLFIEDqdydtOfUuMCMomnfVRMxADr5DzRNxKnTMCxG+27RZuaXb16KcPRQcYFC3DAMiaRQj2Nxu3pLnRfPs970f5okUrnQ20NxyNV3yp9o7hXTG/igUKItOYy3XFEoeKOmfefcov+qdp5KyyRJuMgqj/tM8RRUAONyYinf2pjiPMHZ8ifJH+V/wDx3f57qmhkV+QSi68Dv+mm0rfxXmaa+o3IA901I5wPtE58n/Q/9neyrcX9vyTpjJIiABohLpEGhnS+iQ7EGo3/AK9N6zDdtGaUHLQU5p45F1dncPJY10N2j3wQYohtDWZ48N6SzEINcrxbmM7prCIl0ka5zoqclLXQvGtiy8gf5nqBz1SHuJzA78/6j2pseaVibX8HcrNlarsrFbIX/wCq7oHSOqAOlG5sxPBCW8Y499leY7s1o55nXmiYBag3/tSo0+FrRf373lUYeDtAbJgjWlp38EYxcnSOckifYiorHGnH6XUn07unYmG5t6AzvmOCDDxC0z6+d0XGnTAnatGvcDA85RHDIAGc2Fxa64MJNgNcq8SqMLDa0V6RX+b/AFVIxt2xG66MZhgDaPpU8FzfEZ/5bMGILgBoJB9LUN0nGxS86aRp3K5uA4X/AFsd+4jrMoyk26j0dFVuQtzzeT17zTMMPdGyTH/6oPjnvXDDAtfX68+Sa121APsEqi/LC2vADcHOSfTWKprYBq0niSPSKUS9sWHX7S9sg3jn175Zo8knpC02i7ZZ/wATxB++C0eGaf8AJrvp31zSfyfq09T33RbhOoI8p7n5WmE4PTSJST7TDxGEViHWN86TzsgOJMCYHTid6fheLEw4UyzVP4WOAmnCPdaYwUk3F/ryTcuOpI84YgJiZSscxSx1nqn+Kw9k3JgkD79kjEZNR3wUckXTXkqmtMW4iQa6mvWJCU8ZwR3aeMqzEwNrO3IosPwrc7qEsEpS6HWRJEYaePZv5J/h3XBkzpebaV/qcWAQA2m+pnX69UQxJpJjQUHRNDA4u26YJTvwA9jpjZ1pArvqib4YAbW0OgMIdptJOcZkxxRuJikRXMehT8Um29iNvSRO58WE1oc9fbOUDcMurFOd/bmmNwySY71smjaAIIkdFnWNt2ynKlomZ+udfJMFY2jAzKHaaaSRG4X3kVXYria5agkilonpCK4xQds1hHEJL3klcHiI7yROwwGyakmPlLKVrQUqezcF8A1m0T074LHtk05LcNzQ2omTS0g7919EovrIhTfSHXZVhNLauPLM6U6Joe40mMwBXKTO9TM1Px07zWgyQBXfrbvsq0W0kiTim2xpeahxmLHOcrLcDxBaaWzCU99azf3ulOdN0/ySUrT6BxTWyrxzqz/yg/Poktdp31VHiY2G8TX27KS1wAvXvLyVpWpu/wDrFj0P2wZ2T5TPFMe8ZdFzWGJBA+PuyHY3jp2Fa5E9ATyHffJLD4rnyTPEExwkHOuv2FKSY6TChkk+ikV5Hh9PP7Wh1CQfu/fPNKw8MnOAtdhxXJcm2ug0rMdjOGXedeaW3FNua53Cw7otYzXvv2ChLlJjqkg34gNYrnbnayWWZtpqm7EV0yJmnwiwwJtOmgr8IvH7By8oSxkGYgi2fRObgbQtUExW9c/LomdjLmVuI0sMEjgLeSpDCk7e0K5t/kl/A4mld++6I7LZ1M0j9co+eQ5a7GN7jQmx5JeIaRxPGt+kJJxiraHTb0wXYk9+veSBuJBmb9cj6JzWAsOtxyUrWk0ivIU+arNJyTTHjTssPiBNWg74Fcid4mUR2Xf5gEHKle81DPKneSKxEVN+J/voqLLLzTA4LwemSSwxcdkd6KVuGT2aeS3CxTtf8deI1GqbiPJMWPHzy7K1OSmkyNOOioVH17yhBqeNYWuBFcoqM+I1SnmgjOsrXLoilY1wgzMSgOGA0uMDQHM2HTihGNSl4uZp82hSu2iawTN798FFtd1Y8Yt96KMLxI2q1abim/Ph7JmIykiunvdRjDJsRIHfPeqm4ghsSRAk6ffwui7VMaSp2hbWOsI3ib8J3wuLNm9J75q1rAe/RJ8Rh02s+Os+654eOxFO3QhrqX7EVldhYZie9wQOmh4buXeiow3gNmK5IRjFvfgeVpaNc3ZFY2iLaA971LiPAFNTXKFmJiSY138M0gtv6XGfoo5cj2ojwj5YbRtVBqfK/XPqiOGXag6V7z80DHgCdaAVMJjcfZAtO+3MCv8AeajFqqkO7vQWIQ0EUFKZTwUwFbi9CIytRLxL1vqiFBMUuOXwVKcuUuqoZRpD8TDl1jFB5JbaZx13Upw4LTibX6iM+930luEUnvJM2mwJNLYW19ic87b+ynfkmQSb0N+NZ79UsYI9FwpcWpS8qkW0tnNJnsl4y75pJww4brwPZKbiVBGSNorLeY0+l6EZqemZePEA4bgI2YHWdaoGMg1VbsQmCMrj4TBiNc39qEZRUJWop03+DuTromxBYiRGi1uIIINOUSm7BqQZAp3VAyLDj2M03m/YL0C4Ak7RnfHokum7skx9HVsQtePSnRLp2vQ10KZswATQaVNqU7zRY7rUgABcyg1PfwmNwy85QKmaSkdqNeWM2rsmfhzWNnuZmkFDhCuzbWTGVzJHYCqxiQTNqdwULmAgEaidJAzHdyouLcrQynrZN4tpmbRp5d70Ia0xJ0mMpvfNV+JZIJyj276KMHVJlglJ/caErRsGgNY4x5eymDVS1u1N5HugIJ96/Jrmoyg9MdS8AkZzqtc2bCB0RtcBbrmsknXvcmUYrsFs5jaFbHLRGwT3dc51TSNNyrSSSFsZhgkUEq38esSk4Yg1yFt2/wBFQ3EkWPftC144pd9mecm+jbUNyvNxsUtc4AUNfUmnHy4r0MdpMGt66pb/AA21Q04+xS54Syaj2ug45KO2S4XiScoPPv8AqrJgAmL1HupD4cMMTOdstSenVUYWKONOKhico3GXY00nuPQWOwmxrlvqEtjpEG+9Y3xQsbSjdGmSspxk7XfkFNKmC3DANL8Y/iYTAMUic6yNUAfUZ7tVoMkAKioV35Bx3E7Jn5snAQ07QifaEJYdpoymeiV4rxEnZHM58tylJqNt/hBS5UkE4S2Ne/dREiBeayDqDly909uMBQyN4yupcQif1NuUrNknbTLQjVoc0RVpvfu11mLiyBroJz9zAQh/vaRr5fKV4giQdwETu8q5JJZKWh4q2bWTtUOeuWRtZbhmvt/ETHNoLZz0p3qg/IJtbuqEWk7DtjdqiPw4qdw79kgY3Cnnb4XYJNq8rp/kXJUBx0z02MVGEKd6FA9sWSNo32iDrzXot8WY65FhcBayAmvvl9pJfFJoa8qonYoAMinffND5U9C8GmB43Als5iqmwpg0g1pSnGybhY5JjIRomvxGgkzUCIOm6ilJQm+S0WVxXFo8n8hdu4Z7v6vR8G6WltSB1icrwZ9So8Zg/wBNGd/XhVO8JigGbTc7iVjg6lTZae46MaSCAQD6/wAVTGHUe6EYUum44e5T8MwfT17lacSa7ITlfRj9qaGaEegXltaQTJHFeh+YE8+amx2Qa7/pdNKVNeBsba0xZeRe+h079VjnRcDJYW95rdqRQDh6qTb6bK0gCcwI7/nUKfFNd3COV1RiNIr89/xATMCKnvK6zZFfemUj9hTXrid/l2ImfNHi+HLSQRUX3Hh7oHAx5e6SpJDaDc0RM5xcelwLoWu1SQUxpv8AA7F0vINHtvfBga1/h9ELRWAmEd97kpzoBIuvZlrbMC+xmO3adszYVSvEGgvqe85TcAkuO+a507/iH8YIM5V9THkoqKlFv2UWmkydjyB51TMJwoIyz6qVtTApPx9J2BWBxvvUIyd0VlHQvxJcCQZAvx7K3DZWINvaqM/uJN2g880ltSptU7DeqKmyIPY471V+QOEi4vv4KZ+HvoR7LfCtH7A13q+NtS4+GSkk1YRdWwEZ3vUC6Bzy4mLZWWlwg0tU77CN2fGUGG8m0BPdOmdXlDw0AVqp3ObMih0/uaJ5943KY1vXKtbBJPJ6QYo3GmApnDh3yVQNJ49+aTiVUMq5OysXQIxcoplr5Z/K3EeD/IS9lY28cVBTa0PSCIEZzl9oHJpoeHPTXelSBklk7Cj/2Q==) !important;
    border: none;
}

</style>`
    }
    document.body ? addScript() : document.addEventListener("DOMContentLoaded", e => addScript());
})();