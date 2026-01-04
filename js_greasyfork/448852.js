// ==UserScript==
// @name         Twitter Circles enabler
// @namespace    http://luismayo.com/
// @version      1.0
// @description  Enables Twitter Circles for your account
// @author       LuisMayo
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448852/Twitter%20Circles%20enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/448852/Twitter%20Circles%20enabler.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.cookie="ab_decider=trusted_friends_tweet_creation_enabled%3Dtrue%26trusted_friends_consumption_enabled%3Dtrue;path=/;domain=.twitter.com;expires=Tue, 19 Jan 2038 04:14:07 GMT"
})();
