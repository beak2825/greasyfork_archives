// ==UserScript==
// @name               MovieChat.org Message Boards on m.IMDb.com
// @namespace          https://greasyfork.org/en/users/105361-randomusername404
// @version            1.34
// @description        Brings message boards back on IMDb mobile site by using MovieChat.org boards.
// @run-at             document-start
// @include            *://m.imdb.com/title/*
// @include            *://m.imdb.com/name/*
// @exclude            *://*.imdb.com/*/*/releaseinfo*
// @exclude            *://*.imdb.com/*/*/bio*
// @exclude            *://*.imdb.com/*/*/publicity*
// @exclude            *://*.imdb.com/*/*/otherworks*
// @exclude            *://*.imdb.com/*/*/awards*
// @exclude            *://*.imdb.com/*/*/mediaindex*
// @exclude            *://*.imdb.com/*/*/videogallery*
// @exclude            *://*.imdb.com/*/*/fullcredits*
// @exclude            *://*.imdb.com/*/*/plotsummary*
// @exclude            *://*.imdb.com/*/*/synopsis*
// @exclude            *://*.imdb.com/*/*/keywords*
// @exclude            *://*.imdb.com/*/*/parentalguide*
// @exclude            *://*.imdb.com/*/*/locations*
// @exclude            *://*.imdb.com/*/*/companycredits*
// @exclude            *://*.imdb.com/*/*/technical*
// @exclude            *://*.imdb.com/*/*/trivia*
// @exclude            *://*.imdb.com/*/*/soundtrack*
// @exclude            *://*.imdb.com/*/*/faq*
// @exclude            *://*.imdb.com/*/*/reviews*
// @require            https://code.jquery.com/jquery-3.3.1.min.js
// @author             RandomUsername404
// @grant              none
// @icon               http://ia.media-imdb.com/images/G/01/imdb/images/mobile/apple-touch-icon-mobile-2541571834._CB522736227_.png
// @downloadURL https://update.greasyfork.org/scripts/28263/MovieChatorg%20Message%20Boards%20on%20mIMDbcom.user.js
// @updateURL https://update.greasyfork.org/scripts/28263/MovieChatorg%20Message%20Boards%20on%20mIMDbcom.meta.js
// ==/UserScript==

$(window).on( "load", function() {
    var pathname = window.location.pathname;

    // Get page ID, iframe position and its dimensions
    var pageID;
    var positionReference;
    var width;
    var height = $(window).innerHeight()*0.9;
    if (pathname.includes("title/")) {
        pageID = pathname.split("title/").pop();
        positionReference = $('.row:last');
        width = $("#titleOverview").width();
    } else if (pathname.includes("name/")) {
        pageID = pathname.split("name/").pop();
        positionReference = $('#related-news').parent();
        width = $("#name-overview").width();
    }
    pageID = pageID.split("/").shift();

    // Set div to put the message boards into
    var myDiv = document.createElement("div");
    $(myDiv).addClass('col-xs-12');
    $(myDiv).html('<h2>MovieChat Boards</h2>');
    $(myDiv).insertBefore(positionReference);

    // Create iframe
    var movieChat = document.createElement("iframe");
    $(movieChat).attr({"src":"https://moviechat.org/" + pageID});
    $(movieChat).css( {"height":height+"px", "width":width+"px", "border":"none", "margin-top": "-10px"} );
    if (pathname.includes("title/")) {
        $(movieChat).css({"margin-left":"-10px"});
    }
    $(myDiv).append(movieChat);

    // Add message under the iframe inviting people to visite MovieChat.org
    var externalLink = document.createElement("div");
    $(externalLink).html('<hr/><span>Discuss this topic on the <a style="color:#136cb2;" href="https://moviechat.org/' + pageID + '">MovieChat message boards »</a></span>');
    $(myDiv).append(externalLink);
 });