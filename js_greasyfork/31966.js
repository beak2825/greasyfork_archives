// ==UserScript==
// @name         SSC Scroll to bottom
// @namespace    el nino
// @version      1.50
// @author       el nino
// @description  Scroll to bottom
// @include      *://www.skyscrapercity.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/31966/SSC%20Scroll%20to%20bottom.user.js
// @updateURL https://update.greasyfork.org/scripts/31966/SSC%20Scroll%20to%20bottom.meta.js
// ==/UserScript==

var icon_up =   'data:image/png;base64,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';

$(function() {
    if (window.self !== window.top) return;

    $("<img>", {
        "src": icon_up,
        "id": "scroll-to-bottom",
        "style": "position: fixed; bottom: 30px; right: 80px; height: 43px; width: 43px; cursor: pointer; opacity: 0.5",
        "width": "43px", "height": "43px"})
        .appendTo("body");

    if($(document).height() - $(window).height() - $(window).scrollTop() < 100){
        $('#scroll-to-bottom').hide();
    }

    $(window).on("load resize scroll",function(){
        //var scrollBottom = $(window).scrollTop() + $(window).height();
        var scrollBottom = $(document).height() - $(window).height() - $(window).scrollTop();
        if(scrollBottom > 100) $('#scroll-to-bottom').fadeIn();
        else $('#scroll-to-bottom').fadeOut();
    });

    $("#scroll-to-bottom").click(function() {
        //var scrollBottom = $(window).scrollTop() + $(window).height();
        var scrollBottom = $(document).height() - $(window).height() - $(window).scrollTop();
        $('body,html').animate({ scrollTop: scrollBottom }, 600);
    });
});

