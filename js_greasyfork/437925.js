// ==UserScript==
// @name         Peacock Premier League Spoiler Remover
// @namespace    peacock-premier-league-spoiler-remover
// @version      0.1
// @description  Remove spoilers from Peacock Premier League video descriptions
// @author       Jason Mitchell
// @match        https://www.peacocktv.com/watch/*
// @copyright    2021+, pixelmaven.com
// @license      MIT 
// @icon         https://www.google.com/s2/favicons?domain=peacocktv.com
// @downloadURL https://update.greasyfork.org/scripts/437925/Peacock%20Premier%20League%20Spoiler%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/437925/Peacock%20Premier%20League%20Spoiler%20Remover.meta.js
// ==/UserScript==

setInterval(function(){
    var videoTitles = document.getElementsByClassName( "playlist-item-overlay__container-title" );

    if ( videoTitles.length > 0 )
    {
        for( const t of videoTitles)
        {
            var rawTitle = t.innerHTML;

            // These also sometimes includes spoilers, so just replace with generic text
            if ( rawTitle.includes( "PL Update" ) )
            {
                t.innerHTML = "Premier League Update";
            }

            // Remove scores from descriptions
            if ( rawTitle.includes( "Extended highlights" ) )
            {
                rawTitle = rawTitle.replace( /[0-9]/g, '' ); // Remove numbers (game scores)
                rawTitle = rawTitle.replace( ',', 'vs' );
                t.innerHTML = rawTitle;
            }
        }

        // Remove description elements (even thought they are typically hidden)
        var videoDescriptions = document.getElementsByClassName( "playlist-item-overlay__container-description" );
        while( videoDescriptions.length > 0 )
        {
            videoDescriptions[0].parentNode.removeChild( videoDescriptions[0] );
        }
    }
}, 1000)