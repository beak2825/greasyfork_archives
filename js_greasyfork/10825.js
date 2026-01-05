// ==UserScript==
// @name     Remove all items in SteamGifts Giveaways Filter Page
// @description     Used to remove all items in http://www.steamgifts.com/account/settings/giveaways/filters
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=19641
// @match    http://www.steamgifts.com/account/settings/giveaways/filters
// @grant    GM_addStyle
// @version 0.0.1.20150706232638
// @namespace https://greasyfork.org/users/12926
// @downloadURL https://update.greasyfork.org/scripts/10825/Remove%20all%20items%20in%20SteamGifts%20Giveaways%20Filter%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/10825/Remove%20all%20items%20in%20SteamGifts%20Giveaways%20Filter%20Page.meta.js
// ==/UserScript==
//Script taken from http://stackoverflow.com/questions/12252701/how-do-i-click-on-this-button-with-greasemonkey/12256847#12256847
/*- The @grant directive is needed to work around a major design change
    introduced in GM 1.0.
    It restores the sandbox.
*/

//--- Note that contains() is CASE-SENSITIVE.
waitForKeyElements (".table__column__secondary-link:contains('Remove')", clickOnFollowButton);

function clickOnFollowButton (jNode) {
    var clickEvent  = document.createEvent ('MouseEvents');
    clickEvent.initEvent ('click', true, true);
    jNode[0].dispatchEvent (clickEvent);
}