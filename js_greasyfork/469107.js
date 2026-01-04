// ==UserScript==
// @name Redirect to old Reddit
// @description Always redirects to old-Reddit, preserving the path of the original URL.
// @namespace redaphid
// @version 1.0
// @license MIT
// @include *://www.reddit.com/*
// @grant none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/469107/Redirect%20to%20old%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/469107/Redirect%20to%20old%20Reddit.meta.js
// ==/UserScript==

const pathnamesToExclude = ["/gallery/"];
const oldRedditUrl = "https://old.reddit.com/";

const redirect = () => {
  const currentUrl = new URL(location.href);
  const pathname = currentUrl.pathname;

  for (const pathnameToExclude of pathnamesToExclude) {
    if (pathname.startsWith(pathnameToExclude)) {
      return;
    }
  }

  const destination = new URL(pathname, oldRedditUrl);

  // Redirect the user to old-Reddit, preserving the path of the original URL.
  location.assign(destination);
}

redirect()
