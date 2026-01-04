// ==UserScript==
// @name        Chegg Search Always See All
// @namespace   Chegg Search Always See All
// @run-at      start
// @match       *://www.chegg.com/search?*
// @match       *://www.chegg.com/search/*
// @exclude     *://www.chegg.com/*contentType=study*
// @version     1.5
// @author      uJZk
// @description Automatically add "contentType=study" to show all result of Solutions in search page.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/443548/Chegg%20Search%20Always%20See%20All.user.js
// @updateURL https://update.greasyfork.org/scripts/443548/Chegg%20Search%20Always%20See%20All.meta.js
// ==/UserScript==

if (document.location.href.indexOf("search?") > 0) {
  window.location.replace(document.location.href.replace(/https?:\/\/www\.chegg\.com\/search\?\S*?q=([\w+%]+)\S*/,"https://www.chegg.com/search?q=$1?contentType=study"));
} else {
  window.location.replace(document.location.href.replace(/https?:\/\/www\.chegg\.com\/search\/([\w+%]+)/,"https://www.chegg.com/search/$1?contentType=study"));
}
