// ==UserScript==
// @name        Tweet Pure Links
// @description Tweet Pure Links and say goodbye to the URL shorten system!
// @author      Lucio Martinez
// @license     MIT
// @copyright   2014-2020, Lucio Martinez (https://openuserjs.org/users/lucio-martinez)
// @supportURL  https://github.com/luciomartinez/tweet-pure-links/issues
// @namespace   https://github.com/luciomartinez/tweet-pure-links
// @version     2.0
// @grant       none
// @match       https://twitter.com/*
// @match       https://tweetdeck.twitter.com/*
// @match       https://mobile.twitter.com/*
// @downloadURL https://update.greasyfork.org/scripts/16847/Tweet%20Pure%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/16847/Tweet%20Pure%20Links.meta.js
// ==/UserScript==

fixLinks();

function fixLinks() {
  const domain = window.location.hostname;
  if (domain === 'tweetdeck.twitter.com') {
    fixLinksInTweetDeck();
  } else {
    fixLinksInTwitter();
  }
}

function fixLinksInTwitter() {
  startWatchWithCleaner(parseLinksAtTwitter);
}

function fixLinksInTweetDeck() {
  startWatchWithCleaner(parseLinksAtTweetDeck);
}

function startWatchWithCleaner(cleaner) {
  startWatch(cleaner);
}

function startWatch(cleaner) {
  const watchedNode = document.getElementById('react-root');
  watchForChangesOnNodeAndRunCleaner(watchedNode, cleaner);
}

function watchForChangesOnNodeAndRunCleaner(targetNode, cleaner) {
  const observer = createObserverWithCallbackBounced(cleaner);
  observer.observe(targetNode, { subtree: true, childList: true });
}

function createObserverWithCallbackBounced(callback) {
  const callbackDebounced = debounce(callback);
  return new MutationObserver(callbackDebounced);
}

/**
 * Thanks to Chris Boakes!
 * https://chrisboakes.com/how-a-javascript-debounce-function-works/
 * @param {function} callback - Function to be debounced
 * @param {number} [wait=250] - Specifies the milliseconds to debounce
 * @returns {function} Debounced function
 */
function debounce(callback, wait = 250) {
  let timeout;
  return (...args) => {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => callback.apply(context, args), wait);
  };
}

function parseLinksAtTwitter() {
  const selectShortLinks = 'a[href^="https://t.co/"][title]:not([data-link-fixed])';
  const links = document.querySelectorAll(selectShortLinks);
  links.forEach((link) => {
    updateLinkAndMarkAsFixed(link, link.title);
  });
}

function parseLinksAtTweetDeck() {
  const selectFromTweets = '.tweet-text > .url-ext[href^="https://t.co/"][data-full-url]:not([data-link-fixed], .is-vishidden)';
  const selectFromQuotedTweets = '.quoted-tweet .url-ext[href^="https://t.co/"][data-full-url]:not([data-link-fixed])';
  const selectFromTweetDetail = '.tweet-detail .url-ext[href^="https://t.co/"][data-full-url]:not([data-link-fixed])';
  const multipleSelects = `${selectFromTweets}, ${selectFromQuotedTweets}, ${selectFromTweetDetail}`;
  const links = document.querySelectorAll(multipleSelects);
  links.forEach((link) => {
    updateLinkAndMarkAsFixed(link, link.dataset.fullUrl);
  });
}

function updateLinkAndMarkAsFixed(anchorEl, fixedUrl) {
  console.info('Fix Twitter links: URL parsed', fixedUrl);
  setHrefTo(anchorEl, fixedUrl);
  markAsFixed(anchorEl);
}

function setHrefTo(el, url) {
  el.href = url;
}

function markAsFixed(el) {
  el.dataset.linkFixed = '1';
}