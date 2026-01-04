// ==UserScript==
// @name         Faction Hospital
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Shows only faction members that are in the hospital and hides the rest.
// @author       LordBusiness
// @match        https://www.torn.com/factions.php?step=profile*
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/41104/Faction%20Hospital.user.js
// @updateURL https://update.greasyfork.org/scripts/41104/Faction%20Hospital.meta.js
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

window.addEventListener('DOMContentLoaded', event => {
    // Get list of members
    const memberList = document.querySelectorAll('.member-list li');

    // Loop through all members
    for(const member of memberList) {

        /* Icon IDs
         * icon1 : Online
         * icon2 : Offline
         * icon15: In Hospital
         * icon62: Idle        */
        if(member.querySelector('#icon15')) member.style.order = member.querySelector('#icon1') ? -3 : member.querySelector('#icon62') ? -2 : -1;
    }
});
