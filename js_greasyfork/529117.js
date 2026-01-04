// ==UserScript==
//
// @name            Download alive 5-letter elements from Infinite Craft
// @namespace       roman.is-a.dev
//
// @match           https://neal.fun/infinite-craft/
//
// @version         1.0
// @author          GameRoMan
// @description     Download alive 5-letter elements from Infinite Craft Userscript
//
// @supportURL      https://roman.is-a.dev/discord
// @homepageURL     https://roman.is-a.dev/discord
//
// @license         MIT
//
// @downloadURL https://update.greasyfork.org/scripts/529117/Download%20alive%205-letter%20elements%20from%20Infinite%20Craft.user.js
// @updateURL https://update.greasyfork.org/scripts/529117/Download%20alive%205-letter%20elements%20from%20Infinite%20Craft.meta.js
// ==/UserScript==


(function() {
	'use strict';

	function getCurrentTimeFormatted() {
		const now = new Date();
		return `${String(now.getFullYear()).slice(2)}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;
	}

	function getElements() {
		const filteredElements = JSON.parse(localStorage.getItem('infinite-craft-data')).elements
			.map(e => e.text)
			.filter(e => /^[A-Z][a-z]{4}$/.test(e));

		const resultText = filteredElements.join('\n');
		const downloadLink = document.createElement('a');
		downloadLink.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(resultText);
		downloadLink.download = `alive-5-letter-elements-${getCurrentTimeFormatted()}.txt`;
		downloadLink.style.display = 'none';

		document.body.appendChild(downloadLink);
		downloadLink.click();
		document.body.removeChild(downloadLink);
	}

	function createPopup() {
		const popup = document.createElement('div');
		popup.style.position = 'fixed';
		popup.style.top = '0';
		popup.style.left = '0';
		popup.style.width = '100vw';
		popup.style.height = '100vh';
		popup.style.background = 'white';
		popup.style.color = 'black';
		popup.style.display = 'flex';
		popup.style.flexDirection = 'column';
		popup.style.alignItems = 'center';
		popup.style.justifyContent = 'center';
		popup.style.zIndex = '9999';

		const text = document.createElement('p');
		text.textContent = 'Download the file and then disable or delete the userscript';
		text.style.fontSize = '20px';
		text.style.marginBottom = '20px';

		const button = document.createElement('button');
		button.textContent = 'DOWNLOAD';
		button.style.padding = '10px 20px';
		button.style.fontSize = '18px';
		button.style.cursor = 'pointer';
		button.style.border = 'none';
		button.style.borderRadius = '5px';
		button.style.background = '#4CAF50';
		button.style.color = 'black';
		button.addEventListener('click', async () => {
			getElements();
			button.remove();
		});

		popup.appendChild(text);
		popup.appendChild(button);
		document.body.appendChild(popup);
	}

	window.addEventListener('load', createPopup);
})();
