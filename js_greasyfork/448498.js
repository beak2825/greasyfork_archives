// ==UserScript==
// @name         Tumblr "Add To Queue" as default
// @namespace    https://greasyfork.org/users/683917
// @version      0.1
// @description  When posting/reblogging, make "Add To Queue" the default option, instead of "Post now"/"Reblog"
// @author       Garbaz
// @match        https://www.tumblr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tumblr.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448498/Tumblr%20%22Add%20To%20Queue%22%20as%20default.user.js
// @updateURL https://update.greasyfork.org/scripts/448498/Tumblr%20%22Add%20To%20Queue%22%20as%20default.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var prev_options_menu = null;

    let click_switch_to_queue = function () {
        let options_menu = document.querySelector('[aria-label="Open post state options"]');
        if (options_menu != null && options_menu != prev_options_menu) {
            console.log(options_menu);
            options_menu.click();
            document.querySelectorAll('[class="yPzUb"]')[1].click();
        }
        prev_options_menu = options_menu;
    };

    setInterval(click_switch_to_queue, 200);
})();