// ==UserScript==
// @name         Google Books - load clicked links in a new tab
// @version      1.0
// @namespace    dhaden
// @description  A small UserScript to ensure that links in a page of Google Books results load to a new tab, on click
// @author       dhaden
// @match        https://www.google.com/search?q=*tbm=bks*
// @license      MIT
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/475026/Google%20Books%20-%20load%20clicked%20links%20in%20a%20new%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/475026/Google%20Books%20-%20load%20clicked%20links%20in%20a%20new%20tab.meta.js
// ==/UserScript==

	// Add code to launch the links in a new tab, on each link being clicked
    const whitelist = [
        "posting.php",
        "#top",
    ];

    for (const link of document.querySelectorAll("a")) {
        if (!whitelist.some(term => link.href.includes(term))) {
            link.target = "_blank";
        }
    }