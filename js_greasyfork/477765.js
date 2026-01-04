// ==UserScript==
// @name         Pink CrossHair/Health Bar
// @namespace    https://www.tampermonkey.net/
// @version      1.1
// @description  A Pink CrossHair/Health Bar
// @author       Cluck36
// @match        https://shellshock.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477765/Pink%20CrossHairHealth%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/477765/Pink%20CrossHairHealth%20Bar.meta.js
// ==/UserScript==

(function () {
    const addScript = () => {
        document.title = "Shell"
        document.head.innerHTML += `<style>


/*------------TWITCH-----------*/
#giveStuffPopup.twitchDrops .twitch-btn {
    font-size: 1em;
    background: var(--ss-black);
}
#giveStuffPopup.twitchDrops footer {
    padding-bottom: 1em;
    background-color: var(--ss-alphaclear);
}
#giveStuffPopup.twitchDrops .egg-give-stuff, #giveStuffPopup.twitchDrops .grid-item {
    width: 9em;
    height: 9em;
    max-width: 9em;
    max-height: 9em;
    min-width: 9em;
    min-height: 9em;
    border: 0.5em solid;
    margin-bottom: 1em;
    border-radius: var(--ss-space-lg);
    background-color: #FFC0CB;
}

#healthContainer {
	position: absolute;
	left: 50%; bottom: 1em;
	transform: translateX(-50%);
	display: inline-block;
	width: 6em; height: 6em;
	background: #FFC0CB;
	border-radius: 50%;
	text-align: center;
}

#health {
}

#healthHp {
	font-family: 'Nunito', sans-serif;
    font-weight: bold;
    color: #FFC0CB;
    font-size: 1.2em;
    transform: translateY(-3.45em);
}

.healthBar {
	transform-origin: center;
	transform: rotate(90deg);
	fill: transparent;
	stroke: #ffffff

;
	stroke-width: 1em;
	stroke-dasharray: 14.4513em;
	transition: all 0.3s ease-in-out;
}

.healthYolk {
	fill: #FFFFFF;
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
    color: #FFC0CB

;
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

#eggBreakerContainer {
	position: absolute;
	left: calc(50% + 9em); bottom: 1em;
	transform: scale(4) translateY(-3em);
	transform-origin: 50% 100%;
	width: 6em; height: 6em;
}

#eggBreakerContainer.on {
	visibility: visible;
	transform: scale(1) translateY(0);
	transition: 1s;
}

#eggBreakerContainer.off {
	visibility: hidden;
}

#eggBreakerIcon {
	position: absolute;
	height: 100%;
}

#eggBreakerTimer {
	position: absolute;
	color: #9e239e;
	text-shadow: var(--ss-yolk) 0 0 0.1em, black 0 0.1em 0.2em;
	font-size: 2.5em;
	font-family: 'Nunito', sans-serif;
	font-weight: 900;
	text-align: center;
	width: 100%;
	top: 18%;
    left: 50%;
	transform: translateX(-50%);
	text-align: center;
	z-index: 6;
}

.crosshair {
	position: absolute;
	transform-origin: 50% top;
	top: 50%;
	border: solid 0.05em #ffadbc;
	height: 0.8em;
	margin-bottom: 0.12em;
	opacity: 0.7;
}

.crosshair.normal {
	left: calc(50% - 0.25em);
	background: #9e239e;
	width: 0.5em;
}

.crosshair {
	position: absolute;
	transform-origin: 50% top;
	top: 50%;
	border: solid 0.05em #FFFFFF;
	height: 0.8em;
	margin-bottom: 0.12em;
	opacity: 0.7;
}

.crosshair.normal {
	left: calc(50% - 0.15em);
	background: #ffadbc;
	width: 0.3em;
}

.crosshair.powerful {
	left: calc(50% - 0.25em);
	background: #ffadbc;
	width: 0.5em;
}

#reticleDot {
	position: absolute;
	transform: translate(-50%, -50%);
	top: 50%;
	left: 50%;
	background: #ffadbc;
	border: solid 0.05em #FFFFFF;
	width: 0.3em;
	height: 0.3em;
	opacity: 0.7;


</style>`
    }
    document.body ? addScript() : document.addEventListener("DOMContentLoaded", e => addScript());
})();
