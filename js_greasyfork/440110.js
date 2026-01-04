// ==UserScript==
// @name         Discord Embed Right Click Enabler
// @namespace    https://greasyfork.org
// @version      1.3.7
// @description  Re-enables right click on image and video embeds in Discord, since the new custom context menu update.
// @author       ScocksBox
// @icon         https://i.imgur.com/ZOKp8LH.png
// @include      https://discord.com/*
// @license      MIT
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440110/Discord%20Embed%20Right%20Click%20Enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/440110/Discord%20Embed%20Right%20Click%20Enabler.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

const selectors = [
	".message__5126c img:not(.avatar_c19a55):not(.replyAvatar_c19a55):not(.emoji)", // image embeds
	".message__5126c video", // video embeds
	".message__5126c .anchor_edefb8", // links in message, including buttons
	//".message_d5deea .messageAttachment__5dae1 a", // download buttons and file links
  //".message__80c10 .attachmentLink", // externally linked attachments
	".message__02a39 img:not(.avatar_c19a55):not(.replyAvatar_c19a55):not(.emoji)", // images embeds in search
	".message__02a39 video", // video embeds in search
	".message__02a39 .anchor_edefb8", // links in search, including buttons
	//".message__7e601 .messageAttachment__5dae1 a", // download buttons and file links in search
  //".message_d8db25 .attachmentLink", // externally linked attachments in search
	".originalLink_af017a" // image embed links
];
const selectorStr = selectors.join(", ");

var callback = function (mutationsList, observer) {
	for (const mutation of mutationsList) {
		for (const added of mutation.addedNodes) {
			if (added.nodeType !== Node.ELEMENT_NODE) {
				continue;
			}

			if (added.matches(selectorStr)) {
				added.addEventListener('contextmenu', function(event) {
					event.stopImmediatePropagation();
				}, true);
			}

			const elements = added.querySelectorAll(selectorStr);
			for (let i = 0; i < elements.length; i++) {
				let el = elements[i];
				el.addEventListener('contextmenu', function(event) {
					event.stopImmediatePropagation();
				}, true);
			}
		}
	}
};

const observer = new MutationObserver(callback);
observer.observe(document.body, { childList: true, subtree: true });
