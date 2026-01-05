// ==UserScript==
// @name        MaximumPC Troll Remover
// @namespace   maximumpc.jerkoffs
// @description Remove trolls from comments to articles posted on www.maximumpc.com
// @include     http://www.maximumpc.com/*
// @require     http://code.jquery.com/jquery-latest.js
// @version     1.0.4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/48/MaximumPC%20Troll%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/48/MaximumPC%20Troll%20Remover.meta.js
// ==/UserScript==

$(function () {
    var joList = ["maxeeemum",
                  "RUSENSITIVESWEETNESS",
                  "dbqfan",
                 ];
    
    var joLength = joList.length;
    var numJoComments = 0;
                  
    var thisJo, userName, ref;
    
    // The MPC site stores most usernames in all lower case. Over the years, it looks like
    // different MPC programmers have made up their own quirky conversion rules and introduced  
    // random bugs...this means there are some edge cases that aren't covered here.
    for(var i=0; i<joLength; i++)
    {
        thisJo = encodeURIComponent(joList[i].replace('.', '')   // Periods in usernames are allowed but are not stored
                                             .replace(' ', '_')) // Spaces in usernames are (normally) replaced with underscores 
                                   .toLowerCase();

        joList[i] = thisJo;
    }
    
    // Rinse and repeat
    $('a[title="View user profile."]').each(function(index, value) 
    {
        ref = value.href;
        
        userName = ref.substring(ref.lastIndexOf("/") + 1)
                      .toLowerCase();

        for(var i=0; i<joLength; i++) 
        {
            if(userName == joList[i])
            {
                $(this).closest('div.comment-published').detach();
                numJoComments++;
                break;
            }
        }
     });

    // Update the 'number of comments' bubbles
    if(numJoComments)
    {
        var $topBubble = $('div.comments_wordbubble');
        var $bottomBubble = $('div.comments_bigbubble');
        
        var numComments = $topBubble.text() + ' (' + numJoComments + ')';
        
        $topBubble.css({'width':'50px', 'padding':'0px'})
                  .text(numComments);
        
        // The bubble background is part of a composited bitmap, so decrease font size to handle 100+ comment threads
        $bottomBubble.css({'padding-top':'9px', 'font-size':'15px'})
                     .text(numComments);
    }
});