// ==UserScript==
// @name        Simply Step 4
// @namespace   http://userscripts.org
// @description Simplify view of BGG Math Trades Step 4
// @include     http://bgg.activityclub.org/olwlg/mywants.cgi*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @version     0.4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/2936/Simply%20Step%204.user.js
// @updateURL https://update.greasyfork.org/scripts/2936/Simply%20Step%204.meta.js
// ==/UserScript==
//hide lines that are associated with dummy itens

    $('#wants .ondummy').hide();
    $('#wants .isdummy').hide();
    
    //adjust table size
    $('#wants tbody') .css('height', 'auto');

    $('<td/>', {
        id: "hideshow",
        html: "Toggle Dummy Association"
    }).insertAfter($('#tabofficial1'));

    $('#hideshow').click(function () {
        $('.isdummy').toggle();
        $('.ondummy').toggle();
    });
