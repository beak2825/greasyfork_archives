// ==UserScript==
// @name         Rainbow Car
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  This overwrites the entire game. do not use with other scripts
// @author       You
// @match        https://app-polytrack.kodub.com/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kodub.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514061/Rainbow%20Car.user.js
// @updateURL https://update.greasyfork.org/scripts/514061/Rainbow%20Car.meta.js
// ==/UserScript==

let url = "https://raw.githubusercontent.com/Candorada/TamperMonkey/refs/heads/main/polyCartRainbowCar.js"
async function tamper() {
	try{
	await fetch(url)
	document.body.parentElement.innerHTML =`
	<!DOCTYPE html>

	<html>
		<head>
			<link rel="manifest" href="manifest.json" />
			<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no">
		</head>
		<body>
			<canvas id="screen"></canvas>
			<div id="ui"></div>
			<div id="transition-layer"></div>
		</body>
	</html>
	`
	let s = document.createElement("script")
	s.textContent = await (await fetch(url)).text()
	document.body.appendChild(s)
	}catch{

	}
}
tamper()