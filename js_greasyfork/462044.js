// ==UserScript==
// @name         URL Linkify
// @namespace    http://tampermonkey/url-linkify
// @version      1.1
// @description  Replace URLs in text with clickable links
// @author       Hoopengo
// @match        https://www.google.com/sorry/index*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @license      Apache 2.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462044/URL%20Linkify.user.js
// @updateURL https://update.greasyfork.org/scripts/462044/URL%20Linkify.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const urlRegex = /URL:\s*(\S+)/g; // regex to match "URL: ..." strings
    const textNodes = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);

    while (textNodes.nextNode()) {
        const textNode = textNodes.currentNode;

        if (textNode.nodeType === Node.TEXT_NODE && textNode.textContent.match(urlRegex)) {
            const urlMatches = textNode.textContent.match(urlRegex);

            for (let i = 0; i < urlMatches.length; i++) {
                const url = urlMatches[i].replace('URL:', '').trim();
                const link = document.createElement('a');
                link.href = url;
                link.textContent = url;

                // replace the URL text with the link element
                const replacementNode = textNode.splitText(textNode.textContent.indexOf(urlMatches[i]));
                replacementNode.replaceWith(link);
            }
        }
    }
})();