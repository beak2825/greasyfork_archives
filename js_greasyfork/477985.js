// ==UserScript==
// @name         YouTube URL Commands
// @namespace    https://greasyfork.org/users/1201646
// @version      1.0
// @description  Change video URL to a standard YouTube video, short, or YouTube Music websites.
// @author       lemocha
// @match        https://www.youtube.com/*
// @match        https://music.youtube.com/*
// @match        https://www.youtube-nocookie.com/embed/*
// @icon         https://icons.duckduckgo.com/ip2/youtube.com.ico
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477985/YouTube%20URL%20Commands.user.js
// @updateURL https://update.greasyfork.org/scripts/477985/YouTube%20URL%20Commands.meta.js
// ==/UserScript==


(() =>
{
	"use strict";
	let channel = false;

	// register menu commands
	GM_registerMenuCommand("YouTube", () => reassignURL("youtube", "/watch?v=", true));
	GM_registerMenuCommand("Shorts", () => reassignURL("youtube", "/shorts/"));
	GM_registerMenuCommand("YouTube Music", () => reassignURL("music.youtube", "/watch?v=", true));

	function reassignURL(url, path, channelCheck)
	{
		const id = getID();
		if (id === undefined) { return; }

		// if viewing a youtube channel
		if (channelCheck && channel)
		{
			// format as channel URL
			path = "/channel/";
		}

		// redirect to new URL
		window.location.assign(`https://${url}.com${path}${id}`);
	}

	function getID()
	{
		// get subpage and URL data after it (e.g. /watch/, /shorts/, /channel/, etc.)
		const path = window.location.pathname;
		channel = path.includes("/channel/");


		// if video is embeded on a website
		if (window.location.hostname === "www.youtube-nocookie.com")
		{
			// trim and return video ID
			return path.split("/embed/")[1];
		}
		// if video is youtube short
		else if (path.includes("/shorts/"))
		{
			// trim and return video ID
			return path.split("/shorts/")[1];
		}
		// if channel is currently being viewed
		else if (channel)
		{
			// trim and return channel ID
			return path.split("/channel/")[1];
		}
		else
		{
			// remove from playlist, trim and return video ID
			// window.location.search is section after "watch?" in URL
			return window.location.search.split("?v=")[1].split("&list=")[0];
		}
	}
})();