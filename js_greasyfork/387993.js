// ==UserScript==
// @name         Reddit Comment Score Hider
// @namespace    redditscorehider_kk
// @version      1.4
// @description  Hide scores on Reddit comments
// @match        https://*.reddit.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/387993/Reddit%20Comment%20Score%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/387993/Reddit%20Comment%20Score%20Hider.meta.js
// ==/UserScript==

// .dislikes.midcol, .likes.midcol, .unvoted.midcol,

var cssinj = setInterval(() => {
	if (!document.head) return

	var newBaseCSS = "span.score.dislikes, span.unvoted.score, span.unvoted.score, span.score-hidden, span.score.likes{display: none !important}";
	var newBaseCSS_kk = document.createElement("style");
	newBaseCSS_kk.innerText = newBaseCSS;
	document.head.appendChild(newBaseCSS_kk);

	clearInterval(cssinj);
	cssinj = null;
}, 100);

setInterval(() => {
		var spans = document.getElementsByTagName("span");
		for (var i = 0; i < spans.length; i++) {
			if (!isNaN(spans[i].innerText[0])) {
				if (spans[i].innerText.endsWith("point") || spans[i].innerText.endsWith("points")) {
					spans[i].innerText = "";
					break;
				}
			}
		}
}, 100);
