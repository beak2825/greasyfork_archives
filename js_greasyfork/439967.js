// ==UserScript==
// @name         NoFacebookSuggest
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove suggested and sponsored facebook.com posts.
// @author       ckiikc
// @match        https://www.facebook.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=facebook.com
// @require      http://code.jquery.com/jquery-latest.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439967/NoFacebookSuggest.user.js
// @updateURL https://update.greasyfork.org/scripts/439967/NoFacebookSuggest.meta.js
// ==/UserScript==

(function() {
    'use strict';

function CheckForADPosts()
{
    RemovePost( "span:contains('Contenuto suggerito per te')" );
    RemovePost( "span:contains('Sponsorizzato')" );
    RemovePost( "a:contains('Sponsorizzato')" );
    RemovePost( "span:contains('Suggested Post')" );
    RemovePost( "span:contains('Sponsored')" );
    RemovePost( "a:contains('Sponsored')" );

    setTimeout(CheckForADPosts, 100);
}

function RemovePost(subquery)
{
    var query = "div[data-pagelet*='FeedUnit_']";
    var len = $(query).find(subquery).length;

    for (var i=0; i<len; i++)
    {
        var elem = $(query).find(subquery).get(i);
        if (!elem)
            continue;

        while(elem)
        {

            if (typeof $(elem).attr('data-pagelet') !== typeof undefined)
                break;

            elem = $(elem).parent().get(0);
            //alert($(elem).text());

        }

        if (elem){
            $(elem).remove();
        }

    }
}

setTimeout(CheckForADPosts, 500);


})();