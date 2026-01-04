// ==UserScript==
// @name         Twitch - Redirect Videos (VoDs) to Popout Player Version
// @namespace    TwitchVoDPopoutPlayerRedirect
// @description  Save CPU usage by redirecting Twitch Videos (VoDs) to popout player version
// @version      1.2
// @author       Kai Krause <kaikrause95@gmail.com>
// @match        http://*.twitch.tv/*
// @match        https://*.twitch.tv/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/371309/Twitch%20-%20Redirect%20Videos%20%28VoDs%29%20to%20Popout%20Player%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/371309/Twitch%20-%20Redirect%20Videos%20%28VoDs%29%20to%20Popout%20Player%20Version.meta.js
// ==/UserScript==

function redirect() {
	if (!window.location.href.includes("twitch.tv/videos/")) return
	setTimeout(() => {
		var videoPath = window.location.href;
		var video = /(?:[videos/])(\d+)(?:\?|)/g.exec(videoPath);
		if (video[1]) video = video[1];
		else video = video[0];
		video = video.replace("?", "");
		var popoutUrl = "https://player.twitch.tv/?parent=twitch.tv&player=popout&video=" + video;
		var timeStamp = videoPath.match(/(?:t=)(\d.+(?:\d[A-Za-z]{1}))/g);
		if (timeStamp) {
			timeStamp = timeStamp[0].replace("t=", "");
			popoutUrl += "&t=" + timeStamp;
		}
		window.location.replace(popoutUrl);
	}, 1200);
}
redirect();

// dynamic pages
window.addEventListener("click", redirect, false);