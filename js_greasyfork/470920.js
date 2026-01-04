// ==UserScript==
// @name         Google 2014 Part 5
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Changes height: 70px; to height: 50px; in the category .form-cont on the node <div class="noticebar"><div class="nbpr"></div></div>
// @author       You
// @match        https://vanced-youtube.neocities.org/2013*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470920/Google%202014%20Part%205.user.js
// @updateURL https://update.greasyfork.org/scripts/470920/Google%202014%20Part%205.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to find and change the height property
    function changeHeight() {
        const targetNode = document.querySelector('div.noticebar > div.nbpr > .form-cont');
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
})();
