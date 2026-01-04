// ==UserScript==
// @name        ChatGPT remove start notification
// @namespace   ChatGPT
// @match       https://chat.openai.com/
// @icon        https://chat.openai.com/apple-touch-icon.png
// @grant       none
// @version     1.1
// @author      ccuser44
// @license     CC0
// @description This script removes the ChatGPT start notification
// @downloadURL https://update.greasyfork.org/scripts/468508/ChatGPT%20remove%20start%20notification.user.js
// @updateURL https://update.greasyfork.org/scripts/468508/ChatGPT%20remove%20start%20notification.meta.js
// ==/UserScript==

/*
To the extent possible under law, the author(s) have dedicated all copyright and related and neighboring rights to this software to the public domain worldwide.
This software is distributed without any warranty.
You should have received a copy of the CC0 Public Domain Dedication along with this software. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
*/

var debounce = false;

function clickButton() {
	var foundMain = false;
	for (const button of document.getElementsByClassName("btn relative btn-primary")) {
		if (button.firstElementChild.textContent == "Okay, let’s go") {
			foundMain = true;
			button.click();
		};
	};
};

function onLoad() {
	console.log(debounce);
	if (!debounce) {
		debounce = true;
		clickButton();
		setTimeout(clickButton, 100);
		for (var i = 1; i <= 6; i++) {
			setTimeout(clickButton, i * 500);
		};
	};
};

if (document.readyState == "complete") {
	setTimeout(onLoad, 1500);
} else {
	window.addEventListener("load", function() {
		setTimeout(onLoad, 1500);
	}, "once");
};