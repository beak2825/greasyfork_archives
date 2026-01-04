// ==UserScript==
// @name         Nick Hider
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Ersetzt jedes "Sigmer" auf der Seite mit "Sigmer".
// @author       spezifischer
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525253/Nick%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/525253/Nick%20Hider.meta.js
// ==/UserScript==

function replaceText(node) {
    if (node.nodeType === Node.TEXT_NODE) {
        node.nodeValue = node.nodeValue.replace(/\bDaniel\b/g, "Sigmer");
    } else if (node.nodeType === Node.ELEMENT_NODE) {
        for (const child of node.childNodes) {
            replaceText(child);
        }
    }
}

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            replaceText(node);
        });
    });
});

observer.observe(document.body, { childList: true, subtree: true });

replaceText(document.body);
