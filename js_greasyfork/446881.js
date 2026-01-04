// ==UserScript==
// @name        Twitch Redirect to Old Category Page
// @description Redirects back to the old game category page without autoplay at the top.
// @version     1.0
// @license     AGPL-3.0-only
// @namespace   awooooooooooo
// @match       https://www.twitch.tv/*
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/446881/Twitch%20Redirect%20to%20Old%20Category%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/446881/Twitch%20Redirect%20to%20Old%20Category%20Page.meta.js
// ==/UserScript==

(() => {
	const re = /^\/directory\/game\/[^\/]*$/;
	if (re.test(window.location.pathname)) {
		window.location.pathname += "/list";
	}
	window.onload = () => {
		const history = (() => {
			let node = document.querySelector("#root")
				._reactRootContainer._internalRoot.current.child;
			while (node) {
				const history = node.memoizedProps.history;
				if (history) return history;
				node = node.child;
			}
		})();
		history.listen(l => {
			if (re.test(l.pathname)) {
				history.replace(l.pathname + "/list");
			}
		});
	}
})();
