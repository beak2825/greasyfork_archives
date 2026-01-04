// ==UserScript==
// @name				Hide Cakeday Comments
// @namespace			Hide Cakeday Comments
// @version				2.0
// @description			Hides comments that contain cakeday-related keywords
// @match				https://www.reddit.com/*
// @license              MIT
// @downloadURL https://update.greasyfork.org/scripts/486245/Hide%20Cakeday%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/486245/Hide%20Cakeday%20Comments.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var keywords = ["cakeday", "cake day", "happy cake", "and my axe"];

    function hideElement(element) {
        var innerHTML = element.innerHTML.toLowerCase();
        if (keywords.some(keyword => innerHTML.includes(keyword))) {
            var ancestor = element.closest('._3sf33-9rVAO_v4y0pIW_CH').parentElement.parentElement.parentElement;
            ancestor.style.display = 'none';

            var descendant = ancestor.querySelector('._1RIl585IYPW6cmNXwgRz0J');
            var currentLevel = parseInt(descendant.innerHTML.match(/(\d+)/)[1], 10);

            var newAncestor = ancestor.nextElementSibling;
            while (newAncestor) {
                var newDescendant = newAncestor.querySelector('._1RIl585IYPW6cmNXwgRz0J');
                var nextLevel = parseInt(newDescendant.innerHTML.match(/(\d+)/)[1], 10);

                if (nextLevel > currentLevel) {
                    newAncestor.style.display = 'none';
                } else if (nextLevel <= currentLevel) {
                    break;
                }

                newAncestor = newAncestor.nextElementSibling;
            }
        }
    }

    var elements = document.querySelectorAll('._1qeIAgB0cPwnLhDF9XSiJM, ._7T4UafM1PdBGycd5na9nF');
    elements.forEach(hideElement);

    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                hideElement();
            }
        });
    });
    var config = { childList: true, subtree: true };
    observer.observe(document.body, config);
})();