// ==UserScript==
// @id             twitter.com-0c8ee385-6991-418e-940e-106644506a90@scriptish
// @name           Twitter Carefree (New Twitter Compatible)
// @version        2021.12.12
// @namespace      https://jnv.github.io
// @description    Remove stuff from Twitter, like following/followers, retweets and likes count.
// @include        https://twitter.com/*
// @include        https://mobile.twitter.com/*
// @grant          GM_addStyle
// @license        CC0 1.0; https://creativecommons.org/publicdomain/zero/1.0/
// @downloadURL https://update.greasyfork.org/scripts/436963/Twitter%20Carefree%20%28New%20Twitter%20Compatible%29.user.js
// @updateURL https://update.greasyfork.org/scripts/436963/Twitter%20Carefree%20%28New%20Twitter%20Compatible%29.meta.js
// ==/UserScript==

/*
Sloppy edit to make it compatible with new twitter!!
*/

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
.r-1awozwy.r-2sztyj.r-1efd50x.r-5kkj8d.r-18u37iz.r-1wtj0ep,
.r-xoduu5.r-1udh08x,
.r-13awgt0.r-18u37iz.r-1w6e6rj,
.r-9ilb82.r-4qtqp9.r-poiln3.r-1b7u577.r-bcqeeo.r-qvutc0,
.r-9ilb82.r-37j5jr.r-n6v787.r-16dba41.r-1cwl3u0.r-bcqeeo.r-qvutc0,
.ProfileNav-item--followers,
.ProfileTweet-actionCount,
.ProfileHeaderCard-joinDateText,
.ProfileTweet-action--analytics`

var style = selectors + " { visibility: hidden !important }";
delete selectors;
GM_addStyle(style);
