// ==UserScript==
// @name         Twitter: expand tweets automaticly
// @version      0.1
// @description  For Tweets which have the "show more" Button this Script will click this button automaticly & it will remove the lineclamp on quoted tweets
// @author       Schubsi
// @license      MIT
// @match        https://twitter.com/*
// @match        https://x.com/*
// @namespace https://greasyfork.org/users/1493523
// @downloadURL https://update.greasyfork.org/scripts/542217/Twitter%3A%20expand%20tweets%20automaticly.user.js
// @updateURL https://update.greasyfork.org/scripts/542217/Twitter%3A%20expand%20tweets%20automaticly.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const autoShowMore = (tweet) => {
    const showMoreBtn = tweet.querySelector(
      "button[data-testid='tweet-text-show-more-link']"
    );
    if (showMoreBtn) showMoreBtn.click();

    const quotedTweet = tweet.querySelector("div[id^='id__'][aria-labelledby^='id__']");
    if (!quotedTweet) return;
    const quotedText = quotedTweet.querySelector(
      "div[data-testid='tweetText']"
    );
    if (!quotedText) return;
    quotedText.style.removeProperty("-webkit-line-clamp");
  };

  const processTweets = () => {
    document.querySelectorAll("article").forEach((tweet) => {
      autoShowMore(tweet);
    });
  };

  const observer = new MutationObserver(() => {
    processTweets();
  });

  window.addEventListener("load", () => {
    processTweets();
    observer.observe(document.body, { childList: true, subtree: true });
  });
})();