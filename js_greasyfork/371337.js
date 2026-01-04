// ==UserScript==
// @name         Twitch - Redirect Live Videos to Popout Player Version
// @namespace    TwitchLiveVidPopoutPlayerRedirect
// @description  Redirect Twitch broadcasts to the minimal popout player version
// @version      1.3
// @author       Kai Krause <kaikrause95@gmail.com>
// @match        http://*.twitch.tv/*
// @match        https://*.twitch.tv/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/371337/Twitch%20-%20Redirect%20Live%20Videos%20to%20Popout%20Player%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/371337/Twitch%20-%20Redirect%20Live%20Videos%20to%20Popout%20Player%20Version.meta.js
// ==/UserScript==

setInterval(() => {
	// check whether the page has text reading that the channel is "live"
	let pageUrl = window.location.href;
	if (pageUrl.match(/\.tv\/[A-Za-z0-9]/gmi) === null) return;

	let isLive = false;
	let p = document.getElementsByTagName("p");
	for (let i = 0; i < p.length; i++) {
		if (p[i].textContent.toLowerCase() === "live") {
			isLive = true;
			break;
		}
	}
	if (!isLive) return;

	// check whether the video player's controls are visible
	let isPlayerVisible = false;
	let divs = document.getElementsByTagName("div");
	for (let i = 0; i < divs.length; i++) {
		if (divs[i].getAttribute("data-a-target") === "player-controls") {
			isPlayerVisible = true;
			break;
		}
	}
	if (!isPlayerVisible) return;

	let videoPath = window.location.pathname;
	if (videoPath.endsWith("/")) videoPath = videoPath.slice(0, -1);

	// only continue if channel name, and not twitch.tv/channelName/otherPage
	let backslashCount = videoPath.match(/[/]/gm);
	if (backslashCount.length > 1) return

	// redirect
	let popoutUrl = "https://player.twitch.tv/?parent=twitch.tv&player=popout&channel=" + videoPath.substr(1);
	window.location.replace(popoutUrl);
}, 3000);
