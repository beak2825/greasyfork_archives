// ==UserScript==
// @name         WaniKani Titlebar
// @namespace    http://wanikani.com
// @version      0.0.1
// @description  Shows amount of reviews/lessons in titlebar!
// @author       jakeoid
// @match        http://www.wanikani.com/
// @match        https://www.wanikani.com/
// @match        https://www.wanikani.com/dashboard
// @match        http://www.wanikani.com/dashboard
// @require      http://code.jquery.com/jquery-1.11.2.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/33500/WaniKani%20Titlebar.user.js
// @updateURL https://update.greasyfork.org/scripts/33500/WaniKani%20Titlebar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function changeTitlebar () {

        var lessons = parseInt($(".lessons a span").text());
        var reviews = parseInt($(".reviews a span").text());

        if (lessons > 0) {
            $(document).prop('title', '(' + lessons + ') WaniKani / Dashboard');
        } else if (reviews > 0) {
            $(document).prop('title', '(' + reviews + ') WaniKani / Dashboard');
        } else {
            $(document).prop('title', 'WaniKani / Dashboard');
        }

    }

    changeTitlebar();

    var interval = setInterval(function () { changeTitlebar(); }, 6000);

})();
