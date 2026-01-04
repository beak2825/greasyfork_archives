// ==UserScript==
// @name         Close Mature alert
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Dlive.tv auto close Mature alert dialog
// @author       dotladcop
// @match        https://dlive.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dlive.tv
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531325/Close%20Mature%20alert.user.js
// @updateURL https://update.greasyfork.org/scripts/531325/Close%20Mature%20alert.meta.js
// ==/UserScript==
setInterval(DliveTimer, 600);

function DliveTimer() {
	const rect = document.getElementsByClassName("agree")[0].getBoundingClientRect();
	const isVisible = rect.width > 0 && rect.height > 0;
	if (isVisible) {
		document.getElementsByClassName("v-input--selection-controls__ripple")[0].click();
		document.getElementsByClassName("v-input--selection-controls__ripple")[1].click();
		document.getElementsByClassName("agree")[0].click();
	}
}