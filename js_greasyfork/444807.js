// ==UserScript==
// @name         z/place Overlay
// @namespace    https://minuskube.fr
// @license      MIT
// @version      1.3
// @description  Overlay for z/place
// @author       MinusKube
// @match        https://zunivers.zerator.com/place
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zerator.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444807/zplace%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/444807/zplace%20Overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function loadOverlay(canvas) {
        const parentDiv = canvas.parentElement;

        const image = document.createElement("img");
        image.width = 500;
        image.height = 500;
        image.src = "https://minuskube.fr/zplace_overlay.png";
        image.style = `
    position: absolute;
    left: 0;
    top: 0;
    image-rendering: pixelated;
    `;

        parentDiv.appendChild(image);

        document.addEventListener('keypress', function(event) {
            if (event.code != 'KeyH') {
                return;
            }

            image.hidden = !image.hidden;
        });
    }

    const observer = new MutationObserver(function (mutations, mutationInstance) {
        let addedCanvas = null;
        mutationLoop: for (const mutation of mutations) {
            // Check if the canvas has been added during this mutation
            for (const addedNode of mutation.addedNodes) {
                if (!(addedNode instanceof Element)) {
                    continue;
                }

                const canvases = addedNode.getElementsByTagName('canvas');
                if (canvases.length > 0) {
                    addedCanvas = canvases[0];
                    break mutationLoop;
                }
            }
        }

        if (addedCanvas) {
            loadOverlay(addedCanvas);
        }
    });

    observer.observe(document, {
        childList: true,
        subtree:   true
    });
})();