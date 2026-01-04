// ==UserScript==
// @name         Text Faker
// @namespace    https://github.com/FallenAstaroth/
// @version      1.0.0
// @description  Заменяет значения элементов до их рендеринга на странице
// @author       FallenAstaroth
// @match        https://github.com/FallenAstaroth/scammers-scripts
// @icon         https://img.icons8.com/color/512/vk-circled.png
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/461584/Text%20Faker.user.js
// @updateURL https://update.greasyfork.org/scripts/461584/Text%20Faker.meta.js
// ==/UserScript==

(function() {
    "use strict";

    const elements = [
        {
            selector: "YOUR_SELECTOR",
            text: "YOUR_TEXT"
        }
    ]

    elements.forEach((element) => {
        replaceTextOnInsertion(element.selector, element.text);
    })

    function replaceTextOnInsertion(selector, newText) {
        const observer = new MutationObserver((mutationsList, observer) => {
            for (let mutation of mutationsList) {
                if (mutation.type === "childList") {
                    const addedNodes = mutation.addedNodes;
                    for (let node of addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE && node.matches(selector)) {
                            node.textContent = newText;
                            observer.disconnect();
                        }
                    }
                }
            }
        });

        observer.observe(document.documentElement, { childList: true, subtree: true });
    }
})();