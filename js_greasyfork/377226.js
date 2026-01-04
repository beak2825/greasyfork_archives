// ==UserScript==
// @id             hidetwitter@isaaclyman.com
// @name           Hide Twitter timeline
// @description    Hides your Twitter timeline. Profiles, Moments and notifications are still usable.
// @version        2019.01.28
// @namespace      http://isaaclyman.com
// @include        https://twitter.com/*
// @license        CC0 1.0; https://creativecommons.org/publicdomain/zero/1.0/
// @grant          GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/377226/Hide%20Twitter%20timeline.user.js
// @updateURL https://update.greasyfork.org/scripts/377226/Hide%20Twitter%20timeline.meta.js
// ==/UserScript==

var style = ".top-timeline-tweetbox { min-height: 1000px !important; }";
style += ".top-timeline-tweetbox *, .timeline-end { display: none !important; }"

GM_addStyle(style);
