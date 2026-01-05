// ==UserScript==
// @name        mmmturkeybacon Single Page Queue
// @version     1.22
// @description Shows all HITs in the queue on a single page.
// @author      mmmturkeybacon
// @namespace   http://userscripts.org/users/523367
// @match       https://*.mturk.com/mturk/myhits
// @match       https://*.mturk.com/mturk/sortmyhits*?*
// @match       https://*.mturk.com/mturk/viewmyhits*?*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant       GM_log
// @downloadURL https://update.greasyfork.org/scripts/3110/mmmturkeybacon%20Single%20Page%20Queue.user.js
// @updateURL https://update.greasyfork.org/scripts/3110/mmmturkeybacon%20Single%20Page%20Queue.meta.js
// ==/UserScript==

$(document).ready(function()
{
    var $go_button = $('input[name="/sort"]');
    $go_button.after('<input id="mtbspq_button" type="button" value="SHOW ALL" style="vertical-align: middle; height: 21px; color: white; background-color: #CB6533; font-weight: 600; margin-left: 3px; border-radius: 10px; moz-border-radius: 10px; webkit-border-radius: 10px; border:1px white solid;">');
    $('input[id="mtbspq_button"]').bind('click', function()
    {
        $('option[value="100"]').prop('selected', true);
        $go_button[0].click();
    });
});