// ==UserScript==
// @name         Dailies
// @namespace    neopets
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.neopets.com/faerieland/caverns/index.phtml
// @match        http://www.neopets.com/altador/council.phtml*
// @match        http://www.neopets.com/worlds/geraptiku/tomb.phtml
// @match        http://www.neopets.com/desert/fruit/index.phtml
// @match        http://www.neopets.com/prehistoric/omelette.phtml
// @match        http://www.neopets.com/island/tombola.phtml
// @match        http://www.neopets.com/jelly/jelly.phtml
// @match        http://www.neopets.com/faerieland/tdmbgpop.phtml
// @match        http://www.neopets.com/pirates/anchormanagement.phtml
// @match        http://www.neopets.com/pirates/forgottenshore.phtml
// @match        http://www.neopets.com/halloween/applebobbing.phtml
// @grant        none
// @require      https://code.jquery.com/jquery-3.5.1.js
// @downloadURL https://update.greasyfork.org/scripts/416550/Dailies.user.js
// @updateURL https://update.greasyfork.org/scripts/416550/Dailies.meta.js
// ==/UserScript==

$.fn.exists = function () {
	return this.length > 0;
};

const beta = $("#leaveBetaPopup__2020").exists();
const d = document;
const url = location.href;
let delay = Math.floor(Math.random() * 500) + 1000;

if (url.includes("faerieland/caverns")) {
	let path = Math.floor(Math.random() * 2);

	clickIfExists($("input[value='Enter']"));

	if ($("input[value='Left']").exists()) {
		if (path === 0) {
			$("input[value='Left']").click();
		} else {
			$("input[value='Right']").click();
		}
	}
}

// Altador Council Chamber
if (url.includes("altador/council")) {
	if (url === "http://www.neopets.com/altador/council.phtml") {
		clickIfExists($("map area")); // Click on king
	}
	if (url.includes("?prhv=")) {
		clickIfExists($("input[value='Collect your gift']"));
	}
}

// Deserted Tomb
if (url === "http://www.neopets.com/worlds/geraptiku/tomb.phtml") {
	clickIfExists($("input[value*='Open the']"));
	clickIfExists($("input[value*='Continue on']"));
}

// Fruit Machine
if (url === "http://www.neopets.com/desert/fruit/index.phtml") {
	clickIfExists($("input[value*='Spin, spin, spin']"));
}

// Giant Omelette
if (url === "http://www.neopets.com/prehistoric/omelette.phtml") {
	clickIfExists($("input[value*='Grab some Omelette']"));
}

// Tombola
if (url === "http://www.neopets.com/island/tombola.phtml") {
	clickIfExists($("input[value*='Play Tombola']"));
}

// Giant Jelly
if (url === "http://www.neopets.com/jelly/jelly.phtml") {
	clickIfExists($("input[value*='Grab some']"));
}

// The Discarded Magical Blue Grundo Plushie of Prosperity
if (url === "http://www.neopets.com/faerieland/tdmbgpop.phtml") {
	clickIfExists($("input[value*='Talk to the Plushie']"));
}

// Tombola
if (url === "http://www.neopets.com/pirates/anchormanagement.phtml") {
	$("#form-fire-cannon").submit();
}

// Forgotten Shore
if (url === "http://www.neopets.com/pirates/forgottenshore.phtml") {
	$("a[href*='confirm']:has(div)").get(0).click();
}

// Apple Bobbing
if (url === "http://www.neopets.com/halloween/applebobbing.phtml") {
	$("#bob_button").parent().get(0).click();
}

function clickIfExists($_selector, timeout = delay) {
	if ($_selector.exists()) {
		setTimeout(function () {
			$_selector.click();
		}, timeout)
	}
}