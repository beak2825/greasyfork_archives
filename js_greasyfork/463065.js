// ==UserScript==
// @name         Remove YT Shorts from Subscription page
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove videos marked as "Shorts" from your subscription page. Will only run on that page.
// @author       flomei
// @match        https://www.youtube.com/feed/subscriptions
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463065/Remove%20YT%20Shorts%20from%20Subscription%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/463065/Remove%20YT%20Shorts%20from%20Subscription%20page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function () {
        removeShorts();
    }, 1000);

})();

function removeShorts() {
    var grid_list = document.querySelectorAll('ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]');
    var grid_array = [...grid_list];

    grid_array.forEach(
        function(e) {
            var ytd = e.closest('ytd-grid-video-renderer');
            console.log(ytd);
            ytd.remove();
        }
    )
}