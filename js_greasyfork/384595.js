// ==UserScript==
// @name         HideReject
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hides rejections
// @author       Aesric
// @match        https://worker.mturk.com/dashboard*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/384595/HideReject.user.js
// @updateURL https://update.greasyfork.org/scripts/384595/HideReject.meta.js
// ==/UserScript==

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function hideRejections() {
    sleep("1").then(() => {
        var rows = document.getElementsByClassName("p-x-sm column rejected-column text-xs-right");
        for(var i = 0; i < rows.length; i++) {
            rows[i].style.display = "none";
        }
    });
}

(function() {
    // Rejection count and rejection rate
    document.querySelector("#dashboard-hits-overview > div > div > div:nth-child(6) > div.col-xs-7 > strong").style.display =
    document.querySelector("#dashboard-hits-overview > div > div > div:nth-child(6) > div.col-xs-5.text-xs-right").style.display =
    document.querySelector("#dashboard-hits-overview > div > div > div:nth-child(7) > div.col-xs-8 > strong").style.display =
    document.querySelector("#dashboard-hits-overview > div > div > div:nth-child(7) > div.col-xs-4.text-xs-right").style.display = "none";

    // Rejection columns
    document.querySelector("#MainContent > div:nth-child(4) > div.col-xs-12.col-md-8.col-md-pull-4 > div:nth-child(2) > div > div > ol > li.hidden-sm-down > span.column-header.p-x-sm.rejected-column.text-xs-right").style.display = "none";
    hideRejections();

    var hiddenRows = document.getElementsByClassName("desktop-row hidden-sm-down");
    for(var i = 0; i < hiddenRows.length; i++) {
        hiddenRows[i].addEventListener("click", hideRejections);
    }
})();