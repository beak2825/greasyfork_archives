// ==UserScript==
// @id              tjdeck
// @name            tjdeck
// @version         1
// @namespace       tjdeck
// @author          totoraj930
// @description     TweetDeckをスマホで使いやすくするスクリプト
// @license         MIT License
// @include         http*://tweetdeck.twitter.com/*
// @require https://greasyfork.org/scripts/383989-tj-deck/code/tj-deck.js?version=703472
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/383990/tjdeck.user.js
// @updateURL https://update.greasyfork.org/scripts/383990/tjdeck.meta.js
// ==/UserScript==


function tjLoadScript(url) {
	var req = new XMLHttpRequest();
	req.open("GET", url + "?v=" + Date.now(), true);
	req.responseType = "text";
	req.addEventListener("load", function (event) {
		if (req.status !== 200 && req.status !== 304) {
			console.error("scriptの取得に失敗しました");
			alert("scriptの取得に失敗しました");
			return;
		}
		eval(req.responseText);
	});
	req.send();
}
tjLoadScript("https://greasyfork.org/scripts/383989-tj-deck/code/tj-deck.js");