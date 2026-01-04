// ==UserScript==
// @name        Vim keybindings
// @namespace   Violentmonkey Scripts
// @match       https://www.tiktok.com/*
// @grant       none
// @version     1.1
// @author      Tom van Dijk
// @description You don't need to reach your hand over to the arrowkeys anymore
// @license GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/441765/Vim%20keybindings.user.js
// @updateURL https://update.greasyfork.org/scripts/441765/Vim%20keybindings.meta.js
// ==/UserScript==
function handler(e) {
  if (!(document.activeElement.contentEditable === 'true')) {
    switch (e.keyCode) {
		case 74:
			document.body.dispatchEvent(
				new KeyboardEvent(
					"keydown",
					{
						keyCode: 40,
						target: document.body,
						key: "ArrowDown",
						code: "ArrowDown",
						bubbles: true,
						cancelable: true,
					}
				)
			);
			break;
		case 75:
			document.body.dispatchEvent(
				new KeyboardEvent(
					"keydown",
					{
						keyCode: 38,
						target: document.body,
						key: "ArrowUp",
						code: "ArrowUp",
						bubbles: true,
						cancelable: true,
					}
				)
			);
			break;
		default:
			break;
	}
  }
}
document.addEventListener("keydown", handler, false);