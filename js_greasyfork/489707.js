// ==UserScript==
// @name        Pissmail Captcha Simplifier
// @version     1.0
// @description Just type in the captcha math and press enter
// @match       https://pissmail.com/login.php
// @namespace   sylvie.moe/soup-spooner
// @license     MPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/489707/Pissmail%20Captcha%20Simplifier.user.js
// @updateURL https://update.greasyfork.org/scripts/489707/Pissmail%20Captcha%20Simplifier.meta.js
// ==/UserScript==

console.log("Soup-Spooner 5000 Commencing…");

window.addEventListener("load", () => {
	const input = document.querySelector("input[name='captcha']");
	const ok = document.querySelector("a.ok");
	input.addEventListener("keyup", ev => {
		if(ev.keyCode == 13){
			input.value = eval(input.value);
			ok.click();
		}
	});
});
