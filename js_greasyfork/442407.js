// ==UserScript==
// @name         RED Forum go to first unread
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  scroll directly to last unread post on redacted
// @license MIT
// @author       zortilox
// @match        https://redacted.sh/forums.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442407/RED%20Forum%20go%20to%20first%20unread.user.js
// @updateURL https://update.greasyfork.org/scripts/442407/RED%20Forum%20go%20to%20first%20unread.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (!window.jQuery) {
        throw new Error('No jQuery. This will not work')
    }

    const $ = window.jQuery;
    const $unread = $('.forum_unread')

    if ($unread.length) {
        window.scroll(0, $unread.first().offset().top)
    }
})();
