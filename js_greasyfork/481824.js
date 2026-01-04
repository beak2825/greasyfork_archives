// ==UserScript==
// @name        Goto Old Reddit
// @namespace   Old Reddit Scripts
// @match       *://www.reddit.com/*
// @grant       none
// @version     1.0
// @author      -
// @license     MIT
// @description Redirects to old reddit.
// @downloadURL https://update.greasyfork.org/scripts/481824/Goto%20Old%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/481824/Goto%20Old%20Reddit.meta.js
// ==/UserScript==

(function() {

  function main() {
    setTimeout(function() {
      const pathname = window.location.pathname;
      window.location.replace("https://old.reddit.com" + pathname);
    }, 10);
  }
  main();
})();