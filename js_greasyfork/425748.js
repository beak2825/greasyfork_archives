// ==UserScript==
// @name        Races
// @author      Hunter
// @description Hybrid Races
// @include     *
// @match       https://www.gethybrid.io/workers/tasks/*
// @require http://code.jquery.com/jquery-latest.js
// @version 0.0.1.20210430173031
// @namespace https://greasyfork.org/users/21792
// @downloadURL https://update.greasyfork.org/scripts/425748/Races.user.js
// @updateURL https://update.greasyfork.org/scripts/425748/Races.meta.js
// ==/UserScript==


    $(".radio").css("float", "left").css("max-height", "1px").css("padding-left", "5px");
    $("img").css("max-height", "300px").css("max-width", "300px");
    $(".task-response-submission .item-response, .task-response-submission .instructions, .task-response-submission .fields-text").css("display", "inline-block");
    $(".task-response-submission .item-response, .task-response-submission .instructions, .task-response-submission .fields-text").css("width", "25vw");
$('.fields-text').hide();
$('.instructions').hide();

$('input:radio').focus(function(){
    var center = $(window).height()/2;
    var top = $(this).offset().top ;
    if (top > center){
        $(window).scrollTop(top - 0);
        $(this).parent().css("background-color", "red");
    }
});

    for (var i=2; i<=30 ;i++) {
        var firstButton = $('div[class="item-response order-'+i+'"]').find(".radio").eq(0);
        var lastButton = $('div[class="item-response order-'+i+'"]').find(".radio").eq(7);
        firstButton.insertAfter(lastButton);
    }

    $('input:radio:first').focus();






