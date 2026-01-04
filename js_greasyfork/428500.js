// ==UserScript==
// @name         M
// @namespace    http://tampermonkey.net/
// @version      17
// @description  try
// @author       You
// @match        https://store.steampowered.com/explore/
// @require      https://code.jquery.com/jquery-3.3.1.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428500/M.user.js
// @updateURL https://update.greasyfork.org/scripts/428500/M.meta.js
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements, g_sessionID */


var GenerateQueue = function(queueNumber)
{
    console.log('Pharaoh — ebaniy psih #' + ++queueNumber);

    jQuery.post('https://store.steampowered.com/explore/generatenewdiscoveryqueue', { sessionid: g_sessionID, queuetype: 0 }).done(function(data)
    {
        var requests = [];
   
        for(var i = 0; i < data.queue.length; i++)
        {
            requests.push(jQuery.post('https://store.steampowered.com/app/10', { appid_to_clear_from_queue: data.queue[ i ], sessionid: g_sessionID }));
        }
   
        jQuery.when.apply(jQuery, requests).done(function()
        {
            if(queueNumber < 1)
            {
                GenerateQueue(queueNumber);
            }
            else
            {
                window.location.reload();
            }
        });
    });
};

GenerateQueue(0);