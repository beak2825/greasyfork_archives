// ==UserScript==
// @name         Twitter Custom Filter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide self-quoted tweets from specific users and remove specific tweets
// @author       24bit
// @match        https://x.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/516321/Twitter%20Custom%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/516321/Twitter%20Custom%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const users = ["4SCRF"];
    const keywords = ["curiouscat.live", "onvo.me", "curiouscat.me","codenames.game", "tellonym.me"];
    const bypassUser = "/s_9953";

    const checkTweets = () => {
        const tweets = document.querySelectorAll('article, div[data-testid="cellInnerDiv"]');

        tweets.forEach(tweet => {
            const tweetText = tweet.textContent;
            const tweetAuthorLink = tweet.querySelector('a[href]');

            if (tweetAuthorLink && tweetAuthorLink.getAttribute('href') === bypassUser) {
                return;
            }

            if (keywords.some(keyword => tweetText.includes(keyword)) ||
                users.some(user => (tweetText.match(new RegExp(`@${user}`, 'g')) || []).length > 1)) {
                tweet.style.display = 'none';
            }
        });
    };

    // Check tweets when page is loaded
    checkTweets();

    // Check new tweets every 5 milliseconds
    setInterval(checkTweets, 5);
})();