// ==UserScript==
// @name         Magic Markdown Copy (Ctrl+C & Button)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Automatically converts Markdown to rich HTML on copy, both from user selection (Ctrl+C) and from website "Copy" buttons.
// @author       Tertium
// @match        *://*/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/marked/5.1.2/marked.min.js
// @grant        GM_notification
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541023/Magic%20Markdown%20Copy%20%28Ctrl%2BC%20%20Button%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541023/Magic%20Markdown%20Copy%20%28Ctrl%2BC%20%20Button%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const SMART_DETECTION = true; // Set to false to attempt conversion on ALL copied text.
    const MD_CHARS = /[\*\_#\`\[\]\->\!]/; // Regex to detect Markdown characters

    /**
     * The core conversion function. Takes Markdown text and writes rich HTML to the clipboard.
     * @param {string} markdownText - The text to convert.
     * @returns {Promise<void>}
     */
    async function convertAndCopyToClipboard(markdownText) {
        console.log('Attempting to convert Markdown:', markdownText.substring(0, 80) + '...');
        try {
            // Convert the Markdown to HTML using the 'marked' library
            const generatedHtml = marked.parse(markdownText, { gfm: true, breaks: true });

            // Create a rich text clipboard item that has both HTML and plain text fallbacks
            const blobHtml = new Blob([generatedHtml], { type: 'text/html' });
            const blobText = new Blob([markdownText], { type: 'text/plain' });
            const clipboardItem = new ClipboardItem({
                'text/html': blobHtml,
                'text/plain': blobText,
            });

            // Write the new rich text content to the clipboard
            await navigator.clipboard.write([clipboardItem]);
            console.log('Markdown successfully converted and copied as rich text.');
            GM_notification({
                text: 'Converted to HTML and copied!',
                title: 'Markdown Magic Copy',
                timeout: 2000
            });
        } catch (err) {
            console.error('Failed to convert or copy:', err);
            GM_notification({
                text: 'Error during conversion.',
                title: 'Markdown Magic Copy',
                timeout: 4000
            });
        }
    }


    // --- FEATURE 1: Intercept User Selection (Ctrl+C) ---
    document.addEventListener('copy', (event) => {
        const selectedText = window.getSelection().toString();
        if (selectedText.trim().length === 0) return;

        // If smart detection is on, only proceed if text looks like Markdown
        if (SMART_DETECTION && !MD_CHARS.test(selectedText)) {
            console.log('No Markdown characters in selection. Performing normal copy.');
            return;
        }

        // Prevent the default copy action and run our conversion
        event.preventDefault();
        convertAndCopyToClipboard(selectedText);
    });


    // --- FEATURE 2: Intercept Website "Copy" Buttons ---
    // We "monkey-patch" the clipboard API to intercept programmatic copies.
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        const originalWriteText = navigator.clipboard.writeText;

        navigator.clipboard.writeText = async function(textToCopy) {
            // If smart detection is on, check if the text looks like Markdown
            if (SMART_DETECTION && (typeof textToCopy !== 'string' || !MD_CHARS.test(textToCopy))) {
                // If not, use the original, unmodified function
                return originalWriteText.apply(this, arguments);
            }

            // If it looks like Markdown, run our custom conversion function instead!
            // We don't need to prevent a default action here because we are replacing the function.
            try {
                await convertAndCopyToClipboard(textToCopy);
            } catch (err) {
                // If our function fails for any reason, fall back to the original to avoid breaking the site.
                console.error("Conversion failed, falling back to original copy function.", err);
                return originalWriteText.apply(this, arguments);
            }
        };
        console.log('Magic Markdown Copy: Intercepting copy buttons.');
    }

    console.log('Magic Markdown Copy script is fully active.');

})();