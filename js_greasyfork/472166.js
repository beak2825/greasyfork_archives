// ==UserScript==
// @name         Hide LanLing-OA-WaterMark
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hide elements with class="water-mark" and elements with class="mask_div"
// @match        http://oa.wanhesec.com/*
// @grant        none
// @lisence      MIT
// @downloadURL https://update.greasyfork.org/scripts/472166/Hide%20LanLing-OA-WaterMark.user.js
// @updateURL https://update.greasyfork.org/scripts/472166/Hide%20LanLing-OA-WaterMark.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define a function to hide elements with class="water-mark" and class="mask_div"
    function hideWatermarkAndMaskDivs() {
        const watermarkDivs = document.querySelectorAll('.water-mark');
        const maskDivs = document.querySelectorAll('.mask_div');

        watermarkDivs.forEach(function(watermarkDiv) {
            watermarkDiv.style.display = 'none';
        });

        maskDivs.forEach(function(maskDiv) {
            maskDiv.style.display = 'none';
        });
    }

    // Hide elements with class="water-mark" and class="mask_div" on page load
    window.addEventListener('load', function() {
        hideWatermarkAndMaskDivs();

        // Observe mutations in the document
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                const addedNodes = mutation.addedNodes;
                if (addedNodes) {
                    for (let i = 0; i < addedNodes.length; i++) {
                        const addedNode = addedNodes[i];
                        if (addedNode.nodeType === Node.ELEMENT_NODE) {
                            if (addedNode.matches('.water-mark') || addedNode.matches('.mask_div')) {
                                addedNode.style.display = 'none';
                            }
                        }
                    }
                }
            });
        });

        observer.observe(document, {
            childList: true,
            subtree: true
        });
    });

})();
