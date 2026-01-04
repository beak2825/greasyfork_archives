// ==UserScript==
// @name         ServiceNow - Highlight Assigned to Me
// @version      0.4.1
// @license MIT
// @description  Highlight my incidents/changes
// @author       Ricardo Constantino
// @match        https://*.service-now.com/change_request_list.do*
// @match        https://*.service-now.com/incident_list.do*
// @match        https://*.service-now.com/rm_story_list.do*
// @grant        none
// @namespace    https://greasyfork.org/users/129739
// @downloadURL https://update.greasyfork.org/scripts/399370/ServiceNow%20-%20Highlight%20Assigned%20to%20Me.user.js
// @updateURL https://update.greasyfork.org/scripts/399370/ServiceNow%20-%20Highlight%20Assigned%20to%20Me.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STYLE = `
tr.assignedToMe td {
    background-color: #bcefff !important;
}

tr.assignedToMe.updatedByNotMe td {
    background-color: #ffe686 !important;
}
`;

    const IGNORE_SYSTEM_UPDATES = true;


    let assignedToColumn = document.querySelector('th[name="assigned_to"]');
    if (!assignedToColumn) return;
    let assignedToColumnIdx = [...assignedToColumn.parentElement.children].indexOf(assignedToColumn);

    let meSysID = g_user.getUserID();
    let meUserName = g_user.getUserName();
    let d = document.createElement('style');
    d.textContent = STYLE;
    document.querySelector("style").append(d);

    let tableElem = assignedToColumn.parentElement.parentElement.parentElement;

    let rowsAssignedToMe = [...tableElem.querySelectorAll('td:nth-child('+(assignedToColumnIdx+1)+')')]
        .filter(e => e.children.length > 0 && e.children[0].getAttribute('sys_id') === meSysID)
        .map(c => c.parentElement);

    rowsAssignedToMe.forEach(r => r.addClassName('assignedToMe'));

    let updatedByColumn = tableElem.querySelector('th[name="sys_updated_by"]');
    if (updatedByColumn) {
        let updatedByColumnIdx = [...updatedByColumn.parentElement.children].indexOf(updatedByColumn);
        rowsAssignedToMe
            .filter(r => r.children[updatedByColumnIdx].textContent !== meUserName && (!IGNORE_SYSTEM_UPDATES || r.children[updatedByColumnIdx].textContent !== 'system'))
            .forEach(r => r.addClassName('updatedByNotMe'));
    }
})();