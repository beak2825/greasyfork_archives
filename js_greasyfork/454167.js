// ==UserScript==
// @name            YouTube Comments Must Contain Timestamps
// @namespace       SomeYoutubeFan
// @version         0.0.3
// @description     Removes all comments except those containing timestamps. Displays the final non-timestamp comment when finished. Derived from https://github.com/NatoBoram/youtube-comment-blacklist
// @author          Some youtube fan
// @license MIT
// @match           https://www.youtube.com/watch*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/454167/YouTube%20Comments%20Must%20Contain%20Timestamps.user.js
// @updateURL https://update.greasyfork.org/scripts/454167/YouTube%20Comments%20Must%20Contain%20Timestamps.meta.js
// ==/UserScript==

(() => {
	"use strict";

	const requiredRegexes = [
        /\d.:\d./i,
	];

    // console.log("Youtube comments must contain timestamps!");

	// Wait for the comment section to load.
	const interval = setInterval(() => {
		const comments = document.querySelector("ytd-comments");
		if (!comments) { return; }
		clearInterval(interval);

		new MutationObserver(() => {
            var foundSomething = false;
            var thingToDelete = null;
            var foundAnything = false;
			comments.querySelectorAll("ytd-comment-thread-renderer, ytd-continuation-item-renderer").forEach(thread => {
                if(thingToDelete) {
                    thingToDelete.remove();
                    thingToDelete = null;
                }
                foundSomething = false;
				thread.querySelectorAll("ytd-comment-renderer, ytd-comment-view-model").forEach(comment => {
                    var attrString = comment.querySelector("ytd-expander yt-attributed-string#content-text, ytd-expander yt-formatted-string#content-text");
					const textContent = attrString.textContent
						.toLowerCase()
						.replace("’", "'");
                    foundAnything = true;

					const found = requiredRegexes.find(regex => textContent.match(regex));
                    if(found) foundSomething = true;
				});
                if(thread.querySelectorAll("tp-yt-paper-spinner")) {
                    // If it's just a spinner, that also counts as something to delete. Otherwise we get lots of spinners for some reason.
                    foundAnything = true;
                }
                // Always leave the last comment / spinner so that more will load
                if(!foundSomething && foundAnything) {
                    thingToDelete = thread;
                }
			});
		}).observe(comments, { childList: true, subtree: true });
	}, 1000);

})();