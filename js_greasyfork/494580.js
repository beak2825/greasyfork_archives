// ==UserScript==
// @name         Cuddly Octopus Mix n Match Preview
// @namespace    http://tampermonkey.net/
// @version      2024-05-10
// @description  Uses the Actual item Mix and Match previews in the Cuddly Octopus Cart instead of the generic Mix n Match preview
// @author       Midokuni
// @match        https://cuddlyoctopus.com/cart/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cuddlyoctopus.com
// @license MITs
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494580/Cuddly%20Octopus%20Mix%20n%20Match%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/494580/Cuddly%20Octopus%20Mix%20n%20Match%20Preview.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
    'use strict';
	const mixmatches = document.querySelectorAll("tr.wc-block-cart-items__row:has(li.wc-block-components-product-details__side-1)")
	for (const item of mixmatches) {
		const side1 = item.querySelector("li.wc-block-components-product-details__side-1 .wc-block-components-product-details__value" ).innerText;
		const side2 = item.querySelector("li.wc-block-components-product-details__side-2 .wc-block-components-product-details__value" ).innerText;
		const side1Div = document.createElement("div");
		const side2Div = document.createElement("div");
		side1Div.style = "width: 50%;";
		side2Div.style = "width: 50%; float: right;";
		const side1Img = document.createElement("img");
		side1Img.class = "mix-a";
		side1Img.src = "https://cuddlyoctopus.com/wp-content/uploads/daki-thumbnails/"+side1+".jpg";
		side1Div.appendChild(side1Img)

		const side2Img = document.createElement("img");
		side2Img.class = "mix-a";
		side2Img.src = "https://cuddlyoctopus.com/wp-content/uploads/daki-thumbnails/"+side2+".jpg";
		side2Div.appendChild(side2Img)

		const img = item.querySelector(".wc-block-cart-item__image");
		img.innerHTML = "";
		img.appendChild(side2Div);
		img.appendChild(side1Div);
	}
}, false);
