// ==UserScript==
// @name         Time.mk Top Tweets User Blacklist
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide time.mk top tweets from blacklisted users
// @author       me
// @match        http://www.time.mk/twitter/*
// @downloadURL https://update.greasyfork.org/scripts/18553/Timemk%20Top%20Tweets%20User%20Blacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/18553/Timemk%20Top%20Tweets%20User%20Blacklist.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*
    * Example blackList
    *
    * var blackList = ["@username1",
    *                  "@username2",
    *                  "@username3"];
    */
    var blackList = [""];

    var tweetElements = document.getElementsByClassName("tweet");
    for (var i = 0; i < tweetElements.length; i++) {
        var twitterUsername = tweetElements[i].children[2].children[0].childNodes[1].text;
        for (var y = 0; y < blackList.length; y++) {
            if(twitterUsername == blackList[y]) {
                tweetElements[i].parentNode.removeChild(tweetElements[i]);
                console.log(twitterUsername + "'s tweet removed!");
            }
        }
    }
})();