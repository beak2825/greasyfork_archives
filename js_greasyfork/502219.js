// ==UserScript==
// @name            Meduza: images direct links
// @namespace       github.com/a2kolbasov
// @version         0.2-snapshot
// @description     -
// @author          Aleksandr Kolbasov
// @icon            https://www.google.com/s2/favicons?sz=64&domain=meduza.io
// @match           https://meduza.io/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/502219/Meduza%3A%20images%20direct%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/502219/Meduza%3A%20images%20direct%20links.meta.js
// ==/UserScript==

/*
 * Copyright © 2023-2024 Aleksandr Kolbasov
 */

// @ts-check
(function () {
    'use strict';

    init();

    function init() {
        /** @type {!Element} */
        // @ts-ignore
        let root = document.querySelector('#root > div');
        handlePictures(root);

        new MutationObserver(mutations => {
            for (let mutation of mutations) {
                for (let node of mutation.addedNodes) {
                    if (node instanceof Element) {
                        handlePictures(node);
                        console.debug('node:', node)
                    }
                }
            }
        }).observe(root, { childList: true, subtree: true });
    }


    /**
     * @param {Element} addedElement
     */
    function handlePictures(addedElement) {
        addedElement.querySelectorAll('figure[class^="EmbedBlock-module"]').forEach(async figure => {
            let picture = await getPicture(figure);

            /** @type {?HTMLSourceElement} */
            let source = picture.querySelector('source[type="image/png"]'); // The image in attribute is written as png, but the server gives jpeg
            let src = source?.srcset.split(' ', 1)[0];
            let figcaption = figure.querySelector('figcaption') || figure.appendChild(document.createElement('figcaption'));

            if (src) {
                let link = document.createElement('a');
                figcaption.prepend(link);
                link.textContent = '\u{1f4be}'; // 💾
                link.href = src;
            }
        });
    }

    /**
     * Wait for a lazy module to load and return the loaded picture
     * @param {Element} figure
     * @returns {Promise<HTMLPictureElement>}
     */
    async function getPicture(figure) {
        {
            let picture = figure.querySelector('picture');
            if (picture) return picture;
        }

        return new Promise(resolve => {
            new MutationObserver((mutations, observer) => {
                for (let mutation of mutations) {
                    for (let node of mutation.addedNodes) {
                        if (node instanceof Element) _handleAddedElement(node, observer, resolve);
                    }
                }
            }).observe(figure, { childList: true, subtree: true });
        });

        /**
         * Search for added picture element
         * @param {Element} addedElement
         * @param {MutationObserver} observer
         * @param {(picture: HTMLPictureElement) => void} resolve
         */
        function _handleAddedElement(addedElement, observer, resolve) {
            if (!(addedElement instanceof HTMLPictureElement)) return;
            observer.disconnect();
            resolve(addedElement);
        }
    }
})();
