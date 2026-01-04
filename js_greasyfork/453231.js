// ==UserScript==
// @name         MEGAMU Better UX
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds missing links and changes the account list to a dropdown
// @author       Rodrigo Corrêa
// @match        https://megamu.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=megamu.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455250/MEGAMU%20Better%20UX.user.js
// @updateURL https://update.greasyfork.org/scripts/455250/MEGAMU%20Better%20UX.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var accs = $('#navbar > ul.nav.navbar-nav.navbar-right > li:nth-child(1) > div > ul > li');
    var values = [];
    for(var i = 12; i < accs.length; i++){
        var acc = $(accs[i]).find('a');
        values.push([acc.attr('href'), acc.text()]);
        $(accs[i]).remove();
    }
    $("<li><label class='youplay-select'><select id='accounts-select'><option>-- CONTAS --</option></select></label></li>").insertAfter(accs[11]);
    $.each(values, function (i, item) {
        $('#accounts-select').append($('<option>', {
            value: item[0],
            text : item[1]
        }));
    });
    $('#accounts-select').on('change', function(e){
        window.location.href = '/'+$(this).val();
    });
    $('ul.panel-menu > li:nth-child(2)').after("<li><a href='/panel/awards'>Awards</a></li>");
    $('ul.panel-menu > li:nth-child(2)').after("<li><a href='/panel/roulette'>Roulette</a></li>");
})();