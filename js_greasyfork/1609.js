// ==UserScript==
// @name       RuTor.org Search Filter
// @namespace  rutor
// @version    1.0
// @description  search current table
// @include     *rutor.*/*
// @copyright  2014, drakulaboy
// @require     http://code.jquery.com/jquery-2.1.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/1609/RuTororg%20Search%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/1609/RuTororg%20Search%20Filter.meta.js
// ==/UserScript==
$(function(e){
    $('<input id="filter" />')
    .focus()
    .appendTo("#index > table > tbody > tr.backgr > td:nth-child(2)");
});
$(document).ready(function () {
    (function ($) {
        
        $('#filter').keyup(function () {
            
            var rex = new RegExp($(this).val(), 'i');
            $( "tr.tum" ).slice(1).hide();
             $( "tr.gai" ).slice(1).hide();
            $( "tr.tum" ).slice(1).filter(function () {
                return rex.test($(this).text());
            }).show();
            $( "tr.gai" ).slice(1).filter(function () {
                return rex.test($(this).text());
            }).show();
        });
            }(jQuery));

});