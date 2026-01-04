// ==UserScript==
// @name         WK Show Review SRS Level
// @namespace    WK_ShowRSRS
// @version      1.0
// @description  Prepends an indicator of the SRS level for the current item to the "stats" display.
// @author       ccookf
// @copyright    2017+, ccookf
// @license      MIT; http://opensource.org/licenses/MIT
// @match        https://www.wanikani.com/review/session*
// @match        https://www.wanikani.com/review/session*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31571/WK%20Show%20Review%20SRS%20Level.user.js
// @updateURL https://update.greasyfork.org/scripts/31571/WK%20Show%20Review%20SRS%20Level.meta.js
// ==/UserScript==

(function() {
    'use strict';

    addStyle(
        ".WK_ShowRSRS {display:inline-block; border-radius:3px; padding:0.15em; background-color:#00AAFF; font-weight:bold;}"
    );
    var currentItem = $.jStorage.get("currentItem");
    $("#stats").prepend(formatHTML(currentItem));
    //monit + update
    $.jStorage.listenKeyChange("currentItem", function() {
        currentItem = $.jStorage.get("currentItem");
        $("#WK_ShowRSRS").html(formatHTML(currentItem));
    });
})();

function addStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (head) {
        style = document.createElement('style');
        style.setAttribute('type', 'text/css');
        style.textContent = css;
        head.appendChild(style);
        return style;
    }
    return null;
}
function getLevelName(srs) {
    switch (srs) {
        case 1:
        case 2:
        case 3:
        case 4:
            return "Apprentice";
        case 5:
        case 6:
            return "Guru";
        case 7:
            return "Master";
        case 8:
            return "Enlightened";
        case 9:
            return "Burned";
        default:
            return "ERR" + srs + "!";
    }
}
function formatHTML(item) {
    var name = getLevelName(item.srs);
    return "<div id='WK_ShowRSRS' class='WK_ShowRSRS'>" + name + " (" + item.srs + ")</div>";
}