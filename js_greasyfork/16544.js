// ==UserScript==
// @name        Wikipedia Sticky Table Headers
// @namespace   infernozeus/wikipedia-sticky-table-headers
// @description Add sticky table headers to Wikipedia
// @match       http://*.wikipedia.org/*
// @match       https://*.wikipedia.org/*
// @version     1
// @grant       GM_addStyle
// @require     https://code.jquery.com/jquery-1.12.0.min.js
// @require https://greasyfork.org/scripts/2199-waitforkeyelements/code/waitForKeyElements.js?version=6349
// @require     https://cdnjs.cloudflare.com/ajax/libs/floatthead/1.3.2/jquery.floatThead.min.js
// @downloadURL https://update.greasyfork.org/scripts/16544/Wikipedia%20Sticky%20Table%20Headers.user.js
// @updateURL https://update.greasyfork.org/scripts/16544/Wikipedia%20Sticky%20Table%20Headers.meta.js
// ==/UserScript==

waitForKeyElements ("table.jquery-tablesorter", floatTableHeaders, true);

function floatTableHeaders(table){
  $(table).floatThead();
}
