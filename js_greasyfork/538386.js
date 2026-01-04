// ==UserScript==
// @name         MooMoo.io - No Store Names
// @namespace    https://greasyfork.org/en/users/1064285-vcrazy-gaming
// @grant        none
// @description  A simple MooMoo.io script, will work for typical store stuff rolled out by MooMoo.io.
// @author       vcrazy
// @version      0.0.2
// @match        *://*.moomoo.io/*
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538386/MooMooio%20-%20No%20Store%20Names.user.js
// @updateURL https://update.greasyfork.org/scripts/538386/MooMooio%20-%20No%20Store%20Names.meta.js
// ==/UserScript==

const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            if (!(node instanceof HTMLElement)) return;
            if (node.matches(".storeItem") || node.querySelector(".storeItem")) {
                const items = node.matches(".storeItem") ? [node] : node.querySelectorAll(".storeItem");
                items.forEach(item => {
                    const span = item.querySelector("span");
                    if (span && span.innerText.trim()) {
                        span.innerText = "";
                    }
                });
            }
        });
    });
});
observer.observe(document, {
    childList: true,
    subtree: true
});