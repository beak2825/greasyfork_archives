// ==UserScript==
// @name        Twitter t.co GO TO HELL
// @description Restore t.co links, support Twitter/TweetDeck
// @icon        https://abs.twimg.com/favicons/favicon.ico
// @include     twitter.com
// @match       *://*.twitter.com/*
// @exclude     *://twitter.com/i/cards/*
// @version     1.5.1
// @grant       GM_addStyle
// @namespace   https://greasyfork.org/users/113252-garrison-baird
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/28506/Twitter%20tco%20GO%20TO%20HELL.user.js
// @updateURL https://update.greasyfork.org/scripts/28506/Twitter%20tco%20GO%20TO%20HELL.meta.js
// ==/UserScript==
// @updateURL   https://greasyfork.org/scripts/28506-twitter-t-co-go-to-hell/code/Twitter%20tco%20GO%20TO%20HELL.user.js
// @updateURL   https://github.com/GarrisonBaird/GreasyForkScripts/raw/master/Twitter%20t.co%20GO%20TO%20HELL.user.js

GM_addStyle(`.js-tweet-text-container a.u-hidden {
	display: inherit !important;
}`)

function main () {
	document.querySelectorAll('a[href*="t.co"]').forEach(function (el) {
		if (el.dataset && el.dataset.expandedUrl) { // Twitter web
			el.href = removeTracker(el.dataset.expandedUrl);
		}
		if (el.dataset && el.dataset.fullUrl) { // TweetDeck
			el.href = removeTracker(el.dataset.fullUrl);
		}
		if (el.title && el.title.match(/^https?:\/\//i)) { // New unified Twitter UI, including mobile.twitter.com
			el.href = removeTracker(el.title);
		}
		if (el.children.length > 0 && el.children[0].tagName == "SPAN" && el.children[0].innerText.startsWith("(link: ")) {
			// el.children[0].innerText == "(link: https://www.google.com/) "
			var href = el.children[0].innerText.trim();
			href = href.substring("(link: ".length, href.length - ")".length);
			el.href = removeTracker(href);
		}
		if (el.href.startsWith("https://t.co/")) { // if real url is not found, remove ?amp=1 at the ending
			el.href = el.href.replace(/\?amp=1$/, "");
		}
	});
}
function removeTracker (url) {
	// utm_*
	url = url.replace(new RegExp("\\?utm_[^&#]+", "gi"), "?")
	url = url.replace(new RegExp("&utm_[^&#]+", "gi"), "")
	return url
}

main();

if (MutationObserver) {
	console.log("Twitter t.co GO TO HELL: Using MutationObserver");
	var observer = new MutationObserver(function(mutationsList, observer){
		main();
	});
	observer.observe(document.body, {
		attributes: false,
		characterData: false,
		childList: true,
		subtree: false,
		attributeOldValue: false,
		characterDataOldValue: false
	});
} 
if (true) {
	if (window.location.host == 'tweetdeck.twitter.com') { // TweetDeck won't trigger 'scroll' event
		console.log("Twitter t.co GO TO HELL: Using setInterval");
		setInterval(main, 1000);
	} else {
		console.log("Twitter t.co GO TO HELL: Using addEventListener 'scroll' and setInterval");
		window.addEventListener('scroll', main);
		setInterval(main, 5000); // fallback
	}
}
