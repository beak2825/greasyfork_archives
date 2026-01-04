// ==UserScript==
// @name           PH | Basics
// @version        1.4
// @namespace      js_notes
// @description    Blah
// @include        https://www.pornhub.com/gay/*
// @include        https://www.pornhub.com/gayporn*
// @include        https://www.pornhub.com/gay/video*
// @require        https://code.jquery.com/jquery-latest.min.js
// @grant          GM_xmlhttpRequest
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          unsafeWindow
// @icon           https://www.google.com/s2/favicons?domain=www.pornhub.com/
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/473731/PH%20%7C%20Basics.user.js
// @updateURL https://update.greasyfork.org/scripts/473731/PH%20%7C%20Basics.meta.js
// ==/UserScript==



var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-latest.min.js';
script.setAttribute("id", "customJQuery");
document.body.appendChild(script);





(function() {

    console.log('=============||||| RUNNING PH WATCH BASICS 1.4  |||||==============');



    // ========= REMOVE ELEMENTS =========
    $('.topAdContainter').remove();
    $('#welcomeVideoMsg').remove();
    $('.adContainer').remove();

    $(".middleAdContainer").each(function() {
        $(this).parents("li").remove();
    });

    $('footer').remove();




    // ========= REMOVE CLASS =========
    $(".js-popUnder").removeClass('js-popUnder');
    $(".js-pop").removeClass('js-pop');
    $('.paginationGated').removeClass('paginationGated');
    $('.notPremium').removeClass("notPremium");




    // ========= TARGET BLANK =========
    $('.imageLink').attr('target', '_blank');
    $('.userInfoContainer a').attr('target', '_blank');




    // ========= VIDEO GRID EDITS =========
    $(".videoList li").each(function() {

        $(this).addClass('videoBox');
        $(this).find(".js-pop").removeClass('js-pop');
        $(this).find(".js-popUnder").removeClass('js-popUnder');
        $(this).find(".js-flipbookOn").removeClass('js-flipbookOn');


        $(this).find('a').removeAttr('onclick');

        $(this).find('.title a').removeAttr('onclick');
        $(this).find('.title a').attr('target', '_blank');

    });










    $(document).on("click", function(e) {
        console.log(e.target);
    });


})();