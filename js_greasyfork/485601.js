// ==UserScript==
// @name         Ravenwood Quality of Life
// @description  Small changes to make the experience of using "vrcdb.ravenwood.dev" a little better.
// @author       YelloNox
// @version      0.3
// @date         2024-1-24
// @namespace    https://yello.zip
// @homepage     https://github.com/YelloNox/asuratoon-dl
// @match        *://vrcdb.ravenwood.dev/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485601/Ravenwood%20Quality%20of%20Life.user.js
// @updateURL https://update.greasyfork.org/scripts/485601/Ravenwood%20Quality%20of%20Life.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const imageSelector =
        "div.d-flex.flex-column.justify-content-end.justify-content-sm-end.justify-content-md-end.justify-content-xxl-end.align-items-xxl-start";
    const textShadowSelector =
        'h1[style*="text-shadow: rgb(0, 0, 0) 0px 0px 11px"]';

    function removeBlur(element) {
        element.style.backdropFilter = "none";
    }
    function imageExpand(element) {
        element.style.height = "100%";
    }
    function textShadowRemove(element) {
        element.style.textShadow = "none";
    }

    function handleMutations(mutationsList, observer) {
        mutationsList.forEach((mutation) => {
            if (mutation.type === "childList") {
                const newElements = mutation.addedNodes;
                newElements.forEach((element) => {
                    if (element.nodeType === Node.ELEMENT_NODE) {
                        const blurElement = element.querySelector(
                            'div[style*="backdrop-filter: blur(5px) grayscale(0%)"]'
                        );
                        const textShadowElement =
                            element.querySelector(textShadowSelector);
                        const imageElement =
                            element.querySelector(imageSelector);

                        if (blurElement) {
                            removeBlur(blurElement);
                        }
                        if (imageElement) {
                            imageExpand(imageElement);
                        }
                        if (textShadowElement) {
                            textShadowRemove(textShadowElement);
                        }
                    }
                });
            }
        });
    }

    const observer = new MutationObserver(handleMutations);

    observer.observe(document, { childList: true, subtree: true });
})();
