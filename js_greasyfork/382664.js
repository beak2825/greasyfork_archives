// ==UserScript==
// @name         tweetdeck customer
// @namespace    https://github.com/kemadz
// @version      0.5
// @icon         https://tweetdeck.twitter.com/favicon.ico
// @description  Custom tweetdeck column width
// @author       kemadz
// @match        https://tweetdeck.twitter.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382664/tweetdeck%20customer.user.js
// @updateURL https://update.greasyfork.org/scripts/382664/tweetdeck%20customer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function fixWidth() {
        var els = document.getElementsByClassName('column');
        for (var i = 0; i < els.length; i++) {
            els[i].style.width = '500px';
        }
    }, 7000);
})();