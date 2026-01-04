// ==UserScript==
// @name         CSS Cleaner and Loader for Bodruk
// @namespace    http://tampermonkey.net/
// @version      2025-04-24-1
// @description  Removes embedded styles and adds Bodruk custom CSS file / add warehouse style and functionality to code - filtering 
// @author       Krzysztof Mierzejewski - photograficznie
// @license      MIT
// @match        https://bodruk.pl/administracja/a_warehouse
// @match        https://bodruk.pl/administracja*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bodruk.pl
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/528731/CSS%20Cleaner%20and%20Loader%20for%20Bodruk.user.js
// @updateURL https://update.greasyfork.org/scripts/528731/CSS%20Cleaner%20and%20Loader%20for%20Bodruk.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add high-specificity CSS rules to override inline styles
    const overrideStyles = `
        body #modal[id="modal"] {
            border-radius: none !important;
            border: none !important;
            width: 90% !important;
            height: 90% !important;
            max-width: auto !important;
            max-height: auto !important;
        }

        body #modal[id="modal"] .modal-body {
            padding: 30px !important;
            border-radius: 20px !important;
            height: auto !important;
        }

        body #merchant-panel[id="merchant-panel"] #offers-controller #modal select {
            padding: 14px 20px !important;
        }

        body #modal[id="modal"] .product-box span.offer-element-native-discount-info {
            position: absolute !important;
            background: blue;
        }
        body #offers-controller[id="offers-controller"] .box-header {
		background: transparent !important;
		color: #000 !important;

        }
    `;

    // Function to add numbered span classes only to direct children of .title elements
    function addNumberedSpanClasses() {
        const titleElements = document.querySelectorAll('div[class="title"]');

        titleElements.forEach(title => {
            if (title.className === 'title') {
                const spans = title.querySelectorAll(':scope > span');
                Array.from(spans).forEach((span, index) => {
                    span.classList.forEach(className => {
                        if (className.startsWith('span-')) {
                            span.classList.remove(className);
                        }
                    });
                    span.classList.add(`span-${index + 1}`);
                });
            }
        });
    }
     // Function to wrap text and price pairs in containers
    function wrapTextPricePairs() {
        const summaryElements = document.querySelectorAll('.offer-summary .span5');

        summaryElements.forEach(element => {
            // Create a document fragment to hold the new structure
            const fragment = document.createDocumentFragment();
            let currentContainer = null;

            // Process each node in the element
            Array.from(element.childNodes).forEach(node => {
                // If it's a text node with non-whitespace content or a price element
                if ((node.nodeType === Node.TEXT_NODE && node.textContent.trim()) ||
                    (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'price')) {

                    // If we find a text node, start a new container
                    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                        currentContainer = document.createElement('div');
                        currentContainer.classList.add('price-pair');
                        fragment.appendChild(currentContainer);
                    }

                    // If we have a container, add the node to it
                    if (currentContainer) {
                        currentContainer.appendChild(node.cloneNode(true));
                    }
                }
            });

            // Clear the original element and append the new structure
            element.textContent = '';
            element.appendChild(fragment);
        });
    }
    // Function to remove commas between spans
    function removeCommasBetweenSpans() {
        const parameterElements = document.querySelectorAll('.parametersWrap .ng-binding');
        parameterElements.forEach(element => {
            const walker = document.createTreeWalker(
                element,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );

            const textNodesToRemove = [];
            while (walker.nextNode()) {
                const textNode = walker.currentNode;
                if (textNode.textContent.trim() === ',') {
                    textNodesToRemove.push(textNode);
                }
            }

            textNodesToRemove.forEach(node => node.remove());
        });
    }

    // Add override styles
    const styleElement = document.createElement('style');
    styleElement.innerHTML = overrideStyles;
    document.head.appendChild(styleElement);

    // Add custom CSS file
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.type = 'text/css';
    linkElement.href = 'https://srv32878.seohost.com.pl/bodruk-css/karta_technologiczna/handel.css';
    document.head.appendChild(linkElement);

    // Add custom JS file
    const scriptElement = document.createElement('script');
    scriptElement.src = 'https://srv32878.seohost.com.pl/bodruk-css/magazyn-bodruk/magazyn.js';
    scriptElement.type = 'text/javascript';
    document.head.appendChild(scriptElement);

    // Check if we're on the administration page and initialize custom functions
    if (window.location.href.includes('/administracja')) {
        console.log('Loading Magazyn 3.0 custom functionality for administration page');
        // The external script will handle the filtering functionality
    }

    // Execute when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            addNumberedSpanClasses();
            removeCommasBetweenSpans();
        });
    } else {
        addNumberedSpanClasses();
        removeCommasBetweenSpans();
    }

    // Add MutationObserver to handle dynamically added elements
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                addNumberedSpanClasses();
                removeCommasBetweenSpans();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();