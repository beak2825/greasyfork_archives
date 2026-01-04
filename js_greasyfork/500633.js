// ==UserScript==
// @name         Tweet Cramming
// @namespace    guebosch
// @version      2024-07-14
// @description  Allow 280 characters in a Tweet sent from TweetDeck automatically
// @author       guebosch, Nikolay Kolev
// @run-at       document-idle
// @match          https://tweetdeck.twitter.com/*
// @match          https://x.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500633/Tweet%20Cramming.user.js
// @updateURL https://update.greasyfork.org/scripts/500633/Tweet%20Cramming.meta.js
// ==/UserScript==

TD.services.TwitterClient.prototype.makeTwitterCall = function(
	b,
	e,
	f,
	g,
	c,
	d,
	h
) {
	c = c || function() {};
	d = d || function() {};
	var i =
		b == "https://api.twitter.com/1.1/statuses/update.json"
			? Object.assign(e, { weighted_character_count: !0 })
			: e;
	b = this.request(b, { method: f, params: i, processor: g, feedType: h });
	return (
		b.addCallbacks(
			function(a) {
				c(a.data);
			},
			function(a) {
				d(a.req, "", a.msg, a.req.errors);
			}
		),
		b
	);
};

twttrTxt = Object.assign({}, twttr.txt, {
	isInvalidTweet: function() {
		return !1;
	},
	getTweetLength: function() {
		var l = twttr.txt.getTweetLength.apply(this, arguments);
		return l > 140 ? l - 140 : l;
	}
});