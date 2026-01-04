// ==UserScript==
// @name         Facebook Hide Marketplace Deals
// @version      0.0.1
// @description  Hide the sponsored deals that show up in marketplace searches
// @match        *://*.facebook.com/marketplace/*
// @grant        none
// @author       bricem
// @namespace    bricem.scripts
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/404280/Facebook%20Hide%20Marketplace%20Deals.user.js
// @updateURL https://update.greasyfork.org/scripts/404280/Facebook%20Hide%20Marketplace%20Deals.meta.js
// ==/UserScript==

// Options for the observer (which mutations to observe)
const config = { childList: true, attributes: true, subtree: true }

// Callback function to execute when mutations are observed
const callback = (mutationsList, observer) => {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const dealsLink = node.querySelector("a[href*='tracking']")
                    if (dealsLink) {
                        dealsLink.parentNode.remove()
                    }
                }
            }
        } else if (mutation.type === 'attributes' && mutation.attributeName === 'href' && mutation.target.nodeType === Node.ELEMENT_NODE) {
            if (mutation.target.href.includes('tracking')) {
                mutation.target.parentNode.remove()
            }
        }
    }
}

// Create an observer instance linked to the callback function and observe
new MutationObserver(callback).observe(document, config)
