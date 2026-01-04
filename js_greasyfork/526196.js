// ==UserScript==
// @name         Warcraft Logs Number Abbreviator
// @namespace    athei
// @author       Alexander Theißen
// @version      1.0.0
// @description  Abbreviate big numbers in the event log using K,M,B suffixes.
// @match        http://*.warcraftlogs.com/*
// @match        https://*.warcraftlogs.com/*
// @grant        none
// @license      GPL3
// @downloadURL https://update.greasyfork.org/scripts/526196/Warcraft%20Logs%20Number%20Abbreviator.user.js
// @updateURL https://update.greasyfork.org/scripts/526196/Warcraft%20Logs%20Number%20Abbreviator.meta.js
// ==/UserScript==

// Process nodes that exist at load time of this script.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', processNodes);
} else {
    processNodes();
}

// Process nodes that are added after this script is run.
const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            // Only process element nodes.
            if (node.nodeType === Node.ELEMENT_NODE) {
                // If the added node itself is a span, process it.
                if (node.tagName.toLowerCase() === 'span') {
                    processElement(node);
                }
                // Process any span descendants of the added node.
                processNodes(node);
            }
        });
    });
});
observer.observe(document.body, { childList: true, subtree: true });

function processNodes(root = document) {
    root.querySelectorAll('.event-description-cell span').forEach(span => {
        processElement(span);
    });
}

// Process a given element if its text is a pure number.
function processElement(el) {
    // There are other characters in the cell with the raw numbers
    // in case of healing or dots.
    let newText = el.textContent.replace(/(\d+(\.\d+)?)/g, function(match) {
        let num = parseInt(match);
        if (num >= 1000) {
            return abbreviateNumber(num);
        } else {
            return match;
        }
    });
    if (newText !== el.textContent) {
        el.textContent = newText;
    }
}

// Abbreviates numbers (e.g., 2358046 → 2.4M) if they're large enough.
function abbreviateNumber(num) {
    if (num >= 1e9) return (num / 1e9).toFixed(1) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
    return num.toString();
}
