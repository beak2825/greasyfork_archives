// ==UserScript==
// @name         Max140
// @version      0.2
// @description  On twitter dot com, truncate tweets of > 140 characters
// @author       Kevin Shay
// @match        http://tampermonkey.net/index.php?version=4.4&ext=dhdg&updated=true
// @grant        none
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @include      https://twitter.com/*
// @namespace https://greasyfork.org/users/154233
// @downloadURL https://update.greasyfork.org/scripts/33545/Max140.user.js
// @updateURL https://update.greasyfork.org/scripts/33545/Max140.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.setTimeout(function () {
        $('.js-tweet-text').each(function () {
            var tweet = $(this).clone();
            // Emoji
            tweet.find('img').replaceWith('X');
            // External links don't count but hashtags do
            tweet.find('a').not('.twitter-hashtag').remove();
            var text = tweet.text();
            if (text.length > 140) {
                var extra = ' <span style="color:red;font-weight:bold;">+' + (text.length - 140) + '</span>';
                $(this).replaceWith($(this).text().substring(0, 140) + extra);
            }
        });
    }, 2000);
})();
