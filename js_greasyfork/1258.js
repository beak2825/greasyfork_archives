// ==UserScript==
// @name       filtruTMD
// @namespace  torrentsmd
// @version    1.2
// @description  tmd table filter
// @include     *torrentsmd.*/browse.php*
// @include     *torrentsmd.*/watcher.php
// @copyright  2012+, drakulaboy
// @icon         http://s017.radikal.ru/i432/1308/7b/34fa18a96812.png
// @require     http://code.jquery.com/jquery-2.1.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/1258/filtruTMD.user.js
// @updateURL https://update.greasyfork.org/scripts/1258/filtruTMD.meta.js
// ==/UserScript==
$(function(e){
    $('<input id="filter" />')
    .focus()
    .appendTo("#torrents > table > tbody > tr:nth-child(1) > td:contains('Nume')");
});
$(document).ready(function () {
    (function ($) {
        
        $('#filter').keyup(function () {
            
            var rex = new RegExp($(this).val(), 'i');
            $( ".tableTorrents tr" ).slice(1).hide();
            $( ".tableTorrents tr" ).slice(1).filter(function () {
                return rex.test($(this).text());
            }).show();
        });
            }(jQuery));

});

$(function(e){
    $('<input id="filter" />')
    .focus()
    .appendTo("body > div:nth-child(5) > table > tbody > tr:nth-child(1) > td:nth-child(1)");
});
$(document).ready(function () {
    (function ($) {
        
        $('#filter').keyup(function () {
            
            var rex = new RegExp($(this).val(), 'i');
            $( ".fullWidth tr" ).slice(1).hide();
            $( ".fullWidth tr" ).slice(1).filter(function () {
                return rex.test($(this).text());
            }).show();
        });
            }(jQuery));

});