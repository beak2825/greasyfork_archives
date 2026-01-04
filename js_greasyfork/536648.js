// ==UserScript==
// @name         Firefox Local file viewer Firefox - sort alphabetically by default
// @namespace    http://tampermonkey.net/
// @version      2025-05-20
// @description  auto-clicks on the Name button in Firefox until the  file list is sorted alphabetically then stops
// @author       You
// @match        file:///*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536648/Firefox%20Local%20file%20viewer%20Firefox%20-%20sort%20alphabetically%20by%20default.user.js
// @updateURL https://update.greasyfork.org/scripts/536648/Firefox%20Local%20file%20viewer%20Firefox%20-%20sort%20alphabetically%20by%20default.meta.js
// ==/UserScript==

'use strict';

function clickUntilTableSortedAsc() {
    const table = document.querySelector('table[order][order-by]');
    const targetOrder = 'asc';
    const targetOrderBy = '0';

    // Stop if table has the desired attributes
    if (table &&
        table.getAttribute('order') === targetOrder &&
        table.getAttribute('order-by') === targetOrderBy) {
        console.log('Table is sorted in ascending order by column 0. Stopping clicks.');
        clearInterval(intervalId);
        return;
    }

    // Find the <a> tag with text exactly "Name"
    const nameLink = Array.from(document.querySelectorAll('a')).find(
        a => a.textContent.trim() === 'Name'
    );

    if (nameLink) {
        console.log('Clicking "Name" link...');
        nameLink.click();
    } else {
        console.log('"Name" link not found.');
    }
}

// Repeat every 0.1 seconds
const intervalId = setInterval(clickUntilTableSortedAsc, 100);
