// ==UserScript==
// @name         Bla Bla Bla Twitter Rewriter
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Replaces all Twitter tweet text with "bla bla bla"
// @author       drewby123
// @match        https://x.com/*
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/534727/Bla%20Bla%20Bla%20Twitter%20Rewriter.user.js
// @updateURL https://update.greasyfork.org/scripts/534727/Bla%20Bla%20Bla%20Twitter%20Rewriter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function rewriteTweets() {
        const tweets = document.querySelectorAll('[data-testid="tweetText"]');
        tweets.forEach(tweet => {
            if (!tweet.dataset.blaBlaDone) {
                tweet.innerHTML = '<span>bla bla bla</span>';
                tweet.dataset.blaBlaDone = "true"; // avoid reprocessing
            }
        });
    }

    const observer = new MutationObserver((mutations) => {
        rewriteTweets();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial run
    rewriteTweets();
})();
