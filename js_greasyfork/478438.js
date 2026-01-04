// ==UserScript==
// @name         Simple Ringed Reticle
// @namespace    https://www.tampermonkey.net/
// @version      0.1
// @icon         https://lh3.googleusercontent.com/hquEaHN2eD2qEUxs41T0vs8ft0qHdvGQiHIQQnKMKbPaddTevn71ij1xiWatT1fXozEjo37l2GAIlX98Le_eymZ5=w128-h128-e365-rj-sc0x00ffffff
// @description  Simple Shell Shockers Theme only editing the Scope ADS and hipfire crosshair
// @author       Cluck36
// @match        https://shellshock.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478438/Simple%20Ringed%20Reticle.user.js
// @updateURL https://update.greasyfork.org/scripts/478438/Simple%20Ringed%20Reticle.meta.js
// ==/UserScript==

(function () {
    const addScript = () => {
        document.title = "Simple Ringed Reticle"
        document.head.innerHTML += `<style>

 #best_streak_container {
    position: absolute;
	top: var(--ss-space-sm); left: 50%;
	padding: 0; margin: 0;
    transform: translateX(-50%);
	text-align: center;
	z-index: 6;
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

	padding-left: 1.25em;
	padding-top: 0em;

	background-image: url('https://cdn.discordapp.com/attachments/656693174445670420/1066558041568325712/IMG_6536.png');
    background-position: left center;
	background-size: contain;
    background-repeat: no-repeat;
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
	background: url('https://cdn.discordapp.com/attachments/656693174445670420/1066417024911290408/IMG_6524.png') center center no-repeat;
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
	opacity: 0.7;
}

.crosshair.normal {
	left: calc(50% - 0.15em);
	background: #0afee5;
	width: 0.3em;
}

.crosshair.powerful {
	left: calc(50% - 0.25em);
	background: #E861A0;
	width: 0.5em;
}

#reticleDot {
	position: absolute;
	transform: translate(-50%, -50%);
	top: 50%;
	left: 50%;
	background: #0afee5;
	border: solid 0.05em black;
	width: 0.3em;
	height: 0.3em;
	opacity: 0.7;
}

#redDotReticle {
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
	transform-origin: center;
	background: transparent;
	border: solid;
	border-radius: 30%;
}

.shotReticle:nth-child(odd) {
	transform: translate(-50%, 33%) rotate(0deg);
	width: 4em;
	height: 60%;
}

.shotReticle:nth-child(2n) {
	transform: translateX(-50%) rotate(90deg);
	width: 2.5em;
	height: 100%;
}

.shotReticle.fill.normal {
	border-color: #0afee5;
	border-left: solid transparent;
	border-right: solid transparent;
	border-width: 0.18em;
	padding: 0.18em;
}

.shotReticle.fill.powerful {
	border-color: #E861A0;
	border-left: solid transparent;
	border-right: solid transparent;
	border-width: 0.3em;
	padding: 0.1em;
}

.shotReticle.border.normal {
	border-color: black;
	border-left: solid transparent;
	border-right: solid transparent;
	border-width: 0.2em;
}

.shotReticle.border.powerful {
	border-color: black;
	border-left: solid transparent;
	border-right: solid transparent;
	border-width: 0.4em;


</style>`
    }
    document.body ? addScript() : document.addEventListener("DOMContentLoaded", e => addScript());
})();
