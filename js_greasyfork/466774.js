// ==UserScript==
// @name         Change QuickerAction`s version
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  to change QuickerAction`s version
// @author       HDG520
// @match        https://getquicker.net/Share/Actions/Versions?code=*
// @match        https://getquicker.net/Sharedaction?code=*
// @icon          https://files.getquicker.net/_icons/5E5C8C35FDA9E28D6E35D9C7E4EAA498A6069306.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466774/Change%20QuickerAction%60s%20version.user.js
// @updateURL https://update.greasyfork.org/scripts/466774/Change%20QuickerAction%60s%20version.meta.js
// ==/UserScript==



(function() {
    'use strict';

    // Get all rows in the version history table
    const rows = document.querySelectorAll('.table-bordered tbody tr');

    // Loop through each row (starting from the second one)
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];

        // Get the version number from the first column
        const versionNumber = row.querySelector('td:nth-child(1)').textContent.trim();
        const currentUrl = window.location.href;
        const pattern = /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/;
        const id = currentUrl.match(pattern);

        if (versionNumber == 0) {
            // Create a new cell in the row and add bold text
            const newCell = document.createElement('td');
            newCell.setAttribute('colspan', '3');
            newCell.innerHTML = '<strong>None</strong>';
            row.appendChild(newCell);
        } else {
            // Create the "get" hyperlink and set its href attribute accordingly
            const getLink = document.createElement('a');
            getLink.textContent = 'Get';
            getLink.href = `quicker:runaction:34d4a5a2-0ad5-40f5-8f47-08db4e50cd96?${id}@${versionNumber}`;

            // Create a new cell in the row and append the "get" hyperlink to it
            const newCell = document.createElement('td');
            newCell.appendChild(getLink);
            row.appendChild(newCell);
        }
    }

var tr = rows[0];

var newTh = document.createElement("th");
newTh.textContent = "历史版本";
newTh.setAttribute("colspan", "4");
newTh.style.whiteSpace = "nowrap"; // 添加此行代码，禁止自动换行
var td = tr.querySelector("td");
tr.insertBefore(newTh, td);

})();