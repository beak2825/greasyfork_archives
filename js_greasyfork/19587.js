// ==UserScript==
// @name         Add bookmark from browse pages
// @namespace    pxgamer
// @version      0.1
// @description  Adds a bookmark torrent button in any browse page.
// @author       pxgamer
// @include      *kat.cr/browse/*
// @include      *kat.cr/*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19587/Add%20bookmark%20from%20browse%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/19587/Add%20bookmark%20from%20browse%20pages.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('a.icon16.askFeedbackjs[title="Torrent magnet link"]').each(function() {
        var hash = $(this).attr('data-id');
        $(this).parent().append(
            '<a class="icon16 ajaxLink" title="Add to bookmarks" href="/bookmarks/add/torrent/'+hash+'/" target="_blank"><i class="ka ka-16 ka-follow"></i></a>'
        );
    });
})();
