// ==UserScript==
// @name         Twitter Newest Tweets
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Always select "Newest Tweets"
// @author       Daniel Brüggemann
// @include      http*://twitter.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381002/Twitter%20Newest%20Tweets.user.js
// @updateURL https://update.greasyfork.org/scripts/381002/Twitter%20Newest%20Tweets.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var selectStars = "[aria-label='Beste Tweets an'][role='button'][data-focusable='true'][tabindex='0']";
    var selectNewestTweets = "[aria-haspopup='false'][role='menuitem'][data-focusable='true'][tabindex='0']";

    setTimeout(function() {
        document.querySelectorAll(selectStars)[0].click();
    }, 2000);

    setTimeout(function() {
        document.querySelectorAll(selectNewestTweets)[0].click();
    }, 3000);
})();