// ==UserScript==
// @name         Mangadex thumbnails on follows page
// @namespace    https://github.com/ishav/MangaDex-thumbnails-on-follows-page
// @version      0.1
// @description  Adding a permanent manga thumbnail on Mangadexs follows page.
// @author       ishav
// @match        https://mangadex.org/follows
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372808/Mangadex%20thumbnails%20on%20follows%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/372808/Mangadex%20thumbnails%20on%20follows%20page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('.chapter-row.d-flex.row.no-gutters.p-2.align-items-center.border-bottom.odd-row').addClass('h-100');

    $('.col.col-md-3.row.no-gutters.flex-nowrap.align-items-start.p-2.font-weight-bold.border-bottom').each(function (i) {

        var href = $( this ).find('a').attr('href');
        var a = $( this ).find('a');

        if (href) {
            var ha = href.split("/");
            a.prepend('<img class="rounded max-width" src="/images/manga/' + ha[2] + '.thumb.jpg">');
        }
    });
})();