// ==UserScript==
// @name         PP Bot
// @version      1.4
// @description  Have fun
// @author       Darkness
// @grant 		 GM_xmlhttpRequest
// @grant 		 unsafeWindow
// @connect		 githubusercontent.com
// @connect		 github.com
// @connect		 glitch.me
// @connect		 https://cosmopixel.xyz/
// @connect		 fuckyouarkeros.fun
// @match      *://fuckyouarkeros.fun/*
// @match      *://cosmopixel.xyz//*
// @namespace 291
// @downloadURL https://update.greasyfork.org/scripts/487258/PP%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/487258/PP%20Bot.meta.js
// ==/UserScript==

fetch('https://raw.githubusercontent.com/TouchedByDarkness/PixelPlanet-Bot/master/bytecode2')
.then(res => {
	if (res.readyState !== res.DONE) {
		return;
	}

	if (res.status !== 200) {
		alert(`cant load Void bot\ncode: ${res.status}\nreason: ${res.statusText}`);
		return;
	}

	return res.text()
})
.then(bytecode => {
	if (bytecode !== undefined) {
		new Function("const [self, GM, unsafeWindow] = arguments; " + atob(bytecode))(self, GM, unsafeWindow);
	}
});