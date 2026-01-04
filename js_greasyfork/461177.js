// ==UserScript==
// @name         Faction Hospital
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Shows only faction members that are in the hospital and hides the rest.
// @author       LordBusiness
// @license      MIT
// @match        https://www.torn.com/factions.php?step=profile*
// @run-at       document-end
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @downloadURL https://update.greasyfork.org/scripts/461177/Faction%20Hospital.user.js
// @updateURL https://update.greasyfork.org/scripts/461177/Faction%20Hospital.meta.js
// ==/UserScript==

GM_addStyle(
   `.member-list {
        display: flex !important;
        flex-direction: column;
    }

    .faction-info,
    .faction-description,
    .faction-description + hr,
    .faction-title[data-title="description"] {
        display: none !important;
    }`
);

function hosp_filter() {
    // Get list of members
    let memberList = document.querySelectorAll('.table-body .table-row');
    console.log(memberList.length);

    // Loop through all members
    for(var member of memberList) {
        if(!member.querySelector('.status .hospital')){
          member.style.display = "none";
        }
    }
}

VM.observe(document.body, () => hosp_filter() );
