// ==UserScript==
// @name         Click to Dial Phone Icon
// @namespace    https://schlomo.schapiro.org/
// @version      2024.11.12.01
// @description  Add phone icon to phone numbers for dialing (click) and copying (context menu / right click)
// @author       Schlomo Schapiro
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @homepageURL  https://schlomo.schapiro.org/
// @icon         https://gist.githubusercontent.com/schlomo/d68c66b6cf9e5d8a258e22c9bf31bf3f/raw/~click-to-dial.svg
// @downloadURL https://update.greasyfork.org/scripts/515018/Click%20to%20Dial%20Phone%20Icon.user.js
// @updateURL https://update.greasyfork.org/scripts/515018/Click%20to%20Dial%20Phone%20Icon.meta.js
// ==/UserScript==

/**

This script adds a phone icon before every phone number found. Click to dial via your local
soft phone (whathappens is the same as clicking on a tel: link), right click to copy the 
phone number to the clipboard.

My motivation for writing this was to have a solution that I can trust because the code
is simple enough to read. And to find out how well I can write this with the help of AI 😁

Add debug to URL query or hash to activate debug output in console

Copyright 2024 Schlomo Schapiro

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

 */

const PHONE_6546546_REGEX = new RegExp(String.raw`
    (?<!\d)                         # Negative lookbehind: not preceded by a digit

        (?:\+|0)                    # Start with + or 0
        (?:
            # Separators, digits, and special dial characters w , * #,
            # dial code must end on digit or #
            [().\sw,*#\/-]*[\d#]    
        # 10-50 long to exclude typical dates, times and ranges but allow DTMF codes
        ){10,50}                    
    
    (?!\d)                          # Not followed by a digit
`.replace(/\s+#.+/g, '')        // Remove comments
    .replace(/\s+/g, ''),       // Remove whitespace
    'g'                         // Global flag
);

// export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PHONE_6546546_REGEX };
}

(() => {

    // Exit early if not running in a browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') {
        return;
    }

    const ID_SUFFIX = Math.random().toString(36).substring(2, 8);
    const PREFIX = 'click-to-dial';
    const PHONE_ICON_ELEMENT = `${PREFIX}-icon-${ID_SUFFIX}`;
    const PHONE_NUMBER_CLASS = `${PREFIX}-number-${ID_SUFFIX}`;
    const NO_PHONE_ICON_CLASS = `${PREFIX}-no-icon-${ID_SUFFIX}`;
    const STYLE_ID = `${PREFIX}-style-${ID_SUFFIX}`;

    const hasDebug = window.location.search.includes('debug') ||
        window.location.hash.includes('debug');
    const debug = hasDebug
        ? (...args) => console.log('[Click to Dial]', ...args)
        : () => { };

    let processCount = 0;

    // Define the phone icon element
    class PhoneIcon extends HTMLElement {
        constructor(phoneNumber) {
            super();
            this.phoneNumber = phoneNumber;
            this.textContent = '☎';
            this.title = `Call ${phoneNumber}`;

            this.addEventListener('click', e => {
                e.preventDefault();
                window.location.href = 'tel:' + this.phoneNumber;
            });

            this.addEventListener('contextmenu', e => {
                e.preventDefault();
                navigator.clipboard.writeText(this.phoneNumber)
                    .then(() => showCopiedTooltip(e, this.phoneNumber))
                    .catch(err => {
                        console.error('Copy failed:', err);
                        showCopiedTooltip(e, 'Copy failed - browser denied clipboard access', true);
                    });
            });
        }
    }

    function injectStyles() {
        if (document.getElementById(STYLE_ID)) return;

        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = `
${PHONE_ICON_ELEMENT} {
    margin-right: 0.3em;
    text-decoration: none !important;
    color: inherit !important;
    cursor: pointer !important;
}
@media print {
    ${PHONE_ICON_ELEMENT} {
        display: none !important;
    }
}
    `;
        document.head.appendChild(style);
    }

    function showCopiedTooltip(event, phoneNumberOrErrorMessage, isError = false) {
        const tooltip = document.createElement('div');
        tooltip.className = NO_PHONE_ICON_CLASS;
        tooltip.textContent = isError
            ? phoneNumberOrErrorMessage
            : `Phone number ${phoneNumberOrErrorMessage} copied!`;
        tooltip.style.cssText = `
            position: fixed;
            left: ${event.clientX + 10}px;
            top: ${event.clientY + 10}px;
            background: ${isError ? '#d32f2f' : '#333'};
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 10000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s;
        `;
        document.body.appendChild(tooltip);
        requestAnimationFrame(() => {
            tooltip.style.opacity = '1';
            setTimeout(() => {
                tooltip.style.opacity = '0';
                setTimeout(() => tooltip.remove(), 200);
            }, 1000);
        });
    }

    function createPhoneIcon(phoneNumber) {
        const cleanNumber = phoneNumber.replace(/[^\d+]/g, '').replace('+490', '+49');
        return new PhoneIcon(cleanNumber);
    }

    function isEditable(element) {
        if (!element) return false;
        if (element.getAttribute('contenteditable') === 'false') return false;

        return element.isContentEditable ||
            (element.tagName === 'INPUT' && !['button', 'submit', 'reset', 'hidden'].includes(element.type?.toLowerCase())) ||
            element.tagName === 'TEXTAREA' ||
            (element.getAttribute('role') === 'textbox' && element.getAttribute('contenteditable') !== 'false') ||
            element.getAttribute('contenteditable') === 'true' ||
            element.classList?.contains('ql-editor') ||
            element.classList?.contains('cke_editable') ||
            element.classList?.contains('tox-edit-area') ||
            element.classList?.contains('kix-page-content-wrapper') ||
            element.classList?.contains('waffle-content-pane');
    }

    function processTextNode(node) {
        PHONE_6546546_REGEX.lastIndex = 0;  // reset regex to always match from the beginning
        const matches = Array.from(node.textContent.matchAll(PHONE_6546546_REGEX));
        if (!matches.length) return 0;
        /* 
        debug('Found numbers: ',
            matches.map(m => m[0]).join(', ')
        );
         */
        const fragment = document.createDocumentFragment();
        let lastIndex = 0;

        matches.forEach(match => {
            if (match.index > lastIndex) {
                fragment.appendChild(document.createTextNode(node.textContent.slice(lastIndex, match.index)));
            }

            const span = document.createElement('span');
            span.className = PHONE_NUMBER_CLASS;

            const icon = createPhoneIcon(match[0]);
            span.appendChild(icon);
            span.appendChild(document.createTextNode(match[0]));
            fragment.appendChild(span);

            lastIndex = match.index + match[0].length;
        });

        if (lastIndex < node.textContent.length) {
            fragment.appendChild(document.createTextNode(node.textContent.slice(lastIndex)));
        }

        node.parentNode.replaceChild(fragment, node);
        return matches.length;
    }

    function traverseDOM(node) {
        let nodesProcessed = 0;
        let phoneNumbersFound = 0;

        // Get all text nodes
        const textNodes = document.evaluate(
            './/text()',
            node,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null
        );

        // Process each text node
        for (let i = 0; i < textNodes.snapshotLength; i++) {
            const textNode = textNodes.snapshotItem(i);
            const parent = textNode.parentElement;

            // Skip empty or very short text nodes
            if (!textNode.textContent || textNode.textContent.trim().length < 5) {
                continue;
            }

            // Skip if already processed or in excluded content
            if (!parent ||
                parent.closest('script, style') ||
                isEditable(parent.closest('[contenteditable], textarea, input')) ||  // Check editability of closest editable ancestor
                isEditable(parent) ||
                parent.classList?.contains(PHONE_NUMBER_CLASS) ||
                parent.classList?.contains(NO_PHONE_ICON_CLASS) ||
                textNode.parentNode.closest(`.${PHONE_NUMBER_CLASS}`)) {
                continue;
            }

            nodesProcessed++;
            phoneNumbersFound += processTextNode(textNode);
        }

        return { nodesProcessed, phoneNumbersFound };
    }

    function processPhoneNumbers() {
        const startTime = performance.now();
        const { nodesProcessed, phoneNumbersFound } = traverseDOM(document.body);

        if (phoneNumbersFound > 0) {
            const duration = performance.now() - startTime;
            debug(
                `Phone number processing #${++processCount}:`,
                `${phoneNumbersFound} numbers in ${nodesProcessed} nodes, ${duration.toFixed(1)}ms`
            );
        }
    }

    function initialize() {
        if (!document.body) {
            debug('Body not ready, waiting...');
            requestAnimationFrame(initialize);
            return;
        }

        debug('Initializing...');

        // Register the custom element
        if (!customElements.get(PHONE_ICON_ELEMENT)) {
            customElements.define(PHONE_ICON_ELEMENT, PhoneIcon);
        }

        injectStyles();

        // Initial processing with slight delay to let the page settle
        requestAnimationFrame(processPhoneNumbers);

        // Set up observer for dynamic content
        const observer = new MutationObserver(mutations => {
            // Early exit if no actual changes
            if (!mutations.length) return;

            // Check if we have any relevant changes
            const hasRelevantChanges = mutations.some(mutation => {
                // Quick check for added nodes
                if (mutation.addedNodes.length > 0) {
                    // Only process if added nodes contain text or elements
                    return Array.from(mutation.addedNodes).some(node =>
                        node.nodeType === Node.TEXT_NODE ||
                        (node.nodeType === Node.ELEMENT_NODE &&
                            !['SCRIPT', 'STYLE', 'META', 'LINK'].includes(node.tagName))
                    );
                }

                // Check attribute changes only on elements that could matter
                if (mutation.type === 'attributes') {
                    const target = mutation.target;
                    return target.nodeType === Node.ELEMENT_NODE &&
                        !['SCRIPT', 'STYLE', 'META', 'LINK'].includes(target.tagName) &&
                        ['contenteditable', 'role', 'class'].includes(mutation.attributeName);
                }

                return false;
            });

            if (hasRelevantChanges) {
                // Debounce multiple rapid changes
                if (!initialize.pendingUpdate) {
                    initialize.pendingUpdate = true;
                    requestAnimationFrame(() => {
                        processPhoneNumbers();
                        initialize.pendingUpdate = false;
                    });
                }
            }
        });

        try {
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['contenteditable', 'role', 'class']
            });
        } catch (e) {
            debug('Failed to set up observer:', e);
        }
    }

    // Start initialization process depending on document state
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();
