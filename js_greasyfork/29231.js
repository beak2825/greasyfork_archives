// ==UserScript==
// @name         MyAnimeList Watch Next
// @namespace    http://tampermonkey.com/
// @version      1.1
// @description  Get a random anime to watch from your list.
// @author       Nekosuki
// @include      /^https://myanimelist.net/animelist/.+\?status=6$/
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/29231/MyAnimeList%20Watch%20Next.user.js
// @updateURL https://update.greasyfork.org/scripts/29231/MyAnimeList%20Watch%20Next.meta.js
// ==/UserScript==

(function($) {
    'use strict';
    $(document).ready(() => {
        const ptw = $(".list-item .list-table-data > .plantowatch").parent().children(".title").children("a.link");
        const wn = ptw[Math.floor(Math.random() * ptw.length)];
        $("div.list-block").prepend("<div class=\"list-unit plantowatch\"><div style=\"margin-bottom: 15px\" class=\"list-status-title\"><span class=\"text\">Watch next: <i><a style=\"color:white\" href=\"" + wn.href + "\">" + wn.text + "</a></i></span></div></div>");
    });
})(window.jQuery);
