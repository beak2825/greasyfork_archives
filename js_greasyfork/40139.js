// ==UserScript==
// @name         Clean Roosterteeth.com
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes all the extra bloat on every channel page of the new(2018) Roosterteeth.com, reducing the choppy scrolling and generally poor website performance in chrome.
// @author       BoJaN
// @match        *roosterteeth.com/*
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/40139/Clean%20Roosterteethcom.user.js
// @updateURL https://update.greasyfork.org/scripts/40139/Clean%20Roosterteethcom.meta.js
// ==/UserScript==

function removeExtraCarousels()
{
    var channels = $('.channel-carousels .carousel-container');
    if(channels.length > 0) //Make sure there are channel carousels, if there aren't this is probably the main page.
    {
        var extras = $('.extra-carousels .carousel-container');
        var removed = extras.length;

        extras.each(function( index ) {
            $(this).remove();
        });

        if(removed > 0)
        {
            //clearInterval(interval); //Commented because the script isn't executed again when we change pages, we must continually check for extras to remove...
            console.log("Removed " + removed + " carousels");
        }
    }
}

var interval = setInterval(removeExtraCarousels, 1000);