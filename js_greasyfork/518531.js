// ==UserScript==
// @name         Zendesk Typing Indicator Fix
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Position the typing indicator in the center of the .pane.left.allow-overflow element, supporting both old and new Zendesk structures, and remove background/border.
// @author       Swiftlyx
// @match        https://*.zendesk.com/agent/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518531/Zendesk%20Typing%20Indicator%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/518531/Zendesk%20Typing%20Indicator%20Fix.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const css = `
        /* Styles for the indicator */
        article.sc-1e2m5fs-0.sc-bds72g-2.sc-df9fwt-0,
        article.sc-1e2m5fs-0.sc-bds72g-1.sc-df9fwt-0 {
            opacity: 0.7 !important; /* Semi-transparency */
            pointer-events: none !important; /* Disable interaction */
            position: absolute !important; /* Absolute positioning */
            z-index: 9999 !important; /* Above other elements */
            top: 96% !important; /* Initial position, will be centered by JS */
            left: 6% !important; /* Initial position, will be centered by JS */
            transform: translate(-50%, -50%) !important; /* Perfect centering if JS fails for some reason */
            width: auto !important; /* Adjust size */
            height: auto !important; /* Adjust size */
            border: none !important; /* Remove border */
            background: transparent !important; /* Remove background color */
            box-shadow: none !important; /* Remove box shadow */
        }

        /* Stability for SVG animation */
        svg.StyledInline-sc-fxsb9l-1 {
            display: block !important;
        }
    `;

    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    const moveToCenter = (node) => {
        const targetContainer = document.querySelector('div.pane.left.allow-overflow section[data-test-id="ticket-app-layout-main-pane"] div[data-test-id="omni-log-container"]');

        const fallbackContainer = document.querySelector('div.pane.left.allow-overflow');

        const containerToUse = targetContainer || fallbackContainer;

        if (containerToUse) {
            containerToUse.style.position = 'relative';
            node.style.position = 'absolute';
            node.style.top = '50%';
            node.style.left = '50%';
            node.style.transform = 'translate(-50%, -50%)';
            node.style.zIndex = '9999';
        } else {
        }
    };

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if (
                        node.nodeType === 1 && // Check if it is an element
                        node.matches &&
                        (
                            node.matches('article.sc-1e2m5fs-0.sc-bds72g-2.sc-df9fwt-0') ||
                            node.matches('article.sc-1e2m5fs-0.sc-bds72g-1.sc-df9fwt-0')
                        )
                    ) {
                        moveToCenter(node);
                    }
                });
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
