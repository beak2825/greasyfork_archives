// ==UserScript==
// @name         Twitchls Dark Chat
// @namespace    tampermonkey_twitchls
// @version      0.4
// @description  change chat to use dark mode
// @author       dixbutts
// @match        https://twitchls.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416175/Twitchls%20Dark%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/416175/Twitchls%20Dark%20Chat.meta.js
// ==/UserScript==

window.addEventListener("load", function( ) { updateEmbeddedChat( ); });
window.addEventListener("popstate", function( ) { updateEmbeddedChat( ); });

function updateEmbeddedChat( ) {
    var interVar = setInterval( function( ) {
        var iframes = document.querySelectorAll("iframe");

        for( var i = 0; i < iframes.length; ++i )
        {
            var embedSrc = iframes[ i ].getAttribute( "src" );
            var bindSrc = iframes[ i ].getAttribute( "x-bind:src" );

            if( !embedSrc || !bindSrc || !embedSrc.length || !bindSrc.length )
            {
                continue;
            }

            var findStr = '/chat?';
            var insStr = 'darkpopout';
            var embedStrPos = embedSrc.indexOf( findStr );
            var bindStrPos = bindSrc.indexOf( findStr );

            if( embedStrPos == -1 || bindStrPos == -1 )
            {
                continue;
            }

            var finalEmbedStr = embedSrc.indexOf( findStr + insStr + '&' ); // make sure darkpopout mode is not already on
            var finalBindStr = bindSrc.indexOf( findStr + insStr + '&' );

            if( finalEmbedStr != -1 || finalBindStr != -1 )
            {
                continue;
            }

            embedStrPos += findStr.length;
            bindStrPos += findStr.length;

            iframes[ i ].setAttribute( "src", embedSrc.substring( 0, embedStrPos ) + insStr + embedSrc.substring( embedStrPos ) );
            iframes[ i ].setAttribute( "x-bind:src", bindSrc.substring( 0, bindStrPos ) + insStr + bindSrc.substring( bindStrPos ) );
            clearInterval(interVar);
        }

    }, 100 );
}