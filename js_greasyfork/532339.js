// ==UserScript==
// @name         Amazon Font Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Update Amazon fonts to use Poppins globally with Proxima Nova for product titles, no hover effect
// @author       Your Name
// @match        https://www.amazon.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/532339/Amazon%20Font%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/532339/Amazon%20Font%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Pre-load Poppins font by creating a link element
    const linkPoppins = document.createElement('link');
    linkPoppins.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap';
    linkPoppins.rel = 'stylesheet';
    document.head.appendChild(linkPoppins);

    // Apply crucial CSS inline immediately
    const customCSS = `
        /* Set Poppins as the global font */
        body, * {
            font-family: 'Poppins', sans-serif;
        }

        /* Define styling for product titles */
        #productTitle,
        .a-size-large.product-title-word-break {
            font-family: 'Amazon Ember', sans-serif;
            -webkit-text-size-adjust: 100%;
            color: #0f1111;
            font-weight: 600;
            box-sizing: border-box;
            font-size: 20px;
            line-height: 28px;
            text-rendering: optimizeLegibility;
            word-break: break-word;
            margin-bottom: 10px;
            font-stretch: expanded;
        }

        @media (min-width: 768px) {
            #productTitle,
            .a-size-large.product-title-word-break {
                font-size: 24px;
                line-height: 32px;
            }
        }
    `;

    // Create and immediately append a style element with the CSS to the head
    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.appendChild(document.createTextNode(customCSS));
    document.head.appendChild(styleElement);
})();

// @match        *://*.amazon.com/*
// @match        *://*.amazon.co.uk/*
// @match        *://*.amazon.ca/*
// @match        *://*.amazon.de/*