// ==UserScript==
// @name               MovieChat.org Message Boards on TMDb
// @namespace          https://greasyfork.org/en/users/105361-randomusername404
// @version            1.00
// @description        Adds MovieChat message boards on TMDb.
// @run-at             document-start
// @include            *://*.themoviedb.org/movie/*
// @include            *://*.themoviedb.org/person/*
// @include            *://*.themoviedb.org/tv/*
// @require            https://code.jquery.com/jquery-3.3.1.min.js
// @author             RandomUsername404
// @grant              none
// @icon               https://www.themoviedb.org/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/367613/MovieChatorg%20Message%20Boards%20on%20TMDb.user.js
// @updateURL https://update.greasyfork.org/scripts/367613/MovieChatorg%20Message%20Boards%20on%20TMDb.meta.js
// ==/UserScript==

$(window).on("load", function() {
    var pathname = window.location.pathname;

    // Set MovieChat link
    var pageTitle = $('title').text();
    pageTitle = pageTitle.split(" —").shift();
    var DDG_URL;
    if (pathname.includes('movie') || pathname.includes('tv')) {
        DDG_URL = "https://duckduckgo.com/?q=!ducky+" + pageTitle.replace(/ /g, "+") + "+site:moviechat.org";
    } else {
        DDG_URL = "https://duckduckgo.com/?q=!ducky+" + pageTitle.replace(/ /g, "+") + "+site:moviechat.org/nm";
    }
    var MC_URL = "https://moviechat.org/search?name=" + pageTitle.replace("TV Series ", "").replace(/ /g, "+");

    // Add link to the MovieChat boards in the 'Discussions' menu
    $('#sub_menu_discussions > ul').append('<li><a target="OpenBlank" href="' + DDG_URL + '">MovieChat Boards</a></li>');

    // On a 'movie' or 'tv' page
    if (pathname.includes('movie') || pathname.includes('tv')) {

        // Create a submenu to put the boards into
        var MC_menu = document.createElement("li");
        $(MC_menu).attr("class", "");
        $(MC_menu).attr("dir", "auto");
        $(MC_menu).html('<a id="moviechat" class="media_panel" href="#">MovieChat Boards</a>');
        $(".menu > ul:first").append(MC_menu);

        // Define dimensions of the iframe
        var height = $(window).innerHeight() * 0.82;
        var width = $(".panel").width();

        // If submenu is clicked
        $(document).on("click", "#moviechat", function(event) {
            event.preventDefault();

            $("section.panel.media_panel.social_panel > section > div.menu > ul > li").each(function() {
                $(this).removeClass('active');
                console.log(this);
            });

            $(MC_menu).addClass('active');

            // Put the iframe in the submenu
            $('.review > .content').empty();
            var movieChat = document.createElement("iframe");
            $(movieChat).attr({ "src": MC_URL, "allowtransparency": "false", "sandbox": "allow-same-origin allow-scripts" });
            $(movieChat).css({ "height": height + "px", "width": width + "px", "border": "none" });
            $('.review > .content').append(movieChat);

            // Add message under the iframe inviting people to visite MovieChat.org
            var externalLink = document.createElement("div");
            $(externalLink).html('<hr/><span>Discuss <i>' + pageTitle + '</i> on the <a style="color:#01cf75;" target="OpenBlank" href="' + DDG_URL + '"><b>MovieChat message boards</b></a></span>');
            $('.review > .content').append(externalLink);

        });

    }
    // On an actor page
    else {
        // Create the area to put the boards into
        var MC_menu = document.createElement("div");
        $(MC_menu).html('<h3 class="zero">MovieChat Boards</h3>');
        $(MC_menu).css('margin-top', '50px');
        $(MC_menu).insertAfter('.credits_list');

        // Define dimensions of the iframe
        var height = $(window).innerHeight() * 0.84;
        var width = $(".credits_list").width();

        // Put the iframe in the area
        var movieChat = document.createElement("iframe");
        $(movieChat).attr({ "src": MC_URL, "allowtransparency": "false", "sandbox": "allow-same-origin allow-scripts" });
        $(movieChat).css({ "height": height + "px", "width": width + "px", "border": "none" });
        $(MC_menu).append(movieChat);

        // Add message under the iframe inviting people to visite MovieChat.org
        var externalLink = document.createElement("div");
        $(externalLink).html('<hr/><span>Discuss <i>' + pageTitle + '</i> on the <a style="color:#01cf75;" target="OpenBlank" href="' + DDG_URL + '"><b>MovieChat message boards</b></a></span>');
        $(MC_menu).append(externalLink);

    }

});