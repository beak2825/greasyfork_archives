// ==UserScript==
// @name         UiPath Display Dates Instead of hours / days
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Fixes the dates being displayed as 'n hours ago' in the tables in Orchestrator
// @author       Jon Smith
// @match        https://cloud.uipath.com/*/*/orchestrator_*
// @icon         https://www.google.com/s2/favicons?domain=uipath.com
// @grant        none
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/472626/UiPath%20Display%20Dates%20Instead%20of%20hours%20%20days.user.js
// @updateURL https://update.greasyfork.org/scripts/472626/UiPath%20Display%20Dates%20Instead%20of%20hours%20%20days.meta.js
// ==/UserScript==
//setTimeout(function() {alert("Updated"); }, 5000);

(new MutationObserver(check)).observe(document, {childList: true, subtree: true});
function check(changes, observer) {
    if(document.querySelector('ui-dateformat')) {
        //observer.disconnect();
        // code
        var dateNodes = document.querySelectorAll ("ui-dateformat");
        for (var J = dateNodes.length - 1; J >= 0; --J) {
            var date = dateNodes[J].getAttribute("data-title");
            if(date.length > 0){
                var datearray = date.split("/");
                var newdate = datearray[1] + '/' + datearray[0] + '/' + datearray[2];
                dateNodes[J].textContent = newdate;
            }
            else dateNodes[J].textContent = ""
        }
    }
}