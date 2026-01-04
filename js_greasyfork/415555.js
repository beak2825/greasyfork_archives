// ==UserScript==
// @name         FV - item museum/stall links
// @description  Turns item images into links on Furvilla shop pages.
// @version      1.2.2
// @author       msjanny (#7302)
// @include      /^https?:\/\/www\.furvilla\.com\/([a-zA-z]*)?\/?shop.*/
// @match        https://www.furvilla.com/kitchen*
// @match        https://www.furvilla.com/recycler*
// @match        https://www.furvilla.com/oceandome/trove*
// @match        https://www.furvilla.com/foxbury_festival_shop*
// @match        https://www.furvilla.com/career/clinic*
// @grant       GM_setValue
// @grant       GM_getValue
// @namespace https://greasyfork.org/users/319295
// @downloadURL https://update.greasyfork.org/scripts/415555/FV%20-%20item%20museumstall%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/415555/FV%20-%20item%20museumstall%20links.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* globals $:false */

    $(document).ready(function() {
        let stall = GM_getValue("museumstall", false);
        let toggle = $('<a style="position: relative;top: -22px">');
        if (stall)
            toggle.text('Adding item museum links');
        else
            toggle.text('Adding stall links');
        toggle.click( function() {
            stall = !stall;
            GM_setValue("museumstall", stall);
            location.reload();
        });
        toggle.insertAfter($('.content h1:last-of-type').eq(0));

        $('img[src^="https://www.furvilla.com/img/items/"]').each(function() {
            let id = $(this).attr('src').match(/[0-9]+/g)[1];
            if (stall)
                $(this).wrap(`<a href="https://www.furvilla.com/museum/item/${id}"></a>`);
            else
                $(this).wrap(`<a href="https://www.furvilla.com/stalls/search?name=${id}"></a>`);
        });
    });
})();