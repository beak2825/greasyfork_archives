// ==UserScript==
// @name         Stile Eyes On Teacher Remover
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Removes elements asking to keep eyes on teacher in Stile - Web
// @author       KoolKars (Felix)
// @match        *://*/*
// @match        https://stileapp.com/
// @icon         data:image/png;base64,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
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490794/Stile%20Eyes%20On%20Teacher%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/490794/Stile%20Eyes%20On%20Teacher%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function removeElements(selector) {
        var elements = document.querySelectorAll(selector);
        elements.forEach(function(element) {
            element.parentNode.removeChild(element);
        });
    }
    removeElements('div[data-test-label="pause-cover"]');
    var observerConfig = {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['data-test-label']
    };

    function mutationHandler(mutationsList, observer) {
        mutationsList.forEach(function(mutation) {
            if (mutation.type === 'childList' || (mutation.type === 'attributes' && mutation.attributeName === 'data-test-label')) {
                removeElements('div[data-test-label="pause-cover"]');
            }
        });
    }


    var observer = new MutationObserver(mutationHandler);

    observer.observe(document.body, observerConfig);
})();