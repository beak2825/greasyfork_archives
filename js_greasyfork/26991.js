// ==UserScript==
// @name         Wookieepedia Default to Legacy
// @namespace    https://holocronweaver.com/
// @version      0.1
// @description  Default to Legacy instead of Disney Canon.
// @author       holocronweaver
// @match        http://starwars.wikia.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26991/Wookieepedia%20Default%20to%20Legacy.user.js
// @updateURL https://update.greasyfork.org/scripts/26991/Wookieepedia%20Default%20to%20Legacy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if this page has Canon/Legacy duality and find Legacy URL.
    var canontabLegendsFields = document.evaluate(
        "//table[@id='canontab']//td[@id='canontab-legends']//a",
        document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

    // Avoid infinite loop.
    var legendsNotInUrl = window.location.pathname.search(/Legends$/i) == -1;

    // If previous page was Legends, do nothing since user wanted to see the Canon page.
    var prevPageIsNotLegends = document.referrer.search(/Legends$/i) == -1;

    if (canontabLegendsFields.snapshotLength > 0 && legendsNotInUrl && prevPageIsNotLegends)
    {
        var a = canontabLegendsFields.snapshotItem(0);
        window.location = a.href;
    }

})();