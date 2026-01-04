// ==UserScript==
// @name         Auto Select Prov - Jeopardy
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Automatically selects 'Prov - Jeopardy' from the 'Escalate to team' drop-down when escalating from CAT EL
// @author       Rob Clayton
// @match        https://workplace.plus.net/tickets/ticket_escalate.html?*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525249/Auto%20Select%20Prov%20-%20Jeopardy.user.js
// @updateURL https://update.greasyfork.org/scripts/525249/Auto%20Select%20Prov%20-%20Jeopardy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        let dropdown = document.getElementById('target_user');
        let ownerCell = Array.from(document.querySelectorAll('td.column-data')).find(td => td.textContent.trim() === 'Owner');
        let valueCell = ownerCell ? ownerCell.nextElementSibling : null;

        if (dropdown && valueCell && valueCell.textContent.trim() === 'CAT - EL Escalations') {
            dropdown.value = "team_927"; // Selecting 'Prov - Jeopardy'
        }
    });
})();
