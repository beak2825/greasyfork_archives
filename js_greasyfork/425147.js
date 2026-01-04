// ==UserScript==
// @name         ismyinternetworking faster
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  refreshes ping faster and change the bg of https://ismyinternetworking.com/
// @author       You
// @match        https://ismyinternetworking.com/
// @icon         https://www.google.com/s2/favicons?domain=ismyinternetworking.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425147/ismyinternetworking%20faster.user.js
// @updateURL https://update.greasyfork.org/scripts/425147/ismyinternetworking%20faster.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function ClickConnect(){
    console.log("Clicked on thing");
    document.querySelector("#yeslink").click()
    if (document.querySelector("#center > div.test-info-wrapper > div:nth-child(4) > div.infobox-panel.infobox-ping.infobox-left > div > div.infobox-content.infobox-content-ping").innerHTML !== "N/A") {
           document.body.style.backgroundColor = "#76cdf4"
        }
    else {
        document.body.style.backgroundColor = "#ff1100"
    }
}
setInterval(ClickConnect,250)
})();