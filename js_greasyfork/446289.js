// ==UserScript==
// @name        download profile pic - vsco.co
// @namespace   Violentmonkey Scripts
// @match       *://vsco.co/*
// @grant       none
// @version     1.3.1
// @author      Edgeburn Media
// @description Download profile pic from vsco.co
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/446289/download%20profile%20pic%20-%20vscoco.user.js
// @updateURL https://update.greasyfork.org/scripts/446289/download%20profile%20pic%20-%20vscoco.meta.js
// ==/UserScript==

function setUpDownloadButton(img) {
	let src = img.src;
	// create a button that will download the image
	let button = document.createElement("button");
	// set the text of the button
	button.innerHTML = "\u2193 Download Profile Pic";
	button.classList.add("nav__logo-items");
	// set the onclick attribute of the button to a function
	button.onclick = function () {
		// store the src in a variable
		let u = src;
		// replace the size=120 in the url with size=960
		u = u.replace("size=120", "size=960");
		// open u in a new tab
		window.open(u);
	};
	img.parentElement.addEventListener("click", function () {
		let u = src;
		u = u.replace("size=120", "size=960");
		window.open(u);
	});
	// append the button to the div
	if (!document.querySelector(".touch")) {
		document.querySelector(".nav__logo-items").appendChild(button);
	}
	button.style.cssText = "width:200px;height:50px;background-color:green;";
}

window.addEventListener(
	"load",
	function () {
		let img = document.querySelector(".css-x3m333");
		setUpDownloadButton(img);
	},
	false
);