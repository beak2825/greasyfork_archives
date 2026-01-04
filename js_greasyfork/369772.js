// ==UserScript==
// @name         OldScripit
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://steamcommunity.com/saliengame/play/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369772/OldScripit.user.js
// @updateURL https://update.greasyfork.org/scripts/369772/OldScripit.meta.js
// ==/UserScript==

var GenerateQueue = function( queueNumber )
{
    console.log( 'Queue #' + ++queueNumber );

    jQuery.post( 'https://store.steampowered.com/explore/generatenewdiscoveryqueue', { sessionid: g_sessionID, queuetype: 0 } ).done( function( data )
    {
        var requests = [];
   
        for( var i = 0; i < data.queue.length; i++ )
        {
            requests.push( jQuery.post( 'https://store.steampowered.com/app/10', { appid_to_clear_from_queue: data.queue[ i ], sessionid: g_sessionID } ) );
        }
   
        jQuery.when.apply( jQuery, requests ).done( function()
        {
            if( queueNumber < 3 )
            {
                GenerateQueue( queueNumber );
            }
            else
            {
                window.location.reload();
            }
        } );
    } );
};

GenerateQueue( 0 );