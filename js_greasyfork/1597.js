// ==UserScript==
// @name       Piratebay Search Filter
// @namespace  thepiratebay
// @version    1.0
// @description  search current table
// @include     *thepiratebay.*/*
// @copyright  2012+, drakulaboy
// @require     http://code.jquery.com/jquery-2.1.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/1597/Piratebay%20Search%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/1597/Piratebay%20Search%20Filter.meta.js
// ==/UserScript==
$(function(e){
    $('<input id="filter" />')
    .focus()
    .appendTo("#tableHead > tr > th:nth-child(2)");
});
$(document).ready(function () {
    (function ($) {
        
        $('#filter').keyup(function () {
            
            var rex = new RegExp($(this).val(), 'i');
            $( "#searchResult > tbody > tr" ).hide();
            $( "#searchResult > tbody > tr" ).filter(function () {
                return rex.test($(this).text());
            }).show();
        });
            }(jQuery));

});