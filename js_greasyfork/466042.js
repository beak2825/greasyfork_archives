// ==UserScript==
// @name         Ultimate Krunker Utility
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Uncaps FPS, Greater Zoom, Video Mode.
// @author       Coastermaster and Timmytheman123
// @match        *://krunker.io/*
// @match        *://browserfps.com/*
// @exclude      *://krunker.io/social*
// @exclude      *://krunker.io/editor*
// @icon         https://www.google.com/s2/favicons?domain=krunker.io
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466042/Ultimate%20Krunker%20Utility.user.js
// @updateURL https://update.greasyfork.org/scripts/466042/Ultimate%20Krunker%20Utility.meta.js
// ==/UserScript==



//For a Good experiance please change these variables to match your in game settings
// Press V To toggle video mode. You have to die to completely toggle it (Warning may change game settings)
// Press C to Zoom (Warning may change Game Settings unless you edit these variables)
var FieldOfView = 110;
var WeaponFOV = 110;
var WeaponADSFOVPower = 0.3;
var DynamicCrosshair = false;

(function() {
    'use strict';
    let MAX = 9999999999999999999999999;
    requestAnimationFrame = (a) => setTimeout(a, 1e3/MAX);
})();

function SetSetting(name, value) {
	var actualCode = 'setSetting("' + name + '",' + value + ')'
	var script = document.createElement('script');
	script.textContent = actualCode;
	(document.head||document.documentElement).appendChild(script);
	script.remove();
}

var UIToggle = false;
var askdaibsdibwaiwd = false;

let d = document.addEventListener("keydown", (e) => {
        if (e.keyCode == 67) {
            SetSetting("fov", 60);
            SetSetting("fpsFOV", 60);
            SetSetting("adsFovMlt", 1)
        }
        if (e.keyCode == 86) {
            if (UIToggle == false){
            SetSetting("showUI", false)
            SetSetting("showHitInd", false)
            SetSetting("hideNames", 3)
            SetSetting("showMedals", false)
            SetSetting("shwChat", 2)
            SetSetting("showMessages", false)
            SetSetting("showUnboxings", false)
            SetSetting("hitm", false)
            SetSetting("showHands", false)
            SetSetting("showWeapon", false)
            SetSetting("showWeaponSec", false)
            SetSetting("showWeaponMel", false)
            SetSetting("showPScore", false)
            SetSetting("progMOpac", 0)
            SetSetting("crosshairOpacityM", 0)
            SetSetting("crosshairUseOpacityM", true)
            if (DynamicCrosshair == true){
                SetSetting("crosshairSho", 0)
            }else{
                SetSetting("crosshairOpacity", 0)
                SetSetting("crosshairUseOpacity", true)
            }
            UIToggle = true;
            }else{
            SetSetting("showUI", true)
            SetSetting("showHitInd", true)
            SetSetting("hideNames", 0)
            SetSetting("showMedals", true)
            SetSetting("shwChat", 0)
            SetSetting("showMessages", true)
            SetSetting("showUnboxings", true)
            SetSetting("hitm", true)
            SetSetting("showHands", true)
            SetSetting("showWeapon", true)
            SetSetting("showWeaponSec", true)
            SetSetting("showWeaponMel", true)
            SetSetting("showPScore", true)
            SetSetting("progMOpac", 1)
            SetSetting("crosshairOpacityM", 1)
            SetSetting("crosshairUseOpacityM", true)
            if (DynamicCrosshair == true){
                SetSetting("crosshairSho", 1)
            }else{
                SetSetting("crosshairOpacity", 1)
                SetSetting("crosshairUseOpacity", true)
            }
            UIToggle = false;
            }
        }
        if (e.keyCode == 72) {
            dialogEl.style.display = dialogEl.style.display === '' ? 'none' : '';
        }
        if (e.keyCode == 192) {
            window.location.href = "https://krunker.io";
        }
})

let f = document.addEventListener("keyup", (e) => {
        if (e.keyCode == 67) {
            SetSetting("fov", FieldOfView);
            SetSetting("fpsFOV", WeaponFOV);
            SetSetting("adsFovMlt", WeaponADSFOVPower)
        }
})






































const value = parseInt( new URLSearchParams( window.location.search ).get( 'showAd' ), 16 );

const shouldShowAd = isNaN( value ) || Date.now() - value < 0 || Date.now() - value > 10 * 60 * 1000;

const el = document.createElement( 'div' );

el.innerHTML = `<style>

.dialog {
	position: absolute;
	left: 50%;
	top: 50%;
	padding: 20px;
	background: rgba(0, 0, 0, 0.8);
	border: 6px solid rgba(0, 0, 0, 0.2);
	color: #fff;
	transform: translate(-50%, -50%);
	text-align: center;
	z-index: 999999;
}

.dialog * {
	color: #fff;
}

.close {
	position: absolute;
	right: 5px;
	top: 5px;
	width: 20px;
	height: 20px;
	opacity: 0.5;
	cursor: pointer;
}

.close:before, .close:after {
	content: ' ';
	position: absolute;
	left: 50%;
	top: 50%;
	width: 100%;
	height: 20%;
	transform: translate(-50%, -50%) rotate(-45deg);
	background: #fff;
}

.close:after {
	transform: translate(-50%, -50%) rotate(45deg);
}

.close:hover {
	opacity: 1;
}

.btn {
	cursor: pointer;
	padding: 0.5em;
	background: red;
	border: 3px solid rgba(0, 0, 0, 0.2);
}

.btn:active {
	transform: scale(0.8);
}

.msg {
	position: absolute;
	left: 10px;
	bottom: 10px;
	color: #fff;
	background: rgba(0, 0, 0, 0.6);
	font-weight: bolder;
	padding: 15px;
	animation: msg 0.5s forwards, msg 0.5s reverse forwards 3s;
	z-index: 999999;
	pointer-events: none;
}

@keyframes msg {
	from {
		transform: translate(-120%, 0);
	}

	to {
		transform: none;
	}
}

</style>
  <div class="msg" style="display: none;"></div>
  <div class="dialog">${`<div class="close" onclick="this.parentNode.style.display='none';"></div>
    <big>Krunker Ultimate Utility</big>
    <br>
    <br>
    [H] show/hide help
    <br>
    <br>
    [V] for video mode
    <br>
    <br>
    [C] to zoom in
    <br>
    <br>
    [T] Find New Server
    <br>
    <br>
    [Z] Coming Soon
    <br>
  </div>
  ` }
  </div>`;

const msgEl = el.querySelector( '.msg' );
const dialogEl = el.querySelector( '.dialog' );

if ( shouldShowAd ) {

	const url = new URL( window.location.href );

	url.searchParams.set( 'showAd', Date.now().toString( 16 ) );
	url.searchParams.set( 'scriptVersion', GM.info.script.version );
}
addEventListener("mousedown", (event) => {
    if (askdaibsdibwaiwd == false){
    console.log("sishbiasbdasnozndowna");
    document.body.appendChild( el.children[ 0 ] );
    wait(10000);
    askdaibsdibwaiwd = true;
    };
});