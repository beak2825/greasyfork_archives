// ==UserScript==
// @name         Google 2014 part 6
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Changes height: 70px; to height: 50px; in the rule .form-cont
// @author       You
// @match        *://vanced-youtube.neocities.org/2013-search/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470923/Google%202014%20part%206.user.js
// @updateURL https://update.greasyfork.org/scripts/470923/Google%202014%20part%206.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to change the height property
    function changeHeight() {
        const targetNode = document.querySelector('.form-cont');
        if (targetNode) {
            targetNode.style.height = '50px';
        }
    }

    // MutationObserver to wait for the target element to be available
    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                changeHeight();
                observer.disconnect();
            }
        }
    });

    // Observe the body for changes to find the target element
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial change for the element already present on the page
    changeHeight();
})();