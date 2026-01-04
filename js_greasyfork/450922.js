// ==UserScript==
// @name         Remove "Related Tweets" bullshit
// @version      1.0
// @description  Remove Related Tweets bullshit
// @author       You
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant		 none
// @namespace https://greasyfork.org/users/232210
// @downloadURL https://update.greasyfork.org/scripts/450922/Remove%20%22Related%20Tweets%22%20bullshit.user.js
// @updateURL https://update.greasyfork.org/scripts/450922/Remove%20%22Related%20Tweets%22%20bullshit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Let's go...");
    var i;
    var y;
    //var twitterBeingSneakyBastards = ["Related Tweets","More Tweets"]

var checkForRelatedTweetsTimer = setInterval(checkForRelatedTweets,10);
function checkForRelatedTweets()
{
    for (i = 0; i < ('h2[role="heading"]').length; i++)
    {
        //console.log("Checking " + i);

        if (jQuery('h2[role="heading"]').eq(i).text() == "Related Tweets" || jQuery('h2[role="heading"]').eq(i).text() == "More Tweets")
        {
            //console.log("A: " + i);
            clearInterval(checkForRelatedTweetsTimer);
            break;
        }
    }

    for (y = 0; y < jQuery('h2[role="heading"]').eq(i).parents().length; y++)
    {
        //console.log("Checking " + y);

        if (jQuery('h2[role="heading"]').eq(i).parents().eq(y).is("[data-testid]"))
        {
            //console.log("B: " + y);
            break;
        }

    }

    deleteThatBitch(i,y);
}

function deleteThatBitch(i,y)
{
    //console.log("Passed index is " + i + " & " + y);

    var sneakyTimer = setInterval(sneakyFunc,100);
    function sneakyFunc()
    {
        if (jQuery('h2[role="heading"]').eq(i).parents().eq(y).next().is("div"))
        {
            jQuery('h2[role="heading"]').eq(i).parents().eq(y).next().remove();
            //console.log("Removed");
        }
    }
}


})();