// ==UserScript==
// @name Twitter Auto Show New Tweets
// @author Denis Lugowski
// @description Shows new incoming tweets. Adds a button to jump to the last tweet before adding new ones.
// @include http://www.twitter.com/*
// @version 1.0
// @namespace https://greasyfork.org/users/96649
// @downloadURL https://update.greasyfork.org/scripts/26733/Twitter%20Auto%20Show%20New%20Tweets.user.js
// @updateURL https://update.greasyfork.org/scripts/26733/Twitter%20Auto%20Show%20New%20Tweets.meta.js
// ==/UserScript==

// -------------- VARIABLES -------------- //
var tweets       = document.getElementsByClassName("stream-item");
var numTweets    = tweets.length;

// -------------- INTERVALS, TIMEOUTS -------------- //
setInterval(function(){
	if (document.querySelector('.new-tweets-bar') !== null) {
		document.getElementsByClassName("new-tweets-bar")[0].click();
		tweets = document.getElementsByClassName("stream-item");
		appendListElement(tweets.length - numTweets);
		numTweets = tweets.length;
	}
}, 5000);

// -------------- FUNCTIONS -------------- //
function appendListElement(numNewTweets) {
	var li              = document.createElement('li');
	var navigation      = document.getElementById("global-actions");
	var oldNotification = document.getElementById("new_tweets_notification");

	if (oldNotification !== null)
		navigation.removeChild(oldNotification);

	li.id = "new_tweets_notification";
	li.innerHTML = '<a role="button" href="#lastTweet" id="scrollToTweet" data-placement="bottom" data-original-title="">\
		<span class="Icon Icon--arrowDown Icon--large"></span>\
		<span class="text">' + numNewTweets + ' new Tweets</span></a>';

	navigation.appendChild(li);

	// inline eventlistener not working
	document.getElementById("scrollToTweet").addEventListener('click', function() {
		tweets[numNewTweets].scrollIntoView(true);
	});
}
