// ==UserScript==
// @name         multitwitch.tv move chatroom to left
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  將預設右邊的聊天室移到左邊
// @author       Achie Shen
// @match        https://*.multitwitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=multitwitch.tv
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484997/multitwitchtv%20move%20chatroom%20to%20left.user.js
// @updateURL https://update.greasyfork.org/scripts/484997/multitwitchtv%20move%20chatroom%20to%20left.meta.js
// ==/UserScript==

(function() {
	'use strict';

	let chatboxElement = document.getElementById("chatbox");
	let streamsElement = document.getElementById("streams");
	streamsElement.parentNode.insertBefore(chatboxElement, streamsElement);
	chatboxElement.style.cssFloat = "left";
	chatboxElement.style.marginLeft = "0px";
})();
