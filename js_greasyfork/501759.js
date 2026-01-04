// ==UserScript==
// @name         GradTag Stealer
// @namespace    https://gist.github.com/Pseudorizer/27abc3f643ad61c6923513c34e9b1c3a
// @version      1.0.1
// @description  Adds a download button to gradtag images
// @author       Pseudorizer <https://github.com/Pseudorizer>
// @match        https://photos.gradtag.co.uk/gradtag-*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gradtag.co.uk
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501759/GradTag%20Stealer.user.js
// @updateURL https://update.greasyfork.org/scripts/501759/GradTag%20Stealer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const run = () => {
        const images = document.querySelector('.grid');

        const urlRegex = /url\("(.+?)"\)/i;

        for (const image of images.childNodes) {
            const imageSrc = image.childNodes[0];
            const originalButton = image.childNodes[1];

            const imageUrl = imageSrc.style.backgroundImage;
            const imageUrlMatch = imageUrl.match(urlRegex)[1];

            const clonedButton = originalButton.cloneNode(true);
            clonedButton.style.right = '7rem';

            clonedButton.addEventListener('click', () => {
                window.open(imageUrlMatch);
            });

            const clonedButtonIcon = clonedButton.childNodes[0];
            clonedButtonIcon.classList.replace('fa-search', 'fa-download');
            clonedButtonIcon.style.transform = 'unset';

            image.insertBefore(clonedButton, originalButton);
        }
    };

    window.addEventListener('load', () => {
        const targetNode = document.body;

        const callback = (mutationList, observer) => {
            for (const mutation of mutationList) {
                for (const addedNode of mutation.addedNodes) {
                    if (addedNode.classList && addedNode.classList.contains('grid')) {
                        observer.disconnect();
                        run();
                    }
                }
            }
        };

        const observer = new MutationObserver(callback);

        observer.observe(targetNode, { attributes: false, childList: true, subtree: true });
    });
})();