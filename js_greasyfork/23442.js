// ==UserScript==
// @name         [WorldWideTorrents.eu] First & Last Post Links
// @namespace    pxgamer
// @version      0.1.1
// @description  Adds links for first and last post to the forums.
// @author       pxgamer
// @include      https://worldwidetorrents.eu/forums.php?action=viewforum&forumid=*
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23442/%5BWorldWideTorrentseu%5D%20First%20%20Last%20Post%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/23442/%5BWorldWideTorrentseu%5D%20First%20%20Last%20Post%20Links.meta.js
// ==/UserScript==
/*jshint multistr: true */

(function() {
    'use strict';

    $('.alt1').each(function() {
        let url = $(this).find('a').first().attr('href');
        $(this).append('<p style="margin-bottom: 5px;"></p><a class="btnLink" href="/'+url+'">First Post</a> | <a class="btnLink" href="/'+url+'&page=last#last">Latest Post</a></td>');
    });
})();
