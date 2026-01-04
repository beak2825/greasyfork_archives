// ==UserScript==
// @name         Toxic Dialog Annotation Helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds keyboard shortcuts.
// @author       lucassilvas1
// @match        http*://www.mturkcontent.com/dynamic/hit*
// @grant        none
// jshint		 esversion: 6
// @downloadURL https://update.greasyfork.org/scripts/437051/Toxic%20Dialog%20Annotation%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/437051/Toxic%20Dialog%20Annotation%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (document.getElementById("nontoxic")) {
		document.querySelector(".data-agreement").checked = true;
		location.href = "javascript:void(agree_and_continue());";
		location.href = "javascript:void(close_guide());";

		const type = document.querySelector(".toxicity-choices").querySelectorAll("input");
		type[4].click();
		const target = document.querySelector(".target-choices").querySelectorAll("input");
		const nextBtn = document.getElementById("button-next");
		const prevBtn = document.getElementById("button-prev");
		const submitBtn = document.getElementById("button-submit");

		document.addEventListener("keyup", e => {
			const code = e.keyCode;
			if (code > 96 && code < 102) type[code - 97].click();
			else if (code > 48 && code < 52) target[code - 49].click();
			else if (code === 13) {
				if (nextBtn.disabled) {
					submitBtn.click();
				} else {
					nextBtn.click();
					type[4].click();
				}
			} else if (code === 110) prevBtn.click();
		});
	}
})();