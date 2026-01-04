// ==UserScript==
// @name         YouTube Height Changer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Changes height: 70px; to height: 50px; in the category .form-cont
// @author       You
// @match        https://vanced-youtube.neocities.org/2013-search/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470921/YouTube%20Height%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/470921/YouTube%20Height%20Changer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to change the height property
    function changeHeight() {
        const targetNodes = document.querySelectorAll('.form-cont');
        targetNodes.forEach(node => {
            node.style.height = '50px';
        });
    }

    // MutationObserver to wait for the target elements to be available
    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                changeHeight();
            }
        }
    });

    // Observe the body for changes to find the target elements
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial change for elements already present on the page
    changeHeight();
})();