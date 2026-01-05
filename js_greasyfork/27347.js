// ==UserScript==
// @name         Goodreads_Giveaway
// @namespace    https://greasyfork.org/users/98044
// @version      1.8
// @description  Clicking buttons opens a new tab window that auto-enters and then closes the window. Changes background color to grey.
// I've included the code for an arrow pager by Soon Van - randomecho.com. The auto-enter came from ttmyller.
// @author       Davinna
// @icon         https://turkerhub.com/data/avatars/l/0/594.jpg?1485199123
// @include      *www.goodreads.com/giveaway*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @license      https://opensource.org/licenses/MIT
// @copyright    2017-2018 Davinna
// @downloadURL https://update.greasyfork.org/scripts/27347/Goodreads_Giveaway.user.js
// @updateURL https://update.greasyfork.org/scripts/27347/Goodreads_Giveaway.meta.js
// ==/UserScript==

// Change this to false if you want always click the last submit button manually
var autoSubmit = true;

$(document).ready(function(){

    //change background color
    document.body.style.backgroundColor = "gray";
    document.getElementsByClassName('mainContent')[0].style.backgroundColor = "gray";
    document.getElementsByClassName('mainContentFloat')[0].style.backgroundColor = "gray";

    //open Giveaway in a new tab by clicking button
    $("a[class=gr-button]").click(function(event)
                                  {
        //prevent default behavior of "Enter Giveaway" buttons
        event.preventDefault();

        //open Giveaway in a new window
        // Change these to change the position and size of the giveaway window
        var myWindow = window.open(event.target.href,"","left=1300,top=100,width=300,height=300");

    });

    // Select (first) address if needed
    clickFirst("a:contains('Select This Address')");

    // Check terms and conditions checkbox
    clickFirst("#termsCheckBox");

    // Uncheck the "add in to-read shelf"
    clickFirst("#want_to_read");

    if (autoSubmit)
    {
        clickFirst("#giveawaySubmitButton");
    }
    //close window
    var status = false;
    if(document.getElementsByClassName("mediumTextBottomPadded").length > 0){status=true;}

    if(status && window.opener !== null)
    {
        window.close();
    }

});//end of document.ready

//Auto-enter by @author ttmyller
function clickFirst(selector)
{
    var x = $(selector);
    if (x.length > 0)
    {
        x[0].click();
    }
}

// Arrow Pager by @author   Soon Van - randomecho.com
function arrowPager(e)
{
    var pager_class = '';

    if (e.keyCode == 37)
    {
        pager_class = 'previous_page';
    }
    else if (e.keyCode == 39)
    {
        pager_class = 'next_page';
    }

    if (pager_class !== '')
    {
        // There should be only one link classed as either, so grab it
        var pager_node = document.getElementsByClassName(pager_class);

        if (typeof(pager_node[0]) != 'undefined')
        {
            var page_url = pager_node[0].getAttribute('href');

            // First and last pager links will not have a URL set
            if (page_url)
            {
                document.location = page_url;
            }
        }
    }
}

document.addEventListener('keydown', arrowPager, false);