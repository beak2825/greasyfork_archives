// ==UserScript==
// @name        Twitter Cleaner
// @namespace   https://github.com/mosaicer
// @author      mosaicer
// @description This script keeps Twitter clean.
// @version     1.0.11
// @match       https://twitter.com/*
// @run-at      document-idle
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/397938/Twitter%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/397938/Twitter%20Cleaner.meta.js
// ==/UserScript==
(() => {
  'use strict';

  const STRING_RESOURCES = {
    ja: {
      timelineList: 'タイムライン: リスト'
    },
    en: {
      timelineList: 'Timeline: List'
    }
  };
  const STRINGS = STRING_RESOURCES[navigator.language === 'ja' ? 'ja' : 'en'];

  const muteIfNeed = function tryToHideTweetNode(tweetNode) {
    if (isPromotion(tweetNode)) {
      tweetNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.display = 'none';
    }
  };

  const extractTweets = function extractTweetNoodesFrom(node) {
    return node.querySelectorAll('[data-testid="tweet"]');
  };

  const isPromotion = function checkIfTweetNodeIsPromotion(tweetNode) {
    return tweetNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
      .getAttribute('data-testid') === 'placementTracking';
  };

  const isElement = function checkIfValueIsInstanceOfElement(value) {
    return value instanceof Element;
  };

  const hideListHeader =
    function tryToHideListHeaderAndDoNothingIfNotExists(node) {
      try {
        const target = node.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;

        if (target.getAttribute('aria-label') === STRINGS.timelineList) {
          node.parentNode.parentNode.parentNode.style.display = 'none';
        }
      } catch(e) {}
    };

  const rootNode = document.getElementById('react-root');
  new MutationObserver(mutations =>
    mutations.forEach(mutation =>
      mutation.addedNodes.forEach(node => {
        if (!isElement(node)) return;

        const tweets = extractTweets(node);
        tweets.forEach(n => muteIfNeed(n));

        hideListHeader(node);
      })
    )
  ).observe(rootNode, { childList: true, subtree: true });
})();