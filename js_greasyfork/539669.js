// ==UserScript==
// @name            Remove 1stopbuilders cslb complaint
// @description     Removes the complaint from the cslb for 1stopbuilders
// @version         1.0.4
// @author          Oliver P
// @namespace       https://github.com/OlisDevSpot
// @license         MIT
// @match           https://www.cslb.ca.gov/OnlineServices/CheckLicenseII/LicenseDetail.aspx?LicNum=1033108
// @run-at          document-end
// @compatible      safari
// @downloadURL https://update.greasyfork.org/scripts/539669/Remove%201stopbuilders%20cslb%20complaint.user.js
// @updateURL https://update.greasyfork.org/scripts/539669/Remove%201stopbuilders%20cslb%20complaint.meta.js
// ==/UserScript==

setTimeout(() => {
    const issDate = document.querySelector("#MainContent_IssDt");
    const complaint = document.querySelector("#MainContent_AddLicStatRow2");
    const extraRow = document.querySelector("#MainContent_AddLicStatRow");
    
    issDate.innerText = "11/20/2001";
    complaint.remove();
    extraRow.remove();
}, 1000)