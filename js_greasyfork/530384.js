// ==UserScript==
// @name                Ignore go to (Socialmediagirls)
// @namespace           https://greasyfork.org/users/821661
// @match               https://forums.socialmediagirls.com/*
// @grant               none
// @version             1.1
// @run-at              document-start
// @author              hdyzen
// @description         Set real links on posts in socialmediagirls.com
// @license             GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/530384/Ignore%20go%20to%20%28Socialmediagirls%29.user.js
// @updateURL https://update.greasyfork.org/scripts/530384/Ignore%20go%20to%20%28Socialmediagirls%29.meta.js
// ==/UserScript==

document.addEventListener("readystatechange", () => {
	if (document.readyState !== "interactive") {
		return;
	}

	const nodes = document.querySelectorAll("a[href*='/goto/link-confirmation?url=']");

	for (const node of nodes) {
		node.href = getURL(node.search);
	}
});

function getURL(search) {
	const params = new URLSearchParams(search);
	const url = params.get("url");

	return atob(url);
}
