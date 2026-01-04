// ==UserScript==
// @name         PP Bot
// @version      1.4
// @description  Have fun
// @author       Darkness
// @grant 		 GM_xmlhttpRequest
// @grant 		 unsafeWindow
// @XmlHttpRequest 		 https://raw.githubusercontent.com/mitchellmebane/GM_fetch/master/GM_fetch.min.js
// @XmlHttpRequest		 https://raw.githubusercontent.com/TouchedByDarkness/PixelPlanet-Bot/master/base64.js
// @connect		 githubusercontent.com
// @connect		 github.com
// @connect		 glitch.me
// @connect		 pixelplanet.fun// 
// @match      *://*/*
// @connect		 fuckyouarkeros.fun
// @downloadURL  https://touchedbydarkness.github.io/stuff/ppf_bot/initer.user.js
// @updateURL  	 https://touchedbydarkness.github.io/stuff/ppf_bot/initer.user.js
// @match      *://fuckyouarkeros.fun/*
// @match      *://pixelplanet.fun/*
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
