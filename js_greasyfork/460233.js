// ==UserScript==
// @name         easier-jpdb-labs
// @namespace    https://jpdb.io/
// @version      2.0
// @description  adds a link to the jpdb.io labs
// @author       Farami
// @match        https://jpdb.io/*
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jpdb.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460233/easier-jpdb-labs.user.js
// @updateURL https://update.greasyfork.org/scripts/460233/easier-jpdb-labs.meta.js
// ==/UserScript==

let running = true;
new MutationObserver(mutations => {
    'use strict';

    const settingsLink = document.querySelector(".nav-item[href='/settings']");
    if (running && settingsLink) {
        running = false;

        const link = document.createElement("a");
        link.classList.add("nav-item");
        link.href = "/labs";
        link.append("Labs");

        settingsLink.insertAdjacentElement("afterend", link);
    }
}).observe(document, { childList: true, subtree: true });
