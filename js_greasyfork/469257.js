// ==UserScript==
// @name Hide New Twitch Features
// @namespace lig
// @license WTFPL
// @description Hide Hyperchat button/pins and content warnings and click through content prompts
// @version 1.0.1
// @match https://www.twitch.tv/*
// @run-at document-start
// @grant GM.info
// @downloadURL https://update.greasyfork.org/scripts/469257/Hide%20New%20Twitch%20Features.user.js
// @updateURL https://update.greasyfork.org/scripts/469257/Hide%20New%20Twitch%20Features.meta.js
// ==/UserScript==

const delay = ms => new Promise(res => setTimeout(res, ms));

(async () => {
	let style = document.createElement('style');
	style.innerHTML = `
/* hide content warnings */
#channel-player-disclosures,
/* hide pinned hyperchats at the top of chat */
.paid-pinned-chat-message-list,
/* hide hyperchat button in the message input box */
div:has(> [aria-label="Hype Chat"]) {
	display: none !important;
}
`;

	while(document.head === null) {
		await delay(100);
	}
	document.head.appendChild(style);
	
	do {
	let contentPrompt = document.querySelector('[data-a-target="content-classification-gate-overlay-start-watching-button"]');
		if(contentPrompt) contentPrompt.click();
		await delay(500);
	} while(1);
})();