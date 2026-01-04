// ==UserScript==
// @name         Linkowanie numeru oferty na Allegro
// @version      0.1
// @description  Konwertuj numer oferty na klikalny link
// @author       Vomar
// @match        *://*.allegro.pl/*
// @grant        none
// @namespace https://greasyfork.org/users/156999
// @downloadURL https://update.greasyfork.org/scripts/478064/Linkowanie%20numeru%20oferty%20na%20Allegro.user.js
// @updateURL https://update.greasyfork.org/scripts/478064/Linkowanie%20numeru%20oferty%20na%20Allegro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Funkcja przekształcająca tekst w link
    function convertToLink(element) {
        let textContent = element.textContent;
        let match = textContent.match(/nr oferty: (\d+)/);
        if (match) {
            let offerNumber = match[1];
            let link = document.createElement('a');
            link.href = 'https://allegro.pl/listing?string=' + offerNumber;
            link.textContent = 'nr oferty: ' + offerNumber;
            element.parentNode.replaceChild(link, element);
        }
    }

    // Obserwuj zmiany w DOM
    const observer = new MutationObserver((mutationsList, observer) => {
        for(let mutation of mutationsList) {
            if(mutation.addedNodes && mutation.addedNodes.length > 0) {
                for(let node of mutation.addedNodes) {
                    if(node.nodeType === 1) { // ELEMENT_NODE
                        if(node.matches('[data-test-id="item-offer-id"]')) {
                            convertToLink(node);
                        } else {
                            let elements = node.querySelectorAll('[data-test-id="item-offer-id"]');
                            elements.forEach(convertToLink);
                        }
                    }
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();
