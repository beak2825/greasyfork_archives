// ==UserScript==
// @name         Mandarin Blueprint Tweaks
// @namespace    https://courses.mandarinblueprint.com/
// @version      0.6
// @description  Minor UI tweaks to the otherwise beautiful and clean Mandarin Blueprint Method course
// @author       Andrew Clapham
// @match        https://courses.mandarinblueprint.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406283/Mandarin%20Blueprint%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/406283/Mandarin%20Blueprint%20Tweaks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // First check to make sure that jQuery is loaded, incase the site is updated in future.
    window.onload = function() {
    if (window.jQuery)
    {
        // jQuery is in fact loaded

        // Remove comments by annoying commenters
        $(".comment__name").each(function(){
            console.log("Looking at comment by :" + $(this).text());
            if (["Rick Angleland"].indexOf($(this).text()) >= 0)
            {
                console.log("DETECTED.");
                $(this).closest(".comment").html("<p style=\"font-size: 96px;\">✨</p>");
                //.find(".comment__body").html("<p style=\"font-size: 96px;\">✨</p>");

            }

        });

        // Put an emoji on the "Next Character" button when you haven't finished all the videos on the page
        var plb = $(".playlist__body");

        if (plb.length == 0) // Check that it exists
        {
            console.log("MB Tweaks: No playlist body found (not on lessons page) -> Do nothing.");
        }
        else
        {
            console.log("MB Tweaks: Playlist body was found. Continue.");

            var nextbutton = plb.find(".track__more");

            var lastone = plb.find("a").not(".track--more").last();

            if (lastone.length == 0)
            {
                console.log("MB Tweaks: Could not find the last video link -> Do nothing.");
            }
            else
            {
                console.log("MB Tweaks: Found the last video link. Continue.");

                var checkspace = lastone.find(".media-right");
                var playingspace = lastone.find(".media-left");

                if (checkspace.length == 0)
                {
                    console.log("MB Tweaks: Could not find the space where the checkmark should be -> Do nothing.");
                }
                else if (playingspace.length ==0)
                {
                    console.log("MB Tweaks: Could not find the space where the number/playing icon should be -> Do nothing.");
                }
                else if($.trim(checkspace.html())=='') // If there's no checkmark on the last video
                {
                    console.log("MB Tweaks: Last video was not completed yet.");


                    if (playingspace.find(".active").length ==0)
                    {
                        // They aren't on the last video
                        console.log("MB Tweaks: They aren't on the last video, warn the user.");
                        nextbutton.html("⛔️ Next Character ⛔️");
                    }
                    else
                    {
                        // They're still watching it now
                        console.log("MB Tweaks: Don't change the button, they're on the last video");
                    }

                }
                else
                {
                    console.log("MB Tweaks: Last video was already completed, thumbs up.");
                    nextbutton.html("Next Character 👍");
                }
            }


            // Now click the "More comments" button twice, if it's there
            var morecommentsbutton = $("#show-more-comments-btn");

            if (morecommentsbutton.length == 0) // Check that it exists
            {
                console.log("MB Tweaks: No 'load more comments' button -> Do nothing.");
            }
            else
            {

                morecommentsbutton.click();
                setTimeout(
                    function()
                    {
                        $("#show-more-comments-btn").click();
                    }, 3000);
            }


        }

    } else {
        // jQuery is not loaded
        console.log("MB Tweaks: jQuery is not loaded -> Do nothing.");
    }
}


    
})();