// ==UserScript==
// @name			ChatGPT PromptStudio
// @author			Tosox
// @namespace		https://github.com/Tosox
// @homepage		https://github.com/Tosox/ChatGPT-PromptStudio
// @supportURL		https://github.com/Tosox/ChatGPT-PromptStudio/issues
// @icon			https://github.com/Tosox/ChatGPT-PromptStudio/blob/master/assets/icon.png?raw=true
// @description		A prompt injection tool for ChatGPT - designed for creative writing, storytelling and advanced prompt engineering
// @version			1.0.0
// @license			MIT
// @copyright		Copyright (c) 2025 Tosox
// @match			https://chatgpt.com/*
// @grant			GM_notification
// @grant			GM_addStyle
// @grant			GM_setValue
// @grant			GM_getValue
// @grant			GM_xmlhttpRequest
// @connect			gist.githubusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/532849/ChatGPT%20PromptStudio.user.js
// @updateURL https://update.greasyfork.org/scripts/532849/ChatGPT%20PromptStudio.meta.js
// ==/UserScript==

GM_addStyle(`
	.zoom-effect {
		animation: zoomInOut 0.3s ease-in-out;
	}

	@keyframes zoomInOut {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(0.8);
		}
		100% {
			transform: scale(1);
		}
	}
`);

function getPromptFromUrl(url) {
	return new Promise((resolve, reject) => {
		GM_xmlhttpRequest({
			method: 'GET',
			url: url,
			onload: function(response) {
				if (response.status === 200) {
					resolve(response.responseText);
				} else {
					reject(new Error(`Failed to load prompt. Status: ${response.status}`));
				}
			},
			onerror: function(err) {
		  		reject(err);
			}
		});
	});
}

(async function() {
	'use strict';

	const RAW_PROMPT_URL = 'https://gist.githubusercontent.com/Tosox/1b0707279dcf49ca2a297100a04e6f50/raw/prompt.txt';
	const ICON_URL = 'https://github.com/Tosox/ChatGPT-PromptStudio/blob/master/assets/icon.png?raw=true';
	const CACHE_KEY = 'promptstudio_prompt';
	const CACHE_TIMESTAMP_KEY = 'promptstudio_prompt_timestamp';
	const FETCH_DELAY = 7200000; // 2h


	const now = Date.now();
	let prompt = await GM_getValue(CACHE_KEY, '');
	let lastFetch = await GM_getValue(CACHE_TIMESTAMP_KEY, 0);

	if ((!prompt) || (now - lastFetch > FETCH_DELAY)) {
		try {
			prompt = await getPromptFromUrl(RAW_PROMPT_URL);
			await GM_setValue(CACHE_KEY, prompt);
			await GM_setValue(CACHE_TIMESTAMP_KEY, now);
		} catch (e) {
			console.error('Failed to fetch prompt:', e);
			GM_notification({
				text: 'Failed to load prompt from url',
				timeout: 3000
			});
			return;
		}
	}

	var button = document.createElement('button');

	button.style.position = 'fixed';
	button.style.bottom = '50px';
	button.style.right = '50px';
	button.style.width = '40px';
	button.style.height = '40px';
	button.style.borderRadius = '5px';
	button.style.backgroundColor = 'black';
	button.style.boxShadow = '0 0 17px 5px rgba(255, 0, 0, 0.8)';
	button.style.border = 'none';
	button.style.cursor = 'pointer';

	var image = document.createElement('img');
	image.src = ICON_URL;
	button.appendChild(image);

	button.addEventListener('click', function() {
		var textarea = document.querySelector('#prompt-textarea p');
		var content = textarea?.innerText?.trim();

		if ((!content) || (content === '')) {
			GM_notification({
				text: 'Please ensure to enter a prompt before clicking the button.',
				timeout: 3000
			});
			return;
		}

		if (content.includes(prompt)) {
			return;
		}

		textarea.innerText = `${prompt} ${content}`;

		setTimeout(() => {
			textarea.dispatchEvent(new KeyboardEvent('keydown', {
				key: 'Enter',
				code: 'Enter',
				keyCode: 13,
				which: 13,
				bubbles: true,
				cancelable: true
			}));
		}, 100);

		button.classList.add('zoom-effect');
		setTimeout(() => button.classList.remove('zoom-effect'), 1000);
	});

	document.body.appendChild(button);
})();
