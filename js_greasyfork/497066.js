// ==UserScript==
// @name            Meduza: open all links in current tab
// @namespace       github.com/a2kolbasov
// @version         1.0.1
// @description     ...
// @author          Aleksandr Kolbasov
// @icon            https://www.google.com/s2/favicons?sz=64&domain=meduza.io
// @match           https://meduza.io/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/497066/Meduza%3A%20open%20all%20links%20in%20current%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/497066/Meduza%3A%20open%20all%20links%20in%20current%20tab.meta.js
// ==/UserScript==

/*
 * Copyright © 2023 - 2024 Aleksandr Kolbasov
 */

(() => {
    'use strict';

    /**
     * @param {Element} el
     */
    function removeTarget(el) {
        el.querySelectorAll('a[target="_blank"]').forEach(a => a.removeAttribute('target'));
    }

    const rootElement = document.querySelector('#root > div');
    console.assert(Boolean(rootElement));

    new MutationObserver((mutations, observer) => {
        for (let mutation of mutations) {
            for (let node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) removeTarget(node);
            }
        }
    }).observe(rootElement, { childList: true, subtree: true });

    removeTarget(document.body); // init
})();
