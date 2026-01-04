// ==UserScript==
// @name         IV Contest Helper
// @description  Helper for IV '2019 Contest
// @version      0.4
// @author       Kesantielu Dasefern
// @namespace    https://dasefern.com
// @include      /^https:\/\/instantview.telegram.org\/contest\/?$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377661/IV%20Contest%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/377661/IV%20Contest%20Helper.meta.js
// ==/UserScript==

var $ = window.jQuery

//sort templates by expiration time

function sortTemplates() {
    function handler(a1, b1) {
        var a = $(a1).find('.iv-deadline').data('period');
        var b = $(b1).find('.iv-deadline').data('period');
        if (a === undefined) a = $(a1).find('.status-winner').length > 0 ? -2 : -1;
        if (b === undefined) b = $(b1).find('.status-winner').length > 0 ? -2 : -1;
        return b < a ? 1 : -1;
    }
    $('.list-group-contest-item').sort(handler).appendTo($('.list-group-contest-rows'))
}

// domains counters

function counters() {
    $('#counter-total').text($('.list-group-contest-item').length);
    $('#counter-win').text($('.status-winner').length);
    $('#counter-checking').text($('.iv-deadline:not(.highlight)').length);
    $('#counter-free').text($('.list-group-contest-item .contest-item-info:not(.has-candidate)').length);
    var tpls = 0;
    var t = $('.contest-item-templates a').map(function() {
        return $(this).text().match(/\d+/)
    }).get();
    t.map(function(t1){
        if (t1) tpls += parseInt(t1)
    })
    $('#counter-tpls').text(tpls)
}

(function() {
    $('.list-group-contest-header .contest-item-templates')
        .on('click', sortTemplates)
        .css('cursor','pointer')
        .append('<i class="iv-icon" style="margin-left:3px"></i>')
        .addClass('list-group-contest-order');
    $('#breadcrumb').append('<li><snap id="counter-total"></snap><snap style="font-weight:normal"> total</snap></li><li><snap id="counter-win"></snap><snap style="font-weight:normal"> win</snap></li><li><snap id="counter-checking"></snap><snap style="font-weight:normal"> checking</snap></li><li><snap id="counter-free"></snap><snap style="font-weight:normal"> free</snap></li><li><snap id="counter-tpls"></snap><snap style="font-weight:normal"> templates</snap></li>');
    counters();
    setInterval(counters, 60000)
})();