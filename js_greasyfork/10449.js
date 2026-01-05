// ==UserScript==
// @name        mmmturkeybacon Auto Reload Google IFrame On Error
// @version     1.02
// @description Automatically reloads the iframe of a Google HIT if the "Please refresh the current page in your browser." error occurs. Adds a reload button in the top right corner of the iframe for Google HITs.
// @author      mmmturkeybacon
// @namespace   http://userscripts.org/users/523367
// @match       https://www.google.com/evaluation/endor/mturk?*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/10449/mmmturkeybacon%20Auto%20Reload%20Google%20IFrame%20On%20Error.user.js
// @updateURL https://update.greasyfork.org/scripts/10449/mmmturkeybacon%20Auto%20Reload%20Google%20IFrame%20On%20Error.meta.js
// ==/UserScript==

var RELOAD_ATTEMPTS_MAX = 3;
var RELOAD_DELAY = 1000; // milliseconds

$(document).ready(function()
{
        var button_holder = document.createElement("DIV");
        button_holder.style.cssText = "position: fixed; top: 0px; right: 0px; z-index: 20;";
        button_holder.innerHTML = '<input type="button" onclick="window.location.reload(true)" value="Reload" />';
        document.body.insertBefore(button_holder, document.body.firstChild);

        var idx = document.location.href.indexOf('assignmentId=') + 13;
        var assignmentId = document.location.href.substring(idx).split('&')[0];
        if (assignmentId != GM_getValue('mtbgir_assignmentId', 'ASSIGNMENT_ID_NOT_AVAILABLE'))
        {
            GM_setValue('mtbgir_assignmentId', assignmentId);
            GM_setValue('mtbgir_reload_attempts', 0);
        }

        var refresh_page_error = $('p:contains("Please refresh the current page in your browser.")').length > 0;
        var mtbgir_reload_attempts = GM_getValue('mtbgir_reload_attempts', 0);
        if (refresh_page_error && mtbgir_reload_attempts < RELOAD_ATTEMPTS_MAX)
        {
            GM_setValue('mtbgir_reload_attempts', mtbgir_reload_attempts+1);
            setTimeout(function(){window.location.reload(true);}, RELOAD_DELAY);
        }
        else if (refresh_page_error)
        {
            alert('mmmturkeybacon Auto Reload Google IFrame On Error: This page has been automatically reloaded the maximum number of times for this script.');
        }
});