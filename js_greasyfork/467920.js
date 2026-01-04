// ==UserScript==
// @name Twitch Hide Viewer Bots
// @description Hide bots from viewers list in Twitch (bot data from twitchinsights.net)
// @license MIT
// @author İsmail Karslı <cszn@pm.me> (https://ismail.karsli.net)
// @namespace https://github.com/ismailkarsli
// @homepageURL https://github.com/ismailkarsli/userscripts
// @supportURL https://github.com/ismailkarsli/userscripts/issues
// @version 1.0.0
// @match https://www.twitch.tv/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/467920/Twitch%20Hide%20Viewer%20Bots.user.js
// @updateURL https://update.greasyfork.org/scripts/467920/Twitch%20Hide%20Viewer%20Bots.meta.js
// ==/UserScript==

const bots = new Set();
const MutationObserver =
	window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
const observer = new MutationObserver((e) => {
	let chatters = document.querySelectorAll(".chatter-list-item");
	chatters.forEach((chatter) => {
		const username = chatter.querySelector("button.tw-link")?.innerText;
		const isBot = bots.has(username);
		if (isBot) {
			chatter.style.display = "none";
		}
	});
});

fetch("https://api.twitchinsights.net/v1/bots/online")
	.then((res) => res.json())
	.then((data) => {
		data?.bots?.forEach((bot) => bot?.[0] && bots.add(bot[0]));
		if (bots.size) {
			observer.observe(document.body, {
				childList: true,
				subtree: true,
			});
		}
	})
	.catch((error) => console.warn("Twitch Hide Viewer Bots", "Bot list couldn't fetched", error));
