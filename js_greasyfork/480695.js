// ==UserScript==
// @name         Reddit Expand Everything Except Automod 🛡️
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  automatically collapses Automod but uncollapses all other comments (only old.reddit.com)
// @author       Agreasyforkuser
// @match        https://*.reddit.com/r/*/comments/*
// @icon         https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480695/Reddit%20Expand%20Everything%20Except%20Automod%20%F0%9F%9B%A1%EF%B8%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/480695/Reddit%20Expand%20Everything%20Except%20Automod%20%F0%9F%9B%A1%EF%B8%8F.meta.js
// ==/UserScript==

const undesirableModList = ['AutoModerator', 'example_name'];

function uncollapse() {
	document.querySelectorAll(".comment:not(.collapse-processed):not(.morechildren):not(.morerecursion)").forEach((e) => {
		e.classList.add("collapse-processed");
        const author = e.dataset.author;
		if (e.classList.contains("collapsed") && !undesirableModList.includes(author)) {
			e.querySelector(".tagline .expand").click();
		}
	});
}

const commentsObserver = new MutationObserver(() => uncollapse());
commentsObserver.observe(document.body, { childList: true, subtree: true });

(function() {
    
    let filterAllStickyComments = true; // set to false to only filter out usernames added to the undesirableModList
    let comments = document.querySelectorAll('.comment');

    for (const comment of comments) {
        const author = comment.dataset.author;
        const isStickied = comment.classList.contains('stickied');

        if (filterAllStickyComments && isStickied) {
            comment.classList.add('collapsed');
            comment.classList.remove('noncollapsed');
        } else if (undesirableModList.includes(author)) {
            comment.classList.add('collapsed');
            comment.classList.remove('noncollapsed');
        }
    }
})();

