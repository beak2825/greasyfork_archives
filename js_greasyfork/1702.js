// ==UserScript==
// @name       filelist filter active table
// @namespace  filelist filter current table
// @version    3.0
// @description  filelist current table filter
// @include     *filelist.ro/*
// @copyright  2014, drakulaboy
// @require     http://code.jquery.com/jquery-2.1.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/1702/filelist%20filter%20active%20table.user.js
// @updateURL https://update.greasyfork.org/scripts/1702/filelist%20filter%20active%20table.meta.js
// ==/UserScript==
$(function(e){
    $('<input id="filter" />')
    .focus()
    .appendTo("#maincolumn > div > div.cblock-content > div > div.visitedlinks > div:nth-child(2)");
});
$(document).ready(function () {
    (function ($) {
        
        $('#filter').keyup(function () {
            
            var rex = new RegExp($(this).val(), 'i');
            $( "div.visitedlinks > div" ).slice(11).hide();
            $( "#maincolumn > div > div.cblock-content > div > div.visitedlinks > div" ).slice(1).filter(function () {
                return rex.test($(this).text());
            }).show();
        });
            }(jQuery));

});