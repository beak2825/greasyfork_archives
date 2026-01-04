// ==UserScript==
// @name        IGGGAMES - Show Modified Time for Posts
// @description So you can tell if something is really updated. Also for PCGamesTorrents. Also trims post title and description.
// @namespace   RainSlide
// @author      RainSlide
// @license     AGPL-3.0-or-later
// @version     1.2
// @icon        https://igg-games.com/favicon.ico
// @match       https://igg-games.com/*
// @match       https://pcgamestorrents.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/425831/IGGGAMES%20-%20Show%20Modified%20Time%20for%20Posts.user.js
// @updateURL https://update.greasyfork.org/scripts/425831/IGGGAMES%20-%20Show%20Modified%20Time%20for%20Posts.meta.js
// ==/UserScript==

"use strict";

const posts = document.querySelectorAll('article.post[typeof="Article"]');

// Show modified time
posts.forEach(post => {

	const modMeta = post.querySelector(':scope meta[property="dateModified"][content]');
	const pubTime = post.querySelector(':scope time');

	if (modMeta !== null && pubTime !== null) {

		const dateTime = modMeta.content;
		const modDate = new Date(dateTime);

		// if modDate is not Invalid Date
		// modDate.toString() !== "Invalid Date"
		if (!Number.isNaN(modDate.getTime())) {
			const $ = tagName => document.createElement(tagName);
			const textContent = modDate.toLocaleDateString("en-US", { dateStyle: "long" });
			const modTime = Object.assign($("time"), { dateTime, textContent });
			pubTime.before($("br"), "Published ");
			pubTime.after(" | Modified ", modTime, $("br"));
		}

	}

});

// Trim title and description
const titleSelector = '.uk-article-title' + (posts.length > 1 ? ' > a:only-child' : '');
const  descSelector = '.uk-article-meta + div[property="text"] > p:first-child';

// trimTitle(post)
// just for igg-games.com, pcgamestorrents.com's titles are fine
const trimTitle = post => {
	const title = post.querySelector(':scope ' + titleSelector);
	if (title !== null && title.textContent.endsWith(" Free Download")) {
		title.textContent = title.textContent.replace(/ Free Download$/, "");
	}
	return title.textContent; // for trimDesc() of igg-games.com
}

// trimDesc(post, text)
const trimDesc = (post, text) => {
	const desc = post.querySelector(':scope ' + descSelector);
	if (desc !== null && desc.textContent.includes(text)) {
		desc.textContent = desc.textContent.replace(text, "");
	}
};

switch (location.hostname) {
	case "igg-games.com":
		posts.forEach(post => {
			const gameName = trimTitle(post);
			trimDesc(post, gameName + " Free Download PC Game Cracked in Direct Link and Torrent. ");
		});
		break;
	case "pcgamestorrents.com":
		posts.forEach(post => trimDesc(post, "TORRENT – FREE DOWNLOAD – CRACKED "));
		break;
}
