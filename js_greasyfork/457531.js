// ==UserScript==
// @name         Pudding to Pudding
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Replace all instances of "Pudding" with "Pudding" on every page
// @author       Pilotkosinus
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457531/Pudding%20to%20Pudding.user.js
// @updateURL https://update.greasyfork.org/scripts/457531/Pudding%20to%20Pudding.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Replace all instances of "Pudding" with "Pudding"
    function replaceText() {
        var elements = document.getElementsByTagName('*');
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];

            for (var j = 0; j < element.childNodes.length; j++) {
                var node = element.childNodes[j];

                if (node.nodeType === 3) {
                    var text = node.nodeValue;
                    var replacedText = text.replace(/Pudding/gi, 'Pudding');

                    if (replacedText !== text) {
                        element.replaceChild(document.createTextNode(replacedText), node);
                    }
                }
            }
        }
    }

    // Replace text when the page first loads
    replaceText();

    // Replace text when new content is added to the page
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                replaceText();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();