// ==UserScript==
// @name        mmmturkeybacon PandA HEAD request
// @version     1.00
// @description Accepts a HIT with a PandA link by a HEAD request instead of a normal GET request. Add &MTB_HEAD_REQUEST to the end of a PandA URL to run. This is a very bare bones script and gives almost no feedback to the user, so keep an eye on your queue and edit REQUEST_DELAY to suit your needs.
// @author      mmmturkeybacon
// @namespace   http://userscripts.org/users/523367
// @match       https://www.mturk.com/mturk/previewandaccept*&MTB_HEAD_REQUEST
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant       GM_log
// @downloadURL https://update.greasyfork.org/scripts/15485/mmmturkeybacon%20PandA%20HEAD%20request.user.js
// @updateURL https://update.greasyfork.org/scripts/15485/mmmturkeybacon%20PandA%20HEAD%20request.meta.js
// ==/UserScript==


var REQUEST_DELAY = 2000; // milliseconds, 1000 milliseconds = 1 seconds
var TIMEOUT_TIME_LIMIT = 10000;

$(document).ready(function()
{
    function head_request()
    {
//console.log(Date.now());
        $.ajax({
            url: window.location.href,
            type: 'HEAD',
            success: function(data)
            {
//console.log(Date.now());
                setTimeout(head_request, REQUEST_DELAY);
            },
            error: function(xhr, status, error)
            {
                alert('mmmturkeybacon PandA HEAD request timed out. Reload page to restart.');
            },
            timeout: TIMEOUT_TIME_LIMIT
        });
    }

    head_request();
});