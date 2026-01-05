// ==UserScript==
// @name           Twitter Carefree (Delete Button Hider)
// @version        2016.04.05
// @description    Remove stuff from Twitter, like following/followers, retweets, and likes count. Also removes delete button
// @include        http://twitter.com/*
// @include        http://tweetdeck.twitter.com/*
// @include        http://mobile.twitter.com/*
// @include        https://twitter.com/*
// @include        https://tweetdeck.twitter.com/*
// @include        https://mobile.twitter.com/*
// @grant          GM_addStyle
// @license        CC0 1.0; https://creativecommons.org/publicdomain/zero/1.0/
// @namespace https://greasyfork.org/users/37269
// @downloadURL https://update.greasyfork.org/scripts/18523/Twitter%20Carefree%20%28Delete%20Button%20Hider%29.user.js
// @updateURL https://update.greasyfork.org/scripts/18523/Twitter%20Carefree%20%28Delete%20Button%20Hider%29.meta.js
// ==/UserScript==
/*
Based on Carefree CSS by @fet
From http://metalbat.com/feel-good/index.html 
Modified based on https://greasyfork.org/en/scripts/4054-twitter-carefree to hide delete buttons on twitter.com and tweetdeck
*/

/*
Load this custom stylesheet in your browser to hide the following elements on Twitter pages:
	- Follower counts for users
	- Following counts for users
	- Join dates for users
	- Retweet counts for tweets
	- Favorite counts for tweets
    - Tweet actions for personal tweets (delete, etc.)

I have found that this helps me avoid having my impression of people colored by how popular they are. It has gotten easier to relax and just pay attention to what people are saying, instead. I hope you find it helpful too!
*/


var selectors = `[data-element-term="follower_stats"],
[data-element-term="following_stats"],
.DashboardProfileCard-statList,
.js-mini-profile-stats,
.js-tweet-stats-container,
.ProfileNav-item--following,
.ProfileNav-item--followers,
.ProfileTweet-actionCount,
.ProfileHeaderCard-joinDateText,
.ProfileTweet-action--analytics,
.ProfileTweet-action--more.ProfileTweet-action,
.position-rel.tweet-action-item,
.position-rel.tweet-detail-action-item`

var style = selectors +  " { visibility: hidden !important }";
delete selectors;
GM_addStyle(style);
