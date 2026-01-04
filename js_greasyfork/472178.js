// ==UserScript==
// @name         Busuu - Mute answers' SFXs
// @namespace    http://tampermonkey.net/
// @version      1.01
// @author       @ojczeo https://github.com/ojczeo
// @description  Busuu - mute answers' SFXs
// @match        *://*.busuu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=busuu.com
// @license      GNU GPLv3
// @source       https://gist.github.com/ojczeo/e3a3c47c947594d33538a7448db0e057

// @downloadURL https://update.greasyfork.org/scripts/472178/Busuu%20-%20Mute%20answers%27%20SFXs.user.js
// @updateURL https://update.greasyfork.org/scripts/472178/Busuu%20-%20Mute%20answers%27%20SFXs.meta.js
// ==/UserScript==
 
(function() {
	audio.addEventListener("play", (event) => {
		const testString = event.srcElement.children[0].src;
		const testReg = new RegExp(/.*wrong|right.*/);
		if (testReg.test(testString)) {
			console.log("mute", testString);
			event.target.volume = 0;
		}
	})
})();