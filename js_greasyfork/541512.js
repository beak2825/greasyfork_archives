// ==UserScript==
// @name        reddit.com: Disable endless scrolling
// @namespace   Violentmonkey Scripts
// @author      klaufir216
// @license     MIT
// @match       https://www.reddit.com/*
// @grant       none
// @version     1.1
// @description 7/1/2025, 3:33:41 PM
// @downloadURL https://update.greasyfork.org/scripts/541512/redditcom%3A%20Disable%20endless%20scrolling.user.js
// @updateURL https://update.greasyfork.org/scripts/541512/redditcom%3A%20Disable%20endless%20scrolling.meta.js
// ==/UserScript==

function getFeedElement(path) {
    return Array.from(document.querySelectorAll('faceplate-partial')).filter(e => e.getAttribute('src').startsWith(path))?.[0];
}

function getPartialElem() {
    return getFeedElement('/svc/shreddit/community-more-posts/') // main page
        || getFeedElement('/svc/shreddit/feeds/home-feed') // home feed
        || getFeedElement('/svc/shreddit/feeds/popular-feed'); // popular feed
}

function getArticleCount() {
  return document.querySelectorAll('article').length + document.querySelectorAll('div.virtualized-placeholder').length;
}

setInterval(function() {
  var partialElem = getPartialElem();
  if (partialElem) {
    var articleCount = getArticleCount();
    console.log('---- [Disable reddit autoload] articleCount == ', articleCount);
    if (articleCount > 50) {
      console.log('---- [Disable reddit autoload] Remove autoload element');
      partialElem?.remove();
    }
  }
}, 1000);
