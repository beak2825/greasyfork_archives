// ==UserScript==
// @name        mmmturkeybacon Add AutoAccept Checkbox to HIT Preview
// @version     1.02
// @description Adds AutoAccept Checkbox to a HIT Preview
// @author      mmmturkeybacon
// @namespace   http://userscripts.org/users/523367
// @match       https://*.mturk.com/mturk/preview?*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant       GM_log
// @downloadURL https://update.greasyfork.org/scripts/3111/mmmturkeybacon%20Add%20AutoAccept%20Checkbox%20to%20HIT%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/3111/mmmturkeybacon%20Add%20AutoAccept%20Checkbox%20to%20HIT%20Preview.meta.js
// ==/UserScript==

    
$(document).ready(function()
{
    var is_preview = $('input[type="hidden"][name="isAccepted"][value="false"]').length > 0;
    if (is_preview)
    {
        $('td[nowrap=""][align="center"]:contains("Want to work on this HIT?")').each(function()
        {
            var $parent_table = $(this).parent().parent();
            $parent_table.append('<tr><td colspan="3"></td><td></td></tr>');
            $parent_table.append('<tr><td valign="bottom" nowrap="" height="26" align="center" colspan="3"><a style="display: block;" name="autoAcceptCheckboxWrapper"><input type="checkbox" onclick="javascript:toggleAllCheckboxes(this);" value="on" name="autoAcceptEnabled"></input>Automatically accept the next HIT</a></td></tr>');         
        });
    }
    
});
