// ==UserScript==
// @name         vdc pre code block converter
// @namespace    http://tampermonkey.net/
// @version      0.17
// @description  try to take over the pootis!
// @author       MrKleiner
// @match        https://developer.valvesoftware.com/wiki/*
// @icon         https://www.google.com/s2/favicons?domain=valvesoftware.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427951/vdc%20pre%20code%20block%20converter.user.js
// @updateURL https://update.greasyfork.org/scripts/427951/vdc%20pre%20code%20block%20converter.meta.js
// ==/UserScript==

function defer(method) {
    if (window.jQuery) {
        weready();
    } else {
        setTimeout(function() { defer(method) }, 100);
    }
}

defer();

function weready()
{
    $('#p-tb ul').append('<li><a id="call_pre_converter">Convert pre blocks</a></li>');
    $("#call_pre_converter").click(function(e){
        $(this).closest('li').remove();
        make_rows_hover();
    });
}

function make_rows_hover()
{
    $('body').append('<style>.liz3_vdc_line:hover{background:linear-gradient(0deg,rgba(0,0,0,.08) 0,rgba(0,0,0,.08) 100%)}</style>');
    $('.mw-parser-output pre').each(function(){
        var local_cont = $(this);
        var local_shit = $(this).text().split('\n');
        $(this).text('');
        for (var key in local_shit) {
            $(local_cont).append('<div class="liz3_vdc_line">' + local_shit[key] + '</div>');
        }
    });
}