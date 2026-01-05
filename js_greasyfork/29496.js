// ==UserScript==
// @name         MovieChat.org on IMDb/TMDb - Desktop Companion
// @version      1.37
// @description  Makes MovieChat.org look more streamlined when displayed within a IMDb or TMDb page.
// @author       RandomUsername404
// @match        *://moviechat.org/*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @run-at       document-start
// @grant        none
// @icon         http://moviechat.org/favicons/favicon.ico
// @namespace    https://greasyfork.org/users/105361
// @downloadURL https://update.greasyfork.org/scripts/29496/MovieChatorg%20on%20IMDbTMDb%20-%20Desktop%20Companion.user.js
// @updateURL https://update.greasyfork.org/scripts/29496/MovieChatorg%20on%20IMDbTMDb%20-%20Desktop%20Companion.meta.js
// ==/UserScript==

$(function() {
    var width = $(window).width();
    var url = window.location.pathname;
    url = url.slice(1,7);

    // If current width <= 824px
    if (width <= 824) {
        $('.container').css('padding-right', '0px');
        $('.container').css('padding-left', '0px');
        $('.container').css('margin-right', '0');
        $('.container').css('margin-left', '0');
        $('.board-collection').css('padding-top', '0px');

        // Tweaks for the combined view
        if (width >= 800 && width <= 824) {
            $(".main").css('margin-left', '-5px');
            $(".main").css('margin-right', '-60px');
            $(".btn-block").css('display', 'inline-block');
        }

        // Hide top-bar
        $("nav.navbar.navbar-default").hide();

        // Hide footer
        $(".footer").hide();

        // Hide bottom scrollbar
        $("html").css( {'overflow-x':'hidden','margin-top':'-15px'} );

        var tree_structure = "#wrap > div.main > div > div > div:nth-child(1) > div";

        // (Only on threads view)
        if ((!url.includes('login') || !url.includes('signup')) || (!url.includes('user') || !url.includes('blog'))) {

            // Hide the description
            $(".movie-overview").hide();

            // Hide tree structure
            $(tree_structure).hide();

            // Remove the "news, rumors & gossip" tab
            //$("ul.nav.nav-tabs").hide();

            var newDiv = document.createElement("div");
            $(newDiv).css({"margin-bottom": "-10px"});

            // Keep 'add new post' button
            $(newDiv).append($('#discover'));

            // Keep the navbar
            $(newDiv).append($('.nav.navbar-nav.navbar-right'));

            // Show everything but the search button
            $(newDiv).insertBefore($('.main'));
            $('#discover').css( {'width':'46%','left':'5px'} );
            $("#compact-search").css('display','none');
            $('.nav.navbar-nav.navbar-right').css('padding-right','10px');

            // Make author's names visible when possible
            if (width >= 450 && width < 770) {
                var authorDiv = $(".col-xs-3:last-child");
                (authorDiv).removeClass('hidden-xs');
                $('.col-xs-3').css('width', '16%');
                $(authorDiv).css( {'width':'18%','text-align':'left'} );
                //$(authorDiv).css( {'overflow':'hidden','text-overflow':'ellipsis'} );
            }

        }

        // Within a thread
        $(".post").each(function(){

            // Show tree structure
            $(tree_structure).show();

           /* var threadDiv = document.createElement("div");

            // Keep the navbar
            $(threadDiv).append($('.nav.navbar-nav.navbar-right'));

            // Show everything but the search button
            $(threadDiv).insertBefore($('#wrap'));
            $("#compact-search").css('display','none');*/
        });

        // On specific pages
        if ((url.includes('login') || url.includes('signup')) || (url.includes('user') || url.includes('blog'))) {
            // Show tree structure (which could be a number of things in this case)
            $(tree_structure).show();
        };
    }

    // Remove grey background
    $(".main").css('box-shadow','0px 0px 0px 0px rgba(0,0,0,0)');
    $("body").css('background-color','white');
});