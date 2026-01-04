// ==UserScript==
// @name        Instagram redirect to Inbox
// @namespace   Violentmonkey Scripts
// @match       https://www.instagram.com/*
// @grant       none
// @version     1.2
// @author      klaufir216
// @run-at      document-start
// @license MIT
// @description 6/12/2025, 10:07:44 PM
// @downloadURL https://update.greasyfork.org/scripts/539237/Instagram%20redirect%20to%20Inbox.user.js
// @updateURL https://update.greasyfork.org/scripts/539237/Instagram%20redirect%20to%20Inbox.meta.js
// ==/UserScript==

function main() {
  var pathname = pathname = new URL(document.location.href).pathname;
  if (pathname === "/" || pathname?.startsWith('/explore')) {
    document.location.replace("https://www.instagram.com/direct/inbox/");
  }
}

setInterval(main, 1000);
main();

