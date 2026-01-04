// ==UserScript==
// @name         CS "Rename this group" duplicate
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Inserts "Rename this group" link under "Rename pets mode" for easier access when you're re-sorting or something
// @match        https://www.chickensmoothie.com/accounts/viewgroup.php?groupid=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533682/CS%20%22Rename%20this%20group%22%20duplicate.user.js
// @updateURL https://update.greasyfork.org/scripts/533682/CS%20%22Rename%20this%20group%22%20duplicate.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function () {
        const groupId = new URLSearchParams(window.location.search).get('groupid');
        if (!groupId) return;

        const panelTable = document.querySelector('table.widgetpanel.pets-control-panel');
        if (!panelTable) return;

        // Target the <td align="right"> inside the table
        const rightTd = panelTable.querySelector('td[align="right"] > div');
        if (!rightTd) return;

        // Create a new div wrapper
        const newDiv = document.createElement('div');
        newDiv.className = 'rename-pets reqjs';
        newDiv.style.display = 'block';

        // Create the link
        const newLink = document.createElement('a');
        newLink.href = `renamegroup.php?id=${groupId}`;
        newLink.textContent = 'Rename this group';

        // Nest link inside the div, then insert before the rename-pets-enabled div
        newDiv.appendChild(newLink);
        rightTd.parentNode.insertBefore(newDiv, rightTd.nextSibling);
    });
})();
