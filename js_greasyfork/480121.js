// ==UserScript==
// @name				YouTube Url Copy
// @namespace	 https://x.com/Shion_BFV
// @include		 https://www.youtube.com/watch*
// @grant			 GM_setClipboard
// @version		 1.0
// @author			Hinata
// @description 2023/11/17 21:04:33
// @license		 WTFPL
// @downloadURL https://update.greasyfork.org/scripts/480121/YouTube%20Url%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/480121/YouTube%20Url%20Copy.meta.js
// ==/UserScript==

(function() {
	function copyToClipboard(text) {
		var dummyElement = document.createElement("textarea");
		document.body.appendChild(dummyElement);
		dummyElement.value = text;
		dummyElement.select();
		document.execCommand("copy");
		document.body.removeChild(dummyElement);
	}

	function setToClipboard(text) {
		if (typeof GM_setClipboard != 'function') {
			console.log("GM_setClipboard not support");
			copyToClipboard(text);
		} else {
			GM_setClipboard(text, "text");
		}
	}

	async function main() {
		var button = document.querySelector(".url-copy-button");
		button.disabled = true;
		button.style.cursor = "wait";

		var currentUrl = window.location.href;
		console.log(currentUrl);
		if (currentUrl.includes("?si=")) {
			currentUrl = currentUrl.substring(0, currentUrl.indexOf("?si"));
		}
		if (currentUrl.includes("&")) {
			currentUrl = currentUrl.substring(0, currentUrl.indexOf("&"));
		}
		console.log(currentUrl);
		currentUrl = currentUrl.replaceAll("https://www.youtube.com/watch?v=", "https://youtu.be/");
		setToClipboard(currentUrl);
		console.log(currentUrl);
		button.disabled = false;
		button.style.cursor = "default";
		button.innerText = "Copied!";
	}
	function addButton() {
		const button = document.createElement("button");
		button.innerText = " ";
		button.classList.add("url-copy-button");
		button.style.background = "#ffd000";
		button.style.color = '#000000';
		button.style.borderRadius = '10px';
		button.style.padding = '30px 15px';
		button.style.border = 'none';
		button.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
		button.style.cursor = 'pointer';
		button.style.position = 'fixed';
		button.style.bottom = '200px';
		button.style.right = '-10px';
		button.style.zIndex = '1000';
		button.addEventListener('mouseover', () => {
			button.style.background = '#ffe366';
		button.innerText = "動画のurlをコピー";
		button.style.right = '0px';
			button.style.padding = '20px 15px';
			button.style.cursor = 'pointer';
		});
		button.addEventListener('mouseout', () => {
			button.style.background = '#ffd000';
		button.innerText = " ";
		button.style.right = '-10px';
			button.style.padding = '30px 15px';
		button.style.cursor = "default";
		});
		button.onclick = main;
		document.body.appendChild(button);
	}
	addButton();

})();