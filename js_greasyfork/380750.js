// ==UserScript==
// @name         GOODREADS ※ Remove Images From Reviews
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes obnoxious, "first-results-on-google", gifs/memes from reviews..
// @author       kitsuneDEV
// @match        http://*.goodreads.com/*
// @match        https://*.goodreads.com/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/380750/GOODREADS%20%E2%80%BB%20Remove%20Images%20From%20Reviews.user.js
// @updateURL https://update.greasyfork.org/scripts/380750/GOODREADS%20%E2%80%BB%20Remove%20Images%20From%20Reviews.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function() {
        $('.reviewText').find('img').remove();
    });
})();