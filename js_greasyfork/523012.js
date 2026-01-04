// ==UserScript==
// @name         WaitForKeyElement
// @namespace    Violentmonkey Scripts
// @version      1.1
// @description  Waits for an element using the MutationObserver API
// @author       PaywallDespiser
// @grant        none
// ==/UserScript==

/**
 * Waits for a element of a given selector.
 *
 * @param {string} selector
 * @param {Element} [target=document.body]
 * @returns {Promise<Element>}
 */
function waitForKeyElement(selector, target = document.body) {
    return new Promise((resolve) => {
        {
            const element = target.querySelector(selector);
            if (element) {
                return resolve(element);
            }
        }

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (!(node instanceof HTMLElement)) continue;

                    if (node.matches(selector)) {
                        observer.disconnect();
                        resolve(node);
                        return;
                    }
                    const childElement = node.querySelector(selector);
                    if (childElement) {
                        observer.disconnect();
                        resolve(childElement);
                        return;
                    }
                }
            }
        });

        observer.observe(target, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false,
        });
    });
}