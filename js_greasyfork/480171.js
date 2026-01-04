// ==UserScript==
// @name        Transform Url
// @namespace   Violentmonkey Scripts
// @match       *://teradood.hunternblz.com/*
// @version     2.5
// @author      Me
// @description Menambahkan tombol copy ke clipboard direct url
// @grant       GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480171/Transform%20Url.user.js
// @updateURL https://update.greasyfork.org/scripts/480171/Transform%20Url.meta.js
// ==/UserScript==
(() => {
	const targetElement = document.querySelector(".text-center.mt-1");
	const button = document.createElement("button");
	button.type = "button";
	button.classList.add("btn", "btn-danger", "ms-3"); // Use classList for better maintainability
	button.textContent = "Clipboard";

	targetElement.appendChild(button);
	button.addEventListener("click", () => {
		transformAndCopyURL();
	});
	const transformAndCopyURL = () => {
		const url = document.querySelector("#result b").textContent;

		const regexPattern =
			/https:\/\/www\.teraboxapp\.com\/sharing\/link\?surl=([^&]+)/;

		const match = url.match(regexPattern);

		const newUrl = `https://teraboxapp.com/s/1${match[1]}`;

		GM_setClipboard(newUrl);
	};
})();
