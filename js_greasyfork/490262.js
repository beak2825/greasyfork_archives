// ==UserScript==
// @name         Copy Page as Markdown
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Convert and copy the page content as Markdown to clipboard, excluding scripts and styles.
// @author       You
// @match        *://*/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/npm/turndown@5.0.3/dist/turndown.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490262/Copy%20Page%20as%20Markdown.user.js
// @updateURL https://update.greasyfork.org/scripts/490262/Copy%20Page%20as%20Markdown.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Remove <script> and <style> elements from the document
    function removeScriptsAndStyles(doc) {
        const elementsToRemove = doc.querySelectorAll('script, style');
        elementsToRemove.forEach(element => element.parentNode.removeChild(element));
        return doc;
    }

    // Create a deep clone of the document body to work with, to preserve the original page content
    let clonedBody = document.body.cloneNode(true);
    clonedBody = removeScriptsAndStyles(clonedBody);

    // Initialize Turndown service with the cloned body that excludes scripts and styles
    var turndownService = new TurndownService();
    var markdown = turndownService.turndown(clonedBody.innerHTML);

    // Function to copy text to clipboard (might need permissions depending on the userscript manager)
    function copyTextToClipboard(text) {
        GM_setClipboard(text, 'text'); // Copy Markdown to clipboard
    }

    // Add a button to trigger the conversion and copying
    var button = document.createElement('button');
    button.textContent = 'Copy as Markdown';
    button.style.position = 'fixed';
    button.style.top = '20px';
    button.style.right = '20px';
    button.style.zIndex = 10000;
    document.body.appendChild(button);

    button.addEventListener('click', function() {
        copyTextToClipboard(markdown);
    });
})();
