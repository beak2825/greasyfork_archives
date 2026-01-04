// ==UserScript==
// @name         Attacking Fakie
// @namespace    dev.kwack.torn.attacking-fakie
// @version      1.0.0
// @description  Inverts the attacking layout horizontally, placing buttons on the right side of the screen
// @author       Kwack [2190604]
// @match        https://www.torn.com/loader.php
// @run-at 		 document-end
// @downloadURL https://update.greasyfork.org/scripts/496138/Attacking%20Fakie.user.js
// @updateURL https://update.greasyfork.org/scripts/496138/Attacking%20Fakie.meta.js
// ==/UserScript==
if (new URL(document.location).searchParams.get("sid") !== "attack") return; // Only trigger on the attack page
(() => {
	"use strict";
	waitForElement("#attacker > div[class*=playerArea_]").then((element) => {
		element.css("flex-direction", "row-reverse");
	});

	function waitForElement(selector) {
		return new Promise((res) => {
			const getElement = () => {
				const element = $(selector);
				if (element.length) {
					res(element);
				} else {
					setTimeout(getElement, 100);
				}
			}
			getElement();
		})
	}
})();