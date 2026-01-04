// ==UserScript==
// @name         Bonk.io - Clean View
// @description  Hides everything on the bonk.io page except for the game itself
// @version      1.0
// @namespace    https://greasyfork.org/users/945115
// @match        https://bonk.io/gameframe-release.html
// @run-at       document-start
// @license      The Unlicense
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450486/Bonkio%20-%20Clean%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/450486/Bonkio%20-%20Clean%20View.meta.js
// ==/UserScript==

if(!window.bonkCodeInjectors) window.bonkCodeInjectors = [];
window.bonkCodeInjectors.push(bonkCode => {
	try {
        window.top.document.getElementById("bonkioheader").remove()
        window.top.document.getElementById("descriptioncontainer").remove()
        window.top.document.body.getElementsByTagName("style")[0].innerHTML += "#maingameframe { margin: 0 !important; margin-top: 0 !important }"
        Array.prototype.at.call(window.top.document.body.getElementsByTagName("div"), -1).remove()
		return bonkCode;
	} catch (error) {
		alert(errorMsg);
		throw error;
	}
});

