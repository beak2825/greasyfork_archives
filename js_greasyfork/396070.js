// ==UserScript==
// @name         Remove Emote Sidebar
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes the new emote bar on the right of messages that was added on 2/3/20.
// @author       eM-Krow/Stop! You violated the law!
// @match        https://discordapp.com/channels/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396070/Remove%20Emote%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/396070/Remove%20Emote%20Sidebar.meta.js
// ==/UserScript==

const channelNode = document.getElementsByClassName("chat-3bRxxu")[0];
const serverNode = document.getElementsByClassName("content-98HsJk")[0];
const config = {attributes: true, childList: true, subtree: true};
const callback = (mutationsList, observer) => {
	for (let mutation of mutationsList) {
		if (mutation.type === "childList") {
			$(".buttonContainer-DHceWr").remove();
		} else if (mutation.type === "attributes") {
			$(".buttonContainer-DHceWr").remove();
		}
	}
};
const channelObserver = new MutationObserver(callback);
const serverObserver = new MutationObserver(callback);
setTimeout(channelObserver.observe(channelNode, config), 1000);
setTimeout(serverObserver.observe(serverNode, config), 1000);