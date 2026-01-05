// ==UserScript==
// @name         Create history list
// @namespace    pxgamer
// @version      0.2
// @description  Creates a list of your download history.
// @author       pxgamer
// @include      *kat.cr/account/history*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/19540/Create%20history%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/19540/Create%20history%20list.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var all = { titles: [], magnets: [], torrents: [] };

    $('a.cellMainLink[href$=".html"]').each(function() {
        all.titles.push($(this).html());
    });
    $('a[title="Torrent magnet link"]').each(function() {
        all.magnets.push($(this).attr('href'));
    });
    $('a[title="Download torrent file"]').each(function() {
        all.torrents.push($(this).attr('href'));
    });

    console.log(all);

})();