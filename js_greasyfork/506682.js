// ==UserScript==
// @name         Remove Mulebuy Modal
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically removes the "keywords-modal" on mulebuy.com pages
// @author       Your Name
// @match        *://*mulebuy.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506682/Remove%20Mulebuy%20Modal.user.js
// @updateURL https://update.greasyfork.org/scripts/506682/Remove%20Mulebuy%20Modal.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeModal() {
        var modal = document.getElementById('keywords-modal');
        if (modal) {
            modal.remove();
            console.log('Mulebuy modal removed');
        }
    }

    window.addEventListener('load', removeModal);

    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                removeModal();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
