// ==UserScript==
// @name         Remove Reddit NSFW Posts
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Quick and dirty fix that blocks and removes all NSFW posts on reddit
// @author       BlackOdd (Reddit: /u/BlackOdder)
// @match        http://tampermonkey.net/scripts.php
// @grant        none
// @include      http*://www.reddit.com*
// @downloadURL https://update.greasyfork.org/scripts/21054/Remove%20Reddit%20NSFW%20Posts.user.js
// @updateURL https://update.greasyfork.org/scripts/21054/Remove%20Reddit%20NSFW%20Posts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function() {
        $('.nsfw-stamp').parent().parent().parent().parent().remove();
    }, 100);
})();