// ==UserScript==
// @name         ChatGPT Codeblock Word Wrap
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Applies custom CSS to fix word wrapping on ChatGPT
// @author       r00tz
// @match        https://chatgpt.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542055/ChatGPT%20Codeblock%20Word%20Wrap.user.js
// @updateURL https://update.greasyfork.org/scripts/542055/ChatGPT%20Codeblock%20Word%20Wrap.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the CSS rules you want to apply
    const css = `
        .ͼ1 .cm-content[contenteditable=true] {
            -webkit-user-modify: read-write-plaintext-only;
        }
        .ͼ1 .cm-content {
            margin: -3px;
            flex-grow: 2;
            flex-shrink: 1; /* Changed from 0 to 1 to allow shrinking */
            min-width: 0;   /* Added to allow flex item to shrink below content size */
            display: block;
            white-space: pre-wrap; /* Allows wrapping while preserving whitespace */
            word-wrap: break-word; /* Ensures long words break to prevent overflow */
            overflow-wrap: break-word; /* Ensures long words break to prevent overflow */
            box-sizing: border-box;
            min-height: 100%;
            padding: 4px 0;
            outline: none;
        }
        .ͼ1 .cm-lineWrapping {
            white-space: pre-wrap;
            white-space: break-spaces;
            word-break: break-word;
            overflow-wrap: anywhere;
            flex-shrink: 1;
        }
        .ͼ2 .cm-content {
            caret-color: black;
        }
        .ͼ3 .cm-content {
            caret-color: white;
        }
        .ͼ1 .cm-line {
            display: block;
            padding: 0 2px 0 6px;
        }
    `;

    try {
        // Create a Blob from the CSS string (method to circumvent site protection) 
        const blob = new Blob([css], { type: 'text/css' });

        // Create a URL for the Blob
        const blobUrl = URL.createObjectURL(blob);

        // Create a link element for the stylesheet
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = blobUrl;

        // Append the link element to the document's head
        document.head.appendChild(link);

        // Revoke the object URL after a short delay to clean up memory
        setTimeout(() => URL.revokeObjectURL(blobUrl), 100);

        console.log('Violentmonkey script: CSS for word-wrap applied via Blob.');
    } catch (e) {
        console.error('Violentmonkey script: Failed to apply CSS.', e);
    }

})();
