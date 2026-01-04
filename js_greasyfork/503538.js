// ==UserScript==
// @name         Roblox Catalog Brainrot Remover
// @namespace    http://github.com/idkncc/userscripts
// @version      2024-08-12
// @description  Removes brainrot from catalog (freaky, biggest boxes, skibidi, etc)
// @author       idkncc
// @license      MIT
// @match        https://www.roblox.com/catalog*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=roblox.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503538/Roblox%20Catalog%20Brainrot%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/503538/Roblox%20Catalog%20Brainrot%20Remover.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /*
       How to ban words
        - just add below in array (write it in lower case and surround in / !), for example: /ban word/, /ban word2/, /gojo/, /rainbow/, etc..
    */
    const BAN_WORDS = [/freaky/, /big box/, /biggest box/, /sweater addon/, /skibidi/, /tv man/, /nah, i'm/, /nah, im/, /nah im/, /freak/, /biggest/, /chest crop/, /chest top/, /crop top/, /max design/, /sigma/, /rizz/, /chicken nugget/]

    const resultsContainer = document.querySelector(".results-container .item-cards-stackable")
    if (!resultsContainer) return;

    const config = { attributes: false, childList: true, subtree: true };

    const callback = function (mutationList, observer) {
        for (const mutation of mutationList) {
            for (const addedNode of mutation.addedNodes) {
                if (addedNode.nodeType !== 1 && (addedNode.classList?.contains("item-card-caption") ?? false)) continue;

                const addedElement = addedNode.firstElementChild?.firstElementChild;
                if (!addedElement) continue;

                if (!addedElement.classList.contains("item-card-name")) continue;

                if (BAN_WORDS.some((regex) => regex.exec(addedElement.innerText.toLowerCase()) !== null)) {
                    // console.log("removing", addedElement.innerText)
                    addedElement.parentElement.parentElement.parentElement.parentElement.remove()
                }
            }
        }
    };

    const observer = new MutationObserver(callback);
    observer.observe(resultsContainer, config);
})();
