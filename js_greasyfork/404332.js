// ==UserScript==
// @name        Reddit Highlight Posts Based on Scores
// @namespace   metapone
// @version     0.1.1
// @description Highligh posts above a certain score
// @author      metapone
// @license     GPL-2.0-only; https://opensource.org/licenses/GPL-2.0
// @homepage    https://github.com/metapone/userscript-collection
// @supportURL  https://github.com/metapone/userscript-collection/issues
// @noframes
// @match       *://*.reddit.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/404332/Reddit%20Highlight%20Posts%20Based%20on%20Scores.user.js
// @updateURL https://update.greasyfork.org/scripts/404332/Reddit%20Highlight%20Posts%20Based%20on%20Scores.meta.js
// ==/UserScript==

if (window.location.href.indexOf('comments') !== -1) return;

const threshold = 500;  // Minimum score to highlight
const color = "yellow"; // Highlight CSS color

function callback(mutationsList) {
	for (let mutation of mutationsList) {
		for (let addedNode of mutation.addedNodes) {
			highlightPosts(addedNode);
		}
	}
}

function parseScore(score) {
	const temp = parseFloat(score, 10);
	return score.indexOf('k') === -1 ? temp : temp * 1000;
}

function highlightPosts(node) {
	node.querySelectorAll("[id^='upvote-button']").forEach(e => {
		if (parseScore(e.nextSibling.textContent) > threshold) {
			e.parentNode.parentNode.style.background = color;
			e.parentNode.parentNode.nextSibling.style.background = color;
		}
	});
}

if (window.location.href.indexOf('old.reddit.com') !== -1) {
	document.querySelectorAll(".midcol .score.unvoted").forEach(e => (parseInt(e.textContent, 10) >= threshold) && (e.parentNode.parentNode.style.background = color));
} else {
	highlightPosts(document);
	const targetNode = document.querySelector(".Post").parentNode.parentNode.parentNode;
	const observer = new MutationObserver(callback);
	observer.observe(targetNode, { childList: true });
}