// ==UserScript==
// @name         Mask Money on MonarchMoney
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Replaces dollar amounts with $**.** on app.monarchmoney.com
// @author       JtMotoX
// @match        https://app.monarchmoney.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519788/Mask%20Money%20on%20MonarchMoney.user.js
// @updateURL https://update.greasyfork.org/scripts/519788/Mask%20Money%20on%20MonarchMoney.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const moneyRegex = /\$\d{1,3}(,\d{3})*(\.\d*)?(M|K)?/g;
    const maskText = '$**.**';

    // Function to replace money references in text and input fields
    const replaceMoneyReferences = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            if (moneyRegex.test(node.nodeValue)) {
                node.nodeValue = node.nodeValue.replace(moneyRegex, maskText);
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA') {
                if (moneyRegex.test(node.value)) {
                    node.value = node.value.replace(moneyRegex, maskText);
                }
            }
            node.childNodes.forEach((child) => replaceMoneyReferences(child));
        }
    };

    // Function to process shadow roots
    const processShadowRoot = (root) => {
        const elements = root.querySelectorAll('span.number span.number__inner');
        elements.forEach((el) => {
            if (el.textContent !== '**.**') {
                el.textContent = '**.**';
            }
        });
        root.childNodes.forEach((child) => replaceMoneyReferences(child));
    };

    // Recursive function to handle all shadow roots
    const traverseShadowRoots = (node, callback) => {
        if (!node) return;
        if (node.shadowRoot) {
            callback(node.shadowRoot);
            traverseShadowRoots(node.shadowRoot, callback);
        }
        node.childNodes.forEach((child) => traverseShadowRoots(child, callback));
    };

    // Unified function to mask all elements
    const maskAllElements = () => {
        replaceMoneyReferences(document.body);
        traverseShadowRoots(document.body, processShadowRoot);
    };

    // Hide all shadow DOMs initially
    const preHideShadowDOMs = () => {
        document.querySelectorAll('*').forEach((el) => {
            if (el.shadowRoot) {
                el.shadowRoot.host.style.visibility = 'hidden';
            }
        });
    };

    // Reveal shadow DOMs after masking
    const revealShadowDOMs = () => {
        document.querySelectorAll('*').forEach((el) => {
            if (el.shadowRoot) {
                el.shadowRoot.host.style.visibility = 'visible';
            }
        });
    };

    // Observe for DOM and shadow DOM changes
    const observeDOMChanges = () => {
        const observer = new MutationObserver(() => {
            maskAllElements();
            revealShadowDOMs(); // Ensure visibility is restored
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        // Initial masking
        maskAllElements();
        revealShadowDOMs();
    };

    const init = () => {

        preHideShadowDOMs();

        // Mask content
        maskAllElements();

        // Restore visibility
        document.body.style.visibility = 'visible';
        revealShadowDOMs();

        // Start observing for changes
        observeDOMChanges();
    };

    // Hide the page until all replacements have been performed
    document.body.style.visibility = 'hidden';

    // Initialize after the page loads
    window.addEventListener('load', init);
})();
