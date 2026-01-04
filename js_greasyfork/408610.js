// ==UserScript==
// @name         Strava - Remove the 'Give a Subscription' button
// @namespace    https://github.com/bogdal/userscripts
// @version      0.1
// @description  Removes the 'Give a Subscription' button from the top bar
// @author       Adam Bogdał
// @match        https://www.strava.com/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/408610/Strava%20-%20Remove%20the%20%27Give%20a%20Subscription%27%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/408610/Strava%20-%20Remove%20the%20%27Give%20a%20Subscription%27%20button.meta.js
// ==/UserScript==

(document.head || document.documentElement).insertAdjacentHTML(
  "beforeend",
  "<style>.user-nav .nav-item.upgrade { display: none!important; }</style>"
);
