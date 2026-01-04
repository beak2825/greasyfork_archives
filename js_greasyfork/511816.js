// ==UserScript==
// @name        SharePoint List / Library ID In List / Library Settings
// @namespace   Eliot Cole Scripts
// @match       https://*.sharepoint.com/sites/*/_layouts/15/listedit.aspx*
// @grant       none
// @license     MIT
// @version     1.0
// @author      Eliot Cole
// @description 07/10/2024, 22:38:20
// @require     https://ajax.aspnetcdn.com/ajax/jquery/jquery-1.9.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/511816/SharePoint%20List%20%20Library%20ID%20In%20List%20%20Library%20Settings.user.js
// @updateURL https://update.greasyfork.org/scripts/511816/SharePoint%20List%20%20Library%20ID%20In%20List%20%20Library%20Settings.meta.js
// ==/UserScript==

var DaListId = unsafeWindow._spPageContextInfo.listId.slice(1,-1);
console.log('Bongobongo: '+DaListId);

$('table#idItemHoverTable > tbody > tr:first-of-type').after('<tr><th scope="row" nowrap="nowrap" valign="top" id="500">ID:</th><td valign="top">'+DaListId+'</td></tr>');