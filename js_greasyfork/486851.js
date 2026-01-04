// ==UserScript==
// @name         Convert to binary
// @author       Nick M
// @namespace    https://youtu.be/rDDaEVcwIJM
// @version      2024-09-29.2
// @description  Attempts to convert any numbers on all webpages to base 2. Based on the video https://youtu.be/rDDaEVcwIJM
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/486851/Convert%20to%20binary.user.js
// @updateURL https://update.greasyfork.org/scripts/486851/Convert%20to%20binary.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const baseChars = ["ı","l"];
    const multipliers = {
        'k': 1000,
        'm': 1000000,
        'b': 1000000000
    };

    function toNewBase(str) {
        // Remove commas and handle multipliers
        str = str.replace(/,/g, '');
        let multiplier = 1;
        let match = str.match(/([0-9.]+)([kMB])?/i);
        if (match) {
            str = match[1];
            if (match[2]) multiplier = multipliers[match[2].toLowerCase()];
        }

        // Convert to number and apply multiplier
        let n = parseFloat(str) * multiplier;

        // Handle decimal part
        let intPart = Math.floor(n);
        let fracPart = n - intPart;

        let newStr = "";

        // Convert integer part
        if (intPart === 0) return "0";
        while (intPart > 0) {
            let remainder = intPart % baseChars.length;
            newStr = baseChars[remainder] + newStr;
            intPart = Math.floor(intPart / baseChars.length);
        }

        // Add decimal part if exists
        if (fracPart > 0) {
            newStr += '.';
            for (let i = 0; i < 4; i++) { // Convert up to 4 decimal places
                fracPart *= baseChars.length;
                let digit = Math.floor(fracPart);
                newStr += baseChars[digit];
                fracPart -= digit;
                if (fracPart === 0) break;
            }
        }

        return newStr;
    }

    function replaceNumbers(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            node.textContent = node.textContent.replace(/\b\d{1,3}(,\d{3})*(\.\d+)?([kMB])?\b|\b\d+(\.\d+)?([kMB])?\b/gi, match => toNewBase(match));
        } else if (node.nodeType === Node.ELEMENT_NODE && !['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(node.nodeName)) {
            for (let i = 0; i < node.childNodes.length; i++) {
                replaceNumbers(node.childNodes[i]);
            }
        }
    }

    let mutatedNodes = new Set();
    let processingScheduled = false;

    function scheduleProcessing() {
        if (!processingScheduled) {
            processingScheduled = true;
            setTimeout(() => {
                processMutations();
                processingScheduled = false;
            }, 10);
        }
    }

    function processMutations() {
        mutatedNodes.forEach(node => {
            if (node.isConnected) {
                replaceNumbers(node);
            }
        });
        mutatedNodes.clear();
    }

    function observeChanges() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            mutatedNodes.add(node);
                        }
                    });
                } else if (mutation.type === 'characterData') {
                    mutatedNodes.add(mutation.target);
                }
            });
            scheduleProcessing();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });

    }

    // Initial replacement
    replaceNumbers(document.body);

    // Observe future changes
    observeChanges();
})();