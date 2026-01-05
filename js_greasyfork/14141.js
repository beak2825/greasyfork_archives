// ==UserScript==
// @name         SSC Scroll to top
// @namespace    el nino
// @version      2.50
// @author       el nino
// @description  Scroll to top
// @include      *://www.skyscrapercity.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/14141/SSC%20Scroll%20to%20top.user.js
// @updateURL https://update.greasyfork.org/scripts/14141/SSC%20Scroll%20to%20top.meta.js
// ==/UserScript==

var icon_up =   'data:image/png;base64,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';

$(function() {
    if (window.self !== window.top) return;

    $("<img>", {
        "src": icon_up,
        "id": "scroll-to-top",
        "style": "position: fixed; bottom: 30px; right: 30px; height: 43px; width: 43px; cursor: pointer; opacity: 0.5;",
        "width": "43px", "height": "43px"})
        .appendTo("body");

    if($(window).scrollTop() < 100){
        $('#scroll-to-top').hide();
    }
    
    $(window).on("load resize scroll",function(){
        if($(window).scrollTop() > 100) $('#scroll-to-top').fadeIn();
        else $('#scroll-to-top').fadeOut();
    });

    $("#scroll-to-top").click(function() {
        $('body,html').animate({ scrollTop: 0 }, 600);
    });
});

