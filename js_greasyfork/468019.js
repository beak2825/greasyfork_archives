// ==UserScript==
// @name         Remove Expired Membership Message From EasyScholar
// @namespace    ToughScholar
// @version      1.0
// @description  Removes the expired membership message from elements with class name "easyscholar-\d easyscholar-ranking"
// @match        https://scholar.google.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468019/Remove%20Expired%20Membership%20Message%20From%20EasyScholar.user.js
// @updateURL https://update.greasyfork.org/scripts/468019/Remove%20Expired%20Membership%20Message%20From%20EasyScholar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove the expired membership message
    function removeExpiredMembershipMessage(element) {
        const title = element.getAttribute('title');
        const newTitle = title.replace('您的会员已经到期，现在续费低至1.87元/月起', '');
        element.setAttribute('title', newTitle);
    }

    // MutationObserver callback function
    function mutationCallback(mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // Loop through added nodes
                for (let node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('easyscholar-ranking')) {
                        // Check if the class name matches the pattern easyscholar-\d
                        const classList = Array.from(node.classList);
                        const regex = /^easyscholar-\d$/;
                        const matches = classList.filter(className => regex.test(className));
                        if (matches.length > 0) {
                            removeExpiredMembershipMessage(node);
                        }
                    }
                }
            }
        }
    }

    // Create a new MutationObserver
    const observer = new MutationObserver(mutationCallback);

    // Start observing the document for changes
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();