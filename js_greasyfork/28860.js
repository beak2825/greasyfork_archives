// ==UserScript==
// @name         WND Cleaner
// @description  World Net Daily (WND) Cleander
// @namespace    rfindley
// @include      http://www.wnd.com/*
// @version      1.0.2
// @copyright    2017+, Robin Findley
// @license      MIT; http://opensource.org/licenses/MIT
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28860/WND%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/28860/WND%20Cleaner.meta.js
// ==/UserScript==

window.wnd_cleaner = {events:[]};

(function(gobj) {

    function startup() {
        var attempts = 25; // 200ms * 25 = 5sec
        function try_remove() {
            var ads = $('[class*="mdeyheadline"]').parent().parent();
            if (ads.length > 0) {
                ads.remove();
                $('#footer-magazines').remove();
            } else if (attempts > 0) {
                attempts--;
                setTimeout(try_remove,200);
            }
        }
        try_remove();
    }

    $('.full-top-logo.desktop-only').remove();

    // Run startup() after window.onload event.
    if (document.readyState === 'complete')
        startup();
    else
        window.addEventListener("load", startup, false);

}(window.wnd_cleaner));
