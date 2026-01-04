// ==UserScript==
// @name         Reddit Sellers Filter
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Hide posts by onlyfans and other sellers
// @author       nvrmnd
// @match        https://old.reddit.com/*
// @exclude      https://old.reddit.com/user/*
// @icon         https://www.google.com/s2/favicons?domain=reddit.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425260/Reddit%20Sellers%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/425260/Reddit%20Sellers%20Filter.meta.js
// ==/UserScript==

(function() {
    if (window.top != window.self) {
        //-- Don't run on frames or iframes
        return;
    }
    console.log("🐒🔧💥");
    'use strict';

    setInterval( main, 5000 );
})();

function main() {
    //console.log( "ONLYFAN FILTER TRIGGERING" );
    var $ = window.jQuery;
    var jQuery = window.jQuery;

    // Put any sellers you still want to see here, comma-delimited and lower-case
    var exceptionsList = ["some_user_name", "some_other_user"];

    // The RegEx of things to exclude; the first part tries to avoid excluding people saying things like "I don't have an onlyfans!"
    // If you want to add something, just slap it on the end like |(my new phrase)
    var sellerMatches = "(?<!(no )|(don't have )|(don't have an ))(([Oo]nly[Ff]ans)|([Oo]nly.*[Ff]ans)|(ONLYFANS)|(OF)|([Tt][Oo][Pp] [\d.]+%)|(linktr.ee)|(allmylinks)|([Hh]utt.co)|($[/d.]+)|(on sale)|(current sale)|(custom content))";
    var sellerRegEx = new RegExp( sellerMatches , "m" );

    $( ".thing" ).each(function() {
        var rThing = $( this );
        if( rThing.attr("data-sellerFilter") == "scanned" ) { return; } // Don't run on users we already filtered

        var rUser = rThing.attr( "data-author" );
        if( rUser !== undefined ) {
            // Mark it so we don't have to scan it again
            rThing.attr('data-sellerFilter', 'scanned');

            // Skip exceptions
            if( exceptionsList.indexOf(rUser.toLowerCase()) > -1 ) {
                console.log( rUser, ": SKIPPING EXCEPTION" );
                return;
            }

            // Use API to get the about page for the user via AJAX
            $.getJSON('https://www.reddit.com/user/'+rUser+'/about/.json', function(jd) {
                // Get their public description
                var rPubDesc = jd.data.subreddit.public_description;
                if( rPubDesc !== "" ) {
                    // Try and find seller keywords in user description and hide those posts
                    //console.log( rUser, rPubDesc );
                    if( rPubDesc.search(sellerRegEx) >= 0 ) {
                        console.log( rUser, ": FILTERED");
                        rThing.css( "display", "none" );
                    }
                }
            });
        }
    });
}