// ==UserScript==
// @name        Races
// @author      Hunter
// @description Hybrid Races
// @include     *
// @version     1.1
// @match       https://www.gethybrid.io/workers/tasks/*
// @require http://code.jquery.com/jquery-latest.js
// @namespace https://greasyfork.org/en/users/21792-hunterwashere
// @downloadURL https://update.greasyfork.org/scripts/412022/Races.user.js
// @updateURL https://update.greasyfork.org/scripts/412022/Races.meta.js
// ==/UserScript==

$(document).ready(function() {

    $(".radio").css("float", "left").css("max-height", "1px").css("padding-left", "5px");
    $("img").css("max-height", "250px").css("max-width", "250px");
    $(".task-response-submission").css("display", "inline-block");

    for (var i=2; i<=30 ;i++) {
        var firstButton = $('div[class="item-response order-'+i+'"]').find(".radio").eq(0);
        var lastButton = $('div[class="item-response order-'+i+'"]').find(".radio").eq(7);
        firstButton.insertAfter(lastButton);
    }

    $('input:radio:first').focus();

});

