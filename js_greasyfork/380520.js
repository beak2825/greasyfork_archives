// ==UserScript==
// @name Back To Old Reddit
// @description This tiny, superfast UserScript will redirect any URL you visit on the new version of Reddit and take you to the old version of Reddit. (https://old.reddit.com). It will also redirect you to the correct post or subreddit URL too, not just the main page.
// @namespace https://www.nordicnode.com/
// @version      0.2
// @match *://www.reddit.com/*
// @author https://www.nordicnode.com/
// @grant none
// @copyright  2023 NordicNode - https://www.nordicnode.com/userscript-back-to-old-reddit-simple-redirect/
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/380520/Back%20To%20Old%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/380520/Back%20To%20Old%20Reddit.meta.js
// ==/UserScript==

var currentURL = window.document.location.toString();
if(currentURL.includes("://www.reddit.com")) {
  var newURL = currentURL.replace("://www","://old");
  window.document.location.replace(newURL);
}