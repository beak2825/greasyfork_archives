// ==UserScript==
// @name               [Deprecated] MovieChat.org Message Boards on IMDb.com [Desktop]
// @namespace          https://greasyfork.org/en/users/105361-randomusername404
// @version            2.10.1
// @description        Brings message boards back on IMDb by using MovieChat.org boards.
// @run-at             document-idle
// @include            *://*.imdb.com/title/*
// @include            *://*.imdb.com/name/*
// @exclude            *://m.imdb.com/*
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
// @contributor        Luckz
// @grant              none
// @icon               http://ia.media-imdb.com/images/G/01/imdb/images/favicon-2165806970._CB522736556_.ico
// @downloadURL https://update.greasyfork.org/scripts/441534/%5BDeprecated%5D%20MovieChatorg%20Message%20Boards%20on%20IMDbcom%20%5BDesktop%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/441534/%5BDeprecated%5D%20MovieChatorg%20Message%20Boards%20on%20IMDbcom%20%5BDesktop%5D.meta.js
// ==/UserScript==

$(window).on("load", function() {
    var pathname = window.location.pathname;

    // Get page ID
    var pageID;
    if (pathname.includes("title/")) {
        pageID = pathname.split("title/").pop();
    } else if (pathname.includes("name/")) {
        pageID = pathname.split("name/").pop();
    }
    pageID = pageID.split("/").shift();

    // Get iframe position and dimensions
    var positionReference = $('.article.contribute, [data-testid="contribution"]');
    var height = 800; //$(window).innerHeight() * 0.95;
    var width;
    if (pathname.includes("reference")) {
        width = $("#main").width() - 2;
    } else if (pathname.includes("name/")) {
        width = $(".article").width() + 12;
    } else {
        width = 840; // $("#nb20").width() - $("#sidebar").width() - 40;
    }

    // Set div to put the message boards into
    var myDiv;
    if (pathname.includes("title/")) {
        myDiv = document.createElement("section");
        $(myDiv).addClass('ipc-page-section ipc-page-section--base');
        $(myDiv).html('<div><div class="ipc-title ipc-title--section-title ipc-title--base ipc-title--on-textPrimary"><h3 class="ipc-title__text">MovieChat Boards</h3></div></div>')
    }
    else {
        myDiv = document.createElement("div");
        $(myDiv).addClass('article');
        $(myDiv).html('<h2>MovieChat Boards</h2>');
    }

    $(myDiv).insertBefore(positionReference);

    // Create the iframe
    var movieChat = document.createElement("iframe");
    $(movieChat).attr({ "src": "https://moviechat.org/" + pageID, "allowtransparency": "false" });
    $(movieChat).css({ "height": height + "px", "width": width + "px", "border": "none", "margin-left": "-12px", "margin-top": "-10px" });
    if (!pathname.includes("reference") && !pathname.includes("name/")) {
        $(movieChat).css({"margin-left": "-20px"});
    }

    $(myDiv).append(movieChat);

    // Add message under the iframe inviting people to visite MovieChat.org
    var externalLink = document.createElement("div");
    var pageTitle;
    if (pathname.includes("reference")) {
        pageTitle = $('h3[itemprop="name"]').text();
    } else {
        pageTitle = $('h1[itemprop="name"]').text();
    }
    $(externalLink).html('<hr/><span>Discuss <i>' + pageTitle + '</i> on the <a href="https://moviechat.org/' + pageID + '">MovieChat message boards</a> »</span>');

    $(myDiv).append(externalLink);
});