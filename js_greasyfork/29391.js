// ==UserScript==
// @name         MovieChat.org - Mobile Companion
// @version      1.21
// @description  A more compact view for MovieChat.org on mobile.
// @author       RandomUsername404
// @match        https://moviechat.org/*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @run-at       document-start
// @grant        none
// @icon         http://moviechat.org/favicons/favicon.ico

// @namespace https://greasyfork.org/users/105361
// @downloadURL https://update.greasyfork.org/scripts/29391/MovieChatorg%20-%20Mobile%20Companion.user.js
// @updateURL https://update.greasyfork.org/scripts/29391/MovieChatorg%20-%20Mobile%20Companion.meta.js
// ==/UserScript==

$(document).ready(function() {
    var width = $(window).width();

    // If current width <= 770px :
    if(width <= 770)
    {
        // Enlarge view and hide scrollbars
        $('.container').css( {'padding-right':'0px','padding-left':'0px','margin-right':'0','margin-left':'0','width':'100%'} );
        $('html').css('overflow', 'hidden');

        // Move the logo slightly on the right
        $('#logo').css('margin-left', '1em');

        // Slightly move the navbar
        $('.navbar-right').css('margin-right', '0px');

        // Reduce the top-bar size
        $('.col-md-12').css('height', '4.8em');
        $('.navbar').css('height', '4.8em');
        $('.container').css('margin-top', '-0.7em');

        // Hide the description and add a button to display it when requested
        $(".movie-overview").hide();
        var descriptionButton = $('<a class="btn btn-yellow btn-block" id="despBtn" href="#">Overview</a>');
        descriptionButton.insertBefore($("#discover"));
        $("#despBtn").css("margin-top","5px");

        $("#despBtn").click(function(event){
            event.preventDefault();
            $(".movie-overview").toggle();
        });

        // Make the author's name visible when possible
        if(width >= 450)
            {
                var authorDiv = $(".col-xs-3:last-child");
                (authorDiv).removeClass('hidden-xs');
                $('.col-xs-3').css('width', '16%');
                $(authorDiv).css( {'width':'18%','text-align':'left','overflow':'hidden','text-overflow':'ellipsis'} );
            }

        // Remove the huge ads at the bottom of the screen
        //$("#rcjsload_358172").hide();

        // Remove footer
        $(".footer").hide();
        $('body').css('background', 'white');
    }

 });