// ==UserScript==
// @name         Comick.dev Comic Footer SVG Remover
// @namespace    https://github.com/GooglyBlox
// @version      1.1
// @description  Remove specific SVG element from comick.dev
// @author       GooglyBlox
// @match        https://comick.dev/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541573/Comickdev%20Comic%20Footer%20SVG%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/541573/Comickdev%20Comic%20Footer%20SVG%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeTargetSVG() {
        const svgs = document.querySelectorAll('svg[viewBox="0 0 24 24"][fill="currentColor"][data-slot="icon"].w-7.h-7.stroke-yellow-500');

        svgs.forEach(svg => {
            const path = svg.querySelector('path[fill-rule="evenodd"][clip-rule="evenodd"]');
            if (path && path.getAttribute('d') === 'M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm6-2.438c0-.724.588-1.312 1.313-1.312h4.874c.725 0 1.313.588 1.313 1.313v4.874c0 .725-.588 1.313-1.313 1.313H9.564a1.312 1.312 0 0 1-1.313-1.313V9.564Z') {
                svg.remove();
            }
        });
    }

    function initializeRemoval() {
        removeTargetSVG();

        const observer = new MutationObserver(function(mutations) {
            let shouldCheck = false;

            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    for (let node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.tagName === 'SVG' || node.querySelector('svg')) {
                                shouldCheck = true;
                                break;
                            }
                        }
                    }
                }
            });

            if (shouldCheck) {
                removeTargetSVG();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeRemoval);
    } else {
        initializeRemoval();
    }
})();