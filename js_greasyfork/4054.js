// ==UserScript==
// @id             twitter.com-0c8ee385-6991-418e-940e-106644506a90@scriptish
// @name           Twitter Carefree
// @version        2016.01.03
// @namespace      https://jnv.github.io
// @description    Remove stuff from Twitter, like following/followers, retweets and likes count.
// @include        https://twitter.com/*
// @include        https://mobile.twitter.com/*
// @grant          GM_addStyle
// @license        CC0 1.0; https://creativecommons.org/publicdomain/zero/1.0/
// @downloadURL https://update.greasyfork.org/scripts/4054/Twitter%20Carefree.user.js
// @updateURL https://update.greasyfork.org/scripts/4054/Twitter%20Carefree.meta.js
// ==/UserScript==
/*
based on Carefree CSS by @fet
from http://metalbat.com/feel-good/index.html
*/

/*
Carefree v0.0.2 by @fet

Load this custom stylesheet in your browser to hide the following elements on Twitter pages:
	- Follower counts for users
	- Following counts for users
	- Join dates for users
	- Retweet counts for tweets
	- Favorite counts for tweets
	
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
.ProfileTweet-action--analytics`

var style = selectors +  " { visibility: hidden !important }";
delete selectors;
GM_addStyle(style);
