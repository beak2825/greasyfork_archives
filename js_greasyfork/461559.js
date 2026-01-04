// ==UserScript==
// @name         Hide youtube theather mode button
// @version      2.1
// @description  It's in the name
// @author       equmaq
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/990886
// @downloadURL https://update.greasyfork.org/scripts/461559/Hide%20youtube%20theather%20mode%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/461559/Hide%20youtube%20theather%20mode%20button.meta.js
// ==/UserScript==
 
(function() {
    'use strict';

    // Function to remove elements with the specified class
    function removeElementsWithClass(className) {
        const elements = document.querySelectorAll('.' + className);
        elements.forEach(function(element) {
            element.remove();
        });
    }

    // Remove elements with the class "ytp-size-button ytp-button" on page load
    removeElementsWithClass('ytp-size-button', 'ytp-button');

    // Use MutationObserver to continuously check for new elements and remove them
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.classList && node.classList.contains('ytp-size-button') && node.classList.contains('ytp-button')) {
                        node.remove();
                    }
                });
            }
        });
    });

    // Start observing the DOM for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();