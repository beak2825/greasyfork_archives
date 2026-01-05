// ==UserScript==
// @name           Twitter Last Read Tweet Tweak
// @namespace      http://www.arthaey.com
// @description    Makes the "last read tweek" marker more obvious
// @include        http://www.twitter.com/*
// @include        http://twitter.com/*
// @include        https://www.twitter.com/*
// @include        https://twitter.com/*
// @version        1.1
//
// Backed up from http://userscripts.org/scripts/review/98666
// Last updated on 2011-03-15
// @downloadURL https://update.greasyfork.org/scripts/2414/Twitter%20Last%20Read%20Tweet%20Tweak.user.js
// @updateURL https://update.greasyfork.org/scripts/2414/Twitter%20Last%20Read%20Tweet%20Tweak.meta.js
// ==/UserScript==

GM_addStyle(
    ".stream-item.last-new-tweet { border-bottom: 5px solid #F5B0B8 !important; }"
);
