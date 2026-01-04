// ==UserScript==
// @name         Archive All Notifications
// @namespace    http://zinthose.com/
// @version      0.1
// @description  Add "Archive All" feature to Work Market Notifications page.
// @author       Zinthose
// @match        https://www.workmarket.com/notifications/active
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393352/Archive%20All%20Notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/393352/Archive%20All%20Notifications.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let archiveHeader = document.querySelector("th.sorting_disabled");

    // Add Text and style to Archive column header
    archiveHeader.textContent = "Archive All";
    archiveHeader.classList.add("sorting");
    archiveHeader.setAttribute("style", "text-align: center;");

    // Define on click event for the Archive column header
    archiveHeader.addEventListener("click", function () {
        // Get collection of all messages
        let archiveLinks = document.querySelectorAll("a.archive-action");

        // "click" each message to trigger the built in archive function.
        archiveLinks.forEach(async function (link) {
            link.click();
        });

    });

})();