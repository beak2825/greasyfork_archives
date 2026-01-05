// ==UserScript==
// @name           ZeroHedge Lite
// @version        0.9
// @namespace   3933a9875c3c6a42a4eb0c584dd0a2b9
// @author         Menno van der Hurk
// @description    Removes the crap from ZH, fork of Zerocruft
// @require        http://code.jquery.com/jquery-1.7.1.min.js
// @include        http://*zerohedge.com/*
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/18740/ZeroHedge%20Lite.user.js
// @updateURL https://update.greasyfork.org/scripts/18740/ZeroHedge%20Lite.meta.js
// ==/UserScript==

$(function(){
    $("div#sidebar-left").remove();
    $("div#sidebar-right").remove();
    
    $("div#block-block-27").remove();
    $("div#block-block-23").remove();
    $("div#block-block-65").remove();
    $("div#block-block-66").remove();
    $('div#footer-region').remove();
    $('div#breadcrumb').remove();
    $('div.js-links').remove();
    $('div.clear').remove();
    $("br").remove();
 //   $("iframe").remove();
      
    $("div#main").css('margin-right', '0px');
    $("div#main").css('margin-left', '0px');
    $("span.taxonomy").css('margin-bottom','5px');
    $("span.taxonomy").css('margin-top','5px');
    
    $("div#squeeze").css('margin-right', '0px');
    $("div#squeeze").css('margin-left', '0px');
    $('#page').css('width','860px');
    $('div#header').css('min-height','40px');
    
    $("body").css("font-family", '"Segoe UI", Frutiger, "Frutiger Linotype", "Dejavu Sans", "Helvetica Neue", Arial, sans-serif');
    $("body").css("font-size", "14px");
    
    $('head').append('<style type="text/css">.jk-current {margin-left: -2px; border-left: 2px solid blue;}</style>');
    
    $('.view-newsflash-pages-after-main .views-row:first').toggleClass('jk-current');
    
    $(document.body).keypress(function (event) {
        // ignore keypresses in input fields
        if (document.activeElement.tagName == 'INPUT') {
            return;
        }
        
        var current = $('.jk-current');
        if (current.length === 0) {
            return;
        }
        
        var key = String.fromCharCode(event.which).toUpperCase();
        
        if (key === 'J' || key === ' ') { // J or space for next
            var next = $(current).next();
            if (next.length == 1) {
                $(next).toggleClass('jk-current');
                $(current).toggleClass('jk-current');
            }
        } else if (key == 'K') { // K for back
            var prev = $(current).prev();
            if (prev.length === 1) {
                $(prev).toggleClass('jk-current');
                $(current).toggleClass('jk-current');
                current = prev;
            }
        } else if (key == 'O' || event.which == 13) {
            $(current).find('a')[1].click();
        } else {
            return;
        }
        
        //scroll .jk-current to top of window
        $('html, body').animate({
            scrollTop: $(".jk-current").offset().top - 10
        }, 200);
    });
    
});