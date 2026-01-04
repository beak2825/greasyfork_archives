// ==UserScript==
// @name         X Timeline Cleaner - Comprehensive
// @namespace    https://x.com/
// @version      3.0
// @description  Hide tweets from users you don't follow, as well as reposts, replies, and threads on X.com
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509159/X%20Timeline%20Cleaner%20-%20Comprehensive.user.js
// @updateURL https://update.greasyfork.org/scripts/509159/X%20Timeline%20Cleaner%20-%20Comprehensive.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideUnwantedTweets() {
        var tweets = document.querySelectorAll('article');

        tweets.forEach(tweet => {
            let hideTweet = false;

            // Check if the tweet is from someone you don't follow
            var followButton = tweet.querySelector('div[role="button"][data-testid$="-follow"]');
            if (followButton) {
                hideTweet = true;
            }

            // Check for reposts by looking for elements with data-testid="socialContext"
            var isRepost = tweet.querySelector('[data-testid="socialContext"]');
            if (isRepost) {
                hideTweet = true;
            }

            // Check for replies by looking for "Replying to" text or similar phrases
            var replyPhrases = ['Replying to', 'Respondiendo a', 'Répondre à', 'Antwort an', 'Rispondendo a', 'Responder a'];
            var isReply = replyPhrases.some(phrase => tweet.innerText.includes(phrase));
            if (isReply) {
                hideTweet = true;
            }

            // Check for threads by identifying the "Show this thread" link or similar phrases
            var threadPhrases = ['Show this thread', 'Mostrar este hilo', 'Afficher ce fil', 'Diesen Thread anzeigen', 'Mostra questo thread'];
            var isThread = threadPhrases.some(phrase => tweet.innerText.includes(phrase));
            if (isThread) {
                hideTweet = true;
            }

            // Check for promoted content
            var isPromoted = tweet.innerText.includes('Promoted');
            if (isPromoted) {
                hideTweet = true;
            }

            if (hideTweet) {
                tweet.style.display = 'none';
            }
        });
    }

    // Observe dynamic content loading
    const observer = new MutationObserver(() => {
        hideUnwantedTweets();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial call
    hideUnwantedTweets();
})();
