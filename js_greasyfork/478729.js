// ==UserScript==
// @name         Forge World Detector
// @version      1.0
// @description  Makes it easier to spot Forge World products in new GW store
// @match        https://www.warhammer.com/*
// @author       michalmaniak
// @namespace    https://github.com/michalzielinski913
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478729/Forge%20World%20Detector.user.js
// @updateURL https://update.greasyfork.org/scripts/478729/Forge%20World%20Detector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function replaceTextInElement(element) {
        if (element.nodeType === Node.TEXT_NODE) {
            element.nodeValue = element.nodeValue.replace(/Expert Kit/g, "Overpriced Kit");
        } else if (element.nodeType === Node.ELEMENT_NODE) {
            for (let i = 0; i < element.childNodes.length; i++) {
                replaceTextInElement(element.childNodes[i]);
            }
        }
    }

    function observeAndReplace() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        replaceTextInElement(node);
                    });
                }
            });
        });

        observer.observe(document, { subtree: true, childList: true });
    }

    replaceTextInElement(document.body);
    observeAndReplace();
})();