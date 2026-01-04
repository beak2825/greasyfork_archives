// ==UserScript==
// @name         Remove Em Dashes from span and div (Smart Focus)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Recursively remove em dashes and their escape forms from spans and divs. Watches DOM, cleans on page load, and runs every 2 seconds — but only when window is focused. Efficiency, baby.
// @author       Shikaku (same username on Discord)
// @match        https://chatgpt.com/*
// @grant        none
// @license      BSD-4-Clause
// @downloadURL https://update.greasyfork.org/scripts/539178/Remove%20Em%20Dashes%20from%20span%20and%20div%20%28Smart%20Focus%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539178/Remove%20Em%20Dashes%20from%20span%20and%20div%20%28Smart%20Focus%29.meta.js
// ==/UserScript==
//note: replace  https://chatgpt.com/* with *://*/* if you want it to work with every site

(function() {
    'use strict';

    const emDashRegex = /—|&mdash;|&#8212;|&#x2014;|\u2014/g;

    function cleanTextNodes(node) {
        if (!node) return;

        if (node.nodeType === Node.TEXT_NODE && emDashRegex.test(node.textContent)) {
            node.textContent = node.textContent.replace(emDashRegex, '-'); //replace the '-' with whatever you want, like for example ', ' or even ' ' or ''
        }

        node.childNodes?.forEach(cleanTextNodes);
    }

    function cleanAll() {
        if (!document.hasFocus()) return; // Skip if tab is not active
        document.querySelectorAll('div, span').forEach(cleanTextNodes);
    }

    // Initial pass
    cleanAll();

    // Also run once on full load
    window.addEventListener('load', cleanAll);

    // Interval check (only if focused)
    setInterval(cleanAll, 2000);

    // DOM mutation observer
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.matches('div, span')) cleanTextNodes(node);
                    node.querySelectorAll?.('div, span').forEach(cleanTextNodes);
                }
            });

            if (mutation.type === 'characterData') {
                cleanTextNodes(mutation.target);
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });

    // Patch clipboard writes to replace em dashes
    const originalWriteText = navigator.clipboard.writeText.bind(navigator.clipboard);

    navigator.clipboard.writeText = function(text) {
    const cleaned = text.replace(/—|&mdash;|&#8212;|&#x2014;|\u2014/g, '-');
    return originalWriteText(cleaned);
};
})();