// ==UserScript==
// @name        Hide Tweetdeck Interacted Tweets
// @description Remove posts from tweetdeck timelines that have already been liked/retweeted
// @namespace   https://github.com/alexwh
// @version     1.0
// @match       https://tweetdeck.twitter.com/*
// @downloadURL https://update.greasyfork.org/scripts/406001/Hide%20Tweetdeck%20Interacted%20Tweets.user.js
// @updateURL https://update.greasyfork.org/scripts/406001/Hide%20Tweetdeck%20Interacted%20Tweets.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const opts = {childList: true, subtree: true};

  const appObserver = new MutationObserver(mutations => {
    mutations.forEach((mutation) => {
      if (mutation.oldValue.includes("is-hidden") && !mutation.target.className.includes("is-hidden")) {
        for (let column of document.querySelectorAll(`section.column`)) {
          // don't hide stuff in the notifications column
          if (column.querySelectorAll(`i.icon-notifications`).length < 1) {
            //console.log("observing", column);
            tweetObserver.observe(column, opts);
          }
        }
        // for e.g. user tweet modals containing chirp-containers
        tweetObserver.observe(document.querySelector(`div#open-modal`), opts);
        // don't set up more than once
        appObserver.disconnect();
      }
    });
  });

  const tweetObserver = new MutationObserver(mutations => {
    mutations.forEach((mutation) => {
      if (mutation.target.className.includes("chirp-container") && mutation.addedNodes.length > 0) {
        for (let tweet of mutation.addedNodes) {
          // liked or retweeted
          if (tweet.querySelectorAll(`i.js-icon-favorite.icon-heart-filled, i.js-icon-retweet.icon-retweet-filled`).length > 0) {
            tweet.style.display = "none";
            //console.log("rm", tweet);
          }
        }
      }
    });
  });

  // wait for app (and columns) to load before observing them
  appObserver.observe(document.querySelector(`div.application`), {attributeFilter: ["class"], attributeOldValue: true});
})();
