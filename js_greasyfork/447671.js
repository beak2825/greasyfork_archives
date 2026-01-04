// ==UserScript==
// @name         Poste Italiane - loader 160 anni
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Rimuove il loader forzato per il 160esimo anniversario
// @author       Edoardo Luppi
// @license      MIT - https://opensource.org/licenses/mit-license.php
// @match        https://www.poste.it/
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/447671/Poste%20Italiane%20-%20loader%20160%20anni.user.js
// @updateURL https://update.greasyfork.org/scripts/447671/Poste%20Italiane%20-%20loader%20160%20anni.meta.js
// ==/UserScript==

let count = 0;

const observer = new MutationObserver(mutations => {
    const elements = document.querySelectorAll('div.pageLoader');
    const length = elements.length;

    if (length > 0) {
        elements.forEach(e => e.remove());
        count += length;

        // Vengono installati 2 loaders
        if (count > 1) {
            observer.disconnect();
        }
    }
});

observer.observe(document, {
    childList: true,
    subtree: true,
});
