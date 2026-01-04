// ==UserScript==
// @name            Eaglercraft Mouse Wheel Canceler
// @namespace    http://tampermonkey.net/
// @version          0.3
// @description     unpi
// @author           eringo216
// @match           *://*.replit.dev/*
// @include          *://*eagler*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502615/Eaglercraft%20Mouse%20Wheel%20Canceler.user.js
// @updateURL https://update.greasyfork.org/scripts/502615/Eaglercraft%20Mouse%20Wheel%20Canceler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function preventDefault(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    document.addEventListener('wheel', preventDefault, { passive: false, capture: true });
    document.addEventListener('DOMMouseScroll', preventDefault, { passive: false, capture: true });
    document.addEventListener('mousewheel', preventDefault, { passive: false, capture: true });

    var elements = document.querySelectorAll('*');
    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener('wheel', preventDefault, { passive: false, capture: true });
        elements[i].addEventListener('DOMMouseScroll', preventDefault, { passive: false, capture: true });
        elements[i].addEventListener('mousewheel', preventDefault, { passive: false, capture: true });
    }

    new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            var newNodes = mutation.addedNodes;
            for (var j = 0; j < newNodes.length; j++) {
                var newNode = newNodes[j];
                if (newNode.nodeType === 1) {
                    newNode.addEventListener('wheel', preventDefault, { passive: false, capture: true });
                    newNode.addEventListener('DOMMouseScroll', preventDefault, { passive: false, capture: true });
                    newNode.addEventListener('mousewheel', preventDefault, { passive: false, capture: true });
                }
            }
        });
    }).observe(document.body, { childList: true, subtree: true });

})();
