// ==UserScript==
// @name         Captcha transfer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Moves captcha to the top of the article.
// @author       You
// @match        https://lolz.guru/threads/*
// @icon         https://www.google.com/s2/favicons?domain=lolz.guru
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439956/Captcha%20transfer.user.js
// @updateURL https://update.greasyfork.org/scripts/439956/Captcha%20transfer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if ($('.contestThreadBlock')[0]) {
        $('article').prepend($($('.contestThreadBlock')[0]))
    }
})();