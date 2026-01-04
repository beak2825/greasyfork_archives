// ==UserScript==
// @name         Assembly Chromium auto-filter and alphabetize
// @namespace    http://tampermonkey.net/
// @version      2025-07-16
// @description  If you visit https://chromium.googlesource.com/chromiumos/docs/+/master/constants/syscalls.md, you will be prompted to select an architecture. Non-selected tables will be hidden, and the syscalls sorted alphabetically.
// @author       You
// @match        https://chromium.googlesource.com/chromiumos/docs/+/master/constants/syscalls.md
// @icon         https://www.google.com/s2/favicons?sz=64&domain=googlesource.com
// @grant        none
// @license      Apache2
// @downloadURL https://update.greasyfork.org/scripts/542847/Assembly%20Chromium%20auto-filter%20and%20alphabetize.user.js
// @updateURL https://update.greasyfork.org/scripts/542847/Assembly%20Chromium%20auto-filter%20and%20alphabetize.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const archTable = {
        "x64": "x86_64-64_bit",
        "x32": "x86-32_bit",
        "arm32": "arm-32_bit_eabi",
        "arm64": "arm64-32_bit"
}
     let arch = "";
    while (!Object.keys(archTable).includes(arch)){
        arch = prompt("Select architecture: x64/x32/arm64/arm32");
    }
    const nameTag = archTable[arch];
    const table = document.querySelector(`h3:has(> a[name=${nameTag}]) + * + table`);
    const rows = [...table.rows].slice(1);
    rows.sort((a,b) => a.cells[1].textContent.localeCompare(b.cells[1].textContent));
    for (const row of rows){
        table.tBodies[0].appendChild(row);
    }
    const otherTables = [...document.querySelectorAll(`h3:not(:has(> a[name=${nameTag}])) + * + table`)];
    for (const tbl of otherTables){
         tbl.style.display = "none";
    }
    table.rows[0].style.position = "sticky";
    table.rows[0].style.top = "0";
    // Your code here...
})();