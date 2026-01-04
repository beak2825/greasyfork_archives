// ==UserScript==
// @name          kemono.su navbar duplicator
// @namespace       http://tampermonkey.net/
// @version        1.2
// @description     Add another navbar to post end
// @match         https://kemono.su/*
// @match         https://kemono.cr/*
// @author         rainbowflesh
// @grant         none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534561/kemonosu%20navbar%20duplicator.user.js
// @updateURL https://update.greasyfork.org/scripts/534561/kemonosu%20navbar%20duplicator.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let isNavCloned = false;
    let clonedNav = null;

    function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    function cloneNav() {
        const nav = document.querySelector("nav.post__nav-links");
        const body = document.querySelector("div.post__body");

        if (nav && body && !isNavCloned) {
            clonedNav = nav.cloneNode(true);
            insertAfter(clonedNav, body);
            isNavCloned = true;
            setupHrefObserver(nav, clonedNav);
        }
    }

    function setupHrefObserver(originalNav, clonedNav) {
        // Get the original and cloned "next" links
        const originalNext = originalNav.querySelector(".post__nav-link.next");
        const clonedNext = clonedNav.querySelector(".post__nav-link.next");

        if (!originalNext || !clonedNext) return;

        // Observe changes to the href attribute on the original next link
        const hrefObserver = new MutationObserver(() => {
            // Sync href from original to cloned
            clonedNext.href = originalNext.href;
        });

        hrefObserver.observe(originalNext, { attributes: true, attributeFilter: ['href'] });

        // Initial sync
        clonedNext.href = originalNext.href;
    }

    const bodyObserver = new MutationObserver(() => {
        cloneNav();
    });

    bodyObserver.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('load', cloneNav);
})();

