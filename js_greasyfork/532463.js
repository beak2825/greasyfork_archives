// ==UserScript==
// @name         GPS Rouge
// @version      1.0
// @description  Remplace la flèche bleue du GPS par une flèche rouge
// @author       Laïn
// @match        https://www.dreadcast.eu/Main
// @match        https://www.dreadcast.net/Main
// @grant        none
// @license      L41N
// @run-at       document-idle
// @namespace https://greasyfork.org/users/1435460
// @downloadURL https://update.greasyfork.org/scripts/532463/GPS%20Rouge.user.js
// @updateURL https://update.greasyfork.org/scripts/532463/GPS%20Rouge.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const newImageUrl = 'https://i.imgur.com/2gfZRrJ.png';
    const oldImageFilename = 'fleches.png';
    const flechesContainerSelector = '.fleches';

    function replaceBackgroundImageUrl(element) {
        if (!element || !element.matches || !element.matches('div[class^="fleche"]')) {
            return;
        }

        const computedDisplay = window.getComputedStyle(element).display;
        if (computedDisplay === 'none') {
            return; 
        }

        const currentBackground = element.style.background;


        if (currentBackground && currentBackground.includes(oldImageFilename)) {
            const regex = new RegExp(`url\\((['"]?).*?${oldImageFilename}\\1\\)`);
            const newBackground = currentBackground.replace(regex, `url("${newImageUrl}")`);

            if (newBackground !== currentBackground) {

                element.style.background = newBackground;
            } else {

            }
        } else {

        }
    }
    function processFlechesContainer(container) {
        if (container.dataset.flechesObserverAttached) {
            return;
        }
        container.dataset.flechesObserverAttached = 'true';

        container.querySelectorAll('div[class^="fleche"]').forEach(fleche => {
            setTimeout(() => {
                replaceBackgroundImageUrl(fleche);
            }, 100);
        });

        const internalObserver = new MutationObserver(mutationsList => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
                     if (mutation.target && mutation.target.matches && mutation.target.matches('div[class^="fleche"]')) {
                         setTimeout(() => replaceBackgroundImageUrl(mutation.target), 0);
                     }
                }
            }
        });
        const config = {
            attributes: true,
            attributeFilter: ['style', 'class'], 
            childList: false,
            subtree: true
        };

        internalObserver.observe(container, config);
    }
    const bodyObserver = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.addedNodes) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.matches(flechesContainerSelector)) {
                            processFlechesContainer(node);
                        }
                        else if (node.querySelectorAll) {
                             const containersInNode = node.querySelectorAll(flechesContainerSelector);
                             if (containersInNode.length > 0) {
                                 containersInNode.forEach(processFlechesContainer);
                             }
                        }
                    }
                }
            }
        }
    });
    bodyObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

     document.querySelectorAll(flechesContainerSelector).forEach(container => {
        processFlechesContainer(container);
     });

})();