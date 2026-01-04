// ==UserScript==
// @name         Convert Value to Link by ID
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Convert value attributes to clickable links for elements with a specific ID on https://cab.meest.cn
// @author       max5555
// @match        https://cab.meest.cn/*
// @grant        none
// @license  	MIT

// @downloadURL https://update.greasyfork.org/scripts/479441/Convert%20Value%20to%20Link%20by%20ID.user.js
// @updateURL https://update.greasyfork.org/scripts/479441/Convert%20Value%20to%20Link%20by%20ID.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function convertValueToLink() {
        const elements = document.querySelectorAll('#photo-product');
        for (const element of elements) {
            const url = element.getAttribute('value');
            if (url && !element.nextElementSibling?.classList.contains('converted-link')) {
                const anchor = document.createElement('a');
                anchor.href = url;
                anchor.target = '_blank';
                anchor.textContent = url;
                anchor.classList.add('converted-link');  // To avoid adding the same link multiple times
                element.insertAdjacentElement('afterend', anchor);
            }
        }
    }

    // Use a MutationObserver to detect dynamic content changes
    const observer = new MutationObserver(mutations => {
        convertValueToLink();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Convert existing elements on page load
    convertValueToLink();
})();
