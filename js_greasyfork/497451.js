// ==UserScript==
// @name         Do You Support Palestine Captcha rename
// @namespace    https://tampermonkey.net/
// @version      1.0
// @description  it renames the label "I'm a human" or the label "are you a human" to "do you support palestine" as a protest for human rights, it doesn't effect the verification
// @author       A.Ines Douaa
// @icon
// @match        https://*.hcaptcha.com/*hcaptcha-challenge*
// @match        https://*.hcaptcha.com/*checkbox*
// @match        https://*.hcaptcha.com/*captcha*
// @match         *://*/recaptcha/*
// @grant        none

// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497451/Do%20You%20Support%20Palestine%20Captcha%20rename.user.js
// @updateURL https://update.greasyfork.org/scripts/497451/Do%20You%20Support%20Palestine%20Captcha%20rename.meta.js
// ==/UserScript==

// This code was writen by H.Mohamed and is owned by A.Ines Douaa 
// H.Mohamed instagram: https://www.instagram.com/h.mohamed.dev/
// A.Ines Douaa instagram: https://www.instagram.com/luuv.___.me.____/


(function () {
	"use strict";

	function qSelector(selector) {
		return document.querySelector(selector);
	}

	function isHidden(el) {
		return el.offsetParent === null;
	}

  // For reCaptcha

	var label = "#recaptcha-anchor-label";

	if (window.location.href.includes("")) {
		var labelInterval = setInterval(function () {
			if (!qSelector(label)) {
			} else if (!isHidden(qSelector(label))) {
				qSelector(label).innerText = "Do you support Palestine 🍉?";
			} else {
				return;
			}
		}, 500);
	}
	// For hCaptcha
	var hCaptchalabel = "#label";

	if (window.location.href.includes("checkbox")) {
		var hCaptchalabelInterval = setInterval(function () {
			if (!qSelector(hCaptchalabel)) {
			} else if (!isHidden(qSelector(hCaptchalabel))) {
				qSelector(hCaptchalabel).innerText = "Do you support Palestine 🍉?";
			} else {
				return;
			}
		}, 500);
	}
})();
