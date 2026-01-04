// ==UserScript==
// @name        Enhanced Bing ChatAI
// @namespace   EnhancedBingChatAI
// @description Improves Bing ChatAI user experience by preventing accidental scrolling and increasing input character limit
// @version     1.4.2
// @author      CriDos
// @grant       GM_setClipboard
// @match       https://*.bing.com/*
// @match       https://copilot.microsoft.com/*
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/464747/Enhanced%20Bing%20ChatAI.user.js
// @updateURL https://update.greasyfork.org/scripts/464747/Enhanced%20Bing%20ChatAI.meta.js
// ==/UserScript==


// -------- Main code --------

// Prevent scrolling when hovering over cib-serp-main element
window.addEventListener('wheel', (event) => {
    if (event.target.className.includes('cib-serp-main')) {
        event.stopPropagation();
    }
});

// Increase input character limit to 100_000
var increaseCharacterLimit = async () => {
    const PAUSE_TASK = 1 * 1000;
    const MAX_LIMIT = 100_000;

    while (1) {
        try {
            const searchBox = queryElementsInShadowRoots(document.body, '#searchbox')
            for (let i = 0; i < searchBox.length; i++) {
                let sb = searchBox[i];
                if (sb.maxLength < MAX_LIMIT) {
                    console.log("Fixing input character limit to " + MAX_LIMIT);

                    sb.maxLength = MAX_LIMIT;
                    const letterCounter = queryElementsInShadowRoots(document.body, '.letter-counter');
                    if (letterCounter.length > 0) {
                        let letterCounterElement = letterCounter[0].children[0];
                        const currentCountSpan = letterCounterElement;
                        const limitTextNode = currentCountSpan.nextSibling.nextSibling;
                        limitTextNode.textContent = MAX_LIMIT;
                    }
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            await qWait(PAUSE_TASK);
        }
    }
}

increaseCharacterLimit();

// -------- Utility functions --------

// Query elements in shadow roots
function queryElementsInShadowRoots(node, className) {
    let results = [];

    function traverseShadowRoot(node) {
        if (node.shadowRoot) {
            const elements = node.shadowRoot.querySelectorAll(className);
            elements.forEach(element => {
                results.push(element);
            });

            node.shadowRoot.childNodes.forEach(child => {
                traverseShadowRoot(child);
            });
        } else {
            node.childNodes.forEach(child => {
                traverseShadowRoot(child);
            });
        }
    }

    traverseShadowRoot(node);

    return results;
}

// Wait for an element to appear
function waitForElement(selector, callback, timeout = 1000) {
    const interval = setInterval(() => {
        const element = document.querySelector(selector);
        if (element) {
            clearInterval(interval);
            callback();
        }
    }, timeout);
};


async function qWait(delay) {
    await new Promise((res) => setTimeout(res, delay));
}