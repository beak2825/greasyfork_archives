// ==UserScript==
// @namespace   raina
// @name        OurGroceries Double Vision
// @version     1
// @description Display two lists side by side
// @grant       none
// @include     https://www.ourgroceries.com/your-lists*
// @downloadURL https://update.greasyfork.org/scripts/27027/OurGroceries%20Double%20Vision.user.js
// @updateURL https://update.greasyfork.org/scripts/27027/OurGroceries%20Double%20Vision.meta.js
// ==/UserScript==
(function () {
	"use strict";
	let main = document.querySelector(".main-frame");
	let lists = document.querySelector("#your-lists");
	if (window.self === window.top) {
		if (window.innerWidth > lists.offsetWidth) {
			let originalWidth = lists.offsetWidth;
			let newWidth = ~~(window.innerWidth * .8);
			if (newWidth > 1052) {
				newWidth = 1052;
			}
			let negativeMargin = -1 * (newWidth - lists.offsetWidth) / 2;
			lists.style.width = newWidth + "px";
			lists.style.marginLeft = negativeMargin + "px";
		}
		let frameA = document.createElement("iframe");
		frameA.src = window.location.ref;
		frameA.style =  `
			opacity: 1;
			background: #fff;
			border: none;
			width: 50%;
			height: 1000px;
		`;
		let frameB = frameA.cloneNode();
		lists.textContent = "";
		lists.appendChild(frameA);
		lists.appendChild(frameB);
	} else {
		document.body.appendChild(lists);
		main.remove();
	}
}());
