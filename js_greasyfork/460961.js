// ==UserScript==
// @name         Hide 万和OA水印
// @namespace    davisz
// @version      1.0
// @description  Hide all elements with class="mask_div"
// @match        http://oa.wanhesec.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460961/Hide%20%E4%B8%87%E5%92%8COA%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/460961/Hide%20%E4%B8%87%E5%92%8COA%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define a function to hide mask_div elements
    function hideMaskDivs() {
        const maskDivs = document.querySelectorAll('.mask_div');
        maskDivs.forEach(function(maskDiv) {
            maskDiv.style.display = 'none';
        });
    }

    // Hide mask_div elements on page load
    window.addEventListener('load', function() {
        hideMaskDivs();

        // Observe mutations in the document
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                const addedNodes = mutation.addedNodes;
                if (addedNodes) {
                    for (let i = 0; i < addedNodes.length; i++) {
                        const addedNode = addedNodes[i];
                        if (addedNode.nodeType === Node.ELEMENT_NODE && addedNode.matches('.mask_div')) {
                            addedNode.style.display = 'none';
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
