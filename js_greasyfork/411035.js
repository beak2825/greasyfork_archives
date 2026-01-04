// ==UserScript==
// @name            YouTube Comment Blacklist
// @namespace       https://github.com/NatoBoram/youtube-comment-blacklist
// @version         0.0.7
// @license         GPL-3.0-or-later
// @description     Removes unoriginal YouTube comments.
// @author          NatoBoram
// @supportURL      https://github.com/NatoBoram/youtube-comment-blacklist/issues
// @contributionURL https://paypal.me/NatoBoram/5
// @include         https://www.youtube.com/watch*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/411035/YouTube%20Comment%20Blacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/411035/YouTube%20Comment%20Blacklist.meta.js
// ==/UserScript==

(() => {
	"use strict";

	/** Remove the whole thread, including replies. */
	const removeThread = true;

	/** Turn this on if you want to see which comment has been removed in the console. */
	const debug = false;

	const bannedWords = [
		"always has been",
		"anyone ?",
		"anyone?",
		"can't hurt you",
		"for the likes",
		"funniest shit i've ever seen",
		"he turned himself into a",
		"i felt that",
		"let's be honest",
		"let that sink in",
		"liker",
		"modern problems",
		"no likes",
		"nobody's going to mention",
		"of likes",
		"require modern solutions",
		"speaking the language of gods",
		"this blew up",
		"this comment blew up",
		"tik tok",
		"tiktok",
		"underrated comment",
		"watching this in",
	];

	const bannedRegexes = [
		/\d.? (likes|views)/i, // 3k likes / views
		/\n\n\n/, // More than 2 newlines
		/^(@(\w\s?)+\s)?\d+\s(minute|hour|day|week|year)s?\sago$/i, // 1 week ago
		/^(\w ?)+:(\n| )/im, // someone:
		/^\d+% (\w ?)+\n/im, // 3% useful
		/simp\b/i, // Simp
	];

	// Wait for the comment section to load.
	const interval = setInterval(() => {
		const comments = document.querySelector("ytd-comments");
		if (!comments) { return; }
		clearInterval(interval);

		new MutationObserver(() => {
			comments.querySelectorAll("ytd-comment-thread-renderer").forEach(thread => {
				thread.querySelectorAll("ytd-comment-renderer").forEach(comment => {
					const textContent = comment.querySelector("ytd-expander yt-formatted-string#content-text").textContent
						.toLowerCase()
						.replace("’", "'");

					const found = bannedWords.find(word =>
						textContent.includes(word)) || bannedRegexes.find(regex => textContent.match(regex)
					);

					if (found) {
						if (debug) console.log(`Removing "${found}" : ${textContent}`);

						if (removeThread && comment.parentNode === thread) return thread.remove();
						else return comment.remove();
					}
				});
			});
		}).observe(comments, { childList: true, subtree: true });
	}, 1000);

})();
