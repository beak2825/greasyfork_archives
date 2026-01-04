// ==UserScript==
// @name        STUdio tipiak
// @namespace   Violentmonkey Scripts
// @match       http://localhost:8080/
// @grant       none
// @version     1.0
// @description 02/01/2023 20:05:28
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/457508/STUdio%20tipiak.user.js
// @updateURL https://update.greasyfork.org/scripts/457508/STUdio%20tipiak.meta.js
// ==/UserScript==

function waitForElement(els, func, timeout = 100) {
    const queries = els.map(el => document.querySelector(el));
    if (queries.every(a => a)) {
        func(queries);
    } else if (timeout > 0) {
        setTimeout(waitForElement, 300, els, func, --timeout);
    }
}

function addStarredClass() {
    for (item of document.getElementsByClassName("zimbra-client_mail-list-item_starred") )
        item.parentNode.parentNode.parentNode.parentNode.classList.add("zimbra-client_mail-email_starred");
}

waitForElement([".local-library .pack-not-draggable"], (queries) => {
    // create new MutationObserver object and pass callback to execute if mutation happens
    document.querySelectorAll(".pack-not-draggable").forEach(function(d) {
      d.setAttribute("draggable", true);
      d.classList.remove("pack-not-draggable");
      d.classList.add("pack-draggable");
    });
});