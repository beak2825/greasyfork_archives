// ==UserScript==
// @name        KAT - Limit Reputation Width
// @namespace   LimitReputationWidth
// @version     1.04
// @description Makes it so that column goes onto new line for long names
// @match     http://kat.cr/user/*/reputation*
// @match     https://kat.cr/user/*/reputation*
// @downloadURL https://update.greasyfork.org/scripts/5464/KAT%20-%20Limit%20Reputation%20Width.user.js
// @updateURL https://update.greasyfork.org/scripts/5464/KAT%20-%20Limit%20Reputation%20Width.meta.js
// ==/UserScript==

$("td.left").css("max-width", "625px");
$("td.left").css("word-wrap", "break-word");

/** Wrap mode on (true) / off (false) - on by default
 * 
 *  If on, the torrent name will continue on the next line - works in most cases
 *  If off, only the first 630 pixels of the column/title is visible, anything extra is simply hidden
 */

var wrap = true;

if (wrap == true)
{
    var max = "750px";
    if ($(".sideBar").is(':visible')) { max = "550px"; }
    $(".widgetButton").each(function()
   	{
        if ($(this).width() > $(this).parent().width() - 60)
        {
            $(this).css("max-width", max);
            $(this).css("word-wrap", "break-word");
            $(this).css("margin-bottom", "3px");
            $(this).addClass("wrap");
            $(this).addClass("block");
        }
    });
}
$(".nowrap").removeClass("nowrap");