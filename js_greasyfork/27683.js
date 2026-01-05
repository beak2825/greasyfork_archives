// ==UserScript==
// @name        IMDB URL Cleaner
// @namespace   IMDB URL Cleaner
// @description Cleans the URL for a title's page on IMDB
// @version     1.1
// @grant       none
// @include     /^https?://www.imdb.com/title/*
// @include     /^https?://www.imdb.com/name/*
// @downloadURL https://update.greasyfork.org/scripts/27683/IMDB%20URL%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/27683/IMDB%20URL%20Cleaner.meta.js
// ==/UserScript==

if (window.location.search.length > 0) {
    window.history.pushState(null, null, window.location.href.replace(window.location.search, ""));
}