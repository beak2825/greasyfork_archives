// ==UserScript==
// @name        Good o'l Reddit
// @description Makes sure you're using Good o'l Reddit. License WTFPLV2
// @version     1.0
// @match       *://*.reddit.com/*
// @exclude     *://*.reddit.com/poll/*
// @exclude     *://*.reddit.com/media*
// @exclude     *://*.reddit.com/topics/*
// @exclude     *://*.reddit.com/t/*
// @run-at      document-start
// @grant       none
// @namespace https://greasyfork.org/users/1202852
// @downloadURL https://update.greasyfork.org/scripts/478089/Good%20o%27l%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/478089/Good%20o%27l%20Reddit.meta.js
// ==/UserScript==

function redirectToOldReddit() {
  window.location.replace(
    "https://old.reddit.com" +
      window.location.pathname +
      window.location.search +
      window.location.hash
  );
}

function redirectToNewReddit() {
  const host = window.location.host;
  const newRedditRegex = /^(new\.reddit\.com|pay\.reddit\.com)$/i;
  if (newRedditRegex.test(host)) {
    redirectToOldReddit();
  }
}

function redirectToTwoLetterDomain() {
  const host = window.location.host;
  const twoLetterDomainRegex = /^[a-z]{2}\.reddit\.com$/i;
  if (twoLetterDomainRegex.test(host)) {
    redirectToOldReddit();
  }
}

function redirectToOldRedditIfNotOnOldOrRedditOrTwoLetterDomain() {
  const host = window.location.host;
  const path = window.location.pathname;

  if (
    host === "www.reddit.com" &&
    path !== "/gallery/" &&
    !/^\/gallery\//.test(path)
  ) {
    redirectToOldReddit();
  } else if (host === "old.reddit.com" && /^\/gallery\//.test(path)) {
    // Redirect old.reddit.com/gallery/* to www.reddit.com/gallery/*
    const newUrl = `https://www.reddit.com${path}${window.location.search}${window.location.hash}`;
    window.location.replace(newUrl);
  }
}

function removeDotsFromPath() {
  const host = window.location.host;
  const path = window.location.pathname;

  // Check if the current URL is on old.reddit.com
  if (host === "old.reddit.com") {
    if (path.includes("/domain/")) {
      // Remove the ".i" part after "/domain/*/" while keeping the rest of the URL
      const newPath = path.replace(/\.[a-z]+$/, '');
      const newUrl = `https://${host}${newPath}${window.location.search}${window.location.hash}`;

      // Check if the new URL is different from the current one to avoid an infinite loop
      if (newUrl !== window.location.href) {
        window.location.replace(newUrl);
      }
    } else if (path.includes(".")) {
      // Remove the ".i" part for other URLs while keeping the rest of the URL intact
      const newPath = path.replace(/\.[a-z]+$/, '');
      const newUrl = `https://${host}${newPath}${window.location.search}${window.location.hash}`;

      // Check if the new URL is different from the current one to avoid an infinite loop
      if (newUrl !== window.location.href) {
        window.location.replace(newUrl);
      }
    }
  }
}

redirectToNewReddit();
redirectToTwoLetterDomain();
redirectToOldRedditIfNotOnOldOrRedditOrTwoLetterDomain();
removeDotsFromPath();
