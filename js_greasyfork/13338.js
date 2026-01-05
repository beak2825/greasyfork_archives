// ==UserScript==
// @name         Scroll to torrent table
// @namespace    http://torrentsmd.com/
// @description  scrolls exactly at torrent table
// @include      *torrentsmd.*/browse.php*
// @version      1.0
// @author       Drakulaboy
// @icon         http://i.imgur.com/uShqmkR.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13338/Scroll%20to%20torrent%20table.user.js
// @updateURL https://update.greasyfork.org/scripts/13338/Scroll%20to%20torrent%20table.meta.js
// ==/UserScript==
/* jshint -W097 */
$(function() {
    $('html, body').animate({
        scrollTop: $(".tableTorrents").offset().top
    }, 1);	
});