// ==UserScript==
// @name       CG Peers Search Filter
// @namespace  cgpeers
// @version    1.1
// @description  search current table
// @include     *cgpeers.to/*
// @copyright  2012+, drakulaboy
// @require     http://code.jquery.com/jquery-2.1.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/1608/CG%20Peers%20Search%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/1608/CG%20Peers%20Search%20Filter.meta.js
// ==/UserScript==
$(function(e){
    $('<input id="filter" />')
    .focus()
    .appendTo("#torrent_table > tbody > tr.colhead > td:nth-child(2)");
});
$(document).ready(function () {
    (function ($) {
        
        $('#filter').keyup(function () {
            
            var rex = new RegExp($(this).val(), 'i');
            $( "tr.torrent" ).slice(1).hide();
            $( "tr.torrent" ).slice(1).filter(function () {
                return rex.test($(this).text());
            }).show();
        });
            }(jQuery));

});