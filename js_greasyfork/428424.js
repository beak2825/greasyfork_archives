// ==UserScript==
// @name         SFDC Reports
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Some tweaks for Reports on SFDC Classic.
// @author       Emanuel Farinha
// @match        https://hp.my.salesforce.com/*?isdtp=nv
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428424/SFDC%20Reports.user.js
// @updateURL https://update.greasyfork.org/scripts/428424/SFDC%20Reports.meta.js
// ==/UserScript==

// SALESFORCE
'use strict';

// table of cases
const arrayRecord = document.querySelectorAll(".even, .odd")
// URL of page
const nameStorage = location.pathname

for (var i = 0; i < arrayRecord.length; i++) {
    // change the URL on table of the cases to SFDC lighting URL
    if (arrayRecord.length > 0) {

        // Styling
        const linkLighting = document.createElement("a")
        linkLighting.innerText = "Open in Lightning"
        linkLighting.target = "_blank"
        linkLighting.style.display= "block"
        linkLighting.style.paddingTop = "8px"
        linkLighting.style.paddingBottom = "10px"

        // Linking to lighting SFDC
        arrayRecord[i].children[0].children[0].style.padding = "10px"
        let Case = arrayRecord[i].children[0].children[0].href
        let case1 = Case.replace("javascript:srcUp(%27%2F", "")
        let case2 = case1.replace("%3Fisdtp%3Dvw%27);", "")

        arrayRecord[i].children[0].appendChild(linkLighting)
        linkLighting.href = case2
        linkLighting.target = "_blank"
    }
}