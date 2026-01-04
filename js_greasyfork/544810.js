// ==UserScript==
// @name        Ozon.ru Barcode
// @namespace   Violentmonkey Scripts
// @match       https://www.ozon.ru/my/orderlist*
// @grant       none
// @version     1.0
// @author      szq2
// @run-at      document-end
// @description Show retrieval barcode on ozon.ru orders list on desktop site
// @license     0BSD
// @downloadURL https://update.greasyfork.org/scripts/544810/Ozonru%20Barcode.user.js
// @updateURL https://update.greasyfork.org/scripts/544810/Ozonru%20Barcode.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Function to find the code pattern and extract the actual code
    function findAndProcessCodes() {
        const codeRegex = /([\d\s*]+\d+)\s*—\s*код для получения в пунктах выдачи и постаматах Ozon/g;

        // Function to process text nodes
        function processTextNode(textNode) {
            const text = textNode.nodeValue;
            let match = codeRegex.exec(text);

            if (match) {
                // Extract the code from the matched text
                let code = match[1].replace(/\s+/g, '');

                // Create barcode image URL
                const imageUrl = `https://www.ozon.ru/api/my-account-api-gateway.bx/codes/v1/generate?code=${code}&height=208&type=bar&width=580`;

                // Create image element
                const img = document.createElement('img');
                img.src = imageUrl;
                img.style.display = 'block';
                img.style.marginTop = '10px';
                img.style.marginBottom = '10px';
                img.style.maxWidth = '100%';
                img.alt = `Barcode for ${code}`;

                // Insert the image after the text node
                const span = document.createElement('span');
                if(textNode == textNode.parentNode.lastChild)
                  textNode.parentNode.appendChild(span);
                else
                  textNode.parentNode.replaceChild(span, textNode.parentNode.lastChild);
                span.appendChild(img);
            }
        }

        // Walk through all text nodes in the document
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let node;
        while (node = walker.nextNode()) {
            processTextNode(node);
        }
    }

    window.addEventListener('load', findAndProcessCodes);

    // Set up a mutation observer to handle dynamically loaded content
    const observer = new MutationObserver(function(mutations) {
        findAndProcessCodes();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: false
    });
})();
