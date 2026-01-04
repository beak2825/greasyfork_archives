// ==UserScript==
// @name         Ouedkniss Elements Remover
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Remove sponsored banners from Ouedkniss
// @author       Harrysof
// @icon         https://greasyfork.s3.us-east-2.amazonaws.com/9emqda6d7wwfzlfawkqaxcqx6o5h
// @match        https://www.ouedkniss.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/517810/Ouedkniss%20Elements%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/517810/Ouedkniss%20Elements%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Array of selectors to remove
    const selectorsToRemove = [
        '.page-top-1',
        '.o-section-heading',
        '.home-promo-header'
    ];

    function removeElements(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => element.remove());
    }

    function removeBlur() {
        const blurredElements = document.querySelectorAll('[class*="blurred"]');
        blurredElements.forEach(element => {
            element.style.filter = 'none';
            element.classList.remove('blurred');
        });
    }

    function load() {
        // Remove specified elements
        selectorsToRemove.forEach(selector => removeElements(selector));
        removeBlur(); // Remove blur effects if any
    }

    load();

    for (const f of ['pushState', 'replaceState', 'forward', 'back', 'go']) {
        const fn = history[f];
        history[f] = function(...args) {
            fn.apply(this, args);
            load();
        };
    }
    const observer = new MutationObserver(() => {
        selectorsToRemove.forEach(selector => removeElements(selector));
        removeBlur();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();